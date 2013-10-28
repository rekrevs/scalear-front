'use strict';

angular.module('scalearAngularApp')
    .controller('courseEditorCtrl', function ($rootScope, $stateParams, $scope, $state, Course) {

 	var init = function(){
 		Course.get_course_editor(function(data){
	 		$scope.course=data.course
	 		$scope.groups=data.groups
		  	$scope.groups.forEach(function(group,index){
		  		group.items = data.items[index]
		  		group.items.forEach(function(item,ind){
		  			item.className= data.className[index][ind]
		  		});  		
		  	});
	 		console.log($scope.groups);
	    });
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



