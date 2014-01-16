'use strict';

angular.module('scalearAngularApp')
.factory('Document', ['$resource','$http','$stateParams','scalear_api','headers','$rootScope','$translate',function ($resource, $http, $stateParams, scalear_api, headers, $rootScope ,$translate){
  
    $http.defaults.useXDomain = true;
    return $resource(scalear_api.host+'/:lang/documents/:document_id/:action', {lang:$translate.uses()},
      { 'create': { method: 'POST', headers:headers },
        'index': { method: 'GET', isArray: true, headers:headers},
        'update': { method: 'PUT', headers:headers},
        'destroy': { method: 'DELETE', headers:headers },
        'show':{method: 'GET', headers:headers},
        'validateURL':{method: 'PUT', headers:headers, params: {action: 'validate_document'} },
        'validateName':{method: 'PUT', headers:headers, params: {action: 'validate_document'} },
      });

}])