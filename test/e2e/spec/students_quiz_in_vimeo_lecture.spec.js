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
var SubHeader = require('./pages/sub_header');

var params = browser.params;

var course_list = new CourseList()
var video = new Video();
var quiz = new NormalQuiz();
var header = new Header()
var sub_header = new SubHeader()
var login_page = new Login()
var course_editor = new CourseEditor()
var student_lec = new StudentLecture()
var student_quiz = new StudentQuiz()

describe("Solve Course",function(){
	describe("First Student",function(){
		it("should login", function(){
			login_page.sign_in(params.student1.email, params.password)
		})
		var navigator = new ContentNavigator(1)
		it('should open first course', function(){
			course_list.open()
			course_list.open_student_course(1)
		})
		describe("First Module",function(){
			it("should open first module",function(){
				navigator.module(1).open()
				navigator.module(1).item(1).open()
				navigator.close()
			})
			it("should seek video to 50%",function(){
				browser.refresh()
				video.wait_till_ready()
				video.play()
				video.seek(20)
				student_lec.wait_for_quiz()
				sleep(3000)
			})
			it('should expect OCQ quiz', function(){
				expect(student_lec.check_answer_button.isDisplayed()).toEqual(true);
			})
			it("should answer OCQ quiz",function(){
				student_lec.mark_answer(1)
				student_lec.check_answer()
				student_lec.check_answer_button.click()			
			})
			it("should check that it is correct",function(){
				expect(student_lec.notification).toContain("Correct")
				sleep(3000)
			})
			xit("should check explanation",function(){
				student_lec.show_explanation(1)
				expect(student_lec.explanation_title).toContain("Incorrect")
				expect(student_lec.explanation_content).toContain("explanation 1")
			})
			xit('wait for the voting question', function(){
				video.play()
				sleep(1000)
				video.pause()
				student_lec.wait_for_vote()
			})
			xit('should request that the question not be reviewed in class', function(){
				student_lec.request_review_inclass()
			})

		})
	})
})