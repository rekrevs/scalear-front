var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module');
var youtube = require('./lib/youtube.js');

var ptor = protractor.getInstance();
var params = ptor.params
ptor.driver.manage().window().maximize();

var ocq_q1_x = 169; //175-6;
var ocq_q1_y = 127; //133-6;

var ocq_q2_x = 169; //175-6;
var ocq_q2_y = 157; //133-6;

var ocq_q3_x = 169; //175-6;
var ocq_q3_y = 187; //133-6;

// describe("1", function(){

// 	it('should sign in as teacher', function(){
// 		o_c.press_login(ptor);
// 		o_c.sign_in(ptor, params.teacher1.email, params.password);
// 	})

// 	it('should create_course', function(){
// 		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
// 	})

// 	//test
// 	it('should add a module and lecture to create quizzes', function(){
// 		// o_c.sign_in(ptor, params.teacher1.email, params.password);
// 		// o_c.open_course_list(ptor);
// 		// o_c.open_course(ptor, 1);
// 		teacher.add_module(ptor);
// 		teacher.open_module(ptor, 1);
// 		teacher.add_lecture(ptor);
// 		o_c.press_content_navigator(ptor);
// 		ptor.sleep(2000)
// 		teacher.init_lecture(ptor, "ocq_quiz","https://www.youtube.com/watch?v=SKqBmAHwSkg");
// 	})

// 	it('should create quiz', function(){
// 		youtube.seek(ptor, 21);
// 		teacher.create_invideo_ocq_quiz(ptor);
//         make_ocq_questions_and_check(ptor, ocq_q1_x, ocq_q1_y, ocq_q2_x, ocq_q2_y, ocq_q3_x, ocq_q3_y);
//         // ptor.sleep(10000)
// 	})

// 	it('should clear the course for deletion', function(){
// 		o_c.to_teacher(ptor);
// 		o_c.open_course_list(ptor);
// 	    o_c.open_course(ptor, 1);
// 	    teacher.open_module(ptor, 1);
// 	    teacher.delete_item_by_number(ptor, 1, 1);
// 	    teacher.delete_empty_module(ptor, 1)
// 	})

// 	it('should delete course', function(){
// 		o_c.open_course_list(ptor);
// 	    teacher.delete_course(ptor, 1);
// 	    o_c.logout(ptor);
// 	})
// })

describe("1", function(){

	it('should sign in as teacher', function(){
		o_c.press_login(ptor);
		o_c.sign_in(ptor, params.teacher1.email, params.password);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
	})

	//test
	it('should add a module and lecture to create quizzes', function(){
		// o_c.sign_in(ptor, params.teacher1.email, params.password);
		// o_c.open_course_list(ptor);
		// o_c.open_course(ptor, 1);
		teacher.add_module(ptor);
		teacher.open_module(ptor, 1);
		teacher.add_lecture(ptor);
		o_c.press_content_navigator(ptor);
		ptor.sleep(2000)
		teacher.init_lecture(ptor, "ocq_quiz","https://www.youtube.com/watch?v=SKqBmAHwSkg");
	})

	it('should create quiz', function(){
		youtube.seek(ptor, 21);
		teacher.create_invideo_ocq_quiz(ptor);
		teacher.make_ocq_questions(ptor, ocq_q1_x, ocq_q1_y, ocq_q2_x, ocq_q2_y, ocq_q3_x, ocq_q3_y);
	})

	it('should get the enrollment key and enroll student', function(){
		o_c.press_content_navigator(ptor);
		ptor.sleep(2000)
		teacher.get_key_and_enroll(ptor, params.student1.email, params.password);
	})

	it('should login a student and check for no of ocqs ', function(){
		// o_c.to_student(ptor);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		// o_c.press_content_navigator(ptor);
		// teacher.open_module(ptor, 1);
		// o_c.press_content_navigator(ptor);
		youtube.press_play(ptor)
		youtube.seek(ptor, 20.9);
		ptor.sleep(3000);
		student.expect_quiz(ptor);
	})

	it('should answer ocq quiz correctly',function(){
		student.answer_invideo_ocq(ptor, 2);
	})

	it('should press answer button',function(){
		student.answer_quiz(ptor);
	})

	it('should check if the answer is correct',function(){
		student.check_answer_correct(ptor);
	})

	it('should check every popovers', function(){
		student.expect_popover_on_hover_incorrect(ptor, 1);
		student.expect_popover_on_hover_correct(ptor, 2);
		student.expect_popover_on_hover_incorrect(ptor, 3);
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

xdescribe("2", function(){

	it('should sign in as teacher', function(){
		// o_c.press_login(ptor);
		o_c.sign_in(ptor, params.teacher1.email, params.password);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
	})

	//test
	it('should add a module and lecture to create quizzes', function(){
		// o_c.sign_in(ptor, params.teacher1.email, params.password);
		// o_c.open_course_list(ptor);
		// o_c.open_course(ptor, 1);
		teacher.add_module(ptor);
		teacher.open_module(ptor, 1);
		teacher.add_lecture(ptor);
		o_c.press_content_navigator(ptor);
		ptor.sleep(2000)
		teacher.init_lecture(ptor, "ocq_quiz","https://www.youtube.com/watch?v=SKqBmAHwSkg");
	})

	it('should create quiz', function(){
		youtube.seek(ptor, 21);
		teacher.create_invideo_ocq_quiz(ptor);
		teacher.make_ocq_questions(ptor, ocq_q1_x, ocq_q1_y, ocq_q2_x, ocq_q2_y, ocq_q3_x, ocq_q3_y);
	})

	it('should get the enrollment key and enroll student', function(){
		o_c.press_content_navigator(ptor);
		ptor.sleep(2000)
		teacher.get_key_and_enroll(ptor, params.student1.email, params.password);
	})

	it('should login a student and check for no of ocqs ', function(){
		// o_c.to_student(ptor);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		// o_c.press_content_navigator(ptor);
		// teacher.open_module(ptor, 1);
		// o_c.press_content_navigator(ptor);
		youtube.press_play(ptor)
		youtube.seek(ptor, 20.9);
		ptor.sleep(3000);
		student.expect_quiz(ptor);
	})

	it('should answer ocq quiz correctly',function(){
		student.answer_invideo_ocq(ptor, 1);
	})

	it('should press answer button',function(){
		student.answer_quiz(ptor);
	})

	it('should check if the answer is correct',function(){
		student.check_answer_incorrect(ptor);
	})

	it('should check every popovers', function(){
		student.expect_popover_on_hover_incorrect(ptor, 1);
	})
	//end test

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

xdescribe("explanation validation", function(){

	it('should sign in as teacher', function(){
		// o_c.press_login(ptor);
		o_c.sign_in(ptor, params.teacher1.email, params.password);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
	})

	//test
	it('should add a module and lecture to create quizzes', function(){
		// o_c.sign_in(ptor, params.teacher1.email, params.password);
		// o_c.open_course_list(ptor);
		// o_c.open_course(ptor, 1);
		teacher.add_module(ptor);
		teacher.open_module(ptor, 1);
		teacher.add_lecture(ptor);
		o_c.press_content_navigator(ptor);
		ptor.sleep(2000)
		teacher.init_lecture(ptor, "ocq_quiz","https://www.youtube.com/watch?v=SKqBmAHwSkg");
	})

	it('should create quiz', function(){
		youtube.seek(ptor, 21);
		teacher.create_invideo_ocq_quiz(ptor);
		teacher.make_ocq_questions(ptor, ocq_q1_x, ocq_q1_y, ocq_q2_x, ocq_q2_y, ocq_q3_x, ocq_q3_y);
	})

	it('should get the enrollment key and enroll student', function(){
		o_c.press_content_navigator(ptor);
		ptor.sleep(2000)
		teacher.get_key_and_enroll(ptor, params.student1.email, params.password);
	})

	it('should login a student and check for no of ocqs ', function(){
		// o_c.to_student(ptor);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		// o_c.press_content_navigator(ptor);
		// teacher.open_module(ptor, 1);
		// o_c.press_content_navigator(ptor);
		youtube.press_play(ptor)
		youtube.seek(ptor, 20.9);
		ptor.sleep(3000);
		student.expect_quiz(ptor);
	})

	it('should answer ocq quiz correctly',function(){
		student.answer_invideo_ocq(ptor, 2);
	})

	it('should press answer button',function(){
		student.answer_quiz(ptor);
	})

	it('should check if the answer is correct',function(){
		student.check_answer_correct(ptor);
	})

	it('should check every popovers', function(){
		student.expect_popover_on_hover_incorrect(ptor, 1);
		student.check_explanation(ptor, 1, "explanation 1");
		student.expect_popover_on_hover_correct(ptor, 2);
		student.check_explanation(ptor, 2, "explanation 2");
		student.expect_popover_on_hover_incorrect(ptor, 3);
		student.check_explanation(ptor, 3, "explanation 3");

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

/////////////////////////////////////////////////////////
//				test specific functions
/////////////////////////////////////////////////////////


function make_ocq_questions_and_check(ptor, q1_x, q1_y, q2_x, q2_y, q3_x, q3_y){
    var ontop_w = 0;
    var ontop_h = 0;
    locator.by_id(ptor,'ontop').then(function(ontop){
        ontop.getSize().then(function(size){
            ontop_w = size.width;
            ontop_h = size.height;

            ptor.actions().mouseMove(ontop).perform();
            ptor.actions().mouseMove(ontop,{x: q1_x, y: q1_y}).perform();
            ptor.actions().doubleClick().perform();
            ptor.actions().click().perform();
            locator.by_classname(ptor, 'must_save_check').click();

            ptor.actions().mouseMove(ontop).perform();
            ptor.actions().mouseMove({x: 5, y: 5}).perform();
            ptor.actions().click().perform();

            ptor.sleep(2000);

            ptor.actions().mouseMove(ontop).perform();
            ptor.actions().mouseMove(ontop,{x: q2_x, y: q2_y}).perform();
            ptor.actions().doubleClick().perform();

            ptor.actions().mouseMove(ontop).perform();
            ptor.actions().mouseMove({x: 5, y: 5}).perform();
            ptor.actions().click().perform();

            ptor.sleep(2000);

            ptor.actions().mouseMove(ontop).perform();
            ptor.actions().mouseMove(ontop,{x: q3_x, y: q3_y}).perform();
            ptor.actions().doubleClick().perform();
            // ptor.actions().click().perform();

            ptor.sleep(2000);
			o_c.scroll(ptor, 1000);
			element(by.buttonText('Save')).click()
            // .then(function(btn){
            //     btn.click().then(function(){
            //         o_c.feedback(ptor, 'Quiz was successfully saved');
            //     })
            // })
        })
    })

 	o_c.to_student(ptor);
	o_c.open_course_list(ptor);
	o_c.open_course(ptor, 1);
	// o_c.press_content_navigator(ptor);
	// teacher.open_module(ptor, 1);
	// o_c.press_content_navigator(ptor);
	youtube.seek(ptor, 21);
	student.expect_quiz(ptor);

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


// function check_ocq_questions_coord(ptor, q1_x, q1_y, q2_x, q2_y, q3_x, q3_y){
// 	var w, h= 0;
// 	//(width*169)/570
// 	locator.by_id(ptor,'ontop').then(function(ontop){
// 		ontop.getLocation().then(function(location){
// 			ontop.getSize().then(function(size){
// 				w = size.width;

// 				ontop.findElements(protractor.By.tagName('input')).then(function(check_boxes){
// 					check_boxes[0].getLocation().then(function(loc){
// 						expect(loc.x-location.x).toEqual(Math.floor((w*q1_x)/570)-6);
// 						expect(loc.y-location.y).toEqual(Math.floor((w*q1_y)/570)-6);
// 					})

// 					check_boxes[1].getLocation().then(function(loc){
// 						expect(loc.x-location.x).toEqual(Math.floor((w*q2_x)/570)-6);
// 						expect(loc.y-location.y).toEqual(Math.floor((w*q2_y)/570)-6);
// 					})

// 					check_boxes[2].getLocation().then(function(loc){
// 						expect(loc.x-location.x).toEqual(Math.floor((w*q3_x)/570)-6);
// 						expect(loc.y-location.y).toEqual(Math.floor((w*q3_y)/570)-6);
// 					})
// 				})
// 			})
// 		})
// 	})
// }

// function check_ocq_no(ptor, no){
// 	locator.by_id(ptor,'ontop').findElements(protractor.By.tagName('input')).then(function(check_boxes){
// 		expect(check_boxes.length).toEqual(no);
// 	})
// }

// function expect_quiz(ptor){
// 	expect(element(by.buttonText('Check Answer')).isDisplayed()).toEqual(true);
// }

// function answer_invideo_ocq(ptor, choice_no){
// 	locator.by_id(ptor,'ontop').findElements(protractor.By.tagName('input')).then(function(check_boxes){
// 		check_boxes[choice_no-1].click();
// 	})
// }

// function answer_quiz(ptor){
// 	element(by.buttonText('Check Answer')).click()
// }

// function check_answer_correct(ptor){
// 	locator.by_tag(ptor,'notification').then(function(popover){
// 		expect(popover.getText()).toContain('Correct');
// 	})
// }

// function check_answer_incorrect(ptor){
// 	locator.by_tag(ptor,'notification').then(function(popover){
// 		expect(popover.getText()).toContain('Incorrect');
// 	})
// }

function is_checked(ptor, no){
	locator.by_id(ptor,'ontop').findElements(protractor.By.tagName('input')).then(function(check_boxes){
		check_boxes[no-1].getAttribute('checked').then(function(ch){
			expect(ch).toEqual("true");
		})
	})
}

function is_not_checked(ptor, no){
	locator.by_id(ptor,'ontop').findElements(protractor.By.tagName('input')).then(function(check_boxes){
		check_boxes[no-1].getAttribute('checked').then(function(ch){
			expect(ch).toEqual(null);
		})
	})
}

// function expect_popover_on_hover_correct(ptor, no){
// 	locator.by_id(ptor,'ontop').findElements(protractor.By.tagName('input')).then(function(check_boxes){
// 		ptor.actions().mouseMove(check_boxes[no-1]).perform();
// 		ptor.actions().mouseMove({x: 5, y: 5}).perform();
// 		locator.by_classname(ptor, 'popover-title').then(function(popover){
// 			expect(popover.getText()).toContain("Correct");
// 		})
// 	})
// }

// function expect_popover_on_hover_incorrect(ptor, no){
// 	locator.by_id(ptor,'ontop').findElements(protractor.By.tagName('input')).then(function(check_boxes){
// 		ptor.actions().mouseMove(check_boxes[no-1]).perform();
// 		ptor.actions().mouseMove({x: 5, y: 5}).perform();
// 		locator.by_classname(ptor, 'popover-title').then(function(popover){
// 			expect(popover.getText()).toContain("Incorrect");
// 		})
// 	})
// }
