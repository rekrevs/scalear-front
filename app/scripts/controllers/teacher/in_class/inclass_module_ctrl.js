'use strict';

angular.module('scalearAngularApp')
  .controller('inclassModuleCtrl', ['$scope','$modal','$timeout','$window',function ($scope, $modal, $timeout,$window) {

  	$scope.open = function (type) {
      $scope.lecture_player_controls={}
      $scope.play_pause_class = "play_button"
      $scope.mute_class = "mute_button"
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

  		angular.element("body").css("overflow","hidden");
  		var win = angular.element($window)
  		win.scrollTop("0px")
      
  		$scope.modalInstance = $modal.open({
  			templateUrl: 'views/teacher/in_class/inclass_display.html',
  			windowClass: 'whiteboard',
  			controller: 'display'+type+'Ctrl',
        scope: $scope
  		});
  	};


    $scope.exitBtn = function () {
      angular.element("body").css("overflow","auto");
      $scope.modalInstance.dismiss();
    };

    $scope.playBtn = function(){
      if($scope.play_pause_class == "play_button"){
        $scope.play_pause_class = "pause_button"
        $scope.lecture_player_controls.play()
      }
      else{
        $scope.play_pause_class = "play_button"
        $scope.lecture_player_controls.pause()
      }
    }

    $scope.muteBtn= function(){
      if($scope.mute_class == "unmute_button"){
        $scope.mute_class = "mute_button"
        $scope.lecture_player_controls.unmute()
      }
      else{
        $scope.mute_class = "unmute_button"
        $scope.lecture_player_controls.mute()
      }
    }

    $scope.seek=function(time){
        $scope.lecture_player_controls.seek(time)
    }

    $scope.skip=function(skip_time){
      if(skip_time){
        var seek_to_time = $scope.lecture_player_controls.getTime()+skip_time
        var duration = $scope.lecture_player_controls.getDuration()
        if(seek_to_time < 0)
          seek_to_time = 0
        else if(seek_to_time >duration)
          seek_to_time = duration
        $scope.seek(seek_to_time)
        $scope.play_pause_class = "play_button"
      }
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

  }]);
