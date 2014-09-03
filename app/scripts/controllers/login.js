'use strict';

angular.module('scalearAngularApp')
  .controller('LoginCtrl',['$state','$scope','$rootScope', 'scalear_api','$location','$log', '$translate', 'User', 'Page', 'ErrorHandler', '$timeout', function ($state, $scope, $rootScope,scalear_api, $location, $log, $translate, User, Page, ErrorHandler, $timeout) {
   $scope.user={}
   Page.setTitle('navigation.login')
   $scope.login = function(){
    $scope.sending = true;
        User.sign_in({},{"user":$scope.user}, function(data){
          $scope.sending = false;
            //console.log("signed_in");
            $rootScope.iscollapsed = true;
            $rootScope.$broadcast("get_all_courses")
            console.log('here\'s what i got')
            console.log(data)
            if(!data.info_complete){
              $state.go("edit_account");
              $rootScope.show_alert = "error";
              ErrorHandler.showMessage($translate("controller_msg.update_account_information"), 'errorMessage', 8000);
              $timeout(function() {
                  $rootScope.show_alert = "";
              }, 7000);
            }
            else{
              $state.go("dashboard");
            }
        },function(){
          $scope.sending = false;
            //console.log("failed")
        });

       $scope.singleModel = 1;
   }
   
  }]);
