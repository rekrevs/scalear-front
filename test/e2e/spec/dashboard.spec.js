var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module');

var ptor = protractor.getInstance();
var params = ptor.params
ptor.driver.manage().window().maximize();

describe("Dashboard", function(){

	it('should sign in as teacher', function(){
		o_c.press_login(ptor);
		o_c.sign_in(ptor, params.teacher_mail, params.password);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
	})

	it('should get the enrollment key and enroll student', function(){
		teacher.get_key_and_enroll(ptor, params.student_mail, params.password);
	})

	it('should check student side for elements in news feed', function(){
		// o_c.sign_in(ptor, params.teacher_mail, params.password);
		// o_c.to_student(ptor);
		check_dashboard_elements(0);
	})

	it('should go to announcements page and make an announcement', function(){
		o_c.to_teacher(ptor);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		o_c.press_content_navigator();
		ptor.sleep(1000);
		o_c.open_announcements(ptor);
		teacher.create_new_announcement(ptor, 'announcement_text1');
		teacher.create_new_announcement(ptor, 'announcement_text2');
		teacher.create_new_announcement(ptor, 'announcement_text3');
		teacher.check_number_of_announcments(ptor, 3);
	})

	it('should check student side for elements in news feed', function(){
		o_c.to_student(ptor);
		check_dashboard_elements(3);
		check_ann_time(1);
	})

	it('should delete course', function(){
		o_c.to_teacher(ptor);
		o_c.open_course_list(ptor);
	    teacher.delete_course(ptor, 1);
	    o_c.logout(ptor);
	})
})

function check_dashboard_elements(no){
	element.all(by.repeater('event in events')).then(function(ele){
		expect(ele.length).toEqual(no);
	})
}

function check_ann_time(no){
	element.all(by.repeater('event in events')).then(function(ele){
		expect(ele[no-1].getText()).toContain("A FEW SECONDS AGO");
	})
}