'use strict';
var ItemCompletion = function(elem){
	this.field = elem
}
ItemCompletion.prototype= Object.create({},{
	tooltip:{get:function(){return this.field.element(by.css('[ng-show="item.show_tooltip"]'))}},
	color:{get:function(){return this.field.getCssValue('background') }},
	type:{get:function(){return this.field.all(by.tagName('i'))}},
	click:{value:function(){this.field.click()}},
})
var OnlineQuiz = function(elem){
	this.field = elem
}
OnlineQuiz.prototype= Object.create({},{
	color:{get:function(){return this.field.element(by.tagName('div')).getCssValue('background-color') }},
	hover_tooltip:{value:function(){browser.actions().mouseMove(this.field).perform();return 0 }},
	tooltip_title:{get:function(){return element(by.css('.popover-title')); }},
	tooltip_content:{get:function(){return element(by.id('student_popover')).element(by.css('.popover-content')); }},
	click:{value:function(){this.field.click()}},
})


var Module = function(elem){
	this.field = elem
}
Module.prototype= Object.create({},{
	course_module_title:{get:function(){return this.field.element(by.tagName('h3'))}},
	course_module_subtitle:{get:function(){return this.field.element(by.className('color-gray'))}},
	remaning:{get:function(){return this.field.element(by.css('.right.color-gray'))}},
	items_completions:{get:function(){return this.field.all(by.css('.item.ng-scope'))}}, // all(by.repeater('item in moduledata.module_completion'==> 9
	items_completion:{value:function(num){return new ItemCompletion(this.items_completions.get(num-1))}},
	online_quizzes:{get:function(){return this.field.all(by.repeater('online_quiz in item.online_quizzes'))}}, // all(by.repeater('item in moduledata.module_completion'==> 9
	online_quiz:{value:function(num){return new OnlineQuiz(this.online_quizzes.get(num-1))}},
	questions:{get:function(){return this.field.all(by.repeater('question in lecture.questions'))}}, // all(by.repeater('item in moduledata.module_completion'==> 9
	// question:{value:function(num){return new Question(this.questions.get(num-1))}},
	question:{value:function(num){return this.questions.get(num-1)}},
	question_title:{get:function(){return this.field.all(by.css('[ng-show="moduledata.posts_total"]'))}},
	button:{get:function(){return this.field.element(by.css('[ng-show="continue_button"]'))}},
	
})
var StudentModuleSummary = function () {};

StudentModuleSummary.prototype = Object.create({}, {
	modules:{get:function(){return element.all(by.repeater('moduledata in module_summary'))}},
	module:{value:function(num){return new Module(this.modules.get(num-1))}},

});

module.exports = StudentModuleSummary;
