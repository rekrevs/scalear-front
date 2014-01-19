'use strict';

angular.module('scalearAngularApp')
  .controller('newCourseCtrl',['$scope','Course','$state','$window', '$log', function ($scope, Course,$state, $window, $log) {
		$window.scrollTo(0, 0);
		$scope.submitting=false;

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
                $scope.submitting=true;
 				$scope.course.start_date.setMinutes($scope.course.start_date.getMinutes() + 120);
			Course.create({course:$scope.course, "import":$scope.import_from},
			function(data){
                $scope.submitting=false;
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
                $scope.submitting=false;
				$scope.server_errors=response.data.errors
			}
		);
		}else{
			$scope.submitted=true
		}
		}

        $scope.$watch('current_lang', function(newval, oldval){
            if(newval!=oldval)
                $scope.server_errors={}
        });
 }]);
