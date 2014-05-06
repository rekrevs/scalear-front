'use strict';

angular.module('scalearAngularApp')
.directive('sharedItem', ['$rootScope', 'Home', 'SharedItem', '$state', function($rootScope, Home, SharedItem, $state){
  return{
    restrict: 'E',
    scope:{
      data: "="
    },
    templateUrl: '/views/teacher/sharing/shared_item.html',
    link: function(scope, element){

    }
  }
}]);