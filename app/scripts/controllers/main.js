'use strict';

angular.module('scalearAngularApp')
  .controller('MainCtrl', ['$scope','$log','Page','$rootScope', function ($scope, $log,Page, $rootScope) {   
   Page.setTitle('Home')
   $rootScope.subheader_message = null
   
  }]);

