'use strict';

angular.module('scalearAngularApp')
  .controller('moduleDetailsCtrl', ['$scope',  '$state', '$q', '$log','ModuleModel','DetailsNavigator','CourseEditor', function($scope, $state, $q, $log, ModuleModel, DetailsNavigator, CourseEditor) {

    (function init(){
      $scope.module = ModuleModel.getSelectedModule()
      $scope.link_url = $state.href('course.module.courseware', { module_id: $scope.module.id }, { absolute: true })
      if($scope.module.due_date){
        $scope.due_date_enabled = !CourseEditor.isDueDateDisabled($scope.module.due_date)
      }
      $scope.module_details_groups = DetailsNavigator.module_details_groups
    })()

    $scope.validateModule = function(column, data) {
      var module = {id: $scope.module.id, course_id: $scope.module.course_id}
      module[column] = data;
      var temp_module = ModuleModel.createInstance(module)
      return temp_module.validate()
    };

    $scope.updateModule = function() {
      $scope.module.update()
    }

    $scope.updateDueDate = function() {
      var due_date = new Date($scope.module.due_date)
      var week = 7
      if(CourseEditor.isDueDateDisabled($scope.module.due_date) && !$scope.due_date_enabled)
        var years = -200
      else if(!CourseEditor.isDueDateDisabled($scope.module.due_date) && $scope.due_date_enabled)
        var years = 200
      else
        var years = 0
      due_date.setFullYear(due_date.getFullYear() + years)

      var appearance_date = new Date($scope.module.appearance_time)
      if(due_date <= appearance_date) {
        due_date = appearance_date
        due_date.setDate(appearance_date.getDate() + week)
      }
      $scope.module.due_date = due_date
      $scope.due_date_enabled = !CourseEditor.isDueDateDisabled($scope.module.due_date)
    }


  }]);
