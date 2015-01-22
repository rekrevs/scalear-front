var NewCourse = require('./pages/new_course');
var CourseInformation = require('./pages/course_information');
var Header = require('./pages/header');
var Login = require('./pages/login');

var params = browser.params;

var header = new Header()
var login_page = new Login()
var	new_course = new NewCourse();
var course_info = new CourseInformation()

describe("Teacher", function(){	
	it('should create course', function(){
		new_course.open()
		new_course.create(params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
	})
	it('should get the enrollment key and enroll student', function(){
		course_info.open()
		var enrollment_key = course_info.enrollmentkey
		header.logout()
		login_page.sign_in(params.student_mail, params.password)
		header.join_course(enrollment_key)
	})

	it("should login as teacher",function(){
		header.logout()
		login_page.sign_in(params.teacher_mail, params.password)
	})
})