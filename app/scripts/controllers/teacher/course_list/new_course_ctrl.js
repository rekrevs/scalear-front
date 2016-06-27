'use strict';

angular.module('scalearAngularApp')
.controller('newCourseCtrl', ['$rootScope', '$scope', 'Course', '$state', '$window', '$log', 'Page', 'scalear_utils', '$translate', '$filter', function($rootScope, $scope, Course, $state, $window, $log, Page, scalear_utils, $translate, $filter) {
    $window.scrollTo(0, 0);
    Page.setTitle('navigation.new_course')
    $rootScope.subheader_message = $translate("navigation.new_course")
    $scope.submitting = false;
    $scope.course = {}
    Course.newCourse(
      function(data) {
        $scope.importing = data.importing;
        console.log(data.importing)
        $scope.timezones = scalear_utils.listTimezones()
        $scope.course.time_zone = $scope.timezones[11] //GMT+0
        $scope.course.start_date = new Date()
        $scope.import_from = null
      }
    );
    $scope.add_import_information = function() {
      var splitter_text = "[" + $translate("navigation.copied_from")
      var desc_temp = "",
        pre_temp = "",
        desc_temp_empty = "",
        pre_temp_empty = ""
      var course_info = $scope.import_from //$filter("filter")($scope.importing,{id:$scope.import_from},true)
      if(course_info) {
        var course_name_text = "\n" + splitter_text + " " + course_info.name + " :]\n"
        if(course_info.description)
          desc_temp = course_name_text + course_info.description
        desc_temp_empty = course_info.description
        if(course_info.prerequisites)
          pre_temp = course_name_text + course_info.prerequisites
        pre_temp_empty = course_info.prerequisites
      }
      if($scope.course.description)
        $scope.course.description = $scope.course.description.split(splitter_text)[0].trim() + desc_temp
      else
        $scope.course.description = desc_temp_empty
      if($scope.course.prerequisites)
        $scope.course.prerequisites = $scope.course.prerequisites.split(splitter_text)[0].trim() + pre_temp
      else
        $scope.course.prerequisites = pre_temp_empty
    }

    $scope.unselect_course = function() {
      $scope.import_from = null
      $scope.add_import_information()
    }

	$scope.enable_disable_registration = function(){
		if (!$scope.disable_registration_checked) {
			$scope.course.disable_registration = null
		};
	}

    $scope.createCourse = function() {

    console.log($scope.form.$valid)
    	
      if($scope.form.$valid) {
        var modified_course = angular.copy($scope.course)
        $scope.submitting = true;
        var d = new Date()
        modified_course.start_date.setMinutes(modified_course.start_date.getMinutes() - d.getTimezoneOffset());
        modified_course.time_zone = modified_course.time_zone.name;
        Course.create({ course: modified_course, "import": $scope.import_from? $scope.import_from.id : null ,"disable_registration_checked":($scope.disable_registration_checked)},
          function(data) {
            $scope.submitting = false;
            $scope.submitted = false;
            if(data.importing) {
              $state.go("course_list")
            } else {
              $state.go("course.course_editor", { "course_id": data.course.id })
            }
            $rootScope.$broadcast('get_current_courses')
          },
          function(response) {
            $scope.submitting = false;
            $scope.server_errors = response.data.errors
          }
        )
      } else {
        $scope.submitted = true
      }
    }
  }]);
