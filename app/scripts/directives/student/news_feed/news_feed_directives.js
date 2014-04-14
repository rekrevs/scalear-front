'use strict';

angular.module('scalearAngularApp')
	.directive('newsFeed', ['$filter', function ($filter) {
		return {
			replace: true,
			restrict: 'E',
			scope:{
				comingup: '=',
				latestevents: '=',
				latestannouncements: '='
			},
      		templateUrl: '/views/student/news_feed/main.html',
      		link: function (scope, element, attrs) {

      		}
    	};
  	}]).directive('eventItem', function ($filter) {
		return {
			replace: true,
			restrict: 'E',
			scope:{
				// id: '=',
				// title: '=',
				// body: '=',
				// date: '=',
				// typee: '='
				event: '=' 
			},
      		templateUrl: '/views/student/news_feed/event_item.html',
      		link: function (scope, element, attrs) {
      			scope.$watch('event', function(){
      				console.log(scope.event)
      			})
      		}
    	};
  	}).directive('comingItem', function ($filter) {
		return {
			replace: true,
			restrict: 'E',
			scope:{
				id: '=',
				title: '=',
				body: '=',
				date: '=',
				type: '='
			},
      		// templateUrl: '/views/student/news_feed/coming_item.html',
      		link: function (scope, element, attrs) {
      			
      		}
    	};
  	}).directive('announcementNewsItem', function ($filter) {
		return {
			replace: true,
			restrict: 'E',
			scope:{
				announcement: '='
			},
      		templateUrl: '/views/student/news_feed/announcement_item.html',
      		link: function (scope, element, attrs) {
      			scope.shorten = function(body){
      				if(body.length > 80) {
					    body = body.substring(0,75)+"...";
					}
					return body;
      			}
      			scope.$watch('announcement', function(){
      				scope.announcement_body = scope.shorten(scope.announcement.announcement);
      			})
      		}
    	};
  	});
