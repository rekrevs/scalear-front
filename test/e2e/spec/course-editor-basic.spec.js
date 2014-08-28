var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module')

var ptor = protractor.getInstance();
var params = ptor.params;
ptor.driver.manage().window().maximize();

//function testing
// describe("3", function(){
// 	it('should', function(){
// 		o_c.sign_in(ptor, params.teacher_mail, params.password);
// 		o_c.open_course_whole(ptor,1);
// 		o_c.press_content_navigator(ptor);
// 		teacher.open_module(ptor, 1);
// 		// teacher.open_content_new_module(ptor);
// 		teacher.create_lecture(ptor);
// 		teacher.initialize_lecture(ptor, "menaz")
// 		ptor.sleep(5000);
// 	})
// })

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
	//test
	it('should add a couple of module and lectures', function(){
		o_c.sign_in(ptor, params.teacher_mail, params.password);
		o_c.open_course_list(ptor)
		o_c.open_course(ptor, 1);
		// o_c.open_content_editor(ptor);
		teacher.add_module(ptor);
		teacher.add_module(ptor);
		// o_c.press_content_navigator(ptor)
		teacher.open_module(ptor, 1);
		teacher.add_lecture(ptor);
		teacher.add_lecture(ptor);
		teacher.add_quiz(ptor);
		
		teacher.open_module(ptor, 2);
		teacher.add_lecture(ptor);
		teacher.add_lecture(ptor);
		teacher.add_survey(ptor);
		
	})

	it('should check for number of modules and lectures student-side', function(){
		o_c.to_student(ptor);
		o_c.open_course_list(ptor)
		o_c.open_course(ptor, 1);
		// o_c.open_lectures(ptor);
		o_c.press_content_navigator(ptor)

		student.check_module_number(ptor, 2);
		student.check_item_number(ptor, 1, 3);
		student.check_timeline_item_number(ptor, 3);
		teacher.open_module(ptor, 2);
		student.check_item_number(ptor,2, 3);
		student.check_timeline_item_number(ptor, 3);
	})

	it('should clear the course for deletion', function(){
		o_c.to_teacher(ptor);
	 	o_c.open_course_list(ptor);
	    o_c.open_course(ptor, 1);
	    // o_c.press_content_navigator(ptor)

	    teacher.open_module(ptor, 2);
	    teacher.delete_item_by_number(ptor, 2, 1);
		teacher.delete_item_by_number(ptor, 2, 1);
		teacher.delete_item_by_number(ptor, 2, 1);
		teacher.delete_empty_module(ptor, 2)


	    teacher.open_module(ptor, 1);
	    teacher.delete_item_by_number(ptor, 1, 1);
		teacher.delete_item_by_number(ptor, 1, 1);
		teacher.delete_item_by_number(ptor, 1, 1);
		teacher.delete_empty_module(ptor, 1)
	})
	//end test

	it('should delete course', function(){
		o_c.open_course_list(ptor);
	    teacher.delete_course(ptor, 1);
	    o_c.logout(ptor);
	})
})


/////////////////////////////////////////////////////////
//				test specific functions
/////////////////////////////////////////////////////////