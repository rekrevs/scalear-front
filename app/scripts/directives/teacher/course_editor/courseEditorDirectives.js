'use strict';

angular.module('scalearAngularApp')
	.directive("module",function(){
	return {
		restrict: "E",
		scope: {
			name:"=",
			id:'=',
			remove:"&"
		},
		template: "<h5>"+
					"<img src='images/move2.png' class='handle' title='drag to reorder' />"+
					"<a class='trigger' ng-class='{open:isOpen}' ng-click='isOpen = !isOpen' ui-sref='course.course_editor.module({ module_id: id })'>{{name}}</a>"+
					"<a ng-click='remove();stopEvent($event)' style='float:right;' title='Delete'>"+
						"<img alt='Trash3' src='images/trash3.png'>"+
					"</a>"+
				  "</h5>",
	  	link:function(scope){
	  		scope.stopEvent = function(event){
	  			if (event) {
		      		event.preventDefault();
		      		event.stopPropagation();
	    		}
	  		}
	  	}
	}
 }).directive('item',function(){
	return {
		 scope: {
		 	name:'=',
		 	id:'='
		 },
		 restrict: 'E', 
		 template: '<img src="images/move2.png" class="handle" title="drag to reorder" />'+
	               '<a class="trigger2" ui-sref="course.course_editor.lecture.quizList({ lecture_id: id })" >{{name}}</a>'//+
	               // '<a href="/en/courses/{{course.id}}/lectures/{{id}}" data-confirm="Are you sure you want to delete {{name}} and all of its contents?" data-method="delete" data-remote="true" id="removeB" rel="nofollow" style="float:right;display:inline-table;" title="Delete"><img alt="Trash3" src="images/trash3.png"></a>'
	};
}).directive('buttonLink', function(){
	return {
		 scope: {
		 	title:"@",
		 	action: "&"
		 },
		 restrict: 'E', 
		 template: '<div ng-click="action()" >{{title}}</div>'
	};
});