var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module')

var ptor = protractor.getInstance();
var params = ptor.params
ptor.driver.manage().window().maximize();

var discussion_link_shrt = 'testing';

var short_name_ch = "csc-test2";
var course_name_ch = "testing2 course2 1002";
var course_duration_ch = '12';
var discussion_link_ch = 'www.discussion-link.com';
var image_link_ch = "http://dasonlightinginc.com/uploads/2/9/4/2/2942625/4781952_orig.jpg"
var course_description_ch = '2 many words'
var prerequisites_ch = '3- course 3 1- course 1 2- course 2';

var discussion_link_shrt_ch = 'www.discu';

var course_date = new Date();
var date = course_date.toString();

describe("teacher create course check info", function(){

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
	it('should log out from teacher then login as a student', function(){
		o_c.open_tray(ptor);
		o_c.logout(ptor, o_c.feedback);
		o_c.sign_in(ptor, params.mail, params.password, o_c.feedback);
	})

	it('should open info and test course information', function(){
		o_c.open_course_whole(ptor);
		o_c.open_tray(ptor);
		o_c.open_info(ptor);
        student.check_course_info(ptor, params.short_name, params.course_name, params.course_description, params.prerequisites, params.discussion_link, Date(), params.course_duration);
	})
	//end test
	it('should delete course', function(){
		//should choose one of home() or home_teacher() 
		//depending on the current state(student or teacher)
		o_c.home(ptor);
		teacher.delete_course(ptor, o_c.feedback);
	})
})

describe("teacher check the ability to change course info", function(){

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
	it('should go to info page and change info', function(){
		o_c.open_course_whole(ptor);
		o_c.open_tray(ptor);
		o_c.open_info_teacher(ptor);
		change_course_info(ptor,course_description_ch, prerequisites_ch, short_name_ch, course_name_ch, discussion_link_ch, course_duration_ch, o_c.feedback);
	})

	it('should log out from teacher then login as a student', function(){
		o_c.home_teacher(ptor);
		o_c.open_tray(ptor);
		o_c.logout(ptor, o_c.feedback);
		o_c.sign_in(ptor, params.mail, params.password, o_c.feedback);
	})

	it('should open info and test course information', function(){
		o_c.open_course_whole(ptor);
		o_c.open_tray(ptor);
		o_c.open_info(ptor);
		student.check_course_info(ptor, short_name_ch, course_name_ch, course_description_ch, prerequisites_ch, discussion_link_shrt_ch, date, course_duration_ch)
	})
	//end test
	it('should delete course', function(){
		//should choose one of home() or home_teacher() 
		//depending on the current state(student or teacher)
		o_c.home(ptor);
		teacher.delete_course(ptor, o_c.feedback);
	})
})

//======================================================
//
//======================================================


function change_course_info(ptor, course_description, prerequisites, short_name, course_name, discussion_link, course_duration, feedback){
    locator.by_xpath(ptor, '//*[@id="main"]/div/div/div/ui-view/div[2]/div[1]/span[2]/p/big-area/a').then(function(desc){
		desc.click();
        locator.by_classname(ptor, 'editable-has-buttons').then(function(txt_area){
			txt_area.clear();
			txt_area.sendKeys(course_description);
		})
        locator.by_classname(ptor, 'icon-ok').then(function(submit_btn){
			submit_btn.click().then(function(){
                feedback(ptor,'Course was successfully updated');
            });
		})
	})

    locator.by_xpath(ptor, '//*[@id="main"]/div/div/div/ui-view/div[2]/div[1]/span[3]/p/big-area/a').then(function(prereq){
		prereq.click();
        locator.by_classname(ptor, 'editable-has-buttons').then(function(txt_area){
			txt_area.clear();
			txt_area.sendKeys(prerequisites);
		})
        locator.by_classname(ptor, 'icon-ok').then(function(submit_btn){
			submit_btn.click().then(function(){
                feedback(ptor,'Course was successfully updated');
            });
		})
	})

    locator.by_xpath(ptor, '//*[@id="main"]/div/div/div/ui-view/div[1]/details-text[1]/a').then(function(shrt_nm){
		shrt_nm.click();
        locator.by_classname(ptor, 'editable-has-buttons').then(function(txt_area){
			txt_area.clear();
			txt_area.sendKeys(short_name);
		})
        locator.by_classname(ptor, 'icon-ok').then(function(submit_btn){
			submit_btn.click().then(function(){
                feedback(ptor,'Course was successfully updated');
            });
		})
	})

    locator.by_xpath(ptor, '//*[@id="main"]/div/div/div/ui-view/div[1]/details-text[2]/a').then(function(crs_nm){
		crs_nm.click();
        locator.by_classname(ptor, 'editable-has-buttons').then(function(txt_area){
			txt_area.clear();
			txt_area.sendKeys(course_name);
		})
        locator.by_classname(ptor, 'icon-ok').then(function(submit_btn){
			submit_btn.click().then(function(){
                feedback(ptor,'Course was successfully updated');
            });
		})
	})
    
    locator.by_xpath(ptor, '//*[@id="main"]/div/div/div/ui-view/div[1]/span/ul[2]/details-link/a').then(function(disc_lnk){
		disc_lnk.click();
        locator.by_classname(ptor, 'editable-has-buttons').then(function(txt_area){
			txt_area.clear();
			txt_area.sendKeys(discussion_link);
		})
        locator.by_classname(ptor, 'icon-ok').then(function(submit_btn){
			submit_btn.click().then(function(){
                feedback(ptor,'Course was successfully updated');
            });
		})
	})

    locator.by_xpath(ptor, '//*[@id="main"]/div/div/div/ui-view/div[1]/span/ul[4]/details-text/a').then(function(crs_dur){
		crs_dur.click();
        locator.by_classname(ptor, 'editable-has-buttons').then(function(txt_area){
			txt_area.clear();
			txt_area.sendKeys(course_duration);
		})
        locator.by_classname(ptor, 'icon-ok').then(function(submit_btn){
			submit_btn.click().then(function(){
                feedback(ptor,'Course was successfully updated');
            });
		})
	})
	ptor.sleep(3000);
}