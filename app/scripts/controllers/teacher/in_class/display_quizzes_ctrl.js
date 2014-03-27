'use strict';

angular.module('scalearAngularApp')
  .controller('displayQuizzesCtrl', ['$scope','$stateParams','Module', '$translate', '$controller', '$log', '$window', function ($scope,$stateParams, Module, $translate, $controller, $log, $window) {
    
    $window.scrollTo(0, 0);
    
  	var init = function(){
  		Module.displayQuizzes(
	  		{
                course_id:$stateParams.course_id,
                module_id:$stateParams.module_id
            },
	  		function(data){
	  			$log.debug(data)
	  			$scope.$parent.lecture_list = data.lecture_list
	  			$scope.$parent.display_data = data.display_data
	  			$scope.$parent.total_num_lectures = data.num_lectures
	  			$scope.$parent.total_num_quizzes  = data.num_quizzes
	  			$scope.$parent.chart_data = data.chart_data
	  			$scope.total_student_count = data.students_count
	  			$scope.nextQuiz()
	  			$scope.setQuizShortcuts()
	  		},
	  		function(){}
		)
  	}
	$scope.$parent.setData=function(lecture_id, url, name){
		$scope.$parent.lecture_name = name
		// $scope.$parent.lecture_url= url; //+'&controls=0'
		$scope.$parent.quiz_time= $scope.display_data[lecture_id][$scope.current_quiz_lecture][0]
		$scope.$parent.question_title = $scope.display_data[lecture_id][$scope.current_quiz_lecture][2]
		$scope.$parent.quiz_id  = $scope.display_data[lecture_id][$scope.current_quiz_lecture][3] 
		if($scope.$parent.lecture_url.indexOf(url) == -1){
			$scope.$parent.inclass_player.controls.setStartTime($scope.$parent.quiz_time)
			$scope.$parent.lecture_url= url
		}
	}

    $scope.$parent.createChart = function(id){
        return createLectureChart($scope.chart_data[id], 100)
    }

    var createLectureChart = function(data, student_count) {
        var chart = {
        	type: "ColumnChart",
        	options :{
	            "colors": ['green', 'gray'],
	            "isStacked": "true",
	            "fill": 25,
	            "height": 180,
	            "backgroundColor": 'beige',
	            "displayExactValues": true,
	            "legend": {"position": 'none'},
	            "fontSize": 12,
	            "chartArea":{width:'82%'},
	            "tooltip": {"isHtml": true},
	            "vAxis": {
	                "ticks": [25,50,75,100],
	                "maxValue": student_count,
	                "viewWindowMode":'maximized',
	                "textPosition": 'none' 
	            }
	        }, 
	        data: $scope.formatLectureChartData(data)
        };
        return chart
    }

	    $scope.formatLectureChartData = function(data) {
		    var formated_data = {}
		    formated_data.cols =
		        [
			        {
				        "label": $translate('courses.students'),
				        "type": "string"
				    }, 
				    {
				        "label": $translate('lectures.correct'),
				        "type": "number"
				    }, 
				     {
				    	"type":"string",
				    	"p":{
				    		"role":"tooltip", 
				    		"html": true
				    	}
				    },
				    {
				        "label": $translate('lectures.incorrect'),
				        "type": "number"
				    }, 
				    {
				    	"type":"string",
				    	"p":{
				    		"role":"tooltip", 
				    		"html": true
				    	}
				    }
			    ]
		    formated_data.rows = []
		    for (var ind in data) {
		        var text, correct, incorrect, tooltip_text
		        tooltip_text = "<div style='padding:8px 0 0 5px'><b>"+data[ind][2]+"</b><br>"
		        if (data[ind][1] == "gray") {
		            correct = 0
		            incorrect = data[ind][0]
		            tooltip_text +="Incorrect: "
		        } else {		            
		            correct = data[ind][0]
		            incorrect = 0
		            tooltip_text +="Correct: "

		        }
		        text = data[ind][2]
		        tooltip_text += Math.floor(($scope.total_student_count*data[ind][0])/100 )+" answers "+"("+data[ind][0] +"%)</div>"
		        var row = {
		            "c": [
			            {"v": text}, 
			            {"v": correct}, 
			            {"v": tooltip_text},
			            {"v": incorrect}, 
			            {"v": tooltip_text}
		            ]
		        }
		        formated_data.rows.push(row)
		    }
		    return formated_data
		}

		    var setChartTooltip = function(data){
	     	data.cols.push({"type":"string","p":{"role":"tooltip", 'html': true}})
	     	for(var i in data.rows){
	     		var tooltip_text = generateTooltipHtml(data.rows[i].c[0].v, data.rows[i].c[1].v, $scope.statistics.question_text[i][1])
	     		data.rows[i].c.push({"v":tooltip_text})
     		}
	     	return data
	     }

	     var generateTooltipHtml = function(time, count, questions){
	     	var new_time=[]
	     	new_time[0] = time[0]
     		new_time[1]=time[1]<10? "0"+time[1] : time[1]
     		new_time[2]=time[2]<10? "0"+time[2] : time[2]
	     	var formatted_time = new_time[0]+":"+new_time[1]+":"+new_time[2]
	     	var html = "<div style='padding:8px 0 0 5px'><b>"+formatted_time+"</b><br>#"+$translate('courses.students')+":  <b>"+count+"</b></div><hr style='padding:0;margin:4px 0'>"
	     	for(var i in questions)
	     	{
	     		html +="<div style='width:400px;margin-left:5px;overflow-wrap:break-word'>- "+questions[i]+"</div><br>"
	     	}
	     	return html
	     }


	init()
}]);
