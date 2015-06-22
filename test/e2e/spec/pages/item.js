var right_click = require('../lib/utils').right_click;
var sleep = require('../lib/utils').sleep;

var Item = function(elem){
	this.field = elem
}
Item.prototype = Object.create({}, {
	name_field:{get:function(){return this.field.element(by.binding("item.name"))}},
	name:{get:function(){return this.name_field.getText()}},
	text:{get:function(){return this.field.getText()}},
	handle:{get:function(){return this.field.all(by.className('handle')).first()}},
	context_menu_items:{get:function(){return this.field.element(by.className("item-menu")).all(by.tagName("li"))}},
	open:{value:function(num){return this.field.click()}},
	sort:{value:function(item1, item2){
	  	browser.driver.actions().dragAndDrop(this.handles.get(item1), this.handles.get(item2)).perform()
	  	sleep(1000);
	}},
	delete:{value:function(){
		this.field.element(by.className('delete')).click()
		this.field.element(by.className('fi-check')).click()
	}},
	copy:{value:function(){
		right_click(this.name_field)
		this.context_menu_items.first().click()
	}},
	open_share_window:{value:function(){
		right_click(this.name_field)
		this.context_menu_items.last().click()
	}}
})

module.exports = Item;