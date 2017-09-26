/* istanbul ignore next */ 
'use strict';

angular.module('scalearAngularApp')
  .controller('UsersConfirmationShowCtrl', ['$scope', 'User', '$state', '$stateParams', '$timeout', '$rootScope', 'UserSession', 'Page', '$log', '$modal', function($scope, User, $state, $stateParams, $timeout, $rootScope, UserSession, Page, $log, $modal) {
    Page.setTitle('account.confirm_account')
    $scope.user = {}
    $scope.sending = true
    $log.debug('showing confirmation ')
    $log.debug($stateParams)

    UserSession.getCurrentUser().catch(function() {
      User.show_confirmation({ confirmation_token: $stateParams.confirmation_token },
        function(resp) {
          $scope.sending = false;
          if(resp.data == "confirmed"){
            $scope.user_email = resp.user_email
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
          else if(resp.data == "invalid"){
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
                  $modalInstance.dismiss('can1cel');
                }
              }]
            })
          }
          else{
            $timeout(function() {
              $state.go("confirmed")
              // $state.go("privacy_confirm")
              // $rootScope.$emit('$stateChangeStart', { name: 'confirmed' }, {}, { name: 'show_confirmation' })
            }, 2500)
          }
        },
        function(data) {
          $scope.sending = false;
          $scope.user.errors = data.data;
        })
    })

    $scope.$watch('current_lang', function(newval, oldval) {
      if(newval != oldval)
        delete $scope.user.errors
    });
  }]);
