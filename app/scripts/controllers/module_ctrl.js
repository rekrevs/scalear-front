'use strict';

angular.module('scalearAngularApp')

.controller('moduleCtrl', ['$scope','$state', function ($scope, $state) {
    $scope.course.selected_module=$scope.module_obj[$state.params.module_id]
    $scope.$on('$destroy', function() {
        if($scope.course)
    	   $scope.course.selected_module = null
    });
}])