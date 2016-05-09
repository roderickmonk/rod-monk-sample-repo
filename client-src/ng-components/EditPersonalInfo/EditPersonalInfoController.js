"use strict";

// editPersonalInfoCtrl Controller
angular.module('ttc')
.controller('editPersonalInfoCtrl', ['$scope', 'placesService', 'MemberService', '$log', '$window', '$modalInstance', '$modal',
function ($scope, placesService, MemberService, $log, $window, $modalInstance, $modal) {
	
	$scope.member 				= {};
	$scope.allemailaddresses	= [];
	$scope.new_applicant		= false;
	$scope.places 				= placesService.get ();
	$scope.TTCDebug				= false;

	MemberService.getAllEmailAddresses ()
		.then  (function (emailaddresses) {$scope.allemailaddresses = emailaddresses;})
		.catch ($window.alert);	
	
	MemberService.getMember ()
		.then (function (member) {$scope.member = member; $scope.confirmemailaddress = member.emailaddress;})
		.catch ($window.alert);
		
	$scope.Save = function () {
	 	MemberService.saveMember ($scope.member)
			.then (function () {
				$modalInstance.close ('Yes'); 
				$scope.openGeneralModal ('Edits to your personal profile have been saved.');
			})
			.catch ($window.alert);
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
	
	$scope.openGeneralModal = function (message) {
		var modalInstance = $modal.open({
			template: 
				'<div class="modal-header">' +
					'<h4 class="text-center btn btn-warning">Tsawwassen Tennis Club</h4>' +
					'<button class="btn btn-warning btn-xs visible-xs-block" type="button" ng-click="Close()" style="display:inline;">Close</button>' +
				'</div>' +

				'<div class="modal-body">' +
					'<strong class="text-center">' + message + '</strong>' +
				'</div>' +
				'<div class="modal-footer">' +
					'<button class="btn btn-warning" type="button" ng-click="Close()">Close</button>' +
				'</div>',
			controller: 'GeneralModalController',
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
.controller('ReleaseOfLiabilityController', ['$scope', '$modalInstance',
	function ($scope, $modalInstance) {

		$scope.Close = function () {
			$modalInstance.dismiss ('cancel');
		};
}]);

angular.module('ttc')
.controller('CommunicationsConsentController', ['$scope', '$modalInstance',
	function ($scope, $modalInstance) {

		$scope.Close = function () {
			$modalInstance.dismiss ('cancel');
		};

}]);

angular.module('ttc')
.controller('PhotographConsentController', ['$scope', '$modalInstance',
	function ($scope, $modalInstance) {

		$scope.Close = function () {
			$modalInstance.dismiss ('cancel');
		};
}]);

angular.module('ttc')
.controller('GeneralModalController', ['$scope', '$modalInstance',
	function ($scope, $modalInstance) {

		$scope.Close = function () {
			$modalInstance.dismiss ('cancel');
		};
}]);
