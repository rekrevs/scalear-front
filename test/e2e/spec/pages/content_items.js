'use strict';

var ContentItem = function () {};

ContentItem.prototype = Object.create({}, {
	video_item:{get:function(){return element(by.id('video_item'))}},
  pi_video_item:{get:function(){return element(by.id('pi_video_item'))}},
	dist_video_item:{get:function(){return element(by.css('[class="th green"]'))}},
	quiz_item:{get:function(){return element(by.id('quiz_item'))}},
	survey_item:{get:function(){return element(by.id('survey_item'))}},
	link_item:{get:function(){return element(by.id('link_item'))}},
	add_video:{value:function(){this.video_item.click()}},
  add_pi_video:{value:function(){this.pi_video_item.click()}},
	add_dist_video:{value:function(){this.dist_video_item.click()}},
	add_quiz:{value:function(){this.quiz_item.click()}},
	add_survey:{value:function(){this.survey_item.click()}},
	add_link:{value:function(){this.link_item.click()}},
})

module.exports = ContentItem;
