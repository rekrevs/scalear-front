'use strict';

angular.module('scalearAngularApp')
  .controller('inclassCtrl', ['$scope', '$stateParams', '$location', 'Course','$log', '$window','Page', function ($scope, $stateParams, $location, Course, $log, $window,Page) {

    $window.scrollTo(0, 0);
    Page.setTitle('head.in_class')
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
