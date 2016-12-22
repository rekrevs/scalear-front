'use strict';

angular.module('scalearAngularApp')
  .controller('studentQuizMiddleCtrl', ['$scope', 'Course', '$stateParams', '$controller', 'Quiz', '$log', 'CourseEditor', '$state', 'Page', 'ScalearUtils', '$translate', 'ContentNavigator', 'CourseModel', 'ItemsModel', 'QuestionModel', function($scope, Course, $stateParams, $controller, Quiz, $log, CourseEditor, $state, Page, ScalearUtils, $translate, ContentNavigator, CourseModel, ItemsModel, QuestionModel) {
    $controller('surveysCtrl', { $scope: $scope });

    $scope.course = CourseModel.getSelectedCourse()
    $scope.quiz = ItemsModel.getQuiz($stateParams.quiz_id)
    ItemsModel.setSelectedItem($scope.quiz)

    $scope.course.warning_message = null
    $scope.studentAnswers = {};
    $scope.passed_requirments = true

    Page.setTitle($scope.quiz.name)

    var init = function() {
      ContentNavigator.open()
      QuestionModel.getSolvableQuestions()
        .then(function(data) {
          var quiz = data.quiz
          if(!$scope.preview_as_student) {
            for(var item_type in quiz.requirements) {
              for(var index in quiz.requirements[item_type]) {
                var item = ItemsModel.getById(quiz.requirements[item_type][index], item_type)
                if(!item.done) {
                  $scope.passed_requirments = false
                }
              }
            }
          }
          $scope.quiz.questions = data.questions
          $scope.studentAnswers = data.quiz_grades;
          $scope.status = data.status;
          $scope.correct = data.correct;
          $scope.explanation = data.explanation;
          $scope.next_item = data.next_item;
          $scope.alert_messages = data.alert_messages
          $scope.course.warning_message = setupWarningMsg($scope.alert_messages)
          $scope.quiz.questions.forEach(function(question, index) {
            question.answers = data.answers[index]
            if(question.question_type.toUpperCase() == "DRAG" && $scope.studentAnswers[question.id] == null) // if drag was not solved, put student answer from shuffled answers.
              $scope.studentAnswers[question.id] = question.answers[0].content
          });
        })

      if($scope.quiz.quiz_type == 'survey')
        $scope.getSurveyCharts("display_only", $scope.quiz.group_id, $scope.quiz.id)
    }

    init();

    $scope.nextItem = function() {
      var next_state = "course.module.courseware." + $scope.next_item.class_name
      var s = $scope.next_item.class_name + "_id"
      var to = {}
      to[s] = $scope.next_item.id
      to["module_id"] = $scope.next_item.group_id
      $log.debug(next_state)
      $state.go(next_state, to);
    }

    $scope.saveQuiz = function(action) {
      $scope.save_inprogress = true
      if($scope.form.$valid || action == "save") { //validate only if submit.
        $scope.submitted = false;
        $scope.quiz.studentSolve($scope.studentAnswers, action)
          .then(function(data) {
            $scope.save_inprogress = false
            $scope.status = data.status;
            $scope.alert_messages = data.alert_messages;
            $scope.course.warning_message = setupWarningMsg($scope.alert_messages)
            $scope.next_item = data.next_item;
            if(data.correct)
              $scope.correct = data.correct;
            if(data.explanation)
              $scope.explanation = data.explanation;
            if(data.done[2])
              $scope.quiz.markDone()
          })
      } else { // client validation error.
        $scope.save_inprogress = false
        $scope.submitted = true;
      }
    };

    var setupWarningMsg = function(alert_messages) {
      for(var key in alert_messages) {
        if(key == "submit")
          return $translate('quizzes.already_submitted') + ' ' + $scope.quiz.quiz_type + ' ' + $translate("quizzes.no_more_attempts")
        else if(key == "due")
          return $translate("events.due_date_passed") + " - " + $scope.alert_messages[key][0] + " (" + $scope.alert_messages[key][1] + " " + $scope.alert_messages[key][2] + ") " + $translate("time.ago")
        else if(key == "today")
          return $translate("events.due") + " " + $translate("time.today") + " " + $translate("at") + " " + $scope.alert_messages[key]
      }
    }

  }]);
