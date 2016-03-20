var ModuleItem = function(elem){
	this.field = elem
}

ModuleItem.prototype = Object.create({}, {
	items:{get:function(){ return this.field.all(by.className('ul_item'))}},
	title:{get:function(){return this.field.element(by.className("title")).getText()}},
	quizzes:{get:function(){return this.field.all(by.className('color-green'))}},
	quiz:{value:function(val){return this.quizzes.get(val-1)}},
	quiz_title:{value:function(val){return this.quiz(val).element(by.className('inner_title')).getText()}},
})

var ModuleProgress = function () {};

ModuleProgress.prototype = Object.create({}, {
	module_chart:{get:function(){return element(by.className('progress_chart'))}},
	module_chart_columns:{get:function(){return this.module_chart.element(by.tagName('svg')).all(by.tagName('g'))}},
	module_items:{get:function(){return element.all(by.repeater('module_item in module.items'))}},
	module_item:{value:function(value){return new ModuleItem(this.module_items.get(value-1))}},
	getModuleChartValueAt:{value:function(column){
		this.module_chart_columns.first().element(by.tagName('g')).all(by.tagName('g')).get(1).all(by.tagName('rect')).get(column-1).click()
		return this.module_chart_columns.last().all(by.tagName('text')).last().getText()
	}}
});

module.exports = ModuleProgress;