'use strict';
var sleep = require('../../lib/utils').sleep;
var Lecture = function (elem) {
	this.field= elem
};

Lecture.prototype = Object.create({}, {
	confused:{get:function(){return this.field.all(by.name('confused-timeline-item'))}},
	discussions:{get:function(){return this.field.all(by.name('discussion-timeline-item'))}},
	items:{get:function(){return this.field.all(by.repeater('item in timeline[l.id].items'))}},
	editable_discussion:{get:function(){return this.field.element(by.id('show_question'))}},
	type_discussion:{value:function(text){this.editable_discussion.element(by.tagName('textarea')).clear().sendKeys(text)}},
	discussion_types:{get:function(){return this.editable_discussion.element(by.tagName('select')).all(by.tagName('option'))}},
	change_discussion_public:{value:function(){this.discussion_types.get(1).click()}},
	change_discussion_private:{value:function(){this.discussion_types.get(0).click()}},
	save_discussion:{value:function(){ this.editable_discussion.element(by.buttonText('Ask')).click()}},
	vote_discussion:{value:function(num){this.discussions.get(num-1).element(by.tagName('voting-button')).element(by.tagName('img')).click()}},
	comment:{value:function(num, text){
		this.discussions.get(num-1).element(by.className("comment_button")).click()
		this.discussions.get(num-1).element(by.name("comment_area")).sendKeys(text)
		this.discussions.get(num-1).element(by.name("comment_area")).sendKeys(protractor.Key.ENTER)
	}}
});

var LecturePage= function(){}
LecturePage.prototype=Object.create({},{
	timeline_items:{get:function(){return element.all(by.repeater("l in items")); }},
	confused_button:{get:function(){return element(by.id('confused_button'))}},
	discussion_button:{get:function(){return element(by.id('ask_question_button'))}},
	lecture:{value:function(num){return new Lecture(this.timeline_items.get(num-1))}},
	add_confused:{value:function(){this.confused_button.click()}},
	add_really_confused:{value:function(){
		this.confused_button.click()
		sleep(1000)
		this.confused_button.click()
	}},
	add_discussion:{value:function(){this.discussion_button.click()}},
	check_answer_button:{get:function(){return element(by.buttonText('Check Answer'))}},
	check_answer:{value:function(){this.check_answer_button.click()}},
	quiz_layer:{get:function(){return element(by.className('ontop'))}},
	review_panel:{get:function(){return element(by.className('review_panel'))}},
	review_panel_buttons:{get:function(){return this.review_panel.all(by.className('button'))}},
	end_buttons:{get:function(){return this.quiz_layer.all(by.className('button'))}},
	next_button:{get:function(){return element(by.id('next_button'))}},
	next:{value:function(){this.next_button.click()}},
	wait_for_quiz:{value:function(){
		var quiz_layer = this.quiz_layer
		browser.driver.wait(function() {
	        return quiz_layer.isDisplayed().then(function(disp) {
	            return disp;
	        }, 100000);
	    });
	}},
	wait_for_vote:{value:function(){
		var review_panel = this.review_panel
		browser.driver.wait(function() {
	        return review_panel.isDisplayed().then(function(disp) {
	            return disp;
	        }, 100000);
	    });
	}},
	wait_for_video_end:{value:function(){
		var next_button = this.next_button
		browser.driver.wait(function() {
	        return next_button.isDisplayed().then(function(disp) {
	            return disp;
	        }, 100000);
	    });
	}},
	request_review_inclass:{value:function(){
		this.review_panel_buttons.get(0).click()
	}},
	decline_review_inclass:{value:function(){
		this.review_panel_buttons.get(1).click()
	}},
	answers:{get:function(){return this.quiz_layer.all(by.tagName("input"))}},
	draggables:{get:function(){return this.quiz_layer.all(by.className("dragged"))}},
	droppables:{get:function(){return this.quiz_layer.all(by.className("ui-droppable"))}},
	text_drag_container:{get:function(){return this.quiz_layer.all(by.className("drag-sort"))}},
	text_drag_items:{get:function(){return this.text_drag_container.all(by.tagName('li'))}},
	text_drag_arrows:{get:function(){return this.text_drag_container.all(by.className('looks-like-a-hook'))}},
	mark_answer:{value:function(num){this.answers.get(num-1).click()}},
	drag_answer:{value:function(num, drop){
		var drag = this.draggables.get(num-1)
		var droppables = this.droppables
		var drop_location = drop? this.draggables.get(drop-1) : drag
		drop_location.getText().then(function(text){
			browser.driver.actions().mouseMove(drag).perform();
			browser.driver.actions().mouseDown().perform();
			browser.driver.actions().mouseMove(droppables.get(text.split(' ')[1]-1)).perform();
        	browser.driver.actions().mouseUp().perform(); 
		})
		
	}},
	answer_text_drag_incorrect:{value:function(){
		var arrows = this.text_drag_arrows
		var items = this.text_drag_items

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
	}},
	answer_text_drag_correct:{value:function(){
		var arrows = this.text_drag_arrows
		var items = this.text_drag_items

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
		            browser.driver.actions().dragAndDrop(arrow[1], arrow[0]).perform()
		          else if(text == 'answer 3')
		            browser.driver.actions().dragAndDrop(arrow[1], arrow[2]).perform()
		        })
		        answer[2].getText().then(function (text){
		          if(text == 'answer 1')
		            browser.driver.actions().dragAndDrop(arrow[2], arrow[0]).perform()
		          else if(text == 'answer 2')
		            browser.driver.actions().dragAndDrop(arrow[2], arrow[1]).perform()
		        }) 
		    })
	  	})
	}}
})

module.exports = LecturePage;