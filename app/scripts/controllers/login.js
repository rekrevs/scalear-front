'use strict';

angular.module('scalearAngularApp')
  .controller('LoginCtrl',['$scope','scalear_api','$location','$log', '$translate', function ($scope, scalear_api, $location, $log, $translate, redirection_url) {
   $scope.login = function(){
//   	$log.debug("in login");
       console.log('here');
       $scope.singleModel = 1;
//    window.location=scalear_api.host+"/"+$scope.current_lang+"/users/sign_angular_in?angular_redirect="+scalear_api.redirection_url; //http://localhost:9000/#/ //http://angular-edu.herokuapp.com/#/
   }
   
  }]);
