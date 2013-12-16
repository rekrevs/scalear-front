'use strict';

angular.module('scalearAngularApp')
  .controller('quizMiddleCtrl',['$stateParams','$scope','Quiz', 'CourseEditor', '$translate','$log', function ($stateParams,$scope, Quiz, CourseEditor, $translate, $log) {
 
 	$scope.$watch('items_obj['+$stateParams.quiz_id+']', function(){
      if($scope.items_obj && $scope.items_obj[$stateParams.quiz_id]){
        $scope.quiz=$scope.items_obj[$stateParams.quiz_id]
        $scope.$emit('accordianUpdate',$scope.quiz.group_id);
      }
    })
 	$scope.alert={type:"error", msg:"lectures.got_some_errors"}
 
 	$scope.closeAlerts= function(){
 		$scope.hide_alerts=true;
 	}

 	var init = function(){
 		Quiz.getQuestions({course_id:$stateParams.course_id, quiz_id: $stateParams.quiz_id},function(data){
	 		$scope.questions=data.questions
		  	$scope.questions.forEach(function(question,index){
		  		if(question.question_type.toUpperCase() == 'DRAG'){
					question.answers = []
					if(!data.answers[index].length)
						$scope.addHtmlAnswer("", question)
					else
						question.answers= CourseEditor.expandDragAnswers(data.answers[index][0].id ,data.answers[index][0].content, "quiz", question.id)
				}else if(question.question_type == 'Free Text Question'){
					question.answers=[];
					$scope.addHtmlAnswer("",question)
				}
				else{
					question.answers = data.answers[index]
					if(!data.answers[index].length)
						$scope.addHtmlAnswer("",question)				
				}	
		  	});
	    });

	    shortcut.add("Enter",function(){
			var elem_name=angular.element(document.activeElement).attr('name')
			if(elem_name =='qlabel')
				$scope.addQuestion()
				$scope.$apply()
		},{"disable_in_input" : false});
 	}
 	
 	init();
 	
 	var updateQuestions=function(ans){
		$log.debug("savingAll");
		Quiz.updateQuestions(
			{course_id:$stateParams.course_id, quiz_id:$scope.quiz.id},
			{questions: ans},
			function(data){ //success
				$log.debug(data)
			},
			function(){
	 		    alert("Could not save changes, please check network connection.");
			}
		);
	}
 	
 	$scope.saveAll=function(){
 		if($scope.tform.$valid)
 		{
 		$scope.submitted=false;
 		$scope.hide_alerts=true;
		var data=[]
		for(var elem in $scope.questions)
		{
			
			if($scope.questions[elem].question_type.toUpperCase() == 'DRAG'){
				var obj = CourseEditor.mergeDragAnswers($scope.questions[elem].answers, "quiz", $scope.questions[elem].id)
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
 		updateQuestions(data);
 	}
 	else{
 		$scope.submitted=true;
 		$scope.hide_alerts=false;
 	}
 	}
 	
 	$scope.addQuestion=function(){
 			var new_question={quiz_id:$scope.quiz.id, content:"", question_type:"MCQ"}
 			new_question.answers = [];
 			$scope.questions.push(new_question);
 			$scope.addHtmlAnswer("", new_question);
 	}

	$scope.addHtmlAnswer=function(ans, question){
		$log.debug("in add answer");
		$log.debug("question is ");
		$log.debug(question);
		$scope.new_answer=CourseEditor.newAnswer(ans,"","","","","quiz", question.id)
		question.answers.push($scope.new_answer)
	}
 	
 	$scope.removeHtmlAnswer = function(index, question){
		if(question.answers.length>1)
		{
			if(confirm($translate('lectures.you_sure')))
				question.answers.splice(index, 1);
		}else{
			$log.debug("Can't delete the last answer..")
		}
	}
	
	$scope.removeQuestion = function(index){
 		 if(confirm($translate('lectures.you_sure')))
		  	$scope.questions.splice(index, 1);
	}
 
 }])