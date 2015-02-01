var Header = require('./pages/header');
var Login = require('./pages/login');
var CourseEditor = require('./pages/course_editor');
var ContentNavigator = require('./pages/content_navigator');
var CourseInformation = require('./pages/course_information');
var CourseList = require('./pages/course_list');
var StudentLecture = require('./pages/student/lecture');
var scroll = require('./lib/utils').scroll;
var sleep = require('./lib/utils').sleep;

var params = browser.params;

var header = new Header()
var login_page = new Login()
var course_editor = new CourseEditor()
var course_info = new CourseInformation()
var course_list = new CourseList()
var student_lec = new StudentLecture()

describe("1", function(){

    it('should sign in as teacher', function(){
        o_c.press_login(ptor)
        o_c.sign_in(ptor, params.teacher_mail, params.password);
    })

    it('should create_course', function(){
        teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
    })
    
    // test
    it('should add a module and lectures', function(){
        teacher.add_module(ptor);
        teacher.open_module(ptor, 1);
        teacher.add_lecture(ptor);
        teacher.add_lecture(ptor);
        teacher.add_quiz(ptor)
        teacher.add_survey(ptor)
        teacher.add_module(ptor);
        teacher.add_lecture(ptor);
        teacher.add_quiz(ptor)
        teacher.open_module(ptor, 2);
        teacher.open_module(ptor, 1);
        teacher.open_module(ptor, 2);
    })

    it('should share with teacher 2', function(){
        teacher.share_module(ptor, 3, params.teacher2_mail);
    })
    
    it('should sign in teacher 2', function(){
        o_c.logout(ptor);
        o_c.sign_in(ptor, params.teacher2_mail, params.password);
    })
    
    it('should create_course', function(){
        teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
    })

    it('should reject shared data', function(){
        o_c.open_notifications(ptor)
        count_notification(1)
        o_c.reject_shared(ptor, 1)
        o_c.open_notifications(ptor)
        count_notification(0)
    })

    it('check if the in the same location', function(){
        expect(ptor.getCurrentUrl()).toContain('course_editor')
    })

    it('should sign in teacher 1', function(){
        o_c.logout(ptor);
        o_c.sign_in(ptor, params.teacher_mail, params.password);
    })

    it('should open course', function(){
        o_c.open_course_list(ptor);
        o_c.open_course(ptor, 1);
    })

    it('should share with teacher 2', function(){
        teacher.open_module(ptor, 1);
        teacher.share_module(ptor, 5, params.teacher2_mail);
    })

     it('should sign in teacher 2', function(){
        o_c.logout(ptor);
        o_c.sign_in(ptor, params.teacher2_mail, params.password);
    })
    
    it('should accept shared data', function(){
        o_c.open_notifications(ptor)
        count_notification(1)
        o_c.accept_shared(ptor, 1)
        o_c.open_notifications(ptor)
        count_notification(0)
    })
    
    it('check if the shared data is right', function(){
        expect(ptor.getCurrentUrl()).toContain('show_shared')
        check_shared_module_count(1)
        check_shared_item_count(4)
    })

    it("should add data to course",function(){
        put_shared_module_in_course(1,1);
    })

    it("should check course content with updated data",function(){
        o_c.open_course_list(ptor);
        o_c.open_course(ptor, 1);
        teacher.check_module_number(ptor, 1)
        teacher.open_module(ptor, 1);
        teacher.check_item_number(ptor, 1, 4)
    })
    
    it('should clear the course for deletion', function(){
        teacher.delete_item_by_number(ptor, 1, 1);
        teacher.delete_item_by_number(ptor, 1, 1);
        teacher.delete_item_by_number(ptor, 1, 1);
        teacher.delete_item_by_number(ptor, 1, 1);

        teacher.delete_empty_module(ptor, 1);
    })
    
    it('should delete course', function(){
        o_c.open_course_list(ptor);
        teacher.delete_course(ptor, 1);
    })
    
    it('should sign in teacher 1', function(){
       o_c.logout(ptor);
       o_c.sign_in(ptor, params.teacher_mail, params.password);
    })
    
    it('should clear the course for deletion', function(){
        o_c.open_course_list(ptor);
        o_c.open_course(ptor, 1);

        teacher.open_module(ptor, 2);
        teacher.delete_item_by_number(ptor, 2, 1);
        teacher.delete_item_by_number(ptor, 2, 1);        
        teacher.delete_empty_module(ptor, 2);

        teacher.open_module(ptor, 1);
        teacher.delete_item_by_number(ptor, 1, 1);
        teacher.delete_item_by_number(ptor, 1, 1);
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

describe("2", function(){

    it('should sign in as teacher', function(){
        // o_c.press_login(ptor)
        o_c.sign_in(ptor, params.teacher_mail, params.password);
    })

    it('should create_course', function(){
        teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
    })
    
    // test
    it('should add a module and lectures', function(){
        teacher.add_module(ptor);
        teacher.open_module(ptor, 1);
        teacher.add_lecture(ptor);
        teacher.add_lecture(ptor);
        teacher.add_quiz(ptor)
        teacher.add_survey(ptor)
        teacher.add_module(ptor);
        teacher.add_lecture(ptor);
        teacher.add_quiz(ptor)
        teacher.open_module(ptor, 2);
        teacher.open_module(ptor, 1);
        teacher.open_module(ptor, 2);
    })

    it('should share with teacher 2', function(){
        teacher.share_module(ptor, 3, params.teacher2_mail);
    })
    
    
    it('should clear the course for deletion', function(){

        teacher.open_module(ptor, 2);
        teacher.delete_item_by_number(ptor, 2, 1);
        teacher.delete_item_by_number(ptor, 2, 1);        
        teacher.delete_empty_module(ptor, 2);

        teacher.open_module(ptor, 1);
        teacher.delete_item_by_number(ptor, 1, 1);
        teacher.delete_item_by_number(ptor, 1, 1);
        teacher.delete_item_by_number(ptor, 1, 1);
        teacher.delete_item_by_number(ptor, 1, 1);
        teacher.delete_empty_module(ptor, 1);
    })

    it('should delete course', function(){
        o_c.open_course_list(ptor);
        teacher.delete_course(ptor, 1);
        o_c.logout(ptor);
    })

    it('should sign in teacher 2', function(){
        o_c.sign_in(ptor, params.teacher2_mail, params.password);
    })

     it('should not find a notification', function(){
        o_c.open_notifications(ptor)
        count_notification(0)
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
        teacher.add_module(ptor);
        teacher.open_module(ptor, 1);
        teacher.add_lecture(ptor);
        teacher.add_lecture(ptor);
        teacher.add_quiz(ptor)
        teacher.add_survey(ptor)
        teacher.add_module(ptor);
        teacher.add_lecture(ptor);
        teacher.add_quiz(ptor)
        teacher.open_module(ptor, 2);
        teacher.open_module(ptor, 1);
        teacher.open_module(ptor, 2);
    })

    it('should share with teacher 2', function(){
        teacher.share_module(ptor, 3, params.teacher2_mail);
    })
    
    it('should sign in teacher 2', function(){
        o_c.logout(ptor);
        o_c.sign_in(ptor, params.teacher2_mail, params.password);
    })

    it('should accept shared data', function(){
        o_c.open_notifications(ptor)
        count_notification(1)
        o_c.accept_shared(ptor, 1)
        o_c.open_notifications(ptor)
        count_notification(0)
    })
    
    it('check if the shared data is right', function(){
        expect(ptor.getCurrentUrl()).toContain('show_shared')
        check_shared_module_count(1)
        check_shared_item_count(2)
    })

    it('should sign in teacher 1', function(){
       o_c.logout(ptor);
       o_c.sign_in(ptor, params.teacher_mail, params.password);
    })
    
    it('should clear the course for deletion', function(){
        o_c.open_course_list(ptor);
        o_c.open_course(ptor, 1);

        teacher.open_module(ptor, 2);
        teacher.delete_item_by_number(ptor, 2, 1);
        teacher.delete_item_by_number(ptor, 2, 1);        
        teacher.delete_empty_module(ptor, 2);

        teacher.open_module(ptor, 1);
        teacher.delete_item_by_number(ptor, 1, 1);
        teacher.delete_item_by_number(ptor, 1, 1);
        teacher.delete_item_by_number(ptor, 1, 1);
        teacher.delete_item_by_number(ptor, 1, 1);
        teacher.delete_empty_module(ptor, 1);
    })

    it('should delete course', function(){
        o_c.open_course_list(ptor);
        teacher.delete_course(ptor, 1);
    })

    it('should sign in teacher 2', function(){
        o_c.logout(ptor);
        o_c.sign_in(ptor, params.teacher2_mail, params.password);
    })
    it('should accept shared data', function(){
        o_c.open_course_list(ptor);
        check_view_shared_visible(false)
        o_c.logout(ptor);
    })
})

describe("4", function(){

    it('should sign in as teacher', function(){
        o_c.press_login(ptor)
        o_c.sign_in(ptor, params.teacher_mail, params.password);
    })

    it('should create_course', function(){
        teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
    })
    
    // test
    it('should add a module and lectures', function(){
        teacher.add_module(ptor);
        teacher.open_module(ptor, 1);
        teacher.add_lecture(ptor);
        teacher.add_lecture(ptor);
        teacher.add_quiz(ptor)
        teacher.add_survey(ptor)
        teacher.add_module(ptor);
        teacher.add_lecture(ptor);
        teacher.add_quiz(ptor)
        teacher.open_module(ptor, 2);
        teacher.open_module(ptor, 1);
        teacher.open_item(ptor, 1,1)
        // teacher.open_module(ptor, 2);
    })
    it('should share item with teacher 2', function(){
        teacher.share_item(ptor, 1, params.teacher2_mail);
    })
    
    it('should open second module', function(){
        teacher.open_module(ptor, 1);
        teacher.open_module(ptor, 2);
        teacher.open_item(ptor, 2, 2)
    })

    it('should share with teacher 2', function(){
        teacher.share_item(ptor, 2, params.teacher2_mail);
    })

    it('should sign in teacher 2', function(){
        o_c.logout(ptor);
        o_c.sign_in(ptor, params.teacher2_mail, params.password);
    })

    it('should accept shared data', function(){
        o_c.open_notifications(ptor)
        count_notification(2)
        o_c.accept_shared(ptor, 1)
        o_c.open_notifications(ptor)
        count_notification(1)
        o_c.accept_shared(ptor, 1)
        o_c.open_notifications(ptor)
        count_notification(0)
    })

    it('check if the shared data is right', function(){
        expect(ptor.getCurrentUrl()).toContain('show_shared')
        check_shared_lecture_count(1)
        check_shared_quiz_count(1)
    })

    it('should create_course', function(){
        teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
    })

    it('should add module', function(){
        teacher.add_module(ptor);
    })

    it('should open view shared', function(){
        o_c.open_view_shared()
    })

    it('should put data into course', function(){
        put_shared_lecture_in_course(1,1,1)
        put_shared_quiz_in_course(1,1,1)
    })

    it("should check course content with updated data",function(){
        o_c.open_course_list(ptor);
        o_c.open_course(ptor, 1);
        teacher.check_module_number(ptor, 1)
        teacher.open_module(ptor, 1);
        teacher.check_item_number(ptor, 1, 2)
    })
    
    it('should clear the course for deletion', function(){
        teacher.delete_item_by_number(ptor, 1, 1);
        teacher.delete_item_by_number(ptor, 1, 1);

        teacher.delete_empty_module(ptor, 1);
    })
    
    it('should delete course', function(){
        o_c.open_course_list(ptor);
        teacher.delete_course(ptor, 1);
    })
    
    it('should sign in teacher 1', function(){
       o_c.logout(ptor);
       o_c.sign_in(ptor, params.teacher_mail, params.password);
    })
    
    it('should clear the course for deletion', function(){
        o_c.open_course_list(ptor);
        o_c.open_course(ptor, 1);

        teacher.open_module(ptor, 2);
        teacher.delete_item_by_number(ptor, 2, 1);
        teacher.delete_item_by_number(ptor, 2, 1);        
        teacher.delete_empty_module(ptor, 2);

        teacher.open_module(ptor, 1);
        teacher.delete_item_by_number(ptor, 1, 1);
        teacher.delete_item_by_number(ptor, 1, 1);
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
//				test specific functions
/////////////////////////////////////////////////////////

function put_shared_module_in_course(item_no, course_no){
    var item = element(by.repeater('module in item.modules').row(item_no-1))
    var courses= item.element(by.model('selected_course'))
    var add = item.element(by.buttonText('Copy'))

    expect(add.isEnabled()).toBe(false)
    courses.click()
    courses.all(by.tagName('option')).get(course_no).click()
    expect(add.isEnabled()).toBe(true)
    add.click()
}

function put_shared_lecture_in_course(item_no, course_no, mo_no){
    var item = element(by.repeater('lecture in item.lectures').row(item_no-1))
    var courses= item.element(by.model('selected_course'))
    var modules = item.element(by.model('selected_module'))
    var add = item.element(by.buttonText('Copy'))

    expect(add.isEnabled()).toBe(false)
    courses.click()
    courses.all(by.tagName('option')).get(course_no).click()
    expect(add.isEnabled()).toBe(false)
    modules.click()
    modules.all(by.tagName('option')).get(mo_no).click()
    expect(add.isEnabled()).toBe(true)
    add.click()
}

function put_shared_quiz_in_course(item_no, course_no, mo_no){
    var item = element(by.repeater('quiz in item.quizzes').row(item_no-1))
    var courses= item.element(by.model('selected_course'))
    var modules = item.element(by.model('selected_module'))
    var add = item.element(by.buttonText('Copy'))

    expect(add.isEnabled()).toBe(false)
    courses.click()
    courses.all(by.tagName('option')).get(course_no).click()
    expect(add.isEnabled()).toBe(false)
    modules.click()
    modules.all(by.tagName('option')).get(mo_no).click()
    expect(add.isEnabled()).toBe(true)
    add.click()
}


function check_module_items_no(ptor, mo_no, items_no){
    locator.by_repeater(ptor, 'module in modules').then(function(mods){
        mods[mo_no-1].findElements(protractor.By.repeater('item in module.items')).then(function(items){
            expect(mods.length).toEqual(mo_no);
            expect(items.length).toEqual(items_no);
        })
    })
}

function count_notification(count){
    expect(element.all(by.repeater('(id, item) in user.shared_items')).count()).toEqual(count)
}

function check_shared_module_count(count){
    expect(element.all(by.repeater('module in item.modules')).count()).toEqual(count)
}

function check_shared_item_count(count){
    expect(element.all(by.repeater('child in module.items')).count()).toEqual(count)
}

function check_shared_lecture_count(count){
    expect(element.all(by.repeater('lecture in item.lectures')).count()).toEqual(count)
}

function check_shared_quiz_count(count){
    expect(element.all(by.repeater('quiz in item.quizzes')).count()).toEqual(count)
}

function check_view_shared_visible(val){
    expect(element(by.id("view_shared")).isDisplayed()).toEqual(val)
}