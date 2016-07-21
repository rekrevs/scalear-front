'use strict';

angular.module('scalearAngularApp')
  .controller('quizMiddleCtrl',['$stateParams','$scope','Quiz', 'CourseEditor', '$translate','$log', '$rootScope','ErrorHandler','$timeout', '$state','$q' ,function ($stateParams,$scope, Quiz, CourseEditor, $translate, $log, $rootScope, ErrorHandler,$timeout, $state, $q) {

 	var unwatch = $scope.$watch('items_obj["quiz"]['+$stateParams.quiz_id+']', function(){
      if($scope.items_obj && $scope.items_obj["quiz"][$stateParams.quiz_id]){
        $scope.quiz=$scope.items_obj["quiz"][$stateParams.quiz_id]
        unwatch()
      }
    })

    $scope.$on('$destroy', function() {
        shortcut.remove("Enter");
    });


 	$scope.alert={type:"alert", msg:"error_message.got_some_errors"}

 	$scope.closeAlerts= function(){
 		$scope.hide_alerts=true;
 	}

 	var init = function(){
 		Quiz.getQuestions({course_id:$stateParams.course_id, quiz_id: $stateParams.quiz_id},
 			function(data){
 				$log.debug(data)
	 			$log.debug("init data is");
	 			$log.debug(data);
		 		$scope.questions=data.questions
			  	$scope.questions.forEach(function(question,index){
			  		if(question.question_type.toUpperCase() == 'DRAG'){
						question.answers = []
						if(!data.answers[index].length)	
							$scope.addHtmlAnswer("", question)
						else
							question.answers= CourseEditor.expandDragAnswers(data.answers[index][0].id ,data.answers[index][0].content, "quiz", question.id,data.answers[index][0].explanation)
					}
					// else if(question.question_type == 'Free Text Question' && question.match_type=='Free Text'){
					// 	question.answers=[];
					// 	$scope.addHtmlAnswer("",question)
					// }
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
					scroll: true
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

 	var updateQuestions=function(questions){
		Quiz.updateQuestions(
			{course_id:$stateParams.course_id, quiz_id:$scope.quiz.id},
			{questions: questions}
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
			// else if($scope.questions[elem].question_type == 'Free Text Question' && $scope.questions[elem].match_type =='Free Text'){
			// 	var y=angular.copy($scope.questions[elem])
			// 	y.answers=[]
			// 	data[elem]= y
			// }
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
		$scope.new_answer=CourseEditor.newAnswer(ans,"","","","","quiz", question.id)
		question.answers.push($scope.new_answer)
	}

 	$scope.removeHtmlAnswer = function(index, question){
		if(question.answers.length>1){
			question.answers.splice(index, 1);
		}else{
			$rootScope.show_alert="error";
	      	ErrorHandler.showMessage('Error ' + ': ' + $translate("editor.cannot_delete_alteast_one_answer"), 'errorMessage', 8000);
	      	$timeout(function(){
	      		$rootScope.show_alert="";
	      	},4000);
		}
	}

	$scope.removeQuestion = function(index){
	  	$scope.questions.splice(index, 1);
	}

	$scope.addHeader=function(){
		var new_header = {quiz_id:$scope.quiz.id, content:"", question_type:"header"}
		$scope.questions.push(new_header)
	}

	$scope.removeHeader=function(index){
		$scope.removeQuestion(index)
	}

	$scope.updateQuiz = function() {
	    var modified_quiz = angular.copy($scope.quiz);
	    delete modified_quiz.class_name;
	    delete modified_quiz.created_at;
	    delete modified_quiz.updated_at;
	    delete modified_quiz.id;
	    delete modified_quiz.due_date_enabled;
	    delete modified_quiz.disable_module_due_controls

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
	    }, quiz, function() {
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
