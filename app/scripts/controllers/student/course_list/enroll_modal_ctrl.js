'use strict';

angular.module('scalearAngularApp')
  .controller('StudentEnrollModalCtrl',['$rootScope','$scope','$modalInstance','Course','$log','$window','$state','$timeout', function ($rootScope, $scope, $modalInstance, Course, $log, $window,$state, $timeout) {

	$window.scrollTo(0, 0);
	$scope.enrollment={}
	$scope.form={}
  $timeout(function(){
    $('#enrollkey_field').select()
  },1000)

  $scope.enrollStudent = function () {
  	$log.debug($scope);
  	if($scope.form.key.$valid){
  	 $scope.form.processing=true;
    	Course.enroll({},
        {unique_identifier : $scope.enrollment.key},
        function(data){
          $log.debug(data)
      		$scope.form.processing=false;
          $state.go("course.course_information", {course_id: data.course.id,new_enroll:true} )
          $rootScope.$broadcast('Course:get_current_courses')
      		$modalInstance.close($scope.enrollment.key);
      	}, function(response){
      		$scope.form.processing=false;
      		$scope.form.server_error=response.data.errors.join();
      	})
  	}else
  		$scope.form.submitted=true
  };

  $scope.cancelEnroll = function () {
    $modalInstance.dismiss('cancel');
  };

}]);
