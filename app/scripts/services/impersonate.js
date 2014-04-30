'use strict';

angular.module('scalearAngularApp')
.factory('Impersonate', ['$resource','$http','$stateParams','scalear_api','headers','$rootScope', '$translate',function($resource, $http, $stateParams, scalear_api, headers, $rootScope ,$translate) {

    $http.defaults.useXDomain = true;
    return $resource(scalear_api.host+'/en/impressionate/:action', {},
      { 
      	 'create': { method: 'POST', headers:headers},
      	 'destroy': { method: 'DELETE' , headers:headers},
      });

}]);