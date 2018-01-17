'use strict';

angular.module('scalearAngularApp')
.factory('Home', ['$resource','$http','$stateParams','scalear_api','headers','$rootScope', '$translate',function($resource, $http, $stateParams, scalear_api, headers, $rootScope ,$translate) {

    $http.defaults.useXDomain = true;
    return $resource(scalear_api.host+'/:lang/home/:action', {lang:$translate.use()},
      { 
      	'contactUs': { method: 'GET', params: {action: 'contact_us'}, headers: headers }, // Not Done
      	'technicalProblem': { method: 'GET', params: {action: 'technical_problem'}, headers: headers }, // Not Done
      	'getNotifications':{method: 'GET', ignoreLoadingBar: true, params: {action: 'notifications'}, headers: headers},
      	'acceptCourse':{method: 'POST', params: {action: 'accept_course'}, headers: headers},
      	'rejectCourse':{method: 'POST', params: {action: 'reject_course'}, headers: headers},
      });

}]);
