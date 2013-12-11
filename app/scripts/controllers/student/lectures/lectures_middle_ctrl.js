'use strict';

angular.module('scalearAngularApp')
  .controller('studentLectureMiddleCtrl', ['$scope','Course','$stateParams','Lecture','$window','$timeout','$translate', function ($scope, Course, $stateParams,Lecture, $window, $timeout, $translate) {
//    console.log($scope);
//    $scope.lecture=lecture.data
    $scope.quiz_layer={}
    $scope.lecture_player={}
    $scope.lecture_player.events={}
    $scope.display_mode=false
    $scope.studentAnswers={}
    $scope.explanation={}
    $scope.wHeight=0;
    $scope.wWidth=0;
    $scope.pHeight=0;
    $scope.pWidth=0;
    $scope.show_notification=false;
 	
 	var init= function(){
 		Lecture.getLectureStudent({course_id:$stateParams.course_id, lecture_id:$stateParams.lecture_id}, function(data){
 			$scope.alert_messages=data.alert_messages;
 			$scope.lecture=JSON.parse(data.lecture)
 			console.log($scope.lecture.online_quizzes)
 			$scope.safeApply(function(){
 				$scope.pHeight=480;
    			$scope.pWidth= $scope.lecture.aspect_ratio=='widescreen'? 800:600;
 			})
 			$scope.lecture_player.events.onReady=function(){
 				$scope.lecture.online_quizzes.forEach(function(quiz){
 					$scope.lecture_player.controls.cue(quiz.time, function(){
 						$scope.studentAnswers[quiz.id]={}
 						$scope.selected_quiz=quiz
 						$scope.display_mode=true
 						$scope.lecture_player.controls.pause()
 						if(quiz.quiz_type == 'invideo'){
	 						//showInvideoQuiz()
	 						$scope.quiz_layer.backgroundColor= ""
	 						$scope.quiz_layer.overflowX= ''
            				$scope.quiz_layer.overflowY= ''
            				
 						}
	 					else
	 					{
	 						console.log("html")
	 						console.log("HTML quiz")
							$scope.quiz_layer.backgroundColor= "white"
							$scope.quiz_layer.overflowX= 'hidden'
            				$scope.quiz_layer.overflowY= 'auto'
            				if(quiz.question_type.toUpperCase()=="DRAG")
            				{
            					$scope.studentAnswers[quiz.id]=quiz.online_answers[0].answer;
            				}
	 					}

 						$scope.$apply()
	 				})
 				})
 			}
 			$scope.$emit('accordianReload');
			$scope.$emit('accordianUpdate',{g_id:$scope.lecture.group_id, type:"lecture", id:$scope.lecture.id});
 			//$scope.$emit('accordianUpdate',{g_id:$scope.lecture.group_id, type:"lecture", id:$scope.lecture.id});
 		
 		});	

    	angular.element($window).bind('resize',
			function(){
				if($scope.fullscreen){
					$scope.resizeBig(); 
					$scope.$apply()
			}
		})
    }

    $scope.seek=function(time){
    	$scope.selected_quiz='';
		$scope.display_mode=false;
    	$scope.lecture_player.controls.seek(time)
    }

   $scope.lecture_player.events.onPlay=function(){
   		// here check if selected_quiz solved now.. or ever will play, otherwhise will stop again.
   		if($scope.display_mode==true)
   		{
   			console.log($scope.selected_quiz)
   			if($scope.selected_quiz.is_quiz_solved==false)
   			{
   				console.log("in notification")
   				$scope.lecture_player.controls.pause();
   				
   					
   					$scope.show_notification=$translate('groups.answer_question');	
   				
   				console.log($scope.show_notification);
   				$timeout(function(){
   					console.log("in timeout");
	             		 $scope.show_notification=false;
	         	}, 2000);
   				// show message telling him to answer. notification directive.. pass text to it..
   				// also when just solved it want to set is_quiz_solved.. gheir ely bageebo from there..
   			}
   			else
   			{
   				$scope.selected_quiz='';
   				$scope.display_mode=false;
   			}
   		}
   		
   }
    $scope.safeApply = function(fn) {
		var phase = this.$root.$$phase;
		if(phase == '$apply' || phase == '$digest') {
			if(fn && (typeof(fn) === 'function')) {
				fn();
			}
		} 
		else{
			this.$apply(fn);
		}
	};
		
	$scope.resizeBig = function(){	
		console.log("height is "+$scope.wHeight);	
		console.log("resizeing")
		var factor= $scope.lecture.aspect_ratio=="widescreen"? 16.0/9.0 : 4.0/3.0;
		var win = angular.element($window)

		$scope.fullscreen = true

		//angular.element(".quiz_list").children().appendTo(".sidebar");
		angular.element("body").css("overflow","hidden");
		angular.element("body").css("position","fixed")

		win.scrollTop("0px")

		$scope.video_style={
			"top":0, 
			"left":0, 
			"position":"fixed",
			"width":win.width(),
			"height":win.height(),
			"z-index": 1030
		};

		var video_height = win.height()-30
		var video_width = video_height*factor
		//var video_height = (win.width())*1.0/factor +26
		var layer={}
		if(video_width>win.width()){ // if width will get cut out.
			video_width= win.width();
			video_height=(win.width())*(1.0/factor);
			var margin_top = ((win.height()-30) - video_height)/2.0;
			var margin_left=0;
		}
		else{		
			var margin_left= ((win.width()) - video_width)/2.0;
			var margin_top=0;
		 }
		 layer={
				"position":"fixed",
				"top":0,
				"left":0,
				"width":video_width,
				"height":video_height,
				"margin-top": margin_top+"px",
				"margin-left":margin_left+"px",
				"z-index": 1031
			}		

		 angular.extend($scope.quiz_layer, layer)
		
		$scope.safeApply(function(){
      		$scope.wHeight= angular.element($window).height();
    		$scope.wWidth= angular.element($window).width();
    		$scope.pWidth=$scope.wWidth;
    		$scope.pHeight=$scope.wHeight;
      	});
      	
	 	$timeout(function(){$scope.$emit("updatePosition")})	
	}
	
	
	$scope.resizeSmall = function()
	{	
		$scope.safeApply(function(){
 			$scope.pHeight=480;
    		$scope.pWidth= $scope.lecture.aspect_ratio=='widescreen'? 800:600;
 		})
 		
		var factor= $scope.lecture.aspect_ratio=="widescreen"? 16.0/9.0 : 4.0/3.0;
		$scope.fullscreen = false

		angular.element("body").css("overflow","auto");
		angular.element("body").css("position","");


		$scope.video_style={
			"position":"",
			"width":'',
			"height":'',
			"z-index": 0
		};

		var layer={		
			"top":"",
			"left":"",
			"position":"absolute",
			"width":"",
			"height":"",
			"margin-left": "0px",
			"margin-top": "0px",
			"z-index":2
		}

		angular.extend($scope.quiz_layer, layer)
		
		
		$timeout(function(){$scope.$emit("updatePosition")})		
	}

    init();
    
  }]);
