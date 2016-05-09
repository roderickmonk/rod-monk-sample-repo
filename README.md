# TTCWebSite
The site is running at https://www.tsawwassentennis.club for the Tsawwassen Tennis Club.  The site became operational on February 1st, 2016, just in time for registration for the 2016 season.
<br>
The goals of the site are the following:
<ol>
<li>To provide all of the content that the existing site does ('Home page', 'How to Find Us', 'Calendar', 'News', 'About Us', 'Contact Us', etc.</li>
<li>To be responsive.</li>
<li>Allow members to 'Login'.</li>
<li>Allow members to search the membership contacts details (once logged in).</li>
<li>Allow the membership to modify their own contact details.</li>
<li>Allow the members to change their password.</li>
<li>Provide an application form for new members.</li>
<li>A means for existing members to renew their membership.</li>
<li>A means to distinguish executive members (who will be given an extra range of privileges).</li>
<li>A means for the membership to review recent eBlasts.</li>
<li>A new <b>TennisBC Export</b> function: this will allow a member of the executive to export the membership list to TennisBC (required once per year).</li>
<li>A new <b>Fee Accounting</b> function: When applying, will allow a member to specify other members within the same family; this feature will allow the site to auto-determine each family's yearly fees.</li>
<li>A new <b>Document Management</b> function: members of the executive will be able to add documents to a document repository (e.g. minutes of meetings, club bylaws, etc.).  The general membership will be able to view these documents.</li>
<li>A new <b>News Management</b> function: members of the executive will be able to add news items to the website (typically club successes in league play).  The general membership will be able to view these news items.  A news item consists of text and pictures.  They are to be displayed in the website in reverse chronological order.</li>
<li>An technical interface to FogBugz which will automatically record software failures (FogBugz is an issue tracking system).</li>
</ol>

<h4>Technologies</h4>
NodeJS, Express, AngularJS, Bootstrap, MongoDB, Mongoose, Git, GitHub, Gulp, and several npm packages (jwt-simple, bcrypt, async, gridfs-stream, moment, and several others).

<h4>Application Notes</h4>
<ol>
<li>Full access to the site requires the user to register a password and identify themselves (first and last name, postal code, date of birth, etc.).  Once logged in, the member can then search the membership database, view historical eBlasts, renew their membership, etc.</li>
<li>eBlasts are sent out from the club's gmail address.  The server (NodeJS) queries Google's repository of eBlasts for the most recent and then displays them in reverse chronological order.  Once collected, the server caches the eBlasts for a time.  This cache is occassionally refreshed.</li>
</ol>
<h4>Application ToDo List</h4>
<ul>
<li>Export to TennisBC</li>
<li>eBlast attachments are not yet accessible.</li>
</ul>
<h4>Technical ToDo List</h4>
(currently in progress)
<ul>
<li>Currently on the server side, TypeScript is being used to transpile from *.ts files to *.js files.  Nevertheless, the move to TypeScript is only superficial and is a work in progress.</li>
<li>The client is using the Angular 1 framework, but it is expected that the project will be moved to Angular 2 over time.</li>
<li>The API is not fully REST-ful.  It will be modified to make it so.  Some consideration is being made to re-implement using 'loopback'</li>
<li>Permissions management is awkwardly implemented.  This to be improved to use Access Control Lists.</li>
</ul>

<h4>Database</h4>
MongoDB available via MongoLab.

<h4>Server</h4>
Currently running on a Heroku servelet.

<h4>Security</h4>
1.  Passwords are hashed (bcrypt) and stored to the database, along with the member's other details.
2.  SSL
3.  JWT is used to ensure the ongoing security of a login. The JWT is stored in a secure cookie client-side.



