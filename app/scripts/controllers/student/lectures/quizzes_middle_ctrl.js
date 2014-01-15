'use strict';

angular.module('scalearAngularApp')
  .controller('studentQuizMiddleCtrl', ['$scope','Course','$stateParams', '$controller','Quiz', '$log','CourseEditor', function ($scope, Course, $stateParams,$controller,Quiz, $log, CourseEditor) {
    $controller('surveysCtrl', {$scope: $scope});
    
 	var init = function(){
        $scope.studentAnswers={};

 		Quiz.getQuestions({quiz_id: $stateParams.quiz_id, course_id: $stateParams.course_id},function(data){
            $scope.quiz= data.quiz
	 		$scope.quiz.questions=data.questions
	 		$scope.studentAnswers=data.quiz_grades;
	 		$scope.status=data.status;
	 		$scope.correct=data.correct;
	 		$scope.alert_messages= data.alert_messages
            $scope.$emit('accordianUpdate',{g_id:$scope.quiz.group_id, type:"quiz", id:$scope.quiz.id});
		  	$scope.quiz.questions.forEach(function(question,index){
					question.answers = data.answers[index]
					 if(question.question_type.toUpperCase()=="DRAG" && $scope.studentAnswers[question.id]==null) // if drag was not solved, put student answer from shuffled answers.
						 $scope.studentAnswers[question.id]=question.answers[0].content
			});
            if($scope.quiz.quiz_type=='survey')
                $scope.getSurveyCharts("display_only", $scope.quiz.group_id, $scope.quiz.id)
	    });
	}
 	
 	init();
    
    $scope.saveQuiz = function(action){
    	if($scope.form.$valid || action=="save") //validate only if submit.
    	{
    		$scope.submitted=false;
    		Quiz.saveStudentQuiz({quiz_id: $stateParams.quiz_id, course_id: $stateParams.course_id},{student_quiz: $scope.studentAnswers, commit: action}, function(data){
    			$scope.status=data.status;
    			$scope.alert_messages= data.alert_messages;
    			if(data.correct)
    				$scope.correct=data.correct; 
    				// here need to update scope.parent
    				var group_index= CourseEditor.get_index_by_id($scope.$parent.course.groups, data.done[1])
	 				var quiz_index= CourseEditor.get_index_by_id($scope.$parent.course.groups[group_index].quizzes, data.done[0])
	 				if(quiz_index!=-1 && group_index!=-1)
	 					$scope.$parent.course.groups[group_index].quizzes[quiz_index].is_done= data.done[2]
    			
    			//$scope.$emit('accordianReload');
				//$scope.$emit('accordianUpdate',{g_id:$scope.quiz.group_id, type:"quiz", id:$scope.quiz.id});
    		});
    	}
    	else{ // client validation error.
    		$scope.submitted=true;
    	}
    };
  }]);
