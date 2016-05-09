"use strict";

angular.module('ttc')
.controller('NewsCtrl', ['$scope', '$log', 'NewsItemService', '$window', 'UserService',
function ($scope, $log, NewsItemService, $window, UserService) {
	
	$scope.user = UserService;
	
	function GetAllNewsItems () {
		NewsItemService.getAll ()
			.then (function (NewsItems) {$scope.NewsItems = NewsItems;})
			.catch($window.alert);
	}
	
	$scope.RemoveNewsItem = function (newsitem) {
		NewsItemService.removeNewsItem (newsitem._id)
			// Refresh the set of newsitems
			.then (GetAllNewsItems)
			.catch($window.alert);
	}
	
	GetAllNewsItems ();
}]);

angular.module('ttc')
.controller('NewsItemFilesController', ['$scope', '$log', 'NewsItemService',
function ($scope, $log, NewsItemService) {

	NewsItemService.retrieveFiles ($scope.$parent.NewsItem._id)
		.then (function (NewsItemFiles) {$scope.NewsItemFiles = NewsItemFiles;});
}]);
	
