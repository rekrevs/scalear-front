Question = function(elem){
	this.field = elem
}

Question.prototype= Object.create({},{
	title:{get:function(){return this.field.element(by.name('qlabel')).getAttribute('value')}},
	type_title:{value:function(title){return this.field.element(by.name('qlabel')).sendKeys(title)}},
	answers:{get:function(){return this.field.all(by.repeater("answer in quiz.answers"))}},
	answer:{value:function(num){return this.answers.get(num-1)}},
	add_answer_button:{get:function(){return this.field.element(by.id("add_answer"))}},
	add_answer:{value:function(){this.add_answer_button.click()}},
	answer_field:{get:function(){return this.field.all(by.css("div[name='answer']")).last()}},
	type_answer:{value:function(answer){return this.answer_field.sendKeys(answer)}},
	free_answer_field:{get:function(){return this.field.all(by.css("[name='answer']")).last()}},
	type_free_answer:{value:function(answer){return this.free_answer_field.sendKeys(answer)}},
	types:{get:function(){return this.field.element(by.className('choices')).all(by.tagName('option'))}},
	free_text_types:{get:function(){return this.field.element(by.model('quiz.match_type')).all(by.tagName('option'))}},
	correct_checkbox:{get:function(){return this.field.all(by.model('answer.correct')).last()}},
	correct_answer:{value:function(){ this.correct_checkbox.click()}},
	change_type_mcq:{value:function(){this.types.get(0).click()}},
	change_type_ocq:{value:function(){this.types.get(1).click()}},
	change_type_free_text:{value:function(){this.types.get(2).click()}},
	change_type_match_text:{value:function(){
		this.types.get(2).click()
		this.free_text_types.get(1).click()
	}},
	change_type_drag:{value:function(){this.types.get(3).click()}},
	delete:{value:function(){
		this.field.element(by.className('delete')).click()
		this.field.element(by.className('alert')).click()
	}},
	delete_answer:{value:function(num){
		this.answer(num).element(by.className('delete')).click()
		this.answer(num).element(by.className('alert')).click()
	}}
})

NormalQuiz = function () {};

NormalQuiz.prototype = Object.create({}, {
	add_header_button:{get:function(){return element(by.name('add_header'))}},
	add_question_button:{get:function(){return element(by.name('add_question'))}},
	save_button:{get:function(){return element(by.name('save_quiz'))}},
	publish_button:{get:function(){return element(by.name('save_publish'))}},
	header_field:{get:function(){return element.all(by.className('ta-text')).last()}},
	questions:{get:function(){return element.all(by.repeater('question in questions'))}},
	question:{value:function(num){return new Question(this.questions.get(num-1))}},
	add_header:{value:function(){this.add_header_button.click()}},
	type_header:{value:function(text){this.header_field.sendKeys(text)}},
	add_question:{value:function(){this.add_question_button.click()}},
	save:{value:function(){this.save_button.click()}},
	publish:{value:function(){this.publish_button.click()}},
})

module.exports = NormalQuiz;
