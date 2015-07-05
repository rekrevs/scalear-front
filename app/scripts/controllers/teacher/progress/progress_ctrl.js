'use strict';

angular.module('scalearAngularApp')
  .controller('progressCtrl', ['ContentNavigator','Page',function (ContentNavigator, Page) {
  		Page.setTitle('head.progress')
  		ContentNavigator.open()
			
  }]);
	   	
