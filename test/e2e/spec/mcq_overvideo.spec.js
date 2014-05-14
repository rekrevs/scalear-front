var youtube = require('./lib/youtube');
var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');

var ptor = protractor.getInstance();
var params = ptor.params
ptor.driver.manage().window().maximize();

describe("scen 1", function(){
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
	    o_c.open_item(ptor, 1);
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
		check_answer_given_answer_order(ptor, 1);
		check_answer_given_answer_order(ptor, 2);
	})

	it('should press answer button',function(){
		answer(ptor);
	})

	it('should check if the answer is correct',function(){
		check_answer_correct(ptor);
	})
	it('should check every choise popover', function(){
		expect_popover_on_hover_correct(ptor, 1);
		expect_popover_on_hover_correct(ptor, 2);
	})
})

describe("scen 2", function(){
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
	    o_c.open_item(ptor, 1);
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

	it('should answer incorrectly',function(){
		check_answer_given_answer_order(ptor, 3)
	})

	it('should press answer button',function(){
		answer(ptor);
	})

	it('should check if the answer is incorrect',function(){
		check_answer_incorrect(ptor);
	})

	it('should check every choise popover', function(){
		expect_popover_on_hover_incorrect(ptor, 3);
	})
})

//====================================================
//====================================================
//====================================================

