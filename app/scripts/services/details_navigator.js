'use strict';

angular.module('scalearAngularApp')
.factory('DetailsNavigator', ['$rootScope',function($rootScope) {
   return {
     status: false,
     getStatus: function() { return this.status; },
     setStatus: function(stat){ 
     	this.status = stat
        console.log("datails status", this.status)
     	$rootScope.$broadcast('details_navigator_change', this.status)
     },
     open: function(){
     	this.status = true
     	$rootScope.$broadcast('details_navigator_change', this.status)
     },
     close: function(){
     	this.status = false
     	$rootScope.$broadcast('details_navigator_change', this.status)
     }
   };
}]);