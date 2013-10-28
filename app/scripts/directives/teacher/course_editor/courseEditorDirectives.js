'use strict';

angular.module('scalearAngularApp')
	.directive("module",function(){
	return {
		restrict: "E",
		scope: {
			name:"@",
			id:"@"
		},
		template: "<h5>"+
					"<img src='images/move2.png' class='handle' title='drag to reorder' />"+
					"<a class='trigger' ng-class='{open:isOpen}' ng-click='isOpen = !isOpen' href=''>{{name}}</a>"+
					// "<a href='/en/courses/{{course.id}}/groups/{{id}}' data-confirm='Are you sure you want to delete {{name}} and all of its"+ "contents?' data-method='delete' data-remote='true' id='removeB' rel='nofollow' style='float:right;' title='Delete'><img alt='Trash3'"+
					// "src='images/trash3.png'>"+
					// "</a>"+
				  "</h5>"
	}
 }).directive('item',function(){
	return {
		 scope: {
		 	name:'@',
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
		 	type:"@",
		 	groupid:"@"
		 },
		 restrict: 'E', 
		 template: '<a href="/en/courses/{{course.id}}/lectures/new_or_edit?group={{groupid}}&type={{type}}" >{{title}}</a>'
	};
});