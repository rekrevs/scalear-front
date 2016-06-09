var Item = require('./item');
var sleep = require('../lib/utils').sleep;
var right_click = require('../lib/utils').right_click;
var Module = function(elem){
	this.field = elem
}

Module.prototype = Object.create({}, {
	name_field:{get:function(){return this.field.element(by.className("module_name"))}},
	name:{get:function(){return this.name_field.getText()}},
	items:{get:function(){return this.field.all(by.repeater('item in module.items'))}},
	item:{value:function(num){return new Item(this.items.get(num-1))}},
	links:{get:function(){return this.field.all(by.repeater('link in module.custom_links'))}},
	handles:{get:function(){return this.field.all(by.className('handle'))}},
	handle:{get:function(){return this.field.all(by.className('handle')).first()}},
	new_item_button:{get:function(){return this.field.element(by.id('new_item'))}},
	context_menu_items:{get:function(){return this.field.element(by.className("module-menu")).all(by.tagName("li"))}},
	open:{value:function(num){return this.field.element(by.className("module_name")).click()}},
	open_content_items: {value: function(){this.new_item_button.click()}},
	open_student_inclass:{value:function(){this.field.element(by.className("inclass_button")).click()}},
	sort_items:{value:function(item1, item2){
	  	browser.driver.actions().dragAndDrop(this.handles.get(item1), this.handles.get(item2)).perform()
	  	sleep(1000);
	}},
	delete:{value:function(){
		this.field.element(by.className('delete')).click()
		this.field.element(by.className('alert')).click()
		sleep(1000);
	}},
	copy:{value:function(){
		right_click(this.name_field)
		this.context_menu_items.first().click()
	}},
	paste:{value:function(){
		right_click(this.name_field)
		this.context_menu_items.get(1).click()
	}},
	open_share_window:{value:function(){
		right_click(this.name_field)
		this.context_menu_items.last().click()
	}}
})

module.exports = Module;
