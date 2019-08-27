'use strict';

angular.module('scalearAngularApp')
.factory('User', ['$resource','$http','$stateParams','scalear_api','headers','$rootScope','$log' ,'$translate',function($resource, $http, $stateParams, scalear_api, headers, $rootScope, $log ,$translate) {

    $http.defaults.useXDomain = true;
    return $resource(scalear_api.host+'/:lang/users/:id/:action', {lang:$translate.use()},
      {
        'getCurrentUser': { method: 'GET', headers: headers , ignoreLoadingBar: true, params: {action: 'get_current_user'}},
        'signIn': { method: 'POST', headers: headers , params: {action: 'sign_in'}},
        'signOut': { method: 'DELETE', headers: headers , params: {action: 'sign_out'}}, //make delete
        'signUp': { method: 'POST', headers: headers},
        'reset_password':{method:'POST', headers:headers, params:{action: 'password'}},
        'change_password':{method:'PUT', headers:headers, params:{action: 'password'}},
        'resend_confirmation':{method:'POST', headers:headers, params:{action: 'confirmation'}},
        'show_confirmation':{method:'GET', headers:headers, params:{action: 'confirmation'}},
        'update_account':{method:'PUT', headers:headers},
        'delete_account':{method:'delete', headers:headers},
        'alterPref':{method: 'POST', params:{action:'alter_pref'}, headers:headers},
        'updateCompletionWizard':{method: 'POST', params:{action: 'update_completion_wizard'}, headers:headers},
        'samlSignup': { method: 'POST', headers: headers , params: {action: 'saml_signup'}}, // NOT DONE
        'userExist': { method: 'GET', headers: headers , params: {action: 'user_exist'}},
        'getSubdomains': { method: 'GET', headers: headers , params: {action: 'get_subdomains'}},
        'getWelcomeMessage': { method: 'GET', headers: headers , params: {action: 'get_welcome_message'}},
        'submitWelcomeMessage': { method: 'POST', headers: headers , params: {action: 'submit_welcome_message'}},
        'agreeToPrivacyPolicy': { method: 'POST', headers: headers , params: {action: 'agree_to_privacy_policy'}},
        'validateUser': { method: 'POST', headers: headers , params: {action: 'validate_user'}}
      });

}]);
