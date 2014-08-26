'use strict';

angular.module('scalearAngularApp')
  .controller('quizMiddleCtrl',['$stateParams','$scope','Quiz', 'CourseEditor', '$translate','$log', '$rootScope','ErrorHandler','$timeout', '$state','$q' ,function ($stateParams,$scope, Quiz, CourseEditor, $translate, $log, $rootScope, ErrorHandler,$timeout, $state, $q) {
 	// $scope.$parent.not_module = true;
 	// $scope.$parent.currentitem = $state.params.quiz_id
 	$scope.$watch('items_obj["quiz"]['+$stateParams.quiz_id+']', function(){
      if($scope.items_obj && $scope.items_obj["quiz"][$stateParams.quiz_id]){
        $scope.quiz=$scope.items_obj["quiz"][$stateParams.quiz_id]
        // $scope.$emit('accordianUpdate',$scope.quiz.group_id);
        // $scope.$parent.currentmodule = $scope.quiz.group_id
      }
    })

    $scope.$on('$destroy', function() {
        shortcut.remove("Enter");
    });


 	$scope.alert={type:"alert", msg:"lectures.got_some_errors"}
 
 	$scope.closeAlerts= function(){
 		$scope.hide_alerts=true;
 	}

 	var init = function(){
 		Quiz.getQuestions({course_id:$stateParams.course_id, quiz_id: $stateParams.quiz_id},
 			function(data){
 				console.log(data)
	 			$log.debug("init data is");
	 			$log.debug(data);
		 		$scope.questions=data.questions
			  	$scope.questions.forEach(function(question,index){
			  		if(question.question_type.toUpperCase() == 'DRAG'){
						question.answers = []
						if(!data.answers[index].length)
							$scope.addHtmlAnswer("", question)
						else
							question.answers= CourseEditor.expandDragAnswers(data.answers[index][0].id ,data.answers[index][0].content, "quiz", question.id)
					}
					else if(question.question_type == 'Free Text Question' && question.match_type=='Free Text'){
						question.answers=[];
						$scope.addHtmlAnswer("",question)
					}
					else{
						question.answers = data.answers[index]
						if(!data.answers[index].length && question.question_type != 'Free Text Question')
							$scope.addHtmlAnswer("",question)				
					}	
			  	});

			  	$scope.quizSortableOptions={
			 		axis: 'y',
					dropOnEmpty: false,
					handle: '.handle',
					cursor: 'crosshair',
					items: '.quiz_sort',
					opacity: 0.4,
					scroll: true,
			 	}
				 
		    });

	    shortcut.add("Enter",
	    	function(){
				var elem_name=angular.element(document.activeElement).attr('name')
				if(elem_name =='qlabel')
					$scope.addQuestion()
					$scope.$apply()
			},
			{"disable_in_input" : false, 'propagate':true});
 	}
 	
 	init();
 	
 	var updateQuestions=function(ans){
		$log.debug("savingAll");
		Quiz.updateQuestions(
			{course_id:$stateParams.course_id, quiz_id:$scope.quiz.id},
			{questions: ans},
			function(data){ //success
				$log.debug(data)
				// init();
			},
			function(){
	 		   // alert("Could not save changes, please check network connection.");
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
			else if($scope.questions[elem].question_type == 'Free Text Question' && $scope.questions[elem].match_type =='Free Text')
			{
				console.log("I enterd here removing answer")
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
			//if(confirm($translate('questions.you_sure_delete_answer', {answer: question.answers[index].content})))
				question.answers.splice(index, 1);
		}else{
			//$log.debug("Can't delete the last answer..")
			$rootScope.show_alert="error";
		      	ErrorHandler.showMessage('Error ' + ': ' + $translate("online_quiz.cannot_delete_alteast_one_answer"), 'errorMessage', 8000);
		      	$timeout(function(){
		      		$rootScope.show_alert="";	
		      	},4000);
		}
	}
	
	$scope.removeQuestion = function(index){
 		// if(confirm($translate('questions.you_sure_delete_question', {question: $scope.questions[index].content})))
		  	$scope.questions.splice(index, 1);
	}
 
	$scope.addHeader=function(){
		var new_header = {quiz_id:$scope.quiz.id, content:"", question_type:"header"}
		$scope.questions.push(new_header)
	}

	$scope.removeHeader=function(index){
		$scope.removeQuestion(index)
	}

	// $scope.openPreview=function(){
	// 	$scope.preview=true
	// 	$scope.temp_quiz={questions:$scope.questions}
	// 	$scope.formatted_answers={}
	// 	for(var elem in $scope.temp_quiz.questions){			
	// 		if($scope.temp_quiz.questions[elem].question_type.toUpperCase() == 'DRAG'){
	// 			$scope.formatted_answers[$scope.temp_quiz.questions[elem].id] = CourseEditor.mergeDragAnswers($scope.temp_quiz.questions[elem].answers, "quiz", $scope.temp_quiz.questions[elem].id).content
	// 		}
	// 	}
	// }
	// $scope.closePreview=function(){
	// 	$scope.preview=false
	// 	$scope.temp_quiz=null
	// }
	$scope.updateQuiz = function(data, type) {
	    var modified_quiz = angular.copy($scope.quiz);
	    delete modified_quiz.class_name;
	    delete modified_quiz.created_at;
	    delete modified_quiz.updated_at;
	    delete modified_quiz.id;
	    delete modified_quiz.due_date_enabled;

	    Quiz.update({
	            course_id: $stateParams.course_id,
	            quiz_id: $scope.quiz.id
	        }, {
	            quiz: modified_quiz
	        },
	        function(data) {
	            $log.debug(data)
	        }
	    );
	};

	$scope.validateQuiz = function(column, data) {
	    var d = $q.defer();
	    var quiz = {}
	    quiz[column] = data;
	    Quiz.validateQuiz({
	        course_id: $stateParams.course_id,
	        quiz_id: $scope.quiz.id
	    }, quiz, function(data) {
	        d.resolve()
	    }, function(data) {
	        $log.debug(data.status);
	        $log.debug(data);
	        if (data.status == 422 && data.data.errors)
	            d.resolve(data.data.errors.join());
	        else
	            d.reject('Server Error');
	    })
	    return d.promise;
	};
 
 }])