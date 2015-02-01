// var ptor = protractor.getInstance();
// var locator = require('./locators');
// var o_c = require('./openers_and_clickers');
// var params = ptor.params;

exports.rename_quiz = function(ptor, quiz_no, name){
	locator.by_classname(ptor, 'quiz_list').then(function(list){
		list.findElements(protractor.By.tagName('editable_text')).then(function(quizzes){
			// ptor.actions().mouseMove(quizzes[quiz_no-1]).perform().then(function(){
				quizzes[quiz_no-1].findElement(protractor.By.className('icon-pencil')).then(function(edit_button){
					ptor.executeScript('arguments[0].click()', edit_button).then(function(){
						locator.by_classname(ptor, 'editable-input').then(function(field){
							field.sendKeys(name).then(function(){
								locator.by_classname(ptor, 'icon-ok').then(function(confirm){
									confirm.click().then(function(){
										o_c.feedback(ptor, 'successfully updated')
									})
								})
							})
						})
					})	
				})
			// });
		})
	})
}

exports.save_quiz = function(ptor, feedback){
	locator.by_id(ptor, 'done').click().then(function(){
		feedback(ptor, 'Quiz was successfully saved');
	})
}

exports.exit_quiz = function(ptor, feedback){
	locator.s_by_id(ptor, 'done').then(function(buttons){
		buttons[1].click().then(function(){
			feedback(ptor, 'Quiz was successfully saved');
		});
	})
}