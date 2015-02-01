'use strict';

var Header = function(){}

Header.prototype= Object.create({}, {
	courses_menu:{get:function(){return element(by.id("all_courses"))}},
	account_menu:{get:function(){return element(by.id("account"))}},
	notification_menu:{get:function(){return element(by.id("notifications"))}},
	show_account_menu:{value:function(){browser.driver.actions().mouseMove(this.account_menu).perform()}},
	show_courses_menu:{value:function(){browser.driver.actions().mouseMove(this.courses_menu).perform()}},
	show_notification:{value:function(){browser.driver.actions().mouseMove(this.notification_menu).perform()}},
	notifications:{get:function(){return element.all(by.repeater('(id, item) in user.shared_items'))}},
	shared_button:{get:function(){return element(by.id("view_shared"))}},
	open_shared:{value:function(){
		this.show_courses_menu()
		this.shared_button.click()
	}},
	open_courses:{value:function(){return this.courses_menu.click()}},
	logout: {value:function(){
		this.show_account_menu()
		element(by.id("logout")).click()
	}},
	join_course:{value:function(key){
		this.show_courses_menu()
		element(by.id('join_course')).click()
		element(by.name('key')).sendKeys(key)
    	element(by.buttonText('Enroll')).click()
	}},
	reject_share_notification:{value:function(num){this.notifications.get(num-1).element(by.className('alert')).click()}},
	accept_share_notification:{value:function(num){this.notifications.get(num-1).element(by.className('success')).click()}}
})

module.exports = Header;