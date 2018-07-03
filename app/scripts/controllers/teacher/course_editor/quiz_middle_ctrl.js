'use strict';

angular.module('scalearAngularApp')
  .controller('quizMiddleCtrl', ['$stateParams', '$scope', 'Quiz', 'CourseEditor', '$translate', '$log', '$rootScope', 'ErrorHandler', '$timeout', '$state', '$q', 'ItemsModel', 'QuizModel', 'QuestionModel','CourseModel','ModuleModel', function($stateParams, $scope, Quiz, CourseEditor, $translate, $log, $rootScope, ErrorHandler, $timeout, $state, $q, ItemsModel, QuizModel, QuestionModel, CourseModel, ModuleModel) {
    $scope.currentDate = null
    $scope.saved = false
    $scope.quiz = ItemsModel.getQuiz($stateParams.quiz_id)
    ItemsModel.setSelectedItem($scope.quiz)
    $scope.course = CourseModel.getSelectedCourse()
    $scope.module = ModuleModel.getSelectedModule()
    $scope.publish_state_visible = $scope.quiz.isVisible()
    $scope.module_visible = $scope.module.isVisible()
    var autoSaveTimeOut = null;
    $scope.alert = {
      type: "alert",
      msg: "error_message.got_some_errors"
    }
    $scope.quizSortableOptions = {
      axis: 'y',
      dropOnEmpty: false,
      handle: '.handle',
      cursor: 'crosshair',
      items: '.quiz_sort',
      opacity: 0.4,
      scroll: true
    }

    angular.extend($scope, QuestionModel);
    addShortucts();

    $scope.getEditableQuestions()
      .then(function(questions) {
        $scope.questions = questions
      });

    $scope.$on('$destroy', function() {
      shortcut.remove("Enter");
    });

    $scope.closeAlerts = function() {
      $scope.hide_alerts = true;
    }

    $scope.saveQuestions = function() {
      setTimeout(function(){
      clearTimeout(autoSaveTimeOut)
      autoSaveTimeOut=setTimeout(
        function(){
          if($scope.tform.$valid) {
            $scope.submitted = false;
            $scope.hide_alerts = true;
            QuestionModel.updateQuestions();
          } else {
            $scope.submitted = true;
            $scope.hide_alerts = false;
          }
        $scope.currentDate = new Date().toLocaleString([], { hour12: true});
        },500)
      },500)
      $scope.saved = true
    }

    $scope.publish = function() {
      savePublish(true);
    }

    $scope.unpublish = function() {
      savePublish(false);
    }

    $scope.validateQuiz = function(column, data) {
      var quiz = { id: $scope.quiz.id, course_id: $scope.quiz.course_id, group_id: $scope.quiz.group_id }
      quiz[column] = data;
      var temp_quiz = QuizModel.createInstance(quiz);
      return temp_quiz.validate()
    };

    function savePublish(publish) {
      $scope.saveQuestions()
      var appearance_time = new Date($scope.module.appearance_time)
      if(!publish){
        appearance_time.setFullYear(appearance_time.getFullYear() + 200)
      }
      $scope.quiz.appearance_time = appearance_time
      $scope.quiz.appearance_time_module = false
      $scope.publish_state_visible = $scope.quiz.isVisible()
      $scope.quiz.update()
    }

    function addShortucts() {
      shortcut.add("Enter",
        function() {
          var elem_name = angular.element(document.activeElement).attr('name')
          if(elem_name == 'qlabel') {
            QuestionModel.addQuestion()
          }
          $scope.$apply()
        }, { "disable_in_input": false, 'propagate': true });
    };

  }])
