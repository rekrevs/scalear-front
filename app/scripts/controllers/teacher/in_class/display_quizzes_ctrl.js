'use strict';

angular.module('scalearAngularApp')
  .controller('displayQuizzesCtrl', ['$scope','$modalInstance','Module',function ($scope, $modalInstance, Module) {

  	Module.displayQuizzes(
  		{module_id: 34},
  		function(data){
  			console.log(data)
  			$scope.lecture_list = data.lecture_list
  			$scope.display_data = data.display_data
  			$scope.total_num_lectures = data.num_lectures
  			$scope.total_num_quizzes  = data.num_quizzes
  			setupAll()
  		},
  		function(){}
	)
	$scope.play_pause_class = "play_button"
	$scope.mute_class = "mute_button"


  	$scope.exit = function () {
		angular.element("body").css("overflow","auto");
		$modalInstance.close();
	};

	$scope.playBtn = function()
	{
		if($scope.play_pause_class == "play_button")
			$scope.play_pause_class = "pause_button"
		else
			$scope.play_pause_class = "play_button"
	}

	$scope.muteBtn= function()
	{
		if($scope.mute_class == "unmute_button")
			$scope.mute_class = "mute_button"
		else
			$scope.mute_class = "unmute_button"
	}

	function setupAll()
	{
		for(var elem in $scope.lecture_list){
			var url=$scope.lecture_list[elem]
			if($scope.display_data[url].length!=0){
				$scope.lecture= url
				$scope.quiz_time= $scope.display_data[url][0][0]
				$scope.current_lecture= parseInt(elem)+1;
				$scope.current_quiz= parseInt($scope.display_data[url][0][1]);
				$scope.question = $scope.display_data[url][0][2]
				break; 
			}
		}
		// if($scope.lecture){
			// var v=$scope.lecture.split("v=")[1].split("&")[0]
			// player = new YT.Player('resizable', {
			// 	videoId: v,
			// 	playerVars: {"showinfo":0,"modestbranding":0,'autoplay': 1, 'rel':0, 'controls': 0, 'start':$scope.quiz_time},//showinfo:0
			// 	events: {
			// 	'onReady': onPlayerReady,
			// 	'onStateChange': onPlayerStateChange
			// }
		// });

		// h=$("#resizable").height();
		// setup_screens();
		// setup_buttons(h)
		// setup_button_width();
		// setup_video2();
		// setup_actions();
		// if(current_quiz == 1)
		// 	$("#previous").attr("disabled", "disabled");
		// if(current_quiz == num_of_quizzes)
		// 	$("#next").attr("disabled", "disabled");
		// }
		// else{
		// 	setup_alert();
		// }
	}

	setup_screens = function()
	{
		h=$("#resizable").height();
		width = h*16.0/9.0;
		wbig=$("#big_div").width();
		if(width!=$("#resizable").width())
		{
			$("#resizable").width(width)
			remaining= wbig-width;
			$("#left").width(remaining/2.0 - 30)
			$("#right").width(remaining/2.0 - 30)
		}
		
		if($("#resizable").width() + 130 > $("#top").width()) // does not maintain 16:9 aspect ratio anymore.
		{
			$("#resizable").width(wbig-130)
			$("#left").width(50)
			$("#right").width(50)
		}
		
		player.setSize($("#resizable").width(), $("#resizable").height());
		$("#fo2").width($("#resizable").width());
		$("#fo2").height($("#resizable").height());
		$("#fo2").css("left",$("#resizable").position().left);
		$("#fo2").css("top",$("#resizable").position().top);
	}


}]);
