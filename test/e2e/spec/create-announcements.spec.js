var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module')

var ptor = protractor.getInstance();
var params = ptor.params
ptor.driver.manage().window().maximize();

var announcement_text1 = "announcement 1"
var announcement_text2 = "announcement 2"
var announcement_text3 = "announcement 3"

describe("1", function(){

	it('should sign in as teacher', function(){
		o_c.press_login(ptor)
		o_c.sign_in(ptor, params.teacher_mail, params.password);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites, o_c.feedback);
	})

	it('should get the enrollment key and enroll student', function(){
		teacher.get_key_and_enroll(ptor);
	})

	//test
	it('should go to announcements page and make an announcement', function(){
		o_c.open_course_list(ptor);
		o_c.open_course(ptor, 1);
		o_c.open_announcements(ptor);
		create_new_announcement(ptor, announcement_text1);
		create_new_announcement(ptor, announcement_text2);
		create_new_announcement(ptor, announcement_text3);
	})

	it('should log out from teacher then login as a student', function(){
		o_c.to_student(ptor);
	})

	it('should check number of announcements', function(){
		// o_c.sign_in(ptor, params.student_mail, params.password);
		o_c.open_course_list(ptor)
		o_c.open_course(ptor, 1);
		check_number_of_announcments(ptor, 3);
	})
	//end test
	
	it('should delete course', function(){
		o_c.to_teacher(ptor)
		o_c.open_course_list(ptor);
		teacher.delete_course(ptor, 1);
		o_c.logout(ptor, o_c.feedback);
	})
})

/////////////////////////////////////////////////////////
//				test specific functions
/////////////////////////////////////////////////////////

function create_new_announcement(ptor, ann_txt){
	element(by.id('new_announcement')).click()
	element(by.className('ta-editor')).sendKeys(ann_txt)
	element(by.id('save_button')).click().then(function(){
		o_c.feedback(ptor,'Announcement was successfully created.');
	})
}

function check_number_of_announcments(ptor, no_of_ann){
  locator.by_repeater(ptor, 'announcement in announcements').then(function(announcments) {
      expect(announcments.length).toEqual(no_of_ann);
  });
  locator.s_by_binding(ptor, 'a.announcement').then(function(announcments) {
    announcments.reverse();
    announcments.forEach(function(announcment, i) {
      expect(announcment.getText()).toEqual('announcement ' + (i + 1));
    });
  });
}

function check_announcment_with_date(ptor, ann_no, ann_date){
    locator.s_by_classname(ptor, 'well-lg').then(function(date){
      date.reverse();
      expect(date[ann_no-1].getText()).toContain(ann_date);
    });
}
