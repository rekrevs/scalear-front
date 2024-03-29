'use strict';

angular.module('scalearAngularApp')
  .factory('CourseEditor', ['$window', function($window) {
    var x = {
      capitalize: function(s) {
        return s[0].toUpperCase() + s.slice(1);
      },
      expandDragAnswers: function(id, answers, type, question_id, explanations) {
        var all_answers = [];
        if(!(answers instanceof Array)) {
          answers = [answers];
        }
        for(var answer in answers) {
          // var new_ans=x.newAnswer(answers[answer],"","","","",type, question_id);
          var new_ans = x.newAnswer(answers[answer], "", "", "", "", type, question_id, explanations[answer]);
          if(answer == 0)
            new_ans.id = id;
          all_answers.push(new_ans);
        }
        return all_answers;
      },
      mergeDragAnswers: function(answers, type, question_id) {
        var all_answers = []
        var all_explanation = []
        answers.forEach(function(elem) {
          if(type == "quiz") {
            all_answers.push(elem.content)
            all_explanation.push(elem.explanation || "")
          } else {
            all_answers.push(elem.answer)
            all_explanation.push(elem.explanation || "")
          }
        });
        return x.newAnswer(all_answers, "", "", "", "", type, question_id, all_explanation);
      },
      mergeDragPos: function(answers) {
        var all_pos = []
        answers.forEach(function(elem) {
          all_pos.push(parseInt(elem.pos))
        });
        return all_pos
      },
      newAnswer: function(ans, h, w, l, t, type, question_id, explanation) {
        if(type != "quiz") {
          var y = {
            answer: ans || "",
            correct: false,
            explanation: explanation || "",
            online_quiz_id: question_id,
            height: h || 0,
            width: w || 0,
            xcoor: l || 0,
            ycoor: t || 0,
            sub_xcoor: l || 0,
            sub_ycoor: (t - 0.09) || 0
          }
        } else {
          var y = {
            content: ans || "",
            correct: false,
            question_id: question_id,
            explanation: explanation || ""
          }
        }
        return y;
      },
      isDueDateDisabled: function(due_date) {
        var due = new Date(due_date)
        var today = new Date()
        return due.getFullYear() > today.getFullYear() + 100
      }
    }
    return x;
  }])
