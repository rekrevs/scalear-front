'use strict';

angular.module('scalearAngularApp')
  .factory('User', ['$resource','$http','$stateParams','scalear_api','headers',function ($resource, $http, $stateParams, scalear_api, headers) {    

  $http.defaults.useXDomain = true;
  return $resource(scalear_api.host+'/en/users/:user_id/:action', {user_id:$stateParams.user_id},
    { 
    });

}])