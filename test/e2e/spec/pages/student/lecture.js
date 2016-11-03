'use strict';
var sleep = require('../../lib/utils').sleep;

var Comment = function(elem){
	this.field= elem
}
Comment.prototype = Object.create({}, {
	flag_button:{get:function(){return this.field.element(by.tagName('flag-button')).element(by.id('flag'))}},
	unflag_button:{get:function(){return this.field.element(by.tagName('flag-button')).element(by.id('unflag'))}},
	vote_button:{get:function(){return this.field.element(by.tagName('voting-button')).element(by.className('upvote'))}},
	unvote_button:{get:function(){return this.field.element(by.tagName('voting-button')).element(by.className('downvote'))}},
	vote:{value:function(num){this.vote_button.click()}},
	flag:{value:function(num){this.flag_button.click()}},
	unvote:{value:function(num){this.unvote_button.click()}},
	unflag:{value:function(num){this.unflag_button.click()}},
	title:{get:function(){return this.field.element(by.className('comment_body')).getText()}},
	text:{get:function(){return this.field.getText()}},
	vote_count:{get:function(){return this.field.element(by.binding("votes_count")).getText()}},
	delete:{value:function(){
		this.field.element(by.className('delete')).click()
		this.field.element(by.className('alert')).click()
	}},
})

var Discussion = function (elem) {
	this.field= elem
}
Discussion.prototype = Object.create({}, {
	flag_button:{get:function(){return this.field.element(by.tagName('flag-button')).element(by.id('flag'))}},
	unflag_button:{get:function(){return this.field.element(by.tagName('flag-button')).element(by.id('unflag'))}},
	vote_button:{get:function(){return this.field.element(by.tagName('voting-button')).element(by.className('upvote'))}},
	unvote_button:{get:function(){return this.field.element(by.tagName('voting-button')).element(by.className('downvote'))}},
	vote:{value:function(num){this.vote_button.click()}},
	flag:{value:function(num){this.flag_button.click()}},
	unvote:{value:function(num){this.unvote_button.click()}},
	unflag:{value:function(num){this.unflag_button.click()}},
	comments:{get:function(){return this.field.all(by.repeater("comment_data in item.data.comments"))}},
	comment:{value:function(num){return new Comment(this.comments.get(num-1))}},
	comment_button:{get:function(){return this.field.element(by.className("comment_button"))}},
	add_comment_button:{get:function(){return this.field.element(by.className("success"))}},
	comment_area:{get:function(){return this.field.element(by.name("comment_area"))}},
	add_comment:{value:function(){this.comment_button.click()}},
	type_comment:{value:function(text){
		this.comment_area.sendKeys(text)
		this.add_comment_button.click()
		// this.comment_area.sendKeys(protractor.Key.ENTER)
	}},
	text:{get:function(){return this.field.getText()}},
	title:{get:function(){return this.field.element(by.className('discussion_title')).getText()}},
	vote_count:{get:function(){return this.field.element(by.binding("votes_count")).getText()}},
	delete:{value:function(){
		this.field.element(by.className('delete')).click()
		this.field.element(by.className('alert')).click()
	}},
});

var Lecture = function (elem) {
	this.field= elem
};

Lecture.prototype = Object.create({}, {
	confused:{get:function(){return this.field.all(by.name('confused-timeline-item'))}},
	notes:{get:function(){return this.field.all(by.name('notes-timeline-item'))}},
	note:{value:function(num){return this.notes.get(num-1)}},
	note_area:{get:function(){return this.field.element(by.className("editable-controls")).element(by.tagName("textarea"))}},
	type_note:{value:function(text){
		element(by.css('[ng-model="$data"]')).clear().sendKeys(text).sendKeys(protractor.Key.ENTER)
		
	}},
	edit_note:{value:function(num){
		this.note(num).element(by.className('ng-binding')).click()
	}},
	delete_note:{value:function(num){
		this.note(num).element(by.className('delete')).click()
		this.note(num).element(by.className('alert')).click()
	}},
	discussions:{get:function(){return this.field.all(by.name('discussion-timeline-item'))}},
	discussion:{value:function(num){return new Discussion(this.discussions.get(num-1))}},
	items:{get:function(){return this.field.all(by.repeater('item in timeline[l.id].items'))}},
	editable_discussion:{get:function(){return this.field.element(by.id('show_question'))}},
	type_discussion:{value:function(text){this.editable_discussion.element(by.css('div[ng-model="current_question"]')).clear().sendKeys(text)}},
	discussion_types:{get:function(){return this.editable_discussion.element(by.tagName('select')).all(by.tagName('option'))}},
	change_discussion_public:{value:function(){this.discussion_types.get(1).click()}},
	change_discussion_private:{value:function(){this.discussion_types.get(0).click()}},
	time_feild:{get:function(){return this.editable_discussion.element(by.model('item.time'))}},
	type_time:{value:function(text){this.time_feild.clear().sendKeys(text)}},
	save_discussion:{value:function(){ this.editable_discussion.element(by.buttonText('Ask')).click()}},
})

var LecturePage= function(val){
	this.status = val|| 0
}
LecturePage.prototype=Object.create({},{
	timeline:{get:function(){return element(by.id('timeline_navigator'))}},
	open_timeline:{value:function(){if(!this.status){this.timeline.click();this.status=1}}},
	close_timeline:{value:function(){if(this.status){this.timeline.click();this.status=0}}},
	timeline_items:{get:function(){return element.all(by.repeater("l in items")); }},
	confused_button:{get:function(){return element(by.id('confused_button'))}},
	note_button:{get:function(){return element(by.id('add_note_button'))}},
	discussion_button:{get:function(){return element(by.id('ask_question_button'))}},
	lecture:{value:function(num){return new Lecture(this.timeline_items.get(num-1))}},
	add_confused:{value:function(){this.confused_button.click()}},
	add_note:{value:function(){this.note_button.click()}},
	add_really_confused:{value:function(){
		this.confused_button.click()
		sleep(1000)
		this.confused_button.click()
	}},
	add_discussion:{value:function(){this.discussion_button.click()}},
	check_answer_button:{get:function(){return element(by.className("check_answer_button"))}},
	check_answer:{value:function(){this.check_answer_button.click()}},
	quiz_layer:{get:function(){return element(by.className('ontop'))}},
	review_panel:{get:function(){return element(by.className('review_panel'))}},
	review_panel_buttons:{get:function(){return this.review_panel.all(by.className('button'))}},
	end_buttons:{get:function(){return this.quiz_layer.all(by.className('button'))}},
	next_button:{get:function(){return element(by.id('next_button'))}},
	next:{value:function(){this.next_button.click()}},
	notification:{get:function(){return element(by.tagName("notification")).getText()}},
	wait_for_quiz:{value:function(){
		// var quiz_layer = this.quiz_layer
		var check_button = this.check_answer_button
		browser.driver.wait(function() {
	        return check_button.isDisplayed().then(function(disp) {

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
	explanation_title:{get:function(){return element(by.className('popover-title')).getText()}},
	explanation_popover:{get:function(){return element(by.className('popover'))}},
	explanation_content:{get:function(){return this.explanation_popover.getText()}},
	show_explanation:{value:function(num){
		browser.driver.actions().mouseMove(this.answers.get(num-1)).perform();
		browser.driver.actions().mouseMove({x: 5, y: 5}).perform();
	}},
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
