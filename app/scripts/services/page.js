'use strict';

angular.module('scalearAngularApp')
.factory('Page', ['$rootScope', '$filter', function($rootScope, $filter) {
   var title = 'Home';
   var page_name = 'home'
   return {
     title: function() { return title; },
     pageName: function(){ return page_name.replace('.', '_'); },
     setTitle: function(newTitle, subtitle) { 
      page_name = newTitle
     	title = $filter('translate')(newTitle)
     	if(subtitle)
     		title+=subtitle
     	$rootScope.current = newTitle 
     	console.log($rootScope.current)
     },
     startTour: function(){
      var unwatch = $rootScope.$watch('current_user', function(){
        if($rootScope.current_user){
          if(!$rootScope.current_user.completion_wizard[page_name.replace('.', '_')] && !$rootScope.current_user.completion_wizard['all'] && $rootScope.current_user.completion_wizard['intro_watched'] == true){
            console.log('starting tour for '+page_name.replace('.', '_'))
            $rootScope.$emit('start_tour');
          }
          unwatch();
        }
      })
     }
   };
}]);