'use strict';

angular.module('scalearAngularApp')
  .controller('StudentEnrollModalCtrl',['$scope','$modalInstance','Course','$log','$window', function ($scope, $modalInstance, Course, $log, $window) {

	$window.scrollTo(0, 0);
	$scope.enrollment={}
	$scope.form={}  	
	
  $scope.ok = function () {
  	$log.debug($scope);
  	if($scope.form.key.$valid)
  	{
  	$scope.form.processing=true;
  	Course.enroll({},{unique_identifier : $scope.enrollment.key},function(data){
  		$scope.form.processing=false;
  		$modalInstance.close($scope.enrollment.key);	
  	}, function(response){
  		$scope.form.processing=false;
  		$scope.form.server_error=response.data.errors.join();
  	})
  		
  	}else
  		$scope.form.submitted=true	
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

}]);