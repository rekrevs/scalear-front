var ptor = protractor.getInstance();
var locator = require('./locators');
var o_c = require('./openers_and_clickers');
var lecture_middle = require('./lecture_quizzes_management');
var params = ptor.params;

exports.create_mcq_quiz = function(ptor, feedback, wait_for){
	locator.s_by_classname(ptor, 'btn-group').then(function(btns){
		btns[0].click().then(function(){
			o_c.scroll(ptor, 1000)
			btns[0].findElements(protractor.By.repeater('item in list')).then(function(items){
				if(wait_for > 0){
					ptor.sleep(wait_for)
				}
				items[0].click().then(function(){
				    feedback(ptor, "Quiz was successfully created");
				    o_c.scroll(ptor, -1000)
					expect(locator.by_id(ptor, 'editing').isDisplayed()).toEqual(true);
				})
			})
		})
	})
}

exports.make_mcq_questions = function(ptor, q1_x, q1_y, q2_x, q2_y, q3_x, q3_y, feedback){
	locator.by_id(ptor,'ontop').then(function(ontop){
		ptor.actions().mouseMove(ontop).perform();
		ptor.actions().mouseMove({x: q1_x, y: q1_y}).perform();
		ptor.actions().doubleClick().perform();
		ptor.actions().click().perform();
		locator.by_classname(ptor, 'must_save_check').click();

		ptor.actions().mouseMove(ontop).perform();
		ptor.actions().mouseMove({x: 5, y: 5}).perform();
		ptor.actions().click().perform();

		ptor.actions().mouseMove(ontop).perform();
		ptor.actions().mouseMove({x: q2_x, y: q2_y}).perform();
		ptor.actions().doubleClick().perform();

		ptor.actions().mouseMove(ontop).perform();
		ptor.actions().mouseMove({x: 5, y: 5}).perform();
		ptor.actions().click().perform();

		ptor.actions().mouseMove(ontop).perform();
		ptor.actions().mouseMove({x: q3_x, y: q3_y}).perform();
		ptor.actions().doubleClick().perform();
		ptor.actions().click().perform();
		locator.by_classname(ptor, 'must_save_check').click();
		ptor.sleep(2000);
		o_c.scroll(ptor, 1000);
		lecture_middle.save_quiz(ptor, feedback)
	})
}



exports.create_ocq_quiz = function(ptor, feedback, wait_for){
	locator.s_by_classname(ptor, 'btn-group').then(function(btns){
		btns[0].click().then(function(){
			o_c.scroll(ptor, 1000);
			btns[0].findElements(protractor.By.repeater('item in list')).then(function(items){
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

exports.make_ocq_questions = function(ptor, q1_x, q1_y, q2_x, q2_y, q3_x, q3_y, feedback){
	locator.by_id(ptor,'ontop').then(function(ontop){
		ptor.actions().mouseMove(ontop).perform();
		ptor.actions().mouseMove({x: q1_x, y: q1_y}).perform();
		ptor.actions().doubleClick().perform();
		
		ptor.actions().mouseMove(ontop).perform();
		ptor.actions().mouseMove({x: 5, y: 5}).perform();
		ptor.actions().click().perform();

		ptor.actions().mouseMove(ontop).perform();
		ptor.actions().mouseMove({x: q2_x, y: q2_y}).perform();
		ptor.actions().doubleClick().perform();
		ptor.actions().click().perform();
		locator.by_classname(ptor, 'must_save_check').click();

		ptor.actions().mouseMove(ontop).perform();
		ptor.actions().mouseMove({x: 5, y: 5}).perform();
		ptor.actions().click().perform();

		ptor.actions().mouseMove(ontop).perform();
		ptor.actions().mouseMove({x: q3_x, y: q3_y}).perform();
		ptor.actions().doubleClick().perform();

		ptor.sleep(2000);
		o_c.scroll(ptor, 1000);
		lecture_middle.save_quiz(ptor, feedback)
	})
}



exports.create_drag_quiz = function(ptor, feedback, wait_for){
	locator.s_by_classname(ptor, 'btn-group').then(function(btns){
		btns[0].click().then(function(){
			o_c.scroll(ptor, 1000);
			btns[0].findElements(protractor.By.repeater('item in list')).then(function(items){
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

exports.make_drag_questions = function(ptor, q1_x, q1_y, q2_x, q2_y, q3_x, q3_y, feedback){
	locator.by_id(ptor,'ontop').then(function(ontop){
		ptor.actions().mouseMove(ontop).perform();
		ptor.actions().mouseMove({x: q1_x, y: q1_y}).perform();
		ptor.actions().doubleClick().perform();

		ptor.actions().mouseMove(ontop).perform();
		ptor.actions().mouseMove({x: q2_x, y: q2_y}).perform();
		ptor.actions().doubleClick().perform();

		ptor.actions().mouseMove(ontop).perform();
		ptor.actions().mouseMove({x: q3_x, y: q3_y}).perform();
		ptor.actions().doubleClick().perform();

		ptor.sleep(2000);
		o_c.scroll(ptor, 1000);
		lecture_middle.save_quiz(ptor, feedback)
	})
}