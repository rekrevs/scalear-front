var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module');
var youtube = require('./lib/youtube.js');

var ptor = protractor.getInstance();
var params = ptor.params
ptor.driver.manage().window().maximize();


//equation 
// 570 >> 169
//(width*169)/570
// questions coordinates
var mcq_q1_x = 169; //175-6;
var mcq_q1_y = 127; //133-6;

var mcq_q2_x = 169; //175-6;
var mcq_q2_y = 157; //133-6;

var mcq_q3_x = 169; //175-6;
var mcq_q3_y = 187; //133-6;

describe("1", function(){

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
		teacher.create_lecture(ptor, "mcq_quiz","https://www.youtube.com/watch?v=SKqBmAHwSkg", o_c.feedback);
	})

	it('should create quiz', function(){
		youtube.seek(ptor, 49);
		create_mcq_quiz(ptor, o_c.feedback);
		make_mcq_questions_and_check(ptor, mcq_q1_x, mcq_q1_y, mcq_q2_x, mcq_q2_y, mcq_q3_x, mcq_q3_y, o_c.feedback);
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

describe("2", function(){

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
		teacher.create_lecture(ptor, "mcq_quiz","https://www.youtube.com/watch?v=SKqBmAHwSkg", o_c.feedback);
	})

	it('should create quiz', function(){
		youtube.seek(ptor, 49);
		create_mcq_quiz(ptor, o_c.feedback);
		make_mcq_questions(ptor, mcq_q1_x, mcq_q1_y, mcq_q2_x, mcq_q2_y, mcq_q3_x, mcq_q3_y, o_c.feedback);
	})

	it('should login a student and check for no of mcqs ', function(){
		o_c.to_student(ptor);
		o_c.open_course_whole(ptor);
		o_c.open_tray(ptor);
		o_c.open_lectures(ptor);
		youtube.seek(ptor, 49);
		expect_quiz(ptor);
		check_mcq_no(ptor, 3);
	})

	it('should answer mcq quiz correctly',function(){
		check_answer_given_answer_order(ptor, 1);
		check_answer_given_answer_order(ptor, 3);
	})

	it('should press answer button',function(){
		answer(ptor);
	})

	it('should check if the answer is correct',function(){
		check_answer_correct(ptor);
	})

	it('should check every popovers', function(){
		expect_popover_on_hover_correct(ptor, 1);
		expect_popover_on_hover_correct(ptor, 3);
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

describe("3", function(){

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
		teacher.create_lecture(ptor, "mcq_quiz","https://www.youtube.com/watch?v=SKqBmAHwSkg", o_c.feedback);
	})

	it('should create quiz', function(){
		youtube.seek(ptor, 49);
		create_mcq_quiz(ptor, o_c.feedback);
		make_mcq_questions(ptor, mcq_q1_x, mcq_q1_y, mcq_q2_x, mcq_q2_y, mcq_q3_x, mcq_q3_y, o_c.feedback);
	})

	it('should login a student and check for no of mcqs ', function(){
		o_c.to_student(ptor);
		o_c.open_course_whole(ptor);
		o_c.open_tray(ptor);
		o_c.open_lectures(ptor);
		youtube.seek(ptor, 49);
		expect_quiz(ptor);
		check_mcq_no(ptor, 3);
	})

	it('should answer mcq quiz correctly',function(){
		check_answer_given_answer_order(ptor, 2);
	})

	it('should press answer button',function(){
		answer(ptor);
	})

	it('should check if the answer is correct',function(){
		check_answer_incorrect(ptor);
	})

	it('should check every popovers', function(){
		expect_popover_on_hover_incorrect(ptor, 2);
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
/////////////////////////////////////////////////////////
//				test specific functions
/////////////////////////////////////////////////////////

function create_mcq_quiz(ptor, feedback){
	locator.s_by_classname(ptor, 'btn-group').then(function(btns){
		btns[0].click().then(function(){
			btns[0].findElements(protractor.By.repeater('item in list')).then(function(items){
				items[0].click().then(function(){
				    feedback(ptor, "Quiz was successfully created");
					expect(locator.by_id(ptor, 'editing').isDisplayed()).toEqual(true);
				})
			})
		})
	})
}

function make_mcq_questions_and_check(ptor, q1_x, q1_y, q2_x, q2_y, q3_x, q3_y, feedback){
	var ontop_w = 0;
	var ontop_h = 0;
	locator.by_id(ptor,'ontop').then(function(ontop){
		ontop.getSize().then(function(size){
			ontop_w = size.width;
			ontop_h = size.height;

			ptor.actions().mouseMove(ontop).perform();
			ptor.actions().mouseMove({x: q1_x, y: q1_y}).perform();
			ptor.actions().doubleClick().perform();
			ptor.actions().click().perform();
			locator.by_classname(ptor, 'must_save_check').click();

			ptor.actions().mouseMove(ontop).perform();
			ptor.actions().mouseMove({x: 5, y: 5}).perform();
			ptor.actions().click().perform();

			ptor.actions().mouseMove(ontop).perform();
			ptor.actions().mouseMove({x: q2_x, y: q2_y}).perform();
			ptor.actions().doubleClick().perform();

			ptor.actions().mouseMove(ontop).perform();
			ptor.actions().mouseMove({x: 5, y: 5}).perform();
			ptor.actions().click().perform();

			ptor.actions().mouseMove(ontop).perform();
			ptor.actions().mouseMove({x: q3_x, y: q3_y}).perform();
			ptor.actions().doubleClick().perform();
			ptor.actions().click().perform();
			locator.by_classname(ptor, 'must_save_check').click();
			ptor.sleep(2000);
			o_c.scroll(ptor, 1000);
			locator.by_id(ptor, 'done').then(function(btn){
				btn.click().then(function(){
					feedback(ptor, 'Quiz was successfully saved');
				})
			})
		})
	})

	o_c.to_student(ptor);
	o_c.open_course_whole(ptor);
	o_c.open_tray(ptor);
	o_c.open_lectures(ptor);
	youtube.seek(ptor, 49);
	expect_quiz(ptor);

	var w, h= 0;
	locator.by_id(ptor,'ontop').then(function(ontop){
		ontop.getLocation().then(function(location){
			ontop.getSize().then(function(size){
				w = size.width;
				h = size.height;

				ontop.findElements(protractor.By.tagName('input')).then(function(check_boxes){
					check_boxes[0].getLocation().then(function(loc){
                        expect(loc.x-location.x).toBeLessThan(Math.floor((w*q1_x)/ontop_w));
                        expect(loc.y-location.y).toBeLessThan(Math.floor((h*q1_y)/ontop_h));
                        
                        expect(loc.x-location.x).toBeGreaterThan(Math.floor((w*q1_x)/ontop_w)-10);
                        expect(loc.y-location.y).toBeGreaterThan(Math.floor((h*q1_y)/ontop_h)-10);
					})
					
					check_boxes[1].getLocation().then(function(loc){
                        expect(loc.x-location.x).toBeLessThan(Math.floor((w*q2_x)/ontop_w));
                        expect(loc.y-location.y).toBeLessThan(Math.floor((h*q2_y)/ontop_h));

                        expect(loc.x-location.x).toBeGreaterThan(Math.floor((w*q2_x)/ontop_w)-10);
                        expect(loc.y-location.y).toBeGreaterThan(Math.floor((h*q2_y)/ontop_h)-10);
					})

					check_boxes[2].getLocation().then(function(loc){
                        expect(loc.x-location.x).toBeLessThan(Math.floor((w*q3_x)/ontop_w));
                        expect(loc.y-location.y).toBeLessThan(Math.floor((h*q3_y)/ontop_h));

                        expect(loc.x-location.x).toBeGreaterThan(Math.floor((w*q3_x)/ontop_w)-10);
                        expect(loc.y-location.y).toBeGreaterThan(Math.floor((h*q3_y)/ontop_h)-10);
                    })
				})
			})
		})
	})
}


function make_mcq_questions(ptor, q1_x, q1_y, q2_x, q2_y, q3_x, q3_y, feedback){
	locator.by_id(ptor,'ontop').then(function(ontop){
		ontop.getSize().then(function(size){
			ontop_w = size.width;
			ontop_h = size.height;

			ptor.actions().mouseMove(ontop).perform();
			ptor.actions().mouseMove({x: q1_x, y: q1_y}).perform();
			ptor.actions().doubleClick().perform();
			ptor.actions().click().perform();
			locator.by_classname(ptor, 'must_save_check').click();

			ptor.actions().mouseMove(ontop).perform();
			ptor.actions().mouseMove({x: 5, y: 5}).perform();
			ptor.actions().click().perform();

			ptor.actions().mouseMove(ontop).perform();
			ptor.actions().mouseMove({x: q2_x, y: q2_y}).perform();
			ptor.actions().doubleClick().perform();

			ptor.actions().mouseMove(ontop).perform();
			ptor.actions().mouseMove({x: 5, y: 5}).perform();
			ptor.actions().click().perform();

			ptor.actions().mouseMove(ontop).perform();
			ptor.actions().mouseMove({x: q3_x, y: q3_y}).perform();
			ptor.actions().doubleClick().perform();
			ptor.actions().click().perform();
			locator.by_classname(ptor, 'must_save_check').click();
			ptor.sleep(2000);
			o_c.scroll(ptor, 1000);
			locator.by_id(ptor, 'done').then(function(btn){
				btn.click().then(function(){
					feedback(ptor, 'Quiz was successfully saved');
				})
			})
		})
	})
}

function check_mcq_no(ptor, no){
	locator.by_id(ptor,'ontop').findElements(protractor.By.tagName('input')).then(function(check_boxes){
		expect(check_boxes.length).toEqual(no);
	})
}

function expect_quiz(ptor){
    locator.by_tag(ptor,'check_answer').findElement(protractor.By.tagName('input')).then(function(check_answer_btn){
		expect(check_answer_btn.isDisplayed()).toEqual(true);
	})
}

function check_answer_given_answer_order(ptor, choice_no){
	locator.by_id(ptor,'ontop').findElements(protractor.By.tagName('input')).then(function(check_boxes){
		check_boxes[choice_no-1].click();
	})
}

function answer(ptor){
	locator.by_tag(ptor,'check_answer').findElement(protractor.By.tagName('input')).then(function(answer_btn){
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

function expect_popover_on_hover_correct(ptor, no){
	locator.by_id(ptor,'ontop').findElements(protractor.By.tagName('input')).then(function(check_boxes){
		ptor.actions().mouseMove(check_boxes[no-1]).perform();
		ptor.actions().mouseMove({x: 5, y: 5}).perform();
		locator.by_classname(ptor, 'popover-title').then(function(popover){
			expect(popover.getText()).toContain("Correct");
		})
	})
}

function expect_popover_on_hover_incorrect(ptor, no){
	locator.by_id(ptor,'ontop').findElements(protractor.By.tagName('input')).then(function(check_boxes){
		ptor.actions().mouseMove(check_boxes[no-1]).perform();
		ptor.actions().mouseMove({x: 5, y: 5}).perform();
		locator.by_classname(ptor, 'popover-title').then(function(popover){
			expect(popover.getText()).toContain("Incorrect");
		})
	})
}
