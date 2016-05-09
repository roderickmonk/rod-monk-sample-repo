"use strict";
// DocumentService provides a means for the controllers to share access to club documents
angular.module('ttc').factory('DocumentService', ['$log', 'UserService', '$http', '$q',
    function ($log, UserService, $http, $q) {
        return {
            refreshDocumentList: function () {
                var deferred = $q.defer();
                $http.post('/api/document-list', null, {
                    headers: {
                        'x-auth': UserService.getToken()
                    }
                })
                    .success(function (data) {
                    deferred.resolve(data);
                })
                    .error(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            removeDocument: function (file) {
                // The document is removed and then the updated list is sent back
                var deferred = $q.defer();
                $http.post('/api/document-remove', file, {
                    headers: {
                        'x-auth': UserService.getToken()
                    }
                })
                    .success(function (data) {
                    deferred.resolve(data);
                })
                    .error(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            }
        };
    }
]);
//# sourceMappingURL=DocumentService.js.map