var SharedItem = function(elem){
	this.field = elem
};

SharedItem.prototype = Object.create({}, {
	courses:{get:function(){return this.field.element(by.model('selected_course')).all(by.tagName('option'))}},
	modules:{get:function(){return this.field.element(by.model('selected_module')).all(by.tagName('option'))}},
	add_button:{get:function(){return this.field.element(by.buttonText('Copy'))}},
	select_course:{value:function(num){this.courses.get(num).click()}},
	select_module:{value:function(num){this.modules.get(num).click()}},
	add:{value:function(){this.add_button.click()}}
})

var SharePage = function () {};

SharePage.prototype = Object.create({}, {
	modules:{get:function(){return element.all(by.repeater('module in item.modules'))}},
	items:{get:function(){return element.all(by.repeater('child in module.items'))}},
	lectures:{get:function(){return element.all(by.repeater('lecture in item.lectures'))}},
	quizzes:{get:function(){return element.all(by.repeater('quiz in item.quizzes'))}},
	module:{value:function(num){return new SharedItem(this.modules.get(num-1))}},
	lecture:{value:function(num){return new SharedItem(this.lectures.get(num-1))}},
	quiz:{value:function(num){return new SharedItem(this.quizzes.get(num-1))}},
})
module.exports = SharePage;