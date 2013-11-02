'use strict';

angular.module('scalearAngularApp')
    .controller('courseEditorCtrl', ['$rootScope', '$stateParams', '$scope', '$state', 'Course', 'Module', 'Lecture', function ($rootScope, $stateParams, $scope, $state, Course, Module, Lecture) {

    $scope.open_id="-1";
    $scope.open={};

	$rootScope.$on('accordianUpdate', function(event, id) {
		$scope.open_id=id;
		$scope.open[id]= true;
	});

	$rootScope.$on("detailsUpdate", function(event, args) {
  		init();
  		console.log("event emitted: title in left bar");
    });


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

 	init();

 	$scope.moduleSortableOptions={
 		axis: 'y',
		dropOnEmpty: false,
		handle: '.handle',
		cursor: 'crosshair',
		items: '.module',
		opacity: 0.4,
		scroll: true,
		update: function(e, ui) {
			Module.save_sort({},
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
			Lecture.save_sort(
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

}]);



