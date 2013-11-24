'use strict';

angular.module('scalearAngularApp')
  .controller('LoginCtrl',['$scope','scalear_api','$location', function ($scope, scalear_api, $location) {
   $scope.login = function(){
   	console.log("in login");
   	var authUrl = "http://localhost:3000/oauth/authorize" + 
            "?response_type=token" +
            "&redirect_uri=" + "http://localhost:9000/#/";
            // store redirect_uri in session  on server??

    window.location=scalear_api.host+"/en/users/sign_angular_in?angular_redirect=http://angular-edu.herokuapp.com/#/"; //http://localhost:9000/#/ //http://angular-edu.herokuapp.com/#/

    //console.log($location.path()) ;
   }
   
  }]);
