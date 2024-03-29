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
	edit_key:{get:function(){return this.field.element(by.css('[ng-click="item.data.isEdit=true"]'))}},
	text:{get:function(){return this.field.getText()}},
	title:{get:function(){return this.field.element(by.className('discussion_title')).getText()}},
	vote_count:{get:function(){return this.field.element(by.binding("votes_count")).getText()}},
	edit:{value:function(){
		// return this.edit_key.click()
		// var mumbaiCity = element(by.id('mumbaiCity'));
		browser.actions().mouseMove(this.title).perform();
		this.edit_key.click()
	}},
	delete:{value:function(){
		this.field.element(by.className('delete')).click()
		this.field.element(by.className('alert')).click()
	}},
});

var Quiz = function (elem) {
	this.field= elem
}
Quiz.prototype = Object.create({}, {
	vote_button:{get:function(){return this.field.element(by.tagName('voting-button')).element(by.className('upvote'))}},
	unvote_button:{get:function(){return this.field.element(by.tagName('voting-button')).element(by.className('downvote'))}},
	vote_for_review:{value:function(num){this.vote_button.click()}},
	unvote_for_review:{value:function(num){this.unvote_button.click()}},
	vote_count:{get:function(){return this.field.element(by.binding("votes_count")).getText()}},
});

var Lecture = function (elem) {
	this.field= elem
};

Lecture.prototype = Object.create({}, {
	confused:{get:function(){return this.field.all(by.name('confused-timeline-item'))}},
	notes:{get:function(){return this.field.all(by.name('notes-timeline-item'))}},
	note:{value:function(num){return this.notes.get(num-1)}},
	markers:{get:function(){return this.field.all(by.name('markers-timeline-item'))}},
	marker:{value:function(num){return this.markers.get(num-1)}},
	note_area:{get:function(){return this.field.element(by.className("editable-controls")).element(by.tagName("textarea"))}},
	type_note:{value:function(text){
		element(by.css('[ng-model="$data"]')).clear().sendKeys(text).sendKeys(protractor.Key.ENTER)
	}},
	type_note_and_press_exit:{value:function(text){
		element(by.css('[ng-model="$data"]')).clear().sendKeys(text).sendKeys(protractor.Key.ESCAPE)
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
	quizzes:{get:function(){return this.field.all(by.name('quiz-timeline-item'))}},
	quiz:{value:function(num){return new Quiz(this.quizzes.get(num-1))}},	
	items:{get:function(){return this.field.all(by.repeater('item in timeline[l.id].items'))}},
	editable_discussion:{get:function(){return this.field.element(by.id('show_question'))}},
	type_discussion:{value:function(text){this.editable_discussion.element(by.css('div[ng-model="current_question"]')).clear().sendKeys(text)}},
	discussion_types:{get:function(){return this.editable_discussion.element(by.tagName('select')).all(by.tagName('option'))}},
	change_discussion_public:{value:function(){this.discussion_types.get(1).click()}},
	change_discussion_private:{value:function(){this.discussion_types.get(0).click()}},
	time_feild:{get:function(){return this.editable_discussion.element(by.model('item.time'))}},
	type_time:{value:function(text){this.time_feild.clear().sendKeys(text)}},
	save_discussion:{value:function(){ this.editable_discussion.element(by.buttonText('Ask')).click()}},
	cancel_discussion_button:{get:function(){return element(by.css('[ng-click="cancelQuestion(item)"]'))}},
	cancel_discussion:{value:function(){this.cancel_discussion_button.click()}},
	save_edited_discussion:{value:function(){ this.editable_discussion.element(by.buttonText('Save')).click()}},
	cancel_edited_discussion:{value:function(){this.editable_discussion.element(by.buttonText('Cancel')).click()}},


	confused_items:{get:function(){return this.field.all(by.name('confused-timeline-item'))}},
	confused_item:{value:function(num){return this.confused_items.get(num-1)}},	
	// i_am_confused_button:{get:function(){return element(by.id('confused_button')) }},
	// add_confused_item: {value:function(){ this.i_am_confused_button.click() }},
	delete_confused_item: {value:function(num){ 
		this.confused_item(num).element(by.className('delete')).click()
		this.confused_item(num).element(by.className('alert')).click()
	}},

})

var LecturePage= function(val){
	this.status = val|| 0
}
LecturePage.prototype=Object.create({},{
	timeline:{get:function(){return element(by.id('timeline_navigator'))}},
	open_timeline:{value:function(){if(!this.status){this.timeline.click();this.status=1;}}},
	close_timeline:{value:function(){if(this.status){this.timeline.click();this.status=0;}}},
	reset_timeline_boolean:{value:function(){ this.status=0; }},
	check_timeline_is_open:{get:function(){return element(by.id('student-accordion')).getAttribute('class')}},
	due_date_warning:{get:function(){return element(by.className('warning'))}},
	timeline_items:{get:function(){return element.all(by.repeater("l in items")); }},
	timeline_settings:{get:function(){return element(by.id('timeline_settings_btn'))}},
	timeline_settings_notes:{get:function(){return element(by.id('showNotesCheckbox'))}},
	timeline_settings_disscusions:{get:function(){return element(by.id('showQuestionsCheckbox'))}},
	timeline_settings_markers:{get:function(){return element(by.id('showMarkersCheckbox'))}},
	timeline_settings_quizzes:{get:function(){return element(by.id('showQuizzesCheckbox'))}},
	timeline_settings_confused:{get:function(){return element(by.id('showConfusedCheckbox'))}},
	
	confused_button:{get:function(){return element(by.id('confused_button'))}},
	note_button:{get:function(){return element(by.id('add_note_button'))}},
	full_screen_button:{get:function(){return element(by.id('fullscreen_button'))}},
	exit_full_screen_button:{get:function(){return element(by.id('exit_fullscreen_button'))}},

	discussion_directive:{get:function(){return element(by.id('show_question'))}},
	discussion_button:{get:function(){return element(by.id('ask_question_button'))}},

	annotation:{get:function(){return element(by.css('[text="annotation"]'))}},
	close_annotation:{value:function(){
		// element(by.css(['[ng-click="closeBtn()"]'])).click() 
		this.annotation.element(by.tagName("i")).click()
	}},

	lecture:{value:function(num){return new Lecture(this.timeline_items.get(num-1))}},
	add_confused:{value:function(){this.confused_button.click()}},
	add_note:{value:function(){this.note_button.click()}},
	add_really_confused:{value:function(){
		this.confused_button.click()
		sleep(1000)
		this.confused_button.click()
	}},
	add_discussion:{value:function(){this.discussion_button.click()}},
	add_discussion_shortcut:{value:function(){$('body').sendKeys('q');}},
	add_confused_shortcut:{value:function(){$('body').sendKeys('c');}},
	add_note_shortcut:{value:function(){$('body').sendKeys('n');}},
	go_to_fullscreen_shortcut:{value:function(){$('body').sendKeys('f');}},
	forward_10_sec_shortcut:{value:function(){$('body').sendKeys('l');}},
	backward_10_sec_shortcut:{value:function(){$('body').sendKeys('j');}},
	play_pause_shortcut:{value:function(){$('body').sendKeys('k');}},
	check_answer_button:{get:function(){ 
		return element(by.className("check_answer_button"))
	}},
	check_answer:{value:function(){ 
		this.check_answer_button.click()
	}},
	quiz_layer:{get:function(){ return element(by.id('ontop'))}},
	review_panel:{get:function(){return element(by.className('review_panel'))}},
	review_panel_buttons:{get:function(){return this.review_panel.all(by.className('button'))}},
	end_buttons:{get:function(){return this.quiz_layer.all(by.className('button'))}},
	next_button:{get:function(){return element(by.id('next_button'))}},
	next:{value:function(){this.next_button.click()}},
	replay_button:{get:function(){return element(by.id('replay_button'))}},
	replay:{value:function(){this.replay_button.click()}},

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
	retry_previous_question:{value:function(){
		this.review_panel_buttons.get(2).click()
	}},
	answers:{get:function(){ 
		return this.quiz_layer.all(by.tagName("input"))
	}},
	draggables:{get:function(){return this.quiz_layer.all(by.className("dragged"))}},
	droppables:{get:function(){return this.quiz_layer.all(by.className("ui-droppable"))}},
	text_drag_container:{get:function(){return this.quiz_layer.all(by.className("drag-sort"))}},
	text_drag_items:{get:function(){return this.text_drag_container.all(by.tagName('li'))}},
	text_drag_arrows:{get:function(){return this.text_drag_container.all(by.className('looks-like-a-hook'))}},
	
	explanation_title:{get:function(){return element(by.className('popover-title')).getText()}},
	explanation_popover:{get:function(){return element(by.className('popover'))}},
	explanation_content:{get:function(){return this.explanation_popover.getText()}},

	explanation_title_num:{value:function(num){return element.all(by.className('popover-title')).get(num-1).getText()}},
	// explanation_popover_num:{get:function(num){return element.all(by.className('popover')).get(num-1) }},
	explanation_content_num:{value:function(num){return element.all(by.className('popover')).get(num-1).getText() }},

	
	show_explanation:{value:function(num){
		browser.driver.actions().mouseMove(this.answers.get(num-1)).perform();
		browser.driver.actions().mouseMove({ x: 5, y: 5 }).perform();
	}
	},
	mark_answer: { value: function (num) { browser.executeScript("arguments[0].click();", this.answers.get(num - 1)); } },
	drag_answer: {
		value: function (num, drop) {
			var drag = this.draggables.get(num - 1)
			var droppables = this.droppables
			var drop_location = drop ? this.draggables.get(drop - 1) : drag
			drop_location.getText().then(function (text) {
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
