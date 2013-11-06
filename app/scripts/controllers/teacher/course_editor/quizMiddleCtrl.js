'use strict';

angular.module('scalearAngularApp')
  .controller('quizMiddleCtrl',['$stateParams','$rootScope','$scope','Quiz','quiz', 'CourseEditor', 'Answer','Question', function ($stateParams, $rootScope,$scope, Quiz,quiz, CourseEditor, Answer, Question) {
 
 	$scope.quiz= quiz.data;
 	$scope.alert={type:"error", msg:"You've got some errors."}
 
 	$scope.closeAlerts= function()
 	{
 		$scope.hideAlerts=true;
 	}
 	var init = function(){
 		Quiz.get_questions({quiz_id: $stateParams.quiz_id},function(data){
	 		$scope.questions=data.questions
		  	$scope.questions.forEach(function(question,index){
		  		if(question.question_type.toUpperCase() == 'DRAG'){
					question.answers = []
					if(!data.answers[index].length)
						$scope.add_html_answer("", question)
					else
						question.answers= CourseEditor.expand_drag_answers(data.answers[index][0].id ,data.answers[index][0].content, "quiz", question.id)
				}else if(question.question_type == 'Free Text Question'){
					question.answers=[];
					$scope.add_html_answer("",question)
				}
				else{
					question.answers = data.answers[index]
					if(!data.answers[index].length)
						$scope.add_html_answer("",question)				
				}	
		  	});
	    });
 	}
 	
 	init();
 	
 	var update_questions=function(ans){
		console.log("savingAll");
		Quiz.update_questions(
			{quiz_id:$scope.quiz.id},
			{questions: ans},
			function(data){ //success
				console.log(data)
			},
			function(){
	 		    alert("Could not save changes, please check network connection.");
			}
		);
	}
 	
 	$scope.save_all=function(){
 		if($scope.tform.$valid)
 		{
 		$scope.submitted=false;
 		$scope.hideAlerts=true;
		var data=[]
		for(var elem in $scope.questions)
		{
			
			if($scope.questions[elem].question_type.toUpperCase() == 'DRAG'){
				var obj = CourseEditor.merge_drag_answers($scope.questions[elem].answers, "quiz", $scope.questions[elem].id)
				$scope.questions[elem].answers.forEach(function(ans){
					if(ans.id && obj.id==null){
						obj.id = ans.id
						return 
					}
				})
				var y=angular.copy($scope.questions[elem])
				y.answers=[obj]
				data[elem]= y
			}
			else if($scope.questions[elem].question_type == 'Free Text Question')
			{
				var y=angular.copy($scope.questions[elem])
				y.answers=[]
				data[elem]= y
			}
			else
				data[elem] = $scope.questions[elem]
		}
 		update_questions(data);
 	}
 	else{
 		$scope.submitted=true;
 		$scope.hideAlerts=false;
 	}
 	}
 	
 	$scope.add_question=function(){
 			var new_question={quiz_id:$scope.quiz.id, content:"", question_type:"MCQ"}
 			new_question.answers = [];
 			$scope.questions.push(new_question);
 			$scope.add_html_answer("", new_question);
 	}

	$scope.add_html_answer=function(ans, question){
		console.log("in add answer");
		console.log("question is ");
		console.log(question);
		$scope.new_answer=CourseEditor.new_answer(ans,"","","","","quiz", question.id)
		question.answers.push($scope.new_answer)
	}
 	
 	$scope.remove_html_answer = function(index, question){
		if(question.answers.length>1)
		{
			if(confirm("Are you sure?"))
				question.answers.splice(index, 1);
		}else{
			console.log("Can't delete the last answer..")
		}
	}
	
	$scope.remove_question = function(index){
 		 if(confirm("Are you sure?"))
		  	$scope.questions.splice(index, 1);
	}
 
 }])