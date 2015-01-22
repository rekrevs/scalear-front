'use strict';

var Lecture = function (elem) {
	this.field= elem
};

Lecture.prototype = Object.create({}, {
	confused:{get:function(){return this.field.all(by.name('confused-timeline-item'))}},
	discussions:{get:function(){return this.field.all(by.name('discussion-timeline-item'))}},
	items:{get:function(){return this.field.all(by.repeater('item in timeline[l.id].items'))}},
	editable_discussion:{get:function(){return this.field.element(by.id('show_question'))}},
	type_discussion:{value:function(text){this.editable_discussion.element(by.tagName('textarea')).clear().sendKeys(text)}},
	discussion_types:{get:function(){return this.editable_discussion.element(by.tagName('select')).all(by.tagName('option'))}},
	change_discussion_public:{value:function(){this.discussion_types.get(1).click()}},
	change_discussion_private:{value:function(){this.discussion_types.get(0).click()}},
	save_discussion:{value:function(){ this.editable_discussion.element(by.buttonText('Ask')).click()}},
});

var LecturePage= function(){}
LecturePage.prototype=Object.create({},{
	timeline_items:{get:function(){return element.all(by.repeater("l in items")); }},
	confused_button:{get:function(){return element(by.id('confused_button'))}},
	discussion_button:{get:function(){return element(by.id('ask_question_button'))}},
	lecture:{value:function(num){return new Lecture(this.timeline_items.get(num-1))}},
	add_confused:{value:function(){this.confused_button.click()}},
	add_discussion:{value:function(){this.discussion_button.click()}},
})

module.exports = LecturePage;