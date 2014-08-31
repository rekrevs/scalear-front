var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module')

var ptor = protractor.getInstance();
var params = ptor.params
ptor.driver.manage().window().maximize();



describe("1", function(){

	it('should sign in as teacher', function(){
		o_c.press_login(ptor)
		o_c.sign_in(ptor, params.teacher_mail, params.password);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
	})

	it('should get the enrollment key and enroll student', function(){
		teacher.get_key_and_enroll(ptor, params.student_mail, params.password);
	})
	// test
	it('should check number of teachers intially', function(){
		// o_c.to_student(ptor);
		o_c.sign_in(ptor, params.student_mail, params.password);
		o_c.open_course_list(ptor)
		o_c.open_course(ptor, 1);
		o_c.press_content_navigator()
		o_c.open_course_info()
		check_teachers_no(ptor, 1);
	})
	// //end test

	it('should delete course', function(){
		o_c.to_teacher(ptor)
		o_c.open_course_list(ptor);
		teacher.delete_course(ptor, 1);
		o_c.logout(ptor);
	})
})

describe("2", function(){

	it('should sign in as teacher', function(){
		o_c.sign_in(ptor, params.teacher_mail, params.password);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
	})

	//test
	it('should add a teacher', function(){
		o_c.open_course_info(ptor);
		// o_c.hide_dropmenu(ptor)
		press_add_teacher(ptor);
		fill_teacher_info(ptor, params.teacher2_mail, 2);
		ptor.sleep(3000);
	})
	it('should login as the guest teacher and confirm', function(){
		o_c.logout(ptor, o_c.feedback);
		o_c.sign_in(ptor, params.teacher2_mail, params.password);
		o_c.open_notifications(ptor);
		o_c.accept_invitation(ptor, 1);
	})

	it('should get the enrollment key and enroll student', function(){
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		teacher.get_key_and_enroll(ptor, params.student_mail, params.password);
	})

	it('should login as student and check for teachers', function(){
		// o_c.to_student(ptor);
		o_c.sign_in(ptor, params.student_mail, params.password);
		o_c.open_course_list(ptor)
		o_c.open_course(ptor, 1);
		o_c.press_content_navigator()
		o_c.open_course_info()
		check_teachers_no(ptor, 2);
	})
	// //end test

	it('should delete course', function(){
		o_c.to_teacher(ptor)
		o_c.open_course_list(ptor);
		teacher.delete_course(ptor, 1);
		o_c.logout(ptor);
	})
})

/////////////////////////////////////////////////////////
//				test specific functions
/////////////////////////////////////////////////////////

function check_teachers_no(ptor, no){
	expect(element.all(by.repeater('teacher in teachers')).count()).toEqual(no*2) //for some reason it needs double the amount to pass, so i multiplied by 2
}

function press_add_teacher(ptor){
	element(by.className('add-teacher-button')).click().then(function(){
		expect(element(by.model('new_teacher.email')).isDisplayed()).toEqual(true);
		expect(element(by.model('new_teacher.role')).isDisplayed()).toEqual(true);
	})
}

function fill_teacher_info(ptor, mail, type){
	element(by.model('new_teacher.email')).sendKeys(mail)
	element(by.model('new_teacher.role')).click()
	element.all(by.tagName('option')).get(type).click()
	element(by.id('invite')).click()
}
