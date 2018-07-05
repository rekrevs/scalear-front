'use strict';

angular.module('scalearAngularApp')
  .controller('studentLectureMiddleCtrl', ['$scope', '$stateParams', 'Lecture', '$interval', '$translate', '$state', '$log', '$timeout', 'Page', '$filter', 'OnlineQuiz', 'ScalearUtils', 'ContentNavigator', 'TimelineNavigator', '$rootScope', 'TimelineFilter', '$window', 'VideoInformation', 'CourseModel', 'ModuleModel', 'ItemsModel', 'VideoEventLogger', '$modal', 'Course', '$q', 'ErrorHandler', '$location','MobileDetector', function($scope, $stateParams, Lecture, $interval, $translate, $state, $log, $timeout, Page, $filter, OnlineQuiz, ScalearUtils, ContentNavigator, TimelineNavigator, $rootScope, TimelineFilter, $window, VideoInformation, CourseModel, ModuleModel, ItemsModel, VideoEventLogger, $modal, Course, $q, ErrorHandler, $location, MobileDetector) {

    $scope.course = CourseModel.getSelectedCourse()
    $scope.video_layer = {}
    $scope.quiz_layer = {}
    $scope.lecture_player = {}
    $scope.lecture_player.controls = {}
    $scope.lecture_player.events = {}
    $scope.resize = {}

    $scope.distance_peer_session_id = null

    $scope.TimelineNavigator = TimelineNavigator
    $scope.ContentNavigator = ContentNavigator

    if(!MobileDetector.isPhone()){
      $scope.ContentNavigator.open()
    }

    if ($scope.preview_as_student) {
      $scope.TimelineNavigator.open()
    }

    $scope.delayed_timeline_open = $scope.TimelineNavigator.getStatus()

    $scope.$on("export_notes", function() {
      $scope.exportNotes()
    })

    $scope.$on('timeline_navigator_change', function(ev, status) {
      if (!status) {
        $timeout(function() {
          $scope.delayed_timeline_open = false
        }, 400)
      } else
        $scope.delayed_timeline_open = status
    })

    $scope.$on('exit_preview', function() {
      if ($scope.lecture_player.element) {
        $scope.skip_pause_update = true
        $scope.lecture_player.controls.pause()
      }
    })

    $scope.$watch('distance_peer_session_id', function(newval, oldval) {
      if ($scope.distance_peer_session_id && $scope.lecture != null) {
        if (!$scope.distance_peer_status) {
          Lecture.checkIfInDistancePeerSession({
              course_id: $scope.lecture.course_id,
              lecture_id: $scope.lecture.id
            }).$promise
            .then(function(response) {
              if (response.distance_peer != "no_peer_session") {
                $scope.name = response.name
                $scope.distance_peer_status = response.distance_peer.status
                changeDistancePeerStatusMessage()
                $scope.distance_peer_message_in_box = $translate.instant("distance_peer.message_video", { name: $scope.name })

                $scope.lecture_player.events.onReady(true)
              }
            })
        }
      }
    });

    var initVariables = function() {
      $scope.studentAnswers = {}
      $scope.explanation = {}
      $scope.fullscreen = false
      $scope.total_duration = 0
      $scope.elapsed_width = 0
      $scope.slow = false
      $scope.course.warning_message = null
      $scope.video_class = 'flex-video'
      $scope.container_class = ''
      $scope.passed_requirments = true
      $scope.lecture = null
      $scope.video_ready = false
      $scope.show_progressbar = false

      removeShortcuts()
        //  distance peer variables
      $scope.next_stop_time = null
      $scope.distance_peer_session_id = null
      $scope.distance_peer_status = null
      $scope.distance_peer_message_in_box = null
      $scope.quiz_cue_distance_peer_list = {}
    }

    var clearDistancePeerVariables = function() {
      $scope.next_stop_time = null
      $scope.distance_peer_status = null
      $scope.distance_peer_message_in_box = null
      $scope.distance_peer_session_id = null
      $scope.quiz_cue_distance_peer_list = {}
      $scope.lecture_player.events.onReady(true)
    }

    var adjustButtonsOnScreen = function(){
      if($rootScope.is_mobile){
        var class_name =  (MobileDetector.isTablet())? "tiny" : "really-tiny"
        $timeout(function(){
          $(".button").removeClass("small").addClass(class_name)
        })
      }
    }

    var init = function() {
      initVariables()
      if (!$rootScope.is_mobile) {
        document.addEventListener(screenfull.raw.fullscreenchange, function() {
          if (!screenfull.isFullscreen) {
            goSmallScreen()
            $scope.$apply()
          }
        });
      } else {
        setupMobileView()
      }

      $scope.$watch('timeline', function() {
        if ($scope.timeline) {
          goToLecture($state.params.lecture_id)
        }
      })

      $rootScope.$on('answer_changed', function(ev){
        $scope.checkAnsClicked = false
      })

      $scope.$on('remove_from_timeline', function(ev, item) { // used for deleting items from directives like confused and discussions
        if ($scope.timeline) {
          var lec_id = item.data ? item.data.lecture_id : $state.params.lecture_id
          var index = $scope.timeline['lecture'][lec_id].items.indexOf(item)
          $scope.timeline['lecture'][lec_id].items.splice(index, 1)
        }
      })

      if (!$scope.preview_as_student) {
        var unregisterStateEvent = $rootScope.$on('$stateChangeStart',
          function(event, toState, toParams, fromState, fromParams, options) {
            var current_time = $scope.lecture_player.controls.getTime()
            if ( current_time ){
              event.preventDefault();
              var percent_view = Math.round(((current_time / $scope.total_duration) * 100))
              updateViewPercentage( percent_view , "seek")
                .then(function(){
                  $state.go(toState, toParams, options)
                })
              unregisterStateEvent()
            }
        })
      }
    }

    var setupMobileView=function(){
      $('#lecture_container').addClass('ipad')
      $('.container').addClass('ipad')
      if(MobileDetector.isPhone()){
        toggleTimelineMobileView()
        $(window).bind('orientationchange', toggleTimelineMobileView);
      }
      adjustButtonsOnScreen()
    }

    var toggleTimelineMobileView=function(){
      if(window.orientation == 90 || window.orientation == -90) {
        $scope.TimelineNavigator.close()
      }
      else{
        openTimeline()
      }
    }

    var setShortcuts = function() {
      shortcut.add("c", function() {
        $scope.addConfused();
        $scope.$apply()
      }, { "disable_in_input": true });
      shortcut.add("q", function() {
        $scope.addQuestionBlock();
        $scope.$apply()
      }, { "disable_in_input": true });
      shortcut.add("n", function() {
        $scope.addNote();
        $scope.$apply()
      }, { "disable_in_input": true });
      shortcut.add("f", function() {
        $scope.toggleFullscreen();
        $scope.$apply()
      }, { "disable_in_input": true });
    }

    var removeShortcuts = function() {
      shortcut.remove("c");
      shortcut.remove("q");
      shortcut.remove("n");
      shortcut.remove("f");
    }

    var goToLecture = function(id) {
      if ($scope.timeline) {
        $timeout(function() {
          $scope.lecture = $scope.timeline['lecture'][id].meta
          var module = ModuleModel.getSelectedModule()
          Page.setTitle(module.name + ': ' +
            $scope.lecture.name + ' - ' +
            $scope.course.name);
        })

        initVariables()
        clearQuiz()
        $scope.closeReviewNotify()

        Lecture.getLectureStudent({
            course_id: $state.params.course_id,
            lecture_id: id
          },
          function(data) {
            var lec = data.lecture
            $scope.next_item = data.next_item
            $scope.alert_messages = data.alert_messages;
            for (var key in $scope.alert_messages) {
              if (key == "due")
                $scope.course.warning_message = $translate.instant("events.due_date_passed") + " - " + $scope.alert_messages[key][0] + " (" + $scope.alert_messages[key][1] + " " + $translate.instant("time." + $scope.alert_messages[key][2]) + ") " + $translate.instant("time.ago")
              else if (key == "today")
                $scope.course.warning_message = $translate.instant("events.due") + " " + $translate.instant("time.today") + " " + $translate.instant("at") + " " + $filter("date")($scope.alert_messages[key], 'shortTime')
            }
            if (!$scope.preview_as_student) {
              for (var item_type in lec.requirements) {
                for (var index in lec.requirements[item_type]) {
                  var item = ItemsModel.getById(lec.requirements[item_type][index], item_type)
                  if (!item.done) {
                    $scope.passed_requirments = false
                  }
                }
              }
            }

            if ($scope.passed_requirments)
              setShortcuts()
            $timeout(function() {
              $scope.scrollIntoView()
            }, 500)
          })
      }
    }

    var logVideoEvent = function(event, from_time, to_time) {
      VideoEventLogger.log(
        $state.params.course_id,
        $state.params.lecture_id,
        event,
        from_time,
        to_time,
        $scope.quiz_mode,
        VideoInformation.speed,
        VideoInformation.volume,
        $scope.fullscreen
      )
    }

    var showQuizOnline = function(quiz) {
      var index = $scope.lecture.video_quizzes.map(function(x) {return x.time; }).indexOf(quiz.time);
      $scope.next_quiz = null
      if ($scope.lecture.video_quizzes[index + 1]) {
        if (($scope.lecture.video_quizzes[index + 1].time - quiz.time) <= 1)
          $scope.next_quiz = $scope.lecture.video_quizzes[index + 1]
      }
      $scope.seek(quiz.time)
      $scope.lecture_player.controls.pause()
      $scope.closeReviewNotify()
      $scope.studentAnswers[quiz.id] = {}
      $scope.selected_quiz = quiz
      $scope.quiz_mode = true
      $scope.check_answer_title = "lectures.button.check_answer"
      $scope.selected_quiz.actual_display_text = $scope.selected_quiz.display_text
      if ($scope.distance_peer_session_id ) {
        $scope.check_answer_title = "lectures.button.submit_my_vote"
      }

      if (quiz.quiz_type == 'html' || quiz.quiz_type == 'html_survey') {
        $log.debug("HTML quiz")
        $scope.quiz_layer.backgroundColor = "white"
        $scope.quiz_layer.overflowX = 'hidden'
        $scope.quiz_layer.overflowY = 'auto'
        if (quiz.question_type.toUpperCase() == "DRAG") {
          $scope.studentAnswers[quiz.id] = quiz.online_answers_drag;
        }
      } else {
        $scope.quiz_layer.backgroundColor = ""
        $scope.quiz_layer.overflowX = ''
        $scope.quiz_layer.overflowY = ''
      }

      if (quiz.question_type.toUpperCase() == "FREE TEXT QUESTION")
        $scope.studentAnswers[quiz.id] = "";

      if (quiz.quiz_type == 'survey' || quiz.question_type.toUpperCase() == "FREE TEXT QUESTION" || quiz.quiz_type == 'html_survey')
        $scope.check_answer_title = "lectures.button.submit"

      $scope.last_quiz = quiz
      $scope.backup_quiz = angular.copy(quiz)
    }

    var clearStudentAnswer = function() {
      $scope.selected_quiz.online_answers.forEach(function(answer) {
        if (answer.selected)
          answer.selected = null;
      })
    }


    var changeDistancePeerStatusMessage = function() {
      if ($scope.distance_peer_status == 1){
        $scope.distance_peer_message_in_box = $translate.instant("distance_peer.the_another_student_finished_message_video", { name: $scope.name })
      }
      else if ($scope.distance_peer_status == 2){
        $scope.distance_peer_message_in_box = $translate.instant("distance_peer.the_another_student_finished_message_quiz_intro", { name: $scope.name })
      }
      else if ($scope.distance_peer_status == 3){
        $scope.distance_peer_message_in_box = $translate.instant("distance_peer.the_another_student_finished_message_quiz_self", { name: $scope.name })
      }
      else if ($scope.distance_peer_status == 4){
        $scope.distance_peer_message_in_box = $translate.instant("distance_peer.the_another_student_finished_message_quiz_group", { name: $scope.name })
      }
      else if ($scope.distance_peer_status == 5){
        $scope.distance_peer_message_in_box = $translate.instant("distance_peer.the_another_student_finished_message_quiz_end", { name: $scope.name })
      }
    }

    var changeDistancePeerStatusAnnotationWaiting = function(status){
      if (status == 2){ // just finished video and waiting for anohter student to finsihe video
        showAnnotation($translate.instant("distance_peer.waiting_message_quiz_intro_after_video"))
      }
      else if (status == 3){
        showAnnotation($translate.instant("distance_peer.waiting_message_quiz_self_after_intro"))
      }
      else if (status == 4){
        showAnnotation($translate.instant("distance_peer.waiting_message_quiz_group_after_self"))
      }
      else if (status == 5){
        showAnnotation($translate.instant("distance_peer.waiting_message_quiz_end_after_group"))
      }
      else if (status == 1){
        showAnnotation($translate.instant("distance_peer.waiting_message_video_after_quiz_end"))
      }
    }

    var checkIfDistancePeerStatusIsSync = function(distance_peer_id, status, new_quiz_time, quiz) {
      Lecture.checkIfDistancePeerStatusIsSync({
          course_id: $scope.lecture.course_id,
          lecture_id: $scope.lecture.id,
          distance_peer_id: distance_peer_id
        }).$promise
        .then(function(response) {
          if (response.status == "start") {
            cancelcheckIfDistancePeerStatusIsSyncTimer()
            $scope.distance_peer_status = status
            changeDistancePeerStatusMessage()
            if ($scope.distance_peer_status == 1){
              showAnnotation($translate.instant("distance_peer.the_another_student_finished_message_video" ))
            }
            else if ($scope.distance_peer_status == 2){
              showAnnotation($translate.instant("distance_peer.the_another_student_finished_message_quiz_intro" ))
            }
            else if ($scope.distance_peer_status == 3){
              showAnnotation($translate.instant("distance_peer.the_another_student_finished_message_quiz_self" ))
            }
            else if ($scope.distance_peer_status == 4){
              showAnnotation($translate.instant("distance_peer.the_another_student_finished_message_quiz_group" ))
            }
            else if ($scope.distance_peer_status == 5){
              showAnnotation($translate.instant("distance_peer.the_another_student_finished_message_quiz_end" ))
            }

            $scope.next_stop_time = new_quiz_time
            cancelStatusTimer()
            if (status == 3 || status == 4) {
              $scope.hide_quiz_button = true
              showQuizOnline(quiz)
              $interval(function() {
                $scope.hide_quiz_button = false
              }, 5000)
              var timer = (status == 3) ? quiz.self : quiz.in_group
              clearStudentAnswer()
              setStatusTimer(timer)
              startStatusTimer()
            }
          }
        })
    }

    var startcheckIfDistancePeerStatusIsSyncTimer = function(distance_peer_id, status, new_quiz_time, quiz) {
      $scope.check_if_distance_peer_is_sync = $interval(function() {
        checkIfDistancePeerStatusIsSync(distance_peer_id, status, new_quiz_time, quiz);
      }, 5000)
    }

    var cancelcheckIfDistancePeerStatusIsSyncTimer = function() {
      if ($scope.check_if_distance_peer_is_sync)
        $interval.cancel($scope.check_if_distance_peer_is_sync)
      $scope.session_votes = null
    }

    var changeStatusAndWaitTobeSync = function(status, new_quiz_time, quiz) {
      var online_quiz_id = "do_not_updated"
      if (status != 6) {
        online_quiz_id = quiz.id
      };

      $scope.lecture_player.controls.pause()
      Lecture.changeStatusDistancePeer({
          course_id: $scope.lecture.course_id,
          lecture_id: $scope.lecture.id,
          status: status,
          online_quiz_id: online_quiz_id,
          distance_peer_id: $scope.distance_peer_session_id
        }).$promise
        .then(function(response) {
          if (status != 6) {
            startcheckIfDistancePeerStatusIsSyncTimer($scope.distance_peer_session_id, status, new_quiz_time, quiz)
            // showAnnotation($translate.instant("distance_peer.waiting_the_another_student_to_finish", { name: $scope.name }))
            changeDistancePeerStatusAnnotationWaiting(status)
          } else {
            clearDistancePeerVariables()
            cancelcheckIfDistancePeerStatusIsSyncTimer()
            cancelcheckIfDistancePeerIsAliveTimer()
          }
        })
    }

    var showQuizDistancePeer = function(quiz, cue_id) {
      // start start_time (intro part) then self then group then end_time(discussion part)
      // if it doesnot have start and end tmie play self and group check for
      var index = $scope.lecture.video_quizzes.map(function(x) {
        return x.time; }).indexOf(quiz.time);
      // add to the 4 time cue start time , quiz , end time , end of the end time(star of new time)
      // start time
      // addd que to the video with intro time && remove the progress bar
      if (quiz.start_time != quiz.time) {
        var a = $scope.lecture_player.controls.cue($scope.lecture.start_time + (quiz.start_time), function() {
          if ($scope.lecture.start_time + (quiz.start_time) >= $scope.next_stop_time){
            changeStatusAndWaitTobeSync(2, quiz.time, quiz)
          }
        })
      }
      // quiz time
      // add que for self and group time && remove the progress bar && start the timer
      var b = $scope.lecture_player.controls.cue($scope.lecture.start_time + (quiz.time), function() {
          if ($scope.lecture.start_time + (quiz.time) >= $scope.next_stop_time)
            if ($scope.distance_peer_status == 2) {
              changeStatusAndWaitTobeSync(3, quiz.time, quiz)
            }
          if ($scope.distance_peer_status == 3) {
            showQuizOnline(quiz)
          } else if ($scope.distance_peer_status == 4) {
            showQuizOnline(quiz)
          }
        })
        // // end of the end time(star of new intro)
        // // change the online quiz id in back end
      var c = $scope.lecture_player.controls.cue($scope.lecture.start_time + (quiz.end_time + 0.6), function() {
        if ($scope.lecture.start_time + (quiz.end_time) >= $scope.next_stop_time) {
          if ($scope.lecture.video_quizzes[index + 1] != null) {
            changeStatusAndWaitTobeSync(1, $scope.lecture.video_quizzes[index + 1].start_time, quiz)
          } else {
            changeStatusAndWaitTobeSync(1, $scope.total_duration, quiz)
          }
        }
      })
    }

    $scope.lecture_player.events.onReady = function(close_student) {
      $scope.slow = false
      $scope.total_duration = $scope.lecture_player.controls.getDuration()
      $scope.lecture_player.controls.removeAllTrackEvents()

      var duration_milestones = [0]
      var quiz_cue = 0
      for (var each_30_second = 30; each_30_second < $scope.total_duration; each_30_second = each_30_second + 30) {
        duration_milestones.push(((each_30_second / $scope.total_duration) * 100))
      }

      checkPeerSession().then(function () {
        if (!close_student && $scope.lecture.distance_peer && !$scope.distance_peer_session_id) {
          $scope.openStudentList($scope.lecture.id, $scope.lecture.course_id)
        }
        var quiz_time_offset = 0
        if ($scope.lecture.video_quizzes) {
          $scope.lecture.video_quizzes.forEach(function (quiz, index) {
            if (quiz.time >= $scope.total_duration - 2) {
              quiz.time = ($scope.total_duration - 2) + quiz_time_offset
              quiz_time_offset += 0.2
            }
            if (!$scope.lecture.distance_peer || !$scope.distance_peer_session_id) {
              $scope.lecture_player.controls.cue($scope.lecture.start_time + (quiz.time - 0.1), function () {

                showQuizOnline(quiz)
                // $scope.$apply()
              })
            } else {
              if (!(quiz.id in $scope.quiz_cue_distance_peer_list)) {
                quiz_cue = $scope.lecture_player.controls.cue($scope.lecture.start_time + (quiz.start_time), function () {
                  showQuizDistancePeer(quiz)
                })
              } else {
                if (!(quiz.id in $scope.quiz_cue_distance_peer_list)) {
                  quiz_cue = $scope.lecture_player.controls.cue($scope.lecture.start_time + (quiz.start_time), function () {
                    showQuizDistancePeer(quiz)
                  })
                  $scope.quiz_cue_distance_peer_list[quiz.id] = quiz_cue.id
                }
              }
            }
          })
        }
      })


      if( $scope.lecture.annotations  ){
        $scope.lecture.annotations.forEach(function(marker) {
          if (marker.annotation) {
            $scope.lecture_player.controls.cue($scope.lecture.start_time + (marker.time - 0.1), function() {
              if (marker.as_slide) {
                $scope.lecture_player.controls.pause()

                showSlideNote(marker)
              }
              else{
                showDynamicAnnotation(marker)
              }
            })
            if (!marker.as_slide) {
              $scope.lecture_player.controls.cue($scope.lecture.start_time + (marker.time - 0.1 + marker.duration), function() {
                $scope.dismissDynamicAnnotation()
              })
            }
          }
        })
      }
      duration_milestones.forEach(function(milestone) {
        $scope.lecture_player.controls.cue(($scope.total_duration * milestone) / 100, function() {
          updateViewPercentage(milestone, "mile_cue")
        })
      })

      $scope.video_ready = true
      if (!($scope.lecture_player.controls.youtube && $rootScope.is_mobile)) {
        $scope.show_progressbar = true
      }
      var time = $state.params.time
      if (time) {
        $timeout(function (argument) {
          $scope.seek(time);
        })
        $timeout(function() {
          $scope.scrollIntoView()
        }, 500)
        $location.search('time', 0);
      } else if (!($rootScope.is_mobile)) {
        $scope.lecture_player.controls.seek(0)
        $scope.lecture_player.controls.pause()
      }
    }

    var updateViewPercentage = function(milestone, source) {
      if(!$scope.lecture.watched_percentage || milestone > $scope.lecture.watched_percentage || ($scope.lecture.watched_percentage==100 && !$scope.lecture.done)){
        var lecture = $scope.lecture // in case request callback got delayed and lecture has changed
        $scope.not_done_msg = false
        return lecture.updateViewPercentage(milestone)
          .then(function(data){
            $scope.last_navigator_state = $scope.ContentNavigator.getStatus()
            if (data.lecture_done && !lecture.done) {
              lecture.markDone()
            } else if (milestone == 100){
              $scope.not_done_msg = true
            }
            $log.debug("Watched:" + data.watched + "%" + " solved:" + data.quizzes_done[0] + " total:" + data.quizzes_done[1], source)
            $scope.lecture.watched_percentage = data.watched
            $scope.lecture.quiz_percentage = data.quizzes_done[0] + " / " + data.quizzes_done[1]
          })
      }

      return $q.when({});
    }

    $scope.scrollIntoView = function() {
      if ($scope.lecture) {
        $('.student_timeline').scrollToThis('#outline_' + $scope.lecture.id, { offsetTop: $('.student_timeline').offset().top, duration: 400 });
      }
    }

    $scope.nextItem = function() {
      if ($scope.next_item.id) {
        if (!$scope.last_navigator_state)
          ContentNavigator.close()
        if ($scope.next_item.class_name == 'lecture')
          $scope.seek(null, $scope.next_item.id)
        else {
          var next_state = "course.module.courseware." + $scope.next_item.class_name
          var s = $scope.next_item.class_name + "_id"
          var to = {}
          to[s] = $scope.next_item.id
          to["module_id"] = $scope.next_item.group_id
          $state.go(next_state, to);
        }
      }
    }

    $scope.replay = function() {
      $scope.seek(0)
      $timeout(function() {
        $scope.lecture_player.controls.play()
      }, 1000)
    }

    $scope.refreshVideo = function() {
      $scope.slow = false
      var temp_url = $scope.lecture.url
      $scope.lecture.url = ""
      $timeout(function() {
        $scope.lecture.url = temp_url
      })
    }

    $scope.seek = function(time, lecture_id) { // must add condition where lecture is undefined could be coming from progress bar
      $scope.closeReviewNotify()
      $scope.dismissAnnotation()
      $scope.dismissDynamicAnnotation()
      var current_time = $scope.lecture_player.controls.getTime()
      var current_time_percent  = Math.round((current_time / $scope.total_duration) * 100)
      $scope.seek_to_time = time
      var percent_view = Math.round((($scope.seek_to_time / $scope.total_duration) * 100))
      if ( ( $scope.lecture.watched_percentage < current_time_percent )  &&  ( percent_view < current_time_percent  ) ) {
        updateViewPercentage( current_time_percent , "seek")
      }

      if (!lecture_id || lecture_id == $scope.lecture.id) { //if current lecture
        if ($scope.next_stop_time < time && $scope.distance_peer_session_id) { // if in distance_peer session do not seek after next quiz time
          $scope.lecture_player.controls.pause()
          showAnnotation($translate.instant("distance_peer.prevent_seek_forward"))
        }
        else if( $scope.lecture.skip_ahead || (percent_view <  Math.max( $scope.lecture.watched_percentage , current_time_percent   )  ) ){ //
          if (time >= 0 && $scope.show_progressbar) {
            $scope.lecture_player.controls.seek(time)
            if (!$scope.log_event_timeout) {
              $scope.log_event_timeout = $timeout(function() {
                logVideoEvent("seek", current_time, $scope.seek_to_time)
                updateViewPercentage(percent_view, "seek")
                $scope.log_event_timeout = null
              }, 1000)
            }
          }
        }
      } else {
        $state.go("course.module.courseware.lecture", { lecture_id: lecture_id }, { reload: false, notify: false });
        goToLecture(lecture_id)
        $scope.go_to_time = time
      }
      $scope.video_end = false
    }

    $scope.seek_and_pause = function(time, lecture_id) {
      if ($scope.lecture_player.controls.getTime() != time)
        clearQuiz()
      $scope.skip_pause_update = true
      $scope.seek(time, lecture_id)
      $scope.lecture_player.controls.pause()
    }

    $scope.progressSeek = function(time) {
      $scope.seek(time)
      checkIfQuizSolved()
      checkIfSlideShown()
    }

    var checkIfQuizSolved = function() {
      if (!$scope.distance_peer_session_id) {
        if ($scope.quiz_mode) {
          if (!$scope.selected_quiz.solved_quiz && $scope.selected_quiz.graded && $scope.lecture_player.controls.getTime() >= $scope.selected_quiz.time)
            returnToQuiz($scope.selected_quiz.time)
          else {
            if ($scope.display_review_message) {
              reviewInclass()
              $scope.display_review_message = false
            }
            clearQuiz()
            if ($scope.next_quiz) {
              showQuizOnline($scope.next_quiz)
            }
          }
        }
      } else {
        if ($scope.quiz_mode) {
          if ($scope.selected_quiz.graded && $scope.lecture_player.controls.getTime() >= $scope.selected_quiz.time) {
            if ($scope.selected_quiz.quiz_type == "html" || $scope.selected_quiz.quiz_type == "html_survey") {
              if ($scope.answer_form.$error.atleastone) {
                returnToQuiz($scope.selected_quiz.time)
              } else {
                clearQuiz()
              }
            } else {
              var selected_answers = []
              $scope.selected_quiz.online_answers.forEach(function(answer) {
                if (answer.selected)
                  selected_answers.push(answer.id)
              })
              if (selected_answers.length == 0) {
                returnToQuiz($scope.selected_quiz.time)
              } else {
                clearQuiz()
              }
            }
          } else {
            if ($scope.display_review_message) {
              reviewInclass()
              $scope.display_review_message = false
            }
            clearQuiz()
            if ($scope.next_quiz) {
              showQuizOnline($scope.next_quiz)
            }
          }
        }
      }
    }

  var checkIfSlideShown = function() {
      if ($scope.slide_note) {
        returnToSlideNote($scope.slide_note.time)
      }
    }

    var clearQuiz = function() {
      $scope.selected_quiz = '';
      $scope.quiz_mode = false;
      $scope.quiz_layer.backgroundColor = ""
      $scope.quiz_layer.overflowX = ''
      $scope.quiz_layer.overflowY = ''
      var marks = document.getElementsByClassName('mark')
      while(marks[0]){
        marks[0].parentNode.removeChild(marks[0])
      }

    }

    var returnToQuiz = function(time) {
      $scope.seek(time)
      $scope.lecture_player.controls.pause()
      showNotification('lectures.choose_correct_answer')
    }
    var returnToSlideNote = function(time) {
      $scope.seek(time)
      $scope.lecture_player.controls.pause()
    }

    $scope.lecture_player.events.onPlay = function() {
      $log.debug("playing ")
      checkIfQuizSolved()
      checkIfSlideShown()
      $scope.dismissAnnotation()

      if (!$scope.quiz_mode && $scope.distance_peer_session_id) {
        checkIfCanLeaveStatus()
      }
      $scope.video_end = false
      logVideoEvent("play", $scope.lecture_player.controls.getTime())

      if(MobileDetector.isPhone()){
        if($scope.temp_timeline_item){
          if($scope.temp_timeline_item.type = "discussion"){
            $scope.$emit('remove_from_timeline', $scope.temp_timeline_item)
          }
          cleanState()
        }
      }
    }

    $scope.lecture_player.events.onPause = function() {
      if (!$scope.skip_pause_update) {
        $log.debug("pausing")
        var current_time = $scope.lecture_player.controls.getTime()
        var percent_view = Math.round(((current_time / $scope.total_duration) * 100))
        logVideoEvent("pause", current_time)
        updateViewPercentage(percent_view, "pause")
      }
      $scope.skip_pause_update = false
    }

    $scope.lecture_player.events.onEnd = function() {
      $scope.video_end = true
      updateViewPercentage(100, "end")
    }

    $scope.lecture_player.events.onSlow = function(is_youtube) {
      $log.debug("youtube is")
      $log.debug(is_youtube)
      $scope.is_youtube = is_youtube
      $scope.slow = true
    }

    $scope.lecture_player.events.canPlay = function() {
      if ($scope.go_to_time) {
        if ($scope.go_to_time >= 0)
          var time = $scope.go_to_time
        $timeout(function() {
          $scope.seek_and_pause(time)
        })
        $scope.go_to_time = null
      }
    }

    $scope.lecture_player.events.waiting = function() {
      if ($rootScope.is_mobile && !$scope.show_progressbar) {
        $scope.video_ready = true
        $scope.show_progressbar = true
        if(MobileDetector.isPhone()){
          goFullscreen()
        }
      }
    }

    var showNotification = function(msg, sub_msg, middle_msg) {
      $scope.notification_message = $translate.instant(msg);
      $scope.notification_middle_message = $translate.instant(middle_msg);
      $scope.notification_submessage = $translate.instant(sub_msg);
      $interval(function() {
        removeNotification()
      }, 3000, 1);
    }

    var removeNotification = function() {
      if ($scope.notification_message) {
        $scope.notification_message = null;
        window.onmousemove = null
      }
    }

    $scope.toggleFullscreen = function() {
      $scope.fullscreen ? goSmallScreen() : goFullscreen()
      logVideoEvent("fullscreen", $scope.lecture_player.controls.getTime())
    }

    $scope.toggleVideoPlayback = function() {
      $scope.lecture_player.controls.paused() ? $scope.lecture_player.controls.play() : $scope.lecture_player.controls.pause()
    }

    var goFullscreen = function() {
      $scope.fullscreen = true
      if ($rootScope.is_mobile) {
        $scope.resize.big()
        $scope.container_class = 'mobile_video_full'
        $scope.video_layer = { 'width': '100%', 'height': angular.element($window).height() - 70, 'position': 'relative' }

        adjustButtonsOnScreen()

         if(MobileDetector.isPhone()){
          $scope.video_layer['paddingBottom'] = '0'
        }

        function orientationchange(){
          $scope.video_layer['height'] = angular.element($window).height() - 70
          $scope.resize.big()
          $scope.$apply()
        }

        $(window).bind('orientationchange', function(event) {
          if(MobileDetector.isAndroid()){
            $timeout(orientationchange, 200)
          }
          else{
            orientationchange()
          }
        })
      } else if (ScalearUtils.calculateScreenRatio() == "4:3") {
        $scope.video_layer = { 'marginTop': "5.5%", 'marginBottom': "5.5%" }
      } else if (ScalearUtils.calculateScreenRatio() == "16:9") {
        if ($scope.distance_peer_session_id) {
          $scope.video_layer = { 'paddingBottom': '44.7%' }
        } else {
          $scope.video_layer = { 'paddingBottom': '51.7%' }
        };

      }
    }

    var goSmallScreen = function() {
      $scope.fullscreen = false
      $scope.video_layer = {}
      if ($rootScope.is_mobile) {
        $scope.resize.small()
        $scope.container_class = ""
        $(window).off('orientationchange');
        if(MobileDetector.isPhone()){
          $(window).bind('orientationchange', toggleTimelineMobileView);
          cleanState()
        }
        adjustButtonsOnScreen()
      }
    }

    $scope.playOnPhone=function(){
      $scope.toggleVideoPlayback()
    }

    var openTimeline = function() {
      $scope.TimelineNavigator.open()
      $timeout(function() {
        $scope.scrollIntoView()
      })
    }

    $scope.addQuestionBlock = function() {
      var time = $scope.lecture_player.controls.getTime()
      $scope.last_fullscreen_state = $scope.fullscreen;
      $scope.last_video_state = !$scope.lecture_player.controls.paused() //$scope.play_pause_class;
      $scope.lecture_player.controls.pause()
      TimelineFilter.set('discussion', true)
      $scope.last_timeline_state = !$scope.TimelineNavigator.getStatus()
      if ($scope.last_discussion) {
        var discussion = $scope.timeline['lecture'][$state.params.lecture_id].items[$scope.last_discussion]
        $scope.last_discussion = null
        $scope.$broadcast("post_question", discussion)
      }
      $scope.last_discussion = $scope.timeline['lecture'][$state.params.lecture_id].add(time, "discussion", null);

      if(MobileDetector.isPhone() && $scope.fullscreen){
        $scope.temp_timeline_item = $scope.timeline['lecture'][$state.params.lecture_id].items[$scope.last_discussion]
      }
      else{
        goSmallScreen()
        openTimeline()
      }
    };

    $scope.addConfused = function() {
      var time = $scope.lecture_player.controls.getTime()
      Lecture.confused({
          course_id: $state.params.course_id,
          lecture_id: $state.params.lecture_id
        }, { time: time },
        function(data) {
          if (data.msg == "ask") {
            showNotification("lectures.messages.really_confused_use_question")
          }
          if (!data.flag) { //first time confused in these 15 seconds
            $scope.timeline['lecture'][$state.params.lecture_id].add(time, "confused", data.item)
          }
          if (data.flag && data.msg != "ask") { // confused before but not third time - very confused
            var elem_index = $scope.timeline['lecture'][$state.params.lecture_id].getIndexById(data.id, "confused");
            $scope.timeline['lecture'][$state.params.lecture_id].items[elem_index].data.very = true;
          }
        }
      )
    }

    $scope.addNote = function() {
      var time = $scope.lecture_player.controls.getTime()
      $scope.last_fullscreen_state = $scope.fullscreen
      $scope.last_video_state = !$scope.lecture_player.controls.paused() //$scope.play_pause_class;
      TimelineFilter.set('note', true)
      $scope.lecture_player.controls.pause()
      // $scope.last_note = $scope.timeline['lecture'][$state.params.lecture_id].add(time, "note", null);
      if(MobileDetector.isPhone() && $scope.fullscreen){
        $scope.temp_timeline_item = {time:time, type:"note", data:null}
        $timeout(function(){
          $(".note-textarea").focus()
          $(".note-textarea").on("blur",function(){
            if($scope.temp_timeline_item.data){
              saveNote($scope.temp_timeline_item)
            }
            else{
              returnToState()
            }
          })
        })
      }
      else{
        $scope.timeline['lecture'][$state.params.lecture_id].add(time, "note", null);
        $scope.last_timeline_state = !$scope.TimelineNavigator.getStatus()
        goSmallScreen()
        openTimeline()
      }

    }

    var saveNote=function(note){
      Lecture.saveNote({
        course_id: $state.params.course_id,
        lecture_id: $state.params.lecture_id,
        note_id: null
      },{
        data: note.data,
        time: note.time
      },function(response){
        $scope.timeline['lecture'][$state.params.lecture_id].add(note.time, "note", response.note);
        returnToState()
      });
    }
    $scope.checkAnsClicked = false;
    $scope.checkAnswer = function() {
      $scope.checkAnsClicked = true;
      ($scope.selected_quiz.quiz_type == "html" || $scope.selected_quiz.quiz_type == "html_survey") ? sendHtmlAnswers(): sendAnswers()
    }

    var sendHtmlAnswers = function() {
      if (!$scope.answer_form.$error.atleastone && !($scope.selected_quiz.question_type == 'Free Text Question' && $scope.answer_form.$error.required)) {
        $log.debug("valid form")
        $scope.submitted = false;
        Lecture.saveHtml({
            course_id: $state.params.course_id,
            lecture_id: $state.params.lecture_id
          }, {
            quiz: $scope.selected_quiz.id,
            answer: $scope.studentAnswers[$scope.selected_quiz.id],
            in_group: $scope.distance_peer_status == 4,
            distance_peer: $scope.distance_peer_session_id != null
          },
          function(data) {
            changeQuizStatus(data)
            if($scope.selected_quiz.question_type=="Free Text Question"){
              addFreeTextAnswerNote($scope.studentAnswers[$scope.selected_quiz.id])
            }
          });
      } else {
        $log.debug("invalid form")
        $scope.submitted = true;
      }
    }

    var sendAnswers = function() {
      var selected_answers
      if ($scope.selected_quiz.question_type == "OCQ" || $scope.selected_quiz.question_type == "MCQ") {
        selected_answers = []
        $scope.selected_quiz.online_answers.forEach(function(answer) {
          if (answer.selected)
            selected_answers.push(answer.id)
        })
        if (selected_answers.length == 0) {
          showNotification("lectures.choose_correct_answer")
          return
        }
        if ($scope.selected_quiz.question_type == "OCQ" && selected_answers.length == 1)
          selected_answers = selected_answers[0]
      } else if ($scope.selected_quiz.question_type == "Free Text Question") {
        selected_answers = $scope.studentAnswers[$scope.selected_quiz.id]
        if (!selected_answers) {
          showNotification("global.required")
          return
        }
      } else { //DRAG
        selected_answers = {}
        selected_answers = $scope.studentAnswers[$scope.selected_quiz.id]
        var count = 0
        for (var el in selected_answers)
          if (selected_answers[el])
            count++
            if (count < $scope.selected_quiz.online_answers.length) {
              showNotification("lectures.must_place_items")
              return
            }
      }
      Lecture.saveOnline({
          course_id: $state.params.course_id,
          lecture_id: $state.params.lecture_id
        }, {
          quiz: $scope.selected_quiz.id,
          answer: selected_answers,
          in_group: $scope.distance_peer_status == 4,
          distance_peer: $scope.distance_peer_session_id != null
        },
        function(data) {
          changeQuizStatus(data)
          if($scope.selected_quiz.question_type=="Free Text Question"){
            addFreeTextAnswerNote(selected_answers)
          }
        }
      )
    }

    var addFreeTextAnswerNote = function(note_text){
        note_text = "Quiz: "+$scope.selected_quiz.question+"\nAnswer: " + note_text
        Lecture.saveNote(
          {
            course_id: $state.params.course_id,
            lecture_id: $state.params.lecture_id ,
            note_id: null
          },
          {
            data: note_text,
            time: $scope.selected_quiz.time
          },
          function(response){
            $scope.timeline['lecture'][$state.params.lecture_id].add($scope.selected_quiz.time, "note", response.note);
          }
        );
    }

    var changeQuizStatus = function(data) {
      if ($scope.distance_peer_session_id && $scope.distance_peer_status == 3) {
        cancelStatusTimer()
        changeStatusAndWaitTobeSync(4, $scope.selected_quiz.time, $scope.selected_quiz)

      } else if ($scope.distance_peer_session_id && $scope.distance_peer_status == 4) {
        cancelStatusTimer()
        // displayResult(data)
        changeStatusAndWaitTobeSync(5, $scope.selected_quiz.end_time, $scope.selected_quiz)
      } else {
        displayResult(data)
      }
    }

    var displayResult = function(data) {
      if (data.msg != "Empty") { // he chose sthg
        var middle_msg = ''
        if ($scope.selected_quiz.quiz_type == 'survey' || $scope.selected_quiz.quiz_type == 'html_survey' || ($scope.selected_quiz.question_type.toUpperCase() == 'FREE TEXT QUESTION' && data.review)) {
          $scope.selected_quiz.solved_quiz = true;
          if ($scope.selected_quiz.quiz_type != 'survey' && $scope.selected_quiz.quiz_type != 'html_survey' && ($scope.selected_quiz.quiz_type != 'html' && $scope.selected_quiz.question_type.toUpperCase() !== 'FREE TEXT QUESTION'))
            var sub_message = $rootScope.is_mobile ? 'lectures.tap_for_explanation' : 'lectures.hover_for_explanation'
          if ($scope.selected_quiz.question_type.toUpperCase() == 'FREE TEXT QUESTION') {
            // $scope.explanation[] = data.explanation[]
            middle_msg = "lectures.messages.press_to_continue"
            for (var el in data.explanation)
              $scope.explanation[el] = data.explanation[el];
          }
          showNotification('lectures.messages.thank_you_answer', sub_message || "" , middle_msg || "")
        } else {
          for (var el in data.detailed_exp)
            $scope.explanation[el] = data.detailed_exp[el];
          var verdict = data.correct ? "lectures.correct" : "lectures.incorrect"
          var sub_message = ''
          if ($scope.selected_quiz.quiz_type == 'html' && ($scope.selected_quiz.question_type.toUpperCase() == 'DRAG' || $scope.selected_quiz.question_type.toUpperCase() == 'FREE TEXT QUESTION')) {
            for (var el in data.explanation)
              $scope.explanation[el] = data.explanation[el];
          } else {
            if ($scope.selected_quiz.question_type.toUpperCase() == 'MCQ' && !data.correct)
              middle_msg = 'lectures.multiple_correct'
          }
          sub_message = $rootScope.is_mobile ? 'lectures.tap_for_explanation' : 'lectures.hover_for_explanation'
          if ($scope.selected_quiz.question_type.toUpperCase() == 'FREE TEXT QUESTION'){
            middle_msg = "lectures.messages.press_to_continue"
            sub_message = ''
          }
          if (!data.correct && $scope.selected_quiz.question_type.toUpperCase() == "DRAG" && $scope.selected_quiz.quiz_type.toUpperCase() == "HTML") {
            sub_message = ""
          }
          showNotification(verdict, sub_message, middle_msg)
          $scope.selected_quiz.solved_quiz = true;
        }
        $scope.display_review_message = true
        var percent_view = Math.round((($scope.lecture_player.controls.getTime() / $scope.total_duration) * 100))
        $log.debug("current watched: " + percent_view)
        updateViewPercentage(percent_view, "solved_quiz")
      }

      $interval(function() {
        window.onmousemove = function() {
          removeNotification()
          $scope.$apply()
        }
      }, 1500, 1);
    }

    var reviewInclass = function() {
      var max_time = 10
      var close_time = 7.5
      if ($scope.selected_quiz.quiz_type != 'survey' && !$scope.review_inclass && !$scope.review_inclass_inprogress) {
        $log.debug("review inclass")
        $scope.review_inclass_inprogress = true
        var time = max_time
        var next_time = getNextQuizTime($scope.selected_quiz.time, max_time)
        if (next_time)
          time = (next_time - $scope.selected_quiz.time) / 2
        else if ($scope.total_duration - $scope.selected_quiz.time <= max_time)
          time = ($scope.total_duration - $scope.selected_quiz.time) / 2
        $interval(function() {
          $scope.review_inclass_inprogress = false
          $("#review_inclass").fadeIn("fast")
          $interval(function() {
            $scope.closeReviewNotify()
          }, close_time * 1000, 1)
        }, time * 1000, 1)
      }
    }

    var getNextQuizTime = function(time, max_time) {
      for (var i in $scope.lecture.video_quizzes) {
        if ($scope.lecture.video_quizzes[i].time > time && $scope.lecture.video_quizzes[i].time <= time + max_time) {
          return $scope.lecture.video_quizzes[i].time
        }
      }
    }

    $scope.voteForReview = function() {
      $log.debug("vote review")
      OnlineQuiz.voteForReview({ online_quizzes_id: $scope.last_quiz.id }, {},
        function(res) {
          if (res.done) {
            if (!$scope.last_quiz.reviewed) {
              $scope.last_quiz.reviewed = true
              $scope.last_quiz.votes_count += 1
            }
            $scope.closeReviewNotify()
          }
        })
    }

    $scope.unvoteForReview = function() {
      OnlineQuiz.unvoteForReview({ online_quizzes_id: $scope.last_quiz.id }, {},
        function(res) {
          if (res.done) {
            if ($scope.last_quiz.reviewed) {
              $scope.last_quiz.reviewed = false
              $scope.last_quiz.votes_count--
            }
            $scope.closeReviewNotify()
          }
        })
    }

    $scope.closeReviewNotify = function() {
      $("#review_inclass").fadeOut("fast")
    }

    $scope.retryQuiz = function() {
      $scope.explanation = {}
      $scope.selected_quiz = $scope.backup_quiz
      $scope.seek_and_pause($scope.backup_quiz.time)
      $scope.closeReviewNotify()
    }

    $scope.exportNotes = function() {
      Lecture.exportNotes({ course_id: $state.params.course_id, lecture_id: $state.params.lecture_id }, function(n) {
        var notes = angular.fromJson(n);
        var temp;
        var all_module_notes = [];
        for (var i = 0; i < notes.notes.length; i++) {
          if (notes.notes[i].length > 2) {
            temp = angular.fromJson(notes.notes[i])
            all_module_notes.push(temp);
          }
        }
        $scope.Notes = all_module_notes;

        var url = document.URL;
        var baseurl = url.split('lectures')[0];
        var win = window.open('', '_blank');
        if (win) {
          win.focus();

          var doc = '<html><head><title>ScalableLearning - Export Notes</title>' +
            '<style>body{font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;}.table {width: 100%;margin-bottom: 20px; margin: 0 auto;background: white;border: 1px solid lightgrey;}.table td {padding: 8px;line-height: 20px;text-align: left;vertical-align: top;border-top: 1px solid #dddddd; border-right: 1px solid #dddddd;}' +
            '.table th {font-weight: bold;}.table thead th {vertical-align: bottom;} a{color: green; text-decoration: none;} a:hover{color: darkgreen;}</style>' +
            '</head><body>';

          for (var i = 0; i < all_module_notes.length; i++) {
            doc += ('<table class="table" style="width:90%">');
            doc += ("<h3>" + all_module_notes[i][0].lecture.name + "</h3>");
            for (var j = 0; j < all_module_notes[i].length; j++) {
              doc += ("<tr>");
              doc += ('<td>' + $filter('formattime')(all_module_notes[i][j].time, 'hh:mm:ss') + '</td>');
              doc += ('<td>' + all_module_notes[i][j].data + '</td>');
              doc += ('<td><a target="_blank" href="' + baseurl + 'lectures/' + all_module_notes[i][j].lecture.id + '?time=' + all_module_notes[i][j].time + '">' + 'go to video' + '</a></td>');
              doc += ("</tr>");
            }
            doc += ("</table>");
          };

          doc += ('<br /><a href=' + "'" + 'data:Application/octet-stream,' + encodeURIComponent(doc) + "'" + 'Download = "Notes.html">Download Notes</a>');
          doc += ('</body></html>');
          win.document.write(doc);
          win.document.close();
        }
      }, function() {

      })
    }

    $scope.$on('note_updated', function() {
      returnToState()
    })

    $scope.$on('discussion_updated', function() {
      returnToState()
    })

    var returnToState = function() {
      if ($scope.last_fullscreen_state && !$scope.fullscreen) {
        goFullscreen()
      }
      if ($scope.last_video_state && $scope.lecture_player.controls.paused() && !$scope.quiz_mode) {
        $scope.lecture_player.controls.play()
      }
      if ($scope.last_timeline_state && $scope.TimelineNavigator.getStatus()) {
        $timeout(function() {
          $scope.TimelineNavigator.close()
        }, 400)
      }
      cleanState()
    }

    var cleanState =function(){
      $scope.temp_timeline_item = null
      $scope.last_fullscreen_state = null
      $scope.last_video_state = null
      $scope.last_timeline_state = null
    }

    $scope.dismissAnnotation = function() {
      $scope.annotation = null
    }
    $scope.dismissDynamicAnnotation = function() {
      $scope.dynamic_annotation = null
    }
    $scope.dismissSlideNote = function() {
      $scope.slide_note = null
    }
    $scope.dismissQuestionText = function() {
      $scope.selected_quiz.actual_display_text = null
    }

    $scope.endDistancePeerSession = function() {
      $scope.dismissAnnotation()
      $scope.dismissDynamicAnnotation()
      $scope.dismissSlideNote()
      clearQuiz()
      changeStatusAndWaitTobeSync(6, null)
    }

    $scope.lectureLayerClick =  function() {
      if ( !$scope.quiz_mode && ( (!$scope.dynamic_annotation) ||  ($scope.dynamic_annotation && !$scope.dynamic_annotation.as_slide) ) ){
        $scope.toggleVideoPlayback()
      }
    }

    var checkIfDistancePeerIsAlive = function() {
      Lecture.checkIfDistancePeerIsAlive({
          course_id: $scope.lecture.course_id,
          lecture_id: $scope.lecture.id,
          distance_peer_id: $scope.distance_peer_session_id
        }).$promise
        .then(function(response) {
          if (response.status == "dead") {
            cancelcheckIfDistancePeerIsAliveTimer()
            showAnnotation($translate.instant("distance_peer.other_student_ended_session", { name: $scope.name }))
              // clean Up the varaiable
            clearDistancePeerVariables()
            cancelcheckIfDistancePeerStatusIsSyncTimer()
            cancelStatusTimer()
            clearQuiz()
          }
        })
    }

    var startcheckIfDistancePeerIsAliveTimer = function() {
      $scope.check_if_distance_peer_is_alive_timer = $interval(function() {
        checkIfDistancePeerIsAlive();
      }, 20000)
    }

    var cancelcheckIfDistancePeerIsAliveTimer = function() {
      if ($scope.check_if_distance_peer_is_alive_timer)
        $interval.cancel($scope.check_if_distance_peer_is_alive_timer)
    }

    var showAnnotation = function(annotation) {
      $scope.dismissDynamicAnnotation()
      $scope.dismissSlideNote()
      $scope.annotation = annotation
    }

    var showDynamicAnnotation = function(annotation) {
      $scope.dismissAnnotation()
      $scope.dismissSlideNote()
      $scope.dynamic_annotation = annotation
    }
    var showSlideNote = function(annotation) {
      $scope.dismissAnnotation()
      $scope.dismissDynamicAnnotation()
      $scope.slide_note = annotation
    }

    //  Distance peer methods
    var checkIfCanLeaveStatus = function() {
      if (parseInt($scope.lecture_player.controls.getTime().toFixed(2)) >= parseInt($scope.next_stop_time.toFixed(2))) {
        $scope.seek($scope.next_stop_time)
        $scope.lecture_player.controls.pause()
        // showAnnotation($translate.instant("distance_peer.can_not_leave_this_status", { name: $scope.name }))
        // changeDistancePeerStatusMessage()
        if( $scope.distance_peer_status == 5 ){
          changeDistancePeerStatusAnnotationWaiting( 1 )
        }
        else{
          changeDistancePeerStatusAnnotationWaiting( $scope.distance_peer_status + 1)
        }
      }
    }

    var statusTimerCountdown = function() {
      ($scope.status_counter == 0) ? cancelStatusTimer(): $scope.status_counter--;
    }

    var startStatusTimer = function() {
      $scope.status_timer = $interval(statusTimerCountdown, 1000);
    }

    var cancelStatusTimer = function() {
      if ($scope.status_timer) {
        $interval.cancel($scope.status_timer);
        $scope.status_timer = null
      }
    }

    var setStatusTimer = function(count) {
      $scope.status_counter = count
    }

    var checkPeerSession = function() {
      $scope.check_peer_fuction_is_called = true
      var deferred = $q.defer()
      if ($scope.lecture) {
        Lecture.checkIfInDistancePeerSession({
            course_id: $scope.lecture.course_id,
            lecture_id: $scope.lecture.id
          }).$promise
          .then(function(response) {
            if (response.distance_peer != "no_peer_session") {
              $scope.distance_peer_session_id = response.distance_peer.distance_peer_id
              startcheckIfDistancePeerIsAliveTimer()

              $scope.name = response.name
                // to prevent student seek after quiz, will use variable next_stop_time
              $scope.distance_peer_status = response.distance_peer.status
              changeDistancePeerStatusMessage()
              var index = $scope.lecture.video_quizzes.map(function(x) {
                return x.id; }).indexOf(response.distance_peer.online_quiz_id);
              if ($scope.distance_peer_status == 1) { // = 1  stop = start_time_of_next_quiz
                if ($scope.lecture.video_quizzes[index + 1]) {
                  $scope.next_stop_time = $scope.lecture.video_quizzes[index + 1].start_time
                } else {
                  $scope.next_stop_time = $scope.total_duration
                }
              }
              if (index == -1) { index = 0 };
              if ($scope.lecture.video_quizzes[index]) {
                if ($scope.distance_peer_status == 5) { // = 5  stop = quiz.end_time
                  $scope.next_stop_time = $scope.lecture.video_quizzes[index].end_time
                } else if ([2, 3, 4].indexOf($scope.distance_peer_status) != -1) { // = 2,3,4  stop = quiz.time
                  $scope.next_stop_time = $scope.lecture.video_quizzes[index].time

                  if ([3, 4].indexOf($scope.distance_peer_status) != -1) {
                    showQuizOnline($scope.lecture.video_quizzes[index])
                    if ($scope.distance_peer_status == 3) {
                      var timer = $scope.lecture.video_quizzes[index].self
                    } else {
                      var timer = $scope.lecture.video_quizzes[index].in_group
                    }
                    setStatusTimer(timer)
                    startStatusTimer()
                  }
                }
                if (!($scope.lecture.video_quizzes[index].id in $scope.quiz_cue_distance_peer_list)) {
                  var quiz_cue = $scope.lecture_player.controls.cue($scope.next_stop_time, function() {
                    showQuizDistancePeer($scope.lecture.video_quizzes[index])
                  })
                  $scope.quiz_cue_distance_peer_list[$scope.lecture.video_quizzes[index].id] = quiz_cue.id
                }
              } else {
                $scope.next_stop_time = $scope.total_duration
              }
            }
            deferred.resolve()
          });
      } else {
        deferred.resolve()
      }
      return deferred.promise
    }

    $scope.openStudentList = function(lecture_id, course_id) {
      $modal.open({
        templateUrl: '/views/student/inclass/distance_peer_modal.html',
        scope: $scope,
        controller: ['$modalInstance', function($modalInstance) {
          $scope.waiting_response_of_back_end = true
          $scope.check_if_invited = false
          $scope.wait_for_acceptance = false
          $scope.invite_student = false
          $scope.invited_student = {};
          $scope.loading_students = true

          $scope.inviteStudent = function(student) {
            $scope.waiting_response_of_back_end = true
            $scope.invite_student = false
            Lecture.invitedStudent({
                course_id: course_id,
                lecture_id: lecture_id,
                email: student.email
              }).$promise
              .then(function(response) {
                $scope.waiting_response_of_back_end = false
                $scope.check_if_invited = false
                $scope.wait_for_acceptance = true
                $scope.invite_student = false
                $scope.invited_student = student.email
                $scope.distance_peer_id = response.distance_peer_id
                startCheckInvitedStudentAcceptedTimer()
              });
          }
          $scope.changeToInviteStatus = function() {
            $scope.waiting_response_of_back_end = false
            $scope.check_if_invited = false
            $scope.wait_for_acceptance = false
            $scope.invite_student = true
            $scope.invited_student = {}
          }
          $scope.checkIfInvitedByOrInvited = function() {
            Lecture.checkIfInvited({
                course_id: course_id,
                lecture_id: lecture_id
              }).$promise
              .then(function(response) {
                if (response.invite_status == "no_invitation") {
                  $scope.waiting_response_of_back_end = false
                  $scope.check_if_invited = false
                  $scope.wait_for_acceptance = false
                  $scope.invite_student = true
                  $scope.students = response.students

                } else if (response.invite_status == "invited") {
                  $scope.waiting_response_of_back_end = false
                  $scope.check_if_invited = false
                  $scope.wait_for_acceptance = true
                  $scope.invite_student = false
                  $scope.invited_student = response.invite
                  $scope.distance_peer_id = response.distance_peer_id
                  startCheckInvitedStudentAcceptedTimer()
                } else if (response.invite_status == "invited_by") {
                  $scope.waiting_response_of_back_end = false
                  $scope.check_if_invited = true
                  $scope.cancelled_invited_by_student = null
                  $scope.wait_for_acceptance = false
                  $scope.invite_student = false
                  $scope.invited_by_student = response.invite
                }
              });
          }
          $scope.acceptInvation = function(student) {
            Lecture.acceptInvation({
                course_id: course_id,
                lecture_id: lecture_id,
                email: student[0],
                distance_peer_id: student[1]

              }).$promise
              .then(function(response) {
                if (response.status != "cancelled") {
                  $scope.distance_peer_session_id = student[1]
                  $scope.closeModal()
                } else {
                  var index = $scope.invited_by_student.findIndex(function(x) {
                    return x[1] == student[1] })
                  $scope.invited_by_student.splice(index, 1);
                  $scope.cancelled_invited_by_student = $translate.instant("distance_peer.student_cancelled", { name: student[0] });
                }
              })
          }
          $scope.caneclAllDistancePeerSession = function() {
            $scope.invited_by_student.forEach(function(student) {
              $scope.caneclDistancePeerSession(student[1])
            })
          }
          $scope.caneclDistancePeerSession = function(distance_peer_id) {
            Lecture.caneclDistancePeerSession({
              course_id: course_id,
              lecture_id: lecture_id,
              distance_peer_id: distance_peer_id
            })
            cancelCheckInvitedStudentAcceptedTimer()
          }
          var checkInvitedStudentAccepted = function(invited_student_email, distance_peer_id) {
            Lecture.checkInvitedStudentAccepted({
                course_id: course_id,
                lecture_id: lecture_id,
                email: invited_student_email,
                distance_peer_id: distance_peer_id

              }).$promise
              .then(function(response) {
                if (response.status != 0) {
                  cancelCheckInvitedStudentAcceptedTimer()
                  if (response.status == "denied") {
                    $scope.invited_student += " denied your invation"
                  } else if (response.status == 1 || response.status == 2) {
                    $scope.distance_peer_session_id = $scope.distance_peer_id
                    $scope.closeModal()
                  };
                }
              })
          }
          var startCheckInvitedStudentAcceptedTimer = function() {
            $scope.check_invited_student_accepted_timer = $interval(function() {
              checkInvitedStudentAccepted($scope.invited_student, $scope.distance_peer_id);
            }, 5000)
          }
          var cancelCheckInvitedStudentAcceptedTimer = function() {
            if ($scope.check_invited_student_accepted_timer)
              $interval.cancel($scope.check_invited_student_accepted_timer)
            $scope.session_votes = null
          }
          $scope.closeModal = function() {
            $modalInstance.dismiss('cancel');
            cancelCheckInvitedStudentAcceptedTimer()
          }
          $scope.checkIfInvitedByOrInvited()
        }]
      })
    }


    init();
  }]);
