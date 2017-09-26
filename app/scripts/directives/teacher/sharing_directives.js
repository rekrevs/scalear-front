'use strict';

angular.module('scalearAngularApp')
.directive('sharedItem', ['$rootScope', 'Module', 'Lecture', 'Quiz', 'SharedItem', 'CustomLink', '$state','$log', function($rootScope, Module, Lecture, Quiz, SharedItem, CustomLink, $state, $log){
	return{
	    restrict: 'E',
	    scope:{
	      data: "=",
	      courses: "="
	    },
    	templateUrl: '/views/teacher/sharing/shared_item.html',
    	link: function(scope, element){
	    	scope.addModule=function(shared_item_index, module_index,course_id){
		  		Module.moduleCopy(
					{course_id: course_id},
					{module_id: scope.data[shared_item_index].modules[module_index].id},
					function(data){
						$log.debug(data)
						scope.data[shared_item_index].modules.splice(module_index,1)
						var shared_copy = angular.copy(scope.data[shared_item_index])
						delete shared_copy.id
						delete shared_copy.teacher
						$log.debug(shared_copy)			
						if(shared_copy.modules.length == 0 && shared_copy.lectures.length == 0 && shared_copy.quizzes.length == 0 && shared_copy.customlinks.length == 0){				
							SharedItem.destroy(
								{shared_item_id: scope.data[shared_item_index].id},
								function(){
									scope.data.splice(shared_item_index,1)
								})
						}
						else{
							SharedItem.updateSharedData(
								{shared_item_id: scope.data[shared_item_index].id},
								{data: shared_copy}
							)
						}
					}
				)
		  	}

		  	scope.addLecture =function(shared_item_index, lecture_index,course_id, module_id){
		  		Lecture.lectureCopy(
		  			{course_id:course_id},
		  			{
		  				lecture_id:scope.data[shared_item_index].lectures[lecture_index].id, 
		  				module_id:module_id
		  			},
		  			function(data){
		  				$log.debug(data)
						scope.data[shared_item_index].lectures.splice(lecture_index,1)
						var shared_copy = angular.copy(scope.data[shared_item_index])
						delete shared_copy.created_at
						delete shared_copy.id
						delete shared_copy.teacher
						if(shared_copy.modules.length == 0 && shared_copy.lectures.length == 0 && shared_copy.quizzes.length == 0 && shared_copy.customlinks.length == 0){				
							SharedItem.destroy(
								{shared_item_id:scope.data[shared_item_index].id},
								function(){
								scope.data.splice(shared_item_index,1)
							})
						}
						else{
							SharedItem.updateSharedData(
								{shared_item_id:scope.data[shared_item_index].id},
								{data: shared_copy}
							)
						}
		  			},
		  			function(){}
				)
		  	}

		  	scope.addQuiz =function(shared_item_index, quiz_index,course_id, module_id){
		  		Quiz.quizCopy(
		  			{course_id:course_id},
		  			{
		  				quiz_id:scope.data[shared_item_index].quizzes[quiz_index].id, 
		  				module_id:module_id
		  			},
		  			function(data){
		  				$log.debug(data)
						scope.data[shared_item_index].quizzes.splice(quiz_index,1)
						var shared_copy = angular.copy(scope.data[shared_item_index])
						delete shared_copy.created_at
						delete shared_copy.id
						delete shared_copy.teacher
						if(shared_copy.modules.length == 0 && shared_copy.lectures.length == 0 && shared_copy.quizzes.length == 0 && shared_copy.customlinks.length == 0){				
							SharedItem.destroy(
								{shared_item_id:scope.data[shared_item_index].id},
								function(){
								scope.data.splice(shared_item_index,1)
							})
						}
						else{
							SharedItem.updateSharedData(
								{shared_item_id:scope.data[shared_item_index].id},
								{data: shared_copy}
							)
						}
		  			},
		  			function(){}
				)
		  	}

		  	scope.addLink =function(shared_item_index, link_index,course_id, module_id){
		  		CustomLink.linkCopy(
		  			{course_id:course_id},
		  			{
		  				link_id:scope.data[shared_item_index].customlinks[link_index].id, 
		  				module_id:module_id
		  			},
		  			function(data){
		  				$log.debug(data)
						scope.data[shared_item_index].customlinks.splice(link_index,1)
						var shared_copy = angular.copy(scope.data[shared_item_index])
						delete shared_copy.created_at
						delete shared_copy.id
						delete shared_copy.teacher
						if(shared_copy.modules.length == 0 && shared_copy.lectures.length == 0 && shared_copy.quizzes.length == 0 && shared_copy.customlinks.length == 0){				
							SharedItem.destroy(
								{shared_item_id:scope.data[shared_item_index].id},
								function(){
								scope.data.splice(shared_item_index,1)
							})
						}
						else{
							SharedItem.updateSharedData(
								{shared_item_id:scope.data[shared_item_index].id},
								{data: shared_copy}
							)
						}
		  			},
		  			function(){}
				)
  			}
		}
	}
}])