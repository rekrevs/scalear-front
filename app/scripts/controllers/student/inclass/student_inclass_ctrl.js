'use strict';

angular.module('scalearAngularApp')
    .controller('studentInclassCtrl', ['$scope','ContentNavigator','MobileDetector','Module','$state','$log','$timeout', function($scope, ContentNavigator, MobileDetector, Module, $state, $log, $timeout) {

        // if(!MobileDetector.isPhone())
        //     ContentNavigator.open()

        $scope.messages=["No In-class Session Running", "Please wait for the teacher to introduce the problem.", "Individual", "Group", "Discussion", "End"]
        $scope.module = $scope.course.selected_module
        $scope.getInclassStudentStatus=function(status){
            $scope.loading = true
            Module.getInclassStudentStatus(
                {
                    module_id: $state.params.module_id,
                    course_id: $state.params.course_id,
                    status: status || 0,
                    quiz_id: $scope.quiz? $scope.quiz.id: -1
                },
                function(data){
                    $scope.loading = false
                    if(!status && data.status>0){
                        $scope.quiz = data.quiz
                        $scope.group_quiz = angular.copy($scope.quiz)
                        $scope.lecture = data.lecture
                        $('.answer_choices input').attr('type',$scope.quiz.question_type =="MCQ"? "checkbox" :"radio")
                    }

                    $scope.inclass_status = data.status
                }
            )
        }

        $scope.getInclassStudentStatus()

        var clearSelectedAnswer=function(quiz){
            quiz.answers.forEach(function(ans){
                ans.selected=false
            })
        }

        $scope.sendAnswers=function(quiz){            
            removeNotification()
            var selected_answers
            if(quiz.question_type == "OCQ" || quiz.question_type == "MCQ"){
                selected_answers=[]
                quiz.answers.forEach(function(answer){
                    if(answer.selected)
                        selected_answers.push(answer.id)
                })
                if(selected_answers.length == 0){
                    showNotification("lectures.choose_correct_answer")
                    return      
                }

                if(quiz.question_type == "OCQ" && selected_answers.length==1)
                    selected_answers = selected_answers[0]
            }
            quiz.done = true

            // Lecture.saveOnline(
            //     {
            //         course_id:$state.params.course_id,
            //         lecture_id:$state.params.lecture_id
            //     },
            //     {
            //         quiz: $scope.selected_quiz.id,
            //         answer:selected_answers
            //     },
            //     function(data){
            //         displayResult(data)
            //     }
            // )
        }  

        $scope.showNotification=function(msg){
            $scope.alert= true
            $scope.alert_message = msg
        }

        var removeNotification=function(){
            $scope.alert= false
            $scope.alert_message = ""
        }

        $scope.retry=function(quiz){
            quiz.done= false
            clearSelectedAnswer(quiz)
        }

        $scope.intToChar=function(n){
            return String.fromCharCode(97 + n).toUpperCase()
        }

        $scope.selectAnswer=function(answer, quiz){
            if($scope.quiz.question_type == "OCQ"){
                clearSelectedAnswer(quiz)
            }
            answer.selected=true
        }


}]);