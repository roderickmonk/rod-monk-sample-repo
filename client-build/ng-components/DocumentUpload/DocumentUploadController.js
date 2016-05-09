'use strict';


angular.module('ttc')
.controller('DocumentUploadController', ['$scope', 'FileUploader', '$modalInstance', 'UserService', 'DocumentService', '$window', '$log',
function documentUploadController ($scope, FileUploader, $modalInstance, UserService, DocumentService, $window, $log) {
	var uploader = $scope.uploader = new FileUploader({
		url: 		'/api/document-upload'
	});

	$scope.user = UserService;
	
	$scope.refreshDocumentList = function () {
		DocumentService.refreshDocumentList ()
			.then (function (files) {$scope.files = files;})
			.catch($window.alert);
	}
	
	$scope.refreshDocumentList ();
	
	// FILTERS
	uploader.filters.push({
		name: 'customFilter',
		fn: function (item, options) {
			return this.queue.length < 10;
		}
	});
	
	uploader.filters.push({
            name: 'pdfFilter',
            fn: function(item, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
				console.log ('file type: ', type);
                return '|pdf|PDF|'.indexOf(type) !== -1;
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
		$scope.refreshDocumentList ();
		console.info('onCompleteItem', fileItem, response, status, headers);
	};
	uploader.onCompleteAll = function () {
		console.info('onCompleteAll');
	};
	
	$scope.Remove = function (file) {
		DocumentService.removeDocument (file)
			// Removes the file in question and then updates the document list
			.then (function (files) {$scope.files = files;})
			.catch ($window.alert);
	}

	$scope.Close = function () {
		$modalInstance.dismiss('No');
	};
}]);