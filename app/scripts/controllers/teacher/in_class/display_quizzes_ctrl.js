'use strict';

angular.module('scalearAngularApp')
  .controller('displayQuizzesCtrl', ['$scope','$modalInstance','$timeout', 'Module',function ($scope, $modalInstance, $timeout, Module) {

  	var init = function(){
  		Module.displayQuizzes(
	  		{module_id: 34},
	  		function(data){
	  			console.log(data)
	  			$scope.lecture_list = data.lecture_list
	  			$scope.display_data = data.display_data
	  			$scope.total_num_lectures = data.num_lectures
	  			$scope.total_num_quizzes  = data.num_quizzes
	  			$scope.chart_data = data.chart_data
	  			$scope.nextQuiz()

	  		},
	  		function(){}
		)
		$scope.play_pause_class = "play_button"
		$scope.mute_class = "mute_button"
		$scope.lecture_player_controls={}
		$scope.current_lecture = 0
		$scope.current_quiz = 0
  	}


  	$scope.exitBtn = function () {
		angular.element("body").css("overflow","auto");
		$modalInstance.close();
	};

	$scope.playBtn = function()
	{
		if($scope.play_pause_class == "play_button"){
			$scope.play_pause_class = "pause_button"
			$scope.lecture_player_controls.play()
		}
		else{
			$scope.play_pause_class = "play_button"
			$scope.lecture_player_controls.pause()
		}
	}

	$scope.muteBtn= function()
	{
		if($scope.mute_class == "unmute_button"){
			$scope.mute_class = "mute_button"
			$scope.lecture_player_controls.unmute()
		}
		else{
			$scope.mute_class = "unmute_button"
			$scope.lecture_player_controls.mute()
		}
	}

	$scope.seek=function(){
		$scope.lecture_player_controls.seek($scope.quiz_time, $scope.myurl)
	}

	$scope.skip=function(time){
		if(time){
			var seek_to_time = $scope.lecture_player_controls.getTime()+time
			var duration = $scope.lecture_player_controls.getDuration()
			if(seek_to_time < 0)
				seek_to_time = 0
			else if(seek_to_time >duration)
				seek_to_time = duration
			$scope.lecture_player_controls.seek(seek_to_time,$scope.myurl)
			$scope.play_pause_class = "play_button"
		}
	}

	var setData=function(url){
		$scope.myurl= url
		$scope.quiz_time= $scope.display_data[url][$scope.current_quiz_lecture][0]
		$scope.question = $scope.display_data[url][$scope.current_quiz_lecture][2]
		$scope.quiz_id  = $scope.display_data[url][$scope.current_quiz_lecture][3] 
	}
	
	$scope.nextQuiz = function(){
		if($scope.current_quiz != $scope.total_num_quizzes){
			var url=$scope.lecture_list[$scope.current_lecture-1]||$scope.lecture_list[0]
			if($scope.current_quiz_lecture < $scope.display_data[url].length ){
				setData(url)
				$scope.seek()
			}
			else{
				$scope.current_quiz_lecture= 0
				for (var elem=$scope.current_lecture; elem<$scope.lecture_list.length; elem++){
					var url=$scope.lecture_list[elem]
					if($scope.display_data[url].length){
						setData(url)
						$scope.current_lecture = elem+1;
						break; 
					}
				}
			}
			$scope.current_quiz+=1
			$scope.current_quiz_lecture+= 1
			$scope.quiz_chart = createChart($scope.quiz_id)
		}
	}
	$scope.prevQuiz = function(){
		if($scope.current_quiz != 1){
			$scope.current_quiz-=1
			$scope.current_quiz_lecture-= 2
			if($scope.current_quiz_lecture >= 0){
				var url=$scope.lecture_list[$scope.current_lecture-1]
				setData(url)
				$scope.seek()
			}
			else{
				for (var elem=$scope.current_lecture-2; elem>=0; elem--){
					var url=$scope.lecture_list[elem]
					if($scope.display_data[url].length){
						$scope.current_quiz_lecture = $scope.display_data[url].length -1
						setData(url)
						$scope.current_lecture = elem+1;
						break; 
					}
				}
			}
			$scope.current_quiz_lecture+= 1
		}
	}

	$scope.formatChartData = function(data){
        var formated_data ={}
        formated_data.cols=
            [
                {"label": "Students","type": "string"},
                {"label": "Correct", "type": "number"},
                {"label": "Incorrect","type": "number"},
            ]
        formated_data.rows= []
        for(var ind in data)
        {
            var text, correct, incorrect
            if(data[ind][1]=="gray"){
                text=data[ind][2]+" "+"(Incorrect)";
                correct=0
                incorrect = data[ind][0]
            }
            else{
                text=data[ind][2]+" "+"(Correct)";
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

    $scope.createChart = function(id){
        var chart_data = $scope.chart_data[id]
        var chart = {};
        chart.type = "ColumnChart"
        chart.options = {
            "colors": ['green','gray'],
            //"title": getQuizTitle(id),
            "isStacked": "true",
            "fill": 20,
            "height": 200,
            "displayExactValues": true,
            "fontSize" : 12,
            "vAxis": {
                "title": "Number of Students",
            },
        };
        chart.data = $scope.formatChartData(chart_data[id])
        return chart
    }

	init()
}]);
