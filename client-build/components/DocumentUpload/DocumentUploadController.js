'use strict';


app.controller('DocumentUploadController', ['$scope', '$http', 'FileUploader', '$modalInstance', 'UserService', '$log',
function documentUploadController ($scope, $http, FileUploader, $modalInstance, UserService, $log) {
	var uploader = $scope.uploader = new FileUploader({
		url: 		'/api/document-upload'
	});

	$scope.user = UserService;
	
	$scope.refreshDocumentList = function ()
	{
		// Update the list of documents
		var req = {method: 'POST', url: '/api/document-list', headers: {'x-auth': $scope.user.getToken()}, data: null};
		var promise = $http(req);
		promise.then(
			function (response) {
				response.data.sort(function (a, b) {if (a.uploadDate < b.uploadDate) return 1; else if (a.uploadDate > b.uploadDate) return -1; else return 0;});
				$scope.files = response.data;
			}
		)
		.catch(
			function (response) {
				$log.info ('Error Data: ', response.data);
				$log.info ('Error Status: ', response.status);
				throw new Error ('Error Status / Error: ' + response.status + ', ' + response.data);
			}
		);
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
		var req = {method: 'POST', url: '/api/document-remove', headers: {'x-auth': UserService.getToken()}, data: JSON.stringify (file)};

		var promise = $http(req);
		promise.then(
				function (response) {
					$log.info (response.data);
					// Refresh the list
					response.data.sort(function (a, b) {if (a.uploadDate < b.uploadDate) return 1; else if (a.uploadDate > b.uploadDate) return -1; else return 0;});
					$scope.files = response.data;
				}
			)
			.catch(
				function (response) {
					$log.info ('Error Data: ', response.data);
					$log.info ('Error Status: ', response.status);
				}
			);		
		};

	$scope.Close = function () {
		$modalInstance.dismiss('No');
	};
}]);