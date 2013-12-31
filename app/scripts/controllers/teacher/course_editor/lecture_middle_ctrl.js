'use strict';

angular.module('scalearAngularApp')
    .controller('lectureMiddleCtrl', ['$state', '$stateParams', '$scope', 'Lecture', 'CourseEditor', '$translate','$log','$rootScope','ErrorHandler','$timeout', function ($state, $stateParams, $scope, Lecture, CourseEditor, $translate, $log,$rootScope, ErrorHandler, $timeout) {

    // $scope.lecture=lecture.data
    $scope.$watch('items_obj['+$stateParams.lecture_id+']', function(){
      if($scope.items_obj && $scope.items_obj[$stateParams.lecture_id]){
        $scope.lecture=$scope.items_obj[$stateParams.lecture_id]
        $scope.$emit('accordianUpdate',$scope.lecture.group_id);
      }
    })

	
    $scope.resize={}
    $scope.video_layer={}
    $scope.quiz_layer={}
    $scope.lecture_player={}
    $scope.lecture_player.events={}
    $scope.alert={
    	type:"error", 
    	msg: "lectures.got_some_errors"
    }
	$scope.quiz_types_list=[
		{type:'MCQ', text:"insert_mcq"},
		{type:'OCQ', text:"insert_ocq"}, 
		{type:'drag',text:"insert_drag"}
	]
	
    $state.go('course.course_editor.lecture.quizList');

//////////////////////////////////////FUNCTIONS/////////////////////////////////////////////

	$scope.closeAlerts= function(){
 		$scope.hide_alerts=true;
 	}

 	$scope.lecture_player.events.onReady= function(){
 		$scope.hide_overlay = true
 	}

	$scope.insertQuiz=function(quiz_type, question_type){
		var insert_time= $scope.lecture_player.controls.getTime()
		var duration = $scope.lecture_player.controls.getDuration()

		if(insert_time < 1 )
			insert_time = 1
		else if (insert_time >= duration)
			insert_time = duration - 1

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
			$scope.showOnlineQuiz(data.quiz)
			$scope.quiz_list.push(data.quiz)
			$scope.quiz_loading = false;
		}, 
		function(){ //error
			$scope.quiz_loading = false;
		    //alert("Could not insert new quiz, please check network connection.");
		})

	}

	$scope.showOnlineQuiz= function(quiz){

		$log.debug("SHOWONLINEQUIX")
		$log.debug(quiz)
		$scope.hide_alerts = true;
		$scope.submitted= false
		$scope.editing_mode = true;
		$scope.selected_quiz = quiz
		$scope.lecture_player.controls.seek_and_pause(quiz.time)

		if(quiz.quiz_type =="invideo"){
			$scope.double_click_msg = "online_quiz.double_click_new_answer";
			$scope.quiz_layer.backgroundColor="transparent"
			$scope.quiz_layer.overflowX= ''
			$scope.quiz_layer.overflowY= ''
			getQuizData();
		}
		else{ // html quiz
			$log.debug("HTML quiz")
			$scope.double_click_msg=""
			$scope.quiz_layer.backgroundColor= "white"
			$scope.quiz_layer.overflowX= 'hidden'
            $scope.quiz_layer.overflowY= 'auto'
			getHTMLData()
		}
	}

 	var getQuizData =function(){
		Lecture.getQuizData(
			{"course_id":$stateParams.course_id, "lecture_id":$scope.lecture.id ,"quiz": $scope.selected_quiz.id},
			function(data){ //success
				$log.debug(data)
				$scope.selected_quiz.answers= data.answers
				if($scope.selected_quiz.question_type=="drag"){
					$scope.allPos=mergeDragPos(data.answers)
					$log.debug($scope.allPos)
				}
			},
			function(){ //error
			 //   alert("Could not get data, please check network connection."); 
			}
		);
	}

	var getHTMLData=function(){
		Lecture.getHtmlData(
			{"course_id":$stateParams.course_id, "lecture_id":$scope.lecture.id ,"quiz":  $scope.selected_quiz.id},
			function(data){ //success	
				if($scope.selected_quiz.question_type == 'drag'){
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
			function(){ //error
				//alert("Could not get data, please check network connection.");
			}
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
 		var answer_width, answer_height
 		if($scope.selected_quiz.question_type == 'drag'){
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
	      	$scope.addAnswer("", the_height, the_width, the_left, the_top)
      }    	
	}

	$scope.addAnswer= function(ans,h,w,l,t){
		$log.debug("adding answer")
  		$scope.new_answer=CourseEditor.newAnswer(ans,h,w,l,t,"lecture", $scope.selected_quiz.id)
  		$scope.selected_quiz.answers.push($scope.new_answer)
  		if($scope.selected_quiz.question_type=="drag"){
			//$scope.new_answer.pos = data.current.pos
			var max = Math.max.apply(Math,$scope.allPos)
			max = max ==-Infinity? -1 : max
			$log.debug("max= "+max)
			$scope.new_answer.pos=max+1
		    $scope.allPos=mergeDragPos($scope.selected_quiz.answers)
		}
		// Lecture.addAnswer(
			// {course_id:$stateParams.course_id,
			// lecture_id:$scope.lecture.id},
			// {answer:$scope.new_answer, "flag":true},
			// function(data){
				// $log.debug(data)
				// $scope.new_answer.id= data.current.id
				// if($scope.selected_quiz.question_type=="drag"){
					// $scope.new_answer.pos = data.current.pos
					// $scope.allPos=mergeDragPos($scope.selected_quiz.answers)
				// }
				// $log.debug($scope.new_answer)
			// },
			// function(){
				// //alert("Could not add answer, please check network connection.");
			// });
	}
	
	$scope.removeAnswer = function(index){
		$log.debug("removing answer")
		var backup = angular.copy($scope.selected_quiz.answers[index])
		$scope.selected_quiz.answers.splice(index, 1);
		$log.debug(backup)
		 if($scope.selected_quiz.question_type=="drag"){
			$scope.allPos=mergeDragPos($scope.selected_quiz.answers)
			$log.debug($scope.allPos)
		}
		// Lecture.removeAnswer(
			// {course_id:$stateParams.course_id,
			// lecture_id: $scope.lecture.id},
			// {answer_id:backup.id},
			// function(data){
				// $log.debug(data)
				// if($scope.selected_quiz.question_type=="drag"){
					// $scope.allPos=mergeDragPos($scope.selected_quiz.answers)
					// $log.debug($scope.allPos)
				// }
			// },
			// function(){
				// $scope.selected_quiz.answers.push(backup)
				// // alert("Could not remove element, please check network connection.");
			// }
		// );
	}

	var updateAnswers=function(ans, title){
		$log.debug("savingAll")
		Lecture.updateAnswers(
			{
			course_id:$stateParams.course_id,
			lecture_id:$scope.lecture.id,
			online_quiz_id: $scope.selected_quiz.id
			},
			{answer: ans, quiz_title:title },
			function(data){ //success
				if($scope.selected_quiz.quiz_type =="invideo")
					getQuizData();
				else
					getHTMLData();
				
			},
			function(){
	 		    //alert("Could not save changes, please check network connection.");
			}
		);
	}
	
	var is_form_valid = function()
	{
		var correct=0;
		for( var element in $scope.selected_quiz.answers)
		{
			if(!$scope.selected_quiz.answers[element].answer || $scope.selected_quiz.answers[element].answer.trim()==="")
				return false
			if($scope.selected_quiz.question_type.toUpperCase()=="DRAG")
			correct=1
			else	
			correct= $scope.selected_quiz.answers[element].correct || correct;
		}
		return correct===0?false:true;
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
					if(ans.id && obj.id===null){
						obj.id = ans.id
						return 
					}
				})
				data=[obj]
			}
			else
				data = $scope.selected_quiz.answers

			updateAnswers(data, $scope.selected_quiz.question);
		}
		else{
			$scope.submitted=true;
			$scope.hide_alerts=false;
		}
	}

	$scope.exitBtn = function(){
		$scope.editing_mode = false;
		$scope.hide_alerts = true;
		$scope.submitted= false
		$scope.selected_quiz={}
		$log.debug("exiting")		
	}

}]);


