'use strict';

angular.module('scalearAngularApp')
  .controller('studentQuizMiddleCtrl', ['$scope','Course','$stateParams', '$controller','Quiz', '$log','CourseEditor','$state','Page','util', function ($scope, Course, $stateParams,$controller,Quiz, $log, CourseEditor, $state, Page, util) {
    $controller('surveysCtrl', {$scope: $scope});
    
 	var init = function(){
        $scope.studentAnswers={};
        $scope.$parent.$parent.current_item =$stateParams.quiz_id
        $scope.can_solve = true
 		Quiz.getQuestions({quiz_id: $stateParams.quiz_id, course_id: $stateParams.course_id},function(data){
            $scope.quiz= data.quiz
            console.log($scope.quiz)
            Page.setTitle($scope.quiz.name)
           
            for(var item in $scope.quiz.requirements){
                for(var id in $scope.quiz.requirements[item]){
                    var group_index= util.getIndexById($scope.course.groups, $stateParams.module_id)//CourseEditor.get_index_by_id($scope.$parent.$parent.course.groups, data.done[1])
                    var item_index= util.getIndexById($scope.course.groups[group_index][item], $scope.quiz.requirements[item][id])//CourseEditor.get_index_by_id($scope.$parent.$parent.course.groups[group_index].lectures, data.done[0])
                    if(item_index!=-1 && group_index!=-1)
                        if(!$scope.course.groups[group_index][item][item_index].is_done)
                            $scope.can_solve = false
                }
            }

	 		$scope.quiz.questions=data.questions
	 		$scope.studentAnswers=data.quiz_grades;
	 		$scope.status=data.status;
	 		$scope.correct=data.correct;
            $scope.next_item= data.next_item;
            // $scope.$emit('accordianUpdate',{g_id:$scope.quiz.group_id, type:"quiz", id:$scope.quiz.id});
	 		$scope.alert_messages= data.alert_messages
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

    $scope.go_to_next_item = function(){
            var next_state = "course.courseware.module." + $scope.next_item.class_name
            var s = $scope.next_item.class_name + "_id"
            var to = {}
            to[s] = $scope.next_item.id
            to["module_id"]=$scope.next_item.group_id
            $state.go(next_state, to);
    }

    $scope.saveQuiz = function(action){
    	if($scope.form.$valid || action=="save") //validate only if submit.
    	{
    		$scope.submitted=false;
    		Quiz.saveStudentQuiz({quiz_id: $stateParams.quiz_id, course_id: $stateParams.course_id},{student_quiz: $scope.studentAnswers, commit: action}, function(data){
    			$scope.status=data.status;
    			$scope.alert_messages= data.alert_messages;
                $scope.next_item= data.next_item;
    			if(data.correct)
    				$scope.correct=data.correct; 
				
                var group_index= util.getIndexById($scope.course.groups, data.done[1])//CourseEditor.get_index_by_id($scope.$parent.$parent.course.groups, data.done[1])
                var quiz_index= util.getIndexById($scope.course.groups[group_index].quizzes, data.done[0])//CourseEditor.get_index_by_id($scope.$parent.$parent.course.groups[group_index].lectures, data.done[0])
                if(quiz_index!=-1 && group_index!=-1)
                    $scope.course.groups[group_index].quizzes[quiz_index].is_done= data.done[2]
    		});
    	}
    	else{ // client validation error.
    		$scope.submitted=true;
    	}
    };
  }]);
