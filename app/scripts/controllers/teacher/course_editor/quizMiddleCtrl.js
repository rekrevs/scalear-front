'use strict';

angular.module('scalearAngularApp')
  .controller('quizMiddleCtrl',['$stateParams','$rootScope','$scope','Quiz','quiz', 'CourseEditor', 'Answer','Question', function ($stateParams, $rootScope,$scope, Quiz,quiz, CourseEditor, Answer, Question) {
 
 	$scope.quiz= quiz.data;
 
 	var init = function(){
 		Quiz.get_questions({quiz_id: $stateParams.quiz_id},function(data){
	 		$scope.questions=data.questions
		  	$scope.questions.forEach(function(question,index){
		  		if(question.question_type.toUpperCase() == 'DRAG'){
		  			console.log("answers");
					console.log(data.answers[index]);
					question.answers = []
					if(!data.answers[index].length)
						$scope.add_html_answer("", question)
					else
						question.answers= CourseEditor.expand_drag_answers(data.answers[index][0].id ,data.answers[index][0].content, "quiz", question.id)
				}
				else{
					question.answers = data.answers[index]
					if(!data.answers[index].length)
						$scope.add_html_answer("",question)				
				}	
		  		//module.items.forEach(function(item,ind){
		  			//item.className= data.className[index][ind]
		  		//});  		
		  	});
	 		console.log($scope.questions);
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
 		console.log("in save all");
 		
 		
 		console.log("saving")
		var data=[]
		for(var elem in $scope.questions)
		{
			console.log($scope.questions[elem]);
			//data[$scope.questions[elem]]=[]
			if($scope.questions[elem].question_type.toUpperCase() == 'DRAG'){
				console.log($scope.questions[elem].answers);
				var obj = CourseEditor.merge_drag_answers($scope.questions[elem].answers, "quiz", $scope.questions[elem].id)
				console.log("obj isssss");
				console.log(obj);
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
				else
					data[elem] = $scope.questions[elem]

			console.log(data)
			
		}
	
 		update_questions(data);
 	}
 	
 	$scope.add_question=function(){
 		console.log("in add question");
 		Question.create({quiz_id: $scope.quiz.id},{question: {content:"", question_type:"MCQ", show:false}},
 		function(data){
 			var new_question=data
 			$scope.questions.push(data);
 			new_question.answers = [];
 			
 		},
		function(){ //error
		 	alert("Could not add element, please check network connection.");
		});
 	}

	$scope.add_html_answer=function(ans, question){
		console.log("in add answer");
		console.log("question is "+question);
		$scope.new_answer=CourseEditor.new_answer(ans,"","","","","quiz",question.id)
		question.answers.push($scope.new_answer)

		if(question.question_type.toUpperCase() != 'DRAG' || !question.answers[0].id)  // to give it an id.
			Answer.create(
				{question_id: question.id},
				{answer: $scope.new_answer},
				function(data){ //success
					console.log("add html answer success")
					console.log(data)
					$scope.new_answer.id= data.id
					console.log($scope.new_answer)
				},
				function(){ //error
		 			alert("Could not add element, please check network connection.");
				}
			);
	}
 	
 	$scope.remove_html_answer = function(index, question){
 		
 		console.log("in remove answer "+index);
 		
		if(confirm("Are you sure?"))
			if (question.question_type.toUpperCase() == 'DRAG' && question.answers.length==1)
				question.answers.splice(index, 1);
			else	
				Answer.destroy(
					{answer_id:question.answers[index].id, question_id: question.id},
					{},
					function(data){
						console.log(data)
						question.answers.splice(index, 1);
					},
					function(){
						 alert("Could not remove element, please check network connection.");
					}
				);			
	}
	
	$scope.remove_question = function(index){
 		
 		console.log("in remove question "+index);
 		
		 if(confirm("Are you sure?"))
				 Question.destroy(
					 {question_id: $scope.questions[index].id},
					 {},
					 function(data){
						 $scope.questions.splice(index, 1);
					 },
					 function(){
						  alert("Could not remove element, please check network connection.");
					 }
				 );			
	}
 
 }])