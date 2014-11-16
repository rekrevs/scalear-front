'use strict';

angular.module('scalearAngularApp')
.factory('ContentNavigator', ['$rootScope',function($rootScope) {
   return {
     status: false,
     getStatus: function() { return this.status; },
     setStatus: function(stat){ 
     	this.status = stat
     	$rootScope.$broadcast('content_navigator_change', this.status)
     },
     open: function(){
     	this.status = true
     	$rootScope.$broadcast('content_navigator_change', this.status)
     },
     close: function(){
     	this.status = false
     	$rootScope.$broadcast('content_navigator_change', this.status)
     }
   };
}]);