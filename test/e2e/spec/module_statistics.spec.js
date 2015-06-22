var CourseEditor = require('./pages/course_editor');
var ContentNavigator = require('./pages/content_navigator');
var CourseList = require('./pages/course_list');
var InvideoQuiz = require('./pages/invideo_quiz');
var NormalQuiz = require('./pages/normal_quiz');
var Video = require('./pages/video');
var sleep = require('./lib/utils').sleep;
var scroll_top = require('./lib/utils').scroll_top;
var Login = require('./pages/login');
var ContentItems = require('./pages/content_items');
var Header = require('./pages/header');
var SubHeader = require('./pages/sub_header')
var content_items= new ContentItems()
var login_page = new Login()
var params = browser.params;
var header = new Header()
var video = new Video();
var invideo_quiz = new InvideoQuiz();
var quiz = new NormalQuiz();
var course_editor = new CourseEditor()
var course_list = new CourseList()
var sub_header = new SubHeader()
var navigator = new ContentNavigator(1)

describe("Module Statistics",function(){
	describe("Teacher",function(){
		it("should login as teacher",function(){
			login_page.sign_in(params.teacher_mail, params.password)
		})
		it("should open course",function(){
	        course_list.open()
	        course_list.open_course(1)
	        sub_header.open_edit_mode()
	    })
	    
	 //    it("should open first module ", function(){
	 //    	navigator.module(1).open()
		// })
		// it("should check module statistics", function(){
	 //    	expect(course_editor.total_time).toEqual("3 (14:21 total)")
	 //    	expect(course_editor.total_lecture_questions).toEqual("8")
	 //    	expect(course_editor.total_quiz_questions).toEqual("2 (10 Questions)")
		// })
		// it("should create a new module",function(){
		// 	navigator.add_module()
		// })
		// it("should check module statistics",function(){			
		// 	expect(course_editor.total_time).toEqual("0 (0:00 total)")
	 //    	expect(course_editor.total_lecture_questions).toEqual("0")
	 //    	expect(course_editor.total_quiz_questions).toEqual("0 (0 Questions)")
		// })
		// it("should add lecture",function(){
		// 	navigator.module(3).open_content_items()
		// 	content_items.add_video()
	 //        course_editor.rename_item("lecture7")
	 //        course_editor.change_item_url(params.url2)
	 //        video.wait_till_ready()
		// })
		// it("should open module ", function(){
	 //    	navigator.module(3).open()
		// })
		// it("should check module statistics",function(){			
		// 	expect(course_editor.total_time).toEqual("1 (06:05 total)")
	 //    	expect(course_editor.total_lecture_questions).toEqual("0")
	 //    	expect(course_editor.total_quiz_questions).toEqual("0 (0 Questions)")
		// })
		// it("should open first lecture",function(){
		// 	navigator.module(3).item(1).open()
		// })
		// it("should add quizzes to lectures",function(){
		// 	video.seek(20)
		// 	invideo_quiz.create(invideo_quiz.ocq)
		// 	invideo_quiz.add_answer(params.q_x, params.q1_y)
		// 	invideo_quiz.add_answer(params.q_x, params.q2_y)
		// 	invideo_quiz.add_answer(params.q_x, params.q3_y)
		// 	invideo_quiz.save_quiz()
		// })
		// it("should open module ", function(){
	 //    	navigator.module(3).open()
		// })
		// it("should check module statistics",function(){			
		// 	expect(course_editor.total_time).toEqual("1 (06:05 total)")
	 //    	expect(course_editor.total_lecture_questions).toEqual("1")
	 //    	expect(course_editor.total_quiz_questions).toEqual("0 (0 Questions)")
		// })
		
		// it("should add a quiz",function(){
		// 	navigator.module(3).open_content_items()
		// 	content_items.add_quiz()
		// })
		// it("should add questions to quiz",function(){
		// 	quiz.add_header()
		// 	quiz.type_header('first header')

		// 	quiz.add_question()
		// 	var question = quiz.question(2)
		// 	question.type_title('mcq question')
		// 	question.type_answer("answer 1")
		// 	question.correct_answer()
		// 	question.add_answer()
		// 	question.type_answer("answer 2")
		// 	question.add_answer()
		// 	question.type_answer("answer 3")			

		// 	quiz.add_question()
		// 	var question = quiz.question(3)
		// 	question.type_title('ocq question')
		// 	question.change_type_ocq()
		// 	question.type_answer("answer 1")
		// 	question.correct_answer()
		// 	question.add_answer()
		// 	question.type_answer("answer 2")
		// 	question.add_answer()
		// 	question.type_answer("answer 3")

		// 	quiz.save()
		// })
		// it("should open module ", function(){
	 //    	navigator.module(3).open()
		// })
		// it("should check module statistics",function(){			
		// 	expect(course_editor.total_time).toEqual("1 (06:05 total)")
	 //    	expect(course_editor.total_lecture_questions).toEqual("1")
	 //    	expect(course_editor.total_quiz_questions).toEqual("1 (2 Questions)")
		// })
		// it("should open first lecture",function(){
		// 	navigator.module(3).item(1).open()
		// })
		// it("should delete lecture quiz",function(){
		// 	invideo_quiz.delete(1)
		// })
		it("should open module ", function(){
	    	navigator.module(3).open()
		})
		// it("should check module statistics",function(){			
		// 	expect(course_editor.total_time).toEqual("1 (06:05 total)")
	 //    	expect(course_editor.total_lecture_questions).toEqual("0")
	 //    	expect(course_editor.total_quiz_questions).toEqual("1 (2 Questions)")
		// })

		// it("should delete lecture ", function(){
	 //    	navigator.module(3).item(1).delete()
		// })
		// it("should check module statistics",function(){			
		// 	expect(course_editor.total_time).toEqual("0 (0:00 total)")
	 //    	expect(course_editor.total_lecture_questions).toEqual("0")
	 //    	expect(course_editor.total_quiz_questions).toEqual("1 (2 Questions)")
		// })

		it("should open quiz",function(){
			navigator.module(3).item(1).open()
		})

		it("should delete quiz question header",function(){
			// console.log(quiz.question(2).title)
			scroll_top()
			sleep(10000)
			quiz.question(1).delete()
			// expect(quiz.questions.count()).toEqual(2)
			// quiz.save()
		})

		// it("should open module ", function(){
	 //    	navigator.module(3).open()
		// })
		// it("should check module statistics",function(){			
		// 	expect(course_editor.total_time).toEqual("0 (0:00 total)")
	 //    	expect(course_editor.total_lecture_questions).toEqual("0")
	 //    	expect(course_editor.total_quiz_questions).toEqual("1 (2 Questions)")
		// })
		// it("should open quiz",function(){
		// 	navigator.module(3).item(1).open()
		// })

		// it("should delete quiz question mcq",function(){
		// 	quiz.question(1).delete()
		// 	expect(quiz.questions.count()).toEqual(1)
		// 	quiz.save()
		// })
		// it("should open module ", function(){
	 //    	navigator.module(3).open()
		// })
		// it("should check module statistics",function(){			
		// 	expect(course_editor.total_time).toEqual("0 (0:00 total)")
	 //    	expect(course_editor.total_lecture_questions).toEqual("0")
	 //    	expect(course_editor.total_quiz_questions).toEqual("1 (1 Questions)")
		// })
		// it("should delete quiz",function(){
	 //    	navigator.module(3).item(1).delete()
		// })
		// it("should open module ", function(){
	 //    	navigator.module(3).open()
		// })
		// it("should check module statistics",function(){			
		// 	expect(course_editor.total_time).toEqual("0 (0:00 total)")
	 //    	expect(course_editor.total_lecture_questions).toEqual("0")
	 //    	expect(course_editor.total_quiz_questions).toEqual("0 (0 Questions)")
		// })
	})

	// describe("Revert Changes - Teacher",function(){		
	// 	it("should delete module",function(){
	// 		navigator.module(3).delete()
	// 		expect(navigator.modules.count()).toEqual(2)
	// 	})
	// 	it("should logout",function(){
	// 		header.logout()
	// 	})
	// })
})