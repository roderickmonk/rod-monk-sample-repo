/// <reference path="node.d.ts" />

"use strict";

var mongoose = require("mongoose");
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jwt-simple');
var Track = require('../server-src/ttcTrack');
var moment = require('moment');
var _ = require('lodash');
var assert = require('assert');

var db = mongoose.connect('mongodb://127.0.0.1:27017/test');

// Setup the Mongoose models
var MemberSchema = new mongoose.Schema({
	emailaddress: {
		type: String,
		lowercase: true
	},
	password: String,
	firstname: String,
	low_firstname: {
		type: String,
		lowercase: true
	},
	familyname: String,
	low_familyname: {
		type: String,
		lowercase: true
	},
	student: Boolean,
	familyemailaddress: {
		type: String,
		lowercase: true
	},
	dob: String,
	address: String,
	place: String,
	postcode: String,
	primaryphone: String,
	alternativephone: String,
	liabilityagreed: Boolean,
	communicationsagreed: Boolean,
	photoagreed: Boolean,
	paid: Boolean,
	joiningyear: Number,
	exec: {
		type: String,
		lowercase: true
	},
	volunteer_maintenance: Boolean,
	volunteer_bookkeeping: Boolean,
	volunteer_gardening: Boolean,
	volunteer_archivist: Boolean,
	volunteer_organizeclubsocial: Boolean,
	volunteer_supportsocialevents: Boolean,
	volunteer_phonecommittee: Boolean,
	volunteer_webprogramming: Boolean,
	volunteer_teamcaptain: Boolean,
	volunteer_membershipdrives: Boolean,
	volunteer_mediacoordinator: Boolean,
	volunteer_supportplayerimprovementjunior: Boolean,
	volunteer_supportplayerimprovementadult: Boolean,
	exec_president: Boolean,
	exec_vicepresident: Boolean,
	exec_secretary: Boolean,
	exec_treasurer: Boolean,
	exec_maintenance: Boolean,
	exec_socialdirector: Boolean,
	exec_membershipdirector: Boolean,
	exec_mensleague: Boolean,
	exec_womensleague: Boolean,
	exec_juniorprogramcoordinator: Boolean,
	exec_webmaster: Boolean,
	exec_newsletter: Boolean,
	exec_tournamentdirector: Boolean
});
var Member = mongoose.model('members', MemberSchema);

var NewsItemSchema = new mongoose.Schema({
	headline: String,
	body: String,
	uploadTimestamp: Date
});
var NewsItem = mongoose.model('newsitem', NewsItemSchema);

var DeviceTrackingSchema = new mongoose.Schema({
	memberid: String,
	device: String,
	lastUsed: Date
});
var DeviceTracking = mongoose.model('devicetracking', DeviceTrackingSchema);

// Constants
var MONGOOSE_UPDATE_OPTIONS = {
	multi: false,
	upsert: false,
	new: true
};

function recordDevice(memberid, device) {
	return new Promise(function (resolve, reject) {
		DeviceTracking.findOneAndUpdate({
			memberid: memberid,
			device: device
		}, {
			lastUsed: moment()
		}, function (err, updated_record) {
			if (err) {
				console.log('err: ', err);
				reject(err);
			} else {
				// If updated_record is null, then we have to create a new record
				if (updated_record)
					resolve(null);
				else {
					console.log('Creating a new record: ' + memberid + ' / ' + device);
					var tracking_device = {
						memberid: memberid,
						device: device,
						lastUsed: moment()
					};
					DeviceTracking(tracking_device).save(function (err) {
						console.log('new record err: ' + err);
						err ? reject(err) : resolve(null)
					});
				}
			}
		});
	});
}

function saveNewsItem(newsitem) {

	return new Promise(function (resolve, reject) {

		// Record the data when this save was done
		newsitem.uploadTimestamp = moment();

		NewsItem(newsitem).save(function (err) {
			err ? reject(err) : resolve(newsitem);
		});
	});
}

function getNewsItems() {
	return new Promise(function (resolve, reject) {

		NewsItem.find(function (err, NewsItems) {
			err ? reject(err) : resolve(NewsItems);
		});
	});
}

function removeNewsItem(newsitemid) {

	return new Promise(function (resolve, reject) {

		NewsItem.findOneAndRemove({
			_id: newsitemid
		}, function (err) {
			err ? reject(err) : resolve(newsitemid);
		});
	});
}

function countMembers() {
	return new Promise(function (resolve, reject) {

		Member.find(function (err, members) {
			if (err)
				reject(err);
			else
				resolve(members.length);
		});
	});
}

function countMembersByDecade() {
	return new Promise(function (resolve, reject) {

		Member.find(function (err, members) {
			if (err)
				reject(err);
			else {
				var Now = moment();
				var Decades = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
				for (var i = 0; i < members.length; ++i)
					Decades[Math.floor(Now.diff(moment(members[i].dob, ['MM-DD-YYYY', 'YYYY-MM-DD']), 'years') / 10)] += 1;
				resolve(Decades);
			}
		});
	});
}

function countMembersByBirthMonth() {
	return new Promise(function (resolve, reject) {

		Member.find(function (err, members) {
			if (err)
				reject(err);
			else {
				var BirthMonths = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
				for (var i = 0; i < members.length; ++i)
					++BirthMonths[moment(members[i].dob, ['MM-DD-YYYY', 'YYYY-MM-DD']).get('month')];
				resolve(BirthMonths);
			}
		});
	});
}

function getMembers() {

	return new Promise(function (resolve, reject) {
		Member.find(function (err, members) {
			err ? reject(err) : resolve(members);
		});
	});
}

function getAllEmailAddresses() {

	return new Promise(function (resolve, reject) {
		Member.find(function (err, members) {
			if (err)
				reject(err);
			else {
				var emailaddresses = [];
				for (var i = 0; i < members.length; ++i)
					emailaddresses.push(members[i].emailaddress);
				resolve(emailaddresses);
			}
		});
	});
}

function findMember(_id) {
	return new Promise(function (resolve, reject) {
		Member.find({
			_id: _id
		}, function (err, members) {
			err ? reject(err) : resolve(members[0]);
		});
	});
}

// Make persistant changes to a member's information
function persistMemberChange(member) {

	console.log('persistMemberChange member: ', member);
	return new Promise(function (resolve, reject) {

		// Deal with the low case MongoDB issue.
		if (member.firstname)
			member.low_firstname = member.firstname.toLowerCase();
		if (member.familyname)
			member.low_familyname = member.familyname.toLowerCase();

		if (member.dob)
			member.dob = member.dob.slice(0, 10);

		Member.findByIdAndUpdate(
			member._id,
			member,
			MONGOOSE_UPDATE_OPTIONS,
			function (err) {
				err ? reject(err) : resolve()
			}
		);
	});
}

function loginMember(member) {
	
	console.log('loginMember member: ', member);
	
	return new Promise(function (resolve, reject) {

		Member.find({
			low_firstname: member.firstname.toLowerCase (),
			emailaddress: member.emailaddress
		}, function (err, members) {
			if (!err) {
				// email addresses are often shared, hence the following
				for (var i = 0; i < members.length; ++i) {
					// Comparison must be done against a proper encrypted password
					if (members[i].password && members[i].password.length == 60 && bcrypt.compareSync(member.password, members[i].password)) {
						resolve(members[i]);
						return;
					}
				}
			}
			reject('Login Unsuccessful: Unknown (First Name / Email Address / Password)');
		});
	});
}

function signupMember(member) {

	console.log('signupMember member: ', member);

	return new Promise(function (resolve, reject) {

		// Look for a member whose details match all of the following
		Member.find({
				low_firstname: member.firstname.toLowerCase(),
				low_familyname: member.familyname.toLowerCase(),
				emailaddress: member.emailaddress.toLowerCase(),
				postcode: member.postcode,
				dob: member.dob.slice(0, 10)
			},
			function (err, members) {
				if (err)
					reject(err);
				else {
					if (members.length == 1) {
						// Record the encrypted form of the password to the database
						var signup_member = {};
						signup_member._id = members[0]._id;
						signup_member.password = bcrypt.hashSync(member.password);
						persistMemberChange(signup_member)
							.then(function () {
								resolve(signup_member)
							})
							.catch(function (err) {
								reject(err)
							});
					} else (members.length > 1) ? reject('Signup is ambiguous') : reject('Signup Unsuccessful');
				}
			}
		);
	});
}

// Assure a member's credentials
function authorizeMember(_id) {

	assert(!!_id, '_id not defined');

	return new Promise(function (resolve, reject) {

		Member.find(_id, function (err, members) {
			if (err)
				reject(err);
			else if (members.length == 0)
				reject('Member _id unknown');
			else
				resolve(null);
		});
	});
}

// Before accepting a new member application, ensure that the person is not already known.
function duplicateCheck(member) {
	return new Promise(function (resolve, reject) {

		// Deal with the low case MongoDB issue.
		if (member.firstname)
			member.low_firstname = member.firstname.toLowerCase();
		if (member.familyname)
			member.low_familyname = member.familyname.toLowerCase();

		Member.find({
				emailaddress: member.emailaddress,
				postcode: member.postcode,
				low_firstname: member.low_firstname,
				low_familyname: member.low_familyname
			},
			function (err, members) {
				if (err)
					reject(err);
				else if (members.length) {
					console.log('Duplicate Detected: ', member.emailaddress);
					reject('Our records show that you have already applied or that you are already a member.  ' +
						'If you are already a member, please Login and renew your membership.  ' +
						'Please contact the TTC webmaster if you cannot resolve the problem.');
				} else
					resolve(null);
			});
	});
}

function saveNewApplicant(member) {

	member.dob = member.dob.slice(0, 10);

	// Deal with the low case MongoDB issue.
	if (member.firstname)
		member.low_firstname = member.firstname.toLowerCase();
	if (member.familyname)
		member.low_familyname = member.familyname.toLowerCase();

	return new Promise(function (resolve, reject) {

		member.paid = false;
		Member(member).save(function (err, returned_member) {
			err ? reject(err) : resolve(null)
		});
	});
}

// The following function is not normally run, but is available to ensure a fresh data import
// has been normalized for the needs of the application.
function cleanDatabase() {
	// Get the member list
	Member.find(
		function (err, members) {
			if (err) {
				console.log('Cannot get the members');
				return;
			} else {
				for (var i = 0; i < members.length; ++i) {
					{
						// Ensure clean DoBs
						members[i].dob = moment(members[i].dob, ['MM-DD-YYYY', 'YYYY-MM-DD']).format('YYYY-MM-DD');
						// emails are all lowercase
						members[i].emailaddress = members[i].emailaddress.toLowerCase();
						// Canadian postal codes are normalized
						members[i].postcode = members[i].postcode.replace(' ', '');

						Member.findByIdAndUpdate(
							members[i]._id,
							members[i],
							MONGOOSE_UPDATE_OPTIONS,
							function (err, returned_member) {
								if (err) {
									console.log('Aborting updating of database');
									// exit(0);
								} else {
									console.log('returned_member:\n', JSON.stringify(returned_member, null, 4));
								}
							}
						);
					}
				}
			}
		}
	);
}

module.exports = {
	recordDevice: recordDevice,
	saveNewsItem: saveNewsItem,
	getNewsItems: getNewsItems,
	removeNewsItem: removeNewsItem,
	countMembers: countMembers,
	countMembersByDecade: countMembersByDecade,
	countMembersByBirthMonth: countMembersByBirthMonth,
	getMembers: getMembers,
	getAllEmailAddresses: getAllEmailAddresses,
	findMember: findMember,
	persistMemberChange: persistMemberChange,
	loginMember: loginMember,
	signupMember: signupMember,
	authorizeMember: authorizeMember,
	duplicateCheck: duplicateCheck,
	saveNewApplicant: saveNewApplicant,
	cleanDatabase: cleanDatabase
}