var NewCourse = require('./pages/new_course');
var CourseInformation = require('./pages/course_information');
var Header = require('./pages/header');
var Login = require('./pages/login');
var CourseList = require('./pages/course_list');
var sleep = require('./lib/utils').sleep;
var Signup = require('./pages/sign_up');
var SubHeader = require('./pages/sub_header')
var StudentList = require('./pages/teacher/student_list');

var params = browser.params;
var header = new Header()
var login_page = new Login()
var	new_course = new NewCourse();
var course_info = new CourseInformation()
var course_list = new CourseList()
var signup_page = new Signup()
var sub_header = new SubHeader()
var student_list = new StudentList();

describe("Email domain .uu.nl is prevented from sign up",function(){
		it("should sign up ",function(){
			signup_page.sign_up('teacher')
			signup_page.create("a.@eg.uu.nl", params.password , params.guerrillamail_sch_uni_name , '1' , params.teacher_first_name ,params.teacher1.email)
		})
		it("should check url does not contant thanks pages",function(){
			sleep(6000)
			expect(browser.driver.getCurrentUrl()).not.toContain('thanks')
			expect(browser.driver.getCurrentUrl()).toContain('users/signup')
			signup_page.go_to_sign_up_with_domain_page()
		})
		it("should check you still in login page",function(){
			sleep(2000)
			expect(browser.driver.getCurrentUrl()).toContain('login')
		})
})

describe("Need an 'add course URL' and  Enable/disable registration",function(){
	describe("teacher ",function(){
		it("should login as teacher",function(){
			login_page.sign_in(params.teacher1.email, params.password)
		})
		xit('should create course', function(){
			new_course.open()
			new_course.create(params.short_name, params.course_name, params.course_end_date, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
		})
		xit('should disable email reminders', function(){
			new_course.disable_email_reminders_modal_button_click()
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
			header.close_join_course()
			header.logout()
		})
	    it('teacher should enable registration', function(){  
		    login_page.sign_in(params.teacher1.email, params.password)
			course_list.open()
			course_list.open_teacher_course(1)
			course_info.open()
			var enrollment_url = course_info.enrollment_url
			course_info.disable_registration_button_click()
			expect(course_info.disable_registration_button.isSelected()).toBe(false);
			header.logout()
		})

    })
	
	describe("Need an 'add course URL' and  Enable/disable registration",function(){
		// should enable registration for all and S1 , S1Domain should regisiter 
		it('should enable registration for all and enroll students', function(){
		    login_page.sign_in(params.teacher1.email, params.password) 
			course_list.open()
			course_list.open_teacher_course(1)
			var enrollment_key = course_info.enrollmentkey
			header.logout()
		    login_page.sign_in(params.student1.email, params.password) 
		    header.join_course(enrollment_key)
			new_course.disable_student_email_reminders_button_click()
		    header.logout()
			login_page.sign_in(params.student1_domain_test.email, params.password)
			header.join_course(enrollment_key)
			new_course.disable_student_email_reminders_button_click()
			course_list.open()
			expect(course_list.student_courses.count()).toEqual(1)
		})

		// teacher remover s1domain student
		it("student1_domain_test should delete course",function(){
			course_list.delete_student_course(1)
			expect(course_list.student_courses.count()).toEqual(0)
			header.logout()
		})

		// should enable registration for only sharklasers and S2 , S1Domain should try to regisiter and s1domain can not regisiter
	    it('teacher should enable registration for only his email domain', function(){  
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
		it('should get the enrollment key and enroll students and student1_domain_test should not be able to enroll', function(){
		    login_page.sign_in(params.teacher1.email, params.password) 
			course_list.open()
			course_list.open_teacher_course(1)
			var enrollment_key = course_info.enrollmentkey
			header.logout()
			login_page.sign_in(params.student2.email, params.password)
			header.join_course(enrollment_key)
			new_course.disable_student_email_reminders_button_click()
			header.logout()
			login_page.sign_in(params.student1_domain_test.email, params.password)
			header.join_course(enrollment_key)
			expect(browser.driver.getCurrentUrl()).toContain('dashboard')
			expect(browser.driver.getCurrentUrl()).not.toContain('information')
	        browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
			header.logout()
		})

		// should enable registration for all and S3 , S1Domain should regisiter 
	    it('teacher should enable registration ', function(){  
		    login_page.sign_in(params.teacher1.email, params.password)
			course_list.open()
			course_list.open_teacher_course(1)
			course_info.open()
			course_info.disable_registration_domain_button_click()
			course_info.disable_registration_domain_choose_all()
	        browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
			header.logout()
		})
		var enrollment_url
		it('should get the enrollment URL ', function(){
			login_page.sign_in(params.teacher1.email, params.password) 
			course_list.open()
			course_list.open_teacher_course(1)
			sub_header.open_add_students()
			sub_header.enrollment_url.getText().then(function (text) {enrollment_url = text; console.log(enrollment_url) } )
	        browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
			// header.logout()
		})
		it('should logout ', function(){
			// browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
			// sleep(4000)
			header.logout()
		})		
		it('should enroll student 3 through URL LINK ', function(){
			console.log(enrollment_url)
			login_page.sign_in(params.student3.email, params.password)
			browser.get(enrollment_url);
		})		
		it('should enroll student 3 through URL LINK ', function(){
			new_course.disable_student_email_reminders_button_click()
			course_list.open()
			expect(course_list.student_courses.count()).toEqual(1)
			header.logout()
		})		
		// // teacher remover s1domain student
		// it("student1_domain_test should delete course",function(){
		// 	// login_page.sign_in(params.student1_domain_test.email, params.password)			
		// 	// course_list.open()
		// 	course_list.delete_student_course(1)
		// 	expect(course_list.student_courses.count()).toEqual(0)
		// 	header.logout()
		// })
		// should enable registration for only sharklasers and S1Domain should try to regisiter and s1domain can not regisiter
	    it('teacher should enable registration for only his email domain', function(){  
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
		it('student1_domain_test should not be able to enroll', function(){
		    login_page.sign_in(params.teacher1.email, params.password) 
			course_list.open()
			course_list.open_teacher_course(1)
			var enrollment_key = course_info.enrollmentkey
			header.logout()
			login_page.sign_in(params.student1_domain_test.email, params.password)
			header.join_course(enrollment_key)
			expect(browser.driver.getCurrentUrl()).toContain('dashboard')
			expect(browser.driver.getCurrentUrl()).not.toContain('information')
	        browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
			header.logout()
		})


	})
})

describe("New Course test rest of functions",function(){
	describe("teacher ",function(){
		it("should login as teacher",function(){
			login_page.sign_in(params.teacher1.email, params.password)
		})
        it('should create another course', function(){
            new_course.open()
            new_course.create("short_name", "course_name",params.course_end_date, params.discussion_link, params.image_link, "course_description", "prerequisites");
            new_course.disable_email_reminders_modal_button_click()
        })
		// Import course: canceling selected course 
		it('should Import course: canceling selected course ', function(){			
			new_course.open()			
			new_course.choose_import_first_course()
			expect(new_course.description_field.getText()).toEqual('too many words ')
			expect(new_course.prerequisites_field.getText()).toEqual('1- course 1 2- course 2 3- course 3 ')
			new_course.unselect_button.click()
			new_course.choose_import_first_course()
			expect(new_course.description_field.getText()).toContain('[Copied From aesting course 100 :]')
			expect(new_course.prerequisites_field.getText()).toContain('[Copied From aesting course 100 :]')
			new_course.unselect_button.click()
			expect(new_course.description_field.getText()).not.toContain('[Copied From aesting course 100 :]')
			expect(new_course.prerequisites_field.getText()).not.toContain('[Copied From aesting course 100 :]')
			new_course.type_description('test')
			new_course.type_prerequisites('  ')
			new_course.choose_import_first_course()
			expect(new_course.prerequisites_field.getText()).not.toContain('[Copied From aesting course 100 :]')
			expect(new_course.description_field.getText()).toContain('[Copied From aesting course 100 :]')
			new_course.type_description(' ')		
			new_course.type_prerequisites(' ')				
			$('body').sendKeys(protractor.Key.ESCAPE)			
		})
		// Import course: changing between course selection 
		it('should Import course: changing between course selection', function(){	
			course_list.open()		
			new_course.open()			
			new_course.choose_import_first_course()
			expect(new_course.description_field.getText()).toEqual('too many words ')
			expect(new_course.prerequisites_field.getText()).toEqual('1- course 1 2- course 2 3- course 3 ')
			new_course.choose_import_second_course()
			expect(new_course.description_field.getText()).toContain('[Copied From course_name :]')
			expect(new_course.prerequisites_field.getText()).toContain('[Copied From course_name :]')
			expect(new_course.description_field.getText()).not.toContain('[Copied From aesting course 100 :]')
			expect(new_course.prerequisites_field.getText()).not.toContain('[Copied From aesting course 100 :]')
			expect(new_course.description_field.getText()).toContain('course_description')
			expect(new_course.prerequisites_field.getText()).toContain('prerequisites ')
			new_course.choose_import_first_course()
			expect(new_course.description_field.getText()).not.toContain('[Copied From course_name :]')
			expect(new_course.prerequisites_field.getText()).not.toContain('[Copied From course_name :]')
			expect(new_course.description_field.getText()).toContain('[Copied From aesting course 100 :]')
			expect(new_course.prerequisites_field.getText()).toContain('[Copied From aesting course 100 :]')
			expect(new_course.description_field.getText()).not.toContain('course_description')
			expect(new_course.prerequisites_field.getText()).not.toContain('prerequisites ')
			new_course.type_description(' ')
			new_course.type_prerequisites(' ')
			$('body').sendKeys(protractor.Key.ESCAPE)
		})

		// New course: validate date 
		it('should check New course: validate date', function(){
			var newdate = new Date();
			newdate.setDate(newdate.getDate() + 200);
			new_course.type_course_start_date(newdate)
			new_course.create_button.click()
			expect(new_course.error_start_date.getText()).toEqual('must be before end date')
		})
		// New course: toggle registration 
		it('should check New course: toggle registration ', function(){
			expect(new_course.course_disable_registration).toEqual('')
			new_course.disable_registration_checked_button_click()
			expect(new_course.course_disable_registration).toEqual(new_course.course_end_date)
		})		
		it('should check New course: toggle registration ', function(){
			new_course.disable_registration_checked_button_click()
			expect(new_course.course_disable_registration).toEqual('')
			expect(new_course.course_disable_registration_field.isDisplayed()).toBe(false)
		})
		// New course: toggle domain 
		it('should check New course: toggle registration ', function(){
			expect(new_course.registration_domain_button.getText()).toContain('All')
			new_course.registration_domain_button_click()
			new_course.domain_custom_button_click()
			new_course.registration_domain_modal_close_button_click()
			expect(new_course.registration_domain_button.getText()).toContain('All')
			new_course.registration_domain_button_click()
			new_course.domain_custom_button_click()
			expect(new_course.domains.count()).toEqual(1)
			new_course.domain(1).click()
			new_course.registration_domain_modal_close_button_click()
			expect(new_course.registration_domain_button.getText()).not.toContain('All')
			expect(new_course.registration_domain_button.getText()).toContain('sharklasers.com')			
			// expect(new_course.course_disable_registration).toEqual(new_course.course_end_date)
		})		

		// New course: case with invalid course date
		it('should check New course: case with invalid course date', function(){
			new_course.type_course_start_date("2017-a-23")
			new_course.type_course_end_date("2017-a-23")
			new_course.create_button.click()
			expect(new_course.error_start_date.getText()).toEqual('not a Date')
			expect(new_course.error_end_date.getText()).toEqual('not a Date')
		})
		it('should open student list', function(){
			course_list.open()
			course_list.open_teacher_course(1)
			student_list.open()
			student_list.click_list_view()
		})
		// EnrolledStudents: select all 
		it('should check EnrolledStudents: select all  ', function(){
			expect(student_list.de_select_all_button.getAttribute('disabled')).toBe('true');
			student_list.click_select_all()
			expect(student_list.select_all_button.getAttribute('disabled')).toBe('true');
			expect(student_list.student(1).getAttribute('class')).toContain('border-grey');
			student_list.click_de_select_all()
			expect(student_list.student(1).getAttribute('class')).not.toContain('border-grey');
			expect(student_list.de_select_all_button.getAttribute('disabled')).toBe('true');
		})
		// EnrolledStudents: select student 
		it('should check  EnrolledStudents: select student  ', function(){
			expect(student_list.email_button.getAttribute('disabled')).toBe('true');
			expect(student_list.student(1).getAttribute('class')).not.toContain('border-grey');
			student_list.student(1).click()
			expect(student_list.student(1).getAttribute('class')).toContain('border-grey');
			expect(student_list.student(2).getAttribute('class')).not.toContain('border-grey');
			student_list.click_email()
			expect(student_list.email_student(1).getText()).toEqual(params.student1.email);
			$('body').sendKeys(protractor.Key.ESCAPE)
		})
		// EnrolledStudents: remove student 
		it('should check  EnrolledStudents: remove student', function(){
			expect(student_list.students.count()).toEqual(3)
			student_list.click_remove_student()
			student_list.delete_student(1)
			expect(student_list.students.count()).toEqual(2)
			course_info.open()	
			var enrollment_key = course_info.enrollmentkey
			header.logout()
		    login_page.sign_in(params.student1.email, params.password) 
		    header.join_course(enrollment_key)
			new_course.disable_student_email_reminders_button_click()
		    header.logout()
			login_page.sign_in(params.teacher1.email, params.password)		    
		})
		it('should delete course', function(){
			course_list.open()
			course_list.delete_teacher_course(2)
			expect(course_list.teacher_courses.count()).toEqual(1)
		})		
		it('should logout ', function(){
			header.logout()
		})
    })
})