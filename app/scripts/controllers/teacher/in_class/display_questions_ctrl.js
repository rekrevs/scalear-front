// 'use strict';

// angular.module('scalearAngularApp')
//   .controller('displayQuestionsCtrl', ['$scope','$stateParams','Module','$log', '$window','Timeline', function ($scope, $stateParams, Module, $log, $window,Timeline){

//  	$window.scrollTo(0, 0);
  	// var init = function(){
  // 		Module.displayQuestions(
	 //  		{
	 //  			course_id:$stateParams.course_id,
  //               module_id:$stateParams.module_id
	 //  		},
	 //  		function(data){
	 //  			$log.debug(data)
	 //  			$scope.$parent.lecture_list = data.lecture_list
	 //  			$scope.$parent.display_data = data.display_data
	 //  			$scope.$parent.total_num_lectures = data.num_lectures
	 //  			$scope.$parent.total_num_quizzes  = data.num_quizzes
	 //  			$scope.nextQuiz()
	 //  			$scope.setQuizShortcuts()
	 //  		},
	 //  		function(){}
		// )


		// $scope.timeline = {}//new Timeline()
  // 		Module.getModuleInclass({
	 //  			course_id: $stateParams.course_id,
  //         module_id: $stateParams.module_id
	 //  		},
	 //  		function(data){
	 //  			angular.extend($scope.$parent, data)
	 //  			console.log(data)
	 //  	 		// $scope.url = $scope.first_lecture
	 //  	 		$scope.timeline['lecture'] = {}
	 //  	 		for(var lec_id in $scope.$parent.lectures){
	 //  	 			$scope.timeline['lecture'][lec_id] = new Timeline()
	 //  	 			for(var type in $scope.$parent.lectures[lec_id]){
	 //  	 				if(type== "question" || type == "charts")
		//   	 				for(var it in $scope.lectures[lec_id][type] ){
		// 	  	 				$scope.timeline['lecture'][lec_id].add($scope.$parent.lectures[lec_id][type][it][0], type, $scope.$parent.lectures[lec_id][type][it][1])	
		// 	  	 			}
	 //  	 			}	  	 			
	 //  	 		}
	 //  	 		$scope.$parent.mytimeline = $scope.timeline
	 //  	 		$scope.nextQuiz()
	 //  	 		//console.log($scope.timeline)
	 //  		},	
	 //  		function(){}
		// )
  	// }

	// $scope.$parent.setData=function(lecture_id,url){
	// 	$scope.$parent.quiz_time= $scope.display_data[lecture_id][$scope.current_quiz_lecture][0][1]
	// 	$scope.$parent.questions = $scope.display_data[lecture_id][$scope.current_quiz_lecture]
	// 	if($scope.$parent.lecture_url.indexOf(url) == -1){
	// 		$scope.$parent.inclass_player.controls.setStartTime($scope.$parent.quiz_time)
	// 		$scope.$parent.lecture_url= url
	// 	}
	// }


	// init()
  // }]);
