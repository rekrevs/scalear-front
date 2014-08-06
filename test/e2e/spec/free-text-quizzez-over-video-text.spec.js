var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module');
var youtube = require('./lib/youtube.js');

var ptor = protractor.getInstance();
var params = ptor.params
ptor.driver.manage().window().maximize();

xdescribe("1", function(){

	it('should sign in as teacher', function(){
		o_c.press_login(ptor);
		o_c.sign_in(ptor, params.teacher_mail, params.password);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites, o_c.feedback);
	})

	it('should get the enrollment key and enroll student', function(){
		teacher.get_key_and_enroll(ptor);
	})
	//test
	it('should add a module and lecture to create quizzes', function(){
		o_c.open_course_list(ptor);
		o_c.open_course_whole(ptor, 0);
		teacher.add_module(ptor);
		o_c.press_content_navigator(ptor);
		teacher.open_module(ptor, 1);
		teacher.create_lecture(ptor);			
		o_c.press_content_navigator(ptor);
		teacher.init_lecture(ptor, "free_text_quiz","https://www.youtube.com/watch?v=SKqBmAHwSkg");
		
	})

	it('should create quiz', function(){
		youtube.seek(ptor, 21);
		create_free_text_quiz(ptor);
		make_free_text_questions(ptor);	
	})

	it('should login a student and expect quiz', function(){
		o_c.to_student(ptor);
		o_c.open_course_list(ptor);
		o_c.open_course_whole(ptor, 0);
		o_c.press_content_navigator(ptor);
		teacher.open_module(ptor, 1);
		o_c.press_content_navigator(ptor);
		youtube.seek(ptor, 21);
		expect_quiz(ptor);
	})

	it('should answer free text quiz', function(){
		answer_free_text(ptor, "ay kalam");
	})

	it('should press answer button',function(){
		answer(ptor);
	})

	it('should check if the answer is correct',function(){
		check_free_answer(ptor);
	})

	it('should clear the course for deletion', function(){
		o_c.to_teacher(ptor);
		o_c.open_course_list(ptor);
		o_c.open_course_whole(ptor, 0);
		o_c.press_content_navigator(ptor);
		teacher.open_module(ptor, 1);
		teacher.delete_item_by_number(ptor, 1, 1, o_c.feedback);
		teacher.delete_empty_module(ptor, 1, o_c.feedback);
	})
	//end test

	it('should delete course', function(){
		o_c.open_course_list(ptor);
		teacher.delete_course(ptor, 1);
	})
})

xdescribe("2", function(){

	it('should sign in as teacher', function(){
		o_c.press_login(ptor);
		o_c.sign_in(ptor, params.teacher_mail, params.password);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites, o_c.feedback);
	})

	it('should get the enrollment key and enroll student', function(){
		teacher.get_key_and_enroll(ptor);
	})
	//test
	it('should add a module and lecture to create quizzes', function(){
		o_c.open_course_list(ptor);
		o_c.open_course_whole(ptor, 0);
		teacher.add_module(ptor);
		o_c.press_content_navigator(ptor);
		teacher.open_module(ptor, 1);
		teacher.create_lecture(ptor);			
		o_c.press_content_navigator(ptor);
		teacher.init_lecture(ptor, "free_text_quiz","https://www.youtube.com/watch?v=SKqBmAHwSkg");
	})

	it('should create quiz', function(){
		youtube.seek(ptor, 21);
		create_free_text_quiz(ptor);
		make_match_text_questions(ptor, "menaz");
	})

	xit('should login a student and expect quiz', function(){
		o_c.to_student(ptor);
		o_c.open_course_list(ptor);
		o_c.open_course_whole(ptor, 0);
		o_c.press_content_navigator(ptor);
		teacher.open_module(ptor, 1);
		o_c.press_content_navigator(ptor);
		youtube.seek(ptor, 21);
		expect_quiz(ptor);
	})

	xit('should answer free text quiz', function(){
		answer_free_text(ptor, "menaz");
	})

	xit('should press answer button',function(){
		answer(ptor);
	})

	xit('should check if the answer is correct',function(){
		check_answer_correct(ptor);
	})

	xit('should clear the course for deletion', function(){
		o_c.to_teacher(ptor);
		o_c.open_course_list(ptor);
		o_c.open_course_whole(ptor, 0);
		o_c.press_content_navigator(ptor);
		teacher.open_module(ptor, 1);
		teacher.delete_item_by_number(ptor, 1, 1, o_c.feedback);
		teacher.delete_empty_module(ptor, 1, o_c.feedback);
	})
	//end test

	xit('should delete course', function(){
		o_c.open_course_list(ptor);
		teacher.delete_course(ptor, 1);
	})
})

xdescribe("3", function(){

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
	it('should add a module and lecture to create quizzes', function(){
		o_c.open_course_whole(ptor);
		teacher.add_module(ptor, o_c.feedback);
		teacher.open_module(ptor, 1);
		teacher.create_lecture(ptor, "match-text_quiz","https://www.youtube.com/watch?v=SKqBmAHwSkg", o_c.feedback);
	})

	it('should create quiz', function(){
		youtube.seek(ptor, 49);
		create_free_text_quiz(ptor, o_c.feedback);
		make_match_text_questions(ptor, "menaz", o_c.feedback);
	})

	it('should login a student and check for no of mcqs ', function(){
		o_c.to_student(ptor);
		o_c.open_course_whole(ptor);
		o_c.open_tray(ptor);
		o_c.open_lectures(ptor);
		youtube.seek(ptor, 49);
		expect_quiz(ptor);
	})

	it('should answer free text quiz', function(){
		answer_free_text(ptor, "mena");
	})

	it('should press answer button',function(){
		answer(ptor);
	})

	it('should check if the answer is correct',function(){
		check_answer_incorrect(ptor);
	})

	it('should clear the course for deletion', function(){
		o_c.to_teacher(ptor);
		o_c.open_course_whole(ptor);

		teacher.open_module(ptor, 1);
		teacher.delete_item_by_number(ptor, 1, 1, o_c.feedback);

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

xdescribe("4", function(){

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
	it('should add a module and lecture to create quizzes', function(){
		o_c.open_course_whole(ptor);
		teacher.add_module(ptor, o_c.feedback);
		teacher.open_module(ptor, 1);
		teacher.create_lecture(ptor, "match-text_quiz","https://www.youtube.com/watch?v=SKqBmAHwSkg", o_c.feedback);
	})

	it('should create quiz with regex', function(){
		youtube.seek(ptor, 49);
		create_free_text_quiz(ptor, o_c.feedback);
		make_match_text_questions(ptor, "/^[a-z0-9_-]{3,16}$/", o_c.feedback);
	})

	it('should login a student and check ', function(){
		o_c.to_student(ptor);
		o_c.open_course_whole(ptor);
		o_c.open_tray(ptor);
		o_c.open_lectures(ptor);
		youtube.seek(ptor, 49);
		expect_quiz(ptor);
	})

	it('should answer free text quiz', function(){
		answer_free_text(ptor, "my-us3r_n4m3");
	})

	it('should press answer button',function(){
		answer(ptor);
	})

	it('should check if the answer is correct',function(){
		check_answer_correct(ptor);
	})

	it('should clear the course for deletion', function(){
		o_c.to_teacher(ptor);
		o_c.open_course_whole(ptor);

		teacher.open_module(ptor, 1);
		teacher.delete_item_by_number(ptor, 1, 1, o_c.feedback);

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

xdescribe("5", function(){

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
	it('should add a module and lecture to create quizzes', function(){
		o_c.open_course_whole(ptor);
		teacher.add_module(ptor, o_c.feedback);
		teacher.open_module(ptor, 1);
		teacher.create_lecture(ptor, "match-text_quiz","https://www.youtube.com/watch?v=SKqBmAHwSkg", o_c.feedback);
	})

	it('should create quiz with regex', function(){
		youtube.seek(ptor, 49);
		create_free_text_quiz(ptor, o_c.feedback);
		make_match_text_questions(ptor, "/^[a-z0-9_-]{3,16}$/", o_c.feedback);
	})

	it('should login a student and check ', function(){
		o_c.to_student(ptor);
		o_c.open_course_whole(ptor);
		o_c.open_tray(ptor);
		o_c.open_lectures(ptor);
		youtube.seek(ptor, 49);
		expect_quiz(ptor);
	})

	it('should answer free text quiz', function(){
		answer_free_text(ptor, "th1s1s-wayt00_l0ngt0beausername");
	})

	it('should press answer button',function(){
		answer(ptor);
	})

	it('should check if the answer is correct',function(){
		check_answer_incorrect(ptor);
	})

	it('should clear the course for deletion', function(){
		o_c.to_teacher(ptor);
		o_c.open_course_whole(ptor);

		teacher.open_module(ptor, 1);
		teacher.delete_item_by_number(ptor, 1, 1, o_c.feedback);

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

///^#?([a-f0-9]{6}|[a-f0-9]{3})$/
//#a3c113
//#4d82h4

//====================================================
//====================================================
//====================================================

function create_free_text_quiz(ptor){
	teacher.open_content_new_in_video_ques(ptor);
	locator.by_id(ptor, "free_text").then(function(link){
		link.click().then(function(){
			o_c.feedback(ptor, "Quiz was successfully created");
			expect(locator.by_id(ptor, 'editing').isDisplayed()).toEqual(true);
		})
	})
}

function make_free_text_questions(ptor){
		ptor.sleep(2000);
		o_c.scroll(ptor, 1000);
		element(by.buttonText('Save')).then(function(btn){
			btn.click().then(function(){
				o_c.feedback(ptor, 'Quiz was successfully saved');
			})
		})
}

function make_match_text_questions(ptor, text, feedback){
		locator.by_id(ptor,'ontop').findElement(protractor.By.tagName('select')).then(function(ontop){
            ontop.click().then(function(){
                ptor.sleep(2000);
                locator.by_id(ptor,'ontop').findElements(protractor.By.tagName('option')).then(function(options){
                    options[1].click().then(function(){
                        ptor.sleep(2000);
                        locator.by_id(ptor,'ontop').findElements(protractor.By.tagName('input')).then(function(ins){
                            ins[1].sendKeys(text);
                        })
                    })
                })
            })
        })
		ptor.sleep(2000);
		o_c.scroll(ptor, 1000);
		element(by.buttonText('Save')).then(function(btn){
			btn.click().then(function(){
				o_c.feedback(ptor, 'Quiz was successfully saved');
			})
		})
}

function expect_quiz(ptor){
    element(by.tagName('check_answer')).then(function(check_answer_btn){
		expect(check_answer_btn.isDisplayed()).toEqual(true);
	})
}

function answer(ptor){
	element(by.buttonText('Check Answer')).then(function(answer_btn){
		answer_btn.click();
	})
}

function check_answer_correct(ptor){
	locator.by_tag(ptor,'notification').then(function(popover){
		expect(popover.getText()).toContain('Correct');
	})
}

function check_answer_incorrect(ptor){
	locator.by_tag(ptor,'notification').then(function(popover){
		expect(popover.getText()).toContain('Incorrect');
	})
}

function check_free_answer(ptor){
	locator.by_tag(ptor,'notification').then(function(popover){
		expect(popover.getText()).toContain('Thank you for your answer');
	})
}

function answer_free_text(ptor, text){
	locator.by_id(ptor,'ontop').findElement(protractor.By.tagName('textarea')).then(function(txt){
		txt.sendKeys(text);
	})
}