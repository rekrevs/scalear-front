'use strict';

angular.module('scalearAngularApp')
	.directive("coursewareModule",function(){
	return {
		restrict: "E",
		scope: {
			name:"=",
			time:"=",
			questions:"=",
			id:'=',
			open: "="
		},
		template: "<h5 ng-click='invertOpen()'>"+
					"<table><tr><td><a class='trigger' ng-class='{open:open[id]}'>{{name}}</a></td>"+
					"<td><p style=\"display:inline;font-size:10px;\">{{time}} - {{questions}} {{'q' | translate}}</p></td></td></table>"+
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
 }).directive('coursewareItem',['CourseEditor','$state', function(CourseEditor, $state){
	return {
		 scope: {
		 	name:'=',
		 	id:'=',
		 	className:'=',
		 	slides:"=",
		 	url:"=",
		 	quizType:"=", 
		 	done: "=",
		 	required: "="
		 },
		 restrict: 'E', 
		 template: '<table><tr><td><img ng-src="{{done && \'images/check7.png\' || \'images/empty7.png\'}}"</td><td><a ng-click="showItem()" class="trigger2"><span translate>{{"groups."+type.toLowerCase()}}</span>: {{name}}</a></td>'+
		 			'<td><a style="font-size:10px" target="_blank" ng-if="slides && slides!=\'none\'" href="{{slides}}" translate="lectures.slides"></a><span ng-if="required && quizType==\'quiz\'" class="label label-important" translate>{{"courses.required"}}</span></td></tr></table>',
		 link: function(scope){
		 	scope.type= scope.className=="Quiz"? CourseEditor.capitalize(scope.quizType): scope.className;
		 	scope.showItem= function()
		 	{
		 		if(scope.className=="Document")
		 			window.open(scope.url,'_blank');
		 		else
		 		{	
		 			var next_state="course.lectures."+scope.className.toLowerCase();
		 			var s= scope.className.toLowerCase()+"_id"
		 			var to={}
		 			to[s] = scope.id
		 			$state.go(next_state, to);
		 		}
		 	}
		 }
	};
}]);