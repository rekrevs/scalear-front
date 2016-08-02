'use strict';

angular.module('scalearAngularApp')
  .controller('progressOverviewCtrl', ['$interval','$rootScope', '$scope','$state', '$stateParams','ContentNavigator', '$translate','$log', 'Page','ErrorHandler', function ($interval,$rootScope, $scope, $state, $stateParams, ContentNavigator, $translate, $log, Page,ErrorHandler) {

    Page.setTitle($translate('navigation.progress') + ': ' + $scope.course.name);
    ContentNavigator.open()

    $scope.goTo=function(state){
        if($state.params.module_id)
            $state.go(state)
        else{
           showError()
        }
    }

    var showError=function(){
        ErrorHandler.showMessage($translate('error_message.select_module_first'), 'errorMessage', 0, "error");
    }

}]);
