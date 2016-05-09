"use strict";

app.controller('MemberTableController', ['$scope', '$log', 'MemberService', '$window',
function ($scope, $log, MemberService, $window) {
	
	MemberService.getAllMembers (function (err, members) { 
		if (err)
			$window.alert(err + ' - please contact the TTC WebMaster');
		else
			$scope.members = members; 
	});
	
	$scope.TogglePaid = function (member)
	{
		member.paid = !member.paid;
		MemberService.saveMember (member, function (err) {	
			if (err)
					$window.alert(err + '- please contact the TTC WebMaster');
		});
	}
	
	$scope.ToggleStudent = function (member)
	{
		member.student = !member.student;
		MemberService.saveMember (member, function (err) {	
			if (err)
					$window.alert(err + '- please contact the TTC WebMaster');
		});
	}
	
	$scope.UpdateFamilyEmailAddress = function (member)
	{
		console.log ('UpdateFamilyEmailAddress:\n' + JSON.stringify (member, null, 4));
		if (member.familyemailaddress)
			MemberService.saveMember (member, function (err) {	
				if (err)
						$window.alert(err + '- please contact the TTC WebMaster');
			});
	}
}]);