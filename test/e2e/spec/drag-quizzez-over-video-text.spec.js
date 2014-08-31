var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module');
var youtube = require('./lib/youtube.js');

var ptor = protractor.getInstance();
var params = ptor.params
ptor.driver.manage().window().maximize();


// xdescribe("1", function(){

// 	it('should sign in as teacher', function(){
// 		o_c.press_login(ptor);
// 		o_c.sign_in(ptor, params.teacher_mail, params.password);
// 	})

// 	it('should create_course', function(){
// 		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
// 	})

// 	it('should get the enrollment key and enroll student', function(){
// 		teacher.get_key_and_enroll(ptor, params.student_mail, params.password);
// 	})
// 	//test
// 	it('should add a module and lecture to create quizzes', function(){
// 		o_c.open_course_list(ptor);
// 		o_c.open_course(ptor, 1);
// 		teacher.add_module(ptor);
// 		o_c.press_content_navigator(ptor);
// 		teacher.open_module(ptor, 1);
// 		teacher.add_lecture(ptor);			
// 		o_c.press_content_navigator(ptor);
// 		teacher.init_lecture(ptor, "drag_text_quiz","https://www.youtube.com/watch?v=SKqBmAHwSkg");
// 		youtube.seek(ptor, 21);
// 		create_drag_text_quiz(ptor);
// 		make_drag_text_questions(ptor);					
// 	})

// 	it('should login a student and check for drag no', function(){
// 		o_c.to_student(ptor);
// 		o_c.open_course_list(ptor);
// 		o_c.open_course(ptor, 1);
// 		o_c.press_content_navigator(ptor);
// 		teacher.open_module(ptor, 1);
// 		o_c.press_content_navigator(ptor);
// 		youtube.seek(ptor, 21);
// 		expect_quiz(ptor);
// 		check_drag_no(ptor, 3);
// 	})

// 	it('should clear the course for deletion', function(){
// 		o_c.to_teacher(ptor);
// 		o_c.open_course_list(ptor);
// 		o_c.open_course(ptor, 1);
// 		o_c.press_content_navigator(ptor);
// 		teacher.open_module(ptor, 1);
// 		teacher.delete_item_by_number(ptor, 1, 1);
// 		teacher.delete_empty_module(ptor, 1);
// 	})
// 	//end test

// 	it('should delete course', function(){
// 		o_c.open_course_list(ptor);
// 		teacher.delete_course(ptor, 1);
// 	})
// })

xdescribe("1", function(){

	it('should sign in as teacher', function(){
		o_c.press_login(ptor);
		o_c.sign_in(ptor, params.teacher_mail, params.password);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
	})

	it('should get the enrollment key and enroll student', function(){
		teacher.get_key_and_enroll(ptor, params.student_mail, params.password);
	})
	//test
	it('should add a module and lecture to create quizzes', function(){
		o_c.sign_in(ptor, params.teacher_mail, params.password);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		teacher.add_module(ptor);
		// o_c.press_content_navigator(ptor);
		teacher.open_module(ptor, 1);
		teacher.add_lecture(ptor);			
		o_c.press_content_navigator(ptor);
		teacher.init_lecture(ptor, "drag_text_quiz","https://www.youtube.com/watch?v=SKqBmAHwSkg");
	})

	it('should create quiz', function(){
		youtube.seek(ptor, 21);
		create_drag_text_quiz(ptor);
		make_drag_text_questions(ptor);
	})

	it('should login a student and check for no of drags ', function(){
		o_c.to_student(ptor);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		// o_c.press_content_navigator(ptor);
		// teacher.open_module(ptor, 1);
		// o_c.press_content_navigator(ptor);
		youtube.seek(ptor, 21);
		expect_quiz(ptor);
		check_drag_no(ptor, 3);
	})

	it('should answer drag quiz correctly',function(){
		answer_drag_correct(ptor)
	})

	it('should press answer button',function(){
		answer_quiz(ptor);
	})

	it('should check if the answer is correct',function(){
		check_answer_correct(ptor);
	})

	it('should clear the course for deletion', function(){
		o_c.to_teacher(ptor);
		o_c.open_course_list(ptor);
	    o_c.open_course(ptor, 1);
	    teacher.open_module(ptor, 1);
	    teacher.delete_item_by_number(ptor, 1, 1);
	    teacher.delete_empty_module(ptor, 1)
	})

	it('should delete course', function(){
		o_c.open_course_list(ptor);
	    teacher.delete_course(ptor, 1);
	    o_c.logout(ptor);
	})
})

describe("2", function(){

	it('should sign in as teacher', function(){
		o_c.press_login(ptor);
		o_c.sign_in(ptor, params.teacher_mail, params.password);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
	})

	it('should get the enrollment key and enroll student', function(){
		teacher.get_key_and_enroll(ptor, params.student_mail, params.password);
	})
	//test
	it('should add a module and lecture to create quizzes', function(){
		o_c.sign_in(ptor, params.teacher_mail, params.password);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		teacher.add_module(ptor);
		// o_c.press_content_navigator(ptor);
		teacher.open_module(ptor, 1);
		teacher.add_lecture(ptor);			
		o_c.press_content_navigator(ptor);
		teacher.init_lecture(ptor, "drag_text_quiz","https://www.youtube.com/watch?v=SKqBmAHwSkg");
	})

	it('should create quiz', function(){
		youtube.seek(ptor, 21);
		create_drag_text_quiz(ptor);
		make_drag_text_questions(ptor);
	})

	it('should login a student and check for no of drags ', function(){
		o_c.to_student(ptor);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		// o_c.press_content_navigator(ptor);
		// teacher.open_module(ptor, 1);
		// o_c.press_content_navigator(ptor);
		youtube.seek(ptor, 21);
		expect_quiz(ptor);
		check_drag_no(ptor, 3);
	})

	// it('should answer drag quiz correctly',function(){
	// 	answer_drag_correct(ptor)
	// })

	it('should press answer button',function(){
		answer_quiz(ptor);
	})

	it('should check if the answer is incorrect',function(){
		check_answer_incorrect(ptor);
	})

	it('should clear the course for deletion', function(){
		o_c.to_teacher(ptor);
		o_c.open_course_list(ptor);
	    o_c.open_course(ptor, 1);
	    teacher.open_module(ptor, 1);
	    teacher.delete_item_by_number(ptor, 1, 1);
	    teacher.delete_empty_module(ptor, 1)
	})

	it('should delete course', function(){
		o_c.open_course_list(ptor);
	    teacher.delete_course(ptor, 1);
	    o_c.logout(ptor);
	})
})


//====================================================
//====================================================
//====================================================

function create_drag_text_quiz(ptor){
	teacher.open_content_new_in_video_ques(ptor);
	element(by.id("drag_text")).click()
	expect(element(by.id("editing")).isDisplayed()).toEqual(true);
}


function make_drag_text_questions(ptor){
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
		element(by.buttonText('Save')).click()
		// .then(function(btn){
		// 	btn.click().then(function(){
		// 		o_c.feedback(ptor, 'Quiz was successfully saved');
		// 	})
		// })
	})
}

 function check_drag_no(ptor, no){
	locator.by_classname(ptor,'drag-sort').findElements(protractor.By.tagName('li')).then(function(answer){
		expect(answer.length).toEqual(no);
	})
}

function expect_quiz(ptor){
	expect(element(by.buttonText('Check Answer')).isDisplayed()).toEqual(true);
}

function answer_quiz(ptor){
	element(by.buttonText('Check Answer')).click()
}

function check_answer_correct(ptor){
	locator.by_tag(ptor,'notification').then(function(popover){
		expect(popover.getText()).toContain('Correct');
	})
}

function check_answer_incorrect(ptor){
	locator.by_tag(ptor,'notification').then(function(popover){
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
