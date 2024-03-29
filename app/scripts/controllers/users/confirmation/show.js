/* istanbul ignore next */ 
'use strict';

angular.module('scalearAngularApp')
  .controller('UsersConfirmationShowCtrl', ['$scope', 'User', '$state', '$stateParams', '$timeout', '$rootScope', 'UserSession', 'Page', '$log', '$modal', 'ErrorHandler', '$translate', 'Token',function($scope, User, $state, $stateParams, $timeout, $rootScope, UserSession, Page, $log, $modal, ErrorHandler, $translate, Token) {
    Page.setTitle('account.confirm_account')
    $scope.user = {}
    $scope.sending = true
   
    $scope.sending = false;
    if($stateParams['account_confirmation_success'] == "true"){
      $scope.user_email = $stateParams.uid;
      $modal.open({
        template: '<style>.reveal-modal{height:auto;overflow: hidden;}</style>'+
        "<center><span translate='account.account_confirmed' translate-values='{ email: user_email}'></span><span translate>global.please</span> <a class='tiny' ng-click='goTo()' translate>account.login</a> <span translate>account.start_using</span>ScalableLearning.<br><Small translate>account.go_to_support</small></center>",
        scope: $scope,
        controller:['$modalInstance', function($modalInstance) {                
          $scope.goTo = function() {
            $state.go('login',{email: $scope.user_email})
            $modalInstance.dismiss('cancel');
          }              
        }]
      })
    }
    else if($stateParams['account_confirmation_success'] == "false"){
      $modal.open({
        template: '<style>.reveal-modal{height:auto;overflow: hidden;}</style>'+
        "<center><span translate>account.invalid_confirmation</span><br>"+
        "<span translate>account.already_confirmation</span> <a class='tiny' ng-click='goTo()' translate>account.click_here</a> <span translate>global.to</span> <span translate>navigation.login</span>.<br>"+
        "<span translate>account.new_confirmation</span> <a ui-sref='new_confirmation' ng-click='closeModal()' translate>account.click_here</a>.<br>"+
        "<Small translate>account.go_to_support</small></center>",
        scope: $scope,
        controller:['$modalInstance', function($modalInstance) {                
          $scope.goTo = function() {
            $state.go('login',{email: $scope.user_email})
            $modalInstance.dismiss('cancel');
          }
          $scope.closeModal = function() {
            // $state.go('login',{email: $scope.user_email})
            $modalInstance.dismiss('cancel');
          }
        }]
      })
    }
    else {
      Token.setToken($stateParams);
      $timeout(function() {
        $state.go("course_list")
      }, 1000)            
    }
        
    // })

    $scope.$watch('current_lang', function(newval, oldval) {
      if(newval != oldval)
        delete $scope.user.errors
    });
  }]);
