/// <reference path="node.d.ts" />
/// <reference path="es6-promise.d.ts" />

"use strict";
var http = require("http");
var util = require('util');
var url = require("url");
var path = require("path");
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jwt-simple');
var formidable = require('formidable');
var fs = require('fs-extra');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var cache = require('memory-cache');
var ObjectID = require('mongodb').ObjectID;
var moment = require('moment');
var _ = require('lodash');
var assert = require('assert');
var ttcDB = require('../server-src/ttcDB');
var ttcGmail = require('../server-src/ttcGmail');
var Track = require('../server-src/ttcTrack');
var GridFS = require('../server-src/ttcGridFS');
var MailChimp = require('../server-src/ttcMailChimp');
var secretJwtKey = 'nessawwast';
// Constants
var HTTP_BadRequest = 400;
var HTTP_Unauthorized = 401;
var HTTP_PaymentRequired = 402;
var HTTP_NotFound = 404;
var HTTP_Conflict = 409;
var HTTP_ServerError = 500;
var ALERT_GREETING = '\n\nPlease contact the TTC WebMaster.';

function httpError(status, err, http_response) {
    var error_message = undefined;
    // Verify the validity of 'err'
    if (_.isString(err))
        error_message = err;
    else if (_.isError(err))
        error_message = err.stack;
    else
        assert(!!error_message, 'err is neither a string nor an Error object');
    console.log('httpError: ' + error_message);
    Track.Warning(error_message);
    assert(_.isNumber(status), 'status not a number');
    assert(_.isObject(http_response), 'http_response not an object');
    http_response.writeHead(status, { "Content-Type": "text/plain" });
    http_response.end(error_message);
}
function httpOk(http_response) {
    http_response.writeHead(200);
    http_response.end();
}
// The following pulls in whatever JSON object is being sent to us
// (currently no 'maximum length' protection)
function readRequestJSON(request) {
    return new Promise(function (resolve, reject) {
        var json = "";
        request.on('readable', function () {
            var chunk = request.read();
            if (chunk)
                json += chunk;
        });
        request.on('end', function () {
            resolve(JSON.parse(json));
        });
    });
}
function readRequest(request) {
    return new Promise(function (resolve, reject) {
        var data = "";
        request.on('readable', function () {
            var chunk = request.read();
            if (chunk)
                data += chunk;
        });
        request.on('end', function () {
            resolve(data);
        });
    });
}

var express = require('express');
var app = express();

app.post('/api/getmembers', function (request, response) {
    var member_id = jwt.decode(request.headers['x-auth'], secretJwtKey)._id;
	console.log ('getmembers');
    ttcDB.authorizeMember(member_id)
        .then(ttcDB.getMembers)
        .then(function (members) { ttcDB.recordDevice(member_id, request.headers['device']); response.json(members); })
        .catch(function (err) { httpError(HTTP_ServerError, err, response); });
});

app.post('/api/get-all-email-addresses', function (request, response) {
    var member_id = jwt.decode(request.headers['x-auth'], secretJwtKey)._id;
    ttcDB.authorizeMember(member_id)
        .then(ttcDB.getAllEmailAddresses)
        .then(function (emailaddresses) { ttcDB.recordDevice(member_id, request.headers['device']); response.json(emailaddresses); })
        .catch(function (err) { httpError(HTTP_ServerError, err, response); });
});

app.post('/api/signup', function (request, response) {
    readRequestJSON(request)
        .then(ttcDB.signupMember)
        .then(function (member: { _id: string, exec: string }) { response.json({ jwt: jwt.encode({ _id: member._id }, secretJwtKey), exec: member.exec }); })
        .catch(function (err) { httpError(HTTP_ServerError, err, response); });
});

app.post('/api/login', function (request, response) {
    readRequestJSON(request)
        .then(ttcDB.loginMember)
        .then(function (member: { _id: string, joiningyear: number, paid: boolean, exec: string }) {
            // Yes a member, but are they paid up?
            if (!member.joiningyear && !member.paid && moment('2016-05-01').isBefore(moment())) {
                console.log('/api/login, member:\n', member);
                httpError(HTTP_PaymentRequired, 'Payment Required to Complete Login', response);
            }
            else if (member.joiningyear == 2016 && !member.paid) {
                httpError(HTTP_PaymentRequired, 'Payment Required to Complete Login', response);
            }
            else {
                response.json({ jwt: jwt.encode({ _id: member._id }, secretJwtKey), exec: member.exec });
            }
        })
        .catch(function (err) { httpError(HTTP_ServerError, err, response); });
});

app.post('/api/findmember', function (request, response) {
    var member_id = jwt.decode(request.headers['x-auth'], secretJwtKey)._id;
    ttcDB.findMember(member_id)
        .then(function (member) { console.log('findMember:\n', member); ttcDB.recordDevice(member_id, request.headers['device']); response.json(member); })
        .catch(function (err) { httpError(HTTP_ServerError, err, response); });
});

app.post('/api/save-personal-info', function (request, response) {
    var member_id = jwt.decode(request.headers['x-auth'], secretJwtKey)._id;
    readRequestJSON(request)
        .then(ttcDB.persistMemberChange)
        .then(function () { ttcDB.recordDevice(member_id, request.headers['device']); httpOk(response); })
        .catch(function (err) { httpError(HTTP_ServerError, err, response); });
});

app.post('/api/save-member-details', function (request, response) {
    var member_id = jwt.decode(request.headers['x-auth'], secretJwtKey)._id;
    readRequestJSON(request)
        .then(ttcDB.persistMemberChange)
        .then(function () { ttcDB.recordDevice(member_id, request.headers['device']); httpOk(response); })
        .catch(function (err) { httpError(HTTP_ServerError, err, response); });
});

app.post('/api/renew-membership', function (request, response) {
    var member_id = jwt.decode(request.headers['x-auth'], secretJwtKey)._id;
    readRequestJSON(request)
        .then(ttcDB.persistMemberChange)
        .then(function () { ttcDB.recordDevice(member_id, request.headers['device']); httpOk(response); })
        .catch(function (err) { httpError(HTTP_ServerError, err, response); });
});

app.post('/api/new-membership', function (request, response) {
    readRequestJSON(request)
        .then(function (member: { password: string }) {
            ttcDB.duplicateCheck(member)
                .then(function () {
                    // Before saving, encrypt the password
                    member.password = bcrypt.hashSync(member.password);
                    ttcDB.saveNewApplicant(member)
                        .then(function () { httpOk(response); });
                })
                .catch(function (err) { httpError(HTTP_ServerError, err, response); });
        })
        .catch(function (err) { httpError(HTTP_ServerError, err, response); });
});

app.post('/api/change-password', function (request, response) {
    readRequestJSON(request)
        .then(function (member: { _id: string, password: string }) {
            member._id = jwt.decode(request.headers['x-auth'], secretJwtKey)._id;
            member.password = bcrypt.hashSync(member.password);
            ttcDB.persistMemberChange(member)
                .then(function () { ttcDB.recordDevice(member._id, request.headers['device']); httpOk(response); });
        })
        .catch(function (err) { httpError(HTTP_ServerError, err, response); });
});

app.post('/api/get-eblasts', function (request, response) {
    var member_id = jwt.decode(request.headers['x-auth'], secretJwtKey)._id;
    ttcDB.authorizeMember(member_id)
        .then(function () {
            ttcDB.recordDevice(member_id, request.headers['device']);
            // If cached eBlasts are available, then use them
            var cached_eBlasts = cache.get('eBlasts');
            if (cached_eBlasts)
                response.end(cached_eBlasts);
            else {
                // Get gmail access authorization and then get the eBlasts
                ttcGmail.authorizeGmailAccess()
                    .then(ttcGmail.geteBlasts)
                    .then(function (eBlasts) { response.json(eBlasts); })
                    .catch(function (err) { httpError(HTTP_ServerError, err, response); });
            }
        })
        .catch(function (err) { httpError(HTTP_ServerError, err, response); });
});

app.post('/api/document-upload', function (request, response) {
    var form = new formidable.IncomingForm();
    form.parse(request, function (err, fields, files) {
        console.log('inspect:\n', util.inspect({ fields: fields, files: files }));
        console.log('filename: ', files.file.name);
    });
    form.on('progress', function (bytesReceived, bytesExpected) {
        var percent_complete = (bytesReceived / bytesExpected) * 100;
        console.log(percent_complete.toFixed(2));
    });
    form.on('error', function (err) {
        err ? httpError(HTTP_ServerError, err, response) : httpOk(response);
    });
    form.on('end', function (fields, files) {
        /* Temporary location of our uploaded file */
        var temp_path = this.openedFiles[0].path;
        var file_name = this.openedFiles[0].name;
        GridFS.saveFileToDb(this.openedFiles[0].path, this.openedFiles[0].name, 'document', null)
            .then(function () { httpOk(response); })
            .catch(function (err) { httpError(HTTP_ServerError, err, response); });
    });
});

app.post('/api/document-get', function (request, response) {
    readRequestJSON(request)
        .then(GridFS.retrieveFileFromDb)
        .then(function () { httpOk(response); })
        .catch(function (err) { httpError(HTTP_ServerError, err, response); });
});

app.post('/api/document-list', function (request, response) {
    GridFS.retrieveAllDocuments()
        .then(function (Documents) { console.log('All Documents: ' + Documents); response.json(Documents); })
        .catch(function (err) { httpError(HTTP_ServerError, err, response); });
});

app.post('/api/document-remove', function (request, response) {
    readRequestJSON(request)
        .then(GridFS.removeFileFromDb)
        .then(GridFS.listDocumentFiles)
        .then(function (Documents) { response.json(Documents); })
        .catch(function (err) { httpError(HTTP_ServerError, err, response); });
});

app.post('/api/newsitem-get-new-object-id', function (request, response) {
    response.end(JSON.stringify(new ObjectID()));
});

app.post('/api/newsitem-image-upload', function (request, response) {
    var form = new formidable.IncomingForm();
    form.parse(request, function (err, fields, files) {
        console.log('inspect:\n', util.inspect({ fields: fields, files: files }));
        console.log('filename: ', files.file.name);
    });
    form.on('progress', function (bytesReceived, bytesExpected) {
        var percent_complete = (bytesReceived / bytesExpected) * 100;
        console.log(percent_complete.toFixed(2));
    });
    form.on('error', function (err) {
        console.error(err);
    });
    form.on('end', function (fields, files) {
        /* Temporary location of our uploaded file */
        var temp_path = this.openedFiles[0].path;
        var file_name = this.openedFiles[0].name;
        console.log("request.headers['newsitemid']: ", request.headers['newsitemid']);
        console.log("request.headers: ", JSON.stringify(request.headers, null, 4));
        GridFS.saveFileToDb(this.openedFiles[0].path, this.openedFiles[0].name, 'newsitem', request.headers['newsitemid'])
            .then(function () { httpOk(response); })
            .catch(function (err) { httpError(HTTP_ServerError, err, response); });
    });
});

app.post('/api/newsitem-list', function (request, response) {
    ttcDB.getNewsItems()
        .then(function (NewsItems) { response.json(NewsItems); })
        .catch(function (err) { httpError(HTTP_ServerError, err, response); });
});

app.post('/api/newsitem-getfiles', function (request, response) {
    readRequest(request)
        .then(GridFS.retrieveNewsItemFiles)
        .then(function (NewsItemFiles) { console.log('/api/newsitem-getfiles NewsItemFiles: ', NewsItemFiles); response.json(NewsItemFiles); })
        .catch(function (err) { httpError(HTTP_ServerError, err, response); });
});

app.post('/api/newsitem-remove', function (request, response) {
    readRequest(request)
        .then(ttcDB.removeNewsItem)
        .then(GridFS.removeNewsItemFiles)
        .then(function () { response.end(); })
        .catch(function (err) { httpError(HTTP_ServerError, err, response); });
});

app.post('/api/newsitem-publish', function (request, response) {
    readRequestJSON(request)
        .then(ttcDB.saveNewsItem)
        .then(function () { httpOk(response); })
        .catch(function (err) { httpError(HTTP_ServerError, err, response); });
});

app.post('/api/count-members', function (request, response) {
	console.log ('count members');
    ttcDB.countMembers()
        .then(function (MemberCount) { response.end(JSON.stringify(MemberCount)); })
        .catch(function (err) { httpError(HTTP_ServerError, err, response); });
});

app.get('/api/ok', function (request, response) {
    // A goofy API provided for testing purposes
    response.end();
});

//app.use('client-build', express.static(__dirname + '/../client-build'));
app.use(express.static(__dirname + '/../client-build'));

app.listen(8000);

Track.InfoOnly('TTC Server Started');
console.log('Started: ', process.env.PORT);
