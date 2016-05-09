"use strict";

// eBlasts Controller
angular.module('ttc')
.controller('eBlastsCtrl', ['$scope', '$http', 'UserService', '$window', '$log', 
function ($scope, $http, UserService, $window, $log) {
	
	$scope.busyPromise = $http.post ('/api/get-eblasts', null, {headers: {'x-auth': UserService.getToken ()}});
	$scope.busyPromise
		.then (function (response) {$scope.emails = response.data})
		.catch(function (response) {$window.alert (response.data)});
}]);
