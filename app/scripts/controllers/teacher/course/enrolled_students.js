'use strict';

var app = angular.module('scalearAngularApp')
  app.controller('TeacherCourseEnrolledStudentsCtrl', ['$scope', '$http','$location', '$state', 'Course', 'students', 'batchEmailService','$stateParams', function ($scope, $http, $location, $state, Course, students, batchEmailService, $stateParams) {
        
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
            var answer = confirm('Are you sure that you want to remove this student?');
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
            var i=0;
            $scope.selected.forEach(function(email){
                $scope.emails[i] = email;
                i++;
            });
            $state.go('course.send_emails');
        }
        $scope.selected = new Array();
        $scope.select = function(id, email){
          if($scope.selected[id] == email){
              console.log('should deselect');
              $scope.selected[id] = ',';
              var i=0;
              $scope.selected.forEach(function(e){
                  $scope.emails[i] = e;
                  i++;
              });
          }
          else{
              console.log('should select');
              $scope.selected[id] = email;
              var i=0;
              $scope.selected.forEach(function(email){
                  $scope.emails[i] = email;
                  i++;
              });
          }
        }
        $scope.selectAll = function(){
            var checkboxes = angular.element('.checks');
            for(var i=0; i<checkboxes.length; i++){
                $scope.selected[checkboxes[i].id] = checkboxes[i].value;
            }
            console.log($scope.selected);
            var i=0;
            $scope.selected.forEach(function(email){
                $scope.emails[i] = email;
                i++;
            });
        }
        $scope.deSelectAll = function(){
            var checkboxes = angular.element('.checks');
            for(var i=0; i<checkboxes.length; i++){
                $scope.selected[checkboxes[i].id] = ',';
            }
            console.log($scope.selected);
            var i=0;
            $scope.selected.forEach(function(email){
                $scope.emails[i] = email;
                i++;
            });
        }
  }]);


