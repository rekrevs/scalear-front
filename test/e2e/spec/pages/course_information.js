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
	enrollmentkey: { get: function () { return this.enrollmentkey_field.getText(); }},
	student:{value: function(){return new StudentCourseInformation() }},
	open:{value:function(){
		element(by.id('course_info')).click();
		browser.driver.wait(function() {
	      return browser.driver.getCurrentUrl().then(function(url) {
	        return /information/.test(url);
	      });
	    });
	}},
});

module.exports = CourseInformation;