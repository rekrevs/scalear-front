'use strict';

angular.module('scalearAngularApp')
	.directive("videoContainer",function($rootScope){
		return{
			transclude: true,
			restrict: "E",
			template: '<div ng-class="lecture.aspect_ratio" style="border:4px solid" ng-transclude></div>',
		  	link: function($scope, element){
			  	$rootScope.$on("refreshVideo", function(event, args) {
			  		element.find('iframe').remove();
			  		$scope.loadVideo();
			  		console.log("event emitted: updating video player");
			    });
		  	}
		};
}).directive('quiz',function(){
		return {
			transclude: true,
			replace:true,
			restrict: 'E', 
			template: '<div class="ontop" id="ontop" ng-class="lecture.aspect_ratio" ng-transclude></div>'
		};
}).directive('youtube',function(){
		return {
			restrict: 'E',
			replace:true, 
			template: '<div id="youtube" ng-class="lecture.aspect_ratio"></div>',
			link: function($scope, element){
			  	$scope.loadVideo();
		    }
		};
}).directive('editPanel',function(){
	return {		
		 restrict: 'E',
		 template: '<div id="editing">'+
						'<div class="alert" >'+
							'<div>'+
								'Editing quiz {{selected_quiz.question}} at {{selected_quiz.time|format}}'+
								'<b ng-bind-html="double_click_msg"></b>'+
							'</div>'+
							'<a class="btn btn-primary" id="done" style="margin-top:5px;" ng-click="saveBtn()">Save</a>'+
							'<a class="btn" id="done" style="margin-top:5px;" ng-click="exitBtn()">Exit</a>'+
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
							'Insert Quiz ({{title}}) '+
							'<span class="caret"></span>'+
						'</a>'+
						'<ul class="dropdown-menu">'+
				              '<li ng-repeat="item in list">'+
				              		'<a href="" class="insertQuiz" ng-click="action()(quiztype,item.type)">{{item.text}}</a>'+
				              '</li>'+ 
						'</ul>'+
				  	'</div>'
	};
}).directive('answervideo', function($compile){
	return {
		 scope: {
		 	quiz:"=",
		 	data:"=",
		 	type:"=",
		 	list:'=',
		 	remove:"&"
		 },
		 replace:true,
		 restrict: 'E',
		 template: "<div ng-switch on='type'>"+
		 				"<answer ng-switch-when='MCQ' />"+
		 				"<answer ng-switch-when='OCQ' />"+
		 				"<drag ng-switch-when='drag' />"+
	 				"</div>",
	};
}).directive('answer', function($compile, $rootScope){
	return {
		 replace:true,
		 restrict: 'E',
		 template: "<img ng-src='images/{{imgName}}' ng-class=imgClass ng-style='{left: xcoor, top: ycoor, position: \"absolute\"}' data-drag='true' data-jqyoui-options=\"{containment:'.ontop'}\" jqyoui-draggable=\"{animate:true, onStop:'calculatePosition'}\" pop-over='popover_options' unique='true'/>",

		link: function(scope, element, attrs, controller) {

			//===FUNCTIONS===//
			scope.setQuizImg=function(){
				console.log("image change")
				console.log(scope.data.correct)
				if(scope.type == "OCQ")
					scope.imgName = scope.data.correct? 'button_green.png' : 'button8.png';
				else
					scope.imgName = scope.data.correct? 'checkbox_green.gif' : 'checkbox.gif';
			}

			scope.calculatePosition=function(){
				console.log(element.position())
				scope.data.xcoor= parseFloat(element.position().left)/ontop.width();
				scope.data.ycoor= parseFloat(element.position().top)/(ontop.height() - 26);
			}

			scope.radioChange=function(corr_ans){
				console.log("radioChange")
				scope.quiz.answers.forEach(function(ans){
					ans.correct=false
				})
				corr_ans.correct=true
				$rootScope.$emit("radioChange")
			}
			
			$rootScope.$on("radioChange",function(){
				scope.setQuizImg()
			})
			//===============//
			
			// COULD BE FILTER //	
			var ontop=angular.element('.ontop');		
			var w = scope.data.width * ontop.width();
			var h = scope.data.height* (ontop.height() - 26);
			var add_left= (w-13)/2.0
			var add_top = (h-13)/2.0 
			scope.xcoor = (scope.data.xcoor * ontop.width())+ add_left;
			scope.ycoor = (scope.data.ycoor * (ontop.height() - 26)) + add_top;
			// // // // // // //

			scope.imgClass = "component dropped answer_img"

			scope.setQuizImg()						

			var template = "<p>Correct:<input class='must_save_check' ng-change='radioChange(data);setQuizImg()' ng-model='data.correct' style='margin-left:20px;margin-bottom:2px' type='checkbox' ng-checked='data.correct'  /><br>Answer: <textarea rows=3 class='must_save' type='text' ng-model='data.answer' value={{data.answer}}/><br>Explanation:<textarea rows=3 class='must_save' type='text' ng-model='data.explanation' value={{data.explanation}} /><br><input type='button' ng-click='remove()' class='btn btn-danger remove_button' value='Remove'/></p>"

           	scope.popover_options={
            	html:true,
            	content: template
            }

		}
	};
}).directive('drag', function($compile){
	return {
		 replace:true,
		 restrict: 'E',
		 template: "<div ng-class='dragClass' style='background-color:transparent;width:300px;height:40px;padding:0px;position:absolute;' ng-style=\"{width: width, height: height, top: ycoor, left: xcoor}\" data-drag='true' data-jqyoui-options=\"{containment:'.ontop'}\" jqyoui-draggable=\"{animate:true, onStop:'calculatePosition'}\" >"+
		 				"<div class='input-prepend' pop-over='popover_options' unique='true' >"+
		 					"<span class='add-on'>{{data.pos}}</span>"+
		 					"<textarea class='area' style='resize:none;width:254px;height:20px;padding:10px;' ng-model='data.answer' value='{{data.answer}}' />"+
	 					"</div>"+
 					"</div>",

		link: function(scope, element, attrs, controller) {
			 
			//===FUNCTIONS===//
			scope.calculatePosition=function(){
				scope.data.xcoor= parseFloat(element.position().left)/ontop.width();
				scope.data.ycoor= parseFloat(element.position().top)/(ontop.height() - 26);
			}
			//===============//	
			
			var ontop=angular.element('.ontop');
			scope.width = scope.data.width * ontop.width();
			scope.height = scope.data.height* (ontop.height() - 26);
			scope.xcoor = (scope.data.xcoor * ontop.width())
			scope.ycoor = (scope.data.ycoor * (ontop.height() - 26))

			scope.dragClass = "component dropped answer_drag" 

			
			if(!(scope.data.explanation instanceof Array)) 
			{
				console.log("not an array")
				scope.data.explanation = new Array()
				for(var i in scope.list)
					scope.data.explanation[i]=""
			}

			if(scope.data.pos == null)
			{	console.log("pos undefined")
				var max = Math.max.apply(Math,scope.list)
				max = max ==-Infinity? -1 : max
				console.log("max= "+max)
				scope.data.pos=max+1
				scope.list.push(scope.data.pos)
			}
			scope.pos= parseInt(scope.data.pos)
			console.log(scope.pos)
			console.log(scope.list)

			var template = '<ul><p>Correct Because:<br><textarea rows=3 type="text" class="must_save" ng-model="data.explanation[pos]" /><br/><div ng-repeat="num in list|filter:\'!\'+pos" >{{num}} Incorrect Because:<br><textarea rows=3 class="must_save" type="text" ng-model="data.explanation[num]" /><br></div><input type="button" ng-click="remove()" class="btn btn-danger remove_button" value="Remove"/></p></ul>'

            scope.popover_options={
            	content: template,
            	html: true
            }
		}
	};
}).directive('answerform', function(Lecture, $stateParams, CourseEditor){
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
		template: "<ng-form name='qform'><div style='text-align:left;margin:10px;'>"+
						"<label class='q_label'>Question:</label>"+
						"<input required name='qlabel' type='text' ng-model='quiz[column]' />"+
						"<span class='help-inline' ng-show='submitted && qform.qlabel.$error.required'>Required!</span>"+
						// ADD QUESTION TYPE IF ITS A QUIZ QUESTION.. SELECT LIST.
						"<br />"+
						"<label ng-if='show_question()' class='q_label'>Question Type:</label>"+
						"<select ng-if='show_question()' ng-model='quiz.question_type' required  class='choices'><option value='MCQ'>MCQ</option><option value='OCQ' >OCQ</option><option value='DRAG' ng-if='!isSurvey()' >DRAG</option><option ng-if='isSurvey()' value='Free Text Question'>Free Text Question</option></select>"+
						"<a ng-if='show_question()' href='' title='Delete' style='float:right;' class='delete_option' ng-click='removeQuestion(index)'><img src='images/trash3.png' /></a>"+
						"<br/>"+
						"<div ng-hide='hideAnswer()' class='answer_div'>"+
								"<htmlanswer />"+
								"<a class='add_multiple_answer' ng-click='addAnswer(\"\",quiz)' href=''>Add Answer</a>"+
								"<br/>"+
							"</div>"+
					"</div></ng-form>",
		link: function(scope, iElm, iAttrs, controller) {
			console.log("QUIZZ is ");
			console.log(scope.quiz);
			//scope.quiz.type=scope.quiz.question_type;
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
				//scope.values= [];
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
			})
			
		}
	};
}).directive('htmlMcq',function(){	
	return{
		restrict:'E',
		template:"<ng-form name='aform'><input required name='answer' type='text' placeholder='Answer' title='Enter Answer' ng-model='answer[columna]' />"+
				"<input ng-if='!isSurvey()' ng-change='updateValues()' atleastone type='checkbox' name='mcq' style='margin:5px 10px 15px;' ng-model='answer.correct' ng-checked='answer.correct' />"+
				"<span class='help-inline' ng-show='submitted && aform.answer.$error.required'>Required!</span>"+
				"<span ng-if='!isSurvey()' class='help-inline' ng-show='submitted && aform.mcq.$error.atleastone'>Choose atleast one</span>"+
				"<br ng-if='show()'/><input ng-if='show()' type='text' placeholder='Explanation' title='Enter Explanation' ng-model='answer.explanation' value='{{answer.explanation}}' /><a href='' title='Delete' style='float:right;' class='real_delete_ans' ng-click='removeAnswer($index, quiz)'><img src='images/trash3.png' /></a><br/></ng-form>"
		
	}
	
}).directive('htmlOcq',function($timeout){
	return {
		restrict:'E',
		template:"<ng-form name='aform'><input required name='answer' type='text' placeholder='Answer' title='Enter Answer' ng-model='answer[columna]' />"+
				"<input ng-if='!isSurvey()' atleastone type='radio' style='margin:5px 10px 15px;' ng-model='answer.correct' ng-value=true ng-click='radioChange(answer)'/>"+
				"<span class='help-inline' ng-show='submitted && aform.answer.$error.required'>Required!</span>"+
				"<span ng-if='!isSurvey()' class='help-inline' ng-show='submitted && aform.$error.atleastone'>Check one answer</span>"+
				"<br ng-if='show()'/>"+
				"<input ng-if='show()' type='text' placeholder='Explanation' title='Enter Explanation' ng-model='answer.explanation' value='{{answer.explanation}}' /> "+
				"<a href='' title='Delete' style='float:right;' class='real_delete_ans' ng-click='removeAnswer($index, quiz)'>"+
					"<img src='images/trash3.png' />"+
				"</a><br></ng-form>",
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
					"<span class='ui-icon ui-icon-arrowthick-2-n-s'></span>"+
					"<input type='text' required name='answer' placeholder='Answer' title='Enter Answer' ng-model='answer[columna]' />"+
					"<span class='help-inline' ng-show='submitted && aform.answer.$error.required'>Required!</span>"+
					"<a href='' title='Delete' style='float:right;' class='delete_drag' ng-click='removeAnswer($index, quiz)' ><img src='images/trash3.png' /></a>"+
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
}).directive('popOver',function ($parse, $compile, $q) {
    return{
  		restrict: 'A',
  		link: function(scope, element, attr, ctrl) {
      
	        var getter = $parse(attr.popOver)

	        $q.when(getter(scope) != null).then(function(){

	        	var options = getter(scope)
	        	// console.log(options)
		        
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

	          		element.popover(options);
		          	var popover = element.data('popover');
		          
		          	popover.getPosition = function(){
			            var r = $.fn.popover.Constructor.prototype.getPosition.apply(this, arguments);
			            $compile(this.$tip)(scope);
			            scope.$digest();
			            this.$tip.data('popover', this);
			            return r;
		          	};	         
		        }
	        });
      	}
    };
});