'use strict';

angular.module('scalearAngularApp')
  .controller('progressOverviewCtrl', ['$interval','$rootScope', '$scope','$state', '$stateParams','ContentNavigator', '$translate','$log', 'Page','ErrorHandler', function ($interval,$rootScope, $scope, $state, $stateParams, ContentNavigator, $translate, $log, Page,ErrorHandler) {
    
    Page.setTitle('head.progress')
    ContentNavigator.open()

    $scope.goTo=function(state){
        if($state.params.module_id)
            $state.go(state)
        else{
           showError() 
        }
    }

    var showError=function(){
        $rootScope.show_alert = "error";
        ErrorHandler.showMessage("Please Select A Module First", 'errorMessage', 0);
        $interval(function() {
            $rootScope.show_alert = "";
        }, 3000, 1);
    }

}]); 