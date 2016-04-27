'use strict';

angular.module('scalearAngularApp')
  .controller('studentInclassCtrl', ['$scope', 'ContentNavigator', 'MobileDetector', 'Module', '$state', '$log', '$timeout', 'Lecture', 'Page', 'WizardHandler', '$cookieStore', function($scope, ContentNavigator, MobileDetector, Module, $state, $log, $timeout, Lecture, Page, WizardHandler, $cookieStore) {

    Page.setTitle('In-class')
      // if(!MobileDetector.isPhone())
    ContentNavigator.close()
    var self_answers = $cookieStore.get('self_answers') || []
    var group_answers = $cookieStore.get('group_answers') || []
      // $scope.messages = ["The in-class session has not started", "The in-class question has not started.", "Individual", "Group", "Discussion", "End"]
    var states = ['noclass', 'intro', 'self', 'group', 'discussion']
    $scope.module = $scope.course.selected_module
    $scope.getInclassStudentStatus = function() {
      $scope.loading = true
      Module.getInclassStudentStatus({
          module_id: $state.params.module_id,
          course_id: $state.params.course_id,
          status: $scope.inclass_status || 0,
          quiz_id: $scope.quiz ? $scope.quiz.id : -1
        },
        function(data) {
          $scope.loading = false
          if (data.updated) {
            $scope.quiz = data.quiz
            $scope.quiz.in_group = false
            $scope.group_quiz = angular.copy($scope.quiz)
            $scope.group_quiz.in_group = true
            $scope.lecture = data.lecture
            $('.answer_choices input').attr('type', $scope.quiz.question_type == "MCQ" ? "checkbox" : "radio")
            // var force_state_to
            if (self_answers.length > 0) {
              self_answers.forEach(function(answer) {
                var filtered_answers = $scope.quiz.answers.filter(function(a) {
                  return a.id == answer.id
                })
                if(filtered_answers.length)
                  filtered_answers[0].selected = true
              })
              // if (data.status == 2)
              //   force_state_to = "self_answered"
            }
            if (group_answers.length > 0) {
              group_answers.forEach(function(answer) {
                var filtered_answers =$scope.group_quiz.answers.filter(function(a) {
                  return a.id == answer.id
                })
                if(filtered_answers.length)
                  filtered_answers[0].selected = true
              })
              // if (data.status == 3)
              //   force_state_to = "group_answered"
            }
          }

          if ($scope.inclass_status != data.status) {
            $scope.inclass_status = data.status
            WizardHandler.wizard().goTo(states[$scope.inclass_status]) //force_state_to ||
          } else if ($scope.inclass_status == 2 || $scope.inclass_status == 3) {
            $scope.show_wait = true
            $timeout(function() {
              $scope.show_wait = false
            }, 5000)
          }
        }
      )
    }

    $scope.getInclassStudentStatus()

    var clearSelectedAnswer = function(quiz) {
      quiz.answers.forEach(function(ans) {
        ans.selected = false
      })
      if ($scope.inclass_status == 2) {
        self_answers = []
      } else if ($scope.inclass_status == 3) {
        group_answers = []
      }
    }

    $scope.sendAnswers = function(quiz, note_text) {
      $scope.removeNotification()
      var selected_answers
      if (quiz.question_type == "OCQ" || quiz.question_type == "MCQ") {
        selected_answers = []
        quiz.answers.forEach(function(answer) {
          if (answer.selected)
            selected_answers.push(answer.id)
        })
        if (selected_answers.length == 0) {
          $scope.showNotification("lectures.messages.please_choose_an_answer")
          return
        }

        if (quiz.question_type == "OCQ" && selected_answers.length == 1)
          selected_answers = selected_answers[0]
      }
      quiz.done = true
      $scope.saveQuizAnswer(quiz, selected_answers)
      console.log(quiz)
      if(note_text)
        $scope.saveNote((quiz.in_group ? "In Class Group Note: " : "In Class Self Note: ") + note_text, Math.ceil(quiz.time))
      WizardHandler.wizard().next()
    }

    $scope.saveQuizAnswer = function(quiz, selected_answers) {
      Lecture.saveOnline({
        course_id: $state.params.course_id,
        lecture_id: $scope.lecture.id
      }, {
        quiz: quiz.id,
        answer: selected_answers,
        in_group: quiz.in_group
      })
    }

    $scope.saveNote = function(note_text, time) {
      Lecture.saveNote({
        course_id: $state.params.course_id,
        lecture_id: $scope.lecture.id,
        note_id: null
      }, {
        data: note_text,
        time: time
      });
    }

    $scope.showNotification = function(msg) {
      $scope.alert_message = msg
    }

    $scope.removeNotification = function() {
      $scope.alert_message = ""
    }

    $scope.retry = function(quiz) {
      quiz.done = false
      clearSelectedAnswer(quiz)
    }

    $scope.intToChar = function(n) {
      return String.fromCharCode(97 + n).toUpperCase()
    }

    $scope.selectAnswer = function(answer, quiz) {
      if (!answer.selected) {
        if ($scope.quiz.question_type == "OCQ") {
          clearSelectedAnswer(quiz)
        }
        answer.selected = true
        if ($scope.inclass_status == 2) {
          self_answers.push(answer)
        } else if ($scope.inclass_status == 3) {
          group_answers.push(answer)
        }
      } else {
        if ($scope.inclass_status == 2) {
          self_answers.splice(self_answers.indexOf(answer), 1)
        } else if ($scope.inclass_status == 3) {
          group_answers.splice(group_answers.indexOf(answer), 1)
        }
        answer.selected = false
      }
      $cookieStore.remove('self_answers')
      $cookieStore.remove('group_answers')
      $cookieStore.put('self_answers', self_answers)
      $cookieStore.put('group_answers', group_answers)
      console.log(self_answers, group_answers)
    }


  }]);
