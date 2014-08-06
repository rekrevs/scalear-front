var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module');
var youtube = require('./lib/youtube.js');

var ptor = protractor.getInstance();
var params = ptor.params
ptor.driver.manage().window().maximize();

xdescribe("1", function(){

	it('should sign in as teacher', function(){
		o_c.press_login(ptor);
		o_c.sign_in(ptor, params.teacher_mail, params.password);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites, o_c.feedback);
	})

	it('should get the enrollment key and enroll student', function(){
		teacher.get_key_and_enroll(ptor);
	})
	//test
	it('should add a module and lecture to create quizzes', function(){
		o_c.open_course_list(ptor);
		o_c.open_course_whole(ptor, 0);
		teacher.add_module(ptor);
		o_c.press_content_navigator(ptor);
		teacher.open_module(ptor, 1);
		teacher.create_lecture(ptor);			
		o_c.press_content_navigator(ptor);
		teacher.init_lecture(ptor, "mcq_text_quiz","https://www.youtube.com/watch?v=SKqBmAHwSkg");
	})

	it('should create quiz', function(){
		youtube.seek(ptor, 21);
		create_mcq_text_quiz(ptor);
		make_mcq_text_questions(ptor);
	})

	it('should login a student and check for mcq no', function(){
		o_c.to_student(ptor);
		o_c.open_course_list(ptor);
		o_c.open_course_whole(ptor, 0);
		o_c.press_content_navigator(ptor);
		teacher.open_module(ptor, 1);
		o_c.press_content_navigator(ptor);
		youtube.seek(ptor, 21);
		expect_quiz(ptor);
		check_mcq_no(ptor, 3);
	})

	it('should clear the course for deletion', function(){
		o_c.to_teacher(ptor);
		o_c.open_course_list(ptor);
		o_c.open_course_whole(ptor, 0);
		o_c.press_content_navigator(ptor);
		teacher.open_module(ptor, 1);
		teacher.delete_item_by_number(ptor, 1, 1, o_c.feedback);
		teacher.delete_empty_module(ptor, 1, o_c.feedback);
	})
	//end test

	it('should delete course', function(){
		o_c.open_course_list(ptor);
		teacher.delete_course(ptor, 1);
	})
})

xdescribe("2", function(){

	it('should sign in as teacher', function(){
		o_c.press_login(ptor);
		o_c.sign_in(ptor, params.teacher_mail, params.password);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites, o_c.feedback);
	})

	it('should get the enrollment key and enroll student', function(){
		teacher.get_key_and_enroll(ptor);
	})
	//test
	it('should add a module and lecture to create quizzes', function(){
		o_c.open_course_list(ptor);
		o_c.open_course_whole(ptor, 0);
		teacher.add_module(ptor);
		o_c.press_content_navigator(ptor);
		teacher.open_module(ptor, 1);
		teacher.create_lecture(ptor);			
		o_c.press_content_navigator(ptor);
		teacher.init_lecture(ptor, "mcq_text_quiz","https://www.youtube.com/watch?v=SKqBmAHwSkg");
	})

	it('should create quiz', function(){
		youtube.seek(ptor, 21);
		create_mcq_text_quiz(ptor);
		make_mcq_text_questions(ptor);
	})

	it('should login a student and check for mcq no', function(){
		o_c.to_student(ptor);
		o_c.open_course_list(ptor);
		o_c.open_course_whole(ptor, 0);
		o_c.press_content_navigator(ptor);
		teacher.open_module(ptor, 1);
		o_c.press_content_navigator(ptor);
		youtube.seek(ptor, 21);
		expect_quiz(ptor);
		check_mcq_no(ptor, 3);
	})


	it('should answer mcq quiz correctly',function(){
		check_answer_given_answer_order(ptor, 1);
		check_answer_given_answer_order(ptor, 3);
	})

	it('should press answer button',function(){
		answer(ptor);
	})

	it('should check if the answer is correct',function(){
		check_answer_correct(ptor);
	})

	it('should check every popovers', function(){
		expect_popover_on_hover_correct(ptor, 1);
		expect_popover_on_hover_correct(ptor, 3);
	})

	it('should clear the course for deletion', function(){
		o_c.to_teacher(ptor);
		o_c.open_course_list(ptor);
		o_c.open_course_whole(ptor, 0);
		o_c.press_content_navigator(ptor);
		teacher.open_module(ptor, 1);
		teacher.delete_item_by_number(ptor, 1, 1, o_c.feedback);
		teacher.delete_empty_module(ptor, 1, o_c.feedback);
	})
	//end test

	it('should delete course', function(){
		o_c.open_course_list(ptor);
		teacher.delete_course(ptor, 1);
	})
})

describe("3", function(){
	it('should sign in as teacher', function(){
		o_c.press_login(ptor);
		o_c.sign_in(ptor, params.teacher_mail, params.password);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites, o_c.feedback);
	})

	it('should get the enrollment key and enroll student', function(){
		teacher.get_key_and_enroll(ptor);
	})
	//test
	it('should add a module and lecture to create quizzes', function(){
		o_c.open_course_list(ptor);
		o_c.open_course_whole(ptor, 0);
		teacher.add_module(ptor);
		o_c.press_content_navigator(ptor);
		teacher.open_module(ptor, 1);
		teacher.create_lecture(ptor);			
		o_c.press_content_navigator(ptor);
		teacher.init_lecture(ptor, "mcq_text_quiz","https://www.youtube.com/watch?v=SKqBmAHwSkg");
	})

	it('should create quiz', function(){
		youtube.seek(ptor, 21);
		create_mcq_text_quiz(ptor);
		make_mcq_text_questions(ptor);
	})

	it('should login a student and check for mcq no', function(){
		o_c.to_student(ptor);
		o_c.open_course_list(ptor);
		o_c.open_course_whole(ptor, 0);
		o_c.press_content_navigator(ptor);
		teacher.open_module(ptor, 1);
		o_c.press_content_navigator(ptor);
		youtube.seek(ptor, 21);
		expect_quiz(ptor);
		check_mcq_no(ptor, 3);
	})


	it('should answer mcq quiz incorrectly',function(){
		check_answer_given_answer_order(ptor, 2);
	})

	it('should press answer button',function(){
		answer(ptor);
	})

	it('should check if the answer is incorrect',function(){
		check_answer_incorrect(ptor);
	})

	it('should check every popovers', function(){
		expect_popover_on_hover_incorrect(ptor, 2);
	})

	it('should clear the course for deletion', function(){
		o_c.to_teacher(ptor);
		o_c.open_course_list(ptor);
		o_c.open_course_whole(ptor, 0);
		o_c.press_content_navigator(ptor);
		teacher.open_module(ptor, 1);
		teacher.delete_item_by_number(ptor, 1, 1, o_c.feedback);
		teacher.delete_empty_module(ptor, 1, o_c.feedback);
	})
	//end test

	it('should delete course', function(){
		o_c.open_course_list(ptor);
		teacher.delete_course(ptor, 1);
	})
})


//====================================================
//====================================================
//====================================================

function create_mcq_text_quiz(ptor){
	teacher.open_content_new_in_video_ques(ptor);
	locator.by_id(ptor, "mcq_text").then(function(link){
		link.click().then(function(){
			o_c.feedback(ptor, "Quiz was successfully created");
			expect(locator.by_id(ptor, 'editing').isDisplayed()).toEqual(true);
		})
	})
}

function make_mcq_text_questions(ptor, feedback){

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

function check_mcq_no(ptor, no){
	locator.by_id(ptor,'ontop').findElements(protractor.By.tagName('input')).then(function(check_boxes){
		expect(check_boxes.length).toEqual(no);
	})
}

function expect_quiz(ptor){
    element(by.tagName('check_answer')).then(function(check_answer_btn){
		expect(check_answer_btn.isDisplayed()).toEqual(true);
	})
}

function check_answer_given_answer_order(ptor, choice_no){
    locator.by_id(ptor,'ontop').findElements(protractor.By.tagName('input')).then(function(check_boxes){
		check_boxes[choice_no-1].click();
	})
}

function answer(ptor){
	element(by.buttonText('Check Answer')).then(function(answer_btn){
		answer_btn.click();
	})
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