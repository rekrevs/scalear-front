var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module');
var youtube = require('./lib/youtube.js');
var disc = require('./lib/discussion.js');


var ptor = protractor.getInstance();
var params = ptor.params
ptor.driver.manage().window().maximize();

describe("1", function(){
	
	it('should sign in as teacher', function(){
		o_c.press_login(ptor);
		o_c.sign_in(ptor, params.teacher_mail, params.password);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
	})

	it('should get the enrollment key and enroll student', function(){
		teacher.get_key_and_enroll(ptor, params.student_mail, params.password);
		o_c.sign_in(ptor, params.teacher_mail, params.password);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		teacher.get_key_and_enroll(ptor, params.student_mail_2, params.password);
	})

	it('should add a module and lecture ', function(){
		o_c.sign_in(ptor, params.teacher_mail, params.password);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		teacher.add_module(ptor);
		teacher.open_module(ptor, 1);
		teacher.add_lecture(ptor);			
		o_c.press_content_navigator(ptor);
		ptor.sleep(2000)
		teacher.init_lecture(ptor, "ocq_text_quiz","https://www.youtube.com/watch?v=SKqBmAHwSkg");
	})

	it('should login a student', function(){
		o_c.to_student(ptor);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		youtube.seek(ptor, 21);
		disc.ask_private_question(ptor, "private ques")
		youtube.seek(ptor, 42);
		disc.ask_public_question(ptor, "public ques");
		o_c.logout(ptor);
	})

	it('should go the other student check for visible questions', function(){
		o_c.sign_in(ptor, params.student_mail_2, params.password);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		check_disc_no(1);
		expect(element(by.name('discussion-timeline-item')).getText()).toContain('public');
	})

	it('should clear the course for deletion', function(){
		o_c.to_teacher(ptor);
		o_c.open_course_list(ptor);
	    o_c.open_course(ptor, 1);
	    teacher.open_module(ptor, 1);
	    teacher.delete_item_by_number(ptor, 1, 1);
	    teacher.delete_empty_module(ptor, 1)
	})

	it('should delete course', function(){
		o_c.open_course_list(ptor);
	    teacher.delete_course(ptor, 1);
	    o_c.logout(ptor);
	})
})

function check_disc_no(no){
	element.all(by.name('discussion-timeline-item')).then(function(discs){
		expect(discs.length).toEqual(no);
	})
}