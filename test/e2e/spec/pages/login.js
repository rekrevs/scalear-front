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

	sign_in:{value:function(email, password){
		this.type_email(email)
		this.type_password(password)
		this.login_button.click()
	}}

});

module.exports = Login;