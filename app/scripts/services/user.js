'use strict';

angular.module('scalearAngularApp')
.factory('User', ['$resource','$http','$stateParams','scalear_api','headers',function($resource, $http, $stateParams, scalear_api, headers) {

    $http.defaults.useXDomain = true;
    return $resource(scalear_api.host+'/en/users/:id/:action', {},
      { 
      	'logout': { method: 'DELETE', headers: headers , params: {action: 'sign_out'}},
      	'getCurrentUser': { method: 'GET', headers: headers , params: {action: 'get_current_user'}},
      });

}]);
