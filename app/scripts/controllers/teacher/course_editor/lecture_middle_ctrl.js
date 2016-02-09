'use strict';

angular.module('scalearAngularApp')
    .controller('lectureMiddleCtrl', ['$state', '$stateParams', '$scope', 'Lecture', 'CourseEditor', '$translate','$log','$rootScope','ErrorHandler','$timeout','OnlineQuiz','$q','DetailsNavigator', function ($state, $stateParams, $scope, Lecture, CourseEditor, $translate, $log,$rootScope, ErrorHandler, $timeout, OnlineQuiz,$q, DetailsNavigator) {

    var unwatch = $scope.$watch('items_obj["lecture"]['+$stateParams.lecture_id+']', function(){
  		if($scope.items_obj && $scope.items_obj["lecture"][$stateParams.lecture_id]){
	        $scope.lecture=$scope.items_obj["lecture"][$stateParams.lecture_id]
	    	$scope.$parent.currentmodule = $scope.lecture.group_id
	    	unwatch()
      	}
    })

    $scope.quiz_layer={}
    $scope.lecture_player={}
    $scope.lecture_player.events={}
    
    $scope.alert={
    	type:"alert", 
    	msg: "error_message.got_some_errors"
    }
    $scope.hide_alerts=true;
    $scope.play_pause_class = 'play'

    shortcut.add("i",function() {       
       $scope.addQuestion()
    },{"disable_in_input" : true, 'propagate':false});

    $scope.$on("show_online_quiz",function(ev, quiz){
    	$scope.showOnlineQuiz(quiz)
    })

    $scope.$on("delete_online_quiz",function(ev, quiz){
    	$scope.deleteQuizButton(quiz)
    })	

 	$scope.$on("add_online_quiz",function(event, quiz_type, question_type){
 		$scope.insertQuiz(quiz_type, question_type)
 	})

    $scope.lecture_player.events.onMeta= function(){
        // update duration for all video types.
        var duration = $scope.lecture_player.controls.getDuration()
        if(Math.ceil($scope.lecture.duration) != Math.ceil(duration)){
            $scope.lecture.duration=duration
            $scope.updateLecture();
        }
        $scope.slow = false
    }
 	$scope.lecture_player.events.onReady= function(){
 		$scope.video_ready = true
 		$scope.lecture_player.controls.pause()
        $scope.lecture_player.controls.seek(0)
    	$scope.total_duration=$scope.lecture_player.controls.youtube? $scope.lecture.duration - 1 : $scope.lecture.duration 
 	}

	$scope.lecture_player.events.onPlay= function(){
        $scope.play_pause_class = 'pause'
		$scope.slow = false
		var paused_time= $scope.lecture_player.controls.getTime()
			if($scope.editing_mode)
				$scope.lecture_player.controls.seek_and_pause(paused_time)
 	}

    $scope.lecture_player.events.onPause= function(){
        $scope.play_pause_class = "play"
    }

 	$scope.lecture_player.events.onSlow=function(is_youtube){
 		$scope.is_youtube = is_youtube
        $scope.slow = true
    }

    $scope.closeAlerts= function(){
 		$scope.hide_alerts=true;
 	}

    $scope.refreshVideo=function(){
    	$scope.slow=false
    	var temp_url = $scope.lecture.url
    	$scope.lecture.url =""
    	$timeout(function(){
    		$scope.lecture.url = temp_url
    	})
    }

    $scope.seek = function(time) {
        $scope.lecture_player.controls.seek(time)
    }

    $scope.lecture_player.events.seeked=function(){
    	$log.debug("seeking")
        if($scope.editing_mode && $scope.selected_quiz && Math.floor($scope.lecture_player.controls.getTime()) != Math.floor($scope.selected_quiz.time)){
        	$scope.saveBtn({exit:true})
    	}
    }

 	var checkQuizTimeConflict=function(time){
 		var new_time = time 
 		$scope.quiz_list.forEach(function(quiz){
 		    if(quiz.time == parseInt(new_time+1))
 				new_time+= 2
 			else if(quiz.time == parseInt(new_time))
 				new_time+= 1
 			// else if(quiz.time == parseInt(new_time-1))
 			// 	new_time+= 1
 		})
 		return new_time
 	}

 	$scope.addQuestion=function(){
 		$scope.lecture_player.controls.pause();
 		$scope.openQuestionsModal()
 	}

	$scope.insertQuiz=function(quiz_type, question_type){
		var promise = $q.when(true)
		if ($scope.selected_quiz && $scope.quiz_deletable){
			promise = $scope.deleteQuiz($scope.selected_quiz)
			clearQuizVariables()
		}

		promise.then(function(){
			var insert_time= $scope.lecture_player.controls.getTime()
			var duration = $scope.total_duration

			if(insert_time < 1 )
				insert_time = 1
			insert_time = checkQuizTimeConflict(insert_time)
			if (insert_time >= duration -1)
				insert_time = duration - 2
			
			$scope.lecture_player.controls.seek_and_pause(insert_time)

			$scope.quiz_loading = true;
			Lecture.newQuiz({
				course_id: $stateParams.course_id,
				lecture_id: $scope.lecture.id,
				time: Math.floor($scope.lecture_player.controls.getTime()), 
				quiz_type: quiz_type, 
				ques_type: question_type
			},
			function(data){ //success
				$log.debug(data);
				// $log.debug(data)
				$scope.editing_mode= false
				$scope.showOnlineQuiz(data.quiz)
				$scope.quiz_list.push(data.quiz)
				$scope.quiz_loading = false;
				$scope.quiz_deletable = true
				DetailsNavigator.open()
			}, 
			function(){ //error
				$scope.quiz_loading = false;
			})
		})
	}

	$scope.showOnlineQuiz= function(quiz){
		$scope.last_details_state = DetailsNavigator.getStatus()
		if($scope.selected_quiz != quiz){
			if($scope.editing_mode){
				$scope.saveBtn({exit:true})
			}
			$scope.hide_alerts = true;
			$scope.submitted= false
			$scope.editing_mode = true;
			$scope.selected_quiz = quiz
			$scope.$parent.$parent.selected_quiz_id = quiz.id
			$scope.lecture_player.controls.seek_and_pause(quiz.time)

			if(quiz.quiz_type =="html"){
				$log.debug("HTML quiz")
				$scope.double_click_msg=""
				$scope.quiz_layer.backgroundColor= "white"
				$scope.quiz_layer.overflowX= 'hidden'
	            $scope.quiz_layer.overflowY= 'auto'
				getHTMLData()
			}
			else{ // invideo or survey quiz				
				$scope.double_click_msg = "editor.messages.double_click_new_answer";
				$scope.quiz_layer.backgroundColor="transparent"
				$scope.quiz_layer.overflowX= ''
				$scope.quiz_layer.overflowY= ''
				$log.debug($scope.selected_quiz)
				getQuizData();				
			}
		}
	}

 	var getQuizData =function(){
		Lecture.getQuizData(
			{"course_id":$stateParams.course_id, "lecture_id":$scope.lecture.id ,"quiz": $scope.selected_quiz.id},
			function(data){ //success
				$log.debug(data)
				$scope.selected_quiz.answers= data.answers
				$log.debug($scope.selected_quiz)
				if($scope.selected_quiz.question_type.toLowerCase()=="drag"){
					$scope.allPos=mergeDragPos(data.answers)
					$log.debug($scope.allPos)
				}
			},
			function(){}
		);
	}

	var getHTMLData=function(){
		Lecture.getHtmlData(
			{"course_id":$stateParams.course_id, "lecture_id":$scope.lecture.id ,"quiz":  $scope.selected_quiz.id},
			function(data){ //success	
				$log.debug($scope.selected_quiz.question_type)
				if($scope.selected_quiz.question_type.toLowerCase() == 'drag'){
					$log.debug(data)
					$scope.selected_quiz.answers = []
					if(!data.answers.length)
						$scope.addHtmlAnswer()
					else
						$scope.selected_quiz.answers= CourseEditor.expandDragAnswers(data.answers[0].id ,data.answers[0].answer, "lecture", $scope.selected_quiz.id)
				}
				else{
					$scope.selected_quiz.answers= data.answers
					if(!$scope.selected_quiz.answers.length)
						$scope.addHtmlAnswer()				
				}			
			},
			function(){}
		);
	}

	var mergeDragPos=function(answers){
		var all_pos=[]
		answers.forEach(function(elem, i){
			elem.pos = i
			all_pos.push(parseInt(elem.pos))
		});
		return all_pos
	}

	
	$scope.addHtmlAnswer=function(ans){
		$scope.new_answer=CourseEditor.newAnswer(ans,"","","","","lecture", $scope.selected_quiz.id)
		$scope.selected_quiz.answers.push($scope.new_answer)
	}

	$scope.removeHtmlAnswer = function(index){
		if($scope.selected_quiz.answers.length <=1)
			{
				$rootScope.show_alert="error";
		      	ErrorHandler.showMessage('Error ' + ': ' + $translate("editor.cannot_delete_alteast_one_answer"), 'errorMessage', 8000);
		      	$timeout(function(){
		      		$rootScope.show_alert="";	
		      	},4000);
			}
		else
			$scope.selected_quiz.answers.splice(index, 1);			
	}

 	$scope.addDoubleClickBind= function(event){
	  if ($scope.editing_mode) {
 		var answer_width, answer_height
 		if($scope.selected_quiz.question_type.toLowerCase() == 'drag'){
 			answer_width = 150
 			answer_height= 40
 		}
 		else{
 			answer_width = 13
 			answer_height= 13
 		}
	    var element = angular.element(event.target);

	    if(element.attr('id') =="ontop"){
	    	$log.debug("adding on top ontop")

	    	var left= event.pageX - element.offset().left - 6//event.offsetX - 6
		  	var top = event.pageY - element.offset().top - 6 //event.offsetY - 6

	    	$log.debug(event)
	    	$log.debug(element)
	    	$log.debug(left+" "+top)

		  	var the_top = top / element.height();
	      	var the_left= left / element.width()
	     	var the_width = answer_width/element.width();
	      	var the_height= answer_height/(element.height());
	      	$scope.addAnswer("Answer "+($scope.selected_quiz.answers.length+1), the_height, the_width, the_left, the_top)
	      	if (window.getSelection)
		        window.getSelection().removeAllRanges();
		    else if (document.selection)
		        document.selection.empty();
      	}
	}
	}

	$scope.deleteQuiz=function(quiz){
		var deferred = $q.defer();
		$scope.quiz_overlay = false
		OnlineQuiz.destroy(
			{online_quizzes_id: quiz.id},{},
			function(data){
				$log.debug(data)
				$scope.quiz_list.splice($scope.quiz_list.indexOf(quiz), 1)
				deferred.resolve()
				$scope.quiz_overlay = true
			},
			function(){}
		);

		return deferred.promise
	}



	$scope.addAnswer= function(ans,h,w,l,t){
  		$scope.new_answer=CourseEditor.newAnswer(ans,h,w,l,t,"lecture", $scope.selected_quiz.id)
  		$scope.selected_quiz.answers.push($scope.new_answer)
  		if($scope.selected_quiz.question_type.toLowerCase() =="drag"){
			//$scope.new_answer.pos = data.current.pos
			var max = Math.max.apply(Math,$scope.allPos)
			$scope.new_answer.pos = max ==-Infinity? 0 : max+1
		    $scope.allPos=mergeDragPos($scope.selected_quiz.answers)
		}
	}
	
	$scope.removeAnswer = function(index){
		$scope.selected_quiz.answers.splice(index, 1);
		 if($scope.selected_quiz.question_type.toLowerCase()=="drag"){
			$scope.allPos=mergeDragPos($scope.selected_quiz.answers)
		}
	}

	var updateAnswers=function(ans, quiz, options){
		$log.debug("savingAll")
		// $scope.disable_save_button = true
		var selected_quiz = angular.copy($scope.selected_quiz)
		if(options && options.exit)
				$scope.exitBtn()
		Lecture.updateAnswers(
			{
				course_id:$stateParams.course_id,
				lecture_id:$scope.lecture.id,
				online_quiz_id: selected_quiz.id
			},
			{answer: ans, quiz_title:quiz.question, match_type: quiz.match_type},
			function(){
				if(!(options && options.exit))
					selected_quiz.quiz_type =="invideo"? getQuizData() : getHTMLData()						
			},
			function(){}
		);
	}
	
	var isFormValid = function(){
		var correct=0;
		for( var element in $scope.selected_quiz.answers){
			if(!$scope.selected_quiz.answers[element].answer || $scope.selected_quiz.answers[element].answer.trim()==""){
				$scope.alert.msg="editor.messages.provide_answer"
				return false
			}
			if($scope.selected_quiz.question_type.toUpperCase()=="DRAG")
				correct=1
			else	
				correct= $scope.selected_quiz.answers[element].correct || correct;
		}
		if(!correct && $scope.selected_quiz.quiz_type!='survey'){
			$scope.alert.msg="editor.messages.quiz_no_answer"
			// return false
		}
		return true;
	};
	
	$scope.saveBtn = function(options){
		if((($scope.answer_form.$valid && $scope.selected_quiz.quiz_type == 'html') || ($scope.selected_quiz.quiz_type != 'html' && isFormValid())) && $scope.selected_quiz.answers.length){
	 		$scope.submitted=false;
	 		$scope.hide_alerts=true;
			var data
			if($scope.selected_quiz.question_type.toUpperCase() == 'DRAG' && $scope.selected_quiz.quiz_type == 'html'){
				var obj = CourseEditor.mergeDragAnswers($scope.selected_quiz.answers, "lecture", $scope.selected_quiz.id)
				$scope.selected_quiz.answers.forEach(function(ans){
					if(ans.id && obj.id==null){
						obj.id = ans.id
						return 
					}
				})
				data=[obj]
			}
			else
				data = angular.copy($scope.selected_quiz.answers)


			$scope.quiz_deletable = false
			updateAnswers(data, $scope.selected_quiz, options);
		}
		else{
			if($scope.selected_quiz.quiz_type == 'html')
				$scope.alert.msg=$scope.answer_form.$error.atleastone? "editor.messages.quiz_no_answer" :"editor.messages.provide_answer"
			$scope.submitted=true;
			$scope.hide_alerts=false;
		}
	}

	$scope.exitBtn = function(){
		$log.debug($scope.selected_quiz)
		if($scope.quiz_deletable){
			$log.debug($scope.selected_quiz)
			$scope.deleteQuiz($scope.selected_quiz)
		}
		closeQuizMode()
		clearQuizVariables()
		if(!$scope.last_details_state)
			DetailsNavigator.close()
	}

	var clearQuizVariables= function(){
		$scope.selected_quiz={}	
		// $scope.$parent.selected_quiz= {}
		$scope.$parent.$parent.selected_quiz_id = null
		$scope.quiz_deletable = false
	}

	var closeQuizMode=function(){
		$scope.editing_mode = false;
		$scope.hide_alerts = true;
		$scope.submitted= false
		$scope.quiz_layer.backgroundColor= ""
	}

	$scope.deleteQuizButton=function(quiz){
		if($scope.selected_quiz == quiz){
			closeQuizMode()
			clearQuizVariables()
		}
		$scope.deleteQuiz(quiz)
	}

	$scope.createVideoLink=function(){
		var time=Math.floor($scope.lecture_player.controls.getTime())
		return {url:$state.href('course.module.courseware.lecture', {module_id:$scope.lecture.group_id, lecture_id: $scope.lecture.id, time:time}, {absolute: true}), time:time}
	}	

	$scope.openQuizList=function(ev){
		DetailsNavigator.open()
		angular.element(ev.target).blur()
		$scope.quiz_list.push({})
		$timeout(function(){
			$scope.quiz_list.pop()				
		})
	}

}]);


