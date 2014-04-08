'use strict';

angular.module('scalearAngularApp')
  .controller('sharedCtrl',['$scope','Page','SharedItem','Module','Lecture','Quiz', function ($scope,Page,SharedItem,Module,Lecture,Quiz) {
  	Page.setTitle('sharing.view')

  	var init=function(){
  		SharedItem.showShared(
  			{},
  			function(data){
  				console.log(data)
  				$scope.shared_items = data.all_shared
  				$scope.courses = data.courses
  			},function(){}
		)
  	}

  	$scope.addModule=function(shared_item_index, module_index,course_id){
  		Module.moduleCopy(
		{course_id: course_id},
		{module_id: $scope.shared_items[shared_item_index].modules[module_index].id},
		function(data){
			console.log(data)
			$scope.shared_items[shared_item_index].modules.splice(module_index,1)
			var shared_copy = angular.copy($scope.shared_items[shared_item_index])
			delete shared_copy.id
			delete shared_copy.teacher			
			if(shared_copy.modules.length == 0 && shared_copy.lecture.length == 0 && shared_copy.quiz.length == 0){				
				SharedItem.destroy(
					{shared_item_id:$scope.shared_items[shared_item_index].id},
					function(){
					$scope.shared_items.splice(shared_item_index,1)
				})
			}
			else{
				SharedItem.updateSharedData(
					{shared_item_id:$scope.shared_items[shared_item_index].id},
					{data: shared_copy}
				)
			}
		})
  	}

  	$scope.addLecture =function(shared_item_index, lecture_index,course_id, module_id){
  		Lecture.lectureCopy(
  			{course_id:course_id},
  			{
  				lecture_id:$scope.shared_items[shared_item_index].lecture[lecture_index].id, 
  				module_id:module_id
  			},
  			function(data){
  				console.log(data)
				$scope.shared_items[shared_item_index].lecture.splice(lecture_index,1)
				var shared_copy = angular.copy($scope.shared_items[shared_item_index])
				delete shared_copy.id
				delete shared_copy.teacher
				if(shared_copy.modules.length == 0 && shared_copy.lecture.length == 0 && shared_copy.quiz.length == 0){				
					SharedItem.destroy(
						{shared_item_id:$scope.shared_items[shared_item_index].id},
						function(){
						$scope.shared_items.splice(shared_item_index,1)
					})
				}
				else{
					SharedItem.updateSharedData(
						{shared_item_id:$scope.shared_items[shared_item_index].id},
						{data: shared_copy}
					)
				}
  			},
  			function(){}
		)
  	}

  	$scope.addQuiz =function(shared_item_index, quiz_index,course_id, module_id){
  		Quiz.quizCopy(
  			{course_id:course_id},
  			{
  				quiz_id:$scope.shared_items[shared_item_index].quiz[quiz_index].id, 
  				module_id:module_id
  			},
  			function(data){
  				console.log(data)
				$scope.shared_items[shared_item_index].quiz.splice(quiz_index,1)
				var shared_copy = angular.copy($scope.shared_items[shared_item_index])
				delete shared_copy.id
				delete shared_copy.teacher
				if(shared_copy.modules.length == 0 && shared_copy.lecture.length == 0 && shared_copy.quiz.length == 0){				
					SharedItem.destroy(
						{shared_item_id:$scope.shared_items[shared_item_index].id},
						function(){
						$scope.shared_items.splice(shared_item_index,1)
					})
				}
				else{
					SharedItem.updateSharedData(
						{shared_item_id:$scope.shared_items[shared_item_index].id},
						{data: shared_copy}
					)
				}
  			},
  			function(){}
		)
  	}


  	init()

  }]);