"use strict";

// Logout Controller
angular.module('ttc')
.controller('logoutCtrl', ['$scope', '$modalInstance', 'UserService', '$log', 
function ($scope, $modalInstance, UserService, $log) {
	$scope.ok = function () {
		UserService.loggedOut();
		$modalInstance.close ('Yes');
	};

	$scope.cancel = function () {
		$modalInstance.dismiss ('No');
	};
}]);