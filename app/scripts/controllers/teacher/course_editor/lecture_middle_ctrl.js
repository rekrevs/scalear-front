'use strict';

angular.module('scalearAngularApp')
  .controller('lectureMiddleCtrl', ['$state', '$stateParams', '$scope', '$translate', '$log', '$rootScope', '$timeout', '$q', 'DetailsNavigator', 'ngDialog', 'ItemsModel', 'VideoQuizModel', 'ScalearUtils', 'MarkerModel', '$urlRouter', function($state, $stateParams, $scope, $translate, $log, $rootScope, $timeout, $q, DetailsNavigator, ngDialog, ItemsModel, VideoQuizModel, ScalearUtils, MarkerModel, $urlRouter) {

    $scope.lecture = ItemsModel.getLecture($stateParams.lecture_id)
    ItemsModel.setSelectedItem($scope.lecture)

    $scope.quiz_layer = {}
    $scope.lecture_player = {}
    $scope.lecture_player.events = {}
    $scope.marker_errors = {}
    $scope.quiz_errors = {}

    $scope.alert = {
      type: "alert",
      msg: "error_message.got_some_errors"
    }
    $scope.hide_alerts = true;

    setUpShortcuts()
    setUpEventsListeners()

    $scope.lecture_player.events.onMeta = function() {
      // update duration for all video types.
      var total_duration = $scope.lecture_player.controls.getDuration()
      if(Math.ceil($scope.lecture.duration) != Math.ceil(total_duration)) {
        $scope.lecture.duration = total_duration
        $scope.lecture.update()
        $rootScope.$broadcast("update_module_time", $scope.lecture.group_id)
      }
      $scope.slow = false
      $scope.video_ready = false
    }

    $scope.lecture_player.events.onReady = function() {
      $scope.video_ready = true
      $scope.lecture_player.controls.seek_and_pause(0)

      $scope.lecture.timeline.items.forEach(function(item) {
        item.data && addItemToVideoQueue(item.data, item.type);
      })
    }

    $scope.lecture_player.events.onPlay = function() {
      $scope.slow = false
      if($scope.selected_quiz){
        $scope.selected_quiz.hide_quiz_answers = true
        hideQuizBackground()
      }
    }

    $scope.lecture_player.events.onSlow = function(is_youtube) {
      $scope.is_youtube = is_youtube
      $scope.slow = true
    }

    function addItemToVideoQueue(item_data, type) {
      item_data.cue = $scope.lecture_player.controls.cue($scope.lecture.start_time + (item_data.time - 0.1), function() {
        if(!$scope.lecture_player.controls.paused()) {
          $timeout(function() {
            if(type == 'quiz') {
              $scope.lecture_player.controls.seek_and_pause(item_data.time);
              $scope.showOnlineQuiz(item_data)
            }
            else
              $scope.showOnlineMarkerAnnotationOnly(item_data)
          })
        }
      })
    }

    function removeItemFromVideoQueue(item_data) {
      if(item_data.cue) {
        $scope.lecture_player.controls.removeTrackEvent(item_data.cue.id)
      }
    }

    $scope.closeAlerts = function() {
      $scope.hide_alerts = true;
    }

    $scope.refreshVideo = function() {
      $scope.slow = false
      $scope.video_ready = false
      var temp_url = $scope.lecture.url
      $scope.lecture.url = ""
      $timeout(function() {
        $scope.lecture.url = temp_url
      })
    }

    $scope.seek = function(time) {
      $scope.lecture_player.controls.seek(time)
    }

    $scope.addQuestion = function() {
      $scope.lecture_player.controls.pause();
      $scope.openQuestionsModal()
    }

    $scope.insertQuiz = function(quiz_type, question_type) {
      var insert_time = $scope.lecture_player.controls.getTime()
      VideoQuizModel.addVideoQuiz(insert_time, quiz_type, question_type)
        .then(function(quiz) {
          $scope.lecture_player.controls.seek_and_pause(quiz.time)
          $scope.editing_mode = false
          $scope.quiz_deletable = true
          $scope.showOnlineQuiz(quiz)
          addItemToVideoQueue(quiz, "quiz")
          DetailsNavigator.open()
        })
    }

    $scope.showOnlineQuiz = function(quiz) {
      $scope.selected_quiz = VideoQuizModel.getSelectedVideoQuiz()
      $scope.last_details_state = DetailsNavigator.getStatus()
      if($scope.selected_quiz != quiz) {
        saveOpenEditor()
          .then(function(error) {
            if(!error) {
              $scope.hide_alerts = true;
              $scope.submitted = false
              $scope.editing_mode = false;
              $timeout(function() {
                $scope.editing_mode = true;
              })
              $scope.selected_quiz = VideoQuizModel.createInstance(quiz).setAsSelected()
              $scope.selected_quiz.selected = true
              $scope.selected_quiz.hide_quiz_answers = false
              $scope.editing_type = 'quiz'
              $scope.lecture_player.controls.seek_and_pause(quiz.time)

              if($scope.selected_quiz.isTextQuiz()) {
                $scope.selected_quiz.getTextQuizAnswers()
                $scope.double_click_msg = ""
                showQuizBackground($scope.selected_quiz)
              } else {
                $scope.selected_quiz.getInVideoQuizAnswers();
                $scope.double_click_msg = "editor.messages.double_click_new_answer";
                hideQuizBackground()
              }
            }
          })
      }
    }

    function showQuizBackground(quiz) {
      if(quiz.isTextQuiz()) {
        $scope.quiz_layer.backgroundColor = "white"
        $scope.quiz_layer.overflowX = 'hidden'
        $scope.quiz_layer.overflowY = 'auto'
      }
    }

    function hideQuizBackground() {
      $scope.quiz_layer.backgroundColor = "transparent"
      $scope.quiz_layer.overflowX = ''
      $scope.quiz_layer.overflowY = ''
    }


    $scope.addDoubleClickBind = function(event) {
      if($scope.editing_mode && $scope.editing_type == 'quiz' && !$scope.selected_quiz.hide_quiz_answers && !$scope.selected_quiz.isFreeTextVideoQuiz()) {
        var answer_width, answer_height,
          answer_text = "Answer " + ($scope.selected_quiz.answers.length + 1)

        if($scope.selected_quiz.isDragQuiz()) {
          answer_width = 150
          answer_height = 40
        } else {
          answer_width = 13
          answer_height = 13
        }
        var element = angular.element(event.target);
        if(element.attr('id') == "ontop") {
          var left = event.pageX - element.offset().left - 6 //event.offsetX - 6
          var top = event.pageY - element.offset().top - 6 //event.offsetY - 6
          var the_top = top / element.height();
          var the_left = left / element.width()
          var the_width = answer_width / element.width();
          var the_height = answer_height / (element.height());
          $scope.selected_quiz.addAnswer(answer_text, the_height, the_width, the_left, the_top)
          if(window.getSelection)
            window.getSelection().removeAllRanges();
          else if(document.selection)
            document.selection.empty();
        }
      }
    }

    function isFormValid() {
      var correct = 0;
      if(!$scope.selected_quiz.isFreeTextVideoQuiz()) {
        for(var idx in $scope.selected_quiz.answers) {
          if(!$scope.selected_quiz.answers[idx].answer || $scope.selected_quiz.answers[idx].answer.trim() == "") {
            $scope.alert.msg = "editor.messages.provide_answer"
            return false
          }
          if($scope.selected_quiz.isDragQuiz())
            correct = 1
          else
            correct = $scope.selected_quiz.answers[idx].correct || correct;
        }
        if(!correct && (!$scope.selected_quiz.isSurvey() && !$scope.selected_quiz.isTextSurvey())) {
          $scope.alert.msg = "editor.messages.quiz_no_answer"
          return false
        }
      }
      return true;
    };

    $scope.saveQuizBtn = function(options) {
      return $scope.selected_quiz.validate()
        .then(function() {
          removeItemFromVideoQueue($scope.selected_quiz);
          addItemToVideoQueue($scope.selected_quiz, "quiz");
          $scope.selected_quiz.update()
          return saveQuizAnswers(options)
        })
        .catch(function(errors) {
          angular.extend($scope.quiz_errors, errors)
          return true
        })
    }

    function saveQuizAnswers(options) {
      if((
          ($scope.answer_form.$valid && $scope.selected_quiz.isTextVideoQuiz()) ||
          ((!$scope.selected_quiz.isTextVideoQuiz() || $scope.selected_quiz.isTextSurvey()) && isFormValid())
        ) && $scope.selected_quiz.answers.length) {

        $scope.submitted = false;
        $scope.hide_alerts = true;
        $scope.quiz_deletable = false

        $scope.selected_quiz.updateAnswers()
          .then(function() {
            if(!(options && options.exit)) {
              $scope.selected_quiz.getQuizAnswers()
            }
          })

        if(options && options.exit) {
          $scope.exitQuizBtn()
        }
        return false
      } else {
        if($scope.selected_quiz.isTextVideoQuiz()) {
          $scope.alert.msg = $scope.answer_form.$error.atleastone ? "editor.messages.quiz_no_answer" : "editor.messages.provide_answer"
        }
        $scope.submitted = true;
        $scope.hide_alerts = false;
        $scope.lecture_player.controls.seek_and_pause($scope.selected_quiz.time)
        $scope.selected_quiz.hide_quiz_answers = false
        showQuizBackground($scope.selected_quiz)
        return true
      }
    }

    $scope.exitQuizBtn = function() {
      if($scope.quiz_deletable) {
        $scope.selected_quiz.deleteQuiz()
      }
      closeQuizMode()
      if(!$scope.last_details_state)
        DetailsNavigator.close()
    }

    $scope.deleteQuizButton = function(quiz) {
      if($scope.selected_quiz == quiz)
        closeQuizMode()
      quiz.deleteQuiz()
    }

    function closeQuizMode() {
      closeEditor()
      $scope.submitted = false
      $scope.quiz_layer.backgroundColor = ""
      clearQuizVariables()
      closePreviewInclass()
    }

    function clearQuizVariables() {
      if($scope.selected_quiz)
        $scope.selected_quiz.selected = false
      $scope.selected_quiz = null
      $scope.quiz_errors = {}
      $scope.quiz_deletable = false
      VideoQuizModel.clearSelectedVideoQuiz()
    }


    $scope.createVideoLink = function() {
      var time = Math.floor($scope.lecture_player.controls.getTime())
      return { url: $state.href('course.module.courseware.lecture', { module_id: $scope.lecture.group_id, lecture_id: $scope.lecture.id, time: time }, { absolute: true }), time: time }
    }

    $scope.openQuizList = function(ev) {
      DetailsNavigator.open()
      angular.element(ev.target).blur()
      var temp_quiz = {}
      $scope.lecture.addToTimeline(0, "quiz", temp_quiz)
      $timeout(function() {
        $scope.lecture.removeFromTimeline(temp_quiz, 'quiz')
      })
    }

    $scope.addOnlineMarker = function(silent) {
      var insert_time = $scope.lecture_player.controls.getTime()
      MarkerModel.addMarker(insert_time)
        .then(function(marker) {
          $scope.lecture_player.controls.seek_and_pause(insert_time)
          if((!$scope.editing_mode || ($scope.editing_mode && $scope.editing_type != 'quiz')) && !silent)
            $scope.showOnlineMarker(marker)
          addItemToVideoQueue(marker, "marker")

          silent? ($scope.lecture_player.controls.play(insert_time)):(DetailsNavigator.open())
        })
    }



    function saveOpenEditor() {
      var promise = $q.when(false)
      if($scope.editing_mode) {
        if($scope.selected_marker) {
          promise = $scope.saveMarkerBtn($scope.selected_marker, { exit: true })
        } else if($scope.selected_quiz) {
          promise = $scope.saveQuizBtn({ exit: true })
        }
      }
      return promise
    }

    $scope.showOnlineMarker = function(marker) {
      var promise = $q.when(false)
      $scope.selected_marker = MarkerModel.getSelectedMarker()
      if($scope.selected_marker != marker) {
        saveOpenEditor()
          .then(function(error) {
            if(!error) {
              $scope.editing_mode = false;
              $timeout(function() {
                $scope.editing_mode = true;
              })
              $scope.selected_marker = MarkerModel.createInstance(marker).setAsSelected()
              $scope.editing_type = 'marker'
              $scope.lecture_player.controls.seek_and_pause(marker.time)
            }
          })
      }
    }
    $scope.showOnlineMarkerAnnotationOnly = function(marker) {
      var promise = $q.when(false)
      $scope.selected_marker = MarkerModel.createInstance(marker).setAsSelected()
      $scope.lecture_player.controls.cue($scope.lecture.start_time + (marker.time - 0.1 + 5), function() {
        $scope.selected_marker = null
      })
    }
    $scope.dismissAnnotation = function() {
    }
    $scope.deleteMarkerButton = function(marker) {
      if($scope.selected_marker == marker) {
        closeMarkerMode()
      }
      marker.deleteMarker()
    }

    $scope.saveMarkerBtn = function(marker, options) {
      return marker.validate()
        .then(function() {
          var same_markers = $scope.lecture.timeline.getItemsBetweenTimeByType(marker.time, marker.time, "marker")
          if(same_markers.length > 0 && same_markers[0].data.id != marker.id) {
            $scope.alert.msg = "error_message.another_marker" //"There is another marker at the same time"
            $scope.hide_alerts = false;
            return true
          } else {
            removeItemFromVideoQueue(marker)
            addItemToVideoQueue(marker, "marker")
            marker.update()
            closeMarkerMode()
            return false
          }
        })
        .catch(function(errors) {
          angular.extend($scope.marker_errors, errors)
          return true
        })
    }

    function closeMarkerMode() {
      closeEditor()
      clearMarkerVariables()
    }

    function clearMarkerVariables() {
      $scope.selected_marker = null
      $scope.marker_errors = {}
      MarkerModel.clearSelectedMarker()
    }

    function closeEditor() {
      $scope.editing_mode = false;
      $scope.hide_alerts = true;
      $scope.editing_type = null
    }


    $scope.togglePreviewInclass = function() {
      $scope.filtered_timeline_items ? closePreviewInclass() : openPreviewInclass()
    }

    function closePreviewInclass() {
      $scope.filtered_timeline_items = null
      $scope.selected_inclass_item = null
    }

    function openPreviewInclass() {
      $scope.filtered_timeline_items = angular.copy($scope.lecture.timeline.getItemsBetweenTime($scope.selected_quiz.start_time, $scope.selected_quiz.end_time))
      for(var item_index = 0; item_index < $scope.filtered_timeline_items.length; item_index++) {
        var current_item = $scope.filtered_timeline_items[item_index]
        current_item.data.background = "lightgrey"
        current_item.data.color = "black"
        if(current_item.type == 'quiz') {
          current_item.data.inclass_title = $translate('inclass.self_stage')
          current_item.data.background = "#008CBA"
          current_item.data.color = "white"

          var start_item = { time: current_item.data.start_time, type: 'marker', data: { time: current_item.data.start_time } }
          $scope.filtered_timeline_items.splice(0, 0, start_item);
          item_index++

          var group_quiz = angular.copy(current_item)
          group_quiz.data.inclass_title = $translate('inclass.group_stage')
          group_quiz.data.background = "#43AC6A"
          $scope.filtered_timeline_items.splice(++item_index, 0, group_quiz);

          var discussion = angular.copy(current_item)

          discussion.data.inclass_title = $translate('inclass.discussion_stage')
          discussion.data.background = "darkorange"
          discussion.data.color = "white"
          $scope.filtered_timeline_items.splice(++item_index, 0, discussion);
          if(current_item.data.time < current_item.data.end_time) {
            var end_item = { time: current_item.data.end_time, type: 'marker', data: { time: current_item.data.end_time } }
            $scope.filtered_timeline_items.splice($scope.filtered_timeline_items.length, 0, end_item);
          }
          continue;
        }
      }
      $scope.filtered_timeline_items[0].data.inclass_title = $translate('inclass.intro_stage')
      $scope.filtered_timeline_items[0].data.background = "lightgrey"
      $scope.filtered_timeline_items[0].data.color = "black"

      $scope.goToInclassItem($scope.filtered_timeline_items[0])
    }

    $scope.goToInclassItem = function(item) {
      $scope.selected_inclass_item = item
      $scope.lecture_player.controls.seek_and_pause($scope.selected_inclass_item.data.time)
      $scope.selected_quiz.hide_quiz_answers = $scope.selected_inclass_item.type != 'quiz'
      if($scope.selected_inclass_item.type == 'quiz'){
        $scope.selected_quiz.hide_quiz_answers = false
        showQuizBackground($scope.selected_quiz)
      }
      else{
        $scope.selected_quiz.hide_quiz_answers = true
        hideQuizBackground()
      }
    }

    $scope.inclassNextItem = function() {
      var next_index = $scope.filtered_timeline_items.indexOf($scope.selected_inclass_item) + 1
      if(next_index < $scope.filtered_timeline_items.length)
        $scope.goToInclassItem($scope.filtered_timeline_items[next_index])
    }

    $scope.inclassPrevItem = function() {
      var prev_index = $scope.filtered_timeline_items.indexOf($scope.selected_inclass_item) - 1
      if(prev_index >= 0)
        $scope.goToInclassItem($scope.filtered_timeline_items[prev_index])
    }

    function startTrimMode() {
      $scope.editing_mode = true
      $scope.editing_type = 'video'
    }

    function saveTrimVideo() {
      $scope.lecture.start_time = Math.floor($scope.lecture.start_time)
      $scope.lecture.end_time = Math.floor($scope.lecture.end_time)
      closeEditor()
      $scope.refreshVideo()
    }


    function setUpShortcuts() {
      shortcut.add("i", function() {
        $scope.addQuestion()
      }, { "disable_in_input": true, 'propagate': false });

      shortcut.add("m", function() {
        $scope.addOnlineMarker()
      }, { "disable_in_input": true, 'propagate': false });

      shortcut.add("Shift+m", function() {
        $scope.addOnlineMarker(true)
      }, { "disable_in_input": true, 'propagate': false });
    }

    function removeShortcuts() {
      shortcut.remove("i");
      shortcut.remove("m");
    }

    function setUpEventsListeners() {
      $scope.$on("show_online_quiz", function(ev, quiz) {
        $scope.showOnlineQuiz(quiz)
      })

      $scope.$on("delete_online_quiz", function(ev, quiz) {
        $scope.deleteQuizButton(quiz)
      })

      $scope.$on("show_online_marker", function(ev, marker) {
        $scope.showOnlineMarker(marker)
      })

      $scope.$on("delete_online_marker", function(ev, marker) {
        $scope.deleteMarkerButton(marker)
      })

      $scope.$on("add_online_quiz", function(ev, quiz_type, question_type) {
        $scope.insertQuiz(quiz_type, question_type)
      })

      $scope.$on("start_trim_video", function() {
        startTrimMode()
      })

      $scope.$on("close_trim_video", function() {
        saveTrimVideo()
      })

      $scope.$on("show_quiz_background",function (ev, quiz) {
         showQuizBackground(quiz)
      })

      $scope.$on("hide_quiz_background",function (ev) {
         hideQuizBackground()
      })
    }

    function showUnsavedQuizDialog() {
      return ngDialog.openConfirm({
        template: '<div class="ngdialog-message">\
                  <h2><b><span translate>lectures.messages.change_lost</span></b></h2>\
                  <span translate>lectures.messages.navigate_away</span>\
                  </div>\
                  <div class="ngdialog-buttons">\
                      <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)" translate>global.leave</button>\
                      <button type="button" class="ngdialog-button ngdialog-button-primary"  ng-click="confirm(1)"translate>global.stay</button>\
                  </div>',
        plain: true,
        className: 'ngdialog-theme-default ngdialog-dark_overlay ngdialog-theme-custom',
        showClose: false,
      })
    }

    $rootScope.$on('$stateChangeStart',
      function(event, toState, toParams, fromState, fromParams, options) {
        if(!$scope.leave_state) {
          event.preventDefault();
          saveOpenEditor()
            .then(function(error) {
              var options = { reload: $scope.preview_as_student }
              if(error) {
                showUnsavedQuizDialog()
                  .catch(function(value) {
                    if($scope.selected_marker) {
                      closeMarkerMode()
                    } else if($scope.selected_quiz) {
                      $scope.exitQuizBtn()
                    }
                    $scope.leave_state = true
                    $state.go(toState, toParams, options)
                  })
              } else {
                $scope.leave_state = true
                $state.go(toState, toParams, options)
              }
            })
        }
      })

    $scope.$on("$destroy", function() {
      removeShortcuts()
    })

  }]);
