'use strict';

angular.module('scalearAngularApp')
  .controller('newCourseCtrl', ['$rootScope', '$scope', 'Course', '$state', '$window', '$log', 'Page', 'ScalearUtils', '$translate', '$filter','CourseModel', function($rootScope, $scope, Course, $state, $window, $log, Page, ScalearUtils, $translate, $filter,CourseModel) {
    $window.scrollTo(0, 0);
    Page.setTitle('navigation.new_course')
    $rootScope.subheader_message = $translate("navigation.new_course")
    $scope.submitting = false;
    $scope.course = {}

    CourseModel.getUserOtherCourses().then(function(data) {
        $scope.importing = data.importing;
      })

    $scope.timezones = ScalearUtils.listTimezones()
    $scope.course.time_zone = $scope.timezones[11] //GMT+0
    $scope.course.start_date = new Date()
    $scope.import_from = null

    $scope.addImportInformation = function() {
      var splitter_text = "[" + $translate("navigation.copied_from")
      var desc_temp = "",
        pre_temp = "",
        desc_temp_empty = "",
        pre_temp_empty = ""
      var course_info = $scope.import_from //$filter("filter")($scope.importing,{id:$scope.import_from},true)
      if(course_info) {
        var course_name_text = "\n" + splitter_text + " " + course_info.name + " :]\n"
        if(course_info.description) {
          desc_temp = course_name_text + course_info.description
        }
        desc_temp_empty = course_info.description
        if(course_info.prerequisites) {
          pre_temp = course_name_text + course_info.prerequisites
        }
        pre_temp_empty = course_info.prerequisites
      }
      if($scope.course.description) {
        $scope.course.description = $scope.course.description.split(splitter_text)[0].trim() + desc_temp
      } else {
        $scope.course.description = desc_temp_empty
      }
      if($scope.course.prerequisites) {
        $scope.course.prerequisites = $scope.course.prerequisites.split(splitter_text)[0].trim() + pre_temp
      } else {
        $scope.course.prerequisites = pre_temp_empty
      }
    }

    $scope.unselectCourse = function() {
      $scope.import_from = null
      $scope.addImportInformation()
    }

    $scope.toggleRegistration = function() {
      if(!$scope.disable_registration_checked) {
        $scope.course.disable_registration = null
      }
    }

    $scope.createCourse = function() {
      if($scope.form.$valid) {
        var import_from_id = $scope.import_from ? $scope.import_from.id : null
        CourseModel.create($scope.course, import_from_id)
          .then(function(data) {
            console.log(data)
            $scope.submitting = false;
            $scope.submitted = false;
            if(data.importing) {
              $state.go("course_list")
            } else {
              $state.go("course.course_editor", { "course_id": data.course.id })
            }
          })
          .catch(function(response) {
            $scope.submitting = false;
            $scope.server_errors = response.data.errors
          })
      } else {
        $scope.submitted = true
      }
    }
  }]);
