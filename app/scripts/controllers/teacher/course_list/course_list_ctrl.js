'use strict';

angular.module('scalearAngularApp')
  .controller('courseListCtrl',['$scope','Course','$stateParams', '$translate','$log','$window','Page','$rootScope', function ($scope, Course,$stateParams, $translate, $log, $window,Page, $rootScope) {

    Page.setTitle('navigation.courses')
    Page.startTour();
    $rootScope.subheader_message = "All Courses"

		$scope.column='name'

    $scope.$on('course_filter_update',function(ev, filter){
      $scope.filterChoice = filter
    })

    $scope.$on('get_all_courses', function(){
      getAllCourses()
    })

    // $rootScope.$broadcast("get_all_courses")
    var getAllCourses=function(){
        $scope.courses=null
          Course.index({},
              function(data){
                  $scope.courses = data
              }
          )           
    }

		$scope.deleteCourse=function(course){
			Course.destroy({course_id: course.id},{},
				function(response){
					$scope.courses.splice($scope.courses.indexOf(course), 1)
				},
				function(){})
		}

    $scope.unenrollCourse=function(course){
      Course.unenroll({course_id: course.id},{},
        function(response){
          $scope.courses.splice($scope.courses.indexOf(course), 1)
        },
        function(){})
    }

		$scope.filterTeacher=function(teacher_name, teacher_email){
			$scope.filtered_teacher_name = teacher_name
      $scope.filtered_teacher = teacher_email;

		}

    $scope.removeFilter=function(){
      $scope.filtered_teacher = ''
    }

		$scope.order=function(column_name){
			$scope.column = column_name
			$scope.is_reverse = !$scope.is_reverse
		}

    getAllCourses()
  		
}]);
