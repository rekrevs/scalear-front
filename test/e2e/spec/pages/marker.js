var sleep = require('../lib/utils').sleep;
// CourseEditor = require('./course_editor')
// course_editor = new CourseEditor()

var Marker = function (elem) {
	this.field= elem
}
Marker.prototype = Object.create({}, {
	// flag_button:{get:function(){return this.field.element(by.tagName('flag-button')).element(by.id('flag'))}},
	// unflag_button:{get:function(){return this.field.element(by.tagName('flag-button')).element(by.id('unflag'))}},
	// vote_button:{get:function(){return this.field.element(by.tagName('voting-button')).element(by.className('upvote'))}},
	// unvote_button:{get:function(){return this.field.element(by.tagName('voting-button')).element(by.className('downvote'))}},
	// vote:{value:function(num){this.vote_button.click()}},
	// flag:{value:function(num){this.flag_button.click()}},
	// unvote:{value:function(num){this.unvote_button.click()}},
	// unflag:{value:function(num){this.unflag_button.click()}},
	// comments:{get:function(){return this.field.all(by.repeater("comment_data in item.data.comments"))}},
	// comment:{value:function(num){return new Comment(this.comments.get(num-1))}},
	// comment_button:{get:function(){return this.field.element(by.className("comment_button"))}},
	// add_comment_button:{get:function(){return this.field.element(by.className("success"))}},
	// comment_area:{get:function(){return this.field.element(by.name("comment_area"))}},
	// add_comment:{value:function(){this.comment_button.click()}},
	// type_comment:{value:function(text){
	// 	this.comment_area.sendKeys(text)
	// 	this.add_comment_button.click()
	// 	// this.comment_area.sendKeys(protractor.Key.ENTER)
	// }},
	// edit_key:{get:function(){return this.field.element(by.css('[ng-click="item.data.isEdit=true"]'))}},
	text:{get:function(){return this.field.getText()}},
	title:{get:function(){return this.field.element(by.className('quiz_title')).getText()}},
	// vote_count:{get:function(){return this.field.element(by.binding("votes_count")).getText()}},
	// edit:{value:function(){
	// 	this.title.click()
	// }},
	edit:{value:function(){
		this.field.click()
	}},

	delete:{value:function(){
		this.field.element(by.className('delete')).click()
		this.field.element(by.className('alert')).click()
	}},
});


MarkerPanel = function () {};

MarkerPanel.prototype = Object.create({}, {
	editor_panel:{get:function(){return element(by.css('[ng-switch-when="marker"]'))}},
	done_button:{get:function(){return element(by.id("save_marker_button"))}},
	delete_button:{get:function(){return element(by.className('delete'))}},
	add_marker_button:{get:function(){return element(by.id('note_button'))}},
	create:{value:function(){this.add_marker_button.click();}},
	create_shortcut:{value:function(){$('body').sendKeys('n');}},
	create_empty_shortcut:{value:function(){
		browser.actions().keyDown(protractor.Key.SHIFT).sendKeys('n').perform();
		// $('body').sendKeys('n').sendKeys('protractor.key.');
	}}  ,
	title:{get:function(){return element(by.css('[ng-model="selected_marker.title"]'))}},
	type_title:{value:function(val){this.title.clear().sendKeys(val);}},
	type_empty_title:{value:function(){this.title.clear().sendKeys(" ");}},
	// get_title:{}
	annotation:{get:function(){return element(by.css('[ng-model="selected_marker.annotation"]'))}},
	type_annotation:{value:function(val){this.annotation.clear().sendKeys(val);}},
	type_empty_annotation:{value:function(){this.annotation.clear().sendKeys(" ");}},
	// get_annotation:{}
	save_marker:{value:function(){this.done_button.click()}},
	annotation_video:{get:function(){return element(by.css('[text="selected_marker.annotation"]'))}},
	markers:{get:function(){return element.all(by.repeater('marker in lecture.timeline.items'))}},
	marker:{value:function(num){return new Marker(this.markers.get(num-1))}},
})

module.exports = MarkerPanel;
