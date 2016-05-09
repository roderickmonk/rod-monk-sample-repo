"use strict";

// Login Controller
angular.module('ttc')
	.controller("loginCtrl", ['$scope', 'UserService', '$modalInstance', '$log', '$window', 'MemberService',
function ($scope, UserService, $modalInstance, $log, $window, MemberService)
		{
			$scope.member = {};
			$scope.already_have_a_password = 'Yes'; // As a default

			$scope.Login = function () {

				MemberService.loginMember($scope.already_have_a_password == 'Yes', $scope.member)
					.then(function (privileges) {
						console.log ('MemberService.loginMember, privileges:\n', privileges);
						UserService.loggedIn (privileges);
						$window.alert ('Login is Successful!');
						$modalInstance.close('Yes');
					})
					.catch($window.alert);
			}

			$scope.normalizeCanadianPostalCodes = function () {
				$scope.member.postcode = $scope.member.postcode.replace(' ', '').toUpperCase();
			};

			$scope.Cancel = function () {
				$modalInstance.dismiss('No');
			};

}]);