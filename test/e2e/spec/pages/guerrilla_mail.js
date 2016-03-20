'use strict';

var GuerrillaMail = function () {};

GuerrillaMail.prototype = Object.create({}, {


	open_url:{value: function(url){ 
		browser.ignoreSynchronization = true;
		browser.driver.get(url); }},


	email_field:{get: function(){return element(by.id('inbox-id'))}},
	email_text_field:{get: function(){return element(by.css('[type="text"]'))}},
	email_set_field:{get: function(){return element(by.id('inbox-id')).element(by.className('save'))}},
	table_field:{ get: function(){return element(by.id('email_list'))}},
	rows_field:{ get: function(){return element.all(by.className('mail_row'))}},
	row_field:{ get: function(){return element(by.className('mail_row'))}},
	confirm_email_field:{ get: function(){return element(by.css('[href^="http://mail."]'))}},

	type_email: { value: function (keys) { 
		this.email_field.click();

		this.email_field.element(by.css('[type="text"]')).clear()
		this.email_field.element(by.css('[type="text"]')).sendKeys(keys);
		this.email_set_field.click();
	}},
	change_mail_name:{value: function(email){ this.type_email(email) }},
	count_row:{value: function (){return this.rows_field.count();}},
	open_last_mail:{value: function(){ this.row_field.click() }},
	confirm_email:{value: function(){ this.confirm_email_field.click() }},
	
	university_field:{get: function(){return element(by.model('user.university'))}},
	university: { get: function () { return this.university_field.getAttribute('value')}},
	type_university: { value: function (keys) { return this.university_field.clear().sendKeys(keys)}},
	
	password_field:{get: function(){return element(by.model('user.password'))}},
	password: { get: function () { return this.password_field.getAttribute('value')}},
	type_password: { value: function (keys) { return this.password_field.clear().sendKeys(keys)}},
	
	password_confrimation_field:{get: function(){return element(by.model('user.password_confirmation'))}},
	password_confrimation: { get: function () { return this.password_confrimation_field.getAttribute('value')}},
	type_password_confrimation: { value: function (keys) { return this.password_confrimation_field.clear().sendKeys(keys)}},

	sign_up_user_button:{get:function(){return element(by.buttonText("Sign up"))}},
	
	create:{value :function(email, password,university,last,first){
		this.type_firstname(first)
		this.type_lastname(last)
		this.type_email(email)
		this.type_university(university)
		this.type_password(password)
		this.type_password_confrimation([password])
		this.sign_up_user_button.click()
	}},



	sign_up_button:{get:function(){return element(by.id('join_btn'))}},
	sign_teacher_button:{get:function(){return element(by.css('[ng-click="setupScreenName(1)"]'))}},

	sign_up:{value:function(){
		element(by.css('[ng-click="previous_provider=null"]')).isDisplayed().then(function(result) {if (result) {element(by.css('[ng-click="previous_provider=null"]')).click()}})
		element(by.css('[ng-click="showLoginForm()"]')).isDisplayed().then(function(result) {if (result) {element(by.css('[ng-click="showLoginForm()"]')).click()}})
		element(by.id('login')).isDisplayed().then(function(result) {if (result) {element(by.id('login')).click()}})
		var login_obj = this
		login_obj.sign_up_button.isDisplayed().then(function(result) {
		    if (result) {
		    	login_obj.sign_up_button.click()
		    	login_obj.sign_teacher_button.click();
			 }
		})
	}}

});

module.exports = GuerrillaMail;