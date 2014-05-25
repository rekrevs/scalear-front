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
var params = ptor.params
// ptor.driver.manage().window().maximize();
ptor.driver.manage().window().setSize(ptor.params.width, ptor.params.height);
ptor.driver.manage().window().setPosition(0, 0);



describe("teacher", function(){

	// it('should sign in', function(){
	// 	o_c.sign_in(ptor, params.teacher_mail, params.password, o_c.feedback);
	// })

	// it('should create_course', function(){
	// 	teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites, o_c.feedback);
	// })

	// it('should get the enrollment key and enroll student', function(){
	// 	teacher.get_key_and_enroll(ptor);
	// })
	//test
	//------
	it('should sign in', function(){
		o_c.sign_in(ptor, params.teacher_mail, params.password, o_c.feedback);
	})
	//------
	it('should open the course', function(){
		o_c.open_course_whole(ptor);
	})
	it('should create a new module', function(){
		teacher.add_module(ptor, o_c.feedback);
	})
	it('should open the created module', function(){
		teacher.open_module(ptor, 1)
	})
	//-------------------
	// it('should add a lecture', function(){
	// 	teacher.add_lecture(ptor, 1, o_c.feedback)
	// })
	//-------------------
	it('should create a lecture', function(){
		teacher.create_lecture(ptor, null, 'http://www.youtube.com/watch?v=xGcG4cp2yzY', o_c.feedback);
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
// -----------------------------------
	it('should scroll to the top', function(){
		o_c.scroll_to_top(ptor)
	})
	it('should add another lecture', function(){
		teacher.add_lecture(ptor, 1, o_c.feedback);
	})
	it('should open the created lecture', function(){
		teacher.open_item(ptor, 1, 2);
	})
	it('should rename the lecture', function(){
		teacher.rename_item(ptor, 'New Lecture Text', o_c.feedback)
	})
	it('should set the url for the lecture', function(){
		teacher.initialize_lecture(ptor, 'http://www.youtube.com/watch?v=xGcG4cp2yzY')
	})
	
	it('should seek the video', function(){
		youtube.seek(ptor, 10)
	})
	it('should add an over video TEXT quiz MCQ', function(){
		o_c.scroll(ptor, 200)
		quiz_ov_text.create_mcq_quiz(ptor, o_c.feedback)
		o_c.scroll(ptor, -200)
		lecture_middle.rename_quiz(ptor, 1, 'MCQ TEXT QUIZ')
		o_c.scroll_to_top(ptor)
		quiz_ov_text.make_mcq_questions(ptor, o_c.feedback)
		lecture_middle.exit_quiz(ptor, o_c.feedback)
	})

	it('should seek the video', function(){
		youtube.seek(ptor, 20)
	})
	it('should add an over video TEXT quiz OCQ', function(){
		quiz_ov_text.create_ocq_quiz(ptor, o_c.feedback)
		lecture_middle.rename_quiz(ptor, 3, 'OCQ TEXT QUIZ')
		o_c.scroll_to_top(ptor)
		quiz_ov_text.make_ocq_questions(ptor, o_c.feedback)
		lecture_middle.exit_quiz(ptor, o_c.feedback)
	})

	it('should seek the video', function(){
		youtube.seek(ptor, 30)
	})
	it('should add an over video TEXT quiz DRAG', function(){
		quiz_ov_text.create_drag_quiz(ptor, o_c.feedback)
		lecture_middle.rename_quiz(ptor, 5, 'DRAG TEXT QUIZ')
		o_c.scroll_to_top(ptor)
		quiz_ov_text.make_drag_questions(ptor, o_c.feedback)
		lecture_middle.exit_quiz(ptor, o_c.feedback)
	})

	
	// -----------------------------------
	it('should scroll to the top', function(){
		o_c.scroll_to_top(ptor)
	})
	it('should add another lecture', function(){
		teacher.add_lecture(ptor, 1, o_c.feedback);
	})
	it('should open the created lecture', function(){
		teacher.open_item(ptor, 1, 3);
	})
	it('should rename the lecture', function(){
		teacher.rename_item(ptor, 'New Lecture Surveys', o_c.feedback)
	})
	it('should set the url for the lecture', function(){
		teacher.initialize_lecture(ptor, 'http://www.youtube.com/watch?v=xGcG4cp2yzY')
	})
	
	it('should seek the video', function(){
		youtube.seek(ptor, 10)
	})
	it('should add an over video MCQ Survey', function(){
		o_c.scroll(ptor, 200)
		survey_ov.create_mcq_survey(ptor, o_c.feedback)
		o_c.scroll(ptor, -200)
		lecture_middle.rename_quiz(ptor, 1, 'MCQ SURVEY')
		o_c.scroll_to_top(ptor)
		survey_ov.make_mcq_survey_questions(ptor, 50, 50, 50, 100, 50, 150, o_c.feedback)
		lecture_middle.exit_quiz(ptor, o_c.feedback)
	})

	it('should seek the video', function(){
		youtube.seek(ptor, 20)
	})
	it('should add an over video OCQ Survey', function(){
		survey_ov.create_ocq_survey(ptor, o_c.feedback)
		lecture_middle.rename_quiz(ptor, 3, 'OCQ SURVEY')
		o_c.scroll_to_top(ptor)
		survey_ov.make_ocq_survey_questions(ptor, 50, 50, 50, 100, 50, 150, o_c.feedback)
		lecture_middle.exit_quiz(ptor, o_c.feedback)
	})
	//-----------------






	it('should scroll to top', function(){
		o_c.scroll_to_top(ptor)
	})
	it('should add a normal quiz', function(){
		teacher.add_quiz(ptor, 1, o_c.feedback);
	})
	//------
	// it('should open the first module', function(){
	// 	teacher.open_module(ptor, 1)
	// })
	//------
	it('should open the quiz', function(){
		teacher.open_item(ptor, 1, 4)
	})

	it('should add a FIRST header', function(){
		teacher.add_quiz_header(ptor, 'first header')
	})
	it('should add a MCQ question', function(){
		teacher.add_quiz_question_mcq(ptor, 'mcq question', 2, [1, 2])
	})
	it('should add a SECOND header', function(){
		teacher.add_quiz_header(ptor, 'second header')
	})
	it('should add an OCQ question', function(){
		teacher.add_quiz_question_ocq(ptor, 'ocq question', 2, 1)
	})
	it('should add a FREE question', function(){
		teacher.add_quiz_question_free(ptor, 'free question', false)
	})
	
	it('should add a MATCH question', function(){
		teacher.add_quiz_question_free(ptor, 'match question', true, 'match answer')
	})
	it('should add a DRAG question', function(){
		teacher.add_quiz_question_drag(ptor, 'drag question', 2)
	})
	it('should save the quiz', function(){
		teacher.save_quiz(ptor, o_c.feedback)
	})
	it('should scroll to the top', function(){
		o_c.scroll_to_top(ptor)
	})



	it('should add a normal REQUIRED quiz', function(){
		teacher.add_quiz(ptor, 1, o_c.feedback);
	})
	//------
	// it('should open the first module', function(){
	// 	teacher.open_module(ptor, 1)
	// })
	//------
	it('should open the quiz', function(){
		teacher.open_item(ptor, 1, 5)
	})
	it('should rename the quiz', function(){
		teacher.rename_item(ptor, 'New Required Quiz', o_c.feedback)
	})
	it('should make the quiz required', function(){
		teacher.make_quiz_required(ptor, o_c.feedback)
	})

	it('should add a FIRST header', function(){
		teacher.add_quiz_header(ptor, 'first header')
	})
	it('should add a MCQ question', function(){
		teacher.add_quiz_question_mcq(ptor, 'mcq question', 2, [1, 2])
	})
	it('should add a SECOND header', function(){
		teacher.add_quiz_header(ptor, 'second header')
	})
	it('should add an OCQ question', function(){
		teacher.add_quiz_question_ocq(ptor, 'ocq question', 2, 1)
	})
	it('should add a FREE question', function(){
		teacher.add_quiz_question_free(ptor, 'free question', false)
	})
	
	it('should add a MATCH question', function(){
		teacher.add_quiz_question_free(ptor, 'match question', true, 'match answer')
	})
	it('should add a DRAG question', function(){
		teacher.add_quiz_question_drag(ptor, 'drag question', 2)
	})
	it('should save the quiz', function(){
		teacher.save_quiz(ptor, o_c.feedback)
	})



	it('should scroll to the top', function(){
		o_c.scroll_to_top(ptor)
	})
	it('should add a normal survey', function(){
		teacher.add_survey(ptor, 1, o_c.feedback)
	})

	it('should open the survey', function(){
		teacher.open_item(ptor, 1, 6)
	})

	it('should add a FIRST header', function(){
		teacher.add_quiz_header(ptor, 'first header')
	})
	it('should add a MCQ question for the SURVEY', function(){
		teacher.add_survey_question_mcq(ptor, 'mcq question', 2)
	})
	it('should add a SECOND header', function(){
		teacher.add_quiz_header(ptor, 'second header')
	})
	it('should add an OCQ question for the SURVEY', function(){
		teacher.add_survey_question_ocq(ptor, 'ocq question', 2)
	})
	it('should add a FREE question for the SURVEY', function(){
		teacher.add_survey_question_free(ptor, 'free question')
	})
	it('should scroll to bottom', function(){
		o_c.scroll_to_bottom(ptor)
	})
	it('should save the survey', function(){
		teacher.save_survey(ptor, o_c.feedback)
	})



	//-----------THE SECOND MODULE------------//
	it('should scroll to the top', function(){
		o_c.scroll_to_top(ptor)
	})
	it('should create a new module', function(){
		teacher.add_module(ptor, o_c.feedback);
	})
	it('should open the created module', function(){
		teacher.open_module(ptor, 2)
	})
	it('should rename the module created', function(){
		teacher.rename_module(ptor, 'New Module 2')
	})
	
	//-------------------
	// it('should add a lecture', function(){
	// 	teacher.add_lecture(ptor, 1, o_c.feedback)
	// })
	//-------------------
	it('should add a lecture', function(){
		teacher.add_lecture(ptor, 2, o_c.feedback);
	})
	it('should open the created lecture', function(){
		teacher.open_item(ptor, 2, 1);
	})
	it('should set the url for the lecture', function(){
		teacher.initialize_lecture(ptor, 'http://www.youtube.com/watch?v=xGcG4cp2yzY')
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
// -----------------------------------
	it('should scroll to the top', function(){
		o_c.scroll_to_top(ptor)
	})
	it('should add another lecture', function(){
		teacher.add_lecture(ptor, 2, o_c.feedback);
	})
	it('should open the created lecture', function(){
		teacher.open_item(ptor, 2, 2);
	})
	it('should rename the lecture', function(){
		teacher.rename_item(ptor, 'New Lecture Text', o_c.feedback)
	})
	it('should set the url for the lecture', function(){
		teacher.initialize_lecture(ptor, 'http://www.youtube.com/watch?v=xGcG4cp2yzY')
	})
	
	it('should seek the video', function(){
		youtube.seek(ptor, 10)
	})
	it('should add an over video TEXT quiz MCQ', function(){
		o_c.scroll(ptor, 200)
		quiz_ov_text.create_mcq_quiz(ptor, o_c.feedback)
		o_c.scroll(ptor, -200)
		lecture_middle.rename_quiz(ptor, 1, 'MCQ TEXT QUIZ')
		o_c.scroll_to_top(ptor)
		quiz_ov_text.make_mcq_questions(ptor, o_c.feedback)
		lecture_middle.exit_quiz(ptor, o_c.feedback)
	})

	it('should seek the video', function(){
		youtube.seek(ptor, 20)
	})
	it('should add an over video TEXT quiz OCQ', function(){
		quiz_ov_text.create_ocq_quiz(ptor, o_c.feedback)
		lecture_middle.rename_quiz(ptor, 3, 'OCQ TEXT QUIZ')
		o_c.scroll_to_top(ptor)
		quiz_ov_text.make_ocq_questions(ptor, o_c.feedback)
		lecture_middle.exit_quiz(ptor, o_c.feedback)
	})

	it('should seek the video', function(){
		youtube.seek(ptor, 30)
	})
	it('should add an over video TEXT quiz DRAG', function(){
		quiz_ov_text.create_drag_quiz(ptor, o_c.feedback)
		lecture_middle.rename_quiz(ptor, 5, 'DRAG TEXT QUIZ')
		o_c.scroll_to_top(ptor)
		quiz_ov_text.make_drag_questions(ptor, o_c.feedback)
		lecture_middle.exit_quiz(ptor, o_c.feedback)
	})

	
	// -----------------------------------
	it('should scroll to the top', function(){
		o_c.scroll_to_top(ptor)
	})
	it('should add another lecture', function(){
		teacher.add_lecture(ptor, 2, o_c.feedback);
	})
	it('should open the created lecture', function(){
		teacher.open_item(ptor, 2, 3);
	})
	it('should rename the lecture', function(){
		teacher.rename_item(ptor, 'New Lecture Surveys', o_c.feedback)
	})
	it('should set the url for the lecture', function(){
		teacher.initialize_lecture(ptor, 'http://www.youtube.com/watch?v=xGcG4cp2yzY')
	})
	
	it('should seek the video', function(){
		youtube.seek(ptor, 10)
	})
	it('should add an over video MCQ Survey', function(){
		o_c.scroll(ptor, 200)
		survey_ov.create_mcq_survey(ptor, o_c.feedback)
		o_c.scroll(ptor, -200)
		lecture_middle.rename_quiz(ptor, 1, 'MCQ SURVEY')
		o_c.scroll_to_top(ptor)
		survey_ov.make_mcq_survey_questions(ptor, 50, 50, 50, 100, 50, 150, o_c.feedback)
		lecture_middle.exit_quiz(ptor, o_c.feedback)
	})

	it('should seek the video', function(){
		youtube.seek(ptor, 20)
	})
	it('should add an over video OCQ Survey', function(){
		survey_ov.create_ocq_survey(ptor, o_c.feedback)
		lecture_middle.rename_quiz(ptor, 3, 'OCQ SURVEY')
		o_c.scroll_to_top(ptor)
		survey_ov.make_ocq_survey_questions(ptor, 50, 50, 50, 100, 50, 150, o_c.feedback)
		lecture_middle.exit_quiz(ptor, o_c.feedback)
	})
	//-----------------






	it('should scroll to top', function(){
		o_c.scroll_to_top(ptor)
	})
	it('should add a normal quiz', function(){
		teacher.add_quiz(ptor, 2, o_c.feedback);
	})
	//------
	// it('should open the first module', function(){
	// 	teacher.open_module(ptor, 1)
	// })
	//------
	it('should open the quiz', function(){
		teacher.open_item(ptor, 2, 4)
	})

	it('should add a FIRST header', function(){
		teacher.add_quiz_header(ptor, 'first header')
	})
	it('should add a MCQ question', function(){
		teacher.add_quiz_question_mcq(ptor, 'mcq question', 2, [1, 2])
	})
	it('should add a SECOND header', function(){
		teacher.add_quiz_header(ptor, 'second header')
	})
	it('should add an OCQ question', function(){
		teacher.add_quiz_question_ocq(ptor, 'ocq question', 2, 1)
	})
	it('should add a FREE question', function(){
		teacher.add_quiz_question_free(ptor, 'free question', false)
	})
	
	it('should add a MATCH question', function(){
		teacher.add_quiz_question_free(ptor, 'match question', true, 'match answer')
	})
	it('should add a DRAG question', function(){
		teacher.add_quiz_question_drag(ptor, 'drag question', 2)
	})
	it('should save the quiz', function(){
		teacher.save_quiz(ptor, o_c.feedback)
	})
	it('should scroll to the top', function(){
		o_c.scroll_to_top(ptor)
	})



	it('should add a normal REQUIRED quiz', function(){
		teacher.add_quiz(ptor, 2, o_c.feedback);
	})
	//------
	// it('should open the first module', function(){
	// 	teacher.open_module(ptor, 1)
	// })
	//------
	it('should open the quiz', function(){
		teacher.open_item(ptor, 2, 5)
	})
	it('should rename the quiz', function(){
		teacher.rename_item(ptor, 'New Required Quiz', o_c.feedback)
	})
	it('should make the quiz required', function(){
		teacher.make_quiz_required(ptor, o_c.feedback)
	})

	it('should add a FIRST header', function(){
		teacher.add_quiz_header(ptor, 'first header')
	})
	it('should add a MCQ question', function(){
		teacher.add_quiz_question_mcq(ptor, 'mcq question', 2, [1, 2])
	})
	it('should add a SECOND header', function(){
		teacher.add_quiz_header(ptor, 'second header')
	})
	it('should add an OCQ question', function(){
		teacher.add_quiz_question_ocq(ptor, 'ocq question', 2, 1)
	})
	it('should add a FREE question', function(){
		teacher.add_quiz_question_free(ptor, 'free question', false)
	})
	
	it('should add a MATCH question', function(){
		teacher.add_quiz_question_free(ptor, 'match question', true, 'match answer')
	})
	it('should add a DRAG question', function(){
		teacher.add_quiz_question_drag(ptor, 'drag question', 2)
	})
	it('should save the quiz', function(){
		teacher.save_quiz(ptor, o_c.feedback)
	})



	it('should scroll to the top', function(){
		o_c.scroll_to_top(ptor)
	})
	it('should add a normal survey', function(){
		teacher.add_survey(ptor, 2, o_c.feedback)
	})

	it('should open the survey', function(){
		teacher.open_item(ptor, 2, 6)
	})

	it('should add a FIRST header', function(){
		teacher.add_quiz_header(ptor, 'first header')
	})
	it('should add a MCQ question for the SURVEY', function(){
		teacher.add_survey_question_mcq(ptor, 'mcq question', 2)
	})
	it('should add a SECOND header', function(){
		teacher.add_quiz_header(ptor, 'second header')
	})
	it('should add an OCQ question for the SURVEY', function(){
		teacher.add_survey_question_ocq(ptor, 'ocq question', 2)
	})
	it('should add a FREE question for the SURVEY', function(){
		teacher.add_survey_question_free(ptor, 'free question')
	})
	it('should scroll to bottom', function(){
		o_c.scroll_to_bottom(ptor)
	})
	it('should save the survey', function(){
		teacher.save_survey(ptor, o_c.feedback)
	})

	it('should switch to student', function(){
		o_c.to_student(ptor)
	})

})

// describe('Student', function(){
// 	it('should open the first course', function(){
// 		o_c.open_course_whole(ptor)
// 	})
// 	it('should go to the courseware page', function(){
// 		o_c.open_tray(ptor)
// 		o_c.open_lectures(ptor)
// 	})

// 	//SOLVE THE QUIZ
// 	// it('should open the quiz',function(){
// 	// 	o_c.open_item(ptor, 1);
// 	// })

// 	// it('should answer mcq incorrect', function(){
// 	// 	student.mcq_answer(ptor, 2, 2);
// 	// 	student.mcq_answer(ptor, 2, 3);
// 	// })

// 	// it('should answer ocq correct', function(){
// 	// 	student.ocq_answer(ptor, 4, 1);
// 	// })

// 	// it('should answer free question', function(){
// 	// 	student.free_match_answer(ptor, 5, 'free answer')
// 	// })

// 	// it('should answer match question', function(){
// 	// 	student.free_match_answer(ptor, 6, 'match answer')
// 	// })	

// 	// it('should answer drag correct', function(){
// 	// 	ptor.sleep(3000);
// 	// 	student.drag_answer(ptor, 7);
// 	// 	ptor.sleep(3000);
// 	// })

// 	// it('should submit',function(){
// 	// 	student.submit_normal_quiz(ptor);
// 	// 	// ptor.sleep(10000)
// 	// })
	

// 	//end test

// 	// it('should delete course', function(){
// 	// 	//should choose one of home() or home_teacher() 
// 	// 	//depending on the current state(student or teacher)
// 	// 	o_c.home(ptor);
// 	// 	teacher.delete_course(ptor, o_c.feedback);
// 	// })
// })

/////////////////////////////////////////////////////////
//				test specific functions
/////////////////////////////////////////////////////////
function create_lecture(lecture_name, lecture_url, module_no, item_no){
	teacher.add_lecture(ptor, module_no, o_c.feedback);
	teacher.open_item(ptor, module_no, item_no);
	teacher.rename_item(ptor, lecture_name, o_c.feedback)
	teacher.initialize_lecture(ptor,  lecture_name, lecture_url, o_c.feedback, true);

}













