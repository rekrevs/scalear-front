'use strict';

angular.module('scalearAngularApp')
  .controller('InvitationModalCtrl',['$state','$scope','$modalInstance','Course','$window','Home','$rootScope','SharedItem', function ($state, $scope, $modalInstance, Course, $window, Home, $rootScope, SharedItem) {

	$window.scrollTo(0, 0);
	
	$scope.invitations={}
	$scope.form={}  	
	
//	Home.getInvitations({},function(response){
//		$scope.invitations=response.invitations
//	})

    Home.getNotifications({},function(response){
        $scope.invitations=response.invitations
        $scope.shared_items = JSON.parse(response.shared_items)
        console.log($scope.shared_items)
    })
	
  $scope.acceptInvitation = function (id) {
  	
  	Home.acceptCourse({},{invitation : id},function(data){
  		$modalInstance.close(data.course_id);	
      $rootScope.current_user.invitations = data.invitations
  	}, function(response){
  		$modalInstance.dismiss('cancel');
  		//$scope.form.processing=false;
  		//$scope.form.server_error=response.data.errors.join();
  	})
  		
  };

  $scope.rejectInvitation = function (id) {
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

  // $scope.import_new = function(){
  //     $modalInstance.dismiss('cancel');
  //     $state.go("new_course")
  // }

  $scope.acceptShare=function(item){
    SharedItem.accpetShared(
      {shared_item_id: item.id},{},
      function(data){
        $modalInstance.close();
        $rootScope.current_user.shared = data.shared_items
        $state.go('show_shared')
      },
      function(){}
    )
  }

  $scope.rejectShare=function(item){
    SharedItem.rejectShared(
      {shared_item_id: item.id},{},
      function(data){
        $modalInstance.close();
        $rootScope.current_user.shared = data.shared_items
      },
      function(){}
    )
  }

}]);