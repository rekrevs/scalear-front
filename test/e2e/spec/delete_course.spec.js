var Header = require('./pages/header');
var ContentNavigator = require('./pages/content_navigator');
var CourseList = require('./pages/course_list');
var InvideoQuiz = require('./pages/invideo_quiz');
var NormalQuiz = require('./pages/normal_quiz');
var Login = require('./pages/login');
var SubHeader = require('./pages/sub_header');
var sleep = require('./lib/utils').sleep;
var scroll_bottom = require('./lib/utils').scroll_bottom;
var scroll = require('./lib/utils').scroll;
var params = browser.params;
var login_page = new Login()
var sub_header = new SubHeader()
var header = new Header()
var course_list = new CourseList()
var invideo_quiz = new InvideoQuiz();
var quiz = new NormalQuiz();
var navigator = new ContentNavigator(1)

describe("Deleting Course",function(){
	describe("Teacher",function(){
		it("should login as teacher",function(){
			login_page.sign_in(params.teacher1.email, params.password)
		})
		it("should open course",function(){
			course_list.open()
			course_list.open_course(1)
		})
		it("should go to edit mode",function(){
			sub_header.open_edit_mode()
		})
		it("should open first lecture in first module",function(){
			navigator.module(1).open()
			navigator.module(1).item(1).open()
		})
		it("should delete video quizzes in first lecture",function(){
			invideo_quiz.open(3)
			expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
			invideo_quiz.delete(2)
			// expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
			invideo_quiz.open(1)
			invideo_quiz.delete_from_editor()
			// expect(invideo_quiz.editor_panel.isPresent()).toEqual(false);
			invideo_quiz.delete(1)
			// expect(invideo_quiz.editor_panel.isPresent()).toEqual(false);
		})
		it("should open second lecture in first module",function(){
			navigator.module(1).item(2).open()
		})
		it("should delete video quizzes in second lecture",function(){
			invideo_quiz.open(3)
			invideo_quiz.delete_from_editor()
			// expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
			invideo_quiz.delete(2)
			// expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);

			// expect(invideo_quiz.editor_panel.isPresent()).toEqual(false);
			invideo_quiz.delete(1)
			// expect(invideo_quiz.editor_panel.isPresent()).toEqual(false);
		})

		it("should open third lecture in first module",function(){
			navigator.module(1).item(3).open()
		})
		it("should delete video quizzes in third lecture",function(){
			invideo_quiz.open(2)
			invideo_quiz.delete_from_editor()
			// expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
			invideo_quiz.delete(1)
			// expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);

			// expect(invideo_quiz.editor_panel.isPresent()).toEqual(false);
		})
		it("should open first quiz in first module",function(){
			navigator.module(1).item(4).open()
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
			scroll(-40)
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

			quiz.save()
		})

		it("should open second quiz in first module",function(){
			navigator.module(1).item(5).open()
		})
		it("should delete questions from second quiz",function(){
			quiz.question(7).delete()
			scroll(-40)
			quiz.question(6).delete()
			quiz.question(5).delete()
			quiz.question(4).delete()
			quiz.question(3).delete()
			quiz.question(2).delete()
			quiz.question(1).delete()
			expect(quiz.questions.count()).toEqual(0)
			quiz.save()
		})

		it("should open survey in first module",function(){
			navigator.module(1).item(6).open()
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

			quiz.save()
		})

		it("should delete items in second module and the module itself",function(){
			var module = navigator.module(2)
			module.open()
			expect(module.items.count()).toEqual(6)
			module.item(6).delete()
			expect(module.items.count()).toEqual(5)
			module.item(5).delete()
			expect(module.items.count()).toEqual(4)
			module.item(4).delete()
			expect(module.items.count()).toEqual(3)
			module.item(3).delete()
			expect(module.items.count()).toEqual(2)
			module.item(2).delete()
			expect(module.items.count()).toEqual(1)
			module.item(1).delete()
			expect(module.items.count()).toEqual(0)
			module.delete()
			expect(navigator.modules.count()).toEqual(1)
		})

		it("should delete items in first module and module itself",function(){
			var module = navigator.module(1)
			module.open()
			expect(module.items.count()).toEqual(6)
			module.item(6).delete()
			expect(module.items.count()).toEqual(5)
			module.item(5).delete()
			expect(module.items.count()).toEqual(4)
			module.item(4).delete()
			expect(module.items.count()).toEqual(3)
			module.item(3).delete()
			expect(module.items.count()).toEqual(2)
			module.item(2).delete()
			expect(module.items.count()).toEqual(1)
			module.item(1).delete()
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
