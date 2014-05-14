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
//
//
//		need to check the date and confirm time zone changes
//
//
describe("teacher", function(){

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
	it('should go to announcements page and make an announcement', function(){
		o_c.open_course_whole(ptor);
		o_c.open_tray(ptor);
		o_c.open_announcements_teacher(ptor);
		create_new_announcement(ptor, announcement_text1, o_c.feedback);
		create_new_announcement(ptor, announcement_text2, o_c.feedback);
		create_new_announcement(ptor, announcement_text3, o_c.feedback);
	})

	it('should log out from teacher then login as a student', function(){
		o_c.home_teacher(ptor);
		o_c.open_tray(ptor);
		o_c.logout(ptor, o_c.feedback);
		o_c.sign_in(ptor, params.mail, params.password, o_c.feedback);
	})

	it('should check number of announcements', function(){
		o_c.open_tray(ptor);
		o_c.open_course_whole(ptor);
		check_number_of_announcments(ptor, 3);
	})
	//end test
	
	it('should delete course', function(){
		//should choose one of home() or home_teacher() 
		//depending on the current state(student or teacher)
		o_c.home(ptor);
		teacher.delete_course(ptor, o_c.feedback);
	})
})

/////////////////////////////////////////////////////////
//				test specific functions
/////////////////////////////////////////////////////////

function create_new_announcement(ptor, ann_txt, feedback){
	locator.by_id(ptor, 'new_announcement').then(function(new_ann_btn){
		new_ann_btn.click();
	})

	locator.s_by_classname(ptor, 'ta-editor').then(function(txt_area){
		txt_area[0].sendKeys(ann_txt);
	})

	locator.by_id(ptor, 'save_button').then(function(save_btn){
		save_btn.click().then(function(){
	        feedback(ptor,'Announcement was successfully created.');
	    });
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
