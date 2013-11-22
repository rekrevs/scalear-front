'use strict';

angular.module('scalearAngularApp')
  .controller('StudentEnrollModalCtrl',['$scope','$modalInstance','Course', function ($scope, $modalInstance, Course) {
	
	$scope.enrollment={}
	$scope.form={}  	
	
  $scope.ok = function () {
  	console.log($scope);
  	if($scope.form.key.$valid)
  	{
  	$scope.form.processing=true;
  	Course.enroll({},{unique_identifier : $scope.enrollment.key},function(data){
  		$scope.form.processing=false;
  		if(data.status=="fail")
  			$scope.form.server_error=data.message
  		else
  			$modalInstance.close($scope.enrollment.key);	
  	})
  		
  	}else
  		$scope.form.submitted=true	
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

}]);