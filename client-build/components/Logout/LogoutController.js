"use strict";

// Logout Controller
app.controller('logoutCtrl', ['$scope', '$modalInstance', 'UserService', '$log', 
function ($scope, $modalInstance, UserService, $log) {
	$scope.ok = function () {
		UserService.loggedOut();
		$modalInstance.close ('Yes');
	};

	$scope.cancel = function () {
		$modalInstance.dismiss ('No');
	};
}]);