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
 }).directive("modulesSelector",function(){
	return {
		restrict: "E",
		scope: {
			name:"=",
			time:"=",
			questions:"=",
			id:'=',
			open: "=",
			modules: "="
		},
		templateUrl: "/views/student/lectures/modules_selector.html",
	  link: function(scope, element){
	  		scope.collapse = false;
	  		scope.hide = true;
	  		scope.current_module_index = 0;
	  		scope.$watch('modules', function(){
	  			if(!scope.has_been_set && scope.modules){
	  				
	  				scope.has_been_set = true;
	  			}
	  		})
	  		scope.toggleCollapse = function(should_unhide){
	  			if(should_unhide && scope.hide == true)
	  				scope.hide=false;
	  			scope.collapse = !scope.collapse;
	  		}
			scope.$watch('modules', function(){
				if(scope.modules){
					scope.current_module = scope.shortenModuleName(scope.modules[0].name)
					scope.columns = Math.ceil((scope.modules.length/10)+1)
					scope.columns_style = 'column-count:'+scope.columns+'; -webkit-column-count: '+scope.columns+'; -moz-column-count: '+scope.columns+'; -ms-column-count: '+scope.columns+'; -o-column-count: '+scope.columns+';';
					scope.toggleCollapse(false);
					scope.hide=true;
					console.log(scope.modules) 
				}
			})
			scope.showModule = function(module_index){
				scope.current_module = scope.shortenModuleName(scope.modules[module_index].name);
				scope.current_module_index = module_index;

			}
			scope.shortenModuleName = function(name){
				if(name.length > 20) {
				    name = name.substring(0,14)+"...";
				}
				return name;
			}
			scope.getModuleOfLecture = function(lecture_id){

			}

		}
	}
 }).directive("lecturesBar",function(){
	return {
		restrict: "E",
		scope: {
			lectures: '='
		},
		templateUrl: "/views/student/lectures/lectures_bar.html",
	  link: function(scope, element){
	  		
		}
	}
 }).directive("moduleProgressCircle",function(){
	return {
		restrict: "E",
		scope: {
			percentage: "=",
			innercolor: "@",
			circlesize: "@",
			module: "="
		},
		templateUrl: "/views/module_progress_circle.html",
	  link: function(scope, element){
	  		scope.$watch('module', function() {
	  			// console.log(scope.innercolor)
	  			// console.log()
				var canvas;
				var ctx;
				var bg = element.children()[1]
				var ctx = ctx = bg.getContext('2d');
				ctx.clearRect(0, 0, bg.width, bg.height);
				ctx.fillStyle = scope.innercolor;
				ctx.beginPath();
				ctx.moveTo(bg.width/2,bg.height/2);
				// console.log(scope.percentage)
				ctx.arc(bg.width/2,bg.height/2,bg.height/2,0,(Math.PI*2*(scope.calculatePercentageDone())),false);
				ctx.lineTo(bg.width/2,bg.height/2);
				ctx.fill();
			})

			scope.calculatePercentageDone = function(){
				var total = scope.module.lectures.length;
				var done_count = 0;
				for(var i=0; i<scope.module.quizzes.length; i++){
					if(scope.module.quizzes[i].quiz_type != 'survey' && scope.module.quizzes[i].required == true){
						total++;
					}
				}
				scope.module.lectures.forEach(function(lecture, i){
					if(lecture.is_done == true){
						done_count++;
					}
				})
				scope.module.quizzes.forEach(function(quiz, i){
					if(quiz.is_done == true && quiz.quiz_type != 'survey' && quiz.required == true){
						done_count++;
					}
				})
				return (done_count/total);
			}
			
		}
	}
 }).directive('coursewareItem',['CourseEditor','$state', function(CourseEditor, $state){
	return {
		 scope: {
		 	circlesize: '@',
		 	name:'=',
		 	id:'=',
            groupId: '=',
		 	className:'=',
		 	url:"=",
		 	quizType:"=", 
		 	done: "=",
		 	required: "="
		 },
		 restrict: 'E', 
		 templateUrl: '/views/student/lectures/courseware_item.html',
		 link: function(scope, element){
		 	scope.$watch('done', function(){
		 		var canvas;
				var ctx;
				// console.log(element.children())
				var bg = element.children()[1].children[0]
				var ctx = ctx = bg.getContext('2d');
		 		if(scope.done == true){
					ctx.clearRect(0, 0, bg.width, bg.height);
					ctx.fillStyle = 'lightgreen';
					ctx.beginPath();
					ctx.moveTo(bg.width/2,bg.height/2);
					// console.log(scope.percentage)
					ctx.arc(bg.width/2,bg.height/2,bg.height/2,0,(Math.PI*2*(1)),false);
					ctx.lineTo(bg.width/2,bg.height/2);
					ctx.fill();
		 		}

		 	})

		 	scope.type= scope.className=="Quiz"? CourseEditor.capitalize(scope.quizType): scope.className;
             scope.url_with_protocol = function(url)
             {
                 if(url)
                     return url.match(/^http/)? url: 'http://'+url;
                 else
                     return url;
             }
             scope.isFinished = function(finished){
             	if(finished == true){
             		return 'Finished '
             	}
             }
             scope.isRequired = function(required){
             	if(required == true){
             		return 'Required '
             	}
             }
            scope.showItem= function(item_id)
		 	{	
		 		scope.$parent.$parent.close_selector = true;
		 		scope.$parent.$parent.current_item = item_id
		 		if(scope.className=="Document")
		 			window.open(scope.url_with_protocol(scope.url),'_blank');
		 		else
		 		{	
		 			var next_state="course.lectures.module."+scope.className.toLowerCase();
		 			var s= scope.className.toLowerCase()+"_id"
		 			var to={}
		 			to[s] = scope.id
		 			// to['module_id'] = scope.groupId;
                    console.log("group id iss");
                    console.log(scope.groupId)
                    to["module_id"]=scope.groupId
		 			$state.go(next_state, to);
		 		}
		 	}
		 }
	};
}]);