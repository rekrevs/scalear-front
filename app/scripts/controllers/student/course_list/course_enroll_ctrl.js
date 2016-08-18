'use strict';

angular.module('scalearAngularApp')
  .controller('CoursesEnrollCtrl', ['$scope', 'Course', '$state', '$stateParams', '$rootScope', '$log', 'ErrorHandler', function($scope, Course, $state, $stateParams, $rootScope, $log, ErrorHandler) {

    Course.enroll({}, { unique_identifier: $stateParams.id },
      function(data) {
        $state.go("course.course_information", { course_id: data.course.id })
        $rootScope.$broadcast('Course:get_current_courses')
      },
      function(response) {
        if(response.status == 422){
          ErrorHandler.showMessage(response.data.errors, 'errorMessage', 4000, "error");
          $state.go("course_list")
        }
      })


  }]);
