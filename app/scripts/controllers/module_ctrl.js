'use strict';

angular.module('scalearAngularApp')

.controller('moduleCtrl', ['$scope','$state','ModuleModel','ErrorHandler', function ($scope, $state, ModuleModel, ErrorHandler) {
    var selected_module = ModuleModel.getById($state.params.module_id)
    if (!selected_module) {
    	$state.go("course_list") //check
        ErrorHandler.showMessage('Module is not published.', 'errorMessage', 4000, "error");
    }else{
    	ModuleModel.setSelectedModule(selected_module)
    }
    $scope.$on('$destroy', function() {
      ModuleModel.clearSelectedModule()
    });
}])
