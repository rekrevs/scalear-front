'use strict';

var StudentDP = function(){}
StudentDP.prototype= Object.create({}, {
	modal:{get:function(){return element(by.className("reveal-modal")) }},
	modal_students:{get:function(){return this.modal.all(by.repeater('student in students'))}},
	modal_student:{value:function(num){return this.modal_students.get(num-1) }},
	modal_invite_student:{value:function(num){return this.modal_student(num-1).element(by.tagName('span')).click() }},
	modal_cancel_invitation:{value:function(num){return this.modal.element(by.css('[ng-click="caneclAllDistancePeerSession();closeModal()"]')).click() }},
	modal_wait_cancel_and_invite_another:{get:function(){return element(by.id('invite')).getText() }},
	modal_cancel_and_invite:{get:function(){return element(by.id('invite')) }},


// id="invite"
  // title:{get:function(){return element(by.css(".student_inclass h3")).getText()}},
  // alert_box:{get:function(){return element(by.className("inclass_alert"))}},
  // connected_blocks:{get:function(){return element(by.className("connected_blocks"))}},
  // get_block:{value:function(num){return this.connected_blocks.all(by.tagName('li')).get(num-1)}},
  // get_block_text:{value:function(num){return this.get_block(num).getText()}},
  // noclass:{get:function(){return element(by.className("noclass"))}},
  // intro:{get:function(){return element(by.className("intro"))}},
  // self:{get:function(){return element(by.className("self"))}},
  // self_answered:{get:function(){return element(by.className("self_answered"))}},
  // group:{get:function(){return element(by.className("group"))}},
  // group_answered:{get:function(){return element(by.className("group_answered"))}},
  // discussion:{get:function(){return element(by.className("discussion"))}},
  // refresh_button:{get:function(){return this.noclass.element(by.className("refresh_btn"))}},
  // refresh:{value:function(){this.refresh_button.click()}},

  // intro_next_button:{get:function(){return this.intro.element(by.className("next_btn"))}},
  // intro_next:{value:function(){this.intro_next_button.click()}},

  // self_choices:{get:function(){return this.self.all(by.repeater("choice in quiz.answers"))}},
  // self_choice:{value:function(num){return this.self_choices.get(num-1)}},
  // self_note:{get:function(){return this.self.element(by.tagName("textarea"))}},
  // self_vote_button:{get:function(){return this.self.element(by.className("vote_btn"))}},
  // self_vote:{value:function(){ this.self_vote_button.click()}},
  // self_selected_choices:{get:function(){return this.self_answered.all(by.repeater("choice in quiz.answers"))}},
  // self_selected_choice:{value:function(num){return this.self_selected_choices.get(num-1)}},
  // self_retry_btn:{get:function(){return this.self_answered.element(by.className("retry_btn"))}},
  // self_retry:{value:function(){return this.self_retry_btn.click()}},
  // self_next_btn:{get:function(){return this.self_answered.element(by.className("next_btn"))}},
  // self_next:{value:function(){return this.self_next_btn.click()}},
  // self_wait_alert:{get:function(){return this.self_answered.element(by.className("wait_alert"))}},

  // group_choices:{get:function(){return this.group.all(by.repeater("choice in group_quiz.answers"))}},
  // group_choice:{value:function(num){return this.group_choices.get(num-1)}},
  // group_note:{get:function(){return this.group.element(by.tagName("textarea"))}},
  // group_vote_button:{get:function(){return this.group.element(by.className("vote_btn"))}},
  // group_vote:{value:function(){ this.group_vote_button.click()}},
  // group_self_selected_choices:{get:function(){return this.group_answered.all(by.repeater("choice in quiz.answers"))}},
  // group_self_selected_choice:{value:function(num){return this.group_self_selected_choices.get(num-1)}},
  // group_selected_choices:{get:function(){return this.group_answered.all(by.repeater("choice in group_quiz.answers"))}},
  // group_selected_choice:{value:function(num){return this.group_selected_choices.get(num-1)}},
  // group_retry_btn:{get:function(){return this.group_answered.element(by.className("retry_btn"))}},
  // group_retry:{value:function(){return this.group_retry_btn.click()}},
  // group_next_btn:{get:function(){return this.group_answered.element(by.className("next_btn"))}},
  // group_next:{value:function(){return this.group_next_btn.click()}},
  // group_wait_alert:{get:function(){return this.group_answered.element(by.className("wait_alert"))}},

  // discussion_self_selected_choices:{get:function(){return this.discussion.all(by.repeater("choice in quiz.answers"))}},
  // discussion_self_selected_choice:{value:function(num){return this.discussion_self_selected_choices.get(num-1)}},
  // discussion_group_selected_choices:{get:function(){return this.discussion.all(by.repeater("choice in group_quiz.answers"))}},
  // discussion_group_selected_choice:{value:function(num){return this.discussion_group_selected_choices.get(num-1)}},
  // discussion_continue_button:{get:function(){return this.discussion.element(by.className("continue_btn"))}},
  // discussion_continue:{value:function(){return this.discussion_continue_button.click()}},

})

module.exports = StudentDP;
