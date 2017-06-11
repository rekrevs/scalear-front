var ContentNavigator = require('./pages/content_navigator');
// var CourseEditor = require('./pages/course_editor');
var CourseList = require('./pages/course_list');
// var InvideoQuiz = require('./pages/invideo_quiz');
// var NormalQuiz = require('./pages/normal_quiz');
var Video = require('./pages/video');
// var MarkerPanel = require('./pages/marker');
var sleep = require('./lib/utils').sleep;
// var refresh= require('./lib/utils').refresh;
var Login = require('./pages/login');
var Header = require('./pages/header');
var SubHeader = require('./pages/sub_header');
// var ContentItems = require('./pages/content_items');
// var ModuleProgress = require('./pages/module_progress');
// var StudentQuiz = require('./pages/student/quiz');
var StudentLecture = require('./pages/student/lecture');
// var StudentModuleSummary = require('./pages/student/module_summary');
// var Dashboard = require('./pages/dashboard');


var params = browser.params;
var header = new Header()
var sub_header = new SubHeader
// var course_editor = new CourseEditor()
var login_page = new Login()
var course_list = new CourseList()
var video = new Video();
// var marker = new MarkerPanel();
// var invideo_quiz = new InvideoQuiz();
// var quiz = new NormalQuiz();
// var content_items= new ContentItems()
// var navigator = new ContentNavigator(1)
// var module_progress = new ModuleProgress()
// var student_quiz = new StudentQuiz()
var student_lec = new StudentLecture()
// var student_module_summary = new StudentModuleSummary()
// var dashboard = new Dashboard()


	// Student free text video quiz with explanation 
	// Case where quizzes are less than a second apart 
	// Case where a quiz is at the end of a video 
	// checkIfQuizSolved” in “scripts/controllers/student/lectures/lectures_middle_ctrl.js 

xdescribe("teacher",function(){
    it("should login", function() {
      login_page.sign_in(params.teacher1.email, params.password)
    })
    it("should open course", function() {
      course_list.open()
      course_list.open_teacher_course(1)
    })
    it("should go to edit mode", function() {
      sub_header.open_edit_mode()
    })
    it("should open first lecture in first module", function() {
      navigator.module(1).open()
      navigator.module(1).item(1).open()
      navigator.close()
    })
	 // 2 quizzes with 1-sec differences 
	 // quiz and the end of the video


	it('should logout',function(){
		header.logout()
	})
})