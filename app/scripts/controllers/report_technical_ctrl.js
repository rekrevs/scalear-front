'use strict';

angular.module('scalearAngularApp')
  .controller('ReportTechnicalCtrl',['$scope','$modalInstance','$log','$window', '$rootScope', 'Home', '$translate', '$stateParams', '$location', '$interval', function ($scope, $modalInstance, $log, $window, $rootScope, Home, $translate, $stateParams, $location, $interval) {

  $scope.issue_types=[{value:"system", text:$translate('feedback.system')}, {value:"content", text:$translate('feedback.course_content')}]//"ScalableLearning Website", "Course Content"]
  $scope.selected_type = $scope.issue_types[0];

  $scope.issue_scalable_website_types=[{value:"none", text:$translate('feedback.none')},{value:"no_access", text:$translate('feedback.no_access')},{value:"question_before_sign", text:$translate('feedback.question_before_sign')},{value:"request_feature", text:$translate('feedback.request_feature')},{value:"billing_question", text:$translate('feedback.billing_question')},{value:"no_email", text:$translate('feedback.no_email')},{value:"confused", text:$translate('feedback.confused')},{value:"bug", text:$translate('feedback.bug')},{value:"other", text:$translate('feedback.other')}]
  $scope.selected_scalable_website_type = $scope.issue_scalable_website_types[0];

  $scope.hide_issue_scalable_website_types = false;
	$scope.hide_content = false;
  $scope.selected_scalable_website_type_enable = function(type){
    if(type["value"] == "system"){
        $scope.hide_issue_scalable_website_types = false;
    }
    else{
      $scope.hide_issue_scalable_website_types = true;
    }

  }
  $scope.send_technical = function(type, website_type, data, user) {
      if(!user){
        user = {name: $rootScope.current_user.full_name, email: $rootScope.current_user.email}
      }
      if($rootScope.current_user || (user && (user.name && user.email))){
        $scope.no_text = null;
        if(data){
          $scope.no_text = null;
          $scope.sending_technical = true;
          $log.debug($scope.selected_type.value)
          $log.debug($scope.technical_data)
          Home.technicalProblem({
                  name: user.name,
                  email: user.email,
                  issue_type: type.value,
                  issue_website_type: website_type.value,
                  course: $stateParams.course_id || -1,
                  module: $stateParams.module_id || -1,
                  lecture: $stateParams.lecture_id || -1,
                  quiz: $stateParams.quiz_id || -1,
                  url: $location.url(),
                  problem: data,
                  lang: $rootScope.current_lang,
                  agent: navigator.userAgent
              },
              function() {
                angular.element('.reveal-modal').css('height', 'auto');
                  $scope.hide_content = true;
                  $scope.technical_data = null;                                    
                  $interval(function(){
                    $modalInstance.close();
                  }, 3000, 1)
                  
              }
          );
        }
        else
            $scope.no_text = $translate('feedback.provide_desciption')
      }
      else
          $scope.no_text = $translate('feedback.provide_email_name')
  };

  $scope.cancel = function () {
    $scope.selected_type=$scope.issue_types[0];
    $scope.selected_scalable_website_type=$scope.issue_scalable_website_types[0];
    $scope.technical_data =null
    $scope.no_text=null
    $modalInstance.dismiss('cancel');
  };

}]);