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
  modal_invite_student:{value:function(num){return this.modal_student(num-1).element(by.tagName('span')).click() }},
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
  stage_timer_distance_peer:{get:function(){return element(by.id("stage_timer_distance_peer")) }},
  distance_peer_panel:{get:function(){return element(by.id("distance_peer_panel")) }},
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
})

module.exports = StudentDP;
