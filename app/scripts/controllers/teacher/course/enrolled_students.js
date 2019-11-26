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
          Course.exportStudentCsv({course_id: $stateParams.course_id},
            function(response){
              if (response.notice){
                ErrorHandler.showMessage($translate.instant("error_message.export_student"), 'errorMessage', 2000, "success");
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

        $scope.removeSelectedStudents = function () {
          $scope.selected_students = $filter('filter')($scope.students, { 'checked': true }, true)
          $modal.open({
            template: '<div ng-show="selected_students_count"><H1>Head Up!</H1>' +
              '<p>Are you sure want to remove {{selected_students_count}} student? This can\'t be undone. </p>' +
              "<button type='button' ng-click='cancelStudentsUnenrollment();toggleDeleteMode()'  class='right button small '>Cancel</button>" +
              "<button type='button' ng-click='unenrollStudents();toggleDeleteMode()'  class='right button success small with-margin-right'>Delete</button></div>" +
              "<div ng-hide='selected_students_count'><p>No selected students to delete!</p>" +
              "<center><button type='button' ng-click='cancelStudentsUnenrollment();toggleDeleteMode()'  class='centered button small '>Ok</button><center>" +
              "</div>",
            scope: $scope,
            windowClass: 'upload-progress-modal-window',
            controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
              $scope.selected_students_count = $scope.selected_students.length
              $scope.unenrollStudents = function () {
                $scope.selected_students.forEach(function (selected_student) {
                  $scope.removeStudent(selected_student)
                })
                $modalInstance.close()
              }
              $scope.cancelStudentsUnenrollment = function () {
                $modalInstance.dismiss('cancel')
              }
            }],
          })
        }

        $scope.listView = function (val) {
          $scope.list_view = val
          $cookieStore.put('list_view', val)
        }
  }]);


