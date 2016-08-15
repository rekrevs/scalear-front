'use strict';

angular.module('scalearAngularApp')
  .controller('UsersConfirmationShowCtrl', ['$scope', 'User', '$state', '$stateParams', '$timeout', '$rootScope', 'UserSession', 'Page', '$log', function($scope, User, $state, $stateParams, $timeout, $rootScope, UserSession, Page, $log) {
    Page.setTitle('confirmations.confirm_account')
    $scope.user = {}
    $scope.sending = true
    $log.debug('showing confirmation ')
    $log.debug($stateParams)

    UserSession.getCurrentUser().catch(function() {
      User.show_confirmation({ confirmation_token: $stateParams.confirmation_token },
        function() {
          $timeout(function() {
            $scope.sending = false;
            $state.go("confirmed")
            // $rootScope.$emit('$stateChangeStart', { name: 'confirmed' }, {}, { name: 'show_confirmation' })
          }, 2500)
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
