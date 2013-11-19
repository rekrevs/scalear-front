'use strict';

angular.module('scalearAngularApp')
  .controller('courseListCtrl',['$scope','Course', function ($scope, Course) {

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
  			// can't pass index.. cause its not reliable with filter. so instead take course, and get its position in scope.courses
  			if(confirm("Are you sure you want to delete "+course.name+"?")){
	  			Course.destroy({course_id: course.id},
	  				function(response){
	  					$scope.courses.splice($scope.courses.indexOf(course), 1)
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
  		
  }]);
