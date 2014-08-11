'use strict';

angular.module('scalearAngularApp')
.directive('quizList',function(){
		return {
			// transclude: true,
			// replace:true,
			restrict: 'E', 
			templateUrl: '/views/teacher/course_editor/lecture.middle.quiz_list.html',
			controller: 'lectureQuizListCtrl'
		};
})
.directive('quiz',function(){
		return {
			transclude: true,
			replace:true,
			restrict: 'E', 
			template: '<div class="ontop" id="ontop" style="position: absolute;" ng-class="lecture.aspect_ratio" ng-transclude></div>'
		};
}).directive('editPanel',function(){
	return {		
		 restrict: 'E',
		 template: '<div class="row" id="editing">'+
						'<div class="wheat small-6 small-centered columns" >'+
							'<div class="row">'+
								'<h5 class="no-margin color-wheat"><span translate>online_quiz.editing_quiz</span> {{selected_quiz.question}} <span translate>at</span> {{selected_quiz.time|format}}'+
								'<b><br>{{double_click_msg|translate}}</b></h5>'+
							'</div>'+
							'<div class="row">'+
								'<div class="small-4 small-centered columns">'+
									'<div class="small-6 columns"><button ng-disabled="disable_save_button" class="button tiny" style="margin:5px 0" ng-click="saveBtn()" translate>save</button></div>'+
									'<div class="small-6 columns">'+
										'<button ng-show="!quiz_deletable" class="button secondary tiny" style="margin:5px 0" ng-click="exitBtn()" translate>groups.exit</button>'+
										'<button ng-show=" quiz_deletable" class="button secondary tiny" style="margin:5px 0" ng-click="exitBtn()" translate>lectures.cancel</button>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</div>',
	};
}).directive('dropdownList',function(){
	return {
		 scope: {
		 	title:"@",
		 	quiztype:'@',
		 	list:"=",
		 	action:"&"
		 },
		 restrict: 'E',
		 template: 	//'<div>'+
						'<a class="button tiny secondary dropdown" dropdown-toggle="#{{quiztype}}_list" href="" style="background-image: initial;">'+
							'{{title}} '+
							// '<span class="caret"></span>'+
						'</a>'+
						'<ul id="{{quiztype}}_list" class="f-dropdown" >'+
				              '<li ng-repeat="item in list">'+
				              		// '<a href="" class="insertQuiz" ng-click="action()(quiztype,item.type)">{{"lectures."+item.text|translate}}</a>'+
				              		'<a ng-hide="quiztype==\'invideo\' && item.only==\'html\'" href="" class="size-12 insertQuiz" ng-click="action()(quiztype,item.type)">{{"lectures."+item.text|translate}}</a>'+
				              '</li>'+ 
						'</ul>'//+
				  	//'</div>'
	};
}).directive('answervideo', ['$compile',function($compile){
	return {
		 scope: {
		 	quiz:"=",
		 	data:"=",
		 	list:'=',
		 	remove:"&"
		 },
		 replace:true,
		 restrict: 'E',
		 template: "<div ng-switch on='quiz.question_type.toUpperCase()'>"+
		 				"<answer ng-switch-when='MCQ' />"+
		 				"<answer ng-switch-when='OCQ' />"+
		 				"<drag ng-switch-when='DRAG' />"+
	 				"</div>",
	};
}]).directive('answer', ['$rootScope','$log','$timeout', function($rootScope,$log,$timeout){
	return {
		 replace:true,
		 restrict: 'E',
		 templateUrl:'/views/teacher/course_editor/answer.html',

		link: function(scope, element, attrs) {

			//==FUNCTIONS==//
			var setAnswerLocation=function(){
				element.css('z-index', 5)
				$log.debug("setting answer location")
				var ontop=angular.element('.ontop');		
				var w = scope.data.width * ontop.width();
				var h = scope.data.height* (ontop.height());
				// var add_left= (w-13)/2.0
				// var add_top = (h-13)/2.0
				// scope.xcoor = (scope.data.xcoor * ontop.width())+ add_left;				
				// scope.ycoor = (scope.data.ycoor * (ontop.height())) + add_top;
				scope.xcoor = scope.data.xcoor
				scope.ycoor = scope.data.ycoor
				scope.popover_options.fullscreen = (ontop.css('position') == 'fixed');
				// $log.debug(scope.xcoor+add_left)
				// $log.debug(scope.ycoor+add_top)
			}	

			scope.setAnswerColor=function(){
				$log.debug("image change")
				$log.debug(scope.data.correct)
				if(scope.quiz.question_type == "OCQ")
					scope.imgName = scope.data.correct? scope.ocq_correct : scope.ocq_incorrect;
				else
					scope.imgName = scope.data.correct? scope.mcq_correct : scope.mcq_incorrect;
			}

			scope.calculatePosition=function(){
				var ontop=angular.element('.ontop');		
				scope.data.xcoor= parseFloat(element.position().left)/ontop.width();
				scope.data.ycoor= parseFloat(element.position().top)/(ontop.height());
				scope.calculateSize()
				$log.debug(element.position().left)				
				$log.debug(element.position().top)				
			}

			scope.calculateSize=function(){
				var ontop=angular.element('.ontop');	
				scope.data.width= element.width()/ontop.width();
				scope.data.height= element.height()/(ontop.height());
			}

			scope.radioChange=function(corr_ans){
				if(scope.quiz.question_type == "OCQ"){
					$log.debug("radioChange")
					scope.quiz.answers.forEach(function(ans){
						ans.correct=false
					})
					corr_ans.correct=true
					$rootScope.$emit("radioChange")
				}
				
			}
			scope.selectField=function(ev){
				var target = angular.element(ev.target)
				$timeout(function(){
					target.select()
				})
				
			}
			scope.updateValues= function()
			{
				$log.debug("in value update")
				$log.debug(scope.quiz);
				$log.debug(scope.quiz.answers);
				scope.values=0
				for(var element in scope.quiz.answers)
				{
					$log.debug(scope.quiz.answers[element].correct)
					if(scope.quiz.answers[element].correct==true)
					{
						$log.debug("in true");
						scope.values+=1
					}
				}
				$log.debug(scope.values)
			}
			//==========//
	
			$rootScope.$on("radioChange",function(){
				scope.setAnswerColor()
			})
			// $rootScope.$on("updatePosition",function(){
			// 	$log.debug("event emiited updated position")
			// 	setAnswerLocation()
			// })	

			scope.answerClass = "component dropped answer_img"	

			var template =""
			if(scope.quiz.quiz_type == 'survey')
				template = "<form name='aform'>"+								
								"<label>{{'groups.answer'|translate}}<h6><small translate>lectures.shown_in_graph</small></h6>"+ 
								"<textarea rows=3 class='must_save' ng-class='{error: aform.answer.$error.required}' type='text' ng-model='data.answer' ng-focus='selectField($event)' value={{data.answer}} name='answer' required></textarea>"+
								"<small class='error' ng-show='aform.answer.$error.required' style='padding-top: 5px;'>{{'courses.required'|translate}}!</small>"+
								"</label>"+
								"<button type='button' ng-click='remove()' class='button tiny alert with-tiny-margin remove_button'>{{'lectures.remove'|translate}}</button>"+
							"</form>"
			else
				template = "<form name='aform'>"+
								"<label>{{'lectures.correct' | translate}}"+
								"<input class='must_save_check' ng-class='{error: aform.mcq.$error.atleastone}' atleastone ng-change='radioChange(data);setAnswerColor();updateValues();' ng-model='data.correct' style='margin-left:10px;margin-bottom:2px' type='checkbox' ng-checked='data.correct' name='mcq'/>"+
								"<small class='error' ng-show='aform.mcq.$error.atleastone' translate>lectures.choose_atleast_one</small>"+
								"</label><label>{{'groups.answer'|translate}}"+
								"<h6 class='subheader'><small translate>lectures.shown_in_graph</small></h6>"+ 
								"<textarea rows=3 class='must_save' type='text' ng-model='data.answer' ng-focus='selectField($event)' value={{data.answer}} name='answer' ng-class='{error: aform.answer.$error.required}' required></textarea>"+
								"<small class='error' ng-show='aform.answer.$error.required' style='padding-top: 5px;'>{{'courses.required'|translate}}!</small>"+
								"</label><label>{{'lectures.explanation'|translate}}"+
								"<h6 class='subheader'><small translate>lectures.shown_to_student</small></h6>"+
								"<textarea rows=3 class='must_save' type='text' ng-model='data.explanation' value={{data.explanation}}></textarea>"+
								"</label>"+
								"<button type='button' ng-click='remove()' class='button tiny alert with-tiny-margin remove_button'>{{'lectures.remove'|translate}}</button>"+
							"</form>"

           	scope.popover_options={
            	content: template,
            	html:true,
            	fullscreen:false
            }
            
            scope.$watch('quiz.answers', function(){
				scope.updateValues();	
			},true)

            // setAnswerLocation()
			scope.setAnswerColor()
		}
	};
}]).directive('drag', ['$rootScope','$log','$translate', function($rootScope, $log, $translate){
	return {
		 replace:true,
		 restrict: 'E',
		 template: "<div>"+
		 				"<div ng-class='dragClass' style='background-color:blue;padding:0px;position:absolute; min-height:40px; min-width: 40px;' ng-style=\"{width: width, height: height, top: ycoor, left: xcoor}\" data-drag='true' data-jqyoui-options=\"{containment:'.ontop'}\" jqyoui-draggable=\"{animate:true, onStop:'calculatePosition'}\" >"+
		 					"<div class='input-prepend'>"+
		 						"<span class='position-header error light-grey dark-text no-margin'>{{data.pos}}</span>"+
			 					"<textarea class='area' style='resize:none;display: inline-block;width:100%;height:100%;padding:10px;font-size: 14px; min-height: 40px; min-width: 40px;' ng-style=\"{max_width: width, max_height: height}\" ng-class=\"{error: !data.answer}\" ng-model='data.answer' value='{{data.answer}}' pop-over='popover_options' unique='true' required/>"+
			 					"<small class='error' ng-show=\"!data.answer\">{{'courses.required' | translate}}</small>"+
		 					"</div>"+
	 					"</div>"+

	 					"<span class='dragged handle' data-drag='true' ng-style=\"{top: sub_ycoor, left: sub_xcoor}\" data-jqyoui-options=\"{containment:'.ontop'}\" jqyoui-draggable=\"{animate:true, onStop:'calculatePosition'}\" >{{data.answer}}</span>"+
 					"</div>",

		link: function(scope, element, attrs) {

            $rootScope.$watch("current_lang", function(){
                scope.require_translated= $translate("courses.required")
            });
			//==FUNCTIONS==//
			var setAnswerLocation=function(){
				var ontop=angular.element('.ontop');
				scope.width  = scope.data.width * ontop.width();
				scope.height = scope.data.height* (ontop.height());
				scope.xcoor = (scope.data.xcoor * ontop.width())
				scope.ycoor = (scope.data.ycoor * (ontop.height()))
				scope.sub_xcoor = (scope.data.sub_xcoor * ontop.width())
				scope.sub_ycoor = (scope.data.sub_ycoor * (ontop.height()))
				scope.area_width= scope.width - 50
				scope.area_height= scope.height - 20
				scope.popover_options.fullscreen = (ontop.css('position') == 'fixed');
			}

			scope.calculatePosition=function(){
				var ontop=angular.element('.ontop');
				var main = angular.element(element.children()[0])
				var sub = angular.element(element.children()[1])
				scope.data.xcoor= parseFloat(main.position().left)/ontop.width();
				scope.data.ycoor= parseFloat(main.position().top)/ ontop.height();
				scope.data.sub_xcoor= parseFloat(sub.position().left)/ontop.width();
				scope.data.sub_ycoor= parseFloat(sub.position().top)/ ontop.height();
				console.log(scope.data)
				scope.calculateSize()
			}
			scope.calculateSize=function(){
				var ontop=angular.element('.ontop');
				var main = angular.element(element.children()[0])
				console.log(scope.area_width+", "+scope.area_height)
				scope.data.width= main.width()/ontop.width();
				scope.data.height= main.height()/(ontop.height());
			}			
			//==========//	
			
			$rootScope.$on("updatePosition",function(){
				$log.debug("event emiited updated position")
				setAnswerLocation()
			})	

			scope.dragClass = "component dropped answer_drag" 

			if(scope.data.pos == null){	
				$log.debug("pos undefined")
				var max = Math.max.apply(Math,scope.list)
				max = max ==-Infinity? -1 : max
				$log.debug("max= "+max)
				scope.data.pos=max+1
				scope.list.push(scope.data.pos)
			}

			scope.pos= parseInt(scope.data.pos)

			if(!(scope.data.explanation instanceof Array)){
				$log.debug("not an array")
				scope.data.explanation = []
				for(var i in scope.list)
					scope.data.explanation[i]=""
			}

			scope.quiz.answers.forEach(function(ans){
				if(!ans.explanation[scope.pos])
				{
					ans.explanation[scope.pos]=""
					$log.debug("creating a new eleme in array" + scope.pos)
				}
			})


			var template = '<ul>'+
							'<label><span translate>groups.correct_because</span>'+
								'<textarea rows=3 type="text" class="must_save" ng-model="data.explanation[pos]" />'+
							'</label>'+
							'<label ng-repeat=\'num in list|filter:"!"+pos\' >'+
								'{{num}} <span translate>groups.incorrect_because</span>'+
								'<textarea rows=3 class="must_save" style="resize:vertical;" ng-model="data.explanation[num]" />'+
							'</label>'+
							'<button type="button" ng-click="remove()" class="button tiny alert with-tiny-margin remove_button">{{"lectures.remove"|translate}}</button>'+
						'</ul>'

            scope.popover_options={
            	content: template,
            	html: true,
            	fullscreen:false
            }
            console.log(element)

            angular.element(element.children()[0]).resizable({
            	containment: ".videoborder",  
            	// alsoResize: element.find('.area'), 
            	minHeight:40, 
            	minWidth:40,
		  		stop: scope.calculateSize
        	});

        	setAnswerLocation()
		}
	};
}]).directive('answerform',['$log',function($log){
	return {
		scope: {
			quiz:"=",
			add:"&",
			remove:"&",
			removeq:"&",
			column: "@",
			columna:"@",
			index: "=",
			submitted: "=",
			subtype:"=",
			sortable:'@'
		},
		restrict: 'E',
		templateUrl: '/views/teacher/course_editor/answer_forum.html',
		link: function(scope, element, iAttrs) {			
			
			scope.isSurvey = function()
			{
				if(scope.subtype)
					return scope.subtype.toUpperCase()=="SURVEY"
				else
					return false
			}
			scope.isFreeText = function()
			{
				return (scope.quiz.question_type=="Free Text Question")
			}
			
			scope.isNormalQuiz = function()
			{
				return "content" in scope.quiz
			}

			scope.cc =['MCQ', 'OCQ','Free Text Question']
			scope.match_types =['Free Text', 'Match Text']
			console.log(scope.quiz)
			// if(scope.isFreeText()){
				if(!scope.quiz.match_type)
					scope.quiz.match_type = scope.match_types[0]
		 	// }

			if(!scope.isSurvey())
				scope.cc.push('drag')
			// else
			// 	scope.cc.push('Free Text Question')
			$log.debug("QUIZZ is ");
			$log.debug(scope.quiz);
			scope.addAnswer=scope.add()
			scope.removeQuestion=scope.removeq()
			element.find('input')[0].focus()

            scope.$on('$destroy', function() {
                shortcut.remove("Enter");
            });

			shortcut.add("Enter",function(){
				if(!scope.isFreeText()){
					var all_inputs= element.find('input')
					$log.debug(all_inputs.length)
					all_inputs.each(function(ind,elem){
						$log.debug(elem)
						if(document.activeElement == elem)
							scope.addAnswer("",scope.quiz)
						return
					})
					scope.$apply()
					if(element.find('input')[all_inputs.length])
						element.find('input')[all_inputs.length].focus()
				}
			},{"disable_in_input" : false, 'propagate':true});			
			
		}
	};
}]).directive('htmlanswer',['$log',function($log){
	return {
	 	restrict: 'E',
	 	template: "<div ng-switch on='quiz.question_type.toUpperCase()'>"+
					"<div ng-switch-when='FREE TEXT QUESTION' ><html_freetext ng-repeat='answer in quiz.answers' /></div>"+
					"<div ng-switch-when='MCQ' ><html_mcq  ng-repeat='answer in quiz.answers' /></div>"+
					"<div ng-switch-when='OCQ' ><html_ocq  ng-repeat='answer in quiz.answers' /></div>"+	
					"<ul  ng-switch-when='DRAG' ui-sortable ng-model='quiz.answers' >"+
						"<html_drag ng-repeat='answer in quiz.answers' />"+
					"</ul>"+
				"</div>",
		link:function(scope){
			scope.removeAnswer=scope.remove()
			
			
			scope.updateValues= function()
			{
				scope.values=0
				for(var element in scope.quiz.answers)
					if(scope.quiz.answers[element].correct)
						scope.values+=1
			}
			
			
			scope.radioChange=function(corr_ans){
				scope.quiz.answers.forEach(function(ans){
					ans.correct=false
				})
				corr_ans.correct=true
				
				scope.updateValues();
			}
			
			scope.show = function()
			{
				 return ("content" in scope.quiz)
			}
			
			scope.$watch('quiz.answers', function(){
				scope.updateValues();	
			},true)
			
		}
	};
}]).directive('htmlFreetext',function(){	
	return{
		restrict:'E',
		template:"<ng-form name='aform'>"+
					"<div class='row'>"+
						"<div class='small-10 columns'>"+
							"<input required name='answer' type='text' placeholder='String to match' ng-model='answer[columna]' style='margin-bottom: 0;' />"+
							"<small class='error' ng-show='submitted && aform.answer.$error.required' style='padding-top: 5px;'>{{'courses.required'|translate}}!</small>"+
						"</div>"+
					"</div>"+
					"<div class='text-left size-12'>"+
						"<div><br/><span translate>regex.enter_string</span><br /><br /><span translate>Examples</span>:</div>"+
						"<ul class='size-12'>"+
							"<li>Waterloo -> <span translate>regex.correct_if</span> 'Waterloo'</li>"+
							"<li>/(Waterloo|waterloo)/ -> <span translate>regex.correct_for</span> 'Waterloo' , 'waterloo'</li>"+
							"<li>/[0-9]/ -> <span translate>regex.correct_for</span> <span translate>regex.any_integer</span></li>"+
							"<li>/(10|14|29)/ -> <span translate>regex.correct_for</span> <span translate>regex.numbers</span></li>"+
						"</ul>"+
					"</div>"+
				"</ng-form>"
	}
	
}).directive('htmlMcq',function(){	
	return{
		restrict:'E',
		template:"<ng-form name='aform'>"+
					"<div class='row'>"+
						"<div class='small-10 columns'>"+
							"<input required name='answer' type='text' placeholder={{'groups.answer'|translate}} ng-model='answer[columna]' />"+
							"<small class='error' ng-show='submitted && aform.answer.$error.required'>{{'courses.required'|translate}}!</small>"+
							"<small class='error' ng-show='submitted && aform.mcq.$error.atleastone' translate>lectures.choose_atleast_one</small>"+
							"<input ng-if='show() && !isSurvey()' type='text' class='explain' placeholder={{'lectures.explanation'|translate}} ng-model='answer.explanation' value='{{answer.explanation}}' />"+

						"</div>"+
						"<div class='small-1 columns' ng-if='!isSurvey()'>"+
							"<input ng-change='updateValues()' atleastone type='checkbox' name='mcq' ng-model='answer.correct' ng-checked='answer.correct' />"+
						"</div>"+
						"<div class='small-1 columns'>"+
							"<delete_button size='small' color='dark' action='removeAnswer($index, quiz)' />"+
						"</div>"+
					"</div>"+
				"</ng-form>"
	}
	
}).directive('htmlOcq',function(){
	return {
		restrict:'E',
		template:"<ng-form name='aform'>"+
					"<div class='row'>"+
						"<div class='small-10 columns'>"+
							"<input required name='answer' type='text' placeholder={{'groups.answer'|translate}} ng-model='answer[columna]' />"+
							"<small class='error' ng-show='submitted && aform.answer.$error.required' >{{'courses.required'|translate}}!</small>"+
							"<small class='error' ng-show='submitted && aform.$error.atleastone' translate>lectures.choose_atleast_one</small>"+
							"<input ng-if='show() && !isSurvey()' type='text' class='explain' placeholder={{'lectures.explanation'|translate}} ng-model='answer.explanation' value='{{answer.explanation}}' /> "+
						"</div>"+
						"<div class='small-1 columns' ng-if='!isSurvey()'>"+
							"<input id='radio_correct' atleastone type='radio' ng-model='answer.correct' ng-value=true ng-click='radioChange(answer)'/>"+
						"</div>"+
						"<div class='small-1 columns'>"+
							"<delete_button size='small' color='dark' action='removeAnswer($index, quiz)' style='float: right; margin-right: 15px;'/>"+
						"</div>"+
					"</div>"+
				"</ng-form>",
		link: function(scope)
		{
			if(scope.answer.correct)
			{
				scope.radioChange(scope.answer);
			}
			scope.getName= function()
			{
				return "ocq"+scope.index+scope.$index
			}
		}
	}
	
}).directive('htmlDrag',function(){
	return {
		restrict:'E',
		replace:true,
		template:"<li class='ui-state-default'>"+	
					"<ng-form name='aform'>"+					
						"<div class='row' style='padding: 5px;'>"+
							"<div class='small-1 columns'>"+
								"<span class='ui-icon ui-icon-arrowthick-2-n-s drag-item' ></span>"+
							"</div>"+
							"<div class='small-10 columns'>"+
								"<input type='text' required name='answer' placeholder={{'groups.answer'|translate}} ng-model='answer[columna]' style='margin-bottom:0'/>"+
								"<small class='error' ng-show='submitted && aform.answer.$error.required && !hide_valid' >{{'courses.required'|translate}}!</small>"+
							"</div>"+
							"<div class='small-1 columns'>"+
								"<delete_button size='small' color='dark' action='removeAnswer($index, quiz)' ng-click='aform.answer.$error.required && submitted && (hide_valid=!hide_valid)' />"+
							"</div>"+
						"</div>"+
					"</ng-form>"+
				"</li>"

	}
	
}).directive('atleastone', ['$log', function($log) {
	return {
		require: 'ngModel',
		link: function(scope, elm, attrs, ctrl) {
		
			scope.validate = function(value) {
				if (scope.values<1) {
					$log.debug("errorrr");
					ctrl.$setValidity('atleastone', false);
				} else {
					ctrl.$setValidity('atleastone', true);
				}
			}

			scope.$watch('values',function(){
				scope.validate();
			});
		}
	};
}]).directive('controlsTeacher', ['$window','$timeout', function($window,$timeout) {
  return {
      restrict: "E",
      scope:{
        link:'&'
      },
      templateUrl: "/views/teacher/course_editor/controls_teacher.html",
      link: function (scope, element) {
// <<<<<<< HEAD
//   	 	scope.toggleLink=function(event){
//   	 		if(!scope.link_url){
// 	            scope.link_url=scope.link()
// 	            $timeout(function() {
// 	                element.find('.video_link').select();
// 	            });
// 	            $(document).on("click", function (e) {
// 		            if(e.target != element.children()[0] && e.target != element.children()[1]){
// 		              scope.link_url=null
// 		              scope.$apply()
// 		              $(document).off("click")
// 		            }         
//          	 	});
// 	        }
// 	        else{
// 	        	scope.link_url=null
// 	        	$(document).off("click")  
// 	        }

	         
  	 	scope.selectLink=function(event){
            // scope.link_url=scope.link()
            $timeout(function() {
                element.find('.video_link').select();
            });
        }
        scope.link_content = {
        	content: "<div style='word-break: break-all;'>"+scope.link()+"</div>",
        	html:true,
        	fullscreen:false,
        	placement: 'left'
        }
      }
    };
}])
