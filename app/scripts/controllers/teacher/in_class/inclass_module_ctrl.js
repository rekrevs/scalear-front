'use strict';

angular.module('scalearAngularApp')
  .controller('inclassModuleCtrl', ['$scope','$modal','$timeout','$window',function ($scope, $modal, $timeout,$window) {
    $scope.lecture_player={}
    $scope.lecture_player.events={}    
  	$scope.display = function (type) {
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
      if($scope.current_quiz_lecture)
        delete $scope.current_quiz_lecture
      if($scope.chart_data)
        delete $scope.chart_data

      openModal('display', type)
      setup_screens()

      angular.element($window).bind('resize',
        function(){
          setup_screens()
          $scope.$apply()
      })  

  	};

    var openModal=function(view, type){ 
      angular.element("body").css("overflow","hidden");
      var win = angular.element($window)
      win.scrollTop("0px")
      var filename='inclass_'+view
      if(view == "review")
         filename+= "_"+type.toLowerCase()       
      
      $scope.modalInstance = $modal.open({
        templateUrl: 'views/teacher/in_class/'+filename+'.html',
        windowClass: 'whiteboard '+view,
        controller: view+type+'Ctrl',
        scope: $scope
      });
    }

    $scope.review=function(type){
      openModal('review', type)
    }

    $scope.survey=function(state){
      $scope.in_review= state
      openModal('review','Surveys')
    }

    $scope.exitBtn = function () {
      angular.element("body").css("overflow","auto");
      $scope.modalInstance.dismiss();
    };

    $scope.playBtn = function(){
      if($scope.play_pause_class == "play_button"){
        $scope.lecture_player.controls.play()
      }
      else{
        $scope.lecture_player.controls.pause()
      }
    }

    $scope.muteBtn= function(){
      if($scope.mute_class == "unmute_button"){
        $scope.mute_class = "mute_button"
        $scope.lecture_player.controls.unmute()
      }
      else{
        $scope.mute_class = "unmute_button"
        $scope.lecture_player.controls.mute()
      }
    }

    $scope.seek=function(time){
      console.log( $scope.lecture_player.controls)
        $scope.lecture_player.controls.seek(time)
        $scope.lecture_player.controls.pause()
    }

    $scope.skip=function(skip_time){
      if(skip_time){
        var seek_to_time = $scope.lecture_player.controls.getTime()+skip_time
        var duration = $scope.lecture_player.controls.getDuration()
        if(seek_to_time < 0)
          seek_to_time = 0
        else if(seek_to_time >duration)
          seek_to_time = duration
        $scope.seek(seek_to_time)
        $scope.play_pause_class = "play_button"
      }
    }

    $scope.lecture_player.events.onPlay=function(){
       $scope.play_pause_class = "pause_button"
    }

    $scope.lecture_player.events.onPause=function(){
       $scope.play_pause_class = "play_button"
    }

    $scope.lecture_player.events.onReady=function(){
      console.log("ready")
      $scope.seek($scope.quiz_time);
      $scope.lecture_player.controls.hideControls();
      $scope.loading_video=false
    }

    $scope.nextQuiz = function(){
      if($scope.current_quiz != $scope.total_num_quizzes){
        var url=$scope.lecture_list[$scope.current_lecture-1]||$scope.lecture_list[0]
        if($scope.current_quiz_lecture < $scope.display_data[url].length ){
          $scope.setData(url)
          $timeout(function(){
            $scope.seek($scope.quiz_time)
          })
        }
        else{
          $scope.current_quiz_lecture= 0
          for (var elem=$scope.current_lecture; elem<$scope.lecture_list.length; elem++){
            var url=$scope.lecture_list[elem]
            if($scope.display_data[url].length){
              $scope.setData(url)
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
    }

    $scope.prevQuiz = function(){
      if($scope.current_quiz != 1){
        $scope.current_quiz-=1
        $scope.current_quiz_lecture-= 2
        if($scope.current_quiz_lecture >= 0){
          var url=$scope.lecture_list[$scope.current_lecture-1]
          $scope.setData(url)
          $scope.seek($scope.quiz_time)
        }
        else{
          for (var elem=$scope.current_lecture-2; elem>=0; elem--){
            var url=$scope.lecture_list[elem]
            if($scope.display_data[url].length){
              $scope.current_quiz_lecture = $scope.display_data[url].length -1
              $scope.setData(url)
              $scope.current_lecture = elem+1;
              break; 
            }
          }
        }
        $scope.current_quiz_lecture+= 1
        if($scope.chart_data)
          $scope.chart = $scope.createChart($scope.quiz_id)
      }
    }

    var initialize_view=function(){
      // var width = getVideoWidth()
      // setVideoWidth(width)
      // setButtonsPosition()
      setup_screens()
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
        console.log("dingo")
        video_width = win_width -260
      }
      setVideoWidth(video_width)
      var remaining = win_width - video_width
      setButtonsPosition(remaining)
    }

    var setButtonsPosition = function(remaining){
      console.log(remaining)
      if(remaining>300)
        remaining = remaining/3 +30
      else
        remaining = remaining/4 
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
        verticalAlign:'text-bottom',
      }
    }

  }]);
