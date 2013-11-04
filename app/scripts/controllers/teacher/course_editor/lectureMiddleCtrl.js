'use strict';

angular.module('scalearAngularApp')
    .controller('lectureMiddleCtrl', ['$state', '$stateParams', '$scope', '$http', 'Lecture', 'lecture' ,function ($state, $stateParams, $scope, $http, Lecture, lecture) {
    	console.log("into middle ")
    	console.log(lecture.data)
    $scope.lecture=lecture.data
	$scope.$emit('accordianUpdate',$scope.lecture.group_id);	
	$scope.quizTypesList=[{type:'MCQ', text:"MCQ - Multiple Correct Answers"},{type:'OCQ', text:"OCQ - One Correct Answer"}, {type:'drag', text:"Drag Into Order"}]	

	window.onresize=function resizeit(){
		if($(".ontop3").css("position")=="fixed")
			resize();
	};

	var loadingLeft = $("#middle").position().left
	var loadingTop  = $("#middle").position().top
	var loadingHeight=$("#middle").height();
	var loadingWidth =$("#details").position().left - $("#middle").position().left
	
	$scope.loadingStyle={
		'left':loadingLeft, 
		'top': loadingTop,
		'width': loadingWidth,
		'height': loadingHeight
	}

	var newh=$("#loading-image").position().top + $("#loading-image").height();
	var neww=$("#loading-image").position().left - 10;

	$scope.pleaseStyle={
		'top': newh,
		'left': neww
	}

    $state.go('course.course_editor.lecture.quizList');

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////FUNCTIONS//////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	$scope.load_video = function(){
		$scope.hideLoading=false;
		if($scope.player)
			Popcorn.destroy($scope.player)
		$scope.player = Popcorn.youtube( "#youtube", $scope.lecture.url+"&fs=0&html5=True&showinfo=0&rel=0&autoplay=1" ,{ width: 500, controls: 0});
		$scope.player.controls( false ); 
		$scope.player.on("loadeddata", function(){$scope.hideLoading=true; $scope.$apply();});
	}
	
	$scope.insert_quiz=function(quizType, questionType){
		$scope.pleaseWait = true;
		Lecture.new_quiz({
			lecture_id: $scope.lecture.id,
			time: Math.round($scope.player.currentTime()), 
			quiz_type: quizType, 
			ques_type: questionType
		},
		function(data){ //success
			console.log(data);
			$scope.showOnlineQuiz(data.quiz)
			$scope.quizList.push(data.quiz)
			$scope.pleaseWait = false;
		}, 
		function(){ //error
			$scope.pleaseWait = false;
		    alert("Could not insert new quiz, please check network connection.");
		})

	}

	/*, quiz_name ,quiz_duration ,quiz_id, lecture_id, ques_type, quiz_type, quiz_question*/
	$scope.showOnlineQuiz= function(quiz){

		console.log("SHOWONLINEQUIX")
		console.log(quiz)
		$scope.editingMode = true;
		$scope.selectedQuiz = quiz
		$scope.player.currentTime(quiz.time);
		$scope.player.pause();

		if(quiz.quiz_type =="invideo"){
			$scope.doubleClickMsg = "<br>Double click on the video to add a new answer";
			$scope.ontopStyle = {backgroundColor: "transparent"}
			getQuizData();
		}
		else{ // html quiz
			console.log("HTML quiz")
			$scope.doubleClickMsg=""
			$scope.ontopStyle = {backgroundColor: "white", overflow: 'auto'}
			getHTMLData()
		}
	}

 	var getQuizData =function(){
		Lecture.get_quiz_data(
			{"lecture_id":$scope.lecture.id ,"quiz": $scope.selectedQuiz.id},
			function(data){ //success
				console.log(data)
				$scope.selectedQuiz.answers= data.answers
				if($scope.selectedQuiz.question_type=="drag"){
					$scope.allPos=merge_drag_pos(data.answers)
					console.log($scope.allPos)
				}
			},
			function(){ //error
			    alert("Could not get data, please check network connection."); 
			}
		);
	}

	var getHTMLData=function(){
		Lecture.get_html_data(
			{"lecture_id":$scope.lecture.id ,"quiz":  $scope.selectedQuiz.id},
			function(data){ //success	
				if($scope.selectedQuiz.question_type == 'drag'){
					console.log(data)
					$scope.selectedQuiz.answers = []
					if(!data.answers.length)
						$scope.add_html_answer()
					else
						$scope.selectedQuiz.answers= expand_drag_answers(data.answers[0].id ,data.answers[0].answer)
				}
				else{
					$scope.selectedQuiz.answers= data.answers
					if(!$scope.selectedQuiz.answers.length)
						$scope.add_html_answer()				
				}			
			},
			function(){ //error
				alert("Could not get data, please check network connection.");
			}
		);
	}

	var expand_drag_answers=function(id, answers){
		console.log("add_drag_answer2 ");
		console.log(answers);
		var allAnswers=[];
		answers.forEach(function(answer){
			var new_ans=new_answer(answer);
			new_ans.id=id;
			console.log(new_ans);
			allAnswers.push(new_ans);
		});
		return allAnswers;
	}

	var merge_drag_answers=function(answers){
		var allAnswers=[]
		answers.forEach(function(elem){
			allAnswers.push(elem.answer)
			console.log(allAnswers)
		});
		return new_answer(allAnswers)
	}

	var merge_drag_pos=function(answers){
		var allPos=[]
		answers.forEach(function(elem){
			allPos.push(parseInt(elem.pos))
			console.log(allPos)
		});
		return allPos
	}

	var new_answer=function(ans, h, w,l, t){
		return {
			answer: ans || "",
			correct:false,
			explanation:"",
			online_quiz_id:$scope.selectedQuiz.id,
			height:h || 0,
			width:w  || 0,
			xcoor:l  || 0,
			ycoor:t  || 0
		}
	}

	$scope.add_html_answer=function(ans){
		$scope.new_answer=new_answer(ans)
		$scope.selectedQuiz.answers.push($scope.new_answer)

		if($scope.selectedQuiz.question_type != 'drag' || !$scope.selectedQuiz.answers[0].id)
			Lecture.add_html_answer(
				{lecture_id: $scope.lecture.id},
				{answer: $scope.new_answer},
				function(data){ //success
					console.log("add html answer success")
					console.log(data)
					$scope.new_answer.id= data.current.id
					console.log($scope.new_answer)
				},
				function(){ //error
		 			alert("Could not add element, please check network connection.");
				}
			);
	}

	$scope.remove_html_answer = function(index){
		if($scope.selectedQuiz.answers.length <=1)
			alert("Cannot delete, there must be alteast one answer")
		else if(confirm("Are you sure?"))
			if ($scope.selectedQuiz.question_type == 'drag')
				$scope.selectedQuiz.answers.splice(index, 1);
			else	
				Lecture.remove_html_answer(
					{lecture_id: $scope.lecture.id},
					{answer_id:$scope.selectedQuiz.answers[index].id},
					function(data){
						console.log(data)
						$scope.selectedQuiz.answers.splice(index, 1);
					},
					function(){
						 alert("Could not remove element, please check network connection.");
					}
				);			
	}

 	$scope.addDoubleClickBind= function(event){
 		var answer_width, answer_height
 		if($scope.selectedQuiz.question_type == 'drag'){
 			answer_width = 300
 			answer_height= 40
 		}
 		else{
 			answer_width = 13
 			answer_height= 13
 		}
	    var element = event.target;
	    if(element.id =="ontop"){
	    	console.log("adding on top ontop")

	    	var left= event.pageX - element.offsetParent.offsetLeft - 14 //event.offsetX - 6
		  	var top = event.pageY - element.offsetParent.offsetTop - 14 //event.offsetY - 6

		  	var the_top = top / (element.clientHeight -26);
	      	var the_left= left / element.clientWidth
	     	var the_width = answer_width/element.clientWidth;
	      	var the_height= answer_height/(element.clientHeight-26);
	      	$scope.add_answer("", the_height, the_width, the_left, the_top)
      }    	
	}

	$scope.add_answer= function(ans,h,w,l,t){
		console.log("adding answer")
  		$scope.new_answer=new_answer(ans,h,w,l,t)
  		$scope.selectedQuiz.answers.push($scope.new_answer)

		Lecture.add_answer(
			{lecture_id:$scope.lecture.id},
			{answer:$scope.new_answer, "flag":true},
			function(data){
				console.log(data)
				$scope.new_answer.id= data.current.id
				if($scope.selectedQuiz.question_type=="drag"){
					$scope.new_answer.pos = data.current.pos
					$scope.allPos=merge_drag_pos($scope.selectedQuiz.answers)
				}
				console.log($scope.new_answer)
			},
			function(){
				alert("Could not add answer, please check network connection.");
			});
	}
	
	$scope.remove_answer = function(index){
		console.log("removing answer")
		var backup = angular.copy($scope.selectedQuiz.answers[index])
		$scope.selectedQuiz.answers.splice(index, 1);
		console.log(backup)
		Lecture.remove_answer(
			{lecture_id: $scope.lecture.id},
			{answer_id:backup.id},
			function(data){
				console.log(data)
				if($scope.selectedQuiz.question_type=="drag"){
					$scope.allPos=merge_drag_pos($scope.selectedQuiz.answers)
					console.log($scope.allPos)
				}
			},
			function(){
				$scope.selectedQuiz.answers.push(backup)
				 alert("Could not remove element, please check network connection.");
			}
		);
	}

	var update_answers=function(ans, ques){
		console.log("savingAll")
		Lecture.update_answers(
			{lecture_id:$scope.lecture.id},
			{answer: ans, question: ques},
			function(data){ //success
				console.log(data)
			},
			function(){
	 		    alert("Could not save changes, please check network connection.");
			}
		);
	}

	$scope.save_btn = function(){		
		console.log("saving")
		var data
		if($scope.selectedQuiz.question_type == 'drag' && $scope.selectedQuiz.quiz_type == 'html'){
			var obj = merge_drag_answers($scope.selectedQuiz.answers)
			$scope.selectedQuiz.answers.forEach(function(ans){
				if(ans.id){
					obj.id = ans.id
					return 
				}
			})
			data=[obj]
		}
		else
			data = $scope.selectedQuiz.answers

		console.log(data)
		update_answers(data, $scope.selectedQuiz.question);
	}

	$scope.exit_btn = function(){
		$scope.editingMode = false;
		$scope.selectedQuiz={}
		console.log("exiting")		
	}	
 	
}]);
