'use strict';
var Header = require('./header');

var CourseList = function () {};

CourseList.prototype = Object.create({}, {	
	courses:{get:function(){return element(by.id('main_course_list')).all(by.repeater('course in courses'))}},
	
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

	delete_course:{value:function(num){
		var course = this.courses.get(num-1)
		course.element(by.className('delete')).click()
		course.element(by.className('alert')).click()
	}}

});

module.exports = CourseList;