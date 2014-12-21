var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module')

var ptor = protractor.getInstance();
var params = ptor.params
ptor.driver.manage().window().maximize();

describe("1", function(){

    it('should sign in as teacher', function(){
        o_c.press_login(ptor)
        o_c.sign_in(ptor, params.teacher_mail, params.password);
    })

    it('should create_course', function(){
        teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
    })
    
    it('should create another', function(){
        teacher.create_course(ptor, "short_name", "course_name", "15", params.discussion_link, params.image_link, params.course_description, params.prerequisites);
    })

    // test
    it('should add a module and lectures', function(){
        o_c.open_course_list(ptor)
        o_c.open_course(ptor, 1);        
        teacher.add_module(ptor);
        teacher.open_module(ptor, 1);
        teacher.add_lecture(ptor, 1);
        teacher.add_lecture(ptor, 1);
        teacher.add_module(ptor);
        teacher.open_module(ptor, 2);
        teacher.open_module(ptor, 1);
    })

    it('should copy module', function(){
        copy(ptor);
        check_paste_visible('New Module')
    })

    it('should go to the second course', function(){
        o_c.open_course_list(ptor)
        o_c.open_course(ptor, 2);
        teacher.add_module(ptor);
        teacher.check_module_number(ptor, 1)
    })

    it('paste data', function(){
        paste(ptor);
    })

    it('check if the shared data is right', function(){
        teacher.check_module_number(ptor, 2)
    })
    //end test

    it('should clear the second course for deletion', function(){
        teacher.delete_empty_module(ptor, 1);
        teacher.open_module(ptor, 1);
        teacher.delete_item_by_number(ptor, 1, 1);
        teacher.delete_item_by_number(ptor, 1, 1);

        teacher.delete_empty_module(ptor, 1);
    })

    it('should clear the first course for deletion', function(){
        o_c.open_course_list(ptor)
        o_c.open_course(ptor, 1);
        teacher.open_module(ptor, 1);
        teacher.delete_item_by_number(ptor, 1, 1);
        teacher.delete_item_by_number(ptor, 1, 1);

        teacher.delete_empty_module(ptor, 1);
        teacher.delete_empty_module(ptor, 1);
    })

    
    it('should delete course', function(){
        o_c.open_course_list(ptor);
        teacher.delete_course(ptor, 1);
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
    
    it('should create another', function(){
        teacher.create_course(ptor, "short_name", "course_name", "15", params.discussion_link, params.image_link, params.course_description, params.prerequisites);
    })

    // test
    it('should add a module and lectures', function(){
        o_c.open_course_list(ptor)
        o_c.open_course(ptor, 1);        
        teacher.add_module(ptor);
        teacher.open_module(ptor, 1);
        teacher.add_lecture(ptor, 1);
        teacher.add_lecture(ptor, 1);
        teacher.add_module(ptor);
        teacher.open_module(ptor, 2);
        teacher.open_module(ptor, 1);
        teacher.open_item(ptor, 1, 1)
    })

    it('should copy lecture', function(){
        copy(ptor);
        check_paste_visible('New Lecture')
    })

     it('should go to the second course', function(){
        o_c.open_course_list(ptor)
        o_c.open_course(ptor, 2);
        teacher.add_module(ptor);
        teacher.check_module_number(ptor, 1)
        teacher.check_item_number(ptor,1,0)
    })

    it('paste data', function(){
        paste(ptor);
    })

    it('check if the shared data is right', function(){
        teacher.check_module_number(ptor, 1)
        teacher.check_item_number(ptor,1,1)
    })

    it('check if the shared data is right', function(){
        teacher.add_module(ptor);
        teacher.check_module_number(ptor, 2)
        teacher.check_item_number(ptor,2,0)
    })
    it('paste data', function(){
        paste(ptor);
    })

    it('check if the copyied data is right', function(){
        teacher.check_module_number(ptor, 2)
        teacher.check_item_number(ptor,2,1)
    })
    //end test
    it('should clear the second course for deletion', function(){
        teacher.delete_item_by_number(ptor, 2, 1);
        teacher.delete_empty_module(ptor, 2);
        teacher.open_module(ptor, 1);
        teacher.delete_item_by_number(ptor, 1, 1);
        teacher.delete_empty_module(ptor, 1);
    })

    it('should clear the first course for deletion', function(){
        o_c.open_course_list(ptor)
        o_c.open_course(ptor, 1);
        teacher.open_module(ptor, 1);
        teacher.delete_item_by_number(ptor, 1, 1);
        teacher.delete_item_by_number(ptor, 1, 1);

        teacher.delete_empty_module(ptor, 1);
        teacher.delete_empty_module(ptor, 1);
    })

    it('should delete course', function(){
        o_c.open_course_list(ptor);
        teacher.delete_course(ptor, 1);
        teacher.delete_course(ptor, 1);
        o_c.logout(ptor);
    })
})

describe("3", function(){

    it('should sign in as teacher', function(){
        // o_c.press_login(ptor)
        o_c.sign_in(ptor, params.teacher_mail, params.password);
    })

    it('should create_course', function(){
        teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
    })

    // test
    it('should add a module and lectures', function(){
        o_c.open_course_list(ptor)
        o_c.open_course(ptor, 1);        
        teacher.add_module(ptor);
        teacher.open_module(ptor, 1);
        teacher.add_quiz(ptor, 1);
        teacher.add_lecture(ptor, 1);
        teacher.add_module(ptor);
        teacher.open_module(ptor, 2);
        teacher.open_module(ptor, 1);
        teacher.open_item(ptor, 1, 1)
    })

    it('should copy lecture', function(){
        copy(ptor);
        check_paste_visible('New Quiz')
    })

     it('should check same course', function(){
        teacher.open_module(ptor, 2);
        teacher.check_item_number(ptor,2,0)
    })

    it('paste data', function(){
        paste(ptor);
    })

    it('check if the copyied data is right', function(){
        teacher.check_item_number(ptor,2,1)
    })

    it('add survey', function(){
        teacher.add_survey(ptor)
        teacher.check_item_number(ptor,2,2)
    })
    it('should copy lecture', function(){
        copy(ptor);
        check_paste_visible('New Survey')
    })

    it('paste data', function(){
        paste(ptor);
    })

    it('check if the copyied data is right', function(){
        teacher.check_item_number(ptor,2,3)
    })

    //end test
    it('should clear the course for deletion', function(){
        teacher.delete_item_by_number(ptor, 2, 1);
        teacher.delete_item_by_number(ptor, 2, 1);
        teacher.delete_item_by_number(ptor, 2, 1);
        teacher.delete_empty_module(ptor, 2);

        teacher.open_module(ptor, 1);
        teacher.delete_item_by_number(ptor, 1, 1);
        teacher.delete_item_by_number(ptor, 1, 1);
        teacher.delete_empty_module(ptor, 1);
    })
    
    it('should delete course', function(){
        o_c.open_course_list(ptor);
        teacher.delete_course(ptor, 1);
        o_c.logout(ptor);
    })
})
/////////////////////////////////////////////////////////
//              test specific functions
/////////////////////////////////////////////////////////
function copy(ptor){
    o_c.open_content(ptor)
    element(by.id('copy')).click()
}

function paste(ptor){
    o_c.open_content(ptor)
    element(by.id('paste')).click()
}

function check_paste_visible(item_name){
    o_c.open_content(ptor)
    expect(element(by.id('paste')).isDisplayed()).toBe(true)
    expect(element(by.id('paste')).element(by.className('dark-description')).getText()).toEqual(item_name)
}