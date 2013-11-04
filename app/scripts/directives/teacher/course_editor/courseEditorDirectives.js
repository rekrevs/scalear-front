'use strict';

angular.module('scalearAngularApp')
	.directive("module",function(){
	return {
		restrict: "E",
		scope: {
			name:"=",
			id:'=',
			remove:"&",
			isOpen2: "="
		},
		template: "<h5 ng-click='invert_open()'>"+
					"<img src='images/move2.png' class='handle' title='drag to reorder' />"+
					"<a class='trigger' ng-class='{open:isOpen2[id]==true}' ui-sref='course.course_editor.module({ module_id: id })'>{{name}}</a>"+
					"<delete_button size='small' action='remove()'/>"+
				  "</h5>",
	  link: function(scope){
			scope.invert_open = function()
			{
				console.log(scope.isOpen2[scope.id]);
				if(scope.isOpen2[scope.id]==true)
					scope.isOpen2[scope.id] = false
				else{ 
					for(var e in scope.isOpen2){
						console.log(e);
						scope.isOpen2[e]=false;
					}
					scope.isOpen2[scope.id] = true
				}
			}
		}
	}
 }).directive('item',function(){
	return {
		 scope: {
		 	name:'=',
		 	id:'=',
		 	className:'=',
		 	remove:'&'
		 },
		 restrict: 'E', 
		 template: '<img src="images/move2.png" class="handle" title="drag to reorder" />'+
	               '<a class="trigger2" ui-sref="course.course_editor.{{className}}({ {{className}}_id: id })" >{{name}}</a>'+
	               '<delete_button size="small" action="remove()"/>'
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
		 	save:"&",
		 	validation:"&",
		 	action:"&"
		 },
		 restrict: 'E', 
		 template: 	'<div ng-mouseover="overclass = \'icon-pencil\'" ng-mouseleave="overclass= \'\'"  editable-text="value" e-form="textBtnForm" onbeforesave="validation()($data)" onaftersave="save_data()" ng-click="action()" ng-dblclick="textBtnForm.$show()" style="cursor:pointer;">'+
			 			'{{ value || "empty" }}'+
			 			'<i ng-class="overclass"></i>'+
	 				'</div>',
		link:function(scope){
			scope.save_data=function(){
				$timeout(function(){
					scope.save()
				})
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