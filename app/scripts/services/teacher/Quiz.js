'use strict';

angular.module('scalearAngularApp')
.factory('Quiz', function($resource, $http, $stateParams, scalear_api, headers) {

    $http.defaults.useXDomain = true;
    return $resource(scalear_api.host+'/en/courses/:course_id/quizzes/:quiz_id/:action', {course_id:$stateParams.course_id},
      { 'create': { method: 'POST', headers: headers },
        'index': { method: 'GET', isArray: true, headers: headers},
        'update': { method: 'PUT', headers: headers},
        'destroy': { method: 'DELETE', headers: headers },
        'show':{method: 'GET', headers: headers},
        "get_questions": {method: 'GET', params: {action: 'get_questions_angular'},headers: headers},
        "update_questions": {method: 'PUT', params: {action: 'update_questions_angular'},headers: headers},
        
      });

})
.factory('Answer', function($resource, $http, $stateParams, scalear_api, headers) {

    $http.defaults.useXDomain = true;
    return $resource(scalear_api.host+'/en/answers/:answer_id/:action', {},
      { 'create': { method: 'POST', headers: headers },
        'index': { method: 'GET', isArray: true, headers: headers},
        'update': { method: 'PUT', headers: headers},
        'destroy': { method: 'DELETE', headers: headers },
        'show':{method: 'GET', headers: headers},
        "get_questions": {method: 'GET', params: {action: 'get_questions_angular'},headers: headers},
        
      });

})
.factory('Question', function($resource, $http, $stateParams, scalear_api, headers) {

    $http.defaults.useXDomain = true;
    return $resource(scalear_api.host+'/en/questions/:question_id/:action', {},
      { 'create': { method: 'POST', headers: headers },
        'index': { method: 'GET', isArray: true, headers: headers},
        'update': { method: 'PUT', headers: headers},
        'destroy': { method: 'DELETE', headers: headers },
        'show':{method: 'GET', headers: headers},
        "get_questions": {method: 'GET', params: {action: 'get_questions_angular'},headers: headers},
        
      });

});

