'use strict';

angular.module('scalearAngularApp')
    .controller('lectureMiddleCtrl', ['$state', '$stateParams', '$scope', '$http', '$timeout', '$window', 'Lecture', 'lecture','CourseEditor' ,function ($state, $stateParams, $scope, $http, $timeout, $window, Lecture, lecture, CourseEditor) {

    $scope.lecture=lecture.data
    $scope.quiz_layer={}
    $scope.lecture_player_controls={}
    $scope.alert={
    	type:"error", 
    	msg:"You've got some errors."
    }
	$scope.quiz_types_list=[
		{type:'MCQ', text:"MCQ - Multiple Correct Answers"},
		{type:'OCQ', text:"OCQ - One Correct Answer"}, 
		{type:'drag',text:"Drag Into Order"}
	]	
	
	$scope.$emit('accordianUpdate',$scope.lecture.group_id);

	angular.element($window).bind('resize',
		function(){
			if($scope.fullscreen){
				$scope.resizeBig(); 
				$scope.$apply()
			}
		})	

    $state.go('course.course_editor.lecture.quizList');

//////////////////////////////////////FUNCTIONS/////////////////////////////////////////////

	$scope.closeAlerts= function(){
 		$scope.hide_alerts=true;
 	}

 	$scope.hideOverlay= function(){
 		$scope.hide_overlay = true
 	}

	$scope.insertQuiz=function(quiz_type, question_type){
		$scope.quiz_loading = true;
		Lecture.newQuiz({
			lecture_id: $scope.lecture.id,
			time: Math.floor($scope.lecture_player_controls.getTime()), 
			quiz_type: quiz_type, 
			ques_type: question_type
		},
		function(data){ //success
			console.log(data);
			$scope.showOnlineQuiz(data.quiz)
			$scope.quiz_list.push(data.quiz)
			$scope.quiz_loading = false;
		}, 
		function(){ //error
			$scope.quiz_loading = false;
		    alert("Could not insert new quiz, please check network connection.");
		})

	}

	$scope.showOnlineQuiz= function(quiz){

		console.log("SHOWONLINEQUIX")
		console.log(quiz)
		$scope.editing_mode = true;
		$scope.selected_quiz = quiz
		$scope.lecture_player_controls.seek(quiz.time,$scope.lecture.url)
		// $scope.player.currentTime(quiz.time);
		// $scope.lecture_player_controls.pause();

		if(quiz.quiz_type =="invideo"){
			$scope.double_click_msg = "<br>Double click on the video to add a new answer";
			$scope.quiz_layer.backgroundColor="transparent"
			$scope.quiz_layer.overflow= ''
			getQuizData();
		}
		else{ // html quiz
			console.log("HTML quiz")
			$scope.double_click_msg=""
			$scope.quiz_layer.backgroundColor= "white"
			$scope.quiz_layer.overflowX= 'hidden'
            $scope.quiz_layer.overflowY= 'auto'
			getHTMLData()
		}
	}

 	var getQuizData =function(){
		Lecture.getQuizData(
			{"lecture_id":$scope.lecture.id ,"quiz": $scope.selected_quiz.id},
			function(data){ //success
				console.log(data)
				$scope.selected_quiz.answers= data.answers
				if($scope.selected_quiz.question_type=="drag"){
					$scope.allPos=mergeDragPos(data.answers)
					console.log($scope.allPos)
				}
			},
			function(){ //error
			    alert("Could not get data, please check network connection."); 
			}
		);
	}

	var getHTMLData=function(){
		Lecture.getHtmlData(
			{"lecture_id":$scope.lecture.id ,"quiz":  $scope.selected_quiz.id},
			function(data){ //success	
				if($scope.selected_quiz.question_type == 'drag'){
					console.log(data)
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
				alert("Could not get data, please check network connection.");
			}
		);
	}

	var mergeDragPos=function(answers){
		var all_pos=[]
		answers.forEach(function(elem){
			all_pos.push(parseInt(elem.pos))
			console.log(all_pos)
		});
		return all_pos
	}

	
	$scope.addHtmlAnswer=function(ans){
		$scope.new_answer=CourseEditor.newAnswer(ans,"","","","","lecture", $scope.selected_quiz.id)
		$scope.selected_quiz.answers.push($scope.new_answer)
	}

	$scope.removeHtmlAnswer = function(index){
		if($scope.selected_quiz.answers.length <=1)
			alert("Cannot delete, there must be alteast one answer")
		else if(confirm("Are you sure?"))
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
	    //console.log(element.attr('id').contains("ontop"))
	    if(element.attr('id') =="ontop"){
	    	console.log("adding on top ontop")

	    	var left= event.pageX - element.offset().left - 6//event.offsetX - 6
		  	var top = event.pageY - element.offset().top - 6 //event.offsetY - 6

	    	console.log(event)
	    	console.log(element)
	    	console.log(left+" "+top)

		  	var the_top = top / (element.height() -26);
	      	var the_left= left / element.width()
	     	var the_width = answer_width/element.width();
	      	var the_height= answer_height/(element.height()-26);
	      	$scope.addAnswer("", the_height, the_width, the_left, the_top)
      }    	
	}

	$scope.addAnswer= function(ans,h,w,l,t){
		console.log("adding answer")
  		$scope.new_answer=CourseEditor.newAnswer(ans,h,w,l,t,"lecture", $scope.selected_quiz.id)
  		$scope.selected_quiz.answers.push($scope.new_answer)

		Lecture.addAnswer(
			{lecture_id:$scope.lecture.id},
			{answer:$scope.new_answer, "flag":true},
			function(data){
				console.log(data)
				$scope.new_answer.id= data.current.id
				if($scope.selected_quiz.question_type=="drag"){
					$scope.new_answer.pos = data.current.pos
					$scope.allPos=mergeDragPos($scope.selected_quiz.answers)
				}
				console.log($scope.new_answer)
			},
			function(){
				alert("Could not add answer, please check network connection.");
			});
	}
	
	$scope.removeAnswer = function(index){
		console.log("removing answer")
		var backup = angular.copy($scope.selected_quiz.answers[index])
		$scope.selected_quiz.answers.splice(index, 1);
		console.log(backup)
		Lecture.removeAnswer(
			{lecture_id: $scope.lecture.id},
			{answer_id:backup.id},
			function(data){
				console.log(data)
				if($scope.selected_quiz.question_type=="drag"){
					$scope.allPos=mergeDragPos($scope.selected_quiz.answers)
					console.log($scope.allPos)
				}
			},
			function(){
				$scope.selected_quiz.answers.push(backup)
				 alert("Could not remove element, please check network connection.");
			}
		);
	}

	var updateAnswers=function(ans, title){
		console.log("savingAll")
		Lecture.updateAnswers(
			{lecture_id:$scope.lecture.id,
			online_quiz_id: $scope.selected_quiz.id},
			{answer: ans, quiz_title:title },
			function(data){ //success
				console.log(data)
			},
			function(){
	 		    alert("Could not save changes, please check network connection.");
			}
		);
	}

	$scope.saveBtn = function(){
		
		if($scope.answer_form.$valid || $scope.selected_quiz.quiz_type != 'html')
 		{
	 		$scope.submitted=false;
	 		$scope.hide_alerts=true;
			console.log("saving")
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
		$scope.selected_quiz={}
		console.log("exiting")		
	}	
 	
	$scope.resizeSmall = function()
	{	
		var factor= $scope.lecture.aspect_ratio=="widescreen"? 16.0/9.0 : 4.0/3.0;
		$scope.fullscreen = false

		angular.element(".sidebar").children().appendTo(".quiz_list");
		angular.element("body").css("overflow","auto");
		angular.element("body").css("position","");


		$scope.video_style={
			"position":"static",
			"width":'500px',
			"height":(500*1.0/factor + 26) +'px',
			"z-index": 0
		};

		var layer={		
			"top":"",
			"left":"",
			"position":"absolute",
			"width":"500px",
			"height":(500*1.0/factor + 26)+ 'px',
			"margin-left": "0px",
			"margin-top": "0px",
			"z-index":2
		}

		angular.extend($scope.quiz_layer, layer)
		
		$timeout(function(){$scope.$emit("updatePosition")})		
	}

	$scope.resizeBig = function()
	{	
		console.log("resizeing")
		var factor= $scope.lecture.aspect_ratio=="widescreen"? 16.0/9.0 : 4.0/3.0;
		var win = angular.element($window)

		$scope.fullscreen = true

		angular.element(".quiz_list").children().appendTo(".sidebar");
		angular.element("body").css("overflow","hidden");
		angular.element("body").css("position","fixed")

		win.scrollTop("0px")

		$scope.video_style={
			"top":0, 
			"left":0, 
			"position":"fixed",
			"width":win.width()-400,
			"height":win.height(),
			"z-index": 1030
		};

		var video_width = (win.height()-26)*factor
		var video_heigt = (win.width()-400)*1.0/factor +26
		var layer={}
		if(video_width>win.width()-400){ // if width will get cut out.
			console.log("width cutt offff")
			var margin_top = (win.height() - video_heigt)/2.0;
			layer={
				"position":"fixed",
				"top":0,
				"left":0,
				"width":win.width()-400,
				"height":(win.width()-400)*1.0/factor +26,
				"margin-top": margin_top+"px",
				"margin-left":"0px",
				"z-index": 1031
			}		
		}
		else{		
			var margin_left= ((win.width()-400) - video_width)/2.0;
			layer={
				"position":"fixed",
				"top":0,
				"left":0,
				"width":video_width,
				"height":win.height(),
				"margin-left": margin_left+"px",
				"margin-top":"0px",
				"z-index": 1031
			}		
		 }

		 angular.extend($scope.quiz_layer, layer)

	 	$timeout(function(){$scope.$emit("updatePosition")})
	}


}]);


