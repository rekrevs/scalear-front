'use strict';

angular.module('scalearAngularApp')
  .controller('ReportTechnicalCtrl', ['$scope', '$timeout','$modalInstance', '$log', '$rootScope', 'Home', '$translate', '$stateParams', '$location', '$interval', '$state', 'UserSession','scalear_api', function($scope, $timeout,$modalInstance, $log, $rootScope, Home, $translate, $stateParams, $location, $interval, $state, UserSession,scalear_api) {

    $scope.issue_types = [{ value: "system", text: $translate.instant('feedback.system') }]
    if($state.includes("course")) {
      $scope.issue_types.push({ value: "content", text: $translate.instant('feedback.course_content') })
    }
    $scope.selected_type = $scope.issue_types[0];
    $scope.is_ios =  $rootScope.is_ios
    UserSession.getCurrentUser()
      .then(function(user) {
        $scope.current_user = user
      })
    $scope.inputClick = function () {
      $timeout(function () {
        $('#tech_data').focus()
      })
    }
    $scope.issue_scalable_website_types = [
      { value: "none", text: $translate.instant('feedback.none') },
      { value: "no_access", text: $translate.instant('feedback.no_access') },
      { value: "question_before_sign", text: $translate.instant('feedback.question_before_sign') },
      { value: "request_feature", text: $translate.instant('feedback.request_feature') },
      { value: "no_email", text: $translate.instant('feedback.no_email') },
      { value: "confused", text: $translate.instant('feedback.confused') },
      { value: "bug", text: $translate.instant('feedback.bug') },
      { value: "other", text: $translate.instant('feedback.other') }
    ]
    $scope.selected_scalable_website_type = $scope.issue_scalable_website_types[0];

    $scope.hide_issue_scalable_website_types = false;
    $scope.hide_content = false;

    $scope.selectedScalableWebsiteTypeEnable = function(type) {
      $scope.hide_issue_scalable_website_types = !(type["value"] == "system");
    }
    $scope.sendTechnical = function(type, website_type, data, user) {
      if(!user) {
        user = { name: $scope.current_user.full_name, email: $scope.current_user.email }
      }
      if($scope.current_user || (user && (user.name && user.email))) {
        $scope.no_text = null;
        if(data) {
          $scope.no_text = null;
          $scope.sending_technical = true;
          $log.debug($scope.selected_type.value)
          $log.debug($scope.technical_data)
          var userAgent = navigator.userAgent.split(';').join(",");          
          Home.technicalProblem({
              name: user.name,
              email: user.email,
              issue_type: type.value,
              issue_website_type: website_type.text,
              course: $stateParams.course_id || -1,
              module: $stateParams.module_id || -1,
              lecture: $stateParams.lecture_id || -1,
              quiz: $stateParams.quiz_id || -1,
              url: $location.url(),
              problem: data,
              lang: $rootScope.current_lang,
              agent: userAgent,
              version: scalear_api.version
            },
            function() {
              angular.element('.reveal-modal').css('height', 'auto');
              $scope.hide_content = true;
              $scope.technical_data = null;
              $interval(function() {
                $modalInstance.close();
              }, 3000, 1)

            }
          );
        } else
          $scope.no_text = $translate.instant('feedback.provide_desciption')
      } else
        $scope.no_text = $translate.instant('feedback.provide_email_name')
    };

    $scope.cancel = function() {
      $scope.selected_type = $scope.issue_types[0];
      $scope.selected_scalable_website_type = $scope.issue_scalable_website_types[0];
      $scope.technical_data = null
      $scope.no_text = null
      $modalInstance.dismiss('cancel');
    };

  }]);
