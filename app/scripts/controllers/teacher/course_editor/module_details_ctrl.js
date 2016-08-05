'use strict';

angular.module('scalearAngularApp')
  .controller('moduleDetailsCtrl', ['$scope',  '$state', '$q', '$log','ModuleModel','DetailsNavigator','CourseEditor', function($scope, $state, $q, $log, ModuleModel, DetailsNavigator, CourseEditor) {

    (function init(){
      $scope.module = ModuleModel.getSelectedModule()
      $scope.link_url = $state.href('course.module.courseware', { module_id: $scope.module.id }, { absolute: true })
      if($scope.module.due_date){
        $scope.due_date_enabled = !CourseEditor.isDueDateDisabled()
      }
      $scope.module_details_groups = DetailsNavigator.module_details_groups
    })()

    $scope.validateModule = function(column, data) {
      var deferred = $q.defer();
      var module = {}
      module[column] = data;
      ModuleModel.validate(module)
      .then(function(){
        deferred.resolve()
      })
      .catch(function(data){
        if(data.status == 422)
          deferred.resolve(data.data.errors[0]);
        else
          deferred.reject('Server Error');
      })
      return deferred.promise;
    };

    $scope.updateModule = function() {
      ModuleModel.update($scope.module)
    }


    // function isDueDateDisabled() {
    //   var due = new Date($scope.module.due_date)
    //   var today = new Date()
    //   return due.getFullYear() > today.getFullYear() + 100
    // }

    $scope.updateDueDate = function() {
      var enabled = $scope.due_date_enabled
      var due_date = new Date($scope.module.due_date)
      var week = 7
      if(CourseEditor.isDueDateDisabled() && enabled)
        var years = -200
      else if(!CourseEditor.isDueDateDisabled() && !enabled)
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
      $scope.due_date_enabled = !CourseEditor.isDueDateDisabled()
    }


  }]);
