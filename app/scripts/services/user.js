'use strict';

angular.module('scalearAngularApp')
.factory('User', ['$resource','$http','$stateParams','scalear_api','headers','$rootScope','$log' ,function($resource, $http, $stateParams, scalear_api, headers, $rootScope, $log) {

    $http.defaults.useXDomain = true;
    $log.debug("root scope is");
    $log.debug($rootScope.current_lang);
    var lang=$rootScope.current_lang;
    $log.debug(lang);
    return $resource(scalear_api.host+'/en/users/:id/:action', {},
      { 
      	'logout': { method: 'DELETE', headers: headers , params: {action: 'sign_out'}},
      	'getCurrentUser': { method: 'GET', headers: headers , params: {action: 'get_current_user'}},
      });

}]);
