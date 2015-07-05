'use strict';

angular.module('scalearAngularApp')
    .controller('customLinkMiddleCtrl', ['$sce','$state', '$stateParams', '$scope', 'Lecture', 'CourseEditor', '$translate','$log','$rootScope','ErrorHandler','$timeout','OnlineQuiz','$q','DetailsNavigator', function ($sce,$state, $stateParams, $scope, Lecture, CourseEditor, $translate, $log,$rootScope, ErrorHandler, $timeout, OnlineQuiz,$q, DetailsNavigator) {

   $scope.$watch('items_obj["customlink"]['+$stateParams.customlink_id+']', function(){
      if($scope.items_obj && $scope.items_obj["customlink"][$stateParams.customlink_id]){
        $scope.link=$scope.items_obj["customlink"][$stateParams.customlink_id]
      }
    })

   $scope.$sce = $sce
}]);


