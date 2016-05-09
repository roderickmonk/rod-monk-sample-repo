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