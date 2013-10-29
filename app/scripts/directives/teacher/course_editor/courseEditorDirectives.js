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
					"<delete_button size='small' action='remove()'/>"+
				  "</h5>",
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
		 replace:true,
		 template: '<div ng-click="action()" class="btn" >{{title}}</div>'
	};
}).directive('editableText', function($timeout){
	return {
		 scope: {
		 	value:"=",
		 	action:"&"
		 },
		 restrict: 'E', 
		 template: '<b ng-dblclick="editingMode=true;focus()" ng-hide="editingMode">{{value}}</b>'+
				   '<input ng-show="editingMode" ng-blur="action();editingMode=false" ng-model="value" type="text" style="width:130px;" required/>',
	   	link:function(scope, element){
	   		scope.focus=function(){
	   			$timeout(function() {
	            	element[0].children[1].focus(); 
	          	});
	   		}
	   	}
	};
}).directive('loading',function(){
	return {
		scope:{
			size:'@',
			show:"="
		},
		restrict:'E',
		template: '<div ng-show="show" ><img ng-src="images/loading_{{size}}.gif"/> Please wait....</div>'
	}
}).directive('deleteButton',function(){
	return {
		scope:{
			size:"@",
			action:"&"
		},
		restrict:'E',
		template: 	'<a style="float:right;width:20px;" title="delete" ng-click="action()">'+
						'<img alt="Trash" ng-src="images/trash_{{size}}.png">'+
					'</a>'
	}
});