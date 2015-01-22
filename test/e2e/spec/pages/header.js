'use strict';

var Header = function(){}

Header.prototype= Object.create({}, {
	courses_menu:{get:function(){return element(by.id("all_courses"))}},
	account_menu:{get:function(){return element(by.id("account"))}},
	show_account_menu:{value:function(){browser.driver.actions().mouseMove(this.account_menu).perform();}},
	show_courses_menu:{value:function(){browser.driver.actions().mouseMove(this.courses_menu).perform();}},
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
	}}
})

module.exports = Header;