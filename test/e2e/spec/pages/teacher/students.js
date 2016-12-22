'use strict';
var SubHeader = require('../sub_header');
var sub_header = new SubHeader
var Students = function(){}

Students.prototype= Object.create({}, {
	add_student_button:{get:function(){return element(by.id("add_students"))}},
	enrollment_message:{get:function(){return element(by.id("enrollment_message"))}},
	open_add_student_modal:{value:function(){
		sub_header.show_administrator_menu()
		this.add_student_button.click()
	}},
	enrollment_key:{get:function(){return element(by.binding("course.unique_identifier")).getText()}},
	enrollment_url:{get:function(){return this.enrollment_message.element(by.binding("enrollment_url")).getText()}},
	teacher_name:{get:function(){return this.enrollment_message.element(by.binding("current_user.name")).getText()}},
})

module.exports = Students;
