'use strict';

angular.module('scalearAngularApp')

.controller('moduleCtrl', ['$scope','$state','ModuleModel', function ($scope, $state, ModuleModel) {
    var selected_module = ModuleModel.getById($state.params.module_id)
    ModuleModel.setSelectedModule(selected_module)

    $scope.$on('$destroy', function() {
      ModuleModel.removeSelectedModule()
    });
}])
