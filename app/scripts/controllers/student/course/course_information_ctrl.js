'use strict';

angular.module('scalearAngularApp')
  .controller('studentCourseInformationCtrl', ['$scope', '$stateParams', 'Course', 'Page', '$state', '$translate', 'ContentNavigator', '$log', 'CourseModel', 'ScalearUtils','$modal', function($scope, $stateParams, Course, Page, $state, $translate, ContentNavigator, $log, CourseModel, ScalearUtils,$modal) {

    $scope.course = CourseModel.getSelectedCourse()
    Page.setTitle($translate.instant('navigation.information') + ': ' + $scope.course.name);
    ContentNavigator.open()

    $scope.urlWithProtocol = ScalearUtils.urlWithProtocol
    if($state.params.new_enroll) {
      $modal.open({
        templateUrl: '/views/student/course_list/email_due_dates_modal.html',
        scope: $scope,
        controller:['$modalInstance', function($modalInstance ) {
          $scope.updateDueDateEmail = function (email_due_date) {
            $scope.email_due_date = email_due_date
            $scope.course.updateStudentDueDateEmail(email_due_date)
            $modalInstance.dismiss('cancel');
          }
        }]
      })
    } 

    function init() {
      if($scope.course.discussion_link) {
        $scope.short_url = ScalearUtils.shorten($scope.course.discussion_link, 20)
      }

      Course.show({ course_id: $stateParams.course_id },
        function(data) {
          $scope.teachers = data.teachers;
        });

      $scope.course.getStudentDueDateEmail()
        .then(function(data) {
          $scope.email_due_date = data.email_due_date
        })

      $scope.course.getAnnouncements()
        .then(function(announcements) {
          $scope.announcements = announcements
        })
    }

    init()

    $scope.goToContent = function() {
      if($scope.next_item.module != -1) {
        var params = { 'module_id': $scope.next_item.module }
        params[$scope.next_item.item.class_name + '_id'] = $scope.next_item.item.id
        $state.go('course.module.courseware.' + $scope.next_item.item.class_name, params)
      }
    }

    $scope.updateStudentDueDateEmail = function(email_due_date) {
      $scope.course.updateStudentDueDateEmail(email_due_date)
    }

  }]);
