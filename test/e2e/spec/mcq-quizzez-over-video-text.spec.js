var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module');
var youtube = require('./lib/youtube.js');

var ptor = protractor.getInstance();
var params = ptor.params
ptor.driver.manage().window().maximize();


describe("1", function(){

	it('should sign in as teacher', function(){
		o_c.press_login(ptor);
		o_c.sign_in(ptor, params.teacher1.email, params.password);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
	})

	//test
	it('should add a module and lecture to create quizzes', function(){
		// o_c.sign_in(ptor, params.teacher1.email, params.password);
		// o_c.open_course_list(ptor);
		// o_c.open_course(ptor, 1);
		teacher.add_module(ptor);
		teacher.open_module(ptor, 1);
		teacher.add_lecture(ptor);
		o_c.press_content_navigator(ptor);
		ptor.sleep(2000)
		teacher.init_lecture(ptor, "mcq_text_quiz","https://www.youtube.com/watch?v=SKqBmAHwSkg");
	})

	it('should create quiz', function(){
		youtube.seek(ptor, 21);
		teacher.create_invideo_mcq_text_quiz(ptor);
		teacher.make_mcq_text_questions(ptor);
	})

	it('should get the enrollment key and enroll student', function(){
		o_c.press_content_navigator(ptor);
		ptor.sleep(2000)
		teacher.get_key_and_enroll(ptor, params.student1.email, params.password);
	})

	it('should login a student and check for mcq no', function(){
		// o_c.to_student(ptor);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		// o_c.press_content_navigator(ptor);
		// teacher.open_module(ptor, 1);
		// o_c.press_content_navigator(ptor);
		youtube.seek(ptor, 21);
		student.expect_quiz(ptor);
		student.check_invideo_mcq_no(ptor, 3);
	})


	it('should answer mcq quiz correctly',function(){
		student.answer_invideo_mcq(ptor, 1);
		student.answer_invideo_mcq(ptor, 3);
	})

	it('should press answer button',function(){
		student.answer_quiz(ptor);
	})

	it('should check if the answer is correct',function(){
		student.check_answer_correct(ptor);
	})

	it('should check every popovers', function(){
		student.expect_popover_on_hover_correct(ptor, 1);
		student.expect_popover_on_hover_correct(ptor, 3);
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
		// o_c.press_login(ptor);
		o_c.sign_in(ptor, params.teacher1.email, params.password);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
	})

	//test
	it('should add a module and lecture to create quizzes', function(){
		// o_c.sign_in(ptor, params.teacher1.email, params.password);
		// o_c.open_course_list(ptor);
		// o_c.open_course(ptor, 1);
		teacher.add_module(ptor);
		teacher.open_module(ptor, 1);
		teacher.add_lecture(ptor);
		o_c.press_content_navigator(ptor);
		ptor.sleep(2000)
		teacher.init_lecture(ptor, "mcq_text_quiz","https://www.youtube.com/watch?v=SKqBmAHwSkg");
	})

	it('should create quiz', function(){
		youtube.seek(ptor, 21);
		teacher.create_invideo_mcq_text_quiz(ptor);
		teacher.make_mcq_text_questions(ptor);
	})

	it('should get the enrollment key and enroll student', function(){
		o_c.press_content_navigator(ptor);
		ptor.sleep(2000)
		teacher.get_key_and_enroll(ptor, params.student1.email, params.password);
	})

	it('should login a student and check for mcq no', function(){
		// o_c.to_student(ptor);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		// o_c.press_content_navigator(ptor);
		// teacher.open_module(ptor, 1);
		// o_c.press_content_navigator(ptor);
		youtube.seek(ptor, 21);
		student.expect_quiz(ptor);
		student.check_invideo_mcq_no(ptor, 3);
	})

	it('should answer mcq quiz incorrectly',function(){
		student.answer_invideo_mcq(ptor, 2);
	})

	it('should press answer button',function(){
		student.answer_quiz(ptor);
	})

	it('should check if the answer is incorrect',function(){
		student.check_answer_incorrect(ptor);
	})

	it('should check every popovers', function(){
		student.expect_popover_on_hover_incorrect(ptor, 2);
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

describe("explanation validation", function(){
	it('should sign in as teacher', function(){
		// o_c.press_login(ptor);
		o_c.sign_in(ptor, params.teacher1.email, params.password);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
	})

	//test
	it('should add a module and lecture to create quizzes', function(){
		// o_c.sign_in(ptor, params.teacher1.email, params.password);
		// o_c.open_course_list(ptor);
		// o_c.open_course(ptor, 1);
		teacher.add_module(ptor);
		teacher.open_module(ptor, 1);
		teacher.add_lecture(ptor);
		o_c.press_content_navigator(ptor);
		ptor.sleep(2000)
		teacher.init_lecture(ptor, "mcq_text_quiz","https://www.youtube.com/watch?v=SKqBmAHwSkg");
	})

	it('should create quiz', function(){
		youtube.seek(ptor, 21);
		teacher.create_invideo_mcq_text_quiz(ptor);
		teacher.make_mcq_text_questions(ptor);
	})

	it('should get the enrollment key and enroll student', function(){
		o_c.press_content_navigator(ptor);
		ptor.sleep(2000)
		teacher.get_key_and_enroll(ptor, params.student1.email, params.password);
	})

	it('should login a student and check for mcq no', function(){
		// o_c.to_student(ptor);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		// o_c.press_content_navigator(ptor);
		// teacher.open_module(ptor, 1);
		// o_c.press_content_navigator(ptor);
		youtube.seek(ptor, 21);
		student.expect_quiz(ptor);
		student.check_invideo_mcq_no(ptor, 3);
	})

	it('should answer mcq quiz incorrectly',function(){
		student.answer_invideo_mcq(ptor, 1);
		student.answer_invideo_mcq(ptor, 2);
		student.answer_invideo_mcq(ptor, 3);
	})

	it('should press answer button',function(){
		student.answer_quiz(ptor);
	})

	it('should check if the answer is incorrect',function(){
		student.check_answer_incorrect(ptor);
	})

	it('should check every popovers', function(){
		student.expect_popover_on_hover_correct(ptor, 1);
		student.check_explanation(ptor, 1, "explanation 1")

		student.expect_popover_on_hover_incorrect(ptor, 2);
		student.check_explanation(ptor, 2, "explanation 2")

		student.expect_popover_on_hover_correct(ptor, 3);
		student.check_explanation(ptor, 3, "explanation 3")

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





// function expect_quiz(ptor){
// 	expect(element(by.buttonText('Check Answer')).isDisplayed()).toEqual(true);
// }


// function answer_quiz(ptor){
// 	element(by.buttonText('Check Answer')).click()
// }


// function check_answer_correct(ptor){
// 	locator.by_tag(ptor,'notification').then(function(popover){
// 		expect(popover.getText()).toContain('Correct');
// 	})
// }

// function check_answer_incorrect(ptor){
// 	locator.by_tag(ptor,'notification').then(function(popover){
// 		expect(popover.getText()).toContain('Incorrect');
// 	})
// }

// function expect_popover_on_hover_correct(ptor, no){
// 	locator.by_id(ptor,'ontop').findElements(protractor.By.tagName('input')).then(function(check_boxes){
// 		ptor.actions().mouseMove(check_boxes[no-1]).perform();
// 		ptor.actions().mouseMove({x: 5, y: 5}).perform();
// 		locator.by_classname(ptor, 'popover-title').then(function(popover){
// 			expect(popover.getText()).toContain("Correct");
// 		})
// 	})
// }

// function expect_popover_on_hover_incorrect(ptor, no){
// 	locator.by_id(ptor,'ontop').findElements(protractor.By.tagName('input')).then(function(check_boxes){
// 		ptor.actions().mouseMove(check_boxes[no-1]).perform();
// 		ptor.actions().mouseMove({x: 5, y: 5}).perform();
// 		locator.by_classname(ptor, 'popover-title').then(function(popover){
// 			expect(popover.getText()).toContain("Incorrect");
// 		})
// 	})
// }
