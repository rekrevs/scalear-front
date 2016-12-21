'use strict';

var Login = function () {};

Login.prototype = Object.create({}, {
	email_field:{get: function(){return element(by.model('user.email'))}},
	email: { get: function () { return this.email_field.getAttribute('value'); }},
	type_email: { value: function (keys) { return this.email_field.clear().sendKeys(keys); }},

	password_field:{get: function(){return element(by.model('user.password'))}},
	password: { get: function () { return this.password_field.getAttribute('value'); }},
	type_password: { value: function (keys) { return this.password_field.clear().sendKeys(keys); }},

	login_button:{get:function(){return element(by.id('login_btn'))}},

	prev_provider_email_field:{get: function(){return element(by.className('previous_provider')).element(by.model('user.email'))}},
	prev_provider_email: { get: function () { return this.prev_provider_email_field.getAttribute('value'); }},
	prev_provider_type_email: { value: function (keys) { return this.prev_provider_email_field.clear().sendKeys(keys); }},

	prev_provider_password_field:{get: function(){return element(by.className('previous_provider')).element(by.model('user.password'))}},
	prev_provider_password: { get: function () { return this.prev_provider_password_field.getAttribute('value'); }},
	prev_provider_type_password: { value: function (keys) { return this.prev_provider_password_field.clear().sendKeys(keys); }},

	prev_provider_login_button:{get:function(){return element(by.className('previous_provider')).element(by.id('login_btn'))}},
	use_scalable_account_button:{get:function(){return element(by.css('[ng-click="showLoginForm();hideProviders()"]'))}},

	sign_in:{value:function(email, password){
		element(by.id('login')).isDisplayed().then(function(result) {
		    if (result) {
		    	element(by.id('login')).click()
		    }
		})
		var login_obj = this

		element(by.className('previous_provider')).isDisplayed().then(function(result) {
		    if (result) {
		    	login_obj.prev_provider_email_field.click()
		    	login_obj.prev_provider_type_email(email);
					login_obj.prev_provider_type_password(password);
					login_obj.prev_provider_login_button.click();
		    }
		    else{
		    	login_obj.use_scalable_account_button.click()
		    	login_obj.type_email(email);
					login_obj.type_password(password);
					login_obj.login_button.click();
		    }
		}, function(){
	    	login_obj.use_scalable_account_button.click()
	    	login_obj.type_email(email);
				login_obj.type_password(password);
				login_obj.login_button.click();
		})
	}}
});

module.exports = Login;
