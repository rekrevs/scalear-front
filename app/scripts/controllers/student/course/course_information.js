'use strict';

angular.module('scalearAngularApp')
  .controller('studentCourseInformationCtrl', ['$scope','$stateParams','Course','$window', function ($scope, $stateParams, Course, $window){
        $window.scrollTo(0, 0);
        Course.show(
        	{course_id: $stateParams.course_id},
        	function(data){
        		$scope.course = data.course;
        	},
        	function(){}
    	)
  }]);
