var sleep = require('../lib/utils').sleep;
CourseEditor = require('./course_editor')
course_editor = new CourseEditor()
InvideoQuiz = function (val) {};

InvideoQuiz.prototype = Object.create({}, {
	editor_panel:{get:function(){return element(by.id("editing"))}},
	quiz_layer:{get:function(){return element(by.id("ontop"))}},
	name_field:{get:function(){return element(by.className('quiz_name'))}},
	name:{get:function(){return this.name_field.getAttribute('value')}},
	type_name:{value:function(name){return this.name_field.clear().sendKeys(name)}},
	time_field:{get:function(){return element(by.className('quiz_time'))}},
	time:{get:function(){return this.time_field.getAttribute('value')}},
	type_time:{value:function(time){return this.time_field.clear().sendKeys(time)}},
	done_button:{get:function(){return element(by.id("save_quiz_button"))}},
	delete_button:{get:function(){return element(by.className('delete'))}},
	ocq:{get:function(){return element(by.id("ocq"))}},
	mcq:{get:function(){return element(by.id("mcq"))}},
	drag:{get:function(){return element(by.id("drag"))}},
	ocq_text:{get:function(){return element(by.id("ocq_text"))}},
	mcq_text:{get:function(){return element(by.id("mcq_text"))}},
	drag_text:{get:function(){return element(by.id("drag_text"))}},
	ocq_survey:{get:function(){return element(by.id("ocq_survey"))}},
	mcq_survey:{get:function(){return element(by.id("mcq_survey"))}},
	free_text:{get:function(){return element(by.id("free_text"))}},
	explanation:{get:function(){return element(by.model("data.explanation"))}},
	type_explanation:{value:function(val){return this.explanation.sendKeys(val)}},
	correct_checkbox:{get:function(){return element(by.id("correct_checkbox"))}},
	add_answer_button:{get:function(){return element(by.id("add_answer"))}},
	text_answers:{get:function(){return element.all(by.css("div[name='answer']"))}},
	text_explanation:{get:function(){return element.all(by.css("div[name='explanation']"))}},
	text_correct_checkbox:{get:function(){return element.all(by.model('answer.correct'))}},
	quizzes:{get:function(){return element.all(by.repeater("quiz in lecture.timeline.items"))}},
	quiz:{value:function(num){return this.quizzes.get(num-1)}},
	count:{get:function(){return this.quizzes.count()}},
	start_handle:{get:function (){ return element(by.className("squarebrackets_left"))}},
	end_handle:{get:function (){ return element(by.className("squarebrackets_right"))}},
	quiz_handle:{get:function (){ return element(by.className("quiz_circle"))}},
	start_checkbox:{get:function(){ return element(by.model("selected_quiz.has_start")) }},
	end_checkbox:{get:function(){ return element(by.model("selected_quiz.has_end")) }},
	intro_time_field:{get:function(){return element(by.model("selected_quiz.inclass_session.intro_formatedTime"))}},
	self_time_field:{get:function(){return element(by.model("selected_quiz.inclass_session.self_formatedTime"))}},
	group_time_field:{get:function(){return element(by.model("selected_quiz.inclass_session.group_formatedTime"))}},
	discussion_time_field:{get:function(){return element(by.model("selected_quiz.inclass_session.discussion_formatedTime"))}},
	intro_time:{get:function(){return this.intro_time_field.getAttribute('value')}},
	self_time:{get:function(){return this.self_time_field.getAttribute('value')}},
	group_time:{get:function(){return this.group_time_field.getAttribute('value')}},
	discussion_time:{get:function(){return this.discussion_time_field.getAttribute('value')}},
	create:{value:function(quiz_type_button){
		course_editor.new_question_button.click();
		quiz_type_button.click()
	}},
	open:{value:function(num){this.quiz(num).element(by.className("quiz_title")).click()}},
	delete:{value:function(num){
		this.quiz(num).element(by.className('delete')).click()
		this.quiz(num).element(by.className('alert')).click()
	}},
	delete_from_editor:{value:function(){
		this.editor_panel.element(by.className('delete')).click()
		this.editor_panel.element(by.className('alert')).click()
	}},
	add_answer:{value:function(x,y,correct,explanation){
		browser.driver.actions().mouseMove(this.quiz_layer).perform();
		browser.driver.actions().mouseMove(this.quiz_layer,{x: x, y: y}).perform()
		browser.driver.actions().doubleClick().perform()
	}},

	add_answer_drag:{value:function(x,y,correct,explanation){
		browser.driver.actions().mouseMove(this.quiz_layer).perform();
		browser.driver.actions().mouseMove(this.quiz_layer,{x: x, y: y}).perform()
		browser.driver.actions().doubleClick().perform()
	}},

	add_text_answer:{value:function(){
		this.add_answer_button.click()
	}},
	hide_popover:{value:function(){
		browser.driver.actions().mouseMove(this.editor_panel).perform();
		browser.driver.actions().mouseMove(this.editor_panel,{x: 1, y: 1}).perform()
		browser.driver.actions().click().perform()
	}},
	type_text_answer:{value:function(num, answer){
		this.text_answers.get(num-1).sendKeys(answer)
	}},
	type_text_explanation:{value:function(num, explanation){
		this.text_explanation.get(num-1).sendKeys(explanation)
	}},
	text_answer_correct:{value:function(num){
		this.text_correct_checkbox.get(num-1).click()
	}},
	mark_correct:{value:function(){return this.correct_checkbox.click()}},
	rename:{value:function(name){this.type_name(name)}},
	change_time:{value:function(time){this.type_time(time)}},
	save_quiz:{value:function(){this.done_button.click()}}
})

module.exports = InvideoQuiz;
