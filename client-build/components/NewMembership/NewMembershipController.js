"use strict";

// Join Controller
app.controller ('NewMembershipController', ['$scope', '$http', 'placesService', '$modalInstance', '$log', '$window',
function ($scope, $http, placesService, $modalInstance, $log, $window) {
		$scope.member = {};
		// Default the checkboxes to unchecked
		$scope.member.liabilityagreed = $scope.member.communicationsagreed = $scope.member.photoagreed = $scope.member.student 	= false;
		
		$scope.places = placesService.get ();

		$scope.Submit = function () {
			var promise = $http ({method: 'POST', url: '/api/new-membership', data: JSON.stringify ($scope.member) });
			promise.then(
					function (response) {
						$window.alert ('Application Accepted.  All fees must be paid on or before March 31st.');
						$modalInstance.close('Yes');
					}
				)
				.catch(
					function (response) {
						if (response.status == 409)
						{
							$window.alert ('Our records show that you have already applied or that you are already a member.  ' +
										   'If you are already a member, please Login and renew your membership.  ' +
										   'Please contact the TTC webmaster if you cannot resolve the problem.');
							$modalInstance.close('Yes');
						}
						else
						{
							$window.alert (response.status + ' - please contact the TTC Webmaster');
							$modalInstance.close('Yes');
						}
					}
				)
			};

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
