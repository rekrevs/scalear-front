var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module')

var ptor = protractor.getInstance();
var params = ptor.params
ptor.driver.manage().window().maximize();

// xdescribe("1", function(){
//     it('should sign in as teacher', function(){
//         o_c.sign_in(ptor, params.teacher_mail, params.password);
//     })

//     it('should add a module and lectures', function(){
//         o_c.open_course_whole(ptor, 0);
//     })

//     it('should open content navigator', function(){
//         o_c.press_content_navigator(ptor);
//     })

//     it('should press the first module', function(){
//         teacher.open_module(ptor, 1);
//     })

//     it('should check for teacher menu appearance', function(){
//         teacher.check_for_teacher_nav_bar(ptor);
//         teacher.open_content_copy(ptor);
//     })


// })

xdescribe("1", function(){

    it('should sign in as teacher', function(){
        o_c.press_login(ptor)
        o_c.sign_in(ptor, params.teacher_mail, params.password);
    })

    it('should create_course', function(){
        teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites, o_c.feedback);
        // o_c.home_teacher(ptor);
    })
    
    //test
    it('should add a module and lectures', function(){
        // o_c.open_course_whole(ptor);
        teacher.add_module(ptor, o_c.feedback);
        o_c.press_content_navigator(ptor)
        teacher.open_module(ptor, 1);
        teacher.add_lecture(ptor, 1, o_c.feedback);
        teacher.add_lecture(ptor, 1, o_c.feedback);
        teacher.add_module(ptor, o_c.feedback);
        teacher.open_module(ptor, 2);
        teacher.open_module(ptor, 1);
    })

    it('should share with teacher 2', function(){
        teacher.share_module(ptor, 3, params.teacher2_mail);
    })
    
    it('should sign in teacher 2', function(){
        // o_c.home_teacher(ptor);
        // o_c.open_tray(ptor);
        o_c.logout(ptor, o_c.feedback);
        o_c.sign_in(ptor, params.teacher2_mail, params.password, o_c.feedback);
    })
    
    it('should create_course', function(){
        teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites, o_c.feedback);
        // o_c.home_teacher(ptor);
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
        check_shared_item_count(2)
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
        o_c.press_content_navigator(ptor)
        teacher.check_module_number(ptor, 1)
        teacher.open_module(ptor, 1);
        teacher.check_item_number(ptor, 1, 2)
    })
    //end test
    
    it('should clear the course for deletion', function(){
        // teacher.open_module(ptor, 1);
        teacher.delete_item_by_number(ptor, 1, 1, o_c.feedback);
        teacher.delete_item_by_number(ptor, 1, 1, o_c.feedback);

        teacher.delete_empty_module(ptor, 1, o_c.feedback);
    })
    
    it('should delete course', function(){
        // o_c.to_teacher(ptor)
        o_c.open_course_list(ptor);
        teacher.delete_course(ptor, 1);
        o_c.logout(ptor, o_c.feedback);
    })
    
    it('should sign in teacher 1', function(){
       o_c.sign_in(ptor, params.teacher_mail, params.password);
    })
    
    it('should clear the course for deletion', function(){
        o_c.open_course_list(ptor);
        o_c.open_course(ptor, 1);
        o_c.press_content_navigator(ptor)
        teacher.open_module(ptor, 2);
        teacher.delete_empty_module(ptor, 2, o_c.feedback);
        teacher.open_module(ptor, 1);
        teacher.delete_item_by_number(ptor, 1, 1, o_c.feedback);
        teacher.delete_item_by_number(ptor, 1, 1, o_c.feedback);
        teacher.delete_empty_module(ptor, 1, o_c.feedback);
    })

    it('should delete course', function(){
        //should choose one of home() or home_teacher() 
        //depending on the current state(student or teacher)
        o_c.open_course_list(ptor);
        teacher.delete_course(ptor, 1);
        o_c.logout(ptor, o_c.feedback);
    })
})

describe("2", function(){

    it('should sign in as teacher', function(){
        o_c.press_login(ptor)
        o_c.sign_in(ptor, params.teacher_mail, params.password, o_c.feedback);
    })

    it('should create_course', function(){
        teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites, o_c.feedback);
        // o_c.home_teacher(ptor);
    })
    
    it('should create another', function(){
        teacher.create_course(ptor, "short_name", "course_name", "15", params.discussion_link, params.image_link, params.course_description, params.prerequisites, o_c.feedback);
        // o_c.home_teacher(ptor);
    })

    // test
    it('should add a module and lectures', function(){
        // o_c.open_course_whole(ptor);
        o_c.open_course_list(ptor)
        o_c.open_course(ptor, 1);        
        o_c.open_content_editor(ptor);
        teacher.add_module(ptor, o_c.feedback);
        o_c.press_content_navigator(ptor)
        teacher.open_module(ptor, 1);
        teacher.add_lecture(ptor, 1, o_c.feedback);
        teacher.add_lecture(ptor, 1, o_c.feedback);
        teacher.add_module(ptor, o_c.feedback);
        teacher.open_module(ptor, 2);
        teacher.open_module(ptor, 1);
    })

    it('should copy module', function(){
        copy_module(ptor);
        check_paste_visible('New Module')
    })

    it('should go to the second course', function(){
        // o_c.home_teacher(ptor);
        o_c.open_course_list(ptor)
        o_c.open_course(ptor, 2);
        o_c.open_content_editor(ptor)
        teacher.add_module(ptor, o_c.feedback);
        o_c.press_content_navigator(ptor)
        teacher.check_module_number(ptor, 1)
    })

    it('paste data', function(){
        paste_module(ptor);
    })

    it('check if the shared data is right', function(){
        teacher.check_module_number(ptor, 2)
    })
    //end test

    it('should clear the second course for deletion', function(){
        teacher.delete_empty_module(ptor, 1, o_c.feedback);
        teacher.open_module(ptor, 1);
        teacher.delete_item_by_number(ptor, 1, 1, o_c.feedback);
        teacher.delete_item_by_number(ptor, 1, 1, o_c.feedback);

        teacher.delete_empty_module(ptor, 1, o_c.feedback);
    })

    it('should clear the first course for deletion', function(){
        o_c.open_course_list(ptor)
        o_c.open_course(ptor, 1);
        o_c.press_content_navigator(ptor)
        teacher.open_module(ptor, 1);
        teacher.delete_item_by_number(ptor, 1, 1, o_c.feedback);
        teacher.delete_item_by_number(ptor, 1, 1, o_c.feedback);

        teacher.delete_empty_module(ptor, 1, o_c.feedback);
        teacher.delete_empty_module(ptor, 1, o_c.feedback);

    })

    
    it('should delete course', function(){
        //should choose one of home() or home_teacher() 
        //depending on the current state(student or teacher)
        o_c.open_course_list(ptor);
        teacher.delete_course(ptor, 1);
        teacher.delete_course(ptor, 1);
        o_c.logout(ptor, o_c.feedback);
    })
})

/////////////////////////////////////////////////////////
//				test specific functions
/////////////////////////////////////////////////////////
function copy_module(ptor){
    o_c.open_content(ptor)
    element(by.id('copy')).click()

    // locator.by_repeater(ptor, 'module in modules').then(function(mods){
    //     ptor.actions().mouseMove(mods[mo_no-1]).perform();
    //     ptor.actions().mouseMove({x: 5, y: 5}).perform();
    //     ptor.actions().click(protractor.Button.RIGHT).perform();
    //     locator.s_by_classname(ptor, 'dropdown-menu').then(function(menu){
    //         menu[0].findElement(protractor.By.partialLinkText("Copy")).click();
    //         locator.s_by_tag(ptor, 'notice-message').then(function(msgs){
    //             expect(msgs[0].isDisplayed()).toEqual(true);
    //         })
    //     })
    // })
}

function paste_module(ptor){
    o_c.open_content(ptor)
    element(by.id('paste')).click()
    // locator.by_repeater(ptor, 'module in modules').then(function(mods){
    //     ptor.actions().mouseMove(mods[0]).perform();
    //     ptor.actions().mouseMove({x: 5, y: 25}).perform();
    //     ptor.actions().click(protractor.Button.RIGHT).perform();
    //     locator.s_by_classname(ptor, 'dropdown-menu').then(function(menu){
    //         menu[0].findElement(protractor.By.partialLinkText("Paste")).click();
    //         o_c.feedback(ptor, 'Module was successfully created');
    //         locator.s_by_tag(ptor, 'notice-message').then(function(msgs){
    //             expect(msgs[0].isDisplayed()).toEqual(false);
    //         })
    //     })
    // })
}

function check_paste_visible(item_name){
    o_c.open_content(ptor)
    expect(element(by.id('paste')).isDisplayed()).toBe(true)
    expect(element(by.id('paste')).element(by.className('description')).getText()).toEqual(item_name)
}

// function share_module(ptor, mo_no, share_with){
//     locator.by_repeater(ptor, 'module in modules').then(function(mods){
//         ptor.actions().mouseMove(mods[mo_no-1]).perform();
//         ptor.actions().mouseMove({x: 5, y: 5}).perform();
//         ptor.actions().click(protractor.Button.RIGHT).perform();
//         locator.s_by_classname(ptor, 'dropdown-menu').then(function(menu){
//             menu[0].findElement(protractor.By.partialLinkText("Share")).click().then(function(){
//                 locator.s_by_tag(ptor, 'form').then(function(f){
//                     f[4].findElements(protractor.By.tagName('input')).then(function(ins){
//                         ins[0].sendKeys(share_with);
//                         ins[1].click().then(function(){
//                             o_c.feedback(ptor, 'Data was successfully shared with')
//                         })
//                     })
//                 })
//             })
//         })
//     })
// }

function put_shared_in_course(ptor, item_no, course_no){
    var item = element(by.repeater('module in item.modules').row(item_no-1))
    var courses= item.element(by.model('selected_course'))
    var add = item.element(by.buttonText('Add'))

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