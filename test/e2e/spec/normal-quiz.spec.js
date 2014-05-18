var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module')

var ptor = protractor.getInstance();
var params = ptor.params
// ptor.driver.manage().window().maximize();
ptor.driver.manage().window().setSize(ptor.params.width, ptor.params.height);
ptor.driver.manage().window().setPosition(0, 0);



describe("teacher", function(){

	// it('should sign in as teacher', function(){
	// 	o_c.sign_in(ptor, params.teacher_mail, params.password, o_c.feedback);
	// })

	// it('should create_course', function(){
	// 	teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites, o_c.feedback);
	// })

	// it('should get the enrollment key and enroll student', function(){
	// 	teacher.get_key_and_enroll(ptor);
	// })
	//test
	it('should sign in', function(){
		o_c.sign_in(ptor, params.teacher_mail, params.password, o_c.feedback);
	})
	it('should open the course', function(){
		o_c.open_course_whole(ptor);
	})
	it('should create a new module', function(){
		teacher.add_module(ptor, o_c.feedback);
	})
	it('should add a normal quiz', function(){
		teacher.open_module(ptor, 1)
		teacher.add_quiz(ptor, 1, o_c.feedback);
	})
	it('should open the quiz', function(){
		teacher.open_item(ptor, 1, 1)
	})

	// it('should add a FIRST header', function(){
	// 	teacher.add_quiz_header(ptor, 'first header')
	// })
	// it('should add a MCQ question', function(){
	// 	teacher.add_quiz_question_mcq(ptor, 'mcq question', 'mcq answer1', 'mcq answer2', 'mcq answer3', 1)
	// })
	// it('should add a SECOND header', function(){
	// 	teacher.add_quiz_header(ptor, 'second header')
	// })
	// it('should add an OCQ question', function(){
	// 	teacher.add_quiz_question_ocq(ptor, 'ocq question', 'ocq answer1', 'ocq answer2', 'ocq answer3', 2)
	// })
	// it('should add a THIRD header', function(){
	// 	teacher.add_quiz_header(ptor, 'third header')
	// })
	// it('should add a FREE question', function(){
	// 	teacher.add_quiz_question_free(ptor, 'free question')
	// })
	// it('should add a FOURTH header', function(){
	// 	teacher.add_quiz_header(ptor, 'fourth header')
	// })
	// it('should add a DRAG question', function(){
	// 	teacher.add_quiz_question_drag(ptor, 'drag question', 'drag answer1', 'drag answer2', 'drag answer3')
	// })
	

	//end test

	// it('should delete course', function(){
	// 	//should choose one of home() or home_teacher() 
	// 	//depending on the current state(student or teacher)
	// 	o_c.home(ptor);
	// 	teacher.delete_course(ptor, o_c.feedback);
	// })
})

/////////////////////////////////////////////////////////
//				test specific functions
/////////////////////////////////////////////////////////