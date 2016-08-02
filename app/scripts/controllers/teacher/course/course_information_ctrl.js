'use strict';

angular.module('scalearAngularApp')
  .controller('teacherCourseInformationCtrl', ['$scope', '$stateParams', 'Course', '$q', '$translate', '$log', '$window', 'Page', 'ScalearUtils', 'ContentNavigator', '$rootScope', 'ErrorHandler', '$interval', '$location', 'CourseModel', function($scope, $stateParams, Course, $q, $translate, $log, $window, Page, ScalearUtils, ContentNavigator, $rootScope, ErrorHandler, $interval, $location, CourseModel) {

    $window.scrollTo(0, 0);
    $scope.in_delete = false;
    $scope.toggle_message = 'courses.information.button.remove_teacher'
    $scope.formData = {};
    $scope.course = CourseModel.getCourse()
    $scope.formData.disable_registration_checked = !!$scope.course.disable_registration
    $scope.roles = [{ value: 3, text: 'courses.information.professor' }, { value: 4, text: 'courses.information.ta' }];
    Page.setTitle($translate('navigation.information') + ': ' + $scope.course.name);
    $scope.timezones = ScalearUtils.listTimezones()
    $scope.enrollment_url = $location.absUrl().split('courses')[0] + "courses/enroll?id=" + $scope.course.unique_identifier

    Page.startTour()
    ContentNavigator.close()
    setupTimezone()

    function setupTimezone() {
      $scope.timezones.forEach(function(zone) {
        if(zone.name == $scope.course.time_zone) {
          $scope.course.time_zone = zone
          return
        }
      })
    }

    $scope.updateCourse = function(data, type) {
      if(data && data instanceof Date) {
        data.setMinutes(data.getMinutes() - data.getTimezoneOffset());
        $scope.course[type] = data
      }
      checkRegistrationField()
      CourseModel.update($scope.course)
    }

    function checkRegistrationField(){
      if(!$scope.formData.disable_registration_checked) {
        $scope.course.disable_registration = null
      } else if(!$scope.course.disable_registration) {
        $scope.course.disable_registration = $scope.course.end_date
      }
    }

    $scope.toggleRegistrationCheck = function() {
      checkRegistrationField()
      $scope.updateCourse()
    }

    $scope.validateCourse = function(column, data) {
      var deferred = $q.defer();
      var course = {}
      course[column] = data;
      CourseModel.validate(course)
        .then(function() {
          deferred.resolve()
        })
        .catch(function(resp) {
          if(resp.status == 422)
            deferred.resolve(resp.data.errors.join());
          else
            deferred.reject('Server Error');
        })
      return deferred.promise;
    };

    $scope.exportCourse = function() {
      CourseModel.exportCourse()
      .then(function(response) {
        if(response.notice) {
          ErrorHandler.showMessage($translate("error_message.export_course"), 'errorMessage', 4000, 'success');
        }
      })
    }

    //teachers part
    function getTeachers() {
      CourseModel.getTeachers().then(function(value) {
        $scope.teachers = value.data;
        $scope.new_teacher = {};
      })
    }

    $scope.toggleDelete = function() {
      $scope.in_delete = !$scope.in_delete
      $scope.toggle_message = $scope.in_delete ? 'courses.information.done' : 'courses.information.button.remove_teacher'
    }

    $scope.addNewTeacher = function() {
      $scope.teacher_forum = true
    }

    $scope.updateTeacher = function(teacher) {
      CourseModel.updateTeacher(teacher)
    }

    $scope.removeNewTeacher = function() {
      $scope.new_teacher = null
      $scope.teacher_forum = false
    }

    $scope.removeTeacher = function(teacher) {
      CourseModel.deleteTeacher(teacher).then(function() {
        var index = $scope.teachers.indexOf(teacher)
        if(index !=-1)
          $scope.teachers.splice(index, 1);
      })
    }

    $scope.saveTeacher = function() {
      CourseModel.saveNewTeacher($scope.new_teacher )
      .then(function(){
         getTeachers();
          $scope.teacher_forum = false
      })
      .catch(function(value){
        $scope.new_teacher.errors = value.data.errors
      })
    }

    $scope.animateCopy = function() {
      $('#enrollment_key').animate({ color: "#428bca" }, "fast").delay(400).animate({ color: "black" }, "fast");
    }

    getTeachers();

  }]);
