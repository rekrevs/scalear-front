'use strict';
var Header = require('./header');
var sleep = require('../lib/utils').sleep;

var CourseList = function () {};

CourseList.prototype = Object.create({}, {
	courses:{get:function(){return element(by.id('main_course_list')).all(by.repeater('course in courses'))}},
	teacher_courses:{get:function(){return element(by.id('main_course_list')).all(by.repeater('course in teacher_courses'))}},
	student_courses:{get:function(){return element(by.id('main_course_list')).all(by.repeater('course in student_courses'))}},

	open:{value:function(){
		var header = new Header()
		header.open_courses()
		browser.driver.wait(function() {
	      return browser.driver.getCurrentUrl().then(function(url) {
	        return /courses/.test(url);
	      });
	    });
	}},

	open_course:{value:function(num){
		this.courses.get(num-1).element(by.className("title")).click()
	}},
	open_teacher_course:{value:function(num){
		this.teacher_courses.get(num-1).element(by.className("title")).click()
	}},
	open_student_course:{value:function(num){
		this.student_courses.get(num-1).element(by.className("title")).click()
	}},

	delete_course:{value:function(num){
		var course = this.courses.get(num-1)
		course.element(by.className('delete')).click()
		course.element(by.className('alert')).click()
		sleep(1000);
		element(by.className('delete_confirm')).click()
	}},
	delete_teacher_course:{value:function(num){
		var course = this.teacher_courses.get(num-1)
		course.element(by.className('delete')).click()
		course.element(by.className('alert')).click()
		sleep(1000);
		element(by.className('delete_confirm')).click()
	}},
	delete_student_course:{value:function(num){
		var course = this.student_courses.get(num-1)
		course.element(by.className('delete')).click()
		course.element(by.className('alert')).click()
		sleep(1000);
		// element(by.className('delete_confirm')).click()
	}}

});

module.exports = CourseList;
