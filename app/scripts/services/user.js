'use strict';

angular.module('scalearAngularApp')
.factory('User', ['$resource','$http','$stateParams','scalear_api','headers','$rootScope','$log' ,'$translate',function($resource, $http, $stateParams, scalear_api, headers, $rootScope, $log ,$translate) {

    $http.defaults.useXDomain = true;
    $log.debug("root scope is");
    $log.debug($rootScope.current_lang);
    var lang=$rootScope.current_lang;
    $log.debug(lang);
    return $resource(scalear_api.host+'/:lang/users/:id/:action', {lang:$translate.uses()},
      { 
      	'logout': { method: 'DELETE', headers: headers , params: {action: 'sign_out'}},
      	'getCurrentUser': { method: 'GET', headers: headers , params: {action: 'get_current_user'}},
      });

}]);
