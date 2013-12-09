'use strict';

var app = angular.module('scalearAngularApp')
  app.controller('TeacherCourseEnrolledStudentsCtrl', ['$scope', '$http','$location', '$state', 'Course', 'students', 'batchEmailService','$stateParams', '$translate', function ($scope, $http, $location, $state, Course, students, batchEmailService, $stateParams, $translate) {
        
        console.log("in enrolled students");
		console.log($stateParams);

        console.log(students.data.course);
        console.log(students.data.students);
        
        $scope.data = students.data.students;
        $scope.course = students.data.course;

        $scope.emails=[];
        batchEmailService.setEmails($scope.emails)

        $scope.removeStudent = function(student, index){
            console.log(student)
            var answer = confirm($translate('courses.you_sure_delete_student'));
            if(answer){
                Course.remove_student(
                    {
                        course_id:$stateParams.course_id ,
                        student: student
                    },
                    {},
                    function(){
                        $scope.data.splice(index, 1);
                     },
                    function(){
                        console.log(value);
                    }
                )
            }
        }

        $scope.emailForm = function(){
            $state.go('course.send_emails');
        }

        $scope.selectAll = function(){
            $scope.checked = true;
            var checkboxes = angular.element('.checks');
            for(var i=0; i<checkboxes.length; i++){
                $scope.emails[i] = checkboxes[i].value;
                console.log(checkboxes[i].value);
            }
        }

        $scope.deSelectAll = function(){
            $scope.checked = false;
            for(var i=0; i< $scope.emails.length; i++){
                $scope.emails[i] = ',';
            }
            console.log($scope.checked);
        }
  }]);


