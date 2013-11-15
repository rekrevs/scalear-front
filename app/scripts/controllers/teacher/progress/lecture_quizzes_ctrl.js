'use strict';

angular.module('scalearAngularApp')
  .controller('lectureQuizzesCtrl', ['$scope','$stateParams','$timeout','Module', function ($scope, $stateParams, $timeout, Module) {

  	$scope.lectureQuizzesTab = function(){
        $scope.enableChartsScrolling()
        if($scope.chart_offset == null){
        	$scope.loading_video = true
            getLectureCharts(0,10)
        }
    }
  	var getLectureCharts= function(offset, limit){
    	console.log("module progress")
        $scope.chart_limit = limit
        $scope.chart_offset = offset
        $scope.disableInfinitScrolling()
        Module.getLectureCharts(
            {
                course_id:$stateParams.course_id,
                module_id:$stateParams.module_id
            },
            function(data){
                $scope.lecture_data=data.charts_data 
                $scope.url = getURL($scope.lecture_data.question_ids[0]) 
                $scope.total = $scope.lecture_data.question_ids.length
                $scope.sub_question_ids = $scope.lecture_data.question_ids.slice($scope.chart_offset, $scope.chart_limit)
            }
        );
    }

    $scope.getRemainingLectureCharts=function(){
        $scope.chart_offset+=$scope.chart_limit
        if($scope.chart_offset<=parseInt($scope.total))
        {
            $scope.loading_lecture_charts = true
            $scope.disableInfinitScrolling()
            $scope.sub_question_ids = $scope.sub_question_ids.concat($scope.lecture_data.question_ids.slice($scope.chart_offset, $scope.chart_offset+$scope.chart_limit))
            $timeout(function(){
                $scope.loading_lecture_charts = false
                //$scope.enableChartsScrolling()
            })
        }
        else
            $scope.disableInfinitScrolling()
    }

 	$scope.enableChartsScrolling = function(){
 		console.debug("enabling chart scrolling")
        $scope.lecture_scroll_disable = true
        $scope.quiz_scroll_disable = true
        $scope.chart_scroll_disable= false
    }

    $scope.seek= function(id){
        $scope.$emit('seekPlayer',[getURL(id),getTime(id)])
	}

	$scope.getQuizTitle= function(id){
		return $scope.lecture_data.questions[id][0];
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

	// $scope.saveAsImg = function(){
	// 	console.log("in controller");
	// }

    $scope.getLectureChartData = function(id)
    {
    	console.log("LecturequizzeCtrl")
    	console.log($scope.lecture_data.charts)
        var studentProgress = $scope.lecture_data.charts[id];
        console.log(studentProgress);
        
        var data = new google.visualization.DataTable();
	    data.addColumn('string', 'Choices');
	    data.addColumn('number', 'Correct');
	    data.addColumn('number', 'Incorrect');
    
	    var size=0
	    for(var e in studentProgress){
            size++;
	    }

        data.addRows(size);
        var i=0;
        for (var key in studentProgress) {
            if(studentProgress[key][1]=="gray"){
				var c="(Incorrect)";
				var color=1
			}
			else{
				var c="(Correct)";
				var color=2
			}
                
            data.setValue(i, 0, studentProgress[key][2]+" "+c); //x axis  // first value
            data.setValue(i, color, studentProgress[key][0]); // yaxis //correct
            //data.setValue(i, colors[1], 0); // yaxis //incorrect
        	i+=1;
        }
        //console.log(data);
        return data;
    };

  }]);
