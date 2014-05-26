'use strict';

angular.module('scalearAngularApp')
.factory('Page', ['$rootScope', '$filter', function($rootScope, $filter) {
   var title = 'Home';
   return {
     title: function() { return title; },
     setTitle: function(newTitle, subtitle) { 
     	title = $filter('translate')(newTitle)
     	if(subtitle)
     		title+=subtitle
     	$rootScope.current = newTitle 
     	console.log($rootScope.current)
     }
   };
}]);