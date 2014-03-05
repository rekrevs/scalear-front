'use strict';

angular.module('scalearAngularApp')
  .controller('navigationCtrl', ['$scope', '$state','$stateParams', 'Course', '$log', function ($scope, $state, $stateParams, Course, $log) {
  	$scope.current_course_id= $stateParams.course_id;
  	Course.show(
  		{course_id: $stateParams.course_id},
  		function(data){
  			$scope.$parent.course_information = data.course
  		},
  		function(){}
	)
  	// $scope.course_information=course_information.data.course;
  	$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){ 
    	$scope.current_state= $state;
   	})

    $scope.url_with_protocol = function(url)
    {
        if(url)
            return url.match(/^http/)? url: 'http://'+url;
        else
            return url;
    }
  	
  }]);
