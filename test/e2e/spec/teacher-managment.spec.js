var Header = require('./pages/header');
var Login = require('./pages/login');
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

var params = browser.params;

var header = new Header()
var login_page = new Login()
var course_editor = new CourseEditor()
var course_info = new CourseInformation()
var course_list = new CourseList()
var student_lec = new StudentLecture()
var share_window = new ShareModal()
var shared = new SharedPage()
var new_course = new NewCourse()


describe("Teacher Management",function(){
	describe("Teacher1",function(){
		it("should login as teacher",function(){
			login_page.sign_in(params.teacher_mail, params.password)
		})
		it("should open course",function(){
	        course_list.open()
	        course_list.open_course(1)
	    })
	    var navigator = new ContentNavigator(1)
		it('should check number of teachers intially', function(){
			// course_info.open()
			expect(course_info.teachers.count()).toEqual(1)
		})
		it('should add a teacher', function(){
			expect(course_info.email_field.isDisplayed()).toEqual(false);
			expect(course_info.role_field.isDisplayed()).toEqual(false);
			course_info.add_teacher()
			expect(course_info.email_field.isDisplayed()).toEqual(true);
			expect(course_info.role_field.isDisplayed()).toEqual(true);
			course_info.type_email(params.teacher2_mail)
			course_info.select_role(2)
			course_info.invite()
			expect(course_info.teachers.count()).toEqual(2)
		})
		it("should logout",function(){
            header.logout()
        })
    })
    describe("Teacher2",function(){
        it("should login",function(){        	
            login_page.sign_in(params.teacher2_mail, params.password)
        })
        it('should accept invitation to course', function(){
            header.show_notification()
            expect(header.invitation_notifications.count()).toEqual(1)
            header.accept_invitation_notification(1)
            expect(header.notification_menu.isPresent()).toBe(false)
        })
        it('should check that it redirected to the course information page', function(){
            expect(browser.driver.getCurrentUrl()).toContain('information')
        })
        it("should logout",function(){
            header.logout()
        })
    })
    describe("Student1",function(){
    	it("should login", function(){    		
			login_page.sign_in(params.student_mail, params.password)
		})
		var navigator = new ContentNavigator(1)
		it('should open course information', function(){
			course_list.open()
			course_list.open_course(1)
			course_info.student.open()			
		})
		it("should check number of teacher ",function(){
			expect(course_info.teachers.count()).toEqual(2)
		})
		it("should logout",function(){
            header.logout()
        })
    })
})
describe("Revert Changes",function(){
	describe("Teacher1",function(){
		var navigator = new ContentNavigator(1)
		it("should login",function(){
            login_page.sign_in(params.teacher_mail, params.password)
        })
        it('should open course information', function(){
			course_list.open()
			course_list.open_course(1)
			course_info.open()
			expect(course_info.teachers.count()).toEqual(2)
		})
		it("should delete second teacher",function(){
			course_info.delete_teacher(2)
		})
		// it("should delete second teacher",function(){
		// 	course_info.delete_teacher(1)
		// })
		it("should logout",function(){
            header.logout()
        })
	})
	describe("Teacher2",function(){
		it("should login",function(){
            login_page.sign_in(params.teacher2_mail, params.password)
        })
        it("should check that course has been removed",function(){
        	course_list.open()
        	expect(course_list.courses.count()).toEqual(0)
        })
        it("should logout",function(){
            header.logout()
        })
	})
})