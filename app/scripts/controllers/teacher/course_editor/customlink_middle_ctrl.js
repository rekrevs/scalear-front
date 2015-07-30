'use strict';

angular.module('scalearAngularApp')
    .controller('customLinkMiddleCtrl', ['$stateParams', '$scope',function ($stateParams, $scope) {

   $scope.$watch('items_obj["customlink"]['+$stateParams.customlink_id+']', function(){
      if($scope.items_obj && $scope.items_obj["customlink"][$stateParams.customlink_id]){
        $scope.link=$scope.items_obj["customlink"][$stateParams.customlink_id]
      }
    })
}]);


