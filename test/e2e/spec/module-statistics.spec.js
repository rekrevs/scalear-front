var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module');
var youtube = require('./lib/youtube.js');
var disc = require('./lib/discussion.js');

var ptor = protractor.getInstance();
var params = ptor.params
ptor.driver.manage().window().maximize();

describe("check module statistics", function(){
    
	it('should sign in as teacher', function(){
        o_c.press_login(ptor);
		o_c.sign_in(ptor, params.teacher_mail, params.password);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
	})

    it('should add a module and lecture to create quizzes', function(){
		teacher.add_module(ptor);
		teacher.open_module(ptor, 1);
        check_question_no('0');
        check_quiz_question_no('0');
		teacher.add_lecture(ptor);			
		o_c.press_content_navigator(ptor);
		ptor.sleep(2000)
		teacher.init_lecture(ptor, "lec","https://www.youtube.com/watch?v=SKqBmAHwSkg");
	})

	it('should create quiz', function(){
		youtube.seek(ptor, 21);
		teacher.create_invideo_ocq_survey(ptor);
		teacher.make_ocq_survey_questions(ptor, 50, 50, 150, 150, 250, 250);

		youtube.seek(ptor, 42);
		teacher.create_invideo_ocq_survey(ptor);
		o_c.scroll(ptor, -1000);
		teacher.make_ocq_survey_questions(ptor, 50, 50, 150, 150, 250, 250);
	})
    
    it('should check for statistics', function(){
        o_c.press_content_navigator(ptor);
        ptor.sleep(5000);
        teacher.open_module(ptor, 1);
        check_question_no('2');
        check_quiz_question_no('0');
    })

	it('should clear the course for deletion', function(){
		o_c.open_course_list(ptor);
	    o_c.open_course(ptor, 1);
        teacher.open_module(ptor, 1);
	    teacher.delete_item_by_number(ptor, 1, 1);
	    check_question_no('0');
        check_quiz_question_no('0');
	    teacher.delete_empty_module(ptor, 1)
	})

	it('should delete course', function(){
		o_c.open_course_list(ptor);
	    teacher.delete_course(ptor, 1);
	    o_c.logout(ptor);
	})
})


function check_question_no(no){
    expect(element(by.id('total_questions')).getText()).toEqual(no);
}

function check_quiz_question_no(no){
    expect(element(by.id('total_quiz_questions')).getText()).toEqual(no);
}