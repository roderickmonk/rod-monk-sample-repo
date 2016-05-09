"use strict";

angular.module('ttc')
.controller('MemberTableController', ['$scope', '$log', 'MemberService', 'UserService', '$window',
function ($scope, $log, MemberService, UserService, $window) {
	
	$scope.user 				= UserService;
	$scope.unpaidonly 			= false;
	$scope.notrenewedonly 		= false;
	$scope.allemailaddresses 	= [];
	
	MemberService.getAllEmailAddresses ()
		.then  (function (emailaddresses) {$scope.allemailaddresses = emailaddresses;})
		.catch ($window.alert);	

	MemberService.getAllMembers ()
		.then  (function (data) {$scope.members = data;})
		.catch ($window.alert);
	
	$scope.TogglePaid = function (member) {
		member.paid = !member.paid;
		MemberService.saveMember (member)
			.catch ($window.alert);
	}
	
	$scope.ToggleStudent = function (member) {
		member.student = !member.student;
		MemberService.saveMember (member)
			.catch ($window.alert);
	}

	$scope.SelectExec = function (member) {
		console.log ('member: ', member);
		MemberService.saveMember (member)
			.catch ($window.alert);
	}

	$scope.UpdateFamilyEmailAddress = function (member) {
		console.log (member);

		console.log ('UpdateFamilyEmailAddress: ', member.familyemailaddress);
		
		if (member.familyemailaddress == "" || $scope.allemailaddresses.indexOf (member.familyemailaddress) >= 0)
				MemberService.saveMember (member)
					.catch ($window.alert);
		else
			$window.alert ('Family Email Address is Unknown - Not Saved');
	}
}]);