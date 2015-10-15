'use strict';

angular.module('scalearAngularApp')
  .controller('inclassCtrl', ['ContentNavigator','Page', function (ContentNavigator, Page) {
		Page.setTitle('navigation.in_class')
  		ContentNavigator.open()
  }]);
