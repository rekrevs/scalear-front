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
		o_c.sign_in(ptor, params.teacher_mail, params.password);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
	})

	//test
	it('should add a module and lecture to create quizzes', function(){
		// o_c.sign_in(ptor, params.teacher_mail, params.password);
		// o_c.open_course_list(ptor);
		// o_c.open_course(ptor, 1);
		teacher.add_module(ptor);
		// o_c.press_content_navigator(ptor);
		teacher.open_module(ptor, 1);
		teacher.add_lecture(ptor);			
		// o_c.press_content_navigator(ptor);
		// ptor.sleep(2000)
		teacher.init_lecture(ptor, "drag_text_quiz","https://www.youtube.com/watch?v=SKqBmAHwSkg");
	})

	it('should create quiz', function(){
		youtube.seek(ptor, 21);
		teacher.create_invideo_drag_text_quiz(ptor);
		teacher.make_drag_text_questions(ptor);
	})

	it('should get the enrollment key and enroll student', function(){
		teacher.get_key_and_enroll(ptor, params.student_mail, params.password);
	})

	it('should login a student and check for no of drags ', function(){
		// o_c.to_student(ptor);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		// o_c.press_content_navigator(ptor);
		// teacher.open_module(ptor, 1);
		// o_c.press_content_navigator(ptor);
		youtube.press_play(ptor)
		youtube.seek(ptor, 20.9);
		ptor.sleep(3000)
		student.expect_quiz(ptor);
		student.check_text_drag_no(ptor, 3);
	})

	it('should answer drag quiz correctly',function(){
		student.answer_text_drag_correct(ptor)
	})

	it('should press answer button',function(){
		student.answer_quiz(ptor);
	})

	it('should check if the answer is correct',function(){
		student.check_answer_correct(ptor);
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
		o_c.sign_in(ptor, params.teacher_mail, params.password);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
	})

	it('should add a module and lecture to create quizzes', function(){
		// o_c.sign_in(ptor, params.teacher_mail, params.password);
		// o_c.open_course_list(ptor);
		// o_c.open_course(ptor, 1);
		teacher.add_module(ptor);
		// o_c.press_content_navigator(ptor);
		teacher.open_module(ptor, 1);
		teacher.add_lecture(ptor);			
		// o_c.press_content_navigator(ptor);
		// ptor.sleep(2000)
		teacher.init_lecture(ptor, "drag_text_quiz","https://www.youtube.com/watch?v=SKqBmAHwSkg");
	})

	it('should create quiz', function(){
		youtube.seek(ptor, 21);
		teacher.create_invideo_drag_text_quiz(ptor);
		teacher.make_drag_text_questions(ptor);
	})

	it('should get the enrollment key and enroll student', function(){
		teacher.get_key_and_enroll(ptor, params.student_mail, params.password);
	})
	

	it('should login a student and check for no of drags ', function(){
		// o_c.to_student(ptor);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		// o_c.press_content_navigator(ptor);
		// teacher.open_module(ptor, 1);
		// o_c.press_content_navigator(ptor);
		youtube.press_play(ptor)
		youtube.seek(ptor, 20.9);
		ptor.sleep(3000)
		student.expect_quiz(ptor);
		student.check_text_drag_no(ptor, 3);
	})

	it('should press answer button',function(){
		student.answer_quiz(ptor);
	})

	it('should check if the answer is incorrect',function(){
		student.answer_text_drag_incorrect(ptor);
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

