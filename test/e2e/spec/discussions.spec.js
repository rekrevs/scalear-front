var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module');
var youtube = require('./lib/youtube.js');
var disc = require('./lib/discussion.js');

var ptor = protractor.getInstance();
var params = ptor.params
ptor.driver.manage().window().maximize();

describe("public/private visibility", function(){

	it('should sign in as teacher', function(){
		o_c.press_login(ptor);
		o_c.sign_in(ptor, params.teacher_mail, params.password);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
	})

	it('should add a module and lecture ', function(){
		// o_c.to_teacher(ptor);
		// o_c.open_course_list(ptor);
		// o_c.open_course(ptor, 1);
		teacher.add_module(ptor);
		teacher.open_module(ptor, 1);
		teacher.add_lecture(ptor);			
		// o_c.press_content_navigator(ptor);
		// ptor.sleep(2000)
		teacher.init_lecture(ptor, "lecture","https://www.youtube.com/watch?v=SKqBmAHwSkg");
	})

	it('should get the enrollment key and enroll student', function(){
		teacher.get_key_and_enroll(ptor, params.student_mail, params.password);
	})

	it('should ask public and private question as student', function(){
		// o_c.to_student(ptor);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		youtube.seek(ptor, 21);
		disc.ask_private_question(ptor, "private ques")
		youtube.seek(ptor, 42);
		disc.ask_public_question(ptor, "public ques");
		// o_c.logout(ptor);
	})

	it('should get the enrollment key and enroll student2', function(){
		// teacher.get_key_and_enroll(ptor, params.student_mail, params.password);
		o_c.to_teacher(ptor);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		teacher.get_key_and_enroll(ptor, params.student2_mail, params.password);
	})

	it('should go the other student check for visible questions', function(){
		// o_c.sign_in(ptor, params.student2_mail, params.password);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		check_disc_no(1);
		expect(element(by.name('discussion-timeline-item')).getText()).toContain('public');
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

describe("flagging/voting-up question", function(){
	
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

		// o_c.sign_in(ptor, params.teacher_mail, params.password);
		// o_c.open_course_list(ptor);
		// o_c.open_course(ptor, 1);
		// teacher.get_key_and_enroll(ptor, params.student3_mail, params.password);
	})

	it('should ask public question', function(){
		// o_c.to_student(ptor);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		youtube.seek(ptor, 21);
		disc.ask_public_question(ptor, "public ques");
		// o_c.logout(ptor);
	})

	it('should get the enrollment key and enroll student2', function(){
		o_c.to_teacher(ptor);
		// teacher.get_key_and_enroll(ptor, params.student_mail, params.password);

		// o_c.sign_in(ptor, params.teacher_mail, params.password);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		teacher.get_key_and_enroll(ptor, params.student2_mail, params.password);

		// o_c.sign_in(ptor, params.teacher_mail, params.password);
		// o_c.open_course_list(ptor);
		// o_c.open_course(ptor, 1);
		// teacher.get_key_and_enroll(ptor, params.student3_mail, params.password);
	})

	it('should go the other student and flag a question', function(){
		// o_c.sign_in(ptor, params.student2_mail, params.password);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		check_disc_no(1);
		expect(element(by.name('discussion-timeline-item')).getText()).toContain('public');
		disc.flag(ptor, 1);
		expect(element(by.name('discussion-timeline-item')).getText()).toContain('Flagged post');
		
		expect(element(by.name('discussion-timeline-item')).getText()).toContain('0');
		disc.vote_up(ptor, 1);
		expect(element(by.name('discussion-timeline-item')).getText()).toContain('1');
		// o_c.logout(ptor);
	})
	it('should get the enrollment key and enroll student3', function(){
		o_c.to_teacher(ptor);
		// teacher.get_key_and_enroll(ptor, params.student_mail, params.password);

		// o_c.sign_in(ptor, params.teacher_mail, params.password);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		// teacher.get_key_and_enroll(ptor, params.student2_mail, params.password);

		// o_c.sign_in(ptor, params.teacher_mail, params.password);
		// o_c.open_course_list(ptor);
		// o_c.open_course(ptor, 1);
		teacher.get_key_and_enroll(ptor, params.student3_mail, params.password);
	})

	it('should go the the third student and flag a question', function(){
		// o_c.sign_in(ptor, params.student3_mail, params.password);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		check_disc_no(1);
		expect(element(by.name('discussion-timeline-item')).getText()).toContain('public');
		disc.flag(ptor, 1);
		expect(element(by.name('discussion-timeline-item')).getText()).toContain('Flagged post');
		
		expect(element(by.name('discussion-timeline-item')).getText()).toContain('1');
		disc.vote_up(ptor, 1);
		expect(element(by.name('discussion-timeline-item')).getText()).toContain('2');
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

describe("comments", function(){
	
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

		// o_c.sign_in(ptor, params.teacher_mail, params.password);
		// o_c.open_course_list(ptor);
		// o_c.open_course(ptor, 1);
		// teacher.get_key_and_enroll(ptor, params.student3_mail, params.password);
	})

	it('should ask public question', function(){
		// o_c.to_student(ptor);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		youtube.seek(ptor, 21);
		disc.ask_public_question(ptor, "public ques");
		// o_c.logout(ptor);
	})

	it('should get the enrollment key and enroll student', function(){
		o_c.to_teacher(ptor);
		// teacher.get_key_and_enroll(ptor, params.student_mail, params.password);

		// o_c.sign_in(ptor, params.teacher_mail, params.password);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		teacher.get_key_and_enroll(ptor, params.student2_mail, params.password);

		// o_c.sign_in(ptor, params.teacher_mail, params.password);
		// o_c.open_course_list(ptor);
		// o_c.open_course(ptor, 1);
		// teacher.get_key_and_enroll(ptor, params.student3_mail, params.password);
	})

	it('should go the other student and flag a question', function(){
		// o_c.sign_in(ptor, params.student2_mail, params.password);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		check_disc_no(1);
		expect(element(by.name('discussion-timeline-item')).getText()).toContain('public');
		disc.comment(ptor, 1, "first comment");
		check_comm_no(1);
		// o_c.logout(ptor);
	})

	it('should get the enrollment key and enroll student', function(){
		o_c.to_teacher(ptor);
		// teacher.get_key_and_enroll(ptor, params.student_mail, params.password);

		// o_c.sign_in(ptor, params.teacher_mail, params.password);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		// teacher.get_key_and_enroll(ptor, params.student2_mail, params.password);

		// o_c.sign_in(ptor, params.teacher_mail, params.password);
		// o_c.open_course_list(ptor);
		// o_c.open_course(ptor, 1);
		teacher.get_key_and_enroll(ptor, params.student3_mail, params.password);
	})

	it('should go the the third student and flag a question', function(){
		// o_c.sign_in(ptor, params.student3_mail, params.password);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		check_disc_no(1);
		disc.comment(ptor, 1, "first comment");
		check_comm_no(2);
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

describe("flagging/voting-up comments", function(){
	
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

		// o_c.sign_in(ptor, params.teacher_mail, params.password);
		// o_c.open_course_list(ptor);
		// o_c.open_course(ptor, 1);
		// teacher.get_key_and_enroll(ptor, params.student3_mail, params.password);
	})


	it('should login a student', function(){
		// o_c.to_student(ptor);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		youtube.seek(ptor, 21);
		disc.ask_public_question(ptor, "public ques");
		disc.comment(ptor, 1, "first comment");
		check_comm_no(1);
		// o_c.logout(ptor);
	})

	it('should get the enrollment key and enroll student', function(){
		o_c.to_teacher(ptor);
		// teacher.get_key_and_enroll(ptor, params.student_mail, params.password);

		// o_c.sign_in(ptor, params.teacher_mail, params.password);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		teacher.get_key_and_enroll(ptor, params.student2_mail, params.password);

		// o_c.sign_in(ptor, params.teacher_mail, params.password);
		// o_c.open_course_list(ptor);
		// o_c.open_course(ptor, 1);
		// teacher.get_key_and_enroll(ptor, params.student3_mail, params.password);
	})

	it('should go the other student and flag a comment', function(){
		// o_c.sign_in(ptor, params.student2_mail, params.password);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		check_disc_no(1);
		expect(element(by.name('discussion-timeline-item')).getText()).toContain('public');
		check_comm_no(1);
		disc.flag_comment(ptor, 1, 1);
		check_for_flagged(ptor, 1, 1);
		disc.vote_comment_up(ptor,1 ,1);
		check_for_vote_no(ptor, 1, 1, 1);
		// o_c.logout(ptor);
	})

	it('should get the enrollment key and enroll student', function(){
		o_c.to_teacher(ptor);
		// teacher.get_key_and_enroll(ptor, params.student_mail, params.password);

		// o_c.sign_in(ptor, params.teacher_mail, params.password);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		// teacher.get_key_and_enroll(ptor, params.student2_mail, params.password);

		// o_c.sign_in(ptor, params.teacher_mail, params.password);
		// o_c.open_course_list(ptor);
		// o_c.open_course(ptor, 1);
		teacher.get_key_and_enroll(ptor, params.student3_mail, params.password);
	})

	it('should go the the third student and flag a question', function(){
		// o_c.sign_in(ptor, params.student3_mail, params.password);
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		check_disc_no(1);
		check_for_flagged(ptor, 1, 1);
		disc.vote_comment_up(ptor,1 ,1);
		check_for_vote_no(ptor, 1, 1, 2);
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

function check_disc_no(no){
	element.all(by.name('discussion-timeline-item')).then(function(discs){
		expect(discs.length).toEqual(no);
	})
}

function check_comm_no(no){
	element.all(by.className('discussion-comment')).then(function(comm){
		expect(comm.length).toEqual(no);
	})
}

function check_for_flagged(ptor, q_no, co_no){
	locator.s_by_name(ptor, 'discussion-timeline-item').then(function(questions){
        questions[q_no-1].findElements(protractor.By.className('discussion-comment')).then(function(comments){
            expect(comments[co_no-1].getText()).toContain('Flagged');
        })
    })
}

function check_for_vote_no(ptor, q_no, co_no, no){
	locator.s_by_name(ptor, 'discussion-timeline-item').then(function(questions){
        questions[q_no-1].findElements(protractor.By.className('discussion-comment')).then(function(comments){
            expect(comments[co_no-1].getText()).toContain(no);
        })
    })
}