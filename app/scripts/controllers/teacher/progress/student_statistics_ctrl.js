'use strict';

angular.module('scalearAngularApp')
  .controller('studentStatisticsCtrl', ['$scope','$stateParams','$timeout','Module', '$translate', function ($scope, $stateParams, $timeout, Module, $translate){
  		
		$scope.statistics_player={}
		$scope.statistics_player.events={}
		
  		$scope.studentStatisticsTab = function(){
  			$scope.tabState(2)
	   		$scope.disableInfinitScrolling()
	   		$scope.types=['confused', 'back', 'pauses', 'questions']
       		getStudentStatistics()   
	    } 

	    var getStudentStatistics = function(){
	    	$scope.loading_statistics_chart=true
	    	Module.getStudentStatistics(
	    		{
	    			course_id:$stateParams.course_id,
	                module_id:$stateParams.module_id
	            },
	    		function(data){
	    			console.log(data)
	    			$scope.statistics = data
    			 	$scope.lecture_url =$scope.statistics.lecture_url
	    			$scope.loading_statistics_chart=false
	    			$scope.$watch("current_lang", redrawChart);
	    		},
	    		function(){

	    		}
    		)
	    }

	    $scope.getStatisticsType=function(ind){
	    	return $scope.types[ind]
	    }

	    var getChartWidth=function(){
	    	return $scope.statistics.width+120
	    }
	    $scope.geChartHeight=function(){
	    	var height = 150
	    	return height
	    }

        $scope.formatStatisticsChartData = function(data){
			var formated_data ={}
			formated_data.cols=
				[
					{"label": $translate('courses.students'),"type": "timeofday"},
					{"label": "#"+$translate('courses.students'),"type": "number"},
				]
			formated_data.rows= []
			for(var ind in data)
			{
				var d = new Date(data[ind][0]*1000)
				var row=
				{"c":
					[
						{"v":[d.getUTCHours(),d.getMinutes(),d.getSeconds(),0]},
						{"v":data[ind][1]},
					]
				}
				formated_data.rows.push(row)
			}
			return formated_data
	    }

	    $scope.createStatisticsChart = function(type){
	    	var chart_data = $scope.statistics[type]
	    	var chart = {};
	    	var min = new Date($scope.statistics.min*1000)
	    	var max = new Date($scope.statistics.max*1000)
	        chart.type = "ColumnChart"
	        chart.options = {
	            "colors": ['#0c81c8', 'darkred'],
	            "isStacked": "true",
	            "fill": 20,
	            "height": 150,
	            "width": getChartWidth(),
	            "displayExactValues": true,
	            "fontSize" : 12,
	            "chartArea":{"width":"95%"},
	            "hAxis": { 
					"maxValue":[max.getUTCHours(),max.getMinutes(),max.getSeconds(),0],
					"minValue":[min.getUTCHours(),min.getMinutes(),min.getSeconds(),0]
	            },
	            "legend": 'none',    
	            "vAxis": {
	                "title": "#"+$translate('courses.'+type),
	            },
	            "bar":{"groupWidth":5}
	        };
		  	chart.data = $scope.formatStatisticsChartData(chart_data)
		  	if(type == 'confused')
		  		chart.data = getReallyConfused(chart.data)
		  	if(type == 'questions'){
		  		chart.options.tooltip= {"isHtml": true}
		  		chart.data = setQuestionsTooltip(chart.data)
		  	}
		  		
		  	return chart
	    }

	     var getReallyConfused= function(data){
	     	data.cols.push({"label": $translate('courses.really_confused'),"type": "number"})
	     	for (var i in data.rows)
	     		if($scope.statistics.really_confused[i]){
	     			if($scope.statistics.really_confused[i][0] == $scope.statistics.confused[i][0]){
	     				data.rows[i].c.push({"v":$scope.statistics.really_confused[i][1]})
	     			}					
	     		}
     		return data
	     }

	     var setQuestionsTooltip = function(data){
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

	    $scope.skipToTime=function(selectedItem, type){
        	var d = new Date($scope.statistics[type][selectedItem.row][0]*1000)
        	var seek=d.getUTCHours()*60*60+d.getMinutes()*60+d.getSeconds()
            var to_seek=0
        	var before=0
        	var lec=""
            for(var time in $scope.statistics.time_list){
        		if(seek< parseInt(time))
        		{
        			to_seek= seek-before
        			lec=$scope.statistics.time_list[time]
        			break;
        		}
        		before=parseInt(time)
        	}
        	$scope.statistics_player.controls.seek_and_pause(to_seek, lec)
	    }

	    $scope.statistics_player.events.onReady=function(){
	    	$scope.statistics_player.controls.pause()
	    }

	    var redrawChart = function(new_val, old_val){ 
	        if(new_val != old_val){
	            var temp = angular.copy($scope.types)
	            $scope.types = {}
	            $timeout(function(){
	                $scope.types = temp
	            })
	        }
	    }

  }]);
