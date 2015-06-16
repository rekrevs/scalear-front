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
	// open_item:{value:function(num){return this.items.get(num-1).click()}},
	sort_items:{value:function(item1, item2){
	  	browser.driver.actions().dragAndDrop(this.handles.get(item1), this.handles.get(item2)).perform()
	  	sleep(1000);
	}},
	// delete_item:{value:function(num){
	// 	var item = this.items.get(num-1)
	// 	item.element(by.className('delete')).click()
	// 	item.element(by.className('fi-check')).click()
	// }},
	delete:{value:function(){
		this.field.element(by.className('delete')).click()
		this.field.element(by.className('fi-check')).click()
	}},
	copy:{value:function(){
		right_click(this.name_field)
		this.context_menu_items.first().click()
	}},
	paste:{value:function(){
		right_click(this.name_field)
		this.context_menu_items.get(1).click()
	}}
})

module.exports = Module;