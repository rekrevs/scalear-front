'use strict';

angular.module('scalearAngularApp')
  .controller('quizMiddleCtrl', ['$stateParams', '$scope', 'Quiz', 'CourseEditor', '$translate', '$log', '$rootScope', 'ErrorHandler', '$timeout', '$state', '$q', 'ItemsModel', 'QuizModel', 'QuestionModel','CourseModel','ModuleModel', function($stateParams, $scope, Quiz, CourseEditor, $translate, $log, $rootScope, ErrorHandler, $timeout, $state, $q, ItemsModel, QuizModel, QuestionModel, CourseModel, ModuleModel) {

    $scope.quiz = ItemsModel.getQuiz($stateParams.quiz_id)
    ItemsModel.setSelectedItem($scope.quiz)
    $scope.course = CourseModel.getSelectedCourse()
    $scope.module = ModuleModel.getSelectedModule()
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
      // $scope.quiz.appearance_time = publishstate ? $scope.module.appearance_time : $scope.course.end_date
      var appearance_time = new Date($scope.module.appearance_time)
      $scope.quiz.appearance_time = publishstate ? appearance_time : appearance_time.setFullYear(appearance_time.getFullYear() + 200)
      $scope.quiz.appearance_time = appearance_time
      $scope.quiz.appearance_time_module = false

      console.log($scope.quiz.appearance_time)
      $scope.quiz.update()
        .then(function(quiz) {
          console.log(getPublishStatus(quiz))
          $scope.publish_state = getPublishStatus(quiz)
        })
    }

    function getPublishStatus(quiz) {
      console.log(new Date())
      console.log(new Date(quiz.appearance_time))

        return  (new Date(quiz.appearance_time) >= new Date())
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
