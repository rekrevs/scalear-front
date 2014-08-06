var ptor = protractor.getInstance();
var locator = require('./locators');
var o_c = require('./openers_and_clickers');
var lecture_middle = require('./lecture_quizzes_management');
var params = ptor.params;

exports.create_mcq_quiz = function(ptor){
	teacher.open_content_new_in_video_ques(ptor);
	locator.by_id(ptor, "mcq_text").then(function(link){
		link.click().then(function(){
			o_c.feedback(ptor, "Quiz was successfully created");
			expect(locator.by_id(ptor, 'editing').isDisplayed()).toEqual(true);
		})
	})
}

exports.make_mcq_questions = function(ptor){
	locator.by_id(ptor,'ontop').then(function(ontop){
		ontop.findElement(protractor.By.partialLinkText('Add Answer')).click();
		ontop.findElement(protractor.By.partialLinkText('Add Answer')).click();

		ontop.findElements(protractor.By.name('answer')).then(function(answer){
			answer[0].sendKeys("answer 1");
			answer[1].sendKeys("answer 2");
			answer[2].sendKeys("answer 3");
		})
		ontop.findElements(protractor.By.name('mcq')).then(function(check){
			check[0].click();
			check[2].click();

		})
		ptor.sleep(2000);
		o_c.scroll(ptor, 1000);
		element(by.buttonText('Save')).then(function(btn){
			btn.click().then(function(){
				o_c.feedback(ptor, 'Quiz was successfully saved');
			})
		})
	})
}

exports.create_ocq_quiz = function(ptor){
	teacher.open_content_new_in_video_ques(ptor);
	locator.by_id(ptor, "ocq_text").then(function(link){
		link.click().then(function(){
			o_c.feedback(ptor, "Quiz was successfully created");
			expect(locator.by_id(ptor, 'editing').isDisplayed()).toEqual(true);
		})
	})
}

exports.make_ocq_questions = function(ptor){
	locator.by_id(ptor,'ontop').then(function(ontop){
		ontop.findElement(protractor.By.partialLinkText('Add Answer')).click();
		ontop.findElement(protractor.By.partialLinkText('Add Answer')).click();

		ontop.findElements(protractor.By.name('answer')).then(function(answer){
			answer[0].sendKeys("answer 1");
			answer[1].sendKeys("answer 2");
			answer[2].sendKeys("answer 3");
		})
		ontop.findElements(protractor.By.id('radio_correct')).then(function(check){
			check[1].click();
		})
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
	locator.by_id(ptor, "drag_text").then(function(link){
		link.click().then(function(){
			o_c.feedback(ptor, "Quiz was successfully created");
			expect(locator.by_id(ptor, 'editing').isDisplayed()).toEqual(true);
		})
	})
}


exports.make_drag_questions = function(ptor){
	locator.by_id(ptor,'ontop').then(function(ontop){
		ontop.findElement(protractor.By.partialLinkText('Add Answer')).click();
		ontop.findElement(protractor.By.partialLinkText('Add Answer')).click();

		ontop.findElements(protractor.By.name('answer')).then(function(answer){
			answer[0].sendKeys("answer 1");
			answer[1].sendKeys("answer 2");
			answer[2].sendKeys("answer 3");
		})
		ptor.sleep(2000);
		o_c.scroll(ptor, 1000);
		element(by.buttonText('Save')).then(function(btn){
			btn.click().then(function(){
				o_c.feedback(ptor, 'Quiz was successfully saved');
			})
		})
	})
}
