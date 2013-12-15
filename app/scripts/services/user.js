'use strict';

angular.module('scalearAngularApp')
.factory('User', ['$resource','$http','$stateParams','scalear_api','headers','$rootScope',function($resource, $http, $stateParams, scalear_api, headers, $rootScope) {

    $http.defaults.useXDomain = true;
    console.log("root scope is");
    console.log($rootScope.current_lang);
    console.log($rootScope);
    var lang=$rootScope.current_lang;
    console.log(lang);
    return $resource(scalear_api.host+'/en/users/:id/:action', {},
      { 
      	'logout': { method: 'DELETE', headers: headers , params: {action: 'sign_out'}},
      	'getCurrentUser': { method: 'GET', headers: headers , params: {action: 'get_current_user'}},
      });

}]);
