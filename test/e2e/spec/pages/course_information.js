'use strict';

var SubHeader = require('./sub_header');
var sub_header = new SubHeader()
var StudentCourseInformation= function(){}
StudentCourseInformation.prototype = Object.create({},{
	course_name:{get:function(){return element(by.id('course_code_name')).getText()}},
	description:{get:function(){return element(by.binding('course.description')).getText()}},
	prerequisites:{get:function(){return element(by.binding('course.prerequisites')).getText()}},
	end_date:{get:function(){return element(by.binding('course.end_date')).getText()}},
	receive_email_button:{get:function(){return element(by.css('[ng-change="course.updateStudentDueDateEmail(email_due_date)"]'))}},
	receive_email_button_click:{value:function(){
		this.receive_email_button.click();
	}},
	go_to_course_content_button:{get:function(){return element(by.id('course_content'))}},
	go_to_course_content_button_click:{value:function(){
		this.go_to_course_content_button.click();
	}},	
	open:{value:function(){
		element(by.id('course_info')).click();
		browser.driver.wait(function() {
	      return browser.driver.getCurrentUrl().then(function(url) {
	        return /course_information/.test(url);
	      });
	    });
	}},
})

var CourseInformation = function () {};

CourseInformation.prototype = Object.create({}, {
	enrollmentkey_field:{get: function(){return element(by.binding('course.unique_identifier'))}},
	enrollmentkey: {get:function(){return this.enrollmentkey_field.getText() }},
	enrollment_url_field:{get: function(){return element(by.id('enrollment_url'))}},
	enrollment_url: {get:function(){return this.enrollment_url_field.getText() }},
	enrollment_url_click:{value:function(){this.enrollment_url_field.click()}},
	teachers:{get:function(){return element.all(by.repeater('teacher in teachers'))}},
	student:{get:function(){return new StudentCourseInformation()}},
	add_teacher_button:{get:function(){return element(by.className('add-teacher-button'))}},
	email_field:{get:function(){return element(by.model('new_teacher.email'))}},
	role_field:{get:function(){return element(by.model('new_teacher.role'))}},
	type_email:{value:function(email){this.email_field.sendKeys(email)}},
	select_role:{value:function(num){this.role_field.all(by.tagName('option')).get(num).click()}},
	invite_button:{get:function(){return element(by.id('invite'))}},
	invite:{value:function(){this.invite_button.click()}},
	delete_teacher_button:{get:function(){return element(by.id("delete_teacher"))}},
	receive_email_button:{get:function(){return element(by.css('[ng-change="updateTeacher(teacher)"]'))}},
	receive_email_button_click:{value:function(){this.receive_email_button.click();}},
	disable_registration_button:{get:function(){return element(by.css('[ng-change="toggleRegistrationCheck()"]'))}},
	disable_registration_button_click:{value:function(){this.disable_registration_button.click();}},
	display_registration_field:{get: function(){return element(by.css('[ng-show="formData.disable_registration_checked"]'))}},
	display_registration_date: { get: function () { return element(by.css('[ng-model="$data"]')) }},
	type_display_registration_date: { value: function (keys) {
		 this.display_registration_date.clear().sendKeys(keys)
		 return element(by.css('[type="submit"]')).click()
	}},

	disable_registration_domain_button:{get: function(){return element(by.css('[ng-click="toggleDomain($event)"]'))}},
	disable_registration_domain_button_click:{value: function(){this.disable_registration_domain_button.click();}},
	disable_registration_domain_choose_custom:{value: function(){element(by.id("custom")).click();}},
	disable_registration_domain_choose_all:{value: function(){element(by.id("all")).click();}},
	disable_registration_domain_subdomains: {get: function(){return element.all(by.css('[ng-change="updateDomainList()"]')) }},
	disable_registration_domain_choose_subdomain:{value: function(num){this.disable_registration_domain_subdomains.get(num-1).click();}},

	// course_end_date: { get: function () { return this.course_end_date_field.getAttribute('value')}},
	// type_course_end_date: { value: function (keys) { return this.course_end_date_field.clear().sendKeys(keys)}},


	// disable_registration_button_checked:{get:function(){
		// return this.disable_registration_button.;
	// }},

	export_anonymized_data_button:{get:function(){return element(by.css("[ng-click='exportCourse()']"))}},
	click_export_anonymized_data:{value:function(){
	    this.export_anonymized_data_button.click()
	}},
	export_anonymized_data_message:{get:function(){return element(by.className("errorMessage")) }},
	open:{value:function(){
		sub_header.open_course_info()
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
		teacher.element(by.className('alert')).click()
	}}
});

module.exports = CourseInformation;
