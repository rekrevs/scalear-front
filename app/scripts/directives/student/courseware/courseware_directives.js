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
            groupId: '=',
		 	className:'=',
		 	slides:"=",
		 	url:"=",
		 	quizType:"=", 
		 	done: "=",
		 	required: "="
		 },
		 restrict: 'E', 
		 templateUrl: '/views/student/lectures/courseware_item.html',
		 link: function(scope){
		 	scope.type= scope.className=="Quiz"? CourseEditor.capitalize(scope.quizType): scope.className;
             scope.url_with_protocol = function(url)
             {
                 if(url)
                     return url.match(/^http/)? url: 'http://'+url;
                 else
                     return url;
             }
            scope.showItem= function()
		 	{
		 		if(scope.className=="Document")
		 			window.open(scope.url_with_protocol(scope.url),'_blank');
		 		else
		 		{	
		 			var next_state="course.lectures.module."+scope.className.toLowerCase();
		 			var s= scope.className.toLowerCase()+"_id"
		 			var to={}
		 			to[s] = scope.id
                    console.log("group id iss");
                    console.log(scope.groupId)
                    to["module_id"]=scope.groupId
		 			$state.go(next_state, to);
		 		}
		 	}


		 }
	};
}]);