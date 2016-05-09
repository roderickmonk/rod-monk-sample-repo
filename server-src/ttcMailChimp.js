/// <reference path="node.d.ts" />
var https = require('https');
var md5 = require('md5');
var Track = require('../server-src/ttcTrack');
var MailChimpHostName = 'us12.api.mailchimp.com';
var MailChimpMembersPath = '/3.0/lists/b167ae5463/members/';
var MailChimpAuthorization = 'TTC 61b421d2f443cbfe1560b33c78112dca-us12';
function readResponseBody(response) {
    response.setEncoding('utf8');
    return new Promise(function (resolve, reject) {
        var body = "";
        response.on('readable', function () {
            var chunk = response.read();
            if (chunk)
                body += chunk;
        });
        response.on('end', function () {
            resolve(body);
        });
    });
}
function deleteMember(emailaddress) {
    var https_options = {
        hostname: MailChimpHostName,
        path: MailChimpMembersPath + md5(emailaddress),
        method: 'DELETE',
        headers: {
            'Authorization': MailChimpAuthorization
        }
    };
    return new Promise(function (resolve, reject) {
        // No 'reject' thus far
        var req = https.request(https_options, function (res) {
            readResponseBody(res)
                .then(function (body) {
                if (res.Status < 200 || res.Status >= 300)
                    Track.InfoOnly('MailChimp API deleteMember', 'response.Status: ' + res.statusCode + ', response.Body: ' + body);
            });
        });
        req.on('error', function (e) {
            Track.Warning('MailChimp API deleteMember Warning', e.message);
        });
        req.end();
        resolve(null);
    });
}
function addMember(emailaddress, FNAME, LNAME) {
    var subscriber = JSON.stringify({
        'email_address': emailaddress,
        'status': 'subscribed',
        'merge_fields': {
            'FNAME': FNAME,
            'LNAME': LNAME
        }
    });
    var https_options = {
        hostname: MailChimpHostName,
        path: MailChimpMembersPath,
        method: 'POST',
        headers: {
            'Authorization': MailChimpAuthorization,
            'Content-Type': 'application/json',
            'Content-Length': subscriber.length
        }
    };
    return new Promise(function (resolve, reject) {
        // No 'reject' thus far
        var req = https.request(https_options, function (res) {
            readResponseBody(res)
                .then(function (body) {
                if (res.Status < 200 || res.Status >= 300)
                    Track.InfoOnly('MailChimp API addMember', 'response.Status: ' + res.statusCode + ', response.Body: ' + body);
            });
        });
        req.on('error', function (e) {
            Track.Warning('MailChimp API addMember Warning', e.message);
        });
        req.write(subscriber);
        req.end();
        resolve(null);
    });
}
module.exports = {
    deleteMember: deleteMember,
    addMember: addMember
};
//# sourceMappingURL=ttcMailChimp.js.map