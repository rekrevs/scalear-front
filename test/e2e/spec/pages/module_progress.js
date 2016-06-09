var Quiz = function(elem){
	this.field = elem
}

Quiz.prototype = Object.create({}, {
	quiz_chart:{get:function(){return this.field.element(by.className('progress_chart'))}},
	quiz_chart_columns:{get:function(){return this.quiz_chart.element(by.tagName('svg')).all(by.tagName('g'))}},
	quiz_title:{get:function(){return this.field.element(by.className('inner_title')).getText()}},
	show_inclass_box:{get:function(){return this.field.element(by.className('show_inclass'))}},
	show_inclass_click:{value:function(){return this.show_inclass_box.click()}},
	getModuleChartValueAt:{value:function(column){
		this.quiz_chart_columns.first().element(by.tagName('g')).all(by.tagName('g')).get(1).all(by.tagName('rect')).get(column-1).click()
		return this.quiz_chart_columns.last().all(by.tagName('text')).last().getText()
	}}
})

var Discussion = function(elem){
	this.field = elem
}

Discussion.prototype = Object.create({}, {
	discussion_title:{get:function(){return this.field.element(by.className('inner_title')).getText()}},
	discussion_student_name:{get:function(){return this.field.element(by.className('disc_screen_name')).getText()}},
	discussion_student_content:{get:function(){return this.field.element(by.className('disc_content')).getText()}},
	discussion_student_likes:{get:function(){return this.field.element(by.className('disc_votes_count')).getText()}},
	discussion_student_flags:{get:function(){return this.field.element(by.className('disc_flags_count')).getText()}},
	discussion_student_public:{get:function(){return this.field.element(by.className('public_img '))}},
	discussion_student_private:{get:function(){return this.field.element(by.className('private_img '))}},
	show_inclass_box:{get:function(){return this.field.element(by.className('show_inclass'))}},
	show_inclass_click:{value:function(){return this.show_inclass_box.click()}},
	reply_button:{get:function(){return this.field.element(by.css('[ng-click="discussion.post.show_feedback = true"]'))}},
	reply_text_area:{get:function(){return this.field.element(by.css('[ng-model="discussion.post.temp_response"]'))}},
	reply_text_box:{get:function(){return this.field.element(by.css('[ng-click="sendComment(discussion.post);discussion.post.show_feedback = false"]'))}},
	delete_button:{get:function(){return this.field.element(by.css('[ng-click="deletePost(item.data, $index)"]'))}},
	delete_discussion:{value:function(){return this.delete_button.click()}},
	reply:{value:function(keys){
		this.reply_button.click()
		this.reply_text_area.clear().sendKeys(keys)
		this.reply_text_box.click()
	}},
	comments_count:{value:function(){
		return this.field.all(by.css('[ng-repeat="comment in discussion.post.comments"]')).count()
	 }}
})

var Freetextquestion = function(elem){
	this.field = elem
}
Freetextquestion.prototype = Object.create({}, {
	title:{get:function(){return this.field.element(by.className('inner_title')).getText()}},
	answers:{get:function(){return this.field.all(by.repeater('answer in item.data.answers|filter:{user_id:quiz.filtered_user}:quiz.filter_strict'))}},
	answer:{value:function(val){return this.answers.get(val-1).element(by.css('[style="width: 70%;"]')).getText()}},
	clickonRelated:{value:function(val){return this.answers.get(val-1).element(by.css('[ng-click="quiz.filtered_user = answer.user_id;quiz.filter_strict=true"]')).click()}},
	grade:{value:function(val){return this.answers.get(val-1).element(by.className('editable-click')).getText()}},
	grade_change:{value:function(val,num){
		this.answers.get(val-1).element(by.className('editable-click')).click();
		this.answers.get(val-1).all(by.tagName('option')).get(num-1).click()
	}},
	show_inclass_box:{get:function(){return this.field.element(by.className('show_inclass'))}},
	show_inclass_click:{value:function(){return this.show_inclass_box.click()}},
	answers_count:{value:function(){
		return this.field.all(by.repeater('answer in item.data.answers|filter:{user_id:quiz.filtered_user}:quiz.filter_strict')).count()
	}},
	reply_button:{get:function(){return this.field.element(by.css('[ng-click="answer.show_feedback = true"]'))}},
	reply_text_area:{get:function(){return this.field.element(by.css('[ng-model="answer.temp_response"]'))}},
	reply_text_box:{get:function(){return this.field.element(by.css('[ng-click="sendFeedback(answer);answer.show_feedback = false"]'))}},
	delete_button:{get:function(){return this.field.element(by.css('[ng-click="deleteFeedback(answer)"]'))}},
	delete_reply:{value:function(){return this.delete_button.click()}},
	reply:{value:function(keys){
		this.reply_button.click()
		this.reply_text_area.clear().sendKeys(keys)
		this.reply_text_box.click()
	}},
	comments_count:{value:function(){
		return this.field.all(by.css('[ng-repeat="comment in discussion.post.comments"]')).count()
	 }}
})

var ModuleItem = function(elem){
	this.field = elem
}

ModuleItem.prototype = Object.create({}, {
	items:{get:function(){ return this.field.all(by.className('ul_item'))}},
	title:{get:function(){return this.field.element(by.className("title")).getText()}},
	// lecture
	quizzes:{get:function(){return this.field.all(by.className('color-green'))}},
	quiz:{value:function(val){return new Quiz(this.quizzes.get(val-1)) }},
	discussions:{get:function(){return this.field.all(by.className('color-coral'))}},
	discussion:{value:function(val){return new Discussion(this.discussions.get(val-1)) }},
	// quiz  and survey
	question_quizzes:{get:function(){return this.field.all(by.className('color-blue'))}},
	question_quiz:{value:function(val){return new Quiz(this.question_quizzes.get(val-1)) }},
	freetextquestions:{get:function(){return this.field.all(by.className('color-coral'))}},
	freetextquestion:{value:function(val){return new Freetextquestion(this.freetextquestions.get(val-1)) }},
	makevisible:{value:function(){this.field.element(by.css('[ng-click="makeSurveyVisible(quiz, true)"]')).click()}},
	hidevisible:{value:function(){this.field.element(by.css('[ng-click="makeSurveyVisible(quiz, false)"]')).click()}},
	suveryresults:{get:function(){return element(by.css('[ng-if="current_survey.visible"]'))}},
	clickonSeeall:{value:function(val){return this.field.element(by.css('[ng-show="quiz.filtered_user"]')).click()}},
	// questiongrade:{value:function(val){return element.all(by.repeater("question in quiz.questions")).get(val-1).element(by.className('right')).getText()}}

})

var Student = function(elem){
	this.field = elem
}

Student.prototype = Object.create({}, {
	name:{get:function(){return this.field.element(by.css('[bo-text="student.full_name"]')).getText()}},
	email:{get:function(){return this.field.element(by.css('[bo-text="student.full_name"]')).getAttribute('tooltip')}},
	columns_count:{value:function(){return this.field.all(by.className("state")).count() }},
	column_item:{value:function(val){return this.field.all(by.className("state")).get(val-1).element(by.tagName('img')).getAttribute('src') }},
	column_item_tooltip:{value:function(val){return this.field.all(by.className("state")).get(val-1).element(by.tagName('img')).getAttribute('tooltip') }},
	column_item_click:{value:function(val,num){
		this.field.all(by.className("state")).get(val-1).element(by.tagName('img')).click()
		element(by.className('popover')).all(by.className('ng-pristine')).get(num-1).click()
		this.field.all(by.className("state")).get(val-1).element(by.tagName('img')).click()
	}},
})


var ModuleCompletionTable = function(elem){
	this.field = elem
}

ModuleCompletionTable.prototype = Object.create({}, {
	students:{get:function(){return this.field.all(by.repeater("student in students")) }},
	students_count:{value:function(){return this.field.all(by.repeater("student in students")).count() }},
	student:{value:function(val){return new Student(this.students.get(val-1)) }},
})



var Graphstudent = function(elem){
	this.field = elem
}

Graphstudent.prototype = Object.create({}, {
		name:{get:function(){return this.field.all(by.tagName('td')).get(0).getInnerHtml()}},
		quiz:{get:function(){return this.field.all(by.tagName('td')).get(1).getInnerHtml()}},
		video:{get:function(){return this.field.all(by.tagName('td')).get(2).getInnerHtml()}},
})


var ModuleGraphTable = function(elem){
	this.field = elem
}

ModuleGraphTable.prototype = Object.create({}, {
	students:{get:function(){return this.field.all(by.tagName("tr")) }},
	students_count:{value:function(){return this.field.all(by.tagName("tr")).count() }},
	student:{value:function(val){return new Graphstudent(this.students.get(val-1)) }},
})


var ModuleProgress = function () {};

ModuleProgress.prototype = Object.create({}, {
	module_chart:{get:function(){return element(by.className('progress_chart'))}},
	module_chart_columns:{get:function(){return this.module_chart.element(by.tagName('svg')).all(by.tagName('g'))}},
	module_items:{get:function(){return element.all(by.repeater('module_item in module.items'))}},
	module_item:{value:function(value){return new ModuleItem(this.module_items.get(value-1))}},
	module_item_inclass:{value:function(value){return this.module_item(value).all(by.className("show_inclass")) }},
	time_estimate:{get:function(){return element(by.className('time_estimate'))}},
	time_estimate_total_time:{get:function(){return this.time_estimate.element(by.css('[ng-style="{color: total_estimate_color}"]')).getText()}},
	module_completion_table:{get:function(){return element(by.className('table_matrix_height'))}},
	module_completion:{value:function(){return new ModuleCompletionTable(this.module_completion_table)}},
	module_graph_table:{get:function(){return element(by.tagName('tbody'))}},
	// module_graph_table:{get:function(){return element(by.css('[on-ready="loading_total_charts=false"]')).element(by.tagName("table"))}},
	module_graph:{value:function(){return new ModuleGraphTable(this.module_graph_table)}},

	check_module_finished:{value:function(val){return element.all(by.css('[ng-show="module_done"]')).get(val-1).getAttribute('class')}},
	getModuleChartValueAt:{value:function(column){
		this.module_chart_columns.first().element(by.tagName('g')).all(by.tagName('g')).get(1).all(by.tagName('rect')).get(column-1).click()
		return this.module_chart_columns.last().all(by.tagName('text')).last().getText()
	}},
	// getGraphChartValueAt:{value:function(column){
	// 	element(by.tagName('svg')).all(by.tagName('g')).first().element(by.tagName('g')).all(by.tagName('g')).get(1).all(by.tagName('rect')).get(column-1).click()
	// 	return element(by.tagName('svg')).all(by.tagName('g')).last().all(by.tagName('text')).last().getText()
	// }}
});

module.exports = ModuleProgress;
