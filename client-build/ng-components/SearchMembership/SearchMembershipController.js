"use strict";

// Search Membership Controller
angular.module('ttc').controller ('SearchMembershipCtrl', ['$scope', '$log', 'MemberService', '$window',
function ($scope, $log, MemberService, $window) {
	
	MemberService.getAllMembers ()
		.then  (function (data) {$scope.members = data;})
		.catch ($window.alert);
}]);
