'use strict';

angular.module('scalearAngularApp')
.factory('Page', ['$rootScope', '$filter','$log', function($rootScope, $filter,$log) {
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
     	$log.debug($rootScope.current)
     },
     startTour: function(){
      //Disabled for now
      // var unwatch = $rootScope.$watch('current_user', function(){
      //   if($rootScope.current_user){
      //     if($rootScope.current_user.roles[0].id!=2){
      //       if(!$rootScope.current_user.completion_wizard[page_name.replace('.', '_')] && !$rootScope.current_user.completion_wizard['all'] && $rootScope.current_user.completion_wizard['intro_watched'] == true){
      //         $log.debug('starting tour for '+page_name.replace('.', '_'))
      //         $rootScope.$emit('start_tour');
      //       }
      //     }
      //     unwatch();
      //   }
      // })
     }
   };
}]);
