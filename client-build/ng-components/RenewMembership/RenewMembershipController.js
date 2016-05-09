"use strict";

// Renew Membership Controller
angular.module('ttc')
.controller('renewMembershipCtrl', ['$scope', 'placesService', 'MemberService', '$modalInstance', '$log', '$window', '$modal',
function ($scope, placesService, MemberService, $modalInstance, $log, $window, $modal) {
	
	$scope.member 				= {};
	$scope.allemailaddresses	= [];
	$scope.places 				= placesService.get ();
	$scope.TTCDebug				= false;

	MemberService.getAllMembers ()
		.then  (function (members) {for (var i=0; i<members.length; ++i) $scope.allemailaddresses.push (members[i].emailaddress);})
		.catch ($window.alert);	

	MemberService.getMember ()
		.then (function (member) {
			$scope.member 				= member; 
			$scope.confirmemailaddress 	= member.emailaddress; 
			$scope.member.student 				= false; 
			$scope.member.liabilityagreed 		= false;
			$scope.member.communicationsagreed 	= false;
			$scope.member.photoagreed 			= false;
			$scope.member.joining_year			= undefined;	
		})
		.catch ($window.alert);

	$scope.Submit = function () {
	 	MemberService.saveMember ($scope.member)
			.then (function () {$modalInstance.close('Yes'); $window.alert ('Renewal Application Accepted.  All fees must be paid on or before March 31st.');})
			.catch (function (err) {$window.alert (err );});
	}

	$scope.Cancel = function () {
		$modalInstance.dismiss('No');
	};

	$scope.normalizeCanadianPostalCodes = function ()
	{
		$scope.member.postcode = $scope.member.postcode.replace (' ', '').toUpperCase ();
	};

	$scope.normalizePrimaryPhoneNumber = function () {
		$scope.member.primaryphone = normalizePhoneNumber ($scope.member.primaryphone);
	};
		
	$scope.normalizeAlternativePhoneNumber = function () {
		$scope.member.alternativephone = normalizePhoneNumber ($scope.member.alternativephone);
	};
	
	// Opens the Mission & Values modal
	$scope.openReleaseOfLiability = function () {
		console.log ('Open Modal');
		var modalInstance = $modal.open({
			templateUrl:	'/ng-templates/release-of-liability-waiver-and-claims.html',
			controller: 	'ReleaseOfLiabilityController',
			size: 			'',
			backdrop: 		true,
			resolve: 		{}
		});

		modalInstance.result.then (function () {
			$log.info ('Modal closed at: ' + new Date());
		}, function () {
			$log.info ('Modal dismissed at: ' + new Date());
		});
	};
	
	// Opens the Mission & Values modal
	$scope.openCommunicationsConsent = function () {
		var modalInstance = $modal.open({
			templateUrl: '/ng-templates/communications-consent.html',
			controller: 'CommunicationsConsentController',
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

		// Opens the Mission & Values modal
	$scope.openPhotographConsent = function () {
		$log.info ('Open Modal');
		var modalInstance = $modal.open({
			templateUrl: '/ng-templates/photograph-consent.html',
			controller: 'PhotographConsentController',
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
	
	// Opens the Mission & Values modal
	$scope.openFeeStructure = function () {
		$log.info ('Open Modal');
		var modalInstance = $modal.open({
			templateUrl: '/ng-templates/fees.html',
			controller: 'FeeStructureController',
			size: 'sm',
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
.controller('FeeStructureController', ['$scope', '$modalInstance',
	function ($scope, $modalInstance) {

		$scope.Close = function () {
			$modalInstance.dismiss ('cancel');
		};
	}]);
