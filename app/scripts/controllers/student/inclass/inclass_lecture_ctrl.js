'use strict';

angular.module('scalearAngularApp')
    .controller('studentInclassCtrl', ['$scope','ContentNavigator','MobileDetector','Module','$state','$log','$timeout', function($scope, ContentNavigator, MobileDetector, Module, $state, $log, $timeout) {

        if(!MobileDetector.isPhone())
            ContentNavigator.open()

        $scope.messages=["No In-class Session Running", "Introduction", "Individual", "Group", "Discussion", "End"]
        $scope.module = $scope.module_obj[$state.params.module_id]
        console.log($scope)
        $scope.getInclassStudentStatus=function(status){
            console.log("starting comet", status)
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
                    console.log("received status" ,data.status)
                    if(!status && data.status>0){
                        console.log("first fetch, got quiz", data.quiz)
                        $scope.quiz = data.quiz
                        $scope.lecture = data.lecture
                        $('.answer_choices input').attr('type',$scope.quiz.question_type =="MCQ"? "checkbox" :"radio")
                    }
                    if(data.status == 3){
                        $scope.done=false
                        removeSelectedAnswer()
                    }
                    $scope.inclass_status = data.status
                }
            )
        }

        $scope.getInclassStudentStatus()

        var removeSelectedAnswer=function(){
            $scope.quiz.answers.forEach(function(ans){
                ans.selected=false
            })
        }

        $scope.radioChange=function(corr_ans){
            if($scope.quiz.question_type == "OCQ"){
              removeSelectedAnswer()
              corr_ans.selected=true
            }
        }

        $scope.sendAnswers=function(){
            removeNotification()
            var selected_answers
            if($scope.quiz.question_type == "OCQ" || $scope.quiz.question_type == "MCQ"){
                selected_answers=[]
                $scope.quiz.answers.forEach(function(answer){
                    if(answer.selected)
                        selected_answers.push(answer.id)
                })
                if(selected_answers.length == 0){
                    showNotification("lectures.choose_correct_answer")
                    return      
                }

                if($scope.quiz.question_type == "OCQ" && selected_answers.length==1)
                    selected_answers = selected_answers[0]
            }

            $scope.done = true
            $scope.blink = true
            $timeout(function(){
                $scope.blink = false
            }, 500)



            // else{ //DRAG
            //     selected_answers={}
            //     selected_answers = $scope.studentAnswers[$scope.selected_quiz.id]
            //     var count = 0
            //     for (var el in selected_answers)
            //         if(selected_answers[el])
            //             count++
            //     if(count<$scope.selected_quiz.online_answers.length){
            //         showNotification("lectures.must_place_items")
            //         return
            //     }
            // }
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

        $scope.retry=function(){
            $scope.done= false

        }


}]);