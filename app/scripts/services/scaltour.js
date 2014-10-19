'use strict';

angular.module('scalearAngularApp')
.factory('ScalTour', ['$rootScope', '$filter', '$tour', 'Page', 'User', function($rootScope, $filter, $tour, Page, User) {
    $rootScope.$on('start_tour', function(){
        $tour.start();
    })
    $rootScope.$on('tour_ended', function(){
      var completion = $rootScope.current_user.completion_wizard
      completion[Page.pageName()] = true;
      console.log(completion)
      User.updateCompletionWizard(
        {id: $rootScope.current_user.id},
        {completion_wizard: completion}, 
        function(){
          console.log('SUCCEEDED')
          $rootScope.current_user.completion_wizard[Page.pageName()] = true;
        }, function(){
          console.log('failed')
      });
    })
}]);