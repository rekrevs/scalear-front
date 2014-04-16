'use strict';

angular.module('scalearAngularApp')
.factory('Quiz', ['$resource','$http','$stateParams','scalear_api','headers','$rootScope','$translate',function($resource, $http, $stateParams, scalear_api, headers, $rootScope ,$translate) {

    $http.defaults.useXDomain = true;
    return $resource(scalear_api.host+'/:lang/courses/:course_id/quizzes/:quiz_id/:action', {course_id:$stateParams.course_id, lang:$translate.uses()},
      { 'create': { method: 'POST', headers: headers },
      	'newQuiz':{method:'POST', params:{action:'new_or_edit'}, headers:headers},
        'index': { method: 'GET', isArray: true, headers: headers},
        'update': { method: 'PUT', headers: headers},
        'destroy': { method: 'DELETE', headers: headers },
        'show':{method: 'GET', headers: headers},
        "getQuestions": {method: 'GET', params: {action: 'get_questions_angular'},headers: headers},
        "updateQuestions": {method: 'PUT', params: {action: 'update_questions_angular'},headers: headers},
        "validateQuiz": {method: 'PUT', params: {action: 'validate_quiz_angular'},headers: headers},
        "makeVisible":{method:'POST', params:{action:'make_visible'}, headers:headers},
        "hideResponses":{method:'POST',params:{action:'hide_responses'},headers:headers},
        "sendFeedback":{method:'POST', params:{action:'create_or_update_survey_responses'},headers:headers},
        "deleteFeedback":{method:'POST',params:{action:'delete_response'},headers:headers},
        "showInclass":{method:'POST',params:{action:'show_question_inclass'},headers:headers},
        "saveStudentQuiz":{method:'POST',params:{action:'save_student_quiz_angular'},headers:headers},
        "quizCopy":{method:'POST',params:{action:'quiz_copy'},headers:headers},
        "updateGrade":{method:'POST',params:{action:'update_grade'},headers:headers}

      });

}])
