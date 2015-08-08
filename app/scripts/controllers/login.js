'use strict';

angular.module('scalearAngularApp')
  .controller('LoginCtrl',['$state','$scope','$rootScope', 'scalear_api','$location','$log', '$translate', 'User', 'Page', 'ErrorHandler', function ($state, $scope, $rootScope,scalear_api, $location, $log, $translate, User, Page, ErrorHandler) {
  
  $scope.user={}
  Page.setTitle('navigation.login')
  $('#user_email').select()

  $scope.login = function(){
    $scope.sending = true;
    User.sign_in({},
      {"user":$scope.user}, 
      function(data){
        $log.debug("login success")
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

  var isMobile=function(){
      var iOS = false,
          iDevice = ['iPad', 'iPhone', 'iPod','Android'];
      for ( var i = 0; i < iDevice.length ; i++ ) {
          if( navigator.platform === iDevice[i] ){ iOS = true; break; }
      }
      return navigator.userAgent.match(/(iPhone|iPod|iPad|Android)/i) || iOS
  }
  $scope.is_mobile= isMobile()

   
}]);
