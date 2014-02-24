'use strict';

angular.module('scalearAngularApp')
    .controller('quizzesCtrl', ['$scope', '$stateParams', '$timeout', 'Module', '$translate', '$log',
        function($scope, $stateParams, $timeout, Module, $translate, $log) {

            $scope.quizzesTab = function() {
                $scope.tabState(6)
                $scope.disableInfinitScrolling()
                if (!$scope.selected_quiz)
                    getQuizCharts()
            }

            var getQuizCharts = function() {
                var quiz_id
                if ($scope.selected_quiz)
                    quiz_id = $scope.selected_quiz[1]
                $scope.loading_quizzes_chart = true
                Module.getQuizChart({
                        course_id: $stateParams.course_id,
                        module_id: $stateParams.module_id,
                        quiz_id: quiz_id
                    },
                    function(data) {
                        $log.debug(data)
                        $scope.quiz_chart_data = data.chart_data
                        $scope.quiz_chart_questions = data.chart_questions
                        $scope.student_count = data.students_count
                        if (!$scope.selected_quiz) {
                            $scope.all_quizzes = data.all_quizzes
                            $scope.selected_quiz = $scope.all_quizzes ? $scope.all_quizzes[0] : ""
                        }
                        $scope.loading_quizzes_chart = false
                        $scope.$watch("current_lang", redrawChart);
                    },
                    function() {}
                )
            }
            var getQuizQuestionTitle = function(index) {
                return $scope.quiz_chart_questions[index].question;
            }
            var getQuizQuestionType = function(index) {
                return $scope.quiz_chart_questions[index].type + ' | '
            }

            $scope.formatQuizChartData = function(data) {
                var formated_data = {}
                formated_data.cols =
                    [{
                    "label": $translate('courses.students'),
                    "type": "string"
                }, {
                    "label": $translate('lectures.correct'),
                    "type": "number"
                }, {
                    "label": $translate('lectures.incorrect'),
                    "type": "number"
                }, ]
                formated_data.rows = []
                var text, correct, incorrect
                for (var ind in data) {
                    if (!data[ind][1]) {
                        text = data[ind][2] + " " + "(" + $translate('lectures.incorrect') + ")";
                        correct = 0
                        incorrect = data[ind][0]
                    } else {
                        text = data[ind][2] + " " + "(" + $translate('lectures.correct') + ")";
                        correct = data[ind][0]
                        incorrect = 0
                    }
                    var row = {
                        "c": [{
                            "v": text
                        }, {
                            "v": correct
                        }, {
                            "v": incorrect
                        }, ]
                    }
                    formated_data.rows.push(row)
                }
                return formated_data
            }

            $scope.createQuizChart = function(chart_data, ind, student_count) {
                var chart = {};
                chart.type = "ColumnChart"
                chart.options = {
                    "colors": ['green', 'gray'],
                    "title": getQuizQuestionType(ind) + getQuizQuestionTitle(ind),
                    "isStacked": "true",
                    "fill": 20,
                    "height": 200,
                    "displayExactValues": true,
                    "fontSize": 12,
                    "vAxis": {
                        "title": $translate("quizzes.number_of_students") + " (" + $translate("groups.out_of") + " " + student_count + ")",
                        "gridlines": {
                            "count": 9
                        },
                        "maxValue": student_count
                    },
                };
                chart.data = $scope.formatQuizChartData(chart_data)
                return chart
            }

            $scope.changeQuiz = function() {
                $log.debug("quiz change")
                $log.debug($scope.selected_quiz)
                $scope.quiz_chart_data = {}
                $scope.quiz_chart_questions = {}
                getQuizCharts()
            }

            var redrawChart = function(new_val, old_val) {
                if (new_val != old_val) {
                    var temp = angular.copy($scope.quiz_chart_data)
                    $scope.quiz_chart_data = {}
                    $timeout(function() {
                        $scope.quiz_chart_data = temp
                    })
                }
            }



        }
    ]);