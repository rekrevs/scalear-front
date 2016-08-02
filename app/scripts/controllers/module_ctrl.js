'use strict';

angular.module('scalearAngularApp')

.controller('moduleCtrl', ['$scope','$state','ModuleModel', function ($scope, $state, ModuleModel) {
    $scope.course.selected_module = ModuleModel.getById($state.params.module_id)
    ModuleModel.setSelectedModule($scope.course.selected_module)

    $scope.$on('$destroy', function() {
      ModuleModel.removeSelectedModule()
        // if($scope.course)
    	   // $scope.course.selected_module = null
    });
}])
