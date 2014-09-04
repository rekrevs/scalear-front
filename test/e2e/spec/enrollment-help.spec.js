var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module')

var ptor = protractor.getInstance();
var params = ptor.params
ptor.driver.manage().window().maximize();

describe("help on enrollment", function(){
	it('should sign in as teacher', function(){
        o_c.press_login(ptor)
        o_c.sign_in(ptor, params.teacher_mail, params.password);
    })

    it('should create_course', function(){
        teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
    })

    it('should get the course key from teacher info page', function(){
    	o_c.open_course_info(ptor);
    	o_c.press_content_navigator();
		var key = element(by.binding('course.unique_identifier')).getText();
		teacher.open_settings_add_students(ptor);
		expect(element(by.id('kk')).getText()).toContain(key);
		ptor.navigate().refresh();
    })

	it('should get the course key from teacher info page', function(){
    	o_c.open_account(ptor);
    	element(by.id('account_information')).click();
    	var f_name = element(by.id('setting_user_name')).getText();
    	var l_name = element(by.id('setting_last_name')).getText();
    	o_c.open_course_list(ptor);
	    o_c.open_course(ptor, 1);
		teacher.open_settings_add_students(ptor);
		expect(element(by.id('kk')).getText()).toContain(f_name);
		expect(element(by.id('kk')).getText()).toContain(l_name);
		ptor.navigate().refresh();
    })

    it('should delete course', function(){
		o_c.open_course_list(ptor);
	    teacher.delete_course(ptor, 1);
	    o_c.logout(ptor);
	})
})