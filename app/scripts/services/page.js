'use strict';

angular.module('scalearAngularApp')
.factory('Page', function() {
   var title = 'Home';
   return {
     title: function() { return title; },
     setTitle: function(newTitle) { title = newTitle }
   };
});