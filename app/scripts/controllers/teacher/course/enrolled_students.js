'use strict';

var app = angular.module('scalearAngularApp')
  app.controller('enrolledStudentsCtrl', ['$scope', '$state', 'Course', 'batchEmailService','$stateParams', '$translate', function ($scope, $state, Course, batchEmailService, $stateParams, $translate) {
        
        console.log("in enrolled students");
		    console.log($stateParams);

        $scope.emails=[];
        batchEmailService.setEmails($scope.emails)
        $scope.loading_students = true
        Course.getEnrolledStudents(
          {course_id: $stateParams.course_id},
          function(students){
            $scope.students = students
            $scope.loading_students = false
          },
          function(){}
        )

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
                        $scope.students.splice(index, 1);
                     },
                    function(){
                        console.log(value);
                    }
                )
            }
        }

        $scope.emailSingle=function(id, email){
          $scope.deSelectAll()
          $scope.select(id, email)
          $scope.emailForm()
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
            console.log($scope.selected+' => selected');
            var i=0;
            $scope.selected.forEach(function(email){
                $scope.emails[i] = email;
                i++;
            });
            console.log($scope.emails+' => emails');

        }
  }]);


