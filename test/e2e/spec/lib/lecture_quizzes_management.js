var ptor = protractor.getInstance();
var locator = require('./locators');
var o_c = require('./openers_and_clickers');
var params = ptor.params;

exports.save_quiz = function(ptor, feedback){
	locator.by_id(ptor, 'done').click().then(function(){
		feedback(ptor, 'Quiz was successfully saved');
	})
}

exports.exit_quiz = function(ptor){
	locator.s_by_id(ptor, 'done').then(function(buttons){
		buttons[1].click().then(function(){
			feedback(ptor, 'Quiz was successfully saved');
		});
	})
}