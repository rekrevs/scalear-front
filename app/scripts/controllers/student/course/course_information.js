'use strict';

angular.module('scalearAngularApp')
  .controller('StudentCourseCourseInformationCtrl', ['$scope','course', function ($scope, course){
        course.start_date = new Date(course.start_date);
        $scope.data = course.data;
        console.log(course.data);
  }]);
