'use strict';

var Signup = function () {};

Signup.prototype = Object.create({}, {


	firstname_field:{get: function(){return element(by.model('user.name'))}},
	firstname: { get: function () { return this.firstname_field.getAttribute('value')}},
	type_firstname: { value: function (keys) { return this.firstname_field.clear().sendKeys(keys)}},

	lastname_field:{get: function(){return element(by.model('user.last_name'))}},
	lastname: { get: function () { return this.lastname_field.getAttribute('value')}},
	type_lastname: { value: function (keys) { return this.lastname_field.clear().sendKeys(keys)}},
	
	email_field:{get: function(){return element(by.model('user.email'))}},
	email: { get: function () { return this.email_field.getAttribute('value')}},
	type_email: { value: function (keys) { return this.email_field.clear().sendKeys(keys)}},
	
	university_field:{get: function(){return element(by.model('user.university'))}},
	university: { get: function () { return this.university_field.getAttribute('value')}},
	type_university: { value: function (keys) { return this.university_field.clear().sendKeys(keys)}},
	
	password_field:{get: function(){return element(by.model('user.password'))}},
	password: { get: function () { return this.password_field.getAttribute('value')}},
	type_password: { value: function (keys) { return this.password_field.clear().sendKeys(keys)}},
	
	password_confrimation_field:{get: function(){return element(by.model('user.password_confirmation'))}},
	password_confrimation: { get: function () { return this.password_confrimation_field.getAttribute('value')}},
	type_password_confrimation: { value: function (keys) { return this.password_confrimation_field.clear().sendKeys(keys)}},

	onlinename_field:{get: function(){return element(by.model('user.screen_name'))}},
	onlinename: { get: function () { return this.onlinename_field.getAttribute('value')}},
	type_onlinename: { value: function (keys) { return this.onlinename_field.clear().sendKeys(keys)}},

	sign_up_user_button:{get:function(){return element(by.buttonText("Sign up")) }},
	
	create:{value :function(email, password,university,last,first,onlinename){
		this.type_firstname(first)
		this.type_lastname(last)
		this.type_email(email)
		this.type_university(university)
		this.type_password(password)
		this.type_password_confrimation([password])
		this.type_onlinename(onlinename)
		this.sign_up_user_button.click()
	}},



	sign_up_button:{get:function(){return element(by.id('join_btn'))}},
	sign_teacher_button:{get:function(){return element(by.css('[ng-click="setupScreenName(1)"]'))}},
	sign_student_button:{get:function(){return element(by.css('[ng-click="setupScreenName(2)"]'))}},
	sign_up:{value:function(val){
		element(by.css('[ng-click="previous_provider=null"]')).isPresent().then(function(result) {if (result) { element(by.css('[ng-click="previous_provider=null"]')).isDisplayed().then(function(result) {if (result) {element(by.css('[ng-click="previous_provider=null"]')).click()}}) }})
		
		element(by.css('[ng-click="showLoginForm()"]')).isDisplayed().then(function(result) {if (result) {element(by.css('[ng-click="showLoginForm()"]')).click()}})
		element(by.id('login')).isDisplayed().then(function(result) {if (result) {element(by.id('login')).click()}})
		var login_obj = this
		login_obj.sign_up_button.isDisplayed().then(function(result) {
		    if (result) {
		    	login_obj.sign_up_button.click()
		    	if (val == 'teacher'){
		    		login_obj.sign_teacher_button.click();
		    	}
		    	else {
			    	login_obj.sign_student_button.click();	
		    	}

			 }
		})
	}},
	skip_button:{value:function(){
		element(by.css('[ng-click="watchedIntro()"]')).isDisplayed().then(function(result) {if (result) {element(by.css('[ng-click="watchedIntro()"]')).click()}})
	}}

});

module.exports = Signup;