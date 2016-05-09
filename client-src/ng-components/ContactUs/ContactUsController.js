"use strict";

angular.module('ttc')
.controller ("ContactUsController", ['$scope', '$http', function ($scope, $http) {

	$scope.executive= [];

	$http.get('/ng-components/ContactUs/ttc_exec.json')
	.success (function(response) { 
		$scope.executive = response;
		console.log ('executive', JSON.stringify ($scope.executive, null, 4));
		console.log ('length of executive: ', $scope.executive.length);
		console.log ('typeof executive: ', typeof $scope.executive);
	})
	.error (function (response) {
			console.log ('Error Detected: ', response);
	});   
}]);