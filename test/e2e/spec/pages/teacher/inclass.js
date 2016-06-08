'use strict';

var Quiz = function(elem){
  this.field = elem
}

Quiz.prototype = Object.create({}, {
  title:{get:function(){return this.field.element(by.className('inner_title')).getText()}},
  visibility_box:{get:function(){return this.field.element(by.className('show_inclass'))}},
  visibility_box_click:{value:function(){return this.visibility_box.click()}},
})

var ModuleItem = function(elem){
  this.field = elem
}

ModuleItem.prototype = Object.create({}, {
  items:{get:function(){ return this.field.all(by.className('ul_item'))}},
  title:{get:function(){return this.field.element(by.className("title")).getText()}},
  // lecture
  inclass_quizzes:{get:function(){return this.field.all(by.className('color-orange'))}},
  inclass_quiz:{value:function(val){return new Quiz(this.inclass_quizzes.get(val-1)) }},
  discussions:{get:function(){return this.field.all(by.className('color-coral'))}},
  // discussion:{value:function(val){return new Discussion(this.discussions.get(val-1)) }},
  // quiz  and survey
  question_quizzes:{get:function(){return this.field.all(by.className('color-blue'))}},
  // question_quiz:{value:function(val){return new Quiz(this.question_quizzes.get(val-1)) }},
  freetextquestions:{get:function(){return this.field.all(by.className('color-coral'))}},
  // freetextquestion:{value:function(val){return new Freetextquestion(this.freetextquestions.get(val-1)) }},
})

var Inclass = function(){}

Inclass.prototype= Object.create({}, {
  title:{get:function(){return element(by.css(".inclass h4")).getText()}},
  display_button:{get:function(){return element(by.className("display_inclass"))}},
  start_inclass_review:{value:function(){this.display_button.click()}},
  total_inclass_time:{get:function(){return element(by.exactBinding("total_inclass_estimate")).getText()}},
  total_pi_time:{get:function(){return element(by.exactBinding("inclass_estimate")).getText()}},
  total_pi_quizzes:{get:function(){return element(by.exactBinding("inclass_quiz_count")).getText()}},
  total_review_time:{get:function(){return element(by.exactBinding("review_estimate")).getText()}},
  total_review_quizzes:{get:function(){return element(by.exactBinding("quiz_count")).getText()}},
  total_review_discussions:{get:function(){return element(by.exactBinding("question_count")).getText()}},
  total_review_surveys:{get:function(){return element(by.exactBinding("survey_count")).getText()}},
  module_items:{get:function(){return element.all(by.repeater('module_item in module.items'))}},
  module_item:{value:function(value){return new ModuleItem(this.module_items.get(value-1))}},

})

module.exports = Inclass;
