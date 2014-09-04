var youtube = require('./lib/youtube');
var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module');
var discussions = require('./lib/discussion');


var ptor = protractor.getInstance();
var params = ptor.params;
ptor.driver.manage().window().maximize();

describe('1', function(){
    
    it('should sign in as teacher', function(){
        o_c.press_login(ptor);
        o_c.sign_in(ptor, params.teacher_mail, params.password);
    })

    it('should create_course', function(){
        teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
    })

    it('should get the enrollment key and enroll student', function(){
        teacher.get_key_and_enroll(ptor, params.student_mail, params.password);
    })
    
    it('should add a module and lecture to create quizzes', function(){
        o_c.sign_in(ptor, params.teacher_mail, params.password);
        o_c.open_course_list(ptor);
        o_c.open_course(ptor, 1);
        teacher.add_module(ptor);
        teacher.open_module(ptor, 1);
        teacher.add_lecture(ptor);           
        o_c.press_content_navigator(ptor);
        ptor.sleep(2000)
        teacher.init_lecture(ptor, "lecture 1","https://www.youtube.com/watch?v=SKqBmAHwSkg");
    })

    it('should navigate to student', function(){
        o_c.to_student(ptor);
        o_c.open_course_list(ptor);
        o_c.open_course(ptor, 1);
        // o_c.press_content_navigator(ptor);
        // teacher.open_module(ptor, 1);
        // o_c.press_content_navigator(ptor);
    })

    it('should check confused ',function(){
        youtube.seek(ptor, 50);
        student.press_confused_btn(ptor);
        ptor.sleep(2000);
        check_outline_ele_no(ptor, 1);
    })

    it('should clear the course for deletion', function(){
        o_c.to_teacher(ptor);
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
    
describe("2", function(){

    it('should sign in as teacher', function(){
        // o_c.press_login(ptor);
        o_c.sign_in(ptor, params.teacher_mail, params.password);
    })

    it('should create_course', function(){
        teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
    })

    it('should get the enrollment key and enroll student', function(){
        teacher.get_key_and_enroll(ptor, params.student_mail, params.password);
    })
    
    it('should add a module and lecture to create quizzes', function(){
        o_c.sign_in(ptor, params.teacher_mail, params.password);
        o_c.open_course_list(ptor);
        o_c.open_course(ptor, 1);
        teacher.add_module(ptor);
        teacher.open_module(ptor, 1);
        teacher.add_lecture(ptor);           
        o_c.press_content_navigator(ptor);
        ptor.sleep(2000)
        teacher.init_lecture(ptor, "lecture 1","https://www.youtube.com/watch?v=SKqBmAHwSkg");
    })

    it('should navigate to student', function(){
        o_c.to_student(ptor);
        o_c.open_course_list(ptor);
        o_c.open_course(ptor, 1);
        // o_c.press_content_navigator(ptor);
        // teacher.open_module(ptor, 1);
        // o_c.press_content_navigator(ptor);
        discussions.ask_public_question(ptor, "question 1");
        check_outline_ele_no(ptor, 1);

        discussions.ask_private_question(ptor, "question 2");
        check_outline_ele_no(ptor, 2);
    })

    it('should clear the course for deletion', function(){
        o_c.to_teacher(ptor);
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

describe("3", function(){

    it('should sign in as teacher', function(){
        // o_c.press_login(ptor);
        o_c.sign_in(ptor, params.teacher_mail, params.password);
    })

    it('should create_course', function(){
        teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
    })

    it('should get the enrollment key and enroll student', function(){
        teacher.get_key_and_enroll(ptor, params.student_mail, params.password);
    })
    
    it('should add a module and lecture to create quizzes', function(){
        o_c.sign_in(ptor, params.teacher_mail, params.password);
        o_c.open_course_list(ptor);
        o_c.open_course(ptor, 1);
        teacher.add_module(ptor);
        teacher.open_module(ptor, 1);
        teacher.add_lecture(ptor);           
        o_c.press_content_navigator(ptor);
        ptor.sleep(2000)
        teacher.init_lecture(ptor, "lecture 1","https://www.youtube.com/watch?v=SKqBmAHwSkg");
    })

    it('should open the course to be tested', function(){
        o_c.to_student(ptor);
        o_c.open_course_list(ptor);
        o_c.open_course(ptor, 1);
        // o_c.press_content_navigator(ptor);
        // teacher.open_module(ptor, 1);
        // o_c.press_content_navigator(ptor);
        youtube.seek(ptor, 50);
        discussions.ask_public_question(ptor, "question 1");
        discussions.comment(ptor, 1, "comment 1");
        discussions.comment(ptor, 1, "comment 2");

        discussions.ask_public_question(ptor, "question 2");
        discussions.comment(ptor, 2, "comment 1");
        discussions.comment(ptor, 2, "comment 2");
    })

    it('should clear the course for deletion', function(){
        o_c.to_teacher(ptor);
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

describe("4", function(){
    it('should sign in as teacher', function(){
        // o_c.press_login(ptor);
        o_c.sign_in(ptor, params.teacher_mail, params.password);
    })

    it('should create_course', function(){
        teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
    })

    it('should get the enrollment key and enroll student', function(){
        teacher.get_key_and_enroll(ptor, params.student_mail, params.password);
    })
    
    it('should add a module and lecture to create quizzes', function(){
        o_c.sign_in(ptor, params.teacher_mail, params.password);
        o_c.open_course_list(ptor);
        o_c.open_course(ptor, 1);
        teacher.add_module(ptor);
        teacher.open_module(ptor, 1);
        teacher.add_lecture(ptor);           
        o_c.press_content_navigator(ptor);
        ptor.sleep(2000)
        teacher.init_lecture(ptor, "lecture 1","https://www.youtube.com/watch?v=SKqBmAHwSkg");
    })

    it('should open the course to be tested and create a note', function(){
        o_c.to_student(ptor);
        o_c.open_course_list(ptor);
        o_c.open_course(ptor, 1);
        // o_c.press_content_navigator(ptor);
        // teacher.open_module(ptor, 1);
        // o_c.press_content_navigator(ptor);
        youtube.seek(ptor, 50);
        student.create_note(ptor, 'This is a new note');
        check_outline_ele_no(ptor, 1);
    })

    it('should clear the course for deletion', function(){
        o_c.to_teacher(ptor);
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

function check_confused_no(ptor, con_no){
    locator.by_repeater(ptor, 'element in timeline').then(function(elements){
        expect(elements.length).toEqual(con_no);
    })
}


function check_confused_time(ptor){
    var pw, ph;
    var random_seek_point = 1;
    var confused_time;
    var youtube_time;
    locator.by_classname(ptor, 'progressBar').then(function(progress){
        progress.getSize().then(function(size){
            pw = size.width;
            ph = size.height;
            ptor.actions().mouseMove(progress).perform();
            ptor.actions().mouseMove({x: (random_seek_point*pw)/100, y: 4}).click().perform();
            locator.by_classname(ptor, 'confusedDiv').then(function(btn){
                btn.click().then(function(){
                    locator.by_classname(ptor, 'timer').findElements(protractor.By.className('ng-binding')).then(function(timers){
                        confused_time = timers[0].getText();
                        locator.by_classname(ptor, 'progress-events').then(function(btn2){
                            btn2.click();
                            locator.by_classname(ptor, 'timer').findElements(protractor.By.className('ng-binding')).then(function(timers){
                                youtube_time = timers[0].getText();
                                expect(confused_time).toEqual(youtube_time);
                            })
                        })
                    })
                })
            })
        })
    })
}

function check_confused_location(ptor){
    locator.by_classname(ptor, 'elapsed').then(function(progress_bar){
        progress_bar.getLocation().then(function(location){
            press_confused_btn(ptor);
            progress_bar.getSize().then(function(size){
                locator.by_repeater(ptor, 'element in timeline').then(function(elements){
                    elements[0].getLocation().then(function(loc){
                        expect(location.x+size.width).toEqual(loc.x);
                        expect(location.y).toEqual(loc.y);
                    })
                })
            })
        })
    })
}

function check_outline_ele_no(ptor, no){
    locator.by_repeater(ptor, 'item in timeline[l.id].items').then(function(ele){
        expect(ele.length).toEqual(no);
    })
}

