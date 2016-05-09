"use strict";

app.config(['$routeProvider', function ($routeProvider, $scope)
	{
		$routeProvider.when('/Home', {
				templateUrl: '/ng-components/Home/Home.html',
				controller: 'HomeController'
			})
			.when('/Calendar', {
				templateUrl: '/ng-components/Calendar/Calendar.html'
			})
			.when('/News', {
				templateUrl: 	'/ng-components/News/News.html',
				controller: 	'NewsCtrl'
			})
			.when('/SearchMembership', {
				templateUrl: 	'/ng-components/SearchMembership/SearchMembership.html',
				controller: 	'SearchMembershipCtrl'
			})
			.when('/eBlasts', {
				templateUrl: 	'/ng-components/eBlasts/eBlasts.html',
				controller: 	'eBlastsCtrl'
			})
			.when('/JuniorProgram', {
				templateUrl: 	'/ng-components/JuniorProgram/JuniorProgram.html'
			})
			.when('/AdultProgram', {
				templateUrl: 	'/ng-components/AdultProgram/AdultProgram.html'
			})
			.when('/HowToFindUs', {
				templateUrl: 	'/ng-components/HowToFindUs/HowToFindUs.html'
			})
			.when('/AboutUs', {
				templateUrl: 	'/ng-components/AboutUs/AboutUs.html'
			})
			.when('/ContactUs', {
				templateUrl: 	'/ng-components/ContactUs/ContactUs.html',
				controller: 	'ContactUsController'
			})
			.when('/MemberTable', {
				templateUrl: 	'/ng-components/MemberTable/MemberTable.html',
				controller: 	'MemberTableController'
			})
			.otherwise({
				redirectTo: '/Home'
			});
    }]);
