'use strict';

angular.module('scalearAngularApp')
  .controller('enrolledStudentsCtrl', ['$scope', '$state', 'Course', 'batchEmailService','$stateParams', '$translate','$log','$window','Page', '$filter', '$modal','$cookieStore','ContentNavigator','$rootScope' , 'ErrorHandler' , '$interval', function ($scope, $state, Course, batchEmailService, $stateParams, $translate, $log, $window, Page, $filter, $modal,$cookieStore, ContentNavigator,$rootScope , ErrorHandler , $interval) {
 
        ContentNavigator.close()
        $log.debug("in enrolled students");
        Page.setTitle('navigation.enrolled_students')
        $scope.emails=[];
        batchEmailService.setEmails($scope.emails)
        $scope.loading_students = true, $scope.delete_mode = false;
        $scope.list_view= $cookieStore.get('list_view')
        Course.getEnrolledStudents(
          {course_id: $stateParams.course_id},
          function(students){
            $scope.students = students
            $scope.loading_students = false
          }
        )

        $scope.removeStudent = function(student){
          $log.debug(student)
        	student.removing=true;
            Course.removeStudent(
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
              }
            )
        }
        $scope.exportStudentsList = function(){ 
          $log.debug("List ")
          Course.exportStudentCsv({course_id: $stateParams.course_id} 
            , 
            function(response){ 
              console.log("EXPPPPPPPPPPPP") 
              console.log(response)   
              if (response.notice){ 
                  $rootScope.show_alert = "success"; 
                  ErrorHandler.showMessage($translate("error_message.export_student"), 'errorMessage', 2000); 
                  $interval(function() { 
                        $rootScope.show_alert = ""; 
                  }, 4000, 1);                     
            } 
          }) 
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
          $modal.open({
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
          filtered_students.forEach(function(item){
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

        $scope.listView=function(val){
          $scope.list_view = val
          $cookieStore.put('list_view', val)
        }
  }]);


