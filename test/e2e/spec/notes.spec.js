var ContentNavigator = require('./pages/content_navigator');
var CourseList = require('./pages/course_list');
var Video = require('./pages/video');
var Header = require('./pages/header');
var Login = require('./pages/login');
var StudentLecture = require('./pages/student/lecture');
var sleep = require('./lib/utils').sleep;
var params = browser.params;

var course_list = new CourseList()
var video = new Video();
var header = new Header()
var login_page = new Login()
var student_lec = new StudentLecture()

describe("Notes",function(){
	describe("Student",function(){
		it("should login", function(){
			login_page.sign_in(params.student1.email, params.password)
		})
		var navigator = new ContentNavigator(1)
		it('should open first course', function(){
			course_list.open()
			course_list.open_course(1)
		})
		it('should open first lecture in first module', function(){
			navigator.module(1).open()
			navigator.module(1).item(3).open()
			navigator.close()
		})
		it("should seek to 67%",function(){
			video.seek(67)
		})
		it("should open timeline",function(){
			student_lec.open_timeline()
		})
		it("should add a note",function(){
			student_lec.add_note()
			student_lec.lecture(3).type_note("Some note text for testing.")
			expect(student_lec.lecture(3).notes.count()).toEqual(1)
			expect(student_lec.lecture(3).note(1).getText()).toEqual("Some note text for testing.")
		})
		// it("should add a note Text ",function(){
		// 	// student_lec.add_note()
		// 	// student_lec.lecture(3).type_note("Some note text for testing.")
		// 	// expect(student_lec.lecture(3).notes.count()).toEqual(1)
		// 	expect(student_lec.lecture(3).note(1).getText()).toEqual("Some note text for testing.")
		// })
		it("should edit note",function(){
			student_lec.lecture(3).edit_note(1)

			student_lec.lecture(3).type_note("Editied note for testing.")
			expect(student_lec.lecture(3).notes.count()).toEqual(1)
			expect(student_lec.lecture(3).note(1).getText()).toEqual("Editied note for testing.")
		})
		it("should delete note",function(){
			student_lec.lecture(3).delete_note(1)
			expect(student_lec.lecture(3).notes.count()).toEqual(0)
		})
		it("should add an empty note",function(){
			student_lec.add_note()
			student_lec.lecture(3).type_note("")
			expect(student_lec.lecture(3).notes.count()).toEqual(0)

		})
		it("should logout",function(){
			student_lec.close_timeline()
			header.logout()
		})
	})
})
