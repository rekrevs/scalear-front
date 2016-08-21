'use strict';

var Header = require('./header');

var AccountInformation = function () {};

AccountInformation.prototype = Object.create({}, {
	firstname_field:{get: function(){return element(by.model('user.name'))}},
	firstname: { get: function () { return this.firstname_field.getAttribute('value'); }},
	type_firstname: { value: function (keys) { return this.firstname_field.clear().sendKeys(keys); }},

	lastname_field:{get: function(){return element(by.model('user.last_name'))}},
	lastname: { get: function () { return this.lastname_field.getAttribute('value')}},
	type_lastname: { value: function (keys) { return this.lastname_field.clear().sendKeys(keys)}},

	email_field:{get: function(){return element(by.model('user.email'))}},
	email: { get: function () { return this.email_field.getAttribute('value')}},
	type_email: { value: function (keys) { return this.email_field.clear().sendKeys(keys)}},

	university_field:{get: function(){return element(by.model('user.university'))}},
	university: { get: function () { return this.university_field.getAttribute('value')}},
	type_university: { value: function (keys) { return this.university_field.clear().sendKeys(keys)}},

	screenname_field:{get: function(){return element(by.model('user.screen_name'))}},
	screenname: { get: function () { return this.screenname_field.getAttribute('value')}},
	type_screenname: { value: function (keys) { return this.screenname_field.clear().sendKeys(keys)}},

	link_field:{get: function(){return element(by.model('user.link'))}},
	link: { get: function () { return this.link_field.getAttribute('value')}},
	type_link: { value: function (keys) { return this.link_field.clear().sendKeys(keys)}},

	bio_field:{get: function(){return element(by.model('user.bio'))}},
	bio: { get: function () { return this.bio_field.getAttribute('value')}},
	type_bio: { value: function (keys) { return this.bio_field.clear().sendKeys(keys)}},

	password_field:{get: function(){return element(by.model('user.password'))}},
	password: { get: function () { return this.password_field.getAttribute('value')}},
	type_password: { value: function (keys) { return this.password_field.clear().sendKeys(keys)}},

	password_confirmation_field:{get: function(){return element(by.model('user.password_confirmation'))}},
	password_confirmation: { get: function () { return this.password_confirmation_field.getAttribute('value')}},
	type_password_confirmation: { value: function (keys) { return this.password_confirmation_field.clear().sendKeys(keys)}},

	current_password_field:{get: function(){return element(by.model('user.current_password'))}},
	current_password: { get: function () { return this.current_password_field.getAttribute('value')}},
	type_current_password: { value: function (keys) { return this.current_password_field.clear().sendKeys(keys)}},

	update_button:{get:function(){return element(by.id('update_info'))}},
	save_button:{get: function(){return element(by.id('update_info_modal'))}},
	
	open:{value:function(){
		var header = new Header()
		header.show_account_menu()
		element(by.id('account_information')).click();
		browser.driver.wait(function() {
	      return browser.driver.getCurrentUrl().then(function(url) {
	        return /edit/.test(url);
	      });
	    });
	}},
	save:{value: function(pass){
			this.update_button.click()
			this.type_current_password(pass)
			this.save_button.click()
		}
	}
});

module.exports = AccountInformation;