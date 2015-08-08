'use strict';

angular.module('scalearAngularApp')
.factory('CustomLink', ['$resource','$http','$stateParams','scalear_api','headers','$rootScope','$translate',function ($resource, $http, $stateParams, scalear_api, headers, $rootScope ,$translate){
  
    $http.defaults.useXDomain = true;
    return $resource(scalear_api.host+'/:lang/custom_links/:link_id/:action', {lang:$translate.uses()},
      { 'create': { method: 'POST', headers:headers },
        'index': { method: 'GET', isArray: true, headers:headers},
        'update': { method: 'PUT', headers:headers},
        'destroy': { method: 'DELETE', headers:headers },
        'show':{method: 'GET', headers:headers},
        'validate':{method: 'PUT', headers:headers, params: {action: 'validate_custom_link'} },
        "linkCopy":{method:'POST', params:{action:'link_copy'}, headers:headers}
      });

}])