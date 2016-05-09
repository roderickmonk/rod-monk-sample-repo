"use strict";

app.controller("HomeController", ['$scope', 'MemberService', '$modal', '$log', 'NewsItemService', 'deviceDetector',
function ($scope, MemberService, $modal, $log, NewsItemService, deviceDetector) {

	$scope.device =		deviceDetector;
	
	$scope.CountMembers = 0;
	MemberService.CountMembers(function (count) {
		console.log('count: ', count);
		$scope.CountMembers = count;
	});

	$scope.MembersByDecade = [[]];
	$scope.MembersByDecadeLabels = ["0-9", "10-19", "20-29", "30-39", "40-49", "50-59", "60-69", "70-79", "80-89"];
	$scope.MembersByDecadeSeries = ['Members By Decade'];
	MemberService.CountMembersByDecade (function (err, decades) {
		if (!err) {
			console.log('decades.length: ', decades.length);
			console.log('Array.isArray (decades): ', Array.isArray(decades));
			$scope.MembersByDecade[0] = decades;
			console.log('Decades: ' + decades);
		}
	});

	$scope.MembersByBirthMonth = [[]];
	$scope.MembersByBirthMonthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	$scope.MembersByBirthMonthSeries = ['Members By Birth Month'];
	MemberService.CountMembersByBirthMonth(function (err, birthmonths) {
			$scope.MembersByBirthMonth[0] = birthmonths;
			console.log('MembersByBirthMonth: ' + birthmonths);
	});

	$scope.onClick = function (points, evt) {
		console.log(points, evt);
	};
	
	NewsItemService.getAll (function (err, newsitems) {
		$scope.NewsItems = newsitems;
	});

	// Opens the modals
	$scope.openMissionAndValues = function () {
		$log.info ('Open Modal');
		var modalInstance = $modal.open({
			templateUrl: '/client-build/ng-templates/mission-and-values.html',
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

app.controller('MissionAndValuesController', ['$scope', '$modalInstance',
	function ($scope, $modalInstance) {

		$scope.Close = function () {
			$modalInstance.dismiss('cancel');
		};
	}]);
