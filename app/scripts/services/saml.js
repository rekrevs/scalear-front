'use strict';

angular.module('scalearAngularApp')
.factory('Saml', ['$resource','$http','$stateParams','scalear_api','headers','$rootScope', '$translate',function($resource, $http, $stateParams, scalear_api, headers, $rootScope ,$translate) {

    $http.defaults.useXDomain = true;
    return $resource(scalear_api.host+'/:lang/saml/:action', {lang:$translate.uses()},
      { 
      	'Login': { method: 'GET', params: {action: 'saml_signin'}, headers: headers },
      });

}]);
