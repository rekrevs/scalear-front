'use strict';
var Module = require('./module');
var sleep = require('../lib/utils').sleep;
var right_click = require('../lib/utils').right_click;
var ContentNavigator = function (val) {
	this.status = val|| 0
};

ContentNavigator.prototype = Object.create({}, {
	navigator:{get: function(){return element(by.id('content_navigator'))}},
	navigator_container:{get: function(){return element(by.className('content-navigator-container'))}},
	modules_container:{get: function(){return element(by.className('modules_container'))}},
	open:{value:function(){if(!this.status){this.navigator.click();this.status=1}}},
	close:{value:function(){if(this.status){this.navigator.click();this.status=0}}},
	set_status:{value:function(val){this.status = val}},
	toggle:{value:function(){this.navigator.click();this.status=!this.status}},
	modules:{get:function(){return this.navigator_container.all(by.repeater('module in modules'))}},
	module:{value:function(num){return new Module(this.modules.get(num-1))}},
	new_module_button:{get:function(){return this.navigator_container.element(by.id('add_module'))}},
	items:{get:function(){return this.navigator_container.all(by.repeater('item in module.items'))}},
	// course_links:{get:function(){return this.navigator_container.all(by.repeater('link in links'))}},
	// course_link:{value:function(num){return new Link(this.course_links.get(num-1))}},
	// open_course_links:{value:function(){return this.navigator_container.element(by.className('links_accordion')).click()}},
	context_menu_items:{get:function(){return this.modules_container.element(by.className("content-menu")).all(by.tagName("li"))}},
	add_module:{value:function(){this.new_module_button.click()}},
	sort_modules:{value:function(module1, module2){
		browser.driver.actions().dragAndDrop(this.module(module1).handle ,this.module(module2).handle).perform()
	}},
	paste:{value:function(){
		right_click(this.modules_container)
		this.context_menu_items.last().click()
	}}
	// sort_links:{value:function(){
	// 	var handle_1 = this.course_link(1).field.element(by.className('handle')) 
	// 	var handle_2 = this.course_link(2).field.element(by.className('handle')) 
	// 	var handle_3 = this.course_link(3).field.element(by.className('handle')) 
 //  		browser.driver.actions().dragAndDrop(handle_1 ,handle_2).perform()
	// 	browser.driver.actions().dragAndDrop(handle_3 ,handle_1).perform()
	// }},
	
});

module.exports = ContentNavigator;