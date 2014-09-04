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
    
    test
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
        // o_c.home_teacher(ptor);
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
        // o_c.open_tray(ptor);
        o_c.open_notifications(ptor)
        count_notification(1)
        o_c.accept_shared(ptor, 1)
        o_c.open_notifications(ptor)
        count_notification(0)
        
        // o_c.open_notification_shared(ptor, 1);
        // put_shared_in_course(ptor,1,1);
    })
    
    it('check if the shared data is right', function(){
        expect(ptor.getCurrentUrl()).toContain('show_shared')
        check_shared_module_count(1)
        check_shared_item_count(4)
    //     o_c.home_teacher(ptor);
    //     o_c.open_course_whole(ptor);
    //     check_module_items_no(ptor, 1, 2);
    })

    it("should add data to course",function(){
        put_shared_in_course(ptor,1,1);
    })

    it("should check course content with updated data",function(){
        o_c.open_course_list(ptor);
        o_c.open_course(ptor, 1);
        // o_c.press_content_navigator(ptor)
        teacher.check_module_number(ptor, 1)
        teacher.open_module(ptor, 1);
        teacher.check_item_number(ptor, 1, 4)
    })
    //end test
    
    it('should clear the course for deletion', function(){
        // teacher.open_module(ptor, 1);
        teacher.delete_item_by_number(ptor, 1, 1);
        teacher.delete_item_by_number(ptor, 1, 1);
        teacher.delete_item_by_number(ptor, 1, 1);
        teacher.delete_item_by_number(ptor, 1, 1);

        teacher.delete_empty_module(ptor, 1);
    })
    
    it('should delete course', function(){
        // o_c.to_teacher(ptor)
        o_c.open_course_list(ptor);
        teacher.delete_course(ptor, 1);
        o_c.logout(ptor);
    })
    
    it('should sign in teacher 1', function(){
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

function put_shared_in_course(ptor, item_no, course_no){
    var item = element(by.repeater('module in item.modules').row(item_no-1))
    var courses= item.element(by.model('selected_course'))
    var add = item.element(by.buttonText('Copy'))

    expect(add.isEnabled()).toBe(false)
    courses.click()
    courses.all(by.tagName('option')).get(course_no).click()
    expect(add.isEnabled()).toBe(true)
    add.click()
    // locator.by_repeater(ptor, 'item in data').then(function(items){
    //     items[item_no-1].findElement(protractor.By.tagName('select')).then(function(s){
    //         s.findElements(protractor.By.tagName('option')).then(function(op){
    //             op[course_no].click();
    //         })
    //     });
    //     items[item_no-1].findElement(protractor.By.className('btn-success')).then(function(add){
    //         add.click();
    //     });
    // })
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