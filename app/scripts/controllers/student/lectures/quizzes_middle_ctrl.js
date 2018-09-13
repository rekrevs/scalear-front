'use strict';

angular.module('scalearAngularApp')
  .controller('studentQuizMiddleCtrl', ['$scope', 'Course', '$stateParams', '$controller', 'Quiz', '$log', 'CourseEditor', '$state', 'Page', 'ScalearUtils', '$translate', 'ContentNavigator', 'CourseModel', 'ItemsModel', 'QuestionModel','ErrorHandler', 'MobileDetector', function($scope, Course, $stateParams, $controller, Quiz, $log, CourseEditor, $state, Page, ScalearUtils, $translate, ContentNavigator, CourseModel, ItemsModel, QuestionModel,ErrorHandler, MobileDetector) {
    $controller('surveysCtrl', { $scope: $scope });

    $scope.course = CourseModel.getSelectedCourse()
    $scope.quiz = ItemsModel.getQuiz($stateParams.quiz_id)

    var init = function() {
      if(!MobileDetector.isPhone()){
        ContentNavigator.open()
      }
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
          if (data.status !== null){
            $scope.selectionUpdateTime=new Date(data.status.updated_at).toLocaleString([], { hour12: true })
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

    $scope.nextItem = function() {
      var next_state = "course.module.courseware." + $scope.next_item.class_name
      var s = $scope.next_item.class_name + "_id"
      var to = {}
      to[s] = $scope.next_item.id
      to["module_id"] = $scope.next_item.group_id
      $log.debug(next_state)
      $state.go(next_state, to);
    }


    $scope.selectionUpdateTime
    $scope.saveQuiz = function(action) {
      $scope.save_inprogress = true
      if($scope.form.$valid || action == "save") { //validate only if submit.
        $scope.submitted = false;
        $scope.quiz.studentSolve($scope.studentAnswers, action)
          .then(function(data) {
            if (data.status !== null){
              $scope.selectionUpdateTime=new Date(data.status.updated_at).toLocaleString([], { hour12: true })
            }
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
              console.log("data.done",data.done)
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
          return $translate.instant('quizzes.already_submitted') + ' ' + $scope.quiz.quiz_type + ' ' + $translate.instant("quizzes.no_more_attempts")
        else if(key == "due")
          return $translate.instant("events.due_date_passed") + " - " + $scope.alert_messages[key][0] + " (" + $scope.alert_messages[key][1] + " " + $scope.alert_messages[key][2] + ") " + $translate.instant("time.ago")
        else if(key == "today")
          return $translate.instant("events.due") + " " + $translate.instant("time.today") + " " + $translate.instant("at") + " " + $scope.alert_messages[key]
      }
    }

    $scope.$watch('correct',function(correct){
      if (correct){
        //number of keys in the 'correct' object whose value is 1 or 3 (1 is correct for mcq/ocq/drag, 3 is correct for free text with match)
        $scope.numberOfCorrectAnswers = Object.values(correct).reduce(function(n,value){return n + (value == '1' || value == '3')},0);
        $scope.pass = $scope.numberOfCorrectAnswers >= $scope.quiz.correct_question_count;
      }
    })


    if($scope.quiz){
      ItemsModel.setSelectedItem($scope.quiz)
      $scope.course.warning_message = null
      $scope.studentAnswers = {};
      $scope.passed_requirments = true
      Page.setTitle($scope.quiz.name)
      init();
    }

  }]);
