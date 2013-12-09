'use strict';

angular.module('scalearAngularApp')
.factory('Document', ['$resource','$http','$stateParams','scalear_api','headers','$rootScope',function ($resource, $http, $stateParams, scalear_api, headers, $rootScope){
  
    $http.defaults.useXDomain = true;
    return $resource(scalear_api.host+'/'+$rootScope.current_lang+'/documents/:document_id', {},
      { 'create': { method: 'POST', headers:headers },
        'index': { method: 'GET', isArray: true, headers:headers},
        'update': { method: 'PUT', headers:headers},
        'destroy': { method: 'DELETE', headers:headers },
        'show':{method: 'GET', headers:headers}
      });

}])