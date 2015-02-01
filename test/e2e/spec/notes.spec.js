var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module');
var youtube = require('./lib/youtube.js');

var ptor = protractor.getInstance();
var params = ptor.params
ptor.driver.manage().window().maximize();

describe("1", function(){
	it('should sign in as teacher', function(){
		o_c.press_login(ptor);
		o_c.sign_in(ptor, params.teacher_mail, params.password);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
	})
	//test
	it('should add a module and lecture ', function(){
		// o_c.sign_in(ptor, params.teacher_mail, params.password);
		// o_c.open_course_list(ptor);
		// o_c.open_course(ptor, 1);
		teacher.add_module(ptor);
		teacher.open_module(ptor, 1);
		teacher.add_lecture(ptor);			
		// o_c.press_content_navigator(ptor);
		// ptor.sleep(2000)
		teacher.init_lecture(ptor, "notes test","https://www.youtube.com/watch?v=SKqBmAHwSkg");
	})

	it('should get the enrollment key and enroll student', function(){
		teacher.get_key_and_enroll(ptor, params.student_mail, params.password);
	})

	it('should add a note as a student', function(){
		// o_c.to_student(ptor);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		youtube.seek(ptor, 21);
		// create_note(ptor, "note text");
		create_and_validate_note();
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

// describe("2", function(){

// 	it('should sign in as teacher', function(){
// 		// o_c.press_login(ptor);
// 		o_c.sign_in(ptor, params.teacher_mail, params.password);
// 	})

// 	it('should create_course', function(){
// 		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
// 	})

// 	//test
// 	it('should add a module and lecture', function(){
// 		// o_c.sign_in(ptor, params.teacher_mail, params.password);
// 		// o_c.open_course_list(ptor);
// 		// o_c.open_course(ptor, 1);
// 		teacher.add_module(ptor);
// 		teacher.open_module(ptor, 1);
// 		teacher.add_lecture(ptor);			
// 		// o_c.press_content_navigator(ptor);
// 		// ptor.sleep(2000)
// 		teacher.init_lecture(ptor, "ocq_text_quiz","https://www.youtube.com/watch?v=SKqBmAHwSkg");
// 	})

// 	it('should get the enrollment key and enroll student', function(){
// 		teacher.get_key_and_enroll(ptor, params.student_mail, params.password);
// 	})

// 	it('should login a student', function(){
// 		// o_c.to_student(ptor);
// 		o_c.open_course_list(ptor);
// 		o_c.open_course(ptor, 1);
// 		youtube.seek(ptor, 21);
// 		validate_note_time();
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
function create_note(ptor, text){
    locator.by_id(ptor, 'add_note_button').then(function(not){
        not.click().then(function(){
            locator.by_classname(ptor, 'editable-controls').then(function(t){
                t.findElement(protractor.By.tagName('textarea')).sendKeys(text);
                ptor.sleep(3000);
                ptor.actions().sendKeys(protractor.Key.ENTER).perform();
            })
        })
    })
}

function check_note_text(no, text){
	element.all(by.id("show_note")).then(function(note){
		expect(note[no-1].getText()).toEqual(text);
	})
}

function create_and_validate_note(){
	locator.by_classname(ptor, 'timer').findElements(protractor.By.className('ng-binding')).then(function(timers){
		timers[0].getText().then(function(time){
			create_note(ptor, "note text");
			check_note_text(1, "note text")
			locator.s_by_name(ptor, 'notes-timeline-item').then(function(note){
				note[0].findElements(protractor.By.tagName('div')).then(function(div){
					div[0].getAttribute('tooltip').then(function(attr){
						expect(attr).toEqual(time);
					})
				})
			})
		})
	})
}