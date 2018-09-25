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
    $scope.removeAndSaveQuestions = function (){
      $scope.removeQuestion()
      setTimeout(function(){
        $scope.saveQuestions()
      },500) // time out to wait till error message vanish
    }
    $scope.removeAndSaveAnswer = function (index, question){
      $scope.removeAnswer(index, question)
      $scope.saveQuestions()
    }
    $scope.saving = false
    $scope.saveQuestions = function() {
      setTimeout(function(){
        if (autoSaveTimeOut){
          clearTimeout(autoSaveTimeOut)
        }
        autoSaveTimeOut=setTimeout(
          function(){
            if($scope.tform.$valid) {
              $scope.submitted = false;
              $scope.hide_alerts = true;
              $scope.saving=true
              $scope.saved=false
              QuestionModel.updateQuestions()
              .then(function(){
                $scope.currentDate = new Date().toLocaleString([], { hour12: true});
                $scope.saved = true
                $scope.saving= false
              })
            } else {
              $scope.submitted = true;
              $scope.hide_alerts = false;
            }
          },500)
        },500)
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
      shortcut.add("Shift+Enter",
        function() {
        });
    };

  }])
