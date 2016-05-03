var Header = require('./pages/header');
var Login = require('./pages/login');
var Signup = require('./pages/sign_up');
var GuerrillaMail = require('./pages/guerrilla_mail');
var CourseEditor = require('./pages/course_editor');
var ContentNavigator = require('./pages/content_navigator');
var CourseInformation = require('./pages/course_information');
var CourseList = require('./pages/course_list');
var StudentLecture = require('./pages/student/lecture');
var ShareModal = require('./pages/share_modal');
var SharedPage = require('./pages/shared_page');
var NewCourse = require('./pages/new_course');
var scroll = require('./lib/utils').scroll;
var sleep = require('./lib/utils').sleep;
var Video = require('./pages/video');

var params = browser.params;

var header = new Header()
var login_page = new Login()
var signup_page = new Signup()
var guerrilla_mail_page = new GuerrillaMail()
var course_editor = new CourseEditor()
var course_info = new CourseInformation()
var course_list = new CourseList()
var student_lec = new StudentLecture()
var share_window = new ShareModal()
var shared = new SharedPage()
var new_course = new NewCourse()
var video = new Video();

describe("Revert Changes",function(){
	describe("guerrillamail teacher 1",function(){
		it("should login",function(){
            login_page.sign_in(params.teacher_mail, params.guerrillamail_password)
       })
        it("should check that course has been removed",function(){
        	course_list.open()
        	expect(course_list.courses.count()).toEqual(0)
        })
        it("should delete teacher account",function(){
            header.open_account_information()
            header.delete_user(params.guerrillamail_password)
        })
	})
	describe("guerrillamail teacher 2",function(){
		it("should login",function(){
            login_page.sign_in(params.teacher2_mail, params.guerrillamail_password)
       })
        it("should check that course has been removed",function(){
        	course_list.open()
        	expect(course_list.courses.count()).toEqual(0)
        })
        it("should delete teacher account",function(){
            header.open_account_information()
            header.delete_user(params.guerrillamail_password)
        })
	})	
	describe("guerrillamail student 1",function(){
		it("should login",function(){
            login_page.sign_in(params.student_mail, params.guerrillamail_password)
       })
        it("should delete student account",function(){
            header.open_account_information()
            header.delete_user(params.guerrillamail_password)
        })
	})
	describe("guerrillamail student 2",function(){
		it("should login",function(){
            login_page.sign_in(params.student2_mail, params.guerrillamail_password)
       })
        it("should delete student account",function(){
            header.open_account_information()
            header.delete_user(params.guerrillamail_password)
        })
	})
	describe("guerrillamail student 3",function(){
		it("should login",function(){
            login_page.sign_in(params.student3_mail, params.guerrillamail_password)
       })
        it("should delete student account",function(){
            header.open_account_information()
            header.delete_user(params.guerrillamail_password)
        })
	})
})
