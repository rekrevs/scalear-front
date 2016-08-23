'use strict';

angular.module('scalearAngularApp')
  .controller('progressOverviewCtrl', ['$scope','$state', 'ContentNavigator', '$translate','$log', 'Page','ErrorHandler','CourseModel', function ($scope, $state, ContentNavigator, $translate, $log, Page,ErrorHandler, CourseModel) {

    $scope.course = CourseModel.getSelectedCourse()
    Page.setTitle($translate('navigation.progress') + ': ' + $scope.course.name);
    ContentNavigator.open()

    $scope.goTo=function(state){
        if($state.params.module_id)
            $state.go(state)
        else{
           ErrorHandler.showMessage($translate('error_message.select_module_first'), 'errorMessage', 4000, "error");
        }
    }

}]);
