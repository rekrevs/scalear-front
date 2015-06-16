// 'use strict';
// var Link = function(elem){
// 	this.field = elem
// }
// Link.prototype = Object.create({}, {
// 	name_field:{get:function(){return this.field.element(by.tagName("details-text"))}},
// 	url_field:{get:function(){return this.field.element(by.tagName("details-link"))}},
// 	name:{get:function(){return this.name_field.getText()}},
// 	url:{get:function(){return this.url_field.getText()}},
// 	link_name:{get:function(){return this.field.getText()}},
// 	edit_name:{value:function(name){
// 		this.name_field.click().then(function(){
// 			element(by.className('editable-input')).clear().sendKeys(name)
// 			element(by.className('check')).click()
// 		})
// 	}},
// 	edit_url:{value:function(url){
// 		this.url_field.click().then(function(){
// 			element(by.className('editable-input')).clear().sendKeys(url)
// 			element(by.className('check')).click()
// 		})
// 	}},
// 	delete:{value:function(){
// 		this.field.element(by.className('delete')).click()
// 		this.field.element(by.className('fi-check')).click()
// 	}}
// })

// module.exports = Link;