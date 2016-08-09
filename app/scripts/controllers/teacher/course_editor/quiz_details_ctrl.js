'use strict';

angular.module('scalearAngularApp')
  .controller('quizDetailsCtrl', ['$stateParams', '$scope', '$log', '$state', 'ItemsModel', 'QuizModel', 'CourseEditor',
    function($stateParams, $scope, $log, $state, ItemsModel, QuizModel, CourseEditor) {

      $scope.quiz = ItemsModel.getQuiz($stateParams.quiz_id).setAsSelected()
      var module = $scope.quiz.module()
      $scope.due_date_enabled = !CourseEditor.isDueDateDisabled($scope.quiz.due_date)
      $scope.disable_module_due_controls = CourseEditor.isDueDateDisabled(module.due_date)
      $scope.link_url = $state.href('course.module.courseware.quiz', { module_id: $scope.quiz.group_id, quiz_id: $scope.quiz.id }, { absolute: true })

      $scope.updateQuiz = function() {
        $scope.quiz.update()
      };

      $scope.updateDueDate = function() {
        var enabled = $scope.quiz.due_date_enabled
        var due_date = new Date($scope.quiz.due_date)
        var week = 7
        if(isDueDateDisabled($scope.quiz.due_date) && enabled)
          var years = -200
        else if(!isDueDateDisabled($scope.quiz.due_date) && !enabled)
          var years = 200
        else
          var years = 0
        due_date.setFullYear(due_date.getFullYear() + years)

        var appearance_date = new Date($scope.quiz.appearance_time)
        if(due_date <= appearance_date) {
          due_date = appearance_date
          due_date.setDate(appearance_date.getDate() + week)
        }

        $scope.quiz.due_date = due_date
        $scope.quiz.due_date_enabled = !isDueDateDisabled($scope.quiz.due_date)
        $scope.quiz.due_date_module = !$scope.quiz.disable_module_due_controls && $scope.quiz.due_date_enabled
      }


      $scope.visible = function(appearance_time) {
        return(new Date(appearance_time) <= new Date())
      }

      $scope.validateQuiz = function(column, data) {
        var quiz = {id: $scope.quiz.id, course_id: $scope.quiz.course_id, group_id: $scope.quiz.group_id}
        quiz[column] = data;
        var temp_quiz = QuizModel.createInstance(quiz);
        return temp_quiz.validate()
      };

    }
  ]);
