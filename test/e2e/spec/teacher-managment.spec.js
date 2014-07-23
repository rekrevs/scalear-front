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
		o_c.sign_in(ptor, params.teacher_mail, params.password, o_c.feedback);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites, o_c.feedback);
	})

	it('should get the enrollment key and enroll student', function(){
		teacher.get_key_and_enroll(ptor);
	})
	//test
	it('should check number of teachers intially', function(){
		o_c.to_student(ptor);
		o_c.open_course_whole(ptor, 0);
		// o_c.open_tray(ptor);
		// ptor.sleep(5000);
		o_c.open_course_info(ptor);
		ptor.sleep(5000);
		check_teachers_no(ptor, 1);
	})
	//end test

	it('should delete course', function(){
		//should choose one of home() or home_teacher() 
		//depending on the current state(student or teacher)
		o_c.open_course_list(ptor);
		teacher.delete_course_edited(ptor, o_c.feedback);
	})
})

xdescribe("2", function(){

	it('should sign in as teacher', function(){
		o_c.sign_in(ptor, params.teacher_mail, params.password, o_c.feedback);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites, o_c.feedback);
	})
	//test
	it('should add a teacher', function(){
		o_c.open_tray(ptor);
		o_c.open_info_teacher(ptor);
		press_add_teacher(ptor);
		fill_teacher_info(ptor, "teacher3@sharklasers.com", 1);
		ptor.sleep(5000);
	})
	it('should login as the guest teacher and confirm', function(){
		o_c.home_teacher(ptor);
		o_c.open_tray(ptor);
		o_c.logout(ptor, o_c.feedback);
		o_c.sign_in(ptor, 'teacher3@sharklasers.com', params.password, o_c.feedback);
		o_c.open_tray(ptor);
		o_c.open_notifications(ptor, 1);
	})

	it('should get the enrollment key and enroll student', function(){
		o_c.open_tray(ptor);
		o_c.open_info_teacher(ptor);
		teacher.get_key_and_enroll(ptor);
	})

	it('should login as student and check for teachers', function(){
		o_c.to_student(ptor);
		o_c.open_course_whole(ptor);
		o_c.open_tray(ptor);
		ptor.sleep(5000);
		o_c.open_info(ptor);
		ptor.sleep(5000);
		check_teachers_no(ptor, 2);	
	})
	//end test

	it('should delete course', function(){
		//should choose one of home() or home_teacher() 
		//depending on the current state(student or teacher)
		o_c.home(ptor);
		teacher.delete_course(ptor, o_c.feedback);
	})
})

/////////////////////////////////////////////////////////
//				test specific functions
/////////////////////////////////////////////////////////

function check_teachers_no(ptor, no){
	locator.by_repeater(ptor, 'teacher in teachers').then(function(teachers){
		expect(teachers.length).toEqual(no);
	})
}

function press_add_teacher(ptor){
	locator.s_by_classname(ptor, 'add-teacher-button').then(function(add_btn){
		add_btn[0].click().then(function(){
			expect(locator.by_name(ptor, 'email_form').isDisplayed()).toEqual(true);
		})
	})
}

function fill_teacher_info(ptor, mail, type){
	locator.by_id(ptor, 'new_email').sendKeys(mail);
	locator.by_id(ptor, 'new_role').then(function(ins){
		ins.click();
		locator.s_by_tag(ptor, 'option').then(function(options){
			options[type].click();
		})
	})
	locator.s_by_classname(ptor, 'add-teacher-button').then(function(adds){
        adds[1].click();
    })
}
