'use strict';

angular.module('scalearAngularApp')
  .directive('studentQuiz', ['Lecture', '$stateParams', '$log', '$rootScope', function(Lecture, $stateParams, $log, $rootScope) {
    return {
      scope: {
        quiz: "=",
        studentAnswers: "=",
        submitted: "=",
        correct: "=",
        explanation: "="
      },
      restrict: 'E',
      templateUrl: '/views/student/lectures/student_quiz.html',
      link: function(scope) {
        scope.index = 0
        scope.drag_explanation = {}
        scope.getIndex = function() {
          return ++scope.index
        }
        scope.updateValues = function(ques) {
          scope.values = 0;
          if(scope.studentAnswers[ques] == "" && scope.studentAnswers[ques] == null) // ocq/mcq not solved
            scope.values = 0;
          else if(typeof(scope.studentAnswers[ques]) == "number" || (typeof(scope.studentAnswers[ques]) == "string" && scope.studentAnswers[ques].length > 0)) //ocq solved
            scope.values = 1;
          else {
            for(var element in scope.studentAnswers[ques]) {
              if(scope.studentAnswers[ques][element] == true)
                scope.values = 1;
            }
          }
          return scope.values
        };
        scope.valid = function(ques) {
          return scope.updateValues(ques) != 0
        }

        scope.getExplanationPop = function(answer_id, drag_id) {
          return {
            content: '<div ng-bind-html="explanation[' + answer_id + ']' + ((drag_id != null) ? '[' + drag_id + ']' : '') + '"></div>',
            html: true,
            trigger: $rootScope.is_mobile ? 'click' : 'hover',
            placement: "left"
          }
        }

        scope.$watch('explanation', function(newval) {
        	if(newval){
	          if(Object.keys(scope.explanation).length) {
	            updateExplanation()
	          }
	        }
        })

        function updateExplanation() {
            scope.quiz.questions.forEach(function(question) {
              if(question.question_type.toUpperCase() !== "DRAG") {
                question.answers.forEach(function(answer) {
                  answer.options = scope.explanation[answer.id]?scope.getExplanationPop(answer.id) : '';
                })
              } else {
                scope.studentAnswers[question.id].forEach(function(answer, idx) {
                  scope.drag_explanation[idx] = scope.explanation[question.answers[0].id]? scope.getExplanationPop(question.answers[0].id, idx) : '';
                })
              }
            })
          
        }

      }
    };
  }]);
