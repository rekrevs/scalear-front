'use strict';

angular.module('scalearAngularApp')
  .controller('progressLectureCtrl', ['$scope', '$stateParams', 'Timeline', 'Module', 'Quiz', 'OnlineQuiz', '$log', '$window', '$translate', '$timeout', 'Forum', 'Page', 'ContentNavigator', 'Lecture', 'ScalearUtils', 'ModuleModel', function($scope, $stateParams, Timeline, Module, Quiz, OnlineQuiz, $log, $window, $translate, $timeout, Forum, Page, ContentNavigator, Lecture, ScalearUtils, ModuleModel) {

    Page.setTitle('navigation.progress')
    ContentNavigator.close()
    $scope.Math = window.Math;
    $scope.highlight_index = -1
    $scope.inner_highlight_index = 0
    $scope.progress_player = {}
    $scope.timeline = {}
    $scope.highlight_level = 0
    $scope.time_parameters = {
      quiz: 3,
      question: 2
    }

    $scope.selected_module = ModuleModel.getSelectedModule()
    $scope.module_id = $stateParams.module_id
    $scope.course_id = $stateParams.course_id
    $scope.module_summary = {}
    $scope.module_summary[$scope.module_id] = {}
    $scope.module_summary[$scope.module_id].type = "teacher"
    $scope.module_summary[$scope.module_id].review_page_trigger = true
    $scope.module_summary[$scope.module_id].loading = { summary: true, online_quiz: true, discussion: true }

    $scope.$on('$destroy', function() {
      removeShortcuts()
    });

    $scope.$on('progress_item_filter_update', function(ev, filters) {
      $scope.check_sub_items = filters
    })

    $scope.$on('progress_filter_update', function(ev, filters) {
      $scope.check_items = filters
    })

    $scope.$on('print', function() {
      $scope.print()
    })

    $scope.$on('scroll_to_item', function(ev, item) {
      if (item.class_name != "customlink") {
        var type = item.class_name == "quiz" ? item.quiz_type : item.class_name
        scrollToItem("#" + type + "_" + item.id, 130)
        removeHightlight()
        var ul = angular.element("#" + type + "_" + item.id).find('.ul_item')[0]
        $scope.highlight_index = angular.element('.ul_item').index(ul) - 1
      }
    })

    $scope.$on('scroll_to_item_summary', function(ev, item_id) {
      if (item_id != null) {
        scrollToSubItem(item_id)
      }
    })

    $scope.check_sub_items = { lecture_quizzes: true, confused: true, charts: true, discussion: true, free_question: true };
    $scope.check_items = { quiz: true, survey: true }

    $scope.grade_options = [{
      value: 0, // not set
      text: $translate.instant('quizzes.grade.under_review')
    }, {
      value: 1, // wrong
      text: $translate.instant('quizzes.grade.incorrect')
    }, {
      value: 2,
      text: $translate.instant('quizzes.grade.partial')
    }, {
      value: 3,
      text: $translate.instant('quizzes.grade.correct')
    }]

    var init = function() {
      $scope.timeline = new Timeline()

      getModuleCharts()
      getLectureCharts()
      getQuizCharts()
      getSurveyCharts()
      setupShortcuts()
    }

    var getLectureCharts = function() {

      Module.getModuleProgress({
          course_id: $stateParams.course_id,
          module_id: $stateParams.module_id
        },
        function(data) {
          angular.extend($scope, data)
          $scope.module = ModuleModel.getSelectedModule()
          if ($scope.progress_player.controls.isYoutube($scope.first_lecture.url)) {
            $scope.video_start = $scope.first_lecture.start_time
            $scope.video_end = $scope.first_lecture.end_time
            $scope.url = $scope.first_lecture.url+"&controls=1&fs=1&theme=light"
            $scope.url_lecture_id = $scope.first_lecture.id
          }
          else{
            $scope.url = $scope.first_lecture.url
            $scope.url_lecture_id = $scope.first_lecture.id
          }

          $scope.timeline['lecture'] = {}
          $scope.inclass_quizzes_time = 0
          for (var lec_id in $scope.lectures) {
            $scope.timeline['lecture'][lec_id] = new Timeline()
            for (var type in $scope.lectures[lec_id]) {
              if (type != "meta")
                for (var it in $scope.lectures[lec_id][type]) {
                  if (type == 'discussion') {
                    $scope.lectures[lec_id][type][it][0] = $scope.lectures[lec_id][type][it][1][0].time
                    for (var disc in $scope.lectures[lec_id][type][it][1]) {
                      $scope.lectures[lec_id][type][it][1][disc].hide = !$scope.lectures[lec_id][type][it][1][disc].hide
                      for (var com in $scope.lectures[lec_id][type][it][1][disc].comments) {
                        $scope.lectures[lec_id][type][it][1][disc].comments[com].hide = !$scope.lectures[lec_id][type][it][1][disc].comments[com].hide
                      }
                    }
                  } else if (type == 'charts') {
                    $scope.lectures[lec_id][type][it][1].hide = !$scope.lectures[lec_id][type][it][1].hide
                    if ($scope.lectures[lec_id][type][it][1].inclass && $scope.lectures[lec_id][type][it][1].hide) {
                      $scope.inclass_quizzes_time += ($scope.lectures[lec_id][type][it][1].timers.intro + $scope.lectures[lec_id][type][it][1].timers.self + $scope.lectures[lec_id][type][it][1].timers.in_group + $scope.lectures[lec_id][type][it][1].timers.discussion) / 60
                    }
                  }
                  // else if(type=='confused' || type=='really_confused'){
                  //   $scope.lectures[lec_id][type][it][1].hide = !$scope.lectures[lec_id][type][it][1].hide
                  // }
                  $scope.timeline['lecture'][lec_id].add($scope.lectures[lec_id][type][it][0], type, $scope.lectures[lec_id][type][it][1])
                }
            }
          }
          // $log.debug($scope.timeline)
          if ($stateParams.item_id != null) {
            scrollToSubItem($stateParams.item_id)
          }
        },
        function() {}
      )
    }


    var getModuleCharts = function() {

      Module.getModuleSummary({
        module_id: $scope.module_id,
        course_id: $scope.course_id
      }, function(data) {
          $scope.timeline["module"] = new Timeline()
          // $scope.timeline["module"].add(0, 'module', data.module_data)
        $scope.module_summary[$scope.module_id].loading.summary = false
        angular.extend($scope.module_summary[$scope.module_id], data.module)
      })

      Module.getOnlineQuizSummary({
        module_id: $scope.module_id,
        course_id: $scope.course_id
      }, function(data) {
        $scope.module_summary[$scope.module_id].loading.online_quiz = false
        angular.extend($scope.module_summary[$scope.module_id], data.module)
      })

    }

    var getQuizCharts = function() {

      Module.getQuizCharts({
          course_id: $stateParams.course_id,
          module_id: $stateParams.module_id
        },
        function(resp) {
          // $log.debug(resp)
          var quizzes = resp.quizzes
          $scope.review_quiz_count = resp.review_quiz_count
          $scope.review_quiz_reply_count = {}
          $scope.timeline['quiz'] = {}

          for (var quiz_id in quizzes) {
            $scope.timeline['quiz'][quiz_id] = new Timeline()
            $scope.review_quiz_reply_count[quiz_id] = {}
            for (var q_index in quizzes[quiz_id].questions) {
              var q_id = quizzes[quiz_id].questions[q_index].id
              $scope.review_quiz_reply_count[quiz_id][q_id] = 0
              var data = quizzes[quiz_id].charts[q_id] || quizzes[quiz_id].free_question[q_id]
              data.type = quizzes[quiz_id].questions[q_index].type
              data.id = q_id
              data.quiz_type = 'quiz'
              data.show = quizzes[quiz_id].questions[q_index].show
              data.title = quizzes[quiz_id].questions[q_index].question
              var type = quizzes[quiz_id].questions[q_index].type == "Free Text Question" ? "free_question" : 'charts'
              if (type == "free_question") {
                data.answers.forEach(function(answer) {
                  if (!answer.hide)
                    $scope.review_quiz_reply_count[quiz_id][q_id]++
                    answer.hide = !answer.hide
                })
              }
              if (data.show)
                $scope.review_quiz_count += $scope.review_quiz_reply_count[quiz_id][q_id]
              $scope.timeline['quiz'][quiz_id].add(0, type, data, 'quiz')
            }
          }
          $scope.quizzes = angular.extend({}, quizzes, $scope.quizzes)

        },
        function() {}
      )
    }

    var getSurveyCharts = function() {
      Module.getSurveyCharts({
          course_id: $stateParams.course_id,
          module_id: $stateParams.module_id
        },
        function(resp) {
          // $log.debug(resp)
          var surveys = resp.surveys
          $scope.review_survey_count = resp.review_survey_count
          $scope.review_survey_reply_count = {}
          $scope.timeline["survey"] = {}

          for (var survey_id in surveys) {
            $scope.timeline["survey"][survey_id] = new Timeline()
            $scope.review_survey_reply_count[survey_id] = {}
            for (var q_index in surveys[survey_id].questions) {
              var q_id = surveys[survey_id].questions[q_index].id
              $scope.review_survey_reply_count[survey_id][q_id] = 0
              var data = surveys[survey_id].charts[q_id] || surveys[survey_id].free_question[q_id]
              data.type = surveys[survey_id].questions[q_index].type
              data.id = q_id
              data.quiz_type = 'survey'

              var type = surveys[survey_id].questions[q_index].type == "Free Text Question" ? "free_question" : 'charts'
              if (type == "free_question") {
                data.answers.forEach(function(answer) {
                  if (!answer.hide)
                    $scope.review_survey_reply_count[survey_id][q_id]++
                    answer.hide = !answer.hide
                })
              }
              if (data.show)
                $scope.review_survey_count += $scope.review_survey_reply_count[survey_id][q_id]
              $scope.timeline['survey'][survey_id].add(0, type, data)
            }
          }
          $scope.quizzes = angular.extend({}, surveys, $scope.quizzes)
        },
        function() {}
      )
    }

    var scrollToItem = function(elem, dist) {
      var top = dist || ($('html').innerHeight() / 2) - 10;
      $('.main_content').parent().scrollToThis(angular.element(elem), { offsetTop: top });
    }

    var scrollToSubItem = function(item_key) {
      if (item_key.indexOf("disc") != -1) {
        var ids = item_key.split("a")
        var content_id = ids[0]
        var item_id = parseInt(content_id.split("_")[1])
        var lid = parseInt(ids[1])
        $timeout(function() {
          $scope.timeline['lecture'][lid].items.forEach(function(item) {
            if (item.type == "discussion") {
              item.data.forEach(function(disc) {
                if (disc.post.id == item_id) {
                  disc.post.show_feedback = true
                }
              })
            }
          })
          scrollToItem("#" + content_id, 140)
       })
      } else {
        $timeout(function() { scrollToItem("#" + item_key, 130) })
      }
    }

    $scope.manageHighlight = function(x) {
      // resizePlayerSmall()
      var divs = angular.element('.ul_item')
      angular.element(divs[$scope.highlight_index]).removeClass('highlight')
      angular.element('li.highlight').removeClass('highlight')
      $scope.highlight_index = $scope.highlight_index + x
      if ($scope.highlight_index < 0)
        $scope.highlight_index = 0
      else if ($scope.highlight_index > divs.length - 1)
        $scope.highlight_index = divs.length - 1
      var ul = angular.element(divs[$scope.highlight_index])
        // ul.addClass("highlight").removeClass('low-opacity').addClass('full-opacity')
      ul.addClass("highlight").addClass('full-opacity')
      $scope.highlight_level = 1
        // angular.element('.ul_item').not('.highlight').removeClass('full-opacity').addClass('low-opacity')
      angular.element('.ul_item').not('.highlight').removeClass('full-opacity')
      var parent_div = ul.closest('div')
      if (parent_div.attr('id')) {
        var id = parent_div.attr('id').split('_')
        $scope.selected_item = $scope.timeline[id[0]][id[1]].items[ul.attr('index')]
        $scope.selected_item.lec_id = id[1]
      } else
        $scope.selected_item = null
      scrollToItem(divs[$scope.highlight_index])
      $scope.inner_highlight_index = 0
      setupRemoveHightlightEvent()
      seekToItem()
    }

    $scope.manageInnerHighlight = function(x) {
      var inner_ul = angular.element('ul.highlight').find('ul')
      if (inner_ul.length) {
        var inner_li = inner_ul.find('li').not('.no_highlight')
        if (angular.element('li.highlight').length)
          angular.element('li.highlight').removeClass('highlight')
        $scope.inner_highlight_index = $scope.inner_highlight_index + x
        if ($scope.inner_highlight_index < 0)
          $scope.inner_highlight_index = 0
        else if ($scope.inner_highlight_index > inner_li.length - 1) {
          $scope.manageHighlight(1)
          return
        }
        angular.element(inner_li[$scope.inner_highlight_index]).addClass('highlight')
        $scope.highlight_level = 2
      }
      scrollToItem(inner_li[$scope.inner_highlight_index])
      seekToItem()
    }

    $scope.highlight = function(ev, item) {
      var ul = angular.element(ev.target).closest('ul.ul_item')
      var divs = angular.element('.ul_item')
      $(".highlight").removeClass("highlight");
      $scope.highlight_index = divs.index(ul)
        // angular.element(ul).addClass("highlight").removeClass('low-opacity').addClass('full-opacity')
        //   angular.element('.ul_item').not('.highlight').removeClass('full-opacity').addClass('low-opacity')
      angular.element(ul).addClass("highlight").addClass('full-opacity')
      angular.element('.ul_item').not('.highlight').removeClass('full-opacity')
      $scope.highlight_level = 1
      setupRemoveHightlightEvent()
      $scope.selected_item = item
      var parent_div = ul.closest('div')
      if (parent_div.attr('id')) {
        var id = parent_div.attr('id').split('_')
        $scope.selected_item.lec_id = id[1]
      }
      $scope.inner_highlight_index = 0
      var inner_li = angular.element(ev.target).closest('li.li_item')
      if (inner_li.length) {
        if (angular.element('li.highlight').length)
          angular.element('li.highlight').removeClass('highlight')
        $scope.inner_highlight_index = ul.find('li.li_item').index(inner_li[0])
        angular.element(inner_li[0]).addClass('highlight')
        $scope.highlight_level = 2
      }
      seekToItem()
    }

    var setupRemoveHightlightEvent = function() {
      // $log.debug("adding")
      $(document).click(function(e) {
        if (angular.element(e.target).find('.inner_content').length) {
          removeHightlight()

          $(document).off('click');
        }
      })
    }

    var removeHightlight = function() {
      resizePlayerSmall()
      $(".highlight").removeClass("highlight");
      // angular.element('.ul_item').removeClass('low-opacity').addClass('full-opacity')
      angular.element('.ul_item').addClass('full-opacity')
      $scope.highlight_level = 0
      // $log.debug("removing")
    }

    $scope.resetHighlightVariables = function() {
      removeHightlight()
      $scope.highlight_index = -1
      $scope.inner_highlight_index = 0
    }

    $scope.updateHideQuiz = function(quiz, hide) {
      var num = (hide ? -1 : 1)
      if (quiz.data.inclass) {
        $scope.inclass_quizzes_time += num * (quiz.data.timers.intro + quiz.data.timers.self + quiz.data.timers.in_group + quiz.data.timers.discussion) / 60
        $scope.inclass_quizzes_count += num
      } else
        $scope.review_video_quiz_count += num

      Module.hideQuiz({
        course_id: $stateParams.course_id,
        module_id: $stateParams.module_id
      }, {
        quiz: quiz.data.id,
        hide: hide
      })
    }

    $scope.updateHideDiscussion = function(id, value) {
      if (value)
        $scope.review_question_count--
        else
          $scope.review_question_count++
          Forum.hideDiscussion({}, {
              post_id: id,
              hide: value
            },
            function() {},
            function() {}
          )
    }

    $scope.updateHideComment = function(comment, discussion) {
      Forum.hideComment({}, {
          post_id: discussion.id,
          comment_id: comment.id,
          hide: comment.hide
        },
        function() {
          // $log.debug(comment.hide)
          if (comment.hide && !discussion.hide) {
            discussion.hide = true
            $scope.updateHideDiscussion(discussion.id, !discussion.hide)
          }
        },
        function() {}
      )
    }

    $scope.updateHideResponse = function(quiz_id, item, answer, item_type) {
      // $log.debug(quiz_id)
      // $log.debug(item)
      // $log.debug(answer)
      if (item_type == "survey") {
        if (!answer.hide) {
          $scope.review_survey_reply_count[quiz_id][item.data.id]++
            if (item.data.show)
              $scope.review_survey_count++
        } else {
          $scope.review_survey_reply_count[quiz_id][item.data.id]--
            if (item.data.show)
              $scope.review_survey_count--
        }
      } else {
        if (!answer.hide) {
          $scope.review_quiz_reply_count[quiz_id][item.data.id]++
            if (item.data.show)
              $scope.review_quiz_count++
        } else {
          $scope.review_quiz_reply_count[quiz_id][item.data.id]--
            if (item.data.show)
              $scope.review_quiz_count--
        }
      }
      Quiz.hideResponses({
          course_id: $stateParams.course_id,
          quiz_id: quiz_id
        }, {
          hide: {
            id: answer.id,
            hide: answer.hide
          }
        },
        function() {
          // $log.debug(answer.hide)
          if (answer.hide && !item.data.show) {
            item.data.show = true
            $scope.updateHideQuizQuestion(quiz_id, item.data.id, item.data.show, item.type, item_type)
          }
        }
      )
    }

    $scope.updateHideResponseOnlineQuiz = function(quiz_id, id, value) {
      OnlineQuiz.hideResponses({
        course_id: $stateParams.course_id,
        online_quizzes_id: quiz_id
      }, {
        hide: {
          id: id,
          hide: value
        }
      })
    }

    $scope.updateHideQuizQuestion = function(quiz_id, question_id, value, question_type, item_type) {
      // $log.debug(item_type, "this is it")
      // $log.debug(question_type)
      var num_reply = (question_type == "charts") ? 1 : $scope["review_" + item_type + "_reply_count"][quiz_id][question_id] + 1
      if (value) //item_type can be either 'survey' or 'quiz'
        $scope["review_" + item_type + "_count"] += num_reply
      else
        $scope["review_" + item_type + "_count"] -= num_reply

      Quiz.showInclass({
        course_id: $stateParams.course_id,
        quiz_id: quiz_id
      }, {
        question: question_id,
        show: value
      })
    }

    $scope.updateHideConfused = function(lec_id, time, value, very) {
      Lecture.confusedShowInclass({
        course_id: $stateParams.course_id,
        lecture_id: lec_id
      }, {
        time: time,
        hide: value,
        very: very
      })
    }

    $scope.makeSurveyVisible = function(quiz, val) {
      quiz.meta.visible = val
      Quiz.makeVisible({ course_id: quiz.meta.course_id, quiz_id: quiz.meta.id }, { visible: val })
    }

    $scope.sendComment = function(discussion) {
      if (discussion.temp_response && discussion.temp_response.length && discussion.temp_response.trim() != "") {
        var text = discussion.temp_response
        discussion.temp_response = null
        Forum.createComment({ comment: { content: text, post_id: discussion.id, lecture_id: discussion.lecture_id } },
          function(response) {
            // $log.debug(response)
            response.comment.hide = false
            discussion.comments.push(response.comment)
            angular.element('ul.highlight .feedback textarea').blur()
          },
          function() {}
        )
      }
    }


    $scope.sendFeedback = function(question) {
      if (question.temp_response && question.temp_response.length && question.temp_response.trim() != "") {
        var response = question.temp_response
        question.temp_response = null
        Quiz.sendFeedback({ quiz_id: question.quiz_id, course_id: $stateParams.course_id }, {
            groups: [question.id],
            response: response
          },
          function() {
            question.response = angular.copy(response)
            angular.element('ul.highlight .feedback textarea').blur()
          },
          function() {}
        )
      }
    }

    $scope.deleteFeedback = function(question) {
      Quiz.deleteFeedback({ quiz_id: question.quiz_id, course_id: $stateParams.course_id }, {
          answer: question.id
        },
        function() {
          question.response = null
        }
      )
    }


    $scope.deletePost = function(items, index) {
      var discussion = items[index]
      Forum.deletePost({ post_id: discussion.post.id },
        function() {
          items.splice(index, 1)
        },
        function() {}
      )
    }


    $scope.deleteComment = function(comment, discussion) {
      Forum.deleteComment({ comment_id: comment.id, post_id: discussion.id },
        function() {
          discussion.comments.splice(discussion.comments.indexOf(comment), 1)
        },
        function() {}
      )
    }

    $scope.removeFlag = function(discussion) {
      Forum.removeAllFlags({ post_id: discussion.id },
        function() {
          discussion.flags_count = 0
        },
        function() {}
      )
    }

    $scope.removeCommentFlag = function(comment, discussion) {
      Forum.removeAllCommentFlags({ comment_id: comment.id, post_id: discussion.id },
        function() {
          discussion.comments[discussion.comments.indexOf(comment)].flags_count = 0
        },
        function() {}
      )
    }
    $scope.updateGrade = function(answer) {
      Quiz.updateGrade({ course_id: $stateParams.course_id, quiz_id: answer.quiz_id }, { answer_id: answer.id, grade: answer.grade })
    }
    $scope.updateOnlineQuizGrade = function(answer) {
      OnlineQuiz.updateGrade({ course_id: $stateParams.course_id, online_quizzes_id: answer.online_quiz_id }, { answer_id: answer.id, grade: answer.grade })
    }

    $scope.seek = function(time, video) {
      // $log.debug(video.url)
      // $log.debug($scope.url)

      if ($scope.url.indexOf(video.url) == -1) {
        if ($scope.progress_player.controls.isYoutube(video.url) || $scope.progress_player.controls.isKaltura(video.url)) {
          $scope.video_start = video.start_time
          $scope.video_end = video.end_time
          $scope.progress_player.controls.setStartTime(video.start_time)
          $scope.url = video.url + "&controls=1&fs=1&theme=light"
          $scope.url_lecture_id = video.id
          $timeout(function() {
            $scope.progress_player.controls.seek_and_pause(time)
          },250)
        }
        if ($scope.progress_player.controls.isMP4(video.url)) {
          $scope.url = video.url
          $scope.url_lecture_id = video.id
          $timeout(function() {
            $scope.progress_player.controls.seek_and_pause(time)
          })
        }

      } else {
        if( $scope.selected_item.lec_id != $scope.url_lecture_id){
          $scope.video_start = video.start_time
          $scope.video_end = video.end_time
          $scope.progress_player.controls.setStartTime(video.start_time)
          $timeout(function() {
            $scope.progress_player.controls.seek_and_pause(time)
          },250)
          $scope.url_lecture_id = video.id
        }
        else{
          $timeout(function() {
            $scope.progress_player.controls.seek_and_pause(time)
          })
        }
      }
    }

    $scope.formatModuleChartData = function(data) {
      var formated_data = {}
      formated_data.cols = [
        { "label": $translate.instant('global.students'), "type": "string" },
        { "label": $translate.instant('global.students'), "type": "number" }
      ]
      formated_data.rows = []
      var x_titles = [$translate.instant('progress.chart.not_started_watching'), $translate.instant('progress.chart.watched') + " <= 50%", $translate.instant('progress.chart.watched') + " > 50%", $translate.instant('progress.chart.completed_on_time'), $translate.instant('progress.chart.completed_late')]
      for (var ind in data) {
        var row = {
          "c": [
            { "v": x_titles[ind] },
            { "v": data[ind] }
          ]
        }
        formated_data.rows.push(row)
      }
      return formated_data

    }


    $scope.formatLectureChartData = function(data, type) {
      var formated_data = {}
      formated_data.cols = [
      {
        "label": $translate.instant('global.students'),
        "type": "string"
      },
      {
        "label": $translate.instant("editor.correct")+' ('+$translate.instant("dashboard.first_try")+')',
        "type": "number"
      }, {
        "type": "string",
        "p": {"role": "tooltip","html": true}
      }, {
        "label": $translate.instant("editor.correct")+' ('+$translate.instant("dashboard.final_try")+')',
        "type": "number"
      }, {
        "type": "string",
        "p": {"role": "tooltip","html": true}
      }, {
        "label": $translate.instant("editor.incorrect")+' ('+$translate.instant("dashboard.first_try")+')',
        "type": "number"
      }, {
        "type": "string",
        "p": {"role": "tooltip","html": true}
      }, {
        "label": $translate.instant("editor.incorrect")+' ('+$translate.instant("dashboard.final_try")+')',
        "type": "number"
      }, {
        "type": "string",
        "p": {"role": "tooltip","html": true}
      }, {
        "label": '', // Never Tried
        "type": "number"
      }, {
        "type": "string",
        "p": {"role": "tooltip","html": true}
      }, {
        "label": $translate.instant("dashboard.solved"),
        "type": "number"
      }, {
        "type": "string",
        "p": {"role": "tooltip","html": true}
      }]

      formated_data.rows = []
      for (var ind in data) {

        var text, correct, incorrect,
          first_correct = 0,
          last_correct = 0 ,
          first_not_correct = 0,
          last_not_correct = 0 ,
          did_not_try = 0,
          survey_tried = 0,

        text = ScalearUtils.getHtmlText(data[ind][2])
        var short_text =  ScalearUtils.getShortAnswerText(text,Object.keys(data).length)
        var tooltip_text = data[ind][2]

        var  first_correct_tooltip_text = '',
          last_correct_tooltip_text = '',
          first_not_correct_tooltip_text = '',
          last_not_correct_tooltip_text = '',
          did_not_try_tooltip_text = '',
          survey_tried_tooltip_text = ''

        if (data[ind][1] == "orange") {
          if (type != 'Survey')
            short_text += " (" + $translate.instant('editor.incorrect') + ")";
          first_not_correct = data[ind][0]
          last_not_correct = data[ind][3]

          first_not_correct_tooltip_text =  "<div style='color:black;padding:8px'>"+tooltip_text + "<br>"+$translate.instant("editor.incorrect")+' ('+$translate.instant("dashboard.first_try")+')  : '+data[ind][0]+"</div>"
          last_not_correct_tooltip_text =   "<div style='color:black;padding:8px'>"+tooltip_text + "<br>"+$translate.instant("editor.incorrect")+' ('+$translate.instant("dashboard.final_try")+')  : '+data[ind][3]+"</div>"
        }
        else if((data[ind][1] == "gray")){
          did_not_try = data[ind][0]
          did_not_try_tooltip_text =   "<div style='color:black;padding:8px'>"+$translate.instant("dashboard.never_tried")+'  : '+data[ind][0]+"</div>"
        }
        else if((data[ind][1] == "blue")){
          survey_tried = data[ind][0]
          survey_tried_tooltip_text =  "<div style='color:black;padding:8px'>"+tooltip_text +  "<br>"+$translate.instant("dashboard.solved")+' : '+data[ind][0]+"</div>"
        }
        else {
          if (type != 'Survey')
            short_text += " (" + $translate.instant('editor.correct') + ")";
          first_correct = data[ind][0]
          last_correct = data[ind][3]

          first_correct_tooltip_text =  "<div style='color:black;padding:8px'>"+tooltip_text +  "<br>"+$translate.instant("editor.correct")+' ('+$translate.instant("dashboard.first_try")+')  : '+data[ind][0]+"</div>"
          last_correct_tooltip_text =   "<div style='color:black;padding:8px'>"+tooltip_text +  "<br>"+$translate.instant("editor.correct")+' ('+$translate.instant("dashboard.final_try")+')  : '+data[ind][3]+"</div>"

        }
      // first_correct, _tooltip , last_correct, _tooltip , first_not_correct, _tooltip , last_not_correct, _tooltip , did_not_try, _tooltip
        var row = {
          "c": [
            {"v": short_text},
            {"v": first_correct},
            {"v": first_correct_tooltip_text },
            {"v": last_correct},
            {"v": last_correct_tooltip_text },
            {"v": first_not_correct},
            {"v": first_not_correct_tooltip_text },
            {"v": last_not_correct},
            {"v": last_not_correct_tooltip_text },
            {"v": did_not_try},
            {"v": did_not_try_tooltip_text },
            {"v": survey_tried},
            {"v": survey_tried_tooltip_text },

          ]
        }
        formated_data.rows.push(row)
      }
      return formated_data
    }

    $scope.formatQuizChartData = function(data) {
      var formated_data = {}
      formated_data.cols = [{
        "label": $translate.instant('global.students'),
        "type": "string"
      }, {
        "label": $translate.instant('editor.correct'),
        "type": "number"
      }, {
        "type": "string",
        "p": {"role": "tooltip","html": true}
      }, {
        "label": $translate.instant('editor.incorrect'),
        "type": "number"
      } , {
        "type": "string",
        "p": {"role": "tooltip","html": true}
      }]
      formated_data.rows = []

      for (var ind in data) {
        var text, correct, incorrect, tooltip_text, correct_tooltip_text, incorrect_tooltip_text
        text = ScalearUtils.getHtmlText(data[ind][2])
        var short_text =  ScalearUtils.getShortAnswerText(text,Object.keys(data).length)
        var tooltip_text = data[ind][2]

        if (!data[ind][1]) {
          short_text += " " + "(" + $translate.instant('editor.incorrect') + ")";
          correct = 0
          incorrect = data[ind][0]
          incorrect_tooltip_text =  "<div style='color:black;padding:8px'>"+tooltip_text + "<br>"+$translate.instant("editor.incorrect")+' : '+data[ind][0]+"</div>"
        } else {
          short_text += " " + "(" + $translate.instant('editor.correct') + ")";
          correct = data[ind][0]
          incorrect = 0
          correct_tooltip_text =  "<div style='color:black;padding:8px'>"+tooltip_text + "<br>"+$translate.instant("editor.correct")+' : '+data[ind][0]+"</div>"
        }

        // "<div style='padding:8px'><b>" + text + "</b><br>"+$translate.instant('inclass.self_stage')+": " + self_count + ", "+$translate.instant('inclass.group_stage')+": " + group_count + "</div>",
        var row = {
          "c": [
            {"v": short_text},
            {"v": correct},
            { "v": correct_tooltip_text },
            // { "v": tooltip_text },
            {"v": incorrect},
            { "v": incorrect_tooltip_text },
            ]
        }
        formated_data.rows.push(row)
      }
      return formated_data
    }


    $scope.formatSurveyChartData = function(data) {
      var formated_data = {}
      formated_data.cols = [
        { "label": $translate.instant('global.students'), "type": "string" },
        { "label": $translate.instant('progress.chart.answered'), "type": "number" },
        {
          "type": "string",
          "p": {"role": "tooltip","html": true}
        }]
      formated_data.rows = []
      var text, short_text, tooltip_text
      for (var ind in data) {
        text = ScalearUtils.getHtmlText(data[ind][1])
        short_text =  ScalearUtils.getShortAnswerText(text,Object.keys(data).length)
        tooltip_text = data[ind][1]
        tooltip_text =  "<div style='color:black;padding:8px'>"+tooltip_text +' : '+data[ind][0]+"</div>"
        var row = {
          "c": [
            { "v": short_text },
            { "v": data[ind][0] },
            { "v": tooltip_text }

          ]
        }
        formated_data.rows.push(row)
      }
      return formated_data
    }

    // $scope.formatSurveyLectureChartData = function(data) {
    //   var formated_data = {}
    //   formated_data.cols=
    //       [
    //           {"label": $translate.instant('global.students'),"type": "string"},
    //           {"label": $translate.instant('progress.chart.answered'),"type": "number"},
    //       ]
    //   formated_data.rows = []
    //   for (var ind in data) {
    //       var row =
    //       {"c":
    //           [
    //             {"v": data[ind][2]},
    //             {"v": data[ind][0]}
    //           ]
    //       }
    //       formated_data.rows.push(row)
    //   }
    //   return formated_data
    // }

    var seekToItem = function() {
      // $log.debug("seeking to item", $scope.selected_item)
      if ($scope.selected_item && $scope.selected_item.time >= 0 && $scope.lectures[$scope.selected_item.lec_id]) {
        var time = $scope.selected_item.time
        if ($scope.selected_item.type == "discussion") {
          var q_ind = $scope.inner_highlight_index
          time = $scope.selected_item.data[q_ind].time
          $log.debug(time)
        }
        $scope.seek(time, $scope.lectures[$scope.selected_item.lec_id].meta)
      }
    }

    $scope.createChart = function(data, student_count, options, formatter, type, self_group_boolean) {
      var chart = {};
      if (self_group_boolean) {
        chart = $scope.createChartSelfGroup(data, student_count, {}, 'formatSelfGroupChartData', type)
        // chart = $scope.createChartSelfGroup(data, student_count, { colors: ['rgb(0, 140, 186)', 'rgb(67, 172, 106)'] }, 'formatSelfGroupChartData')
      } else {
        chart.type = "ColumnChart"
        chart.options = {
          // first_correct , last_correct , first_not_correct, last_not_correct , did_not_try , survey_tries
          "colors": ['#16A53F', '#1bca4d' , '#ED9467','#E66726','#a4a9ad','#355BB7'],
          "isStacked": "true",
          "fill": 20,
          "height": 135,
          "displayExactValues": true,
          "fontSize": 10,
          "legend": { "position": "none" },
          "chartArea": { "left": 30, "width": "95%" },
          "vAxis": {
            "gridlines": {
              "count": 7
            },
            "viewWindow": { "max": student_count },
            "textPosition": 'none'

          },
          "tooltip": { "isHtml": true },

        };
        if( formatter == 'formatQuizChartData' ||formatter == 'formatSurveyChartData'){
          // first_correct , last_not_correct
          chart.options['colors'] = ['#16A53F','#E66726']
        }
        angular.extend(chart.options, options)

        chart.data = $scope[formatter](data, type)
      }
      return chart
    }



    $scope.createChartSelfGroup = function(data, student_count, options, formatter, type) {
      var chart = {
        type: "ColumnChart",
        options: {
          "colors": ['#16A53F', '#1bca4d' , '#ED9467','#E66726','#a4a9ad','#355BB7','#16A53F', '#1bca4d' , '#ED9467','#E66726','#a4a9ad','#355BB7'],
          "isStacked": "true",
          "fill": 20,
          "height": 135,
          "displayExactValues": true,
          "legend": { "position": 'none' },
          "fontSize": 10,
          "chartArea": { "left": 30, "width": "95%" },
          // "chartArea": { width: '82%' },
          "tooltip": { "isHtml": true },
          "vAxis": {
            // "ticks": [25, 50, 75, 100],
            // "maxValue": 100,
            "gridlines": {
              "count": 7
            },
            "viewWindow": { "max": student_count },
            // "viewWindowMode": 'maximized',
            // "textPosition": 'none'
          }
        },
        data: $scope[formatter](data, type)
      };
      angular.extend(chart.options, options)
      return chart
    }
    $scope.formatSelfGroupChartData = function(data, type) {
      var formated_data = {}
      formated_data.cols = [
        {"label": $translate.instant('global.students'),"type": "string"},
        {"label": $translate.instant("editor.correct")+' ('+$translate.instant("dashboard.first_try")+')' ,"type": "number"}, {"type": "string","p": {"role": "style"}},
        {"label": $translate.instant("editor.correct")+' ('+$translate.instant("dashboard.final_try")+')',"type": "number"}, {"type": "string","p": {"role": "style"}},
        {"label": $translate.instant("editor.incorrect")+' ('+$translate.instant("dashboard.first_try")+')',"type": "number"}, {"type": "string","p": {"role": "style"}},
        {"label": $translate.instant("editor.incorrect")+' ('+$translate.instant("dashboard.final_try")+')',"type": "number"}, {"type": "string","p": {"role": "style"}},
        {"label": '',"type": "number"}, {"type": "string","p": {"role": "style"}},
        {"label": $translate.instant("dashboard.solved"),"type": "number"}, {"type": "string","p": {"role": "style"}}
        ]


      formated_data.rows = []
      for (var ind in data) {
        var text, correct, incorrect,
          self_first_correct = 0,self_last_correct = 0 ,
          self_first_not_correct = 0,self_last_not_correct = 0 ,
          self_did_not_try = 0,self_survey_tried = 0,
          group_first_correct = 0,group_last_correct = 0 ,
          group_first_not_correct = 0,group_last_not_correct = 0 ,
          group_did_not_try = 0,group_survey_tried = 0


// [self_first_try_grades_count, first_try_color, answer.answer , not_self_first_try_grades_count, group_first_try_grades_count, not_group_first_try_grades_count]

        var text = data[ind][2],
          // self_count = data[ind][0] || 0,
          // group_count = data[ind][3] || 0,
          // self = self_count,
          // group = group_count,
          // tooltip_text = "<div style='padding:8px'><b>" + text + "</b><br>" + $translate.instant('inclass.self_stage') + ": " + self_count + ", " + $translate.instant('inclass.group_stage') + ": " + group_count + "</div>",
          style = (data[ind][1] == 'green') ? 'stroke-color: black;stroke-width: 3;' : '',
          self_text = text + ' ('+$translate.instant('inclass.self_stage')+')',
          group_text = text + ' ('+$translate.instant('inclass.group_stage')+')'

          if(data[ind][1] == 'green'){
            self_first_correct = data[ind][0] || 0
            self_last_correct = data[ind][3] || 0
            group_first_correct = data[ind][4] || 0
            group_last_correct = data[ind][5] || 0
          }
          else if(data[ind][1] == 'orange'){
            if (type != 'Survey')
              text += " (" + $translate.instant('editor.incorrect') + ")";
            self_first_not_correct = data[ind][0] || 0
            self_last_not_correct = data[ind][3] || 0
            group_first_not_correct = data[ind][4] || 0
            group_last_not_correct = data[ind][5] || 0
          }
          else if((data[ind][1] == "gray")){
            self_did_not_try = data[ind][0]
            group_did_not_try = data[ind][3]
          }
          else if((data[ind][1] == "blue")){
            self_survey_tried = data[ind][0]
            group_survey_tried = data[ind][3]
          }

        var row = {
          "c": [
            { "v": ScalearUtils.getHtmlText(self_text) },
            { "v": self_first_correct },{ "v": style },{ "v": self_last_correct },{ "v": style },
            { "v": self_first_not_correct },{ "v": style },{ "v": self_last_not_correct },{ "v": style },
            { "v": self_did_not_try },{ "v": style },{ "v": self_survey_tried },{ "v": style },
          ]
        }
        formated_data.rows.push(row)
        var row = {
          "c": [
            { "v": ScalearUtils.getHtmlText(group_text) },
            { "v": group_first_correct },{ "v": style },{ "v": group_last_correct },{ "v": style },
            { "v": group_first_not_correct },{ "v": style },{ "v": group_last_not_correct },{ "v": style },
            { "v": group_did_not_try },{ "v": style },{ "v": group_survey_tried },{ "v": style }
          ]
        }
        formated_data.rows.push(row)
      }
      return formated_data
    }






    var setupShortcuts = function() {
      shortcut.add("r", function() {
        if ($scope.selected_item && ($scope.selected_item.type == "free_question" || $scope.selected_item.type == "discussion"))
          if ($scope.inner_highlight_index >= 0) {
            if ($scope.selected_item.data.answers)
              $scope.selected_item.data.answers[$scope.inner_highlight_index].show_feedback = !$scope.selected_item.data.answers[$scope.inner_highlight_index].show_feedback
            else {
              $scope.selected_item.data[$scope.inner_highlight_index].post.show_feedback = !$scope.selected_item.data[$scope.inner_highlight_index].post.show_feedback
            }
            $scope.$apply()
            angular.element('textarea').focus()
          }
      }, { "disable_in_input": true, "propagate": false });

      shortcut.add("Down", function() {
        if ($scope.highlight_level <= 1)
          $scope.manageHighlight(1)
        else
          $scope.manageInnerHighlight(1)
        $scope.$apply()
      }, { "disable_in_input": true, "propagate": false });
      shortcut.add("Up", function() {
        if ($scope.highlight_level <= 1)
          $scope.manageHighlight(-1)
        else
          $scope.manageInnerHighlight(-1)
        $scope.$apply()
      }, { "disable_in_input": true, "propagate": false });

      shortcut.add("Right", function() {
        if ($scope.highlight_level == 0)
          $scope.manageHighlight(0)
        else
          $scope.manageInnerHighlight(0)
        $scope.$apply()
      }, { "disable_in_input": true, "propagate": false });

      shortcut.add("Left", function() {
        if ($scope.highlight_level <= 1)
          removeHightlight()
        else
          $scope.manageHighlight(0)
        $scope.$apply()
      }, { "disable_in_input": true, "propagate": false });

      shortcut.add("Space", function() {
        if ($scope.selected_item && $scope.selected_item.time >= 0 && !$scope.large_player) {
          resizePlayerLarge()
        } else
          resizePlayerSmall()

        $scope.$apply()
      }, { "disable_in_input": true, "propagate": false });

      shortcut.add("m", function() {
        // $log.debug($scope.selected_item)
        // $log.debug($scope.selected_item.data.quiz_type)
        if ($scope.selected_item) {
          if ($scope.selected_item.type == "discussion") {
            var q_ind = $scope.inner_highlight_index
            $scope.selected_item.data[q_ind].post.hide = !$scope.selected_item.data[q_ind].post.hide
            $scope.updateHideDiscussion($scope.selected_item.data[q_ind].post.id, !$scope.selected_item.data[q_ind].post.hide)
          } else if ($scope.selected_item.type == "charts") {
            if ($scope.selected_item.data.hide != null) {
              $scope.selected_item.data.hide = !$scope.selected_item.data.hide
              $scope.updateHideQuiz($scope.selected_item, !$scope.selected_item.data.hide)
            } else if ($scope.selected_item.data.show != null) {
              $scope.selected_item.data.show = !$scope.selected_item.data.show
              $scope.updateHideQuizQuestion($scope.selected_item.lec_id, $scope.selected_item.data.id, $scope.selected_item.data.show, $scope.selected_item.type, $scope.selected_item.data.quiz_type)
            }
          } else if ($scope.selected_item.type == "free_question") {
            if ($scope.selected_item.data.quiz_type == 'survey') {
              // $log.debug($scope.inner_highlight_index)
              if ($scope.highlight_level == 1) {
                $scope.selected_item.data.show = !$scope.selected_item.data.show
                $scope.updateHideQuizQuestion($scope.selected_item.data.answers[0].quiz_id, $scope.selected_item.data.id, $scope.selected_item.data.show, $scope.selected_item.type, $scope.selected_item.data.quiz_type)
              } else {
                var q_ind = $scope.inner_highlight_index
                $scope.updateHideResponse($scope.selected_item.data.answers[q_ind].quiz_id, $scope.selected_item, $scope.selected_item.data.answers[q_ind])
                $scope.selected_item.data.answers[q_ind].hide = !$scope.selected_item.data.answers[q_ind].hide

              }
            } else if ($scope.selected_item.data.quiz_type == 'Quiz') {
              if ($scope.highlight_level == 1) {
                $scope.selected_item.data.show = !$scope.selected_item.data.show
                $scope.updateHideQuiz($scope.selected_item, !$scope.selected_item.data.show)
              } else {
                var q_ind = $scope.inner_highlight_index
                $scope.selected_item.data.answers[q_ind].hide = !$scope.selected_item.data.answers[q_ind].hide
                $scope.updateHideResponseOnlineQuiz($scope.selected_item.data.answers[q_ind].online_quiz_id, $scope.selected_item.data.answers[q_ind].id, !$scope.selected_item.data.answers[q_ind].hide)
              }
            }
          }
        }
      }, { "disable_in_input": true, "propagate": false });

      shortcut.add("ESC", function() {
        // $log.debug($scope.selected_item)
        resizePlayerSmall()
        if ($scope.selected_item.type == 'discussion') {
          $scope.selected_item.data.forEach(function(discussion) {
            discussion.post.show_feedback = false;
            discussion.post.temp_response = null
          })
        } else if ($scope.selected_item.type == "free_question") {
          $scope.selected_item.data.answers.forEach(function(answer) {
            answer.show_feedback = false;
            answer.temp_response = null
          })
        }
        angular.element('ul.highlight .feedback textarea').blur()
        $scope.$apply()
      }, { "disable_in_input": false, "propagate": false });

      shortcut.add("enter", function() {
        // $log.debug($scope.selected_item)
        if ($scope.selected_item.type == 'discussion') {
          var q_ind = $scope.inner_highlight_index
          $scope.sendComment($scope.selected_item.data[q_ind].post)
          $scope.selected_item.data[q_ind].post.show_feedback = false
        } else if ($scope.selected_item.type == "free_question") {
          // $log.debug("free text")
          var q_ind = $scope.inner_highlight_index
          $scope.sendFeedback($scope.selected_item.data.answers[q_ind])
          $scope.selected_item.data.answers[q_ind].show_feedback = false
        }
        $scope.$apply()
      }, { "disable_in_input": false, "propagate": false });
    }

    var removeShortcuts = function() {
      shortcut.remove("r");
      shortcut.remove("Down");
      shortcut.remove("Up");
      shortcut.remove("Right");
      shortcut.remove("Left");
      shortcut.remove("Space");
      shortcut.remove("m");
      shortcut.remove("ESC");
      shortcut.remove("enter");
    }

    $scope.print = function() {
      var toPrint = document.getElementById('printarea');
      var win = window.open('', '_blank');
      win.document.open();
      win.document.write('<html><title>::Progress Report::</title><link rel="stylesheet" type="text/css" href="styles/externals/print/progress_print.css" /></head><body onload="window.print()"><center><b>' + $scope.module.name + '</b></center>')
      win.document.write(toPrint.innerHTML);
      win.document.write('</html>');
      win.document.close();
    }


    $scope.filterSubItems = function(item) {
      var condition = false;
      for (var e in $scope.check_sub_items) {
        if ($scope.check_sub_items[e])
          condition = (condition || (item.type.indexOf(e) != -1 && item.data != null))
      }
      var x = item.type != '' && condition
      return x;
    }

    $scope.filterItems = function(item) {
      var condition = false;
      if (item.class_name == "lecture")
        return true
      else {
        for (var e in $scope.check_items) {
          if ($scope.check_items[e])
            condition = (condition || item.quiz_type == e)
        }
      }
      return condition;
    }

    $scope.calculateReviewPercent = function(review_count, students_count) {
      return Math.ceil(review_count / students_count * 100) || 0
    }

    $scope.getReviewColor = function(percent) {
      if (percent < 10)
        return 'gray'
      else if (percent > 20)
        return '#f5c343' // dark yellow
      else
        return 'black'

    }

    var resizePlayerLarge = function() {
      $scope.large_player = true
    }

    var resizePlayerSmall = function() {
      $scope.large_player = false
    }

    $scope.getKeys = function(obj) {
      return Object.keys ? Object.keys(obj) : (function(obj) {
        var list = [];
        for (var item in obj)
          if (hasOwn.call(obj, item))
            list.push(item);
        return list;
      })(obj);
    }

    init()
  }])
