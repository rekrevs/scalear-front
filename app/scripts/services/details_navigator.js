'use strict';

angular.module('scalearAngularApp')
.factory('DetailsNavigator', ['$rootScope','$timeout',function($rootScope,$timeout) {
   return {
     status: false,
     getStatus: function() { return this.status; },
     setStatus: function(stat){ 
     	this.status = stat
        $rootScope.$broadcast('details_navigator_change', stat)
     },
     open: function(){
     	this.setStatus(true)
     },
     close: function(){
     	this.setStatus(false)
     }
   };
}]);