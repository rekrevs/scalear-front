'use strict';

angular.module('scalearAngularApp')
.factory('Home', ['$resource','$http','$stateParams','scalear_api','headers','$rootScope',function($resource, $http, $stateParams, scalear_api, headers, $rootScope) {

    $http.defaults.useXDomain = true;
    return $resource(scalear_api.host+'/:lang/home/:action', {},
      { 
      	'technicalProblem': { method: 'GET', params: {action: 'technical_problem'}, headers: headers },
      });

}]);
