'use strict';

angular.module('scalearAngularApp')
  .controller('InvitationModalCtrl',['$scope','$modalInstance','Course','$window','Home', function ($scope, $modalInstance, Course, $window, Home) {
	$window.scrollTo(0, 0);
	
	$scope.invitations={}
	$scope.form={}  	
	
	Home.getInvitations({},function(response){
		$scope.invitations=response.invitations
	})
	
  $scope.accept = function (id) {
  	
  	Home.acceptCourse({},{invitation : id},function(data){
  		$modalInstance.close(data.course_id);	
  	}, function(){
  		$modalInstance.dismiss('cancel');
  		//$scope.form.processing=false;
  		//$scope.form.server_error=response.data.errors.join();
  	})
  		
  };

  $scope.reject = function (id) {
    Home.rejectCourse({},{invitation : id},function(){
  		$modalInstance.close();	
  	}, function(){
  		$modalInstance.dismiss('cancel');
  		//$scope.form.processing=false;
  		//$scope.form.server_error=response.data.errors.join();
  	})
  };
  
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

}]);