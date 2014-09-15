var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module');
var youtube = require('./lib/youtube.js');
var disc = require('./lib/discussion.js');

var ptor = protractor.getInstance();
var params = ptor.params
ptor.driver.manage().window().maximize();

describe("go to preview as student mode", function(){
    it('should sign in as teacher', function(){
        o_c.press_login(ptor);
        o_c.sign_in(ptor, params.teacher_mail, params.password);
    })

    it('should create_course', function(){
        teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
    })
    
    it('preview as student should not be visible', function(){
    	expect(element(by.id('preview_as_student')).isDisplayed()).toEqual(false);
    })

    it('should add a module and lecture to create quizzes', function(){
        teacher.add_module(ptor);
        teacher.open_module(ptor, 1);
        teacher.add_lecture(ptor);           
        o_c.press_content_navigator(ptor);
        ptor.sleep(2000)
        teacher.init_lecture(ptor, "lecture 1","https://www.youtube.com/watch?v=SKqBmAHwSkg");
    })

    it('preview as student should be visible', function(){
    	expect(element(by.id('preview_as_student')).isDisplayed()).toEqual(true);
    })
    
    it('click preview as student', function(){
    	element(by.id('preview_as_student')).click();
    })

    it('should be in stu preview mode',function(){
    	element.all(by.linkText('Exit Student Preview')).then(function(a){
    		expect(a.length).toEqual(1);
    	})
    })

    it('should exit preview mode', function(){
    	element(by.linkText('Exit Student Preview')).click();
    })

    it('should clear the course for deletion', function(){
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

describe("in order and required doesnot apply", function(){
    it('should sign in as teacher', function(){
        o_c.press_login(ptor);
        o_c.sign_in(ptor, params.teacher_mail, params.password);
    })

    it('should create_course', function(){
        teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
    })
    
    it('preview as student should not be visible', function(){
    	expect(element(by.id('preview_as_student')).isDisplayed()).toEqual(false);
    })

    it('should add a module and lecture to create quizzes', function(){
        teacher.add_module(ptor);
        teacher.open_module(ptor, 1);
        teacher.add_lecture(ptor);           
        o_c.press_content_navigator(ptor);
        ptor.sleep(2000)
        teacher.init_lecture(ptor, "lecture 1","https://www.youtube.com/watch?v=SKqBmAHwSkg");
    })

    it('preview as student should be visible', function(){
    	expect(element(by.id('preview_as_student')).isDisplayed()).toEqual(true);
    })
    
    it('click preview as student', function(){
    	element(by.id('preview_as_student')).click();
    })

    it('should be in stu preview mode',function(){
    	element.all(by.linkText('Exit Student Preview')).then(function(a){
    		expect(a.length).toEqual(1);
    	})
    })

    it('should exit preview mode', function(){
    	element(by.linkText('Exit Student Preview')).click();
    })

    it('should clear the course for deletion', function(){
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