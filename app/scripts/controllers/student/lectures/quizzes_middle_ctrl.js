'use strict';

angular.module('scalearAngularApp')
  .controller('studentQuizMiddleCtrl', ['$scope','Course','$stateParams', '$controller','Quiz', '$log','CourseEditor','$state','Page','scalear_utils','$translate','ContentNavigator', function ($scope, Course, $stateParams,$controller,Quiz, $log, CourseEditor, $state, Page, scalear_utils,$translate,ContentNavigator) {
    $controller('surveysCtrl', {$scope: $scope});
    
 	var init = function(){
        $scope.course.warning_message=null
        $scope.studentAnswers={};
        $scope.$parent.$parent.current_item =$stateParams.quiz_id
        $scope.should_solve = false
        $scope.passed_requirments = true
        ContentNavigator.open()

 		Quiz.getQuestions({quiz_id: $stateParams.quiz_id, course_id: $stateParams.course_id},function(data){
            $scope.quiz= data.quiz
            $log.debug($scope.quiz)
            Page.setTitle($scope.quiz.name)

           $log.debug($scope.preview_as_student)
           if(!$scope.preview_as_student){
                for(var item in $scope.quiz.requirements){
                    for(var id in $scope.quiz.requirements[item]){
                        var group_index= scalear_utils.getIndexById($scope.course.groups, $stateParams.module_id)//CourseEditor.getIndexById($scope.$parent.$parent.course.groups, data.done[1])
                        var item_index= scalear_utils.getIndexById($scope.course.groups[group_index].items, $scope.quiz.requirements[item][id])//CourseEditor.getIndexById($scope.$parent.$parent.course.groups[group_index].lectures, data.done[0])
                        if(item_index!=-1 && group_index!=-1)
                            if(!$scope.course.groups[group_index].items[item_index].is_done)
                                $scope.passed_requirments = false
                    }
                }
            }
            $scope.should_solve = $scope.passed_requirments

	 		$scope.quiz.questions=data.questions
	 		$scope.studentAnswers=data.quiz_grades;
	 		$scope.status=data.status;
	 		$scope.correct=data.correct;
            $scope.next_item= data.next_item;
            // $scope.$emit('accordianUpdate',{g_id:$scope.quiz.group_id, type:"quiz", id:$scope.quiz.id});
	 		$scope.alert_messages= data.alert_messages
            $scope.course.warning_message = setupWarningMsg($scope.alert_messages)
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
        var next_state = "course.module.courseware." + $scope.next_item.class_name
        var s = $scope.next_item.class_name + "_id"
        var to = {}
        to[s] = $scope.next_item.id
        to["module_id"]=$scope.next_item.group_id
        $log.debug(next_state)
        $state.go(next_state, to);
    }

    $scope.saveQuiz = function(action){
    	if($scope.form.$valid || action=="save") //validate only if submit.
    	{
    		$scope.submitted=false;
    		Quiz.saveStudentQuiz(
                {
                    quiz_id: $stateParams.quiz_id, 
                    course_id: $stateParams.course_id
                },
                {
                    student_quiz: $scope.studentAnswers, 
                    commit: action
                }, 
                function(data){
        			$scope.status=data.status;
        			$scope.alert_messages= data.alert_messages;
                    $scope.course.warning_message = setupWarningMsg($scope.alert_messages)
                    $scope.next_item= data.next_item;
        			if(data.correct)
        				$scope.correct=data.correct; 
                    $scope.course.markDone(data.done[1],data.done[0], data.done[2])
        		}
            );
    	}
    	else{ // client validation error.
    		$scope.submitted=true;
    	}
    };

    var setupWarningMsg=function(alert_messages){
        for(var key in alert_messages){
            if(key=="submit")
                return $translate('quizzes.already_submitted')+' '+$scope.quiz.quiz_type+' '+$translate("quizzes.no_more_attempts")
            else if(key=="due")
                return $translate("events.due_date_passed")+" - "+$scope.alert_messages[key][0]+" ("+$scope.alert_messages[key][1]+" "+$scope.alert_messages[key][2]+") "+$translate("time.ago")
            else if(key=="today")
                return $translate("events.due")+" "+ $translate("time.today")+" "+ $translate("at")+" "+$scope.alert_messages[key]
        }
    }

  }]);
