'use strict';

angular.module('scalearAngularApp')
  .controller('inclassCtrl', ['$scope', '$translate', 'ContentNavigator','Page', function ($scope, $translate, ContentNavigator, Page) {
		Page.setTitle($translate('navigation.in_class') + ': ' + $scope.course.name);
  		ContentNavigator.open()
  }]);
