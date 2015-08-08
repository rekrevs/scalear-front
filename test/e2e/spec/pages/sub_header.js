'use strict';

var SubHeader = function(){}

SubHeader.prototype= Object.create({}, {
	// students_menu:{get:function(){return element(by.id("settings"))}},
	edit_mode:{get:function(){return element(by.id("content"))}},
	review_mode:{get:function(){return element(by.id("progress"))}},
	administrator_menu:{get:function(){return element(by.id("administrator"))}},
	course_info:{get:function(){return element(by.id('course_info'))}},
	// show_students_menu:{value:function(){browser.driver.actions().mouseMove(this.students_menu).perform()}},
	// show_content_menu:{value:function(){browser.driver.actions().mouseMove(this.content_menu).perform()}},
	show_administrator_menu:{value:function(){browser.driver.actions().mouseMove(this.administrator_menu).perform()}},
	open_edit_mode:{value:function(){this.edit_mode.click()}},
	open_review_mode:{value:function(){this.review_mode.click()}},
	open_course_info:{value:function(){
		this.show_administrator_menu()
		this.course_info.click();
	}}
})

module.exports = SubHeader;