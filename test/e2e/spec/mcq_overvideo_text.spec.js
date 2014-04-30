var youtube = require('./lib/youtube');
var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');

var ptor = protractor.getInstance();
var params = ptor.params
ptor.driver.manage().window().maximize();

describe("answer correctly", function(){
	it('should sign in', function(){
        o_c.sign_in(ptor, params.mail, params.password, o_c.feedback)
    })

    it('should open course', function(){
    	o_c.open_course_whole(ptor)
    })

    it('should open tray',function(){
		o_c.open_tray(ptor);
	})

	it('should open lecture',function(){
	    o_c.open_lectures(ptor);
	    o_c.open_module(ptor, 1);
	    o_c.open_item(ptor, 2);
	})

	it('should seek to 30%',function(){
		youtube.seek(ptor, 30);
		ptor.sleep(3000)
	})

	it('should expect a quiz',function(){
		expect_quiz(ptor);
	})

	it('should check the number of choises',function(){
		check_mcq_no(ptor, 3)
	})

	it('should answer correctly',function(){
		check_answer_given_answer_order(ptor, 2)
		check_answer_given_answer_order(ptor, 3)
	})

	it('should press answer button',function(){
		answer(ptor);
	})

	it('should check if the answer is correct',function(){
		check_answer_correct(ptor);
	})
	it('should check every choise correctness', function(){
		expect_popover_on_hover_correct(ptor, 2);
		expect_popover_on_hover_correct(ptor, 3);
	})
 })

describe("answer wrong", function(){
	it('should go home', function(){
        o_c.home(ptor);
    })

    it('should open course', function(){
    	o_c.open_course_whole(ptor)
    })

    it('should open tray',function(){
		o_c.open_tray(ptor);
	})

	it('should open lecture',function(){
	    o_c.open_lectures(ptor);
	    o_c.open_module(ptor, 1);
	    o_c.open_item(ptor, 2);
	})

	it('should seek to 30%',function(){
		youtube.seek(ptor, 30);
		ptor.sleep(3000)
	})

	it('should expect a quiz',function(){
		expect_quiz(ptor);
	})

	it('should check the number of choises',function(){
		check_mcq_no(ptor, 3);
	})

	it('should answer incorrectly',function(){
		check_answer_given_answer_order(ptor, 1);
	})

	it('should press answer button',function(){
		answer(ptor);
	})

	it('should check if the answer is incorrect',function(){
		check_answer_incorrect(ptor);
	})
		it('should check every choise correctness', function(){
		expect_popover_on_hover_incorrect(ptor, 1);
	})
})

//====================================================
//====================================================
//====================================================

function check_mcq_no(ptor, no){
	locator.by_id(ptor,'ontop').findElements(protractor.By.tagName('input')).then(function(check_boxes){
		expect(check_boxes.length).toEqual(no);
	})
}

function expect_quiz(ptor){
	locator.by_tag(ptor,'check').findElement(protractor.By.tagName('input')).then(function(check_answer_btn){
		expect(check_answer_btn.isDisplayed()).toEqual(true);
	})
}

function check_answer_given_answer_order(ptor, choice_no){
	locator.by_id(ptor,'ontop').findElements(protractor.By.tagName('input')).then(function(check_boxes){
		check_boxes[choice_no-1].click();
	})
}

function answer(ptor){
	locator.by_tag(ptor,'check').findElement(protractor.By.tagName('input')).then(function(answer_btn){
		answer_btn.click();
	})
}

function check_answer_correct(ptor){
	locator.by_classname(ptor,'popover-content').then(function(popover){
		expect(popover.getText()).toContain('Correct');
	})
}

function check_answer_incorrect(ptor){
	locator.by_classname(ptor,'popover-content').then(function(popover){
		expect(popover.getText()).toContain('Incorrect');
	})
}

function expect_popover_on_hover_correct(ptor, no){
	locator.by_id(ptor,'ontop').findElements(protractor.By.tagName('input')).then(function(check_boxes){
		ptor.actions().mouseMove(check_boxes[no-1]).perform();
		ptor.actions().mouseMove({x: 5, y: 5}).perform();
		locator.by_classname(ptor, 'popover-title').then(function(popover){
			expect(popover.getText()).toContain("Correct");
		})
	})
}

function expect_popover_on_hover_incorrect(ptor, no){
	locator.by_id(ptor,'ontop').findElements(protractor.By.tagName('input')).then(function(check_boxes){
		ptor.actions().mouseMove(check_boxes[no-1]).perform();
		ptor.actions().mouseMove({x: 5, y: 5}).perform();
		locator.by_classname(ptor, 'popover-title').then(function(popover){
			expect(popover.getText()).toContain("Incorrect");
		})
	})
}