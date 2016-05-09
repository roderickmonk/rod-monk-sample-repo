"use strict";

app.controller('NewsCtrl', ['$scope', '$http', '$log', 'NewsItemService',
function ($scope, $http, $log, NewsItemService) {
	
	NewsItemService.getAll (function (err, newsitems) {
		if (err) 
			$window.alert (err + '. Please contact the TTC WebMaster');
		else
			$scope.NewsItems = newsitems;
	});
	
	$scope.RemoveNewsItem = function (newsitem) {
		NewsItemService.removeNewsItem (newsitem._id, function (err) {
			if (err) 
				$window.alert (err + '. Please contact the TTC WebMaster');
			
			// Refresh the list of News Items
			NewsItemService.getAll (function (err, newsitems) {
				if (err) 
					$window.alert (err + '. Please contact the TTC WebMaster');
				else
					$scope.NewsItems = newsitems;
			});
		});
	};
}]);

app.controller('NewsItemFilesController', ['$scope', '$http', '$log', 'NewsItemService',
function ($scope, $http, $log, NewsItemService) {

	$log.info ('NewsItemFilesController: ', $scope.$parent.NewsItem._id);

	NewsItemService.retrieveFiles ($scope.$parent.NewsItem._id, function (err, newsitemfiles) {
		if (err)
			$log.warn ('Problem retrieving News Item files: ' + err);
		else
			$scope.NewsItemFiles = newsitemfiles;
	});
}]);
	
