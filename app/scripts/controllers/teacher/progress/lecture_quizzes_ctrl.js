'use strict';

angular.module('scalearAngularApp')
  .controller('lectureQuizzesCtrl', ['$scope','$stateParams','$timeout','Module', '$translate','$log', function ($scope, $stateParams, $timeout, Module, $translate, $log) {
    
    $scope.lecture_player={}
    $scope.lecture_player.events={}
    
  	$scope.lectureQuizzesTab = function(){
        $scope.tabState(1)
        $scope.enableChartsScrolling()
        if($scope.chart_offset == null){
        	$scope.loading_video = true
            $scope.getLectureCharts(0,5)
        }
    }
  	$scope.getLectureCharts= function(offset, limit){
        $scope.chart_limit = limit
        $scope.chart_offset = offset
        $scope.disableInfinitScrolling()
        $scope.loading_lectures_chart = true
        Module.getLectureCharts(
            {
                course_id:$stateParams.course_id,
                module_id:$stateParams.module_id
            },
            function(data){
                $scope.lecture_data=data.charts_data 
                if($scope.lecture_data.question_ids.length){
                    $scope.url = getURL($scope.lecture_data.question_ids[0]) 
                    $scope.total = $scope.lecture_data.question_ids.length
                    $scope.sub_question_ids = $scope.lecture_data.question_ids.slice($scope.chart_offset, $scope.chart_limit)
                    $scope.enableChartsScrolling()
                    $scope.$watch("current_lang", redrawChart);
                }
                $scope.loading_lectures_chart = false
            }
        );
    }

    $scope.getRemainingLectureCharts=function(){
        $log.debug("get remaining")
        $scope.chart_offset+=$scope.chart_limit
        if($scope.chart_offset<=parseInt($scope.total))
        {
            $scope.loading_lectures_chart = true
            $scope.disableInfinitScrolling()
            $timeout(function(){
                $scope.sub_question_ids = $scope.sub_question_ids.concat($scope.lecture_data.question_ids.slice($scope.chart_offset, $scope.chart_offset+$scope.chart_limit))
                $scope.loading_lectures_chart = false
                $scope.enableChartsScrolling()
            },500)
        }
        else
            $scope.disableInfinitScrolling()
    }

 	$scope.enableChartsScrolling = function(){
        if($scope.tabState() == 1){
            $log.debug("enabling chart scrolling")
            $scope.lecture_scroll_disable = true
            $scope.quiz_scroll_disable = true
            $scope.chart_scroll_disable= false
        }
 		
    }

    $scope.lecture_player.events.onReady=function(){
        $scope.lecture_player.controls.pause()
    }

    $scope.seek= function(id){
        $scope.lecture_player.controls.seek_and_pause(getTime(id))
	}

	var getQuizTitle= function(id){
        if( $scope.lecture_data)
		  return $scope.lecture_data.questions[id][0];
        return ""
	};

    var getTime= function(id){
        return $scope.lecture_data.questions[id][1]
    };

	$scope.getLectureTitle= function(id){
		return $scope.lecture_data.lectures[id][0]
	};

    var getURL= function(id){        
        return $scope.lecture_data.lectures[id][1]
    };

    $scope.formatLectureChartData = function(data){
        var formated_data ={}
        formated_data.cols=
            [
                {"label": $translate('courses.students'),"type": "string"},
                {"label": $translate('lectures.correct'),"type": "number"},
                {"label": $translate('lectures.incorrect'),"type": "number"},
            ]
        formated_data.rows= []
        for(var ind in data)
        {
            var text, correct, incorrect
            if(data[ind][1]=="gray"){
                text=data[ind][2]+" "+"("+$translate('lectures.incorrect')+")";
                correct=0
                incorrect = data[ind][0]
            }
            else{
                text=data[ind][2]+" "+"("+$translate('lectures.correct')+")";
                correct=data[ind][0]
                incorrect=0
            }
            var row=
            {"c":
                [
                    {"v":text},
                    {"v":correct},
                    {"v":incorrect},
                ]
            }
            formated_data.rows.push(row)
        }
        return formated_data
    }

    $scope.createLectureChart = function(data, id){
        var chart_data = data
        var chart = {};
        chart.type = "ColumnChart"
        chart.options = {
            "colors": ['green','gray'],
            "title": getQuizTitle(id),
            "isStacked": "true",
            "fill": 20,
            "height": 200,
            "displayExactValues": true,
            "fontSize" : 12,
            "vAxis": {
                "title": $translate("quizzes.number_of_students"),
            },
        };
        chart.data = $scope.formatLectureChartData(chart_data[id])
        return chart
    }

    var redrawChart = function(new_val, old_val){ 
        if(new_val != old_val){
            var temp = angular.copy($scope.sub_question_ids)
            $scope.sub_question_ids = {}
            $timeout(function(){
                $scope.sub_question_ids = temp
            })
        }
    }

    //$scope.lectureQuizzesTab()


  }]);
