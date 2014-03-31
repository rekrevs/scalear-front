'use strict';

angular.module('scalearAngularApp')
  .controller('ConfirmDeleteCtrl',['$scope','$modalInstance','User','$log','$window','$rootScope','$state', function ($scope, $modalInstance, User, $log, $window,$rootScope, $state) {

	$window.scrollTo(0, 0);
	$scope.enrollment={}
	$scope.form={}  	
	
  $scope.ok = function () {

  	if($scope.form.key.$valid)
  	{
  	$scope.form.processing=true;
    User.delete_account({password:$scope.enrollment.key}, {}, function() {
        // //console.log("deleted ");
        $rootScope.current_user = null;
        $scope.form.processing=false;
        $modalInstance.close();
        $state.go('login')
    }, function(response) {
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