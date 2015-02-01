'use strict';

var SubHeader = function(){}

SubHeader.prototype= Object.create({}, {
	students_menu:{get:function(){return element(by.id("settings"))}},
	content_menu:{get:function(){return element(by.id("content"))}},
	show_students_menu:{value:function(){browser.driver.actions().mouseMove(this.students_menu).perform()}},
	show_content_menu:{value:function(){browser.driver.actions().mouseMove(this.content_menu).perform()}},
})

module.exports = SubHeader;