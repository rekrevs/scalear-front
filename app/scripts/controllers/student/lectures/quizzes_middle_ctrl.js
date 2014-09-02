'use strict';

angular.module('scalearAngularApp')
  .controller('studentQuizMiddleCtrl', ['$scope','Course','$stateParams', '$controller','Quiz', '$log','CourseEditor','$state','Page','scalear_utils','$translate', function ($scope, Course, $stateParams,$controller,Quiz, $log, CourseEditor, $state, Page, scalear_utils,$translate) {
    $controller('surveysCtrl', {$scope: $scope});
    
 	var init = function(){
        $scope.course.warning_message=null
        $scope.studentAnswers={};
        $scope.$parent.$parent.current_item =$stateParams.quiz_id
        $scope.should_solve = true
 		Quiz.getQuestions({quiz_id: $stateParams.quiz_id, course_id: $stateParams.course_id},function(data){
            $scope.quiz= data.quiz
            console.log($scope.quiz)
            Page.setTitle($scope.quiz.name)

           console.log($scope.preview_as_student)
           if(!$scope.preview_as_student){
                for(var item in $scope.quiz.requirements){
                    for(var id in $scope.quiz.requirements[item]){
                        var group_index= scalear_utils.getIndexById($scope.course.groups, $stateParams.module_id)//CourseEditor.get_index_by_id($scope.$parent.$parent.course.groups, data.done[1])
                        var item_index= scalear_utils.getIndexById($scope.course.groups[group_index].items, $scope.quiz.requirements[item][id])//CourseEditor.get_index_by_id($scope.$parent.$parent.course.groups[group_index].lectures, data.done[0])
                        if(item_index!=-1 && group_index!=-1)
                            if(!$scope.course.groups[group_index].items[item_index].is_done)
                                $scope.should_solve = false
                    }
                }
            }

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
        console.log(next_state)
        $state.go(next_state, to);
    }

    $scope.saveQuiz = function(action){
    	if($scope.form.$valid || action=="save") //validate only if submit.
    	{
    		$scope.submitted=false;
    		Quiz.saveStudentQuiz({quiz_id: $stateParams.quiz_id, course_id: $stateParams.course_id},{student_quiz: $scope.studentAnswers, commit: action}, function(data){
    			$scope.status=data.status;
    			$scope.alert_messages= data.alert_messages;
                $scope.course.warning_message = setupWarningMsg($scope.alert_messages)
                // $scope.next_item= data.next_item;
    			if(data.correct)
    				$scope.correct=data.correct; 
				
                // var group_index= scalear_utils.getIndexById($scope.course.groups, data.done[1])//CourseEditor.get_index_by_id($scope.$parent.$parent.course.groups, data.done[1])
                // var quiz_index= scalear_utils.getIndexById($scope.course.groups[group_index].quizzes, data.done[0])//CourseEditor.get_index_by_id($scope.$parent.$parent.course.groups[group_index].lectures, data.done[0])
                // if(quiz_index!=-1 && group_index!=-1)
                //     $scope.course.groups[group_index].quizzes[quiz_index].is_done= data.done[2]
                $scope.course.markDone(data.done[1],data.done[0], data.done[2])
    		});
    	}
    	else{ // client validation error.
    		$scope.submitted=true;
    	}
    };

    var setupWarningMsg=function(alert_messages){
        for(var key in alert_messages){
            if(key=="submit")
                return $translate('controller_msg.already_submitted')+' '+$scope.quiz.quiz_type+' '+$translate("controller_msg.no_more_attempts")
            else if(key=="due")
                return $translate("controller_msg.due_date_passed")+" - "+$scope.alert_messages[key][0]+" ("+$scope.alert_messages[key][1]+" "+$translate("controller_msg."+$scope.alert_messages[key][2])+") "+$translate("controller_msg.ago")
            else if(key=="today")
                return $translate("controller_msg.due")+" "+ $translate("controller_msg.today")+" "+ $translate("at")+" "+$scope.alert_messages[key]
        }
    }

  }]);
