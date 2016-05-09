/// <reference path="node.d.ts" />

"use strict";

var BugzScout 		= require ('bugzscout');
var assert 			= require ('assert');

var bugzscout_InfoOnly = new BugzScout ({
    user: 			"BugzScout",
    project: 		"ttcServer",
	area:			"InfoOnly",
    domain: 		"https://rodmonk.fogbugz.com",
    email: 			"",
    forceNewBug: 	false
});

var bugzscout_Warning = new BugzScout ({
    user: 			"BugzScout",
    project: 		"ttcServer",
	area:			"Warning",
    domain: 		"https://rodmonk.fogbugz.com",
    email: 			"",
    forceNewBug: 	true
});

var bugzscout_Alarm = new BugzScout ({
    user: 			"BugzScout",
    project: 		"ttcServer",
	area:			"Alarm",
    domain: 		"https://rodmonk.fogbugz.com",
    email: 			"",
    forceNewBug: 	true
});

exports.InfoOnly = function (description, extra)
{
	bugzscout_InfoOnly.submit ({description: description, extra: extra, defaultMessage: 'BugzScout InfoOnly'}, function (err, res) {
		if (err) console.log ('BugzScout InfoOnly Error: ' + err);
	});
};

exports.Warning = function (description, extra)
{
	bugzscout_Warning.submit ({description: description, extra: extra, defaultMessage: 'BugzScout Warning'}, function (err, res) {
		if (err) console.log ('BugzScout Warning Error: ' + err);
	});
};

exports.Alarm = function (description, extra)
{
	bugzscout_Alarm.submit ({description:	description, extra: extra, defaultMessage: 'BugzScout Alarm'}, function (err, res) {
		if (err) console.log ('BugzScout Alarm Error: ' + err);
	});
};