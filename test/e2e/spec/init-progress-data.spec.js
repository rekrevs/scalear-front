

xdescribe("teacher", function(){

	it('should create a new module', function(){
		teacher.add_module(ptor);
		// o_c.press_content_navigator(ptor)
	})
	// it('should open the created module', function(){
	// 	teacher.open_module(ptor, 2)
	// })
	it('should rename the module created', function(){
		// ptor.sleep(2000)
		teacher.rename_module(ptor, 'New Module 2')
	})

	it('should add a lecture', function(){
		teacher.add_lecture(ptor);
		o_c.press_content_navigator(ptor);
		ptor.sleep(2000)
		// ptor.sleep(2000)
		teacher.init_lecture(ptor, 'New Lecture','http://www.youtube.com/watch?v=xGcG4cp2yzY')
	})
	// it('should open the created lecture', function(){
	// 	teacher.open_item(ptor, 2, 1);
	// })
	// it('should set the url for the lecture', function(){
	// 	teacher.initialize_lecture(ptor, 'http://www.youtube.com/watch?v=xGcG4cp2yzY')
	// })
	// it('should seek the video', function(){

	// 	o_c.scroll(ptor, 200)
	// })
	it('should seek and add an over video quiz MCQ', function(){
		youtube.seek(ptor, 10)
		teacher.create_invideo_mcq_quiz(ptor);
		teacher.rename_invideo_quiz('MCQ QUIZ')
		o_c.scroll_to_top(ptor)
		teacher.make_mcq_questions(ptor, q1_x, q1_y, q2_x, q2_y, q3_x, q3_y);
		// teacher.exit_invideo_quiz()
		o_c.scroll_to_top(ptor)

		// quiz_ov.create_mcq_quiz(ptor)
		// lecture_middle.rename_quiz(ptor, 1, 'MCQ QUIZ')
		// o_c.scroll_to_top(ptor)
		// quiz_ov.make_mcq_questions(ptor, 50, 50, 50, 100, 50, 150)
		// lecture_middle.exit_quiz(ptor)
	})

	// it('should seek the video', function(){
	// 	youtube.seek(ptor, 20)
	// 	o_c.scroll(ptor, 200)
	// })
	it('should seek and add an over video quiz OCQ', function(){
		youtube.seek(ptor, 20)
		teacher.create_invideo_ocq_quiz(ptor);
		teacher.rename_invideo_quiz('OCQ QUIZ')
		o_c.scroll_to_top(ptor)
		teacher.make_ocq_questions(ptor, q1_x, q1_y, q2_x, q2_y, q3_x, q3_y);
		// teacher.exit_invideo_quiz()
		o_c.scroll_to_top(ptor)

		// quiz_ov.create_ocq_quiz(ptor)
		// lecture_middle.rename_quiz(ptor, 3, 'OCQ QUIZ')
		// o_c.scroll_to_top(ptor)
		// quiz_ov.make_ocq_questions(ptor, 50, 50, 50, 100, 50, 150)
		// lecture_middle.exit_quiz(ptor)
	})

	// it('should seek the video', function(){
	// 	youtube.seek(ptor, 30)
	// 	o_c.scroll(ptor, 200)
	// })
	it('should seek and add an over video quiz DRAG', function(){
			youtube.seek(ptor, 30)
			teacher.create_invideo_drag_quiz(ptor);
			teacher.rename_invideo_quiz('DRAG QUIZ')
			o_c.scroll_to_top(ptor)
			teacher.make_drag_questions(ptor, d_q1_x, d_q1_y, d_q2_x, d_q2_y, d_q3_x, d_q3_y);
			// teacher.exit_invideo_quiz()
			o_c.scroll_to_top(ptor)

		// quiz_ov.create_drag_quiz(ptor)
		// lecture_middle.rename_quiz(ptor, 5, 'DRAG QUIZ')
		// o_c.scroll_to_top(ptor)
		// quiz_ov.make_drag_questions(ptor, 50, 50, 50, 100, 50, 150)
		// lecture_middle.exit_quiz(ptor)
	})
	// it('should scroll to the top', function(){
	// 	o_c.scroll_to_top(ptor)
	// })
	// it('should add another lecture', function(){
	// 	teacher.add_lecture(ptor, 2);
	// })
	it('should add another lecture', function(){
		teacher.add_lecture(ptor);
		o_c.press_content_navigator(ptor);
		ptor.sleep(2000)
		// ptor.sleep(2000)
		teacher.init_lecture(ptor, 'New Lecture Text','http://www.youtube.com/watch?v=xGcG4cp2yzY')

	})
	// it('should open the created lecture', function(){
	// 	teacher.open_item(ptor, 2, 2);
	// })
	// it('should rename the lecture', function(){
	// 	teacher.rename_item(ptor, 'New Lecture Text')
	// })
	// it('should set the url for the lecture', function(){
	// 	teacher.initialize_lecture(ptor, 'http://www.youtube.com/watch?v=xGcG4cp2yzY')
	// })

	// it('should seek the video', function(){
	// 	youtube.seek(ptor, 10)
	// })

	it('make lecture not in order', function(){
		teacher.open_lecture_settings()
        teacher.change_lecture_inorder()
    })

	it('should seek and add an over video TEXT quiz MCQ', function(){
		youtube.seek(ptor, 10)
		teacher.create_invideo_mcq_text_quiz(ptor);
		teacher.rename_invideo_quiz('MCQ TEXT QUIZ')
		o_c.scroll_to_top(ptor)
		teacher.make_mcq_text_questions(ptor);
		// teacher.exit_invideo_quiz()
		o_c.scroll_to_top(ptor)

		// o_c.scroll(ptor, 200)
		// quiz_ov_text.create_mcq_quiz(ptor)
		// o_c.scroll(ptor, -200)
		// lecture_middle.rename_quiz(ptor, 1, 'MCQ TEXT QUIZ')
		// o_c.scroll_to_top(ptor)
		// quiz_ov_text.make_mcq_questions(ptor)
		// lecture_middle.exit_quiz(ptor)
	})

	// it('should seek the video', function(){
	// 	youtube.seek(ptor, 20)
	// })
	it('should seek and add an over video TEXT quiz OCQ', function(){
		youtube.seek(ptor, 20)
		teacher.create_invideo_ocq_text_quiz(ptor);
		teacher.rename_invideo_quiz('OCQ TEXT QUIZ')
		o_c.scroll_to_top(ptor)
		teacher.make_ocq_text_questions(ptor);
		// teacher.exit_invideo_quiz()
		o_c.scroll_to_top(ptor)

		// quiz_ov_text.create_ocq_quiz(ptor)
		// lecture_middle.rename_quiz(ptor, 3, 'OCQ TEXT QUIZ')

		// quiz_ov_text.make_ocq_questions(ptor)
		// lecture_middle.exit_quiz(ptor)
	})

	// it('should seek the video', function(){
	// 	youtube.seek(ptor, 30)
	// })
	it('should seek and add an over video TEXT quiz DRAG', function(){
		youtube.seek(ptor, 30)
		teacher.create_invideo_drag_text_quiz(ptor);
		teacher.rename_invideo_quiz('DRAG TEXT QUIZ')
		o_c.scroll_to_top(ptor)
		teacher.make_drag_text_questions(ptor);
		// teacher.exit_invideo_quiz()
		o_c.scroll_to_top(ptor)

		// quiz_ov_text.create_drag_quiz(ptor)
		// lecture_middle.rename_quiz(ptor, 5, 'DRAG TEXT QUIZ')
		// o_c.scroll_to_top(ptor)
		// quiz_ov_text.make_drag_questions(ptor)
		// lecture_middle.exit_quiz(ptor)
	})


	// it('should scroll to the top', function(){
	// 	o_c.scroll_to_top(ptor)
	// })
	it('should add another lecture', function(){
		teacher.add_lecture(ptor, 1);
		o_c.press_content_navigator(ptor);
		ptor.sleep(2000)
		// ptor.sleep(2000)
		teacher.init_lecture(ptor, 'New Lecture Surveys','http://www.youtube.com/watch?v=xGcG4cp2yzY')
	})
	// it('should open the created lecture', function(){
	// 	teacher.open_item(ptor, 2, 3);
	// })
	// it('should rename the lecture', function(){
	// 	teacher.rename_item(ptor, 'New Lecture Surveys')
	// })
	// it('should set the url for the lecture', function(){
	// 	teacher.initialize_lecture(ptor, 'http://www.youtube.com/watch?v=xGcG4cp2yzY')
	// })

	// it('should seek the video', function(){
	// 	youtube.seek(ptor, 10)
	// })
	it('should seek and add an over video MCQ Survey', function(){
		youtube.seek(ptor, 10)
		teacher.create_invideo_mcq_survey(ptor);
		teacher.rename_invideo_quiz('MCQ SURVEY')
		o_c.scroll_to_top(ptor)
		teacher.make_mcq_survey_questions(ptor, q1_x, q1_y, q2_x, q2_y, q3_x, q3_y);
		// teacher.exit_invideo_quiz()
		o_c.scroll_to_top(ptor)

		// o_c.scroll(ptor, 200)
		// survey_ov.create_mcq_survey(ptor)
		// o_c.scroll(ptor, -200)
		// lecture_middle.rename_quiz(ptor, 1, 'MCQ SURVEY')
		// o_c.scroll_to_top(ptor)
		// survey_ov.make_mcq_survey_questions(ptor, 50, 50, 50, 100, 50, 150)
		// lecture_middle.exit_quiz(ptor)
	})

	// it('should seek the video', function(){
	// 	youtube.seek(ptor, 20)
	// 	o_c.scroll(ptor, 300)
	// })
	it('should seek and add an over video OCQ Survey', function(){
		youtube.seek(ptor, 20)
		teacher.create_invideo_ocq_survey(ptor);
		teacher.rename_invideo_quiz('OCQ SURVEY')
		o_c.scroll_to_top(ptor)
		teacher.make_ocq_survey_questions(ptor, q1_x, q1_y, q2_x, q2_y, q3_x, q3_y);
		// teacher.exit_invideo_quiz()
		o_c.scroll_to_top(ptor)
		// survey_ov.create_ocq_survey(ptor)
		// o_c.scroll(ptor, 200)
		// lecture_middle.rename_quiz(ptor, 3, 'OCQ SURVEY')
		// o_c.scroll_to_top(ptor)
		// survey_ov.make_ocq_survey_questions(ptor, 50, 50, 50, 100, 50, 150)
		// lecture_middle.exit_quiz(ptor)
	})

	// it('should scroll to top', function(){
	// 	o_c.scroll_to_top(ptor)
	// })
	it('should add a normal quiz', function(){
		teacher.add_quiz(ptor);
	})

	it('make quiz not required', function(){
        teacher.change_quiz_required()
    })
	// //------
	// // it('should open the first module', function(){
	// // 	teacher.open_module(ptor, 1)
	// // })
	// //------
	// it('should open the quiz', function(){
	// 	teacher.open_item(ptor, 2, 4)
	// })

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
		teacher.add_quiz_question_free(ptor, 'free question')
	})

	it('should add a MATCH question', function(){
		teacher.add_quiz_question_free(ptor, 'match question', 'match answer')
	})
	it('should add a DRAG question', function(){
		teacher.add_quiz_question_drag(ptor, 'drag question', 2)
	})
	it('should save the quiz', function(){
		teacher.save_quiz(ptor)
		o_c.scroll_to_top(ptor)
	})
	// it('should scroll to the top', function(){
	// 	o_c.scroll_to_top(ptor)
	// })



	it('should add a normal REQUIRED quiz', function(){
		teacher.add_quiz(ptor);
	})
	// //------
	// // it('should open the first module', function(){
	// // 	teacher.open_module(ptor, 1)
	// // })
	// //------
	// it('should open the quiz', function(){
	// 	teacher.open_item(ptor, 2, 5)
	// })
	it('should rename the quiz', function(){
		teacher.rename_item(ptor, 'New Required Quiz')
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
		teacher.add_quiz_question_free(ptor, 'free question')
	})

	it('should add a MATCH question', function(){
		teacher.add_quiz_question_free(ptor, 'match question', 'match answer')
	})
	it('should add a DRAG question', function(){
		teacher.add_quiz_question_drag(ptor, 'drag question', 2)
	})
	it('should save the quiz', function(){
		teacher.save_quiz(ptor)
		o_c.scroll_to_top(ptor)
	})



	// it('should scroll to the top', function(){
	// 	o_c.scroll_to_top(ptor)
	// })
	it('should add a normal survey', function(){
		teacher.add_survey(ptor)
	})

	// it('should open the survey', function(){
	// 	teacher.open_item(ptor, 2, 6)
	// })

	it('should add a FIRST header', function(){
		teacher.add_survey_header(ptor, 'first header')
	})
	it('should add a MCQ question for the SURVEY', function(){
		teacher.add_survey_question_mcq(ptor, 'mcq question', 2)
	})
	it('should add a SECOND header', function(){
		teacher.add_survey_header(ptor, 'second header')
	})
	it('should add an OCQ question for the SURVEY', function(){
		teacher.add_survey_question_ocq(ptor, 'ocq question', 2)
	})
	it('should add a FREE question for the SURVEY', function(){
		teacher.add_survey_question_free(ptor, 'free question')
	})
	// it('should scroll to bottom', function(){
	// 	o_c.scroll_to_bottom(ptor)
	// })
	it('should save the survey', function(){
		teacher.save_survey(ptor)
		o_c.scroll_to_top(ptor)
	})

	it('should get the enrollment key and enroll student', function(){
		teacher.get_key_and_enroll(ptor, params.student1.email, params.password);
		o_c.to_teacher(ptor);
		o_c.open_course_list(ptor);
        o_c.open_course(ptor, 1);
        teacher.get_key_and_enroll(ptor, params.student2.email, params.password);

	})

	it('should logout', function(){
		o_c.logout(ptor);
	})

})

xdescribe('First Student', function(){

	it('should sign in', function(){
		// o_c.press_login(ptor);
		o_c.sign_in(ptor, params.student1.email, params.password);
	})
	it('should open the first course', function(){
		o_c.open_course_list(ptor);
        o_c.open_course(ptor, 1);
	})
	// it('should go to the courseware page', function(){
	// 	o_c.open_tray(ptor)
	// 	o_c.open_lectures(ptor)
	// })

	//WATCH THE FIRST LECTURE
	it('should seek the video to 10%', function(){
		youtube.press_play(ptor)
		youtube.seek(ptor, 9.5)
		waitForOnTop(ptor)
	})
	it('should expect MCQ quiz', function(){
		student.expect_quiz(ptor)
	})
	it('should solve the quiz correctly', function(){
		student.answer_invideo_mcq(ptor, 1)
		student.answer_invideo_mcq(ptor, 3)
		student.answer_quiz(ptor)
	})
	it('wait for the voting question', function(){
		waitForVoting(ptor)
	})
	it('should request that the question not be reviewed in class', function(){
		request_review_inclass(ptor, 0)
	})
	it('should seek the video to 20%', function(){
		youtube.press_play(ptor)
		youtube.seek(ptor, 19.5)
		// youtube.press_play(ptor)
		waitForOnTop(ptor)
	})
	it('should expect an OCQ quiz', function(){
		student.expect_quiz(ptor)
	})
	it('should solve the quiz incorrectly', function(){
		student.answer_invideo_ocq(ptor, 1)
		student.answer_quiz(ptor)
	})
	it('wait for the voting question', function(){
		waitForVoting(ptor)
	})
	it('should request that the question be reviewed in class', function(){
		request_review_inclass(ptor, 1)
	})
	it('should seek the video to 30%', function(){
		youtube.press_play(ptor)
		youtube.seek(ptor, 29.5)
		// youtube.press_play(ptor)
		waitForOnTop(ptor)
	})
	it('should expect a DRAG quiz', function(){
		student.expect_quiz(ptor)
	})
	it('should solve the quiz correctly', function(){
		student.answer_drag_correct(ptor)
		student.answer_quiz(ptor)
	})
	it('wait for the voting question', function(){
		waitForVoting(ptor)
	})
	it('should request that the question not be reviewed in class', function(){
		request_review_inclass(ptor, 0)
	})

	it('should watch video and pass by all milestones', function(){
		youtube.press_play(ptor)
        youtube.seek(ptor, 25);
        ptor.sleep(10000)
        youtube.seek(ptor, 75);
        ptor.sleep(10000)
        youtube.seek(ptor, 99);
        ptor.sleep(10000)
	})


	//WATCH THE SECOND LECTURE
	it('should go to the second lecture', function(){
		go_to_next_item()
		// o_c.open_item(ptor, 2)
	})

	it('should seek the video to 10%', function(){
		youtube.press_play(ptor)
		youtube.seek(ptor, 9.5)
		waitForOnTop(ptor)
	})
	it('should expect MCQ TEXT quiz', function(){
		student.expect_quiz(ptor)
	})
	it('should solve the quiz incorrectly', function(){
		student.answer_invideo_mcq(ptor, 2)
		student.answer_quiz(ptor)
	})
	it('wait for the voting question', function(){
		waitForVoting(ptor)
	})
	it('should request that the question not be reviewed in class', function(){
		request_review_inclass(ptor, 1)
	})
	it('should seek the video to 20%', function(){
		youtube.press_play(ptor)
		youtube.seek(ptor, 19.5)
		// youtube.press_play(ptor)
		waitForOnTop(ptor)
	})
	it('should expect an OCQ TEXT quiz', function(){
		student.expect_quiz(ptor)
	})
	it('should solve the quiz incorrectly', function(){
		student.answer_invideo_ocq(ptor, 2)
		student.answer_quiz(ptor)
	})
	it('wait for the voting question', function(){
		waitForVoting(ptor)
	})
	it('should request that the question be reviewed in class', function(){
		request_review_inclass(ptor, 1)
	})
	it('should seek the video to 30%', function(){
		youtube.press_play(ptor)
		youtube.seek(ptor, 29.5)
		// youtube.press_play(ptor)
		waitForOnTop(ptor)
	})
	it('should expect a DRAG TEXT quiz', function(){
		student.expect_quiz(ptor)
	})
	it('should solve the quiz incorrectly', function(){
		student.answer_text_drag_incorrect(ptor)
		student.answer_quiz(ptor)
	})
	it('wait for the voting question', function(){
		waitForVoting(ptor)
	})
	it('should request that the question not be reviewed in class', function(){
		request_review_inclass(ptor, 1)
	})

	it('should watch video and pass by all milestones', function(){
		youtube.press_play(ptor)
        youtube.seek(ptor, 25);
        ptor.sleep(10000)
        youtube.seek(ptor, 75);
        ptor.sleep(10000)
        youtube.seek(ptor, 99);
        ptor.sleep(10000)
	})

	//WATCH THE THIRD LECTURE
	it('should go to the third lecture', function(){
		// o_c.open_item(ptor, 3)
		go_to_next_item()
	})

	it('should seek the video to 10%', function(){
		youtube.press_play(ptor)
		youtube.seek(ptor, 9.5)
		waitForOnTop(ptor)
	})
	it('should expect MCQ SURVEY quiz', function(){
		student.expect_quiz(ptor)
	})
	it('should select the first and second choices', function(){
		student.answer_invideo_mcq(ptor, 1)
		student.answer_invideo_mcq(ptor, 2)
		student.answer_quiz(ptor)
	})
	it('should seek the video to 20%', function(){
		youtube.press_play(ptor)
		youtube.seek(ptor, 19.5)
		// youtube.press_play(ptor)
		waitForOnTop(ptor)
	})
	it('should expect an OCQ SURVEY quiz', function(){
		student.expect_quiz(ptor)
	})
	it('should select the third choice', function(){
		student.answer_invideo_ocq(ptor, 2)
		student.answer_quiz(ptor)
	})

	it('should watch video and pass by all milestones', function(){
		youtube.press_play(ptor)
        youtube.seek(ptor, 25);
        ptor.sleep(10000)
        youtube.seek(ptor, 75);
        ptor.sleep(10000)
        youtube.seek(ptor, 99);
        ptor.sleep(10000)
	})

	//SOLVE THE FIRST QUIZ
	it('should open the quiz',function(){
		go_to_next_item()
	})

	it('should answer mcq incorrect', function(){
		student.mcq_answer(ptor, 2, 2);
		student.mcq_answer(ptor, 2, 3);
	})

	it('should answer ocq correct', function(){
		student.ocq_answer(ptor, 4, 1);
	})

	it('should answer free question', function(){
		student.free_match_answer(ptor, 5, 'free answer')
	})

	it('should answer match question', function(){
		student.free_match_answer(ptor, 6, 'match answer')
	})

	it('should answer drag correct', function(){
		ptor.sleep(3000);
		student.drag_answer(ptor, 7);
		ptor.sleep(3000);
	})

	it('should submit',function(){
		student.submit_normal_quiz(ptor);
		// ptor.sleep(10000)
	})

	// //SOLVE THE SECOND QUIZ
	it('should open the quiz',function(){
		go_to_next_item()
		// o_c.press_content_navigator(ptor);
		// ptor.sleep(2000)
		// o_c.open_module(ptor, 1);
		// o_c.open_item_from_navigator(1, 5);
		// o_c.press_content_navigator(ptor);
		// ptor.sleep(2000)
	})

	it('should answer mcq correct', function(){
		student.mcq_answer(ptor, 2, 1);
		student.mcq_answer(ptor, 2, 2);
	})

	it('should answer ocq incorrect', function(){
		student.ocq_answer(ptor, 4, 2);
	})

	it('should answer free question', function(){
		student.free_match_answer(ptor, 5, 'second free answer')
	})

	it('should answer match question', function(){
		student.free_match_answer(ptor, 6, "shouldn't match answer")
	})

	it('should answer drag correct', function(){
		ptor.sleep(3000);
		student.drag_answer(ptor, 7);
		ptor.sleep(3000);
	})

	it('should submit',function(){
		student.submit_normal_quiz(ptor);
		// ptor.sleep(10000)
	})
	// SOLVE THE SURVEY
	it('should open the survey',function(){
		go_to_next_item()
		// o_c.press_content_navigator(ptor);
		// ptor.sleep(2000)
		// o_c.open_item_from_navigator(1, 6);
		// o_c.press_content_navigator(ptor);
		// ptor.sleep(2000)
	})

	it('should select the second choice', function(){
		student.mcq_answer(ptor, 2, 1);
		student.mcq_answer(ptor, 2, 2);
	})

	it('should select the first choice', function(){
		student.ocq_answer(ptor, 4, 2);
	})

	it('should answer free question', function(){
		student.free_match_answer(ptor, 5, 'first student free answer')
	})

	it('should submit the survey',function(){
		student.save_survey(ptor);
		// ptor.sleep(10000)
	})

	it('should change to the second module', function(){
		// o_c.press_content_navigator(ptor);
		// ptor.sleep(2000)
		o_c.open_module(ptor, 2)
		o_c.press_content_navigator(ptor);
		ptor.sleep(2000)
	})
	// WATCH THE FIRST LECTURE
	it('should seek the video to 10%', function(){
		youtube.press_play(ptor)
		youtube.seek(ptor, 9.5)
		waitForOnTop(ptor)
	})
	it('should expect MCQ quiz', function(){
		student.expect_quiz(ptor)
	})
	it('should solve the quiz incorrectly', function(){
		student.answer_invideo_mcq(ptor, 1)
		student.answer_quiz(ptor)
	})
	it('wait for the voting question', function(){
		waitForVoting(ptor)
	})
	it('should request that the question not be reviewed in class', function(){
		request_review_inclass(ptor, 0)
	})
	it('should seek the video to 20%', function(){
		youtube.press_play(ptor)
		youtube.seek(ptor, 19.5)
		// youtube.press_play(ptor)
		waitForOnTop(ptor)
	})
	it('should expect an OCQ quiz', function(){
		student.expect_quiz(ptor)
	})
	it('should solve the quiz incorrectly', function(){
		student.answer_invideo_ocq(ptor, 1)
		student.answer_quiz(ptor)
	})
	it('wait for the voting question', function(){
		waitForVoting(ptor)
	})
	it('should request that the question be reviewed in class', function(){
		request_review_inclass(ptor, 1)
	})
	it('should seek the video to 30%', function(){
		youtube.press_play(ptor)
		youtube.seek(ptor, 29.5)
		// youtube.press_play(ptor)
		waitForOnTop(ptor)
	})
	it('should expect a DRAG quiz', function(){
		student.expect_quiz(ptor)
	})
	it('should solve the quiz correctly', function(){
		student.answer_drag_incorrect(ptor)
		student.answer_quiz(ptor)
	})
	it('wait for the voting question', function(){
		waitForVoting(ptor)
	})
	it('should request that the question not be reviewed in class', function(){
		request_review_inclass(ptor, 1)
	})

	it('should watch video and pass by all milestones', function(){
		youtube.press_play(ptor)
        youtube.seek(ptor, 25);
        ptor.sleep(10000)
        youtube.seek(ptor, 75);
        ptor.sleep(10000)
        youtube.seek(ptor, 99);
        ptor.sleep(10000)
	})

	//WATCH THE THIRD LECTURE
	it('should go to the third lecture', function(){
		o_c.open_item(ptor, 3)
		o_c.press_content_navigator(ptor);
		ptor.sleep(2000)
	})

	it('should seek the video to 10%', function(){
		youtube.press_play(ptor)
		youtube.seek(ptor, 9.5)
		waitForOnTop(ptor)
	})
	it('should expect MCQ SURVEY quiz', function(){
		student.expect_quiz(ptor)
	})
	it('should select the first and second choices', function(){
		student.answer_invideo_mcq(ptor, 3)
		student.answer_quiz(ptor)
	})
	it('should seek the video to 20%', function(){
		youtube.press_play(ptor)
		youtube.seek(ptor, 19.5)
		// youtube.press_play(ptor)
		waitForOnTop(ptor)
	})
	it('should expect an OCQ SURVEY quiz', function(){
		student.expect_quiz(ptor)
	})
	it('should select the third choice', function(){
		student.answer_invideo_ocq(ptor, 1)
		student.answer_quiz(ptor)
	})
	it('should watch video and pass by all milestones', function(){
		youtube.press_play(ptor)
        youtube.seek(ptor, 25);
        ptor.sleep(10000)
        youtube.seek(ptor, 75);
        ptor.sleep(10000)
        youtube.seek(ptor, 99);
        ptor.sleep(10000)
	})

	it('should log out', function(){
		o_c.logout(ptor)
	})
	//end test

	// // it('should delete course', function(){
	// // 	//should choose one of home() or home_teacher()
	// // 	//depending on the current state(student or teacher)
	// // 	o_c.home(ptor);
	// // 	teacher.delete_course(ptor);
	// // })
})

// xdescribe('Teacher', function(){
// 	it('should sign in', function(){
// 		// o_c.press_login(ptor);
// 		o_c.sign_in(ptor, params.teacher1.email, params.password);

// 	})
// 	it('should enroll second student', function(){
// 		o_c.open_course_list(ptor);
//         o_c.open_course(ptor, 1);
//         teacher.get_key_and_enroll(ptor, params.student2.email, params.password);
// 	})
// })

xdescribe('Second Student', function(){

	it('should sign in', function(){
		// o_c.press_login(ptor);
		o_c.sign_in(ptor, params.student2.email, params.password);
	})

	it('should open the first course', function(){
		o_c.open_course_list(ptor);
        o_c.open_course(ptor, 1);
	})
	// // it('should go to the courseware page', function(){
	// // 	o_c.open_tray(ptor)
	// // 	o_c.open_lectures(ptor)
	// // })

	//WATCH THE FIRST LECTURE
	it('should seek the video to 10%', function(){
		youtube.press_play(ptor)
		youtube.seek(ptor, 9.5)
		waitForOnTop(ptor)
	})
	it('should expect MCQ quiz', function(){
		student.expect_quiz(ptor)
	})
	it('should solve the quiz correctly', function(){
		student.answer_invideo_mcq(ptor, 1)
		student.answer_invideo_mcq(ptor, 3)
		student.answer_quiz(ptor)
	})
	it('wait for the voting question', function(){
		waitForVoting(ptor)
	})
	it('should request that the question not be reviewed in class', function(){
		request_review_inclass(ptor, 1)
	})
	it('should seek the video to 20%', function(){
		youtube.press_play(ptor)
		youtube.seek(ptor, 19.5)
		// youtube.press_play(ptor)
		waitForOnTop(ptor)
	})
	it('should expect an OCQ quiz', function(){
		student.expect_quiz(ptor)
	})
	it('should solve the quiz correctly', function(){
		student.answer_invideo_ocq(ptor, 2)
		student.answer_quiz(ptor)
	})
	it('wait for the voting question', function(){
		waitForVoting(ptor)
	})
	it('should request that the question be reviewed in class', function(){
		request_review_inclass(ptor, 0)
	})
	it('should seek the video to 30%', function(){
		youtube.press_play(ptor)
		youtube.seek(ptor, 29.5)
		// youtube.press_play(ptor)
		waitForOnTop(ptor)
	})
	it('should expect a DRAG quiz', function(){
		student.expect_quiz(ptor)
	})
	it('should solve the quiz correctly', function(){
		student.answer_drag_correct(ptor)
		student.answer_quiz(ptor)
	})
	it('wait for the voting question', function(){
		waitForVoting(ptor)
	})
	it('should request that the question not be reviewed in class', function(){
		request_review_inclass(ptor, 1)
	})

	it('should watch video and pass by all milestones', function(){
		youtube.press_play(ptor)
        youtube.seek(ptor, 25);
        ptor.sleep(10000)
        youtube.seek(ptor, 75);
        ptor.sleep(10000)
        youtube.seek(ptor, 99);
        ptor.sleep(10000)
	})

	//WATCH THE SECOND LECTURE
	it('should go to the second lecture', function(){
		o_c.open_item(ptor, 2)
	})

	it('should seek the video to 10%', function(){
		youtube.press_play(ptor)
		youtube.seek(ptor, 9.5)
		waitForOnTop(ptor)
	})
	it('should expect MCQ TEXT quiz', function(){
		student.expect_quiz(ptor)
	})
	it('should solve the quiz correctly', function(){
		student.answer_invideo_mcq(ptor, 1)
		student.answer_invideo_mcq(ptor, 3)
		student.answer_quiz(ptor)
	})
	it('wait for the voting question', function(){
		waitForVoting(ptor)
	})
	it('should request that the question not be reviewed in class', function(){
		request_review_inclass(ptor, 1)
	})
	it('should seek the video to 20%', function(){
		youtube.press_play(ptor)
		youtube.seek(ptor, 19.5)
		// youtube.press_play(ptor)
		waitForOnTop(ptor)
	})
	it('should expect an OCQ TEXT quiz', function(){
		student.expect_quiz(ptor)
	})
	it('should solve the quiz correctly', function(){
		student.answer_invideo_ocq(ptor, 1)
		student.answer_quiz(ptor)
	})
	it('wait for the voting question', function(){
		waitForVoting(ptor)
	})
	it('should request that the question not be reviewed in class', function(){
		request_review_inclass(ptor, 0)
	})
	it('should seek the video to 30%', function(){
		youtube.press_play(ptor)
		youtube.seek(ptor, 29.5)
		// youtube.press_play(ptor)
		waitForOnTop(ptor)
	})
	it('should expect a DRAG TEXT quiz', function(){
		student.expect_quiz(ptor)
	})
	it('should solve the quiz correctly', function(){
		student.answer_text_drag_correct(ptor)
		student.answer_quiz(ptor)
	})

	it('should watch video and pass by all milestones', function(){
		youtube.press_play(ptor)
        youtube.seek(ptor, 25);
        ptor.sleep(10000)
        youtube.seek(ptor, 75);
        ptor.sleep(10000)
        youtube.seek(ptor, 99);
        ptor.sleep(10000)
	})

	//WATCH THE THIRD LECTURE
	it('should go to the third lecture', function(){
		o_c.open_item(ptor, 3)
	})

	it('should seek the video to 10%', function(){
		youtube.press_play(ptor)
		youtube.seek(ptor, 9.5)
		waitForOnTop(ptor)
	})
	it('should expect MCQ SURVEY quiz', function(){
		student.expect_quiz(ptor)
	})
	it('should select the first choices', function(){
		student.answer_invideo_mcq(ptor, 1)
		student.answer_quiz(ptor)
	})
	it('should seek the video to 20%', function(){
		youtube.press_play(ptor)
		youtube.seek(ptor, 19.5)
		// youtube.press_play(ptor)
		waitForOnTop(ptor)
	})
	it('should expect an OCQ SURVEY quiz', function(){
		student.expect_quiz(ptor)
	})
	it('should select the third choice', function(){
		student.answer_invideo_ocq(ptor, 2)
		student.answer_quiz(ptor)
	})
	it('should watch video and pass by all milestones', function(){
		youtube.press_play(ptor)
        youtube.seek(ptor, 25);
        ptor.sleep(10000)
        youtube.seek(ptor, 75);
        ptor.sleep(10000)
        youtube.seek(ptor, 99);
        ptor.sleep(10000)
	})

	//SOLVE THE SECOND QUIZ
	it('should open the quiz',function(){
		o_c.open_item(ptor, 5);
	})

	it('should answer mcq correct', function(){
		student.mcq_answer(ptor, 2, 1);
		student.mcq_answer(ptor, 2, 2);
	})

	it('should answer ocq correct', function(){
		student.ocq_answer(ptor, 4, 1);
	})

	it('should answer free question', function(){
		student.free_match_answer(ptor, 5, 'second second free answer')
	})

	it('should answer match question', function(){
		student.free_match_answer(ptor, 6, 'match answer')
	})

	it('should answer drag correct', function(){
		ptor.sleep(3000);
		student.drag_answer(ptor, 7);
		ptor.sleep(3000);
	})

	it('should submit',function(){
		student.submit_normal_quiz(ptor);
		// ptor.sleep(10000)
	})

	//add discussions data and confused
	it('should open the first lecture again', function(){
		o_c.scroll_to_top(ptor)
		o_c.open_item(ptor, 1)
		// o_c.press_content_navigator(ptor);
		// o_c.open_module(ptor, 1);
		// o_c.open_item_from_navigator(1, 1);
		// o_c.press_content_navigator(ptor);
		// ptor.sleep(1000)
	})
	// it('should open the first lecture', function(){
	// 	o_c.open_item(ptor, 1)
	// })
	it('should seek to 40%', function(){
		youtube.seek(ptor, 40)
	})
	it('should ask a private question', function(){
		discussions.ask_private_question(ptor, 'private question by second student')
	})
	it('should seek to 45%', function(){
		youtube.seek(ptor, 45)
	})
	it('should add a confused', function(){
		student.press_confused_btn(ptor)
	})
	it('should move to the second lecture', function(){
		o_c.open_item(ptor, 2)
	})
	it('should seek to 25%', function(){
		youtube.seek(ptor, 25)
	})
	it('should add a confused', function(){
		student.press_confused_btn(ptor)
	})
	it('should seek to 40%', function(){
		youtube.seek(ptor, 40)
	})
	it('should add a public question', function(){
		discussions.ask_public_question(ptor, 'public question by second student')
	})
	it('should logout', function(){
		o_c.logout(ptor)
	})
});

xdescribe('First Student', function(){
	it('should sign in', function(){
		// o_c.press_login(ptor);
		o_c.sign_in(ptor, params.student1.email, params.password);
	})

	it('should open the first course', function(){
		o_c.open_course_list(ptor);
        o_c.open_course(ptor, 1);
	})
	// it('should go to the courseware page', function(){
	// 	o_c.open_tray(ptor)
	// 	o_c.open_lectures(ptor)
	// })
	it('should open the first module second lecture', function(){
		o_c.press_content_navigator(ptor);
		ptor.sleep(2000)
		o_c.open_module(ptor, 1);
		o_c.open_item_from_navigator(1, 2);
		// o_c.press_content_navigator(ptor);

	})
	// it('should open the second lecture', function(){
	// 	o_c.open_item(ptor, 2)
	// })
	it('should upvote the question asked by the Second Student', function(){
		discussions.vote_up(ptor, 1)
	})
	it('should add a comment on the question asked by the Second Student', function(){
		discussions.comment(ptor, 1, 'comment by first student')
	})
	it('should go to the third lecture', function(){
		o_c.open_item(ptor, 3)
	})
	it('should seek to 25%', function(){
		youtube.seek(ptor, 25)
	})
	it('should add a really confused', function(){
		student.add_really_confused(ptor)
		// ptor.sleep(1000)
		// student.press_confused_btn(ptor)
	})
	it('should logout', function(){
		// o_c.home(ptor)
		// o_c.open_tray(ptor)
		o_c.logout(ptor)
	})
})

/////////////////////////////////////////////////////////
//				test specific functions
/////////////////////////////////////////////////////////
// function create_lecture(lecture_name, lecture_url, module_no, item_no){
// 	teacher.add_lecture(ptor, module_no);
// 	teacher.open_item(ptor, module_no, item_no);
// 	teacher.rename_item(ptor, lecture_name)
// 	teacher.initialize_lecture(ptor,  lecture_name, lecture_url, true);

// }


// function expect_quiz(ptor){
// 	locator.by_tag(ptor,'check_answer').findElement(protractor.By.tagName('input')).then(function(check_answer_btn){
// 		expect(check_answer_btn.isDisplayed()).toEqual(true);
// 	})
// }

// function answer_quiz(ptor){
// 	locator.by_tag(ptor,'check_answer').findElement(protractor.By.tagName('input')).then(function(answer_btn){
// 		answer_btn.click();
// 	})
// }
// function check_answer_given_answer_order(ptor, choice_no){
// 	locator.by_id(ptor,'ontop').findElements(protractor.By.tagName('input')).then(function(check_boxes){
// 		check_boxes[choice_no-1].click();
// 	})
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

// function check_answer_correct(ptor){
// 	locator.by_classname(ptor,'popover-content').then(function(popover){
// 		expect(popover.getText()).toContain('Correct');
// 	})
// }

// function check_answer_incorrect(ptor){
// 	locator.by_classname(ptor,'popover-content').then(function(popover){
// 		expect(popover.getText()).toContain('Incorrect');
// 	})
// }


// function answer_drag_correct(ptor){
// 	for (var i = 0; i < 3; i++) {
// 		locator.by_classname(ptor,'drag-sort').findElements(protractor.By.className('ui-icon-arrowthick-2-n-s')).then(function(arrow){
// 			locator.by_classname(ptor,'drag-sort').findElements(protractor.By.tagName('li')).then(function(answer){
// 				answer[0].getText().then(function (text){
// 					if(text == 'answer 3'){
// 					 	ptor.actions().dragAndDrop(arrow[0], arrow[2]).perform();
// 					}
// 					else if(text == 'answer 2'){
// 					 	ptor.actions().dragAndDrop(arrow[0], arrow[1]).perform();
// 					}
// 				})
// 				answer[1].getText().then(function (text){
// 					if(text == 'answer 1'){
// 						ptor.actions().dragAndDrop(arrow[1], arrow[0]).perform();
// 					}
// 					else if(text == 'answer 3'){
// 					 	ptor.actions().dragAndDrop(arrow[1], arrow[2]).perform();
// 					}
// 				})
// 				answer[2].getText().then(function (text){
// 					if(text == 'answer 1'){
// 					 	ptor.actions().dragAndDrop(arrow[2], arrow[0]).perform();
// 					}
// 					else if(text == 'answer 2'){
// 					 	ptor.actions().dragAndDrop(arrow[2], arrow[1]).perform();
// 					}
// 				})
// 			})
// 		})
// 	}
// 	ptor.sleep(3000);
// }

// function answer_drag_incorrect(ptor){
// 	locator.by_classname(ptor,'drag-sort').findElements(protractor.By.className('ui-icon-arrowthick-2-n-s')).then(function(arrow){
// 		locator.by_classname(ptor,'drag-sort').findElements(protractor.By.tagName('li')).then(function(answer){
// 			answer[0].getText().then(function (text){
// 				if(text == 'answer 1'){
// 				 	ptor.actions().dragAndDrop(arrow[2], arrow[0]).perform();
// 				}
// 			})
// 			answer[1].getText().then(function (text){
// 				if(text == 'answer 1'){
// 					ptor.actions().dragAndDrop(arrow[1], arrow[2]).perform();
// 				}
// 				else if(text == 'answer 3'){
// 				 	ptor.actions().dragAndDrop(arrow[1], arrow[0]).perform();
// 				}
// 			})
// 			answer[2].getText().then(function (text){
// 				if(text == 'answer 3'){
// 				 	ptor.actions().dragAndDrop(arrow[0], arrow[2]).perform();
// 				}
// 				if(text == 'answer 1'){
// 				 	ptor.actions().dragAndDrop(arrow[2], arrow[0]).perform();
// 				}
// 			})
// 		})
// 	})
// 	ptor.sleep(3000);
// }


// function answer_drag_correct_ov(ptor){
// 	//shuffle answers so all becomes clickable
// 	locator.s_by_classname(ptor,'dragged').then(function(answer){
// 			ptor.actions().mouseMove(answer[0]).perform();
// 			ptor.actions().mouseMove({x: 5, y: 5}).perform();
// 		 	ptor.actions().mouseDown().perform();
// 		 	ptor.actions().mouseMove({x: 100, y: 0}).perform();
// 		 	ptor.actions().mouseUp().perform();

// 			ptor.actions().mouseMove(answer[1]).perform();
// 			ptor.actions().mouseMove({x: 5, y: 5}).perform();
// 		 	ptor.actions().mouseDown().perform();
// 		 	ptor.actions().mouseMove({x: 200, y: 0}).perform();
// 		 	ptor.actions().mouseUp().perform();

// 		 	ptor.actions().mouseMove(answer[2]).perform();
// 			ptor.actions().mouseMove({x: 5, y: 5}).perform();
// 		 	ptor.actions().mouseDown().perform();
// 		 	ptor.actions().mouseMove({x: 300, y: 0}).perform();
// 		 	ptor.actions().mouseUp().perform();
// 		})
// 	locator.s_by_classname(ptor, 'ui-droppable').then(function(place){
// 		locator.s_by_classname(ptor,'dragged').then(function(answer){
// 			answer[0].getText().then(function (text){
// 				ptor.actions().mouseMove(answer[0]).perform();
// 				ptor.actions().mouseMove({x: 5, y: 5}).perform();
// 			 	ptor.actions().mouseDown().perform();
// 			 	ptor.actions().mouseMove(place[(text.split(' ')[1]-1)]).perform();
// 			 	ptor.actions().mouseMove({x: 5, y: 5}).perform();
// 			 	ptor.actions().mouseUp().perform();
// 			})

// 			answer[1].getText().then(function (text){
// 				ptor.actions().mouseMove(answer[1]).perform();
// 				ptor.actions().mouseMove({x: 5, y: 5}).perform();
// 			 	ptor.actions().mouseDown().perform();
// 			 	ptor.actions().mouseMove(place[(text.split(' ')[1]-1)]).perform();
// 			 	ptor.actions().mouseMove({x: 5, y: 5}).perform();
// 			 	ptor.actions().mouseUp().perform();
// 			})

// 			answer[2].getText().then(function (text){
// 				ptor.actions().mouseMove(answer[2]).perform();
// 				ptor.actions().mouseMove({x: 5, y: 5}).perform();
// 			 	ptor.actions().mouseDown().perform();
// 			 	ptor.actions().mouseMove(place[(text.split(' ')[1]-1)]).perform();
// 			 	ptor.actions().mouseMove({x: 5, y: 5}).perform();
// 			 	ptor.actions().mouseUp().perform();
// 			})
// 		})
// 	})
// 		ptor.sleep(3000);
// }



// function answer_drag_incorrect_ov(ptor){
// 	//shuffle answers so all becomes clickable
// 	locator.s_by_classname(ptor,'dragged').then(function(answer){
// 			ptor.actions().mouseMove(answer[0]).perform();
// 			ptor.actions().mouseMove({x: 5, y: 5}).perform();
// 		 	ptor.actions().mouseDown().perform();
// 		 	ptor.actions().mouseMove({x: 100, y: 0}).perform();
// 		 	ptor.actions().mouseUp().perform();

// 			ptor.actions().mouseMove(answer[1]).perform();
// 			ptor.actions().mouseMove({x: 5, y: 5}).perform();
// 		 	ptor.actions().mouseDown().perform();
// 		 	ptor.actions().mouseMove({x: 200, y: 0}).perform();
// 		 	ptor.actions().mouseUp().perform();

// 		 	ptor.actions().mouseMove(answer[2]).perform();
// 			ptor.actions().mouseMove({x: 5, y: 5}).perform();
// 		 	ptor.actions().mouseDown().perform();
// 		 	ptor.actions().mouseMove({x: 300, y: 0}).perform();
// 		 	ptor.actions().mouseUp().perform();
// 		})
// 	locator.s_by_classname(ptor, 'ui-droppable').then(function(place){
// 		locator.s_by_classname(ptor,'dragged').then(function(answer){
// 			answer[0].getText().then(function (text){
// 				ptor.actions().mouseMove(answer[2]).perform();
// 				ptor.actions().mouseMove({x: 5, y: 5}).perform();
// 			 	ptor.actions().mouseDown().perform();
// 			 	ptor.actions().mouseMove(place[(text.split(' ')[1]-1)]).perform();
// 			 	ptor.actions().mouseMove({x: 5, y: 5}).perform();
// 			 	ptor.actions().mouseUp().perform();
// 			})

// 			answer[1].getText().then(function (text){
// 				ptor.actions().mouseMove(answer[0]).perform();
// 				ptor.actions().mouseMove({x: 5, y: 5}).perform();
// 			 	ptor.actions().mouseDown().perform();
// 			 	ptor.actions().mouseMove(place[(text.split(' ')[1]-1)]).perform();
// 			 	ptor.actions().mouseMove({x: 5, y: 5}).perform();
// 			 	ptor.actions().mouseUp().perform();
// 			})

// 			answer[2].getText().then(function (text){
// 				ptor.actions().mouseMove(answer[1]).perform();
// 				ptor.actions().mouseMove({x: 5, y: 5}).perform();
// 			 	ptor.actions().mouseDown().perform();
// 			 	ptor.actions().mouseMove(place[(text.split(' ')[1]-1)]).perform();
// 			 	ptor.actions().mouseMove({x: 5, y: 5}).perform();
// 			 	ptor.actions().mouseUp().perform();
// 			})
// 		})
// 	})
// 		ptor.sleep(3000);
// }

function request_review_inclass(ptor, which){
	locator.by_classname(ptor,'review_panel').then(function(popover){
		if(which == 0){
			popover.findElements(protractor.By.className('button')).then(function(buttons){
				buttons[1].click();
			})
		}
		else if(which == 1){
			popover.findElement(protractor.By.className('button')).then(function(yes){
				yes.click();
			})
		}
	})
}

function waitForVoting(ptor){
	ptor.wait(function() {
        return ptor.findElement(protractor.By.className('review_panel')).then(function(panel) {
            return panel.isDisplayed().then(function(displayed) {
                return displayed
            });
        });
    });
}


// function saveSurvey(ptor){
// 	locator.by_xpath(ptor, '//*[@id="middle"]/center/form/input[1]').then(function(save_button){
// 		save_button.click().then(function(){
// 			o_c.feedback(ptor, 'successfully saved')
// 		})
// 	})
// }

function waitForOnTop(ptor){
	ptor.wait(function(){
		return ptor.findElement(protractor.By.className('ontop')).then(function(ontop){
			return ontop.isDisplayed().then(function(displayed){
				return displayed
			})
		})
	})
}

// function press_confused_btn(ptor){
// 	locator.by_classname(ptor, 'confusedDiv').then(function(btn){
// 		btn.click().then(function(){
// 			locator.by_classname(ptor, 'alert-success').then(function(thanks){
// 				expect(thanks.isDisplayed()).toBe(true)
// 			})
// 		})
// 	})
// }

function go_to_next_item(){
	element(by.id('next_button')).click()
}












