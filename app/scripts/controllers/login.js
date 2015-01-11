'use strict';

angular.module('scalearAngularApp')
  .controller('LoginCtrl',['$state','$scope','$rootScope', 'scalear_api','$location','$log', '$translate', 'User', 'Page', 'ErrorHandler', '$timeout', function ($state, $scope, $rootScope,scalear_api, $location, $log, $translate, User, Page, ErrorHandler, $timeout) {
  
  $scope.user={}
  Page.setTitle('navigation.login')
  $('#user_email').select()
  $scope.login = function(){
    $scope.sending = true;
    User.sign_in({},
      {"user":$scope.user}, 
      function(data){
        console.log("login success")
        $scope.sending = false;
        $rootScope.$broadcast("get_current_courses")
        if(!data.info_complete){
          $state.go("edit_account");
          $rootScope.show_alert = "error";
          ErrorHandler.showMessage($translate("controller_msg.update_account_information"), 'errorMessage', 8000);
        }
        else
          $state.go("dashboard");
          
      },function(){
        $scope.sending = false;
    });
  }

   
}]);
