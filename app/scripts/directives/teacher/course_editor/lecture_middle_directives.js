'use strict';

angular.module('scalearAngularApp')
	.directive("videoContainer",function(){
		return{
			transclude: true,
			replace:true,
			restrict: "E",
			template: '<div class="videoborder" ng-transclude></div>' //style="border:4px solid" 
		};
}).directive('quiz',function(){
		return {
			transclude: true,
			replace:true,
			restrict: 'E', 
			template: '<div class="ontop" id="ontop" ng-class="lecture.aspect_ratio" ng-transclude></div>'
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
							'<a class="btn btn-primary" id="done" style="margin-top:5px;" ng-click="saveBtn()" translate>save</a>'+
							'<a class="btn" id="done" style="margin-top:5px;" ng-click="exitBtn()" translate>groups.exit</a>'+
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
						'<a class="btn btn-small dropdown-toggle" data-toggle="dropdown" href="">'+
							'{{title}}'+
							'<span class="caret"></span>'+
						'</a>'+
						'<ul class="dropdown-menu" style="left:-35%;font-size:12px">'+
				              '<li ng-repeat="item in list">'+
				              		'<a href="" class="insertQuiz" ng-click="action()(quiztype,item.type)">{{"lectures."+item.text|translate}}</a>'+
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
		 template: "<div ng-switch on='quiz.question_type'>"+
		 				"<answer ng-switch-when='MCQ' />"+
		 				"<answer ng-switch-when='OCQ' />"+
		 				"<drag ng-switch-when='drag' />"+
	 				"</div>",
	};
}]).directive('answer', ['$rootScope', function($rootScope){
	return {
		 replace:true,
		 restrict: 'E',
		 template: "<div ng-style='{left: xcoor, top: ycoor, position: \"absolute\", lineHeight:\"0px\"}' data-drag='true' data-jqyoui-options=\"{containment:'.ontop'}\" jqyoui-draggable=\"{animate:true, onStop:'calculatePosition'}\" >"+
		 				"<img ng-src='images/{{imgName}}' ng-class=answerClass  pop-over='popover_options' unique='true' />"+
	 				"</div>",

		link: function(scope, element, attrs) {

			//===FUNCTIONS===//
			var setAnswerLocation=function(){
				console.log("setting answer location")
				var ontop=angular.element('.ontop');		
				var w = scope.data.width * ontop.width();
				var h = scope.data.height* (ontop.height());
				var add_left= (w-13)/2.0
				var add_top = (h-13)/2.0
				scope.xcoor = (scope.data.xcoor * ontop.width())+ add_left;				
				scope.ycoor = (scope.data.ycoor * (ontop.height())) + add_top;
				scope.popover_options.fullscreen = (ontop.css('position') == 'fixed');
				console.log(scope.xcoor+add_left)
				console.log(scope.ycoor+add_top)
			}	

			scope.setAnswerColor=function(){
				console.log("image change")
				console.log(scope.data.correct)
				if(scope.quiz.question_type == "OCQ")
					scope.imgName = scope.data.correct? 'button_green.png' : 'button8.png';
				else
					scope.imgName = scope.data.correct? 'checkbox_green.gif' : 'checkbox.gif';
			}

			scope.calculatePosition=function(){
				var ontop=angular.element('.ontop');		
				scope.data.xcoor= parseFloat(element.position().left)/ontop.width();
				scope.data.ycoor= parseFloat(element.position().top)/(ontop.height());
				scope.calculateSize()
				console.log(element.position().left)				
				console.log(element.position().top)				
			}

			scope.calculateSize=function(){
				var ontop=angular.element('.ontop');	
				scope.data.width= element.width()/ontop.width();
				scope.data.height= element.height()/(ontop.height());
			}

			scope.radioChange=function(corr_ans){
				if(scope.quiz.question_type == "OCQ"){
					console.log("radioChange")
					scope.quiz.answers.forEach(function(ans){
						ans.correct=false
					})
					corr_ans.correct=true
					$rootScope.$emit("radioChange")
				}
				
			}
			//===============//
	
			$rootScope.$on("radioChange",function(){
				scope.setAnswerColor()
			})
			$rootScope.$on("updatePosition",function(){
				console.log("event emiited updated position")
				setAnswerLocation()
			})	

			scope.answerClass = "component dropped answer_img"						

			var template = "<p>"+
								"<span translate>lectures.correct</span>:"+
								"<input class='must_save_check' ng-change='radioChange(data);setAnswerColor()' ng-model='data.correct' style='margin-left:20px;margin-bottom:2px' type='checkbox' ng-checked='data.correct' />"+
								"<br><span translate>groups.answer</span>:"+ 
								"<textarea rows=3 class='must_save' type='text' ng-model='data.answer' value={{data.answer}}/>"+
								"<br><span translate>lectures.explanation</span>:"+
								"<textarea rows=3 class='must_save' type='text' ng-model='data.explanation' value={{data.explanation}} />"+
								"<br>"+
								"<input type='button' ng-click='remove()' class='btn btn-danger remove_button' value={{'lectures.remove'|translate}} />"+
							"</p>"

           	scope.popover_options={
            	content: template,
            	html:true,
            	fullscreen:false
            }

            setAnswerLocation()
			scope.setAnswerColor()
		}
	};
}]).directive('drag', ['$rootScope', function($rootScope){
	return {
		 replace:true,
		 restrict: 'E',
		 template: "<div ng-class='dragClass' style='background-color:transparent;width:300px;height:40px;padding:0px;position:absolute;' ng-style=\"{width: width, height: height, top: ycoor, left: xcoor}\" data-drag='true' data-jqyoui-options=\"{containment:'.ontop'}\" jqyoui-draggable=\"{animate:true, onStop:'calculatePosition'}\" >"+
		 				"<div class='input-prepend'>"+
		 					"<span class='add-on'>{{data.pos}}</span>"+
		 					"<textarea class='area' style='resize:none;width:254px;height:20px;padding:10px;' ng-style=\"{width:area_width, height:area_height}\" ng-model='data.answer' value='{{data.answer}}' pop-over='popover_options' unique='true'/>"+
	 					"</div>"+
 					"</div>",

		link: function(scope, element, attrs) {
			 
			//===FUNCTIONS===//
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
			//===============//	
			
			$rootScope.$on("updatePosition",function(){
				console.log("event emiited updated position")
				setAnswerLocation()
			})	

			scope.dragClass = "component dropped answer_drag" 

			if(scope.data.pos == null){	
				console.log("pos undefined")
				var max = Math.max.apply(Math,scope.list)
				max = max ==-Infinity? -1 : max
				console.log("max= "+max)
				scope.data.pos=max+1
				scope.list.push(scope.data.pos)
			}

			scope.pos= parseInt(scope.data.pos)

			if(!(scope.data.explanation instanceof Array)){
				console.log("not an array")
				scope.data.explanation = new Array()
				for(var i in scope.list)
					scope.data.explanation[i]=""
			}

			scope.quiz.answers.forEach(function(ans){
				if(!ans.explanation[scope.pos])
				{
					ans.explanation[scope.pos]=""
					console.log("creating a new eleme in array" + scope.pos)
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
}]).directive('answerform',function(){
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
			subtype:"="
		},
		restrict: 'E',
		template: "<ng-form name='qform' style='overflow: auto;'><div style='text-align:left;margin:10px;'>"+
						"<label class='q_label'><span translate>answer.question</span>:</label>"+
						"<input required name='qlabel' type='text' ng-model='quiz[column]' />"+
						"<span class='help-inline' ng-show='submitted && qform.qlabel.$error.required'><span translate>courses.required</span>!</span>"+
						// ADD QUESTION TYPE IF ITS A QUIZ QUESTION.. SELECT LIST.
						"<br />"+
						"<label ng-if='show_question()' class='q_label'><span translate>groups.question_type</span>:</label>"+
						"<select ng-if='show_question()' ng-model='quiz.question_type' required  class='choices'>"+
							"<option value='MCQ'>MCQ</option>"+
							"<option value='OCQ' >OCQ</option>"+
							"<option value='DRAG' ng-if='!isSurvey()' translate>groups.drag</option>"+
							"<option ng-if='isSurvey()' value='Free Text Question' translate>groups.free_text_question</option>"+
						"</select>"+
						"<delete_button ng-if='show_question()' size='small' action='removeQuestion(index)' />"+
						"<br/>"+
						"<div ng-hide='hideAnswer()' class='answer_div'>"+
							"<htmlanswer />"+
							"<a class='add_multiple_answer' ng-click='addAnswer(\"\",quiz)' href='' translate>groups.add_answer</a>"+
							"<br/>"+
						"</div>"+
					"</ng-form>",
		link: function(scope, iElm, iAttrs) {
			console.log("QUIZZ is ");
			console.log(scope.quiz);
			scope.addAnswer=scope.add()
			scope.removeQuestion=scope.removeq()
			
			scope.isSurvey = function()
			{
				if(scope.subtype)
					return scope.subtype.toUpperCase()=="SURVEY"
				else
					return false
			}
			scope.hideAnswer = function()
			{
				return (scope.isSurvey() && scope.quiz.question_type=="Free Text Question")
			}
			
			scope.show_question = function()
			{
				return "content" in scope.quiz
			}
			
			
		}
	};
}).directive('htmlanswer',function(){
	return {
	 	restrict: 'E',
	 	template: "<div ng-switch on='quiz.question_type.toUpperCase()'>"+
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
				console.log("in value update")
				console.log(scope.quiz);
				console.log(scope.quiz.answers);
				scope.values=0
				for(var element in scope.quiz.answers)
				{
					console.log(scope.quiz.answers[element].correct)
					if(scope.quiz.answers[element].correct==true)
					{
						console.log("in true");
						scope.values+=1
					}
				}
				console.log(scope.values)
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
					"<delete_button size='small' action='removeAnswer($index, quiz)' />"+
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
					"<delete_button size='small' action='removeAnswer($index, quiz)' />"+
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
						"<span class='ui-icon ui-icon-arrowthick-2-n-s drag-item'></span>"+
						"<input type='text' required name='answer' placeholder={{'groups.answer'|translate}} ng-model='answer[columna]' />"+
						"<span class='help-inline' ng-show='submitted && aform.answer.$error.required' style='padding-top: 5px;'>{{'courses.required'|translate}}!</span>"+
						"<delete_button size='small' action='removeAnswer($index, quiz)' />"+
					"</ng-form>"+
				"</li>"				 
	}
	
}).directive('atleastone', function() {
	return {
		require: 'ngModel',
		link: function(scope, elm, attrs, ctrl) {
		
			scope.validate = function(value) {
				if (scope.values<1) {
					console.log("errorrr");
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
}).directive('popOver',['$parse','$compile','$q','$window',function ($parse, $compile, $q, $window) {
    return{
  		restrict: 'A',
  		link: function(scope, element, attr, ctrl) {

	        var getter = $parse(attr.popOver)
	        scope.$watch(attr.popOver, function(newval){
	        	var options = getter(scope)
	        	if(options){
		        	element.popover('destroy');
		        	element.popover(options);
		          	var popover = element.data('popover');
			        
			        if(options.content){

		      			if(attr.unique){
			            	element.on('show', function(){
			              		$('.popover.in').each(function(){
			                		var $this = $(this)
			                		var popover = $this.data('popover');
			                		if (popover && !popover.$element.is(element)) {
			                  			$this.popover('hide');		                  			
			                		}
		              			});
			              	});
	              			
			          	}

			          	popover.getPosition = function(){
				            var pop = $.fn.popover.Constructor.prototype.getPosition.apply(this, arguments);
				            $compile(this.$tip)(scope);
				            scope.$digest();
				            this.$tip.data('popover', this);
				            var arrow = angular.element(".arrow")
				            arrow.css("top",'50%');
				            if(options.fullscreen){
					            var win = angular.element($window)
								var elem_top= element.offset().top
								var elem_bottom= win.height() - elem_top;
								var arrow_pos
								if(elem_top<170) //too close to top
								{
									arrow_pos = pop.top + (pop.height/2)
							 		arrow.css("top",arrow_pos+'px');
									pop.top = (angular.element('.popover').height() / 2)  - (pop.height/2)
								}
								else if(elem_bottom < 160) //too close to bottom
								{					
									arrow_pos =elem_bottom - (pop.height/2) - 20
							 		arrow.css("top",'initial');
							 		arrow.css("bottom",arrow_pos+'px');
									pop.top = win.height() - (angular.element('.popover').height() / 2) - (pop.height/2) - 10
								}
							}

				            return pop;
			          	};

			          	$(document).on("click", function (e) {
						    var target = $(e.target)
						    var inPopover = target.closest('.popover').length > 0
						    var isElem = target.is(element)
						    if (!inPopover && !isElem)
						    	element.popover('hide');
						});	         
			        }
			    }
		    })
      	}
    };
}]);