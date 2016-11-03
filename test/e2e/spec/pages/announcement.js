'use strict';
var SubHeader = require('./sub_header');

var Announcement = function () {};

Announcement.prototype = Object.create({}, {
	new_button:{get:function(){return element(by.id('new_announcement'))}},
	editor:{get:function(){return element(by.model('announcement.announcement'))}},
	save_button:{get:function(){return element(by.id('save_button'))}},
	posts:{get:function(){return element.all(by.repeater('announcement in announcements'))}},
	open:{value:function(){
		var sub_header = new SubHeader()
		sub_header.show_administrator_menu()
		element(by.id('announcements')).click()
		browser.driver.wait(function() {
	      return browser.driver.getCurrentUrl().then(function(url) {
	        return /announcements/.test(url);
	      });
	    });
	}},
	create:{value:function(text){
		this.new_button.click()
		this.editor.sendKeys(text)
		this.save_button.click()
	}},
	delete:{value:function(num){
		var post = this.posts.get(num-1)
		post.element(by.className('delete')).click()
		post.element(by.className('alert')).click()
	}}

});

module.exports = Announcement;
