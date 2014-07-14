'use strict';

angular.module('scalearAngularApp')
	.directive('newsFeed', ['$filter', function ($filter) {
		return {
			replace: true,
			restrict: 'E',
			scope:{
				comingup: '=',
				latestevents: '=',
				latestannouncements: '=',
				events: '='
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
				// announcement_body: '='
			},
      		templateUrl: '/views/student/news_feed/event_item.html',
      		link: function (scope, element, attrs) {
      			scope.shorten = function(body){
      				if(body.length > 80) {
					    body = body.substring(0,75)+"...";
					}
					return body;
      			}
      			scope.strip = function(html){
      				var tmp = html.replace(/(<([^>]+)>)/ig," ");
        			return tmp.replace(/\n/g, "")
      			}
      			// scope.$watch('event', function(){
      			// 	if(scope.event.class_name == 'announcement' && scope.event.announcement){
      			// 		scope.announcement_body = scope.shorten(scope.strip(scope.event.announcement));
      			// 	}	
	      			
      			// })
      		}
    	};
  	});
