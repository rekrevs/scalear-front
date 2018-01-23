"use strict";

angular.module("scalearAngularApp")
  .controller("inclassModuleCtrl", ["$scope", "$modal", "$timeout", "$window", "$log", "Module", "$stateParams", "ScalearUtils", "$translate", "Timeline", "Page", "$interval", "OnlineQuiz", "Forum", "Quiz", "OnlineMarker", "Lecture", "ModuleModel", "CourseModel", function($scope, $modal, $timeout, $window, $log, Module, $stateParams, ScalearUtils, $translate, Timeline, Page, $interval, OnlineQuiz, Forum, Quiz, OnlineMarker, Lecture, ModuleModel, CourseModel) {
    $window.scrollTo(0, 0);
    $scope.course = CourseModel.getSelectedCourse();

    Page.setTitle($translate.instant("navigation.in_class") + ": " + $scope.course.name);
    $scope.inclass_player = {};
    $scope.inclass_player.events = {};

    $scope.time_parameters = {
      quiz: 3,
      question: 2
    };

    var REPLACE_STYLING = "[REPLACE-STYLING]";

    $scope.display = function() {
      resetVariables();
      openModal();
      changeButtonsSize();
      $scope.hide_video_text = $scope.button_names[3];
      $scope.zooom_graph_text = $scope.button_names[8];
      $scope.zooom_graph = false;
      $scope.setOriginalClass();
      $scope.setInclassShortcuts();
      screenfull.request();
      $scope.fullscreen = true;
      $scope.blurButtons();
      $scope.timer = Math.ceil(
        $scope.review_question_count * $scope.time_parameters.question +
        $scope.review_video_quiz_count * $scope.time_parameters.quiz +
        $scope.review_survey_count * $scope.time_parameters.question +
        $scope.inclass_quizzes_time +
        $scope.review_quiz_count * $scope.time_parameters.quiz
      );
      $scope.counter = $scope.timer > 0 ? 1 : 0;
      $scope.up_timer = 0;
      $scope.up_counter = 0;

      $scope.timerCountUp();

      angular.element($window).bind("resize",
        function() {
          changeButtonsSize();
          $timeout(function() {
            adjustTextSize();
            adjustChartSize();
            var ratio = (16.0 / 9.0);
            var video_width = angular.element("#inclass_video").height() * ratio;
            $scope.quiz_layer.width = video_width;
            $scope.quiz_layer.marginLeft = (angular.element("#inclass_video").width() - video_width) / 2.0;
          });
        }
      );

      document.addEventListener(screenfull.raw.fullscreenchange, function() {
        if (!screenfull.isFullscreen) {
          $scope.fullscreen = false;
          $scope.exitBtn();
          $scope.$apply();
        }
      });

      for (var lec_id in $scope.lectures) {
        var inclass_questions = $scope.timeline["lecture"][lec_id]["filtered"].filterByType("inclass");
        if (inclass_questions.length > 0) {
          updateInclassSession(inclass_questions[0].data.id, 1);
          break;
        }
      }

    };

    function calculateFontSize(size) {
      var percent = 0;
      switch (size) {
        case "small":
          percent = 1.0;
          break;
        case "medium":
          percent = 1.5;
          break;
        case "large":
          percent = 2.0;
          break;
      }

      return Math.round(percent * window.screen.availWidth) / 100;
    }

    var resetVariables = function() {
      $scope.play_pause_class = "fi-play";
      $scope.mute_class = "fi-volume";
      $scope.loading_video = true;
      $scope.lecture_url = "";
      $scope.current_quiz = 0;
      $scope.item_itr = 0;
      $scope.timeline_itr = 0;
      $scope.show_black_screen = false;
      $scope.hide_questions = false;
      $scope.zooom_graph = false;
      $scope.dark_buttons = "dark_button";
      $scope.fullscreen = false;
      $scope.selected_item = { start_time: 0 };
      $scope.selected_timeline_item = null;
      $scope.quality_set = "color-blue";
      $scope.inclass_answer = false;
      $scope.quiz_layer = {};
      $scope.player_button_hover = false;
      $scope.question_class_normal = "normal_question_block";
      $scope.video_class_normal = "original_video";
      $scope.question_block_small = 30;
      $scope.question_block_large = 30;
    };

    var init = function() {
      $scope.timeline = { lecture: {}, survey: {}, quiz: {} };
      $scope.markers_count = 0;
      $scope.module = angular.copy(ModuleModel.getSelectedModule());
      $scope.module.items = [];
      $scope.player_button_hover = false;
      getLectureCharts();
      getQuizCharts();
    };

    var getLectureCharts = function() {
      Module.getModuleInclass({
          course_id: $stateParams.course_id,
          module_id: $stateParams.module_id
        },
        function(data) {
          $scope.inclass_quizzes_time = 0;
          angular.extend($scope, data);
          $scope.confused_count = 0;
          for (var lec_id in $scope.lectures) {
            $scope.timeline["lecture"][lec_id] = { all: new Timeline(), filtered: new Timeline() };
            for (var type in $scope.lectures[lec_id]) {
              for (var it in $scope.lectures[lec_id][type]) {
                if (type == "markers" && $scope.lectures[lec_id][type][it][1].title) {
                  $scope.timeline["lecture"][lec_id]["all"].add($scope.lectures[lec_id][type][it][0], "primary_marker", $scope.lectures[lec_id][type][it][1] || {});
                  $scope.markers_count += 1;
                } else {
                  $scope.timeline["lecture"][lec_id]["all"].add($scope.lectures[lec_id][type][it][0], type, $scope.lectures[lec_id][type][it][1] || {});
                }
                if (type == "inclass" && $scope.lectures[lec_id][type][it][1].show) {
                  $scope.inclass_quizzes_time += ($scope.lectures[lec_id][type][it][1].timers.intro +
                    $scope.lectures[lec_id][type][it][1].timers.self +
                    $scope.lectures[lec_id][type][it][1].timers.in_group +
                    $scope.lectures[lec_id][type][it][1].timers.discussion) / 60;
                }
                if (type == "confused") {
                  $scope.confused_count += $scope.lectures[lec_id][type].length;
                }
              }
            }
            $scope.timeline["lecture"][lec_id]["filtered"].items = $scope.timeline["lecture"][lec_id]["all"].filterByNotType("markers");
          }
          adjustModuleItems($scope.lectures, ModuleModel.getSelectedModule().items, $scope.module.items);
          checkDisplayInclass();
        });
    };

    var getQuizCharts = function() {
      Module.getQuizChartsInclass({
          course_id: $stateParams.course_id,
          module_id: $stateParams.module_id
        },
        function(data) {
          $scope.quizzes = angular.extend({}, data.quizzes, $scope.quizzes);
          $scope.review_quiz_count = data.review_quiz_count;
          $scope.review_survey_count = data.review_survey_count;
          for (var quiz_id in $scope.quizzes) {
            var quiz_type = $scope.quizzes[quiz_id].type;
            $scope.timeline[quiz_type][quiz_id] = { "filtered": new Timeline() };
            for (var q_idx in $scope.quizzes[quiz_id].questions) {
              var q_id = $scope.quizzes[quiz_id].questions[q_idx].id;
              $scope.quizzes[quiz_id].answers[q_id].id = q_id;
              var type = $scope.quizzes[quiz_id].questions[q_idx].type == "Free Text Question" ? $scope.quizzes[quiz_id].questions[q_idx].type : "charts";
              $scope.timeline[quiz_type][quiz_id]["filtered"].add(0, type, $scope.quizzes[quiz_id].answers[q_id]);
            }
          }
          adjustModuleItems($scope.quizzes, ModuleModel.getSelectedModule().items, $scope.module.items);
          checkDisplayInclass();
        });
    };

    var checkDisplayInclass = function() {
      $scope.inclass_ready = (
        $scope.review_question_count || $scope.review_video_quiz_count ||
        $scope.review_survey_count ||
        $scope.inclass_quizzes_count ||
        $scope.review_quiz_count ||
        $scope.confused_count ||
        $scope.markers_count
      );
    };

    var adjustModuleItems = function(obj, from, to) {
      var ids = ScalearUtils.getKeys(obj);
      for (var i in from) {
        if (ids.indexOf(from[i].id.toString()) != -1) {
          to.push(from[i]);
        }
      }

      to.sort(function(a, b) {
        return a.position - b.position;
      });
    };

    $scope.updateHideQuiz = function(quiz) {
      Module.hideQuiz({
          course_id: $stateParams.course_id,
          module_id: $stateParams.module_id
        }, {
          quiz: quiz.data.id,
          hide: quiz.data.show
        },
        function() {
          var num = (quiz.data.show ? 1 : -1);
          if (quiz.type == "inclass") {
            $scope.inclass_quizzes_time += num * (
              quiz.data.timers.intro +
              quiz.data.timers.self +
              quiz.data.timers.in_group +
              quiz.data.timers.discussion) / 60;
            $scope.inclass_quizzes_count += num;
          } else {
            $scope.review_video_quiz_count += num;
          }

          checkDisplayInclass();
        });
    };

    $scope.updateHideMarker = function(marker) {
      OnlineMarker.updateHide({
        online_markers_id: marker.data.id,
      }, {
        hide: marker.data.show
      });
    };

    $scope.updateHideResponseOnlineQuiz = function(answer) {
      OnlineQuiz.hideResponses({
        course_id: answer.course_id,
        online_quizzes_id: answer.online_quiz_id
      }, {
        hide: {
          id: answer.id,
          hide: answer.hide
        }
      });
    };

    $scope.updateHideDiscussion = function(id, val) {
      Forum.hideDiscussion({}, {
          post_id: id,
          hide: val
        },
        function() {
          if (val) {
            $scope.review_question_count--;
          } else {
            $scope.review_question_count++;
          }
        });
    };

    $scope.updateHideComment = function(comment, discussion) {
      Forum.hideComment({}, {
          post_id: discussion.id,
          comment_id: comment.id,
          hide: comment.hide
        },
        function() {
          if (comment.hide && !discussion.hide) {
            discussion.hide = true;
            $scope.updateHideDiscussion(discussion.id, !discussion.hide);
          }
        });
    };

    $scope.updateHideQuizQuestion = function(quiz, item) {
      Quiz.showInclass({
          course_id: $stateParams.course_id,
          quiz_id: quiz.id
        }, {
          question: item.data.id,
          show: !item.data.show
        },
        function() {
          var num = (item.data.show ? 1 : -1);
          $scope["review_" + quiz.quiz_type + "_count"] += num * ((item.type == "charts") ? 1 : item.data.answers.length + 1);
        });
    };

    $scope.updateHideConfused = function(lec_id, time, value, very) {
      Lecture.confusedShowInclass({
        course_id: $stateParams.course_id,
        lecture_id: lec_id
      }, {
        time: time,
        hide: value,
        very: very
      }, function() {
        if (value) {
          $scope.confused_count -= 1;
        } else {
          $scope.confused_count += 1;
        }
        checkDisplayInclass();
      });
    };

    var openModal = function() {
      angular.element("body").css("overflow", "hidden");
      angular.element("#main").css("overflow", "hidden");
      angular.element("html").css("overflow", "hidden");
      var win = angular.element($window);
      win.scrollTop("0px");

      $scope.modalInstance = $modal.open({
        templateUrl: "/views/teacher/in_class/inclass_display.html",
        windowClass: "whiteboard display",
        controller: "inclassDisplayCtrl",
        scope: $scope
      });

      $scope.modalInstance.result.then(
        function() {},
        function() {
          cleanUp();
        });

      $scope.unregister_back_event = $scope.$on("$locationChangeStart", function(event) {
        event.preventDefault();
        cleanUp();
        $scope.$apply();
      });

      $scope.unregister_state_event = $scope.$on("$stateChangeStart", function() {
        cleanUp();
        $scope.$apply();
      });
    };

    $scope.exitBtn = function() {
      exitInclassSession();
      screenfull.exit();
      $scope.modalInstance.dismiss("cancel");
      cleanUp();
      $scope.timer_interval_up = null;
    };

    var cleanUp = function() {
      angular.element("body").css("overflow", "");
      angular.element("#main").css("overflow", "");
      angular.element("html").css("overflow", "");
      $scope.unregister_back_event();
      $scope.unregister_state_event();
      $scope.removeShortcuts();
      resetVariables();
      $interval.cancel($scope.timer_interval_up);
      cancelSessionVotesTimer();
      cancelStageTimer();
    };

    $scope.playBtn = function() {
      if ($scope.play_pause_class == "fi-play") {
        $scope.inclass_player.controls.play();
        $scope.play_pause_class = "fi-pause";
      } else {
        $scope.inclass_player.controls.pause();
      }
      $scope.blurButtons();
    };

    $scope.muteBtn = function() {
      if ($scope.mute_class == "fi-volume-strike") {
        $scope.mute_class = "fi-volume";
        $scope.inclass_player.controls.unmute();
        $scope.inclass_player.controls.volume(1);
      } else {
        $scope.mute_class = "fi-volume-strike";
        $scope.inclass_player.controls.mute();
      }
      $scope.blurButtons();
    };

    $scope.qualityBtn = function() {
      if (!$scope.quality_set) {
        $scope.inclass_player.controls.changeQuality("hd720");
        $scope.quality_set = "color-blue";
      } else {
        $scope.inclass_player.controls.changeQuality("large");
        $scope.quality_set = null;

      }
      $scope.blurButtons();
    };

    $scope.seek = function(time) {
      if ($scope.selected_item.url) {
        if ($scope.lecture_url.indexOf($scope.selected_item.url) == -1) {
          if ($scope.inclass_player.controls.isYoutube($scope.selected_item.url)) {
            $scope.inclass_player.controls.setStartTime(time);
          }
          $scope.lecture_url = $scope.selected_item.url;
          if ($scope.inclass_player.controls.isMP4($scope.selected_item.url)) {
            $timeout(function() {
              $scope.inclass_player.controls.seek(time);
            });
          }

        } else {
          $scope.inclass_player.controls.seek(time);
        }
      }
    };

    $scope.skip = function(skip_time) {
      if (skip_time) {
        var seek_to_time = $scope.inclass_player.controls.getTime() + skip_time;
        var duration = $scope.inclass_player.controls.getDuration();
        if (seek_to_time < 0) {
          seek_to_time = 0;
        } else if (seek_to_time > duration) {
          seek_to_time = duration;
        }
        $scope.seek(seek_to_time);
      }
      $scope.blurButtons();
    };

    $scope.inclass_player.events.onPlay = function() {
      $scope.play_pause_class = "fi-pause";
    };

    $scope.inclass_player.events.onPause = function() {
      $scope.play_pause_class = "fi-play";
    };

    $scope.inclass_player.events.onReady = function() {
      $scope.loading_video = false;
      if ($scope.should_mute) {
        $scope.muteBtn();
      }
      if (!$scope.timer_interval_up) {
        $scope.timer_interval_up = $interval($scope.timerCountUp, 1000);
      }
    };

    $scope.inclass_player.events.onMeta = function() {
      $scope.play_pause_class = "fi-play";
      $scope.loading_video = false;
    };

    $scope.inclass_player.events.seeked = function() {
      $scope.inclass_player.controls.pause();
    };

    var setupInclassQuiz = function(sub_items) {
      var timers;
      for (var item_index = 0; item_index < sub_items.length; item_index++) {
        var current_item = sub_items[item_index];
        current_item.data.background = "lightgrey";
        current_item.data.color = "black";
        if (current_item.type == "inclass") {
          timers = current_item.data.timers;
          current_item.data.inclass_title = $translate.instant("inclass.self_stage");
          current_item.data.status = 2;
          current_item.data.background = "#008CBA";
          current_item.data.color = "white";
          current_item.data.timer = timers.self;

          var start_item = { time: current_item.data.start_time, type: "marker", data: { time: current_item.data.start_time, status: 1 } };
          sub_items.splice(0, 0, start_item);
          item_index++;

          var group_quiz = angular.copy(current_item);
          group_quiz.data.inclass_title = $translate.instant("inclass.group_stage");
          group_quiz.data.status = 3;
          group_quiz.data.background = "#43AC6A";
          group_quiz.data.timer = timers.in_group;
          sub_items.splice(++item_index, 0, group_quiz);

          var discussion = angular.copy(current_item);
          discussion.data.inclass_title = $translate.instant("inclass.discussion_stage");
          discussion.data.status = 4;
          discussion.data.background = "darkorange";
          discussion.data.color = "white";
          discussion.data.timer = timers.discussion;
          sub_items.splice(++item_index, 0, discussion);
          var chart_marker = { time: current_item.time, type: "marker", data: { time: current_item.data.time, status: "answer" } };
          sub_items.splice(++item_index, 0, chart_marker);

          if (current_item.time < current_item.data.end_time) {
            var end_item = { time: current_item.data.end_time, type: "marker", data: { time: current_item.data.end_time, status: 5 } };
            sub_items.splice(sub_items.length, 0, end_item);
          }
          continue;
        }
      }
      sub_items[0].data.inclass_title = $translate.instant("inclass.intro_stage");
      sub_items[0].data.background = "lightgrey";
      sub_items[0].data.color = "black";
      sub_items[0].data.timer = timers.intro;

      return sub_items;
    };

    var getSubItems = function(timeline, item) {
      var start_time, end_time;
      if (item.type == "charts" || item.type == "inclass") {
        start_time = item.data.start_time;
        end_time = item.data.end_time;
      } else {
        start_time = (item.time - 15 < $scope.selected_item.start_time) ? $scope.selected_item.start_time : item.time - 15;
        end_time = (item.time + 15 > $scope.selected_item.end_time) ? $scope.selected_item.end_time : item.time + 15;
      }

      if (item.type == "primary_marker") {
        var sub_items = [item];
        var current_item_index = timeline.items.indexOf(item);
        for (var i = current_item_index + 1; i < timeline.items.length; i++) {
          if (timeline.items[i].type == "markers") {
            sub_items.push(timeline.items[i]);
          } else {
            break;
          }
        }
        return sub_items;
      } else if (item.type == "inclass") {
        return timeline.getItemsBetweenTime(start_time, end_time);
      } else {
        return timeline.getItemsBetweenTimeByType(start_time, end_time, "markers").concat(item);
      }
    };

    var setupSubItems = function(sub_items) {
      for (var item_index = 0; item_index < sub_items.length; item_index++) {
        var current_item = sub_items[item_index];
        current_item.data.background = "lightgrey";
        current_item.data.color = "black";
        if (current_item.type != "markers") {
          if (current_item.type == "discussion") {
            sub_items[item_index].data.inclass_title = $translate.instant("inclass.discussion");
          } else if (current_item.type.indexOf("confused") != -1) {
            sub_items[item_index].data.inclass_title = $translate.instant("inclass.confused");
          } else if (current_item.type != "primary_marker") {
            sub_items[item_index].data.inclass_title = current_item.data.type;
          }
        }
      }

      return sub_items;
    };

    var goToSubItem = function(item) {
      $scope.selected_timeline_sub_item = item;
      cancelSessionVotesTimer();
      if (item.type == "primary_marker" && $scope.selected_timeline_item.type != "inclass") {
        $scope.hideQuestionBox();
      } else if (item.type != "markers") {
        $scope.showQuestionBox();
      }

      $scope.seek(item.time);

      if ($scope.selected_timeline_item.type == "inclass") {
        if (item.data.status == 2 || item.data.status == 3) {
          adjustQuizLayer($scope.selected_timeline_item.data.quiz_type);
          getSessionVotes($scope.selected_timeline_item.data.id, $scope.selected_item.id, item.data.status == 3);
          startSessionVotesTimer();
        } else {
          if (item.data.status > 4 || item.data.status == "answer") {
            $scope.loading_chart = true;
            OnlineQuiz.getChartData({ online_quizzes_id: $scope.selected_timeline_item.data.id }, function(resp) {
              $scope.selected_timeline_item.data.answers = resp.chart;
              $scope.chart = $scope.createChart($scope.selected_timeline_item.data.answers, { colors: ["rgb(0, 140, 186)", "rgb(67, 172, 106)"] }, "formatInclassQuizChartData");
            });
          }
          adjustQuizLayer();
        }

        if (item.data.timer) {
          cancelStageTimer();
          setStageTimer(item.data.timer);
          var unwatch = $scope.$watch("loading_video", function(val) {
            if (!val) {
              startStageTimer();
              unwatch();
            }
          });
        }
        if (item.data.status && typeof item.data.status === "number") {
          updateInclassSession($scope.selected_timeline_item.data.id, item.data.status);
          $scope.inclass_answer = false;
        } else if (item.data.status == "answer") {
          $scope.inclass_answer = true;
        }

      }
    };

    $scope.nextSubItem = function() {
      if ($scope.isBlackScreenOn()) {
        $scope.hideBlackScreen();
      }
      if ($scope.selected_item.class_name == "lecture") {
        var next_index = $scope.selected_timeline_item.sub_items.indexOf($scope.selected_timeline_sub_item) + 1;
        if (next_index < $scope.selected_timeline_item.sub_items.length) {
          goToSubItem($scope.selected_timeline_item.sub_items[next_index]);
          return;
        }
      }
      $scope.nextItem();
    };

    $scope.prevSubItem = function() {
      if ($scope.isBlackScreenOn()) {
        $scope.hideBlackScreen();
      }
      if ($scope.selected_item.class_name == "lecture") {
        var prev_index = $scope.selected_timeline_item.sub_items.indexOf($scope.selected_timeline_sub_item) - 1;
        if (prev_index >= 0) {
          goToSubItem($scope.selected_timeline_item.sub_items[prev_index]);
          return;
        }
      }
      $scope.prevItem();
    };

    $scope.skipToItem = function(module_item, timeline_item, type) {
      $scope.item_itr = $scope.module.items.indexOf(module_item);
      $scope.selected_item = module_item;

      if (!timeline_item) {
        $scope.timeline_itr = 0;
        $scope.nextItem();
      } else {
        $scope.timeline_itr = $scope.timeline[type][module_item.id]["filtered"].items.indexOf(timeline_item);
        goToItem(angular.noop);
      }
    };

    var goToItem = function(callback) {
      var type = $scope.selected_item.class_name == "quiz" ? $scope.selected_item.quiz_type : $scope.selected_item.class_name;
      var current_timeline_item = $scope.timeline[type][$scope.selected_item.id]["filtered"].items[$scope.timeline_itr];
      var visible_discussions = Array(1);
      if (Array.isArray(current_timeline_item.data)) {
        visible_discussions = current_timeline_item.data.filter(function(elem) {
          return elem.hide
        })
      }
      if (current_timeline_item.data && (current_timeline_item.data.show === false || !visible_discussions.length)) {
        callback();
        return;
      }
      if (current_timeline_item != $scope.selected_timeline_item) {
        if ($scope.selected_timeline_item && $scope.selected_timeline_item.type == "inclass") {
          updateInclassSession($scope.selected_timeline_item.data.id, 1);
        }
        $scope.selected_timeline_item = angular.copy(current_timeline_item);

        if (type == "lecture") {
          $scope.selected_timeline_item.sub_items = getSubItems($scope.timeline[type][$scope.selected_item.id]["all"], current_timeline_item);

          var current_timeline_index;
          if ($scope.selected_timeline_item.type == "inclass") {
            current_timeline_index = 0;
            $scope.selected_timeline_item.sub_items = setupInclassQuiz($scope.selected_timeline_item.sub_items);
          } else {
            current_timeline_index = $scope.selected_timeline_item.sub_items.indexOf(current_timeline_item);
            $scope.selected_timeline_item.sub_items = setupSubItems($scope.selected_timeline_item.sub_items);
          }
          goToSubItem($scope.selected_timeline_item.sub_items[current_timeline_index]);
        }
        if ($scope.selected_timeline_item.type == "charts") {
          var options = (type != "lecture") ? { "backgroundColor": "white" } : {};
          $scope.loading_chart = true;
          var formatter = "formatLectureChartData";
          if (type == "survey") {
            formatter = "formatSurveyChartData";
          }
          $scope.chart = $scope.createChart($scope.selected_timeline_item.data.answers, options, formatter);
        }
      }
    };

    $scope.nextItem = function() {
      if ($scope.item_itr < 0) {
        $scope.item_itr = 0;
        $scope.timeline_itr += 1;
      }

      if ($scope.item_itr >= 0 && $scope.item_itr < $scope.module.items.length) {
        $scope.selected_item = $scope.module.items[$scope.item_itr];
        var type = $scope.selected_item.class_name == "quiz" ? $scope.selected_item.quiz_type : $scope.selected_item.class_name;
        if ($scope.timeline[type] && $scope.timeline[type][$scope.selected_item.id]) {
          $scope.timeline_itr += 1;
          if ($scope.timeline_itr > 0 && $scope.timeline_itr < $scope.timeline[type][$scope.selected_item.id]["filtered"].items.length) {

            goToItem($scope.nextItem);
          } else {
            $scope.item_itr += 1;
            $scope.timeline_itr = $scope.item_itr < $scope.module.items.length ? 0 : $scope.timeline_itr;
            $scope.nextItem();
          }
        }
      } else {
        $scope.item_itr = $scope.module.items.length;
        $scope.showBlackScreen("inclass.blackscreen_done");
        if ($scope.selected_timeline_item && $scope.selected_timeline_item.type == "inclass") {
          updateInclassSession($scope.selected_timeline_item.data.id, 1);
        }
      }

      $timeout(function() {
        adjustTextSize();
        adjustChartSize();
      });
      $scope.blurButtons();
    };

    $scope.prevItem = function() {
      if ($scope.item_itr >= $scope.module.items.length) {
        $scope.item_itr = $scope.module.items.length - 1;
      }

      if ($scope.item_itr >= 0) {
        $scope.selected_item = $scope.module.items[$scope.item_itr];
        var type = $scope.selected_item.class_name == "quiz" ? $scope.selected_item.quiz_type : $scope.selected_item.class_name;
        if ($scope.timeline[type] && $scope.timeline[type][$scope.selected_item.id]) {
          $scope.timeline_itr -= 1;
          if ($scope.timeline_itr > 0) {
            goToItem($scope.prevItem);
          } else {
            $scope.item_itr -= 1;
            if ($scope.module.items[$scope.item_itr]) {
              $scope.selected_item = $scope.module.items[$scope.item_itr];
            }
            var type = $scope.selected_item.class_name == "quiz" ? $scope.selected_item.quiz_type : $scope.selected_item.class_name;
            $scope.timeline_itr = $scope.item_itr < 0 ? 0 : $scope.timeline[type][$scope.selected_item.id]["filtered"].items.length;
            $scope.prevItem();
          }
        }
      }
      $timeout(function() {
        adjustTextSize();
        adjustChartSize();
      });
      $scope.blurButtons();
    };

    var adjustQuizLayer = function(quiz_type) {
      if (quiz_type == "html") {
        $scope.quiz_layer.backgroundColor = "white";
        $scope.quiz_layer.overflowX = "hidden";
        $scope.quiz_layer.overflowY = "auto";
      } else {
        $scope.quiz_layer.backgroundColor = "";
        $scope.quiz_layer.overflowX = "";
        $scope.quiz_layer.overflowY = "";
      }
    };

    $scope.createChart = function(data, options, formatter) {
      var chart = {
        type: "BarChart",
        options: {
          "width": angular.element(".reveal-modal").width() - 50,
          "colors": ["green", "gray"],
          "isStacked": "false",
          "fill": 25,
          "backgroundColor": "white",
          "displayExactValues": true,
          "legend": { "position": "none" },
          "chartArea": { "left": "70%", "width": "90%", "top": "10%" },
          "tooltip": { "isHtml": true },
          "hAxis": { "textPosition": "none" },
        },
        data: $scope[formatter](data)
      };
      $scope.chooseVideoQuestionBlockGlass(Object.keys(data).length);
      angular.extend(chart.options, options);
      return chart;
    };

    $scope.chooseVideoQuestionBlockGlass = function(data_length) {
      var maxDataLength = 95;
      var minDataLength = 30;
      $scope.question_block_small = Math.min(Math.max(minDataLength, data_length * 9), maxDataLength);
      $scope.question_block_large = Math.min(maxDataLength, data_length * 20);
      $scope.changeVideoQuestionBoxPercentage($scope.question_block_small, false);
    };

    $scope.formatLectureChartData = function(data) {
      var formated_data = {};
      formated_data.cols = [{
        "label": $translate.instant("global.students"),
        "type": "string"
      }, {
        "label": $translate.instant("lectures.correct"),
        "type": "number"
      }, {
        "type": "string",
        "p": {
          "role": "tooltip",
          "html": true
        }
      }, {
        role: "style",
        type: "string"
      }];
      formated_data.rows = [];
      for (var ind in data) {
        var formatted_text = data[ind][2],
          raw_text = ScalearUtils.getHtmlText(formatted_text),
          number,
          tooltip_text = "<div style='color:black;padding:8px'>",
          color = data[ind][1];

        if (color == "gray") {
          number = Math.floor((data[ind][0] / $scope.students_count) * 100);
        } else {
          number = Math.floor(((data[ind][0] + data[ind][3]) / $scope.students_count) * 100);
          var answer_status = "Correct: ";
          if (color == "orange") {
            color = "gray";
            answer_status = "Incorrect: ";
          } else {
            raw_text = REPLACE_STYLING + raw_text;
          }
          if (!isSurvey()) {
            tooltip_text += answer_status;
          }
        }

        tooltip_text += formatted_text + "</div>";
        var row = {
          "c": [
            { "v": raw_text },
            { "v": number },
            { "v": tooltip_text },
            { "v": color }
          ]
        };
        formated_data.rows.push(row);
      }
      return formated_data;
    };

    $scope.formatInclassQuizChartData = function(data) {
      var formated_data = {};
      formated_data.cols = [{
        "label": $translate.instant("global.students"),
        "type": "string"
      }, {
        "label": $translate.instant("inclass.self_stage"),
        "type": "number"
      }, {
        "type": "string",
        "p": {
          "role": "tooltip",
          "html": true
        }
      }, {
        "label": $translate.instant("inclass.group_stage"),
        "type": "number"
      }, {
        "type": "string",
        "p": {
          "role": "tooltip",
          "html": true
        }
      }];
      formated_data.rows = [];
      var total_self = 0;
      var total_group = 0;
      for (var question in data) {
        if (data[question][2] != "Never tried") {
          total_self += data[question][0];
          total_group += data[question][4];
        }
      }

      for (var ind in data) {
        var formatted_text = data[ind][2],
          raw_text = ScalearUtils.getHtmlText(formatted_text),
          self_count = data[ind][0] || 0,
          group_count = data[ind][4] || 0,
          self_percent = self_count / total_self * 100,
          group_percent = group_count / total_group * 100,
          tooltip_text = "<div style='padding:8px'><b>" + formatted_text + "</b><br>" +
          $translate.instant("inclass.self_stage") + ": " + self_count + " (" + self_percent + "%)" + "<br>" +
          $translate.instant("inclass.group_stage") + ": " + group_count + " (" + group_percent + "%)" + "</div>",
          raw_text = (data[ind][1] == "green") ? REPLACE_STYLING + raw_text : raw_text;
        var row = {
          "c": [
            { "v": raw_text },
            { "v": self_percent },
            { "v": tooltip_text },
            { "v": group_percent },
            { "v": tooltip_text },
          ]
        };
        //remove never tried column
        if (raw_text != "Never tried") {
          formated_data.rows.push(row);
        }
      }
      return formated_data;
    };

    $scope.formatSurveyChartData = function(data) {
      var formated_data = {};
      formated_data.cols = [
        { "label": $translate.instant("global.students"), "type": "string" },
        { "label": $translate.instant("progress.chart.answered"), "type": "number" },
        {
          "type": "string",
          "p": {
            "role": "tooltip",
            "html": true
          }
        }
      ];
      formated_data.rows = [];
      for (var ind in data) {
        var row = {
          "c": [
            { "v": ScalearUtils.getHtmlText(data[ind][2]) },
            { "v": Math.floor((data[ind][0] / $scope.students_count) * 100) },
            { "v": ScalearUtils.getHtmlText(data[ind][2]) }
          ]
        };
        formated_data.rows.push(row);
      }
      return formated_data;
    };

    $scope.setInclassShortcuts = function() {
      $scope.removeShortcuts();

      shortcut.add("Right", function() {
        $scope.nextSubItem();
        $scope.$apply();
      }, { "disable_in_input": false, "propagate": false });

      shortcut.add("Page_down", function() {
        $scope.nextSubItem();
        $scope.$apply();
      }, { "disable_in_input": false, "propagate": false });

      shortcut.add("Left", function() {
        $scope.prevSubItem();
        $scope.$apply();
      }, { "disable_in_input": false, "propagate": false });

      shortcut.add("Page_up", function() {
        $scope.prevSubItem();
        $scope.$apply();
      }, { "disable_in_input": false, "propagate": false });

      shortcut.add("Up", function() {
        $scope.prevItem();
        $scope.$apply();
      }, { "disable_in_input": false, "propagate": false });

      shortcut.add("Down", function() {
        $scope.nextItem();
        $scope.$apply();
      }, { "disable_in_input": false, "propagate": false });

      shortcut.add("b", function() {
        $scope.toggleBlackScreen("inclass.blackscreen_close");
        $scope.$apply();
      }, { "disable_in_input": false, "propagate": false });

      shortcut.add("h", function() {
        $scope.toggleHideQuestions();
        $scope.$apply();
      }, { "disable_in_input": false, "propagate": false });

      shortcut.add("Space", function() {
        $scope.playBtn();
        $scope.$apply();
      }, { "disable_in_input": false, "propagate": false });

      shortcut.add("m", function() {
        $scope.muteBtn();
        $scope.$apply();
      }, { "disable_in_input": false, "propagate": false });
    };

    $scope.removeShortcuts = function() {
      shortcut.remove("Page_up");
      shortcut.remove("Page_down");
      shortcut.remove("Right");
      shortcut.remove("Left");
      shortcut.remove("b");
      shortcut.remove("h");
      shortcut.remove("Space");
      shortcut.remove("m");
    };

    $scope.toggleBlackScreen = function(msg) {
      $scope.show_black_screen = !$scope.show_black_screen;
      $scope.blackscreen_msg = msg;
    };

    $scope.showBlackScreen = function(msg) {
      $scope.show_black_screen = true;
      $scope.blackscreen_msg = msg;
    };

    $scope.hideBlackScreen = function() {
      $scope.show_black_screen = false;
      $scope.blackscreen_msg = "";
    };

    $scope.isBlackScreenOn = function() {
      return $scope.show_black_screen;
    };

    $scope.setOriginalClass = function() {
      $scope.question_class = "original_question";
      $scope.chart_class = "original_chart";
      $scope.student_question_class = "original_student_question";
      $scope.question_block = "normal_question_block";
      $scope.showQuestionBox();
    };

    $scope.toggleHideQuestions = function() {
      if ($scope.hide_questions) {
        $scope.showQuestionBox();
      } else {
        $scope.hideQuestionBox();
      }
    };


    $scope.toggleZoomGraphVideo = function() {
      if ($scope.zooom_graph) {
        $scope.showQuestionBox();
      } else {
        $scope.zoomGraph();
      }
    };

    $scope.changeVideoQuestionBoxPercentage = function(question_block, scrollable) {
      var question_block_element = angular.element(".normal_question_block");
      var video_block_element = angular.element(".original_video");

      $timeout(function() {
        if ((question_block_element.length !== 0) && (video_block_element.length !== 0)) {
          question_block_element[0].style.maxHeight = question_block + "%";
          question_block_element[0].style.minHeight = question_block + "%";
          question_block_element[0].style.border = (question_block > 0 ? 1 : 0) + "px solid darkgrey";
          question_block_element[0].style.overflowY = scrollable ? "auto" : "hidden";
          video_block_element[0].style.maxHeight = (95 - question_block) + "%";
          video_block_element[0].style.minHeight = (95 - question_block) + "%";
        }
      });
    };

    $scope.zoomGraph = function() {
      $scope.zooom_graph_text = $scope.button_names[9];
      $scope.hide_video_text = $scope.button_names[3];

      $scope.zooom_graph = true;
      $scope.hide_questions = false;
      $scope.changeVideoQuestionBoxPercentage($scope.question_block_large, true);

      if ($scope.chart) {
        $scope.chart.options.fontSize = calculateFontSize("medium");
      }
      $scope.blurButtons();
    };

    $scope.showQuestionBox = function() {
      $scope.zooom_graph = false;
      $scope.hide_questions = false;
      $scope.hide_video_text = $scope.button_names[3];
      $scope.zooom_graph_text = $scope.button_names[8];

      if ($scope.selected_timeline_item && $scope.selected_timeline_item.type == "inclass") {
        $scope.changeVideoQuestionBoxPercentage(30, false);
      } else {
        $scope.changeVideoQuestionBoxPercentage($scope.question_block_small, false);
      }

      if ($scope.chart) {
        $scope.chart.options.fontSize = calculateFontSize("small");
      }
      $scope.blurButtons();
    };

    $scope.hideQuestionBox = function() {
      $scope.hide_questions = true;
      $scope.zooom_graph = false;
      $scope.hide_video_text = $scope.button_names[4];
      $scope.zooom_graph_text = $scope.button_names[8];
      $scope.changeVideoQuestionBoxPercentage(0, false);
      $scope.blurButtons();
    };

    var changeButtonsSize = function() {
      var win = angular.element($window);
      var win_width = win.width();
      if (win_width < 660) {
        $scope.button_names = ["Ex", "Ov", "Sh", "H", "U", "", "P", "R", "Z G", "Z V"];
        if (win_width < 510) {
          $scope.button_class = "smallest_font_button";
        } else {
          $scope.button_class = "small_font_button";
        }
      } else {
        $scope.button_class = "big_font_button";
        $scope.button_names = [$translate.instant("inclass.exit"), "", "", $translate.instant("inclass.video_only"),
          $translate.instant("inclass.show_graph"), "5sec", $translate.instant("inclass.pause"),
          $translate.instant("inclass.resume"), $translate.instant("inclass.zoom_graph"), $translate.instant("inclass.zoom_video")
        ];
      }
      $scope.hide_video_text = $scope.hide_questions ? $scope.button_names[4] : $scope.button_names[3];
      $scope.zooom_graph_text = $scope.zooom_graph ? $scope.button_names[9] : $scope.button_names[8];
    };

    $scope.playerButtonTooltip = function() {
      $scope.player_button_hover = true;
    };

    $scope.playerButtonTooltipLeave = function() {
      $scope.player_button_hover = false;
    };

    function adjustTextSize() {
      var question_block = angular.element(".normal_question_block").not(".ng-hide");
      var chars = question_block.text().trim().length;
      var space = question_block.height() * question_block.width();
      var font_size_container = Math.sqrt(space / chars) + 5;
      var font_size_screen = calculateFontSize("large");
      $scope.fontsize = Math.min(font_size_container, font_size_screen) + "px";
    }

    function adjustChartSize() {
      if ($scope.chart) {
        var question_block = angular.element(".normal_question_block").not(".ng-hide");
        if ($scope.zooom_graph && $scope.question_block_large == 95) {
          $scope.chart.options.height = Object.keys($scope.selected_timeline_item.data.answers).length * ((question_block.height() - 50) / 4);
        } else {
          $scope.chart.options.height = question_block.height() - 50;
        }
      }
    }

    $scope.lightUpButtons = function() {
      $scope.last_movement_time = new Date();
      $scope.dark_buttons = null;
      $interval(function() {
        if ((new Date()) - $scope.last_movement_time >= 5000) {
          $scope.dark_buttons = "dark_button";
        }

      }, 5000, 1);
    };

    $scope.blurButtons = function() {
      angular.element(".button").blur();
    };

    var isSurvey = function() {
      return (
        ($scope.selected_timeline_item.data.type && $scope.selected_timeline_item.data.type.toLowerCase() == "survey") ||
        ($scope.selected_timeline_item.data.type && $scope.selected_timeline_item.data.type.toLowerCase() == "html_survey")
      );
    };

    $scope.timerCountUp = function() {
      if ($scope.up_counter == 59) {
        $scope.up_timer++;
        $scope.up_counter = 0;
      } else {
        $scope.up_counter++;
      }
      $scope.sec_counter_up = $scope.up_counter < 10 ? "0" + $scope.up_counter : $scope.up_counter;
      $scope.min_counter_up = $scope.up_timer < 10 ? "0" + $scope.up_timer : $scope.up_timer;
    };

    var StageTimerCountdown = function() {
      if ($scope.stage_counter === 0) {
        cancelStageTimer();
      } else {
        $scope.stage_counter--;
      }
    };

    $scope.toggleStageTimer = function() {
      if (!$scope.stage_timer) {
        startStageTimer();
      } else {
        cancelStageTimer();
      }
    };

    var startStageTimer = function() {
      $scope.stage_timer = $interval(StageTimerCountdown, 1000);
    };

    var cancelStageTimer = function() {
      if ($scope.stage_timer) {
        $interval.cancel($scope.stage_timer);
        $scope.stage_timer = null;
      }
    };

    var setStageTimer = function(count) {
      $scope.stage_counter = count;
    };

    var updateInclassSession = function(quiz_id, status) {
      $scope.inclass_session = status;
      if (status >= 0 && status <= 5) {
        OnlineQuiz.updateInclassSession({ online_quizzes_id: quiz_id }, { status: status });
      }
    };

    var exitInclassSession = function() {
      Module.updateAllInclassSessions({
        course_id: $stateParams.course_id,
        module_id: $stateParams.module_id
      }, {});
    };

    var getSessionVotes = function(quiz_id, lecture_id, in_group) {
      OnlineQuiz.getInclassSessionVotes({
        online_quizzes_id: quiz_id,
        lecture_id: lecture_id,
        in_group: in_group,
      }, function(resp) {
        $scope.session_votes = resp.votes;
        $scope.session_max_votes = resp.max_votes;
      });
    };

    var startSessionVotesTimer = function() {
      $scope.session_votes_timer = $interval(function() {
        getSessionVotes($scope.selected_timeline_item.data.id, $scope.selected_item.id, $scope.selected_timeline_sub_item.data.status == 3);
      }, 5000);
    };

    var cancelSessionVotesTimer = function() {
      if ($scope.session_votes_timer) {
        $interval.cancel($scope.session_votes_timer);
      }
      $scope.session_votes = null;
      $scope.session_max_votes = null;
    };

    $scope.chartReady = function() {
      if (!$scope.chart.options.fontSize) {
        $scope.chart.options.fontSize = calculateFontSize("small");
      }

      $("text:contains('" + REPLACE_STYLING + "')").each(function(idx, elem) {
        var $elem = $(elem);
        var text = $elem.text().replace(REPLACE_STYLING, "");
        $elem.html("<tspan>" + text + "</tspan>");
      });

      $("div[style*='background: infobackground;']:contains('" + REPLACE_STYLING + "')").each(function(idx, elem) {
        var $elem = $(elem);
        var text = $elem.text().replace(REPLACE_STYLING, "");
        $elem.text(text);
      });

      $(window).resize();
      $scope.loading_chart = false;
    };

    init();

  }]);
