'use strict';

var app = angular.module('scalearAngularApp')

  app.controller('enrolledStudentsCtrl', ['$scope', '$state', 'Course', 'batchEmailService','$stateParams', '$translate','$log','$window', function ($scope, $state, Course, batchEmailService, $stateParams, $translate, $log, $window) {
 
        $log.debug("in enrolled students");

        $window.scrollTo(0, 0);
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


        $scope.removeStudent = function(student){
            $log.debug(student)
            var answer = confirm($translate('courses.you_sure_delete_student', {student: student.name}));
            if(answer){
            	student.removing=true;
                Course.remove_student(
                    {
                        course_id:$stateParams.course_id ,
                        student: student.id
                    },
                    {},
                    function(){
                        $scope.data.splice($scope.data.indexOf(student), 1)
                     },
                    function(){
                    	student.removing=false;
                        $log.debug(value);
                    })

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
              $log.debug('should deselect');
              $scope.selected[id] = ',';
              var i=0;
              $scope.selected.forEach(function(e){
                  $scope.emails[i] = e;
                  i++;
              });
          }
          else{
              $log.debug('should select');
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
            $log.debug($scope.selected);
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
            $log.debug($scope.selected+' => selected');
            var i=0;
            $scope.selected.forEach(function(email){
                $scope.emails[i] = email;
                i++;
            });
            $log.debug($scope.emails+' => emails');

        }
  }]);


