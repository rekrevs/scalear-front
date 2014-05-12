'use strict';

angular.module('scalearAngularApp')
    .controller('lectureMiddleCtrl', ['$state', '$stateParams', '$scope', 'Lecture', 'CourseEditor', '$translate','$log','$rootScope','ErrorHandler','$timeout','OnlineQuiz','$q', function ($state, $stateParams, $scope, Lecture, CourseEditor, $translate, $log,$rootScope, ErrorHandler, $timeout, OnlineQuiz,$q) {


    $scope.$watch('items_obj["lecture"]['+$stateParams.lecture_id+']', function(){
      if($scope.items_obj && $scope.items_obj["lecture"][$stateParams.lecture_id]){
        $scope.lecture=$scope.items_obj["lecture"][$stateParams.lecture_id]
        $scope.$emit('accordianUpdate',$scope.lecture.group_id);
      }
    })
	
    $scope.resize={}
    $scope.container_layer={}
    $scope.quiz_layer={}
    $scope.video_layer={}
    $scope.lecture_player={}
    $scope.lecture_player.events={}
    $scope.$parent.lecture_player =  $scope.lecture_player
    $scope.alert={
    	type:"error", 
    	msg: "lectures.got_some_errors"
    }
	$scope.quiz_types_list=[
		{type:'MCQ', text:"insert_mcq"},
		{type:'OCQ', text:"insert_ocq"}, 
		{type:'drag',text:"insert_drag"},
		{type:'Free Text Question',text:"insert_free_text_question", only:"html"}
	]
	$scope.survey_types_list=[
		{type:'MCQ', text:"MCQ - Multiple Choice Answers"},
		{type:'OCQ', text:"OCQ - One Choice Answer"}, 
	]
    $scope.play_pause_class = 'play'
    $scope.current_time = 0
    //$scope.lecture.duration = 0
    $scope.fullscreen = false
	
    $state.go('course.course_editor.lecture.quizList');


//////////////////////////////////////FUNCTIONS/////////////////////////////////////////////

	$scope.closeAlerts= function(){
 		$scope.hide_alerts=true;
 	}

    $scope.lecture_player.events.onMeta= function(){
        // update duration for all video types.
        if(Math.ceil($scope.lecture.duration) != Math.ceil($scope.lecture_player.controls.getDuration()))
        {
            $scope.lecture.duration=$scope.lecture_player.controls.getDuration();
            $scope.updateLecture();
        }
        $scope.slow = false
    }
 	$scope.lecture_player.events.onReady= function(){
 		$scope.hide_overlay = true
        $scope.lecture.duration = $scope.lecture_player.controls.getDuration()
 		$scope.lecture_player.controls.pause()
        $scope.lecture_player.controls.seek(0)
        $scope.lecture_player.controls.volume(0.5);
     	//$scope.lecture.duration = $scope.lecture_player.controls.getDuration()
 	}

	$scope.lecture_player.events.onPlay= function(){
        $scope.play_pause_class = 'pause'
		$scope.slow = false
		var paused_time= $scope.lecture_player.controls.getTime()
			if($scope.editing_mode)
				$scope.lecture_player.controls.seek_and_pause(paused_time)
 	}

    $scope.playBtn = function(){
        console.log($scope.play_pause_class)
        if($scope.play_pause_class == "play"){
            $scope.lecture_player.controls.play()
        }
        else{
            $scope.lecture_player.controls.pause()
        }
    }

    $scope.seek = function(time) {
        $scope.lecture_player.controls.seek(time)
    }

    $scope.updateProgress=function($event){
        var element = angular.element('.progressBar');
        var ratio = ($event.pageX-element.offset().left)/element.outerWidth();
        $scope.elapsed_width = ratio*100+'%'
        $scope.seek($scope.lecture.duration*ratio)
    }

    $scope.lecture_player.events.timeUpdate = function(){
        // console.log("in timeupdate")
        $scope.current_time = $scope.lecture_player.controls.getTime()
        $scope.elapsed_width = (($scope.current_time/$scope.lecture.duration)*100) + '%'
    }

    $scope.lecture_player.events.onPause= function(){
        $scope.play_pause_class = "play"
    }

 	$scope.lecture_player.events.onSlow=function(){
        $scope.slow = true
    }

    $scope.lecture_player.events.seeked=function(){
    	console.log("seeking")
        if($scope.editing_mode && $scope.selected_quiz && Math.floor($scope.lecture_player.controls.getTime()) != Math.floor($scope.selected_quiz.time)){
        	$scope.exitBtn()
    	}
    }

 	var checkQuizTimeConflict=function(time){
 		var new_time = time 
 		var inc = 0
 		$scope.quiz_list.forEach(function(quiz){
 		    if(quiz.time == parseInt(new_time+1))
 				new_time+= 3
 			else if(quiz.time == parseInt(new_time)){
 				new_time+= 2
 			} 					
 			else if(quiz.time == parseInt(new_time-1))
 				new_time+= 1
 		})
 		return new_time
 	}

	$scope.insertQuiz=function(quiz_type, question_type){
		var promise = $q.when(true)
		if ($scope.selected_quiz && $scope.quiz_deletable){
			var old_insert_time = $scope.selected_quiz.time
			promise = $scope.deleteQuiz($scope.selected_quiz)
			clearQuizVariables()
		}

		promise.then(function(){
			var insert_time= $scope.lecture_player.controls.getTime()
			var duration = $scope.lecture_player.controls.getDuration()

			if(insert_time < 1 )
				insert_time = 1
			else if (insert_time >= duration)
				insert_time = duration - 1

			if(old_insert_time)
				insert_time = old_insert_time
			else
				insert_time = checkQuizTimeConflict(insert_time)
			
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
				// console.log(data)
				$scope.showOnlineQuiz(data.quiz)
				$scope.quiz_list.push(data.quiz)
				$scope.quiz_loading = false;
				$scope.quiz_deletable = true
			}, 
			function(){ //error
				$scope.quiz_loading = false;
			})
		})
	}

	$scope.showOnlineQuiz= function(quiz){
		if($scope.selected_quiz != quiz){
			if ($scope.quiz_deletable){
				$scope.deleteQuiz($scope.selected_quiz)
				clearQuizVariables()
			}
			$log.debug("SHOWONLINEQUIX")
			$log.debug(quiz)
			$scope.hide_alerts = true;
			$scope.submitted= false
			$scope.editing_mode = true;
			$scope.selected_quiz = quiz
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
				$scope.double_click_msg = "online_quiz.double_click_new_answer";
				$scope.quiz_layer.backgroundColor="transparent"
				$scope.quiz_layer.overflowX= ''
				$scope.quiz_layer.overflowY= ''
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
				console.log($scope.selected_quiz.question_type)
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
		answers.forEach(function(elem){
			all_pos.push(parseInt(elem.pos))
			$log.debug(all_pos)
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
		      	ErrorHandler.showMessage('Error ' + ': ' + $translate("online_quiz.cannot_delete_alteast_one_answer"), 'errorMessage', 8000);
		      	$timeout(function(){
		      		$rootScope.show_alert="";	
		      	},4000);
			}
		else //if(confirm($translate('questions.you_sure_delete_answer', {answer: $scope.selected_quiz.answers[index].answer})))
			$scope.selected_quiz.answers.splice(index, 1);			
	}

 	$scope.addDoubleClickBind= function(event){
	  if ($scope.editing_mode) {
	    
	  
 		console.log("hell worll.ds")
 		var answer_width, answer_height
 		if($scope.selected_quiz.question_type.toLowerCase() == 'drag'){
 			answer_width = 300
 			answer_height= 40
 		}
 		else{
 			answer_width = 13
 			answer_height= 13
 		}
	    var element = angular.element(event.target);

	    //$log.debug(element.attr('id').contains("ontop"))
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
				// resetQuizVariables()
				deferred.resolve()
				$scope.quiz_overlay = true
				// $scope.editing_mode = false;
			},
			function(){}
		);

		return deferred.promise
	}

	$scope.addAnswer= function(ans,h,w,l,t){
		$log.debug("adding answer")
  		$scope.new_answer=CourseEditor.newAnswer(ans,h,w,l,t,"lecture", $scope.selected_quiz.id)
  		$scope.selected_quiz.answers.push($scope.new_answer)
  		if($scope.selected_quiz.question_type.toLowerCase() =="drag"){
			//$scope.new_answer.pos = data.current.pos
			var max = Math.max.apply(Math,$scope.allPos)
			max = max ==-Infinity? -1 : max
			$log.debug("max= "+max)
			$scope.new_answer.pos=max+1
		    $scope.allPos=mergeDragPos($scope.selected_quiz.answers)
		}
	}
	
	$scope.removeAnswer = function(index){
		$log.debug("removing answer")
		var backup = angular.copy($scope.selected_quiz.answers[index])
		$scope.selected_quiz.answers.splice(index, 1);
		$log.debug(backup)
		 if($scope.selected_quiz.question_type.toLowerCase()=="drag"){
			$scope.allPos=mergeDragPos($scope.selected_quiz.answers)
			$log.debug($scope.allPos)
		}
	}

	var updateAnswers=function(ans, quiz){
		$log.debug("savingAll")
		Lecture.updateAnswers(
			{
				course_id:$stateParams.course_id,
				lecture_id:$scope.lecture.id,
				online_quiz_id: $scope.selected_quiz.id
			},
			{answer: ans, quiz_title:quiz.question, match_type: quiz.match_type },
			function(data){ //success
				if($scope.selected_quiz.quiz_type =="invideo")
					getQuizData();
				else
					getHTMLData();
				
			},
			function(){}
		);
	}
	
	var is_form_valid = function()
	{
		var correct=0;
		for( var element in $scope.selected_quiz.answers)
		{
			if(!$scope.selected_quiz.answers[element].answer || $scope.selected_quiz.answers[element].answer.trim()==""){
				$scope.alert.msg="lectures.provide_answer"
				return false
			}
			if($scope.selected_quiz.question_type.toUpperCase()=="DRAG")
			correct=1
			else	
			correct= $scope.selected_quiz.answers[element].correct || correct;
		}
		if(!correct && $scope.selected_quiz.quiz_type!='survey'){
			$scope.alert.msg="lectures.please_choose_one_answer"
			return false
		}
		return true;
	};
	
	$scope.saveBtn = function(){
		$log.debug($scope.selected_quiz.answers)
		if((($scope.answer_form.$valid && $scope.selected_quiz.quiz_type == 'html') || ($scope.selected_quiz.quiz_type != 'html' && is_form_valid())) && $scope.selected_quiz.answers.length)
 		{
	 		$scope.submitted=false;
	 		$scope.hide_alerts=true;
			$log.debug("saving")
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
			updateAnswers(data, $scope.selected_quiz);
		}
		else{
			if($scope.selected_quiz.quiz_type == 'html')
				$scope.alert.msg=$scope.answer_form.$error.atleastone? "lectures.please_choose_one_answer" :"lectures.provide_answer"
			$scope.submitted=true;
			$scope.hide_alerts=false;
		}
	}

	$scope.exitBtn = function(){
		console.log($scope.selected_quiz)
		if($scope.quiz_deletable){
			console.log($scope.selected_quiz)
			$scope.deleteQuiz($scope.selected_quiz)
		}
		clearQuizVariables()
		$scope.editing_mode = false;
		$scope.hide_alerts = true;
		$scope.submitted= false
		$scope.quiz_layer.backgroundColor= ""
	}

	var clearQuizVariables= function(){
		$scope.selected_quiz={}		
		$scope.quiz_deletable = false
	}

}]);


