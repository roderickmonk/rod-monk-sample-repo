"use strict";

var app = angular.module('ttc', ['ngRoute', 'ui.bootstrap', 'ngMessages', 'ngSanitize', 'ngCookies', 'cgBusy', 'angularFileUpload', 'pdf', 'chart.js', 'ngAnimate', 'ng.deviceDetector']);

angular.module('ttc').config (['$httpProvider', function($httpProvider) {
    
	//First clear out all out-of-the-box defaults
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};    
    }    

	// Then define a few or our own
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
	
}]);

angular.module('ttc').config (function ($cookiesProvider) {
	
	// Allow cookies are to be secure
 	$cookiesProvider.defaults = {
   		domain: 'ttc-website.herokuapp.com',
   		secure: true
 	};
});

angular.module('ttc').config(function (datepickerConfig) {
	datepickerConfig.initDate = new Date (1960,1,1);
  	datepickerConfig.startingDay = 1;
  	datepickerConfig.showWeeks = false;
	datepickerConfig.formatYear = 'yyyy';
	datepickerConfig.formatMonth = 'MM';
	datepickerConfig.formatDay = 'dd';
});
