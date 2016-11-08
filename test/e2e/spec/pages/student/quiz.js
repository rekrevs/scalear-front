'use strict';
var Question = function(elem){
	this.field = elem
}
Question.prototype= Object.create({},{
	answers:{get:function(){return this.field.all(by.tagName('input'))}},
	mark_answer:{value:function(num){this.answers.get(num-1).click()}},
	free_text_area:{get:function(){return this.field.element(by.tagName('textarea'))}},
	type_free_text:{value:function(text){this.free_text_area.clear().sendKeys(text)}},
	text_drag_items:{get:function(){return this.field.all(by.tagName('li'))}},
	text_drag_arrows:{get:function(){return this.field.all(by.className('handle'))}},
	drag_answer_incorrect:{value:function(){
		var arrows = this.text_drag_arrows
		var items = this.text_drag_items
		for(var i=0; i<3; i++){
	  		arrows.then(function(arrow){
		    	items.then(function(answer){
		      		answer[0].getText().then(function (text){
			        	if(text == 'answer 1')
			          		browser.driver.actions().dragAndDrop(arrow[2], arrow[0]).perform();
			      	})
		      		answer[1].getText().then(function (text){
			        	if(text == 'answer 1')
		          			browser.driver.actions().dragAndDrop(arrow[1], arrow[2]).perform();
				        else if(text == 'answer 3')
			          		browser.driver.actions().dragAndDrop(arrow[1], arrow[0]).perform();
		     	 	})
			      	answer[2].getText().then(function (text){
				        if(text == 'answer 3')
			          		browser.driver.actions().dragAndDrop(arrow[0], arrow[2]).perform();
				        if(text == 'answer 1')
			          		browser.driver.actions().dragAndDrop(arrow[2], arrow[0]).perform();
			      	})
			    })
		  	})
	  	}
	}},
	drag_answer_correct:{value:function(){
		var arrows = this.text_drag_arrows
		var items = this.text_drag_items
    	for(var i=0; i<3; i++){
		 	arrows.then(function(arrow){
		    	items.then(function(answer){
		      		answer[0].getText().then(function (text){
			          if(text == 'answer 3')
			            browser.driver.actions().dragAndDrop(arrow[0], arrow[2]).perform()
			          else if(text == 'answer 2')
			            browser.driver.actions().dragAndDrop(arrow[0], arrow[1]).perform()
			        })
			        answer[1].getText().then(function (text){
			          if(text == 'answer 1')
			            browser.driver.actions().dragAndDrop(arrow[0], arrow[1]).perform()
			          else if(text == 'answer 3')
			            browser.driver.actions().dragAndDrop(arrow[1], arrow[2]).perform()
			        })
			        answer[2].getText().then(function (text){
			          if(text == 'answer 1')
			            browser.driver.actions().dragAndDrop(arrow[0], arrow[2]).perform()
			          else if(text == 'answer 2')
			            browser.driver.actions().dragAndDrop(arrow[1], arrow[2]).perform()
			        })
			    })
		    })
	  	}
	}}
})

var QuizPage= function(){}
QuizPage.prototype=Object.create({},{
	questions:{get:function(){return element.all(by.repeater('question in quiz.questions'))}},
	question:{value:function(num){return new Question(this.questions.get(num-1))}},
	submit_button:{get:function(){return element(by.buttonText('Submit'))}},
	save_button:{get:function(){return element(by.buttonText('Save'))}},
	next_button:{get:function(){return element(by.id('next_button'))}},
	save:{value:function(){return this.save_button.click()}},
	submit:{value:function(){this.submit_button.click()}},
	next:{value:function(){this.next_button.click()}},
	status:{get:function(){return element(by.binding('status.attempts')).getText()}},
	// optional_tag:{get:function(){return element(by.className('label'))}},
	optional_tag:{get:function(){return element(by.css('[ng-if="quiz && !quiz.graded"]'))}},
	incorrect:{get:function(){return element.all(by.className('incorrect'))}},
	correct:{get:function(){return element.all(by.className('correct'))}},
	under_review:{get:function(){return element.all(by.className('under_review'))}},
	retries:{get:function(){return element(by.binding('quiz.retries')).getText()}},
	warning_msg:{get:function(){return element(by.className('warning')).getText()}},
})

module.exports = QuizPage;
