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
      	//'logout': { method: 'DELETE', headers: headers , params: {action: 'sign_out'}},
      	'getCurrentUser': { method: 'GET', headers: headers , params: {action: 'get_current_user'}},
         'sign_in': { method: 'POST', headers: headers , params: {action: 'sign_in'}},
         'sign_out': { method: 'DELETE', headers: headers , params: {action: 'sign_out'}}, //make delete
          'sign_up': { method: 'POST', headers: headers},
          'reset_password':{method:'POST', headers:headers, params:{action: 'password'}},
          'change_password':{method:'PUT', headers:headers, params:{action: 'password'}},
          'resend_confirmation':{method:'POST', headers:headers, params:{action: 'confirmation'}},
          'show_confirmation':{method:'GET', headers:headers, params:{action: 'confirmation'}},
          'update_account':{method:'PUT', headers:headers},
          'delete_account':{method:'delete', headers:headers}

      });

}]);
