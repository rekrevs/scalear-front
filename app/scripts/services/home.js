'use strict';

angular.module('scalearAngularApp')
.factory('Home', ['$resource','$http','$stateParams','scalear_api','headers','$rootScope', '$translate',function($resource, $http, $stateParams, scalear_api, headers, $rootScope ,$translate) {

    $http.defaults.useXDomain = true;
    return $resource(scalear_api.host+'/:lang/home/:action', {lang:$translate.uses()},
      { 
      	'technicalProblem': { method: 'GET', params: {action: 'technical_problem'}, headers: headers },
      	'getNotifications':{method: 'GET', params: {action: 'notifications'}, headers: headers},
      	'acceptCourse':{method: 'POST', params: {action: 'accept_course'}, headers: headers},
      	'rejectCourse':{method: 'POST', params: {action: 'reject_course'}, headers: headers},
        'createComment':{method: 'POST', params: {action: 'create_comment'}, headers: headers}
      });

}]);
