var Header = require('./pages/header');
var Login = require('./pages/login');
var CourseEditor = require('./pages/course_editor');
var ContentNavigator = require('./pages/content_navigator');
var CourseInformation = require('./pages/course_information');
var CourseList = require('./pages/course_list');
var StudentLecture = require('./pages/student/lecture');
var scroll = require('./lib/utils').scroll;
var sleep = require('./lib/utils').sleep;

var params = browser.params;

var header = new Header()
var login_page = new Login()
var course_editor = new CourseEditor()
var course_info = new CourseInformation()
var course_list = new CourseList()
var student_lec = new StudentLecture()

describe("Course Validation",function(){
	describe("Student",function(){
		it("should login", function(){
			login_page.sign_in(params.student_mail, params.password)
		})
		var navigator = new ContentNavigator(1)
		it('should open course information', function(){
			course_list.open()
			course_list.open_course(1)
			course_info.student.open()
		})
		it('should check course information', function(){
			expect(course_info.student.course_name).toContain(params.short_name)
			expect(course_info.student.course_name).toContain(params.course_name)
			expect(course_info.student.description).toEqual(params.course_description)
			expect(course_info.student.prerequisites).toEqual(params.prerequisites)
			expect(course_info.student.duration).toEqual(params.course_duration)
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
// 		o_c.sign_in(ptor, params.teacher_mail, params.password);
// 	})

// 	it('should create_course', function(){
// 		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
// 		// ptor.sleep(5000);	
// 	})

	
// 	//test
// 	it('should go to info page and change info', function(){
// 		// o_c.sign_in(ptor, params.teacher_mail, params.password);
// 		// o_c.open_course_list(ptor)
// 		// o_c.open_course(ptor, 1);
// 		o_c.open_course_info(ptor);
// 		teacher.change_course_info(ptor,course_description_ch, prerequisites_ch, short_name_ch, course_name_ch, discussion_link_ch, course_duration_ch);
// 	})

// 	it('should get the enrollment key and enroll student', function(){
// 		teacher.get_key_and_enroll(ptor, params.student_mail, params.password);
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