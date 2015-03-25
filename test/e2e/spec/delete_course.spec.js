var Header = require('./pages/header');
var ContentNavigator = require('./pages/content_navigator');
var CourseList = require('./pages/course_list');
var InvideoQuiz = require('./pages/invideo_quiz');
var NormalQuiz = require('./pages/normal_quiz');
var Login = require('./pages/login');
var login_page = new Login()
var params = browser.params;

var header = new Header()
var course_list = new CourseList()
var invideo_quiz = new InvideoQuiz();
var quiz = new NormalQuiz();
var navigator = new ContentNavigator(1)

describe("Filling Course",function(){
	describe("Teacher",function(){
		it("should login as teacher",function(){
			login_page.sign_in(params.teacher_mail, params.password)
		})
		it("should open course",function(){
			course_list.open()
			course_list.open_course(1)
		})
		it("should open first lecture in first module",function(){
			navigator.module(1).open()
			navigator.module(1).open_item(1)
		})
		it("should delete video quizzes in first lecture",function(){
			invideo_quiz.open(3)
			expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
			invideo_quiz.delete(2)
			expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
			invideo_quiz.delete_from_editor()
			expect(invideo_quiz.editor_panel.isPresent()).toEqual(false);
			invideo_quiz.delete(1)
			expect(invideo_quiz.editor_panel.isPresent()).toEqual(false);
		})
		it("should open second lecture in first module",function(){
			navigator.module(1).open_item(2)
		})
		it("should delete video quizzes in second lecture",function(){
			invideo_quiz.open(3)
			expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
			invideo_quiz.delete(2)
			expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
			invideo_quiz.delete_from_editor()
			expect(invideo_quiz.editor_panel.isPresent()).toEqual(false);
			invideo_quiz.delete(1)
			expect(invideo_quiz.editor_panel.isPresent()).toEqual(false);
		})

		it("should open third lecture in first module",function(){
			navigator.module(1).open_item(3)
		})
		it("should delete video quizzes in third lecture",function(){
			invideo_quiz.open(2)
			expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
			invideo_quiz.delete(1)
			expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
			invideo_quiz.delete_from_editor()
			expect(invideo_quiz.editor_panel.isPresent()).toEqual(false);
		})
		it("should open first quiz in first module",function(){
			navigator.module(1).open_item(4)
		})

		it("should delete questions and answers from first quiz",function(){
			expect(quiz.questions.count()).toEqual(7)
			var question = quiz.question(7)
			expect(question.answers.count()).toEqual(3)
			question.delete_answer(3)
			expect(question.answers.count()).toEqual(2)
			question.delete_answer(2)
			expect(question.answers.count()).toEqual(1)
			question.delete()
			expect(quiz.questions.count()).toEqual(6)
			var question = quiz.question(6)
			question.delete()
			expect(quiz.questions.count()).toEqual(5)
			var question = quiz.question(5)
			question.delete()
			expect(quiz.questions.count()).toEqual(4)

			var question = quiz.question(4)
			expect(question.answers.count()).toEqual(3)
			question.delete_answer(3)
			expect(question.answers.count()).toEqual(2)
			question.delete_answer(2)
			expect(question.answers.count()).toEqual(1)
			question.delete()
			expect(quiz.questions.count()).toEqual(3)

			var question = quiz.question(3)
			question.delete()
			expect(quiz.questions.count()).toEqual(2)

			var question = quiz.question(2)
			expect(question.answers.count()).toEqual(3)
			question.delete_answer(3)
			expect(question.answers.count()).toEqual(2)
			question.delete_answer(2)
			expect(question.answers.count()).toEqual(1)
			question.delete()
			expect(quiz.questions.count()).toEqual(1)

			var question = quiz.question(1)
			question.delete()
			expect(quiz.questions.count()).toEqual(0)
		})

		it("should open second quiz in first module",function(){
			navigator.module(1).open_item(5)
		})
		it("should delete questions from second quiz",function(){
			quiz.question(7).delete()
			quiz.question(6).delete()
			quiz.question(5).delete()
			quiz.question(4).delete()
			quiz.question(3).delete()
			quiz.question(2).delete()
			quiz.question(1).delete()
			expect(quiz.questions.count()).toEqual(0)
		})

		it("should open survey in first module",function(){
			navigator.module(1).open_item(6)
		})
		it("should delete questions and answers from survey",function(){
			var question = quiz.question(5)
			question.delete()
			expect(quiz.questions.count()).toEqual(4)

			var question = quiz.question(4)
			expect(question.answers.count()).toEqual(3)
			question.delete_answer(3)
			expect(question.answers.count()).toEqual(2)
			question.delete_answer(2)
			expect(question.answers.count()).toEqual(1)
			question.delete()
			expect(quiz.questions.count()).toEqual(3)

			var question = quiz.question(3)
			question.delete()
			expect(quiz.questions.count()).toEqual(2)

			var question = quiz.question(2)
			expect(question.answers.count()).toEqual(3)
			question.delete_answer(3)
			expect(question.answers.count()).toEqual(2)
			question.delete_answer(2)
			expect(question.answers.count()).toEqual(1)
			question.delete()
			expect(quiz.questions.count()).toEqual(1)

			var question = quiz.question(1)
			question.delete()
			expect(quiz.questions.count()).toEqual(0)
		})

		////////
		it("should delete items in second module and the module itself",function(){
			var module = navigator.module(2)
			module.open()
			expect(module.items.count()).toEqual(6)
			module.delete_item(6)
			expect(module.items.count()).toEqual(5)
			module.delete_item(5)
			expect(module.items.count()).toEqual(4)
			module.delete_item(4)
			expect(module.items.count()).toEqual(3)
			module.delete_item(3)
			expect(module.items.count()).toEqual(2)
			module.delete_item(2)
			expect(module.items.count()).toEqual(1)
			module.delete_item(1)
			expect(module.items.count()).toEqual(0)
			module.delete()
			expect(navigator.modules.count()).toEqual(1)
		})

		it("should delete items in first module and module itself",function(){
			var module = navigator.module(1)
			module.open()
			expect(module.items.count()).toEqual(6)
			module.delete_item(6)
			expect(module.items.count()).toEqual(5)
			module.delete_item(5)
			expect(module.items.count()).toEqual(4)
			module.delete_item(4)
			expect(module.items.count()).toEqual(3)
			module.delete_item(3)
			expect(module.items.count()).toEqual(2)
			module.delete_item(2)
			expect(module.items.count()).toEqual(1)
			module.delete_item(1)
			expect(module.items.count()).toEqual(0)
			module.delete()
			expect(navigator.modules.count()).toEqual(0)
		})

		it("should delete course",function(){
			course_list.open()
			course_list.delete_course(1)
			expect(course_list.courses.count()).toEqual(0)
		})
		it("should logout",function(){
			header.logout()
		})
	})
})