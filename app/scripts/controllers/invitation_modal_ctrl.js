'use strict';

angular.module('scalearAngularApp')
  .controller('InvitationModalCtrl',['$state','$scope','$modalInstance','Course','$window','Home','SharedItem', function ($state, $scope, $modalInstance, Course, $window, Home, SharedItem) {
	$window.scrollTo(0, 0);
	
	$scope.invitations={}
	$scope.form={}  	
	
//	Home.getInvitations({},function(response){
//		$scope.invitations=response.invitations
//	})

    Home.getNotifications({},function(response){
        $scope.invitations=response.invitations
        $scope.shared_items = JSON.parse(response.shared_items)
    })
	
  $scope.accept = function (id) {
  	
  	Home.acceptCourse({},{invitation : id},function(data){
  		$modalInstance.close(data.course_id);	
  	}, function(response){
  		$modalInstance.dismiss('cancel');
  		//$scope.form.processing=false;
  		//$scope.form.server_error=response.data.errors.join();
  	})
  		
  };

  $scope.reject = function (id) {
    Home.rejectCourse({},{invitation : id},function(data){
  		$modalInstance.close();	
  	}, function(response){
  		$modalInstance.dismiss('cancel');
  		//$scope.form.processing=false;
  		//$scope.form.server_error=response.data.errors.join();
  	})
  };
  
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.import_new = function(){
      $modalInstance.dismiss('cancel');
      $state.go("new_course")
  }

}]);