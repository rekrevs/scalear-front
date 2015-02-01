var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module')

var ptor = protractor.getInstance();
var params = ptor.params
ptor.driver.manage().window().maximize();

var announcement_text1 = "announcement 1"
var announcement_text2 = "announcement 2"
var announcement_text3 = "announcement 3"

describe("1", function(){

	it('should sign in as teacher', function(){
		o_c.press_login(ptor)
		o_c.sign_in(ptor, params.teacher_mail, params.password);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
	})

	//test
	it('should go to announcements page and make an announcement', function(){
		// o_c.sign_in(ptor, params.teacher_mail, params.password);
		// o_c.open_course_list(ptor);
		// o_c.open_course(ptor, 1);
		o_c.open_announcements(ptor);
		teacher.create_new_announcement(ptor, announcement_text1);
		teacher.create_new_announcement(ptor, announcement_text2);
		teacher.create_new_announcement(ptor, announcement_text3);
		teacher.check_number_of_announcments(ptor, 3);
	})

	it('should get the enrollment key and enroll student', function(){
		teacher.get_key_and_enroll(ptor, params.student_mail, params.password);
	})
	
	it('should go to student and check number of announcements', function(){
		// o_c.sign_in(ptor, params.student_mail, params.password);
		// o_c.to_student(ptor)
		o_c.open_course_list(ptor)
		o_c.open_course(ptor, 1);
		teacher.check_number_of_announcments(ptor, 3);
		teacher.check_announcements_data(ptor, 3)
	})

	it('should go back to teacher and delete announcement', function(){
		// o_c.sign_in(ptor, params.student_mail, params.password);
		o_c.to_teacher(ptor)
		o_c.open_course_list(ptor)
		o_c.open_course(ptor, 1);
		o_c.open_announcements(ptor);
		teacher.delete_announcement(3)
		teacher.check_number_of_announcments(ptor, 2);
	})

	it('should go to student and check number of announcements', function(){
		// o_c.sign_in(ptor, params.student_mail, params.password);
		o_c.to_student(ptor)
		o_c.open_course_list(ptor)
		o_c.open_course(ptor, 1);
		teacher.check_number_of_announcments(ptor, 2);
		teacher.check_announcements_data(ptor, 2)
	})

	//end test
	
	it('should delete course', function(){
		o_c.to_teacher(ptor)
		o_c.open_course_list(ptor);
		teacher.delete_course(ptor, 1);
		o_c.logout(ptor, o_c.feedback);
	})
})