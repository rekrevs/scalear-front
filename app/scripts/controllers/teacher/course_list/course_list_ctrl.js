'use strict';

angular.module('scalearAngularApp')
  .controller('courseListCtrl',['$scope','Course','$stateParams', '$translate','$log','$window','Page','$rootScope', function ($scope, Course,$stateParams, $translate, $log, $window,Page, $rootScope) {

    Page.setTitle('navigation.courses')
    Page.startTour();
    $rootScope.subheader_message = $translate("navigation.courses")

		$scope.column='name'
    $scope.course_filter = '!!'
    var getAllCourses=function(){
      $scope.courses=null
      Course.index({},
      function(data){
        $scope.courses = data
        $log.debug($scope.courses)
        $scope.courses.forEach(function(course){
          if(!course.ended){
            $scope.course_filter = false
            return 
          }
        })
      })           
    }

    var removeFromCourseList=function(course){
      $scope.courses.splice($scope.courses.indexOf(course), 1)
      var course_index = $scope.current_courses.map(function(x){
        return x.id
      })
      .indexOf(course.id)
      if(course_index > -1)
        $scope.current_courses.splice(course_index, 1)
    }

		$scope.deleteCourse=function(course){
			Course.destroy({course_id: course.id},{},
				function(){
					removeFromCourseList(course)
				},
				function(){})
		}

    $scope.unenrollCourse=function(course){
      Course.unenroll({course_id: course.id},{},
        function(){
          removeFromCourseList(course)
        },
        function(){})
    }

		$scope.filterTeacher=function(teacher_name, teacher_email){
			$scope.filtered_teacher_name = teacher_name
      $scope.filtered_teacher = teacher_email;
		}

    $scope.filterCourse=function(val){
      $scope.course_filter = val
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
