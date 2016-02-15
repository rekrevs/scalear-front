'use strict';

angular.module('scalearAngularApp')
  .controller('LoginCtrl',['$state','$scope','$rootScope', 'scalear_api','$window','$log', '$translate', 'User', 'Page', 'ErrorHandler','ngDialog','MobileDetector','Saml','$location','SWAMID','$cookieStore', function ($state, $scope, $rootScope,scalear_api, $window, $log, $translate, User, Page, ErrorHandler,ngDialog, MobileDetector, Saml, $location, SWAMID, $cookieStore) {
  
  $scope.user={}
  Page.setTitle('navigation.login')
  $('#user_email').select()

  $scope.swamid_list = SWAMID.list()

  console.log($cookieStore.get("saml_provider"))

  $scope.previous_provider = $cookieStore.get("saml_provider")

  // console.log($location)
  // $scope.saml = $location.$$search
  // console.log($scope.saml)
  // if(Object.keys($scope.saml).length){
  //   // $scope.saml=JSON.parse($state.params.attributes)
  //   ngDialog.open({
  //     template: 'samlSignup',
  //     className: 'ngdialog-theme-default ngdialog-theme-custom',
  //     scope: $scope
  //     // preCloseCallback: function(value) {
  //     //   next(data)
  //     // }
  //   });
  // }


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

  $scope.join=function(){
    $state.go("signup",  { input1 : $scope.user.email, input2: $scope.user.password})
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

  $scope.samlLogin=function(idp){
    $cookieStore.put('saml_provider', idp)
    // Saml.Login(
    //   {idp: idp.entityID},
    //   function(resp){
    //      $(resp.saml_url).appendTo('body').submit();
    //   }, 
    //   function(){

    //   }
    // )
  }

}]);
