"use strict";

// eBlasts Controller
app.controller('eBlastsCtrl', ['$scope', '$http', 'UserService', '$window', '$log', 
function ($scope, $http, UserService, $window, $log) 
	{
	var request = {method: 'POST', url: '/api/get-eblasts', headers: {'x-auth': UserService.getToken ()}};
	
	$scope.busyPromise = $http(request);
	$scope.busyPromise.then(
			function (response) {
				response.data.sort(function (a, b) {if (a.date < b.date) return 1; else if (a.date > b.date) return -1; else return 0;});
				$scope.emails = response.data;
			}
		)
		.catch(
			function (response) {
				$window.alert (response.data + ' - please contact the TTC Webmaster');
			}
		)
}]);
