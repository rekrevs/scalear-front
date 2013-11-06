'use strict';

angular.module('scalearAngularApp')
.controller('courseEditorCtrl', ['$rootScope', '$stateParams', '$scope', '$state', 'Course', 'Module', 'Lecture', function ($rootScope, $stateParams, $scope, $state, Course, Module, Lecture) {

 	/***********************Functions*******************************/
 	var init = function(){
 		Course.get_course_editor(function(data){
	 		$scope.course=data.course
	 		$scope.modules=data.groups
		  	$scope.modules.forEach(function(module,index){
		  		module.items = data.items[index]
		  		module.items.forEach(function(item,ind){
		  			item.className= data.className[index][ind]
		  		});  		
		  	});
	 		console.log($scope.modules);
	    });
 	}

 	$scope.add_module=function(){
    	console.log("adding mod")
    	$scope.showLoading=true
    	Module.new_module({},
	    	function(module){
	    		console.log(module)
	    		$scope.modules.push(module)
    			$scope.showLoading=false
	    	}, 
	    	function(){
	    		alert("Failed to create module, please check network connection")
	    	}
		);
    }

    $scope.remove_module=function(index){
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

    $scope.add_lecture=function(module_index){
    	console.log("adding lec "+ module_index)
    	$scope.showLoading=true
    	Lecture.new_lecture({group: $scope.modules[module_index].id},
	    	function(lecture){
	    		console.log(lecture)
	    	    $scope.modules[module_index].items.push(lecture)
    			$scope.showLoading=false
	    	}, 
	    	function(){
	    		alert("Failed to create lecture, please check network connection")
	    	}
		);
    }

    $scope.remove_lecture=function(module_index, item_index){
    	console.log("remove lec " + module_index + " " + item_index) 
    // 	event.preventDefault();
  		// event.stopPropagation();   	
    	if(confirm("Are you sure you want to delete lecture?")){
	    	Lecture.destroy(
	    		{lecture_id: $scope.modules[module_index].items[item_index].id},
	    		function(response){
	    			 console.log(response)
	    			 $scope.modules[module_index].items.splice(item_index, 1)
	    			 $state.go('course.course_editor')
	    			// if(response.error.lecture_quiz_exist)
	    			// 	console.log("Sorry, You must delete all items in the module before deleting the module itself.")
	    			// else{
	    			 	
	    			// 	$state.go('course.course_editor')
	    			// }
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
		items: 'li.modules',
		opacity: 0.4,
		scroll: true
 	}

 	$scope.itemSortableOptions={
		axis: 'y',
		dropOnEmpty: false,
		handle: '.handle2',
		cursor: 'crosshair',
		items: 'li.last-child',
		opacity: 0.4,
		scroll: true
 	}

 	init();
 
}]);



