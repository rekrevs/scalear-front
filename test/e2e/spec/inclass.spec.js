var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module');
var quiz_ov = require('./lib/quizzes_over_video');
var lecture_middle = require('./lib/lecture_quizzes_management');
var youtube = require('./lib/youtube');
var disc = require('./lib/discussion');

var ptor = protractor.getInstance();
var params = ptor.params
ptor.driver.manage().window().maximize();



describe("1", function () {

    it('should sign in as teacher', function () {
        o_c.sign_in(ptor, params.teacher_mail, params.password, o_c.feedback);
    })

    it('should create_course', function () {
        teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites, o_c.feedback);
    })

    //test
    it('should open course and make some data', function () {
        teacher.add_module(ptor, o_c.feedback);
        teacher.open_module(ptor, 1);
        teacher.create_lecture(ptor, "lec", "https://www.youtube.com/watch?v=SKqBmAHwSkg#t=89", o_c.feedback);
        
        ptor.navigate().refresh();
        
        youtube.seek(ptor, 30);
        quiz_ov.create_mcq_quiz(ptor, o_c.feedback);
        lecture_middle.rename_quiz(ptor, 1, 'MCQ QUIZ');
        o_c.scroll_to_top(ptor);
        quiz_ov.make_mcq_questions(ptor, 50, 50, 50, 100, 50, 150, o_c.feedback);
        lecture_middle.exit_quiz(ptor, o_c.feedback);
        
        youtube.seek(ptor, 50);
        quiz_ov.create_ocq_quiz(ptor, o_c.feedback);
        lecture_middle.rename_quiz(ptor, 3, 'OCQ QUIZ');
        o_c.scroll_to_top(ptor);
        quiz_ov.make_ocq_questions(ptor, 50, 50, 50, 100, 50, 150, o_c.feedback);
        lecture_middle.exit_quiz(ptor, o_c.feedback);

        youtube.seek(ptor, 80);
        quiz_ov.create_drag_quiz(ptor, o_c.feedback)
        lecture_middle.rename_quiz(ptor, 5, 'DRAG QUIZ')
        o_c.scroll_to_top(ptor)
        quiz_ov.make_drag_questions(ptor, 50, 50, 50, 100, 50, 150, o_c.feedback)
        lecture_middle.exit_quiz(ptor, o_c.feedback);
    })

    it('should mark quizzes to be in class', function () {
        o_c.open_tray(ptor);
        o_c.open_progress_page(ptor);
        student.open_module_number(ptor, 1);
        teacher.check_inclass(ptor, 1);
        teacher.check_inclass(ptor, 2);
        teacher.check_inclass(ptor, 3);
    })
    
    it('should go to inclass', function () {
        o_c.open_tray(ptor);
        o_c.open_inclass(ptor);
        student.open_module_number(ptor, 1);
        check_time_estimate(ptor, 9);
        press_display(ptor);
    })
    
    it('should check for titles', function () {
        check_current_q(ptor, "MCQ QUIZ");
        press_forward(ptor);
        check_current_q(ptor, "OCQ QUIZ");
        press_forward(ptor);
        check_current_q(ptor, "DRAG QUIZ");
        press_back(ptor);
        check_current_q(ptor, "OCQ QUIZ");
        press_back(ptor);
        check_current_q(ptor, "MCQ QUIZ");
    })
    
    it('should hide and un hide question block', function () {
        press_hide(ptor);
        press_forward(ptor);
        press_forward(ptor);
        ptor.sleep(3000);
        press_unhide(ptor);
        check_current_q(ptor, "DRAG QUIZ");
    })
    
    it('should toggle the question block in-class', function () {
        press_over(ptor);
        press_under(ptor);
    })
    it('should exit in-class', function () {
        press_exit(ptor);
    })
    
    it('should clear the course for deletion', function(){
        o_c.open_tray(ptor);
        o_c.open_course_editor(ptor);
        
        teacher.open_module(ptor, 1);
        teacher.delete_item_by_number(ptor, 1, 1, o_c.feedback);

        teacher.delete_empty_module(ptor, 1, o_c.feedback);
    })
    
    it('should delete course', function () {
        //should choose one of home() or home_teacher() 
        //depending on the current state(student or teacher)
        o_c.home_teacher(ptor);
        teacher.delete_course(ptor, o_c.feedback);
    })
})

describe("2", function () {

    it('should sign in as teacher', function () {
        o_c.sign_in(ptor, params.teacher_mail, params.password, o_c.feedback);
    })

    it('should create_course', function () {
        teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites, o_c.feedback);
    })
    
    it('should get the enrollment key and enroll student', function(){
        teacher.get_key_and_enroll(ptor);
    })
    //test
    it('should open course and make some data', function () {
        o_c.open_course_whole(ptor);
        
        teacher.add_module(ptor, o_c.feedback);
        teacher.open_module(ptor, 1);
        teacher.create_lecture(ptor, "lec", "https://www.youtube.com/watch?v=SKqBmAHwSkg#t=89", o_c.feedback);
    })

    it('should go to student and ask questions', function () {
        o_c.to_student(ptor);
        o_c.open_course_whole(ptor);
        o_c.open_tray(ptor);
        o_c.open_lectures(ptor);
        
        youtube.seek(ptor, 30);
        disc.ask_public_question(ptor, 'q1');
        
        youtube.seek(ptor, 50);
        disc.ask_public_question(ptor, 'q2');
        disc.ask_public_question(ptor, 'q3');
        disc.ask_public_question(ptor, 'q4');
    })
    it('should mark questions to be in class', function () {
        o_c.to_teacher(ptor);
        o_c.open_course_whole(ptor);
        
        o_c.open_tray(ptor);
        o_c.open_progress_page(ptor);
        student.open_module_number(ptor, 1);
        teacher.check_inclass(ptor, 1);
        teacher.check_inclass_in_item(ptor, 2, 1); 
        teacher.check_inclass_in_item(ptor, 2, 2);
        teacher.check_inclass_in_item(ptor, 2, 3);
    })

    it('should go to inclass', function () {
        o_c.open_tray(ptor);
        o_c.open_inclass(ptor);
        student.open_module_number(ptor, 1);
        check_time_estimate(ptor, 8);
        press_display(ptor);
    })

    it('should check for titles', function () {
        check_current_question(ptor, "q1");
        press_forward(ptor);
        check_current_question(ptor, "q2");
        press_back(ptor);
        check_current_question(ptor, "q1");
    })

    it('should hide and un hide question block', function () {
        press_hide_multi(ptor);
        press_forward(ptor);
        ptor.sleep(3000);
        press_unhide_multi(ptor);
        check_current_question(ptor, "q2");
    })
    
    it('should exit in-class', function () {
        press_exit(ptor);
    })

    it('should clear the course for deletion', function(){
        o_c.open_tray(ptor);
        o_c.open_course_editor(ptor);

        teacher.open_module(ptor, 1);
        teacher.delete_item_by_number(ptor, 1, 1, o_c.feedback);

        teacher.delete_empty_module(ptor, 1, o_c.feedback);
    })

    it('should delete course', function () {
        //should choose one of home() or home_teacher() 
        //depending on the current state(student or teacher)
        o_c.home_teacher(ptor);
        teacher.delete_course(ptor, o_c.feedback);
    })
})
/////////////////////////////////////////////////////////
//				test specific functions
/////////////////////////////////////////////////////////

function check_time_estimate(ptor, t){
    locator.by_classname(ptor, 'time_estimate').then(function(time_block){
        time_block.findElement(protractor.By.tagName('b')).then(function(time){
            expect(time.getText()).toContain(t);
        })
    })
}

function press_display(ptor){
    locator.by_classname(ptor, 'btn-xlarge').click().then(function(){
        expect(locator.by_classname(ptor, 'inclass_sceen').isDisplayed()).toEqual(true);
    })
}

function check_current_q(ptor, text){
    locator.s_by_classname(ptor, 'original_question').then(function(qu){
        expect(qu[0].getText()).toContain(text);
    })
}

function press_forward(ptor){
    locator.by_classname(ptor, 'icon-forward').click();
}

function press_back(ptor){
    locator.by_classname(ptor, 'icon-backward').click();
}

function press_exit(ptor){
    locator.by_classname(ptor, 'exit_btn').click().then(function(qu){
        expect(locator.by_classname(ptor, 'btn-xlarge').isDisplayed()).toEqual(true);
    })
}

function press_hide(ptor){
    locator.s_by_classname(ptor, 'big_font_button').then(function(bf){
        bf[9].click().then(function(){
            locator.s_by_classname(ptor, 'question_block').then(function(qb){
                expect(qb[0].isDisplayed()).toEqual(false);
            })
        })
    })
}

function press_unhide(ptor){
    locator.s_by_classname(ptor, 'big_font_button').then(function(bf){
        bf[9].click().then(function(){
            locator.s_by_classname(ptor, 'question_block').then(function(qb){
                expect(qb[0].isDisplayed()).toEqual(true);
            })
        })
    })
}

function press_over(ptor){
    locator.by_classname(ptor, 'icon-zoom-in').click().then(function(){
        locator.by_classname(ptor, 'zoom_chart').then(function(qb){
            expect(qb.isDisplayed()).toEqual(true);
        })
    })
}

function press_under(ptor){
    locator.by_classname(ptor, 'icon-zoom-out').click().then(function(){
        locator.s_by_classname(ptor, 'question_block').then(function(qb){
            expect(qb[0].isDisplayed()).toEqual(true);
        })
    })
}   

function check_current_question(ptor, text){
    locator.s_by_classname(ptor, 'original_question').then(function(qu){
        expect(qu[1].getText()).toContain(text);
    })
}

function press_hide_multi(ptor){
    locator.s_by_classname(ptor, 'big_font_button').then(function(bf){
        bf[9].click();
    })
}

function press_unhide_multi(ptor){
    locator.s_by_classname(ptor, 'big_font_button').then(function(bf){
        bf[9].click();
    })
}