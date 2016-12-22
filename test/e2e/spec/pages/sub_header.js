'use strict';

var SubHeader = function(){}

SubHeader.prototype= Object.create({}, {
	edit_mode:{get:function(){return element(by.id("content"))}},
	review_mode:{get:function(){return element(by.id("progress"))}},
	inclass_mode:{get:function(){return element(by.id("inclass"))}},
	administrator_menu:{get:function(){return element(by.id("administrator"))}},
	course_info:{get:function(){return element(by.id('course_info'))}},
	student_list:{get:function(){return element(by.id('enrolled_students'))}},
	show_administrator_menu:{value:function(){browser.driver.actions().mouseMove(this.administrator_menu).perform()}},
	open_edit_mode:{value:function(){this.edit_mode.click()}},
	open_review_mode:{value:function(){this.review_mode.click()}},
	open_inclass_mode:{value:function(){this.inclass_mode.click()}},
	open_course_info:{value:function(){
		this.show_administrator_menu()
		this.course_info.click();
	}},
	open_student_list:{value:function(){
		this.show_administrator_menu()
		this.student_list.click();
	}}

})

module.exports = SubHeader;
