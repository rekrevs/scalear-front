'use strict';

var app = angular.module('scalearAngularApp')

  app.controller('enrolledStudentsCtrl', ['$scope', '$state', 'Course', 'batchEmailService','$stateParams', '$translate','$log','$window','Page', '$filter', function ($scope, $state, Course, batchEmailService, $stateParams, $translate, $log, $window, Page, $filter) {
 
        $log.debug("in enrolled students");
        Page.setTitle('Enrolled Students')
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
//            var answer = confirm($translate('courses.you_sure_delete_student', {student: student.name}));
            //if(answer){
            	student.removing=true;
                Course.remove_student(
                    {
                        course_id:$stateParams.course_id ,
                        student: student.id
                    },
                    {},
                    function(){
                        $scope.students.splice($scope.students.indexOf(student), 1)
                     },
                    function(){
                    	student.removing=false;
                        $log.debug(value);
                    })

           // }
        }

        $scope.emailSingle=function(student){
          $scope.deSelectAll()
          $scope.toggleSelect(student)
          $scope.emailForm()
        }

        $scope.emailForm = function(){
            var selected_students = $filter('filter')($scope.students, {'checked': true}, true)
            selected_students.forEach(function(student){
              $scope.emails.push(student.email);
            })
            console.log($scope.emails.length)
            $state.go('course.send_emails');
        }
        $scope.selected = []
        $scope.toggleSelect = function(student){
          student.checked = !student.checked
        }
        $scope.selectAll = function(){
          var filtered_students = $filter('filter')($scope.students, $scope.searchText)
          // console.log('filtered students')
          // console.log(filtered_students.length)
          filtered_students.forEach(function(item){
            console.log('1')
            $filter('filter')($scope.students, {'id': item.id}, true)[0].checked = true;

          })
        }
        $scope.deSelectAll = function(){
          var filtered_students = $filter('filter')($scope.students, $scope.searchText)
          filtered_students.forEach(function(item){
            $filter('filter')($scope.students, {'id': item.id}, true)[0].checked = false;
          })
        }
  }]);


