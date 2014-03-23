'use strict';

angular.module('scalearAngularApp')
  .controller('courseListCtrl',['$scope','Course','$stateParams', '$translate','$log','$window','Page', function ($scope, Course,$stateParams, $translate, $log, $window,Page) {

  	$log.debug("in course list")
    $window.scrollTo(0, 0);
    Page.setTitle('Courses')
  		Course.index({},
			function(data){
				$log.debug(data)
				$scope.courses = data
			},
			function(){
				//alert("Could not get courses, please check your internet connection")
			})

  		$scope.column='name'

  		$scope.deleteCourse=function(course){
  			// can't pass index.. cause its not reliable with filter. so instead take course, and get its position in scope.courses
  			//if(confirm($translate("courses.you_sure_delete_course", {course:course.name}))){
	  			Course.destroy({course_id: course.id},{},
	  				function(response){
	  					$scope.courses.splice($scope.courses.indexOf(course), 1)
	  					$log.debug(response)
	  				},
	  				function(){
	  					//alert("Could not delete course, please check your internet connection")
	  				})
	  	//	}
  		}

  		$scope.filterTeacher=function(teacher_name){
  			$scope.filtered_teacher= teacher_name;
  		}

      $scope.removeFilter=function(){
        $scope.filtered_teacher = ''
      }

  		$scope.order=function(column_name){
  			$scope.column = column_name
  			$scope.is_reverse = !$scope.is_reverse
  		}
  		
  }]);
