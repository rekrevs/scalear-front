'use strict';

angular.module('scalearAngularApp')
  .controller('inclassCtrl', ['$scope', '$stateParams', '$location', 'Course','$log', function ($scope, $stateParams, $location, Course, $log) {
    
    Course.getCourse(
    	{course_id:$stateParams.course_id},
		function(data){
			$scope.modules = data.groups
			$log.debug($stateParams)
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
