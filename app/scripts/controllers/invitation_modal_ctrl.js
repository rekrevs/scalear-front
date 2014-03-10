'use strict';

angular.module('scalearAngularApp')
  .controller('InvitationModalCtrl',['$scope','$modalInstance','Course','$window','Home','$rootScope', function ($scope, $modalInstance, Course, $window, Home, $rootScope) {
	$window.scrollTo(0, 0);
	
	$scope.invitations={}
	$scope.form={}  	
	
	Home.getInvitations({},function(response){
		$scope.invitations=response.invitations
	})
	
  $scope.accept = function (id) {
  	
  	Home.acceptCourse({},{invitation : id},function(data){
  		$modalInstance.close(data.course_id);	
      $rootScope.current_user.invitations = data.invitations
  	}, function(response){
  		$modalInstance.dismiss('cancel');
  		//$scope.form.processing=false;
  		//$scope.form.server_error=response.data.errors.join();
  	})
  		
  };

  $scope.reject = function (id) {
    Home.rejectCourse({},{invitation : id},
    function(data){
  		$modalInstance.close();
      $rootScope.current_user.invitations = data.invitations	
  	}, 
    function(response){
  		$modalInstance.dismiss('cancel');
  		//$scope.form.processing=false;
  		//$scope.form.server_error=response.data.errors.join();
  	})
  };
  
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

}]);