'use strict';

angular.module('scalearAngularApp')
  .controller('studentModuleOverviewCtrl', ['$scope', '$state', 'Module','Page', function($scope, $state, Module, Page) {
    Page.setTitle('module.overview');

    function getSummaryModule(module_id, course_id) {
      $scope.module_summary = {}
      $scope.module_summary.loading = { summary: true, online_quiz: true, discussion: true }

      Module.getModuleSummary({
        module_id: module_id,
        course_id: course_id
      }, function(data) {
        $scope.module_summary.loading.summary = false
        angular.extend($scope.module_summary, data.module)
      })

      Module.getOnlineQuizSummary({
        module_id: module_id,
        course_id: course_id
      }, function(data) {
        $scope.module_summary.loading.online_quiz = false
        angular.extend($scope.module_summary, data.module)
      })

      Module.getDiscussionSummary({
        module_id: module_id,
        course_id: course_id
      }, function(data) {
        $scope.module_summary.loading.discussion = false
        angular.extend($scope.module_summary, data.module)
      })
    }

    getSummaryModule($state.params.module_id, $state.params.course_id)

    // if(module.sub_items_size > 0) {
    // Module.getLastWatched({
    //     course_id: $stateParams.course_id,
    //     module_id: module.id
    //   },
    //   function(data) {
    //     if(data.last_watched != -1) {
    //       $state.go('course.module.courseware.lecture', { 'module_id': module.id, 'lecture_id': data.last_watched })
    //       scope.currentitem = { id: data.last_watched }
    //     } else {
    //       $state.go('course.module.courseware.quiz', { 'module_id': module.id, 'quiz_id': data.first_quiz_id })
    //       scope.currentitem = { id: data.first_quiz_id }
    //     }
    //   })

  }]);
