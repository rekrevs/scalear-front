'use strict';

angular.module('scalearAngularApp')
.directive('eventItem', function ($filter) {
		return {
			replace: true,
			restrict: 'E',
			scope:{
				event: '=',
				role: '='
			},
      		templateUrl: '/views/student/news_feed/event_item.html',
    	};
  	});
