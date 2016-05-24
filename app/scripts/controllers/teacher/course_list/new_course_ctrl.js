'use strict';

angular.module('scalearAngularApp')
  .controller('newCourseCtrl',['$rootScope','$scope','Course','$state','$window', '$log','Page','scalear_utils','$translate','$filter', function ($rootScope,$scope, Course,$state, $window, $log,Page, scalear_utils, $translate,$filter) {
		$window.scrollTo(0, 0);
		Page.setTitle('navigation.new_course')
		$rootScope.subheader_message = $translate("navigation.new_course")
		$scope.submitting=false;
		$scope.course={}
		Course.newCourse(
			function(data){
				$scope.importing=data.importing;
				console.log(data.importing)
				$scope.timezones=scalear_utils.listTimezones()
				$scope.course.time_zone = $scope.timezones[11] //GMT+0
				$scope.course.start_date = new Date()
				$scope.import_from=""
			}
		);
		
		$scope.add_import_information = function(){
			var course_info = $filter("filter")($scope.importing,{id:$scope.import_from},true)
			if (course_info){
				if (course_info[0].description){
					$scope.course.description =  ($scope.course.description || "")+"\n"  + (("[Copied from "+course_info[0].name + " :]\n"+course_info[0].description) 	)
				}
				if (course_info[0].prerequisites){
					$scope.course.prerequisites =  ($scope.course.prerequisites||"") +"\n" + (("[Copied from "+course_info[0].name + " :]\n"+course_info[0].prerequisites)) 
				}
			}		 
		}

		$scope.createCourse = function(){
			if($scope.form.$valid){
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
