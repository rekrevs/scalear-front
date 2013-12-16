'use strict';

angular.module('scalearAngularApp')
  .controller('StudentCourseCourseInformationCtrl', ['$scope','course','$window', function ($scope, course, $window){
        $window.scrollTo(0, 0);
        course.start_date = new Date(course.start_date);
        $scope.data = course.data;
        console.log(course.data);
  }]);
