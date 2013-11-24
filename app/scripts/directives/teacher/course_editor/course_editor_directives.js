'use strict';

angular.module('scalearAngularApp')
	.directive("module",function(){
	return {
		restrict: "E",
		scope: {
			name:"=",
			id:'=',
			remove:"&",
			open: "="
		},
		template: "<h5 ng-click='invertOpen()'>"+
					"<img src='images/move2.png' class='handle' title='drag to reorder' />"+
					"<a class='trigger' ng-class='{open:open[id]}' ui-sref='course.course_editor.module({ module_id: id })'>{{name}}</a>"+
					"<delete_button size='small' action='remove({event:event})' name='module_delete_button'/>"+
				  "</h5>",
	  link: function(scope){
			scope.invertOpen = function()
			{
				if(scope.open[scope.id])
					scope.open[scope.id] = false
				else{ 
					for(var i in scope.open)
						scope.open[i]=false;
					scope.open[scope.id] = true
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
	               '<a class="trigger2" ui-sref=\'course.course_editor.{{(className=="lecture") && "lecture.quizList" || className}}({ {{className}}_id: id })\' >{{name}}</a>'+
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
		 template: '<div ng-click="action({$event:$event})" class="btn" >{{title}}</div>'
	};
}).directive('editableText', ['$timeout', function($timeout){
	return {
		 scope: {
		 	value:"=",
		 	save:"&",
		 	validation:"&",
		 	action:"&"
		 },
		 restrict: 'E', 
		 template: 	'<a ng-mouseover="overclass = \'icon-pencil\'" ng-mouseleave="overclass= \'\'"  editable-text="value" e-form="textBtnForm" onbeforesave="validation()($data)" onaftersave="saveData()" ng-click="action()" ng-dblclick="textBtnForm.$show()" style="cursor:pointer;">'+
			 			'{{ value || "empty" }}'+
			 			'<i ng-class="overclass"></i>'+
	 				'</a>',
		link:function(scope){
			scope.saveData=function(){
				$timeout(function(){
					scope.save()
				})
			}
		}
	};
}])
.directive('overlay',function(){
	return{
		transclude: true,
		restrict: 'E',
	 	replace:true,
	 	template: '<div class="overlay" ng-transclude></div>',
		link:function(scope, element){
			var parent = element.parent();
	        scope.getWidth = function(){
                return parent.width()
            };
	        scope.$watch(scope.getWidth, function (newValue, oldValue) {
	        	 element.css("width", newValue)
	        });
		}
	}
})
.directive('loading',function(){
	return {
		scope:{
			size:'@',
			show:"="
		},		
	 	restrict: 'E',
	 	replace:true,
	 	template: '<div ng-show="show"><img ng-src="images/loading_{{size}}.gif" ng-class=\'{loading_image: size=="big"}\' /></br><b> Please wait...</b></div>'
	};
}).directive('deleteButton',function(){
	return {
		scope:{
			size:"@",
			action:"&"
		},
        replace: true,
		restrict:'E',
		template: 	'<a style="float:right;width:20px;cursor:pointer;" title="delete" class="delete_image" ng-click="action({event:$event})">'+
						'<img alt="Trash" ng-src="images/trash_{{size}}.png">'+
					'</a>'
	}
});