'use strict';

angular.module('scalearAngularApp')
  .controller('studentCourseInformationCtrl', ['$scope','$stateParams','Course', function ($scope, $stateParams, Course){
        Course.show(
        	{course_id: $stateParams.course_id},
        	function(data){
        		$scope.course = data.course;
        	},
        	function(){}
    	)
  }]);
