var youtube = require('./lib/youtube');
var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');

var ptor = protractor.getInstance();
var params = ptor.params
ptor.driver.manage().window().maximize();

describe("scen 1 >> ", function(){
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
	    o_c.open_item(ptor, 3);
	})

	it('should seek to 50% ocq_quiz',function(){
		youtube.seek(ptor, 50);
		ptor.sleep(3000);
	})

	it('should expect a quiz',function(){
		expect_quiz(ptor);
	})

	it('should check the number of choises',function(){
		check_ocq_no(ptor, 4)
	})

	it('should answer correctly',function(){
		check_answer_given_answer_order(ptor, 3)
	})

	it('should press answer button',function(){
		answer(ptor);
	})

	it('should check feedback',function(){
		check_popover(ptor);
	})
	it('should not have incorrect popover', function(){
		expect_popover_on_hover_not_incorrect(ptor);
	})
});

describe("scen 2 >> ", function(){
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
	    o_c.open_item(ptor, 3);
	})

	it('should seek to 50% ocq_quiz',function(){
		youtube.seek(ptor, 50);
		ptor.sleep(3000)
	})

	it('should expect a quiz',function(){
		expect_quiz(ptor);
	})

	it('should check the number of choises',function(){
		check_ocq_no(ptor, 4)
	})

	it('should make sure only one answer is checkable',function(){
		check_answer_given_answer_order(ptor, 2)
		is_checked(ptor, 2);
		is_not_checked(ptor, 3)
		check_answer_given_answer_order(ptor, 3)
		is_not_checked(ptor, 2);
		is_checked(ptor, 3)
	})
});

describe("mcq over video survey", function(){
	it('should sign in', function(){
        o_c.home(ptor)
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
	    o_c.open_item(ptor, 3);
	})

	it('should seek to 80%',function(){
		youtube.seek(ptor, 80);
		ptor.sleep(3000)
	})

	it('should expect a quiz',function(){
		expect_quiz(ptor);
	})

	it('should check the number of choises',function(){
		check_mcq_no(ptor, 3)
	})

	it('should answer correctly',function(){
		check_answer_given_answer_order(ptor, 1);
		check_answer_given_answer_order(ptor, 3)
	})

	it('should press answer button',function(){
		answer(ptor);
	})

	it('should check feedback',function(){
		check_popover(ptor);
	})
	it('should not have incorrect popover', function(){
		expect_popover_on_hover_not_incorrect(ptor);
	})
})
//====================================================
//====================================================
//====================================================

function check_ocq_no(ptor, no){
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

function check_popover(ptor){
	locator.by_xpath(ptor,'//*[@id="main-video-container"]/form/notification/div/div[2]').then(function(popover){
		expect(popover.getText()).toContain('Thank you');
	})
}

function is_checked(ptor, no){
	locator.by_id(ptor,'ontop').findElements(protractor.By.tagName('input')).then(function(check_boxes){
		check_boxes[no-1].getAttribute('checked').then(function(ch){
			expect(ch).toEqual("true");
		})
	})
}

function is_not_checked(ptor, no){
	locator.by_id(ptor,'ontop').findElements(protractor.By.tagName('input')).then(function(check_boxes){
		check_boxes[no-1].getAttribute('checked').then(function(ch){
			expect(ch).toEqual(null);
		})
	})
}

function check_mcq_no(ptor, no){
	locator.by_id(ptor,'ontop').findElements(protractor.By.tagName('input')).then(function(check_boxes){
		expect(check_boxes.length).toEqual(no);
	})
}

function check_answer_given_answer_order(ptor, choice_no){
	locator.by_id(ptor,'ontop').findElements(protractor.By.tagName('input')).then(function(check_boxes){
		check_boxes[choice_no-1].click();
	})
}


function expect_popover_on_hover_not_incorrect(ptor){
	locator.by_id(ptor,'ontop').findElements(protractor.By.tagName('input')).then(function(check_boxes){
		for (var i = 0; i < check_boxes.length; i++) {
			ptor.actions().mouseMove(check_boxes[i]).perform();
			ptor.actions().mouseMove({x: 5, y: 5}).perform();
			locator.by_classname(ptor, 'popover-title').then(function(popover){
				expect(popover.getText()).not.toContain("Incorrect");
			})
		};
	})
}