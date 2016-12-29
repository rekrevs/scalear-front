'use strict';

angular.module('scalearAngularApp')
  .factory('OnlineQuiz', ['$resource', '$http', '$stateParams', 'scalear_api', 'headers', '$rootScope', '$translate', function($resource, $http, $stateParams, scalear_api, headers, $rootScope, $translate) {

    $http.defaults.useXDomain = true;
    return $resource(scalear_api.host + '/:lang/online_quizzes/:online_quizzes_id/:action', { lang: $translate.uses() }, {
      'update': { method: 'PUT', headers: headers },
      'destroy': { method: 'DELETE', headers: headers },
      'getQuizList': { method: 'GET', params: { action: 'get_quiz_list_angular' }, headers: headers },
      'validateName': { method: 'PUT', params: { action: 'validate_name' }, headers: headers },
      'voteForReview': { method: 'POST', params: { action: 'vote_for_review' }, headers: headers },
      'unvoteForReview': { method: 'POST', params: { action: 'unvote_for_review' }, headers: headers },
      'hideResponses': { method: 'POST', params: { action: 'hide_responses' }, headers: headers },
      'updateInclassSession': { method: 'POST', ignoreLoadingBar: true, params: { action: 'update_inclass_session' }, headers: headers },
      'getChartData': { method: 'GET', ignoreLoadingBar: true, params: { action: 'get_chart_data' }, headers: headers },
      'getInclassSessionVotes': { method: 'GET', ignoreLoadingBar: true, params: { action: 'get_inclass_session_votes' }, headers: headers }
    });

  }])
  .factory('VideoQuizModel', ['OnlineQuiz', '$rootScope', 'ItemsModel', '$q', 'VideoInformation', 'Lecture', 'CourseEditor', 'ErrorHandler', '$filter', 'ScalearUtils', function(OnlineQuiz, $rootScope, ItemsModel, $q, VideoInformation, Lecture, CourseEditor, ErrorHandler, $filter, ScalearUtils) {

    var selected_video_quiz = null

    function getQuizzes() {
      var lecture = ItemsModel.getSelectedItem();
      return OnlineQuiz.getQuizList({ lecture_id: lecture.id })
        .$promise
        .then(function(data) {
          var quiz_list = []
          data.quizList.forEach(function(q) {
            var quiz = createInstance(q)
            quiz_list.push(quiz)
            $rootScope.$broadcast("Lecture:" + lecture.id + ":add_to_timeline", quiz.time, 'quiz', quiz)
          })
          return quiz_list
        })

    }

    function getFinalQuizTime(time, lecture) {
      var new_time = parseInt(time)
      lecture.timeline.items.forEach(function(item) {
        if(item.type == 'quiz') {
          var quiz_time = parseInt(item.data.time)
          if(quiz_time == new_time + 1)
            new_time += 2
          else if(quiz_time == new_time)
            new_time += 1
        }
      })
      return new_time
    }

    function addVideoQuiz(insert_time, quiz_type, question_type) {
      var lecture = ItemsModel.getSelectedItem();
      var video_duration = VideoInformation.duration

      if(insert_time < 1) {
        insert_time = 1
      }
      insert_time = getFinalQuizTime(insert_time, lecture)

      if(insert_time >= video_duration) {
        insert_time = video_duration - 2
      }

      var start_time = insert_time
      var end_time = insert_time

      if(lecture.inclass || lecture.distance_peer) {
        var offset = 5
        var caluclated_offset = (offset * video_duration) / 100

        start_time = (start_time - caluclated_offset < 0) ? 0 : start_time - caluclated_offset
        end_time = (end_time + caluclated_offset > video_duration - 1) ? video_duration - 1 : end_time + caluclated_offset
      }

      return Lecture.newQuiz({
          course_id: lecture.course_id,
          lecture_id: lecture.id,
          time: insert_time,
          start_time: start_time,
          end_time: end_time,
          quiz_type: quiz_type,
          ques_type: question_type,
          inclass: lecture.inclass
        })
        .$promise
        .then(function(data) {
          var quiz = createInstance(data.quiz)
          // quiz.inclass = lecture.inclass
          $rootScope.$broadcast("Lecture:" + lecture.id + ":add_to_timeline", quiz.time, 'quiz', quiz)
          return quiz;
        })

    }

    function isInstance(instance) {
      return(instance.instanceType && instance.instanceType() == "VideoQuiz");
    }

    function setSelectedVideoQuiz(quiz) {
      // quiz.selected = true
      // console.log()
      quiz.formatedTime = $filter('format')(quiz.time)
      quiz.start_formatedTime = $filter('format')(quiz.start_time)
      quiz.end_formatedTime = $filter('format')(quiz.end_time)
      
      // #####  check for quiz.inclass and for new table for 
      if(!(quiz.inclass && quiz.inclass_session))
        quiz.inclass_session = { intro: 120, self: 120, in_group: 120, discussion: 120 }
      quiz.intro_formatedTime = $filter('format')(quiz.intro)
      quiz.self_formatedTime = $filter('format')(quiz.self)
      quiz.group_formatedTime = $filter('format')(quiz.in_group)
      quiz.discussion_formatedTime = $filter('format')(quiz.discussion)
      selected_video_quiz = quiz
      return getSelectedVideoQuiz()
    }

    function getSelectedVideoQuiz() {
      return selected_video_quiz
    }

    function clearSelectedVideoQuiz() {
      selected_video_quiz = null
    }


    function createInstance(video_quiz) {

      if(isInstance(video_quiz)) {
        return video_quiz;
      }

      function addAnswer(ans, height, width, left, top) {
        var new_answer = CourseEditor.newAnswer(ans, height, width, left, top, "lecture", video_quiz.id)
        video_quiz.answers.push(new_answer)
        if(video_quiz.question_type.toLowerCase() == "drag") {
          var max = Math.max.apply(Math, video_quiz.allPos)
          new_answer.pos = max == -Infinity ? 0 : max + 1
          video_quiz.allPos = mergeDragPos(video_quiz.answers)
        }
      }

      function removeAnswer(index) {
        video_quiz.answers.splice(index, 1);
        if(video_quiz.question_type.toLowerCase() == "drag") {
          video_quiz.allPos = mergeDragPos(video_quiz.answers)
        }
      }

      function addFreeTextAnswer() {
        var answer_width = 250,
          answer_height = 100,
          element = angular.element("#ontop"),
          top = element.height() / 3,
          left = element.width() / 4,
          the_top = top / element.height(),
          the_left = left / element.width(),
          the_width = answer_width / element.width(),
          the_height = answer_height / (element.height());
        addAnswer("", the_height, the_width, the_left, the_top)
      }

      function addHtmlAnswer(ans) {
        var new_answer = CourseEditor.newAnswer(ans, "", "", "", "", "lecture", video_quiz.id)
        video_quiz.answers.push(new_answer)
      }

      function removeHtmlAnswer(index) {
        if(video_quiz.answers.length <= 1) {
          ErrorHandler.showMessage('Error ' + ': ' + $translate("editor.cannot_delete_alteast_one_answer"), 'errorMessage', 4000, "error");
        } else
          video_quiz.answers.splice(index, 1);
      }

      function mergeDragPos(answers) {
        var all_pos = []
        answers.forEach(function(elem, i) {
          elem.pos = i
          all_pos.push(parseInt(elem.pos))
        });
        return all_pos
      }

      function updateAnswers() {
        var answers = video_quiz.answers
        if(isDragTextQuiz()) {
          var obj = CourseEditor.mergeDragAnswers(video_quiz.answers, "lecture", video_quiz.id)
          video_quiz.answers.forEach(function(ans) {
            if(ans.id && obj.id == null) {
              obj.id = ans.id
              return
            }
          })
          answers = [obj]
        }
        return Lecture.updateAnswers({
          course_id: video_quiz.course_id,
          lecture_id: video_quiz.lecture_id,
          online_quiz_id: video_quiz.id
        }, {
          answer: answers,
          quiz_title: video_quiz.question,
          match_type: video_quiz.match_type
        }).$promise
      }

      function getQuizAnswers(argument) {
        return isInVideoQuiz() ? getInVideoQuizAnswers() : getTextQuizAnswers()
      }

      function getInVideoQuizAnswers() {
        return Lecture.getQuizData({
            "course_id": video_quiz.course_id,
            "lecture_id": video_quiz.lecture_id,
            "quiz": video_quiz.id
          })
          .$promise
          .then(function(data) {
            video_quiz.answers = data.answers
            if(video_quiz.question_type.toLowerCase() == "drag")
              video_quiz.allPos = mergeDragPos(data.answers)
            if(video_quiz.question_type.toLowerCase() == "free text question" && video_quiz.answers.length == 0) {
              addFreeTextAnswer(video_quiz)
            }
          })
      }

      function getTextQuizAnswers() {
        return Lecture.getHtmlData({
            "course_id": video_quiz.course_id,
            "lecture_id": video_quiz.lecture_id,
            "quiz": video_quiz.id
          })
          .$promise
          .then(function(data) {
            if(video_quiz.question_type.toLowerCase() == 'drag') {
              video_quiz.answers = []
              if(!data.answers.length)
                addHtmlAnswer()
              else
                video_quiz.answers = CourseEditor.expandDragAnswers(data.answers[0].id, data.answers[0].answer, "lecture", video_quiz.id, data.answers[0].explanation)
            } else {
              video_quiz.answers = data.answers
              if(!video_quiz.answers.length)
                addHtmlAnswer()
            }
          })
      }

      function deleteQuiz() {
        return OnlineQuiz.destroy({ online_quizzes_id: video_quiz.id }, {})
          .$promise
          .then(function(data) {
            $rootScope.$broadcast("Lecture:" + video_quiz.lecture_id + ":remove_from_timeline", video_quiz, 'quiz')
          })
      }

      function update() {
              var lecture = ItemsModel.getSelectedItem();
              // console.log(lecture)
        if(lecture.inclass || lecture.distance_peer) {
          video_quiz.intro = ScalearUtils.arrayToSeconds(video_quiz.intro_formatedTime.split(':'))
          video_quiz.self = ScalearUtils.arrayToSeconds(video_quiz.self_formatedTime.split(':'))
          video_quiz.in_group = ScalearUtils.arrayToSeconds(video_quiz.group_formatedTime.split(':'))
          video_quiz.discussion = ScalearUtils.arrayToSeconds(video_quiz.discussion_formatedTime.split(':'))
        }
        var fraction = video_quiz.time % 1
        var new_time = ScalearUtils.arrayToSeconds(video_quiz.formatedTime.split(':'))
        if(video_quiz.time != new_time + fraction){
          video_quiz.time  = new_time
          if(!lecture.inclass && !lecture.distance_peer){
            video_quiz.start_time = video_quiz.end_time = new_time
          }
        }

        return OnlineQuiz.update({ online_quizzes_id: video_quiz.id }, {
          online_quiz: {
            time: video_quiz.time,
            start_time: video_quiz.start_time,
            end_time: video_quiz.end_time,
            question: video_quiz.question,
            inclass: video_quiz.inclass,
            graded: video_quiz.graded,
            intro: video_quiz.intro,
            self: video_quiz.self,
            in_group: video_quiz.in_group,
            discussion: video_quiz.discussion,
            display_text: video_quiz.display_text
          },
        }).$promise
      }

      function validateName() {
        var quiz = {}
        quiz.question = video_quiz.question;
        return OnlineQuiz.validateName({ online_quizzes_id: video_quiz.id }, quiz)
          .$promise
          .catch(function(data) {
            var errors = {}
            if(data.status == 422)
              errors.name_error = data.data.errors.join()
            else
              errors.name_error = 'Server Error'
            return errors
          })
      }

      function validateTime() {
        var lecture = ItemsModel.getSelectedItem();
        var deferred = $q.defer()
        var errors = {}
        errors.time_error = ScalearUtils.validateTimeWithDuration(video_quiz.formatedTime, VideoInformation.duration)

        if(lecture.inclass || lecture.distance_peer) {
          errors.intro_timer_error = ScalearUtils.validateTimeWithoutDuration(video_quiz.intro_formatedTime, VideoInformation.duration)
          errors.self_timer_error = ScalearUtils.validateTimeWithoutDuration(video_quiz.self_formatedTime, VideoInformation.duration)
          errors.group_timer_error = ScalearUtils.validateTimeWithoutDuration(video_quiz.group_formatedTime, VideoInformation.duration)
          errors.discussion_timer_error = ScalearUtils.validateTimeWithoutDuration(video_quiz.discussion_formatedTime, VideoInformation.duration)
        }
        if(errors.time_error || errors.intro_timer_error || errors.self_timer_error || errors.group_timer_error || errors.discussion_timer_error) {
          deferred.reject(errors)
        } else {
          deferred.resolve()
        }
        return deferred.promise
      }

      function validate() {
        return validateName()
          .then(function(data) {
            if(!(data.name_error ) ){
              return validateTime()
              .catch(function(errors){
                // console.log(errors)
                return {errors: errors}
              })
            }
            else{
                return {errors: data}
            }
          })
      }

      function instanceType() {
        return 'VideoQuiz'
      }

      function setAsSelected() {
        return setSelectedVideoQuiz(video_quiz)
      }

      function isTextVideoQuiz() {
        return(video_quiz.quiz_type == "html");
      }

      function isInVideoQuiz() {
        return(video_quiz.quiz_type == "invideo");
      }

      function isTextQuiz() {
        return(isTextVideoQuiz() || isTextSurvey());
      }

      function isFreeTextVideoQuiz() {
        return(video_quiz.question_type.toLowerCase() == 'free text question');
      }

      function isDragQuiz() {
        return(video_quiz.question_type.toLowerCase() == 'drag');
      }

      function isSurvey() {
        return(video_quiz.quiz_type == 'survey');
      }

      function isTextSurvey() {
        return(video_quiz.quiz_type == 'html_survey');
      }

      function isDragTextQuiz() {
        return(isDragQuiz() && isTextVideoQuiz());
      }

      return angular.extend(video_quiz, {
        getInVideoQuizAnswers: getInVideoQuizAnswers,
        getTextQuizAnswers: getTextQuizAnswers,
        getQuizAnswers: getQuizAnswers,
        addFreeTextAnswer: addFreeTextAnswer,
        addAnswer: addAnswer,
        removeAnswer: removeAnswer,
        addHtmlAnswer: addHtmlAnswer,
        removeHtmlAnswer: removeHtmlAnswer,
        updateAnswers: updateAnswers,
        instanceType: instanceType,
        setAsSelected: setAsSelected,
        isTextVideoQuiz: isTextVideoQuiz,
        isFreeTextVideoQuiz: isFreeTextVideoQuiz,
        isDragQuiz: isDragQuiz,
        isTextQuiz: isTextQuiz,
        isSurvey: isSurvey,
        isTextSurvey: isTextSurvey,
        deleteQuiz: deleteQuiz,
        isDragTextQuiz: isDragTextQuiz,
        validate: validate,
        update: update
      })
    }

    return {
      getQuizzes: getQuizzes,
      addVideoQuiz: addVideoQuiz,
      createInstance: createInstance,
      setSelectedVideoQuiz: setSelectedVideoQuiz,
      getSelectedVideoQuiz: getSelectedVideoQuiz,
      clearSelectedVideoQuiz: clearSelectedVideoQuiz
    }

  }])
