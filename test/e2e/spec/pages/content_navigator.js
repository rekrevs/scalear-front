'use strict';
var Link = require('./link');
var sleep = require('../lib/utils').sleep;

var Module = function(elem){
	this.field = elem
}
Module.prototype = Object.create({}, {
	name:{get:function(){return this.field.element(by.className("module_name")).getText()}},
	items:{get:function(){return this.field.all(by.repeater('item in module.items'))}},
	links:{get:function(){return this.field.all(by.repeater('link in module.custom_links'))}},
	handles:{get:function(){return this.field.all(by.className('handle'))}},
	handle:{get:function(){return this.field.all(by.className('handle')).first()}},
	open:{value:function(num){return this.field.element(by.className("module_name")).click()}},
	open_item:{value:function(num){return this.items.get(num-1).click()}},
	sort_items:{value:function(item1, item2){
	  	browser.driver.actions().dragAndDrop(this.handles.get(item1), this.handles.get(item2)).perform()
	  	sleep(1000);
	}},
	delete_item:{value:function(num){
		var item = this.items.get(num-1)
		item.element(by.className('delete')).click()
		item.element(by.className('fi-check')).click()
	}},
	delete:{value:function(){
		this.field.element(by.className('delete')).click()
		this.field.element(by.className('fi-check')).click()
	}}
})

var ContentNavigator = function (val) {
	this.status = val|| 0
};

ContentNavigator.prototype = Object.create({}, {
	navigator:{get: function(){return element(by.id('content_navigator'))}},
	navigator_container:{get: function(){return element(by.className('content-navigator-container'))}},
	open:{value:function(){if(!this.status){this.navigator.click();this.status=1}}},
	close:{value:function(){if(this.status){this.navigator.click();this.status=0}}},
	toggle:{value:function(){this.navigator.click();this.status=!this.status}},
	modules:{get:function(){return this.navigator_container.all(by.repeater('module in modules'))}},
	module:{value:function(num){return new Module(this.modules.get(num-1))}},
	items:{get:function(){return this.navigator_container.all(by.repeater('item in module.items'))}},
	course_links:{get:function(){return this.navigator_container.all(by.repeater('link in links'))}},
	course_link:{value:function(num){return new Link(this.course_links.get(num-1))}},
	open_course_links:{value:function(){return this.navigator_container.element(by.className('links_accordion')).click()}},
	sort_modules:{value:function(module1, module2){
		browser.driver.actions().dragAndDrop(this.module(module1).handle ,this.module(module2).handle).perform()
	}},
	sort_links:{value:function(){
		var handle_1 = this.course_link(1).field.element(by.className('handle')) 
		var handle_2 = this.course_link(2).field.element(by.className('handle')) 
		var handle_3 = this.course_link(3).field.element(by.className('handle')) 
  		browser.driver.actions().dragAndDrop(handle_1 ,handle_2).perform()
		browser.driver.actions().dragAndDrop(handle_3 ,handle_1).perform()
	}}
});

module.exports = ContentNavigator;