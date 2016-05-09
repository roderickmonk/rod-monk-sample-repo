"use strict";

// Change Password Controller
angular.module('ttc')
	.controller('changePasswordController', ['$scope', 'UserService', '$modalInstance', '$window', '$log', 'MemberService', '$q',
function ($scope, UserService, $modalInstance, $window, $log, MemberService, $q) {

			$scope.member = {};

			$scope.Save = function () {
				MemberService.ChangePassword($scope.member)
					.then(function () {
						$modalInstance.close('Yes');
						$window.alert('Your new password has been saved');
					})
					.catch(function (err) {
						$window.alert(err);
					});
			};

			$scope.Cancel = function () {
				$modalInstance.dismiss('No');
			};
}]);