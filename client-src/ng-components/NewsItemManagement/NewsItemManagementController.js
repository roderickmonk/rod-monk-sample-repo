'use strict';

angular.module('ttc')
.controller('NewsItemManagementController', ['$scope', '$http', 'FileUploader', '$modalInstance', 'UserService', '$log', 'NewsItemService', '$window',
function documentUploadController ($scope, $http, FileUploader, $modalInstance, UserService, $log, NewsItemService, $window) {
	
		$scope.newsItem = {};
	
		var uploader = $scope.uploader = new FileUploader({
			url: '/api/newsitem-image-upload'
		});
	
		// FILTERS
		uploader.filters.push({
			name: 'imageFilter',
			fn: function (item, options) {
				var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
				return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
			}
		});

		// CALLBACKS
		uploader.onWhenAddingFileFailed = function (item, filter, options) {
			console.info('onWhenAddingFileFailed', item, filter, options);
		};
		uploader.onAfterAddingFile = function (fileItem) {
			console.info('onAfterAddingFile', fileItem);
		};
		uploader.onAfterAddingAll = function (addedFileItems) {
			console.info('onAfterAddingAll', addedFileItems);
		};
		uploader.onBeforeUploadItem = function (item) {
			item.headers.newsitemid = $scope.newsItem._id;
			console.info('onBeforeUploadItem', item);
		};
		uploader.onProgressItem = function (fileItem, progress) {
			console.info('onProgressItem', fileItem, progress);
		};
		uploader.onProgressAll = function (progress) {
			console.info('onProgressAll', progress);
		};
		uploader.onSuccessItem = function (fileItem, response, status, headers) {
			console.info('onSuccessItem', fileItem, response, status, headers);
		};
		uploader.onErrorItem = function (fileItem, response, status, headers) {
			console.info('onErrorItem', fileItem, response, status, headers);
		};
		uploader.onCancelItem = function (fileItem, response, status, headers) {
			console.info('onCancelItem', fileItem, response, status, headers);
		};
		uploader.onCompleteItem = function (fileItem, response, status, headers) {
			console.info('onCompleteItem', fileItem, response, status, headers);
		};
		uploader.onCompleteAll = function () {
			console.info('onCompleteAll');
		}
	
		NewsItemService.getNewObjectId ()
			.then (function (newsitemid) {$scope.newsItem._id = newsitemid;})
			.catch($window.alert);

		$scope.Publish = function () {
			NewsItemService.publishNewsItem ($scope.newsItem)
				.then (function () {$modalInstance.dismiss('Yes'); $window.alert ('Your News Item has been successfully published')})
				.catch ($window.alert);
		}

		$scope.Close = function () {
			// Any errors are picked up by the server
			NewsItemService.removeNewsItem ($scope.newsItem._id)
				.finally ($modalInstance.dismiss('Yes'));
		}
    }]);