'use strict';

angular.module('scalearAngularApp')
  .controller('courseListCtrl',['$scope','Course','$stateParams', '$translate','$log','$window','Page','$rootScope', function ($scope, Course,$stateParams, $translate, $log, $window,Page, $rootScope) {

  	$log.debug("in course list")
    $window.scrollTo(0, 0);
    Page.setTitle('navigation.courses')
    Page.startTour();
    $rootScope.subheader_message = "All Courses"
  	// 	Course.index({},
			// function(data){
			// 	$log.debug(data)
			// 	$scope.courses = data
			// },
			// function(){
			// 	//alert("Could not get courses, please check your internet connection")
			// })


  		$scope.column='name'

      $scope.$on('course_filter_update',function(ev, filter){
        $scope.filterChoice = filter
      })

      $rootScope.$broadcast("get_all_courses")

  		$scope.deleteCourse=function(course){
  			Course.destroy({course_id: course.id},{},
  				function(response){
  					$scope.courses.splice($scope.courses.indexOf(course), 1)
  					$log.debug(response)
  				},
  				function(){})
  		}

      $scope.unenrollCourse=function(course){
        Course.unenroll({course_id: course.id},{},
          function(response){
            $scope.courses.splice($scope.courses.indexOf(course), 1)
            $log.debug(response)
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
  		
  }]);
