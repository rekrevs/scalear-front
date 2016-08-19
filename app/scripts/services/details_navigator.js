'use strict';

angular.module('scalearAngularApp')
.factory('DetailsNavigator', ['$rootScope','$timeout',function($rootScope,$timeout) {

    var module_details_groups = {
      module: true, // initially to open 'module' group,
      settings: false // 'settings' to be closed
    };

    var lecture_details_groups = {
      video: true, // initially to open 'video' group,
      settings: false, // rest to be closed
      quizzes: false,
      markers: false
    };

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
     },
     module_details_groups: module_details_groups,
     lecture_details_groups: lecture_details_groups
   };
}]);
