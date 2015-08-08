'use strict';

angular.module('scalearAngularApp')
.factory('ScalTour', ['$rootScope', '$filter', '$tour', 'Page', 'User', function($rootScope, $filter, $tour, Page, User) {
    $rootScope.$on('start_tour', function(){
        $tour.start();
    })
    $rootScope.$on('tour_ended', function(){
      var unwatch = $rootScope.$watch('current_user', function(){
        if($rootScope.current_user){
          var completion = $rootScope.current_user.completion_wizard
          if(completion.intro_watched == true){
            completion[Page.pageName()] = true;
            $log.debug(completion)
            User.updateCompletionWizard(
              {id: $rootScope.current_user.id},
              {completion_wizard: completion}, 
              function(){
                $rootScope.current_user.completion_wizard[Page.pageName()] = true;
                unwatch();
              }, function(){
                unwatch();
            });
          }  
        }
      })
    })
}]);