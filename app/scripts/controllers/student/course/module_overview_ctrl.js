'use strict';

angular.module('scalearAngularApp')
  .controller('studentModuleOverviewCtrl', ['$scope', '$state', 'Module','Page', function($scope, $state, Module, Page) {
    Page.setTitle('global.overview');

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

  }]);
