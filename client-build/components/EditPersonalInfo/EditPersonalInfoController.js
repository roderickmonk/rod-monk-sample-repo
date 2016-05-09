"use strict";

// editPersonalInfoCtrl Controller
app.controller('editPersonalInfoCtrl', ['$scope', 'placesService', 'MemberService', '$log', '$window', '$modalInstance',
function ($scope, placesService, MemberService, $log, $window, $modalInstance) 
	{
	$scope.member 			= {};
	$scope.places 			= placesService.get ();

	MemberService.getMember (function (err, member) {
		if (err)
			$window.alert(err + '. Please contact the TTC WebMaster');
		else
		{
			console.log ('member: ', member);
			$scope.member 					= member;
			$scope.confirmemailaddress		= member.emailaddress;
		}
	});
		
	$scope.Save = function () {
	 	MemberService.saveMember ($scope.member, function (err) {	
			if (err)
				$window.alert (err + '. Please contact the TTC WebMaster');
			else {
				$modalInstance.close('Yes');
				$window.alert ('Edits to personal information have been saved');
			}
		});
	}

	$scope.Cancel = function () {
		$modalInstance.dismiss('No');
	};
				
	$scope.normalizeCanadianPostalCodes = function ()
	{
		$scope.member.postcode = $scope.member.postcode.replace (' ', '').toUpperCase ();
	};
		
	$scope.normalizePrimaryPhoneNumber = function () {
		$scope.member.primaryphone = normalizePhoneNumber ($scope.member.primaryphone);
	};

	$scope.normalizeAlternativePhoneNumber = function () {
		$scope.member.alternativephone = normalizePhoneNumber ($scope.member.alternativephone);
	};
}]);
