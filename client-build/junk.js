(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var app = angular.module('ttc', ['ngRoute', 'ui.bootstrap', 'ngMessages', 'ngSanitize', 'ngCookies', 'cgBusy', 'angularFileUpload', 'pdf', 'chart.js', 'ngAnimate', 'ng.deviceDetector']);

app.config (['$httpProvider', function($httpProvider) {
    
	//First clear out all out-of-the-box defaults
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};    
    }    

	// Then define a few or our own
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
}]);

app.config (["$cookiesProvider", function ($cookiesProvider) {
	
	// Allow cookies are to be secure
 	$cookiesProvider.defaults = {
   		domain: 'ttc-website.herokuapp.com',
   		secure: true
 	};
}]);

app.config(["datepickerConfig", function (datepickerConfig) {
	datepickerConfig.initDate = new Date (1960,1,1);
  	datepickerConfig.startingDay = 1;
  	datepickerConfig.showWeeks = false;
	datepickerConfig.formatYear = 'yyyy';
	datepickerConfig.formatMonth = 'MM';
	datepickerConfig.formatDay = 'dd';
}]);
},{}]},{},[1]);
