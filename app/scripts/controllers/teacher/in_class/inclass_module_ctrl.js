'use strict';

angular.module('scalearAngularApp')
  .controller('inclassModuleCtrl', ['$scope','$rootScope','$modal','$timeout','$window','$log','Module','$stateParams', function ($scope, $rootScope, $modal, $timeout,$window, $log, Module, $stateParams) {
    $window.scrollTo(0, 0);
    $scope.inclass_player={}
    $scope.inclass_player.events={}    
  	$scope.display = function (type, disabled) {
      if(!disabled){
        $scope.play_pause_class = "play_button"
        $scope.mute_class = "mute_button"
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
        $scope.hide_questions = false        
        if($scope.current_quiz_lecture)
          delete $scope.current_quiz_lecture
        if($scope.chart_data)
          delete $scope.chart_data

        openModal('display', type)
        setup_screens()
        changeButtonsSize()
        $scope.hide_text = $scope.button_names[3]
        $scope.setOriginalClass()

        angular.element($window).bind('resize',
          function(){
            setup_screens()
            changeButtonsSize()
             $timeout(function(){
              $scope.adjustTextSize()
            })
            $scope.$apply()
        })
      }  

  	};
    var init = function(){
        Module.getInclassActive(
          {module_id:$stateParams.module_id, course_id:$stateParams.course_id},
          function(data){
                $scope.buttons = data
                  },
          function(){}
        );
    }


var openModal=function(view, type){
      $rootScope.changeError = true;
    angular.element("body").css("overflow","hidden");
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

      $scope.unregister_back_event = $scope.$on("$locationChangeStart", function(event, next, current) {
          event.preventDefault()
          $scope.exitBtn() 
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
      $scope.modalInstance.dismiss();
      $scope.unregister_back_event();
      init()
    };

    $scope.playBtn = function(){
      if($scope.play_pause_class == "play_button"){
        $scope.inclass_player.controls.play()
      }
      else{
        $scope.inclass_player.controls.pause()
      }
    }

    $scope.muteBtn= function(){
      if($scope.mute_class == "unmute_button"){
        $scope.mute_class = "mute_button"
        $scope.inclass_player.controls.unmute()
        $scope.inclass_player.controls.volume(1)
      }
      else{
        $scope.mute_class = "unmute_button"
        $scope.inclass_player.controls.mute()
      }
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
    }

    $scope.inclass_player.events.onPlay=function(){
       $scope.play_pause_class = "pause_button"
    }

    $scope.inclass_player.events.onPause=function(){
       $scope.play_pause_class = "play_button"
    }

    $scope.inclass_player.events.onReady=function(){
      $scope.loading_video=false
      if($scope.should_mute == true){
        $scope.muteBtn()
      }
    }

    $scope.inclass_player.events.onMeta=function(){
      $scope.play_pause_class = "play_button"
      $scope.loading_video=false
    }
    $scope.inclass_player.events.seeked=function(){
        $scope.inclass_player.controls.pause()
    }


    $scope.nextQuiz = function(){
      if($scope.current_quiz != $scope.total_num_quizzes){
        if($scope.lecture_list[$scope.current_lecture-1]){
          var lecture_id = $scope.lecture_list[$scope.current_lecture-1][0]
          var url=$scope.lecture_list[$scope.current_lecture-1][1]
          var name = $scope.lecture_list[$scope.current_lecture-1][2]
        }
        else{
           var lecture_id = $scope.lecture_list[0][0]
           var url= $scope.lecture_list[0][1]
           var name = $scope.lecture_list[0][2]
        }
        if($scope.current_quiz_lecture < $scope.display_data[lecture_id].length ){
          $scope.setData(lecture_id,url, name)
          $timeout(function(){
            $scope.seek($scope.quiz_time)
          })
        }
        else{
          $scope.current_quiz_lecture= 0
          for (var elem=$scope.current_lecture; elem<$scope.lecture_list.length; elem++){
            var lecture_id=$scope.lecture_list[elem][0]
            var url=$scope.lecture_list[elem][1]
            if($scope.display_data[lecture_id].length){
              $scope.setData(lecture_id,url, name)
              $scope.current_lecture = elem+1;
              break; 
            }
          }
        }
        $scope.current_quiz+=1
        $scope.current_quiz_lecture+= 1
        if($scope.chart_data)
          $scope.chart = $scope.createChart($scope.quiz_id)
      }

       $timeout(function(){
        $scope.adjustTextSize()
      })
    }

    $scope.prevQuiz = function(){
      if($scope.current_quiz != 1){
        $scope.current_quiz-=1
        $scope.current_quiz_lecture-= 2
        if($scope.current_quiz_lecture >= 0){
          var lecture_id=$scope.lecture_list[$scope.current_lecture-1][0]
          var url=$scope.lecture_list[$scope.current_lecture-1][1]
          var name = $scope.lecture_list[$scope.current_lecture-1][2]
          $scope.setData(lecture_id,url, name)
          $timeout(function(){
            $scope.seek($scope.quiz_time)
          })
        }
        else{
          for (var elem=$scope.current_lecture-2; elem>=0; elem--){
            var lecture_id=$scope.lecture_list[elem][0]
            var url=$scope.lecture_list[elem][1]
            var name = $scope.lecture_list[elem][2]
            if($scope.display_data[lecture_id].length){
              $scope.current_quiz_lecture = $scope.display_data[lecture_id].length -1
              $scope.setData(lecture_id,url, name)
              $scope.current_lecture = elem+1;
              break; 
            }
          }
        }
        $scope.current_quiz_lecture+= 1
        if($scope.chart_data)
          $scope.chart = $scope.createChart($scope.quiz_id)
      }
      $timeout(function(){
        $scope.adjustTextSize()
      })
    }

    var getVideoWidth=function(){
      var win = angular.element($window)
      var video_height = (win.height()*60)/100
      var video_width= video_height*(16/9)
      return video_width
    }

    var setVideoWidth=function(video_width){
      $scope.video_style={
        height:'100%',
        marginTop: '0px',
        width: video_width+'px',
        display: 'inline-block'
      }
    }

    var setup_screens = function(){ 
      var win = angular.element($window)
      var win_width= win.width()
      var video_width= getVideoWidth()
      if(video_width+260 > win_width){
        video_width = win_width -260
      }
      setVideoWidth(video_width)
      var remaining = win_width - video_width
      setButtonsPosition(remaining)
    }

    var setButtonsPosition = function(remaining){
      
      remaining = remaining>400? remaining/3 +30 : remaining/5 
      $scope.left_style={
        display:'inline-block',
        minWidth:'50px',
        height:'60%',
        width:'50px',
        marginLeft:remaining,
        marginRight:'30px',
        verticalAlign:'text-bottom'
      }

      $scope.right_style={
        display:'inline-block',
        minWidth:'50px',
        height:'60%',
        width:'50px',
        marginLeft:'30px',
        verticalAlign:'text-bottom'
      }
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
    }

    $scope.toggleHideQuestions=function(){
      $scope.hide_questions = !$scope.hide_questions
      $scope.hide_text = $scope.hide_questions? $scope.button_names[4] : $scope.button_names[3]
      if($scope.question_class == 'original_question')
        $scope.video_class = $scope.hide_questions?'zoom_video' : 'original_video'
    }

    var showQuestions = function(){
      $scope.hide_questions = false
      $scope.hide_text =  $scope.button_names[3]
    }

    var changeButtonsSize=function(){
      var win = angular.element($window)
      var win_width= win.width()
      if(win_width < 660 ){
        $scope.button_names=['Ex', 'Ov', 'Un','H','U']
        if(win_width <510)
          $scope.button_class = 'btn btn-default smallest_font_button' 
        else
          $scope.button_class = 'btn btn-default small_font_button' 
      }
      else{
        $scope.button_class = 'btn btn-default big_font_button' 
        $scope.button_names=['Exit', 'Show Over', 'Show Under','Hide', 'Unhide']
      }
      $scope.hide_text = $scope.hide_questions? $scope.button_names[4] : $scope.button_names[3]
    }

    $scope.adjustTextSize=function(){
      var question_block = angular.element('.question_block')
      console.log('scroll='+question_block.get(0).scrollHeight+' height='+question_block.height()+' diff='+(question_block.get(0).scrollHeight - question_block.height()))
      if(question_block.get(0).scrollHeight > question_block.height()){
        if(question_block.get(0).scrollHeight - question_block.height() >=10){
          $scope.question_class = 'smallest_question'
          $scope.chart.options.height=question_block.height() - 10
        }
        else{
          $scope.question_class = 'small_question'
          $scope.chart.options.height=question_block.height() - 10
        }
      }
      else{
        if(question_block.height()>180 || question_block.height() == 0){
          $scope.question_class = $scope.hide_questions?'zoom_question' : 'original_question'
          $scope.chart.options.height=question_block.height() - 10
        }        
        else if(question_block.height()>150 && question_block.height()<180){
          $scope.question_class = 'small_question'
          $scope.chart.options.height=question_block.height() - 10
        }
        else{
          $scope.question_class = 'smallest_question'
          $scope.chart.options.height=question_block.height() - 10
        }      
      }
    }

    init();

  }]);
