"use strict";

// UserService provides a means for the controllers to share user login status and user role
app.factory('UserService', ['$log', '$cookies', 'deviceDetector', '$window', function ($log, $cookies, deviceDetector, $window) {

	var cookieCapable = !(deviceDetector.os == 'ios' && deviceDetector.browser == 'chrome');
	
	var JWT;
	if (cookieCapable)
		JWT = $cookies.get ('JWT');
	else 
		JWT = localStorage.getItem('JWT');
	
	//$window.alert ('cookie capable: ' + cookieCapable);
		
	$log.info ('JWT: ', JWT);

	return {
		loggedIn: function (token) {
			$log.info ('UserService.LoggedIn ()');
			if (cookieCapable)
				$cookies.put('JWT', token, {secure: true});
			else
				localStorage.setItem('JWT', token);
			
			JWT = token;
		},
		loggedOut: function () {
			$log.info ('UserService.loggedOut ()');
			if (cookieCapable)
				$cookies.remove ('JWT');
			else
				localStorage.setItem('JWT', '');
				
			JWT = '';
		},
		isLoggedIn: function () {
			return !!JWT;
		},
		getToken: function () {
			return JWT;
		}
	}
}]);