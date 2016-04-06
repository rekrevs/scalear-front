var ContentNavigator = require('./pages/content_navigator');
var CourseEditor = require('./pages/course_editor');
var CourseList = require('./pages/course_list');
var InvideoQuiz = require('./pages/invideo_quiz');
var NormalQuiz = require('./pages/normal_quiz');
var Video = require('./pages/video');
var sleep = require('./lib/utils').sleep;
var Login = require('./pages/login');
var Header = require('./pages/header');
var SubHeader = require('./pages/sub_header');
var ContentItems = require('./pages/content_items');

var params = browser.params;
var header = new Header()
var sub_header = new SubHeader()
var course_editor = new CourseEditor()
var login_page = new Login()
var course_list = new CourseList()
var video = new Video();
var invideo_quiz = new InvideoQuiz();
var quiz = new NormalQuiz();
var content_items= new ContentItems()
var navigator = new ContentNavigator(1)

var q1_x = 169;
var q1_y = 127;

var q2_x = 169;
var q2_y = 157;

var q3_x = 169;
var q3_y = 187;

var d_q1_x = 169;
var d_q1_y = 70; 

var d_q2_x = 169;
var d_q2_y = 130;

var d_q3_x = 169;
var d_q3_y = 190;

describe("Filling Course",function(){
	describe("Teacher",function(){
		it("should login",function(){
			login_page.sign_in(params.teacher_mail, params.password)
		})
		it("should open course",function(){
			course_list.open()
			course_list.open_course(1)
		})
		it("should go to edit mode",function(){
			sub_header.open_edit_mode()
		})
	
		it("should create modules",function(){
			expect(navigator.modules.count()).toEqual(0)
			course_editor.add_module();
			course_editor.rename_module("module 1")
			expect(navigator.modules.count()).toEqual(1)
			navigator.add_module();
			course_editor.rename_module("module 2")
			expect(navigator.modules.count()).toEqual(2)
		})
		it("should add items to the first module",function(){
			var module = navigator.module(1)
			module.open()
			module.open_content_items()
			content_items.add_video()
			// sleep(5000)
	        course_editor.rename_item("lecture1 video quizzes")
	        course_editor.change_item_url(params.url1)
	        // video.wait_till_ready()

	        module.open_content_items()
			content_items.add_video()
	        course_editor.rename_item("lecture2 text quizzes")
	        course_editor.change_item_url(params.url1)
	        // video.wait_till_ready()

	        module.open_content_items()
			content_items.add_video()
	        course_editor.rename_item("lecture3 video surveys")
	        course_editor.change_item_url(params.url1)
			// video.wait_till_ready()

	        module.open_content_items()
			content_items.add_quiz()
	        course_editor.rename_item("quiz1")

	        module.open_content_items()
			content_items.add_quiz()
	        course_editor.rename_item("quiz2")

	        module.open_content_items()
			content_items.add_survey()
	        course_editor.rename_item("survey1")     
		})

		it("should add items to the second module",function(){
			var module = navigator.module(2)
			module.open()
			module.open_content_items()
			content_items.add_video()
	        course_editor.rename_item("lecture4 video quizzes")
	        course_editor.change_item_url(params.url1)
	        // video.wait_till_ready()

	        module.open_content_items()
			content_items.add_video()
	        course_editor.rename_item("lecture5 text quizzes")
	        course_editor.change_item_url(params.url1)
	        // video.wait_till_ready()

	        module.open_content_items()
			content_items.add_video()
	        course_editor.rename_item("lecture6 video surveys")
	        course_editor.change_item_url(params.url1)
			// video.wait_till_ready()

	        module.open_content_items()
			content_items.add_quiz()
	        course_editor.rename_item("quiz3")

	        module.open_content_items()
			content_items.add_quiz()
	        course_editor.rename_item("quiz4")

			module.open_content_items()
			content_items.add_survey()
	        course_editor.rename_item("survey2")     
		})

		it("should open first lecture in first module",function(){
			navigator.module(1).open()
			navigator.module(1).item(1).open()
			navigator.close()
		})

		it("should add video quizzes",function(){
			video.seek(10)
			invideo_quiz.create(invideo_quiz.mcq)
			expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
			invideo_quiz.rename("MCQ QUIZ")
			invideo_quiz.add_answer(q1_x, q1_y)
			invideo_quiz.mark_correct()
			invideo_quiz.type_explanation("explanation 1")
			invideo_quiz.hide_popover()
			invideo_quiz.add_answer(q2_x, q2_y)
			invideo_quiz.type_explanation("explanation 2")
			invideo_quiz.hide_popover()
			invideo_quiz.add_answer(q3_x, q3_y)
			invideo_quiz.mark_correct()
			invideo_quiz.type_explanation("explanation 3")
			invideo_quiz.save_quiz()
			expect(invideo_quiz.editor_panel.isPresent()).toEqual(false);

			video.seek(20)
			invideo_quiz.create(invideo_quiz.ocq)
			expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
			invideo_quiz.rename("OCQ QUIZ")
			invideo_quiz.add_answer(q1_x, q1_y)
			invideo_quiz.type_explanation("explanation 1")
			invideo_quiz.hide_popover()
			invideo_quiz.add_answer(q2_x, q2_y)
			invideo_quiz.mark_correct()
			invideo_quiz.type_explanation("explanation 2")
			invideo_quiz.hide_popover()
			invideo_quiz.add_answer(q3_x, q3_y)
			invideo_quiz.type_explanation("explanation 3")
			invideo_quiz.hide_popover()
			invideo_quiz.save_quiz()
			expect(invideo_quiz.editor_panel.isPresent()).toEqual(false);

			video.seek(30)
			invideo_quiz.create(invideo_quiz.drag)
			expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
			invideo_quiz.rename("DRAG QUIZ")
			invideo_quiz.add_answer_drag(d_q1_x, d_q1_y)
			// sleep(2000)
			invideo_quiz.hide_popover()
			invideo_quiz.add_answer_drag(d_q2_x, d_q2_y)
			// sleep(2000)
			invideo_quiz.hide_popover()
			invideo_quiz.add_answer_drag(d_q3_x, d_q3_y)
			invideo_quiz.hide_popover()
			invideo_quiz.save_quiz()
			expect(invideo_quiz.editor_panel.isPresent()).toEqual(false);
		})

		it("should open second lecture in first module",function(){
			navigator.open()
			navigator.module(1).open()
			navigator.module(1).item(2).open()
			navigator.close()
		})

		it("should add video text quizzes",function(){
			video.seek(10)
			invideo_quiz.create(invideo_quiz.mcq_text)
			expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
			invideo_quiz.rename('MCQ TEXT QUIZ')
			invideo_quiz.type_text_answer(1,"answer 1")
			invideo_quiz.type_text_explanation(1,"explanation 1")
			invideo_quiz.text_answer_correct(1)
			invideo_quiz.add_text_answer()
			invideo_quiz.type_text_answer(2,"answer 2")
			invideo_quiz.type_text_explanation(2,"explanation 2")
			invideo_quiz.add_text_answer()
			invideo_quiz.type_text_answer(3,"answer 3")
			invideo_quiz.type_text_explanation(3,"explanation 3")
			invideo_quiz.text_answer_correct(3)
			invideo_quiz.save_quiz()
			expect(invideo_quiz.editor_panel.isPresent()).toEqual(false);

			video.seek(20)
			invideo_quiz.create(invideo_quiz.ocq_text)
			expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
			invideo_quiz.rename('OCQ TEXT QUIZ')
			invideo_quiz.type_text_answer(1,"answer 1")
			invideo_quiz.type_text_explanation(1,"explanation 1")
			invideo_quiz.add_text_answer()
			invideo_quiz.type_text_answer(2,"answer 2")
			invideo_quiz.type_text_explanation(2,"explanation 2")
			invideo_quiz.text_answer_correct(2)
			invideo_quiz.add_text_answer()
			invideo_quiz.type_text_answer(3,"answer 3")
			invideo_quiz.type_text_explanation(3,"explanation 3")
			invideo_quiz.save_quiz()
			expect(invideo_quiz.editor_panel.isPresent()).toEqual(false);

			video.seek(30)
			invideo_quiz.create(invideo_quiz.drag_text)
			expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
			invideo_quiz.rename('DRAG TEXT QUIZ')
			invideo_quiz.type_text_answer(1,"answer 1")
			invideo_quiz.add_text_answer()
			invideo_quiz.type_text_answer(2,"answer 2")
			invideo_quiz.add_text_answer()
			invideo_quiz.type_text_answer(3,"answer 3")
			invideo_quiz.save_quiz()
			expect(invideo_quiz.editor_panel.isPresent()).toEqual(false);
		})

		it("should open third lecture in first module",function(){
			navigator.open()
			navigator.module(1).open()
			navigator.module(1).item(3).open()
			navigator.close()
		})

		it("should add video surveys",function(){
			video.seek(10)
			invideo_quiz.create(invideo_quiz.mcq_survey)
			expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
			invideo_quiz.rename('MCQ SURVEY')
			invideo_quiz.add_answer(q1_x, q1_y)
			invideo_quiz.hide_popover()
			invideo_quiz.add_answer(q2_x, q2_y)
			invideo_quiz.hide_popover()
			invideo_quiz.add_answer(q3_x, q3_y)
			invideo_quiz.hide_popover()
			invideo_quiz.save_quiz()
			expect(invideo_quiz.editor_panel.isPresent()).toEqual(false);

			video.seek(20)
			invideo_quiz.create(invideo_quiz.ocq_survey)
			expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
			invideo_quiz.rename('OCQ SURVEY')
			invideo_quiz.add_answer(q1_x, q1_y)
			invideo_quiz.hide_popover()
			invideo_quiz.add_answer(q2_x, q2_y)
			invideo_quiz.hide_popover()
			invideo_quiz.add_answer(q3_x, q3_y)
			invideo_quiz.hide_popover()
			invideo_quiz.save_quiz()
			expect(invideo_quiz.editor_panel.isPresent()).toEqual(false);
		})

		it("should open first quiz in first module",function(){
			navigator.open()
			navigator.module(1).open()
			navigator.module(1).item(4).open()
		})

		it("should add questions to quiz",function(){
			expect(quiz.questions.count()).toEqual(0)
			quiz.add_header()
			expect(quiz.questions.count()).toEqual(1)
			quiz.type_header('first header')

			quiz.add_question()
			expect(quiz.questions.count()).toEqual(2)
			var question = quiz.question(2)
			expect(question.answers.count()).toEqual(1)
			question.type_title('mcq question')
			question.type_answer("answer 1")
			question.correct_answer()
			question.add_answer()
			question.type_answer("answer 2")
			question.add_answer()
			question.type_answer("answer 3")
			question.correct_answer()
			expect(question.answers.count()).toEqual(3)

			quiz.add_header()
			expect(quiz.questions.count()).toEqual(3)
			quiz.type_header('second header')

			quiz.add_question()
			expect(quiz.questions.count()).toEqual(4)
			var question = quiz.question(4)
			expect(question.answers.count()).toEqual(1)
			question.type_title('ocq question')
			question.change_type_ocq()
			question.type_answer("answer 1")
			question.correct_answer()
			question.add_answer()
			question.type_answer("answer 2")
			question.add_answer()
			question.type_answer("answer 3")
			expect(question.answers.count()).toEqual(3)

			quiz.add_question()
			expect(quiz.questions.count()).toEqual(5)
			var question = quiz.question(5)			
			question.type_title('free question')
			question.change_type_free_text()

			quiz.add_question()
			expect(quiz.questions.count()).toEqual(6)
			var question = quiz.question(6)			
			question.type_title('match question')
			question.change_type_match_text()			
			question.type_answer('match answer')

			quiz.add_question()
			expect(quiz.questions.count()).toEqual(7)
			var question = quiz.question(7)
			expect(question.answers.count()).toEqual(1)
			question.type_title('drag question')
			question.change_type_drag()
			question.type_answer("answer 1")
			question.add_answer()
			question.type_answer("answer 2")
			question.add_answer()
			question.type_answer("answer 3")
			expect(question.answers.count()).toEqual(3)
			
			quiz.save()
		})

		it("should open second quiz in first module",function(){
			navigator.module(1).open()
			navigator.module(1).item(5).open()
		})

		it("should add questions to quiz",function(){
			expect(quiz.questions.count()).toEqual(0)
			quiz.add_header()
			expect(quiz.questions.count()).toEqual(1)
			quiz.type_header('first header')

			quiz.add_question()
			expect(quiz.questions.count()).toEqual(2)
			var question = quiz.question(2)
			question.type_title('mcq question')
			question.type_answer("answer 1")
			question.correct_answer()
			question.add_answer()
			question.type_answer("answer 2")
			question.add_answer()
			question.type_answer("answer 3")
			question.correct_answer()

			quiz.add_header()
			expect(quiz.questions.count()).toEqual(3)
			quiz.type_header('second header')

			quiz.add_question()
			expect(quiz.questions.count()).toEqual(4)
			var question = quiz.question(4)
			question.type_title('ocq question')
			question.change_type_ocq()
			question.type_answer("answer 1")
			question.correct_answer()
			question.add_answer()
			question.type_answer("answer 2")
			question.add_answer()
			question.type_answer("answer 3")

			quiz.add_question()
			expect(quiz.questions.count()).toEqual(5)
			var question = quiz.question(5)
			question.type_title('free question')
			question.change_type_free_text()

			quiz.add_question()
			expect(quiz.questions.count()).toEqual(6)
			var question = quiz.question(6)
			question.type_title('match question')
			question.change_type_match_text()
			question.type_answer('match answer')

			quiz.add_question()
			expect(quiz.questions.count()).toEqual(7)
			var question = quiz.question(7)
			question.type_title('drag question')
			question.change_type_drag()
			question.type_answer("answer 1")
			question.add_answer()
			question.type_answer("answer 2")
			question.add_answer()
			question.type_answer("answer 3")
			
			quiz.save()
		})

		it("should open survey in first module",function(){
			navigator.module(1).open()
			navigator.module(1).item(6).open()
		})

		it("should add questions to survey",function(){
			expect(quiz.questions.count()).toEqual(0)
			quiz.add_header()
			expect(quiz.questions.count()).toEqual(1)
			quiz.type_header('first header')

			quiz.add_question()
			expect(quiz.questions.count()).toEqual(2)
			var question = quiz.question(2)
			question.type_title('mcq question')
			question.type_answer("answer 1")
			question.add_answer()
			question.type_answer("answer 2")
			question.add_answer()
			question.type_answer("answer 3")

			quiz.add_header()
			expect(quiz.questions.count()).toEqual(3)
			quiz.type_header('second header')

			quiz.add_question()
			expect(quiz.questions.count()).toEqual(4)
			var question = quiz.question(4)
			question.type_title('ocq question')
			question.change_type_ocq()
			question.type_answer("answer 1")
			question.add_answer()
			question.type_answer("answer 2")
			question.add_answer()
			question.type_answer("answer 3")

			quiz.add_question()
			expect(quiz.questions.count()).toEqual(5)
			var question = quiz.question(5)
			question.type_title('free question')
			question.change_type_free_text()
			
			quiz.save()
		})

		// /////////////////////////////////////

		it("should open first lecture in second module",function(){
			navigator.module(2).open()
			navigator.module(2).item(1).open()
			navigator.close()
		})

		it("should add video quizzes",function(){
			video.seek(10)
			invideo_quiz.create(invideo_quiz.mcq)
			expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
			invideo_quiz.rename("MCQ QUIZ")
			invideo_quiz.add_answer(q1_x, q1_y)
			invideo_quiz.mark_correct()
			invideo_quiz.type_explanation("explanation 1")
			invideo_quiz.hide_popover()
			invideo_quiz.add_answer(q2_x, q2_y)
			invideo_quiz.type_explanation("explanation 2")
			invideo_quiz.hide_popover()
			invideo_quiz.add_answer(q3_x, q3_y)
			invideo_quiz.mark_correct()
			invideo_quiz.type_explanation("explanation 3")
			invideo_quiz.save_quiz()

			video.seek(20)
			invideo_quiz.create(invideo_quiz.ocq)
			expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
			invideo_quiz.rename("OCQ QUIZ")
			invideo_quiz.add_answer(q1_x, q1_y)
			invideo_quiz.type_explanation("explanation 1")
			invideo_quiz.hide_popover()
			invideo_quiz.add_answer(q2_x, q2_y)
			invideo_quiz.mark_correct()
			invideo_quiz.hide_popover()
			invideo_quiz.type_explanation("explanation 2")
			invideo_quiz.add_answer(q3_x, q3_y)
			invideo_quiz.hide_popover()
			invideo_quiz.type_explanation("explanation 3")
			invideo_quiz.hide_popover()
			invideo_quiz.save_quiz()

			video.seek(30)
			invideo_quiz.create(invideo_quiz.drag)
			expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
			invideo_quiz.rename("DRAG QUIZ")
			invideo_quiz.add_answer(d_q1_x, d_q1_y)
			invideo_quiz.hide_popover()
			invideo_quiz.add_answer(d_q2_x, d_q2_y)
			invideo_quiz.hide_popover()
			invideo_quiz.add_answer(d_q3_x, d_q3_y)
			invideo_quiz.hide_popover()
			invideo_quiz.save_quiz()
		})

		it("should open second lecture in second module",function(){
			navigator.open()
			navigator.module(2).open()
			navigator.module(2).item(2).open()
			navigator.close()
		})

		it("should add video text quizzes",function(){
			video.seek(10)
			invideo_quiz.create(invideo_quiz.mcq_text)
			invideo_quiz.rename('MCQ TEXT QUIZ')
			invideo_quiz.type_text_answer(1,"answer 1")
			invideo_quiz.type_text_explanation(1,"explanation 1")
			invideo_quiz.text_answer_correct(1)
			invideo_quiz.add_text_answer()
			invideo_quiz.type_text_answer(2,"answer 2")
			invideo_quiz.type_text_explanation(2,"explanation 2")
			invideo_quiz.add_text_answer()
			invideo_quiz.type_text_answer(3,"answer 3")
			invideo_quiz.type_text_explanation(3,"explanation 3")
			invideo_quiz.text_answer_correct(3)
			invideo_quiz.save_quiz()

			video.seek(20)
			invideo_quiz.create(invideo_quiz.ocq_text)
			invideo_quiz.rename('OCQ TEXT QUIZ')
			invideo_quiz.type_text_answer(1,"answer 1")
			invideo_quiz.type_text_explanation(1,"explanation 1")
			invideo_quiz.add_text_answer()
			invideo_quiz.type_text_answer(2,"answer 2")
			invideo_quiz.type_text_explanation(2,"explanation 2")
			invideo_quiz.text_answer_correct(2)
			invideo_quiz.add_text_answer()
			invideo_quiz.type_text_answer(3,"answer 3")
			invideo_quiz.type_text_explanation(3,"explanation 3")
			invideo_quiz.save_quiz()

			video.seek(30)
			invideo_quiz.create(invideo_quiz.drag_text)
			invideo_quiz.rename('DRAG TEXT QUIZ')
			invideo_quiz.type_text_answer(1,"answer 1")
			invideo_quiz.add_text_answer()
			invideo_quiz.type_text_answer(2,"answer 2")
			invideo_quiz.add_text_answer()
			invideo_quiz.type_text_answer(3,"answer 3")
			invideo_quiz.save_quiz()
		})

		it("should open third lecture in second module",function(){
			navigator.open()
			navigator.module(2).open()
			navigator.module(2).item(3).open()
			navigator.close()
		})

		it("should add video surveys",function(){
			video.seek(10)
			invideo_quiz.create(invideo_quiz.mcq_survey)
			invideo_quiz.rename('MCQ SURVEY')
			invideo_quiz.add_answer(q1_x, q1_y)
			invideo_quiz.hide_popover()
			invideo_quiz.add_answer(q2_x, q2_y)
			invideo_quiz.hide_popover()
			invideo_quiz.add_answer(q3_x, q3_y)
			invideo_quiz.hide_popover()
			invideo_quiz.save_quiz()

			video.seek(20)
			invideo_quiz.create(invideo_quiz.ocq_survey)
			invideo_quiz.rename('OCQ SURVEY')
			invideo_quiz.add_answer(q1_x, q1_y)
			invideo_quiz.hide_popover()
			invideo_quiz.add_answer(q2_x, q2_y)
			invideo_quiz.hide_popover()
			invideo_quiz.add_answer(q3_x, q3_y)
			invideo_quiz.hide_popover()
			invideo_quiz.save_quiz()
		})

		it("should open quiz in second module",function(){
			navigator.open()
			navigator.module(2).open()
			navigator.module(2).item(4).open()
		})

		it("should add questions to quiz",function(){
			expect(quiz.questions.count()).toEqual(0)
			quiz.add_header()
			expect(quiz.questions.count()).toEqual(1)
			quiz.type_header('first header')

			quiz.add_question()
			expect(quiz.questions.count()).toEqual(2)
			var question = quiz.question(2)
			question.type_title('mcq question')
			question.type_answer("answer 1")
			question.correct_answer()
			question.add_answer()
			question.type_answer("answer 2")
			question.add_answer()
			question.type_answer("answer 3")
			question.correct_answer()

			quiz.add_header()
			expect(quiz.questions.count()).toEqual(3)
			quiz.type_header('second header')

			quiz.add_question()
			expect(quiz.questions.count()).toEqual(4)
			var question = quiz.question(4)
			question.type_title('ocq question')
			question.change_type_ocq()
			question.type_answer("answer 1")
			question.correct_answer()
			question.add_answer()
			question.type_answer("answer 2")
			question.add_answer()
			question.type_answer("answer 3")

			quiz.add_question()
			expect(quiz.questions.count()).toEqual(5)
			var question = quiz.question(5)
			question.type_title('free question')
			question.change_type_free_text()

			quiz.add_question()
			expect(quiz.questions.count()).toEqual(6)
			var question = quiz.question(6)
			question.type_title('match question')
			question.change_type_match_text()
			question.type_answer('match answer')

			quiz.add_question()
			expect(quiz.questions.count()).toEqual(7)
			var question = quiz.question(7)
			question.type_title('drag question')
			question.change_type_drag()
			question.type_answer("answer 1")
			question.add_answer()
			question.type_answer("answer 2")
			question.add_answer()
			question.type_answer("answer 3")
			
			quiz.save()

		})

		it("should open second quiz in second module",function(){
			navigator.module(2).open()
			navigator.module(2).item(5).open()
		})

		it("should add questions to quiz",function(){
			expect(quiz.questions.count()).toEqual(0)
			quiz.add_header()
			expect(quiz.questions.count()).toEqual(1)
			quiz.type_header('first header')

			quiz.add_question()
			expect(quiz.questions.count()).toEqual(2)
			var question = quiz.question(2)
			question.type_title('mcq question')
			question.type_answer("answer 1")
			question.correct_answer()
			question.add_answer()
			question.type_answer("answer 2")
			question.add_answer()
			question.type_answer("answer 3")
			question.correct_answer()

			quiz.add_header()
			expect(quiz.questions.count()).toEqual(3)
			quiz.type_header('second header')

			quiz.add_question()
			expect(quiz.questions.count()).toEqual(4)
			var question = quiz.question(4)
			question.type_title('ocq question')
			question.change_type_ocq()
			question.type_answer("answer 1")
			question.correct_answer()
			question.add_answer()
			question.type_answer("answer 2")
			question.add_answer()
			question.type_answer("answer 3")

			quiz.add_question()
			expect(quiz.questions.count()).toEqual(5)
			var question = quiz.question(5)
			question.type_title('free question')
			question.change_type_free_text()

			quiz.add_question()
			expect(quiz.questions.count()).toEqual(6)
			var question = quiz.question(6)
			question.type_title('match question')
			question.change_type_match_text()
			question.type_answer('match answer')

			quiz.add_question()
			expect(quiz.questions.count()).toEqual(7)
			var question = quiz.question(7)
			question.type_title('drag question')
			question.change_type_drag()
			question.type_answer("answer 1")
			question.add_answer()
			question.type_answer("answer 2")
			question.add_answer()
			question.type_answer("answer 3")
			
			quiz.save()
		})

		it("should open survey in second module",function(){
			navigator.module(2).open()
			navigator.module(2).item(6).open()
		})

		it("should add questions to survey",function(){
			expect(quiz.questions.count()).toEqual(0)
			quiz.add_header()
			expect(quiz.questions.count()).toEqual(1)
			quiz.type_header('first header')

			quiz.add_question()
			expect(quiz.questions.count()).toEqual(2)
			var question = quiz.question(2)
			question.type_title('mcq question')
			question.type_answer("answer 1")
			question.add_answer()
			question.type_answer("answer 2")
			question.add_answer()
			question.type_answer("answer 3")

			quiz.add_header()
			expect(quiz.questions.count()).toEqual(3)
			quiz.type_header('second header')

			quiz.add_question()
			expect(quiz.questions.count()).toEqual(4)
			var question = quiz.question(4)
			question.type_title('ocq question')
			question.change_type_ocq()
			question.type_answer("answer 1")
			question.add_answer()
			question.type_answer("answer 2")
			question.add_answer()
			question.type_answer("answer 3")

			quiz.add_question()
			expect(quiz.questions.count()).toEqual(5)
			var question = quiz.question(5)
			question.type_title('free question')
			question.change_type_free_text()
			
			quiz.save()
		})
		it("should logout",function(){
			header.logout()
		})
	})
})