'use strict';

angular.module('scalearAngularApp')
    .controller('lectureMiddleCtrl', ['$state', '$stateParams', '$scope', '$http', '$window', 'Lecture', 'lecture','CourseEditor' ,function ($state, $stateParams, $scope, $http, $window, Lecture, lecture, CourseEditor) {

    $scope.lecture=lecture.data
    $scope.quiz_layer={}
    $scope.alert={
    	type:"error", 
    	msg:"You've got some errors."
    }
	$scope.quizTypesList=[
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
 		$scope.hideAlerts=true;
 	}
	$scope.load_video = function(){
		$scope.hide_overlay=false;
		if($scope.player)
			Popcorn.destroy($scope.player)
		$scope.player = Popcorn.youtube( "#youtube", $scope.lecture.url+"&fs=0&html5=True&showinfo=0&rel=0&autoplay=1" ,{ width: 500, controls: 0});
		$scope.player.controls( false ); 
		$scope.player.on("loadeddata", function(){$scope.hide_overlay=true; $scope.$apply();});
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

	$scope.showOnlineQuiz= function(quiz){

		console.log("SHOWONLINEQUIX")
		console.log(quiz)
		$scope.editingMode = true;
		$scope.selectedQuiz = quiz
		$scope.player.currentTime(quiz.time);
		$scope.player.pause();

		if(quiz.quiz_type =="invideo"){
			$scope.doubleClickMsg = "<br>Double click on the video to add a new answer";
			$scope.quiz_layer.backgroundColor="transparent"
			getQuizData();
		}
		else{ // html quiz
			console.log("HTML quiz")
			$scope.doubleClickMsg=""
			$scope.quiz_layer.backgroundColor= "white"
			$scope.quiz_layer.overflow= 'auto'
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
						$scope.selectedQuiz.answers= CourseEditor.expand_drag_answers(data.answers[0].id ,data.answers[0].answer, "lecture", $scope.selectedQuiz.id)
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

	var merge_drag_pos=function(answers){
		var allPos=[]
		answers.forEach(function(elem){
			allPos.push(parseInt(elem.pos))
			console.log(allPos)
		});
		return allPos
	}

	
	$scope.add_html_answer=function(ans){
		$scope.new_answer=CourseEditor.new_answer(ans,"","","","","lecture", $scope.selectedQuiz.id)
		$scope.selectedQuiz.answers.push($scope.new_answer)
	}

	$scope.remove_html_answer = function(index){
		if($scope.selectedQuiz.answers.length <=1)
			alert("Cannot delete, there must be alteast one answer")
		else if(confirm("Are you sure?"))
			$scope.selectedQuiz.answers.splice(index, 1);			
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
  		$scope.new_answer=CourseEditor.new_answer(ans,h,w,l,t,"lecture", $scope.selectedQuiz.id)
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

	var update_answers=function(ans, title){
		console.log("savingAll")
		Lecture.update_answers(
			{lecture_id:$scope.lecture.id,
			online_quiz_id: $scope.selectedQuiz.id},
			{answer: ans, quiz_title:title },
			function(data){ //success
				console.log(data)
			},
			function(){
	 		    alert("Could not save changes, please check network connection.");
			}
		);
	}

	$scope.save_btn = function(){
		
		if($scope.answer_form.$valid || $scope.selectedQuiz.quiz_type != 'html')
 		{
	 		$scope.submitted=false;
	 		$scope.hideAlerts=true;
			console.log("saving")
			var data
			if($scope.selectedQuiz.question_type.toUpperCase() == 'DRAG' && $scope.selectedQuiz.quiz_type == 'html'){
				var obj = CourseEditor.merge_drag_answers($scope.selectedQuiz.answers, "lecture", $scope.selectedQuiz.id)
				$scope.selectedQuiz.answers.forEach(function(ans){
					if(ans.id && obj.id==null){
						obj.id = ans.id
						return 
					}
				})
				data=[obj]
			}
			else
				data = $scope.selectedQuiz.answers

			update_answers(data, $scope.selectedQuiz.question);
		}
		else{
			$scope.submitted=true;
			$scope.hideAlerts=false;
		}
	}

	$scope.exit_btn = function(){
		$scope.editingMode = false;
		$scope.selectedQuiz={}
		console.log("exiting")		
	}	
 	

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$scope.resize_small = function()
{	
	var factor= $scope.lecture.aspect_ratio=="widescreen"? 16.0/9.0 : 4.0/3.0;

	$scope.showSidebar = false

	angular.element(".sidebar").children().appendTo("#all_tables");
	angular.element("body").css("overflow","auto");

	$scope.videoStyle={
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

	$scope.showSidebar = true

	angular.element("#all_tables").children().appendTo(".sidebar");
	angular.element("body").css("overflow","hidden");

	win.scrollTop("0px")

	$scope.videoStyle={
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


