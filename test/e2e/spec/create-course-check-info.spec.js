var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module')

var ptor = protractor.getInstance();
var params = ptor.params
ptor.driver.manage().window().maximize();

var discussion_link_shrt = 'testing';

var short_name_ch = "csc-test2";
var course_name_ch = "testing2 course2 1002";
var course_duration_ch = '12';
var discussion_link_ch = 'www.discussion-link.com';
var image_link_ch = "http://dasonlightinginc.com/uploads/2/9/4/2/2942625/4781952_orig.jpg"
var course_description_ch = '2 many words'
var prerequisites_ch = '3- course 3 1- course 1 2- course 2';

var discussion_link_shrt_ch = 'www.discu';

var course_date = new Date();
var date = course_date.toString();

xdescribe("teacher create course check info", function(){

	it('should sign in as teacher', function(){
		o_c.press_login(ptor);
		o_c.sign_in(ptor, params.teacher_mail, params.password);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
		// ptor.sleep(5000);	
	})

	it('should get the enrollment key and enroll student', function(){
		teacher.get_key_and_enroll(ptor, params.student_mail, params.password);
	})
	//test
	it('should log out from teacher then login as a student', function(){
		o_c.sign_in(ptor, params.student_mail, params.password);
	})

	it('should open info and test course information', function(){
		o_c.open_course_list(ptor)
		o_c.open_course(ptor, 1);
		student.check_course_info(ptor, params.short_name, params.course_name, params.course_description, params.prerequisites, Date(), params.course_duration);
	})
	//end test
	it('should delete course', function(){
		o_c.to_teacher(ptor)
		o_c.open_course_list(ptor);
		teacher.delete_course(ptor, 1);
		o_c.logout(ptor);
	})
})

describe("teacher check the ability to change course info", function(){

	it('should sign in as teacher', function(){
		o_c.press_login(ptor);
		o_c.sign_in(ptor, params.teacher_mail, params.password);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
		// ptor.sleep(5000);	
	})

	it('should get the enrollment key and enroll student', function(){
		teacher.get_key_and_enroll(ptor, params.student_mail, params.password);
	})
	//test
	it('should go to info page and change info', function(){
		o_c.sign_in(ptor, params.teacher_mail, params.password);
		o_c.open_course_list(ptor)
		o_c.open_course(ptor, 1);
		o_c.open_course_info(ptor);
		teacher.change_course_info(ptor,course_description_ch, prerequisites_ch, short_name_ch, course_name_ch, discussion_link_ch, course_duration_ch);
	})

	it('should log out from teacher then login as a student', function(){
		o_c.to_student(ptor);
	})

	it('should open info and test course information', function(){
		o_c.open_course_list(ptor)
		o_c.open_course(ptor, 1);
		student.check_course_info(ptor, short_name_ch, course_name_ch, course_description_ch, prerequisites_ch, date, course_duration_ch)
	})
	//end test
	it('should delete course', function(){
		o_c.to_teacher(ptor)
		o_c.open_course_list(ptor);
		teacher.delete_course(ptor, 1);
		o_c.logout(ptor);
	})
})