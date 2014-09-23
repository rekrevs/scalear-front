'use strict';

angular.module('scalearAngularApp')
.factory('ScalTour', ['$rootScope', '$filter', '$tour', function($rootScope, $filter, $tour) {
    $rootScope.$on('start_tour', function(){
    	// console.log(cfpLoadingBarProvider)
    	// if(cfpLoadingBarProvider.status() != 1){

    	// }
        $tour.start();
    })
}]);