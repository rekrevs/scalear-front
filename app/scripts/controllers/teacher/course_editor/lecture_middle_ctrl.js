'use strict';

angular.module('scalearAngularApp')
    .controller('lectureMiddleCtrl', ['$state', '$stateParams', '$scope', 'Lecture', 'CourseEditor', '$translate','$log','$rootScope','ErrorHandler','$timeout','OnlineQuiz','$q','DetailsNavigator','OnlineMarker','$filter','Timeline', function ($state, $stateParams, $scope, Lecture, CourseEditor, $translate, $log,$rootScope, ErrorHandler, $timeout, OnlineQuiz,$q, DetailsNavigator, OnlineMarker, $filter, Timeline){

    var unwatch = $scope.$watch('items_obj["lecture"]['+$stateParams.lecture_id+']', function(){
  		if($scope.items_obj && $scope.items_obj["lecture"][$stateParams.lecture_id]){
	        $scope.lecture=$scope.items_obj["lecture"][$stateParams.lecture_id]
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

    shortcut.add("i",function() {       
       $scope.addQuestion()
    },{"disable_in_input" : true, 'propagate':false});

    shortcut.add("m", function(){
    	$scope.addOnlineMarker()
    },{"disable_in_input" : true, 'propagate':false});

    $scope.$on("show_online_quiz",function(ev, quiz){
    	$scope.showOnlineQuiz(quiz)
    })

    $scope.$on("delete_online_quiz",function(ev, quiz){
    	$scope.deleteQuizButton(quiz)
    })	

    $scope.$on("show_online_marker",function(ev, marker){
    	$scope.showOnlineMarker(marker)
    })

    $scope.$on("delete_online_marker",function(ev, marker){
    	$scope.deleteMarkerButton(marker)
    })	

 	$scope.$on("add_online_quiz",function(ev, quiz_type, question_type){
 		$scope.insertQuiz(quiz_type, question_type)
 	})

 	$scope.$on("start_trim_video",function(){
 		$scope.editing_type = 'video'
 	})

 	$scope.$on("close_trim_video",function(){
 		$scope.editing_type = null

 		$scope.refreshVideo()
 	})

    $scope.lecture_player.events.onMeta= function(){
        // update duration for all video types.
        $scope.total_duration=$scope.lecture_player.controls.getDuration()
        if(Math.ceil($scope.lecture.duration) != Math.ceil($scope.total_duration)){
            $scope.lecture.duration=$scope.total_duration
            $scope.updateLecture();
        }
        $scope.slow = false
    }
 	$scope.lecture_player.events.onReady= function(){
 		$scope.video_ready = true
 		$scope.lecture_player.controls.pause()
        $scope.lecture_player.controls.seek(0)    	
 	}

	$scope.lecture_player.events.onPlay= function(){
        // $scope.play_pause_class = 'pause'
		$scope.slow = false
		var paused_time= $scope.lecture_player.controls.getTime()
			if($scope.editing_mode)
				$scope.lecture_player.controls.seek_and_pause(paused_time)
 	}

    // $scope.lecture_player.events.onPause= function(){
    //     $scope.play_pause_class = "play"
    // }

 	$scope.lecture_player.events.onSlow=function(is_youtube){
 		$scope.is_youtube = is_youtube
        $scope.slow = true
    }

    $scope.closeAlerts= function(){
 		$scope.hide_alerts=true;
 	}

    $scope.refreshVideo=function(){
    	$scope.slow=false
    	$scope.video_ready = false
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
     //    if($scope.editing_mode ){
     //    	if($scope.selected_quiz && Math.floor($scope.lecture_player.controls.getTime()) != Math.floor($scope.selected_quiz.time))
     //    		$scope.saveQuizBtn({exit:true})
     //    	else if($scope.selected_marker && Math.floor($scope.lecture_player.controls.getTime()) != Math.floor($scope.selected_marker.time))
     //    		$scope.closeMarkerMode()
    	// }
    }

 	var checkQuizTimeConflict=function(time){
 		var new_time = time 
 		$scope.lecture.timeline.items.forEach(function(item){
 			if(item.type =='quiz'){
 				var quiz = item.data
	 		    if(quiz.time == parseInt(new_time+1))
	 				new_time+= 3
	 			else if(quiz.time == parseInt(new_time)){
	 				new_time+= 2
	 			} 					
	 			else if(quiz.time == parseInt(new_time-1))
	 				new_time+= 1
	 		}
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
			if (insert_time >= duration)
				insert_time = duration - 2
			
			$scope.lecture_player.controls.seek_and_pause(insert_time)

			// var start_time = insert_time - 5 < 0? 0 : insert_time - 5
			// var end_time   = insert_time + 5 > duration-2? duration-2 : insert_time + 5

			$scope.quiz_loading = true;
			Lecture.newQuiz({
				course_id: $stateParams.course_id,
				lecture_id: $scope.lecture.id,
				time: insert_time, 
				start_time: insert_time,
				end_time: insert_time,
				quiz_type: quiz_type, 
				ques_type: question_type
			},
			function(data){ //success
				$log.debug(data);
				// $log.debug(data)
				$scope.editing_mode= false
				$scope.showOnlineQuiz(data.quiz)
				$scope.lecture.timeline.add(data.quiz.time, 'quiz', data.quiz)
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
		if($scope.selected_marker && $scope.editing_mode){
			$scope.saveMarkerBtn($scope.selected_marker, {exit:true})
		}		
		$scope.last_details_state = DetailsNavigator.getStatus()
		if($scope.selected_quiz != quiz){
			if($scope.editing_mode){
				$scope.saveQuizBtn({exit:true})
			}
			$scope.hide_alerts = true;
			$scope.submitted= false
			$scope.editing_mode = true;
			$scope.selected_quiz = quiz
			$scope.selected_quiz.selected = true
			$scope.selected_quiz.formatedTime = $filter('format')($scope.selected_quiz.time)
			$scope.selected_quiz.start_formatedTime = $filter('format')($scope.selected_quiz.start_time)
			$scope.selected_quiz.end_formatedTime = $filter('format')($scope.selected_quiz.end_time)
			$scope.editing_type = 'quiz'
			$scope.$parent.$parent.selected_quiz_id = quiz.id
			$scope.lecture_player.controls.seek_and_pause(quiz.time)

			if(quiz.quiz_type =="html"){
				getHTMLData()
				$log.debug("HTML quiz")
				$scope.double_click_msg=""
				$scope.quiz_layer.backgroundColor= "white"
				$scope.quiz_layer.overflowX= 'hidden'
	            $scope.quiz_layer.overflowY= 'auto'				
			}
			else{ // invideo or survey quiz	
				getQuizData();
				$scope.double_click_msg = "editor.messages.double_click_new_answer";
				$scope.quiz_layer.backgroundColor="transparent"
				$scope.quiz_layer.overflowX= ''
				$scope.quiz_layer.overflowY= ''
				$log.debug($scope.selected_quiz)				
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
	  if ($scope.editing_mode && !$scope.selected_quiz.hide_quiz_answers) {
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
		console.log(quiz)
		var deferred = $q.defer();
		$scope.quiz_overlay = false
		OnlineQuiz.destroy(
			{online_quizzes_id: quiz.id},{},
			function(data){
				$log.debug(data)
				$scope.lecture.timeline.items.splice($scope.lecture.timeline.getIndexById(quiz.id, 'quiz'), 1)
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
			$scope.exitQuizBtn()
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
	
	$scope.saveQuizBtn = function(options){
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

	$scope.exitQuizBtn = function(){
		if($scope.quiz_deletable){
			$scope.deleteQuiz($scope.selected_quiz)
		}
		closeQuizMode()
		if(!$scope.last_details_state)
			DetailsNavigator.close()
	}

	var clearQuizVariables= function(){
		if($scope.selected_quiz)
			$scope.selected_quiz.selected = false
		$scope.selected_quiz=null
		$scope.$parent.$parent.selected_quiz_id = null
		$scope.quiz_deletable = false
	}

	var closeQuizMode=function(){
		$scope.editing_mode = false;
		$scope.hide_alerts = true;
		$scope.submitted= false
		$scope.editing_type = null
		$scope.quiz_layer.backgroundColor= ""
		clearQuizVariables()
		closePreviewInclass()
	}

	$scope.deleteQuizButton=function(quiz){
		closeQuizMode()
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

	$scope.addOnlineMarker=function(){
		var insert_time= $scope.lecture_player.controls.getTime()
		var duration = $scope.total_duration

		if(insert_time < 1 )
			insert_time = 1
		if (insert_time >= duration)
			insert_time = duration - 2
		
		$scope.lecture_player.controls.seek_and_pause(insert_time)

		Lecture.newMarker({
			course_id: $stateParams.course_id,
			lecture_id: $scope.lecture.id,
			time: $scope.lecture_player.controls.getTime(), 
		},
		function(data){
			$scope.showOnlineMarker(data.marker)
			$scope.lecture.timeline.add(data.marker.time, "marker", data.marker)
			DetailsNavigator.open()
		})
	}

	$scope.showOnlineMarker=function(marker){
		if($scope.selected_quiz && $scope.editing_mode)
			$scope.saveQuizBtn({exit:true})
		if($scope.selected_marker != marker){
			if($scope.editing_mode)
				$scope.saveMarkerBtn($scope.selected_marker, {exit:true})
			$scope.editing_mode = true;
			$scope.selected_marker = marker
			$scope.selected_marker.formatedTime = $filter('format')($scope.selected_marker.time)
			$scope.editing_type = 'marker'
			$scope.$parent.$parent.selected_marker_id = marker.id
			$scope.lecture_player.controls.seek_and_pause(marker.time)
		}
	}

	$scope.deleteMarkerButton=function(marker){
		$scope.closeMarkerMode()
		$scope.deleteOnlineMarker(marker)
	}

	$scope.deleteOnlineMarker=function(marker){
		OnlineMarker.destroy(
			{online_markers_id: marker.data.id},{},
			function(){
                $scope.lecture.timeline.items.splice($scope.lecture.timeline.getIndexById(marker.id, 'marker'), 1)
			}
		)
	}

	var updateOnlineMarker=function(marker){
		OnlineMarker.update(
			{online_markers_id: marker.id},
			{online_marker:{
				time:marker.time, 
				title:marker.title,
				annotation:marker.annotation
			}}
		);
	}

 	var validateTime=function(time) { 		
		var int_regex = /^\d\d:\d\d:\d\d$/;  //checking format
		if(int_regex.test(time)) { 
		    var hhmm = time.split(':'); // split hours and minutes
		    var hours = parseInt(hhmm[0]); // get hours and parse it to an int
		    var minutes = parseInt(hhmm[1]); // get minutes and parse it to an int
		    var seconds = parseInt(hhmm[2]);
		    // check if hours or minutes are incorrect
		    var calculated_duration=(hours*60*60)+(minutes*60)+(seconds);
		    if(hours < 0 || hours > 24 || minutes < 0 || minutes > 59 || seconds< 0 || seconds > 59) {// display error
	       		return $translate('editor.incorrect_format_time')
		    }
		    else if( ($scope.lecture_player.controls.getDuration()) <= calculated_duration || calculated_duration <= 0 ){
	       		return $translate('editor.time_outside_range')
		    }
		}
	    else{
	   		return $translate('editor.incorrect_format_time')
	    }
	}
	
	var validateMarker= function(marker){
		var d = $q.defer();
	    var online_marker={}
	    online_marker.title=marker.title;
	    OnlineMarker.validateName(
	    	{online_markers_id: marker.id},
	    	{online_marker:online_marker},
	    	function(){
				d.resolve()
			},function(data){
				if(data.status==422)
				 	d.resolve(data.data.errors.join());
				else
					d.reject('Server Error');
			}
	    )
	    return d.promise;
	}

	var arrayToSeconds=function(a){
		return (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]) // minutes are worth 60 seconds. Hours are worth 60 minutes.
	}

	$scope.saveMarkerBtn=function(marker, options){
		if(options && options.exit)
			$scope.closeMarkerMode()
		validateMarker(marker).then(function(error){
			$scope.title_error = error
			$scope.time_error = validateTime(marker.formatedTime)
			if(!($scope.title_error || $scope.time_error) ){
				marker.time = arrayToSeconds(marker.formatedTime.split(':'))
				updateOnlineMarker(marker)
				if(!(options && options.exit))
					$scope.closeMarkerMode()
			}
		})						
	}

	$scope.closeMarkerMode=function(){
		$scope.editing_mode = false;
		$scope.hide_alerts = true;
		$scope.editing_type = null
		clearMarkerVariables()
		closePreviewInclass()
	}

	var clearMarkerVariables= function(){
		$scope.selected_marker=null
		$scope.$parent.$parent.selected_marker_id = null
	}

	$scope.togglePreviewInclass=function(){
		$scope.filtered_timeline_items? closePreviewInclass() : openPreviewInclass()			
	}

	var closePreviewInclass=function(){
		$scope.filtered_timeline_items=null
		$scope.selected_inclass_item = null
	}

	var openPreviewInclass=function(){
		$scope.filtered_timeline_items = angular.copy($scope.lecture.timeline.getItemsBetweenTime($scope.selected_quiz.start_time, $scope.selected_quiz.end_time))
		var quiz_index
		for(var item_index = 0; item_index < $scope.filtered_timeline_items.length; item_index++){
			var current_item = $scope.filtered_timeline_items[item_index]
			current_item.data.background = "lightgrey"
			current_item.data.color = "black"
            if(current_item.type=='quiz'){
            	current_item.data.inclass_title ='Self'
            	current_item.data.background = "#008CBA"
				current_item.data.color = "white"
				
				var start_item = {time:current_item.data.start_time, type:'marker', data: {time: current_item.data.start_time}}
				var end_item = {time:current_item.data.end_time, type:'marker', data: {time: current_item.data.end_time}}
				$scope.filtered_timeline_items.splice(0, 0, start_item);
				item_index++
				$scope.filtered_timeline_items.splice($scope.filtered_timeline_items.length, 0, end_item);

            	var group_quiz = angular.copy(current_item)
            	group_quiz.data.inclass_title ='Group'
            	group_quiz.data.background = "#43AC6A"
            	quiz_index = ++item_index
            	$scope.filtered_timeline_items.splice(quiz_index, 0, group_quiz);
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
        $scope.filtered_timeline_items[0].data.inclass_title = "Intro"
		$scope.filtered_timeline_items[0].data.background = "lightgrey"
		$scope.filtered_timeline_items[0].data.color = "black"
		console.log("done", $scope.filtered_timeline_items)
		$scope.goToInclassItem($scope.filtered_timeline_items[0])
	}

	$scope.goToInclassItem=function(item){
		$scope.selected_inclass_item = item
		$scope.lecture_player.controls.seek_and_pause($scope.selected_inclass_item.data.time)
		$scope.selected_quiz.hide_quiz_answers = $scope.selected_inclass_item.type!='quiz'
	}

	$scope.inclassNextItem=function(){
		var next_index = $scope.filtered_timeline_items.indexOf($scope.selected_inclass_item) + 1
		if(next_index < $scope.filtered_timeline_items.length)
			$scope.goToInclassItem($scope.filtered_timeline_items[next_index])
	}

	$scope.inclassPrevItem=function(){
		var prev_index = $scope.filtered_timeline_items.indexOf($scope.selected_inclass_item) - 1
		if(prev_index >= 0)
			$scope.goToInclassItem($scope.filtered_timeline_items[prev_index])
	}

}]);