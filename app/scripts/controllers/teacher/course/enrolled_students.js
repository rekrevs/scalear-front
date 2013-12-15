'use strict';

var app = angular.module('scalearAngularApp')
  app.controller('TeacherCourseEnrolledStudentsCtrl', ['$scope', '$http','$location', '$state', 'Course', 'students', 'batchEmailService','$stateParams', function ($scope, $http, $location, $state, Course, students, batchEmailService, $stateParams) {
        
        $scope.data = students.data.students;
        $scope.course = students.data.course;
        $scope.emails=[];
        batchEmailService.setEmails($scope.emails)

        $scope.removeStudent = function(student){
            console.log(student)
            var answer = confirm('Are you sure that you want to remove this student, '+student.name+'?');
            if(answer){
                //console.log('pressed yes')
                student.removing=true;
                Course.remove_student(
                    {
                        course_id:$stateParams.course_id ,
                        student: student.id
                    },
                    {},
                    function(){
                       // $scope.data.splice(index, 1);
                        $scope.data.splice($scope.data.indexOf(student), 1)
                     },
                    function(){
                    	student.removing=false;
                        console.log(value);
                    })
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


