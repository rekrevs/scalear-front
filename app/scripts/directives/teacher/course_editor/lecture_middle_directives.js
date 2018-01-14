'use strict';

angular.module('scalearAngularApp')
  .directive('quizList', function() {
    return {
      restrict: 'E',
      templateUrl: '/views/teacher/course_editor/lecture.middle.quiz_list.html',
    };
  })
  .directive('markerList', function() {
    return {
      restrict: 'E',
      templateUrl: '/views/teacher/course_editor/lecture.middle.marker_list.html',
    };
  })
  .directive('quiz', function() {
    return {
      transclude: true,
      replace: true,
      restrict: 'E',
      template: '<div class="ontop" id="ontop" style="position: absolute;width:100%; height: 100%; top:0px; left: 0px;" ng-class="lecture.aspect_ratio" ng-transclude></div>'
    };
  })
  .directive('quizEditPanel', ['$timeout', '$q', 'OnlineQuiz', '$translate', 'ScalearUtils','VideoInformation', function($timeout, $q, OnlineQuiz, $translate, ScalearUtils, VideoInformation) {
    return {
      restrict: 'E',
      templateUrl: '/views/teacher/course_editor/quiz_edit_panel.html',
      link: function(scope, element, attrs) {
        scope.selected_quiz.has_start = scope.selected_quiz.start_time != scope.selected_quiz.time
        scope.selected_quiz.has_end = scope.selected_quiz.end_time != scope.selected_quiz.time
        scope.invideo_quiz_type = scope.selected_quiz.quiz_type == "invideo"

        scope.updateQuizStartTime = function() {
          scope.selected_quiz.start_time = scope.selected_quiz.time
          if (scope.selected_quiz.has_start) {
            var duration = VideoInformation.duration
            var percent = 5
            var caluclated_percent = (percent * duration) / 100
            scope.selected_quiz.start_time  = (scope.selected_quiz.start_time - caluclated_percent < 0) ? 0 : scope.selected_quiz.start_time - caluclated_percent
          }
        }

        scope.updateQuizEndTime = function() {
          scope.selected_quiz.end_time = scope.selected_quiz.time
          if (scope.selected_quiz.has_end) {
            var duration = scope.lecture_player.controls.getDuration()
            var percent = 5
            var caluclated_percent = (percent * duration) / 100
            scope.selected_quiz.end_time = (scope.selected_quiz.end_time + caluclated_percent > duration) ? duration : scope.selected_quiz.end_time + caluclated_percent
          }
        }

        $timeout(function() {
          element.find('.quiz_name').focus();
          document.execCommand('selectAll', false, null);
        });

      }
    };
  }])
  .directive('markerEditPanel', ['$timeout', '$q', '$translate', 'OnlineMarker', function($timeout, $q, $translate, OnlineMarker) {
    return {
      restrict: 'E',
      template: '<div>' +
        '<h6 class="row no-margin color-wheat wheat">' +
        '<div style="margin-top:10px;text-align:left;margin-left:0;">' +
        '<div class="small-12 columns" style="margin-bottom: 5px;"><span translate>editor.title</span>:</div>' +
        '<div class="small-12 left columns" style="margin-bottom: 15px;">' +
        '<div><rich-textarea class="marker_name" ng-model="selected_marker.title" ></div>' +
        '<small class="error" ng-show="marker_errors.name_error" ng-bind="marker_errors.name_error"></small>' +
        '</div>' +
        '</div>' +
        '<div style="margin-top:10px;text-align:left;margin-left:0;">' +
        '<div class="small-12 columns" style="margin-bottom: 5px;"><span translate>editor.annotation</span>:</div>' +
        '<div class="small-12 left columns" style="margin-bottom: 15px;">' +
        '<rich-textarea class="marker_annotation" ng-model="selected_marker.annotation" style="height: 70px;margin-bottom:0;">' +
        '</div>' +
        '</div>' +
        '<div class="row" style="text-align:left;margin-left:0;">' +
        '<div class="small-3 columns"><span translate>editor.note_time</span>:</div>' +
        '<div class="small-4 left columns no-padding" style="margin-bottom: 5px;">' +
        '<input class="marker_time" type="text" ng-model="selected_marker.formatedTime" style="height: 30px;margin-bottom:0;">' +
        '<small class="error position-absolute z-one" ng-show="marker_errors.time_error" ng-bind="marker_errors.time_error"></small>' +
        '</div>' +
        '</div>' +
        '<div class="row" style="text-align:left;margin-left:0;">' +
        '<div class="small-3 columns"><span translate>editor.note_as_slide</span>:</div>' +
        '<div class="small-4 left columns no-padding" style="margin-bottom: 5px;">' +
        '<input class="marker_as_slide" type="checkbox" ng-model="selected_marker.as_slide" style="margin-bottom:0;"/>' + 
        '(<span translate>editor.note_as_slide_description</span>)'+
        '<small class="error position-absolute z-one" ng-show="marker_errors.as_slide_error" ng-bind="marker_errors.as_slide_error"></small>' +
        '</div>' +
        '</div>' +
        '<div class="row" style="text-align:left;margin-left:0;" ng-hide="selected_marker.as_slide">' +
        '<div class="small-3 columns"><span translate>editor.note_duration</span>:</div>' +
        '<div class="small-4 left columns no-padding" style="margin-bottom: 5px;">' +
        '<input class="marker_duration" type="text" ng-model="selected_marker.duration" style="height: 30px;margin-bottom:0;">' +
        '<small class="error position-absolute z-one" ng-show="marker_errors.duration_error" ng-bind="marker_errors.duration_error"></small>' +
        '</div>' +
        '</div>' +        
        '<delete_button id="delete_marker_button" size="big" action="deleteMarkerButton(selected_marker)" vertical="false" text="true" style="margin:10px;margin-left:0;float:right;margin-top:0;"></delete_button>' +
        '<button id="save_marker_button" ng-disabled="disable_save_button" class="button tiny" style="float:right" ng-click="saveMarkerBtn(selected_marker)" translate>events.done</button>' +
        '</h6>' +
        '</div>',
      link: function(scope, element, attrs) {
        $timeout(function() {
          element.find('.marker_name').focus();
          document.execCommand('selectAll', false, null);
          // element.find('.marker_name').select();
        });

        var maker_enter_tab_click = function(tab_enter) {
          if($("div.marker_name").is(':focus')){
            $("div.marker_annotation").focus()
          }
          else if($("div.marker_annotation").is(':focus')){
           $("input.marker_time").focus()
          }
          else if($("input.marker_time").is(':focus')){
           $("#input.marker_duration").focus()
          }
          else if($("input.marker_duration").is(':focus')){
           $("#save_marker_button").focus()
          }          
          else if($("#save_marker_button").is(':focus')){
            if(tab_enter == 'enter'){
             $("#save_marker_button").click()
            }
            else{
              $("#delete_marker_button").find('a').focus()
            }
          }
          else if($("#delete_marker_button").find('a').is(':focus')){
              $("div.marker_name").focus()
          }
        }
        var removeShortcuts=function(){
          shortcut.remove("Enter");
          shortcut.remove("Tab");
        }
        // shortcut.add("Enter", function(){
        //   maker_enter_tab_click("enter")
        // }, {"disable_in_input" : false});
        shortcut.add("Tab", function(){
          maker_enter_tab_click("tab")
        }, {"disable_in_input" : false});
        scope.$on('$destroy', function() {
          removeShortcuts()
        });
      }
    };
  }])
  .directive('videoEditPanel', ['$rootScope','$filter', 'ScalearUtils','VideoInformation',function($rootScope,$filter,ScalearUtils,VideoInformation) {
    return {
      restrict: 'E',
      template: '<div>' +
        '<h6 class="row no-margin color-wheat wheat">' +
        '<div style="margin:10px">Use the handlers above to trim video</div>' +
        '<div>' +
        '<div class="small-12 columns" style="margin-bottom:10px;">' +
        '<div class="small-3 columns">Start Time</div>' +
        '<div class="small-5 columns left size-14 text-center no-padding" style="border-radius: 3px; border: 1px darkgrey solid;">' +
        '<input type="text" ng-model="selected_lecture.start_time_formated_time" style="height: 30px;margin-bottom:0;">'+
        '<small class="error position-absolute z-one" ng-show="lecture_errors.start_time" ng-bind="lecture_errors.start_time"></small>'+
        '</div>' +
        '</div>' +
        '<div class="small-12 columns">' +
        '<div class="small-3 columns">End Time</div>' +
        '<div class="small-5 columns left size-14 text-center no-padding" style="border-radius: 3px; border: 1px darkgrey solid;">' +
        '<input type="text" ng-model="selected_lecture.end_time_formated_time" style="height: 30px;margin-bottom:0;">'+
        '<small class="error position-absolute z-one" ng-show="lecture_errors.end_time" ng-bind="lecture_errors.end_time"></small>'+
        '</div>' +
        '</div>' +
        '<button id="save_marker_button" ng-disabled="disable_save_button" class="button tiny" style="margin:10px;margin-left:0;float:right;margin-top:0;" ng-click="closeTrimVideo()" translate>events.done</button>' +
        '</h6>' +
        '</div>',
      link: function(scope, element, attrs) {
        scope.selected_lecture = {}
        scope.lecture_errors = {}
        var duration = scope.lecture.end_time
        scope.selected_lecture.start_time_formated_time = $filter('format')(scope.lecture.start_time)
        scope.selected_lecture.end_time_formated_time = $filter('format')(scope.lecture.end_time)
        scope.$watch('lecture.start_time', function(newval,oldval){
          scope.selected_lecture.start_time_formated_time = $filter('format')(scope.lecture.start_time)        
        })
        scope.$watch('lecture.end_time', function(newval,oldval){
          scope.selected_lecture.end_time_formated_time = $filter('format')(scope.lecture.end_time)        
        })

        scope.closeTrimVideo = function() {
          scope.lecture_errors.start_time = ScalearUtils.validateTimeWithDurationForTrim(scope.selected_lecture.start_time_formated_time, duration)
          scope.lecture_errors.end_time = ScalearUtils.validateTimeWithDurationForTrim(scope.selected_lecture.end_time_formated_time, duration , scope.selected_lecture.start_time_formated_time)
          if ( !scope.lecture_errors.start_time && !scope.lecture_errors.end_time ){
            scope.lecture.start_time = ScalearUtils.arrayToSeconds(scope.selected_lecture.start_time_formated_time.split(':'))
            scope.lecture.end_time = ScalearUtils.arrayToSeconds(scope.selected_lecture.end_time_formated_time.split(':'))
            $rootScope.$broadcast("close_trim_video")
          }
        }
      }
    };
  }])
  .directive('answervideo', function() {
    return {
      scope: {
        quiz: "=",
        data: "=",
        list: '=',

        save: "&",
      remove: "&",
      },
      replace: true,
      restrict: 'E',
      template: "<div ng-switch on='quiz.question_type.toUpperCase()'>" +
        "<answer ng-switch-when='MCQ' />" +
        "<answer ng-switch-when='OCQ' />" +
        "<drag ng-switch-when='DRAG' />" +
        "<free_text ng-switch-when='FREE TEXT QUESTION' />"+
        "</div>"
    };
  }).directive('answer', ['$rootScope', '$log', '$timeout', function($rootScope, $log, $timeout) {
    return {
      replace: true,
      restrict: 'E',
      templateUrl: '/views/teacher/course_editor/answer.html',
      link: function(scope, element, attrs) {
        scope.setAnswerColor = function() {
          if (scope.quiz.question_type == "OCQ")
            scope.imgName = scope.data.correct ? scope.ocq_correct : scope.ocq_incorrect;
          else
            scope.imgName = scope.data.correct ? scope.mcq_correct : scope.mcq_incorrect;
        }

        scope.calculatePosition = function() {
          var ontop = angular.element('.ontop');
          scope.data.xcoor = parseFloat(element.position().left) / ontop.width();
          scope.data.ycoor = parseFloat(element.position().top) / (ontop.height());
          scope.calculateSize()
        }

        scope.calculateSize = function() {
          var ontop = angular.element('.ontop');
          scope.data.width = element.width() / ontop.width();
          scope.data.height = element.height() / (ontop.height());
        }

        scope.radioChange = function(corr_ans) {
          if (scope.quiz.question_type == "OCQ") {
            $log.debug("radioChange")
            scope.quiz.answers.forEach(function(ans) {
              ans.correct = false
            })
            corr_ans.correct = true
            $rootScope.$emit("radioChange")
          }

        }
        scope.selectField = function() {
          $timeout(function() {
            // var elem = element.find('textarea')[0]
            // if (elem)
            //   elem.select()
            $('.popover .answer_text').focus()
            document.execCommand('selectAll', false, null);
          })
        }
        scope.updateValues = function() {
          scope.values = 0
          for (var element in scope.quiz.answers) {
            if (scope.quiz.answers[element].correct) {
              scope.values += 1
            }
          }
        }

        var hidePopover = function(){
          $('.popover').remove();
        }

        scope.$on("$destroy", function() {
          hidePopover()
        })

        scope.close = function() {
          scope.save()
          hidePopover()
        }

        scope.delete = function() {
          scope.remove()
          hidePopover()
        }

        scope.answerDragStart = function() {
          hidePopover()
        }

        $rootScope.$on("radioChange", function() {
          scope.setAnswerColor()
        })

        scope.answerClass = "component dropped answer_img"

        // scope.medium_editor_options = {placeholder: false}

        var template = ""
        if (scope.quiz.quiz_type == 'survey')
          template = "<form name='aform'>" +
          "<label class='show-inline'><span translate>editor.answer</span><h6 class='no-margin-bottom'><small translate>editor.popover.shown_in_graph</small></h6></label>" +
          "<span class='right' tooltip-append-to-body='true' tooltip={{'editor.tooltip.click_to_delete'|translate}}><delete_button class='right' size='big' hide-confirm='false' color='dark' action='remove()'></delete_button></span>" +
          "<div><rich-textarea rows=3 class='must_save answer_text' ng-class='{error: aform.answer.$error.required}' type='text' ng-model='data.answer' ng-init='selectField()'  name='answer' required /></div>" +
          "<small class='error' ng-show='aform.answer.$error.required' style='padding-top: 5px;'><span translate>error_message.required</span>!</small>" +
          "<button type='button' ng-click='close()' class='button tiny success with-small-margin-top small-6 columns'><span translate>button.close</span></button>" +
          '<delete_button size="big" action="delete()" vertical="false" text="true" style="margin:8px 0;" class="small-6 columns no-padding"></delete_button>' +
          "</form>"
        else
          template = "<form name='aform' >" +
          "<label class='show-inline'><span translate>editor.correct</span> <span translate>editor.answer</span>" +
          "<input id='correct_checkbox' class='must_save_check' ng-change='radioChange(data);setAnswerColor();updateValues();' ng-model='data.correct' style='margin-left:10px;margin-bottom:2px' type='checkbox' ng-checked='data.correct' name='mcq'/></label>" + //ng-class='{error: aform.mcq.$error.atleastone}' atleastone
          "<label class='with-small-margin-top'>" +
          "<span translate>editor.answer</span>" +
          "<h6 class='subheader no-margin'><small style='text-transform: initial;' translate>editor.popover.shown_in_graph</small></h6>" +
          // "<textarea rows=3 class='must_save medium-textarea' type='text' ng-init='selectField($event)' ng-model='data.answer'  value={{data.answer}} name='answer' ng-class='{error: aform.answer.$error.required}' required></textarea>" +
          "<div><rich-textarea rows=3 class='must_save answer_text' ng-model='data.answer' ng-class='{error: aform.answer.$error.required}' required ng-init='selectField($event)'/></div>"+
          "<small class='error' ng-show='aform.answer.$error.required' style='padding-top: 5px;'><span translate>error_message.required</span>!</small>" +
          "</label>" +
          "<label style='margin-top:10px'>" +
          "<span translate>editor.explanation</span>" +
          "<h6 class='subheader no-margin'><small style='text-transform: initial;' translate>editor.popover.shown_to_student</small></h6>" +
          // "<textarea medium-editor bind-options='medium_editor_options' rows=3 class='must_save medium-editor-textarea' type='text' ng-model='data.explanation' value={{data.explanation}}></textarea>" +
          "<rich-textarea rows=3 class='must_save' ng-model='data.explanation' />"+
          "</label>" +
          "<button type='button' ng-click='close()' class='button tiny success with-small-margin-top small-6 columns'><span translate>button.close</span></button>" +
          '<delete_button size="big" action="delete()" vertical="false" text="true" style="margin:8px 0;" class="small-6 columns no-padding"></delete_button>' +
          "</form>"

        scope.popover_options = {
          content: template,
          html: true,
          placement: function() {
            var placement = (scope.data.xcoor > 0.5) ? "left" : "right"
            return scope.data.ycoor < 0.3 ? "bottom" : placement
          },
          // instant_show: !scope.data.id,
          container: 'body',
        }
        if(!scope.data.id){
            scope.popover_options.instant_show = 'click'
          }

        scope.$watch('quiz.answers', function() {
          scope.updateValues();
        }, true)

        scope.setAnswerColor()
      }
    };
  }]).directive('drag', ['$log', '$timeout', function($log, $timeout) {
    return {
      replace: true,
      restrict: 'E',
      template: "<div>" +
        "<div pop-over='popover_options' unique='true' class='component dropped_drag'  ng-style=\"{width: (data.width*100)+'%', height: (data.height*100)+'%', left: (data.xcoor*100)+'%', top: (data.ycoor*100)+'%'}\" data-drag='true' data-jqyoui-options=\"{containment:'.ontop'}\" jqyoui-draggable=\"{animate:true, onStop:'calculatePosition'}\" >" +
        "<div >" +
        "<span class='position-header error light-grey dark-text no-margin'>{{data.pos+1}} <span translate>editor.drag.end</span></span>" +
        "</div>" +
        "</div>" +
        "<div class='dragged handle' data-drag='true' style='height: 46px; border-radius: 10px; padding: 10px;' ng-style=\"{left: (data.sub_xcoor*100)+'%', top: (data.sub_ycoor*100)+'%'}\" data-jqyoui-options=\"{containment:'.ontop'}\" jqyoui-draggable=\"{animate:true, onStop:'calculatePosition'}\" >" +
        "<span class='position-header error light-grey dark-text no-margin' style='top: 6px;left: -48px;padding: 6px;'>{{data.pos+1}} <span translate>editor.drag.start</span></span>" +
        "<span class='no-margin' ng-bind-html='data.answer'></span>" +
        "</div>" +
        "</div>",

      link: function(scope, element, attrs) {

        scope.calculatePosition = function() {
          var ontop = angular.element('.ontop');
          var main = angular.element(element.children()[0])
          var sub = angular.element(element.children()[1])
          scope.data.xcoor = parseFloat(main.position().left) / ontop.width();
          scope.data.ycoor = parseFloat(main.position().top) / ontop.height();
          scope.data.sub_xcoor = parseFloat(sub.position().left) / ontop.width();
          scope.data.sub_ycoor = parseFloat(sub.position().top) / ontop.height();
          $log.debug(scope.data)
          scope.calculateSize()
        }
        scope.calculateSize = function() {
          var ontop = angular.element('.ontop');
          var main = angular.element(element.children()[0])
          scope.data.width = main.width() / ontop.width();
          scope.data.height = main.height() / (ontop.height());
        }

        scope.selectField = function() {
          $timeout(function() {
            $(".popover .answer_text").focus()
            document.execCommand('selectAll', false, null);
            // element.find('textarea')[0].select()
          })
        }

        if (scope.data.pos == null) {
          $log.debug("pos undefined")
          var max = Math.max.apply(Math, scope.list)
          scope.data.pos = max == -Infinity ? -1 : max + 1
          scope.list.push(scope.data.pos)
        }

        scope.pos = parseInt(scope.data.pos)

        if (!(scope.data.explanation instanceof Array)) {
          scope.data.explanation = []
          for (var i in scope.list)
            scope.data.explanation[i] = ""
        }

        scope.quiz.answers.forEach(function(ans) {
          if (!ans.explanation[scope.data.pos])
            ans.explanation[scope.data.pos] = ""
        })

        var hidePopover = function(){
          $('.popover').remove();
        }

        scope.$on("$destroy", function() {
          hidePopover()
        })

        scope.close = function() {
          scope.save()
          hidePopover()
        }

        var template = '<ul class="no-margin">' +
          '<label>' +
          '<span translate>editor.drag.instruction</span>' +
          '<rich-textarea rows=3 style="resize:vertical;" class="answer_text must_save" ng-model="data.answer" ng-init="selectField()"/>' +
          '</label>' +
          '<label>' +
          '<span translate>editor.drag.correct</span>:' +
          '<rich-textarea rows=3 style="resize:vertical;" class="must_save" ng-model="data.explanation[pos]" />' +
          '</label>' +
          '<label ng-repeat=\'num in list|filter:"!"+data.pos\' >' +
          '<span translate translate-values="{num:num+1}">editor.drag.incorrect</span>:' +
          '<rich-textarea rows=3 class="must_save" style="resize:vertical;" ng-model="data.explanation[num]" />' +
          '</label>' +
          "<button type='button' ng-click='close()' class='button tiny success with-small-margin-top small-5 columns'><span translate>button.close</span></button>" +
          '<delete_button size="big" action="remove()" vertical="false" text="true" style="margin:8px 0;" class="small-7 columns no-padding"></delete_button>' +
          '</ul>'

        scope.popover_options = {
          content: template,
          html: true,
          placement: function() {
            var placement = (scope.data.xcoor > 0.5) ? "left" : "right"
            return scope.data.ycoor < 0.3 ? "bottom" : placement
          },
          // instant_show: !scope.data.id,
          container: 'body'
        }
        if(!scope.data.id){
          scope.popover_options.instant_show = 'click'
        }
        angular.element(element.children()[0]).resizable({
          containment: ".videoborder",
          minHeight: 40,
          minWidth: 40,
          stop: scope.calculateSize
        });
      }
    };
  }]).directive('freeText', ['$log', '$timeout', function($log, $timeout) {
    return {
      replace: true,
      restrict: 'E',
      save: "&",
      remove: "&",
      template: "<div>" +
        "<div class='component dropped answer_drag' style='cursor:move;border: 1px solid #ddd;background-color:white;padding:0px;position:absolute; min-height:40px; min-width: 40px;' ng-style=\"{width: (data.width*100)+'%', height: (data.height*100)+'%', left: (data.xcoor*100)+'%', top: (data.ycoor*100)+'%'}\" data-drag='true' data-jqyoui-options=\"{containment:'.ontop'}\" jqyoui-draggable=\"{animate:true, onStop:'calculatePosition'}\"  pop-over='popover_options'>" +
        "<h6 class='no-margin' style='text-align:left;resize:none;padding:10px;font-size: 0.1rem' ng-bind-html='quiz.question'></h6>"+
        "</div>"+
        "</div>",
      link: function(scope, element, attrs) {
        scope.calculatePosition = function() {
          var ontop = angular.element('.ontop');
          var main = angular.element(element.children()[0])
          scope.data.xcoor = parseFloat(main.position().left) / ontop.width();
          scope.data.ycoor = parseFloat(main.position().top) / ontop.height();
          scope.calculateSize()
        }
        scope.calculateSize = function() {
          var ontop = angular.element('.ontop');
          var main = angular.element(element.children()[0])
          scope.data.width = main.width() / ontop.width();
          scope.data.height = main.height() / (ontop.height());
        }

        // scope.close = function() {
        //   scope.save()
        //   angular.element(element.children()[0]).popover('hide')
        // }

       var hidePopover = function(){
          $('.popover').remove();
        }

        scope.$on("$destroy", function() {
          hidePopover()
        })

        scope.close = function() {
          scope.save()
          hidePopover()
        }

        scope.delete = function() {
          scope.remove()
        }

        var template = "<form name='aform' >" +
          "<label style='margin-top:10px'>" +
          "<span translate>editor.explanation</span>" +
          "<h6 class='subheader no-margin'><small style='text-transform: initial;' translate>editor.popover.shown_to_student</small></h6>" +
          "<rich-textarea rows=3 class='must_save' type='text' ng-model='data.explanation'></textarea>" +
          "</label>" +
          "<button type='button' ng-click='close()' class='button tiny success with-small-margin-top small-6 columns'><span translate>button.close</span></button>" +
          "</form>"



        scope.popover_options = {
          content: template,
          html: true,
          placement: function() {
            var placement = (scope.data.xcoor > 0.5) ? "left" : "right"
            return scope.data.ycoor < 0.3 ? "bottom" : placement
          },
          // instant_show: !scope.data.id,
          container: 'body'
        }
        if(!scope.data.id){
            scope.popover_options.instant_show = 'click'
          }


        angular.element(element.children()[0]).resizable({
          containment: ".videoborder",
          minHeight: 40,
          minWidth: 40,
          stop: scope.calculateSize
        });
      }
    };
  }]).directive('answerform', ['$log', '$translate', function($log, $translate) {
    return {
      scope: {
        quiz: "=",
        add: "&",
        remove: "&",
        removeq: "&",
        column: "@",
        columna: "@",
        index: "=",
        submitted: "=",
        subtype: "=",
        sortable: '@'
      },
      restrict: 'E',
      templateUrl: '/views/teacher/course_editor/answer_forum.html',
      link: function(scope, element, iAttrs) {

        scope.isSurvey = function() {
          return scope.subtype && (scope.subtype.toLowerCase() == "survey" || scope.subtype.toLowerCase() == "html_survey")
        }

        scope.isFreeText = function() {
          return (scope.quiz.question_type == "Free Text Question")
        }

        scope.isNormalQuiz = function() {
          return "content" in scope.quiz
        }
        scope.removeAnswerFreeText = function(){
          if(scope.isFreeText() ){
            scope.quiz.answers.forEach(function (value, i) {
                if(i==0 ){
                    if((scope.quiz.match_type == "Free Text")){
                      value.content = ""
                    }
                }
                else
                {scope.quiz.answers.splice(i, 1);}
            });
          }
        }

        scope.quiz_types = [
          { value: "MCQ", text: $translate.instant('content.questions.quiz_types.mcq') },
          { value: "OCQ", text: $translate.instant('content.questions.quiz_types.ocq') },
          { value: "Free Text Question", text: $translate.instant('content.questions.quiz_types.text') }
        ]
        scope.match_types = [
          { value: 'Free Text', text: $translate.instant('content.questions.quiz_types.free_text') },
          { value: 'Match Text', text: $translate.instant('content.questions.quiz_types.match_text') }
        ]
        $log.debug(scope.quiz)
        if (!scope.quiz.match_type && !scope.isSurvey()) {
          if(scope.quiz.question_type == "Free Text Question"  && scope.quiz.answers && scope.quiz.answers[0].content !="")
            scope.quiz.match_type =scope.match_types[1].value
          else
            scope.quiz.match_type =scope.match_types[0].value
        }

        if (!scope.isSurvey()) {
          scope.quiz_types.push({ value: "drag", text: $translate.instant('content.questions.quiz_types.drag') })
        }

        scope.addAnswer = scope.add()
        scope.removeQuestion = scope.removeq()
        // element.find('input')[0].focus()

        scope.$on('$destroy', function() {
          shortcut.remove("Enter");
        });

        shortcut.add("Enter", function() {
          if (!scope.isFreeText()) {
            var all_inputs = element.find('input')
            $log.debug(all_inputs.length)
            all_inputs.each(function(ind, elem) {
              $log.debug(elem)
              if (document.activeElement == elem)
                scope.addAnswer("", scope.quiz)
              return
            })
            scope.$apply()
            if (element.find('input')[all_inputs.length])
              element.find('input')[all_inputs.length].focus()
          }
        }, { "disable_in_input": false, 'propagate': true });

      }
    };
  }]).directive('htmlanswer', ['$log', function($log) {
    return {
      restrict: 'E',
      template: "<div ng-switch on='quiz.question_type.toUpperCase()'>" +
        "<div ng-switch-when='FREE TEXT QUESTION' >"+
          "<div ng-switch on='quiz.match_type.toUpperCase()'>" +
            "<div ng-switch-when='MATCH TEXT' ><html_freetextmatch ng-repeat='answer in quiz.answers' /></div>"+
            "<div ng-switch-when='FREE TEXT' ><html_freetext ng-repeat='answer in quiz.answers' /></div>"+
          "</div>"+
        "</div>" +
        "<div ng-switch-when='MCQ' ><html_mcq  ng-repeat='answer in quiz.answers' /></div>" +
        "<div ng-switch-when='OCQ' ><html_ocq  ng-repeat='answer in quiz.answers' /></div>" +
        "<ul  ng-switch-when='DRAG' class='no-padding-top'>" +
        "<h5 class='no-margin-top'><small translate>editor.messages.random_answers</small></h5>" +
        "<span ui-sortable='answers_sortable_options' ng-model='quiz.answers'>" +
        "<html_drag ng-repeat='answer in quiz.answers' />" +
        "</span>" +
        "</ul>" +
        "</div>",
      link: function(scope) {
        scope.removeAnswer = scope.remove()

        scope.updateValues = function() {
          scope.values = 0
          for (var element in scope.quiz.answers)
            if (scope.quiz.answers[element].correct)
              scope.values += 1
        }

        scope.radioChange = function(corr_ans) {
          scope.quiz.answers.forEach(function(ans) {
            ans.correct = false
          })
          corr_ans.correct = true

          scope.updateValues();
        }

        scope.show = function() {
          return ("time" in scope.quiz)
        }

        scope.$watch('quiz.answers', function() {
          scope.updateValues();
        }, true)

        scope.answers_sortable_options = {
          axis: 'y',
          dropOnEmpty: false,
          handle: '.drag-item',
          cursor: 'crosshair',
          items: '.drag-answer',
          opacity: 0.4,
          scroll: true
        }
      }
    };
  }]).directive('htmlFreetext', function() {
    return {
      restrict: 'E',
      template: "<ng-form name='aform'>" +
        "<div class ='row collapse' ng-if='!isSurvey()' >" +
          "<div class='small-2 columns' style='padding: 10px 0;'>" +
            "<label class='text-left' translate>editor.explanation</label>" +
          "</div>" +
          "<div class='small-7 left columns no-padding' >" +
            "<rich-textarea class='no-margin explain' type='text' name='explanation' placeholder={{'editor.explanation'|translate}} ng-model='answer.explanation'/></span>" +
          "</div>" +
        "</div>" +

        "</ng-form>"
    }

  }).directive('htmlFreetextmatch', function() {
    return {
      restrict: 'E',
      template: "<ng-form name='aform'>" +
        "<div ng-if=quiz.match_type == 'Match Text'>"+
        "<div class='row'>" +
          "<div class='small-10 columns'>" +
            "<div><input required name='answer' type='text' placeholder='String to match' ng-model='answer[columna]' style='margin-bottom: 0;' /></div>" +
            "<small class='error' ng-show='submitted && aform.answer.$error.required' style='padding-top: 5px;'><span translate>error_message.required</span>!</small>" +
          "</div>" +
        "</div>" +
        "<div class='text-left size-12'>" +
          "<div><br/><span translate>editor.regex.enter_string</span><br /><br /><span translate>Examples</span>:</div>" +
            "<ul class='size-12'>" +
              "<li>Waterloo -> <span translate>editor.regex.correct_if</span> 'Waterloo'</li>" +
              "<li>/(Waterloo|waterloo)/ -> <span translate>editor.regex.correct_for</span> 'Waterloo' , 'waterloo'</li>" +
              "<li>/[0-9]/ -> <span translate>editor.regex.correct_for</span> <span translate>editor.regex.any_integer</span></li>" +
              "<li>/(10|14|29)/ -> <span translate>editor.regex.correct_for</span> <span translate>editor.regex.numbers</span></li>" +
            "</ul>" +
          "</div>" +
        "</div>" +
        "</div>"+
        "<div class ='row collapse' >" +
        "<div class='small-2 columns' style='padding: 10px 0;'>" +
        "<label class='text-left' translate>editor.explanation</label>" +
        "</div>" +
        "<div class='small-7 left columns no-padding'>" +
        "<rich-textarea class='no-margin explain' type='text' name='explanation' placeholder={{'editor.explanation'|translate}} ng-model='answer.explanation' /></span>" +
        "</div>" +

        "</ng-form>"
    }

  }).directive('htmlMcq', function() {
    return {
      restrict: 'E',
      template: "<div class='small-12 no-padding columns'>" +
        "<delete_button class='right with-small-margin-top' size='small' mode='content_navigator' color='dark' action='removeAnswer($index, quiz)' />" +
        "<ng-form name='aform'>" +
        "<div class='row collapse'>" +
        "<div class='small-2 columns' style='padding: 10px 0;'>" +
        "<label class='text-left' translate>editor.answer</label>" +
        "</div>" +
        "<div class='small-7 columns left no-padding'>" +
        "<div><rich-textarea class='no-margin' required name='answer' placeholder={{'editor.answer'|translate}} ng-model='answer[columna]' /></div>" + //|| (submitted && aform.$error.atleastone)
        "<small class='error with-tiny-margin-bottom' ng-show='submitted && aform.answer.$error.required' ><span translate>error_message.required</span>!</small>" +
        "</div>" +
        "<div class='small-2 columns' ng-if='!isSurvey()'>" +
        "<label><span translate>editor.correct</span></label>" +
        "<input class='valign-middle' ng-change='updateValues()' type='checkbox' name='mcq' ng-model='answer.correct' ng-checked='answer.correct' />" + //atleastone
        "</div>" +
        "</div>" +
        "<div class ='row collapse' ng-if='!isSurvey()'>" +
        "<div class='small-2 columns' style='padding: 10px 0;'>" +
        "<label class='text-left' translate>editor.explanation</label>" +
        "</div>" +
        "<div class='small-7 left columns no-padding'>" +
        "<rich-textarea class='no-margin' class='explain'  name='explanation' placeholder={{'editor.explanation'|translate}} ng-model='answer.explanation'/></span>" +
        "</div>" +
        "</div>" +
        "</ng-form>" +
        "</div>" +
        "<hr style='margin: 0;'/>"
    }

  }).directive('htmlOcq', function() {
    return {
      restrict: 'E',
      template: "<div class='small-12 no-padding columns'>" +
        "<ng-form name='aform'>" +
        "<delete_button class='right with-small-margin-top' mode='content_navigator' size='small' color='dark' action='removeAnswer($index, quiz)' />" +
        "<div class='row collapse'>" +
        "<div class='small-2 columns' style='padding: 10px 0;'>" +
        "<label class='text-left' translate>editor.answer</label>" +
        "</div>" +
        "<div class='small-7 columns left no-padding'>" +
        "<div><rich-textarea class='no-margin' required name='answer' placeholder={{'editor.answer'|translate}} ng-model='answer[columna]'/></div>" + //|| (submitted && aform.$error.atleastone)
        "<small class='error with-tiny-margin-bottom' ng-show='submitted && aform.answer.$error.required' ><span translate>error_message.required</span>!</small>" +
        "</div>" +
        "<div class='small-2 columns' ng-if='!isSurvey()'>" +
        "<label><span translate>editor.correct</span></label>" +
        "<input class='valign-middle' id='radio_correct' type='radio' ng-model='answer.correct' ng-value=true ng-click='radioChange(answer)'/>" + //atleastone
        "</div>" +
        "</div>" +
        "<div class ='row collapse' ng-if='!isSurvey()'>" +
        "<div class='small-2 columns' style='padding: 10px 0;'>" +
        "<label class='text-left' translate>editor.explanation</label>" +
        "</div>" +
        "<div class='small-7 left columns no-padding'>" +
        "<rich-textarea class='no-margin' class='explain' name='explanation' placeholder={{'editor.explanation'|translate}} ng-model='answer.explanation' /></span>" +
        "</div>" +
        "</div>" +
        "</ng-form>" +
        "</div>" +
        "<hr style='margin: 10px 0;'/>",
      link: function(scope) {
        if (scope.answer.correct)
          scope.radioChange(scope.answer)
      }
    }
  }).directive('htmlDrag', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/views/teacher/course_editor/html_drag.html'
    }

  }).directive('atleastone', ['$log', function($log) {
    return {
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {

        scope.validate = function(value) {
          if (scope.values < 1) {
            $log.debug("errorrr");
            ctrl.$setValidity('atleastone', false);
          } else {
            ctrl.$setValidity('atleastone', true);
          }
        }

        scope.$watch('values', function() {
          scope.validate();
        });
      }
    };
  }]).directive('controlsTeacher', ['$window', '$timeout', function($window, $timeout) {
    return {
      restrict: "E",
      scope: {
        link: '&'
      },
      template: '<div class="linkDiv" tooltip="{{\'editor.tooltip.create_link_time\'|translate}}" pop-over="link_content" unique="false" highlight="true"></div>',
      link: function(scope, element) {
        scope.selectLink = function(event) {
          $timeout(function() {
            element.find('.video_link').select();
          });
        }
        scope.link_content = {
          content: "<b>Student link to time {{link().time| formattime:'hh:mm:ss'}} in this video</b><hr style='margin: 5px;'/><div style='word-break: break-all;'>{{link().url}}</div>",
          html: true,
          placement: 'left'
        }
      }
    };
  }])
