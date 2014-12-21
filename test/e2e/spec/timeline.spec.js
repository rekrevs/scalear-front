var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module');
var youtube = require('./lib/youtube.js');
var disc = require('./lib/discussion.js');

var ptor = protractor.getInstance();
var params = ptor.params
ptor.driver.manage().window().maximize();

describe("deleting confused", function(){
	
	it('should sign in as teacher', function(){
		o_c.press_login(ptor);
		o_c.sign_in(ptor, params.teacher_mail, params.password);
	})

	it('create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
	})

	it('should add a module and lecture ', function(){
		// o_c.sign_in(ptor, params.teacher_mail, params.password);
		// o_c.open_course_list(ptor);
		// o_c.open_course(ptor, 1);
		teacher.add_module(ptor);
		teacher.open_module(ptor, 1);
		teacher.add_lecture(ptor);			
		// o_c.press_content_navigator(ptor);
		// ptor.sleep(2000)
		teacher.init_lecture(ptor, "LEC","https://www.youtube.com/watch?v=SKqBmAHwSkg");
	})

	it('should get the enrollment key and enroll student', function(){
		teacher.get_key_and_enroll(ptor, params.student_mail, params.password);

		// o_c.sign_in(ptor, params.teacher_mail, params.password);
		// o_c.open_course_list(ptor);
		// o_c.open_course(ptor, 1);
		// teacher.get_key_and_enroll(ptor, params.student2_mail, params.password);
	})

	it('should login a student', function(){
		// o_c.to_student(ptor);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		youtube.seek(ptor, 21);
		student.press_confused_btn(ptor);
		check_confused_no(1);
		check_if_con_has_delete(ptor, 1);
		// o_c.logout(ptor);
	})

	it('should get the enrollment key and enroll student', function(){
		o_c.to_teacher(ptor);
		// teacher.get_key_and_enroll(ptor, params.student_mail, params.password);

		// o_c.sign_in(ptor, params.teacher_mail, params.password);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		teacher.get_key_and_enroll(ptor, params.student2_mail, params.password);
	})

	it('should go the other student and check for ability to delete a confused', function(){
		// o_c.sign_in(ptor, params.student2_mail, params.password);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		check_confused_no(0);
	})

	it('should login a student and delete confused', function(){
		o_c.to_student(ptor);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		delete_con(ptor, 1);
		check_confused_no(0);
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

describe("deleting notes", function(){
	
	it('should sign in as teacher', function(){
		// o_c.press_login(ptor);
		o_c.sign_in(ptor, params.teacher_mail, params.password);
	})

	it('create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
	})

	it('should add a module and lecture ', function(){
		// o_c.sign_in(ptor, params.teacher_mail, params.password);
		// o_c.open_course_list(ptor);
		// o_c.open_course(ptor, 1);
		teacher.add_module(ptor);
		teacher.open_module(ptor, 1);
		teacher.add_lecture(ptor);			
		// o_c.press_content_navigator(ptor);
		// ptor.sleep(2000)
		teacher.init_lecture(ptor, "LEC","https://www.youtube.com/watch?v=SKqBmAHwSkg");
	})

	it('should get the enrollment key and enroll student', function(){
		teacher.get_key_and_enroll(ptor, params.student_mail, params.password);

		// o_c.sign_in(ptor, params.teacher_mail, params.password);
		// o_c.open_course_list(ptor);
		// o_c.open_course(ptor, 1);
		// teacher.get_key_and_enroll(ptor, params.student2_mail, params.password);
	})

	it('should login a student', function(){
		// o_c.to_student(ptor);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		youtube.seek(ptor, 21);
		student.create_note(ptor, "note note");
		check_notes_no(1);
		// o_c.logout(ptor);
	})

	it('should get the enrollment key and enroll student', function(){
		// teacher.get_key_and_enroll(ptor, params.student_mail, params.password);
		o_c.to_teacher(ptor);
		// o_c.sign_in(ptor, params.teacher_mail, params.password);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		teacher.get_key_and_enroll(ptor, params.student2_mail, params.password);
	})

	it('should go the other student and check for notes not visible', function(){
		// o_c.sign_in(ptor, params.student2_mail, params.password);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		check_notes_no(0);
	})

	it('should login a student and delete confused', function(){
		o_c.to_student(ptor);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		delete_note(ptor, 1);
		check_notes_no(0);
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

describe("deleting discussion from another lecture", function(){
	
	it('should sign in as teacher', function(){
		// o_c.press_login(ptor);
		o_c.sign_in(ptor, params.teacher_mail, params.password);
	})

	it('create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
	})

	it('should add a module and lecture ', function(){
		// o_c.sign_in(ptor, params.teacher_mail, params.password);
		// o_c.open_course_list(ptor);
		// o_c.open_course(ptor, 1);
		teacher.add_module(ptor);
		teacher.open_module(ptor, 1);
		teacher.add_lecture(ptor);			
		// o_c.press_content_navigator(ptor);
		// ptor.sleep(2000)
		teacher.init_lecture(ptor, "LEC","https://www.youtube.com/watch?v=SKqBmAHwSkg");

		teacher.add_lecture(ptor);			
		// ptor.sleep(2000)
		teacher.init_lecture(ptor, "LEC","https://www.youtube.com/watch?v=SKqBmAHwSkg");
	})

	it('should get the enrollment key and enroll student', function(){
		teacher.get_key_and_enroll(ptor, params.student_mail, params.password);
	})

	it('should ask a public question as student', function(){
		// o_c.to_student(ptor);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		youtube.seek(ptor, 21);
		check_disc_no(0);
		disc.ask_public_question(ptor, "public ques");
	})

	it('should open another module', function(){
		o_c.press_content_navigator(ptor);
		ptor.sleep(5000);
		teacher.open_module(ptor, 1);
		teacher.open_item(ptor, 1, 2);
		check_disc_no(1);
	})

	it('should ask another question and delete the first one', function(){
		disc.ask_public_question(ptor, "public ques");
		check_disc_no(2);
		delete_disc(ptor, 1);
		check_disc_no(1);
	})

	it('should clear the course for deletion', function(){
		o_c.to_teacher(ptor);
		o_c.open_course_list(ptor);
	    o_c.open_course(ptor, 1);
	    teacher.open_module(ptor, 1);
	    teacher.delete_item_by_number(ptor, 1, 1);
	    teacher.delete_item_by_number(ptor, 1, 1);
	    teacher.delete_empty_module(ptor, 1)
	})

	it('should delete course', function(){
		o_c.open_course_list(ptor);
	    teacher.delete_course(ptor, 1);
	    o_c.logout(ptor);
	})
})

describe("deleting confused from another lecture", function(){
	
	it('should sign in as teacher', function(){
		// o_c.press_login(ptor);
		o_c.sign_in(ptor, params.teacher_mail, params.password);
	})

	it('create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
	})

	it('should add a module and lecture ', function(){
		// o_c.sign_in(ptor, params.teacher_mail, params.password);
		// o_c.open_course_list(ptor);
		// o_c.open_course(ptor, 1);
		teacher.add_module(ptor);
		teacher.open_module(ptor, 1);
		teacher.add_lecture(ptor);			

		// o_c.press_content_navigator(ptor);
		// ptor.sleep(2000)
		teacher.init_lecture(ptor, "LEC","https://www.youtube.com/watch?v=SKqBmAHwSkg");

		teacher.add_lecture(ptor);			
		// ptor.sleep(2000)
		teacher.init_lecture(ptor, "LEC","https://www.youtube.com/watch?v=SKqBmAHwSkg");
	})

	it('should get the enrollment key and enroll student', function(){
		teacher.get_key_and_enroll(ptor, params.student_mail, params.password);;
	})

	it('should login a student', function(){
		// o_c.to_student(ptor);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		youtube.seek(ptor, 21);
		student.press_confused_btn(ptor);
		check_confused_no(1);
		check_if_con_has_delete(ptor, 1);

		o_c.press_content_navigator(ptor);
		ptor.sleep(5000);
		teacher.open_module(ptor, 1);
		teacher.open_item(ptor, 1, 2);
		student.press_confused_btn(ptor);
		check_confused_no(2);

		delete_con(ptor, 1);
		check_confused_no(1);

	})

	it('should clear the course for deletion', function(){
		o_c.to_teacher(ptor);
		o_c.open_course_list(ptor);
	    o_c.open_course(ptor, 1);
	    teacher.open_module(ptor, 1);
	    teacher.delete_item_by_number(ptor, 1, 1);
	    teacher.delete_item_by_number(ptor, 1, 1);
	    teacher.delete_empty_module(ptor, 1)
	})

	it('should delete course', function(){
		o_c.open_course_list(ptor);
	    teacher.delete_course(ptor, 1);
	    o_c.logout(ptor);
	})
})

describe("deleting notes from another lecture", function(){
	
	it('should sign in as teacher', function(){
		// o_c.press_login(ptor);
		o_c.sign_in(ptor, params.teacher_mail, params.password);
	})

	it('create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
	})

	it('should add a module and lecture ', function(){
		// o_c.sign_in(ptor, params.teacher_mail, params.password);
		// o_c.open_course_list(ptor);
		// o_c.open_course(ptor, 1);
		teacher.add_module(ptor);
		teacher.open_module(ptor, 1);
		teacher.add_lecture(ptor);			
		// o_c.press_content_navigator(ptor);
		// ptor.sleep(2000)
		teacher.init_lecture(ptor, "LEC","https://www.youtube.com/watch?v=SKqBmAHwSkg");

		teacher.add_lecture(ptor);			
		// ptor.sleep(2000)
		teacher.init_lecture(ptor, "LEC","https://www.youtube.com/watch?v=SKqBmAHwSkg");
	})

	it('should get the enrollment key and enroll student', function(){
		teacher.get_key_and_enroll(ptor, params.student_mail, params.password);
	})

	it('should login a student', function(){
		// o_c.to_student(ptor);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		youtube.seek(ptor, 21);
		student.create_note(ptor, "note note");
		check_notes_no(1);
	})

	it('should login a student and delete confused', function(){
		o_c.press_content_navigator(ptor);
		ptor.sleep(5000);
		teacher.open_module(ptor, 1);
		teacher.open_item(ptor, 1, 2);
		student.create_note(ptor, "note note");
		check_notes_no(2);
		delete_note(ptor, 1);
		check_notes_no(1);
	})

	it('should clear the course for deletion', function(){
		o_c.to_teacher(ptor);
		o_c.open_course_list(ptor);
	    o_c.open_course(ptor, 1);
	    teacher.open_module(ptor, 1);
	    teacher.delete_item_by_number(ptor, 1, 1);
	    teacher.delete_item_by_number(ptor, 1, 1);
	    teacher.delete_empty_module(ptor, 1)
	})

	it('should delete course', function(){
		o_c.open_course_list(ptor);
	    teacher.delete_course(ptor, 1);
	    o_c.logout(ptor);
	})
})


function check_disc_no(no){
	element.all(by.name('discussion-timeline-item')).then(function(disc){
		expect(disc.length).toEqual(no);
	})
}

function check_confused_no(no){
	element.all(by.name('confused-timeline-item')).then(function(cons){
		expect(cons.length).toEqual(no);
	})
}

function check_if_con_has_delete(ptor, con_no){
	locator.s_by_name(ptor, 'confused-timeline-item').then(function(cons){
		cons[con_no-1].findElements(protractor.By.className('delete')).then(function(d){
			expect(d.length).toEqual(1);
		})
	})
}

function delete_con(ptor, con_no){
	locator.s_by_name(ptor, 'confused-timeline-item').then(function(cons){
		cons[con_no-1].findElements(protractor.By.className('delete')).then(function(d){
			d[0].click();
		})
	})

	locator.s_by_name(ptor, 'confused-timeline-item').then(function(cons){
		cons[con_no-1].findElements(protractor.By.className('fi-check')).then(function(d){
			d[0].click();
		})
	})
}

function check_notes_no(no){
	element.all(by.name('notes-timeline-item')).then(function(cons){
		expect(cons.length).toEqual(no);
	})
}

function delete_note(ptor, no){
    locator.s_by_name(ptor, 'notes-timeline-item').then(function(t){
        t[no-1].findElement(protractor.By.id('show_note')).click();
    })

    locator.s_by_name(ptor, 'notes-timeline-item').then(function(t){
        t[no-1].findElement(protractor.By.tagName('textarea')).clear();
        t[no-1].findElement(protractor.By.tagName('textarea')).sendKeys(' ');
        ptor.sleep(3000);
        ptor.actions().sendKeys(protractor.Key.ENTER).perform();
    })
}

function delete_disc(ptor, disc_no){
	var disc = element.all(by.name("discussion-timeline-item")).get(disc_no-1)
	disc.element(by.className('delete')).click()
	disc.element(by.className('fi-check')).click()
}