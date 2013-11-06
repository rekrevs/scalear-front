'use strict';

angular.module('scalearAngularApp')
    .controller('lectureMiddleCtrl', ['$state', '$stateParams', '$scope', '$http', '$window', 'Lecture', 'lecture','CourseEditor' ,function ($state, $stateParams, $scope, $http, $window, Lecture, lecture, CourseEditor) {

    $scope.lecture=lecture.data
    $scope.quiz_layer={}
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

	// window.onresize=function resizeit(){
	// 	if($(".ontop3").css("position")=="fixed")
	// 		resize();
	// };

    $state.go('course.course_editor.lecture.quizList');

//////////////////////////////////////FUNCTIONS/////////////////////////////////////////////

	$scope.closeAlerts= function(){
 		$scope.hide_alerts=true;
 	}
	$scope.loadVideo = function(){
		$scope.hide_overlay=false;
		if($scope.player)
			Popcorn.destroy($scope.player)
		$scope.player = Popcorn.youtube( "#youtube", $scope.lecture.url+"&fs=0&html5=True&showinfo=0&rel=0&autoplay=1" ,{ width: 500, controls: 0});
		$scope.player.controls( false ); 
		$scope.player.on("loadeddata", function(){$scope.hide_overlay=true; $scope.$apply();});
	}
	
	$scope.insertQuiz=function(quiz_type, question_type){
		$scope.quiz_loading = true;
		Lecture.newQuiz({
			lecture_id: $scope.lecture.id,
			time: Math.round($scope.player.currentTime()), 
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
		$scope.player.currentTime(quiz.time);
		$scope.player.pause();

		if(quiz.quiz_type =="invideo"){
			$scope.double_click_msg = "<br>Double click on the video to add a new answer";
			$scope.quiz_layer.backgroundColor="transparent"
			getQuizData();
		}
		else{ // html quiz
			console.log("HTML quiz")
			$scope.double_click_msg=""
			$scope.quiz_layer.backgroundColor= "white"
			$scope.quiz_layer.overflow= 'auto'
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
	    var element = event.target;
	    if(element.id =="ontop"){
	    	console.log("adding on top ontop")

	    	var left= event.pageX - element.offsetParent.offsetLeft - 14 //event.offsetX - 6
		  	var top = event.pageY - element.offsetParent.offsetTop - 14 //event.offsetY - 6

		  	var the_top = top / (element.clientHeight -26);
	      	var the_left= left / element.clientWidth
	     	var the_width = answer_width/element.clientWidth;
	      	var the_height= answer_height/(element.clientHeight-26);
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
 	

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$scope.resizeSmall = function()
{	
	var factor= $scope.lecture.aspect_ratio=="widescreen"? 16.0/9.0 : 4.0/3.0;

	$scope.show_sidebar = false

	angular.element(".sidebar").children().appendTo("#all_tables");
	angular.element("body").css("overflow","auto");

	$scope.video_style={
		"position":"static",
		"width":'500px',
		"height":(500*1.0/factor + 26) +'px'
	};

	var layer={
		"width":"500px",
		"height":(500*1.0/factor + 26)+ 'px',
		"margin-left": "0px"
	}

	angular.extend($scope.quiz_layer, layer)		
}

$scope.resize = function()
{	
	var factor= $scope.lecture.aspect_ratio=="widescreen"? 16.0/9.0 : 4.0/3.0;
	var win = angular.element($window)

	$scope.show_sidebar = true

	angular.element("#all_tables").children().appendTo(".sidebar");
	angular.element("body").css("overflow","hidden");

	win.scrollTop("0px")

	$scope.video_style={
		"top":0, 
		"left":0, 
		"position":"fixed",
		"width":win.width()-400,
		"height":win.height()
	};

	var video_width = (win.height()-26)*factor
	var layer={}
	if(video_width>win.width()-400){ // if width will get cut out.
		
		layer={
			"top":0,
			"left":0,
			"width":win.width()-400,
			"height":(win.width()-400)*1.0/factor +26,
		}		
	}
	else{		
		var mergin_left= ((win.width()-400) - video_width)/2.0;
		layer={
			"top":0,
			"left":0,
			"width":video_width,
			"height":win.height(),
			"margin-left": mergin_left+"px"
		}		
	 }

	 angular.extend($scope.quiz_layer, layer)

	// if there is a quiz right now
	// if($("#editing").html()!="" &&  typeof storedData!=="undefined") //editing a quiz (not including html quiz)
	// {
	// 	for(x in storedData)
	// 	{
	// 		var toadd= $("#"+x)		
			
	// 		if(quesType=="drag")
	// 		{
	// 			var top3= parseFloat(list_of_points[x][0]*($(".ontop").height()-26));
	// 			var left= parseFloat((list_of_points[x][1])*$(".ontop").width());
	// 			toadd.css({"top":top3+"px", "left":left+"px"});
	// 			toadd.width(parseFloat(list_of_points[x][3]*$(".ontop").width()));
	// 			toadd.height(parseFloat(list_of_points[x][2]*($(".ontop").height()-26)));
	// 			toadd.children().children("textarea").width(toadd.width()-50);
	// 			toadd.children().children("textarea").height(toadd.height()-20);
	// 		}
	// 		else{
	// 			var top3= parseFloat(list_of_points[x][0]*($(".ontop").height()-26));
	// 			var left= parseFloat((list_of_points[x][1])*$(".ontop").width());
	// 			w=parseFloat(list_of_points[x][3]*$(".ontop").width())
	// 			h=parseFloat(list_of_points[x][2]*($(".ontop").height()-26));
	// 			toadd_left=(w-13)/2
	// 			toadd_top=(h-13)/2
	// 			toadd.width(13);
	// 			toadd.height(13);
	// 			toadd.css({"top":top3+toadd_top+"px", "left":left+toadd_left+"px"});
	// 		}
	// 	}
	// }
	// 					
	// take care of ontop, correct aspect ratio, background..position., and correct point position
	// on resize, make small again, get fullscreen and minimize button working.
	// make sure progress bar working right..
	// make player page and flash entire size but video correct aspect ratio.
	//$("#timer_video_youVideo").height($(window).height());

	// ok so when display points, display fil makan el sa7 AND when they are there already and we're resizing.
	// play by default when enter page.
	// but before kol da store points aslan as %
}


}]);


