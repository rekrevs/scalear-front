'use strict';

angular.module('scalearAngularApp')
  .controller('quizDetailsCtrl', ['$stateParams', '$scope', '$log', '$state', 'ItemsModel', 'QuizModel', 'CourseEditor',
    function($stateParams, $scope, $log, $state, ItemsModel, QuizModel, CourseEditor) {

      $scope.quiz = ItemsModel.getQuiz($stateParams.quiz_id)
      ItemsModel.setSelectedItem($scope.quiz)
      var module = $scope.quiz.module()
      $scope.due_date_enabled = !CourseEditor.isDueDateDisabled($scope.quiz.due_date)
      $scope.disable_module_due_controls = CourseEditor.isDueDateDisabled(module.due_date)
      $scope.link_url = $state.href('course.module.courseware.quiz', { module_id: $scope.quiz.group_id, quiz_id: $scope.quiz.id }, { absolute: true })

      $scope.updateQuiz = function() {
        $scope.quiz.update()
      };

      $scope.updateDueDate = function() {
        var enabled = $scope.due_date_enabled
        var due_date = new Date($scope.quiz.due_date)
        if(CourseEditor.isDueDateDisabled($scope.quiz.due_date) && enabled)
          var years = -200
        else if(!CourseEditor.isDueDateDisabled($scope.quiz.due_date) && !enabled)
          var years = 200
        else
          var years = 0
        due_date.setFullYear(due_date.getFullYear() + years)

        var module_due_date = new Date(module.due_date)

        if(enabled && due_date > module_due_date) {
          due_date.setDate(module_due_date.getDate())
        }

        $scope.quiz.due_date = due_date
        $scope.due_date_enabled = !CourseEditor.isDueDateDisabled($scope.quiz.due_date)
        $scope.quiz.due_date_module = !$scope.disable_module_due_controls && $scope.due_date_enabled
      }


      $scope.visible = function(appearance_time) {
        return(new Date(appearance_time) <= new Date())
      }

      $scope.validateQuiz = function(column, data) {
        var quiz = { id: $scope.quiz.id, course_id: $scope.quiz.course_id, group_id: $scope.quiz.group_id }
        quiz[column] = data;
        var temp_quiz = QuizModel.createInstance(quiz);
        return temp_quiz.validate()
      };

    }
  ]);
