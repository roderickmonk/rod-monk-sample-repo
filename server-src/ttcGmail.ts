/// <reference path="node.d.ts" />

"use strict";

var fs 								= require ("fs");
var google 							= require ('googleapis');
var googleAuth 						= require ('google-auth-library');
var async 							= require ('async');
var cache 							= require ('memory-cache');
var assert							= require ('assert');
var _								= require ('lodash');
var moment							= require ('moment');
var Track 							= require ('../server-src/ttcTrack');

// Get the OAuth2 client
exports.authorizeGmailAccess = function () {
	
	return new Promise (function (resolve, reject) {
	
		fs.readFile ('/server-src/client_secret.json', function (err, content) {
			if (err)
				reject (err);
			else {
				var credentials 	= JSON.parse (content);
				var clientSecret 	= credentials.installed.client_secret;
				var clientId 		= credentials.installed.client_id;
				var redirectUrl 	= credentials.installed.redirect_uris[0];
				var auth 			= new googleAuth();
				var oauth2Client 	= new auth.OAuth2 (clientId, clientSecret, redirectUrl);

				// Get the gmail api token
				fs.readFile('/app/server-src/gmail-api.json', function (err, token) {
					if (err)
						reject (err)
					else {
						oauth2Client.credentials = JSON.parse(token);
						resolve (oauth2Client);
					}
				});
			}
		});
	});
}

// Accumulate eBlasts
function recordEmail (eBlasts, email_date, email_subject, email_snippet, email_body)
{
	eBlasts.push({
		date: 		email_date,
		subject: 	email_subject,
		snippet: 	email_snippet,
		// Convert from Base64
		body: atob(email_body).replace(/Â/g, " ")
	});
}

exports.geteBlasts = function (auth) {	
	
	return new Promise (function (resolve, reject) {
	
		var gmail = google.gmail('v1');

		// Get the most recent 'n' eBlasts from Google gmail
		var eBlastsCount = 20;

		// The Google API gives you a list of gmail IDs (with no details) and
		// then you get the details using gmail.users.messages.get
		gmail.users.messages.list({
				auth: auth,
				userId: 'me',
				maxResults: eBlastsCount,
				q: 'from:tsawwassentennisclub@gmail.com and to:tsawwassentennisclub@gmail.com'
			},
			function (err, list_response) {
				if (err)
					reject (err);
				else {
					var eBlasts = [];

					async.each
						(
							list_response.messages,
							function (email, callback) {
								gmail.users.messages.get({auth: auth, userId: 'me', id: email.id, format: 'full'},
									function (err, api_response) {
										if (err)
											callback ('gmail.users.messages.get returned error: ' + err);
										else {
											// Isolate the email Date and Subject
											var email_date;
											var email_subject;

											for (var k = 0; k < api_response.payload.headers.length; ++k) {
												if (api_response.payload.headers[k].name == 'Date') {
													email_date = moment (new Date (api_response.payload.headers[k].value)).format('YYYY-MM-DD');
												}
												if (api_response.payload.headers[k].name == 'Subject') {
													email_subject = api_response.payload.headers[k].value;
												}
											}

											// Search for the first body that has something readable, but prefer HTML
											var body_found = false;
											var mimeTypes = ["text/html", "text/plain"];
											find_body: {
												// First check the 'payload body'
												for (var m in mimeTypes) {
													if (api_response.payload.body.data && api_response.payload.mimeType == mimeTypes[m]) {
														body_found = true;
														recordEmail (eBlasts, email_date, email_subject, api_response.snippet, api_response.payload.body.data);
														break find_body;
													}
													// Next check the 'parts'
													if (api_response.payload.parts) {
														for (var j = 0; j < api_response.payload.parts.length; ++j) {
															if (api_response.payload.parts[j].body.data && api_response.payload.parts[j].mimeType == mimeTypes[m]) {
																body_found = true;
																recordEmail (eBlasts, email_date, email_subject, api_response.snippet, api_response.payload.parts[j].body.data);
																break find_body;
															}

															// Now check 'parts of parts'
															if (api_response.payload.parts[j].parts) {
																for (var k = 0; k < api_response.payload.parts[j].parts.length; ++k) {
																	if (api_response.payload.parts[j].parts[k].body.data && api_response.payload.parts[j].parts[k].mimeType == mimeTypes[m]) {
																		body_found = true;
																		recordEmail (eBlasts, email_date, email_subject, api_response.snippet, api_response.payload.parts[j].parts[k].body.data);
																		break find_body;
																	}
																}
															}
														}
													}
												}
											}
											if (body_found)
												callback (null);
											else {
												let err = 'No text body found for eBlast id: ' + api_response.id;
												Track.Warning (err);
												callback (err);
											}
										}
									}
								)
							},
							// Now the 'final' async callback
							function (err) {
								if (err)
									console.log ('Final error message: ', err);

								// Error or no error, send what we have
								console.log('Number of eBlasts: ', eBlasts.length);

								// Load the cache, but allow it to be occasionally refreshed
								cache.put('eBlasts', JSON.stringify(eBlasts), (86400 / 24) * 1000);

								resolve (eBlasts);
							}
						)
				}
			}
		)
	});
}
