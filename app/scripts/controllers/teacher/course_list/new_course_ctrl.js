'use strict';

angular.module('scalearAngularApp')
  .controller('newCourseCtrl',['$rootScope','$scope','Course','$state','$window', '$log','Page','scalear_utils','$translate', function ($rootScope,$scope, Course,$state, $window, $log,Page, scalear_utils, $translate) {
		$window.scrollTo(0, 0);
		Page.setTitle('navigation.new_course')
		$rootScope.subheader_message = $translate("navigation.new_course")
		$scope.submitting=false;
		$scope.course={}
		Course.newCourse(
			function(data){
				//$scope.course=data.course;
				$scope.importing=data.importing;
				$scope.timezones=scalear_utils.listTimezones()
				$scope.course.time_zone = $scope.timezones[11] //GMT+0
				$scope.course.start_date = new Date()
				// var zone = $scope.course.start_date.getTimezoneOffset()/60 * -1
				// for(var tz in $scope.timezones){
				// 	if(parseInt($scope.timezones[tz].offset) == zone){
				// 		$scope.course.time_zone = $scope.timezones[tz]
				// 		break;
				// 	}
				// }
				$scope.import_from=""				

			}
		);
		
		$scope.createCourse = function(){
			if($scope.form.$valid)
 			{
 				var modified_course = angular.copy($scope.course)
                $scope.submitting=true;
                var d = new Date()
 				modified_course.start_date.setMinutes(modified_course.start_date.getMinutes() - d.getTimezoneOffset());
          		modified_course.time_zone = modified_course.time_zone.name;
        		Course.create({course:modified_course, "import":$scope.import_from},
					function(data){
		                $scope.submitting=false;
						$scope.submitted=false;
						if(data.importing){
							$state.go("course_list")
						}
						else{
							$state.go("course.course_editor",{"course_id":data.course.id})
						}
						$rootScope.$broadcast('get_current_courses')
					},function(response){
						//server error must handle.
		                $scope.submitting=false;
						$scope.server_errors=response.data.errors
					}
				)
			}
			else{
				$scope.submitted=true
			}
		}
 }]);
