"use strict";
// NewsItemService provides a means for the controllers to share access to the news items
angular.module('ttc').factory('NewsItemService', ['$log', '$http', '$q',
    function ($log, $http, $q) {
        return {
            getNewObjectId: function () {
                var deferred = $q.defer();
                // Get a new ObjectId to identify the new News Item
                $http.post('/api/newsitem-get-new-object-id')
                    .success(function (data) {
                    deferred.resolve(JSON.parse(data));
                })
                    .error(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getAll: function () {
                var deferred = $q.defer();
                $http.post('/api/newsitem-list')
                    .success(function (data) {
                    deferred.resolve(data);
                })
                    .error(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            retrieveFiles: function (newsitemid) {
                var deferred = $q.defer();
                $http.post('/api/newsitem-getfiles', newsitemid)
                    .success(function (data) {
                    deferred.resolve(data);
                })
                    .error(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            removeNewsItem: function (newsitemid) {
                var deferred = $q.defer();
                $http.post('/api/newsitem-remove', newsitemid)
                    .success(function (data) {
                    deferred.resolve(data);
                })
                    .error(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            publishNewsItem: function (newsitem) {
                var deferred = $q.defer();
                $http.post('/api/newsitem-publish', newsitem)
                    .success(function (data) {
                    deferred.resolve(data);
                })
                    .error(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            }
        };
    }]);
//# sourceMappingURL=NewsItemService.js.map