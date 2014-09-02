'use strict';

angular.module('scalearAngularApp')
  .controller('inclassModuleCtrl', ['$scope','$rootScope','$modal','$timeout','$window','$log','Module','$stateParams','scalear_utils','$translate','Timeline','Page','$interval', function ($scope, $rootScope, $modal, $timeout,$window, $log, Module, $stateParams, scalear_utils,$translate, Timeline,Page, $interval) {
    $window.scrollTo(0, 0);
    Page.setTitle('head.in_class')
    $scope.inclass_player={}
    $scope.inclass_player.events={}   
    // $scope.fullscreen_user_settings = false
    // $scope.initial_display_done = false
    $scope.time_parameters={
      quiz: 3,
      question: 2
    } 

  	$scope.display = function (disabled) {
      if(!disabled){
        resetVariables()
        if($scope.current_quiz_lecture)
          delete $scope.current_quiz_lecture
        if($scope.chart_data)
          delete $scope.chart_data

        openModal()
        changeButtonsSize()
        $scope.hide_text = $scope.button_names[3]
        $scope.setOriginalClass()
        $scope.setQuizShortcuts()
        screenfull.request();
        $scope.fullscreen = true;
        $scope.blurButtons();

        $scope.timer = $scope.review_question_count * $scope.time_parameters.question + $scope.review_quizzes_count * $scope.time_parameters.quiz;
        if ($scope.timer != 0) {
          $scope.timer -= 1;
          $scope.counter = 59;
        }
        if($scope.timer <= 0){
          $scope.counter = 0;
          $scope.timer = 0;
        }
        $scope.min_counter = $scope.timer;
        $scope.timer_interval = $interval($scope.onTimeout,1000);
        $scope.counting = true;

        angular.element($window).bind('resize',
          function(){
            changeButtonsSize()
            $timeout(function(){
              $scope.adjustTextSize()
            })
            $scope.$apply()
        })

        document.addEventListener(screenfull.raw.fullscreenchange, function () {
            if(!screenfull.isFullscreen){  
                $scope.fullscreen = false              
                $scope.exitBtn()
                $scope.$apply()
            }
        });

      }  

  	};

    // $scope.initialDisplay = function(disabled,fullscreen){
    //    $scope.fullscreen_user_settings  = fullscreen
    //    $scope.initial_display_done = true
    //    $scope.inclass_setting = false
    //    $scope.display(disabled,fullscreen)
    // }

    // $scope.showInitialDisplay=function(){
    //    if($scope.initial_display_done){
    //      $scope.display(!$scope.inclass_ready,$scope.fullscreen_user_settings)
    //   }
    //   else
    //     $scope.inclass_setting=!$scope.inclass_setting
    // }

    var resetVariables=function(){
        $scope.play_pause_class = "fi-play"
        $scope.mute_class = "fi-volume"
        $scope.loading_video=true
        $scope.lecture_url=""
        // $scope.question_title=""
        // $scope.quiz_id=""
        // $scope.questions=[]
        // $scope.lecture_list = []
        // $scope.display_data = {}
        // $scope.total_num_lectures = 0
        // $scope.total_num_quizzes  = 0
        // $scope.current_lecture = 0
        $scope.current_quiz = 0
        $scope.item_itr = 0
        $scope.timeline_itr= 0
        $scope.show_black_screen= false
        $scope.hide_questions = false  
        $scope.dark_buttons="dark_button" 
        $scope.fullscreen = false 
        $scope.selected_item=null
        $scope.selected_timeline_item=null
        $scope.quality_set ='blue_font'
    }

    var init = function(){
      $scope.timeline = {}
      Module.getModuleInclass(
        {
          course_id: $stateParams.course_id,
          module_id: $stateParams.module_id
        },
        function(data){
          console.log(data)
          angular.extend($scope, data)
          $scope.timeline['lecture'] = {}
          for(var lec_id in $scope.lectures){
            $scope.timeline['lecture'][lec_id] = new Timeline()
            for(var type in $scope.lectures[lec_id]){
             // if(type== "question" || type == "charts")
                for(var it in $scope.lectures[lec_id][type] ){
                  $scope.timeline['lecture'][lec_id].add($scope.lectures[lec_id][type][it][0], type, $scope.lectures[lec_id][type][it][1])  
                }
            }           
          }
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
          console.log(data)
          $scope.quizzes=angular.extend({}, data.surveys, $scope.quizzes)
          $scope.timeline["survey"]={}
          for (var survey_id in $scope.quizzes ){
            $scope.timeline["survey"][survey_id]=new Timeline()
            for(var q_idx in $scope.quizzes[survey_id].questions){
              var q_id = $scope.quizzes[survey_id].questions[q_idx].id
              var type = $scope.quizzes[survey_id].questions[q_idx].type == "Free Text Question"? $scope.quizzes[survey_id].questions[q_idx].type : 'charts'
              $scope.timeline['survey'][survey_id].add(0, type, $scope.quizzes[survey_id].answers[q_id])
            }
          }

          adjustModuleItems()
          
          if($scope.review_question_count || $scope.review_quizzes_count)
            $scope.inclass_ready = true
          console.log($scope.timeline)
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
      $rootScope.changeError = true;
      angular.element("body").css("overflow","hidden");
      angular.element("#main").css("overflow","hidden");
      angular.element("html").css("overflow","hidden");
      var win = angular.element($window)
      win.scrollTop("0px")
      // var filename='inclass_display'+view
      // if(view == "review")
      //    filename+= "_"+type.toLowerCase()       
      
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
        //$scope.exitBtn()
      });

      $scope.unregister_back_event = $scope.$on("$locationChangeStart", function(event, next, current) {
          event.preventDefault()
         cleanUp()
      });

      $scope.unregister_state_event = $scope.$on("$stateChangeStart", function(event, next, current) {
              cleanUp()
              $scope.$apply()
        });
    }

    // $scope.review=function(type, disabled){
    //   if(!disabled){
    //     openModal('review', type)
    //   }
    // }

    // $scope.survey=function(disabled, state){
    //   if(!disabled){
    //     $scope.in_review= state
    //     openModal('review','Surveys')
    //   }
    // }

    $scope.exitBtn = function () {
      screenfull.exit()
      $scope.modalInstance.dismiss('cancel');
      cleanUp()
    };

    var cleanUp=function(){
      $rootScope.changeError = false;
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
      var time = $scope.inclass_player.controls.getTime()
      if(!$scope.quality_set){
        $scope.inclass_player.controls.changeQuality('hd720',time)
        $scope.quality_set='blue_font'
      }
      else{
        $scope.inclass_player.controls.changeQuality(null,time)
        $scope.quality_set=null

      }
      $scope.blurButtons()
    }

    $scope.seek=function(time,first){
      $log.debug("seeking")
      $scope.inclass_player.controls.seek(time)
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
    }

    $scope.inclass_player.events.onMeta=function(){
      $scope.play_pause_class = "fi-play"
      $scope.loading_video=false
    }
    $scope.inclass_player.events.seeked=function(){
        $scope.inclass_player.controls.pause()
    }


    $scope.nextQuiz = function(){      
      if($scope.module && $scope.module.items){
        if($scope.item_itr < $scope.module.items.length){
          if($scope.module.items[$scope.item_itr]){
            $scope.selected_item = $scope.module.items[$scope.item_itr]
            var type = $scope.selected_item.class_name == 'quiz'? $scope.selected_item.quiz_type : $scope.selected_item.class_name
            if($scope.timeline[type] && $scope.timeline[type][$scope.selected_item.id]){
              $scope.timeline_itr+=1 
              if($scope.timeline_itr!=0 && $scope.timeline_itr < $scope.timeline[type][$scope.selected_item.id].items.length){
                if($scope.timeline[type][$scope.selected_item.id].items[$scope.timeline_itr] != $scope.selected_timeline_item){
                  $scope.selected_timeline_item = $scope.timeline[type][$scope.selected_item.id].items[$scope.timeline_itr]
                  $scope.lecture_name = $scope.module.items[$scope.item_itr].name
                }
                else{
                  $scope.nextQuiz()
                  return
                }
                             
                if($scope.selected_item.url){
                  if($scope.lecture_url.indexOf($scope.selected_item.url) == -1){
                    if($scope.inclass_player.controls.isYoutube($scope.selected_item.url))
                      $scope.inclass_player.controls.setStartTime($scope.selected_timeline_item.time)
                    $scope.lecture_url= $scope.selected_item.url
                    if ($scope.inclass_player.controls.isMP4($scope.selected_item.url)){
                      $timeout(function(){
                        $scope.seek($scope.selected_timeline_item.time)
                      })
                    }
                  }
                  else{
                    $timeout(function(){
                      $scope.seek($scope.selected_timeline_item.time)
                    })
                  }
                }

                if(type == 'lecture' && $scope.selected_timeline_item.type == "charts")
                  $scope.chart = $scope.createChart($scope.selected_timeline_item.data.answers,{}, 'formatLectureChartData')

                if(type == 'survey')
                  $scope.timeline_itr=-1
              }
              else{
                $scope.item_itr+=1
                $scope.timeline_itr=0
                $scope.nextQuiz()
              }
            }
          }
          else{
            $scope.item_itr+=1
            $scope.timeline_itr=0
            $scope.nextQuiz()
          }
        }
        else{
          if($scope.selected_item.class_name == 'quiz')
            $scope.item_itr = $scope.module.items.length-1
          $scope.showBlackScreen('groups.blackscreen_done')
          $scope.item_itr+=1
        }
      }

      $timeout(function(){
        $scope.adjustTextSize()
      })
      $scope.blurButtons()
    }

    $scope.prevQuiz = function(){
      $scope.hideBlackScreen()      
      if($scope.module && $scope.module.items){
        if($scope.item_itr >= 0){
          if($scope.module.items[$scope.item_itr]){
            $scope.selected_item = $scope.module.items[$scope.item_itr]
            var type = $scope.selected_item.class_name == 'quiz'? $scope.selected_item.quiz_type : $scope.selected_item.class_name
            if($scope.timeline[type] && $scope.timeline[type][$scope.selected_item.id]){
              $scope.timeline_itr-=1 
              if($scope.timeline_itr > 0){

                if(type == 'survey'){
                  $scope.timeline_itr=-1
                }

                if($scope.timeline[type][$scope.selected_item.id].items[$scope.timeline_itr] != $scope.selected_timeline_item){
                  $scope.selected_timeline_item = $scope.timeline[type][$scope.selected_item.id].items[$scope.timeline_itr]
                  $scope.lecture_name = $scope.module.items[$scope.item_itr].name
                }
                else{             
                  $scope.prevQuiz()
                  return
                }
                             
                if($scope.selected_item.url){
                  if($scope.lecture_url.indexOf($scope.selected_item.url) == -1){
                    $scope.inclass_player.controls.setStartTime($scope.selected_timeline_item.time)
                    $scope.lecture_url= $scope.selected_item.url
                  }
                  else{
                    $timeout(function(){
                      $scope.seek($scope.selected_timeline_item.time)
                    })
                  }
                }

                if(type == 'lecture' && $scope.selected_timeline_item.type == "charts")
                  $scope.chart = $scope.createChart($scope.selected_timeline_item.data.answers,{}, 'formatLectureChartData')
              }
              else{
                $scope.item_itr-=1
                if($scope.module.items[$scope.item_itr])
                $scope.selected_item = $scope.module.items[$scope.item_itr]
                var type = $scope.selected_item.class_name == 'quiz'? $scope.selected_item.quiz_type : $scope.selected_item.class_name
                if($scope.item_itr < 0){
                  $scope.timeline_itr= 0
                }
                else
                  $scope.timeline_itr= $scope.timeline[type][$scope.selected_item.id].items.length

                $scope.prevQuiz()
              }
            }
          }
          else{
              $scope.item_itr-=1
              if($scope.module.items[$scope.item_itr])
                $scope.selected_item = $scope.module.items[$scope.item_itr]
              var type = $scope.selected_item.class_name == 'quiz'? $scope.selected_item.quiz_type : $scope.selected_item.class_name
              if($scope.item_itr < 0){
                $scope.timeline_itr= 0
              }
              else
                $scope.timeline_itr= $scope.timeline[type][$scope.selected_item.id].items.length

              $scope.prevQuiz()
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
            "label": $translate('courses.students'),
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
        tooltip_text = "<div style='padding:8px 0 0 5px'><b>"+data[ind][2]+"</b><br>"
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
        tooltip_text +=data[ind][0]+" answers "+"("+ Math.floor((data[ind][0]/$scope.students_count)*100 ) +"%)</div>"
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
            {"label": $translate('courses.students'),"type": "string"},
            {"label": $translate('controller_msg.answered'),"type": "number"},
        ]
    formated_data.rows= []
    for(var ind in data)
    {
      var row=
      {"c":
          [
            {"v": data[ind][1]},
            {"v": data[ind][0]},
          ]
      }
      formated_data.rows.push(row)
    }
    return formated_data
  }

  $scope.setQuizShortcuts=function(){
    $scope.removeShortcuts()
    shortcut.add("Page_up",function() {
       $scope.nextQuiz()
       $scope.$apply()
    },{"disable_in_input" : false, 'propagate':false});

    shortcut.add("Right",function() {
       $scope.nextQuiz()
       $scope.$apply()
    },{"disable_in_input" : false, 'propagate':false});

    shortcut.add("Page_down",function() {
       $scope.prevQuiz()
       $scope.$apply()
    },{"disable_in_input" : false, 'propagate':false});

    shortcut.add("Left",function() {
       $scope.prevQuiz()
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
       $scope.toggleBlackScreen('groups.blackscreen_close')
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
   $scope.hideBlackScreen=function(msg){
    $scope.show_black_screen = false    
  }

  $scope.setOriginalClass=function(){
    $scope.video_class = 'original_video'
    $scope.question_class = 'original_question'
    $scope.chart_class = 'original_chart'
    $scope.student_question_class = 'original_student_question'
    $scope.question_block = 'question_block'
    $scope.question_block_free_text = 'question_block_free_text'
    // $scope.question_block={
    //   'overflowY':'visible'
    // }
    showQuestions()
    $scope.blurButtons()
  }

  // $scope.setZoomClass=function(){
  //   $scope.video_class = 'zoom_video'
  //   $scope.question_class = 'zoom_question'
  //   $scope.chart_class = 'zoom_chart'
  //   $scope.student_question_class = 'zoom_question'
  //   $scope.question_block = 'zoom_question_block'
  //   // $scope.question_block={
  //   //   'overflowY':'visible'
  //   // }
  //   $scope.adjustTextSize()
  //   $scope.blurButtons()
  // }

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
      $scope.button_names=['Ex', 'Ov', 'Un','H','U','']
      if(win_width <510)
        $scope.button_class = 'smallest_font_button' 
      else
        $scope.button_class = 'small_font_button' 
    }
    else{
      $scope.button_class = 'big_font_button' 
      $scope.button_names=['Exit', '', '','Hide', 'Unhide', '5sec']
    }
    $scope.hide_text = $scope.hide_questions? $scope.button_names[4] : $scope.button_names[3]
  }

  $scope.adjustTextSize=function(){
    var question_block = angular.element('.question_block').not('.ng-hide');
    var chars = question_block.text().length;
    var space = question_block.height() * question_block.width();
    
    var lines_text = question_block.text().split('\n');
    var longest_line = lines_text.sort(function (a, b) { return b.length - a.length; })[0];
    
    var lines = 0
    if($scope.selected_timeline_item)
      lines = $scope.selected_timeline_item.data.length;
    
    // var OneLineSize = space/lines;

    var width_disc_font_size = (question_block.width()/(longest_line.length))*2.5 + 'px';
    
    $scope.discfontsize = (question_block.height()/(lines))/2 + 'px';
    
    if((question_block.width()/(longest_line.length))*2.5 < (question_block.height()/(lines))/2){
      $scope.discfontsize = width_disc_font_size;
    }


    // if(((question_block.height()/(lines))/2)>20){
    //   $scope.disclineheight = 1;     
    // }
    // else if(((question_block.height()/(lines))/2)>10 && ((question_block.height()/(lines))/2)<20){
    //   $scope.disclineheight = .5;     
    // }
    // else{
    //   $scope.disclineheight = .1;
    // }
    

    if((question_block.height()/(lines))/2 > 30){
      $scope.discfontsize = 30 + 'px';
    }
    $scope.disclineheight = (question_block.height()/(lines))/2 * 0.1
    if($scope.disclineheight > 1.2)
    {
      $scope.disclineheight = 1; 
    }
    else{
      $scope.disclineheight = 3 +'px';
    }

    console.log($scope.disclineheight);
  
    $scope.fontsize = Math.sqrt(space/chars)+'px';
    $scope.sub_fontsize =(((question_block.height()-10)*23)/100) -5 +'px';

    if(Math.sqrt(space/chars) > 30){
      $scope.fontsize = 30 +'px';
    }
    

    // console.log(question_block)
    // if(question_block.get(0).scrollHeight > question_block.height()){
    //   if(question_block.get(0).scrollHeight - question_block.height() >=10)
    //     $scope.question_class = 'smallest_question' 
    //   else
    //     $scope.question_class = 'small_question'         
    // }
    // else{
    //   if(question_block.height()>180 || question_block.height() == 0)
    //     $scope.question_class = $scope.hide_questions?'zoom_question' : 'original_question'
    //   else if(question_block.height()>150 && question_block.height()<180)
    //     $scope.question_class = 'small_question'
    //   else
    //     $scope.question_class = 'smallest_question'
    // }
    //$scope.student_question_class = $scope.question_class.split('_')[0]+'_student_'+$scope.question_class.split('_')[1]
    
    if($scope.chart)
      $scope.chart.options.height=question_block.height() - 10
  }

  $scope.lightUpButtons=function(){
    $scope.last_movement_time= new Date()
    $scope.dark_buttons =null
    $timeout(function(){
      if((new Date()) - $scope.last_movement_time  >=5000){
        $scope.dark_buttons="dark_button"
      }
        
    },5000)
  }

  // $scope.toggleFullscreen=function(){
  //   $scope.fullscreen = !$scope.fullscreen
  //   $scope.blurButtons()
  // }

  $scope.blurButtons=function(){
    angular.element('.button').blur()
  }

  var isSurvey=function(){
    return $scope.selected_timeline_item.data.type == 'Survey'
  }

  
  $scope.onTimeout = function(){  
      if($scope.counter == 0){
        if($scope.timer == 0){
          $scope.counting_finished = true;
          $scope.pause();
        }
        else{
          $scope.timer--;
          $scope.counter = 59;
        }

      }

      if(!$scope.counting_finished){
        $scope.counter--;
        $scope.sec_counter = $scope.counter;
        $scope.min_counter = $scope.timer;
      }

      if($scope.counter < 10){
        $scope.sec_counter = '0'+$scope.counter;
      }

      if($scope.timer < 10){
        $scope.min_counter = '0'+$scope.timer;
      }
  }
  
  $scope.togglePause = function(){
      if($scope.counting){
        $interval.cancel($scope.timer_interval);
        $scope.counting = false;
      }
      else{
        $scope.timer_interval = $interval($scope.onTimeout,1000);
        $scope.counting = true;
      }
  }

  init();

  }]);
