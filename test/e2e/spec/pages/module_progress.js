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
	// module_chart:{get:function(){return this.field.element(by.className('progress_chart'))}},
	// module_chart_columns:{get:function(){return this.module_chart.element(by.tagName('svg')).all(by.tagName('g'))}},
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
	 }}//,
	// replies_count:{value:function(){
	// 	return this.field.all(by.className("comment_screen_name")).count() 
	// }}

	// getModuleChartValueAt:{value:function(column){
	// 	this.module_chart_columns.first().element(by.tagName('g')).all(by.tagName('g')).get(1).all(by.tagName('rect')).get(column-1).click()
	// 	return this.module_chart_columns.last().all(by.tagName('text')).last().getText()
	// }}
})



var ModuleItem = function(elem){
	this.field = elem
}

ModuleItem.prototype = Object.create({}, {
	items:{get:function(){ return this.field.all(by.className('ul_item'))}},
	title:{get:function(){return this.field.element(by.className("title")).getText()}},
	quizzes:{get:function(){return this.field.all(by.className('color-green'))}},
	quiz:{value:function(val){return new Quiz(this.quizzes.get(val-1)) }},
	discussions:{get:function(){return this.field.all(by.className('color-coral'))}},
	discussion:{value:function(val){return new Discussion(this.discussions.get(val-1)) }},
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
	// column_item_click:{value:function(val,num){ 
	// 	this.field.all(by.className("state")).get(val-1).element(by.tagName('img')).click()
	// 	return element(by.className('popover')).all(by.className('ng-pristine')).count() 
	// }},


})


var ModuleTable = function(elem){
	this.field = elem
}

ModuleTable.prototype = Object.create({}, {
	students:{get:function(){return this.field.all(by.repeater("student in students")) }},
	students_count:{value:function(){return this.field.all(by.repeater("student in students")).count() }},
	student:{value:function(val){return new Student(this.students.get(val-1)) }}
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
	module_completion:{value:function(){return new ModuleTable(this.module_completion_table)}},	
	check_module_finished:{value:function(val){return element.all(by.css('[ng-show="module_done"]')).get(val-1).getAttribute('class')}},
	getModuleChartValueAt:{value:function(column){
		this.module_chart_columns.first().element(by.tagName('g')).all(by.tagName('g')).get(1).all(by.tagName('rect')).get(column-1).click()
		return this.module_chart_columns.last().all(by.tagName('text')).last().getText()
	}}
});

module.exports = ModuleProgress;