"use strict";

// NewsItemService provides a means for the controllers to share access to the news items
app.factory('NewsItemService', ['$log', '$http',
function ($log, $http) {

	return {
		getNewObjectId: function (callback) {
			// Get a new ObjectId to identify the new News Item
			var req = {method: 'POST', url: '/api/newsitem-get-new-object-id', data: null};
			var promise = $http(req);
			promise.then(
				function (response) {
					callback (null, JSON.parse (response.data));
				}
			)
			.catch(
				function (response) {
					callback (response.data);
				}
			)			
		},
		getAll: function (callback) {
			// Get all news items
			var req = {method: 'POST', url: '/api/newsitem-list', data: null};
			var promise = $http(req);
			promise.then(
					function (response) {
						response.data.sort (function (a,b) {if (a.uploadTimestamp < b.uploadTimestamp) return 1; else if (a.uploadTimestamp > b.uploadTimestamp) return -1; else return 0;});
						callback (null, response.data);
					}
				)
				.catch(
					function (response) {
						callback (response.data);
					}
				)
		},
		retrieveFiles: function (newsitemid, callback) {
			var req = {method: 'POST', url: '/api/newsitem-getfiles', data: newsitemid};
			var promise = $http(req);
			promise.then(
				function (response) {
					callback (null, response.data);
				}
			)
			.catch(
				function (response) {
					callback (response.data);
				}
			);		
		},
		removeNewsItem: function (newsitemid, callback) {
			
			// Remove any news item files that may have been uploaded
			var req = {method: 'POST', url: '/api/newsitem-remove', data: newsitemid};
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
			);	
		},
		publishNewsItem: function (newsitem, callback) {
			console.log ('Publish News Item');
			var req = {method: 'POST', url: '/api/newsitem-publish', data: JSON.stringify (newsitem)};
			var promise = $http(req);
			promise.then(
				function (response) {
					callback (null);
				}
			)
			.catch (function (response) {
				callback (response.data);
			})
		}
	}
}]);
