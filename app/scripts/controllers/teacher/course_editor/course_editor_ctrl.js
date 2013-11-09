'use strict';

angular.module('scalearAngularApp')
.controller('courseEditorCtrl', ['$rootScope', '$stateParams', '$scope', '$state', 'Course', 'Module', 'Lecture', function ($rootScope, $stateParams, $scope, $state, Course, Module, Lecture) {


 	/***********************Functions*******************************/
 	var init = function(){
 		Course.getCourseEditor(function(data){
	 		$scope.course=data.course
	 		$scope.modules=data.groups
		  	$scope.modules.forEach(function(module,index){
		  		module.items = data.items[index]
		  		module.items.forEach(function(item,ind){
		  			item.class_name= data.className[index][ind]
		  		});  		
		  	});
	 		console.log($scope.modules);
	    });
 	}

 	$scope.addModule=function(){
    	console.log("adding mod")
    	$scope.module_loading=true
    	Module.newModule({},
	    	function(module){
	    		console.log(module)
	    		module.items=[]
	    		$scope.modules.push(module)
    			$scope.module_loading=false
	    	}, 
	    	function(){
	    		alert("Failed to create module, please check network connection")
	    	}
		);
    }

    $scope.removeModule=function(index){
    	console.log("remove mod") 
    	event.preventDefault();
  		event.stopPropagation();   	
    	if(confirm("Are you sure you want to delete module?")){
	    	Module.destroy(
	    		{module_id: $scope.modules[index].id},
	    		function(response){
	    			console.log(response)
	    			if(response.error.lecture_quiz_exist)
	    				console.log("Sorry, You must delete all items in the module before deleting the module itself.")
	    			else{
	    				$scope.modules.splice(index, 1)
	    				$state.go('course.course_editor')
	    			}
	    		},
	    		function(){
	    			alert("Failed to delete module, please check network connection")
	    		}
			);
		}
    }

    $scope.addLecture=function(module_index){
    	console.log("adding lec "+ module_index)
    	console.log($scope.modules)
    	$scope.item_loading=true
    	Lecture.newLecture({group: $scope.modules[module_index].id},
	    	function(lecture){
	    		console.log(lecture)
	    		lecture.class_name='lecture'
	    	    $scope.modules[module_index].items.push(lecture)
    			$scope.item_loading=false
	    	}, 
	    	function(){
	    		alert("Failed to create lecture, please check network connection")
	    	}
		);
    }

    $scope.removeLecture=function(module_index, item_index){
    	console.log("remove lec " + module_index + " " + item_index) 
    	if(confirm("Are you sure you want to delete lecture?")){
	    	Lecture.destroy(
	    		{lecture_id: $scope.modules[module_index].items[item_index].id},
	    		function(response){
	    			 console.log(response)
	    			 $scope.modules[module_index].items.splice(item_index, 1)
	    			 $state.go('course.course_editor')
	    		},
	    		function(){
	    			alert("Failed to delete lecture, please check network connection")
	    		}
			);
		}
    }

    /*************************************************************************************/


    $scope.open_id="-1";
    $scope.open={};
    $scope.oneAtATime = true;

	$rootScope.$on('accordianUpdate', function(event, message) {
		$scope.open_id=message;
		$scope.open[message]= true;
	});

	$rootScope.$on("detailsUpdate", function(event, args) {
  		init();
  		console.log("event emitted: title in left bar");
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
				{group: $scope.modules},
				function(response){
					console.log(response)
				}, 
				function(){
					console.log('Error')
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
				{group: ui.item.scope().item.group_id},
				{items: $scope.modules[group_position].items},
				function(response){
					console.log(response)
				},
				function(){
					console.log('error')
				}
			);
		},
 	}

	init();

}]);



