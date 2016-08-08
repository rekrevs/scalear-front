'use strict';

angular.module('scalearAngularApp')
  .controller('quizMiddleCtrl', ['$stateParams', '$scope', 'Quiz', 'CourseEditor', '$translate', '$log', '$rootScope', 'ErrorHandler', '$timeout', '$state', '$q', 'ItemsModel', 'QuizModel', 'QuestionModel', function($stateParams, $scope, Quiz, CourseEditor, $translate, $log, $rootScope, ErrorHandler, $timeout, $state, $q, ItemsModel, QuizModel, QuestionModel) {

    $scope.quiz = ItemsModel.getQuiz($stateParams.quiz_id)
    ItemsModel.setSelectedItem($scope.quiz)
    $scope.publish_state = getPublishStatus($scope.quiz)
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

    $scope.getQuestions()
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
      if($scope.tform.$valid) {
        $scope.submitted = false;
        $scope.hide_alerts = true;
        QuestionModel.updateQuestions();
      } else {
        $scope.submitted = true;
        $scope.hide_alerts = false;
      }
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

    function savePublish(publishstate) {
      $scope.saveQuestions()
      $scope.quiz.appearance_time = publishstate ? new Date() : $scope.course.end_date
      $scope.quiz.update()
        .then(function(quiz) {
          $scope.publish_state = getPublishStatus(quiz)
        })
    }

    function getPublishStatus(quiz) {
      return(new Date() < new Date(quiz.appearance_time))
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
