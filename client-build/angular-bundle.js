"use strict";
var app = angular.module('ttc', ['ngRoute', 'ui.bootstrap', 'ngMessages', 'ngSanitize', 'ngCookies', 'cgBusy', 'angularFileUpload', 'pdf', 'chart.js', 'ngAnimate', 'ng.deviceDetector']);
angular.module('ttc').config(['$httpProvider', function ($httpProvider) {
        //First clear out all out-of-the-box defaults
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }
        // Then define a few or our own
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
    }]);
angular.module('ttc').config(["$cookiesProvider", function ($cookiesProvider) {
    // Allow cookies are to be secure
    $cookiesProvider.defaults = {
        domain: 'ttc-website.herokuapp.com',
        secure: true
    };
}]);
angular.module('ttc').config(["datepickerConfig", function (datepickerConfig) {
    datepickerConfig.initDate = new Date(1960, 1, 1);
    datepickerConfig.startingDay = 1;
    datepickerConfig.showWeeks = false;
    datepickerConfig.formatYear = 'yyyy';
    datepickerConfig.formatMonth = 'MM';
    datepickerConfig.formatDay = 'dd';
}]);
//# sourceMappingURL=app.js.map
"use strict";
app.config(['$routeProvider', function ($routeProvider, $scope) {
        $routeProvider.when('/Home', {
            templateUrl: '/ng-components/Home/Home.html',
            controller: 'HomeController'
        })
            .when('/Calendar', {
            templateUrl: '/ng-components/Calendar/Calendar.html'
        })
            .when('/News', {
            templateUrl: '/ng-components/News/News.html',
            controller: 'NewsCtrl'
        })
            .when('/SearchMembership', {
            templateUrl: '/ng-components/SearchMembership/SearchMembership.html',
            controller: 'SearchMembershipCtrl'
        })
            .when('/eBlasts', {
            templateUrl: '/ng-components/eBlasts/eBlasts.html',
            controller: 'eBlastsCtrl'
        })
            .when('/JuniorProgram', {
            templateUrl: '/ng-components/JuniorProgram/JuniorProgram.html'
        })
            .when('/AdultProgram', {
            templateUrl: '/ng-components/AdultProgram/AdultProgram.html'
        })
            .when('/HowToFindUs', {
            templateUrl: '/ng-components/HowToFindUs/HowToFindUs.html'
        })
            .when('/AboutUs', {
            templateUrl: '/ng-components/AboutUs/AboutUs.html'
        })
            .when('/ContactUs', {
            templateUrl: '/ng-components/ContactUs/ContactUs.html',
            controller: 'ContactUsController'
        })
            .when('/MemberTable', {
            templateUrl: '/ng-components/MemberTable/MemberTable.html',
            controller: 'MemberTableController'
        })
            .otherwise({
            redirectTo: '/Home'
        });
    }]);
//# sourceMappingURL=app.route.js.map
"use strict";

angular.module('ttc')
.controller ("ContactUsController", ['$scope', '$http', function ($scope, $http) {

	$scope.executive= [];

	$http.get('/ng-components/ContactUs/ttc_exec.json')
	.success (function(response) { 
		$scope.executive = response;
		console.log ('executive', JSON.stringify ($scope.executive, null, 4));
		console.log ('length of executive: ', $scope.executive.length);
		console.log ('typeof executive: ', typeof $scope.executive);
	})
	.error (function (response) {
			console.log ('Error Detected: ', response);
	});   
}]);
"use strict";

// Change Password Controller
angular.module('ttc')
	.controller('changePasswordController', ['$scope', 'UserService', '$modalInstance', '$window', '$log', 'MemberService', '$q',
function ($scope, UserService, $modalInstance, $window, $log, MemberService, $q) {

			$scope.member = {};

			$scope.Save = function () {
				MemberService.ChangePassword($scope.member)
					.then(function () {
						$modalInstance.close('Yes');
						$window.alert('Your new password has been saved');
					})
					.catch(function (err) {
						$window.alert(err);
					});
			};

			$scope.Cancel = function () {
				$modalInstance.dismiss('No');
			};
}]);
'use strict';


angular.module('ttc')
.controller('DocumentUploadController', ['$scope', 'FileUploader', '$modalInstance', 'UserService', 'DocumentService', '$window', '$log',
function documentUploadController ($scope, FileUploader, $modalInstance, UserService, DocumentService, $window, $log) {
	var uploader = $scope.uploader = new FileUploader({
		url: 		'/api/document-upload'
	});

	$scope.user = UserService;
	
	$scope.refreshDocumentList = function () {
		DocumentService.refreshDocumentList ()
			.then (function (files) {$scope.files = files;})
			.catch($window.alert);
	}
	
	$scope.refreshDocumentList ();
	
	// FILTERS
	uploader.filters.push({
		name: 'customFilter',
		fn: function (item, options) {
			return this.queue.length < 10;
		}
	});
	
	uploader.filters.push({
            name: 'pdfFilter',
            fn: function(item, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
				console.log ('file type: ', type);
                return '|pdf|PDF|'.indexOf(type) !== -1;
            }
        });

	// CALLBACKS
	uploader.onWhenAddingFileFailed = function (item, filter, options) {
		console.info('onWhenAddingFileFailed', item, filter, options);
	};
	uploader.onAfterAddingFile = function (fileItem) {
		console.info('onAfterAddingFile', fileItem);
	};
	uploader.onAfterAddingAll = function (addedFileItems) {
		console.info('onAfterAddingAll', addedFileItems);
	};
	uploader.onBeforeUploadItem = function (item) {
		console.info('onBeforeUploadItem', item);
	};
	uploader.onProgressItem = function (fileItem, progress) {
		console.info('onProgressItem', fileItem, progress);
	};
	uploader.onProgressAll = function (progress) {
		console.info('onProgressAll', progress);
	};
	uploader.onSuccessItem = function (fileItem, response, status, headers) {
		console.info('onSuccessItem', fileItem, response, status, headers);
	};
	uploader.onErrorItem = function (fileItem, response, status, headers) {
		console.info('onErrorItem', fileItem, response, status, headers);
	};
	uploader.onCancelItem = function (fileItem, response, status, headers) {
		console.info('onCancelItem', fileItem, response, status, headers);
	};
	uploader.onCompleteItem = function (fileItem, response, status, headers) {
		$scope.refreshDocumentList ();
		console.info('onCompleteItem', fileItem, response, status, headers);
	};
	uploader.onCompleteAll = function () {
		console.info('onCompleteAll');
	};
	
	$scope.Remove = function (file) {
		DocumentService.removeDocument (file)
			// Removes the file in question and then updates the document list
			.then (function (files) {$scope.files = files;})
			.catch ($window.alert);
	}

	$scope.Close = function () {
		$modalInstance.dismiss('No');
	};
}]);
"use strict";

/*
 * Linked List implementation in JavaScript
 * Copyright (c) 2009 Nicholas C. Zakas
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * A linked list implementation in JavaScript.
 * @class LinkedList
 * @constructor
 */
function LinkedList() {

	/**
	 * The number of items in the list.
	 * @property _length
	 * @type int
	 * @private
	 */
	this._length = 0;

	/**
	 * Pointer to first item in the list.
	 * @property _head
	 * @type Object
	 * @private
	 */
	this._head = null;
}

LinkedList.prototype = {

	//restore constructor
	constructor: LinkedList,

	/**
	 * Appends some data to the end of the list. This method traverses
	 * the existing list and places the value at the end in a new item.
	 * @param {variant} data The data to add to the list.
	 * @return {Void}
	 * @method add
	 */
	add: function (data) {

		//create a new item object, place data in
		var node = {
				data: data,
				next: null
			},

			//used to traverse the structure
			current;

		//special case: no items in the list yet
		if (this._head === null) {
			this._head = node;
		} else {
			current = this._head;

			while (current.next) {
				current = current.next;
			}

			current.next = node;
		}

		//don't forget to update the count
		this._length++;

	},

	/**
	 * Retrieves the data in the given position in the list.
	 * @param {int} index The zero-based index of the item whose value 
	 *      should be returned.
	 * @return {variant} The value in the "data" portion of the given item
	 *      or null if the item doesn't exist.
	 * @method item
	 */
	item: function (index) {

		//check for out-of-bounds values
		if (index > -1 && index < this._length) {
			var current = this._head,
				i = 0;

			while (i++ < index) {
				current = current.next;
			}

			return current.data;
		} else {
			return null;
		}
	},

	/**
	 * Removes the item from the given location in the list.
	 * @param {int} index The zero-based index of the item to remove.
	 * @return {variant} The data in the given position in the list or null if
	 *      the item doesn't exist.
	 * @method remove
	 */
	remove: function (index) {

		//check for out-of-bounds values
		if (index > -1 && index < this._length) {

			var current = this._head,
				previous,
				i = 0;

			//special case: removing first item
			if (index === 0) {
				this._head = current.next;
			} else {

				//find the right location
				while (i++ < index) {
					previous = current;
					current = current.next;
				}

				//skip over the item to remove
				previous.next = current.next;
			}

			//decrement the length
			this._length--;

			//return the value
			return current.data;

		} else {
			return null;
		}

	},

	/**
	 * Returns the number of items in the list.
	 * @return {int} The number of items in the list.
	 * @method size
	 */
	size: function () {
		return this._length;
	},

	/**
	 * Converts the list into an array.
	 * @return {Array} An array containing all of the data in the list.
	 * @method toArray
	 */
	toArray: function () {
		var result = [],
			current = this._head;

		while (current) {
			result.push(current.data);
			current = current.next;
		}

		return result;
	},

	/**
	 * Converts the list into a string representation.
	 * @return {String} A string representation of the list.
	 * @method toString
	 */
	toString: function () {
		return this.toArray().toString();
	}
};

function findSubList(listOfLists, emailaddress) {
	if (emailaddress) {
		// Search to see if the emailaddress has already been allocated to a list
		for (var j = 0; j < listOfLists.size(); ++j) {
			for (var k = 0; k < listOfLists.item(j).size(); ++k) {
				if (listOfLists.item(j).item(k).emailaddress.toLowerCase() == emailaddress.toLowerCase() &&
					!listOfLists.item(j).item(k).student) // students are always their own sublist
				{
					return listOfLists.item(j);
				}
			}
		}
	}
	return null;
}

function AddMemberToSublist(SubList, member) {
	// Students are their own sublist
	if (member.student)
		return;

	// Search to see if the emailaddress has already been allocated to a list
	for (var i = 0; i < SubList.size(); ++i) {
		// If the member is already in the sublist or a student, then nothing to do
		if (SubList.item(i)._id === member._id)
			return;
	}

	// Member not found - add to the  sublist
	SubList.add(member);
}

function CountTotalInSublists(listOfLists) {
	var count = 0;
	for (var i = 0; i < listOfLists.size(); ++i) {
		count += listOfLists.item(i).size();
		if (listOfLists.item(i).size() > 1) {
			console.log('Multiple sublist');
			for (var j = 0; j < listOfLists.item(i).size(); ++j) {
				console.log('email address, _id, Firstname, Family Name: ' +
					listOfLists.item(i).item(j).emailaddress, +', ' +
					listOfLists.item(i).item(j)._id + ', ' +
					listOfLists.item(i).item(j).firstname + ', ' +
					listOfLists.item(i).item(j).familyname);
			}
		}
	}
	return count;
}

angular.module('ttc')
	.controller('FeeManagementController', ['$scope', '$modalInstance', 'UserService', 'MemberService', '$log', '$window',
	function ($scope, $modalInstance, UserService, MemberService, $log, $window) {

			$scope.unpaidonly = false;
			$scope.user = UserService;

			function GenerateAccounts(members) {
				var listOfLists = new LinkedList;

				$scope.accounts = [];

				var StartOfSeason = moment('2016-04-01');

				for (var i = 0; i < members.length; ++i) {

					// Ensure that every member document has a 'paid' field
					if (typeof members[i].paid === 'undefined') {
						members[i].paid = false;
					}

					var FamilyMemberSubList;
					var MemberSublist;

					// Students get special treatment - give them their own sublist
					if (members[i].student) {
						MemberSublist = new LinkedList;
						MemberSublist.add(members[i]);
						listOfLists.add(MemberSublist);
					} else {

						// Search to see if the member's familyemailaddress has already been allocated to a list
						if (FamilyMemberSubList = findSubList(listOfLists, members[i].familyemailaddress)) {
							// If so, the member should be added to that same sublist if not already there
							AddMemberToSublist(FamilyMemberSubList, members[i]);
						} else {
							// Check to see if we need a new sublist
							if (!(MemberSublist = findSubList(listOfLists, members[i].emailaddress))) {
								MemberSublist = new LinkedList;
								MemberSublist.add(members[i]);

								// Add the new sublist to the list of lists
								listOfLists.add(MemberSublist);
							}

							// Include those members using the same emailaddress or familyemailaddress
							for (var j = i + 1; j < members.length; ++j)
								if (members[i].emailaddress.toLowerCase() === members[j].emailaddress.toLowerCase() ||
									(members[i].familyemailaddress && members[i].familyemailaddress.toLowerCase() === members[j].emailaddress.toLowerCase()) ||
									(members[j].familyemailaddress && (members[i].emailaddress.toLowerCase() === members[j].familyemailaddress.toLowerCase()))
								) {
									AddMemberToSublist(MemberSublist, members[j]);
								}
						}
					}
				}
				console.log('Total Members: ', members.length);
				console.log('Total sublists: ', listOfLists.size());
				console.log('Total count in sub lists: ', CountTotalInSublists(listOfLists));

				// Now create the accounts from the listOfLists
				$scope.accounts = [];
				for (var i = 0; i < listOfLists.size(); ++i) {
					// The name of the oldest person is to be the name of the account
					var oldest = 0;
					for (var j = 1; j < listOfLists.item(i).size(); ++j)
						if (listOfLists.item(i).item(j).dob < listOfLists.item(i).item(oldest).dob)
							oldest = j;

						// If everyone in a sublist is flagged as paid, 
						// then the Account as a whole is flagged as paid
					var paid = true;
					for (var j = 0; j < listOfLists.item(i).size(); ++j) {
						paid = paid && listOfLists.item(i).item(j).paid;
					}

					// Determine the fees for the account
					var fees = 0;
					fee_calculation: {
						var adults = 0;
						var juniors = 0;
						var execs = 0; // Execs get a discount
						var lifetimes = 0; // Lifetime members pay no fees

						for (var j = 0; j < listOfLists.item(i).size(); ++j) {

							// Students get special handling
							if (listOfLists.item(i).item(j).student) {
								fees = '105.00';
								break fee_calculation;
							}

							// Younger than 18 is a junior
							var dob = moment(listOfLists.item(i).item(j).dob, ['MM-DD-YYYY', 'YYYY-MM-DD']);
							var diff = StartOfSeason.diff(dob, 'years');
							if (diff < 18)
								++juniors;
							else
								++adults;

							if (Boolean(listOfLists.item(i).item(j).exec) && listOfLists.item(i).item(j).exec != 'lifetime')
								++execs;

							if (Boolean(listOfLists.item(i).item(j).exec) && listOfLists.item(i).item(j).exec == 'lifetime')
								++lifetimes;
						}

						var SinglesFee = 246.75;
						var CouplesFee = 388.50;

						if (adults == 1) {
							if (juniors == 0)
								fees = SinglesFee;
							else if (juniors == 1)
								fees = 300.00
							else if (juniors >= 2)
								fees = 350.00
						} else if (adults == 2) {
							if (juniors == 0)
								fees = CouplesFee;
							else
								fees = 450.00;
						} else if (adults == 3) { // A junior will be 18 on April 1st
							fees = 450.00;
						} else {
							console.log('adults, juniors, execs: ' + adults + ', ' + juniors + ', ' + execs);
							fees = 'ERROR'; // We have a problem if here.
						}

						if (adults == 1 && lifetimes == 1) {
							fees = 0;
						} else if (adults == 2 && lifetimes == 1) {
							fees = SinglesFee;
						}

						for (var exec_i = 0; exec_i < execs; ++exec_i)
							fees -= SinglesFee / 2.0;
					}

					// Only deal with dollars
					fees = Math.round(fees);

					// Create the tooltips for the account
					var tooltip = "";
					for (var j = 0; j < listOfLists.item(i).size(); ++j) {
						tooltip += _.capitalize(listOfLists.item(i).item(j).firstname + ' ' +
							listOfLists.item(i).item(j).familyname + ', DoB: ' +
							listOfLists.item(i).item(j).dob);
						if (j < listOfLists.item(i).size() - 1) tooltip += ' | '
					}

					var account = {
						members: listOfLists.item(i).toArray(),
						accountname: _.capitalize(listOfLists.item(i).item(oldest).familyname + ', ' + listOfLists.item(i).item(oldest).firstname),
						emailaddress: listOfLists.item(i).item(oldest).emailaddress,
						paid: paid,
						fees: fees,
						tooltip: tooltip
					};
					$scope.accounts.push(account);
				}
				$scope.accounts.sort(function (a, b) {
					if (a.accountname > b.accountname) return 1;
					if (a.accountname < b.accountname) return -1;
					return 0;
				});
			}

			MemberService.getAllMembers()
				.then(function (data) {
					$scope.members = data;
					GenerateAccounts($scope.members);
				})
				.catch(function (err) {
					$window.alert(err);
				});

			$scope.Toggle = function (account) {
				for (var i = 0; i < account.members.length; ++i) {
					account.members[i].paid = !account.paid;
					MemberService.saveMember(account.members[i], function (err) {
						if (err)
							$window.alert(err);
					});
				}
			}

			$scope.Close = function () {
				$modalInstance.dismiss('No');
			}
}]);
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

"use strict";

// Controller for the main Index.html page
angular.module('ttc')
.controller ('IndexController',['$scope', 'UserService', '$modal', '$log', 'deviceDetector', function ($scope, UserService, $modal, $log, deviceDetector) {
		$scope.user 	= UserService;
		$scope.device	= deviceDetector;
		
		// Opens the modals
		$scope.open = function (whichSize, whichModal, whichController) {
			$log.info ('Open Modal');
			var modalInstance = $modal.open({
				templateUrl: whichModal,
				controller: whichController,
				size: whichSize,
				backdrop: true,
				resolve: {}
			});

			modalInstance.result.then(function () {
				$log.info ('Modal closed at: ' + new Date());
			}, function () {
				$log.info ('Modal dismissed at: ' + new Date());
			});
		};
	}
]);

"use strict";

angular.module('ttc')
.controller("HomeController", ['$scope', 'MemberService', '$modal', '$log', 'NewsItemService', 'deviceDetector',
function ($scope, MemberService, $modal, $log, NewsItemService, deviceDetector) {

	$scope.device 		=		deviceDetector;
	
	$scope.MemberCount 	= 		0;
	MemberService.CountMembers () 
		.then (function (data) {$scope.MemberCount = data;});
	
	$scope.MembersByDecade = [[]];
	$scope.MembersByDecadeLabels = ["0-9", "10-19", "20-29", "30-39", "40-49", "50-59", "60-69", "70-79", "80-89"];
	$scope.MembersByDecadeSeries = ['Members By Decade'];
	/*MemberService.CountMembersByDecade ()
		.then (function (data) {$scope.MembersByDecade[0] = data;});
	*/

	$scope.MembersByBirthMonth = [[]];
	$scope.MembersByBirthMonthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	$scope.MembersByBirthMonthSeries = ['Members By Birth Month'];
	/*MemberService.CountMembersByBirthMonth ()
		.then (function (data) {$scope.MembersByBirthMonth[0] = data;});
	*/

	$scope.onClick = function (points, evt) {
		console.log(points, evt);
	};
	
	NewsItemService.getAll ()
		.then (function (NewsItems) {$scope.NewsItems = NewsItems;});

	// Opens the Mission & Values modal
	$scope.openMissionAndValues = function () {
		$log.info ('Open Modal');
		var modalInstance = $modal.open({
			templateUrl: '/ng-templates/mission-and-values.html',
			controller: 'MissionAndValuesController',
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
}]);

angular.module('ttc')
.controller('MissionAndValuesController', ['$scope', '$modalInstance',
	function ($scope, $modalInstance) {

		$scope.Close = function () {
			$modalInstance.dismiss ('cancel');
		};
	}]);

"use strict";

// Join Controller
angular.module('ttc').controller('NewMembershipController', ['$scope', 'placesService', '$modalInstance', '$log', '$window', '$modal', 'MemberService',
function ($scope, placesService, $modalInstance, $log, $window, $modal, MemberService) {

		$scope.TTCDebug				= false;
	
		$scope.new_applicant = true;
		$scope.member = {};
		// Default the checkboxes to unchecked
		$scope.member.liabilityagreed = $scope.member.communicationsagreed = $scope.member.photoagreed = $scope.member.student = false;

		$scope.places = placesService.get();

		$scope.Submit = function () {

			// Record the year of the application request
			$scope.member.joiningyear = moment().year();

			MemberService.saveNewMember($scope.member)
				.then(function () {
					$modalInstance.close('Yes');
					$window.alert('Your application to join the Tsawwassen Tennis Club has been saved.  ' +
						'Membership fees are due by March 31.  The fee structure and payment instructions can be found on the About Us page. ' +
						'Once your fees are paid, you will be able to Login using your email address and the password you provided.');
				})
				.catch($window.alert);
		}

		$scope.Cancel = function () {
			$modalInstance.dismiss('No');
		}

		$scope.normalizeCanadianPostalCodes = function () {
			$scope.member.postcode = $scope.member.postcode.replace(' ', '').toUpperCase();
		}

		$scope.normalizePrimaryPhoneNumber = function () {
			$scope.member.primaryphone = normalizePhoneNumber($scope.member.primaryphone);
		}

		$scope.normalizeAlternativePhoneNumber = function () {
			$scope.member.alternativephone = normalizePhoneNumber($scope.member.alternativephone);
		};

		// Opens the Mission & Values modal
		$scope.openReleaseOfLiability = function () {
			var modalInstance = $modal.open({
				templateUrl: '/ng-templates/release-of-liability-waiver-and-claims.html',
				controller: 'ReleaseOfLiabilityController',
				size: '',
				backdrop: true,
				resolve: {}
			});

			modalInstance.result.then(function () {
				$log.info('Modal closed at: ' + new Date());
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
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
				$log.info('Modal closed at: ' + new Date());
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};

		// Opens the Mission & Values modal
		$scope.openPhotographConsent = function () {
			$log.info('Open Modal');
			var modalInstance = $modal.open({
				templateUrl: '/ng-templates/photograph-consent.html',
				controller: 'PhotographConsentController',
				size: '',
				backdrop: true,
				resolve: {}
			});

			modalInstance.result.then(function () {
				$log.info('Modal closed at: ' + new Date());
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};

		// Open the Fee Structure modal
		$scope.openFeeStructure = function () {
			$log.info('Open Modal');
			var modalInstance = $modal.open({
				templateUrl: '/ng-templates/fees.html',
				controller: 'NewMembershipFeeStructureController',
				size: 'sm',
				backdrop: true,
				resolve: {}
			});

			modalInstance.result.then(function () {
				$log.info('Modal closed at: ' + new Date());
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};
}]);

angular.module('ttc')
	.controller('NewMembershipFeeStructureController', ['$scope', '$modalInstance',
	function ($scope, $modalInstance) {

			$scope.Close = function () {
				$modalInstance.dismiss('cancel');
			};
	}]);
"use strict";

// Login Controller
angular.module('ttc')
	.controller("loginCtrl", ['$scope', 'UserService', '$modalInstance', '$log', '$window', 'MemberService',
function ($scope, UserService, $modalInstance, $log, $window, MemberService)
		{
			$scope.member = {};
			$scope.already_have_a_password = 'Yes'; // As a default

			$scope.Login = function () {

				MemberService.loginMember($scope.already_have_a_password == 'Yes', $scope.member)
					.then(function (privileges) {
						console.log ('MemberService.loginMember, privileges:\n', privileges);
						UserService.loggedIn (privileges);
						$window.alert ('Login is Successful!');
						$modalInstance.close('Yes');
					})
					.catch($window.alert);
			}

			$scope.normalizeCanadianPostalCodes = function () {
				$scope.member.postcode = $scope.member.postcode.replace(' ', '').toUpperCase();
			};

			$scope.Cancel = function () {
				$modalInstance.dismiss('No');
			};

}]);
"use strict";

angular.module('ttc')
.controller('MemberTableController', ['$scope', '$log', 'MemberService', 'UserService', '$window',
function ($scope, $log, MemberService, UserService, $window) {
	
	$scope.user 				= UserService;
	$scope.unpaidonly 			= false;
	$scope.notrenewedonly 		= false;
	$scope.allemailaddresses 	= [];
	
	MemberService.getAllEmailAddresses ()
		.then  (function (emailaddresses) {$scope.allemailaddresses = emailaddresses;})
		.catch ($window.alert);	

	MemberService.getAllMembers ()
		.then  (function (data) {$scope.members = data;})
		.catch ($window.alert);
	
	$scope.TogglePaid = function (member) {
		member.paid = !member.paid;
		MemberService.saveMember (member)
			.catch ($window.alert);
	}
	
	$scope.ToggleStudent = function (member) {
		member.student = !member.student;
		MemberService.saveMember (member)
			.catch ($window.alert);
	}

	$scope.SelectExec = function (member) {
		console.log ('member: ', member);
		MemberService.saveMember (member)
			.catch ($window.alert);
	}

	$scope.UpdateFamilyEmailAddress = function (member) {
		console.log (member);

		console.log ('UpdateFamilyEmailAddress: ', member.familyemailaddress);
		
		if (member.familyemailaddress == "" || $scope.allemailaddresses.indexOf (member.familyemailaddress) >= 0)
				MemberService.saveMember (member)
					.catch ($window.alert);
		else
			$window.alert ('Family Email Address is Unknown - Not Saved');
	}
}]);
"use strict";

angular.module('ttc')
.controller('NewsCtrl', ['$scope', '$log', 'NewsItemService', '$window', 'UserService',
function ($scope, $log, NewsItemService, $window, UserService) {
	
	$scope.user = UserService;
	
	function GetAllNewsItems () {
		NewsItemService.getAll ()
			.then (function (NewsItems) {$scope.NewsItems = NewsItems;})
			.catch($window.alert);
	}
	
	$scope.RemoveNewsItem = function (newsitem) {
		NewsItemService.removeNewsItem (newsitem._id)
			// Refresh the set of newsitems
			.then (GetAllNewsItems)
			.catch($window.alert);
	}
	
	GetAllNewsItems ();
}]);

angular.module('ttc')
.controller('NewsItemFilesController', ['$scope', '$log', 'NewsItemService',
function ($scope, $log, NewsItemService) {

	NewsItemService.retrieveFiles ($scope.$parent.NewsItem._id)
		.then (function (NewsItemFiles) {$scope.NewsItemFiles = NewsItemFiles;});
}]);
	

'use strict';

angular.module('ttc')
.controller('NewsItemManagementController', ['$scope', '$http', 'FileUploader', '$modalInstance', 'UserService', '$log', 'NewsItemService', '$window',
function documentUploadController ($scope, $http, FileUploader, $modalInstance, UserService, $log, NewsItemService, $window) {
	
		$scope.newsItem = {};
	
		var uploader = $scope.uploader = new FileUploader({
			url: '/api/newsitem-image-upload'
		});
	
		// FILTERS
		uploader.filters.push({
			name: 'imageFilter',
			fn: function (item, options) {
				var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
				return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
			}
		});

		// CALLBACKS
		uploader.onWhenAddingFileFailed = function (item, filter, options) {
			console.info('onWhenAddingFileFailed', item, filter, options);
		};
		uploader.onAfterAddingFile = function (fileItem) {
			console.info('onAfterAddingFile', fileItem);
		};
		uploader.onAfterAddingAll = function (addedFileItems) {
			console.info('onAfterAddingAll', addedFileItems);
		};
		uploader.onBeforeUploadItem = function (item) {
			item.headers.newsitemid = $scope.newsItem._id;
			console.info('onBeforeUploadItem', item);
		};
		uploader.onProgressItem = function (fileItem, progress) {
			console.info('onProgressItem', fileItem, progress);
		};
		uploader.onProgressAll = function (progress) {
			console.info('onProgressAll', progress);
		};
		uploader.onSuccessItem = function (fileItem, response, status, headers) {
			console.info('onSuccessItem', fileItem, response, status, headers);
		};
		uploader.onErrorItem = function (fileItem, response, status, headers) {
			console.info('onErrorItem', fileItem, response, status, headers);
		};
		uploader.onCancelItem = function (fileItem, response, status, headers) {
			console.info('onCancelItem', fileItem, response, status, headers);
		};
		uploader.onCompleteItem = function (fileItem, response, status, headers) {
			console.info('onCompleteItem', fileItem, response, status, headers);
		};
		uploader.onCompleteAll = function () {
			console.info('onCompleteAll');
		}
	
		NewsItemService.getNewObjectId ()
			.then (function (newsitemid) {$scope.newsItem._id = newsitemid;})
			.catch($window.alert);

		$scope.Publish = function () {
			NewsItemService.publishNewsItem ($scope.newsItem)
				.then (function () {$modalInstance.dismiss('Yes'); $window.alert ('Your News Item has been successfully published')})
				.catch ($window.alert);
		}

		$scope.Close = function () {
			// Any errors are picked up by the server
			NewsItemService.removeNewsItem ($scope.newsItem._id)
				.finally ($modalInstance.dismiss('Yes'));
		}
    }]);
"use strict";

// Logout Controller
angular.module('ttc')
.controller('logoutCtrl', ['$scope', '$modalInstance', 'UserService', '$log', 
function ($scope, $modalInstance, UserService, $log) {
	$scope.ok = function () {
		UserService.loggedOut();
		$modalInstance.close ('Yes');
	};

	$scope.cancel = function () {
		$modalInstance.dismiss ('No');
	};
}]);
"use strict";

// Search Membership Controller
angular.module('ttc').controller ('SearchMembershipCtrl', ['$scope', '$log', 'MemberService', '$window',
function ($scope, $log, MemberService, $window) {
	
	MemberService.getAllMembers ()
		.then  (function (data) {$scope.members = data;})
		.catch ($window.alert);
}]);

"use strict";

// Renew Membership Controller
angular.module('ttc')
.controller('renewMembershipCtrl', ['$scope', 'placesService', 'MemberService', '$modalInstance', '$log', '$window', '$modal',
function ($scope, placesService, MemberService, $modalInstance, $log, $window, $modal) {
	
	$scope.member 				= {};
	$scope.allemailaddresses	= [];
	$scope.places 				= placesService.get ();
	$scope.TTCDebug				= false;

	MemberService.getAllMembers ()
		.then  (function (members) {for (var i=0; i<members.length; ++i) $scope.allemailaddresses.push (members[i].emailaddress);})
		.catch ($window.alert);	

	MemberService.getMember ()
		.then (function (member) {
			$scope.member 				= member; 
			$scope.confirmemailaddress 	= member.emailaddress; 
			$scope.member.student 				= false; 
			$scope.member.liabilityagreed 		= false;
			$scope.member.communicationsagreed 	= false;
			$scope.member.photoagreed 			= false;
			$scope.member.joining_year			= undefined;	
		})
		.catch ($window.alert);

	$scope.Submit = function () {
	 	MemberService.saveMember ($scope.member)
			.then (function () {$modalInstance.close('Yes'); $window.alert ('Renewal Application Accepted.  All fees must be paid on or before March 31st.');})
			.catch (function (err) {$window.alert (err );});
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
		console.log ('Open Modal');
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
	
	// Opens the Mission & Values modal
	$scope.openFeeStructure = function () {
		$log.info ('Open Modal');
		var modalInstance = $modal.open({
			templateUrl: '/ng-templates/fees.html',
			controller: 'FeeStructureController',
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
.controller('FeeStructureController', ['$scope', '$modalInstance',
	function ($scope, $modalInstance) {

		$scope.Close = function () {
			$modalInstance.dismiss ('cancel');
		};
	}]);

"use strict";

// eBlasts Controller
angular.module('ttc')
.controller('eBlastsCtrl', ['$scope', '$http', 'UserService', '$window', '$log', 
function ($scope, $http, UserService, $window, $log) {
	
	$scope.busyPromise = $http.post ('/api/get-eblasts', null, {headers: {'x-auth': UserService.getToken ()}});
	$scope.busyPromise
		.then (function (response) {$scope.emails = response.data})
		.catch(function (response) {$window.alert (response.data)});
}]);

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
"use strict";
// A trivial service from which to maintain the set of places where members reside
angular.module('ttc').factory('placesService', ['$log', function ($log) {
        var places = ['Tsawwassen, BC, Canada', 'Delta, BC, Canada', 'Surrey, BC, Canada', 'Richmond, BC, Canada',
            'Vancouver, BC, Canada', 'Point Roberts, WA, USA', 'Burnaby, BC, Canada', 'New Westminster, BC, Canada'];
        return {
            get: function () {
                return places;
            }
        };
    }]);
//# sourceMappingURL=PlacesService.js.map
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
var compareTo = function () {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function (scope, element, attributes, ngModel) {
            ngModel.$validators.compareTo = function (modelValue) {
                console.log("first, second model value: " + modelValue + ', ' + scope.otherModelValue);
                return modelValue == scope.otherModelValue;
            };
            scope.$watch("otherModelValue", function () {
                ngModel.$validate();
            });
        }
    };
};
angular.module('ttc').directive('compareTo', compareTo);
//# sourceMappingURL=compareTo.js.map
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
angular.module('ttc').directive('dateField', ["$filter", function ($filter) {
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
}]);
angular.module('ttc').directive('ttcFamilyEmailaddressAttr', ["$filter", function ($filter) {
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
}]);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFwcC5yb3V0ZS5qcyIsIkNvbnRhY3RVcy9Db250YWN0VXNDb250cm9sbGVyLmpzIiwiQ2hhbmdlUGFzc3dvcmQvQ2hhbmdlUGFzc3dvcmRDb250cm9sbGVyLmpzIiwiRG9jdW1lbnRVcGxvYWQvRG9jdW1lbnRVcGxvYWRDb250cm9sbGVyLmpzIiwiRmVlTWFuYWdlbWVudC9GZWVNYW5hZ2VtZW50Q29udHJvbGxlci5qcyIsIkVkaXRQZXJzb25hbEluZm8vRWRpdFBlcnNvbmFsSW5mb0NvbnRyb2xsZXIuanMiLCJJbmRleC9pbmRleENvbnRyb2xsZXIuanMiLCJIb21lL0hvbWVDb250cm9sbGVyLmpzIiwiTmV3TWVtYmVyc2hpcC9OZXdNZW1iZXJzaGlwQ29udHJvbGxlci5qcyIsIkxvZ2luL0xvZ2luQ29udHJvbGxlci5qcyIsIk1lbWJlclRhYmxlL01lbWJlclRhYmxlQ29udHJvbGxlci5qcyIsIk5ld3MvTmV3c0NvbnRyb2xsZXIuanMiLCJOZXdzSXRlbU1hbmFnZW1lbnQvTmV3c0l0ZW1NYW5hZ2VtZW50Q29udHJvbGxlci5qcyIsIkxvZ291dC9Mb2dvdXRDb250cm9sbGVyLmpzIiwiU2VhcmNoTWVtYmVyc2hpcC9TZWFyY2hNZW1iZXJzaGlwQ29udHJvbGxlci5qcyIsIlJlbmV3TWVtYmVyc2hpcC9SZW5ld01lbWJlcnNoaXBDb250cm9sbGVyLmpzIiwiZUJsYXN0cy9lQmxhc3RzQ29udHJvbGxlci5qcyIsIkRvY3VtZW50U2VydmljZS5qcyIsIk1lbWJlclNlcnZpY2UuanMiLCJOZXdzSXRlbVNlcnZpY2UuanMiLCJQbGFjZXNTZXJ2aWNlLmpzIiwiVXNlclNlcnZpY2UuanMiLCJjb21wYXJlVG8uanMiLCJlZGl0b3ItZGlyZWN0aXZlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBLElBQUEsTUFBQSxRQUFBLE9BQUEsT0FBQSxDQUFBLFdBQUEsZ0JBQUEsY0FBQSxjQUFBLGFBQUEsVUFBQSxxQkFBQSxPQUFB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QSxTQUFBLFFBQUEsS0FBQTtZQUNBLE1BQUE7WUFDQSxJQUFBLFNBQUEsTUFBQSxTQUFBO2dCQUNBLElBQUEsT0FBQSxNQUFBLEtBQUEsS0FBQSxNQUFBLEtBQUEsS0FBQSxZQUFBLE9BQUEsS0FBQTtJQUNBLFFBQUEsS0FBQSxlQUFBO2dCQUNBLE9BQUEsWUFBQSxRQUFBLFVBQUEsQ0FBQTs7Ozs7Q0FLQSxTQUFBLHlCQUFBLFVBQUEsTUFBQSxRQUFBLFNBQUE7RUFDQSxRQUFBLEtBQUEsMEJBQUEsTUFBQSxRQUFBOztDQUVBLFNBQUEsb0JBQUEsVUFBQSxVQUFBO0VBQ0EsUUFBQSxLQUFBLHFCQUFBOztDQUVBLFNBQUEsbUJBQUEsVUFBQSxnQkFBQTtFQUNBLFFBQUEsS0FBQSxvQkFBQTs7Q0FFQSxTQUFBLHFCQUFBLFVBQUEsTUFBQTtFQUNBLFFBQUEsS0FBQSxzQkFBQTs7Q0FFQSxTQUFBLGlCQUFBLFVBQUEsVUFBQSxVQUFBO0VBQ0EsUUFBQSxLQUFBLGtCQUFBLFVBQUE7O0NBRUEsU0FBQSxnQkFBQSxVQUFBLFVBQUE7RUFDQSxRQUFBLEtBQUEsaUJBQUE7O0NBRUEsU0FBQSxnQkFBQSxVQUFBLFVBQUEsVUFBQSxRQUFBLFNBQUE7RUFDQSxRQUFBLEtBQUEsaUJBQUEsVUFBQSxVQUFBLFFBQUE7O0NBRUEsU0FBQSxjQUFBLFVBQUEsVUFBQSxVQUFBLFFBQUEsU0FBQTtFQUNBLFFBQUEsS0FBQSxlQUFBLFVBQUEsVUFBQSxRQUFBOztDQUVBLFNBQUEsZUFBQSxVQUFBLFVBQUEsVUFBQSxRQUFBLFNBQUE7RUFDQSxRQUFBLEtBQUEsZ0JBQUEsVUFBQSxVQUFBLFFBQUE7O0NBRUEsU0FBQSxpQkFBQSxVQUFBLFVBQUEsVUFBQSxRQUFBLFNBQUE7RUFDQSxPQUFBO0VBQ0EsUUFBQSxLQUFBLGtCQUFBLFVBQUEsVUFBQSxRQUFBOztDQUVBLFNBQUEsZ0JBQUEsWUFBQTtFQUNBLFFBQUEsS0FBQTs7O0NBR0EsT0FBQSxTQUFBLFVBQUEsTUFBQTtFQUNBLGdCQUFBLGdCQUFBOztJQUVBLE1BQUEsVUFBQSxPQUFBLENBQUEsT0FBQSxRQUFBO0lBQ0EsT0FBQSxRQUFBOzs7Q0FHQSxPQUFBLFFBQUEsWUFBQTtFQUNBLGVBQUEsUUFBQTs7O0FDakZBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE4QkEsU0FBQSxhQUFBOzs7Ozs7OztDQVFBLEtBQUEsVUFBQTs7Ozs7Ozs7Q0FRQSxLQUFBLFFBQUE7OztBQUdBLFdBQUEsWUFBQTs7O0NBR0EsYUFBQTs7Ozs7Ozs7O0NBU0EsS0FBQSxVQUFBLE1BQUE7OztFQUdBLElBQUEsT0FBQTtJQUNBLE1BQUE7SUFDQSxNQUFBOzs7O0dBSUE7OztFQUdBLElBQUEsS0FBQSxVQUFBLE1BQUE7R0FDQSxLQUFBLFFBQUE7U0FDQTtHQUNBLFVBQUEsS0FBQTs7R0FFQSxPQUFBLFFBQUEsTUFBQTtJQUNBLFVBQUEsUUFBQTs7O0dBR0EsUUFBQSxPQUFBOzs7O0VBSUEsS0FBQTs7Ozs7Ozs7Ozs7O0NBWUEsTUFBQSxVQUFBLE9BQUE7OztFQUdBLElBQUEsUUFBQSxDQUFBLEtBQUEsUUFBQSxLQUFBLFNBQUE7R0FDQSxJQUFBLFVBQUEsS0FBQTtJQUNBLElBQUE7O0dBRUEsT0FBQSxNQUFBLE9BQUE7SUFDQSxVQUFBLFFBQUE7OztHQUdBLE9BQUEsUUFBQTtTQUNBO0dBQ0EsT0FBQTs7Ozs7Ozs7Ozs7Q0FXQSxRQUFBLFVBQUEsT0FBQTs7O0VBR0EsSUFBQSxRQUFBLENBQUEsS0FBQSxRQUFBLEtBQUEsU0FBQTs7R0FFQSxJQUFBLFVBQUEsS0FBQTtJQUNBO0lBQ0EsSUFBQTs7O0dBR0EsSUFBQSxVQUFBLEdBQUE7SUFDQSxLQUFBLFFBQUEsUUFBQTtVQUNBOzs7SUFHQSxPQUFBLE1BQUEsT0FBQTtLQUNBLFdBQUE7S0FDQSxVQUFBLFFBQUE7Ozs7SUFJQSxTQUFBLE9BQUEsUUFBQTs7OztHQUlBLEtBQUE7OztHQUdBLE9BQUEsUUFBQTs7U0FFQTtHQUNBLE9BQUE7Ozs7Ozs7Ozs7Q0FVQSxNQUFBLFlBQUE7RUFDQSxPQUFBLEtBQUE7Ozs7Ozs7O0NBUUEsU0FBQSxZQUFBO0VBQ0EsSUFBQSxTQUFBO0dBQ0EsVUFBQSxLQUFBOztFQUVBLE9BQUEsU0FBQTtHQUNBLE9BQUEsS0FBQSxRQUFBO0dBQ0EsVUFBQSxRQUFBOzs7RUFHQSxPQUFBOzs7Ozs7OztDQVFBLFVBQUEsWUFBQTtFQUNBLE9BQUEsS0FBQSxVQUFBOzs7O0FBSUEsU0FBQSxZQUFBLGFBQUEsY0FBQTtDQUNBLElBQUEsY0FBQTs7RUFFQSxLQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsWUFBQSxRQUFBLEVBQUEsR0FBQTtHQUNBLEtBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxZQUFBLEtBQUEsR0FBQSxRQUFBLEVBQUEsR0FBQTtJQUNBLElBQUEsWUFBQSxLQUFBLEdBQUEsS0FBQSxHQUFBLGFBQUEsaUJBQUEsYUFBQTtLQUNBLENBQUEsWUFBQSxLQUFBLEdBQUEsS0FBQSxHQUFBO0lBQ0E7S0FDQSxPQUFBLFlBQUEsS0FBQTs7Ozs7Q0FLQSxPQUFBOzs7QUFHQSxTQUFBLG1CQUFBLFNBQUEsUUFBQTs7Q0FFQSxJQUFBLE9BQUE7RUFDQTs7O0NBR0EsS0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLFFBQUEsUUFBQSxFQUFBLEdBQUE7O0VBRUEsSUFBQSxRQUFBLEtBQUEsR0FBQSxRQUFBLE9BQUE7R0FDQTs7OztDQUlBLFFBQUEsSUFBQTs7O0FBR0EsU0FBQSxxQkFBQSxhQUFBO0NBQ0EsSUFBQSxRQUFBO0NBQ0EsS0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLFlBQUEsUUFBQSxFQUFBLEdBQUE7RUFDQSxTQUFBLFlBQUEsS0FBQSxHQUFBO0VBQ0EsSUFBQSxZQUFBLEtBQUEsR0FBQSxTQUFBLEdBQUE7R0FDQSxRQUFBLElBQUE7R0FDQSxLQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsWUFBQSxLQUFBLEdBQUEsUUFBQSxFQUFBLEdBQUE7SUFDQSxRQUFBLElBQUE7S0FDQSxZQUFBLEtBQUEsR0FBQSxLQUFBLEdBQUEsY0FBQSxDQUFBO0tBQ0EsWUFBQSxLQUFBLEdBQUEsS0FBQSxHQUFBLE1BQUE7S0FDQSxZQUFBLEtBQUEsR0FBQSxLQUFBLEdBQUEsWUFBQTtLQUNBLFlBQUEsS0FBQSxHQUFBLEtBQUEsR0FBQTs7OztDQUlBLE9BQUE7OztBQUdBLFFBQUEsT0FBQTtFQUNBLFdBQUEsMkJBQUEsQ0FBQSxVQUFBLGtCQUFBLGVBQUEsaUJBQUEsUUFBQTtDQUNBLFVBQUEsUUFBQSxnQkFBQSxhQUFBLGVBQUEsTUFBQSxTQUFBOztHQUVBLE9BQUEsYUFBQTtHQUNBLE9BQUEsT0FBQTs7R0FFQSxTQUFBLGlCQUFBLFNBQUE7SUFDQSxJQUFBLGNBQUEsSUFBQTs7SUFFQSxPQUFBLFdBQUE7O0lBRUEsSUFBQSxnQkFBQSxPQUFBOztJQUVBLEtBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxRQUFBLFFBQUEsRUFBQSxHQUFBOzs7S0FHQSxJQUFBLE9BQUEsUUFBQSxHQUFBLFNBQUEsYUFBQTtNQUNBLFFBQUEsR0FBQSxPQUFBOzs7S0FHQSxJQUFBO0tBQ0EsSUFBQTs7O0tBR0EsSUFBQSxRQUFBLEdBQUEsU0FBQTtNQUNBLGdCQUFBLElBQUE7TUFDQSxjQUFBLElBQUEsUUFBQTtNQUNBLFlBQUEsSUFBQTtZQUNBOzs7TUFHQSxJQUFBLHNCQUFBLFlBQUEsYUFBQSxRQUFBLEdBQUEscUJBQUE7O09BRUEsbUJBQUEscUJBQUEsUUFBQTthQUNBOztPQUVBLElBQUEsRUFBQSxnQkFBQSxZQUFBLGFBQUEsUUFBQSxHQUFBLGdCQUFBO1FBQ0EsZ0JBQUEsSUFBQTtRQUNBLGNBQUEsSUFBQSxRQUFBOzs7UUFHQSxZQUFBLElBQUE7Ozs7T0FJQSxLQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxRQUFBLFFBQUEsRUFBQTtRQUNBLElBQUEsUUFBQSxHQUFBLGFBQUEsa0JBQUEsUUFBQSxHQUFBLGFBQUE7VUFDQSxRQUFBLEdBQUEsc0JBQUEsUUFBQSxHQUFBLG1CQUFBLGtCQUFBLFFBQUEsR0FBQSxhQUFBO1VBQ0EsUUFBQSxHQUFBLHVCQUFBLFFBQUEsR0FBQSxhQUFBLGtCQUFBLFFBQUEsR0FBQSxtQkFBQTtVQUNBO1NBQ0EsbUJBQUEsZUFBQSxRQUFBOzs7OztJQUtBLFFBQUEsSUFBQSxtQkFBQSxRQUFBO0lBQ0EsUUFBQSxJQUFBLG9CQUFBLFlBQUE7SUFDQSxRQUFBLElBQUEsOEJBQUEscUJBQUE7OztJQUdBLE9BQUEsV0FBQTtJQUNBLEtBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxZQUFBLFFBQUEsRUFBQSxHQUFBOztLQUVBLElBQUEsU0FBQTtLQUNBLEtBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxZQUFBLEtBQUEsR0FBQSxRQUFBLEVBQUE7TUFDQSxJQUFBLFlBQUEsS0FBQSxHQUFBLEtBQUEsR0FBQSxNQUFBLFlBQUEsS0FBQSxHQUFBLEtBQUEsUUFBQTtPQUNBLFNBQUE7Ozs7S0FJQSxJQUFBLE9BQUE7S0FDQSxLQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsWUFBQSxLQUFBLEdBQUEsUUFBQSxFQUFBLEdBQUE7TUFDQSxPQUFBLFFBQUEsWUFBQSxLQUFBLEdBQUEsS0FBQSxHQUFBOzs7O0tBSUEsSUFBQSxPQUFBO0tBQ0EsaUJBQUE7TUFDQSxJQUFBLFNBQUE7TUFDQSxJQUFBLFVBQUE7TUFDQSxJQUFBLFFBQUE7TUFDQSxJQUFBLFlBQUE7O01BRUEsS0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLFlBQUEsS0FBQSxHQUFBLFFBQUEsRUFBQSxHQUFBOzs7T0FHQSxJQUFBLFlBQUEsS0FBQSxHQUFBLEtBQUEsR0FBQSxTQUFBO1FBQ0EsT0FBQTtRQUNBLE1BQUE7Ozs7T0FJQSxJQUFBLE1BQUEsT0FBQSxZQUFBLEtBQUEsR0FBQSxLQUFBLEdBQUEsS0FBQSxDQUFBLGNBQUE7T0FDQSxJQUFBLE9BQUEsY0FBQSxLQUFBLEtBQUE7T0FDQSxJQUFBLE9BQUE7UUFDQSxFQUFBOztRQUVBLEVBQUE7O09BRUEsSUFBQSxRQUFBLFlBQUEsS0FBQSxHQUFBLEtBQUEsR0FBQSxTQUFBLFlBQUEsS0FBQSxHQUFBLEtBQUEsR0FBQSxRQUFBO1FBQ0EsRUFBQTs7T0FFQSxJQUFBLFFBQUEsWUFBQSxLQUFBLEdBQUEsS0FBQSxHQUFBLFNBQUEsWUFBQSxLQUFBLEdBQUEsS0FBQSxHQUFBLFFBQUE7UUFDQSxFQUFBOzs7TUFHQSxJQUFBLGFBQUE7TUFDQSxJQUFBLGFBQUE7O01BRUEsSUFBQSxVQUFBLEdBQUE7T0FDQSxJQUFBLFdBQUE7UUFDQSxPQUFBO1lBQ0EsSUFBQSxXQUFBO1FBQ0EsT0FBQTtZQUNBLElBQUEsV0FBQTtRQUNBLE9BQUE7YUFDQSxJQUFBLFVBQUEsR0FBQTtPQUNBLElBQUEsV0FBQTtRQUNBLE9BQUE7O1FBRUEsT0FBQTthQUNBLElBQUEsVUFBQSxHQUFBO09BQ0EsT0FBQTthQUNBO09BQ0EsUUFBQSxJQUFBLDZCQUFBLFNBQUEsT0FBQSxVQUFBLE9BQUE7T0FDQSxPQUFBOzs7TUFHQSxJQUFBLFVBQUEsS0FBQSxhQUFBLEdBQUE7T0FDQSxPQUFBO2FBQ0EsSUFBQSxVQUFBLEtBQUEsYUFBQSxHQUFBO09BQ0EsT0FBQTs7O01BR0EsS0FBQSxJQUFBLFNBQUEsR0FBQSxTQUFBLE9BQUEsRUFBQTtPQUNBLFFBQUEsYUFBQTs7OztLQUlBLE9BQUEsS0FBQSxNQUFBOzs7S0FHQSxJQUFBLFVBQUE7S0FDQSxLQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsWUFBQSxLQUFBLEdBQUEsUUFBQSxFQUFBLEdBQUE7TUFDQSxXQUFBLEVBQUEsV0FBQSxZQUFBLEtBQUEsR0FBQSxLQUFBLEdBQUEsWUFBQTtPQUNBLFlBQUEsS0FBQSxHQUFBLEtBQUEsR0FBQSxhQUFBO09BQ0EsWUFBQSxLQUFBLEdBQUEsS0FBQSxHQUFBO01BQ0EsSUFBQSxJQUFBLFlBQUEsS0FBQSxHQUFBLFNBQUEsR0FBQSxXQUFBOzs7S0FHQSxJQUFBLFVBQUE7TUFDQSxTQUFBLFlBQUEsS0FBQSxHQUFBO01BQ0EsYUFBQSxFQUFBLFdBQUEsWUFBQSxLQUFBLEdBQUEsS0FBQSxRQUFBLGFBQUEsT0FBQSxZQUFBLEtBQUEsR0FBQSxLQUFBLFFBQUE7TUFDQSxjQUFBLFlBQUEsS0FBQSxHQUFBLEtBQUEsUUFBQTtNQUNBLE1BQUE7TUFDQSxNQUFBO01BQ0EsU0FBQTs7S0FF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LDJCQUFBLENBQUEsVUFBQSxpQkFBQSxrQkFBQSxRQUFBLFdBQUEsVUFBQTtBQUNBLFVBQUEsUUFBQSxlQUFBLGdCQUFBLE1BQUEsU0FBQSxRQUFBLGVBQUE7O0VBRUEsT0FBQSxjQUFBOztFQUVBLE9BQUEsZ0JBQUE7RUFDQSxPQUFBLFNBQUE7O0VBRUEsT0FBQSxPQUFBLGtCQUFBLE9BQUEsT0FBQSx1QkFBQSxPQUFBLE9BQUEsY0FBQSxPQUFBLE9BQUEsVUFBQTs7RUFFQSxPQUFBLFNBQUEsY0FBQTs7RUFFQSxPQUFBLFNBQUEsWUFBQTs7O0dBR0EsT0FBQSxPQUFBLGNBQUEsU0FBQTs7R0FFQSxjQUFBLGNBQUEsT0FBQTtLQUNBLEtBQUEsWUFBQTtLQUNBLGVBQUEsTUFBQTtLQUNBLFFBQUEsTUFBQTtNQUNBO01BQ0E7O0tBRUEsTUFBQSxRQUFBOzs7RUFHQSxPQUFBLFNBQUEsWUFBQTtHQUNBLGVBQUEsUUFBQTs7O0VBR0EsT0FBQSwrQkFBQSxZQUFBO0dBQ0EsT0FBQSxPQUFBLFdBQUEsT0FBQSxPQUFBLFNBQUEsUUFBQSxLQUFBLElBQUE7OztFQUdBLE9BQUEsOEJBQUEsWUFBQTtHQUNBLE9BQUEsT0FBQSxlQUFBLHFCQUFBLE9BQUEsT0FBQTs7O0VBR0EsT0FBQSxrQ0FBQSxZQUFBO0dBQ0EsT0FBQSxPQUFBLG1CQUFBLHFCQUFBLE9BQUEsT0FBQTs7OztFQUlBLE9BQUEseUJBQUEsWUFBQTtHQUNBLElBQUEsZ0JBQUEsT0FBQSxLQUFBO0lBQ0EsYUFBQTtJQUNBLFlBQUE7SUFDQSxNQUFBO0lBQ0EsVUFBQTtJQUNBLFNBQUE7OztHQUdBLGNBQUEsT0FBQSxLQUFBLFlBQUE7SUFDQSxLQUFBLEtBQUEsc0JBQUEsSUFBQTtNQUNBLFlBQUE7SUFDQSxLQUFBLEtBQUEseUJBQUEsSUFBQTs7Ozs7RUFLQSxPQUFBLDRCQUFBLFlBQUE7R0FDQSxJQUFBLGdCQUFBLE9BQUEsS0FBQTtJQUNBLGFBQUE7SUFDQSxZQUFBO0lBQ0EsTUFBQTtJQUNBLFVBQUE7SUFDQSxTQUFBOzs7R0FHQSxjQUFBLE9B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QUNBLFFBQUEsS0FBQSxzQkFBQTs7RUFFQSxTQUFBLGlCQUFBLFVBQUEsVUFBQSxVQUFBO0dBQ0EsUUFBQSxLQUFBLGtCQUFBLFVBQUE7O0VBRUEsU0FBQSxnQkFBQSxVQUFBLFVBQUE7R0FDQSxRQUFBLEtBQUEsaUJBQUE7O0VBRUEsU0FBQSxnQkFBQSxVQUFBLFVBQUEsVUFBQSxRQUFBLFNBQUE7R0FDQSxRQUFBLEtBQUEsaUJBQUEsVUFBQSxVQUFBLFFBQUE7O0VBRUEsU0FBQSxjQUFBLFVBQUEsVUFBQSxVQUFBLFFBQUEsU0FBQTtHQUNBLFFBQUEsS0FBQSxlQUFBLFVBQUEsVUFBQSxRQUFBOztFQUVBLFNBQUEsZUFBQSxVQUFBLFVBQUEsVUFBQSxRQUFBLFNBQUE7R0FDQSxRQUFBLEtBQUEsZ0JBQUEsVUFBQSxVQUFBLFFBQUE7O0VBRUEsU0FBQSxpQkFBQSxVQUFBLFVBQUEsVUFBQSxRQUFBLFNBQUE7R0FDQSxRQUFBLEtBQUEsa0JBQUEsVUFBQSxVQUFBLFFBQUE7O0VBRUEsU0FBQSxnQkFBQSxZQUFBO0dBQ0EsUUFBQSxLQUFBOzs7RUFHQSxnQkFBQTtJQUNBLE1BQUEsVUFBQSxZQUFBLENBQUEsT0FBQSxTQUFBLE1BQUE7SUFDQSxNQUFBLFFBQUE7O0VBRUEsT0FBQSxVQUFBLFlBQUE7R0FDQSxnQkFBQSxpQkFBQSxPQUFBO0tBQ0EsTUFBQSxZQUFBLENBQUEsZUFBQSxRQUFBLFFBQUEsUUFBQSxPQUFBO0tBQ0EsT0FBQSxRQUFBOzs7RUFHQSxPQUFBLFFBQUEsWUFBQTs7R0FFQSxnQkFBQSxnQkFBQSxPQUFBLFNBQUE7S0FDQSxTQUFBLGVBQUEsUUFBQTs7O0FDdEVBOzs7QUFHQSxRQUFBLE9BQUE7Q0FDQSxXQUFBLGNBQUEsQ0FBQSxVQUFBLGtCQUFBLGVBQUE7QUFDQSxVQUFBLFFBQUEsZ0JBQUEsYUFBQSxNQUFBO0NBQ0EsT0FBQSxLQUFBLFlBQUE7RUFDQSxZQUFBO0VBQ0EsZUFBQSxPQUFBOzs7Q0FHQSxPQUFBLFNBQUEsWUFBQTtFQUNBLGVBQUEsU0FBQTs7O0FDWkE7OztBQUdB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O3FCQUNBLFFBQUEsVUFBQSxNQUFBO29CQUNBLFNBQUEsUUFBQTs7cUJBRUEsTUFBQSxVQUFBLE9BQUE7b0JBQ0EsU0FBQSxPQUFBOztnQkFFQSxPQUFBLFNBQUE7O1lBRUEsWUFBQSxVQUFBLFFBQUE7Z0JBQ0EsSUFBQSxXQUFBLEdBQUE7Z0JBQ0EsTUFBQSxLQUFBLDJCQUFBLFFBQUE7cUJBQ0EsUUFBQSxZQUFBO29CQUNBLFNBQUEsUUFBQTs7cUJBRUEsTUFBQSxVQUFBLE9BQUE7b0JBQ0EsU0FBQSxPQUFBOztnQkFFQSxPQUFBLFNBQUE7O1lBRUEsZUFBQSxVQUFBLFFBQUE7Z0JBQ0EsSUFBQSxXQUFBLEdBQUE7Z0JBQ0EsTUFBQSxLQUFBLHVCQUFBO3FCQUNBLFFBQUEsVUFBQSxNQUFBO29CQUNBLFNBQUEsUUFBQTs7cUJBRUEsTUFBQSxVQUFBLE9BQUE7b0JBQ0EsU0FBQSxPQUFBOztnQkFFQSxPQUFBLFNBQUE7O1lBRUEsZ0JBQUEsVUFBQSxRQUFBO2dCQUNBLElBQUEsV0FBQSxHQUFBO2dCQUNBLE1BQUEsS0FBQSx3QkFBQSxRQUFBO3FCQUNBLFFBQUEsVUFBQSxNQUFBO29CQUNBLFNBQUEsUUFBQTs7cUJBRUEsTUFBQSxVQUFBLE9BQUE7b0JBQ0EsU0FBQSxPQUFBOztnQkFFQSxPQUFBLFNBQUE7O1lBRUEsY0FBQSxZQUFBO2dCQUNBLElBQUEsV0FBQSxHQUFBO2dCQUNBLE1BQUEsS0FBQTtxQkFDQSxRQUFBLFVBQUEsTUFBQTtvQkFDQSxTQUFBLFFBQUE7O3FCQUVBLE1BQUEsVUFBQSxPQUFBO29CQUNBLFNBQUEsT0FBQTs7Z0JBRUEsT0FBQSxTQUFBOztZQUVBLHNCQUFBLFlBQUE7Z0JBQ0EsSUFBQSxXQUFBLEdBQUE7Z0JBQ0EsTUFBQSxLQUFBO3FCQUNBLFFBQUEsWUFBQTtvQkFDQSxTQUFBLFFBQUE7O3FCQUVBLE1BQUEsVUFBQSxPQUFBO29CQUNBLFNBQUEsT0FBQTs7Z0JBRUEsT0FBQSxTQUFBOztZQUVBLDBCQUFBLFVBQUEsVUFBQTtnQkFDQSxJQUFBLFdBQUEsR0FBQTtnQkFDQSxNQUFBLEtBQUE7cUJBQ0EsUUFBQSxZQUFBO29CQUNBLFNBQUEsUUFBQTs7cUJBRUEsTUFBQSxVQUFBLE9BQUE7b0JBQ0EsU0FBQSxPQUFBOztnQkFFQSxPQUFBLFNBQUE7Ozs7O0FDbElBOztBQUVBLFFBQUEsT0FBQSxPQUFBLFFBQUEsbUJBQUEsQ0FBQSxRQUFBLFNBQUE7SUFDQSxVQUFBLE1BQUEsT0FBQSxJQUFBO1FBQ0EsT0FBQTtZQUNBLGdCQUFBLFlBQUE7Z0JBQ0EsSUFBQSxXQUFBLEdBQUE7O2dCQUVBLE1BQUEsS0FBQTtxQkFDQSxRQUFBLFVBQUEsTUFBQTtvQkFDQSxTQUFBLFFBQUEsS0FBQSxNQUFBOztxQkFFQSxNQUFBLFVBQUEsT0FBQTtvQkFDQSxTQUFBLE9BQUE7O2dCQUVBLE9BQUEsU0FBQTs7WUFFQSxRQUFBLFlBQUE7Z0JBQ0EsSUFBQSxXQUFBLEdBQUE7Z0JBQ0EsTUFBQSxLQUFBO3FCQUNBLFFBQUEsVUFBQSxNQUFBO29CQUNBLFNBQUEsUUFBQTs7cUJBRUEsTUFBQSxVQUFBLE9BQUE7b0JBQ0EsU0FBQSxPQUFBOztnQkFFQSxPQUFBLFNBQUE7O1lBRUEsZUFBQSxVQUFBLFlBQUE7Z0JBQ0EsSUFBQSxXQUFBLEdBQUE7Z0JBQ0EsTUFBQSxLQUFBLDBCQUFBO3FCQUNBLFFBQUEsVUFBQSxNQUFBO29CQUNBLFNBQUEsUUFBQTs7cUJBRUEsTUFBQSxVQUFBLE9BQUE7b0JBQ0EsU0FBQSxPQUFBOztnQkFFQSxPQUFBLFNBQUE7O1lBRUEsZ0JBQUEsVUFBQSxZQUFBO2dCQUNBLElBQUEsV0FBQSxHQUFBO2dCQUNBLE1BQUEsS0FBQSx3QkFBQTtxQkFDQSxRQUFBLFVBQUEsTUFBQTtvQkFDQSxTQUFBLFFBQUE7O3FCQUVBLE1BQUEsVUFBQSxPQUFBO29CQUNBLFNBQUEsT0FBQTs7Z0JBRUEsT0FBQSxTQUFBOztZQUVBLGlCQUFBLFVBQUEsVUFBQTtnQkFDQSxJQUFBLFdBQUEsR0FBQTtnQkFDQSxNQUFBLEtBQUEseUJBQUE7cUJBQ0EsUUFBQSxVQUFBLE1BQUE7b0JBQ0EsU0FB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QUFBO1FBQ0EsT0FBQTtRQUNBLGFBQUE7UUFDQSxNQUFBLFVBQUEsUUFBQSxTQUFBLE9BQUE7OztBQUdBLFFBQUEsT0FBQSxPQUFBLFVBQUEscUJBQUEsWUFBQTtJQUNBLE9BQUE7UUFDQSxVQUFBO1FBQ0EsT0FBQTtRQUNBLGFBQUE7UUFDQSxNQUFBLFVBQUEsUUFBQSxTQUFBLE9BQUE7OztBQUdBLFFBQUEsT0FBQSxPQUFBLFVBQUEsMEJBQUEsWUFBQTtJQUNBLE9BQUE7UUFDQSxVQUFBO1FBQ0EsT0FBQTtRQUNBLGFBQUE7UUFDQSxNQUFBLFVBQUEsUUFBQSxTQUFBLE9BQUE7OztBQUdBLFFBQUEsT0FBQSxPQUFBLFVBQUEsaUJBQUEsWUFBQTtJQUNBLE9BQUE7UUFDQSxVQUFBO1FBQ0EsT0FBQTtRQUNBLGFBQUE7UUFDQSxNQUFBLFVBQUEsUUFBQSxTQUFBLE9BQUE7OztBQUdBLFFBQUEsT0FBQSxPQUFBLFVBQUEsYUFBQSxZQUFBO0lBQ0EsT0FBQTtRQUNBLFVBQUE7UUFDQSxPQUFBO1FBQ0EsYUFBQTtRQUNBLE1BQUEsVUFBQSxRQUFBLFNBQUEsT0FBQTs7O0FBR0EsUUFBQSxPQUFBLE9BQUEsVUFBQSwwQkFBQSxZQUFBO0lBQ0EsUUFBQSxJQUFBO0lBQ0EsT0FBQTtRQUNBLFVBQUE7UUFDQSxPQUFBO1FBQ0EsYUFBQTtRQUNBLE1BQUEsVUFBQSxRQUFBLFNBQUEsT0FBQTs7O0FBR0EsUUFBQSxPQUFBLE9BQUEsVUFBQSwwQkFBQSxZQUFBO0lBQ0EsUUFBQSxJQUFBO0lBQ0EsT0FBQTtRQUNBLFVBQUE7UUFDQSxPQUFBO1FBQ0EsYUFBQTtRQUNBLE1BQUEsVUFBQSxRQUFBLFNBQUEsT0FBQTs7O0FBR0EsUUFBQSxPQUFBLE9BQUEsVUFBQSx3QkFBQSxZQUFBO0lBQ0EsUUFBQSxJQUFBO0lBQ0EsT0FBQTtRQUNBLFVBQUE7UUFDQSxPQUFBO1FBQ0EsYUFBQTtRQUNBLE1BQUEsVUFBQSxRQUFBLFNBQUEsT0FBQTs7O0FBR0EsUUFBQSxPQUFBLE9BQUEsVUFBQSx3QkFBQSxZQUFBO0lBQ0EsUUFBQSxJQUFBO0lBQ0EsT0FBQTtRQUNBLFVBQUE7UUFDQSxPQUFBO1FBQ0EsYUFBQTtRQUNBLE1BQUEsVUFBQSxRQUFBLFNBQUEsT0FBQTs7O0FBR0EsUUFBQSxPQUFBLE9BQUEsVUFBQSxpQ0FBQSxZQUFBO0lBQ0EsUUFBQSxJQUFBO0lBQ0EsT0FBQTtRQUNBLFVBQUE7UUFDQSxPQUFBO1FBQ0EsYUFBQTtRQUNBLE1BQUEsVUFBQSxRQUFBLFNBQUEsT0FBQTs7O0FBR0EsUUFBQSxPQUFBLE9BQUEsVUFBQSw2QkFBQSxZQUFBO0lBQ0EsUUFBQSxJQUFBO0lBQ0EsT0FBQTtRQUNBLFVBQUE7UUFDQSxPQUFBO1FBQ0EsYUFBQTtRQUNBLE1BQUEsVUFBQSxRQUFBLFNBQUEsT0FBQTs7O0FBR0EsUUFBQSxPQUFBLE9BQUEsVUFBQSw2QkFBQSxZQUFBO0lBQ0EsUUFBQSxJQUFBO0lBQ0EsT0FBQTtRQUNBLFVBQUE7UUFDQSxPQUFBO1FBQ0EsYUFBQTtRQUNBLE1BQUEsVUFBQSxRQUFBLFNBQUEsT0FBQTs7O0FBR0EsUUFBQSxPQUFBLE9BQUEsVUFBQSwwQkFBQSxZQUFBO0lBQ0EsUUFBQSxJQUFBO0lBQ0EsT0FBQTtRQUNBLFVBQUE7UUFDQSxPQUFBO1FBQ0EsYUFBQTtRQUNBLE1BQUEsVUFBQSxRQUFBLFNBQUEsT0FBQTs7O0FBR0EsUUFBQSxPQUFBLE9BQUEsVUFBQSwrQkFBQSxZQUFBO0lBQ0EsUUFBQSxJQUFBO0lBQ0EsT0FBQTtRQUNBLFVBQUE7UUFDQSxPQUFBO1FBQ0EsYUFBQTtRQUNBLE1BQUEsVUFBQSxRQUFBLFNBQUEsT0FBQTs7O0FBR0EsUUFBQSxPQUFBLE9BQUEsVUFBQSwrQkFBQSxZQUFBO0lBQ0EsUUFBQSxJQUFBO0lBQ0EsT0FBQTtRQUNBLFVBQUE7UUFDQSxPQUFBO1FBQ0EsYUFBQTtRQUNBLE1BQUEsVUFBQSxRQUFBLFNBQUEsT0FBQTs7O0FBR0EsUUFBQSxPQUFBLE9BQUEsVUFBQSw2Q0FBQSxZQUFBO0lBQ0EsUUFBQSxJQUFBO0lBQ0EsT0FBQTtRQUNBLFVBQUE7UUFDQSxPQUFBO1FBQ0EsYUFBQTtRQUNBLE1BQUEsVUFBQSxRQUFBLFNBQUEsT0FBQTs7O0FBR0EsUUFBQSxPQUFBLE9BQUEsVUFBQSw0Q0FBQSxZQUFBO0lBQ0EsUUFBQSxJQUFBO0lBQ0EsT0FBQTtRQUNBLFVBQUE7UUFDQSxPQUFBO1FBQ0EsYUFBQTtRQUNBLE1BQUEsVUFBQSxRQUFBLFNBQUEsT0FBQTs7O0FBR0EsUUFBQSxPQUFBLE9BQUEsVUFBQSxrQ0FBQSxZQUFBO0lBQ0EsUUFBQSxJQUFBO0lBQ0EsT0FBQTtRQUNBLFVBQUE7UUFDQSxPQUFBO1FBQ0EsYUFBQTtRQUNBLE1BQUEsVUFBQSxRQUFBLFNBQUEsT0FBQTs7O0FBR0EsUUFBQSxPQUFBLE9BQUEsVUFBQSxtQkFBQSxZQUFBO0lBQ0EsT0FBQTtRQUNBLFVBQUE7UUFDQSxPQUFBO1FBQ0EsYUFBQTtRQUNBLE1BQUEsVUFBQSxRQUFBLFNBQUEsT0FBQTs7O0FBR0EsUUFBQSxPQUFBLE9BQUEsVUFBQSx1QkFBQSxZQUFBO0lBQ0EsT0FBQTtRQUNBLFVBQUE7UUFDQSxPQUFBO1FBQ0EsYUFBQTtRQUNBLE1BQUEsVUFBQSxRQUFBLFNBQUEsT0FBQTs7O0FBR0EsUUFBQSxPQUFBLE9BQUEsVUFBQSxtQkFBQSxZQUFBO0lBQ0EsT0FBQTtRQUNBLFVBQUE7UUFDQSxPQUFBO1FBQ0EsYUFBQTtRQUNBLE1BQUEsVUFBQSxRQUFBLFNBQUEsT0FBQTs7O0FBR0EsUUFBQSxPQUFBLE9BQUEsVUFBQSxtQkFBQSxZQUFBO0lBQ0EsT0FBQTtRQUNBLFVBQUE7UUFDQSxPQUFBO1FBQ0EsYUFBQTtRQUNBLE1BQUEsVUFBQSxRQUFBLFNBQUEsT0FBQTs7O0FBR0EsUUFBQSxPQUFBLE9BQUEsVUFBQSxxQkFBQSxZQUFBO0lBQ0EsT0FBQTtRQUNBLFVBQUE7UUFDQSxPQUFBO1FBQ0EsYUFBQTtRQUNBLE1BQUEsVUFBQSxRQUFBLFNBQUEsT0FBQTs7O0FBR0EsUUFBQSxPQUFBLE9BQUEsVUFBQSx3QkFBQSxZQUFBO0lBQ0EsT0FBQTtRQUNBLFVBQUE7UUFDQSxPQUFBO1FBQ0EsYUFBQTtRQUNBLE1BQUEsVUFBQSxRQUFBLFNBQUEsT0FBQTs7O0FBR0EsUUFBQSxPQUFBLE9BQUEsVUFBQSw0QkFBQSxZQUFBO0lBQ0EsT0FBQTtRQUNBLFVBQUE7UUFDQSxPQUFBO1FBQ0EsYUFBQTtRQUNBLE1BQUEsVUFBQSxRQUFBLFNBQUEsT0FBQTs7O0FBR0EsUUFBQSxPQUFBLE9BQUEsVUFBQSxvQkFBQSxZQUFBO0lBQ0EsT0FBQTtRQUNBLFVBQUE7UUFDQSxPQUFBO1FBQ0EsYUFBQTtRQUNBLE1BQUEsVUFBQSxRQUFBLFNBQUEsT0FBQTs7O0FBR0EsUUFBQSxPQUFBLE9BQUEsVUFBQSxzQkFBQSxZQUFBO0lBQ0EsT0FBQTtRQUNBLFVBQUE7UUFDQSxPQUFBO1FBQ0EsYUFBQTtRQUNBLE1BQUEsVUFBQSxRQUFBLFNBQUEsT0FBQTs7O0FBR0EsUUFBQSxPQUFBLE9BQUEsVUFBQSxrQ0FBQSxZQUFBO0lBQ0EsT0FBQTtRQUNBLFVBQUE7UUFDQSxPQUFBO1FBQ0EsYUFBQTtRQUNBLE1BQUEsVUFBQSxRQUFBLFNBQUEsT0FBQTs7O0FBR0EsUUFBQSxPQUFBLE9BQUEsVUFBQSxtQkFBQSxZQUFBO0lBQ0EsT0FBQTtRQUNBLFVBQUE7UUFDQSxPQUFBO1FBQ0EsYUFBQTtRQUNBLE1BQUEsVUFBQSxRQUFBLFNBQUEsT0FBQTs7O0FBR0EsUUFBQSxPQUFBLE9BQUEsVUFBQSxvQkFBQSxZQUFBO0lBQ0EsT0FBQTtRQUNBLFVBQUE7UUFDQSxPQUFBO1FBQ0EsYUFBQTtRQUNBLE1BQUEsVUFBQSxRQUFBLFNBQUEsT0FBQTs7O0FBR0EsUUFBQSxPQUFBLE9BQUEsVUFBQSw0QkFBQSxZQUFBO0lBQ0EsT0FBQTtRQUNBLFVBQUE7UUFDQSxPQUFBO1FBQ0EsYUFBQTtRQUNBLE1BQUEsVUFBQSxRQUFBLFNBQUEsT0FBQTs7O0FBR0EsUUFBQSxPQUFBLE9BQUEsVUFBQSxxQkFBQSxZQUFBO0lBQ0EsT0FBQTtRQUNBLFVBQUE7UUFDQSxPQUFBO1FBQ0EsYUFBQTtRQUNBLE1BQUEsVUFBQSxRQUFBLFNBQUEsT0FBQTs7O0FBR0EsUUFBQSxPQUFBLE9BQUEsVUFBQSxpQkFBQSxZQUFBO0lBQ0EsT0FBQTtRQUNBLFVBQUE7UUFDQSxPQUFBO1FBQ0EsYUFBQTtRQUNBLE1BQUEsVUFBQSxRQUFBLFNBQUEsT0FBQTs7OzZDQUdBIiwiZmlsZSI6ImNsaWVudC1idWlsZC9hbmd1bGFyLWJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCd0dGMnLCBbJ25nUm91dGUnLCAndWkuYm9vdHN0cmFwJywgJ25nTWVzc2FnZXMnLCAnbmdTYW5pdGl6ZScsICduZ0Nvb2tpZXMnLCAnY2dCdXN5JywgJ2FuZ3VsYXJGaWxlVXBsb2FkJywgJ3BkZicsICdjaGFydC5qcycsICduZ0FuaW1hdGUnLCAnbmcuZGV2aWNlRGV0ZWN0b3InXSk7XG5hbmd1bGFyLm1vZHVsZSgndHRjJykuY29uZmlnKFsnJGh0dHBQcm92aWRlcicsIGZ1bmN0aW9uICgkaHR0cFByb3ZpZGVyKSB7XG4gICAgICAgIC8vRmlyc3QgY2xlYXIgb3V0IGFsbCBvdXQtb2YtdGhlLWJveCBkZWZhdWx0c1xuICAgICAgICBpZiAoISRodHRwUHJvdmlkZXIuZGVmYXVsdHMuaGVhZGVycy5nZXQpIHtcbiAgICAgICAgICAgICRodHRwUHJvdmlkZXIuZGVmYXVsdHMuaGVhZGVycy5nZXQgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICAvLyBUaGVuIGRlZmluZSBhIGZldyBvciBvdXIgb3duXG4gICAgICAgICRodHRwUHJvdmlkZXIuZGVmYXVsdHMuaGVhZGVycy5nZXRbJ0NhY2hlLUNvbnRyb2wnXSA9ICduby1jYWNoZSc7XG4gICAgICAgICRodHRwUHJvdmlkZXIuZGVmYXVsdHMuaGVhZGVycy5nZXRbJ1ByYWdtYSddID0gJ25vLWNhY2hlJztcbiAgICB9XSk7XG5hbmd1bGFyLm1vZHVsZSgndHRjJykuY29uZmlnKGZ1bmN0aW9uICgkY29va2llc1Byb3ZpZGVyKSB7XG4gICAgLy8gQWxsb3cgY29va2llcyBhcmUgdG8gYmUgc2VjdXJlXG4gICAgJGNvb2tpZXNQcm92aWRlci5kZWZhdWx0cyA9IHtcbiAgICAgICAgZG9tYWluOiAndHRjLXdlYnNpdGUuaGVyb2t1YXBwLmNvbScsXG4gICAgICAgIHNlY3VyZTogdHJ1ZVxuICAgIH07XG59KTtcbmFuZ3VsYXIubW9kdWxlKCd0dGMnKS5jb25maWcoZnVuY3Rpb24gKGRhdGVwaWNrZXJDb25maWcpIHtcbiAgICBkYXRlcGlja2VyQ29uZmlnLmluaXREYXRlID0gbmV3IERhdGUoMTk2MCwgMSwgMSk7XG4gICAgZGF0ZXBpY2tlckNvbmZpZy5zdGFydGluZ0RheSA9IDE7XG4gICAgZGF0ZXBpY2tlckNvbmZpZy5zaG93V2Vla3MgPSBmYWxzZTtcbiAgICBkYXRlcGlja2VyQ29uZmlnLmZvcm1hdFllYXIgPSAneXl5eSc7XG4gICAgZGF0ZXBpY2tlckNvbmZpZy5mb3JtYXRNb250aCA9ICdNTSc7XG4gICAgZGF0ZXBpY2tlckNvbmZpZy5mb3JtYXREYXkgPSAnZGQnO1xufSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5hcHAuY29uZmlnKFsnJHJvdXRlUHJvdmlkZXInLCBmdW5jdGlvbiAoJHJvdXRlUHJvdmlkZXIsICRzY29wZSkge1xuICAgICAgICAkcm91dGVQcm92aWRlci53aGVuKCcvSG9tZScsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL25nLWNvbXBvbmVudHMvSG9tZS9Ib21lLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0hvbWVDb250cm9sbGVyJ1xuICAgICAgICB9KVxuICAgICAgICAgICAgLndoZW4oJy9DYWxlbmRhcicsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL25nLWNvbXBvbmVudHMvQ2FsZW5kYXIvQ2FsZW5kYXIuaHRtbCdcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC53aGVuKCcvTmV3cycsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL25nLWNvbXBvbmVudHMvTmV3cy9OZXdzLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ05ld3NDdHJsJ1xuICAgICAgICB9KVxuICAgICAgICAgICAgLndoZW4oJy9TZWFyY2hNZW1iZXJzaGlwJywge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvbmctY29tcG9uZW50cy9TZWFyY2hNZW1iZXJzaGlwL1NlYXJjaE1lbWJlcnNoaXAuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnU2VhcmNoTWVtYmVyc2hpcEN0cmwnXG4gICAgICAgIH0pXG4gICAgICAgICAgICAud2hlbignL2VCbGFzdHMnLCB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9uZy1jb21wb25lbnRzL2VCbGFzdHMvZUJsYXN0cy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdlQmxhc3RzQ3RybCdcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC53aGVuKCcvSnVuaW9yUHJvZ3JhbScsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL25nLWNvbXBvbmVudHMvSnVuaW9yUHJvZ3JhbS9KdW5pb3JQcm9ncmFtLmh0bWwnXG4gICAgICAgIH0pXG4gICAgICAgICAgICAud2hlbignL0FkdWx0UHJvZ3JhbScsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL25nLWNvbXBvbmVudHMvQWR1bHRQcm9ncmFtL0FkdWx0UHJvZ3JhbS5odG1sJ1xuICAgICAgICB9KVxuICAgICAgICAgICAgLndoZW4oJy9Ib3dUb0ZpbmRVcycsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL25nLWNvbXBvbmVudHMvSG93VG9GaW5kVXMvSG93VG9GaW5kVXMuaHRtbCdcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC53aGVuKCcvQWJvdXRVcycsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL25nLWNvbXBvbmVudHMvQWJvdXRVcy9BYm91dFVzLmh0bWwnXG4gICAgICAgIH0pXG4gICAgICAgICAgICAud2hlbignL0NvbnRhY3RVcycsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL25nLWNvbXBvbmVudHMvQ29udGFjdFVzL0NvbnRhY3RVcy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDb250YWN0VXNDb250cm9sbGVyJ1xuICAgICAgICB9KVxuICAgICAgICAgICAgLndoZW4oJy9NZW1iZXJUYWJsZScsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL25nLWNvbXBvbmVudHMvTWVtYmVyVGFibGUvTWVtYmVyVGFibGUuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnTWVtYmVyVGFibGVDb250cm9sbGVyJ1xuICAgICAgICB9KVxuICAgICAgICAgICAgLm90aGVyd2lzZSh7XG4gICAgICAgICAgICByZWRpcmVjdFRvOiAnL0hvbWUnXG4gICAgICAgIH0pO1xuICAgIH1dKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC5yb3V0ZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcblxuYW5ndWxhci5tb2R1bGUoJ3R0YycpXG4uY29udHJvbGxlciAoXCJDb250YWN0VXNDb250cm9sbGVyXCIsIFsnJHNjb3BlJywgJyRodHRwJywgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHApIHtcblxuXHQkc2NvcGUuZXhlY3V0aXZlPSBbXTtcblxuXHQkaHR0cC5nZXQoJy9uZy1jb21wb25lbnRzL0NvbnRhY3RVcy90dGNfZXhlYy5qc29uJylcblx0LnN1Y2Nlc3MgKGZ1bmN0aW9uKHJlc3BvbnNlKSB7IFxuXHRcdCRzY29wZS5leGVjdXRpdmUgPSByZXNwb25zZTtcblx0XHRjb25zb2xlLmxvZyAoJ2V4ZWN1dGl2ZScsIEpTT04uc3RyaW5naWZ5ICgkc2NvcGUuZXhlY3V0aXZlLCBudWxsLCA0KSk7XG5cdFx0Y29uc29sZS5sb2cgKCdsZW5ndGggb2YgZXhlY3V0aXZlOiAnLCAkc2NvcGUuZXhlY3V0aXZlLmxlbmd0aCk7XG5cdFx0Y29uc29sZS5sb2cgKCd0eXBlb2YgZXhlY3V0aXZlOiAnLCB0eXBlb2YgJHNjb3BlLmV4ZWN1dGl2ZSk7XG5cdH0pXG5cdC5lcnJvciAoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRjb25zb2xlLmxvZyAoJ0Vycm9yIERldGVjdGVkOiAnLCByZXNwb25zZSk7XG5cdH0pOyAgIFxufV0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vLyBDaGFuZ2UgUGFzc3dvcmQgQ29udHJvbGxlclxuYW5ndWxhci5tb2R1bGUoJ3R0YycpXG5cdC5jb250cm9sbGVyKCdjaGFuZ2VQYXNzd29yZENvbnRyb2xsZXInLCBbJyRzY29wZScsICdVc2VyU2VydmljZScsICckbW9kYWxJbnN0YW5jZScsICckd2luZG93JywgJyRsb2cnLCAnTWVtYmVyU2VydmljZScsICckcScsXG5mdW5jdGlvbiAoJHNjb3BlLCBVc2VyU2VydmljZSwgJG1vZGFsSW5zdGFuY2UsICR3aW5kb3csICRsb2csIE1lbWJlclNlcnZpY2UsICRxKSB7XG5cblx0XHRcdCRzY29wZS5tZW1iZXIgPSB7fTtcblxuXHRcdFx0JHNjb3BlLlNhdmUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdE1lbWJlclNlcnZpY2UuQ2hhbmdlUGFzc3dvcmQoJHNjb3BlLm1lbWJlcilcblx0XHRcdFx0XHQudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHQkbW9kYWxJbnN0YW5jZS5jbG9zZSgnWWVzJyk7XG5cdFx0XHRcdFx0XHQkd2luZG93LmFsZXJ0KCdZb3VyIG5ldyBwYXNzd29yZCBoYXMgYmVlbiBzYXZlZCcpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcblx0XHRcdFx0XHRcdCR3aW5kb3cuYWxlcnQoZXJyKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdH07XG5cblx0XHRcdCRzY29wZS5DYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdCRtb2RhbEluc3RhbmNlLmRpc21pc3MoJ05vJyk7XG5cdFx0XHR9O1xufV0pOyIsIid1c2Ugc3RyaWN0JztcblxuXG5hbmd1bGFyLm1vZHVsZSgndHRjJylcbi5jb250cm9sbGVyKCdEb2N1bWVudFVwbG9hZENvbnRyb2xsZXInLCBbJyRzY29wZScsICdGaWxlVXBsb2FkZXInLCAnJG1vZGFsSW5zdGFuY2UnLCAnVXNlclNlcnZpY2UnLCAnRG9jdW1lbnRTZXJ2aWNlJywgJyR3aW5kb3cnLCAnJGxvZycsXG5mdW5jdGlvbiBkb2N1bWVudFVwbG9hZENvbnRyb2xsZXIgKCRzY29wZSwgRmlsZVVwbG9hZGVyLCAkbW9kYWxJbnN0YW5jZSwgVXNlclNlcnZpY2UsIERvY3VtZW50U2VydmljZSwgJHdpbmRvdywgJGxvZykge1xuXHR2YXIgdXBsb2FkZXIgPSAkc2NvcGUudXBsb2FkZXIgPSBuZXcgRmlsZVVwbG9hZGVyKHtcblx0XHR1cmw6IFx0XHQnL2FwaS9kb2N1bWVudC11cGxvYWQnXG5cdH0pO1xuXG5cdCRzY29wZS51c2VyID0gVXNlclNlcnZpY2U7XG5cdFxuXHQkc2NvcGUucmVmcmVzaERvY3VtZW50TGlzdCA9IGZ1bmN0aW9uICgpIHtcblx0XHREb2N1bWVudFNlcnZpY2UucmVmcmVzaERvY3VtZW50TGlzdCAoKVxuXHRcdFx0LnRoZW4gKGZ1bmN0aW9uIChmaWxlcykgeyRzY29wZS5maWxlcyA9IGZpbGVzO30pXG5cdFx0XHQuY2F0Y2goJHdpbmRvdy5hbGVydCk7XG5cdH1cblx0XG5cdCRzY29wZS5yZWZyZXNoRG9jdW1lbnRMaXN0ICgpO1xuXHRcblx0Ly8gRklMVEVSU1xuXHR1cGxvYWRlci5maWx0ZXJzLnB1c2goe1xuXHRcdG5hbWU6ICdjdXN0b21GaWx0ZXInLFxuXHRcdGZuOiBmdW5jdGlvbiAoaXRlbSwgb3B0aW9ucykge1xuXHRcdFx0cmV0dXJuIHRoaXMucXVldWUubGVuZ3RoIDwgMTA7XG5cdFx0fVxuXHR9KTtcblx0XG5cdHVwbG9hZGVyLmZpbHRlcnMucHVzaCh7XG4gICAgICAgICAgICBuYW1lOiAncGRmRmlsdGVyJyxcbiAgICAgICAgICAgIGZuOiBmdW5jdGlvbihpdGVtLCBvcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgdmFyIHR5cGUgPSAnfCcgKyBpdGVtLnR5cGUuc2xpY2UoaXRlbS50eXBlLmxhc3RJbmRleE9mKCcvJykgKyAxKSArICd8Jztcblx0XHRcdFx0Y29uc29sZS5sb2cgKCdmaWxlIHR5cGU6ICcsIHR5cGUpO1xuICAgICAgICAgICAgICAgIHJldHVybiAnfHBkZnxQREZ8Jy5pbmRleE9mKHR5cGUpICE9PSAtMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cblx0Ly8gQ0FMTEJBQ0tTXG5cdHVwbG9hZGVyLm9uV2hlbkFkZGluZ0ZpbGVGYWlsZWQgPSBmdW5jdGlvbiAoaXRlbSwgZmlsdGVyLCBvcHRpb25zKSB7XG5cdFx0Y29uc29sZS5pbmZvKCdvbldoZW5BZGRpbmdGaWxlRmFpbGVkJywgaXRlbSwgZmlsdGVyLCBvcHRpb25zKTtcblx0fTtcblx0dXBsb2FkZXIub25BZnRlckFkZGluZ0ZpbGUgPSBmdW5jdGlvbiAoZmlsZUl0ZW0pIHtcblx0XHRjb25zb2xlLmluZm8oJ29uQWZ0ZXJBZGRpbmdGaWxlJywgZmlsZUl0ZW0pO1xuXHR9O1xuXHR1cGxvYWRlci5vbkFmdGVyQWRkaW5nQWxsID0gZnVuY3Rpb24gKGFkZGVkRmlsZUl0ZW1zKSB7XG5cdFx0Y29uc29sZS5pbmZvKCdvbkFmdGVyQWRkaW5nQWxsJywgYWRkZWRGaWxlSXRlbXMpO1xuXHR9O1xuXHR1cGxvYWRlci5vbkJlZm9yZVVwbG9hZEl0ZW0gPSBmdW5jdGlvbiAoaXRlbSkge1xuXHRcdGNvbnNvbGUuaW5mbygnb25CZWZvcmVVcGxvYWRJdGVtJywgaXRlbSk7XG5cdH07XG5cdHVwbG9hZGVyLm9uUHJvZ3Jlc3NJdGVtID0gZnVuY3Rpb24gKGZpbGVJdGVtLCBwcm9ncmVzcykge1xuXHRcdGNvbnNvbGUuaW5mbygnb25Qcm9ncmVzc0l0ZW0nLCBmaWxlSXRlbSwgcHJvZ3Jlc3MpO1xuXHR9O1xuXHR1cGxvYWRlci5vblByb2dyZXNzQWxsID0gZnVuY3Rpb24gKHByb2dyZXNzKSB7XG5cdFx0Y29uc29sZS5pbmZvKCdvblByb2dyZXNzQWxsJywgcHJvZ3Jlc3MpO1xuXHR9O1xuXHR1cGxvYWRlci5vblN1Y2Nlc3NJdGVtID0gZnVuY3Rpb24gKGZpbGVJdGVtLCByZXNwb25zZSwgc3RhdHVzLCBoZWFkZXJzKSB7XG5cdFx0Y29uc29sZS5pbmZvKCdvblN1Y2Nlc3NJdGVtJywgZmlsZUl0ZW0sIHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpO1xuXHR9O1xuXHR1cGxvYWRlci5vbkVycm9ySXRlbSA9IGZ1bmN0aW9uIChmaWxlSXRlbSwgcmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycykge1xuXHRcdGNvbnNvbGUuaW5mbygnb25FcnJvckl0ZW0nLCBmaWxlSXRlbSwgcmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycyk7XG5cdH07XG5cdHVwbG9hZGVyLm9uQ2FuY2VsSXRlbSA9IGZ1bmN0aW9uIChmaWxlSXRlbSwgcmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycykge1xuXHRcdGNvbnNvbGUuaW5mbygnb25DYW5jZWxJdGVtJywgZmlsZUl0ZW0sIHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpO1xuXHR9O1xuXHR1cGxvYWRlci5vbkNvbXBsZXRlSXRlbSA9IGZ1bmN0aW9uIChmaWxlSXRlbSwgcmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycykge1xuXHRcdCRzY29wZS5yZWZyZXNoRG9jdW1lbnRMaXN0ICgpO1xuXHRcdGNvbnNvbGUuaW5mbygnb25Db21wbGV0ZUl0ZW0nLCBmaWxlSXRlbSwgcmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycyk7XG5cdH07XG5cdHVwbG9hZGVyLm9uQ29tcGxldGVBbGwgPSBmdW5jdGlvbiAoKSB7XG5cdFx0Y29uc29sZS5pbmZvKCdvbkNvbXBsZXRlQWxsJyk7XG5cdH07XG5cdFxuXHQkc2NvcGUuUmVtb3ZlID0gZnVuY3Rpb24gKGZpbGUpIHtcblx0XHREb2N1bWVudFNlcnZpY2UucmVtb3ZlRG9jdW1lbnQgKGZpbGUpXG5cdFx0XHQvLyBSZW1vdmVzIHRoZSBmaWxlIGluIHF1ZXN0aW9uIGFuZCB0aGVuIHVwZGF0ZXMgdGhlIGRvY3VtZW50IGxpc3Rcblx0XHRcdC50aGVuIChmdW5jdGlvbiAoZmlsZXMpIHskc2NvcGUuZmlsZXMgPSBmaWxlczt9KVxuXHRcdFx0LmNhdGNoICgkd2luZG93LmFsZXJ0KTtcblx0fVxuXG5cdCRzY29wZS5DbG9zZSA9IGZ1bmN0aW9uICgpIHtcblx0XHQkbW9kYWxJbnN0YW5jZS5kaXNtaXNzKCdObycpO1xuXHR9O1xufV0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICogTGlua2VkIExpc3QgaW1wbGVtZW50YXRpb24gaW4gSmF2YVNjcmlwdFxuICogQ29weXJpZ2h0IChjKSAyMDA5IE5pY2hvbGFzIEMuIFpha2FzXG4gKiBcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqIFxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICogXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiAqIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG4vKipcbiAqIEEgbGlua2VkIGxpc3QgaW1wbGVtZW50YXRpb24gaW4gSmF2YVNjcmlwdC5cbiAqIEBjbGFzcyBMaW5rZWRMaXN0XG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gTGlua2VkTGlzdCgpIHtcblxuXHQvKipcblx0ICogVGhlIG51bWJlciBvZiBpdGVtcyBpbiB0aGUgbGlzdC5cblx0ICogQHByb3BlcnR5IF9sZW5ndGhcblx0ICogQHR5cGUgaW50XG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHR0aGlzLl9sZW5ndGggPSAwO1xuXG5cdC8qKlxuXHQgKiBQb2ludGVyIHRvIGZpcnN0IGl0ZW0gaW4gdGhlIGxpc3QuXG5cdCAqIEBwcm9wZXJ0eSBfaGVhZFxuXHQgKiBAdHlwZSBPYmplY3Rcblx0ICogQHByaXZhdGVcblx0ICovXG5cdHRoaXMuX2hlYWQgPSBudWxsO1xufVxuXG5MaW5rZWRMaXN0LnByb3RvdHlwZSA9IHtcblxuXHQvL3Jlc3RvcmUgY29uc3RydWN0b3Jcblx0Y29uc3RydWN0b3I6IExpbmtlZExpc3QsXG5cblx0LyoqXG5cdCAqIEFwcGVuZHMgc29tZSBkYXRhIHRvIHRoZSBlbmQgb2YgdGhlIGxpc3QuIFRoaXMgbWV0aG9kIHRyYXZlcnNlc1xuXHQgKiB0aGUgZXhpc3RpbmcgbGlzdCBhbmQgcGxhY2VzIHRoZSB2YWx1ZSBhdCB0aGUgZW5kIGluIGEgbmV3IGl0ZW0uXG5cdCAqIEBwYXJhbSB7dmFyaWFudH0gZGF0YSBUaGUgZGF0YSB0byBhZGQgdG8gdGhlIGxpc3QuXG5cdCAqIEByZXR1cm4ge1ZvaWR9XG5cdCAqIEBtZXRob2QgYWRkXG5cdCAqL1xuXHRhZGQ6IGZ1bmN0aW9uIChkYXRhKSB7XG5cblx0XHQvL2NyZWF0ZSBhIG5ldyBpdGVtIG9iamVjdCwgcGxhY2UgZGF0YSBpblxuXHRcdHZhciBub2RlID0ge1xuXHRcdFx0XHRkYXRhOiBkYXRhLFxuXHRcdFx0XHRuZXh0OiBudWxsXG5cdFx0XHR9LFxuXG5cdFx0XHQvL3VzZWQgdG8gdHJhdmVyc2UgdGhlIHN0cnVjdHVyZVxuXHRcdFx0Y3VycmVudDtcblxuXHRcdC8vc3BlY2lhbCBjYXNlOiBubyBpdGVtcyBpbiB0aGUgbGlzdCB5ZXRcblx0XHRpZiAodGhpcy5faGVhZCA9PT0gbnVsbCkge1xuXHRcdFx0dGhpcy5faGVhZCA9IG5vZGU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGN1cnJlbnQgPSB0aGlzLl9oZWFkO1xuXG5cdFx0XHR3aGlsZSAoY3VycmVudC5uZXh0KSB7XG5cdFx0XHRcdGN1cnJlbnQgPSBjdXJyZW50Lm5leHQ7XG5cdFx0XHR9XG5cblx0XHRcdGN1cnJlbnQubmV4dCA9IG5vZGU7XG5cdFx0fVxuXG5cdFx0Ly9kb24ndCBmb3JnZXQgdG8gdXBkYXRlIHRoZSBjb3VudFxuXHRcdHRoaXMuX2xlbmd0aCsrO1xuXG5cdH0sXG5cblx0LyoqXG5cdCAqIFJldHJpZXZlcyB0aGUgZGF0YSBpbiB0aGUgZ2l2ZW4gcG9zaXRpb24gaW4gdGhlIGxpc3QuXG5cdCAqIEBwYXJhbSB7aW50fSBpbmRleCBUaGUgemVyby1iYXNlZCBpbmRleCBvZiB0aGUgaXRlbSB3aG9zZSB2YWx1ZSBcblx0ICogICAgICBzaG91bGQgYmUgcmV0dXJuZWQuXG5cdCAqIEByZXR1cm4ge3ZhcmlhbnR9IFRoZSB2YWx1ZSBpbiB0aGUgXCJkYXRhXCIgcG9ydGlvbiBvZiB0aGUgZ2l2ZW4gaXRlbVxuXHQgKiAgICAgIG9yIG51bGwgaWYgdGhlIGl0ZW0gZG9lc24ndCBleGlzdC5cblx0ICogQG1ldGhvZCBpdGVtXG5cdCAqL1xuXHRpdGVtOiBmdW5jdGlvbiAoaW5kZXgpIHtcblxuXHRcdC8vY2hlY2sgZm9yIG91dC1vZi1ib3VuZHMgdmFsdWVzXG5cdFx0aWYgKGluZGV4ID4gLTEgJiYgaW5kZXggPCB0aGlzLl9sZW5ndGgpIHtcblx0XHRcdHZhciBjdXJyZW50ID0gdGhpcy5faGVhZCxcblx0XHRcdFx0aSA9IDA7XG5cblx0XHRcdHdoaWxlIChpKysgPCBpbmRleCkge1xuXHRcdFx0XHRjdXJyZW50ID0gY3VycmVudC5uZXh0O1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gY3VycmVudC5kYXRhO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqIFJlbW92ZXMgdGhlIGl0ZW0gZnJvbSB0aGUgZ2l2ZW4gbG9jYXRpb24gaW4gdGhlIGxpc3QuXG5cdCAqIEBwYXJhbSB7aW50fSBpbmRleCBUaGUgemVyby1iYXNlZCBpbmRleCBvZiB0aGUgaXRlbSB0byByZW1vdmUuXG5cdCAqIEByZXR1cm4ge3ZhcmlhbnR9IFRoZSBkYXRhIGluIHRoZSBnaXZlbiBwb3NpdGlvbiBpbiB0aGUgbGlzdCBvciBudWxsIGlmXG5cdCAqICAgICAgdGhlIGl0ZW0gZG9lc24ndCBleGlzdC5cblx0ICogQG1ldGhvZCByZW1vdmVcblx0ICovXG5cdHJlbW92ZTogZnVuY3Rpb24gKGluZGV4KSB7XG5cblx0XHQvL2NoZWNrIGZvciBvdXQtb2YtYm91bmRzIHZhbHVlc1xuXHRcdGlmIChpbmRleCA+IC0xICYmIGluZGV4IDwgdGhpcy5fbGVuZ3RoKSB7XG5cblx0XHRcdHZhciBjdXJyZW50ID0gdGhpcy5faGVhZCxcblx0XHRcdFx0cHJldmlvdXMsXG5cdFx0XHRcdGkgPSAwO1xuXG5cdFx0XHQvL3NwZWNpYWwgY2FzZTogcmVtb3ZpbmcgZmlyc3QgaXRlbVxuXHRcdFx0aWYgKGluZGV4ID09PSAwKSB7XG5cdFx0XHRcdHRoaXMuX2hlYWQgPSBjdXJyZW50Lm5leHQ7XG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdC8vZmluZCB0aGUgcmlnaHQgbG9jYXRpb25cblx0XHRcdFx0d2hpbGUgKGkrKyA8IGluZGV4KSB7XG5cdFx0XHRcdFx0cHJldmlvdXMgPSBjdXJyZW50O1xuXHRcdFx0XHRcdGN1cnJlbnQgPSBjdXJyZW50Lm5leHQ7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvL3NraXAgb3ZlciB0aGUgaXRlbSB0byByZW1vdmVcblx0XHRcdFx0cHJldmlvdXMubmV4dCA9IGN1cnJlbnQubmV4dDtcblx0XHRcdH1cblxuXHRcdFx0Ly9kZWNyZW1lbnQgdGhlIGxlbmd0aFxuXHRcdFx0dGhpcy5fbGVuZ3RoLS07XG5cblx0XHRcdC8vcmV0dXJuIHRoZSB2YWx1ZVxuXHRcdFx0cmV0dXJuIGN1cnJlbnQuZGF0YTtcblxuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cblx0fSxcblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIGl0ZW1zIGluIHRoZSBsaXN0LlxuXHQgKiBAcmV0dXJuIHtpbnR9IFRoZSBudW1iZXIgb2YgaXRlbXMgaW4gdGhlIGxpc3QuXG5cdCAqIEBtZXRob2Qgc2l6ZVxuXHQgKi9cblx0c2l6ZTogZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiB0aGlzLl9sZW5ndGg7XG5cdH0sXG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIHRoZSBsaXN0IGludG8gYW4gYXJyYXkuXG5cdCAqIEByZXR1cm4ge0FycmF5fSBBbiBhcnJheSBjb250YWluaW5nIGFsbCBvZiB0aGUgZGF0YSBpbiB0aGUgbGlzdC5cblx0ICogQG1ldGhvZCB0b0FycmF5XG5cdCAqL1xuXHR0b0FycmF5OiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIHJlc3VsdCA9IFtdLFxuXHRcdFx0Y3VycmVudCA9IHRoaXMuX2hlYWQ7XG5cblx0XHR3aGlsZSAoY3VycmVudCkge1xuXHRcdFx0cmVzdWx0LnB1c2goY3VycmVudC5kYXRhKTtcblx0XHRcdGN1cnJlbnQgPSBjdXJyZW50Lm5leHQ7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fSxcblxuXHQvKipcblx0ICogQ29udmVydHMgdGhlIGxpc3QgaW50byBhIHN0cmluZyByZXByZXNlbnRhdGlvbi5cblx0ICogQHJldHVybiB7U3RyaW5nfSBBIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgbGlzdC5cblx0ICogQG1ldGhvZCB0b1N0cmluZ1xuXHQgKi9cblx0dG9TdHJpbmc6IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gdGhpcy50b0FycmF5KCkudG9TdHJpbmcoKTtcblx0fVxufTtcblxuZnVuY3Rpb24gZmluZFN1Ykxpc3QobGlzdE9mTGlzdHMsIGVtYWlsYWRkcmVzcykge1xuXHRpZiAoZW1haWxhZGRyZXNzKSB7XG5cdFx0Ly8gU2VhcmNoIHRvIHNlZSBpZiB0aGUgZW1haWxhZGRyZXNzIGhhcyBhbHJlYWR5IGJlZW4gYWxsb2NhdGVkIHRvIGEgbGlzdFxuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgbGlzdE9mTGlzdHMuc2l6ZSgpOyArK2opIHtcblx0XHRcdGZvciAodmFyIGsgPSAwOyBrIDwgbGlzdE9mTGlzdHMuaXRlbShqKS5zaXplKCk7ICsraykge1xuXHRcdFx0XHRpZiAobGlzdE9mTGlzdHMuaXRlbShqKS5pdGVtKGspLmVtYWlsYWRkcmVzcy50b0xvd2VyQ2FzZSgpID09IGVtYWlsYWRkcmVzcy50b0xvd2VyQ2FzZSgpICYmXG5cdFx0XHRcdFx0IWxpc3RPZkxpc3RzLml0ZW0oaikuaXRlbShrKS5zdHVkZW50KSAvLyBzdHVkZW50cyBhcmUgYWx3YXlzIHRoZWlyIG93biBzdWJsaXN0XG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyZXR1cm4gbGlzdE9mTGlzdHMuaXRlbShqKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRyZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gQWRkTWVtYmVyVG9TdWJsaXN0KFN1Ykxpc3QsIG1lbWJlcikge1xuXHQvLyBTdHVkZW50cyBhcmUgdGhlaXIgb3duIHN1Ymxpc3Rcblx0aWYgKG1lbWJlci5zdHVkZW50KVxuXHRcdHJldHVybjtcblxuXHQvLyBTZWFyY2ggdG8gc2VlIGlmIHRoZSBlbWFpbGFkZHJlc3MgaGFzIGFscmVhZHkgYmVlbiBhbGxvY2F0ZWQgdG8gYSBsaXN0XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgU3ViTGlzdC5zaXplKCk7ICsraSkge1xuXHRcdC8vIElmIHRoZSBtZW1iZXIgaXMgYWxyZWFkeSBpbiB0aGUgc3VibGlzdCBvciBhIHN0dWRlbnQsIHRoZW4gbm90aGluZyB0byBkb1xuXHRcdGlmIChTdWJMaXN0Lml0ZW0oaSkuX2lkID09PSBtZW1iZXIuX2lkKVxuXHRcdFx0cmV0dXJuO1xuXHR9XG5cblx0Ly8gTWVtYmVyIG5vdCBmb3VuZCAtIGFkZCB0byB0aGUgIHN1Ymxpc3Rcblx0U3ViTGlzdC5hZGQobWVtYmVyKTtcbn1cblxuZnVuY3Rpb24gQ291bnRUb3RhbEluU3VibGlzdHMobGlzdE9mTGlzdHMpIHtcblx0dmFyIGNvdW50ID0gMDtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0T2ZMaXN0cy5zaXplKCk7ICsraSkge1xuXHRcdGNvdW50ICs9IGxpc3RPZkxpc3RzLml0ZW0oaSkuc2l6ZSgpO1xuXHRcdGlmIChsaXN0T2ZMaXN0cy5pdGVtKGkpLnNpemUoKSA+IDEpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdNdWx0aXBsZSBzdWJsaXN0Jyk7XG5cdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGxpc3RPZkxpc3RzLml0ZW0oaSkuc2l6ZSgpOyArK2opIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ2VtYWlsIGFkZHJlc3MsIF9pZCwgRmlyc3RuYW1lLCBGYW1pbHkgTmFtZTogJyArXG5cdFx0XHRcdFx0bGlzdE9mTGlzdHMuaXRlbShpKS5pdGVtKGopLmVtYWlsYWRkcmVzcywgKycsICcgK1xuXHRcdFx0XHRcdGxpc3RPZkxpc3RzLml0ZW0oaSkuaXRlbShqKS5faWQgKyAnLCAnICtcblx0XHRcdFx0XHRsaXN0T2ZMaXN0cy5pdGVtKGkpLml0ZW0oaikuZmlyc3RuYW1lICsgJywgJyArXG5cdFx0XHRcdFx0bGlzdE9mTGlzdHMuaXRlbShpKS5pdGVtKGopLmZhbWlseW5hbWUpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRyZXR1cm4gY291bnQ7XG59XG5cbmFuZ3VsYXIubW9kdWxlKCd0dGMnKVxuXHQuY29udHJvbGxlcignRmVlTWFuYWdlbWVudENvbnRyb2xsZXInLCBbJyRzY29wZScsICckbW9kYWxJbnN0YW5jZScsICdVc2VyU2VydmljZScsICdNZW1iZXJTZXJ2aWNlJywgJyRsb2cnLCAnJHdpbmRvdycsXG5cdGZ1bmN0aW9uICgkc2NvcGUsICRtb2RhbEluc3RhbmNlLCBVc2VyU2VydmljZSwgTWVtYmVyU2VydmljZSwgJGxvZywgJHdpbmRvdykge1xuXG5cdFx0XHQkc2NvcGUudW5wYWlkb25seSA9IGZhbHNlO1xuXHRcdFx0JHNjb3BlLnVzZXIgPSBVc2VyU2VydmljZTtcblxuXHRcdFx0ZnVuY3Rpb24gR2VuZXJhdGVBY2NvdW50cyhtZW1iZXJzKSB7XG5cdFx0XHRcdHZhciBsaXN0T2ZMaXN0cyA9IG5ldyBMaW5rZWRMaXN0O1xuXG5cdFx0XHRcdCRzY29wZS5hY2NvdW50cyA9IFtdO1xuXG5cdFx0XHRcdHZhciBTdGFydE9mU2Vhc29uID0gbW9tZW50KCcyMDE2LTA0LTAxJyk7XG5cblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBtZW1iZXJzLmxlbmd0aDsgKytpKSB7XG5cblx0XHRcdFx0XHQvLyBFbnN1cmUgdGhhdCBldmVyeSBtZW1iZXIgZG9jdW1lbnQgaGFzIGEgJ3BhaWQnIGZpZWxkXG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBtZW1iZXJzW2ldLnBhaWQgPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdFx0XHRtZW1iZXJzW2ldLnBhaWQgPSBmYWxzZTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR2YXIgRmFtaWx5TWVtYmVyU3ViTGlzdDtcblx0XHRcdFx0XHR2YXIgTWVtYmVyU3VibGlzdDtcblxuXHRcdFx0XHRcdC8vIFN0dWRlbnRzIGdldCBzcGVjaWFsIHRyZWF0bWVudCAtIGdpdmUgdGhlbSB0aGVpciBvd24gc3VibGlzdFxuXHRcdFx0XHRcdGlmIChtZW1iZXJzW2ldLnN0dWRlbnQpIHtcblx0XHRcdFx0XHRcdE1lbWJlclN1Ymxpc3QgPSBuZXcgTGlua2VkTGlzdDtcblx0XHRcdFx0XHRcdE1lbWJlclN1Ymxpc3QuYWRkKG1lbWJlcnNbaV0pO1xuXHRcdFx0XHRcdFx0bGlzdE9mTGlzdHMuYWRkKE1lbWJlclN1Ymxpc3QpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRcdC8vIFNlYXJjaCB0byBzZWUgaWYgdGhlIG1lbWJlcidzIGZhbWlseWVtYWlsYWRkcmVzcyBoYXMgYWxyZWFkeSBiZWVuIGFsbG9jYXRlZCB0byBhIGxpc3Rcblx0XHRcdFx0XHRcdGlmIChGYW1pbHlNZW1iZXJTdWJMaXN0ID0gZmluZFN1Ykxpc3QobGlzdE9mTGlzdHMsIG1lbWJlcnNbaV0uZmFtaWx5ZW1haWxhZGRyZXNzKSkge1xuXHRcdFx0XHRcdFx0XHQvLyBJZiBzbywgdGhlIG1lbWJlciBzaG91bGQgYmUgYWRkZWQgdG8gdGhhdCBzYW1lIHN1Ymxpc3QgaWYgbm90IGFscmVhZHkgdGhlcmVcblx0XHRcdFx0XHRcdFx0QWRkTWVtYmVyVG9TdWJsaXN0KEZhbWlseU1lbWJlclN1Ykxpc3QsIG1lbWJlcnNbaV0pO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0Ly8gQ2hlY2sgdG8gc2VlIGlmIHdlIG5lZWQgYSBuZXcgc3VibGlzdFxuXHRcdFx0XHRcdFx0XHRpZiAoIShNZW1iZXJTdWJsaXN0ID0gZmluZFN1Ykxpc3QobGlzdE9mTGlzdHMsIG1lbWJlcnNbaV0uZW1haWxhZGRyZXNzKSkpIHtcblx0XHRcdFx0XHRcdFx0XHRNZW1iZXJTdWJsaXN0ID0gbmV3IExpbmtlZExpc3Q7XG5cdFx0XHRcdFx0XHRcdFx0TWVtYmVyU3VibGlzdC5hZGQobWVtYmVyc1tpXSk7XG5cblx0XHRcdFx0XHRcdFx0XHQvLyBBZGQgdGhlIG5ldyBzdWJsaXN0IHRvIHRoZSBsaXN0IG9mIGxpc3RzXG5cdFx0XHRcdFx0XHRcdFx0bGlzdE9mTGlzdHMuYWRkKE1lbWJlclN1Ymxpc3QpO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0Ly8gSW5jbHVkZSB0aG9zZSBtZW1iZXJzIHVzaW5nIHRoZSBzYW1lIGVtYWlsYWRkcmVzcyBvciBmYW1pbHllbWFpbGFkZHJlc3Ncblx0XHRcdFx0XHRcdFx0Zm9yICh2YXIgaiA9IGkgKyAxOyBqIDwgbWVtYmVycy5sZW5ndGg7ICsrailcblx0XHRcdFx0XHRcdFx0XHRpZiAobWVtYmVyc1tpXS5lbWFpbGFkZHJlc3MudG9Mb3dlckNhc2UoKSA9PT0gbWVtYmVyc1tqXS5lbWFpbGFkZHJlc3MudG9Mb3dlckNhc2UoKSB8fFxuXHRcdFx0XHRcdFx0XHRcdFx0KG1lbWJlcnNbaV0uZmFtaWx5ZW1haWxhZGRyZXNzICYmIG1lbWJlcnNbaV0uZmFtaWx5ZW1haWxhZGRyZXNzLnRvTG93ZXJDYXNlKCkgPT09IG1lbWJlcnNbal0uZW1haWxhZGRyZXNzLnRvTG93ZXJDYXNlKCkpIHx8XG5cdFx0XHRcdFx0XHRcdFx0XHQobWVtYmVyc1tqXS5mYW1pbHllbWFpbGFkZHJlc3MgJiYgKG1lbWJlcnNbaV0uZW1haWxhZGRyZXNzLnRvTG93ZXJDYXNlKCkgPT09IG1lbWJlcnNbal0uZmFtaWx5ZW1haWxhZGRyZXNzLnRvTG93ZXJDYXNlKCkpKVxuXHRcdFx0XHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0QWRkTWVtYmVyVG9TdWJsaXN0KE1lbWJlclN1Ymxpc3QsIG1lbWJlcnNbal0pO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0Y29uc29sZS5sb2coJ1RvdGFsIE1lbWJlcnM6ICcsIG1lbWJlcnMubGVuZ3RoKTtcblx0XHRcdFx0Y29uc29sZS5sb2coJ1RvdGFsIHN1Ymxpc3RzOiAnLCBsaXN0T2ZMaXN0cy5zaXplKCkpO1xuXHRcdFx0XHRjb25zb2xlLmxvZygnVG90YWwgY291bnQgaW4gc3ViIGxpc3RzOiAnLCBDb3VudFRvdGFsSW5TdWJsaXN0cyhsaXN0T2ZMaXN0cykpO1xuXG5cdFx0XHRcdC8vIE5vdyBjcmVhdGUgdGhlIGFjY291bnRzIGZyb20gdGhlIGxpc3RPZkxpc3RzXG5cdFx0XHRcdCRzY29wZS5hY2NvdW50cyA9IFtdO1xuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGxpc3RPZkxpc3RzLnNpemUoKTsgKytpKSB7XG5cdFx0XHRcdFx0Ly8gVGhlIG5hbWUgb2YgdGhlIG9sZGVzdCBwZXJzb24gaXMgdG8gYmUgdGhlIG5hbWUgb2YgdGhlIGFjY291bnRcblx0XHRcdFx0XHR2YXIgb2xkZXN0ID0gMDtcblx0XHRcdFx0XHRmb3IgKHZhciBqID0gMTsgaiA8IGxpc3RPZkxpc3RzLml0ZW0oaSkuc2l6ZSgpOyArK2opXG5cdFx0XHRcdFx0XHRpZiAobGlzdE9mTGlzdHMuaXRlbShpKS5pdGVtKGopLmRvYiA8IGxpc3RPZkxpc3RzLml0ZW0oaSkuaXRlbShvbGRlc3QpLmRvYilcblx0XHRcdFx0XHRcdFx0b2xkZXN0ID0gajtcblxuXHRcdFx0XHRcdFx0Ly8gSWYgZXZlcnlvbmUgaW4gYSBzdWJsaXN0IGlzIGZsYWdnZWQgYXMgcGFpZCwgXG5cdFx0XHRcdFx0XHQvLyB0aGVuIHRoZSBBY2NvdW50IGFzIGEgd2hvbGUgaXMgZmxhZ2dlZCBhcyBwYWlkXG5cdFx0XHRcdFx0dmFyIHBhaWQgPSB0cnVlO1xuXHRcdFx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgbGlzdE9mTGlzdHMuaXRlbShpKS5zaXplKCk7ICsraikge1xuXHRcdFx0XHRcdFx0cGFpZCA9IHBhaWQgJiYgbGlzdE9mTGlzdHMuaXRlbShpKS5pdGVtKGopLnBhaWQ7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRGV0ZXJtaW5lIHRoZSBmZWVzIGZvciB0aGUgYWNjb3VudFxuXHRcdFx0XHRcdHZhciBmZWVzID0gMDtcblx0XHRcdFx0XHRmZWVfY2FsY3VsYXRpb246IHtcblx0XHRcdFx0XHRcdHZhciBhZHVsdHMgPSAwO1xuXHRcdFx0XHRcdFx0dmFyIGp1bmlvcnMgPSAwO1xuXHRcdFx0XHRcdFx0dmFyIGV4ZWNzID0gMDsgLy8gRXhlY3MgZ2V0IGEgZGlzY291bnRcblx0XHRcdFx0XHRcdHZhciBsaWZldGltZXMgPSAwOyAvLyBMaWZldGltZSBtZW1iZXJzIHBheSBubyBmZWVzXG5cblx0XHRcdFx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgbGlzdE9mTGlzdHMuaXRlbShpKS5zaXplKCk7ICsraikge1xuXG5cdFx0XHRcdFx0XHRcdC8vIFN0dWRlbnRzIGdldCBzcGVjaWFsIGhhbmRsaW5nXG5cdFx0XHRcdFx0XHRcdGlmIChsaXN0T2ZMaXN0cy5pdGVtKGkpLml0ZW0oaikuc3R1ZGVudCkge1xuXHRcdFx0XHRcdFx0XHRcdGZlZXMgPSAnMTA1LjAwJztcblx0XHRcdFx0XHRcdFx0XHRicmVhayBmZWVfY2FsY3VsYXRpb247XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHQvLyBZb3VuZ2VyIHRoYW4gMTggaXMgYSBqdW5pb3Jcblx0XHRcdFx0XHRcdFx0dmFyIGRvYiA9IG1vbWVudChsaXN0T2ZMaXN0cy5pdGVtKGkpLml0ZW0oaikuZG9iLCBbJ01NLURELVlZWVknLCAnWVlZWS1NTS1ERCddKTtcblx0XHRcdFx0XHRcdFx0dmFyIGRpZmYgPSBTdGFydE9mU2Vhc29uLmRpZmYoZG9iLCAneWVhcnMnKTtcblx0XHRcdFx0XHRcdFx0aWYgKGRpZmYgPCAxOClcblx0XHRcdFx0XHRcdFx0XHQrK2p1bmlvcnM7XG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHQrK2FkdWx0cztcblxuXHRcdFx0XHRcdFx0XHRpZiAoQm9vbGVhbihsaXN0T2ZMaXN0cy5pdGVtKGkpLml0ZW0oaikuZXhlYykgJiYgbGlzdE9mTGlzdHMuaXRlbShpKS5pdGVtKGopLmV4ZWMgIT0gJ2xpZmV0aW1lJylcblx0XHRcdFx0XHRcdFx0XHQrK2V4ZWNzO1xuXG5cdFx0XHRcdFx0XHRcdGlmIChCb29sZWFuKGxpc3RPZkxpc3RzLml0ZW0oaSkuaXRlbShqKS5leGVjKSAmJiBsaXN0T2ZMaXN0cy5pdGVtKGkpLml0ZW0oaikuZXhlYyA9PSAnbGlmZXRpbWUnKVxuXHRcdFx0XHRcdFx0XHRcdCsrbGlmZXRpbWVzO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHR2YXIgU2luZ2xlc0ZlZSA9IDI0Ni43NTtcblx0XHRcdFx0XHRcdHZhciBDb3VwbGVzRmVlID0gMzg4LjUwO1xuXG5cdFx0XHRcdFx0XHRpZiAoYWR1bHRzID09IDEpIHtcblx0XHRcdFx0XHRcdFx0aWYgKGp1bmlvcnMgPT0gMClcblx0XHRcdFx0XHRcdFx0XHRmZWVzID0gU2luZ2xlc0ZlZTtcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiAoanVuaW9ycyA9PSAxKVxuXHRcdFx0XHRcdFx0XHRcdGZlZXMgPSAzMDAuMDBcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiAoanVuaW9ycyA+PSAyKVxuXHRcdFx0XHRcdFx0XHRcdGZlZXMgPSAzNTAuMDBcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYWR1bHRzID09IDIpIHtcblx0XHRcdFx0XHRcdFx0aWYgKGp1bmlvcnMgPT0gMClcblx0XHRcdFx0XHRcdFx0XHRmZWVzID0gQ291cGxlc0ZlZTtcblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdGZlZXMgPSA0NTAuMDA7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFkdWx0cyA9PSAzKSB7IC8vIEEganVuaW9yIHdpbGwgYmUgMTggb24gQXByaWwgMXN0XG5cdFx0XHRcdFx0XHRcdGZlZXMgPSA0NTAuMDA7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnYWR1bHRzLCBqdW5pb3JzLCBleGVjczogJyArIGFkdWx0cyArICcsICcgKyBqdW5pb3JzICsgJywgJyArIGV4ZWNzKTtcblx0XHRcdFx0XHRcdFx0ZmVlcyA9ICdFUlJPUic7IC8vIFdlIGhhdmUgYSBwcm9ibGVtIGlmIGhlcmUuXG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmIChhZHVsdHMgPT0gMSAmJiBsaWZldGltZXMgPT0gMSkge1xuXHRcdFx0XHRcdFx0XHRmZWVzID0gMDtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYWR1bHRzID09IDIgJiYgbGlmZXRpbWVzID09IDEpIHtcblx0XHRcdFx0XHRcdFx0ZmVlcyA9IFNpbmdsZXNGZWU7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGZvciAodmFyIGV4ZWNfaSA9IDA7IGV4ZWNfaSA8IGV4ZWNzOyArK2V4ZWNfaSlcblx0XHRcdFx0XHRcdFx0ZmVlcyAtPSBTaW5nbGVzRmVlIC8gMi4wO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIE9ubHkgZGVhbCB3aXRoIGRvbGxhcnNcblx0XHRcdFx0XHRmZWVzID0gTWF0aC5yb3VuZChmZWVzKTtcblxuXHRcdFx0XHRcdC8vIENyZWF0ZSB0aGUgdG9vbHRpcHMgZm9yIHRoZSBhY2NvdW50XG5cdFx0XHRcdFx0dmFyIHRvb2x0aXAgPSBcIlwiO1xuXHRcdFx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgbGlzdE9mTGlzdHMuaXRlbShpKS5zaXplKCk7ICsraikge1xuXHRcdFx0XHRcdFx0dG9vbHRpcCArPSBfLmNhcGl0YWxpemUobGlzdE9mTGlzdHMuaXRlbShpKS5pdGVtKGopLmZpcnN0bmFtZSArICcgJyArXG5cdFx0XHRcdFx0XHRcdGxpc3RPZkxpc3RzLml0ZW0oaSkuaXRlbShqKS5mYW1pbHluYW1lICsgJywgRG9COiAnICtcblx0XHRcdFx0XHRcdFx0bGlzdE9mTGlzdHMuaXRlbShpKS5pdGVtKGopLmRvYik7XG5cdFx0XHRcdFx0XHRpZiAoaiA8IGxpc3RPZkxpc3RzLml0ZW0oaSkuc2l6ZSgpIC0gMSkgdG9vbHRpcCArPSAnIHwgJ1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHZhciBhY2NvdW50ID0ge1xuXHRcdFx0XHRcdFx0bWVtYmVyczogbGlzdE9mTGlzdHMuaXRlbShpKS50b0FycmF5KCksXG5cdFx0XHRcdFx0XHRhY2NvdW50bmFtZTogXy5jYXBpdGFsaXplKGxpc3RPZkxpc3RzLml0ZW0oaSkuaXRlbShvbGRlc3QpLmZhbWlseW5hbWUgKyAnLCAnICsgbGlzdE9mTGlzdHMuaXRlbShpKS5pdGVtKG9sZGVzdCkuZmlyc3RuYW1lKSxcblx0XHRcdFx0XHRcdGVtYWlsYWRkcmVzczogbGlzdE9mTGlzdHMuaXRlbShpKS5pdGVtKG9sZGVzdCkuZW1haWxhZGRyZXNzLFxuXHRcdFx0XHRcdFx0cGFpZDogcGFpZCxcblx0XHRcdFx0XHRcdGZlZXM6IGZlZXMsXG5cdFx0XHRcdFx0XHR0b29sdGlwOiB0b29sdGlwXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHQkc2NvcGUuYWNjb3VudHMucHVzaChhY2NvdW50KTtcblx0XHRcdFx0fVxuXHRcdFx0XHQkc2NvcGUuYWNjb3VudHMuc29ydChmdW5jdGlvbiAoYSwgYikge1xuXHRcdFx0XHRcdGlmIChhLmFjY291bnRuYW1lID4gYi5hY2NvdW50bmFtZSkgcmV0dXJuIDE7XG5cdFx0XHRcdFx0aWYgKGEuYWNjb3VudG5hbWUgPCBiLmFjY291bnRuYW1lKSByZXR1cm4gLTE7XG5cdFx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0XHRNZW1iZXJTZXJ2aWNlLmdldEFsbE1lbWJlcnMoKVxuXHRcdFx0XHQudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdCRzY29wZS5tZW1iZXJzID0gZGF0YTtcblx0XHRcdFx0XHRHZW5lcmF0ZUFjY291bnRzKCRzY29wZS5tZW1iZXJzKTtcblx0XHRcdFx0fSlcblx0XHRcdFx0LmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcblx0XHRcdFx0XHQkd2luZG93LmFsZXJ0KGVycik7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHQkc2NvcGUuVG9nZ2xlID0gZnVuY3Rpb24gKGFjY291bnQpIHtcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhY2NvdW50Lm1lbWJlcnMubGVuZ3RoOyArK2kpIHtcblx0XHRcdFx0XHRhY2NvdW50Lm1lbWJlcnNbaV0ucGFpZCA9ICFhY2NvdW50LnBhaWQ7XG5cdFx0XHRcdFx0TWVtYmVyU2VydmljZS5zYXZlTWVtYmVyKGFjY291bnQubWVtYmVyc1tpXSwgZnVuY3Rpb24gKGVycikge1xuXHRcdFx0XHRcdFx0aWYgKGVycilcblx0XHRcdFx0XHRcdFx0JHdpbmRvdy5hbGVydChlcnIpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdCRzY29wZS5DbG9zZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0JG1vZGFsSW5zdGFuY2UuZGlzbWlzcygnTm8nKTtcblx0XHRcdH1cbn1dKTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLy8gZWRpdFBlcnNvbmFsSW5mb0N0cmwgQ29udHJvbGxlclxuYW5ndWxhci5tb2R1bGUoJ3R0YycpXG4uY29udHJvbGxlcignZWRpdFBlcnNvbmFsSW5mb0N0cmwnLCBbJyRzY29wZScsICdwbGFjZXNTZXJ2aWNlJywgJ01lbWJlclNlcnZpY2UnLCAnJGxvZycsICckd2luZG93JywgJyRtb2RhbEluc3RhbmNlJywgJyRtb2RhbCcsXG5mdW5jdGlvbiAoJHNjb3BlLCBwbGFjZXNTZXJ2aWNlLCBNZW1iZXJTZXJ2aWNlLCAkbG9nLCAkd2luZG93LCAkbW9kYWxJbnN0YW5jZSwgJG1vZGFsKSB7XG5cdFxuXHQkc2NvcGUubWVtYmVyIFx0XHRcdFx0PSB7fTtcblx0JHNjb3BlLmFsbGVtYWlsYWRkcmVzc2VzXHQ9IFtdO1xuXHQkc2NvcGUubmV3X2FwcGxpY2FudFx0XHQ9IGZhbHNlO1xuXHQkc2NvcGUucGxhY2VzIFx0XHRcdFx0PSBwbGFjZXNTZXJ2aWNlLmdldCAoKTtcblx0JHNjb3BlLlRUQ0RlYnVnXHRcdFx0XHQ9IGZhbHNlO1xuXG5cdE1lbWJlclNlcnZpY2UuZ2V0QWxsRW1haWxBZGRyZXNzZXMgKClcblx0XHQudGhlbiAgKGZ1bmN0aW9uIChlbWFpbGFkZHJlc3NlcykgeyRzY29wZS5hbGxlbWFpbGFkZHJlc3NlcyA9IGVtYWlsYWRkcmVzc2VzO30pXG5cdFx0LmNhdGNoICgkd2luZG93LmFsZXJ0KTtcdFxuXHRcblx0TWVtYmVyU2VydmljZS5nZXRNZW1iZXIgKClcblx0XHQudGhlbiAoZnVuY3Rpb24gKG1lbWJlcikgeyRzY29wZS5tZW1iZXIgPSBtZW1iZXI7ICRzY29wZS5jb25maXJtZW1haWxhZGRyZXNzID0gbWVtYmVyLmVtYWlsYWRkcmVzczt9KVxuXHRcdC5jYXRjaCAoJHdpbmRvdy5hbGVydCk7XG5cdFx0XG5cdCRzY29wZS5TYXZlID0gZnVuY3Rpb24gKCkge1xuXHQgXHRNZW1iZXJTZXJ2aWNlLnNhdmVNZW1iZXIgKCRzY29wZS5tZW1iZXIpXG5cdFx0XHQudGhlbiAoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHQkbW9kYWxJbnN0YW5jZS5jbG9zZSAoJ1llcycpOyBcblx0XHRcdFx0JHNjb3BlLm9wZW5HZW5lcmFsTW9kYWwgKCdFZGl0cyB0byB5b3VyIHBlcnNvbmFsIHByb2ZpbGUgaGF2ZSBiZWVuIHNhdmVkLicpO1xuXHRcdFx0fSlcblx0XHRcdC5jYXRjaCAoJHdpbmRvdy5hbGVydCk7XG5cdH1cblxuXHQkc2NvcGUuQ2FuY2VsID0gZnVuY3Rpb24gKCkge1xuXHRcdCRtb2RhbEluc3RhbmNlLmRpc21pc3MoJ05vJyk7XG5cdH07XG5cdFx0XHRcdFxuXHQkc2NvcGUubm9ybWFsaXplQ2FuYWRpYW5Qb3N0YWxDb2RlcyA9IGZ1bmN0aW9uICgpXG5cdHtcblx0XHQkc2NvcGUubWVtYmVyLnBvc3Rjb2RlID0gJHNjb3BlLm1lbWJlci5wb3N0Y29kZS5yZXBsYWNlICgnICcsICcnKS50b1VwcGVyQ2FzZSAoKTtcblx0fTtcblx0XHRcblx0JHNjb3BlLm5vcm1hbGl6ZVByaW1hcnlQaG9uZU51bWJlciA9IGZ1bmN0aW9uICgpIHtcblx0XHQkc2NvcGUubWVtYmVyLnByaW1hcnlwaG9uZSA9IG5vcm1hbGl6ZVBob25lTnVtYmVyICgkc2NvcGUubWVtYmVyLnByaW1hcnlwaG9uZSk7XG5cdH07XG5cblx0JHNjb3BlLm5vcm1hbGl6ZUFsdGVybmF0aXZlUGhvbmVOdW1iZXIgPSBmdW5jdGlvbiAoKSB7XG5cdFx0JHNjb3BlLm1lbWJlci5hbHRlcm5hdGl2ZXBob25lID0gbm9ybWFsaXplUGhvbmVOdW1iZXIgKCRzY29wZS5tZW1iZXIuYWx0ZXJuYXRpdmVwaG9uZSk7XG5cdH07XG5cdFxuXHQvLyBPcGVucyB0aGUgTWlzc2lvbiAmIFZhbHVlcyBtb2RhbFxuXHQkc2NvcGUub3BlblJlbGVhc2VPZkxpYWJpbGl0eSA9IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgbW9kYWxJbnN0YW5jZSA9ICRtb2RhbC5vcGVuKHtcblx0XHRcdHRlbXBsYXRlVXJsOlx0Jy9uZy10ZW1wbGF0ZXMvcmVsZWFzZS1vZi1saWFiaWxpdHktd2FpdmVyLWFuZC1jbGFpbXMuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiBcdCdSZWxlYXNlT2ZMaWFiaWxpdHlDb250cm9sbGVyJyxcblx0XHRcdHNpemU6IFx0XHRcdCcnLFxuXHRcdFx0YmFja2Ryb3A6IFx0XHR0cnVlLFxuXHRcdFx0cmVzb2x2ZTogXHRcdHt9XG5cdFx0fSk7XG5cblx0XHRtb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuIChmdW5jdGlvbiAoKSB7XG5cdFx0XHQkbG9nLmluZm8gKCdNb2RhbCBjbG9zZWQgYXQ6ICcgKyBuZXcgRGF0ZSgpKTtcblx0XHR9LCBmdW5jdGlvbiAoKSB7XG5cdFx0XHQkbG9nLmluZm8gKCdNb2RhbCBkaXNtaXNzZWQgYXQ6ICcgKyBuZXcgRGF0ZSgpKTtcblx0XHR9KTtcblx0fTtcblx0XG5cdC8vIE9wZW5zIHRoZSBNaXNzaW9uICYgVmFsdWVzIG1vZGFsXG5cdCRzY29wZS5vcGVuQ29tbXVuaWNhdGlvbnNDb25zZW50ID0gZnVuY3Rpb24gKCkge1xuXHRcdHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xuXHRcdFx0dGVtcGxhdGVVcmw6ICcvbmctdGVtcGxhdGVzL2NvbW11bmljYXRpb25zLWNvbnNlbnQuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnQ29tbXVuaWNhdGlvbnNDb25zZW50Q29udHJvbGxlcicsXG5cdFx0XHRzaXplOiAnJyxcblx0XHRcdGJhY2tkcm9wOiB0cnVlLFxuXHRcdFx0cmVzb2x2ZToge31cblx0XHR9KTtcblxuXHRcdG1vZGFsSW5zdGFuY2UucmVzdWx0LnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0JGxvZy5pbmZvICgnTW9kYWwgY2xvc2VkIGF0OiAnICsgbmV3IERhdGUoKSk7XG5cdFx0fSwgZnVuY3Rpb24gKCkge1xuXHRcdFx0JGxvZy5pbmZvICgnTW9kYWwgZGlzbWlzc2VkIGF0OiAnICsgbmV3IERhdGUoKSk7XG5cdFx0fSk7XG5cdH07XG5cblx0XHQvLyBPcGVucyB0aGUgTWlzc2lvbiAmIFZhbHVlcyBtb2RhbFxuXHQkc2NvcGUub3BlblBob3RvZ3JhcGhDb25zZW50ID0gZnVuY3Rpb24gKCkge1xuXHRcdCRsb2cuaW5mbyAoJ09wZW4gTW9kYWwnKTtcblx0XHR2YXIgbW9kYWxJbnN0YW5jZSA9ICRtb2RhbC5vcGVuKHtcblx0XHRcdHRlbXBsYXRlVXJsOiAnL25nLXRlbXBsYXRlcy9waG90b2dyYXBoLWNvbnNlbnQuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnUGhvdG9ncmFwaENvbnNlbnRDb250cm9sbGVyJyxcblx0XHRcdHNpemU6ICcnLFxuXHRcdFx0YmFja2Ryb3A6IHRydWUsXG5cdFx0XHRyZXNvbHZlOiB7fVxuXHRcdH0pO1xuXG5cdFx0bW9kYWxJbnN0YW5jZS5yZXN1bHQudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHQkbG9nLmluZm8gKCdNb2RhbCBjbG9zZWQgYXQ6ICcgKyBuZXcgRGF0ZSgpKTtcblx0XHR9LCBmdW5jdGlvbiAoKSB7XG5cdFx0XHQkbG9nLmluZm8gKCdNb2RhbCBkaXNtaXNzZWQgYXQ6ICcgKyBuZXcgRGF0ZSgpKTtcblx0XHR9KTtcblx0fTtcblx0XG5cdCRzY29wZS5vcGVuR2VuZXJhbE1vZGFsID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcblx0XHR2YXIgbW9kYWxJbnN0YW5jZSA9ICRtb2RhbC5vcGVuKHtcblx0XHRcdHRlbXBsYXRlOiBcblx0XHRcdFx0JzxkaXYgY2xhc3M9XCJtb2RhbC1oZWFkZXJcIj4nICtcblx0XHRcdFx0XHQnPGg0IGNsYXNzPVwidGV4dC1jZW50ZXIgYnRuIGJ0bi13YXJuaW5nXCI+VHNhd3dhc3NlbiBUZW5uaXMgQ2x1YjwvaDQ+JyArXG5cdFx0XHRcdFx0JzxidXR0b24gY2xhc3M9XCJidG4gYnRuLXdhcm5pbmcgYnRuLXhzIHZpc2libGUteHMtYmxvY2tcIiB0eXBlPVwiYnV0dG9uXCIgbmctY2xpY2s9XCJDbG9zZSgpXCIgc3R5bGU9XCJkaXNwbGF5OmlubGluZTtcIj5DbG9zZTwvYnV0dG9uPicgK1xuXHRcdFx0XHQnPC9kaXY+JyArXG5cblx0XHRcdFx0JzxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5XCI+JyArXG5cdFx0XHRcdFx0JzxzdHJvbmcgY2xhc3M9XCJ0ZXh0LWNlbnRlclwiPicgKyBtZXNzYWdlICsgJzwvc3Ryb25nPicgK1xuXHRcdFx0XHQnPC9kaXY+JyArXG5cdFx0XHRcdCc8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+JyArXG5cdFx0XHRcdFx0JzxidXR0b24gY2xhc3M9XCJidG4gYnRuLXdhcm5pbmdcIiB0eXBlPVwiYnV0dG9uXCIgbmctY2xpY2s9XCJDbG9zZSgpXCI+Q2xvc2U8L2J1dHRvbj4nICtcblx0XHRcdFx0JzwvZGl2PicsXG5cdFx0XHRjb250cm9sbGVyOiAnR2VuZXJhbE1vZGFsQ29udHJvbGxlcicsXG5cdFx0XHRzaXplOiAnc20nLFxuXHRcdFx0YmFja2Ryb3A6IHRydWUsXG5cdFx0XHRyZXNvbHZlOiB7fVxuXHRcdH0pO1xuXHRcdFxuXHRcdG1vZGFsSW5zdGFuY2UucmVzdWx0LnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0JGxvZy5pbmZvICgnTW9kYWwgY2xvc2VkIGF0OiAnICsgbmV3IERhdGUoKSk7XG5cdFx0fSwgZnVuY3Rpb24gKCkge1xuXHRcdFx0JGxvZy5pbmZvICgnTW9kYWwgZGlzbWlzc2VkIGF0OiAnICsgbmV3IERhdGUoKSk7XG5cdFx0fSk7XG5cdH07XG59XSk7XG5cbmFuZ3VsYXIubW9kdWxlKCd0dGMnKVxuLmNvbnRyb2xsZXIoJ1JlbGVhc2VPZkxpYWJpbGl0eUNvbnRyb2xsZXInLCBbJyRzY29wZScsICckbW9kYWxJbnN0YW5jZScsXG5cdGZ1bmN0aW9uICgkc2NvcGUsICRtb2RhbEluc3RhbmNlKSB7XG5cblx0XHQkc2NvcGUuQ2xvc2UgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHQkbW9kYWxJbnN0YW5jZS5kaXNtaXNzICgnY2FuY2VsJyk7XG5cdFx0fTtcbn1dKTtcblxuYW5ndWxhci5tb2R1bGUoJ3R0YycpXG4uY29udHJvbGxlcignQ29tbXVuaWNhdGlvbnNDb25zZW50Q29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRtb2RhbEluc3RhbmNlJyxcblx0ZnVuY3Rpb24gKCRzY29wZSwgJG1vZGFsSW5zdGFuY2UpIHtcblxuXHRcdCRzY29wZS5DbG9zZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdCRtb2RhbEluc3RhbmNlLmRpc21pc3MgKCdjYW5jZWwnKTtcblx0XHR9O1xuXG59XSk7XG5cbmFuZ3VsYXIubW9kdWxlKCd0dGMnKVxuLmNvbnRyb2xsZXIoJ1Bob3RvZ3JhcGhDb25zZW50Q29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRtb2RhbEluc3RhbmNlJyxcblx0ZnVuY3Rpb24gKCRzY29wZSwgJG1vZGFsSW5zdGFuY2UpIHtcblxuXHRcdCRzY29wZS5DbG9zZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdCRtb2RhbEluc3RhbmNlLmRpc21pc3MgKCdjYW5jZWwnKTtcblx0XHR9O1xufV0pO1xuXG5hbmd1bGFyLm1vZHVsZSgndHRjJylcbi5jb250cm9sbGVyKCdHZW5lcmFsTW9kYWxDb250cm9sbGVyJywgWyckc2NvcGUnLCAnJG1vZGFsSW5zdGFuY2UnLFxuXHRmdW5jdGlvbiAoJHNjb3BlLCAkbW9kYWxJbnN0YW5jZSkge1xuXG5cdFx0JHNjb3BlLkNsb3NlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0JG1vZGFsSW5zdGFuY2UuZGlzbWlzcyAoJ2NhbmNlbCcpO1xuXHRcdH07XG59XSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLy8gQ29udHJvbGxlciBmb3IgdGhlIG1haW4gSW5kZXguaHRtbCBwYWdlXG5hbmd1bGFyLm1vZHVsZSgndHRjJylcbi5jb250cm9sbGVyICgnSW5kZXhDb250cm9sbGVyJyxbJyRzY29wZScsICdVc2VyU2VydmljZScsICckbW9kYWwnLCAnJGxvZycsICdkZXZpY2VEZXRlY3RvcicsIGZ1bmN0aW9uICgkc2NvcGUsIFVzZXJTZXJ2aWNlLCAkbW9kYWwsICRsb2csIGRldmljZURldGVjdG9yKSB7XG5cdFx0JHNjb3BlLnVzZXIgXHQ9IFVzZXJTZXJ2aWNlO1xuXHRcdCRzY29wZS5kZXZpY2VcdD0gZGV2aWNlRGV0ZWN0b3I7XG5cdFx0XG5cdFx0Ly8gT3BlbnMgdGhlIG1vZGFsc1xuXHRcdCRzY29wZS5vcGVuID0gZnVuY3Rpb24gKHdoaWNoU2l6ZSwgd2hpY2hNb2RhbCwgd2hpY2hDb250cm9sbGVyKSB7XG5cdFx0XHQkbG9nLmluZm8gKCdPcGVuIE1vZGFsJyk7XG5cdFx0XHR2YXIgbW9kYWxJbnN0YW5jZSA9ICRtb2RhbC5vcGVuKHtcblx0XHRcdFx0dGVtcGxhdGVVcmw6IHdoaWNoTW9kYWwsXG5cdFx0XHRcdGNvbnRyb2xsZXI6IHdoaWNoQ29udHJvbGxlcixcblx0XHRcdFx0c2l6ZTogd2hpY2hTaXplLFxuXHRcdFx0XHRiYWNrZHJvcDogdHJ1ZSxcblx0XHRcdFx0cmVzb2x2ZToge31cblx0XHRcdH0pO1xuXG5cdFx0XHRtb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0JGxvZy5pbmZvICgnTW9kYWwgY2xvc2VkIGF0OiAnICsgbmV3IERhdGUoKSk7XG5cdFx0XHR9LCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdCRsb2cuaW5mbyAoJ01vZGFsIGRpc21pc3NlZCBhdDogJyArIG5ldyBEYXRlKCkpO1xuXHRcdFx0fSk7XG5cdFx0fTtcblx0fVxuXSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuYW5ndWxhci5tb2R1bGUoJ3R0YycpXG4uY29udHJvbGxlcihcIkhvbWVDb250cm9sbGVyXCIsIFsnJHNjb3BlJywgJ01lbWJlclNlcnZpY2UnLCAnJG1vZGFsJywgJyRsb2cnLCAnTmV3c0l0ZW1TZXJ2aWNlJywgJ2RldmljZURldGVjdG9yJyxcbmZ1bmN0aW9uICgkc2NvcGUsIE1lbWJlclNlcnZpY2UsICRtb2RhbCwgJGxvZywgTmV3c0l0ZW1TZXJ2aWNlLCBkZXZpY2VEZXRlY3Rvcikge1xuXG5cdCRzY29wZS5kZXZpY2UgXHRcdD1cdFx0ZGV2aWNlRGV0ZWN0b3I7XG5cdFxuXHQkc2NvcGUuTWVtYmVyQ291bnQgXHQ9IFx0XHQwO1xuXHRNZW1iZXJTZXJ2aWNlLkNvdW50TWVtYmVycyAoKSBcblx0XHQudGhlbiAoZnVuY3Rpb24gKGRhdGEpIHskc2NvcGUuTWVtYmVyQ291bnQgPSBkYXRhO30pO1xuXHRcblx0JHNjb3BlLk1lbWJlcnNCeURlY2FkZSA9IFtbXV07XG5cdCRzY29wZS5NZW1iZXJzQnlEZWNhZGVMYWJlbHMgPSBbXCIwLTlcIiwgXCIxMC0xOVwiLCBcIjIwLTI5XCIsIFwiMzAtMzlcIiwgXCI0MC00OVwiLCBcIjUwLTU5XCIsIFwiNjAtNjlcIiwgXCI3MC03OVwiLCBcIjgwLTg5XCJdO1xuXHQkc2NvcGUuTWVtYmVyc0J5RGVjYWRlU2VyaWVzID0gWydNZW1iZXJzIEJ5IERlY2FkZSddO1xuXHQvKk1lbWJlclNlcnZpY2UuQ291bnRNZW1iZXJzQnlEZWNhZGUgKClcblx0XHQudGhlbiAoZnVuY3Rpb24gKGRhdGEpIHskc2NvcGUuTWVtYmVyc0J5RGVjYWRlWzBdID0gZGF0YTt9KTtcblx0Ki9cblxuXHQkc2NvcGUuTWVtYmVyc0J5QmlydGhNb250aCA9IFtbXV07XG5cdCRzY29wZS5NZW1iZXJzQnlCaXJ0aE1vbnRoTGFiZWxzID0gW1wiSmFuXCIsIFwiRmViXCIsIFwiTWFyXCIsIFwiQXByXCIsIFwiTWF5XCIsIFwiSnVuXCIsIFwiSnVsXCIsIFwiQXVnXCIsIFwiU2VwXCIsIFwiT2N0XCIsIFwiTm92XCIsIFwiRGVjXCJdO1xuXHQkc2NvcGUuTWVtYmVyc0J5QmlydGhNb250aFNlcmllcyA9IFsnTWVtYmVycyBCeSBCaXJ0aCBNb250aCddO1xuXHQvKk1lbWJlclNlcnZpY2UuQ291bnRNZW1iZXJzQnlCaXJ0aE1vbnRoICgpXG5cdFx0LnRoZW4gKGZ1bmN0aW9uIChkYXRhKSB7JHNjb3BlLk1lbWJlcnNCeUJpcnRoTW9udGhbMF0gPSBkYXRhO30pO1xuXHQqL1xuXG5cdCRzY29wZS5vbkNsaWNrID0gZnVuY3Rpb24gKHBvaW50cywgZXZ0KSB7XG5cdFx0Y29uc29sZS5sb2cocG9pbnRzLCBldnQpO1xuXHR9O1xuXHRcblx0TmV3c0l0ZW1TZXJ2aWNlLmdldEFsbCAoKVxuXHRcdC50aGVuIChmdW5jdGlvbiAoTmV3c0l0ZW1zKSB7JHNjb3BlLk5ld3NJdGVtcyA9IE5ld3NJdGVtczt9KTtcblxuXHQvLyBPcGVucyB0aGUgTWlzc2lvbiAmIFZhbHVlcyBtb2RhbFxuXHQkc2NvcGUub3Blbk1pc3Npb25BbmRWYWx1ZXMgPSBmdW5jdGlvbiAoKSB7XG5cdFx0JGxvZy5pbmZvICgnT3BlbiBNb2RhbCcpO1xuXHRcdHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xuXHRcdFx0dGVtcGxhdGVVcmw6ICcvbmctdGVtcGxhdGVzL21pc3Npb24tYW5kLXZhbHVlcy5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdNaXNzaW9uQW5kVmFsdWVzQ29udHJvbGxlcicsXG5cdFx0XHRzaXplOiAnJyxcblx0XHRcdGJhY2tkcm9wOiB0cnVlLFxuXHRcdFx0cmVzb2x2ZToge31cblx0XHR9KTtcblxuXHRcdG1vZGFsSW5zdGFuY2UucmVzdWx0LnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0JGxvZy5pbmZvICgnTW9kYWwgY2xvc2VkIGF0OiAnICsgbmV3IERhdGUoKSk7XG5cdFx0fSwgZnVuY3Rpb24gKCkge1xuXHRcdFx0JGxvZy5pbmZvICgnTW9kYWwgZGlzbWlzc2VkIGF0OiAnICsgbmV3IERhdGUoKSk7XG5cdFx0fSk7XG5cdH07XG59XSk7XG5cbmFuZ3VsYXIubW9kdWxlKCd0dGMnKVxuLmNvbnRyb2xsZXIoJ01pc3Npb25BbmRWYWx1ZXNDb250cm9sbGVyJywgWyckc2NvcGUnLCAnJG1vZGFsSW5zdGFuY2UnLFxuXHRmdW5jdGlvbiAoJHNjb3BlLCAkbW9kYWxJbnN0YW5jZSkge1xuXG5cdFx0JHNjb3BlLkNsb3NlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0JG1vZGFsSW5zdGFuY2UuZGlzbWlzcyAoJ2NhbmNlbCcpO1xuXHRcdH07XG5cdH1dKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vLyBKb2luIENvbnRyb2xsZXJcbmFuZ3VsYXIubW9kdWxlKCd0dGMnKS5jb250cm9sbGVyKCdOZXdNZW1iZXJzaGlwQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ3BsYWNlc1NlcnZpY2UnLCAnJG1vZGFsSW5zdGFuY2UnLCAnJGxvZycsICckd2luZG93JywgJyRtb2RhbCcsICdNZW1iZXJTZXJ2aWNlJyxcbmZ1bmN0aW9uICgkc2NvcGUsIHBsYWNlc1NlcnZpY2UsICRtb2RhbEluc3RhbmNlLCAkbG9nLCAkd2luZG93LCAkbW9kYWwsIE1lbWJlclNlcnZpY2UpIHtcblxuXHRcdCRzY29wZS5UVENEZWJ1Z1x0XHRcdFx0PSBmYWxzZTtcblx0XG5cdFx0JHNjb3BlLm5ld19hcHBsaWNhbnQgPSB0cnVlO1xuXHRcdCRzY29wZS5tZW1iZXIgPSB7fTtcblx0XHQvLyBEZWZhdWx0IHRoZSBjaGVja2JveGVzIHRvIHVuY2hlY2tlZFxuXHRcdCRzY29wZS5tZW1iZXIubGlhYmlsaXR5YWdyZWVkID0gJHNjb3BlLm1lbWJlci5jb21tdW5pY2F0aW9uc2FncmVlZCA9ICRzY29wZS5tZW1iZXIucGhvdG9hZ3JlZWQgPSAkc2NvcGUubWVtYmVyLnN0dWRlbnQgPSBmYWxzZTtcblxuXHRcdCRzY29wZS5wbGFjZXMgPSBwbGFjZXNTZXJ2aWNlLmdldCgpO1xuXG5cdFx0JHNjb3BlLlN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0Ly8gUmVjb3JkIHRoZSB5ZWFyIG9mIHRoZSBhcHBsaWNhdGlvbiByZXF1ZXN0XG5cdFx0XHQkc2NvcGUubWVtYmVyLmpvaW5pbmd5ZWFyID0gbW9tZW50KCkueWVhcigpO1xuXG5cdFx0XHRNZW1iZXJTZXJ2aWNlLnNhdmVOZXdNZW1iZXIoJHNjb3BlLm1lbWJlcilcblx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdCRtb2RhbEluc3RhbmNlLmNsb3NlKCdZZXMnKTtcblx0XHRcdFx0XHQkd2luZG93LmFsZXJ0KCdZb3VyIGFwcGxpY2F0aW9uIHRvIGpvaW4gdGhlIFRzYXd3YXNzZW4gVGVubmlzIENsdWIgaGFzIGJlZW4gc2F2ZWQuICAnICtcblx0XHRcdFx0XHRcdCdNZW1iZXJzaGlwIGZlZXMgYXJlIGR1ZSBieSBNYXJjaCAzMS4gIFRoZSBmZWUgc3RydWN0dXJlIGFuZCBwYXltZW50IGluc3RydWN0aW9ucyBjYW4gYmUgZm91bmQgb24gdGhlIEFib3V0IFVzIHBhZ2UuICcgK1xuXHRcdFx0XHRcdFx0J09uY2UgeW91ciBmZWVzIGFyZSBwYWlkLCB5b3Ugd2lsbCBiZSBhYmxlIHRvIExvZ2luIHVzaW5nIHlvdXIgZW1haWwgYWRkcmVzcyBhbmQgdGhlIHBhc3N3b3JkIHlvdSBwcm92aWRlZC4nKTtcblx0XHRcdFx0fSlcblx0XHRcdFx0LmNhdGNoKCR3aW5kb3cuYWxlcnQpO1xuXHRcdH1cblxuXHRcdCRzY29wZS5DYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHQkbW9kYWxJbnN0YW5jZS5kaXNtaXNzKCdObycpO1xuXHRcdH1cblxuXHRcdCRzY29wZS5ub3JtYWxpemVDYW5hZGlhblBvc3RhbENvZGVzID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0JHNjb3BlLm1lbWJlci5wb3N0Y29kZSA9ICRzY29wZS5tZW1iZXIucG9zdGNvZGUucmVwbGFjZSgnICcsICcnKS50b1VwcGVyQ2FzZSgpO1xuXHRcdH1cblxuXHRcdCRzY29wZS5ub3JtYWxpemVQcmltYXJ5UGhvbmVOdW1iZXIgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHQkc2NvcGUubWVtYmVyLnByaW1hcnlwaG9uZSA9IG5vcm1hbGl6ZVBob25lTnVtYmVyKCRzY29wZS5tZW1iZXIucHJpbWFyeXBob25lKTtcblx0XHR9XG5cblx0XHQkc2NvcGUubm9ybWFsaXplQWx0ZXJuYXRpdmVQaG9uZU51bWJlciA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdCRzY29wZS5tZW1iZXIuYWx0ZXJuYXRpdmVwaG9uZSA9IG5vcm1hbGl6ZVBob25lTnVtYmVyKCRzY29wZS5tZW1iZXIuYWx0ZXJuYXRpdmVwaG9uZSk7XG5cdFx0fTtcblxuXHRcdC8vIE9wZW5zIHRoZSBNaXNzaW9uICYgVmFsdWVzIG1vZGFsXG5cdFx0JHNjb3BlLm9wZW5SZWxlYXNlT2ZMaWFiaWxpdHkgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgbW9kYWxJbnN0YW5jZSA9ICRtb2RhbC5vcGVuKHtcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvbmctdGVtcGxhdGVzL3JlbGVhc2Utb2YtbGlhYmlsaXR5LXdhaXZlci1hbmQtY2xhaW1zLmh0bWwnLFxuXHRcdFx0XHRjb250cm9sbGVyOiAnUmVsZWFzZU9mTGlhYmlsaXR5Q29udHJvbGxlcicsXG5cdFx0XHRcdHNpemU6ICcnLFxuXHRcdFx0XHRiYWNrZHJvcDogdHJ1ZSxcblx0XHRcdFx0cmVzb2x2ZToge31cblx0XHRcdH0pO1xuXG5cdFx0XHRtb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0JGxvZy5pbmZvKCdNb2RhbCBjbG9zZWQgYXQ6ICcgKyBuZXcgRGF0ZSgpKTtcblx0XHRcdH0sIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0JGxvZy5pbmZvKCdNb2RhbCBkaXNtaXNzZWQgYXQ6ICcgKyBuZXcgRGF0ZSgpKTtcblx0XHRcdH0pO1xuXHRcdH07XG5cblx0XHQvLyBPcGVucyB0aGUgTWlzc2lvbiAmIFZhbHVlcyBtb2RhbFxuXHRcdCRzY29wZS5vcGVuQ29tbXVuaWNhdGlvbnNDb25zZW50ID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIG1vZGFsSW5zdGFuY2UgPSAkbW9kYWwub3Blbih7XG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAnL25nLXRlbXBsYXRlcy9jb21tdW5pY2F0aW9ucy1jb25zZW50Lmh0bWwnLFxuXHRcdFx0XHRjb250cm9sbGVyOiAnQ29tbXVuaWNhdGlvbnNDb25zZW50Q29udHJvbGxlcicsXG5cdFx0XHRcdHNpemU6ICcnLFxuXHRcdFx0XHRiYWNrZHJvcDogdHJ1ZSxcblx0XHRcdFx0cmVzb2x2ZToge31cblx0XHRcdH0pO1xuXG5cdFx0XHRtb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0JGxvZy5pbmZvKCdNb2RhbCBjbG9zZWQgYXQ6ICcgKyBuZXcgRGF0ZSgpKTtcblx0XHRcdH0sIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0JGxvZy5pbmZvKCdNb2RhbCBkaXNtaXNzZWQgYXQ6ICcgKyBuZXcgRGF0ZSgpKTtcblx0XHRcdH0pO1xuXHRcdH07XG5cblx0XHQvLyBPcGVucyB0aGUgTWlzc2lvbiAmIFZhbHVlcyBtb2RhbFxuXHRcdCRzY29wZS5vcGVuUGhvdG9ncmFwaENvbnNlbnQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHQkbG9nLmluZm8oJ09wZW4gTW9kYWwnKTtcblx0XHRcdHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJy9uZy10ZW1wbGF0ZXMvcGhvdG9ncmFwaC1jb25zZW50Lmh0bWwnLFxuXHRcdFx0XHRjb250cm9sbGVyOiAnUGhvdG9ncmFwaENvbnNlbnRDb250cm9sbGVyJyxcblx0XHRcdFx0c2l6ZTogJycsXG5cdFx0XHRcdGJhY2tkcm9wOiB0cnVlLFxuXHRcdFx0XHRyZXNvbHZlOiB7fVxuXHRcdFx0fSk7XG5cblx0XHRcdG1vZGFsSW5zdGFuY2UucmVzdWx0LnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHQkbG9nLmluZm8oJ01vZGFsIGNsb3NlZCBhdDogJyArIG5ldyBEYXRlKCkpO1xuXHRcdFx0fSwgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHQkbG9nLmluZm8oJ01vZGFsIGRpc21pc3NlZCBhdDogJyArIG5ldyBEYXRlKCkpO1xuXHRcdFx0fSk7XG5cdFx0fTtcblxuXHRcdC8vIE9wZW4gdGhlIEZlZSBTdHJ1Y3R1cmUgbW9kYWxcblx0XHQkc2NvcGUub3BlbkZlZVN0cnVjdHVyZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdCRsb2cuaW5mbygnT3BlbiBNb2RhbCcpO1xuXHRcdFx0dmFyIG1vZGFsSW5zdGFuY2UgPSAkbW9kYWwub3Blbih7XG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAnL25nLXRlbXBsYXRlcy9mZWVzLmh0bWwnLFxuXHRcdFx0XHRjb250cm9sbGVyOiAnTmV3TWVtYmVyc2hpcEZlZVN0cnVjdHVyZUNvbnRyb2xsZXInLFxuXHRcdFx0XHRzaXplOiAnc20nLFxuXHRcdFx0XHRiYWNrZHJvcDogdHJ1ZSxcblx0XHRcdFx0cmVzb2x2ZToge31cblx0XHRcdH0pO1xuXG5cdFx0XHRtb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0JGxvZy5pbmZvKCdNb2RhbCBjbG9zZWQgYXQ6ICcgKyBuZXcgRGF0ZSgpKTtcblx0XHRcdH0sIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0JGxvZy5pbmZvKCdNb2RhbCBkaXNtaXNzZWQgYXQ6ICcgKyBuZXcgRGF0ZSgpKTtcblx0XHRcdH0pO1xuXHRcdH07XG59XSk7XG5cbmFuZ3VsYXIubW9kdWxlKCd0dGMnKVxuXHQuY29udHJvbGxlcignTmV3TWVtYmVyc2hpcEZlZVN0cnVjdHVyZUNvbnRyb2xsZXInLCBbJyRzY29wZScsICckbW9kYWxJbnN0YW5jZScsXG5cdGZ1bmN0aW9uICgkc2NvcGUsICRtb2RhbEluc3RhbmNlKSB7XG5cblx0XHRcdCRzY29wZS5DbG9zZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0JG1vZGFsSW5zdGFuY2UuZGlzbWlzcygnY2FuY2VsJyk7XG5cdFx0XHR9O1xuXHR9XSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIExvZ2luIENvbnRyb2xsZXJcbmFuZ3VsYXIubW9kdWxlKCd0dGMnKVxuXHQuY29udHJvbGxlcihcImxvZ2luQ3RybFwiLCBbJyRzY29wZScsICdVc2VyU2VydmljZScsICckbW9kYWxJbnN0YW5jZScsICckbG9nJywgJyR3aW5kb3cnLCAnTWVtYmVyU2VydmljZScsXG5mdW5jdGlvbiAoJHNjb3BlLCBVc2VyU2VydmljZSwgJG1vZGFsSW5zdGFuY2UsICRsb2csICR3aW5kb3csIE1lbWJlclNlcnZpY2UpXG5cdFx0e1xuXHRcdFx0JHNjb3BlLm1lbWJlciA9IHt9O1xuXHRcdFx0JHNjb3BlLmFscmVhZHlfaGF2ZV9hX3Bhc3N3b3JkID0gJ1llcyc7IC8vIEFzIGEgZGVmYXVsdFxuXG5cdFx0XHQkc2NvcGUuTG9naW4gPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdFx0TWVtYmVyU2VydmljZS5sb2dpbk1lbWJlcigkc2NvcGUuYWxyZWFkeV9oYXZlX2FfcGFzc3dvcmQgPT0gJ1llcycsICRzY29wZS5tZW1iZXIpXG5cdFx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKHByaXZpbGVnZXMpIHtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nICgnTWVtYmVyU2VydmljZS5sb2dpbk1lbWJlciwgcHJpdmlsZWdlczpcXG4nLCBwcml2aWxlZ2VzKTtcblx0XHRcdFx0XHRcdFVzZXJTZXJ2aWNlLmxvZ2dlZEluIChwcml2aWxlZ2VzKTtcblx0XHRcdFx0XHRcdCR3aW5kb3cuYWxlcnQgKCdMb2dpbiBpcyBTdWNjZXNzZnVsIScpO1xuXHRcdFx0XHRcdFx0JG1vZGFsSW5zdGFuY2UuY2xvc2UoJ1llcycpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmNhdGNoKCR3aW5kb3cuYWxlcnQpO1xuXHRcdFx0fVxuXG5cdFx0XHQkc2NvcGUubm9ybWFsaXplQ2FuYWRpYW5Qb3N0YWxDb2RlcyA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0JHNjb3BlLm1lbWJlci5wb3N0Y29kZSA9ICRzY29wZS5tZW1iZXIucG9zdGNvZGUucmVwbGFjZSgnICcsICcnKS50b1VwcGVyQ2FzZSgpO1xuXHRcdFx0fTtcblxuXHRcdFx0JHNjb3BlLkNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0JG1vZGFsSW5zdGFuY2UuZGlzbWlzcygnTm8nKTtcblx0XHRcdH07XG5cbn1dKTsiLCJcInVzZSBzdHJpY3RcIjtcblxuYW5ndWxhci5tb2R1bGUoJ3R0YycpXG4uY29udHJvbGxlcignTWVtYmVyVGFibGVDb250cm9sbGVyJywgWyckc2NvcGUnLCAnJGxvZycsICdNZW1iZXJTZXJ2aWNlJywgJ1VzZXJTZXJ2aWNlJywgJyR3aW5kb3cnLFxuZnVuY3Rpb24gKCRzY29wZSwgJGxvZywgTWVtYmVyU2VydmljZSwgVXNlclNlcnZpY2UsICR3aW5kb3cpIHtcblx0XG5cdCRzY29wZS51c2VyIFx0XHRcdFx0PSBVc2VyU2VydmljZTtcblx0JHNjb3BlLnVucGFpZG9ubHkgXHRcdFx0PSBmYWxzZTtcblx0JHNjb3BlLm5vdHJlbmV3ZWRvbmx5IFx0XHQ9IGZhbHNlO1xuXHQkc2NvcGUuYWxsZW1haWxhZGRyZXNzZXMgXHQ9IFtdO1xuXHRcblx0TWVtYmVyU2VydmljZS5nZXRBbGxFbWFpbEFkZHJlc3NlcyAoKVxuXHRcdC50aGVuICAoZnVuY3Rpb24gKGVtYWlsYWRkcmVzc2VzKSB7JHNjb3BlLmFsbGVtYWlsYWRkcmVzc2VzID0gZW1haWxhZGRyZXNzZXM7fSlcblx0XHQuY2F0Y2ggKCR3aW5kb3cuYWxlcnQpO1x0XG5cblx0TWVtYmVyU2VydmljZS5nZXRBbGxNZW1iZXJzICgpXG5cdFx0LnRoZW4gIChmdW5jdGlvbiAoZGF0YSkgeyRzY29wZS5tZW1iZXJzID0gZGF0YTt9KVxuXHRcdC5jYXRjaCAoJHdpbmRvdy5hbGVydCk7XG5cdFxuXHQkc2NvcGUuVG9nZ2xlUGFpZCA9IGZ1bmN0aW9uIChtZW1iZXIpIHtcblx0XHRtZW1iZXIucGFpZCA9ICFtZW1iZXIucGFpZDtcblx0XHRNZW1iZXJTZXJ2aWNlLnNhdmVNZW1iZXIgKG1lbWJlcilcblx0XHRcdC5jYXRjaCAoJHdpbmRvdy5hbGVydCk7XG5cdH1cblx0XG5cdCRzY29wZS5Ub2dnbGVTdHVkZW50ID0gZnVuY3Rpb24gKG1lbWJlcikge1xuXHRcdG1lbWJlci5zdHVkZW50ID0gIW1lbWJlci5zdHVkZW50O1xuXHRcdE1lbWJlclNlcnZpY2Uuc2F2ZU1lbWJlciAobWVtYmVyKVxuXHRcdFx0LmNhdGNoICgkd2luZG93LmFsZXJ0KTtcblx0fVxuXG5cdCRzY29wZS5TZWxlY3RFeGVjID0gZnVuY3Rpb24gKG1lbWJlcikge1xuXHRcdGNvbnNvbGUubG9nICgnbWVtYmVyOiAnLCBtZW1iZXIpO1xuXHRcdE1lbWJlclNlcnZpY2Uuc2F2ZU1lbWJlciAobWVtYmVyKVxuXHRcdFx0LmNhdGNoICgkd2luZG93LmFsZXJ0KTtcblx0fVxuXG5cdCRzY29wZS5VcGRhdGVGYW1pbHlFbWFpbEFkZHJlc3MgPSBmdW5jdGlvbiAobWVtYmVyKSB7XG5cdFx0Y29uc29sZS5sb2cgKG1lbWJlcik7XG5cblx0XHRjb25zb2xlLmxvZyAoJ1VwZGF0ZUZhbWlseUVtYWlsQWRkcmVzczogJywgbWVtYmVyLmZhbWlseWVtYWlsYWRkcmVzcyk7XG5cdFx0XG5cdFx0aWYgKG1lbWJlci5mYW1pbHllbWFpbGFkZHJlc3MgPT0gXCJcIiB8fCAkc2NvcGUuYWxsZW1haWxhZGRyZXNzZXMuaW5kZXhPZiAobWVtYmVyLmZhbWlseWVtYWlsYWRkcmVzcykgPj0gMClcblx0XHRcdFx0TWVtYmVyU2VydmljZS5zYXZlTWVtYmVyIChtZW1iZXIpXG5cdFx0XHRcdFx0LmNhdGNoICgkd2luZG93LmFsZXJ0KTtcblx0XHRlbHNlXG5cdFx0XHQkd2luZG93LmFsZXJ0ICgnRmFtaWx5IEVtYWlsIEFkZHJlc3MgaXMgVW5rbm93biAtIE5vdCBTYXZlZCcpO1xuXHR9XG59XSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmFuZ3VsYXIubW9kdWxlKCd0dGMnKVxuLmNvbnRyb2xsZXIoJ05ld3NDdHJsJywgWyckc2NvcGUnLCAnJGxvZycsICdOZXdzSXRlbVNlcnZpY2UnLCAnJHdpbmRvdycsICdVc2VyU2VydmljZScsXG5mdW5jdGlvbiAoJHNjb3BlLCAkbG9nLCBOZXdzSXRlbVNlcnZpY2UsICR3aW5kb3csIFVzZXJTZXJ2aWNlKSB7XG5cdFxuXHQkc2NvcGUudXNlciA9IFVzZXJTZXJ2aWNlO1xuXHRcblx0ZnVuY3Rpb24gR2V0QWxsTmV3c0l0ZW1zICgpIHtcblx0XHROZXdzSXRlbVNlcnZpY2UuZ2V0QWxsICgpXG5cdFx0XHQudGhlbiAoZnVuY3Rpb24gKE5ld3NJdGVtcykgeyRzY29wZS5OZXdzSXRlbXMgPSBOZXdzSXRlbXM7fSlcblx0XHRcdC5jYXRjaCgkd2luZG93LmFsZXJ0KTtcblx0fVxuXHRcblx0JHNjb3BlLlJlbW92ZU5ld3NJdGVtID0gZnVuY3Rpb24gKG5ld3NpdGVtKSB7XG5cdFx0TmV3c0l0ZW1TZXJ2aWNlLnJlbW92ZU5ld3NJdGVtIChuZXdzaXRlbS5faWQpXG5cdFx0XHQvLyBSZWZyZXNoIHRoZSBzZXQgb2YgbmV3c2l0ZW1zXG5cdFx0XHQudGhlbiAoR2V0QWxsTmV3c0l0ZW1zKVxuXHRcdFx0LmNhdGNoKCR3aW5kb3cuYWxlcnQpO1xuXHR9XG5cdFxuXHRHZXRBbGxOZXdzSXRlbXMgKCk7XG59XSk7XG5cbmFuZ3VsYXIubW9kdWxlKCd0dGMnKVxuLmNvbnRyb2xsZXIoJ05ld3NJdGVtRmlsZXNDb250cm9sbGVyJywgWyckc2NvcGUnLCAnJGxvZycsICdOZXdzSXRlbVNlcnZpY2UnLFxuZnVuY3Rpb24gKCRzY29wZSwgJGxvZywgTmV3c0l0ZW1TZXJ2aWNlKSB7XG5cblx0TmV3c0l0ZW1TZXJ2aWNlLnJldHJpZXZlRmlsZXMgKCRzY29wZS4kcGFyZW50Lk5ld3NJdGVtLl9pZClcblx0XHQudGhlbiAoZnVuY3Rpb24gKE5ld3NJdGVtRmlsZXMpIHskc2NvcGUuTmV3c0l0ZW1GaWxlcyA9IE5ld3NJdGVtRmlsZXM7fSk7XG59XSk7XG5cdFxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5hbmd1bGFyLm1vZHVsZSgndHRjJylcbi5jb250cm9sbGVyKCdOZXdzSXRlbU1hbmFnZW1lbnRDb250cm9sbGVyJywgWyckc2NvcGUnLCAnJGh0dHAnLCAnRmlsZVVwbG9hZGVyJywgJyRtb2RhbEluc3RhbmNlJywgJ1VzZXJTZXJ2aWNlJywgJyRsb2cnLCAnTmV3c0l0ZW1TZXJ2aWNlJywgJyR3aW5kb3cnLFxuZnVuY3Rpb24gZG9jdW1lbnRVcGxvYWRDb250cm9sbGVyICgkc2NvcGUsICRodHRwLCBGaWxlVXBsb2FkZXIsICRtb2RhbEluc3RhbmNlLCBVc2VyU2VydmljZSwgJGxvZywgTmV3c0l0ZW1TZXJ2aWNlLCAkd2luZG93KSB7XG5cdFxuXHRcdCRzY29wZS5uZXdzSXRlbSA9IHt9O1xuXHRcblx0XHR2YXIgdXBsb2FkZXIgPSAkc2NvcGUudXBsb2FkZXIgPSBuZXcgRmlsZVVwbG9hZGVyKHtcblx0XHRcdHVybDogJy9hcGkvbmV3c2l0ZW0taW1hZ2UtdXBsb2FkJ1xuXHRcdH0pO1xuXHRcblx0XHQvLyBGSUxURVJTXG5cdFx0dXBsb2FkZXIuZmlsdGVycy5wdXNoKHtcblx0XHRcdG5hbWU6ICdpbWFnZUZpbHRlcicsXG5cdFx0XHRmbjogZnVuY3Rpb24gKGl0ZW0sIG9wdGlvbnMpIHtcblx0XHRcdFx0dmFyIHR5cGUgPSAnfCcgKyBpdGVtLnR5cGUuc2xpY2UoaXRlbS50eXBlLmxhc3RJbmRleE9mKCcvJykgKyAxKSArICd8Jztcblx0XHRcdFx0cmV0dXJuICd8anBnfHBuZ3xqcGVnfGJtcHxnaWZ8Jy5pbmRleE9mKHR5cGUpICE9PSAtMTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdC8vIENBTExCQUNLU1xuXHRcdHVwbG9hZGVyLm9uV2hlbkFkZGluZ0ZpbGVGYWlsZWQgPSBmdW5jdGlvbiAoaXRlbSwgZmlsdGVyLCBvcHRpb25zKSB7XG5cdFx0XHRjb25zb2xlLmluZm8oJ29uV2hlbkFkZGluZ0ZpbGVGYWlsZWQnLCBpdGVtLCBmaWx0ZXIsIG9wdGlvbnMpO1xuXHRcdH07XG5cdFx0dXBsb2FkZXIub25BZnRlckFkZGluZ0ZpbGUgPSBmdW5jdGlvbiAoZmlsZUl0ZW0pIHtcblx0XHRcdGNvbnNvbGUuaW5mbygnb25BZnRlckFkZGluZ0ZpbGUnLCBmaWxlSXRlbSk7XG5cdFx0fTtcblx0XHR1cGxvYWRlci5vbkFmdGVyQWRkaW5nQWxsID0gZnVuY3Rpb24gKGFkZGVkRmlsZUl0ZW1zKSB7XG5cdFx0XHRjb25zb2xlLmluZm8oJ29uQWZ0ZXJBZGRpbmdBbGwnLCBhZGRlZEZpbGVJdGVtcyk7XG5cdFx0fTtcblx0XHR1cGxvYWRlci5vbkJlZm9yZVVwbG9hZEl0ZW0gPSBmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0aXRlbS5oZWFkZXJzLm5ld3NpdGVtaWQgPSAkc2NvcGUubmV3c0l0ZW0uX2lkO1xuXHRcdFx0Y29uc29sZS5pbmZvKCdvbkJlZm9yZVVwbG9hZEl0ZW0nLCBpdGVtKTtcblx0XHR9O1xuXHRcdHVwbG9hZGVyLm9uUHJvZ3Jlc3NJdGVtID0gZnVuY3Rpb24gKGZpbGVJdGVtLCBwcm9ncmVzcykge1xuXHRcdFx0Y29uc29sZS5pbmZvKCdvblByb2dyZXNzSXRlbScsIGZpbGVJdGVtLCBwcm9ncmVzcyk7XG5cdFx0fTtcblx0XHR1cGxvYWRlci5vblByb2dyZXNzQWxsID0gZnVuY3Rpb24gKHByb2dyZXNzKSB7XG5cdFx0XHRjb25zb2xlLmluZm8oJ29uUHJvZ3Jlc3NBbGwnLCBwcm9ncmVzcyk7XG5cdFx0fTtcblx0XHR1cGxvYWRlci5vblN1Y2Nlc3NJdGVtID0gZnVuY3Rpb24gKGZpbGVJdGVtLCByZXNwb25zZSwgc3RhdHVzLCBoZWFkZXJzKSB7XG5cdFx0XHRjb25zb2xlLmluZm8oJ29uU3VjY2Vzc0l0ZW0nLCBmaWxlSXRlbSwgcmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycyk7XG5cdFx0fTtcblx0XHR1cGxvYWRlci5vbkVycm9ySXRlbSA9IGZ1bmN0aW9uIChmaWxlSXRlbSwgcmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycykge1xuXHRcdFx0Y29uc29sZS5pbmZvKCdvbkVycm9ySXRlbScsIGZpbGVJdGVtLCByZXNwb25zZSwgc3RhdHVzLCBoZWFkZXJzKTtcblx0XHR9O1xuXHRcdHVwbG9hZGVyLm9uQ2FuY2VsSXRlbSA9IGZ1bmN0aW9uIChmaWxlSXRlbSwgcmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycykge1xuXHRcdFx0Y29uc29sZS5pbmZvKCdvbkNhbmNlbEl0ZW0nLCBmaWxlSXRlbSwgcmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycyk7XG5cdFx0fTtcblx0XHR1cGxvYWRlci5vbkNvbXBsZXRlSXRlbSA9IGZ1bmN0aW9uIChmaWxlSXRlbSwgcmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycykge1xuXHRcdFx0Y29uc29sZS5pbmZvKCdvbkNvbXBsZXRlSXRlbScsIGZpbGVJdGVtLCByZXNwb25zZSwgc3RhdHVzLCBoZWFkZXJzKTtcblx0XHR9O1xuXHRcdHVwbG9hZGVyLm9uQ29tcGxldGVBbGwgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRjb25zb2xlLmluZm8oJ29uQ29tcGxldGVBbGwnKTtcblx0XHR9XG5cdFxuXHRcdE5ld3NJdGVtU2VydmljZS5nZXROZXdPYmplY3RJZCAoKVxuXHRcdFx0LnRoZW4gKGZ1bmN0aW9uIChuZXdzaXRlbWlkKSB7JHNjb3BlLm5ld3NJdGVtLl9pZCA9IG5ld3NpdGVtaWQ7fSlcblx0XHRcdC5jYXRjaCgkd2luZG93LmFsZXJ0KTtcblxuXHRcdCRzY29wZS5QdWJsaXNoID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0TmV3c0l0ZW1TZXJ2aWNlLnB1Ymxpc2hOZXdzSXRlbSAoJHNjb3BlLm5ld3NJdGVtKVxuXHRcdFx0XHQudGhlbiAoZnVuY3Rpb24gKCkgeyRtb2RhbEluc3RhbmNlLmRpc21pc3MoJ1llcycpOyAkd2luZG93LmFsZXJ0ICgnWW91ciBOZXdzIEl0ZW0gaGFzIGJlZW4gc3VjY2Vzc2Z1bGx5IHB1Ymxpc2hlZCcpfSlcblx0XHRcdFx0LmNhdGNoICgkd2luZG93LmFsZXJ0KTtcblx0XHR9XG5cblx0XHQkc2NvcGUuQ2xvc2UgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHQvLyBBbnkgZXJyb3JzIGFyZSBwaWNrZWQgdXAgYnkgdGhlIHNlcnZlclxuXHRcdFx0TmV3c0l0ZW1TZXJ2aWNlLnJlbW92ZU5ld3NJdGVtICgkc2NvcGUubmV3c0l0ZW0uX2lkKVxuXHRcdFx0XHQuZmluYWxseSAoJG1vZGFsSW5zdGFuY2UuZGlzbWlzcygnWWVzJykpO1xuXHRcdH1cbiAgICB9XSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIExvZ291dCBDb250cm9sbGVyXG5hbmd1bGFyLm1vZHVsZSgndHRjJylcbi5jb250cm9sbGVyKCdsb2dvdXRDdHJsJywgWyckc2NvcGUnLCAnJG1vZGFsSW5zdGFuY2UnLCAnVXNlclNlcnZpY2UnLCAnJGxvZycsIFxuZnVuY3Rpb24gKCRzY29wZSwgJG1vZGFsSW5zdGFuY2UsIFVzZXJTZXJ2aWNlLCAkbG9nKSB7XG5cdCRzY29wZS5vayA9IGZ1bmN0aW9uICgpIHtcblx0XHRVc2VyU2VydmljZS5sb2dnZWRPdXQoKTtcblx0XHQkbW9kYWxJbnN0YW5jZS5jbG9zZSAoJ1llcycpO1xuXHR9O1xuXG5cdCRzY29wZS5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG5cdFx0JG1vZGFsSW5zdGFuY2UuZGlzbWlzcyAoJ05vJyk7XG5cdH07XG59XSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIFNlYXJjaCBNZW1iZXJzaGlwIENvbnRyb2xsZXJcbmFuZ3VsYXIubW9kdWxlKCd0dGMnKS5jb250cm9sbGVyICgnU2VhcmNoTWVtYmVyc2hpcEN0cmwnLCBbJyRzY29wZScsICckbG9nJywgJ01lbWJlclNlcnZpY2UnLCAnJHdpbmRvdycsXG5mdW5jdGlvbiAoJHNjb3BlLCAkbG9nLCBNZW1iZXJTZXJ2aWNlLCAkd2luZG93KSB7XG5cdFxuXHRNZW1iZXJTZXJ2aWNlLmdldEFsbE1lbWJlcnMgKClcblx0XHQudGhlbiAgKGZ1bmN0aW9uIChkYXRhKSB7JHNjb3BlLm1lbWJlcnMgPSBkYXRhO30pXG5cdFx0LmNhdGNoICgkd2luZG93LmFsZXJ0KTtcbn1dKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vLyBSZW5ldyBNZW1iZXJzaGlwIENvbnRyb2xsZXJcbmFuZ3VsYXIubW9kdWxlKCd0dGMnKVxuLmNvbnRyb2xsZXIoJ3JlbmV3TWVtYmVyc2hpcEN0cmwnLCBbJyRzY29wZScsICdwbGFjZXNTZXJ2aWNlJywgJ01lbWJlclNlcnZpY2UnLCAnJG1vZGFsSW5zdGFuY2UnLCAnJGxvZycsICckd2luZG93JywgJyRtb2RhbCcsXG5mdW5jdGlvbiAoJHNjb3BlLCBwbGFjZXNTZXJ2aWNlLCBNZW1iZXJTZXJ2aWNlLCAkbW9kYWxJbnN0YW5jZSwgJGxvZywgJHdpbmRvdywgJG1vZGFsKSB7XG5cdFxuXHQkc2NvcGUubWVtYmVyIFx0XHRcdFx0PSB7fTtcblx0JHNjb3BlLmFsbGVtYWlsYWRkcmVzc2VzXHQ9IFtdO1xuXHQkc2NvcGUucGxhY2VzIFx0XHRcdFx0PSBwbGFjZXNTZXJ2aWNlLmdldCAoKTtcblx0JHNjb3BlLlRUQ0RlYnVnXHRcdFx0XHQ9IGZhbHNlO1xuXG5cdE1lbWJlclNlcnZpY2UuZ2V0QWxsTWVtYmVycyAoKVxuXHRcdC50aGVuICAoZnVuY3Rpb24gKG1lbWJlcnMpIHtmb3IgKHZhciBpPTA7IGk8bWVtYmVycy5sZW5ndGg7ICsraSkgJHNjb3BlLmFsbGVtYWlsYWRkcmVzc2VzLnB1c2ggKG1lbWJlcnNbaV0uZW1haWxhZGRyZXNzKTt9KVxuXHRcdC5jYXRjaCAoJHdpbmRvdy5hbGVydCk7XHRcblxuXHRNZW1iZXJTZXJ2aWNlLmdldE1lbWJlciAoKVxuXHRcdC50aGVuIChmdW5jdGlvbiAobWVtYmVyKSB7XG5cdFx0XHQkc2NvcGUubWVtYmVyIFx0XHRcdFx0PSBtZW1iZXI7IFxuXHRcdFx0JHNjb3BlLmNvbmZpcm1lbWFpbGFkZHJlc3MgXHQ9IG1lbWJlci5lbWFpbGFkZHJlc3M7IFxuXHRcdFx0JHNjb3BlLm1lbWJlci5zdHVkZW50IFx0XHRcdFx0PSBmYWxzZTsgXG5cdFx0XHQkc2NvcGUubWVtYmVyLmxpYWJpbGl0eWFncmVlZCBcdFx0PSBmYWxzZTtcblx0XHRcdCRzY29wZS5tZW1iZXIuY29tbXVuaWNhdGlvbnNhZ3JlZWQgXHQ9IGZhbHNlO1xuXHRcdFx0JHNjb3BlLm1lbWJlci5waG90b2FncmVlZCBcdFx0XHQ9IGZhbHNlO1xuXHRcdFx0JHNjb3BlLm1lbWJlci5qb2luaW5nX3llYXJcdFx0XHQ9IHVuZGVmaW5lZDtcdFxuXHRcdH0pXG5cdFx0LmNhdGNoICgkd2luZG93LmFsZXJ0KTtcblxuXHQkc2NvcGUuU3VibWl0ID0gZnVuY3Rpb24gKCkge1xuXHQgXHRNZW1iZXJTZXJ2aWNlLnNhdmVNZW1iZXIgKCRzY29wZS5tZW1iZXIpXG5cdFx0XHQudGhlbiAoZnVuY3Rpb24gKCkgeyRtb2RhbEluc3RhbmNlLmNsb3NlKCdZZXMnKTsgJHdpbmRvdy5hbGVydCAoJ1JlbmV3YWwgQXBwbGljYXRpb24gQWNjZXB0ZWQuICBBbGwgZmVlcyBtdXN0IGJlIHBhaWQgb24gb3IgYmVmb3JlIE1hcmNoIDMxc3QuJyk7fSlcblx0XHRcdC5jYXRjaCAoZnVuY3Rpb24gKGVycikgeyR3aW5kb3cuYWxlcnQgKGVyciApO30pO1xuXHR9XG5cblx0JHNjb3BlLkNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcblx0XHQkbW9kYWxJbnN0YW5jZS5kaXNtaXNzKCdObycpO1xuXHR9O1xuXG5cdCRzY29wZS5ub3JtYWxpemVDYW5hZGlhblBvc3RhbENvZGVzID0gZnVuY3Rpb24gKClcblx0e1xuXHRcdCRzY29wZS5tZW1iZXIucG9zdGNvZGUgPSAkc2NvcGUubWVtYmVyLnBvc3Rjb2RlLnJlcGxhY2UgKCcgJywgJycpLnRvVXBwZXJDYXNlICgpO1xuXHR9O1xuXG5cdCRzY29wZS5ub3JtYWxpemVQcmltYXJ5UGhvbmVOdW1iZXIgPSBmdW5jdGlvbiAoKSB7XG5cdFx0JHNjb3BlLm1lbWJlci5wcmltYXJ5cGhvbmUgPSBub3JtYWxpemVQaG9uZU51bWJlciAoJHNjb3BlLm1lbWJlci5wcmltYXJ5cGhvbmUpO1xuXHR9O1xuXHRcdFxuXHQkc2NvcGUubm9ybWFsaXplQWx0ZXJuYXRpdmVQaG9uZU51bWJlciA9IGZ1bmN0aW9uICgpIHtcblx0XHQkc2NvcGUubWVtYmVyLmFsdGVybmF0aXZlcGhvbmUgPSBub3JtYWxpemVQaG9uZU51bWJlciAoJHNjb3BlLm1lbWJlci5hbHRlcm5hdGl2ZXBob25lKTtcblx0fTtcblx0XG5cdC8vIE9wZW5zIHRoZSBNaXNzaW9uICYgVmFsdWVzIG1vZGFsXG5cdCRzY29wZS5vcGVuUmVsZWFzZU9mTGlhYmlsaXR5ID0gZnVuY3Rpb24gKCkge1xuXHRcdGNvbnNvbGUubG9nICgnT3BlbiBNb2RhbCcpO1xuXHRcdHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xuXHRcdFx0dGVtcGxhdGVVcmw6XHQnL25nLXRlbXBsYXRlcy9yZWxlYXNlLW9mLWxpYWJpbGl0eS13YWl2ZXItYW5kLWNsYWltcy5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6IFx0J1JlbGVhc2VPZkxpYWJpbGl0eUNvbnRyb2xsZXInLFxuXHRcdFx0c2l6ZTogXHRcdFx0JycsXG5cdFx0XHRiYWNrZHJvcDogXHRcdHRydWUsXG5cdFx0XHRyZXNvbHZlOiBcdFx0e31cblx0XHR9KTtcblxuXHRcdG1vZGFsSW5zdGFuY2UucmVzdWx0LnRoZW4gKGZ1bmN0aW9uICgpIHtcblx0XHRcdCRsb2cuaW5mbyAoJ01vZGFsIGNsb3NlZCBhdDogJyArIG5ldyBEYXRlKCkpO1xuXHRcdH0sIGZ1bmN0aW9uICgpIHtcblx0XHRcdCRsb2cuaW5mbyAoJ01vZGFsIGRpc21pc3NlZCBhdDogJyArIG5ldyBEYXRlKCkpO1xuXHRcdH0pO1xuXHR9O1xuXHRcblx0Ly8gT3BlbnMgdGhlIE1pc3Npb24gJiBWYWx1ZXMgbW9kYWxcblx0JHNjb3BlLm9wZW5Db21tdW5pY2F0aW9uc0NvbnNlbnQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIG1vZGFsSW5zdGFuY2UgPSAkbW9kYWwub3Blbih7XG5cdFx0XHR0ZW1wbGF0ZVVybDogJy9uZy10ZW1wbGF0ZXMvY29tbXVuaWNhdGlvbnMtY29uc2VudC5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdDb21tdW5pY2F0aW9uc0NvbnNlbnRDb250cm9sbGVyJyxcblx0XHRcdHNpemU6ICcnLFxuXHRcdFx0YmFja2Ryb3A6IHRydWUsXG5cdFx0XHRyZXNvbHZlOiB7fVxuXHRcdH0pO1xuXG5cdFx0bW9kYWxJbnN0YW5jZS5yZXN1bHQudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHQkbG9nLmluZm8gKCdNb2RhbCBjbG9zZWQgYXQ6ICcgKyBuZXcgRGF0ZSgpKTtcblx0XHR9LCBmdW5jdGlvbiAoKSB7XG5cdFx0XHQkbG9nLmluZm8gKCdNb2RhbCBkaXNtaXNzZWQgYXQ6ICcgKyBuZXcgRGF0ZSgpKTtcblx0XHR9KTtcblx0fTtcblxuXHRcdC8vIE9wZW5zIHRoZSBNaXNzaW9uICYgVmFsdWVzIG1vZGFsXG5cdCRzY29wZS5vcGVuUGhvdG9ncmFwaENvbnNlbnQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0JGxvZy5pbmZvICgnT3BlbiBNb2RhbCcpO1xuXHRcdHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xuXHRcdFx0dGVtcGxhdGVVcmw6ICcvbmctdGVtcGxhdGVzL3Bob3RvZ3JhcGgtY29uc2VudC5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdQaG90b2dyYXBoQ29uc2VudENvbnRyb2xsZXInLFxuXHRcdFx0c2l6ZTogJycsXG5cdFx0XHRiYWNrZHJvcDogdHJ1ZSxcblx0XHRcdHJlc29sdmU6IHt9XG5cdFx0fSk7XG5cblx0XHRtb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdCRsb2cuaW5mbyAoJ01vZGFsIGNsb3NlZCBhdDogJyArIG5ldyBEYXRlKCkpO1xuXHRcdH0sIGZ1bmN0aW9uICgpIHtcblx0XHRcdCRsb2cuaW5mbyAoJ01vZGFsIGRpc21pc3NlZCBhdDogJyArIG5ldyBEYXRlKCkpO1xuXHRcdH0pO1xuXHR9O1xuXHRcblx0Ly8gT3BlbnMgdGhlIE1pc3Npb24gJiBWYWx1ZXMgbW9kYWxcblx0JHNjb3BlLm9wZW5GZWVTdHJ1Y3R1cmUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0JGxvZy5pbmZvICgnT3BlbiBNb2RhbCcpO1xuXHRcdHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xuXHRcdFx0dGVtcGxhdGVVcmw6ICcvbmctdGVtcGxhdGVzL2ZlZXMuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnRmVlU3RydWN0dXJlQ29udHJvbGxlcicsXG5cdFx0XHRzaXplOiAnc20nLFxuXHRcdFx0YmFja2Ryb3A6IHRydWUsXG5cdFx0XHRyZXNvbHZlOiB7fVxuXHRcdH0pO1xuXG5cdFx0bW9kYWxJbnN0YW5jZS5yZXN1bHQudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHQkbG9nLmluZm8gKCdNb2RhbCBjbG9zZWQgYXQ6ICcgKyBuZXcgRGF0ZSgpKTtcblx0XHR9LCBmdW5jdGlvbiAoKSB7XG5cdFx0XHQkbG9nLmluZm8gKCdNb2RhbCBkaXNtaXNzZWQgYXQ6ICcgKyBuZXcgRGF0ZSgpKTtcblx0XHR9KTtcblx0fTtcblxufV0pO1xuXG5hbmd1bGFyLm1vZHVsZSgndHRjJylcbi5jb250cm9sbGVyKCdGZWVTdHJ1Y3R1cmVDb250cm9sbGVyJywgWyckc2NvcGUnLCAnJG1vZGFsSW5zdGFuY2UnLFxuXHRmdW5jdGlvbiAoJHNjb3BlLCAkbW9kYWxJbnN0YW5jZSkge1xuXG5cdFx0JHNjb3BlLkNsb3NlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0JG1vZGFsSW5zdGFuY2UuZGlzbWlzcyAoJ2NhbmNlbCcpO1xuXHRcdH07XG5cdH1dKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vLyBlQmxhc3RzIENvbnRyb2xsZXJcbmFuZ3VsYXIubW9kdWxlKCd0dGMnKVxuLmNvbnRyb2xsZXIoJ2VCbGFzdHNDdHJsJywgWyckc2NvcGUnLCAnJGh0dHAnLCAnVXNlclNlcnZpY2UnLCAnJHdpbmRvdycsICckbG9nJywgXG5mdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgVXNlclNlcnZpY2UsICR3aW5kb3csICRsb2cpIHtcblx0XG5cdCRzY29wZS5idXN5UHJvbWlzZSA9ICRodHRwLnBvc3QgKCcvYXBpL2dldC1lYmxhc3RzJywgbnVsbCwge2hlYWRlcnM6IHsneC1hdXRoJzogVXNlclNlcnZpY2UuZ2V0VG9rZW4gKCl9fSk7XG5cdCRzY29wZS5idXN5UHJvbWlzZVxuXHRcdC50aGVuIChmdW5jdGlvbiAocmVzcG9uc2UpIHskc2NvcGUuZW1haWxzID0gcmVzcG9uc2UuZGF0YX0pXG5cdFx0LmNhdGNoKGZ1bmN0aW9uIChyZXNwb25zZSkgeyR3aW5kb3cuYWxlcnQgKHJlc3BvbnNlLmRhdGEpfSk7XG59XSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8vIERvY3VtZW50U2VydmljZSBwcm92aWRlcyBhIG1lYW5zIGZvciB0aGUgY29udHJvbGxlcnMgdG8gc2hhcmUgYWNjZXNzIHRvIGNsdWIgZG9jdW1lbnRzXG5hbmd1bGFyLm1vZHVsZSgndHRjJykuZmFjdG9yeSgnRG9jdW1lbnRTZXJ2aWNlJywgWyckbG9nJywgJ1VzZXJTZXJ2aWNlJywgJyRodHRwJywgJyRxJyxcbiAgICBmdW5jdGlvbiAoJGxvZywgVXNlclNlcnZpY2UsICRodHRwLCAkcSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVmcmVzaERvY3VtZW50TGlzdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnL2FwaS9kb2N1bWVudC1saXN0JywgbnVsbCwge1xuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAneC1hdXRoJzogVXNlclNlcnZpY2UuZ2V0VG9rZW4oKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShkYXRhKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChlcnJvcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVtb3ZlRG9jdW1lbnQ6IGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhlIGRvY3VtZW50IGlzIHJlbW92ZWQgYW5kIHRoZW4gdGhlIHVwZGF0ZWQgbGlzdCBpcyBzZW50IGJhY2tcbiAgICAgICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJy9hcGkvZG9jdW1lbnQtcmVtb3ZlJywgZmlsZSwge1xuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAneC1hdXRoJzogVXNlclNlcnZpY2UuZ2V0VG9rZW4oKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShkYXRhKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChlcnJvcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1Eb2N1bWVudFNlcnZpY2UuanMubWFwIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL2Fzc2V0cy9qcy91dGlsLmQudHNcIiAvPlxuXCJ1c2Ugc3RyaWN0XCI7XG4vLyBpbXBvcnQgeyBub3JtYWxpemVQaG9uZU51bWJlciB9IGZyb20gXCIuLi9hc3NldHMvanMvdXRpbFwiO1xuLy8gZGVjbGFyZSBmdW5jdGlvbiBub3JtYWxpemVQaG9uZU51bWJlcihwaG9uZW51bWJlcjogc3RyaW5nKTogc3RyaW5nO1xuYW5ndWxhci5tb2R1bGUoJ3R0YycpLmZhY3RvcnkoJ01lbWJlclNlcnZpY2UnLCBbJyRodHRwJywgJ1VzZXJTZXJ2aWNlJywgJyRsb2cnLCAnZGV2aWNlRGV0ZWN0b3InLCAnJHEnLFxuICAgIGZ1bmN0aW9uICgkaHR0cCwgVXNlclNlcnZpY2UsICRsb2csIGRldmljZURldGVjdG9yLCAkcSkge1xuICAgICAgICBmdW5jdGlvbiBwb3N0SGVhZGVycygpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAneC1hdXRoJzogVXNlclNlcnZpY2UuZ2V0VG9rZW4oKSxcbiAgICAgICAgICAgICAgICAgICAgJ2RldmljZSc6IGRldmljZURldGVjdG9yLm9zICsgJy0nICsgZGV2aWNlRGV0ZWN0b3IuZGV2aWNlICsgJy0nICsgZGV2aWNlRGV0ZWN0b3IuYnJvd3NlclxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGdldEFsbE1lbWJlcnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJy9hcGkvZ2V0bWVtYmVycycsIG51bGwsIHBvc3RIZWFkZXJzKCkpXG4gICAgICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIERvIHNvbWUgY2xlYW5pbmdcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhW2ldLmZpcnN0bmFtZSA9IF8uY2FwaXRhbGl6ZShkYXRhW2ldLmZpcnN0bmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhW2ldLmZhbWlseW5hbWUgPSBfLmNhcGl0YWxpemUoZGF0YVtpXS5mYW1pbHluYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFbaV0ucHJpbWFyeXBob25lID0gbm9ybWFsaXplUGhvbmVOdW1iZXIoZGF0YVtpXS5wcmltYXJ5cGhvbmUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtpXS5hbHRlcm5hdGl2ZXBob25lID0gbm9ybWFsaXplUGhvbmVOdW1iZXIoZGF0YVtpXS5hbHRlcm5hdGl2ZXBob25lKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGRhdGEpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5lcnJvcihmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRBbGxFbWFpbEFkZHJlc3NlczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnL2FwaS9nZXQtYWxsLWVtYWlsLWFkZHJlc3NlcycsIG51bGwsIHBvc3RIZWFkZXJzKCkpXG4gICAgICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoZGF0YSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmVycm9yKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxvZ2luTWVtYmVyOiBmdW5jdGlvbiAoZXhpc3RpbmdQYXNzd29yZCwgbWVtYmVyKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KGV4aXN0aW5nUGFzc3dvcmQgPyAnL2FwaS9sb2dpbicgOiAnL2FwaS9zaWdudXAnLCBtZW1iZXIpXG4gICAgICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoZGF0YSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmVycm9yKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldE1lbWJlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnL2FwaS9maW5kbWVtYmVyJywgbnVsbCwgcG9zdEhlYWRlcnMoKSlcbiAgICAgICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShkYXRhKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChlcnJvcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2F2ZU1lbWJlcjogZnVuY3Rpb24gKG1lbWJlcikge1xuICAgICAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnL2FwaS9zYXZlLXBlcnNvbmFsLWluZm8nLCBtZW1iZXIsIHBvc3RIZWFkZXJzKCkpXG4gICAgICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShudWxsKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChlcnJvcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2F2ZU5ld01lbWJlcjogZnVuY3Rpb24gKG1lbWJlcikge1xuICAgICAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnL2FwaS9uZXctbWVtYmVyc2hpcCcsIG1lbWJlcilcbiAgICAgICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShkYXRhKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChlcnJvcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgQ2hhbmdlUGFzc3dvcmQ6IGZ1bmN0aW9uIChtZW1iZXIpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJy9hcGkvY2hhbmdlLXBhc3N3b3JkJywgbWVtYmVyLCBwb3N0SGVhZGVycygpKVxuICAgICAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGRhdGEpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5lcnJvcihmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBDb3VudE1lbWJlcnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJy9hcGkvY291bnQtbWVtYmVycycpXG4gICAgICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoZGF0YSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmVycm9yKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIENvdW50TWVtYmVyc0J5RGVjYWRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCcvYXBpL2NvdW50LW1lbWJlcnMtYnktZGVjYWRlJylcbiAgICAgICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKG51bGwpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5lcnJvcihmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBDb3VudE1lbWJlcnNCeUJpcnRoTW9udGg6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnL2FwaS9jb3VudC1tZW1iZXJzLWJ5LWJpcnRobW9udGgnKVxuICAgICAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUobnVsbCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmVycm9yKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1dKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPU1lbWJlclNlcnZpY2UuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBOZXdzSXRlbVNlcnZpY2UgcHJvdmlkZXMgYSBtZWFucyBmb3IgdGhlIGNvbnRyb2xsZXJzIHRvIHNoYXJlIGFjY2VzcyB0byB0aGUgbmV3cyBpdGVtc1xuYW5ndWxhci5tb2R1bGUoJ3R0YycpLmZhY3RvcnkoJ05ld3NJdGVtU2VydmljZScsIFsnJGxvZycsICckaHR0cCcsICckcScsXG4gICAgZnVuY3Rpb24gKCRsb2csICRodHRwLCAkcSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZ2V0TmV3T2JqZWN0SWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgICAgIC8vIEdldCBhIG5ldyBPYmplY3RJZCB0byBpZGVudGlmeSB0aGUgbmV3IE5ld3MgSXRlbVxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJy9hcGkvbmV3c2l0ZW0tZ2V0LW5ldy1vYmplY3QtaWQnKVxuICAgICAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKEpTT04ucGFyc2UoZGF0YSkpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5lcnJvcihmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRBbGw6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJy9hcGkvbmV3c2l0ZW0tbGlzdCcpXG4gICAgICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoZGF0YSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmVycm9yKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJldHJpZXZlRmlsZXM6IGZ1bmN0aW9uIChuZXdzaXRlbWlkKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCcvYXBpL25ld3NpdGVtLWdldGZpbGVzJywgbmV3c2l0ZW1pZClcbiAgICAgICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShkYXRhKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChlcnJvcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVtb3ZlTmV3c0l0ZW06IGZ1bmN0aW9uIChuZXdzaXRlbWlkKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCcvYXBpL25ld3NpdGVtLXJlbW92ZScsIG5ld3NpdGVtaWQpXG4gICAgICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoZGF0YSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmVycm9yKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHB1Ymxpc2hOZXdzSXRlbTogZnVuY3Rpb24gKG5ld3NpdGVtKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCcvYXBpL25ld3NpdGVtLXB1Ymxpc2gnLCBuZXdzaXRlbSlcbiAgICAgICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShkYXRhKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChlcnJvcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfV0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9TmV3c0l0ZW1TZXJ2aWNlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuLy8gQSB0cml2aWFsIHNlcnZpY2UgZnJvbSB3aGljaCB0byBtYWludGFpbiB0aGUgc2V0IG9mIHBsYWNlcyB3aGVyZSBtZW1iZXJzIHJlc2lkZVxuYW5ndWxhci5tb2R1bGUoJ3R0YycpLmZhY3RvcnkoJ3BsYWNlc1NlcnZpY2UnLCBbJyRsb2cnLCBmdW5jdGlvbiAoJGxvZykge1xuICAgICAgICB2YXIgcGxhY2VzID0gWydUc2F3d2Fzc2VuLCBCQywgQ2FuYWRhJywgJ0RlbHRhLCBCQywgQ2FuYWRhJywgJ1N1cnJleSwgQkMsIENhbmFkYScsICdSaWNobW9uZCwgQkMsIENhbmFkYScsXG4gICAgICAgICAgICAnVmFuY291dmVyLCBCQywgQ2FuYWRhJywgJ1BvaW50IFJvYmVydHMsIFdBLCBVU0EnLCAnQnVybmFieSwgQkMsIENhbmFkYScsICdOZXcgV2VzdG1pbnN0ZXIsIEJDLCBDYW5hZGEnXTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwbGFjZXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfV0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9UGxhY2VzU2VydmljZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbmZ1bmN0aW9uIGlzTG9jYWxTdG9yYWdlU3VwcG9ydGVkKCkge1xuICAgIHZhciB0ZXN0S2V5ID0gJ3Rlc3QnLCBzdG9yYWdlID0gd2luZG93LmxvY2FsU3RvcmFnZTtcbiAgICB0cnkge1xuICAgICAgICBzdG9yYWdlLnNldEl0ZW0odGVzdEtleSwgJzEnKTtcbiAgICAgICAgc3RvcmFnZS5yZW1vdmVJdGVtKHRlc3RLZXkpO1xuICAgICAgICBjb25zb2xlLmxvZygnTG9jYWwgU3RvcmFnZSBJUyBzdXBwb3J0ZWQnKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZygnTG9jYWwgU3RvcmFnZSBJUyBOT1Qgc3VwcG9ydGVkJyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG4vLyBVc2VyU2VydmljZSBwcm92aWRlcyBhIG1lYW5zIGZvciB0aGUgY29udHJvbGxlcnMgdG8gc2hhcmUgdXNlciBsb2dpbiBzdGF0dXMgYW5kIHVzZXIgcm9sZVxuYW5ndWxhci5tb2R1bGUoJ3R0YycpLmZhY3RvcnkoJ1VzZXJTZXJ2aWNlJywgWyckbG9nJywgJyRjb29raWVzJywgJ2RldmljZURldGVjdG9yJywgJyR3aW5kb3cnLCBmdW5jdGlvbiAoJGxvZywgJGNvb2tpZXMsIGRldmljZURldGVjdG9yLCAkd2luZG93KSB7XG4gICAgICAgIC8vIHZhciBjb29raWVDYXBhYmxlID0gKGRldmljZURldGVjdG9yLm9zID09ICdtYWMnICYmIGRldmljZURldGVjdG9yLmJyb3dzZXIgPT0gJ2Nocm9tZScpO1xuICAgICAgICB2YXIgY29va2llQ2FwYWJsZSA9IGZhbHNlO1xuICAgICAgICB2YXIgSldUO1xuICAgICAgICB2YXIgZXhlYztcbiAgICAgICAgaWYgKGNvb2tpZUNhcGFibGUpIHtcbiAgICAgICAgICAgIEpXVCA9ICRjb29raWVzLmdldCgnSldUJyk7XG4gICAgICAgICAgICBleGVjID0gJGNvb2tpZXMuZ2V0KCdleGVjJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBKV1QgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnSldUJyk7XG4gICAgICAgICAgICBleGVjID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2V4ZWMnKTtcbiAgICAgICAgfVxuICAgICAgICAkbG9nLmluZm8oJ0pXVDogJywgSldUKTtcbiAgICAgICAgJGxvZy5pbmZvKCdleGVjOiAnLCBleGVjKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxvZ2dlZEluOiBmdW5jdGlvbiAocHJpdmlsZWdlcykge1xuICAgICAgICAgICAgICAgICRsb2cuaW5mbygnVXNlclNlcnZpY2UuTG9nZ2VkSW4gKCksIHByaXZpbGVnZXMgMiAnLCBwcml2aWxlZ2VzKTtcbiAgICAgICAgICAgICAgICBpZiAoY29va2llQ2FwYWJsZSkge1xuICAgICAgICAgICAgICAgICAgICAkY29va2llcy5wdXQoJ0pXVCcsIHByaXZpbGVnZXMuand0LCB7IHNlY3VyZTogdHJ1ZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgJGNvb2tpZXMucHV0KCdleGVjJywgcHJpdmlsZWdlcy5leGVjLCB7IHNlY3VyZTogdHJ1ZSB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoaXNMb2NhbFN0b3JhZ2VTdXBwb3J0ZWQoKSkge1xuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnSldUJywgcHJpdmlsZWdlcy5qd3QpO1xuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnZXhlYycsIHByaXZpbGVnZXMuZXhlYyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIEpXVCA9IHByaXZpbGVnZXMuand0O1xuICAgICAgICAgICAgICAgIGV4ZWMgPSBwcml2aWxlZ2VzLmV4ZWM7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbG9nZ2VkT3V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJGxvZy5pbmZvKCdVc2VyU2VydmljZS5sb2dnZWRPdXQgKCknKTtcbiAgICAgICAgICAgICAgICBpZiAoY29va2llQ2FwYWJsZSkge1xuICAgICAgICAgICAgICAgICAgICAkY29va2llcy5yZW1vdmUoJ0pXVCcpO1xuICAgICAgICAgICAgICAgICAgICAkY29va2llcy5yZW1vdmUoJ2V4ZWMnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoaXNMb2NhbFN0b3JhZ2VTdXBwb3J0ZWQoKSkge1xuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnSldUJywgJycpO1xuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnZXhlYycsICcnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgSldUID0gJyc7XG4gICAgICAgICAgICAgICAgZXhlYyA9ICcnO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGlzTG9nZ2VkSW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gISFKV1Q7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0VG9rZW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gSldUO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldEV4ZWM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZXhlYztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1Vc2VyU2VydmljZS5qcy5tYXAiLCJ2YXIgY29tcGFyZVRvID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlcXVpcmU6IFwibmdNb2RlbFwiLFxuICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgb3RoZXJNb2RlbFZhbHVlOiBcIj1jb21wYXJlVG9cIlxuICAgICAgICB9LFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJpYnV0ZXMsIG5nTW9kZWwpIHtcbiAgICAgICAgICAgIG5nTW9kZWwuJHZhbGlkYXRvcnMuY29tcGFyZVRvID0gZnVuY3Rpb24gKG1vZGVsVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImZpcnN0LCBzZWNvbmQgbW9kZWwgdmFsdWU6IFwiICsgbW9kZWxWYWx1ZSArICcsICcgKyBzY29wZS5vdGhlck1vZGVsVmFsdWUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBtb2RlbFZhbHVlID09IHNjb3BlLm90aGVyTW9kZWxWYWx1ZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBzY29wZS4kd2F0Y2goXCJvdGhlck1vZGVsVmFsdWVcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIG5nTW9kZWwuJHZhbGlkYXRlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG59O1xuYW5ndWxhci5tb2R1bGUoJ3R0YycpLmRpcmVjdGl2ZSgnY29tcGFyZVRvJywgY29tcGFyZVRvKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvbXBhcmVUby5qcy5tYXAiLCJhbmd1bGFyLm1vZHVsZSgndHRjJykuZGlyZWN0aXZlKCdkc0VtYWlsYWRkcmVzcycsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICBzY29wZTogZmFsc2UsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnL25nLXRlbXBsYXRlcy9kcy1lbWFpbGFkZHJlc3MuaHRtbCcsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uICgkc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7IH1cbiAgICB9O1xufSk7XG5hbmd1bGFyLm1vZHVsZSgndHRjJykuZGlyZWN0aXZlKCdkc0NvbmZpcm1FbWFpbGFkZHJlc3MnLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgc2NvcGU6IGZhbHNlLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJy9uZy10ZW1wbGF0ZXMvZHMtY29uZmlybWVtYWlsYWRkcmVzcy5odG1sJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKCRzY29wZSwgZWxlbWVudCwgYXR0cnMpIHsgfVxuICAgIH07XG59KTtcbmFuZ3VsYXIubW9kdWxlKCd0dGMnKS5kaXJlY3RpdmUoJ2RzUGFzc3dvcmQnLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgc2NvcGU6IGZhbHNlLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJy9uZy10ZW1wbGF0ZXMvZHMtcGFzc3dvcmQuaHRtbCcsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uICgkc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7IH1cbiAgICB9O1xufSk7XG5hbmd1bGFyLm1vZHVsZSgndHRjJykuZGlyZWN0aXZlKCdkc0NvbmZpcm1wYXNzd29yZCcsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICBzY29wZTogZmFsc2UsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnL25nLXRlbXBsYXRlcy9kcy1jb25maXJtcGFzc3dvcmQuaHRtbCcsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uICgkc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7IH1cbiAgICB9O1xufSk7XG5hbmd1bGFyLm1vZHVsZSgndHRjJykuZGlyZWN0aXZlKCdkc0ZpcnN0bmFtZScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICBzY29wZTogZmFsc2UsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnL25nLXRlbXBsYXRlcy9kcy1maXJzdG5hbWUuaHRtbCcsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uICgkc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7IH1cbiAgICB9O1xufSk7XG5hbmd1bGFyLm1vZHVsZSgndHRjJykuZGlyZWN0aXZlKCdkc0ZhbWlseW5hbWUnLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgc2NvcGU6IGZhbHNlLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJy9uZy10ZW1wbGF0ZXMvZHMtZmFtaWx5bmFtZS5odG1sJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKCRzY29wZSwgZWxlbWVudCwgYXR0cnMpIHsgfVxuICAgIH07XG59KTtcbmFuZ3VsYXIubW9kdWxlKCd0dGMnKS5kaXJlY3RpdmUoJ2RzRmFtaWx5ZW1haWxhZGRyZXNzJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHNjb3BlOiBmYWxzZSxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcvbmctdGVtcGxhdGVzL2RzLWZhbWlseWVtYWlsYWRkcmVzcy5odG1sJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKCRzY29wZSwgZWxlbWVudCwgYXR0cnMpIHsgfVxuICAgIH07XG59KTtcbmFuZ3VsYXIubW9kdWxlKCd0dGMnKS5kaXJlY3RpdmUoJ2RhdGVGaWVsZCcsIGZ1bmN0aW9uICgkZmlsdGVyKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgcmVxdWlyZTogJ25nTW9kZWwnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBuZ01vZGVsQ29udHJvbGxlcikge1xuICAgICAgICAgICAgbmdNb2RlbENvbnRyb2xsZXIuJHBhcnNlcnMucHVzaChmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIC8vVmlldyAtPiBNb2RlbFxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdWaWV3IC0+IE1vZGVsOiAnLCBkYXRhKTtcbiAgICAgICAgICAgICAgICB2YXIgZGF0ZSA9IG1vbWVudChkYXRhLCAnWVlZWS1NTS1ERCcsIHRydWUpO1xuICAgICAgICAgICAgICAgIG5nTW9kZWxDb250cm9sbGVyLiRzZXRWYWxpZGl0eSgnZGF0ZScsIGRhdGUuaXNWYWxpZCgpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0ZS5pc1ZhbGlkKCkgPyBkYXRlLnRvRGF0ZSgpIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBuZ01vZGVsQ29udHJvbGxlci4kZm9ybWF0dGVycy5wdXNoKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgLy9Nb2RlbCAtPiBWaWV3XG4gICAgICAgICAgICAgICAgcmV0dXJuICRmaWx0ZXIoJ2RhdGUnKShkYXRhLCBcInl5eXktTU0tZGRcIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG59KTtcbmFuZ3VsYXIubW9kdWxlKCd0dGMnKS5kaXJlY3RpdmUoJ3R0Y0ZhbWlseUVtYWlsYWRkcmVzc0F0dHInLCBmdW5jdGlvbiAoJGZpbHRlcikge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycywgbmdNb2RlbENvbnRyb2xsZXIpIHtcbiAgICAgICAgICAgIGlmIChfLmlzVW5kZWZpbmVkKHNjb3BlLmZhbWlseWVtYWlsYWRkcmVzcykpXG4gICAgICAgICAgICAgICAgc2NvcGUuZmFtaWx5ZW1haWxhZGRyZXNzID0gJyc7XG4gICAgICAgICAgICBuZ01vZGVsQ29udHJvbGxlci4kcGFyc2Vycy5wdXNoKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2FsbGVtYWlsYWRkcmVzc2VzLmxlbmd0aDogJywgc2NvcGUuYWxsZW1haWxhZGRyZXNzZXMubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSXQncyBPayBub3QgdG8gc2V0IGEgZmFtaWx5ZW1haWxhZGRyZXNzIGF0IGFsbFxuICAgICAgICAgICAgICAgICAgICBuZ01vZGVsQ29udHJvbGxlci4kc2V0VmFsaWRpdHkoJ2ZhbWlseWVtYWlsYWRkcmVzcycsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBuZ01vZGVsQ29udHJvbGxlci4kc2V0VmFsaWRpdHkoJ2VtYWlsJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZmFtaWx5ZW1haWxhZGRyZXNzS25vd24gPSBzY29wZS5hbGxlbWFpbGFkZHJlc3Nlcy5pbmRleE9mKGRhdGEpID49IDA7XG4gICAgICAgICAgICAgICAgICAgIG5nTW9kZWxDb250cm9sbGVyLiRzZXRWYWxpZGl0eSgnZmFtaWx5ZW1haWxhZGRyZXNzJywgZmFtaWx5ZW1haWxhZGRyZXNzS25vd24pO1xuICAgICAgICAgICAgICAgICAgICBuZ01vZGVsQ29udHJvbGxlci4kc2V0VmFsaWRpdHkoJ2VtYWlsJywgZmFtaWx5ZW1haWxhZGRyZXNzS25vd24pO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZmFtaWx5ZW1haWxhZGRyZXNzS25vd246ICcsIGZhbWlseWVtYWlsYWRkcmVzc0tub3duKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIG5nTW9kZWxDb250cm9sbGVyLiRmb3JtYXR0ZXJzLnB1c2goZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAvL01vZGVsIC0+IFZpZXdcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnbmdNb2RlbENvbnRyb2xsZXIuJGZvcm1hdHRlcnMucHVzaDogJywgZGF0YSk7XG4gICAgICAgICAgICAgICAgaWYgKHNjb3BlLmFsbGVtYWlsYWRkcmVzc2VzLmluZGV4T2YoZGF0YSkgPj0gMClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn0pO1xuYW5ndWxhci5tb2R1bGUoJ3R0YycpLmRpcmVjdGl2ZSgnZHNBZGRyZXNzJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHNjb3BlOiBmYWxzZSxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcvbmctdGVtcGxhdGVzL2RzLWFkZHJlc3MuaHRtbCcsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uICgkc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7IH1cbiAgICB9O1xufSk7XG5hbmd1bGFyLm1vZHVsZSgndHRjJykuZGlyZWN0aXZlKCdkc1BsYWNlJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHNjb3BlOiBmYWxzZSxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcvbmctdGVtcGxhdGVzL2RzLXBsYWNlLmh0bWwnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoJHNjb3BlLCBlbGVtZW50LCBhdHRycykgeyB9XG4gICAgfTtcbn0pO1xuYW5ndWxhci5tb2R1bGUoJ3R0YycpLmRpcmVjdGl2ZSgnZHNQb3N0Y29kZScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICBzY29wZTogZmFsc2UsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnL25nLXRlbXBsYXRlcy9kcy1wb3N0Y29kZS5odG1sJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKCRzY29wZSwgZWxlbWVudCwgYXR0cnMpIHsgfVxuICAgIH07XG59KTtcbmFuZ3VsYXIubW9kdWxlKCd0dGMnKS5kaXJlY3RpdmUoJ2RzUHJpbWFyeXBob25lJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHNjb3BlOiBmYWxzZSxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcvbmctdGVtcGxhdGVzL2RzLXByaW1hcnlwaG9uZS5odG1sJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKCRzY29wZSwgZWxlbWVudCwgYXR0cnMpIHsgfVxuICAgIH07XG59KTtcbmFuZ3VsYXIubW9kdWxlKCd0dGMnKS5kaXJlY3RpdmUoJ2RzQWx0ZXJuYXRpdmVwaG9uZScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICBzY29wZTogZmFsc2UsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnL25nLXRlbXBsYXRlcy9kcy1hbHRlcm5hdGl2ZXBob25lLmh0bWwnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoJHNjb3BlLCBlbGVtZW50LCBhdHRycykgeyB9XG4gICAgfTtcbn0pO1xuYW5ndWxhci5tb2R1bGUoJ3R0YycpLmRpcmVjdGl2ZSgnZHNEb2InLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgc2NvcGU6IGZhbHNlLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJy9uZy10ZW1wbGF0ZXMvZHMtZG9iLmh0bWwnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoJHNjb3BlLCBlbGVtZW50LCBhdHRycykgeyB9XG4gICAgfTtcbn0pO1xuYW5ndWxhci5tb2R1bGUoJ3R0YycpLmRpcmVjdGl2ZSgnZHNMaWFiaWxpdHlhZ3JlZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgc2NvcGU6IGZhbHNlLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJy9uZy10ZW1wbGF0ZXMvZHMtbGlhYmlsaXR5YWdyZWVkLmh0bWwnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoJHNjb3BlLCBlbGVtZW50LCBhdHRycykgeyB9XG4gICAgfTtcbn0pO1xuYW5ndWxhci5tb2R1bGUoJ3R0YycpLmRpcmVjdGl2ZSgnZHNDb21tdW5pY2F0aW9uc2FncmVlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICBzY29wZTogZmFsc2UsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnL25nLXRlbXBsYXRlcy9kcy1jb21tdW5pY2F0aW9uc2FncmVlZC5odG1sJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKCRzY29wZSwgZWxlbWVudCwgYXR0cnMpIHsgfVxuICAgIH07XG59KTtcbmFuZ3VsYXIubW9kdWxlKCd0dGMnKS5kaXJlY3RpdmUoJ2RzUGhvdG9hZ3JlZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgc2NvcGU6IGZhbHNlLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJy9uZy10ZW1wbGF0ZXMvZHMtcGhvdG9hZ3JlZWQuaHRtbCcsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uICgkc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7IH1cbiAgICB9O1xufSk7XG5hbmd1bGFyLm1vZHVsZSgndHRjJykuZGlyZWN0aXZlKCdkc1N0dWRlbnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgc2NvcGU6IGZhbHNlLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJy9uZy10ZW1wbGF0ZXMvZHMtc3R1ZGVudC5odG1sJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKCRzY29wZSwgZWxlbWVudCwgYXR0cnMpIHsgfVxuICAgIH07XG59KTtcbmFuZ3VsYXIubW9kdWxlKCd0dGMnKS5kaXJlY3RpdmUoJ2RzVm9sdW50ZWVyTWFpbnRlbmFuY2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc29sZS5sb2coJ0RpcmVjdGl2ZSBjYWxsZWQnKTtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICBzY29wZTogZmFsc2UsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnL25nLXRlbXBsYXRlcy9kcy12b2x1bnRlZXItbWFpbnRlbmFuY2UuaHRtbCcsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uICgkc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7IH1cbiAgICB9O1xufSk7XG5hbmd1bGFyLm1vZHVsZSgndHRjJykuZGlyZWN0aXZlKCdkc1ZvbHVudGVlckJvb2trZWVwaW5nJywgZnVuY3Rpb24gKCkge1xuICAgIGNvbnNvbGUubG9nKCdEaXJlY3RpdmUgY2FsbGVkJyk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgc2NvcGU6IGZhbHNlLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJy9uZy10ZW1wbGF0ZXMvZHMtdm9sdW50ZWVyLWJvb2trZWVwaW5nLmh0bWwnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoJHNjb3BlLCBlbGVtZW50LCBhdHRycykgeyB9XG4gICAgfTtcbn0pO1xuYW5ndWxhci5tb2R1bGUoJ3R0YycpLmRpcmVjdGl2ZSgnZHNWb2x1bnRlZXJHYXJkZW5pbmcnLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc29sZS5sb2coJ0RpcmVjdGl2ZSBjYWxsZWQnKTtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICBzY29wZTogZmFsc2UsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnL25nLXRlbXBsYXRlcy9kcy12b2x1bnRlZXItZ2FyZGVuaW5nLmh0bWwnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoJHNjb3BlLCBlbGVtZW50LCBhdHRycykgeyB9XG4gICAgfTtcbn0pO1xuYW5ndWxhci5tb2R1bGUoJ3R0YycpLmRpcmVjdGl2ZSgnZHNWb2x1bnRlZXJBcmNoaXZpc3QnLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc29sZS5sb2coJ0RpcmVjdGl2ZSBjYWxsZWQnKTtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICBzY29wZTogZmFsc2UsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnL25nLXRlbXBsYXRlcy9kcy12b2x1bnRlZXItYXJjaGl2aXN0Lmh0bWwnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoJHNjb3BlLCBlbGVtZW50LCBhdHRycykgeyB9XG4gICAgfTtcbn0pO1xuYW5ndWxhci5tb2R1bGUoJ3R0YycpLmRpcmVjdGl2ZSgnZHNWb2x1bnRlZXJPcmdhbml6ZWNsdWJzb2NpYWwnLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc29sZS5sb2coJ0RpcmVjdGl2ZSBjYWxsZWQnKTtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICBzY29wZTogZmFsc2UsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnL25nLXRlbXBsYXRlcy9kcy12b2x1bnRlZXItb3JnYW5pemVjbHVic29jaWFsLmh0bWwnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoJHNjb3BlLCBlbGVtZW50LCBhdHRycykgeyB9XG4gICAgfTtcbn0pO1xuYW5ndWxhci5tb2R1bGUoJ3R0YycpLmRpcmVjdGl2ZSgnZHNWb2x1bnRlZXJQaG9uZWNvbW1pdHRlZScsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zb2xlLmxvZygnRGlyZWN0aXZlIGNhbGxlZCcpO1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHNjb3BlOiBmYWxzZSxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcvbmctdGVtcGxhdGVzL2RzLXZvbHVudGVlci1waG9uZWNvbW1pdHRlZS5odG1sJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKCRzY29wZSwgZWxlbWVudCwgYXR0cnMpIHsgfVxuICAgIH07XG59KTtcbmFuZ3VsYXIubW9kdWxlKCd0dGMnKS5kaXJlY3RpdmUoJ2RzVm9sdW50ZWVyV2VicHJvZ3JhbW1pbmcnLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc29sZS5sb2coJ0RpcmVjdGl2ZSBjYWxsZWQnKTtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICBzY29wZTogZmFsc2UsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnL25nLXRlbXBsYXRlcy9kcy12b2x1bnRlZXItd2VicHJvZ3JhbW1pbmcuaHRtbCcsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uICgkc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7IH1cbiAgICB9O1xufSk7XG5hbmd1bGFyLm1vZHVsZSgndHRjJykuZGlyZWN0aXZlKCdkc1ZvbHVudGVlclRlYW1jYXB0YWluJywgZnVuY3Rpb24gKCkge1xuICAgIGNvbnNvbGUubG9nKCdEaXJlY3RpdmUgY2FsbGVkJyk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgc2NvcGU6IGZhbHNlLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJy9uZy10ZW1wbGF0ZXMvZHMtdm9sdW50ZWVyLXRlYW1jYXB0YWluLmh0bWwnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoJHNjb3BlLCBlbGVtZW50LCBhdHRycykgeyB9XG4gICAgfTtcbn0pO1xuYW5ndWxhci5tb2R1bGUoJ3R0YycpLmRpcmVjdGl2ZSgnZHNWb2x1bnRlZXJNZW1iZXJzaGlwZHJpdmVzJywgZnVuY3Rpb24gKCkge1xuICAgIGNvbnNvbGUubG9nKCdEaXJlY3RpdmUgY2FsbGVkJyk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgc2NvcGU6IGZhbHNlLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJy9uZy10ZW1wbGF0ZXMvZHMtdm9sdW50ZWVyLW1lbWJlcnNoaXBkcml2ZXMuaHRtbCcsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uICgkc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7IH1cbiAgICB9O1xufSk7XG5hbmd1bGFyLm1vZHVsZSgndHRjJykuZGlyZWN0aXZlKCdkc1ZvbHVudGVlck1lZGlhY29vcmRpbmF0b3InLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc29sZS5sb2coJ0RpcmVjdGl2ZSBjYWxsZWQnKTtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICBzY29wZTogZmFsc2UsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnL25nLXRlbXBsYXRlcy9kcy12b2x1bnRlZXItbWVkaWFjb29yZGluYXRvci5odG1sJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKCRzY29wZSwgZWxlbWVudCwgYXR0cnMpIHsgfVxuICAgIH07XG59KTtcbmFuZ3VsYXIubW9kdWxlKCd0dGMnKS5kaXJlY3RpdmUoJ2RzVm9sdW50ZWVyU3VwcG9ydHBsYXllcmltcHJvdmVtZW50anVuaW9yJywgZnVuY3Rpb24gKCkge1xuICAgIGNvbnNvbGUubG9nKCdEaXJlY3RpdmUgY2FsbGVkJyk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgc2NvcGU6IGZhbHNlLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJy9uZy10ZW1wbGF0ZXMvZHMtdm9sdW50ZWVyLXN1cHBvcnRwbGF5ZXJpbXByb3ZlbWVudGp1bmlvci5odG1sJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKCRzY29wZSwgZWxlbWVudCwgYXR0cnMpIHsgfVxuICAgIH07XG59KTtcbmFuZ3VsYXIubW9kdWxlKCd0dGMnKS5kaXJlY3RpdmUoJ2RzVm9sdW50ZWVyU3VwcG9ydHBsYXllcmltcHJvdmVtZW50YWR1bHQnLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc29sZS5sb2coJ0RpcmVjdGl2ZSBjYWxsZWQnKTtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICBzY29wZTogZmFsc2UsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnL25nLXRlbXBsYXRlcy9kcy12b2x1bnRlZXItc3VwcG9ydHBsYXllcmltcHJvdmVtZW50YWR1bHQuaHRtbCcsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uICgkc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7IH1cbiAgICB9O1xufSk7XG5hbmd1bGFyLm1vZHVsZSgndHRjJykuZGlyZWN0aXZlKCdkc1ZvbHVudGVlclN1cHBvcnRzb2NpYWxldmVudHMnLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc29sZS5sb2coJ0RpcmVjdGl2ZSBjYWxsZWQnKTtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICBzY29wZTogZmFsc2UsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnL25nLXRlbXBsYXRlcy9kcy12b2x1bnRlZXItc3VwcG9ydHNvY2lhbGV2ZW50cy5odG1sJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKCRzY29wZSwgZWxlbWVudCwgYXR0cnMpIHsgfVxuICAgIH07XG59KTtcbmFuZ3VsYXIubW9kdWxlKCd0dGMnKS5kaXJlY3RpdmUoJ2RzRXhlY1ByZXNpZGVudCcsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICBzY29wZTogZmFsc2UsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnL25nLXRlbXBsYXRlcy9kcy1leGVjLXByZXNpZGVudC5odG1sJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKCRzY29wZSwgZWxlbWVudCwgYXR0cnMpIHsgfVxuICAgIH07XG59KTtcbmFuZ3VsYXIubW9kdWxlKCd0dGMnKS5kaXJlY3RpdmUoJ2RzRXhlY1ZpY2VwcmVzaWRlbnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgc2NvcGU6IGZhbHNlLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJy9uZy10ZW1wbGF0ZXMvZHMtZXhlYy12aWNlcHJlc2lkZW50Lmh0bWwnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoJHNjb3BlLCBlbGVtZW50LCBhdHRycykgeyB9XG4gICAgfTtcbn0pO1xuYW5ndWxhci5tb2R1bGUoJ3R0YycpLmRpcmVjdGl2ZSgnZHNFeGVjU2VjcmV0YXJ5JywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHNjb3BlOiBmYWxzZSxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcvbmctdGVtcGxhdGVzL2RzLWV4ZWMtc2VjcmV0YXJ5Lmh0bWwnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoJHNjb3BlLCBlbGVtZW50LCBhdHRycykgeyB9XG4gICAgfTtcbn0pO1xuYW5ndWxhci5tb2R1bGUoJ3R0YycpLmRpcmVjdGl2ZSgnZHNFeGVjVHJlYXN1cmVyJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHNjb3BlOiBmYWxzZSxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcvbmctdGVtcGxhdGVzL2RzLWV4ZWMtdHJlYXN1cmVyLmh0bWwnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoJHNjb3BlLCBlbGVtZW50LCBhdHRycykgeyB9XG4gICAgfTtcbn0pO1xuYW5ndWxhci5tb2R1bGUoJ3R0YycpLmRpcmVjdGl2ZSgnZHNFeGVjTWFpbnRlbmFuY2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgc2NvcGU6IGZhbHNlLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJy9uZy10ZW1wbGF0ZXMvZHMtZXhlYy1tYWludGVuYW5jZS5odG1sJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKCRzY29wZSwgZWxlbWVudCwgYXR0cnMpIHsgfVxuICAgIH07XG59KTtcbmFuZ3VsYXIubW9kdWxlKCd0dGMnKS5kaXJlY3RpdmUoJ2RzRXhlY1NvY2lhbGRpcmVjdG9yJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHNjb3BlOiBmYWxzZSxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcvbmctdGVtcGxhdGVzL2RzLWV4ZWMtc29jaWFsZGlyZWN0b3IuaHRtbCcsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uICgkc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7IH1cbiAgICB9O1xufSk7XG5hbmd1bGFyLm1vZHVsZSgndHRjJykuZGlyZWN0aXZlKCdkc0V4ZWNNZW1iZXJzaGlwZGlyZWN0b3InLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgc2NvcGU6IGZhbHNlLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJy9uZy10ZW1wbGF0ZXMvZHMtZXhlYy1tZW1iZXJzaGlwZGlyZWN0b3IuaHRtbCcsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uICgkc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7IH1cbiAgICB9O1xufSk7XG5hbmd1bGFyLm1vZHVsZSgndHRjJykuZGlyZWN0aXZlKCdkc0V4ZWNNZW5zbGVhZ3VlJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHNjb3BlOiBmYWxzZSxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcvbmctdGVtcGxhdGVzL2RzLWV4ZWMtbWVuc2xlYWd1ZS5odG1sJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKCRzY29wZSwgZWxlbWVudCwgYXR0cnMpIHsgfVxuICAgIH07XG59KTtcbmFuZ3VsYXIubW9kdWxlKCd0dGMnKS5kaXJlY3RpdmUoJ2RzRXhlY1dvbWVuc2xlYWd1ZScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICBzY29wZTogZmFsc2UsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnL25nLXRlbXBsYXRlcy9kcy1leGVjLXdvbWVuc2xlYWd1ZS5odG1sJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKCRzY29wZSwgZWxlbWVudCwgYXR0cnMpIHsgfVxuICAgIH07XG59KTtcbmFuZ3VsYXIubW9kdWxlKCd0dGMnKS5kaXJlY3RpdmUoJ2RzRXhlY0p1bmlvcnByb2dyYW1jb29yZGluYXRvcicsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICBzY29wZTogZmFsc2UsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnL25nLXRlbXBsYXRlcy9kcy1leGVjLWp1bmlvcnByb2dyYW1jb29yZGluYXRvci5odG1sJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKCRzY29wZSwgZWxlbWVudCwgYXR0cnMpIHsgfVxuICAgIH07XG59KTtcbmFuZ3VsYXIubW9kdWxlKCd0dGMnKS5kaXJlY3RpdmUoJ2RzRXhlY1dlYm1hc3RlcicsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICBzY29wZTogZmFsc2UsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnL25nLXRlbXBsYXRlcy9kcy1leGVjLXdlYm1hc3Rlci5odG1sJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKCRzY29wZSwgZWxlbWVudCwgYXR0cnMpIHsgfVxuICAgIH07XG59KTtcbmFuZ3VsYXIubW9kdWxlKCd0dGMnKS5kaXJlY3RpdmUoJ2RzRXhlY05ld3NsZXR0ZXInLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgc2NvcGU6IGZhbHNlLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJy9uZy10ZW1wbGF0ZXMvZHMtZXhlYy1uZXdzbGV0dGVyLmh0bWwnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoJHNjb3BlLCBlbGVtZW50LCBhdHRycykgeyB9XG4gICAgfTtcbn0pO1xuYW5ndWxhci5tb2R1bGUoJ3R0YycpLmRpcmVjdGl2ZSgnZHNFeGVjVG91cm5hbWVudGRpcmVjdG9yJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHNjb3BlOiBmYWxzZSxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcvbmctdGVtcGxhdGVzL2RzLWV4ZWMtdG91cm5hbWVudGRpcmVjdG9yLmh0bWwnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoJHNjb3BlLCBlbGVtZW50LCBhdHRycykgeyB9XG4gICAgfTtcbn0pO1xuYW5ndWxhci5tb2R1bGUoJ3R0YycpLmRpcmVjdGl2ZSgnZHNQZXJzb25hbFByb2ZpbGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgc2NvcGU6IGZhbHNlLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJy9uZy10ZW1wbGF0ZXMvZHMtcGVyc29uYWwtcHJvZmlsZS5odG1sJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKCRzY29wZSwgZWxlbWVudCwgYXR0cnMpIHsgfVxuICAgIH07XG59KTtcbmFuZ3VsYXIubW9kdWxlKCd0dGMnKS5kaXJlY3RpdmUoJ2RzSm9pbmluZ1llYXInLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgc2NvcGU6IGZhbHNlLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJy9uZy10ZW1wbGF0ZXMvZHMtam9pbmluZy15ZWFyLmh0bWwnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoJHNjb3BlLCBlbGVtZW50LCBhdHRycykgeyB9XG4gICAgfTtcbn0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZWRpdG9yLWRpcmVjdGl2ZXMuanMubWFwIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
