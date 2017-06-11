var Header = require('./pages/header');
var Login = require('./pages/login');
var CourseEditor = require('./pages/course_editor');
var ContentNavigator = require('./pages/content_navigator');
var CourseInformation = require('./pages/course_information');
var CourseList = require('./pages/course_list');
var StudentLecture = require('./pages/student/lecture');
var scroll = require('./lib/utils').scroll;
var sleep = require('./lib/utils').sleep;
var refresh= require('./lib/utils').refresh;
var NewCourse = require('./pages/new_course');
var SubHeader = require('./pages/sub_header')


sub_header

var params = browser.params;

var header = new Header()
var login_page = new Login()
var course_editor = new CourseEditor()
var course_info = new CourseInformation()
var course_list = new CourseList()
var student_lec = new StudentLecture()
var	new_course = new NewCourse();
var sub_header = new SubHeader()



describe("Course Validation",function(){
	describe("Student 1",function(){
		it("should login", function(){
			login_page.sign_in(params.student1.email, params.password)
		})
		var navigator = new ContentNavigator(1)
		it('should open course information', function(){
			course_list.open()
			course_list.open_student_course(1)
			course_info.student.open()
		})
		it('should check course information', function(){
			expect(course_info.student.course_name).toContain(params.short_name)
			expect(course_info.student.course_name).toContain(params.course_name)
			expect(course_info.student.description).toEqual(params.course_description)
			expect(course_info.student.prerequisites).toEqual(params.prerequisites)
			expect(course_info.student.end_date).toEqual(params.course_end_date_test)
		})
		it('should check receive email reminders due dates button equal false', function(){
			expect(course_info.student.receive_email_button.isSelected()).toEqual(false)
			course_info.student.receive_email_button_click()
			browser.refresh()
		})
		it('should check receive email reminders due dates button equal true', function(){
			expect(course_info.student.receive_email_button.isSelected()).toEqual(true)
			course_info.student.receive_email_button_click()
			browser.refresh()
			expect(course_info.student.receive_email_button.isSelected()).toEqual(false)
		})
		it("should logout",function(){
			header.logout()
		})
	})
	describe("Student 3",function(){
		it("should login", function(){
			login_page.sign_in(params.student3.email, params.password)
		})
		var navigator = new ContentNavigator(1)
		it('should open course information', function(){
			course_list.open()
			course_list.open_student_course(1)
			course_info.student.open()
		})
		it('should check go to course button and check it when to a lecture url', function(){
			course_info.student.go_to_course_content_button_click()
			sleep(2000)
			expect(browser.driver.getCurrentUrl()).toContain('courseware/lectures/')
		})
		it("should logout",function(){
			header.logout()
		})
	})	
	describe("teacher create new course with no content",function(){
		it("should login", function(){
			login_page.sign_in(params.teacher1.email, params.password)
		})
		it('should create course', function(){
			new_course.open()
			new_course.create(params.short_name, params.course_name, params.course_end_date, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
			new_course.disable_email_reminders_modal_button_click()
			course_list.open()
			course_list.open_teacher_course(2)
			var enrollment_key = course_info.enrollmentkey
			header.logout()
		    login_page.sign_in(params.student1.email, params.password) 
		    header.join_course(enrollment_key)
			new_course.disable_student_email_reminders_button_click()
		    // header.logout()
		})
		// var navigator = new ContentNavigator(1)
		it('should open course information', function(){
			course_list.open()
			course_list.open_student_course(2)
			course_info.student.open()
		})	
		it('should check go to course button and check it when to a lecture url', function(){
			course_info.student.go_to_course_content_button_click()
			sleep(2000)
			expect(browser.driver.getCurrentUrl()).toContain('course_information')
		})	
		it("should student logout",function(){
			header.logout()
		})
		it("should login", function(){
			login_page.sign_in(params.teacher1.email, params.password)
		})		
		it("should delete course",function(){
				course_list.open()
				course_list.delete_teacher_course(2)
				expect(course_list.teacher_courses.count()).toEqual(1)
		})
		it("should logout",function(){
			header.logout()
		})		
	})	

})

// xdescribe("teacher create course check info", function(){

// 	it('should open info and test course information', function(){
// 		o_c.open_course_list(ptor)
// 		o_c.open_course(ptor, 1);
// 		student.check_course_info(ptor, params.short_name, params.course_name, params.course_description, params.prerequisites, Date(), params.course_duration);
// 	})
// 	//end test
// 	it('should delete course', function(){
// 		o_c.to_teacher(ptor)
// 		o_c.open_course_list(ptor);
// 		teacher.delete_course(ptor, 1);
// 		o_c.logout(ptor);
// 	})
// })

// xdescribe("teacher check the ability to change course info", function(){

// 	it('should sign in as teacher', function(){
// 		// o_c.press_login(ptor);
// 		o_c.sign_in(ptor, params.teacher1.email, params.password);
// 	})

// 	it('should create_course', function(){
// 		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
// 		// ptor.sleep(5000);
// 	})


// 	//test
// 	it('should go to info page and change info', function(){
// 		// o_c.sign_in(ptor, params.teacher1.email, params.password);
// 		// o_c.open_course_list(ptor)
// 		// o_c.open_course(ptor, 1);
// 		o_c.open_course_info(ptor);
// 		teacher.change_course_info(ptor,course_description_ch, prerequisites_ch, short_name_ch, course_name_ch, discussion_link_ch, course_duration_ch);
// 	})

// 	it('should get the enrollment key and enroll student', function(){
// 		teacher.get_key_and_enroll(ptor, params.student1.email, params.password);
// 	})

// 	// it('should log out from teacher then login as a student', function(){
// 	// 	o_c.to_student(ptor);
// 	// })

// 	it('should open info and test course information', function(){
// 		o_c.open_course_list(ptor)
// 		o_c.open_course(ptor, 1);
// 		student.check_course_info(ptor, short_name_ch, course_name_ch, course_description_ch, prerequisites_ch, date, course_duration_ch)
// 	})
// 	//end test
// 	it('should delete course', function(){
// 		o_c.to_teacher(ptor)
// 		o_c.open_course_list(ptor);
// 		teacher.delete_course(ptor, 1);
// 		o_c.logout(ptor);
// 	})
// })
