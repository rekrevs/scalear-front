var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module');
var youtube = require('./lib/youtube.js');

var ptor = protractor.getInstance();
var params = ptor.params
ptor.driver.manage().window().maximize();

//function testing ocq
xdescribe("teacher", function(){
	it('should', function(){
		o_c.sign_in(ptor, params.teacher_mail, params.password, o_c.feedback);
		o_c.open_course_whole(ptor);
		//teacher.add_module(ptor, o_c.feedback);
		teacher.open_module(ptor, 1);
		teacher.open_lecture(ptor, 1, 1);
		create_ocq_quiz(ptor, o_c.feedback);
		make_ocq_questions(ptor, ocq_q1_x, ocq_q1_y, ocq_q2_x, ocq_q2_y, ocq_q3_x, ocq_q3_y, o_c.feedback);
		// o_c.open_tray(ptor);
		// o_c.open_lectures(ptor);
		//youtube.seek(ptor, 50);
		//teacher.create_lecture(ptor, "mena", "https://www.youtube.com/watch?v=SKqBmAHwSkg", o_c.feedback);
		//create_ocq_quiz(ptor, o_c.feedback);
		//check_ocq_questions_coord(ptor, ocq_q1_x, ocq_q1_y, ocq_q2_x, ocq_q2_y, ocq_q3_x, ocq_q3_y);
		// check_answer_given_answer_order(ptor, 1);
		// answer(ptor);
		// check_answer_correct(ptor);


	})
})

describe("1", function(){

	it('should sign in as teacher', function(){
		o_c.sign_in(ptor, params.teacher_mail, params.password, o_c.feedback);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites, o_c.feedback);
	})

	it('should get the enrollment key and enroll student', function(){
		teacher.get_key_and_enroll(ptor);
	})
	//test
	it('should add a module and lecture to create quizzes', function(){
		o_c.open_course_whole(ptor);
		teacher.add_module(ptor, o_c.feedback);
		teacher.open_module(ptor, 1);
		teacher.create_lecture(ptor, "ocq_quiz","https://www.youtube.com/watch?v=SKqBmAHwSkg", o_c.feedback);
	})

	it('should create quiz', function(){
		youtube.seek(ptor, 50);
		create_ocq_quiz(ptor, o_c.feedback);
		make_ocq_questions(ptor, o_c.feedback);
	})

	it('should login a student and check for ocq_no', function(){
		o_c.to_student(ptor);
		o_c.open_course_whole(ptor);
		o_c.open_tray(ptor);
		o_c.open_lectures(ptor);
		youtube.seek(ptor, 50);
		expect_quiz(ptor);
		check_ocq_no(ptor, 3);
	})

	it('should clear the course for deletion', function(){
		o_c.to_teacher(ptor);
		o_c.open_course_whole(ptor);

		teacher.open_module(ptor, 1);
		teacher.delete_item_by_number(ptor, 1, 1, o_c.feedback);

		teacher.delete_empty_module(ptor, 1, o_c.feedback);
	})
	//end test

	it('should delete course', function(){
		//should choose one of home() or home_teacher() 
		//depending on the current state(student or teacher)
		o_c.home_teacher(ptor);
		teacher.delete_course(ptor, o_c.feedback);
	})
})

describe("2", function(){

	it('should sign in as teacher', function(){
		o_c.sign_in(ptor, params.teacher_mail, params.password, o_c.feedback);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites, o_c.feedback);
	})

	it('should get the enrollment key and enroll student', function(){
		teacher.get_key_and_enroll(ptor);
	})
	//test
	it('should add a module and lecture to create quizzes', function(){
		o_c.open_course_whole(ptor);
		teacher.add_module(ptor, o_c.feedback);
		teacher.open_module(ptor, 1);
		teacher.create_lecture(ptor, "ocq_quiz","https://www.youtube.com/watch?v=SKqBmAHwSkg", o_c.feedback);
	})

	it('should create quiz', function(){
		youtube.seek(ptor, 50);
		create_ocq_quiz(ptor, o_c.feedback);
		make_ocq_questions(ptor, o_c.feedback);
	})

	it('should login a student and check for no of ocqs ', function(){
		o_c.to_student(ptor);
		o_c.open_course_whole(ptor);
		o_c.open_tray(ptor);
		o_c.open_lectures(ptor);
		youtube.seek(ptor, 50);
		expect_quiz(ptor);
		check_ocq_no(ptor, 3);
	})

	it('should answer ocq quiz correctly',function(){
		check_answer_given_answer_order(ptor, 2);
	})

	it('should press answer button',function(){
		answer(ptor);
	})

	it('should check if the answer is correct',function(){
		check_answer_correct(ptor);
	})

	it('should check every popovers', function(){
		expect_popover_on_hover_correct(ptor, 2);
	})

	it('should clear the course for deletion', function(){
		o_c.to_teacher(ptor);
		o_c.open_course_whole(ptor);

		teacher.open_module(ptor, 1);
		teacher.delete_item_by_number(ptor, 1, 1, o_c.feedback);

		teacher.delete_empty_module(ptor, 1, o_c.feedback);
	})
	//end test

	it('should delete course', function(){
		//should choose one of home() or home_teacher() 
		//depending on the current state(student or teacher)
		o_c.home_teacher(ptor);
		teacher.delete_course(ptor, o_c.feedback);
	})
})

describe("3", function(){

	it('should sign in as teacher', function(){
		o_c.sign_in(ptor, params.teacher_mail, params.password, o_c.feedback);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites, o_c.feedback);
	})

	it('should get the enrollment key and enroll student', function(){
		teacher.get_key_and_enroll(ptor);
	})
	//test
	it('should add a module and lecture to create quizzes', function(){
		o_c.open_course_whole(ptor);
		teacher.add_module(ptor, o_c.feedback);
		teacher.open_module(ptor, 1);
		teacher.create_lecture(ptor, "ocq_quiz","https://www.youtube.com/watch?v=SKqBmAHwSkg", o_c.feedback);
	})

	it('should create quiz', function(){
		youtube.seek(ptor, 50);
		create_ocq_quiz(ptor, o_c.feedback);
		make_ocq_questions(ptor, o_c.feedback);
	})

	it('should login a student and check for no of ocqs ', function(){
		o_c.to_student(ptor);
		o_c.open_course_whole(ptor);
		o_c.open_tray(ptor);
		o_c.open_lectures(ptor);
		youtube.seek(ptor, 50);
		expect_quiz(ptor);
		check_ocq_no(ptor, 3);
	})

	it('should answer ocq quiz correctly',function(){
		check_answer_given_answer_order(ptor, 1);
	})

	it('should press answer button',function(){
		answer(ptor);
	})

	it('should check if the answer is incorrect',function(){
		check_answer_incorrect(ptor);
	})

	it('should check every popovers', function(){
		expect_popover_on_hover_incorrect(ptor, 1);
	})

	it('should clear the course for deletion', function(){
		o_c.to_teacher(ptor);
		o_c.open_course_whole(ptor);

		teacher.open_module(ptor, 1);
		teacher.delete_item_by_number(ptor, 1, 1, o_c.feedback);

		teacher.delete_empty_module(ptor, 1, o_c.feedback);
	})
	//end test

	it('should delete course', function(){
		//should choose one of home() or home_teacher() 
		//depending on the current state(student or teacher)
		o_c.home_teacher(ptor);
		teacher.delete_course(ptor, o_c.feedback);
	})
})

describe("4", function(){

	it('should sign in as teacher', function(){
		o_c.sign_in(ptor, params.teacher_mail, params.password, o_c.feedback);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites, o_c.feedback);
	})

	it('should get the enrollment key and enroll student', function(){
		teacher.get_key_and_enroll(ptor);
	})
	//test
	it('should add a module and lecture to create quizzes', function(){
		o_c.open_course_whole(ptor);
		teacher.add_module(ptor, o_c.feedback);
		teacher.open_module(ptor, 1);
		teacher.create_lecture(ptor, "ocq_quiz","https://www.youtube.com/watch?v=SKqBmAHwSkg", o_c.feedback);
	})

	it('should create quiz', function(){
		youtube.seek(ptor, 50);
		create_ocq_quiz(ptor, o_c.feedback);
		make_ocq_questions(ptor, ocq_q1_x, ocq_q1_y, ocq_q2_x, ocq_q2_y, ocq_q3_x, ocq_q3_y, o_c.feedback);
	})

	it('should login a student and check for no of ocqs ', function(){
		o_c.to_student(ptor);
		o_c.open_course_whole(ptor);
		o_c.open_tray(ptor);
		o_c.open_lectures(ptor);
		youtube.seek(ptor, 50);
		expect_quiz(ptor);
		check_ocq_no(ptor, 3);
	})

	it('should answer ocq quiz correctly',function(){
		check_answer_given_answer_order(ptor, 2)
		is_checked(ptor, 2);
		is_not_checked(ptor, 3)
		check_answer_given_answer_order(ptor, 3)
		is_not_checked(ptor, 2);
		is_checked(ptor, 3)
	})

	it('should clear the course for deletion', function(){
		o_c.to_teacher(ptor);
		o_c.open_course_whole(ptor);

		teacher.open_module(ptor, 1);
		teacher.delete_item_by_number(ptor, 1, 1, o_c.feedback);

		teacher.delete_empty_module(ptor, 1, o_c.feedback);
	})
	//end test

	it('should delete course', function(){
		//should choose one of home() or home_teacher() 
		//depending on the current state(student or teacher)
		o_c.home_teacher(ptor);
		teacher.delete_course(ptor, o_c.feedback);
	})
})
/////////////////////////////////////////////////////////
//				test specific functions
/////////////////////////////////////////////////////////

function create_ocq_quiz(ptor, feedback){
	locator.s_by_classname(ptor, 'btn-group').then(function(btns){
		btns[0].click().then(function(){
			o_c.scroll(ptor, 1000);
			btns[0].findElements(protractor.By.repeater('item in list')).then(function(items){
				items[1].click().then(function(){
				    feedback(ptor, "Quiz was successfully created");
					expect(locator.by_id(ptor, 'editing').isDisplayed()).toEqual(true);
				})
			})
			o_c.scroll(ptor, -1000);
		})
	})
}

function make_ocq_questions(ptor, q1_x, q1_y, q2_x, q2_y, q3_x, q3_y, feedback){
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
		locator.by_id(ptor, 'done').then(function(btn){
			btn.click().then(function(){
				feedback(ptor, 'Quiz was successfully saved');
			})
		})
	})
}


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