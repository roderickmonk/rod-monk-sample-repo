"use strict";

// A trivial service from which to maintain the set of places where members reside
app.factory('placesService', ['$log', function ($log) {

	var places = [	'Delta, BC, Canada', 'Surrey, BC, Canada', 'Richmond, BC, Canada',
					'Vancouver, BC, Canada', 'Point Roberts, WA, USA', 'Burnaby, BC, Canada', 'New Westminster, BC, Canada'];
	return {
		get: function () {
			return places;
		}
	}
}]);