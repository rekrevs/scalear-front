'use strict';

angular.module('scalearAngularApp')
  .controller('LoginCtrl',['$state','$scope','$rootScope', 'scalear_api','$location','$log', '$translate', 'User', 'Page', 'ErrorHandler','ngDialog', function ($state, $scope, $rootScope,scalear_api, $location, $log, $translate, User, Page, ErrorHandler,ngDialog) {
  
  $scope.user={}
  Page.setTitle('navigation.login')
  $('#user_email').select()
  var dialog_options={
              template: 'mobileSupport',
              className: 'ngdialog-theme-default ngdialog-theme-custom',
              preCloseCallback: function(value) {
                next()
              }
            }
  $scope.login = function(){
    $scope.sending = true;
    User.signIn({},
      {"user":$scope.user}, 
      function(data){
        $log.debug("login success")
        $scope.sending = false;
        $rootScope.$broadcast("get_current_courses")
        if($scope.is_mobile[0]){
          if(data.roles[0].id != 2 &&  $scope.is_mobile[0] == "iPad")
            ngDialog.open({
              template: 'mobileSupport',
              className: 'ngdialog-theme-default ngdialog-theme-custom',
              preCloseCallback: function(value) {
                next(data)
              }
            });
          else if($scope.is_mobile[0] != "iPad")
             ngDialog.open({
              template: 'mobileSupport',
              className: 'ngdialog-theme-default ngdialog-theme-custom',
              preCloseCallback: function(value) {
                next(data)
              }
            });
        }
        else        
          next(data)
      },function(){
        $scope.sending = false;
    });
  }

  var next=function(user){
    if(!user.info_complete){
      $state.go("edit_account");
      $rootScope.show_alert = "error";
      ErrorHandler.showMessage($translate("controller_msg.update_account_information"), 'errorMessage', 8000);
    }
    else
      $state.go("dashboard");
  }

  var isMobile=function(){
      // var iOS = false,
      //     iDevice = ['iPad', 'iPhone', 'iPod','Android'];
      // for ( var i = 0; i < iDevice.length ; i++ ) {
      //     if( navigator.platform === iDevice[i] ){ iOS = true; break; }
      // }
      return navigator.userAgent.match(/(iPhone|iPod|iPad|Android)/i) || []
  }
  $scope.is_mobile= isMobile()

   
}]);
