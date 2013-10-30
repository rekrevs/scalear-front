'use strict';

angular.module('scalearAngularApp')
  .directive('teacherQuiz/teacherQuiz', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the teacherQuiz/teacherQuiz directive');
      }
    };
  })
.directive("module",function(myAppConfig){
	return {
		restrict: "E",
		scope: {
			name:"@",
			id:"@",
			isOpen2: "="
		},
		template: "<h5>"+
					"<img src='"+myAppConfig.host+"/assets/move2.png' class='handle' title ='drag_to_reorder_module' />"+
					"<a class='trigger' ng-class='{open:isOpen2[id]==true}' ng-click='invert_open()' href=''>{{name}}</a>"+
					
					// "<a href='/en/courses/{{course.id}}/groups/{{id}}' data-confirm='Are you sure you want to delete {{name}} and all of its"+ "contents?' data-method='delete' data-remote='true' id='removeB' rel='nofollow' style='float:right;' title='Delete'><img alt='Trash3'"+
					// "src='/assets/trash3.png'>"+
					// "</a>"+
				  "</h5>",
		link: function(scope)
		{
			scope.invert_open = function()
			{
				console.log(scope.isOpen2[scope.id]);
				if(scope.isOpen2[scope.id]==true)
				{
					   //scope.isOpen2={};
					scope.isOpen2[scope.id] = false
				}
				else
				{   //scope.isOpen2={};
					for(var e in scope.isOpen2)
					{
						console.log(e);
						scope.isOpen2[e]=false;
					}
					scope.isOpen2[scope.id] = true
				}
			}
		}
	}
 }).directive('item',function(myAppConfig){
	return {
		 scope: {
		 	name:'@',
		 	id:'='
		 },
		 restrict: 'E', 
		 template: '<img src="'+myAppConfig.host+'/assets/move2.png" class="handle2" title ="drag_to_reorder_module" />'+
	               '<a class="trigger2"  ui-sref="teacher_quiz.fillView({ quiz_id: id })" >{{name}}</a>'//+
	               // '<a href="/en/courses/{{course.id}}/lectures/{{id}}" data-confirm="Are you sure you want to delete {{name}} and all of its contents?" data-method="delete" data-remote="true" id="removeB" rel="nofollow" style="float:right;display:inline-table;" title="Delete"><img alt="Trash3" src="/assets/trash3.png"></a>'
	};
}).directive('ngbutton', function(myAppConfig){
	return {
		 scope: {
		 	title:"@",
		 	type:"@",
		 	groupid:"@"
		 },
		 restrict: 'E', 
		 template: '<a href="'+myAppConfig.host+'/en/courses/{{course.id}}/lectures/new_or_edit?group={{groupid}}&type={{type}}" >{{title}}</a>'
	};
});