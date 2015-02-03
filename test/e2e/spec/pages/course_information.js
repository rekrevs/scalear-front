'use strict';
var StudentCourseInformation= function(){}
StudentCourseInformation.prototype = Object.create({},{
	course_name:{get:function(){return element(by.id('course_code_name')).getText()}},
	description:{get:function(){return element(by.binding('course.description')).getText()}},
	prerequisites:{get:function(){return element(by.binding('course.prerequisites')).getText()}},
	duration:{get:function(){return element(by.binding('course.duration')).getText()}},
})

var CourseInformation = function () {};

CourseInformation.prototype = Object.create({}, {
	enrollmentkey_field:{get: function(){return element(by.binding('course.unique_identifier'))}},
	enrollmentkey: {get:function(){return this.enrollmentkey_field.getText() }},
	teachers:{get:function(){return element.all(by.repeater('teacher in teachers'))}},
	student:{value:function(){return new StudentCourseInformation()}},
	add_teacher_button:{get:function(){return element(by.className('add-teacher-button'))}},
	email_field:{get:function(){return element(by.model('new_teacher.email'))}},
	role_field:{get:function(){return element(by.model('new_teacher.role'))}},
	type_email:{value:function(email){this.email_field.sendKeys(email)}},
	select_role:{value:function(num){this.role_field.all(by.tagName('option')).get(num).click()}},
	invite_button:{get:function(){return element(by.id('invite'))}},
	invite:{value:function(){this.invite_button.click()}},
	delete_teacher_button:{get:function(){return element(by.id("delete_teacher"))}},
	open:{value:function(){
		element(by.id('course_info')).click();
		browser.driver.wait(function() {
	      return browser.driver.getCurrentUrl().then(function(url) {
	        return /information/.test(url);
	      });
	    });
	}},
	add_teacher:{value:function(){this.add_teacher_button.click()}},
	delete_teacher:{value:function(num){
		this.delete_teacher_button.click()
		var teacher = this.teachers.get(num-1)
		teacher.element(by.className('delete')).click()
		teacher.element(by.className('fi-check')).click()
	}}
});

module.exports = CourseInformation;