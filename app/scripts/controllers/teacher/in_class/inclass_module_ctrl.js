'use strict';

angular.module('scalearAngularApp')
  .controller('inclassModuleCtrl', ['$scope','$modal','$timeout','$window','$log','Module','$stateParams','scalear_utils','$translate','Timeline','Page','$interval','OnlineQuiz', function ($scope, $modal, $timeout,$window, $log, Module, $stateParams, scalear_utils,$translate, Timeline,Page, $interval,OnlineQuiz) {
    $window.scrollTo(0, 0);
    Page.setTitle('navigation.in_class')
    $scope.inclass_player={}
    $scope.inclass_player.events={} 
    
    $scope.time_parameters={
      quiz: 3,
      question: 2
    } 

    $scope.display = function () {
        resetVariables()
        openModal()
        changeButtonsSize()
        $scope.hide_text = $scope.button_names[3]
        $scope.setOriginalClass()
        $scope.setInclassShortcuts()
        screenfull.request();
        $scope.fullscreen = true;
        $scope.blurButtons();
        $scope.timer = $scope.review_question_count * $scope.time_parameters.question + $scope.review_quizzes_count * $scope.time_parameters.quiz + $scope.review_survey_count * $scope.time_parameters.question;
        $scope.counter =  $scope.timer>0? 1 : 0;
        $scope.counting = true;
        $scope.timerCountdown()

        angular.element($window).bind('resize',
          function(){
            changeButtonsSize()
            $timeout(function(){
              $scope.adjustTextSize()
              var video_width = angular.element('#inclass_video').height() * (16.0/9.0)
              $scope.quiz_layer= {
                  "width":video_width,
                  "margin-left": (angular.element('#inclass_video').width() - video_width)/2.0
              }
            })
            $scope.$apply()
          }
        )

        document.addEventListener(screenfull.raw.fullscreenchange, function () {
          if(!screenfull.isFullscreen){  
            $scope.fullscreen = false              
            $scope.exitBtn()
            $scope.$apply()
          }
        });
    };

    var resetVariables=function(){
      $scope.play_pause_class = "fi-play"
      $scope.mute_class = "fi-volume"
      $scope.loading_video=true
      $scope.lecture_url=""
      $scope.current_quiz = 0
      $scope.item_itr = 0
      $scope.timeline_itr= 0
      $scope.show_black_screen= false
      $scope.hide_questions = false  
      $scope.dark_buttons="dark_button" 
      $scope.fullscreen = false 
      $scope.selected_item=null
      $scope.selected_timeline_item=null
      $scope.quality_set ='color-blue'
      $scope.counting = true;
      $scope.counting_finished=false
    }

    var init = function(){
      $scope.timeline = {}
      Module.getModuleInclass(
        {
          course_id: $stateParams.course_id,
          module_id: $stateParams.module_id
        },
        function(data){
          $log.debug(data)
          $scope.module = angular.copy($scope.course.selected_module)
          angular.extend($scope, data)
          $scope.timeline['lecture'] = {}
          for(var lec_id in $scope.lectures){
            $scope.timeline['lecture'][lec_id] = {all: new Timeline(), filtered: new Timeline()}
            for(var type in $scope.lectures[lec_id]){
              for(var it in $scope.lectures[lec_id][type]){
                $scope.timeline['lecture'][lec_id]['all'].add($scope.lectures[lec_id][type][it][0], type, $scope.lectures[lec_id][type][it][1]|| {})  
              }
            }
            $scope.timeline['lecture'][lec_id]['filtered'].items = $scope.timeline['lecture'][lec_id]['all'].filterByNotType('markers')
          }          
          console.log("timeline for inclass", $scope.timeline)
          getSurveyCharts()
        },  
        function(){}
      )
    }

    var getSurveyCharts = function(){
      Module.getSurveyChartsInclass(
        {             
          course_id: $stateParams.course_id,
          module_id:$stateParams.module_id
        },
        function(data){
          $log.debug(data)
          $scope.quizzes=angular.extend({}, data.surveys, $scope.quizzes)
          $scope.review_survey_count = data.review_survey_count
          $scope.timeline["survey"]={}
          for(var survey_id in $scope.quizzes){
            $scope.timeline["survey"][survey_id]={'filtered':new Timeline()}
            for(var q_idx in $scope.quizzes[survey_id].questions){
              var q_id = $scope.quizzes[survey_id].questions[q_idx].id
              var type = $scope.quizzes[survey_id].questions[q_idx].type == "Free Text Question"? $scope.quizzes[survey_id].questions[q_idx].type : 'charts'
              $scope.timeline['survey'][survey_id]['filtered'].add(0, type, $scope.quizzes[survey_id].answers[q_id])
            }
          }

          adjustModuleItems()
          
          if($scope.review_question_count || $scope.review_quizzes_count || $scope.review_survey_count)
            $scope.inclass_ready = true
          $log.debug($scope.timeline)
        },
        function(){}
      )
    }

    var adjustModuleItems=function(){
      var lec_id = scalear_utils.getKeys($scope.lectures)
      var survey_id = scalear_utils.getKeys($scope.quizzes)
      for(var i=0; i<$scope.module.items.length; i++){
        if ($scope.module.items[i].class_name == 'lecture'){          
          if(lec_id.indexOf($scope.module.items[i].id.toString()) == -1){  
            $scope.module.items.splice(i,1)
            i-=1
          }
        }
        else{
          if(survey_id.indexOf($scope.module.items[i].id.toString()) == -1){
            $scope.module.items.splice(i,1)
            i-=1
          }
        }
      }
    }


    var openModal=function(){
      angular.element("body").css("overflow","hidden");
      angular.element("#main").css("overflow","hidden");
      angular.element("html").css("overflow","hidden");
      var win = angular.element($window)
      win.scrollTop("0px")       
      
      $scope.modalInstance = $modal.open({
        templateUrl: '/views/teacher/in_class/inclass_display.html',
        windowClass: 'whiteboard display',
        controller: 'inclassDisplayCtrl',
        scope: $scope
      });

      $scope.modalInstance.result.then(
        function(){},
        function(){
          cleanUp()
      });

      $scope.unregister_back_event = $scope.$on("$locationChangeStart", function(event) {
        event.preventDefault()
        cleanUp()
        $scope.$apply()
      });

      $scope.unregister_state_event = $scope.$on("$stateChangeStart", function() {
        cleanUp()
        $scope.$apply()
      });
    }

    $scope.exitBtn = function(){
      exitInclassSession()
      screenfull.exit()
      $scope.modalInstance.dismiss('cancel');
      cleanUp()
      $scope.timer_interval = null;
    };

    var cleanUp=function(){
      angular.element("body").css("overflow","");
      angular.element("#main").css("overflow","");
      angular.element("html").css("overflow","");
      $scope.unregister_back_event();
      $scope.unregister_state_event();
      $scope.removeShortcuts()
      resetVariables()
      $interval.cancel($scope.timer_interval);
    }

    $scope.playBtn = function(){
      if($scope.play_pause_class == "fi-play"){
        $scope.inclass_player.controls.play()
        $scope.play_pause_class = "fi-pause"
      }
      else{
        $scope.inclass_player.controls.pause()
      }
      $scope.blurButtons()
    }

    $scope.muteBtn= function(){
      if($scope.mute_class == "fi-volume-strike"){
        $scope.mute_class = "fi-volume"
        $scope.inclass_player.controls.unmute()
        $scope.inclass_player.controls.volume(1)
      }
      else{
        $scope.mute_class = "fi-volume-strike"
        $scope.inclass_player.controls.mute()
      }
      $scope.blurButtons()
    }

    $scope.qualityBtn= function(){
      if(!$scope.quality_set){
        $scope.inclass_player.controls.changeQuality('hd720')
        $scope.quality_set='color-blue'
      }
      else{
        $scope.inclass_player.controls.changeQuality('large')
        $scope.quality_set=null

      }
      $scope.blurButtons()
    }

    $scope.seek=function(time){
      if($scope.selected_item.url){
        if($scope.lecture_url.indexOf($scope.selected_item.url) == -1){
          if($scope.inclass_player.controls.isYoutube($scope.selected_item.url))
            $scope.inclass_player.controls.setStartTime(time)
          $scope.lecture_url= $scope.selected_item.url
          if($scope.inclass_player.controls.isMP4($scope.selected_item.url)){
            $timeout(function(){
              $scope.inclass_player.controls.seek(time)
            })
          }
         
        }
        else{
          $scope.inclass_player.controls.seek(time)
        }
      }
    }

    $scope.skip=function(skip_time){
      if(skip_time){
        var seek_to_time = $scope.inclass_player.controls.getTime()+skip_time
        var duration = $scope.inclass_player.controls.getDuration()
        if(seek_to_time < 0)
          seek_to_time = 0
        else if(seek_to_time >duration)
          seek_to_time = duration
        $scope.seek(seek_to_time)
      }
      $scope.blurButtons()
    }

    $scope.inclass_player.events.onPlay=function(){
       $scope.play_pause_class = "fi-pause"
    }

    $scope.inclass_player.events.onPause=function(){
       $scope.play_pause_class = "fi-play"
    }

    $scope.inclass_player.events.onReady=function(){
      $scope.loading_video=false
      if($scope.should_mute == true){
        $scope.muteBtn()
      }
      if(!$scope.timer_interval){
        $scope.timer_interval = $interval($scope.timerCountdown,1000);
      }
    }

    $scope.inclass_player.events.onMeta=function(){
      $scope.play_pause_class = "fi-play"
      $scope.loading_video=false
    }
    $scope.inclass_player.events.seeked=function(){
        $scope.inclass_player.controls.pause()
    }

    var setupInclassQuiz=function(sub_items){
      var quiz_index
      for(var item_index = 0; item_index < sub_items.length; item_index++){
        var current_item = sub_items[item_index]
        current_item.data.background = "lightgrey"
        current_item.data.color = "black"
        if(current_item.type=='inclass'){
          current_item.data.inclass_title ='Self'
          current_item.data.background = "#008CBA"
          current_item.data.color = "white"
          
          var start_item = {time:current_item.data.start_time, type:'marker', data: {time: current_item.data.start_time}}
          var end_item = {time:current_item.data.end_time, type:'marker', data: {time: current_item.data.end_time}}
          sub_items.splice(0, 0, start_item);
          item_index++
          sub_items.splice(sub_items.length, 0, end_item);

          var group_quiz = angular.copy(current_item)
          group_quiz.data.inclass_title ='Group'
          group_quiz.data.background = "#43AC6A"
          quiz_index = ++item_index
          sub_items.splice(quiz_index, 0, group_quiz);
          continue;
        }
        if(quiz_index == item_index-1){
          current_item.data.inclass_title ='Discussion'
        }
        if(item_index>quiz_index){
          current_item.data.background = "darkorange"
          current_item.data.color = "white"
        }
      }
      sub_items[0].data.inclass_title = "Intro"
      sub_items[0].data.background = "lightgrey"
      sub_items[0].data.color = "black"
      console.log("done", sub_items)
      return sub_items
    }

    var getSubItems=function(timeline, item){
      var start_time, end_time, filtered_timeline_items
      if(item.type=="charts" || item.type=="quiz"){
        start_time = item.data.start_time 
        end_time = item.data.end_time
      }
      else{
        start_time = (item.time-15 < $scope.selected_item.start_time)? $scope.selected_item.start_time: item.time-15
        end_time = (item.time+15 > $scope.selected_item.end_time)? $scope.selected_item.end_time: item.time+15
      }
      console.log("getSubItems item start end",item, start_time, end_time )
      return timeline.getItemsBetweenTime(start_time, end_time)    
    }

    var setupSubItems=function(sub_items){
       for(var item_index = 0; item_index < sub_items.length; item_index++){
        var current_item = sub_items[item_index]
        current_item.data.background = "lightgrey"
        current_item.data.color = "black"
        if(current_item.type!="markers")
          sub_items[item_index].data.inclass_title = current_item.type=="charts"? "Quiz" : "Question"
      }
      console.log("after setup SubItems",sub_items)
      return sub_items
    }

    var goToSubItem=function(item){
      $scope.selected_timeline_sub_item = item
      $scope.seek(item.time)
    }

    $scope.nextSubItem=function(){
      if($scope.isBlackScreenOn()){
        $scope.hideBlackScreen()
      }
      if($scope.selected_item.class_name == 'lecture'){
        var next_index = $scope.selected_timeline_item.sub_items.indexOf($scope.selected_timeline_sub_item) + 1
        if(next_index < $scope.selected_timeline_item.sub_items.length){
          goToSubItem($scope.selected_timeline_item.sub_items[next_index])
          return
        }
      }
      $scope.nextItem()
    }

    $scope.prevSubItem=function(){
      if($scope.isBlackScreenOn()){
        $scope.hideBlackScreen()
      }
      if($scope.selected_item.class_name == 'lecture'){
        var prev_index = $scope.selected_timeline_item.sub_items.indexOf($scope.selected_timeline_sub_item) - 1
        if(prev_index >= 0){
          goToSubItem($scope.selected_timeline_item.sub_items[prev_index])
          return
        }
      }
      $scope.prevItem()
    }

    $scope.nextItem = function(){      
      if($scope.item_itr < 0 ){
        $scope.item_itr = 0
        $scope.timeline_itr+=1
      }
      console.log("next items", $scope.timeline_itr)
      if($scope.item_itr >= 0 && $scope.item_itr < $scope.module.items.length){
        $scope.selected_item = $scope.module.items[$scope.item_itr]
        var type = $scope.selected_item.class_name == 'quiz'? $scope.selected_item.quiz_type : $scope.selected_item.class_name
        if($scope.timeline[type] && $scope.timeline[type][$scope.selected_item.id]){
          $scope.timeline_itr+=1
          if($scope.timeline_itr > 0 && $scope.timeline_itr < $scope.timeline[type][$scope.selected_item.id]['filtered'].items.length){
            var current_timeline_item = $scope.timeline[type][$scope.selected_item.id]['filtered'].items[$scope.timeline_itr]
            if(current_timeline_item != $scope.selected_timeline_item){
              $scope.selected_timeline_item = angular.copy(current_timeline_item)
              if(type == 'lecture'){
                $scope.selected_timeline_item.sub_items = getSubItems($scope.timeline[type][$scope.selected_item.id]['all'], current_timeline_item)
                console.log("returned subitems", $scope.selected_timeline_item.sub_items)
                var current_timeline_index
                if($scope.selected_timeline_item.type == 'inclass'){
                  current_timeline_index = 0
                  $scope.selected_timeline_item.sub_items = setupInclassQuiz($scope.selected_timeline_item.sub_items)
                }
                else{
                  current_timeline_index = $scope.selected_timeline_item.sub_items.indexOf(current_timeline_item)
                  $scope.selected_timeline_item.sub_items = setupSubItems($scope.selected_timeline_item.sub_items)
                }
                goToSubItem($scope.selected_timeline_item.sub_items[current_timeline_index])                      
              }
            }
          }
          else{
            $scope.item_itr+=1
            $scope.timeline_itr = $scope.item_itr<$scope.module.items.length? 0 : $scope.timeline_itr
            $scope.nextItem()
          }
        }
      }
      else{
        $scope.item_itr = $scope.module.items.length
        $scope.showBlackScreen('inclass.blackscreen_done')
      }

      $timeout(function(){
        $scope.adjustTextSize()
      })
      $scope.blurButtons()
    }

    $scope.prevItem = function(){
      if($scope.item_itr >= $scope.module.items.length)
        $scope.item_itr=$scope.module.items.length - 1
      console.log("prevItem", $scope.timeline_itr)
      if($scope.item_itr >= 0){
        $scope.selected_item = $scope.module.items[$scope.item_itr]
        var type = $scope.selected_item.class_name == 'quiz'? $scope.selected_item.quiz_type : $scope.selected_item.class_name
        if($scope.timeline[type] && $scope.timeline[type][$scope.selected_item.id]){
          $scope.timeline_itr-=1 
          if($scope.timeline_itr > 0){
            var current_timeline_item = $scope.timeline[type][$scope.selected_item.id]['filtered'].items[$scope.timeline_itr]
            if(current_timeline_item != $scope.selected_timeline_item){
              $scope.selected_timeline_item = angular.copy(current_timeline_item)
              if(type == 'lecture'){
                $scope.selected_timeline_item.sub_items = getSubItems($scope.timeline[type][$scope.selected_item.id]['all'], current_timeline_item)
                console.log("returned subitems", $scope.selected_timeline_item.sub_items)
                var current_timeline_index
                if($scope.selected_timeline_item.type == 'inclass'){
                  current_timeline_index = 0
                  $scope.selected_timeline_item.sub_items = setupInclassQuiz($scope.selected_timeline_item.sub_items)
                }
                else{
                  current_timeline_index = $scope.selected_timeline_item.sub_items.indexOf(current_timeline_item)
                  $scope.selected_timeline_item.sub_items = setupSubItems($scope.selected_timeline_item.sub_items)
                }
                goToSubItem($scope.selected_timeline_item.sub_items[current_timeline_index])                      
              }
            }
          }
          else{
            $scope.item_itr-=1
            if($scope.module.items[$scope.item_itr])
              $scope.selected_item = $scope.module.items[$scope.item_itr]
            var type = $scope.selected_item.class_name == 'quiz'? $scope.selected_item.quiz_type : $scope.selected_item.class_name
            $scope.timeline_itr= $scope.item_itr < 0? 0 : $scope.timeline[type][$scope.selected_item.id]['filtered'].items.length
            $scope.prevItem()
          }
        }
      }
      $timeout(function(){
        $scope.adjustTextSize()
      })
      $scope.blurButtons()
    }

    $scope.createChart = function(data, options, formatter) {
      var chart = {
        type: "ColumnChart",
        options :{
            "colors": ['green', 'gray'],
            "isStacked": "true",
            "fill": 25,
            "height": 180,
            "backgroundColor": 'beige',
            "displayExactValues": true,
            "legend": {"position": 'none'},
            "fontSize": 12,
            "chartArea":{width:'82%'},
            "tooltip": {"isHtml": true},
            "vAxis": {
                "ticks": [25,50,75,100],
                "maxValue": 100,
                "viewWindowMode":'maximized',
                "textPosition": 'none' 
            }
        }, 
        data:  $scope[formatter](data)
      };
      angular.extend(chart.options,options)
      return chart
  }


   $scope.formatLectureChartData = function(data) {
    var formated_data = {}
    formated_data.cols =
        [
          {
            "label": $translate('global.students'),
            "type": "string"
        }, 
        {
            "label": $translate('lectures.correct'),
            "type": "number"
        }, 
         {
          "type":"string",
          "p":{
            "role":"tooltip", 
            "html": true
          }
        },
        {
            "label": $translate('lectures.incorrect'),
            "type": "number"
        }, 
        {
          "type":"string",
          "p":{
            "role":"tooltip", 
            "html": true
          }
        }
      ]
    formated_data.rows = []
    for (var ind in data) {
        var text, correct, incorrect, tooltip_text
        tooltip_text = "<div style='padding:8px'><b>"+data[ind][2]+"</b><br>"
        if (data[ind][1] == "gray") {
            correct = 0
            incorrect = Math.floor((data[ind][0]/$scope.students_count)*100)
            if(!isSurvey())
              tooltip_text +="Incorrect: "
        } else {                
            correct = Math.floor((data[ind][0]/$scope.students_count)*100)
            incorrect = 0
            if(!isSurvey())
              tooltip_text +="Correct: "
        }
        text = data[ind][2]
        $log.debug(text)
        tooltip_text +=data[ind][0]+"</div>" //+" answers "+"("+ Math.floor((data[ind][0]/$scope.students_count)*100 ) +"%)</div>"
        var row = {
            "c": [
              {"v": text}, 
              {"v": correct}, 
              {"v": tooltip_text},
              {"v": incorrect}, 
              {"v": tooltip_text}
            ]
        }
        formated_data.rows.push(row)
    }
    return formated_data
  }

  $scope.formatSurveyChartData = function(data){
    var formated_data ={}
    formated_data.cols=
        [
            {"label": $translate('global.students'),"type": "string"},
            {"label": $translate('progress.chart.answered'),"type": "number"}
        ]
    formated_data.rows= []
    for(var ind in data)
    {
      var row=
      {"c":
          [
            {"v": data[ind][1]},
            {"v": data[ind][0]}
          ]
      }
      formated_data.rows.push(row)
    }
    return formated_data
  }

  $scope.setInclassShortcuts=function(){
    $scope.removeShortcuts()

    shortcut.add("Right",function() {
       $scope.nextSubItem()
       $scope.$apply()
    },{"disable_in_input" : false, 'propagate':false});

    shortcut.add("Page_down",function() {
      $scope.nextSubItem()
       $scope.$apply()
    },{"disable_in_input" : false, 'propagate':false});

    shortcut.add("Left",function() {
       $scope.prevSubItem()
       $scope.$apply()
    },{"disable_in_input" : false, 'propagate':false});

    shortcut.add("Page_up",function() {       
       $scope.prevSubItem()
       $scope.$apply()
    },{"disable_in_input" : false, 'propagate':false});
    
    shortcut.add("Up",function() {       
       $scope.prevItem()
       $scope.$apply()
    },{"disable_in_input" : false, 'propagate':false});

    shortcut.add("Down",function() {
      $scope.nextItem()
       $scope.$apply()
    },{"disable_in_input" : false, 'propagate':false});

    shortcut.add("z",function() {
      if($scope.video_class=='original_video')
        $scope.setZoomClass()
      else
        $scope.setOriginalClass()
       $scope.$apply()
    },{"disable_in_input" : false, 'propagate':false});

    shortcut.add("b",function() {
       $scope.toggleBlackScreen('inclass.blackscreen_close')
       $scope.$apply()
    },{"disable_in_input" : false, 'propagate':false});

    shortcut.add("h",function() {
       $scope.toggleHideQuestions()
       $scope.$apply()
    },{"disable_in_input" : false, 'propagate':false});

    shortcut.add("Space",function() {
       $scope.playBtn()
       $scope.$apply()
    },{"disable_in_input" : false, 'propagate':false});

     shortcut.add("m",function() {
       $scope.muteBtn()
       $scope.$apply()
    },{"disable_in_input" : false, 'propagate':false});
  }

  $scope.removeShortcuts=function(){
    shortcut.remove("Page_up")
    shortcut.remove("Page_down")
    shortcut.remove("Right")
    shortcut.remove("Left")
    shortcut.remove("b")
    shortcut.remove("z")
    shortcut.remove("h")
    shortcut.remove("Space")
    shortcut.remove("m")
  }

  $scope.toggleBlackScreen=function(msg){
    $scope.show_black_screen = !$scope.show_black_screen
    $scope.blackscreen_msg = msg
  }
   $scope.showBlackScreen=function(msg){
    $scope.show_black_screen = true
    $scope.blackscreen_msg = msg
  }
   $scope.hideBlackScreen=function(){
    $scope.show_black_screen = false
    $scope.blackscreen_msg = ""    
  }

  $scope.isBlackScreenOn=function(){
    return $scope.show_black_screen
  }

  $scope.setOriginalClass=function(){
    $scope.video_class = 'original_video'
    $scope.question_class = 'original_question'
    $scope.chart_class = 'original_chart'
    $scope.student_question_class = 'original_student_question'
    $scope.question_block = 'question_block'
    showQuestions()
    $scope.blurButtons()
  }

  $scope.toggleHideQuestions=function(){
    $scope.hide_questions = !$scope.hide_questions
    $scope.hide_text = $scope.hide_questions? $scope.button_names[4] : $scope.button_names[3]
    if($scope.question_class == 'original_question')
      $scope.video_class = $scope.hide_questions?'zoom_video' : 'original_video'
    $scope.blurButtons()
    $timeout(function(){
      $scope.adjustTextSize()
    })
  }

  var showQuestions = function(){
    $scope.hide_questions = false
    $scope.hide_text =  $scope.button_names[3]
  }

  var changeButtonsSize=function(){
    var win = angular.element($window)
    var win_width= win.width()
    if(win_width < 660 ){
      $scope.button_names=['Ex', 'Ov', 'Sh','H','U','', 'P', 'R']
      if(win_width <510)
        $scope.button_class = 'smallest_font_button' 
      else
        $scope.button_class = 'small_font_button' 
    }
    else{
      $scope.button_class = 'big_font_button' 
      $scope.button_names=[$translate('inclass.exit'), '', '',$translate('inclass.hide'), $translate('inclass.show'), '5sec', $translate('inclass.pause'), $translate('inclass.resume')]
    }
    $scope.hide_text = $scope.hide_questions? $scope.button_names[4] : $scope.button_names[3]
  }

  $scope.adjustTextSize=function(){
    var question_block = angular.element('.question_block').not('.ng-hide');
    var chars = question_block.text().trim().length;
    var space = question_block.height() * question_block.width();
    $scope.fontsize = Math.min(Math.sqrt(space/chars), 30)+'px';
    if($scope.chart)
      $scope.chart.options.height=question_block.height() - 5
  }

  $scope.lightUpButtons=function(){
    $scope.last_movement_time= new Date()
    $scope.dark_buttons =null
    $interval(function(){
      if((new Date()) - $scope.last_movement_time  >=5000){
        $scope.dark_buttons="dark_button"
      }
        
    },5000,1)
  }

  $scope.blurButtons=function(){
    angular.element('.button').blur()
  }

  var isSurvey=function(){
    return $scope.selected_timeline_item.data.type == 'Survey'
  }

  
  $scope.timerCountdown = function(){  
      if($scope.counter == 0){
        if($scope.timer == 0){
          $scope.counting_finished = true;
          $scope.togglePause();
        }
        else{
          $scope.timer--;
          $scope.counter = 59;
        }
      }
      else if(!$scope.counting_finished)
        $scope.counter--;

      $scope.sec_counter = $scope.counter < 10? '0'+$scope.counter: $scope.counter;
      $scope.min_counter = $scope.timer < 10? '0'+$scope.timer: $scope.timer;
  }
  
  $scope.togglePause = function(){
      if($scope.counting){
        $interval.cancel($scope.timer_interval);
        $scope.counting = false;
      }
      else{
        $scope.timer_interval = $interval($scope.timerCountdown,1000);
        $scope.counting = true;
      }
  }

  var updateInclassSession=function(quiz_id, status){
    console.log("status update!",status)
    OnlineQuiz.updateInclassSession(
      {online_quizzes_id: quiz_id},
      {status: status || 0},
      function(){})
  }

  var exitInclassSession=function(){
    Module.updateAllInclassSessions(
      { course_id: $stateParams.course_id,
        module_id: $stateParams.module_id 
      },
      {}
    )
  }

  init();

  }]);
