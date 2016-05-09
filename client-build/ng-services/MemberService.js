/// <reference path="../assets/js/util.d.ts" />
"use strict";
// import { normalizePhoneNumber } from "../assets/js/util";
// declare function normalizePhoneNumber(phonenumber: string): string;
angular.module('ttc').factory('MemberService', ['$http', 'UserService', '$log', 'deviceDetector', '$q',
    function ($http, UserService, $log, deviceDetector, $q) {
        function postHeaders() {
            return {
                headers: {
                    'x-auth': UserService.getToken(),
                    'device': deviceDetector.os + '-' + deviceDetector.device + '-' + deviceDetector.browser
                }
            };
        }
        return {
            getAllMembers: function () {
                var deferred = $q.defer();
                $http.post('/api/getmembers', null, postHeaders())
                    .success(function (data) {
                    // Do some cleaning
                    for (var i = 0; i < data.length; ++i) {
                        data[i].firstname = _.capitalize(data[i].firstname);
                        data[i].familyname = _.capitalize(data[i].familyname);
                        data[i].primaryphone = normalizePhoneNumber(data[i].primaryphone);
                        data[i].alternativephone = normalizePhoneNumber(data[i].alternativephone);
                    }
                    deferred.resolve(data);
                })
                    .error(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getAllEmailAddresses: function () {
                var deferred = $q.defer();
                $http.post('/api/get-all-email-addresses', null, postHeaders())
                    .success(function (data) {
                    deferred.resolve(data);
                })
                    .error(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            loginMember: function (existingPassword, member) {
                var deferred = $q.defer();
                $http.post(existingPassword ? '/api/login' : '/api/signup', member)
                    .success(function (data) {
                    deferred.resolve(data);
                })
                    .error(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getMember: function () {
                var deferred = $q.defer();
                $http.post('/api/findmember', null, postHeaders())
                    .success(function (data) {
                    deferred.resolve(data);
                })
                    .error(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            saveMember: function (member) {
                var deferred = $q.defer();
                $http.post('/api/save-personal-info', member, postHeaders())
                    .success(function () {
                    deferred.resolve(null);
                })
                    .error(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            saveNewMember: function (member) {
                var deferred = $q.defer();
                $http.post('/api/new-membership', member)
                    .success(function (data) {
                    deferred.resolve(data);
                })
                    .error(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            ChangePassword: function (member) {
                var deferred = $q.defer();
                $http.post('/api/change-password', member, postHeaders())
                    .success(function (data) {
                    deferred.resolve(data);
                })
                    .error(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            CountMembers: function () {
                var deferred = $q.defer();
                $http.post('/api/count-members')
                    .success(function (data) {
                    deferred.resolve(data);
                })
                    .error(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            CountMembersByDecade: function () {
                var deferred = $q.defer();
                $http.post('/api/count-members-by-decade')
                    .success(function () {
                    deferred.resolve(null);
                })
                    .error(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            CountMembersByBirthMonth: function (callback) {
                var deferred = $q.defer();
                $http.post('/api/count-members-by-birthmonth')
                    .success(function () {
                    deferred.resolve(null);
                })
                    .error(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            }
        };
    }]);
//# sourceMappingURL=MemberService.js.map