var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module')

var ptor = protractor.getInstance();
var params = ptor.params
ptor.driver.manage().window().maximize();

var screen_name = "student";
var fname = "s";
var lname = "t";
var univer = "world university";

var studentmail1 = 's1@sharklasers.com';
var studentmail2 = 's2@sharklasers.com';
var studentmail3 = 's3@sharklasers.com';
var studentmail4 = 's4@sharklasers.com';
var studentmail5 = 's5@sharklasers.com';

var biog = "kalam keteeer yege 140 char bs teacher";
var webs = "www.website.com";
var password = 'password';

//////////scenarios in mind
////////// selection
////////// searching
////////// emailing

describe("1", function(){

	it('should sign in as teacher', function(){
		o_c.press_login(ptor)
		o_c.sign_in(ptor, params.teacher_mail, params.password);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
	})

	it('should get the enrollment key and enroll student', function(){
		teacher.get_key_and_enroll(ptor);
	})
	//test
	it('should', function(){
 		o_c.open_course_list(ptor);
    	o_c.open_course(ptor, 1);
		o_c.open_enrolled(ptor);
		check_enrolled_no(ptor, 1);
	})
	//end test
	it('should delete course', function(){
		o_c.open_course_list(ptor);
		teacher.delete_course(ptor, 1);
		o_c.logout(ptor);
	})
})

describe("2", function(){
	it('should sign in as teacher', function(){
		// o_c.press_login(ptor)
		o_c.sign_in(ptor, params.teacher_mail, params.password);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
	})

	it('should get the enrollment key and enroll student', function(){
		teacher.get_key_and_enroll(ptor, params.student_mail, params.password);
	})

	//test
	it('should enroll student1', function(){
		o_c.sign_in(ptor, params.teacher_mail, params.password);
		o_c.open_course_list(ptor);
    	o_c.open_course(ptor, 1);
		teacher.get_key_and_enroll(ptor, studentmail1,params.password);
	})
	it('should enroll student2', function(){
		o_c.sign_in(ptor, params.teacher_mail, params.password);	
		o_c.open_course_list(ptor);
    	o_c.open_course(ptor, 1);
		teacher.get_key_and_enroll(ptor, studentmail2,params.password);
	})
	it('should enroll student3', function(){
		o_c.sign_in(ptor, params.teacher_mail, params.password);
		o_c.open_course_list(ptor);
    	o_c.open_course(ptor, 1);
		teacher.get_key_and_enroll(ptor, studentmail3,params.password);
	})
	it('should enroll student4', function(){
		o_c.sign_in(ptor, params.teacher_mail, params.password);
		o_c.open_course_list(ptor);
    	o_c.open_course(ptor, 1);
		teacher.get_key_and_enroll(ptor, studentmail4,params.password);
	})
	it('should enroll student5', function(){
		o_c.sign_in(ptor, params.teacher_mail, params.password);
		o_c.open_course_list(ptor);
    	o_c.open_course(ptor, 1);
		teacher.get_key_and_enroll(ptor, studentmail5,params.password);
	})
	it('check for enrolled students', function(){
		o_c.sign_in(ptor, params.teacher_mail, params.password);
		o_c.open_course_list(ptor);
    	o_c.open_course(ptor, 1);
		o_c.open_enrolled(ptor);
		check_enrolled_no(ptor, 6);
	})
	//end test

	it('should delete course', function(){
		o_c.open_course_list(ptor);
		teacher.delete_course(ptor, 1);
		o_c.logout(ptor);
	})
})

describe("3", function(){
	it('should sign in as teacher', function(){
		// o_c.press_login(ptor)
		o_c.sign_in(ptor, params.teacher_mail, params.password);
	})

	it('should create course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
	})

	it('should get the enrollment key and enroll student', function(){
		teacher.get_key_and_enroll(ptor, params.student_mail, params.password);
	})

	//test
	it('should enroll student1', function(){
		o_c.sign_in(ptor, params.teacher_mail, params.password);
		o_c.open_course_list(ptor);
    	o_c.open_course(ptor, 1);
		teacher.get_key_and_enroll(ptor, studentmail1, params.password);
	})

	it('check for enrolled students', function(){
		o_c.sign_in(ptor, params.teacher_mail, params.password);
		o_c.open_course_list(ptor);
    	o_c.open_course(ptor, 1);
		o_c.open_enrolled(ptor);
		check_enrolled_no(ptor, 2);
	})

	it('should delete student', function(){
		delete_enrolled_student(ptor, 1);
		check_enrolled_no(ptor, 1);
		o_c.logout(ptor);
	})

	it('should check if student is not enrolled', function(){
		o_c.sign_in(ptor, studentmail1, params.password);
		o_c.open_course_list(ptor)
		check_if_courses_exist(ptor, 0);
		o_c.logout(ptor);
	})
	it('should check if other student is still enrolled', function(){
		o_c.sign_in(ptor, params.student_mail, params.password);
		o_c.open_course_list(ptor)
		check_if_courses_exist(ptor, 1);
	})
	//end test

	it('should delete course', function(){
		o_c.to_teacher(ptor)
		o_c.open_course_list(ptor);
		teacher.delete_course(ptor, 1);
		o_c.logout(ptor);
	})
})

xdescribe("", function(){
	xit('should sign up 1', function(){
		o_c.sign_up(ptor, screen_name, fname, lname, studentmail1, univer, biog, webs, password);
		ptor.sleep(3000);
		o_c.confirm_account(ptor, studentmail1);
		ptor.sleep(5000);
		o_c.open_tray(ptor);
		o_c.logout(ptor);
	})

	xit('should sign up 2', function(){
		o_c.sign_up(ptor, screen_name, fname, lname, studentmail2, univer, biog, webs, password);
		ptor.sleep(3000);
		o_c.confirm_account(ptor, studentmail2);
		ptor.sleep(5000);
		o_c.open_tray(ptor);
		o_c.logout(ptor);
	})

	xit('should sign up 3', function(){
		o_c.sign_up(ptor, screen_name, fname, lname, studentmail3, univer, biog, webs, password);
		o_c.confirm_account(ptor, studentmail3);
		o_c.open_tray(ptor);
		o_c.logout(ptor);
	})

	xit('should sign up 4', function(){
		o_c.sign_up(ptor, screen_name, fname, lname, studentmail4, univer, biog, webs, password);
		o_c.confirm_account(ptor, studentmail4);
		o_c.open_tray(ptor);
		o_c.logout(ptor);
	})

	xit('should sign up 5', function(){
		o_c.sign_up(ptor, screen_name, fname, lname, studentmail5, univer, biog, webs, password);
		o_c.confirm_account(ptor, studentmail5);
		o_c.open_tray(ptor);
		o_c.logout(ptor);
	})

	xit('should delete account 1', function(){
		o_c.sign_in(ptor, studentmail1, params.password);
		o_c.open_tray(ptor);
		o_c.cancel_account(ptor, params.password);
	})

	xit('should delete account 2', function(){
		o_c.sign_in(ptor, studentmail2, params.password);
		o_c.open_tray(ptor);
		o_c.cancel_account(ptor, params.password);
	})

	xit('should delete account 3', function(){
		o_c.sign_in(ptor, studentmail3, params.password);
		o_c.open_tray(ptor);
		o_c.cancel_account(ptor, params.password);
	})

	xit('should delete account 4', function(){
		o_c.sign_in(ptor, studentmail4, params.password);
		o_c.open_tray(ptor);
		o_c.cancel_account(ptor, params.password);
	})

	xit('should delete account 5', function(){		
		o_c.sign_in(ptor, studentmail5, params.password);
		o_c.open_tray(ptor);
		o_c.cancel_account(ptor, params.password);
	 })
})
/////////////////////////////////////////////////////////
//				test specific functions
/////////////////////////////////////////////////////////

//====================================================
//            enroll student by mail
//====================================================
// function get_key_and_enroll(ptor, mail){
	
// 	o_c.open_tray(ptor);
// 	o_c.open_info_teacher(ptor);
// 	locator.by_xpath(ptor, '//*[@id="main"]/div/div/div/ui-view/div[1]/span/ul[1]').then(function(element){
// 		element.getText().then(function(text){
// 			o_c.home_teacher(ptor);
// 			o_c.open_tray(ptor);
// 			o_c.logout(ptor);
// 			o_c.sign_in(ptor, mail, params.password, o_c.feedback);
// 			student.join_course(ptor, text, o_c.feedback);
// 			o_c.home(ptor);
// 			o_c.open_tray(ptor);
// 			o_c.logout(ptor, o_c.feedback);
// 			o_c.sign_in(ptor, params.teacher_mail, params.password, o_c.feedback);
// 		})
// 	})
// }

//====================================================
//         check number of enrolled students
//====================================================
function check_enrolled_no(ptor, no){
	locator.by_repeater(ptor, "student in students").then(function(students){
		expect(students.length).toEqual(no);
	})
}

//====================================================
//         			delete student
//====================================================
function delete_enrolled_student(ptor, no){
	element.all(by.repeater('student in students')).count().then(function(count){
		var student_no = count	
		var student = element(by.repeater("student in students").row(no-1))
		student.element(by.className('delete')).click()
		student.element(by.className('fi-check')).click()
		expect(element.all(by.repeater('student in students')).count()).toEqual(student_no-1)
	})
	// .then(function(){
	// 	o_c.feedback(ptor, 'was removed from Course');
	// 	// o_c.logout(ptor, o_c.feedback);
	// })
	// element.all(by.repeater("student in students")).get(no-1).element(by.className('delete')).click()

	// locator.by_repeater(ptor, "student in students").then(function(students){
	// 	students[no-1].findElement(protractor.By.className('delete')).then(function(del_btn){
 //            del_btn.click().then(function(){
 //            	students[no-1].findElement(protractor.By.className('btn-danger')).then(function(conf_btn){
 //            		conf_btn.click().then(function(){
 //            			feedback(ptor, 'was removed from Course');
 //            		})
 //            	})
 //            })
 //        })
	// })
}

//
//
//

function check_if_courses_exist(ptor, val){
	expect(element.all(by.repeater('course in courses')).count()).toEqual(val*2)
	// ptor.driver.isElementPresent(by.className('whole')).then(function(present){
 //    	expect(present).toBe(false);
	// })
}