"use strict";

angular.module('ttc')
.controller("HomeController", ['$scope', 'MemberService', '$modal', '$log', 'NewsItemService', 'deviceDetector',
function ($scope, MemberService, $modal, $log, NewsItemService, deviceDetector) {

	$scope.device 		=		deviceDetector;
	
	$scope.MemberCount 	= 		0;
	MemberService.CountMembers () 
		.then (function (data) {$scope.MemberCount = data;});
	
	$scope.MembersByDecade = [[]];
	$scope.MembersByDecadeLabels = ["0-9", "10-19", "20-29", "30-39", "40-49", "50-59", "60-69", "70-79", "80-89"];
	$scope.MembersByDecadeSeries = ['Members By Decade'];
	/*MemberService.CountMembersByDecade ()
		.then (function (data) {$scope.MembersByDecade[0] = data;});
	*/

	$scope.MembersByBirthMonth = [[]];
	$scope.MembersByBirthMonthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	$scope.MembersByBirthMonthSeries = ['Members By Birth Month'];
	/*MemberService.CountMembersByBirthMonth ()
		.then (function (data) {$scope.MembersByBirthMonth[0] = data;});
	*/

	$scope.onClick = function (points, evt) {
		console.log(points, evt);
	};
	
	NewsItemService.getAll ()
		.then (function (NewsItems) {$scope.NewsItems = NewsItems;});

	// Opens the Mission & Values modal
	$scope.openMissionAndValues = function () {
		$log.info ('Open Modal');
		var modalInstance = $modal.open({
			templateUrl: '/ng-templates/mission-and-values.html',
			controller: 'MissionAndValuesController',
			size: '',
			backdrop: true,
			resolve: {}
		});

		modalInstance.result.then(function () {
			$log.info ('Modal closed at: ' + new Date());
		}, function () {
			$log.info ('Modal dismissed at: ' + new Date());
		});
	};
}]);

angular.module('ttc')
.controller('MissionAndValuesController', ['$scope', '$modalInstance',
	function ($scope, $modalInstance) {

		$scope.Close = function () {
			$modalInstance.dismiss ('cancel');
		};
	}]);
