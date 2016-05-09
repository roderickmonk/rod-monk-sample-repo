"use strict";
function isLocalStorageSupported() {
    var testKey = 'test', storage = window.localStorage;
    try {
        storage.setItem(testKey, '1');
        storage.removeItem(testKey);
        console.log('Local Storage IS supported');
        return true;
    }
    catch (error) {
        console.log('Local Storage IS NOT supported');
        return false;
    }
}
// UserService provides a means for the controllers to share user login status and user role
angular.module('ttc').factory('UserService', ['$log', '$cookies', 'deviceDetector', '$window', function ($log, $cookies, deviceDetector, $window) {
        // var cookieCapable = (deviceDetector.os == 'mac' && deviceDetector.browser == 'chrome');
        var cookieCapable = false;
        var JWT;
        var exec;
        if (cookieCapable) {
            JWT = $cookies.get('JWT');
            exec = $cookies.get('exec');
        }
        else {
            JWT = localStorage.getItem('JWT');
            exec = localStorage.getItem('exec');
        }
        $log.info('JWT: ', JWT);
        $log.info('exec: ', exec);
        return {
            loggedIn: function (privileges) {
                $log.info('UserService.LoggedIn (), privileges 2 ', privileges);
                if (cookieCapable) {
                    $cookies.put('JWT', privileges.jwt, { secure: true });
                    $cookies.put('exec', privileges.exec, { secure: true });
                }
                else if (isLocalStorageSupported()) {
                    localStorage.setItem('JWT', privileges.jwt);
                    localStorage.setItem('exec', privileges.exec);
                }
                JWT = privileges.jwt;
                exec = privileges.exec;
            },
            loggedOut: function () {
                $log.info('UserService.loggedOut ()');
                if (cookieCapable) {
                    $cookies.remove('JWT');
                    $cookies.remove('exec');
                }
                else if (isLocalStorageSupported()) {
                    localStorage.setItem('JWT', '');
                    localStorage.setItem('exec', '');
                }
                JWT = '';
                exec = '';
            },
            isLoggedIn: function () {
                return !!JWT;
            },
            getToken: function () {
                return JWT;
            },
            getExec: function () {
                return exec;
            }
        };
    }]);
//# sourceMappingURL=UserService.js.map