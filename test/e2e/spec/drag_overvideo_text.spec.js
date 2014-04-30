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
	    o_c.open_item(ptor, 2);
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

	it('should answer incorrectly',function(){
		answer_drag_incorrect(ptor);
	})

	it('should press answer button',function(){
		answer(ptor);
	})

	it('should check if the answer is incorrect',function(){
		check_answer_incorrect(ptor);
	})
})

//====================================================
//====================================================
//====================================================

 function check_drags_no(ptor, no){
	locator.by_classname(ptor,'drag-sort').findElements(protractor.By.tagName('li')).then(function(answer){
		expect(answer.length).toEqual(no);
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
	for (var i = 0; i < 3; i++) {
		locator.by_classname(ptor,'drag-sort').findElements(protractor.By.className('ui-icon-arrowthick-2-n-s')).then(function(arrow){
			locator.by_classname(ptor,'drag-sort').findElements(protractor.By.tagName('li')).then(function(answer){
				answer[0].getText().then(function (text){
					if(text == 'answer 3'){
					 	ptor.actions().dragAndDrop(arrow[0], arrow[2]).perform();
					}
					else if(text == 'answer 2'){
					 	ptor.actions().dragAndDrop(arrow[0], arrow[1]).perform();
					}
				})
				answer[1].getText().then(function (text){
					if(text == 'answer 1'){
						ptor.actions().dragAndDrop(arrow[1], arrow[0]).perform();
					}
					else if(text == 'answer 3'){
					 	ptor.actions().dragAndDrop(arrow[1], arrow[2]).perform();
					}
				})
				answer[2].getText().then(function (text){
					if(text == 'answer 1'){
					 	ptor.actions().dragAndDrop(arrow[2], arrow[0]).perform();
					}
					else if(text == 'answer 2'){
					 	ptor.actions().dragAndDrop(arrow[2], arrow[1]).perform();
					}
				})		
			})
		})
	}
	ptor.sleep(3000);
}

function answer_drag_incorrect(ptor){
	locator.by_classname(ptor,'drag-sort').findElements(protractor.By.className('ui-icon-arrowthick-2-n-s')).then(function(arrow){
		locator.by_classname(ptor,'drag-sort').findElements(protractor.By.tagName('li')).then(function(answer){
			answer[0].getText().then(function (text){
				if(text == 'answer 1'){
				 	ptor.actions().dragAndDrop(arrow[2], arrow[0]).perform();
				}
			})
			answer[1].getText().then(function (text){
				if(text == 'answer 1'){
					ptor.actions().dragAndDrop(arrow[1], arrow[2]).perform();
				}
				else if(text == 'answer 3'){
				 	ptor.actions().dragAndDrop(arrow[1], arrow[0]).perform();
				}
			})
			answer[2].getText().then(function (text){
				if(text == 'answer 3'){
				 	ptor.actions().dragAndDrop(arrow[0], arrow[2]).perform();
				}
				if(text == 'answer 1'){
				 	ptor.actions().dragAndDrop(arrow[2], arrow[0]).perform();
				}
			})
		})
	})
	ptor.sleep(3000);
}
