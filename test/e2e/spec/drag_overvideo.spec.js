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
	    o_c.open_item(ptor, 1);
	})

	it('should seek to 80%',function(){
		youtube.seek(ptor, 80);
		ptor.sleep(3000)
	})

	it('should expect a quiz',function(){
		expect_quiz(ptor);
	})

	it('should check the number of drags',function(){
		check_drags_no(ptor, 3)
	})

	it('should answer correctly',function(){ 
		answer_drag_correct(ptor);
	})

	it('should press answer button',function(){
		answer(ptor);
		ptor.sleep(3000);
	})

	it('should check if the answer is correct',function(){
		check_answer_correct(ptor);
	})

	it('shouldcheck for popover', function(){
		expect_popover_on_hover_correct(ptor);
	})
})

describe("answer wrong", function(){
	it('go home cause already signed in', function(){
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
		youtube.seek(ptor, 80);
		ptor.sleep(3000)
	})

	it('should expect a quiz',function(){
		expect_quiz(ptor);
	})

	it('should check the number of drags',function(){
		check_drags_no(ptor, 3)
	})

	it('should answer incorrectly',function(){
		answer_drag_incorrect(ptor);
	})

	it('should press answer button',function(){
		answer(ptor);
	})

	it('should check if the answer is incorrect',function(){
		check_answer_incorrect(ptor);
	})

	it('shouldcheck for popover', function(){
		expect_popover_on_hover_incorrect(ptor);
	})
})

//====================================================
//====================================================
//====================================================

 function check_drags_no(ptor, no){
	locator.by_repeater(ptor,'answer in selected_quiz.online_answers').then(function(check_boxes){
		expect(check_boxes.length).toEqual(no);
	})
}

function expect_quiz(ptor){
	locator.by_tag(ptor,'check').findElement(protractor.By.tagName('input')).then(function(check_answer_btn){
		expect(check_answer_btn.isDisplayed()).toEqual(true);
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


function answer_drag_correct(ptor){
	//shuffle answers so all becomes clickable
	locator.s_by_classname(ptor,'dragged').then(function(answer){
			ptor.actions().mouseMove(answer[0]).perform();
			ptor.actions().mouseMove({x: 5, y: 5}).perform();
		 	ptor.actions().mouseDown().perform();
		 	ptor.actions().mouseMove({x: 100, y: 0}).perform();
		 	ptor.actions().mouseUp().perform();
			
			ptor.actions().mouseMove(answer[1]).perform();
			ptor.actions().mouseMove({x: 5, y: 5}).perform();
		 	ptor.actions().mouseDown().perform();
		 	ptor.actions().mouseMove({x: 200, y: 0}).perform();
		 	ptor.actions().mouseUp().perform();

		 	ptor.actions().mouseMove(answer[2]).perform();
			ptor.actions().mouseMove({x: 5, y: 5}).perform();
		 	ptor.actions().mouseDown().perform();
		 	ptor.actions().mouseMove({x: 300, y: 0}).perform();
		 	ptor.actions().mouseUp().perform();
		})
	locator.s_by_classname(ptor, 'ui-droppable').then(function(place){
		locator.s_by_classname(ptor,'dragged').then(function(answer){
			answer[0].getText().then(function (text){
				ptor.actions().mouseMove(answer[0]).perform();
				ptor.actions().mouseMove({x: 5, y: 5}).perform();
			 	ptor.actions().mouseDown().perform();
			 	ptor.actions().mouseMove(place[(text.split(' ')[1]-1)]).perform();
			 	ptor.actions().mouseMove({x: 5, y: 5}).perform();
			 	ptor.actions().mouseUp().perform();	
			})

			answer[1].getText().then(function (text){
				ptor.actions().mouseMove(answer[1]).perform();
				ptor.actions().mouseMove({x: 5, y: 5}).perform();
			 	ptor.actions().mouseDown().perform();
			 	ptor.actions().mouseMove(place[(text.split(' ')[1]-1)]).perform();
			 	ptor.actions().mouseMove({x: 5, y: 5}).perform();
			 	ptor.actions().mouseUp().perform();	
			})

			answer[2].getText().then(function (text){
				ptor.actions().mouseMove(answer[2]).perform();
				ptor.actions().mouseMove({x: 5, y: 5}).perform();
			 	ptor.actions().mouseDown().perform();
			 	ptor.actions().mouseMove(place[(text.split(' ')[1]-1)]).perform();
			 	ptor.actions().mouseMove({x: 5, y: 5}).perform();
			 	ptor.actions().mouseUp().perform();	
			})
		})
	})
		ptor.sleep(3000);
}


function expect_popover_on_hover_correct(ptor){
	locator.s_by_classname(ptor, 'ui-droppable').then(function(place){
		ptor.actions().mouseMove(place[0]).perform();
		ptor.actions().mouseMove({x: 5, y: 5}).perform();
		locator.by_classname(ptor, 'popover-title').then(function(popover){
			expect(popover.getText()).toContain("Correct");
		})

		ptor.actions().mouseMove(place[1]).perform();
		ptor.actions().mouseMove({x: 5, y: 5}).perform();
		locator.by_classname(ptor, 'popover-title').then(function(popover){
			expect(popover.getText()).toContain("Correct");
		})

		ptor.actions().mouseMove(place[2]).perform();
		ptor.actions().mouseMove({x: 5, y: 5}).perform();
		locator.by_classname(ptor, 'popover-title').then(function(popover){
			expect(popover.getText()).toContain("Correct");
		})
	})
}


function answer_drag_incorrect(ptor){
	//shuffle answers so all becomes clickable
	locator.s_by_classname(ptor,'dragged').then(function(answer){
			ptor.actions().mouseMove(answer[0]).perform();
			ptor.actions().mouseMove({x: 5, y: 5}).perform();
		 	ptor.actions().mouseDown().perform();
		 	ptor.actions().mouseMove({x: 100, y: 0}).perform();
		 	ptor.actions().mouseUp().perform();
			
			ptor.actions().mouseMove(answer[1]).perform();
			ptor.actions().mouseMove({x: 5, y: 5}).perform();
		 	ptor.actions().mouseDown().perform();
		 	ptor.actions().mouseMove({x: 200, y: 0}).perform();
		 	ptor.actions().mouseUp().perform();

		 	ptor.actions().mouseMove(answer[2]).perform();
			ptor.actions().mouseMove({x: 5, y: 5}).perform();
		 	ptor.actions().mouseDown().perform();
		 	ptor.actions().mouseMove({x: 300, y: 0}).perform();
		 	ptor.actions().mouseUp().perform();
		})
	locator.s_by_classname(ptor, 'ui-droppable').then(function(place){
		locator.s_by_classname(ptor,'dragged').then(function(answer){
			answer[0].getText().then(function (text){
				ptor.actions().mouseMove(answer[2]).perform();
				ptor.actions().mouseMove({x: 5, y: 5}).perform();
			 	ptor.actions().mouseDown().perform();
			 	ptor.actions().mouseMove(place[(text.split(' ')[1]-1)]).perform();
			 	ptor.actions().mouseMove({x: 5, y: 5}).perform();
			 	ptor.actions().mouseUp().perform();	
			})

			answer[1].getText().then(function (text){
				ptor.actions().mouseMove(answer[0]).perform();
				ptor.actions().mouseMove({x: 5, y: 5}).perform();
			 	ptor.actions().mouseDown().perform();
			 	ptor.actions().mouseMove(place[(text.split(' ')[1]-1)]).perform();
			 	ptor.actions().mouseMove({x: 5, y: 5}).perform();
			 	ptor.actions().mouseUp().perform();	
			})

			answer[2].getText().then(function (text){
				ptor.actions().mouseMove(answer[1]).perform();
				ptor.actions().mouseMove({x: 5, y: 5}).perform();
			 	ptor.actions().mouseDown().perform();
			 	ptor.actions().mouseMove(place[(text.split(' ')[1]-1)]).perform();
			 	ptor.actions().mouseMove({x: 5, y: 5}).perform();
			 	ptor.actions().mouseUp().perform();	
			})
		})
	})
		ptor.sleep(3000);
}


function expect_popover_on_hover_incorrect(ptor){
	locator.s_by_classname(ptor, 'ui-droppable').then(function(place){
		ptor.actions().mouseMove(place[0]).perform();
		ptor.actions().mouseMove({x: 5, y: 5}).perform();
		locator.by_classname(ptor, 'popover-title').then(function(popover){
			expect(popover.getText()).toContain("Incorrect");
		})

		ptor.actions().mouseMove(place[1]).perform();
		ptor.actions().mouseMove({x: 5, y: 5}).perform();
		locator.by_classname(ptor, 'popover-title').then(function(popover){
			expect(popover.getText()).toContain("Incorrect");
		})

		ptor.actions().mouseMove(place[2]).perform();
		ptor.actions().mouseMove({x: 5, y: 5}).perform();
		locator.by_classname(ptor, 'popover-title').then(function(popover){
			expect(popover.getText()).toContain("Incorrect");
		})
	})
}