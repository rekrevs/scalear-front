'use strict';

angular.module('scalearAngularApp')
  .controller('CoursesEnrollCtrl', ['$scope', 'Course', '$state', '$stateParams', '$rootScope', '$log', 'ErrorHandler', function($scope, Course, $state, $stateParams, $rootScope, $log, ErrorHandler) {

    Course.enroll({}, { unique_identifier: $stateParams.id },
      function(data) {
        $scope.go_to_course(data)
      },
      function(response) {
        $scope.go_to_course(response, true)
      })

    $scope.go_to_course = function(obj, error){
      error? ($state.go("course.course_information", { course_id: obj.data.course.id })):($state.go("course.course_information", { course_id: obj.course.id }))
      $rootScope.$broadcast('Course:get_current_courses')
    }
  }]);
