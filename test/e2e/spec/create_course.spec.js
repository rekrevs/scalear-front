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
			sleep(5000)
			header.close_join_course()
			header.logout()
		})
	    it('teacher should enable registration', function(){ // enrollment url was removed from information page 
		    login_page.sign_in(params.teacher1.email, params.password)
			course_list.open()
			course_list.open_teacher_course(1)
			course_info.open()
			var enrollment_url = course_info.enrollment_url
			course_info.disable_registration_button_click()
			expect(course_info.disable_registration_button.isSelected()).toBe(false);
			header.logout()
		})
	    it('teacher should enable registration for only his email domain', function(){ // enrollment url was removed from information page 
		    login_page.sign_in(params.teacher1.email, params.password)
			course_list.open()
			course_list.open_teacher_course(1)
			course_info.open()
			course_info.disable_registration_domain_button_click()
			course_info.disable_registration_domain_choose_custom()
			expect(course_info.disable_registration_domain_subdomains.count()).toBe(1);
			course_info.disable_registration_domain_choose_subdomain(1)
	        browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
			header.logout()
		})
    })
	
	it('should get the enrollment key and enroll students', function(){
	    login_page.sign_in(params.teacher1.email, params.password) 
		course_list.open()
		course_list.open_teacher_course(1)
		var enrollment_key = course_info.enrollmentkey
		header.logout()
	    login_page.sign_in(params.student1.email, params.password) 
	    header.join_course(enrollment_key) 
	    header.logout() 		 
		login_page.sign_in(params.student2.email, params.password)
		header.join_course(enrollment_key)
		header.logout()
		login_page.sign_in(params.student3.email, params.password)
		header.join_course(enrollment_key)
		login_page.sign_in(params.student1_domain_test.email, params.password)
		header.join_course(enrollment_key)
		expect(browser.driver.getCurrentUrl()).toContain('dashboard')
		expect(browser.driver.getCurrentUrl()).not.toContain('information')
        browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
	})
	it("should logout",function(){
		header.logout()
	})

})
