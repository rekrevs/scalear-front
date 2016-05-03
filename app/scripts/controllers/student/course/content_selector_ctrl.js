'use strict';

angular.module('scalearAngularApp')
.controller('contentSelectorCtrl', ['$scope', '$stateParams','Page', '$state', '$timeout','$rootScope','ContentNavigator','$log', function($scope, $stateParams, Page, $state, $timeout,$rootScope, ContentNavigator, $log) {
    Page.setTitle('navigation.information');
    ContentNavigator.open()
}]);