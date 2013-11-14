'use strict';

angular.module('scalearAngularApp')
  .controller('TeacherCourseEnrolledStudentsCtrl', ['$scope', '$http','$location', 'Course', 'students', function ($scope, $http, $location, Course, students) {
        console.log(students.data.course);
        console.log(students.data.students);
        $scope.data = students.data.students;
        $scope.course = students.data.course;

        $scope.emails=[];

        $scope.removeStudent = function(student){
            console.log(student)
            var answer = confirm('Are you sure that you want to remove this student?');
            if(answer){
                console.log('pressed yes')
                Course.remove_student({student: student})
            }
        }

        $scope.go = function ( path ) {
            console.log($location.path())

        };
//        console.log($scope.data);
  }])
    .service('studentsService', function(){
        var students = $scope.emails
        return {
            getStudents: function () {
                return students;
            }
        };
    })
