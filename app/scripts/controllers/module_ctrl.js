'use strict';

angular.module('scalearAngularApp')

.controller('moduleCtrl', ['$scope','$state', function ($scope, $state) {

	$scope.$watch('module_obj['+$state.params.module_id+']', function(){
        if($scope.module_obj && $scope.module_obj[$state.params.module_id]){
            $scope.selected_module=$scope.module_obj[$state.params.module_id]
            console.log("Main Selected Module")
            console.log($scope.selected_module)
        }
    })
	
	// $state.go('course.module.course_editor.lecture',{module_id:55, lecture_id:232})
}])