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
		templateUrl:'/views/teacher/course_editor/module.html' ,
	  link: function(scope){
			scope.invertOpen = function(){
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
 }).directive('item',function($translate){
	return {
		 scope: {
		 	name:'=',
		 	id:'=',
		 	className:'=',
		 	remove:'&'
		 },
		 restrict: 'E', 
		 templateUrl:'/views/teacher/course_editor/item.html',
		 link:function(scope){
		 	scope.getDeleteMessage=function(){
		 		var translation_value = {}
		 		translation_value[scope.className] = scope.name
		 		return $translate('groups.you_sure_delete_'+scope.className, translation_value)
		 	}
		 }
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
	 	templateUrl:'/views/teacher/course_editor/loading.html',
	};
}).directive('deleteButton',function(){
	return {
		scope:{
			size:"@",
			action:"&",
			hideConfirm:'='
		},
        replace: true,
		restrict:'E',
		templateUrl: '/views/teacher/course_editor/delete_button.html',
		link:function(scope){
			scope.showDeletePopup = function(value) {
				scope.displayDeletePopup = value
			};
		}
	}
});