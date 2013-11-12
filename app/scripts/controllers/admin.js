'use strict';

angular.module('scalearAngularApp')
  .controller('AdminCtrl', function ($scope, Course) {
  	console.log("in admin")
  		Course.index({},
			function(data){
				console.log(data)
				$scope.courses = data
			},
			function(){
				alert("Could not get courses, please check your internet connection")
			})

  		$scope.column='name'

  		$scope.deleteCourse=function(course){
  			if(confirm("Are you sure you want to delete module?")){
	  			Course.destroy({course_id: course.id},
	  				function(response){
	  					console.log(response)
	  				},
	  				function(){
	  					alert("Could not delete course, please check your internet connection")
	  				})
	  		}
  		}

  		$scope.filterTeacher=function(teacher_name){
  			$scope.filtered_teacher= teacher_name;
  		}

  		$scope.order=function(column_name){
  			$scope.column = column_name
  			$scope.is_reverse = !$scope.is_reverse
  		}
  });
