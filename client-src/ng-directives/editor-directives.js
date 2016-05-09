angular.module('ttc').directive('dsEmailaddress', function () {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/ng-templates/ds-emailaddress.html',
        link: function ($scope, element, attrs) { }
    };
});
angular.module('ttc').directive('dsConfirmEmailaddress', function () {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/ng-templates/ds-confirmemailaddress.html',
        link: function ($scope, element, attrs) { }
    };
});
angular.module('ttc').directive('dsPassword', function () {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/ng-templates/ds-password.html',
        link: function ($scope, element, attrs) { }
    };
});
angular.module('ttc').directive('dsConfirmpassword', function () {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/ng-templates/ds-confirmpassword.html',
        link: function ($scope, element, attrs) { }
    };
});
angular.module('ttc').directive('dsFirstname', function () {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/ng-templates/ds-firstname.html',
        link: function ($scope, element, attrs) { }
    };
});
angular.module('ttc').directive('dsFamilyname', function () {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/ng-templates/ds-familyname.html',
        link: function ($scope, element, attrs) { }
    };
});
angular.module('ttc').directive('dsFamilyemailaddress', function () {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/ng-templates/ds-familyemailaddress.html',
        link: function ($scope, element, attrs) { }
    };
});
angular.module('ttc').directive('dateField', function ($filter) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelController) {
            ngModelController.$parsers.push(function (data) {
                //View -> Model
                console.log('View -> Model: ', data);
                var date = moment(data, 'YYYY-MM-DD', true);
                ngModelController.$setValidity('date', date.isValid());
                return date.isValid() ? date.toDate() : undefined;
            });
            ngModelController.$formatters.push(function (data) {
                //Model -> View
                return $filter('date')(data, "yyyy-MM-dd");
            });
        }
    };
});
angular.module('ttc').directive('ttcFamilyEmailaddressAttr', function ($filter) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelController) {
            if (_.isUndefined(scope.familyemailaddress))
                scope.familyemailaddress = '';
            ngModelController.$parsers.push(function (data) {
                console.log(data);
                console.log('allemailaddresses.length: ', scope.allemailaddresses.length);
                if (!data) {
                    // It's Ok not to set a familyemailaddress at all
                    ngModelController.$setValidity('familyemailaddress', true);
                    ngModelController.$setValidity('email', true);
                }
                else {
                    var familyemailaddressKnown = scope.allemailaddresses.indexOf(data) >= 0;
                    ngModelController.$setValidity('familyemailaddress', familyemailaddressKnown);
                    ngModelController.$setValidity('email', familyemailaddressKnown);
                    console.log('familyemailaddressKnown: ', familyemailaddressKnown);
                }
            });
            ngModelController.$formatters.push(function (data) {
                //Model -> View
                console.log('ngModelController.$formatters.push: ', data);
                if (scope.allemailaddresses.indexOf(data) >= 0)
                    return data;
                else
                    return null;
            });
        }
    };
});
angular.module('ttc').directive('dsAddress', function () {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/ng-templates/ds-address.html',
        link: function ($scope, element, attrs) { }
    };
});
angular.module('ttc').directive('dsPlace', function () {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/ng-templates/ds-place.html',
        link: function ($scope, element, attrs) { }
    };
});
angular.module('ttc').directive('dsPostcode', function () {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/ng-templates/ds-postcode.html',
        link: function ($scope, element, attrs) { }
    };
});
angular.module('ttc').directive('dsPrimaryphone', function () {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/ng-templates/ds-primaryphone.html',
        link: function ($scope, element, attrs) { }
    };
});
angular.module('ttc').directive('dsAlternativephone', function () {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/ng-templates/ds-alternativephone.html',
        link: function ($scope, element, attrs) { }
    };
});
angular.module('ttc').directive('dsDob', function () {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/ng-templates/ds-dob.html',
        link: function ($scope, element, attrs) { }
    };
});
angular.module('ttc').directive('dsLiabilityagreed', function () {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/ng-templates/ds-liabilityagreed.html',
        link: function ($scope, element, attrs) { }
    };
});
angular.module('ttc').directive('dsCommunicationsagreed', function () {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/ng-templates/ds-communicationsagreed.html',
        link: function ($scope, element, attrs) { }
    };
});
angular.module('ttc').directive('dsPhotoagreed', function () {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/ng-templates/ds-photoagreed.html',
        link: function ($scope, element, attrs) { }
    };
});
angular.module('ttc').directive('dsStudent', function () {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/ng-templates/ds-student.html',
        link: function ($scope, element, attrs) { }
    };
});
angular.module('ttc').directive('dsVolunteerMaintenance', function () {
    console.log('Directive called');
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/ng-templates/ds-volunteer-maintenance.html',
        link: function ($scope, element, attrs) { }
    };
});
angular.module('ttc').directive('dsVolunteerBookkeeping', function () {
    console.log('Directive called');
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/ng-templates/ds-volunteer-bookkeeping.html',
        link: function ($scope, element, attrs) { }
    };
});
angular.module('ttc').directive('dsVolunteerGardening', function () {
    console.log('Directive called');
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/ng-templates/ds-volunteer-gardening.html',
        link: function ($scope, element, attrs) { }
    };
});
angular.module('ttc').directive('dsVolunteerArchivist', function () {
    console.log('Directive called');
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/ng-templates/ds-volunteer-archivist.html',
        link: function ($scope, element, attrs) { }
    };
});
angular.module('ttc').directive('dsVolunteerOrganizeclubsocial', function () {
    console.log('Directive called');
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/ng-templates/ds-volunteer-organizeclubsocial.html',
        link: function ($scope, element, attrs) { }
    };
});
angular.module('ttc').directive('dsVolunteerPhonecommittee', function () {
    console.log('Directive called');
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/ng-templates/ds-volunteer-phonecommittee.html',
        link: function ($scope, element, attrs) { }
    };
});
angular.module('ttc').directive('dsVolunteerWebprogramming', function () {
    console.log('Directive called');
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/ng-templates/ds-volunteer-webprogramming.html',
        link: function ($scope, element, attrs) { }
    };
});
angular.module('ttc').directive('dsVolunteerTeamcaptain', function () {
    console.log('Directive called');
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/ng-templates/ds-volunteer-teamcaptain.html',
        link: function ($scope, element, attrs) { }
    };
});
angular.module('ttc').directive('dsVolunteerMembershipdrives', function () {
    console.log('Directive called');
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/ng-templates/ds-volunteer-membershipdrives.html',
        link: function ($scope, element, attrs) { }
    };
});
angular.module('ttc').directive('dsVolunteerMediacoordinator', function () {
    console.log('Directive called');
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/ng-templates/ds-volunteer-mediacoordinator.html',
        link: function ($scope, element, attrs) { }
    };
});
angular.module('ttc').directive('dsVolunteerSupportplayerimprovementjunior', function () {
    console.log('Directive called');
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/ng-templates/ds-volunteer-supportplayerimprovementjunior.html',
        link: function ($scope, element, attrs) { }
    };
});
angular.module('ttc').directive('dsVolunteerSupportplayerimprovementadult', function () {
    console.log('Directive called');
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/ng-templates/ds-volunteer-supportplayerimprovementadult.html',
        link: function ($scope, element, attrs) { }
    };
});
angular.module('ttc').directive('dsVolunteerSupportsocialevents', function () {
    console.log('Directive called');
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/ng-templates/ds-volunteer-supportsocialevents.html',
        link: function ($scope, element, attrs) { }
    };
});
angular.module('ttc').directive('dsExecPresident', function () {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/ng-templates/ds-exec-president.html',
        link: function ($scope, element, attrs) { }
    };
});
angular.module('ttc').directive('dsExecVicepresident', function () {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/ng-templates/ds-exec-vicepresident.html',
        link: function ($scope, element, attrs) { }
    };
});
angular.module('ttc').directive('dsExecSecretary', function () {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/ng-templates/ds-exec-secretary.html',
        link: function ($scope, element, attrs) { }
    };
});
angular.module('ttc').directive('dsExecTreasurer', function () {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/ng-templates/ds-exec-treasurer.html',
        link: function ($scope, element, attrs) { }
    };
});
angular.module('ttc').directive('dsExecMaintenance', function () {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/ng-templates/ds-exec-maintenance.html',
        link: function ($scope, element, attrs) { }
    };
});
angular.module('ttc').directive('dsExecSocialdirector', function () {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/ng-templates/ds-exec-socialdirector.html',
        link: function ($scope, element, attrs) { }
    };
});
angular.module('ttc').directive('dsExecMembershipdirector', function () {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/ng-templates/ds-exec-membershipdirector.html',
        link: function ($scope, element, attrs) { }
    };
});
angular.module('ttc').directive('dsExecMensleague', function () {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/ng-templates/ds-exec-mensleague.html',
        link: function ($scope, element, attrs) { }
    };
});
angular.module('ttc').directive('dsExecWomensleague', function () {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/ng-templates/ds-exec-womensleague.html',
        link: function ($scope, element, attrs) { }
    };
});
angular.module('ttc').directive('dsExecJuniorprogramcoordinator', function () {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/ng-templates/ds-exec-juniorprogramcoordinator.html',
        link: function ($scope, element, attrs) { }
    };
});
angular.module('ttc').directive('dsExecWebmaster', function () {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/ng-templates/ds-exec-webmaster.html',
        link: function ($scope, element, attrs) { }
    };
});
angular.module('ttc').directive('dsExecNewsletter', function () {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/ng-templates/ds-exec-newsletter.html',
        link: function ($scope, element, attrs) { }
    };
});
angular.module('ttc').directive('dsExecTournamentdirector', function () {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/ng-templates/ds-exec-tournamentdirector.html',
        link: function ($scope, element, attrs) { }
    };
});
angular.module('ttc').directive('dsPersonalProfile', function () {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/ng-templates/ds-personal-profile.html',
        link: function ($scope, element, attrs) { }
    };
});
angular.module('ttc').directive('dsJoiningYear', function () {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/ng-templates/ds-joining-year.html',
        link: function ($scope, element, attrs) { }
    };
});
//# sourceMappingURL=editor-directives.js.map