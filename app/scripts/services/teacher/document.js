'use strict';

angular.module('scalearAngularApp')
.factory('Documents', ['$resource','$http','$stateParams','scalear_api','headers',function ($resource, $http, $stateParams, scalear_api, headers){
  
    $http.defaults.useXDomain = true;
    return $resource(scalear_api.host+'/en/documents/:document_id', {},
      { 'create': { method: 'POST', headers:headers },
        'index': { method: 'GET', isArray: true, headers:headers},
        'update': { method: 'PUT', headers:headers},
        'destroy': { method: 'DELETE', headers:headers },
        'show':{method: 'GET', headers:headers}
      });

}])