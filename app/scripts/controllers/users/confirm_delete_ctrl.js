'use strict';

angular.module('scalearAngularApp')
  .controller('ConfirmDeleteCtrl',['$scope','$modalInstance','User','$log','$window','$rootScope','$state','user_new', function ($scope, $modalInstance, User, $log, $window,$rootScope, $state,user_new) {

	$window.scrollTo(0, 0);
	$scope.form={}
  $scope.user = user_new	
  $scope.deleteAccount = function () {
  	if($scope.user.saml || $scope.form.key.$valid){
    	$scope.form.processing=true;
      User.delete_account({password:$scope.user.pass}, {}, function() {
          $rootScope.current_user = null;
          $scope.form.processing=false;
          $modalInstance.close();
          $state.go('login')
      }, function(response) {
        $scope.form.processing=false;
        $scope.form.server_error=response.data.errors.join();
      })  		
  	}
    else
  		$scope.form.submitted=true	
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

}]);