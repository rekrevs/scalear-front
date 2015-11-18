'use strict';

angular.module('scalearAngularApp')
  .controller('LoginCtrl',['$state','$scope','$rootScope', 'scalear_api','$location','$log', '$translate', 'User', 'Page', 'ErrorHandler','ngDialog','MobileDetector', function ($state, $scope, $rootScope,scalear_api, $location, $log, $translate, User, Page, ErrorHandler,ngDialog, MobileDetector) {
  
  $scope.user={}
  Page.setTitle('navigation.login')
  $('#user_email').select()

  $scope.login = function(){
    $scope.sending = true;
    User.signIn({},
      {"user":$scope.user}, 
      function(data){
        $log.debug("login success")
        $scope.sending = false;
        $rootScope.$broadcast("get_current_courses") 
        $scope.is_mobile= MobileDetector.isMobile()
        if( $scope.is_mobile && ((data.roles[0].id != 2 && MobileDetector.isTablet()) ||  MobileDetector.isPhone)){
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
      ErrorHandler.showMessage($translate("error_message.update_account_information"), 'errorMessage', 8000);
    }
    else
      $state.go("dashboard");
  }

  // var isMobile=function(){
  //     // var iOS = false,
  //     //     iDevice = ['iPad', 'iPhone', 'iPod','Android'];
  //     // for ( var i = 0; i < iDevice.length ; i++ ) {
  //     //     if( navigator.platform === iDevice[i] ){ iOS = true; break; }
  //     // }
  //     return navigator.userAgent.match(/(iPhone|iPod|iPad|Android)/i) || []
  // }
  

   
}]);
