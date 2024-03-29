'use strict';

var Header = function(){}

Header.prototype= Object.create({}, {
	courses_menu:{get:function(){return element(by.id("all_courses"))}},
	account_menu:{get:function(){return element(by.id("account"))}},
	notification_menu:{get:function(){return element(by.id("notifications"))}},
	dashboard_menu:{get:function(){return element(by.id("dashboard"))}},
	help_menu:{get:function(){return element(by.id("help"))}},

	show_menu:{value:function(menu){return browser.driver.actions().mouseMove(menu).click().perform()}},
	show_account_menu:{value:function(){this.show_menu(this.account_menu)}},
	show_courses_menu:{value:function(){this.show_menu(this.courses_menu)}},
	show_notification:{value:function(){this.show_menu(this.notification_menu)}},
	show_dashboard_menu:{value:function(){this.show_menu(this.dashboard_menu)}},
	show_help_menu:{value:function(){this.show_menu(this.help_menu)}},
	share_notifications:{get:function(){return element.all(by.repeater('(id, item) in user.shared_items'))}},
	invitation_notifications:{get:function(){return element.all(by.repeater('(id, invitation) in user.invitation_items'))}},
	shared_button:{get:function(){return element(by.id("view_shared"))}},
	calendar_button:{get:function(){return element(by.id("calendar_button"))}},
	support_button:{get:function(){return element(by.css("[ng-click='toggleTechnicalDisplay()']"))}},
	all_courses:{get:function(){return element(by.id("course_list"))}},
	account_information:{get:function(){return element(by.id("account_information"))}},

	
	open_shared:{value:function(){
		this.show_courses_menu()
		this.shared_button.click()
	}},
	open_dashboard:{value:function(){
		this.show_dashboard_menu()
		this.calendar_button.click()
	}},
	open_support:{value:function(){ 
		this.show_help_menu()
		this.support_button.click()
	}},
	close_support:{value:function(){ 
		element(by.css('[ng-click="cancel()"]')).click()
	}},

	open_courses:{value:function(){
		this.show_courses_menu() 
		this.all_courses.click()
	}},
	open_account_information:{value:function(){
		this.show_account_menu() 
		this.account_information.click()
	}},
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
	reject_join_course:{get:function(key){
		return element(by.css('[ng-if="form.server_error"]'))
	}},
	close_join_course:{value:function(key){
		element(by.css('[ng-click="cancelEnroll()"]')).click()
	}},	
	reject_share_notification:{value:function(num){this.share_notifications.get(num-1).element(by.className('alert')).click()}},
	accept_share_notification:{value:function(num){this.share_notifications.get(num-1).element(by.className('success')).click()}},
	reject_invitation_notification:{value:function(num){this.invitation_notifications.get(num-1).element(by.className('alert')).click()}},
	accept_invitation_notification:{value:function(num){this.invitation_notifications.get(num-1).element(by.className('success')).click()}},
	delete_user:{value:function(password){
		element(by.css('[ng-click="confirmDelete()"]')).click()
		element(by.id('del_con_pwd')).sendKeys(password)
		element(by.id('del_ok_btn')).click()
			
	}},
})

module.exports = Header;