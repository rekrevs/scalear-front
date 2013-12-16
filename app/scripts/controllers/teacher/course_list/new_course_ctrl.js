'use strict';

angular.module('scalearAngularApp')
  .controller('newCourseCtrl',['$scope','Course','$state','$window', function ($scope, Course,$state, $window) {
		$window.scrollTo(0, 0);
		
		$scope.course={}
		Course.newCourse(
			function(data){
				//$scope.course=data.course;
				$scope.importing=data.importing;
				$scope.timezones=data.timezones;
				$scope.import_from=""				
				$scope.course.start_date = new Date()

			},function(response){
				
			}
		);
		
		$scope.createCourse = function(){
			if($scope.form.$valid)
 			{
			Course.create({course:$scope.course, "import":$scope.import_from},
			function(data){
				$scope.submitted=false;
				if(data.importing==true){
					//$(window).scrollTop(0);
					$state.go("course_list")
				}
				else{
					//$(window).scrollTop(0);
					$state.go("course.course_editor",{"course_id":data.course.id})
				}
			},function(response){
				//server error must handle.
				$scope.server_errors=response.data.errors
			}
		);
		}else{
			$scope.submitted=true
		}
		}
 }]);
