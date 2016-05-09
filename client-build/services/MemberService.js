"use strict";

app.factory('MemberService', ['$http', 'UserService', '$log',
function ($http, UserService, $log) {

		return {
			getAllMembers: function (callback) {
				var req = {
					method: 'GET',
					url: '/api/getmembers',
					headers: {
						'x-auth': UserService.getToken()
					},
					data: null
				};
				
				console.log ('getAllMembers request: ', JSON.stringify (req, null, 4));
				
				var promise = $http(req);
				promise.then(
						function (response) {

							// Do some cleaning up
							for (var i = 0; i < response.data.length; ++i) {
								response.data[i].firstname = _.capitalize(response.data[i].firstname);
								response.data[i].familyname = _.capitalize(response.data[i].familyname);
								response.data[i].primaryphone = normalizePhoneNumber(response.data[i].primaryphone);
								response.data[i].alternativephone = normalizePhoneNumber(response.data[i].alternativephone);
							}
							callback (null, response.data);
							return;
						}
					)
				.catch (
					function (response) {
						callback (response.data);
					}
				)
		},
		getMember: function (callback) {

			var request = {method: 'POST', url: '/api/findmember', headers: {'x-auth': UserService.getToken()}};
			console.log ('getMember request: ', JSON.stringify (request, null, 4));
			var promise = $http (request);
			promise.then(
					function (response) {
						console.log ('response.data: ', response.data);
						callback (null, response.data);
					}
				)
				.catch (
					function (response) {
						callback (response.data);
					}
				)
		},
		saveMember: function (member, callback) {
			console.log ('saveMember');
			var req = {
				method: 'POST',
				url: '/api/save-personal-info',
				headers: {
					'x-auth': UserService.getToken(), 'Content-Type': 'application/json'},
				data: angular.toJson(member)
			};
			var promise = $http (req);
			promise.then(
					function (response) {
						callback (null);
					}
				)
				.catch(
					function (response) {
						callback (response.data);
					}
				)
		},
		ChangePassword: function (member, callback) {
			
			var req = {method: 'POST', url: '/api/change-password', headers: {'x-auth': UserService.getToken()}, data: member};
			var promise = $http(req);
			promise.then(
				function (response) {
					callback (null);
				}
			)
			.catch(
				function (response) {
					callback (response.data);
				}
			)
		},
		CountMembers: function (callback) {
			var req = {
				method: 'POST',
				url: '/api/count-members'
			};
			var promise = $http (req);
			promise.then(
					function (response) {
						callback (null, JSON.stringify (response.data));
					}
				)
				.catch(
					function (response) {
						callback (response.data);
					}
				)
		},					
		CountMembersByDecade: function (callback) {
			var req = {
				method: 'POST',
				url: '/api/count-members-by-decade'
			};
			var promise = $http (req);
			promise.then(
					function (response) {
						callback (null, response.data);
					}
				)
				.catch(
					function (response) {
						callback (response.data);
					}
				)
		},	
		CountMembersByBirthMonth: function (callback) {
			var req = {
				method: 'POST',
				url: '/api/count-members-by-birthmonth'
			};
			var promise = $http (req);
			promise.then(
					function (response) {
						callback (null, response.data);
					}
				)
				.catch(
					function (response) {
						callback (response.data);
					}
				)
		}	
	}
}]);
