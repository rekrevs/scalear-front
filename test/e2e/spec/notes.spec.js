var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');
var youtube = require('./lib/youtube');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module');
var lecture_middle = require('./lib/lecture_quizzes_management');
var quiz_ov = require('./lib/quizzes_over_video');
var survey_ov = require('./lib/surveys_over_video');
var quiz_ov_text = require('./lib/quizzes_over_video_text');

var ptor = protractor.getInstance();
var params = ptor.params;
ptor.driver.manage().window().maximize();

xdescribe("1", function(){

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
	//////////////////////////////////////////////////////////////
	it('should open the course', function(){
		o_c.open_course_whole(ptor);
	})
	it('should create a new module', function(){
		teacher.add_module(ptor, o_c.feedback);
	})
	it('should open the created module', function(){
		teacher.open_module(ptor, 1)
	})

	it('should create a lecture', function(){
		teacher.create_lecture(ptor, null, 'http://www.youtube.com/watch?v=xGcG4cp2yzY', o_c.feedback);
		ptor.navigate().refresh();
	})
	it('should seek the video', function(){
		youtube.seek(ptor, 10)
	})

	it('should add an over video quiz MCQ', function(){
		quiz_ov.create_mcq_quiz(ptor, o_c.feedback)
		lecture_middle.rename_quiz(ptor, 1, 'MCQ QUIZ')
		o_c.scroll_to_top(ptor)
		quiz_ov.make_mcq_questions(ptor, 50, 50, 50, 100, 50, 150, o_c.feedback)
		lecture_middle.exit_quiz(ptor, o_c.feedback)
	})

	it('should seek the video', function(){
		youtube.seek(ptor, 20)
	})
	it('should add an over video quiz OCQ', function(){
		quiz_ov.create_ocq_quiz(ptor, o_c.feedback)
		lecture_middle.rename_quiz(ptor, 3, 'OCQ QUIZ')
		o_c.scroll_to_top(ptor)
		quiz_ov.make_ocq_questions(ptor, 50, 50, 50, 100, 50, 150, o_c.feedback)
		lecture_middle.exit_quiz(ptor, o_c.feedback)
	})

	it('should seek the video', function(){
		youtube.seek(ptor, 30)
	})
	it('should add an over video quiz DRAG', function(){
		quiz_ov.create_drag_quiz(ptor, o_c.feedback)
		lecture_middle.rename_quiz(ptor, 5, 'DRAG QUIZ')
		o_c.scroll_to_top(ptor)
		quiz_ov.make_drag_questions(ptor, 50, 50, 50, 100, 50, 150, o_c.feedback)
		lecture_middle.exit_quiz(ptor, o_c.feedback)
	})

	//////////////////////////////////////////////////////////////
	it('should login a student and check for coordinates', function(){
		o_c.to_student(ptor);
		o_c.open_course_whole(ptor);
		o_c.open_tray(ptor);
		o_c.open_lectures(ptor);
		youtube.seek(ptor, 50);
		expect_quiz(ptor);
		check_drag_questions_coord(ptor, d_q1_x, d_q1_y, d_q2_x, d_q2_y, d_q3_x, d_q3_y);
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
		o_c.sign_in(ptor, "mena.happy@yahoo.com", params.password, o_c.feedback);
	})

	//test
	//////////////////////////////////////////////////////////////
	it('should open the course', function(){
		o_c.open_course_whole(ptor);
		o_c.open_tray(ptor);
		o_c.open_lectures(ptor);
		student.open_module_number(ptor, 1);
		//o_c.open_item(ptor, 1)
		check_notes_ele_no(ptor, 3);
	})
})

function check_notes_ele_no(ptor, no){
	locator.by_repeater(ptor, 'l in module_lectures').then(function(ele){
		expect(ele.length).toEqual(no);
	})
}