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
				// template: "<h5 ng-click='invertOpen()'>"+
				// 	"<img src='images/move2.png' class='handle' title={{'courses.drag_to_reorder'|translate}} />"+
				// 	"<a class='trigger' ng-class='{open:open[id]}' ui-sref='course.course_editor.module({ module_id: id })'>{{name}}</a>"+
				// 	"<delete_button size='small' action='remove({event:event})' name='module_delete_button'/>"+
				//   "</h5>",

		templateUrl:'/views/teacher/course_editor/module.html' ,
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
		 templateUrl:'/views/teacher/course_editor/item.html',
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
		 	action:"&",
		 	elem: '='
		 },
		 restrict: 'E', 
		 template: 	'<a ng-mouseover="overclass = \'icon-pencil\'" ng-mouseleave="overclass= \'\'"  editable-text="value" e-form="textBtnForm" onbeforesave="validation()($data, elem)" onaftersave="saveData()" ng-click="action()" ng-dblclick="textBtnForm.$show()" style="cursor:pointer;">'+
			 			'{{ value || ("empty"|translate) }}'+
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
	        scope.$watch(scope.getWidth, function (newValue) {
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
	 	templateUrl:'/views/teacher/course_editor/loading.html',
	};
}).directive('deleteButton',function(){
	return {
		scope:{
			size:"@",
			action:"&"
		},
        replace: true,
		restrict:'E',
		templateUrl: '/views/teacher/course_editor/delete_button.html',
	}
});