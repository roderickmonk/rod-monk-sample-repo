"use strict";

// Change Password Controller
app.controller('changePasswordCtrl', ['$scope', '$http', 'UserService', '$modalInstance', '$window', '$log', 'MemberService',
function ($scope, $http, UserService, $modalInstance, $window, $log, MemberService) {
	
	$scope.Save = function () {
		MemberService.ChangePassword ($scope.member, function (err) {
			if (err)
				$window.alert (err + '. Please contact the TTC WebMaster');
			else {
				$modalInstance.close('Yes');
				$window.alert ('Your new password has been saved');
			}
		});
	}

	$scope.Cancel = function () {
		$modalInstance.dismiss('No');
	};
}]);
