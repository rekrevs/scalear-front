'use strict';

angular.module('scalearAngularApp')
.factory('TimelineNavigator', ['$rootScope',function($rootScope) {
   return {
     status: false,
     getStatus: function() { return this.status; },
     setStatus: function(stat){ 
     	this.status = stat
     	$rootScope.$broadcast('timeline_navigator_change', this.status)
     },
     open: function(){
     	this.setStatus(true)
     },
     close: function(){
     	this.setStatus(false)
     }
   };
}]);