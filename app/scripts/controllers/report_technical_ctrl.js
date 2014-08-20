'use strict';

angular.module('scalearAngularApp')
  .controller('ReportTechnicalCtrl',['$scope','$modalInstance','$log','$window', '$rootScope', 'Home', '$translate', '$stateParams', '$location', '$interval', function ($scope, $modalInstance, $log, $window, $rootScope, Home, $translate, $stateParams, $location, $interval) {

  $scope.issue_types=[{value:"system", text:$translate('head.system')}, {value:"content", text:$translate('head.course_content')}]//"ScalableLearning Website", "Course Content"]
  $scope.selected_type = $scope.issue_types[0];
	$scope.hide_content = false;
  // $scope.ok = function () {
  // 	$log.debug($scope);
  // 	if($scope.form.key.$valid)
  // 	{
  // 	$scope.form.processing=true;
  // 	Course.enroll({},{unique_identifier : $scope.enrollment.key},function(data){
  // 		$scope.form.processing=false;
  // 		$modalInstance.close($scope.enrollment.key);	
  // 	}, function(response){
  // 		$scope.form.processing=false;
  // 		$scope.form.server_error=response.data.errors.join();
  // 	})
  		
  // 	}else
  // 		$scope.form.submitted=true	
  // };
  $scope.send_technical = function(type, data, user) {
      $log.debug("in sending");
      // if(!$rootScope.current_user){
          // var user_name = angular.element('#report_name').val();
          // var user_email = angular.element('#report_email').val();
      // }
      if(!user){
        user = {name: $rootScope.current_user.full_name, email: $rootScope.current_user.email}
      }
      if($rootScope.current_user || (user && (user.name && user.email))){
        $scope.no_text = null;
        if(data){
          $scope.no_text = null;
          $scope.sending_technical = true;
          console.log($scope.selected_type.value)
          console.log($scope.technical_data)
          Home.technicalProblem({
                  name: user.name,
                  email: user.email,
                  issue_type: type.value,
                  course: $stateParams.course_id || -1,
                  module: $stateParams.module_id || -1,
                  lecture: $stateParams.lecture_id || -1,
                  quiz: $stateParams.quiz_id || -1,
                  url: $location.url(),
                  problem: data,
                  lang: $rootScope.current_lang,
                  agent: navigator.userAgent
              },
              function(data) {
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
    $scope.technical_data =null
    $scope.no_text=null
    $modalInstance.dismiss('cancel');
  };

}]);