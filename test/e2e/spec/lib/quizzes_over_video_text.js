var ptor = protractor.getInstance();
var locator = require('./locators');
var o_c = require('./openers_and_clickers');
var lecture_middle = require('./lecture_quizzes_management');
var params = ptor.params;

exports.create_mcq_quiz = function(ptor, feedback, wait_for){
	locator.s_by_classname(ptor, 'btn-group').then(function(btns){
		btns[1].click().then(function(){
			btns[1].findElements(protractor.By.repeater('item in list')).then(function(items){
				if(wait_for > 0){
					ptor.sleep(wait_for)
				}
				items[0].click().then(function(){
				    feedback(ptor, "Quiz was successfully created");
					expect(locator.by_id(ptor, 'editing').isDisplayed()).toEqual(true);
				})
			})
		})
	})
}

exports.make_mcq_questions = function(ptor, feedback){
	locator.by_id(ptor,'ontop').then(function(ontop){
		ontop.findElements(protractor.By.repeater('answer in quiz.answers')).then(function(ques){
			ques[0].findElements(protractor.By.tagName('input')).then(function(ins){
				ins[0].sendKeys("answer 1");
				ins[1].click();
			})
		})

		locator.by_classname(ptor, 'add_multiple_answer').click();

		ontop.findElements(protractor.By.repeater('answer in quiz.answers')).then(function(ques){
			ques[1].findElements(protractor.By.tagName('input')).then(function(ins){
				ins[0].sendKeys("answer 2");
			})
		})

		locator.by_classname(ptor, 'add_multiple_answer').click();

		ontop.findElements(protractor.By.repeater('answer in quiz.answers')).then(function(ques){
			ques[2].findElements(protractor.By.tagName('input')).then(function(ins){
				ins[0].sendKeys("answer 3");
				ins[1].click();
			})
		})
		ptor.sleep(2000);
		o_c.scroll(ptor, 1000);
		locator.by_id(ptor, 'done').then(function(btn){
			btn.click().then(function(){
				feedback(ptor, 'Quiz was successfully saved');
			})
		})
	})
}

exports.create_ocq_quiz = function(ptor, feedback, wait_for){
	locator.s_by_classname(ptor, 'btn-group').then(function(btns){
		btns[1].click().then(function(){
			o_c.scroll(ptor, 1000);
			btns[1].findElements(protractor.By.repeater('item in list')).then(function(items){
				if(wait_for > 0){
					ptor.sleep(wait_for)
				}
				items[1].click().then(function(){
				    feedback(ptor, "Quiz was successfully created");
					expect(locator.by_id(ptor, 'editing').isDisplayed()).toEqual(true);
				})
			})
			o_c.scroll(ptor, -1000);
		})
	})
}

exports.make_ocq_questions = function(ptor, feedback){
	locator.by_id(ptor,'ontop').then(function(ontop){
		ontop.findElements(protractor.By.repeater('answer in quiz.answers')).then(function(ques){
			ques[0].findElements(protractor.By.tagName('input')).then(function(ins){
				ins[0].sendKeys("answer 1");
				ins[1].click();
			})
		})

		locator.by_classname(ptor, 'add_multiple_answer').click();

		ontop.findElements(protractor.By.repeater('answer in quiz.answers')).then(function(ques){
			ques[1].findElements(protractor.By.tagName('input')).then(function(ins){
				ins[0].sendKeys("answer 2");
			})
		})

		locator.by_classname(ptor, 'add_multiple_answer').click();

		ontop.findElements(protractor.By.repeater('answer in quiz.answers')).then(function(ques){
			ques[2].findElements(protractor.By.tagName('input')).then(function(ins){
				ins[0].sendKeys("answer 3");
			})
		})
		ptor.sleep(2000);
		o_c.scroll(ptor, 1000);
		locator.by_id(ptor, 'done').then(function(btn){
			btn.click().then(function(){
				feedback(ptor, 'Quiz was successfully saved');
			})
		})
	})
}


exports.create_drag_quiz = function(ptor, feedback, wait_for){
	locator.s_by_classname(ptor, 'btn-group').then(function(btns){
		btns[1].click().then(function(){
			o_c.scroll(ptor, 1000);
			btns[1].findElements(protractor.By.repeater('item in list')).then(function(items){
				if(wait_for > 0){
					ptor.sleep(wait_for)
				}
				items[2].click().then(function(){
				    feedback(ptor, "Quiz was successfully created");
					expect(locator.by_id(ptor, 'editing').isDisplayed()).toEqual(true);
				})
			})
			o_c.scroll(ptor, -1000);
		})
	})
}


exports.make_drag_questions = function(ptor, feedback){
	locator.by_id(ptor,'ontop').then(function(ontop){
		ontop.findElements(protractor.By.repeater('answer in quiz.answers')).then(function(ques){
			ques[0].findElements(protractor.By.tagName('input')).then(function(ins){
				ins[0].sendKeys("answer 1");
			})
		})

		locator.by_classname(ptor, 'add_multiple_answer').click();

		ontop.findElements(protractor.By.repeater('answer in quiz.answers')).then(function(ques){
			ques[1].findElements(protractor.By.tagName('input')).then(function(ins){
				ins[0].sendKeys("answer 2");
			})
		})

		locator.by_classname(ptor, 'add_multiple_answer').click();

		ontop.findElements(protractor.By.repeater('answer in quiz.answers')).then(function(ques){
			ques[2].findElements(protractor.By.tagName('input')).then(function(ins){
				ins[0].sendKeys("answer 3");
			})
		})
		ptor.sleep(2000);
		o_c.scroll(ptor, 1000);
		locator.by_id(ptor, 'done').then(function(btn){
			btn.click().then(function(){
				feedback(ptor, 'Quiz was successfully saved');
			})
		})
	})
}



