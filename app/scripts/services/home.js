'use strict';

angular.module('scalearAngularApp')
.factory('Home', ['$resource','$http','$stateParams','scalear_api','headers','$rootScope',function($resource, $http, $stateParams, scalear_api, headers, $rootScope) {

    $http.defaults.useXDomain = true;
    return $resource(scalear_api.host+'/'+$rootScope.current_lang+'/home/:action', {},
      { 
      	'technicalProblem': { method: 'GET', headers: headers , params: {action: 'technical_problem'}},
      });

}]);
