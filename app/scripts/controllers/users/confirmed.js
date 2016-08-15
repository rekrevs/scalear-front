'use strict';

angular.module('scalearAngularApp')
  .controller('UsersConfirmedCtrl', ['$scope', '$rootScope', 'User', 'UserSession', '$state', '$interval', 'Page', 'scalear_api', '$translate', '$log', 'ngDialog', function($scope, $rootScope, User, UserSession, $state, $interval, Page, scalear_api, $translate, $log, ngDialog) {

    $scope.remaining = 5;
    $scope.privacy_approved
    $scope.player = {}
    $scope.player.controls = {}
    $scope.player.events = {}
    Page.setTitle('Welcome to ScalableLearning');
    $rootScope.subheader_message = $translate("intro.title")
    UserSession.getCurrentUser()
      .then(function(user) {
        $scope.current_user = user
      })
    $scope.intro_url = scalear_api.teacher_welcome_video

    $scope.player.events.onEnd = function() {
      if($scope.privacy_approved) {
        $interval(function() {
          $scope.remaining--;
          if($scope.remaining == 0) {
            $scope.watchedIntro();
          }
        }, 1000, 5)
      }
    }

    $scope.watchedIntro = function() {
      var completion = {}
      completion['intro_watched'] = true;
      User.updateCompletionWizard({ id: $scope.current_user.id }, { completion_wizard: completion },
        function() {
          $scope.current_user.completion_wizard = {}
          $scope.current_user.completion_wizard.intro_watched = true;
          $state.go('course_list');
        }
      );
    }
    $scope.privacyPopover = function() {
      ngDialog.openConfirm({
          template: '/views/privacy_popover.html',
          className: 'ngdialog-theme-default dialogwidth800',
          showClose: false,
          scope: $scope
        })
        .then(function(value) {
          $scope.privacy_approved = true
        }, function(reason) {
          $rootScope.busy_loading = true;
          UserSession.logout().then(function() {
            $state.go("login");
            $rootScope.busy_loading = false;
          });
        });
    }


    $scope.privacyPopover();


  }]);
