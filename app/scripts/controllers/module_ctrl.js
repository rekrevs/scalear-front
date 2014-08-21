'use strict';

angular.module('scalearAngularApp')

.controller('moduleCtrl', ['$scope','$state', '$rootScope', function ($scope, $state, $rootScope) {
	var unwatch= $scope.$watch('module_obj['+$state.params.module_id+']', function(){
        if($scope.module_obj && $scope.module_obj[$state.params.module_id]){
            $scope.course.selected_module=$scope.module_obj[$state.params.module_id]
            // $rootScope.selected_module=$scope.module_obj[$state.params.module_id]
            console.log("Main Selected Module")
            console.log($scope.course.selected_module)
            unwatch()
        }
    })

    $scope.$on('$destroy', function() {
        if($scope.course)
    	   $scope.course.selected_module = null
    });
	// $state.go('course.module.course_editor.lecture',{module_id:55, lecture_id:232})
}])