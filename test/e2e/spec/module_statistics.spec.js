var CourseEditor = require('./pages/course_editor');
var ContentNavigator = require('./pages/content_navigator');
var CourseList = require('./pages/course_list');
var InvideoQuiz = require('./pages/invideo_quiz');
var NormalQuiz = require('./pages/normal_quiz');
var Video = require('./pages/video');
var sleep = require('./lib/utils').sleep;

var params = browser.params;

var video = new Video();
var invideo_quiz = new InvideoQuiz();
var quiz = new NormalQuiz();
var course_editor = new CourseEditor()
var course_list = new CourseList()
var navigator = new ContentNavigator(1)

describe("Module Statistics",function(){
	describe("Teacher",function(){
		it("should open course",function(){
	        course_list.open()
	        course_list.open_course(1)
	    })
	    
	    it("should open first module ", function(){
	    	navigator.module(1).open()
		})
		it("should check module statistics", function(){
	    	expect(course_editor.total_time).toEqual("00:14:21")
	    	expect(course_editor.total_lecture_questions).toEqual("8")
	    	expect(course_editor.total_quiz_questions).toEqual("10")
		})
		it("should create a new module",function(){
			course_editor.add_module()
		})
		it("should check module statistics",function(){			
			expect(course_editor.total_time).toEqual("0:00")
	    	expect(course_editor.total_lecture_questions).toEqual("0")
	    	expect(course_editor.total_quiz_questions).toEqual("0")
		})
		it("should add lecture",function(){
			course_editor.add_lecture()
	        course_editor.rename_item("lecture7")
	        course_editor.change_video_url(params.url2)
		})
		it("should open module ", function(){
	    	navigator.module(3).open()
		})
		it("should check module statistics",function(){			
			expect(course_editor.total_time).toEqual("00:06:05")
	    	expect(course_editor.total_lecture_questions).toEqual("0")
	    	expect(course_editor.total_quiz_questions).toEqual("0")
		})
		it("should open first lecture",function(){
			navigator.module(3).open_item(1)
		})
		it("should add quizzes to lectures",function(){
			video.seek(20)
			invideo_quiz.create(invideo_quiz.ocq)
			invideo_quiz.add_answer(params.q_x, params.q1_y)
			invideo_quiz.add_answer(params.q_x, params.q2_y)
			invideo_quiz.add_answer(params.q_x, params.q3_y)
			invideo_quiz.save_quiz()
		})
		it("should open module ", function(){
	    	navigator.module(3).open()
		})
		it("should check module statistics",function(){			
			expect(course_editor.total_time).toEqual("00:06:05")
	    	expect(course_editor.total_lecture_questions).toEqual("1")
	    	expect(course_editor.total_quiz_questions).toEqual("0")
		})
		
		it("should add a quiz",function(){
			course_editor.add_quiz()
		})
		it("should add questions to quiz",function(){
			quiz.add_header()
			quiz.type_header('first header')

			quiz.add_question()
			var question = quiz.question(2)
			question.type_title('mcq question')
			question.type_answer("answer 1")
			question.correct_answer()
			question.add_answer()
			question.type_answer("answer 2")
			question.add_answer()
			question.type_answer("answer 3")
			quiz.save()
		})
		it("should open module ", function(){
	    	navigator.module(3).open()
		})
		it("should check module statistics",function(){			
			expect(course_editor.total_time).toEqual("00:06:05")
	    	expect(course_editor.total_lecture_questions).toEqual("1")
	    	expect(course_editor.total_quiz_questions).toEqual("1")
		})
		it("should open first lecture",function(){
			navigator.module(3).open_item(1)
		})
		it("should delete lecture quiz",function(){
			invideo_quiz.delete(1)
		})
		it("should open module ", function(){
	    	navigator.module(3).open()
		})
		it("should check module statistics",function(){			
			expect(course_editor.total_time).toEqual("00:06:05")
	    	expect(course_editor.total_lecture_questions).toEqual("0")
	    	expect(course_editor.total_quiz_questions).toEqual("1")
		})

		it("should delete lecture ", function(){
	    	navigator.module(3).delete_item(1)
		})
		it("should check module statistics",function(){			
			expect(course_editor.total_time).toEqual("0:00")
	    	expect(course_editor.total_lecture_questions).toEqual("0")
	    	expect(course_editor.total_quiz_questions).toEqual("1")
		})

		it("should open quiz",function(){
			navigator.module(3).open_item(1)
		})

		it("should delete quiz",function(){
			quiz.question(1).delete()
			expect(quiz.questions.count()).toEqual(1)
			quiz.save()
		})

		it("should open module ", function(){
	    	navigator.module(3).open()
		})
		it("should check module statistics",function(){			
			expect(course_editor.total_time).toEqual("0:00")
	    	expect(course_editor.total_lecture_questions).toEqual("0")
	    	expect(course_editor.total_quiz_questions).toEqual("1")
		})
		it("should open quiz",function(){
			navigator.module(3).open_item(1)
		})

		it("should delete quiz",function(){
			quiz.question(1).delete()
			expect(quiz.questions.count()).toEqual(0)
			quiz.save()
		})
		it("should open module ", function(){
	    	navigator.module(3).open()
		})
		it("should check module statistics",function(){			
			expect(course_editor.total_time).toEqual("0:00")
	    	expect(course_editor.total_lecture_questions).toEqual("0")
	    	expect(course_editor.total_quiz_questions).toEqual("0")
		})
	})

	describe("Revert Changes - Teacher",function(){
		it("should delete quiz",function(){
	    	navigator.module(3).delete_item(1)
		})
		it("should delete module",function(){
			navigator.module(3).delete()
			expect(navigator.modules.count()).toEqual(2)
		})
	})
})