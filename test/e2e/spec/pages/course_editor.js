'use strict';
var Link = require('./link');
var SubHeader = require('./sub_header')
var sub_header = new SubHeader
var Video = require('./video');
var video = new Video();
var sleep = require('../lib/utils').sleep;
var CourseEditor = function () {};

CourseEditor.prototype = Object.create({}, {
	new_module_button:{get:function(){return element(by.id("new_module"))}},
	new_module_sub_button:{get:function(){return element(by.id("sub_new_module"))}},
	new_item_button:{get:function(){return element(by.id("new_item"))}},
	new_item_sub_button:{get:function(){return element(by.id("sub_new_item"))}},
	new_question_button:{get:function(){return element(by.id("new_question"))}},
	// video_item:{get: function(){return element(by.id('video_item'))}},
	// quiz_item:{get: function(){return element(by.id('quiz_item'))}},
	// survey_item:{get: function(){return element(by.id('survey_item'))}},
	// link_item:{get: function(){return element(by.id('link_item'))}},
	module:{get:function(){return element(by.id("module")) }},
	// module_links:{get:function(){return element.all(by.repeater('doc in module.custom_links'))}},
	// module_link:{value:function(num){return new Link(this.module_links.get(num-1))}},
	// copy_button:{get:function(){return element(by.id('copy')) }},
	// paste_button:{get:function(){return element(by.id('paste')) }},
	// share_button:{get:function(){return element(by.id('share_copy'))}},
	// paste_description:{get:function(){return this.paste_button.element(by.className('dark-description')).getText() }},
	preview_inclass_button:{get:function(){return element(by.className("preview_inclass"))}},
	open_preview_inclass:{value:function(){ this.preview_inclass_button.click()}},
	preview_inclass_panel:{get:function(){return element(by.id("preview_inclass_panel"))}},
	inclass_prev_button:{get:function(){return element(by.className("inclass_prev"))}},
	inclass_next_button:{get:function(){return element(by.className("inclass_next"))}},
	inclass_prev:{value:function(){this.inclass_prev_button.click(); sleep(1500)}},
	inclass_next:{value:function(){this.inclass_next_button.click(); sleep(1500)}},
	total_lecture_questions:{get:function(){return this.module.element(by.binding('module.total_questions')).getText()}},
	total_quiz_questions:{get:function(){return this.module.element(by.binding('module.total_quiz_questions')).getText()}},
	total_time:{get:function(){return this.module.element(by.binding('module.total_time')).getText()}},
	lecture_settings_accordion:{get:function(){return element(by.id("lec_settings"))}},
	open_lecture_settings:{value:function(){this.lecture_settings_accordion.click()}},
	lecture_inorder_checkbox:{get:function(){return element(by.model('lecture.required'))}},
	change_lecture_inorder:{value:function(){this.lecture_inorder_checkbox.click()}},
	lecture_required_checkbox:{get:function(){return element(by.model('lecture.graded'))}},
	change_lecture_required:{value:function(){this.lecture_inorder_checkbox.click()}},
	quiz_required_checkbox:{get:function(){return element(by.model('quiz.graded'))}},
	quiz_retries:{get:function(){return element(by.tagName('details-number'))}},
	trim_modal:{get:function (){ return element(by.id('trim-modal'))}},
	trim:{value:function () {this.trim_modal.element(by.id('trim-btn')).click()}},
	cancel_trim:{value:function () {this.trim_modal.element(by.id('cancel-btn')).click()}},
	change_quiz_required:{value:function(){this.quiz_required_checkbox.click()}},
	change_quiz_retries:{value:function(num){
		this.quiz_retries.click()
		element(by.className('editable-input')).sendKeys(num)
		element(by.className('check')).click()
	}},
	quiz_inorder_checkbox:{get:function(){return element(by.model('quiz.required'))}},
	change_quiz_inorder:{value:function(){this.quiz_inorder_checkbox.click()}},
	open:{value: function(){
		element(by.id('content')).click();
		browser.driver.wait(function() {
	      return browser.driver.getCurrentUrl().then(function(url) {
	        return /course_editor/.test(url);
	      });
	    });
	}},
	add_module: {value: function(){this.new_module_button.click()}},
	rename_module:{value:function(name){
		element(by.tagName("details-text")).click().then(function(){
			element(by.className('editable-input')).clear().sendKeys(name)
			element(by.className('check')).click()
		})
	}},
	get_module_name:{value: function(){
		return element(by.tagName('details-text')).getText()
	}},
	open_video_settings:{value: function(){
		element(by.id('video_settings')).click()
	}},
	rename_item:{value: function(name){
		element(by.id('item_name')).click().then(function(){
			element(by.className('editable-input')).clear().sendKeys(name)
			element(by.className('check')).click()
		})
	}},
	get_item_name:{value: function(){
		return element(by.id('item_name')).getText()
	}},
	change_item_url:{value: function(url){
		// element(by.id('url')).click()
		// element(by.className('editable-input')).clear().sendKeys(url)
		// element(by.className('check')).click()
		this.change_item_url_link(url)
		var self = this
		browser.driver.wait(function() {
      return self.trim_modal.isPresent().then(function(disp) {
        return disp;
      }, 100000);
    });
    this.cancel_trim()
	}},
	get_item_url:{value: function(){
		return element(by.id('url')).getText()
	}},
	change_item_url_link:{value: function(url){
		element(by.id('url')).click()
		element(by.className('editable-input')).clear().sendKeys(url)
		element(by.className('check')).click()
	}},
	// sort_links:{value:function(){
	// 	var handle_1 = this.module_link(1).field.element(by.className('handle'))
	// 	var handle_2 = this.module_link(2).field.element(by.className('handle'))
	// 	var handle_3 = this.module_link(3).field.element(by.className('handle'))
 //  		browser.driver.actions().dragAndDrop(handle_1 ,handle_2).perform()
	// 	browser.driver.actions().dragAndDrop(handle_3 ,handle_1).perform()
	// }},
	// copy:{value:function(){
	// 	sub_header.show_content_menu()
	// 	this.copy_button.click()
	// }},
	// paste:{value:function(){
	// 	sub_header.show_content_menu()
	// 	this.paste_button.click()
	// }},
	// open_share_window:{value:function(){
	// 	sub_header.show_content_menu()
	// 	this.share_button.click()
	// }},


});

module.exports = CourseEditor;
