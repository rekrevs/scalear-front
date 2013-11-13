'use strict';

angular.module('scalearAngularApp')
  .controller('TeacherCourseEnrolledStudentsCtrl', ['$scope', '$http', 'Course', 'students', function ($scope, $http, Course, students) {
        console.log(students.data.course);
        console.log(students.data.students);
        $scope.data = students.data.students;
        $scope.course = students.data.course;
//        console.log($scope.data)
  }]);
