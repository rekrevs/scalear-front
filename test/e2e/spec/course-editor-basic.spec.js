var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module')

var ptor = protractor.getInstance();
var params = ptor.params;
ptor.driver.manage().window().maximize();

//function testing
describe("3", function(){
	it('should', function(){
		o_c.sign_in(ptor, params.teacher_mail, params.password);
		o_c.open_course_whole(ptor,1);
		o_c.press_content_navigator(ptor);
		teacher.open_module(ptor, 1);
		// teacher.open_content_new_module(ptor);
		teacher.create_lecture(ptor);
		teacher.initialize_lecture(ptor, "menaz")
		ptor.sleep(5000);
	})
})

xdescribe("1", function(){

	it('should sign in as teacher', function(){
		o_c.sign_in(ptor, params.teacher_mail, params.password, o_c.feedback);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites, o_c.feedback);
	})

	xit('should get the enrollment key and enroll student', function(){
		teacher.get_key_and_enroll(ptor);
	})
	//test
	xit('should add a couple of module and lectures', function(){
		o_c.open_course_whole(ptor);
		teacher.add_module(ptor, o_c.feedback);
		teacher.add_module(ptor, o_c.feedback);
		
		teacher.open_module(ptor, 1);
		teacher.add_lecture(ptor, 1, o_c.feedback);
		teacher.add_lecture(ptor, 1, o_c.feedback);
		
		teacher.open_module(ptor, 2);
		teacher.add_lecture(ptor, 2, o_c.feedback);
		teacher.add_lecture(ptor, 2, o_c.feedback);
		
	})

	xit('should check for number of modules and lectures student-side', function(){
		o_c.to_student(ptor);

		o_c.open_course_whole(ptor);
		o_c.open_tray(ptor);
		o_c.open_lectures(ptor);
		student.check_module_number(ptor, 2);
		student.check_timeline_item_number(ptor, 2);
		student.open_module_number(ptor, 2);
		student.check_timeline_item_number(ptor, 2);
	})

	xit('should clear the course for deletion', function(){
		o_c.to_teacher(ptor);
		o_c.open_course_whole(ptor);

		teacher.open_module(ptor, 1);
		teacher.delete_item_by_number(ptor, 1, 1, o_c.feedback);
		teacher.delete_item_by_number(ptor, 1, 1, o_c.feedback);

		teacher.open_module(ptor, 2);
		teacher.delete_item_by_number(ptor, 2, 1, o_c.feedback);
		teacher.delete_item_by_number(ptor, 2, 1, o_c.feedback);

		teacher.delete_empty_module(ptor, 1, o_c.feedback);
		teacher.delete_empty_module(ptor, 1, o_c.feedback);
	})
	//end test

	xit('should delete course', function(){
		//should choose one of home() or home_teacher() 
		//depending on the current state(student or teacher)
		o_c.home_teacher(ptor);
		teacher.delete_course(ptor, o_c.feedback);
	})
})

xdescribe("2", function(){

	it('should sign in as teacher', function(){
		o_c.sign_in(ptor, params.teacher_mail, params.password, o_c.feedback);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites, o_c.feedback);
	})

	it('should get the enrollment key and enroll student', function(){
		teacher.get_key_and_enroll(ptor);
	})
	//test
	it('should add a couple of module and lectures', function(){
		o_c.open_course_whole(ptor);
		teacher.add_module(ptor, o_c.feedback);
		teacher.add_module(ptor, o_c.feedback);
		
		teacher.open_module(ptor, 1);
		teacher.add_lecture(ptor, 1, o_c.feedback);
		teacher.add_lecture(ptor, 1, o_c.feedback);
		
		teacher.open_module(ptor, 2);
		teacher.add_lecture(ptor, 2, o_c.feedback);
		teacher.add_lecture(ptor, 2, o_c.feedback);
		
	})

	it('should check for number of modules and lectures student-side', function(){
		o_c.to_student(ptor);

		o_c.open_course_whole(ptor);
		o_c.open_tray(ptor);
		o_c.open_lectures(ptor);
		student.check_module_number(ptor, 2);
		student.check_timeline_item_number(ptor, 2);
		student.open_module_number(ptor, 2);
		student.check_timeline_item_number(ptor, 2);
	})
	it('should clear the course for deletion', function(){
		o_c.to_teacher(ptor);
		o_c.open_course_whole(ptor);

		teacher.open_module(ptor, 1);
		teacher.delete_item_by_number(ptor, 1, 1, o_c.feedback);
		teacher.delete_item_by_number(ptor, 1, 1, o_c.feedback);

		teacher.open_module(ptor, 2);
		teacher.delete_item_by_number(ptor, 2, 1, o_c.feedback);
		teacher.delete_item_by_number(ptor, 2, 1, o_c.feedback);

		teacher.delete_empty_module(ptor, 1, o_c.feedback);
		teacher.delete_empty_module(ptor, 1, o_c.feedback);
	})
	//end test

	it('should delete course', function(){
		//should choose one of home() or home_teacher() 
		//depending on the current state(student or teacher)
		o_c.home_teacher(ptor);
		teacher.delete_course(ptor, o_c.feedback);
	})
})

/////////////////////////////////////////////////////////
//				test specific functions
/////////////////////////////////////////////////////////