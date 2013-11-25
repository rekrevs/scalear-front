'use strict';

angular.module('scalearAngularApp')
  .controller('studentLecturesCtrl', ['$scope','Course','$stateParams', function ($scope, Course, $stateParams) {
//    console.log($scope);
    $scope.open_id="-1";
	$scope.open={};
	$scope.oneAtATime = true;
	
    Course.getCourseware(
    	{course_id: $stateParams.course_id}, function(data){
    	 $scope.course= JSON.parse(data.course);
    	 $scope.today = data.today;	
    	 console.log($scope.course);
    	}
    	
    );
    
    
  }]);
