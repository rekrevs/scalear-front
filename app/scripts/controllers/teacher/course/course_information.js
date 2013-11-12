'use strict';

angular.module('scalearAngularApp')
  .controller('TeacherCourseCourseInformationCtrl', ['$scope','course', function ($scope, course) {
        $scope.data = course.data;
        console.log(course.data);
  }]);
