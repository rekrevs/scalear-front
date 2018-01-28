'use strict';

angular.module('scalearAngularApp')
  .factory('Quiz', ['$resource', '$http', '$stateParams', 'scalear_api', 'headers', '$rootScope', '$translate', function($resource, $http, $stateParams, scalear_api, headers, $rootScope, $translate) {

    $http.defaults.useXDomain = true;
    return $resource(scalear_api.host + '/:lang/courses/:course_id/quizzes/:quiz_id/:action', { course_id: $stateParams.course_id, lang: $translate.use() }, {
      'newQuiz': { method: 'POST', params: { action: 'new_or_edit' }, headers: headers },
      'update': { method: 'PUT', headers: headers },
      'destroy': { method: 'DELETE', headers: headers },
      "getQuestions": { method: 'GET', params: { action: 'get_questions_angular' }, headers: headers },
      "updateQuestions": { method: 'PUT', params: { action: 'update_questions_angular' }, headers: headers },
      "validateQuiz": { method: 'PUT', params: { action: 'validate_quiz_angular' }, headers: headers },
      "makeVisible": { method: 'POST', params: { action: 'make_visible' }, headers: headers }, // NOT DONE
      "hideResponses": { method: 'POST', params: { action: 'hide_responses' }, headers: headers }, // NOT DONE
      "hideResponseStudent": { method: 'POST', params: { action: 'hide_response_student' }, headers: headers }, // NOT DONE
      "sendFeedback": { method: 'POST', params: { action: 'create_or_update_survey_responses' }, headers: headers },
      "deleteFeedback": { method: 'POST', params: { action: 'delete_response' }, headers: headers }, // NOT DONE
      "showInclass": { method: 'POST', params: { action: 'show_question_inclass' }, headers: headers },
      "showStudent": { method: 'POST', params: { action: 'show_question_student' }, headers: headers }, // NOT DONE
      "saveStudentQuiz": { method: 'POST', params: { action: 'save_student_quiz_angular' }, headers: headers },
      "quizCopy": { method: 'POST', params: { action: 'quiz_copy' }, headers: headers },
      "changeQuizStatus": { method: 'POST', ignoreLoadingBar: true, params: { action: 'change_status_angular' }, headers: headers },
      "updateGrade": { method: 'POST', params: { action: 'update_grade' }, headers: headers } // NOT DONE
    });

  }]).factory("QuizModel", ['Quiz', 'ModuleModel', '$rootScope', function(Quiz, ModuleModel, $rootScope) {

    var selected_quiz = null

    function setSelectedQuiz(quiz) {
      selected_quiz = quiz
      return getSelectedQuiz()
    }

    function getSelectedQuiz() {
      return selected_quiz
    }

    function clearSelectedQuiz() {
      selected_quiz = null
    }

    function create(type) {
      var module = ModuleModel.getSelectedModule()
      return Quiz.newQuiz({
          course_id: module.course_id,
          group: module.id,
          type: type
        }, {})
        .$promise
        .then(function(data) {
          data.quiz.class_name = 'quiz'
          var quiz = createInstance(data.quiz)
          $rootScope.$broadcast("Item:added", quiz)
          return quiz
        });
    }

    function paste(q, module_id) {
      var module = ModuleModel.getById(module_id)
      return Quiz.quizCopy({ course_id: module.course_id }, {
          quiz_id: q.id,
          module_id: module.id
        })
        .$promise
        .then(function(data) {
          data.quiz.class_name = 'quiz'
          var quiz = createInstance(data.quiz)
          $rootScope.$broadcast("Item:added", quiz)
          $rootScope.$broadcast('update_module_statistics')
          return quiz
        })
    }

    function isInstance(instance) {
      return(instance.instanceType && instance.instanceType() == "Quiz");
    }

    function createInstance(quiz) {

      if(isInstance(quiz)) {
        return quiz;
      }

      $rootScope.$on("Module:" + quiz.group_id + ":updated", function(evt, module) {
        if(quiz.required_module) {
          quiz.required = module.required;
        }
        if(quiz.graded_module) {
          quiz.graded = module.graded;
        }
        if(quiz.due_date_module) {
          quiz.due_date = module.due_date;
        }        
      })

      function instanceType() {
        return "Quiz"
      }

      function module() {
        return ModuleModel.getById(quiz.group_id)
      }

      function validate() {
        return Quiz.validateQuiz({
            course_id: quiz.course_id,
            quiz_id: quiz.id
          }, quiz)
          .$promise
          .catch(function(data) {
            if(data.status == 422 && data.data.errors)
              return data.data.errors.join();
            else
              return 'Server Error';
          })
      }

      function update() {
        var modified_quiz = angular.copy(quiz);
        delete modified_quiz.created_at;
        delete modified_quiz.updated_at;
        delete modified_quiz.class_name;
        delete modified_quiz.id;

        return Quiz.update({
            course_id: quiz.course_id,
            quiz_id: quiz.id
          }, {
            quiz: modified_quiz
          })
          .$promise
          .then(function(data) {
            angular.extend(quiz, data.quiz)
            return quiz
          });
      }

      function remove() {
        return Quiz.destroy({
            course_id: quiz.course_id,
            quiz_id: quiz.id
          }, {})
          .$promise
          .then(function() {
            $rootScope.$broadcast("Item:removed", quiz)
          });
      }

      function setAsSelected() {
        return setSelectedQuiz(quiz)
      }

      function markDone() {
        $rootScope.$broadcast("item_done", quiz)
      }

      function studentSolve(studentAnswers, action) {
        return Quiz.saveStudentQuiz({
            quiz_id: quiz.id,
            course_id: quiz.course_id
          }, {
            student_quiz: studentAnswers,
            commit: action
          })
          .$promise
      }

      function isVisible(){
        return (new Date(quiz.appearance_time) <= new Date())
      }

      return angular.extend(quiz, {
        instanceType: instanceType,
        module: module,
        validate: validate,
        update: update,
        remove: remove,
        setAsSelected: setAsSelected,
        markDone: markDone,
        studentSolve:studentSolve,
        isVisible: isVisible
      })
    }

    return {
      setSelectedQuiz: setSelectedQuiz,
      getSelectedQuiz: getSelectedQuiz,
      clearSelectedQuiz: clearSelectedQuiz,
      isInstance: isInstance,
      createInstance: createInstance,
      paste: paste,
      create: create
    }
  }])
