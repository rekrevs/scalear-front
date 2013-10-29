'use strict';

angular.module('scalearAngularApp')
    .controller('courseEditorCtrl', function ($rootScope, $stateParams, $scope, $state, Course, Module) {

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
    	Module.new_module({},
	    	function(module){
	    		console.log(module)
	    		$scope.modules.push(module)
	    	}, 
	    	function(){

	    	}
		);
    }

    $scope.remove_module=function(index){
    	console.log("remove mod")    	
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


 	$scope.$on("update", function(event, args) {
  		init();
  		console.log("event emitted: title in left bar");
    });

    

 // 	$scope.item_path = function(group_index, item_index){
	// 	var item=$scope.groups[group_index].items[item_index].className;
	// 	var item_id= $scope.groups[group_index].items[item_index].id
	// 	var group_id=$scope.groups[group_index].id
	// 	var course_id = $scope.course.id
	// 	$rootScope.lecture=$scope.groups[group_index].items[item_index]
	// 	console.log($scope.lecture.name)		
	// 	console.log(item+item_id+group_id);
	// 	$state.go('teacher_lecture.fillView', {"lecture_id" : item_id});
	// }


 //    $scope.setup_notifications = function()
	// {
		// $('.adding').click(function(event){
		// 	$(this).closest('ul').append("<li style='font-size:10px;'><center><img src='/assets/loading_small.gif'/><%= t('groups.please_wait') %></center></li>")
		// });
		
		// $('.adding_module').click(function(event){
		// 	$(this).parent().children("ul").append("<li style='font-size:10px;'><center><img src='/assets/loading_small.gif'/><%= t('groups.please_wait') %></center></li>");
		// });
		
	// }

	// $('.trigger').click(function(event){
	// 	var group_id=$(this).closest('li').attr('id').split("_")[1]
	// 	$('#current_viewed').data('item',"group");
	// 	$('#current_viewed').data('id',group_id);
	// 	$.ajax({url:"/<%= I18n.locale %>/courses/<%=@course.id%>/groups/"+group_id+"/statistics", type:'get', dataType:'script'}); //statistics
	// 	$.ajax({url:"/<%= I18n.locale %>/courses/<%=@course.id%>/groups/"+group_id+"/details", type:'get', dataType:'script'}); //details
	// });

	
    
});



