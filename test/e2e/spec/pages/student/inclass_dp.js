'use strict';

var StudentDistancePeer = function(){}

StudentDistancePeer.prototype= Object.create({}, {

  start_dp_btn:{get:function(){return element(by.css("[ng-if='lecture.distance_peer']"))}},
  fullScreen_btn:{get:function(){return element(by.css("[ng-if='!fullscreen']"))}},
  confused_btn:{get:function(){return element(by.id('confused_button'))}},
  ask_question_btn:{get:function(){return element(by.id('ask_question_button'))}},
  add_note_btn:{get:function(){return element(by.id('add_note_button'))}},

  invite_page:{get:function(){return element(by.css('[ng-show="invite_student"]'))}},
  close_invite_btn:{get:function(){return this.invite_page.element(by.css("[ng-click*='closeModal()']"))}},
  student_invite_btns:{get:function(){return this.invite_page.all(by.repeater('student in students'))}},
  invite_student:{value:function(num){return this.student_invite_btns.get(num-1).click()}},
  invite_title:{value:function(){return this.invite_page.element(by.tagName('h3')).getText()}},

  wait_acceptance_page:{get:function(){return element(by.css('[ng-show="wait_for_acceptance"]'))}},
  close_wait_btn:{get:function(){return this.wait_acceptance_page.element(by.css("[ng-click*='closeModal()']"))}},
  invite_wait_btn:{get:function(){return this.wait_acceptance_page.element(by.id('invite'))}},
  wait_title:{value:function(){return this.wait_acceptance_page.element(by.tagName('h3')).getText()}},
  invited_student:{get:function(){return this.wait_acceptance_page.element(by.binding('invited_student'))}},

  if_invited_page:{get:function(){return element(by.css('[ng-show="check_if_invited"]'))}},
  close_if_Invited_btn:{get:function(){return this.if_invited_page.element(by.css("[ng-click*='closeModal()']"))}},
  invite_if_invited_btn:{get:function(){return this.if_invited_page.element(by.id('invite'))}},
  if_invited_title:{value:function(){return this.if_invited_page.element(by.tagName('h3')).getText()}},
  invited_by:{get:function(){return this.if_invited_page.all(by.repeater('student in invited_by_student'))}},
  got_invited_by:{get:function(num){return this.invited_by.get(num-1)}},


  connected_blocks:{get:function(){return element(by.className('connected_blocks'))}},
  get_block:{value:function(num){return this.connected_blocks.all(by.tagName('li')).get(num-1)}},
  dp_msg:{get:function(){return element(by.css("[ng-bind='distance_peer_message_in_box']"))}},
  end_dp_btn:{get:function(){return element(by.css('[ng-click="endDistancePeerSession()"]'))}},

  timer:{value:function(){return element(by.binding('status_counter'))}},
  annotation_text:{value:function(){return element(by.tagName('annotation')).getText()}},

  answers:{get:function(){return element.all(by.className('answer_input'))}},
  select_answer:{value:function(num){return this.answers.get(num-1).click()}},
  check_answer_btn:{get:function(){return element(by.className('check_answer_button'))}},
  check_answer:{value:function(){return this.check_answer_btn.click()}},

})

module.exports = StudentDistancePeer;
