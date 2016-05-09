"use strict";

// Renew Membership Controller
app.controller('renewMembershipCtrl', ['$scope', 'placesService', 'MemberService', '$modalInstance', '$log', '$window',
function ($scope, placesService, MemberService, $modalInstance, $log, $window) {
	$scope.member = {};
	$scope.places = placesService.get ();

	MemberService.getMember (function (err, member) {
		if (err)
			$window.alert(err + ' - please contact the TTC WebMaster');
		else {
			$scope.member 					= member;
			$scope.confirmemailaddress		= member.emailaddress;
		}
	});

	$scope.Submit = function () {
	 	MemberService.saveMember ($scope.member, function (err) {	
			if (err)
				$window.alert(err + ' - please contact the TTC WebMaster');
			else
			{
				$window.alert('Renewal Application Accepted.  All fees must be paid on or before March 31st.');
				$modalInstance.close('Yes');
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
