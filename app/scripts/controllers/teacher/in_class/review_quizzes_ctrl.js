'use strict';

angular.module('scalearAngularApp')

.controller('reviewQuizzesCtrl', ['$scope', '$stateParams', 'Module', '$translate', '$log', '$window',
    function($scope, $stateParams, Module, $translate, $log, $window) {

        $window.scrollTo(0, 0);

        $log.debug("review quizzes")
        var getLectureCharts = function(offset, limit) {
            $scope.chart_limit = limit
            $scope.chart_offset = offset
            $scope.loading_lectures_chart = true
            Module.getLectureCharts({
                    course_id: $stateParams.course_id,
                    module_id: $stateParams.module_id
                },
                function(data) {
                    $log.debug(data)
                    $scope.lecture_data = data.charts_data
                    $scope.student_count = $scope.lecture_data.students_count
                    $scope.loading_lectures_chart = false
                }
            );
        }

        $scope.updateHide = function(id, value) {
            Module.hideQuiz({
                    course_id: $stateParams.course_id,
                    module_id: $stateParams.module_id
                }, {
                    quiz: id,
                    hide: value
                },
                function() {},
                function() {}
            )
        }

        var getQuizTitle = function(id) {
            return $scope.lecture_data.questions[id][0];
        };
        var getQuizType = function(id) {
            if ($scope.lecture_data)
                return $scope.lecture_data.questions[id][2] + ' | ';
            return ""
        };

        $scope.formatLectureChartData = function(data) {
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
            for (var ind in data) {
                var text, correct, incorrect
                if (data[ind][1] == "gray") {
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

        $scope.createLectureChart = function(id, student_count) {
            var chart_data = $scope.lecture_data.charts
            var chart = {};
            chart.type = "ColumnChart"
            chart.options = {
                "colors": ['green', 'gray'],
                "title": getQuizType(id) + getQuizTitle(id),
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
            chart.data = $scope.formatLectureChartData(chart_data[id])
            return chart
        }

        getLectureCharts(0, 100)

    }
]);