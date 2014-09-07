'use strict';

angular.module('scalearAngularApp')
    .controller('quizDetailsCtrl', ['$stateParams', '$scope', '$q', 'Quiz', '$log','$state',
        function($stateParams, $scope, $q, Quiz, $log, $state) {

            $scope.$watch('items_obj["quiz"][' + $stateParams.quiz_id + ']', function() {

                if ($scope.items_obj && $scope.items_obj["quiz"][$stateParams.quiz_id]) {
                    $scope.quiz = $scope.items_obj["quiz"][$stateParams.quiz_id]                    
                    if($scope.quiz.due_date)
                        $scope.quiz.due_date_enabled =!isDueDateDisabled($scope.quiz.due_date)
                    $scope.$watch('module_obj[' + $scope.quiz.group_id + ']',function(){ 
                     console.log("hello")                
                        if ($scope.quiz.appearance_time_module) {
                            $scope.quiz.appearance_time = $scope.module_obj[$scope.quiz.group_id].appearance_time;
                        }
                        if(isDueDateDisabled($scope.module_obj[$scope.quiz.group_id].due_date)){
                            $scope.quiz.disable_due_controls = true//isDueDateDisabled($scope.module_obj[$scope.quiz.group_id].due_date)
                            console.log("whne to diable controls here !!!!")
                            console.log($scope.module_obj[$scope.quiz.group_id].due_date)
                            $scope.quiz.due_date_module = false
                        }
                        else{
                            $scope.quiz.disable_due_controls = false
                        }

                        if ($scope.quiz.due_date_module) {
                            $scope.quiz.due_date = $scope.module_obj[$scope.quiz.group_id].due_date;
                                
                                // $scope.quiz.due_date_enabled = !isDueDateDisabled($scope.quiz.due_date)
                            // }
                        }
                    })
                    $scope.link_url=$state.href('course.module.courseware.quiz', {module_id: $scope.quiz.group_id, quiz_id:$scope.quiz.id}, {absolute: true}) 

                }
            })

            $scope.updateQuiz = function(data, type) {
                var modified_quiz = angular.copy($scope.quiz);
                delete modified_quiz.class_name;
                delete modified_quiz.created_at;
                delete modified_quiz.updated_at;
                delete modified_quiz.id;
                delete modified_quiz.due_date_enabled;
                delete modified_quiz.disable_due_controls

                Quiz.update({
                        course_id: $stateParams.course_id,
                        quiz_id: $scope.quiz.id
                    }, {
                        quiz: modified_quiz
                    },
                    function(data) {
                        $log.debug(data)
                        console.log(data)
                        $scope.quiz.appearance_time = data.quiz.appearance_time
                        $scope.quiz.due_date = data.quiz.due_date
                    }
                );
            };

            var isDueDateDisabled=function(due_date){
                var due = new Date(due_date)
                var today = new Date()
                return due.getFullYear() > today.getFullYear()+100
            }

            $scope.updateDueDate=function(){
                var enabled = $scope.quiz.due_date_enabled
                var due_date = new Date($scope.quiz.due_date)
                if(isDueDateDisabled($scope.quiz.due_date) && enabled) 
                    var years =  -200 
                else if(!isDueDateDisabled($scope.quiz.due_date) && !enabled)
                    var years  =  200
                else
                    var years = 0
                due_date.setFullYear(due_date.getFullYear()+ years)

                var appearance_date = new Date($scope.quiz.appearance_time)
                if(due_date <= appearance_date){
                    due_date=appearance_date
                    due_date.setDate(appearance_date.getDate()+ week)
                }

                $scope.quiz.due_date = due_date
                $scope.quiz.due_date_enabled =!isDueDateDisabled($scope.quiz.due_date)
                $scope.quiz.due_date_module = $scope.quiz.due_date_enabled
            }


            $scope.visible = function(appearance_time) {
                if (new Date(appearance_time) <= new Date()) {
                    return true;
                } else {
                    return false;
                }
            }

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

        }
    ]);