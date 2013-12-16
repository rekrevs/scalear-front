'use strict';

angular.module('scalearAngularApp')
.controller('courseEditorCtrl', ['$rootScope', '$stateParams', '$scope', '$state', 'Course', 'Module', 'Lecture','Quiz','CourseEditor','$location', '$translate','$log', function ($rootScope, $stateParams, $scope, $state, Course, Module, Lecture,Quiz,CourseEditor, $location, $translate, $log) {

 	/***********************Functions*******************************/
 	var init = function(){
 		$scope.open_id="-1";
	    $scope.open={};
	    $scope.oneAtATime = true;
 		Course.getCourseEditor(
 			{course_id:$stateParams.course_id},
 			function(data){
		 		$scope.course=data.course
		 		$scope.modules=data.groups
		 		$scope.module_obj ={}
		 		$scope.items_obj ={}
		 		$scope.modules.forEach(function(module){
		 			$scope.module_obj[module.id] = module
		 			module.items.forEach(function(item){
		 				$scope.items_obj[item.id] = item
		 			})
		 		})
		    },
		    function(){
		    }
	    );
 	}
 	
 	$scope.capitalize = function(s)
 	{
 		return CourseEditor.capitalize(s)
 	}

 	$scope.addModule=function(){
    	$log.debug("adding mod")
    	$scope.module_loading=true
    	$log.debug("course id is "+$stateParams.course_id);
    	Module.newModule({course_id: $stateParams.course_id},{},
	    	function(module){
	    		$log.debug(module)
	    		module.group.items=[]
	    		$scope.modules.push(module.group)
	    		$scope.module_obj[module.group.id] = module.group
    			$scope.module_loading=false
	    	}, 
	    	function(){
	    		//alert("Failed to create module, please check network connection")
	    	}
		);
    }

    $scope.removeModule=function(event, index){
    	$log.debug("remove mod")
    	event.preventDefault();
  		event.stopPropagation();  
  		var m_id= $scope.modules[index].id;
    	if(confirm($translate('groups.you_sure_delete_module')+' '+$scope.modules[index].name+"?")){

	    	Module.destroy(
	    		{
	    			course_id: $stateParams.course_id,
	    			module_id: m_id
	    		},{},
	    		function(response){
	    			$log.debug(response)
	    				var module = $scope.modules.splice(index, 1)
	    				delete $scope.module_obj[module.id]
	    			 	var str = $location.path();
					 	var res = str.match(/.*\/modules\/(\d+)/);
					 	if(res && res[1]==m_id)
	    			 		$state.go('course.course_editor')
	    			
	    		},
	    		function(){
	    			//alert("Failed to delete module, please check network connection")
	    		}
			);
		}
    }

    $scope.addLecture=function(module_index){
    	$log.debug("adding lec "+ module_index)
    	$log.debug($scope.modules)
    	$scope.item_loading=true
    	Lecture.newLecture({course_id: $stateParams.course_id, group: $scope.modules[module_index].id},
	    	function(data){
	    		$log.debug(data)
	    		data.lecture.class_name='lecture'
	    	    $scope.modules[module_index].items.push(data.lecture)
	    	    $scope.items_obj[data.lecture.id] = data.lecture
    			$scope.item_loading=false
	    	}, 
	    	function(){
	    		//alert("Failed to create lecture, please check network connection")
	    	}
		);
    }

    $scope.removeLecture=function(module_index, item_index){
    	$log.debug("remove lec " + module_index + " " + item_index) 
    	var l_id=$scope.modules[module_index].items[item_index].id
    	if(confirm($translate('groups.you_sure_delete_module')+" "+$scope.modules[module_index].items[item_index].name+"?")){
	    	Lecture.destroy(
	    		{
	    			course_id: $stateParams.course_id, 
	    			lecture_id: $scope.modules[module_index].items[item_index].id
	    		},
	    		{},
	    		function(response){
	    			 $log.debug(response)
	    			 var item = $scope.modules[module_index].items.splice(item_index, 1)
	    			 delete $scope.items_obj[item.id]

	    			 var str = $location.path();
					 var res = str.match(/.*\/lectures\/(\d+)/);
					 if(res && res[1]==l_id)
	    			 	$state.go('course.course_editor')
	    		},
	    		function(){
	    			//alert("Failed to delete lecture, please check network connection")
	    		}
			);
		}
    }
    
    $scope.addQuiz=function(module_index, type){
    	$log.debug("adding quiz "+ module_index)
    	$log.debug($scope.modules)
    	$scope.item_loading=true
    	Quiz.newQuiz({course_id: $stateParams.course_id, group: $scope.modules[module_index].id, type:type},
    	{},

	    	function(data){
	    		$log.debug(data)
	    		data.quiz.class_name='quiz'
	    	    $scope.modules[module_index].items.push(data.quiz)
	    	    $scope.items_obj[data.quiz.id] = data.quiz
    			$scope.item_loading=false
	    	}, 
	    	function(){
	    		//alert("Failed to create quiz, please check network connection")
	    	}
		);
    }
    
    $scope.removeQuiz=function(module_index, item_index){
    	$log.debug("remove quiz " + module_index + " " + item_index) 
    	var q_id=$scope.modules[module_index].items[item_index].id;
    	if(confirm($translate('online_quiz.you_sure_delete_quiz')+" "+$scope.modules[module_index].items[item_index].quiz_type+" "+$scope.modules[module_index].items[item_index].name+"?")){
	    	Quiz.destroy(
	    		{course_id: $stateParams.course_id,
	    		 quiz_id: q_id},
	    		{},
	    		function(response){
	    			 var quiz = $scope.modules[module_index].items.splice(item_index, 1)
	    			 delete $scope.items_obj[quiz.id]
	    			 var str = $location.path();
					 var res = str.match(/.*\/quizzes\/(\d+)/);
					 if(res && res[1]==q_id)
	    			 	$state.go('course.course_editor')
	    		},
	    		function(){
	    			//alert("Failed to delete Quiz, please check network connection")
	    		}
			);
		}
    }

    /*************************************************************************************/
    
	$rootScope.$on('accordianUpdate', function(event, message) {
		$scope.open_id=message;
		$scope.open[message]= true;
	});

 	$scope.moduleSortableOptions={
 		axis: 'y',
		dropOnEmpty: false,
		handle: '.handle',
		cursor: 'crosshair',
		items: '.module',
		opacity: 0.4,
		scroll: true,
		update: function(e, ui) {
			Module.saveSort({},
				{course_id:$stateParams.course_id,
					group: $scope.modules},
				function(response){
					$log.debug(response)
				}, 
				function(){
					$log.debug('Error')
				}
			);
		},
 	}

 	$scope.itemSortableOptions={
		axis: 'y',
		dropOnEmpty: false,
		handle: '.handle',
		cursor: 'crosshair',
		items: '.item',
		opacity: 0.4,
		scroll: true,
		update: function(e, ui) {
			var group_id=ui.item.scope().item.group_id
			var group_position=ui.item.scope().$parent.$parent.module.position -1
			Lecture.saveSort(
				{course_id:$stateParams.course_id, 
				 group: ui.item.scope().item.group_id},
				{items: $scope.modules[group_position].items},
				function(response){
					$log.debug(response)
				},
				function(){
					$log.debug('error')
				}
			);
		},
 	}

	init();

}]);



