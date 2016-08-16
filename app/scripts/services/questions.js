'use strict';

angular.module('scalearAngularApp')
  .factory('QuestionModel', ['Quiz', 'CourseEditor', 'ErrorHandler', 'ItemsModel', '$translate', function(Quiz, CourseEditor, ErrorHandler, ItemsModel, $translate) {

    var questions = []

    function getQuestions() {
      var quiz = ItemsModel.getSelectedItem();
      console.log("quiz", quiz);
      return Quiz.getQuestions({
          course_id: quiz.course_id,
          quiz_id: quiz.id
        })
        .$promise
    }

    function getEditableQuestions() {
      return getQuestions()
        .then(function(data) {
          questions = data.questions
          questions.forEach(function(question, index) {
            if(question.question_type.toUpperCase() == 'DRAG') {
              question.answers = []
              if(!data.answers[index].length) {
                addAnswer("", question)
              } else {
                question.answers = CourseEditor.expandDragAnswers(data.answers[index][0].id, data.answers[index][0].content, "quiz", question.id, data.answers[index][0].explanation)
              }
            } else {
              question.answers = data.answers[index]
              if(!data.answers[index].length && question.question_type != 'Free Text Question')
                addAnswer("", question)
            }
          })

          return questions
        })
    }

    function getSolvableQuestions() {
      return getQuestions()
        .then(function(data) {
          questions = data.questions
          return data
        })
    }

    function addQuestion() {
      var quiz = ItemsModel.getSelectedItem();
      var new_question = { quiz_id: quiz.id, content: "", question_type: "MCQ" }
      new_question.answers = [];
      questions.push(new_question);
      addAnswer("", new_question);
    }

    function updateQuestions() {
      var quiz = ItemsModel.getSelectedItem();
      var data = []
      for(var index in questions) {
        if(questions[index].question_type.toUpperCase() == 'DRAG') {
          var drag_answers = CourseEditor.mergeDragAnswers(questions[index].answers, "quiz", questions[index].id)
          questions[index].answers.forEach(function(ans) {
            if(ans.id && drag_answers.id == null) {
              drag_answers.id = ans.id
              return
            }
          })
          var question = angular.copy(questions[index])
          question.answers = [drag_answers]
          data[index] = question
        } else {
          data[index] = questions[index]
        }
      }
      return Quiz.updateQuestions({
          course_id: quiz.course_id,
          quiz_id: quiz.id
        }, { questions: data })
        .$promise
    }

    function addAnswer(ans, question) {
      var new_answer = CourseEditor.newAnswer(ans, "", "", "", "", "quiz", question.id)
      question.answers.push(new_answer)
    }

    function removeAnswer(index, question) {
      if(question.answers.length > 1) {
        question.answers.splice(index, 1);
      } else {
        ErrorHandler.showMessage('Error ' + ': ' + $translate("editor.cannot_delete_alteast_one_answer"), 'errorMessage', 4000, "error");
      }
    }

    function removeQuestion(index) {
      questions.splice(index, 1);
    }

    function addHeader() {
      var quiz = ItemsModel.getSelectedItem();
      var new_header = { quiz_id: quiz.id, content: "", question_type: "header" }
      questions.push(new_header)
    }

    function removeHeader(index) {
      removeQuestion(index)
    }

    return {
      getQuestions: getQuestions,
      getEditableQuestions: getEditableQuestions,
      getSolvableQuestions:getSolvableQuestions,
      addQuestion: addQuestion,
      removeQuestion: removeQuestion,
      updateQuestions: updateQuestions,
      addAnswer: addAnswer,
      removeAnswer: removeAnswer,
      addHeader: addHeader,
      removeHeader: removeHeader
    }
  }])
