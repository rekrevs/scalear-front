'use strict';

var app = angular.module('scalearAngularApp')

  app.controller('enrolledStudentsCtrl', ['$scope', '$state', 'Course', 'batchEmailService','$stateParams', '$translate','$log','$window','Page', '$filter', '$modal', function ($scope, $state, Course, batchEmailService, $stateParams, $translate, $log, $window, Page, $filter, $modal) {
 
        $log.debug("in enrolled students");
        Page.setTitle('head.enrolled_students')
        $scope.emails=[];
        batchEmailService.setEmails($scope.emails)
        $scope.loading_students = true, $scope.delete_mode = false;
        $scope.grid_view= true
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
            $scope.emails = [];
            selected_students.forEach(function(student){
              $scope.emails.push(student.email);
            })
            batchEmailService.setEmails($scope.emails)
            var modalInstance = $modal.open({
                templateUrl: '/views/teacher/course/send_emails.html',
                controller: 'sendEmailsCtrl'
            })
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
        $scope.toggleHelpEnrolling = function(){
          $scope.isCollapsed = !$scope.isCollapsed
          $window.scrollTo(0, 0);
        }
        $scope.toggleDeleteMode = function(){
          $scope.delete_mode = !$scope.delete_mode
        }

        $scope.gridView=function(val){
          $scope.grid_view = val
        }
  }]);


