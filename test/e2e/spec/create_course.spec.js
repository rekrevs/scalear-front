var NewCourse = require('./pages/new_course');
var CourseInformation = require('./pages/course_information');
var Header = require('./pages/header');
var Login = require('./pages/login');
var CourseList = require('./pages/course_list');
var sleep = require('./lib/utils').sleep;

var params = browser.params;

var header = new Header()
var login_page = new Login()
var	new_course = new NewCourse();
var course_info = new CourseInformation()
var course_list = new CourseList()

describe("Need an 'add course URL' and  Enable/disable registration",function(){
	describe("teacher ",function(){		
		it("should login as teacher",function(){
			login_page.sign_in(params.teacher1.email, params.password)
		})
		it('should create course', function(){
			new_course.open()
			new_course.create(params.short_name, params.course_name, params.course_end_date, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
		})
		it('should open course information', function(){
			course_info.open()
			course_info.disable_registration_button_click()
		})
		it('should disable registration ', function(){
			course_info.display_registration_field.click()
			
			var newdate = new Date();
			newdate.setDate(newdate.getDate() - 2);
			
			course_info.type_display_registration_date(newdate)
			expect(course_info.disable_registration_button.isSelected()).toBe(true);
		})
		
		it('student 1 should cannot join course', function(){
			course_info.open()
			var enrollment_key = course_info.enrollmentkey
			header.logout()
			login_page.sign_in(params.student1.email, params.password)
			header.join_course(enrollment_key)
			header.reject_join_course.getText().then(function (text) { expect(text).toEqual("Registration is disabled for this course, contact your teacher to enable registration.") });

		})
		it('teacher should enable ', function(){
			// sleep(2000)
			header.close_join_course()
			header.logout()
			// sleep(5000)
		    login_page.sign_in(params.teacher1.email, params.password)
			course_list.open()
			course_list.open_teacher_course(1)
			course_info.open()
			var enrollment_url = course_info.enrollment_url
			course_info.disable_registration_button_click()
			expect(course_info.disable_registration_button.isSelected()).toBe(false);
			header.logout()
			login_page.sign_in(params.student1.email, params.password)
			sleep(2000)
			browser.driver.get(enrollment_url)
			sleep(3000)
			expect(browser.driver.getCurrentUrl()).toContain('information')
			header.logout()
			login_page.sign_in(params.teacher1.email, params.password)
		})
    })
	
	it('should get the enrollment key and enroll students', function(){
		course_list.open()
		course_list.open_teacher_course(1)
		var enrollment_key = course_info.enrollmentkey
		header.logout()
		login_page.sign_in(params.student2.email, params.password)
		header.join_course(enrollment_key)
		header.logout()
		login_page.sign_in(params.student3.email, params.password)
		header.join_course(enrollment_key)
	})

	it("should logout",function(){
		header.logout()
	})
})
