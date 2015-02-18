'use strict';

angular.module('scalearAngularApp')
  .controller('courseListCtrl',['$scope','Course','$stateParams', '$translate','$log','$window','Page','$rootScope', function ($scope, Course,$stateParams, $translate, $log, $window,Page, $rootScope) {

    Page.setTitle('navigation.courses')
    Page.startTour();
    $rootScope.subheader_message = $translate("navigation.courses")

		$scope.column='name'
    $scope.filterChoice = false
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

    var deleteCourseLocally=function(course){
      $scope.courses.splice($scope.courses.indexOf(course), 1)
      var course_index = $scope.current_courses.map(function(x){
        return course.id
      }).indexOf(course.id)
      if(course_index > -1)
        $scope.current_courses.splice(course_index, 1)
    }

		$scope.deleteCourse=function(course){
			Course.destroy({course_id: course.id},{},
				function(response){
					deleteCourseLocally(course)
				},
				function(){})
		}

    $scope.unenrollCourse=function(course){
      Course.unenroll({course_id: course.id},{},
        function(response){
          deleteCourseLocally(course)
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
