'use strict';
var Header = require('./header');

var NewCourse = function () {};

NewCourse.prototype = Object.create({}, {
	shortname_field:{get: function(){return element(by.model('course.short_name'))}},
	shortname: { get: function () { return this.shortname_field.getAttribute('value')}},
	type_shortname: { value: function (keys) { return this.shortname_field.clear().sendKeys(keys)}},

	name_field:{get: function(){return element(by.model('course.name'))}},
	name: { get: function () { return this.name_field.getAttribute('value')}},
	type_name: { value: function (keys) { return this.name_field.clear().sendKeys(keys)}},

	course_start_date_field:{get: function(){return element(by.model('course.start_date'))}},
	course_start_date: { get: function () { return this.course_start_date_field.getAttribute('value')}},
	type_course_start_date: { value: function (keys) { return this.course_start_date_field.clear().sendKeys(keys)}},
	error_start_date:{get: function(){return element(by.id('error_start_date'))} } ,

	course_end_date_field:{get: function(){return element(by.model('course.end_date'))}},
	course_end_date: { get: function () { return this.course_end_date_field.getAttribute('value')}},
	type_course_end_date: { value: function (keys) { return this.course_end_date_field.clear().sendKeys(keys)}},
	error_end_date:{get: function(){return element(by.id('error_end_date'))} } ,

	course_disable_registration_field:{get: function(){return element(by.model('course.disable_registration'))}},
	course_disable_registration: { get: function () { return this.course_disable_registration_field.getAttribute('value')}},
	type_course_disable_registration: { value: function (keys) { return this.course_disable_registration_field.clear().sendKeys(keys)}},
	error_disable_registration:{get: function(){return element(by.id('error_end_date'))} } ,

	image_url_field:{get: function(){return element(by.model('course.image_url'))}},
	image_url: { get: function () { return this.image_url_field.getAttribute('value')}},
	type_image_url: { value: function (keys) { return this.image_url_field.clear().sendKeys(keys)}},

	description_field:{get: function(){return element(by.model('course.description'))}},
	description: { get: function () { return this.description_field.getAttribute('value')}},
	type_description: { value: function (keys) { return this.description_field.clear().sendKeys(keys)}},

	prerequisites_field:{get: function(){return element(by.model('course.prerequisites'))}},
	prerequisites: { get: function () { return this.prerequisites_field.getAttribute('value')}},
	type_prerequisites: { value: function (keys) { return this.prerequisites_field.clear().sendKeys(keys)}},

	disable_email_reminders_modal_button:{get:function(){return element(by.css('[ng-click="updateEmailDiscussion(false)"]'))}},
	disable_email_reminders_modal_button_click:{value:function(){this.disable_email_reminders_modal_button.click();}},

	disable_student_email_reminders_button:{get:function(){return element(by.css('[ng-click="updateDueDateEmail(false)"]'))}},
	disable_student_email_reminders_button_click:{value:function(){this.disable_student_email_reminders_button.click();}},

	disable_registration_checked_button:{get:function(){return element(by.model('disable_registration_checked'))}},
	disable_registration_checked_button_click:{value:function(){this.disable_registration_checked_button.click();}},

	registration_domain_button:{get:function(){return element(by.id('registration_domain'))}},
	registration_domain_button_click:{value:function(){this.registration_domain_button.click();}},

	create_button:{get:function(){return element(by.buttonText("Create Course"))}},

	open:{value:function(){
		var header= new Header()
		header.show_courses_menu()
		element(by.id('new_course_sub')).click();
		browser.driver.wait(function() {
	      return browser.driver.getCurrentUrl().then(function(url) {
	        return /new/.test(url);
	      });
	    });
	}},
	create:{value :function(short_name, course_name, course_end_date, discussion_link, image_link, course_description, prerequisites){
		this.type_shortname(short_name)
		this.type_name(course_name)
		var newdate = new Date();
		newdate.setDate(newdate.getDate() - 7);
			
		this.type_course_start_date(newdate)
		this.type_course_end_date(course_end_date)
		this.type_image_url(image_link)
		this.type_description(course_description)
		this.type_prerequisites(prerequisites)
		this.create_button.click()
	}},

	// registration_domain_modal_close
	registration_domain_modal_close_button:{get:function(){return element(by.id('registration_domain_modal_close'))}},
	registration_domain_modal_close_button_click:{value:function(){this.registration_domain_modal_close_button.click();}},

	domain_all_button:{get:function(){return element(by.id('all'))}},
	domain_all_button_click:{value:function(){this.domain_all_button.click();}},

	domain_custom_button:{get:function(){return element(by.id('custom'))}},
	domain_custom_button_click:{value:function(){this.domain_custom_button.click();}},

	
	domains:{get:function(){return element.all(by.repeater("domain in subdomains")); }},
	domain:{value:function(num){return this.domains.get(num-1).element(by.tagName('input')) }},


});

module.exports = NewCourse;
