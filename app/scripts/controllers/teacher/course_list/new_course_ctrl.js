'use strict';

angular.module('scalearAngularApp')
  .controller('newCourseCtrl',['$rootScope','$scope','Course','$state','$window', '$log','Page','scalear_utils', function ($rootScope,$scope, Course,$state, $window, $log,Page, scalear_utils) {
		$window.scrollTo(0, 0);
		Page.setTitle('courses.new_course')
		$rootScope.subheader_message = "New Course"
		$scope.submitting=false;
		$scope.course={}
		Course.newCourse(
			function(data){
				//$scope.course=data.course;
				$scope.importing=data.importing;
				$scope.timezones=scalear_utils.listTimezones()
				console.log($scope.timezones)
				$scope.course.time_zone = $scope.timezones[0]
				var zone = new Date().getTimezoneOffset()/60 * -1
				for(var tz in $scope.timezones){
					if(parseInt($scope.timezones[tz].offset) == zone){
						$scope.course.time_zone = $scope.timezones[tz]
						break;
					}
				}
				$scope.import_from=""				
				$scope.course.start_date = new Date()

			},function(response){
				
			}
		);
		
		$scope.createCourse = function(){
			if($scope.form.$valid)
 			{
 				var modified_course = angular.copy($scope.course)
                $scope.submitting=true;
                var d = new Date()
 				modified_course.start_date.setMinutes(modified_course.start_date.getMinutes() - d.getTimezoneOffset());

                // if($scope.import_from){
                //     console.log($scope.import_from);
                //     $state.go("import_from",{"shared_item":$scope.import_from})
                // }
                // else{
          		modified_course.time_zone = modified_course.time_zone.name;
        		Course.create({course:modified_course, "import":$scope.import_from},
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
						$rootScope.$broadcast('get_all_courses')
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

        $scope.$watch('current_lang', function(newval, oldval){
            if(newval!=oldval)
                $scope.server_errors={}
        });
 }]);
