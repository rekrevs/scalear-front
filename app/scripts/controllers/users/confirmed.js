'use strict';

angular.module('scalearAngularApp')
  .controller('UsersConfirmedCtrl', ['$scope', '$rootScope', 'User', 'UserSession', '$state', '$interval', 'Page', 'scalear_api', '$translate', '$log', 'URLInformation','$window', function($scope, $rootScope, User, UserSession, $state, $interval, Page, scalear_api, $translate, $log, URLInformation, $window) {
    $scope.user_email = $state.params.type
    $scope.remaining = 5;
    $scope.show_ending = false;
    $scope.privacy_approved = false;
    $scope.player = {};
    $scope.player.controls = {};
    $scope.player.events = {};
    $scope.agree_to_terms = false;
    Page.setTitle('Welcome to ScalableLearning');
    $rootScope.subheader_message = $translate.instant("intro.title")
    $scope.student_or_teacher = null
    UserSession.getCurrentUser()
      .then(function(user) {
        $scope.current_user = user
      })

    $scope.player.events.onEnd = function() {
        $scope.show_ending = true
        $interval(function() {
          $scope.remaining--;
          if($scope.remaining == 0) {
            $scope.watchedIntro();
          }
        }, 1000, 5)
    }

    $scope.set_student_or_teacher = function(value) {
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
          if(URLInformation.hasEnroll()) {
            $window.location.href = URLInformation.getEnrollLink()
            URLInformation.clearEnrollLink()
          }
          $state.go('course_list');
        }
      );
    }

  }]);
