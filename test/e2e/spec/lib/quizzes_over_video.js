// var ptor = protractor.getInstance();
// var locator = require('./locators');
// var o_c = require('./openers_and_clickers');
// var lecture_middle = require('./lecture_quizzes_management');
// var params = ptor.params;

exports.create_mcq_quiz = function(ptor){
	teacher.open_content_new_in_video_ques(ptor);
	locator.by_id(ptor, "mcq").then(function(link){
		link.click().then(function(){
			o_c.feedback(ptor, "Quiz was successfully created");
			expect(locator.by_id(ptor, 'editing').isDisplayed()).toEqual(true);
		})
	})
}

exports.make_mcq_questions = function(ptor, q1_x, q1_y, q2_x, q2_y, q3_x, q3_y){
	locator.by_id(ptor,'ontop').then(function(ontop){
		ontop.getSize().then(function(size){
			ontop_w = size.width;
			ontop_h = size.height;

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
			element(by.buttonText('Save')).then(function(btn){
				btn.click().then(function(){
					o_c.feedback(ptor, 'Quiz was successfully saved');
				})
			})
		})
	})
}



exports.create_ocq_quiz = function(ptor){
	teacher.open_content_new_in_video_ques(ptor);
	locator.by_id(ptor, "ocq").then(function(link){
		link.click().then(function(){
			o_c.feedback(ptor, "Quiz was successfully created");
			expect(locator.by_id(ptor, 'editing').isDisplayed()).toEqual(true);
		})
	})
}

exports.make_ocq_questions = function(ptor, q1_x, q1_y, q2_x, q2_y, q3_x, q3_y){
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
		element(by.buttonText('Save')).then(function(btn){
			btn.click().then(function(){
				o_c.feedback(ptor, 'Quiz was successfully saved');
			})
		})
	})
}



exports.create_drag_quiz = function(ptor){
	teacher.open_content_new_in_video_ques(ptor);
	locator.by_id(ptor, "drag").then(function(link){
		link.click().then(function(){
			o_c.feedback(ptor, "Quiz was successfully created");
			expect(locator.by_id(ptor, 'editing').isDisplayed()).toEqual(true);
		})
	})
}

exports.make_drag_questions = function(ptor, q1_x, q1_y, q2_x, q2_y, q3_x, q3_y){
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
		element(by.buttonText('Save')).then(function(btn){
			btn.click().then(function(){
				o_c.feedback(ptor, 'Quiz was successfully saved');
			})
		})
	})
}