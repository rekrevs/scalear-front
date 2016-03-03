'use strict';

angular.module('scalearAngularApp')
  .controller('progressGraphCtrl', ['$scope','$stateParams','ContentNavigator','Page','Course','$translate', function ($scope, $stateParams, ContentNavigator, Page, Course, $translate) {
  		Page.setTitle('navigation.progress')
  		ContentNavigator.close()

    var getTotalChart=function(){
        $scope.loading_total_charts = true
        Course.getTotalChart(
            {course_id: $stateParams.course_id},
            function(data){
                $scope.student_progress = data.student_progress
                $scope.total_chart = createTotalChart($scope.student_progress)  
                $scope.loading_total_charts = false
            }
        )
    }

    $scope.getTotalChartHeight = function(rows){
        return rows.length * 30+50
    }

    $scope.formatTotalChartData = function(data){
        var formated_data ={}
        formated_data.cols=
            [
                {"label": $translate('global.students'),"type": "string"},
                {"label": $translate('progress.quiz'),"type": "number"},
                {"label": $translate('progress.lecture'),"type": "number"}
            ]
        formated_data.rows= []
        for(var ind in data)
        {
            var row=
            {"c":
                [
                    {"v":data[ind][0]},
                    {"v":data[ind][1], "f":data[ind][1].toFixed(0)+'%'},
                    {"v":data[ind][2], "f":data[ind][2].toFixed(0)+'%'}
                ]
            }
            formated_data.rows.push(row)
        }
        return formated_data
    }

    var createTotalChart = function(chart_data){
        var chart = {};
        chart.type = "BarChart"
        chart.options = {
            "colors": ['#195a92','#759c45'],
            "title": "Student Progress",
            "isStacked": "false",
            "fill": 20,
            "height": $scope.getTotalChartHeight(chart_data),
            "displayExactValues": true,
            "fontSize" : 12,

            "hAxis": { 
                    "maxValue":100,
                    "minValue":0
            },
            chartArea:{top: 10},
        };
        chart.data = $scope.formatTotalChartData(chart_data)
        return chart
    }

    getTotalChart()

  }]);
	   	
