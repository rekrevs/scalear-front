'use strict';

angular.module('scalearAngularApp')
  .directive("progressMatrix", function() {
    return {
      restrict: "E",
      scope: {
        columnNames: "=",
        students: "=",
        status: "=",
        solvedCount: "=",
        totalLecQuiz: "=",
        action: "&",
        show_popover: '=showPopover',
        remaining: "&",
        scrolldisabled: "=",
        modstatus: "=",
        export:"&"
      },
      templateUrl: '/views/teacher/progress/progress_matrix.html',
      link: function(scope, element) {
        scope.exportProgress = scope.export()
        if (scope.show_popover) {
          var template = "<div style='font-size:14px; color: black;'>" +
            "<input type='radio' name='stat' ng-model='student.status[module[0]]' ng-change='action({student_id:student.id, module_id:module[0], module_status:student.status[module[0]]})' style='margin:0 4px 4px 4px'><span translate>progress.popover.original</span> " +
            "<input type='radio' name='stat' ng-model='student.status[module[0]]' ng-change='action({student_id:student.id, module_id:module[0], module_status:student.status[module[0]]})' style='margin:0 4px 4px 4px' value='Finished on Time' translate><span translate>progress.popover.on_time</span> " +
            "<input type='radio' name='stat' ng-model='student.status[module[0]]' ng-change='action({student_id:student.id, module_id:module[0], module_status:student.status[module[0]]})' style='margin:0 4px 4px 4px' value='Not Finished' translate><span translate>progress.popover.not_done</span>" +
            "</div>"
          scope.popover_options = {
            content: template,
            title: "<span style='color: black;' translate>progress.popover.change_status</span>",
            html: true,
            placement: 'top',
            container: 'body',
          }
        }
        scope.getImg = function(module) {
          module = parseInt(module);
          if (module == -1)
            return "not_finished"
          else if (module == 0)
            return "finished_on_time"
          else
            return "finished_not_on_time"
        }
      }
    };
  }).directive("innerTitle", function() {
    return {
      restrict: "E",
      scope: {
        time: '=',
        type: '=',
        itemtitle: '=',
        color: "="
      },
      template: '<span class="inner_title" bindonce>' +
        '<span style="cursor:pointer"><span ng-show="time!=null" bo-text=\'"["+(time|format:"mm:ss")+"]"\'></span> <span bo-text="type"></span>: ' +
        '<span ng-style=\'{"color":color, "fontWeight":"normal"}\' bo-text="itemtitle"></span>' +
        '</span>' +
        '</span>'
    };
  }).directive("showBox", function() {
    return {
      restrict: "E",
      scope: {
        value: "=",
        action: "&",
        text: "@"
      },
      template: '<div style="margin-left:4px">' +
        '<div class="left no-padding" style="margin-right:3px;margin-left:2px">' +
        '<input class="show_inclass no-margin" type="checkbox" ng-model="value" ng-change="change()" />' +
        '</div>' +
        '<div class="left size-12 no-padding" style="color:black;font-weight:normal;margin-top: 3px;" bindonce="label" bo-text="label | translate"></div>' +
        '</div>',
      link: function(scope, element) {
        scope.label = scope.text || 'progress.button.show_in_class'
        scope.change = function() {
          scope.action()
          angular.element('input.show_inclass').blur()
        }
      }
    };
  }).directive("freeTextTable", function() {
    return {
      restrict: 'E',
      scope: {
        question: '=',
        survey_id: '=surveyId',
        lecture_id: '=lectureId',
        related_answers: '=relatedAnswers',
        display_only: '=displayOnly',
        graded: '@'
      },
      templateUrl: '/views/teacher/progress/free_text_table.html',
      controller: 'freeTextTableCtrl'
    }
  }).directive("inclassEstimate", ['$log', function($log) {
    return {
      restrict: "E",
      scope: {
        time_quiz: '=timeQuiz',
        time_question: '=timeQuestion',
        quiz_count: '=quizCount',
        question_count: '=questionCount',
        survey_count: '=surveyCount',
        inclass_quiz_time: '=inclassQuizTime',
        inclass_quiz_count: '=inclassQuizCount'
      },
      templateUrl: '/views/teacher/in_class/inclass_time_estimate.html',
      link: function(scope) {
        scope.numbers = []
        for (var i = 0; i <= 6; i++) {
          scope.numbers.push(i);
        }
        var template = "<div style='min-width: 235px;'>" +
          "<label class='small-12 columns no-padding'>" +
          "<span translate>inclass.time_per_quiz</span>" +
          "<select style='height: 20px;font-size: 12px;padding: 0 18px;margin: 0;margin-left: 10px;width: 25%;float: right;' ng-model='time_quiz' ng-options='i for i in numbers'></select>" +
          "</label>" +
          "<label class='small-12 columns no-padding with-small-margin-bottom'>" +
          "<span translate>inclass.time_per_question</span>" +
          "<select style='height: 20px;font-size: 12px;padding: 0 18px;margin: 0;margin-left: 10px;width: 25%;float: right;' ng-model='time_question' ng-options='i for i in numbers'></select>" +
          "</label>" +
          "</div>"

        scope.popover_options = {
          content: template,
          html: true,
          placement: "bottom"
        }

        var reviewEstimateCalculator = function() {
          return scope.quiz_count * scope.time_quiz + scope.question_count * scope.time_question + scope.survey_count * scope.time_question
        }

        var inclassEstimateCalculator = function() {
          return Math.round(scope.inclass_quiz_time) || 0
        }

        var getColor = function(estimate) {
          $log.debug(estimate)
          if (estimate > 25)
            return 'red'
          else if (estimate > 15)
            return 'orange'
          else
            return 'black'
        }

        scope.$watchCollection('[time_quiz, time_question,quiz_count,question_count, survey_count, inclass_quiz_time]', function(newValues) {
          scope.review_estimate = reviewEstimateCalculator()
          scope.inclass_estimate = inclassEstimateCalculator()
          scope.total_inclass_estimate = scope.review_estimate + scope.inclass_estimate
          scope.total_estimate_color = getColor(scope.total_inclass_estimate)
        });
      }
    };
  }])
