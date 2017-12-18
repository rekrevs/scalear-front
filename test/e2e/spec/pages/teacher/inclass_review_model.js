'use strict';

var ReviewModel=function(model){}

ReviewModel.prototype= Object.create({},{
  review_model:{get:function() {return element(by.className("whiteboard"))}},
  lecture_title:{get:function(){return this.review_model.element(by.className("lecture_title")).getText()}},
  question_block:{get:function(){return this.review_model.element(by.className("question_block"))}},
  white_background_block:{get:function(){return this.review_model.element(by.id("white_background"))}},
  white_chart:{get:function(){return this.white_background_block.all(by.id('chart')) }},
  free_text_question_title:{get:function(){ return this.white_background_block.getText()}},
  free_text_question_answer:{get:function(){ return this.white_background_block.element(by.css("[selected_timeline_item.type == 'Free Text Question']")).getText()}},
  quiz_title:{get:function(){ return this.question_block.element(by.className("quiz")).getText()}},
  confused_title:{get:function(){ return this.question_block.element(by.className("original_question")).getText()}},
  question_title:{get:function(){return element.all(by.repeater('question in selected_timeline_item.data')).get(0)}},
  comment_title:{get:function(){ return element.all(by.repeater("comment in question.post.comments")).get(0)}},

// id="content_list"  //module_item in module.items 

  connected_blocks:{get:function(){return element.all(by.repeater('item in selected_timeline_item.sub_items'))}},
  get_block:{value:function(num){return this.connected_blocks.get(num-1).element(by.tagName('li'))}},
  get_block_text:{value:function(num){return this.get_block(num).getText()}},
  next_button:{get:function(){return this.review_model.element(by.className("next_btn"))}},
  prev_button:{get:function(){return this.review_model.element(by.className("prev_btn"))}},
  exit_button:{get:function(){return this.review_model.element(by.className("exit_btn"))}},
  content_list_button:{get:function(){return this.review_model.element(by.id("content_list_btn"))}},
  content_list:{get:function(){return element(by.id("content_list")).all(by.repeater('module_item in module.items')) }},
  // content_list_lecture:{value:function(val){return this.content_list.get(val-1) }},

  chart:{get:function () { return this.question_block.element(by.className("original_chart"))}},
  next:{value:function(){this.next_button.click()}},
  previous:{value:function(){this.prev_button.click()}},
  wait_till_ready:{value:function(){
    var self = this
    browser.driver.wait(function() {
      return self.question_block.isPresent().then(function(disp) {
        return disp;
      }, 100000);
    });
  }},
})

module.exports = ReviewModel;
