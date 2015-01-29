var ContentNavigator = require('./pages/content_navigator');
var CourseList = require('./pages/course_list');
var NormalQuiz = require('./pages/normal_quiz');
var Video = require('./pages/video');
var Header = require('./pages/header');
var Login = require('./pages/login');
var CourseEditor = require('./pages/course_editor');
var StudentLecture = require('./pages/student/lecture');
var StudentQuiz = require('./pages/student/quiz');
var scroll_top = require('./lib/utils').scroll_top;
var scroll_bottom = require('./lib/utils').scroll_bottom;
var sleep = require('./lib/utils').sleep;

var params = browser.params;

var course_list = new CourseList()
var video = new Video();
var quiz = new NormalQuiz();
var header = new Header()
var login_page = new Login()
var course_editor = new CourseEditor()
var student_lec = new StudentLecture()
var student_quiz = new StudentQuiz()

describe("Solve Course",function(){
	xdescribe("Teacher",function(){
		var navigator = new ContentNavigator(1)
		it("should open course",function(){
	        course_list.open()
	        course_list.open_course(1)
	    })	    
	    it("should open first quiz in first module",function(){
	    	navigator.module(1).open()
	    	navigator.module(1).open_item(4)
	    	sleep(1000)
	    	scroll_top()
	    })
    	it('should make quiz not in order', function(){
			course_editor.change_quiz_inorder()
		})
	    it('make quiz not required', function(){
	        course_editor.change_quiz_required()
	    })
	    it("should open second lecture in second module",function(){
	    	navigator.module(2).open()
	    	navigator.module(2).open_item(2)
	    	sleep(1000)
	    	scroll_top()
	    })
	    it('should make lecture not in order', function(){
			course_editor.open_lecture_settings()
	        course_editor.change_lecture_inorder()
	    })
	    it("should open first quiz in second module",function(){
	    	navigator.module(2).open_item(4)
	    	sleep(1000)
	    	scroll_top()
	    })
	    it('should make quiz not required', function(){
	        course_editor.change_quiz_required()
	    })
	    it("should increase retries number",function(){
	    	course_editor.change_quiz_retries(1)
			expect(course_editor.quiz_retries.getText()).toEqual(""+num)
	    })

	    it("should logout",function(){
			header.logout()
		})
	})

	describe("First Student",function(){
		it("should login", function(){
			header.logout()
			login_page.sign_in(params.student_mail, params.password)
		})
		var navigator = new ContentNavigator(0)
		it('should open first course', function(){
			course_list.open()
			course_list.open_course(1)
		})
		describe("First Module",function(){
			it("should seek video to 9%",function(){
				video.wait_till_ready()
				video.play()
				video.seek(9)
				student_lec.wait_for_quiz()
			})
			it('should expect MCQ quiz', function(){
				expect(student_lec.check_answer_button.isDisplayed()).toEqual(true);
			})
			it("should answer MCQ quiz",function(){
				student_lec.mark_answer(1)
				student_lec.mark_answer(3)
				student_lec.check_answer()
			})
			it("should check that it is correct",function(){
				expect(student_lec.notification).toContain("Correct")
			})
			it("should check explanation",function(){
				student_lec.show_explanation(1)
				expect(student_lec.explanation_title).toContain("Correct")
				expect(student_lec.explanation_content).toContain("explanation 1")
				student_lec.show_explanation(2)
				expect(student_lec.explanation_title).toContain("Incorrect")
				expect(student_lec.explanation_content).toContain("explanation 2")
				student_lec.show_explanation(3)
				expect(student_lec.explanation_title).toContain("Correct")
				expect(student_lec.explanation_content).toContain("explanation 3")
			})
			it('wait for the voting question', function(){
				student_lec.wait_for_vote()
			})
			it('should request that the question not be reviewed in class', function(){
				student_lec.decline_review_inclass()
			})

			it("should seek video to 19%",function(){
				video.play()
				video.seek(19)
				student_lec.wait_for_quiz()
			})
			it('should expect OCQ quiz', function(){
				expect(student_lec.check_answer_button.isDisplayed()).toEqual(true);
			})
			it("should answer OCQ quiz",function(){
				student_lec.mark_answer(1)
				student_lec.check_answer()
			})
			it("should check that it is incorrect",function(){
				expect(student_lec.notification).toContain("Incorrect")
			})
			it("should check explanation",function(){
				student_lec.show_explanation(1)
				expect(student_lec.explanation_title).toContain("Incorrect")
				expect(student_lec.explanation_content).toContain("explanation 1")
			})
			it('wait for the voting question', function(){
				student_lec.wait_for_vote()
			})
			it('should request that the question not be reviewed in class', function(){
				student_lec.request_review_inclass()
			})

			it("should seek video to 29%",function(){
				video.play()
				video.seek(29)
				student_lec.wait_for_quiz()
			})
			it('should expect DRAG quiz', function(){
				expect(student_lec.check_answer_button.isDisplayed()).toEqual(true);
			})
			it("should answer DRAG quiz",function(){
				student_lec.drag_answer(1)
				student_lec.drag_answer(2)
				student_lec.drag_answer(3)
				student_lec.check_answer()
			})
			it("should check that it is correct",function(){
				expect(student_lec.notification).toContain("Correct")
			})
			it('wait for the voting question', function(){
				student_lec.wait_for_vote()
			})
			it('should request that the question not be reviewed in class', function(){
				student_lec.decline_review_inclass()
			})
			it('should watch video and pass by all milestones', function(){
				video.play()
				expect(student_lec.next_button.isDisplayed()).toEqual(false)
		        video.seek(99);
		        student_lec.wait_for_video_end()
		        expect(student_lec.next_button.isDisplayed()).toEqual(true)
			})

			it('should go to the second lecture', function(){
				student_lec.next()
			})
			it("should seek video to 9%",function(){
				video.wait_till_ready()
				video.play()
				video.seek(9)
				student_lec.wait_for_quiz()
			})
			it('should expect Text MCQ quiz', function(){
				expect(student_lec.check_answer_button.isDisplayed()).toEqual(true);
			})
			it("should answer Text MCQ quiz",function(){
				student_lec.mark_answer(2)
				student_lec.check_answer()
			})
			it("should check that it is incorrect",function(){
				expect(student_lec.notification).toContain("Incorrect")
			})
			it("should check explanation",function(){
				student_lec.show_explanation(2)
				expect(student_lec.explanation_title).toContain("Incorrect")
				expect(student_lec.explanation_content).toContain("explanation 2")
			})
			it('wait for the voting question', function(){
				student_lec.wait_for_vote()
			})
			it('should request that the question not be reviewed in class', function(){
				student_lec.request_review_inclass()
			})

			it("should seek video to 19%",function(){
				video.play()
				video.seek(19)
				student_lec.wait_for_quiz()
			})
			it('should expect Text OCQ quiz', function(){
				expect(student_lec.check_answer_button.isDisplayed()).toEqual(true);
			})
			it("should answer Text OCQ quiz",function(){
				student_lec.mark_answer(2)
				student_lec.check_answer()
			})
			it("should check that it is correct",function(){
				expect(student_lec.notification).toContain("Correct")
			})
			it("should check explanation",function(){
				student_lec.show_explanation(2)
				expect(student_lec.explanation_title).toContain("Correct")
				expect(student_lec.explanation_content).toContain("explanation 2")
			})
			it('wait for the voting question', function(){
				student_lec.wait_for_vote()
			})
			it('should request that the question not be reviewed in class', function(){
				student_lec.request_review_inclass()
			})

			it("should seek video to 29%",function(){
				video.play()
				video.seek(29)
				student_lec.wait_for_quiz()
			})
			it('should expect Text DRAG quiz', function(){
				expect(student_lec.check_answer_button.isDisplayed()).toEqual(true);
			})
			it("should answer Text DRAG quiz",function(){
				student_lec.answer_text_drag_incorrect()
				student_lec.check_answer()
			})
			it('wait for the voting question', function(){
				student_lec.wait_for_vote()
			})
			it('should request that the question not be reviewed in class', function(){
				student_lec.request_review_inclass()
			})
			it('should watch video and pass by all milestones', function(){
				video.play()
				expect(student_lec.next_button.isDisplayed()).toEqual(false)
		        video.seek(99);
		        student_lec.wait_for_video_end()
		        expect(student_lec.next_button.isDisplayed()).toEqual(true)
			})

			it('should go to the Third lecture', function(){
				student_lec.next()
			})

			it("should seek video to 9%",function(){
				video.wait_till_ready()
				video.play()
				video.seek(9)
				student_lec.wait_for_quiz()
			})
			it('should expect MCQ Survey', function(){
				expect(student_lec.check_answer_button.isDisplayed()).toEqual(true);
			})
			it("should answer MCQ Survey",function(){
				student_lec.mark_answer(1)
				student_lec.mark_answer(2)
				student_lec.check_answer()
			})
			it("should check thank you message",function(){
				expect(student_lec.notification).toContain("Thank you for your answer")
			})
			it("should check that there is no popover",function(){
				student_lec.show_explanation(1)
				expect(student_lec.explanation_popover.isPresent()).toEqual(false)
				student_lec.show_explanation(2)
				expect(student_lec.explanation_popover.isPresent()).toEqual(false)
				student_lec.show_explanation(3)
				expect(student_lec.explanation_popover.isPresent()).toEqual(false)
			})

			it("should seek video to 19%",function(){
				video.play()
				video.seek(19)
				student_lec.wait_for_quiz()
			})
			it('should expect OCQ Survey', function(){
				expect(student_lec.check_answer_button.isDisplayed()).toEqual(true);
			})
			it("should answer OCQ Survey",function(){
				student_lec.mark_answer(2)
				student_lec.check_answer()
			})
			it("should check thank you message",function(){
				expect(student_lec.notification).toContain("Thank you for your answer")
			})
			it("should check that there is no popover",function(){
				student_lec.show_explanation(1)
				expect(student_lec.explanation_popover.isPresent()).toEqual(false)
				student_lec.show_explanation(2)
				expect(student_lec.explanation_popover.isPresent()).toEqual(false)
				student_lec.show_explanation(3)
				expect(student_lec.explanation_popover.isPresent()).toEqual(false)
			})
			it('should watch video and pass by all milestones', function(){
				video.play()
				expect(student_lec.next_button.isDisplayed()).toEqual(false)
		        video.seek(99);
		        student_lec.wait_for_video_end()
		        expect(student_lec.next_button.isDisplayed()).toEqual(true)
			})
			it('should go to the first quiz', function(){
				student_lec.next()
			})
		 	it('should check number of attempts',function(){
		        expect(student_quiz.status)).toContain(0+"/"+2)
		    })

		    it('should check submit button enabled',function(){
		        expect(student_quiz.submit_button.isEnabled()).toBe(true)
		    })
		    it("should check for optional tag",function(){
		    	expect(student_quiz.optional_tag.isDisplayed()).toBe(true)
    			expect(student_quiz.optional_tag.getText()).toEqual("Optional")
		    })

			it('should answer mcq incorrect', function(){
				student_quiz.question(2).mark_answer(2)
				student_quiz.question(2).mark_answer(3)
			})
			it('should answer ocq incorrect', function(){
				student_quiz.question(4).mark_answer(2)
			})
			it('should answer free question', function(){
				student_quiz.question(5).type_free_text('free answer')
			})
			it('should answer match question', function(){
				student_quiz.question(6).type_free_text('mat answer')
			})
			it('should answer drag incorrect', function(){
				scroll_bottom()
				student_quiz.question(7).drag_answer_incorrect()
			})
			it('should submit quiz',function(){
				student_quiz.submit();
			})
			it("should check for results",function(){
				expect(student_quiz.incorrect.count()).toEqual(4)
				expect(student_quiz.under_review.count()).toEqual(1)
			})
			it('should check quiz status after submit',function(){
		        scroll_top()
		        expect(student_quiz.status)).toContain(1+"/"+2)
				expect(student_quiz.submit_button.isEnabled()).toBe(true)
		    })

			it('should answer mcq incorrect', function(){
				student_quiz.question(2).mark_answer(1)
				student_quiz.question(2).mark_answer(3)
			})
			it('should answer ocq incorrect', function(){
				student_quiz.question(4).mark_answer(1)
			})
			it('should answer free question', function(){
				student_quiz.question(5).type_free_text('free answer')
			})
			it('should answer match question', function(){
				student_quiz.question(6).type_free_text('match answer')
			})
			it('should answer drag incorrect', function(){
				scroll_bottom()
				student_quiz.question(7).drag_answer_correct()
			})
			it('should submit quiz',function(){
				student_quiz.submit();
			})
			it("should check for results",function(){
				expect(student_quiz.incorrect.count()).toEqual(0)
				expect(student_quiz.correct.count()).toEqual(4)
				expect(student_quiz.under_review.count()).toEqual(1)
			})
			it('should check quiz status after submit',function(){
		        scroll_top()
		        expect(student_quiz.retries).toContain('Used up all 2 attempts')
		        expect(student_quiz.warning_msg).toContain("You've submitted the quiz and have no more attempts left")
				expect(student_quiz.submit_button.isEnabled()).toBe(false)
		    })

			it("should go to second quiz",function(){
				student_quiz.next()
			})
			it('should check number of attempts',function(){
		        expect(student_quiz.status)).toContain(0+"/"+1)
		    })

		    it('should check submit button enabled',function(){
		        expect(student_quiz.submit_button.isEnabled()).toBe(true)
		    })
		    it("should check for optional tag",function(){
		    	expect(student_quiz.optional_tag.isPresent()).toBe(false)
		    })
			it('should answer mcq incorrect', function(){
				student_quiz.question(2).mark_answer(1)
				student_quiz.question(2).mark_answer(3)
			})
			it('should answer ocq correct', function(){
				student_quiz.question(4).mark_answer(2)
			})
			it('should answer free question', function(){
				student_quiz.question(5).type_free_text('second free answer')
			})
			it('should answer match question', function(){
				student_quiz.question(6).type_free_text("shouldn't match answer")
			})
			it('should answer drag correct', function(){
				scroll_bottom()
				student_quiz.question(7).drag_answer_correct()
			})
			it('should submit quiz',function(){
				student_quiz.submit();
			})
			it("should check for results",function(){
				expect(student_quiz.incorrect.count()).toEqual(2)
				expect(student_quiz.correct.count()).toEqual(2)
				expect(student_quiz.under_review.count()).toEqual(1)
			})
			it('should check quiz status after submit',function(){
		        scroll_top()
		        expect(student_quiz.retries).toContain('Used up all 1 attempts')
		        expect(student_quiz.warning_msg).toContain("You've submitted the quiz and have no more attempts left")
				expect(student_quiz.submit_button.isEnabled()).toBe(false)
		    })
			it("should go to first survey",function(){
				student_quiz.next()
			})
			it('should answer mcq incorrect', function(){
				student_quiz.question(2).mark_answer(1)
				student_quiz.question(2).mark_answer(2)
			})
			it('should answer ocq correct', function(){
				student_quiz.question(4).mark_answer(2)
			})
			it('should answer free question', function(){
				student_quiz.question(5).type_free_text('first student free answer')
			})
			it('should submit the survey',function(){
				student_quiz.save()
				navigator.set_status(1)
			})
		})
		xdescribe("Second Module",function(){
			it("should navigate to second module",function(){
				navigator.open()
				navigator.module(2).open()
				navigator.close()
			})
			it("should seek video to 9%",function(){
				video.wait_till_ready()
				video.play()
				video.seek(9)
				student_lec.wait_for_quiz()
			})
			it('should expect MCQ quiz', function(){
				expect(student_lec.check_answer_button.isDisplayed()).toEqual(true);
			})
			it("should answer MCQ quiz",function(){
				student_lec.mark_answer(1)
				student_lec.check_answer()
			})
			it("should check that it is incorrect",function(){
				expect(student_lec.notification).toContain("Incorrect")
			})
			it("should check explanation",function(){
				student_lec.show_explanation(1)
				expect(student_lec.explanation_title).toContain("Incorrect")
				expect(student_lec.explanation_content).toContain("explanation 1")
			})
			it('wait for the voting question', function(){
				student_lec.wait_for_vote()
			})
			it('should request that the question not be reviewed in class', function(){
				student_lec.decline_review_inclass()
			})

			it("should seek video to 19%",function(){
				video.play()
				video.seek(19)
				student_lec.wait_for_quiz()
			})
			it('should expect OCQ quiz', function(){
				expect(student_lec.check_answer_button.isDisplayed()).toEqual(true);
			})
			it("should answer OCQ quiz",function(){
				student_lec.mark_answer(1)
				student_lec.check_answer()
			})
			it("should check that it is incorrect",function(){
				expect(student_lec.notification).toContain("Incorrect")
			})
			it("should check explanation",function(){
				student_lec.show_explanation(1)
				expect(student_lec.explanation_title).toContain("Incorrect")
				expect(student_lec.explanation_content).toContain("explanation 1")
			})
			it('wait for the voting question', function(){
				student_lec.wait_for_vote()
			})
			it('should request that the question not be reviewed in class', function(){
				student_lec.request_review_inclass()
			})

			it("should seek video to 29%",function(){
				video.play()
				video.seek(29)
				student_lec.wait_for_quiz()
			})
			it('should expect DRAG quiz', function(){
				expect(student_lec.check_answer_button.isDisplayed()).toEqual(true);
			})
			it("should answer DRAG quiz",function(){
				student_lec.drag_answer(1,2)
				student_lec.drag_answer(2,3)
				student_lec.drag_answer(3,1)
				student_lec.check_answer()
			})
			it("should check that it is incorrect",function(){
				expect(student_lec.notification).toContain("Incorrect")
			})
			it('wait for the voting question', function(){
				student_lec.wait_for_vote()
			})
			it('should request that the question not be reviewed in class', function(){
				student_lec.request_review_inclass()
			})
			it('should watch video and pass by all milestones', function(){
				video.play()
				expect(student_lec.next_button.isDisplayed()).toEqual(false)
		        video.seek(99);
		        student_lec.wait_for_video_end()
		        expect(student_lec.next_button.isDisplayed()).toEqual(true)
		        navigator.set_status(1)
			})

			it("should navigate to second lectue in second module",function(){
				navigator.open()
				navigator.module(2).open_item(2)
				navigator.close()
			})
			it("should seek video to 9%",function(){
				video.wait_till_ready()
				video.play()
				video.seek(9)
				student_lec.wait_for_quiz()
			})
			it('should expect Text MCQ quiz', function(){
				expect(student_lec.check_answer_button.isDisplayed()).toEqual(true);
			})
			it("should answer Text MCQ quiz",function(){
				student_lec.mark_answer(2)
				student_lec.check_answer()
			})
			it("should check that it is incorrect",function(){
				expect(student_lec.notification).toContain("Incorrect")
			})
			it("should check explanation",function(){
				student_lec.show_explanation(2)
				expect(student_lec.explanation_title).toContain("Incorrect")
				expect(student_lec.explanation_content).toContain("explanation 2")
			})
			it('wait for the voting question', function(){
				student_lec.wait_for_vote()
			})
			it('should request that the question not be reviewed in class', function(){
				student_lec.request_review_inclass()
			})

			it("should seek video to 19%",function(){
				video.play()
				video.seek(19)
				student_lec.wait_for_quiz()
			})
			it('should expect Text OCQ quiz', function(){
				expect(student_lec.check_answer_button.isDisplayed()).toEqual(true);
			})
			it("should answer Text OCQ quiz",function(){
				student_lec.mark_answer(2)
				student_lec.check_answer()
			})
			it("should check that it is correct",function(){
				expect(student_lec.notification).toContain("Correct")
			})
			it("should check explanation",function(){
				student_lec.show_explanation(2)
				expect(student_lec.explanation_title).toContain("Correct")
				expect(student_lec.explanation_content).toContain("explanation 2")
			})
			it('wait for the voting question', function(){
				student_lec.wait_for_vote()
			})
			it('should request that the question not be reviewed in class', function(){
				student_lec.request_review_inclass()
			})

			it("should seek video to 29%",function(){
				video.play()
				video.seek(29)
				student_lec.wait_for_quiz()
			})
			it('should expect Text DRAG quiz', function(){
				expect(student_lec.check_answer_button.isDisplayed()).toEqual(true);
			})
			it("should answer Text DRAG quiz",function(){
				student_lec.answer_text_drag_incorrect()
				student_lec.check_answer()
			})
			it("should check that it is incorrect",function(){
				expect(student_lec.notification).toContain("Incorrect")
			})
			it('wait for the voting question', function(){
				student_lec.wait_for_vote()
			})
			it('should request that the question not be reviewed in class', function(){
				student_lec.request_review_inclass()
			})
			it('should watch video and pass by all milestones', function(){
				video.play()
				expect(student_lec.next_button.isDisplayed()).toEqual(false)
		        video.seek(99);
		        student_lec.wait_for_video_end()
		        expect(student_lec.next_button.isDisplayed()).toEqual(true)
		        navigator.set_status(1)
			})

			it("should navigate to third lectue in second module",function(){
				navigator.open()
				navigator.module(2).open_item(3)
				navigator.close()
			})

			it("should seek video to 9%",function(){
				video.wait_till_ready()
				video.play()
				video.seek(9)
				student_lec.wait_for_quiz()
			})
			it('should expect MCQ Survey', function(){
				expect(student_lec.check_answer_button.isDisplayed()).toEqual(true);
			})
			it("should answer MCQ Survey",function(){
				student_lec.mark_answer(1)
				student_lec.mark_answer(2)
				student_lec.check_answer()
			})
			it("should check thank you message",function(){
				expect(student_lec.notification).toContain("Thank you for your answer")
			})
			it("should check that there is no popover",function(){
				student_lec.show_explanation(1)
				expect(student_lec.explanation_popover.isPresent()).toEqual(false)
				student_lec.show_explanation(2)
				expect(student_lec.explanation_popover.isPresent()).toEqual(false)
				student_lec.show_explanation(3)
				expect(student_lec.explanation_popover.isPresent()).toEqual(false)
			})

			it("should seek video to 19%",function(){
				video.play()
				video.seek(19)
				student_lec.wait_for_quiz()
			})
			it('should expect OCQ Survey', function(){
				expect(student_lec.check_answer_button.isDisplayed()).toEqual(true);
			})
			it("should answer OCQ Survey",function(){
				student_lec.mark_answer(2)
				student_lec.check_answer()
			})
			it("should check thank you message",function(){
				expect(student_lec.notification).toContain("Thank you for your answer")
			})
			it("should check that there is no popover",function(){
				student_lec.show_explanation(1)
				expect(student_lec.explanation_popover.isPresent()).toEqual(false)
				student_lec.show_explanation(2)
				expect(student_lec.explanation_popover.isPresent()).toEqual(false)
				student_lec.show_explanation(3)
				expect(student_lec.explanation_popover.isPresent()).toEqual(false)
			})
			it('should watch video and pass by all milestones', function(){
				video.play()
				expect(student_lec.next_button.isDisplayed()).toEqual(false)
		        video.seek(99);
		        student_lec.wait_for_video_end()
		        expect(student_lec.next_button.isDisplayed()).toEqual(true)
			})
			it("should logout",function(){
				header.logout()
			})
		})
	})
	xdescribe("Second Student",function(){
		it("should login", function(){
			login_page.sign_in(params.student2_mail, params.password)
		})
		var navigator = new ContentNavigator(0)
		it('should open first course', function(){
			course_list.open()
			course_list.open_course(1)
		})
		xdescribe("First Module",function(){
			it("should seek video to 9%",function(){
				video.wait_till_ready()
				video.play()
				video.seek(9)
				student_lec.wait_for_quiz()
			})
			it('should expect MCQ quiz', function(){
				expect(student_lec.check_answer_button.isDisplayed()).toEqual(true);
			})
			it("should answer MCQ quiz",function(){
				student_lec.mark_answer(1)
				student_lec.mark_answer(3)
				student_lec.check_answer()
			})
			it('wait for the voting question', function(){
				student_lec.wait_for_vote()
			})
			it('should request that the question not be reviewed in class', function(){
				student_lec.request_review_inclass()
			})

			it("should seek video to 19%",function(){
				video.play()
				video.seek(19)
				student_lec.wait_for_quiz()
			})
			it('should expect OCQ quiz', function(){
				expect(student_lec.check_answer_button.isDisplayed()).toEqual(true);
			})
			it("should answer OCQ quiz",function(){
				student_lec.mark_answer(2)
				student_lec.check_answer()
			})
			it('wait for the voting question', function(){
				student_lec.wait_for_vote()
			})
			it('should request that the question not be reviewed in class', function(){
				student_lec.decline_review_inclass()
			})

			it("should seek video to 29%",function(){
				video.play()
				video.seek(29)
				student_lec.wait_for_quiz()
			})
			it('should expect DRAG quiz', function(){
				expect(student_lec.check_answer_button.isDisplayed()).toEqual(true);
			})
			it("should answer DRAG quiz",function(){
				student_lec.drag_answer(1)
				student_lec.drag_answer(2)
				student_lec.drag_answer(3)
				student_lec.check_answer()
			})
			it('wait for the voting question', function(){
				student_lec.wait_for_vote()
			})
			it('should request that the question not be reviewed in class', function(){
				student_lec.request_review_inclass()
			})
			it('should watch video and pass by all milestones', function(){
				video.play()
				expect(student_lec.next_button.isDisplayed()).toEqual(false)
		        video.seek(99);
		        student_lec.wait_for_video_end()
		        expect(student_lec.next_button.isDisplayed()).toEqual(true)
			})

			it('should go to the second lecture', function(){
				student_lec.next()
			})
			it("should seek video to 9%",function(){
				video.wait_till_ready()
				video.play()
				video.seek(9)
				student_lec.wait_for_quiz()
			})
			it('should expect Text MCQ quiz', function(){
				expect(student_lec.check_answer_button.isDisplayed()).toEqual(true);
			})
			it("should answer Text MCQ quiz",function(){
				student_lec.mark_answer(1)
				student_lec.mark_answer(3)
				student_lec.check_answer()
			})
			it('wait for the voting question', function(){
				student_lec.wait_for_vote()
			})
			it('should request that the question not be reviewed in class', function(){
				student_lec.request_review_inclass()
			})

			it("should seek video to 19%",function(){
				video.play()
				video.seek(19)
				student_lec.wait_for_quiz()
			})
			it('should expect Text OCQ quiz', function(){
				expect(student_lec.check_answer_button.isDisplayed()).toEqual(true);
			})
			it("should answer Text OCQ quiz",function(){
				student_lec.mark_answer(1)
				student_lec.check_answer()
			})
			it('wait for the voting question', function(){
				student_lec.wait_for_vote()
			})
			it('should request that the question not be reviewed in class', function(){
				student_lec.decline_review_inclass()
			})

			it("should seek video to 29%",function(){
				video.play()
				video.seek(29)
				student_lec.wait_for_quiz()
			})
			it('should expect Text DRAG quiz', function(){
				expect(student_lec.check_answer_button.isDisplayed()).toEqual(true);
			})
			it("should answer Text DRAG quiz",function(){
				student_lec.answer_text_drag_correct()
				student_lec.check_answer()
			})
			it('should watch video and pass by all milestones', function(){
				video.play()
				expect(student_lec.next_button.isDisplayed()).toEqual(false)
		        video.seek(99);
		        student_lec.wait_for_video_end()
		        expect(student_lec.next_button.isDisplayed()).toEqual(true)
			})

			it('should go to the Third lecture', function(){
				student_lec.next()
			})

			it("should seek video to 9%",function(){
				video.wait_till_ready()
				video.play()
				video.seek(9)
				student_lec.wait_for_quiz()
			})
			it('should expect MCQ Survey', function(){
				expect(student_lec.check_answer_button.isDisplayed()).toEqual(true);
			})
			it("should answer MCQ Survey",function(){
				student_lec.mark_answer(1)
				student_lec.check_answer()
			})

			it("should seek video to 19%",function(){
				video.play()
				video.seek(19)
				student_lec.wait_for_quiz()
			})
			it('should expect OCQ Survey', function(){
				expect(student_lec.check_answer_button.isDisplayed()).toEqual(true);
			})
			it("should answer OCQ Survey",function(){
				student_lec.mark_answer(2)
				student_lec.check_answer()
			})
			it('should watch video and pass by all milestones', function(){
				video.play()
				expect(student_lec.next_button.isDisplayed()).toEqual(false)
		        video.seek(99);
		        student_lec.wait_for_video_end()
		        expect(student_lec.next_button.isDisplayed()).toEqual(true)
				navigator.set_status(1)
			})

			it("should navigate to second quiz in first module",function(){
				navigator.open()
				navigator.module(1).open_item(5)
				navigator.close()
			})
			it('should answer mcq incorrect', function(){
				student_quiz.question(2).mark_answer(1)
				student_quiz.question(2).mark_answer(2)
			})
			it('should answer ocq correct', function(){
				student_quiz.question(4).mark_answer(1)
			})
			it('should answer free question', function(){
				student_quiz.question(5).type_free_text('second second free answer')
			})
			it('should answer match question', function(){
				student_quiz.question(6).type_free_text('match answer')
			})
			it('should answer drag correct', function(){
				scroll_bottom()
				student_quiz.question(7).drag_answer_correct()
			})
			it('should submit quiz',function(){
				student_quiz.submit();
				navigator.set_status(1)
			})

			// it("should open first lecture again",function(){
			// 	navigator.open()
			// 	navigator.module(1).open_item(1)
			// 	navigator.close()
			// })
			// it('should seek to 45%', function(){
			// 	video.seek(45)
			// })
			// it('should add a confused', function(){
			// 	expect(student_lec.lecture(1).confused.count()).toEqual(0)
	  //           student_lec.add_confused()
	  //           expect(student_lec.lecture(1).confused.count()).toEqual(1)
	  //           expect(student_lec.lecture(1).items.count()).toEqual(5)
			// })
			// it('should move to the second lecture', function(){
			// 	navigator.open()
			// 	navigator.module(1).open_item(2)
			// 	navigator.close()
			// })
			// it('should seek to 25%', function(){
			// 	video.seek(25)
			// })
			// it('should add a confused', function(){
			// 	expect(student_lec.lecture(2).confused.count()).toEqual(0)
	  //           student_lec.add_confused()
	  //           expect(student_lec.lecture(2).confused.count()).toEqual(1)
	  //           expect(student_lec.lecture(2).items.count()).toEqual(4)
			// })
			// it('should seek to 40%', function(){
			// 	video.seek(40)
			// })
			// it('should add a public question', function(){
			// 	student_lec.add_discussion()
	  //           expect(student_lec.lecture(2).editable_discussion.isDisplayed()).toEqual(true)
	  //           student_lec.lecture(2).type_discussion("public question by second student")
	  //           student_lec.lecture(2).change_discussion_public()
	  //           student_lec.lecture(2).save_discussion()
	  //           expect(student_lec.lecture(2).discussions.count()).toEqual(1)
	  //           expect(student_lec.lecture(2).editable_discussion.isPresent()).toEqual(false)
	  //           expect(student_lec.lecture(2).items.count()).toEqual(5)
			// })
			it("should logout",function(){
				header.logout()
			})			
		})
	})
	// xdescribe("First Student",function(){
	// 	it("should login", function(){
	// 		login_page.sign_in(params.student_mail, params.password)
	// 	})
	// 	var navigator = new ContentNavigator(0)
	// 	it('should open first course', function(){
	// 		course_list.open()
	// 		course_list.open_course(1)
	// 	})
	// 	it('should open third lecture in first module', function(){
	// 		navigator.open()
	// 		navigator.module(1).open()
	// 		navigator.module(1).open_item(3)
	// 		navigator.close()
	// 	})
	// 	it('should seek to 25%', function(){
	// 		video.seek(25)
	// 	})
	// 	it('should add a really confused', function(){
	// 		expect(student_lec.lecture(3).confused.count()).toEqual(0)
 //            student_lec.add_really_confused()
 //            expect(student_lec.lecture(3).confused.count()).toEqual(1)
 //            expect(student_lec.lecture(3).items.count()).toEqual(3)
	// 	})
	// })
})