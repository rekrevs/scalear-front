'use strict';
var StudentDP = function(){}
StudentDP.prototype= Object.create({}, {
	modal:{get:function(){return element(by.className("reveal-modal")) }},
	invite_student_modal:{get:function(){return element(by.id('invite_student_modal')) }},
  check_if_invited_modal:{get:function(){return element(by.id('check_if_invited_modal')) }},
  wait_for_acceptance_modal:{get:function(){return element(by.id('wait_for_acceptance_modal')) }},
  wait_modal:{value:function(){
    var self = this
    browser.driver.wait(function() {
      return self.modal.isPresent().then(function(disp) {
        return disp;
      }, 100000);
    });
  }},
  modal_students:{get:function(){return this.modal.all(by.repeater('student in students'))}},
	modal_student:{value:function(num){return this.modal_students.get(num-1) }},
  modal_invite_email:{value:function(num){return this.modal_student(num-1).element(by.tagName('span')) }},
  modal_invite_student:{value:function(num){return this.modal_student(num-1).element(by.tagName('span')).click() }},
  // modal_invite_email:{value:function(num){return this.modal_student(num-1).element(by.tagName('span')) }}, 
  modal_cancel_invitation_wait_for_acceptance:{value:function(num){return element(by.css("#wait_for_acceptance_modal a.right")).click() }},
  modal_invite_another_wait_for_acceptance:{value:function(num){return element(by.css("#wait_for_acceptance_modal a#invite")).click() }},
  modal_accept_invitation:{value:function(num){return element(by.css("#check_if_invited_modal div.button")).click() }},


  wait_progress_bar:{value:function(){
    var self = this
    browser.driver.wait(function() {
      return element(by.css(".progressBar")).isPresent().then(function(disp) {
        return disp;
      }, 100000);
    });
  }},
  stage_timer_distance_peer:{get:function(){return element(by.css("[ng-show*='!fullscreen'] .distance-peer-timer")) }},
  distance_peer_panel:{get:function(){return element(by.css("[ng-show*='!fullscreen'] .distance-peer-panel")) }},
  end_distance_peer_click:{value:function(num){return this.distance_peer_panel.element(by.css("button")).click() }},
  annotation:{get:function(){return element(by.css("annotation")) }},
  notification:{get:function(){return element(by.tagName("notification"))}},
  close_annotation:{value:function(){return element(by.css("annotation a")).click() }},
  wait_state_to_finished:{value:function(){
    var self = this
    browser.driver.wait(function() {
      return self.annotation.isPresent().then(function(disp) {
        return disp;
      }, 100000);
    });
  }},

  // start_dp_btn:{get:function(){return element(by.css("[ng-if='lecture.distance_peer']"))}},
  // fullScreen_btn:{get:function(){return element(by.css("[ng-if='!fullscreen']"))}},
  // confused_btn:{get:function(){return element(by.id('confused_button'))}},
  // ask_question_btn:{get:function(){return element(by.id('ask_question_button'))}},
  // add_note_btn:{get:function(){return element(by.id('add_note_button'))}},

  // invite_page:{get:function(){return element(by.css('[ng-show="invite_student"]'))}},
  // close_invite_btn:{get:function(){return this.invite_page.element(by.css("[ng-click*='closeModal()']"))}},
  // student_invite_btns:{get:function(){return this.invite_page.all(by.repeater('student in students'))}},
  // invite_student:{value:function(num){return this.student_invite_btns.get(num-1).click()}},
  // invite_title:{value:function(){return this.invite_page.element(by.tagName('h3')).getText()}},

  // wait_acceptance_page:{get:function(){return element(by.css('[ng-show="wait_for_acceptance"]'))}},
  // close_wait_btn:{get:function(){return this.wait_acceptance_page.element(by.css("[ng-click*='closeModal()']"))}},
  // invite_wait_btn:{get:function(){return this.wait_acceptance_page.element(by.id('invite'))}},
  // wait_title:{value:function(){return this.wait_acceptance_page.element(by.tagName('h3')).getText()}},
  // invited_student:{get:function(){return this.wait_acceptance_page.element(by.binding('invited_student'))}},

  // if_invited_page:{get:function(){return element(by.css('[ng-show="check_if_invited"]'))}},
  // close_if_Invited_btn:{get:function(){return this.if_invited_page.element(by.css("[ng-click*='closeModal()']"))}},
  // invite_if_invited_btn:{get:function(){return this.if_invited_page.element(by.id('invite'))}},
  // if_invited_title:{value:function(){return this.if_invited_page.element(by.tagName('h3')).getText()}},
  // invited_by:{get:function(){return this.if_invited_page.all(by.repeater('student in invited_by_student'))}},
  // got_invited_by:{get:function(num){return this.invited_by.get(num-1)}},


  // connected_blocks:{get:function(){return element(by.className('connected_blocks'))}},
  // get_block:{value:function(num){return this.connected_blocks.all(by.tagName('li')).get(num-1)}},
  // dp_msg:{get:function(){return element(by.css("[ng-bind='distance_peer_message_in_box']"))}},
  // end_dp_btn:{get:function(){return element(by.css('[ng-click="endDistancePeerSession()"]'))}},

  // timer:{value:function(){return element(by.binding('status_counter'))}},
  // annotation_text:{value:function(){return element(by.tagName('annotation')).getText()}},

  // answers:{get:function(){return element.all(by.className('answer_input'))}},
  // select_answer:{value:function(num){return this.answers.get(num-1).click()}},
  // check_answer_btn:{get:function(){return element(by.className('check_answer_button'))}},
  // check_answer:{value:function(){return this.check_answer_btn.click()}},

})

module.exports = StudentDP;