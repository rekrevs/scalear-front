'use strict';

angular.module('scalearAngularApp')
  .controller('UsersConfirmedCtrl', ['$scope', '$rootScope', 'User', 'UserSession', '$state', '$interval', 'Page', 'scalear_api', '$translate', '$log', 'ngDialog','URLInformation','$window', function($scope, $rootScope, User, UserSession, $state, $interval, Page, scalear_api, $translate, $log, ngDialog, URLInformation, $window) {
    $scope.user_email = $state.params.type
    // if($state.params.type=="teacher"){$scope.intro_url = scalear_api.teacher_welcome_video}
    // else{$scope.intro_url = scalear_api.student_welcom_video}

    $scope.remaining = 5;
    $scope.show_ending = false
    $scope.privacy_approved
    $scope.player = {}
    $scope.player.controls = {}
    $scope.player.events = {}
    Page.setTitle('Welcome to ScalableLearning');
    $rootScope.subheader_message = $translate.instant("intro.title")
    $scope.student_or_teacher = null 
    UserSession.getCurrentUser()
      .then(function(user) {
        $scope.current_user = user
        $scope.privacyPopover();
      })

    $scope.player.events.onEnd = function() {
        $scope.show_ending = true
      // if($scope.privacy_approved) {
        $interval(function() {
          $scope.remaining--;
          if($scope.remaining == 0) {

            $scope.watchedIntro();
          }
        }, 1000, 5)
      // }
    }

    $scope.set_student_or_teacher = function(value) {
      // console.log(value)
      $scope.student_or_teacher = true
      if(value == "S"){
        $scope.student = true
        $scope.intro_url = scalear_api.student_welcom_video
      }
      else{
        $scope.student = false
        $scope.intro_url = scalear_api.teacher_welcome_video
      }
    }
    $scope.watchedIntro = function() {
      var completion = {}
      completion['intro_watched'] = true;

      User.updateCompletionWizard({ id: $scope.current_user.id }, { completion_wizard: completion },
        function() {
          UserSession.allowRefetchOfUser()
            // $scope.current_user.completion_wizard = {}
            // $scope.current_user.completion_wizard.intro_watched = true;
          if(URLInformation.hasEnroll()) {
            $window.location.href = URLInformation.getEnrollLink()
            URLInformation.clearEnrollLink()
          }
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





  }]);
