"use strict";

// Search Membership Controller
app.controller ('SearchMembershipCtrl', ['$scope', '$log', 'MemberService', '$window',
function ($scope, $log, MemberService, $window) {
		MemberService.getAllMembers (function (err, members) {
			err ? 	$window.alert (err + ' - please contact the TTC Webmaster') : $scope.members = members;
		});
}]);
