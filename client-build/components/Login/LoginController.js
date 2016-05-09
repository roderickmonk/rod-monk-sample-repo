"use strict";

// Login Controller
app.controller("loginCtrl", ['$scope', '$http', 'UserService', '$modalInstance', '$log', '$window', 
function ($scope, $http, UserService, $modalInstance, $log, $window) 
{
	$scope.member = {};
	$scope.already_have_a_password = 'Yes';  // As a default

	$scope.Login = function () {
		if ($scope.already_have_a_password == 'Yes') {
			var request = {method: 'POST', 
						   url: '/api/login', 
						   headers: {'Content-Type': 'application/json'}, 
						   data: JSON.stringify({emailaddress: $scope.member.emailaddress, password: $scope.member.password})};
			var promise = $http (request);
			promise.then(
					function (response) {
						// The JWT is recorded in response.data
						UserService.loggedIn(response.data);
						$window.alert('You are now logged in!');
						$modalInstance.close('Yes');
					}
				)
				.catch(
					function (response) {
						// Something bad happened, force a logout
						UserService.loggedOut();
						$log.info ('Login Error Data: ',		response.data);
						$log.info ('Login Error Status: ', 		response.status);
						$window.alert('Login failed.  Please check your email address and password and try again');
					}
				)
		} else {
			var request = {method: 'POST', url: '/api/signup', headers: {'Content-Type': 'application/json'}, data: JSON.stringify($scope.member)};
			var promise = $http (request);
			promise
				.then(function (response) {
					// A positive response - complete the login process
					var JWT = response.data;
					UserService.loggedIn(JWT);
					$window.alert('You are now logged in!');
					$modalInstance.close('Yes');
				})
				.catch(
					function (response) {
						// Something bad happened - doubly ensure that user is logged out
						UserService.loggedOut();
						$log.info('Submit Error Data: ', response.data);
						$log.info('Submit Error Status: ', response.status);
						$window.alert (response.data);
					}
				)
		}
	};

	$scope.Cancel = function () {
		$modalInstance.dismiss('No');
	};
	
}]);
