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
		 template: '<div id="editing">'+
						'<div class="alert" >'+
							'<div>'+
								'<span translate>online_quiz.editing_quiz</span> {{selected_quiz.question}} <span translate>at</span> {{selected_quiz.time|format}}'+
								'<b><br>{{double_click_msg|translate}}</b>'+
							'</div>'+
							'<button ng-disabled="disable_save_button" class="btn btn-primary" id="done" style="margin-top:5px;" ng-click="saveBtn()" translate>save</button>'+
							'<a class="btn" ng-show="!quiz_deletable" id="done" style="margin-top:5px;" ng-click="exitBtn()" translate>groups.exit</a>'+
							'<a class="btn" ng-show="quiz_deletable" id="done" style="margin-top:5px;" ng-click="exitBtn()" >Cancel</a>'+
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
		 template: 	'<div class="btn-group">'+
						'<a class="btn btn-small btn-success dropdown-toggle" data-toggle="dropdown" href="" style="background-image: initial;">'+
							'{{title}} '+
							'<span class="caret"></span>'+
						'</a>'+
						'<ul class="dropdown-menu" style="left:-35%;font-size:12px">'+
				              '<li ng-repeat="item in list">'+
				              		// '<a href="" class="insertQuiz" ng-click="action()(quiztype,item.type)">{{"lectures."+item.text|translate}}</a>'+
				              		'<a ng-hide="quiztype==\'invideo\' && item.only==\'html\'" href="" class="insertQuiz" ng-click="action()(quiztype,item.type)">{{"lectures."+item.text|translate}}</a>'+
				              '</li>'+ 
						'</ul>'+
				  	'</div>'
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
								"<p style='margin: 4px 0 0 0;'>{{'groups.answer'|translate}}:</p><small class='muted' style='font-size:9px' translate>lectures.shown_in_graph</small>"+ 
								"<textarea rows=3 class='must_save' type='text' ng-model='data.answer' ng-focus='selectField($event)' value={{data.answer}} name='answer' required/>"+
								"<span class='help-inline' ng-show='aform.answer.$error.required' style='padding-top: 5px;'>{{'courses.required'|translate}}!</span>"+
								"<br>"+
								"<input type='button' ng-click='remove()' class='btn btn-danger remove_button' value={{'lectures.remove'|translate}} />"+
							"</form>"
			else
				template = "<form name='aform'>"+
								"<span translate>lectures.correct</span>:"+
								"<input class='must_save_check' atleastone ng-change='radioChange(data);setAnswerColor();updateValues();' ng-model='data.correct' style='margin-left:10px;margin-bottom:2px' type='checkbox' ng-checked='data.correct' name='mcq'/>"+
								"<span class='help-inline' ng-show='aform.mcq.$error.atleastone' translate>lectures.choose_atleast_one</span>"+
								"<p style='margin: 4px 0 0 0;'>{{'groups.answer'|translate}}:</p><small class='muted' style='font-size:9px' translate>lectures.shown_in_graph</small>"+ 
								"<textarea rows=3 class='must_save' type='text' ng-model='data.answer' ng-focus='selectField($event)' value={{data.answer}} name='answer' required/>"+
								"<span class='help-inline' ng-show='aform.answer.$error.required' style='padding-top: 5px;'>{{'courses.required'|translate}}!</span>"+
								"<p style='margin: 4px 0 0 0;'>{{'lectures.explanation'|translate}}:</p><small class='muted' style='font-size:9px' translate>lectures.shown_to_student</small>"+
								"<textarea rows=3 class='must_save' type='text' ng-model='data.explanation' value={{data.explanation}} />"+
								"<br>"+
								"<input type='button' ng-click='remove()' class='btn btn-danger remove_button' value={{'lectures.remove'|translate}} />"+
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
		 template: "<div ng-class='dragClass' style='background-color:transparent;width:300px;height:40px;padding:0px;position:absolute;' ng-style=\"{width: width, height: height, top: ycoor, left: xcoor}\" data-drag='true' data-jqyoui-options=\"{containment:'.ontop'}\" jqyoui-draggable=\"{animate:true, onStop:'calculatePosition'}\" >"+
		 				"<div class='input-prepend'>"+
		 					"<span class='add-on'>{{data.pos}}</span>"+
		 					"<textarea class='area' style='resize:none;width:254px;height:20px;padding:10px;' ng-style=\"{width:area_width, height:area_height}\" ng-model='data.answer' value='{{data.answer}}' pop-over='popover_options' unique='true' required  tooltip='{{!data.answer?require_translated:\"\"}}'/>"+
	 					"</div>"+
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
				scope.area_width= scope.width - 50
				scope.area_height= scope.height - 20
				scope.popover_options.fullscreen = (ontop.css('position') == 'fixed');
			}

			scope.calculatePosition=function(){
				var ontop=angular.element('.ontop');
				scope.data.xcoor= parseFloat(element.position().left)/ontop.width();
				scope.data.ycoor= parseFloat(element.position().top)/(ontop.height() );
				scope.calculateSize()
			}
			scope.calculateSize=function(){
				var ontop=angular.element('.ontop');
				scope.data.width= element.width()/ontop.width();
				scope.data.height= element.height()/(ontop.height());
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
							'<p><span translate>groups.correct_because</span>:'+
								'<br>'+
								'<textarea rows=3 type="text" class="must_save" ng-model="data.explanation[pos]" />'+
								'<br>'+
								'<div ng-repeat=\'num in list|filter:"!"+pos\' >'+
									'{{num}} <span translate>groups.incorrect_because</span>:<br>'+
									'<textarea rows=3 class="must_save" type="text" ng-model="data.explanation[num]" />'+
									'<br>'+
								'</div>'+
								'<input type="button" ng-click="remove()" class="btn btn-danger remove_button" value={{"lectures.remove"|translate}} />'+
							'</p>'+
						'</ul>'

            scope.popover_options={
            	content: template,
            	html: true,
            	fullscreen:false
            }

            element.resizable({
            	containment: ".videoborder",  
            	alsoResize: element.find('.area'), 
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
			if(scope.isFreeText){
				if(!scope.quiz.match_type)
					scope.quiz.match_type = scope.match_types[0]
		 	}

			if(!scope.isSurvey())
				scope.cc.push('DRAG')
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
				if(!scope.isFreeText){
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
					"<ul  ng-switch-when='DRAG' class='drag-sort sortable' ui-sortable ng-model='quiz.answers' >"+
						"<html_drag ng-repeat='answer in quiz.answers' />"+
					"</ul>"+
				"</div>",
		link:function(scope){
			scope.removeAnswer=scope.remove()
			
			
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
			
			
			scope.radioChange=function(corr_ans){
				scope.quiz.answers.forEach(function(ans){
					ans.correct=false
				})
				corr_ans.correct=true
				
				scope.updateValues();
			}
			
			scope.show = function()
			{
				 return !("content" in scope.quiz)
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
					"<input required name='answer' type='text' placeholder='String to match' ng-model='answer[columna]' style='margin-bottom: 0;' />"+
					"<span class='help-inline' ng-show='submitted && aform.answer.$error.required' style='padding-top: 5px;'>{{'courses.required'|translate}}!</span>"+
					// "<label>Insert an exact string or a regular expression to match ex: '/[a-z]*/'</label>"+
					"<div><br/><span translate>regex.enter_string</span><br /><br /><span translate>Examples</span>:</div>"+
					//"<div></div>"+
					"<ul>"+
						"<li>Waterloo -> <span translate>regex.correct_if</span> 'Waterloo'</li>"+
						"<li>/(Waterloo|waterloo)/ -> <span translate>regex.correct_for</span> 'Waterloo' , 'waterloo'</li>"+
						"<li>/[0-9]/ -> <span translate>regex.correct_for</span> <span translate>regex.any_integer</span></li>"+
						"<li>/(10|14|29)/ -> <span translate>regex.correct_for</span> <span translate>regex.numbers</span></li>"+
					"</ul>"+
				"</ng-form>"
	}
	
}).directive('htmlMcq',function(){	
	return{
		restrict:'E',
		template:"<ng-form name='aform'>"+
					"<input required name='answer' type='text' placeholder={{'groups.answer'|translate}} ng-model='answer[columna]' />"+
					"<input ng-if='!isSurvey()' ng-change='updateValues()' atleastone type='checkbox' name='mcq' style='margin:5px 10px 15px;' ng-model='answer.correct' ng-checked='answer.correct' />"+
					"<span class='help-inline' ng-show='submitted && aform.answer.$error.required' style='padding-top: 5px;'>{{'courses.required'|translate}}!</span>"+
					"<span ng-if='!isSurvey()' class='help-inline' ng-show='submitted && aform.mcq.$error.atleastone' translate>lectures.choose_atleast_one</span>"+
					"<br ng-if='show()'/>"+
					"<input ng-if='show()' type='text' class='explain' placeholder={{'lectures.explanation'|translate}} ng-model='answer.explanation' value='{{answer.explanation}}' />"+
					"<delete_button size='small' action='removeAnswer($index, quiz)' style='float: right; margin-right: 15px;' />"+
					"<br/>"+
				"</ng-form>"
	}
	
}).directive('htmlOcq',function(){
	return {
		restrict:'E',
		template:"<ng-form name='aform'>"+
					"<input required name='answer' type='text' placeholder={{'groups.answer'|translate}} ng-model='answer[columna]' />"+
					"<input ng-if='!isSurvey()' id='radio_correct' atleastone type='radio' style='margin:5px 10px 15px;' ng-model='answer.correct' ng-value=true ng-click='radioChange(answer)'/>"+
					"<span class='help-inline' ng-show='submitted && aform.answer.$error.required' style='padding-top: 5px;'>{{'courses.required'|translate}}!</span>"+
					"<span ng-if='!isSurvey()' class='help-inline' ng-show='submitted && aform.$error.atleastone' translate>lectures.choose_atleast_one</span>"+
					"<br ng-if='show()'/>"+
					"<input ng-if='show()' type='text' class='explain' placeholder={{'lectures.explanation'|translate}} ng-model='answer.explanation' value='{{answer.explanation}}' /> "+
					"<delete_button size='small' action='removeAnswer($index, quiz)' style='float: right; margin-right: 15px;'/>"+
					"<br>"+
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
						"<span class='ui-icon ui-icon-arrowthick-2-n-s drag-item' style='float:left'></span>"+
						"<input type='text' required name='answer' placeholder={{'groups.answer'|translate}} ng-model='answer[columna]' />"+
						"<span class='help-inline' ng-show='submitted && aform.answer.$error.required && !hide_valid' style='padding-top: 5px;position:absolute;float:right'>{{'courses.required'|translate}}!</span>"+
						"<delete_button size='small' action='removeAnswer($index, quiz)' ng-click='aform.answer.$error.required && submitted && (hide_valid=!hide_valid)' style='float:right; margin-right: 10px;'/>"+
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
}])
