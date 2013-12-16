'use strict';

angular.module('scalearAngularApp')
  .controller('inclassCtrl', ['$scope', '$stateParams', '$location', 'Course','$window', function ($scope, $stateParams, $location, Course, $window) {
    $window.scrollTo(0, 0);
    
    Course.getCourse(
    	{course_id:$stateParams.course_id},
		function(data){
			$scope.modules = data.groups
			console.log($stateParams)
		}, 
		function(){

		}
	);

	$scope.getLocation= function(){
		var str = $location.path();
	 	var res = str.match(/.*\/modules\/(\d+)/);
	 	return res?res[1]:0
	}

  }]);
