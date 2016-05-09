/// <reference path="node.d.ts" />
declare var https: any;
declare var md5: any;
declare var Track: any;
declare var MailChimpHostName: string;
declare var MailChimpMembersPath: string;
declare var MailChimpAuthorization: string;
declare function readResponseBody(response: any): Promise<{}>;
declare function deleteMember(emailaddress: any): Promise<{}>;
declare function addMember(emailaddress: any, FNAME: any, LNAME: any): Promise<{}>;
