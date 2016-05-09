"use strict";

// Controller for the main Index.html page
angular.module('ttc')
.controller ('IndexController',['$scope', 'UserService', '$modal', '$log', 'deviceDetector', function ($scope, UserService, $modal, $log, deviceDetector) {
		$scope.user 	= UserService;
		$scope.device	= deviceDetector;
		
		// Opens the modals
		$scope.open = function (whichSize, whichModal, whichController) {
			$log.info ('Open Modal');
			var modalInstance = $modal.open({
				templateUrl: whichModal,
				controller: whichController,
				size: whichSize,
				backdrop: true,
				resolve: {}
			});

			modalInstance.result.then(function () {
				$log.info ('Modal closed at: ' + new Date());
			}, function () {
				$log.info ('Modal dismissed at: ' + new Date());
			});
		};
	}
]);
