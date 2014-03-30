'use strict';

angular.module('scalearAngularApp')
  .controller('inclassModuleCtrl', ['$scope','$rootScope','$modal','$timeout','$window','$log','Module','$stateParams','util','$translate','Timeline', function ($scope, $rootScope, $modal, $timeout,$window, $log, Module, $stateParams, util,$translate, Timeline) {
    $window.scrollTo(0, 0);
    $scope.inclass_player={}
    $scope.inclass_player.events={}    

  	$scope.display = function (type, disabled) {
      if(!disabled){
        $scope.play_pause_class = "icon-play"
        $scope.mute_class = "icon-volume-up"
        $scope.loading_video=true
        $scope.lecture_url=""
        $scope.question_title=""
        $scope.quiz_id=""
        $scope.questions=[]
        $scope.lecture_list = []
        $scope.display_data = {}
        $scope.total_num_lectures = 0
        $scope.total_num_quizzes  = 0
        $scope.current_lecture = 0
        $scope.current_quiz = 0
        $scope.item_itr = 0
        $scope.timeline_itr= 0
        $scope.show_black_screen= false
        $scope.hide_questions = false  
        $scope.dark_buttons="dark_button" 
        $scope.fullscreen = false  
        if($scope.current_quiz_lecture)
          delete $scope.current_quiz_lecture
        if($scope.chart_data)
          delete $scope.chart_data

        openModal('display', type)
        // setup_screens()
        changeButtonsSize()
        $scope.hide_text = $scope.button_names[3]
        $scope.setOriginalClass()
        // var unwatch = $scope.$watch('inclass_player',function(){
        //   console.log("changinf")
        //   if($scope.inclass_player.controls){
        //     console.log("ocol")
            
        //     unwatch()
        //   }
        // })
        angular.element($window).bind('resize',
          function(){
            // setup_screens()
            changeButtonsSize()
             $timeout(function(){
              $scope.adjustTextSize()
            })
            $scope.$apply()
        })
      }  

  	};

    var init = function(){
        // Module.getInclassActive(
        //   {module_id:$stateParams.module_id, course_id:$stateParams.course_id},
        //   function(data){
        //         $scope.buttons = data
        //           },
        //   function(){}
        // );
      $scope.timeline = {}//new Timeline()
      Module.getModuleInclass(
        {
          course_id: $stateParams.course_id,
          module_id: $stateParams.module_id
        },
        function(data){
          angular.extend($scope, data)
          console.log(data)
          // $scope.url = $scope.first_lecture
          $scope.timeline['lecture'] = {}
          for(var lec_id in $scope.lectures){
            $scope.timeline['lecture'][lec_id] = new Timeline()
            for(var type in $scope.lectures[lec_id]){
              if(type== "question" || type == "charts")
                for(var it in $scope.lectures[lec_id][type] ){
                  $scope.timeline['lecture'][lec_id].add($scope.lectures[lec_id][type][it][0], type, $scope.lectures[lec_id][type][it][1])  
                }
            }           
          }
          $scope.inclass_ready = true
          //console.log($scope.timeline)
        },  
        function(){}
      )
    }


    var openModal=function(view, type){
      $rootScope.changeError = true;
      angular.element("body").css("overflow","hidden");
      angular.element("#main").css("overflow","hidden");
      angular.element("html").css("overflow","hidden");
      var win = angular.element($window)
      win.scrollTop("0px")
      var filename='inclass_'+view
      if(view == "review")
         filename+= "_"+type.toLowerCase()       
      
      $scope.modalInstance = $modal.open({
        templateUrl: '/views/teacher/in_class/'+filename+'.html',
        windowClass: 'whiteboard '+view,
        controller: view+type+'Ctrl',
        scope: $scope
      });

      $scope.modalInstance.result.then(
      function(){},
      function(){
        $scope.exitBtn()
      });

      $scope.unregister_back_event = $scope.$on("$locationChangeStart", function(event, next, current) {
          event.preventDefault()
          $scope.exitBtn() 
      });

      $scope.unregister_state_event = $scope.$on("$stateChangeStart", function(event, next, current) {
              $scope.exitBtn() 
              $scope.$apply()
        });
    }

    $scope.review=function(type, disabled){
      if(!disabled){
        openModal('review', type)
      }
    }

    $scope.survey=function(disabled, state){
      if(!disabled){
        $scope.in_review= state
        openModal('review','Surveys')
      }
    }

    $scope.exitBtn = function () {
      $rootScope.changeError = false;
      angular.element("body").css("overflow","auto");
      angular.element("#main").css("overflow","");
      angular.element("html").css("overflow","");
      $scope.modalInstance.dismiss();
      $scope.unregister_back_event();
      $scope.unregister_state_event();
      $scope.removeShortcuts()
      init()
    };

    $scope.playBtn = function(){
      if($scope.play_pause_class == "icon-play"){
        $scope.inclass_player.controls.play()
        $scope.play_pause_class = "icon-pause"
      }
      else{
        $scope.inclass_player.controls.pause()
      }
      $scope.blurButtons()
    }

    $scope.muteBtn= function(){
      if($scope.mute_class == "icon-volume-off"){
        $scope.mute_class = "icon-volume-up"
        $scope.inclass_player.controls.unmute()
        $scope.inclass_player.controls.volume(1)
      }
      else{
        $scope.mute_class = "icon-volume-off"
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
       $scope.play_pause_class = "icon-pause"
    }

    $scope.inclass_player.events.onPause=function(){
       $scope.play_pause_class = "icon-play"
    }

    $scope.inclass_player.events.onReady=function(){
      $scope.loading_video=false
      if($scope.should_mute == true){
        $scope.muteBtn()
      }
    }

    $scope.inclass_player.events.onMeta=function(){
      $scope.play_pause_class = "icon-play"
      $scope.loading_video=false
    }
    $scope.inclass_player.events.seeked=function(){
        $scope.inclass_player.controls.pause()
    }


    $scope.nextQuiz = function(){
      // console.log($scope.timeline)
      if($scope.module && $scope.module.items){
        if($scope.item_itr < $scope.module.items.length){
          $scope.selected_item = $scope.module.items[$scope.item_itr]
          if($scope.timeline[$scope.selected_item.class_name] && $scope.timeline[$scope.selected_item.class_name][$scope.selected_item.id]){
            $scope.timeline_itr+=1 
            if($scope.timeline_itr < $scope.timeline[$scope.selected_item.class_name][$scope.selected_item.id].items.length){
              
              console.log("timeline= "+$scope.timeline_itr)
              console.log("item= "+$scope.item_itr)
              $scope.selected_timeline_item = $scope.timeline[$scope.selected_item.class_name][$scope.selected_item.id].items[$scope.timeline_itr]
              
              //console.log($scope.selected_item.id)
             // console.log($scope.selected_timeline_item.data)
                           
              if($scope.lecture_url.indexOf($scope.selected_item.url) == -1){
                $scope.inclass_player.controls.setStartTime($scope.selected_timeline_item.time)
                $scope.lecture_url= $scope.selected_item.url
              }
              else{
                $timeout(function(){
                  $scope.seek($scope.selected_timeline_item.time)
                })
              }

              if($scope.selected_timeline_item.type == "charts")
                $scope.chart = $scope.createChart($scope.selected_timeline_item.data.answers)
            }
            else{
              $scope.item_itr+=1
              $scope.timeline_itr=0
              //console.log("next lecture")
              $scope.nextQuiz()
            }
          }
        }
      }

      $timeout(function(){
        $scope.adjustTextSize()
      })
      $scope.blurButtons()


      /*-------------------------------------------------------*/
      
      // if($scope.current_quiz != $scope.total_num_quizzes){
      //   if($scope.lecture_list[$scope.current_lecture-1]){
      //     var lecture_id = $scope.lecture_list[$scope.current_lecture-1][0]
      //     var url=$scope.lecture_list[$scope.current_lecture-1][1]
      //     var name = $scope.lecture_list[$scope.current_lecture-1][2]
      //   }
      //   else{
      //      var lecture_id = $scope.lecture_list[0][0]
      //      var url= $scope.lecture_list[0][1]
      //      var name = $scope.lecture_list[0][2]
      //   }
      //   if($scope.current_quiz_lecture < $scope.display_data[lecture_id].length ){
      //     $scope.setData(lecture_id,url, name)
      //     $timeout(function(){
      //       $scope.seek($scope.quiz_time)
      //     })
      //   }
      //   else{
      //     $scope.current_quiz_lecture= 0
      //     for (var elem=$scope.current_lecture; elem<$scope.lecture_list.length; elem++){
      //       var lecture_id=$scope.lecture_list[elem][0]
      //       var url=$scope.lecture_list[elem][1]
      //       if($scope.display_data[lecture_id].length){
      //         $scope.setData(lecture_id,url, name)
      //         $scope.current_lecture = elem+1;
      //         break; 
      //       }
      //     }
      //   }
      //   $scope.current_quiz+=1
      //   $scope.current_quiz_lecture+= 1
      //   if($scope.chart_data)
      //     $scope.chart = $scope.createChart($scope.quiz_id)
      // }

      //  $timeout(function(){
      //   $scope.adjustTextSize()
      // })
      //  $scope.blurButtons()
    }

    $scope.prevQuiz = function(){
      if($scope.module && $scope.module.items){
        $scope.timeline_itr-=1
        if($scope.timeline_itr > 0){          
          //$scope.selected_item = $scope.module.items[$scope.item_itr]
          if($scope.timeline[$scope.selected_item.class_name] && $scope.timeline[$scope.selected_item.class_name][$scope.selected_item.id]){
            //console.log($scope.timeline_itr) 
            //if($scope.timeline_itr >= 1){ 

              console.log("timeline= "+$scope.timeline_itr)
              console.log("item= "+$scope.item_itr) 
             // $scope.timeline_itr-=1
              $scope.selected_timeline_item = $scope.timeline[$scope.selected_item.class_name][$scope.selected_item.id].items[$scope.timeline_itr]
            
              if($scope.lecture_url.indexOf($scope.selected_item.url) == -1){
                $scope.inclass_player.controls.setStartTime($scope.selected_timeline_item.time)
                $scope.lecture_url= $scope.selected_item.url
              }
              else{
                $timeout(function(){
                  $scope.seek($scope.selected_timeline_item.time)
                })
              }

              if($scope.selected_timeline_item.type == "charts")
                $scope.chart = $scope.createChart($scope.selected_timeline_item.data.answers)
            //}
            
          }
        }
        else{
              // $scope.item_itr+=1
              $scope.item_itr-=1
              if($scope.item_itr < 0)
                $scope.item_itr = 0
              $scope.selected_item = $scope.module.items[$scope.item_itr]
              $scope.timeline_itr=$scope.timeline[$scope.selected_item.class_name][$scope.selected_item.id].items.length

              console.log("prev lecture")
              $scope.prevQuiz()
            }
      }

      // if($scope.current_quiz != 1){
      //   $scope.current_quiz-=1
      //   $scope.current_quiz_lecture-= 2
      //   if($scope.current_quiz_lecture >= 0){
      //     var lecture_id=$scope.lecture_list[$scope.current_lecture-1][0]
      //     var url=$scope.lecture_list[$scope.current_lecture-1][1]
      //     var name = $scope.lecture_list[$scope.current_lecture-1][2]
      //     $scope.setData(lecture_id,url, name)
      //     $timeout(function(){
      //       $scope.seek($scope.quiz_time)
      //     })
      //   }
      //   else{
      //     for (var elem=$scope.current_lecture-2; elem>=0; elem--){
      //       var lecture_id=$scope.lecture_list[elem][0]
      //       var url=$scope.lecture_list[elem][1]
      //       var name = $scope.lecture_list[elem][2]
      //       if($scope.display_data[lecture_id].length){
      //         $scope.current_quiz_lecture = $scope.display_data[lecture_id].length -1
      //         $scope.setData(lecture_id,url, name)
      //         $scope.current_lecture = elem+1;
      //         break; 
      //       }
      //     }
      //   }
      //   $scope.current_quiz_lecture+= 1
      //   if($scope.chart_data)
      //     $scope.chart = $scope.createChart($scope.quiz_id)
      // }
      $timeout(function(){
        $scope.adjustTextSize()
      })
      $scope.blurButtons()
    }

    $scope.createChart = function(data){
      // console.log("creatiung cgabrt ")
      return createLectureChart(data)
    }

    var createLectureChart = function(data) {
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
        data:  formatLectureChartData(data)
      };
      return chart
  }

    var formatLectureChartData = function(data) {
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
              tooltip_text +="Incorrect: "
          } else {                
              correct = Math.floor((data[ind][0]/$scope.students_count)*100)
              incorrect = 0
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

    $scope.setQuizShortcuts=function(){
      console.log("seeting shortucts ")
      $scope.removeShortcuts()
      shortcut.add("Page_up",function() {
         console.log('page up')
         $scope.nextQuiz()
         $scope.$apply()
      },{"disable_in_input" : false, 'propagate':false});

      shortcut.add("Right",function() {
         console.log('page up')
         $scope.nextQuiz()
         $scope.$apply()
      },{"disable_in_input" : false, 'propagate':false});

      shortcut.add("Page_down",function() {
        console.log('page down')
         $scope.prevQuiz()
         $scope.$apply()
      },{"disable_in_input" : false, 'propagate':false});

      shortcut.add("Left",function() {
        console.log('page down')
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
         console.log('black screen')
         $scope.toggleBlackScreen()
         $scope.$apply()
         console.log($scope.show_black_screen)
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

    $scope.toggleBlackScreen=function(){
      $scope.show_black_screen = !$scope.show_black_screen
    }

    $scope.setOriginalClass=function(){
      $scope.video_class = 'original_video'
      $scope.question_class = 'original_question'
      $scope.chart_class = 'original_chart'
      $scope.student_question_class = 'original_student_question'
      $scope.question_block = 'question_block'
      // $scope.question_block={
      //   'overflowY':'visible'
      // }
      showQuestions()
      $scope.blurButtons()
    }

    $scope.setZoomClass=function(){
      $scope.video_class = 'zoom_video'
      $scope.question_class = 'zoom_question'
      $scope.chart_class = 'zoom_chart'
      $scope.student_question_class = 'zoom_question'
      $scope.question_block = 'zoom_question_block'
      // $scope.question_block={
      //   'overflowY':'visible'
      // }
      $scope.blurButtons()
    }

    $scope.toggleHideQuestions=function(){
      $scope.hide_questions = !$scope.hide_questions
      $scope.hide_text = $scope.hide_questions? $scope.button_names[4] : $scope.button_names[3]
      if($scope.question_class == 'original_question')
        $scope.video_class = $scope.hide_questions?'zoom_video' : 'original_video'
      $scope.blurButtons()
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
        $scope.button_names=['Exit', 'Over', 'Under','Hide', 'Unhide', '5sec']
      }
      $scope.hide_text = $scope.hide_questions? $scope.button_names[4] : $scope.button_names[3]
    }

    $scope.adjustTextSize=function(){
      var question_block = angular.element('.question_block')
     // console.log('scroll='+question_block.get(0).scrollHeight+' height='+question_block.height()+' diff='+(question_block.get(0).scrollHeight - question_block.height()))
      if(question_block.get(0).scrollHeight > question_block.height()){
        if(question_block.get(0).scrollHeight - question_block.height() >=10)
          $scope.question_class = 'smallest_question' 
        else
          $scope.question_class = 'small_question'         
      }
      else{
        if(question_block.height()>180 || question_block.height() == 0)
          $scope.question_class = $scope.hide_questions?'zoom_question' : 'original_question'
        else if(question_block.height()>150 && question_block.height()<180)
          $scope.question_class = 'small_question'
        else
          $scope.question_class = 'smallest_question'
      }
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

    $scope.toggleFullscreen=function(){
      $scope.fullscreen = !$scope.fullscreen
      $scope.blurButtons()
    }

    $scope.blurButtons=function(){
      angular.element('.btn').blur()
    }

    init();

  }]);
