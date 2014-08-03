var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module')

var ptor = protractor.getInstance();
var params = ptor.params
ptor.driver.manage().window().maximize();

describe("answer normal quiz correctly", function(){

    it('should sign in as teacher', function(){
        o_c.press_login(ptor)
        o_c.sign_in(ptor, params.teacher_mail, params.password, o_c.feedback);
    })

    it('should create_course', function(){
        teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites, o_c.feedback);
    })

    it('should get the enrollment key and enroll student', function(){
        teacher.get_key_and_enroll(ptor);
    })

    it('should add a normal quiz', function(){
        o_c.open_course_list(ptor);
        o_c.open_course(ptor, 1);
        o_c.open_content_editor(ptor);
        teacher.add_module(ptor);
        ptor.sleep(3000)
        teacher.add_quiz(ptor)
    })

    it('should add a FIRST header', function(){
        teacher.add_quiz_header(ptor, 'first header')
    })
    it('should add a MCQ question', function(){
        teacher.add_quiz_question_mcq(ptor, 'mcq question', 2, [1, 2])
    })
    it('should add a SECOND header', function(){
        teacher.add_quiz_header(ptor, 'second header')
    })
    it('should add an OCQ question', function(){
        teacher.add_quiz_question_ocq(ptor, 'ocq question', 2, 1)
    })
    it('should add a FREE question', function(){
        teacher.add_quiz_question_free(ptor, 'free question')
    })

    it('should add a MATCH question', function(){
        teacher.add_quiz_question_free(ptor, 'match question', 'match answer')
    })
    it('should add a DRAG question', function(){
        teacher.add_quiz_question_drag(ptor, 'drag question', 2)
    })
    it('should save the quiz', function(){
        teacher.save_quiz(ptor, o_c.feedback)
    })

    it('should go to student', function(){
        o_c.to_student(ptor);
        o_c.open_course_list_student(ptor)
        o_c.open_course(ptor, 1);
        o_c.open_lectures(ptor);
    })
    it('should answer mcq incorrect', function(){
        student.mcq_answer(ptor, 2, 1);
        student.mcq_answer(ptor, 2, 2);
    })

    it('should answer ocq correct', function(){
        student.ocq_answer(ptor, 4, 1);
    })

    it('should answer free question', function(){
        student.free_match_answer(ptor, 5, 'free answer')
    })

    it('should answer match question', function(){
        student.free_match_answer(ptor, 6, 'match answer')
    })	

    it('should answer drag correct', function(){
        ptor.sleep(3000);
        student.drag_answer(ptor, 7);
        ptor.sleep(3000);
    })

    it('should submit',function(){
        student.submit_normal_quiz(ptor);
        correct_no(ptor, 4);
        under_review_no(1)
    })
    
    it('should delete course', function(){
        o_c.to_teacher(ptor);
        o_c.open_course_list(ptor);
        o_c.open_course(ptor, 1);
        o_c.press_content_navigator(ptor)
        teacher.open_module(ptor, 1);
        teacher.delete_item_by_number(ptor, 1, 1, o_c.feedback);
        teacher.delete_empty_module(ptor, 1, o_c.feedback)
        o_c.open_course_list(ptor);
        teacher.delete_course(ptor, 1);
        o_c.logout(ptor, o_c.feedback);
    })
})

describe("answer normal quiz incorrectly", function(){

    it('should sign in as teacher', function(){
        o_c.press_login(ptor)
        o_c.sign_in(ptor, params.teacher_mail, params.password, o_c.feedback);
    })

    it('should create_course', function(){
        teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites, o_c.feedback);
    })

    it('should get the enrollment key and enroll student', function(){
        teacher.get_key_and_enroll(ptor);
    })

    it('should add a normal quiz', function(){
        o_c.open_course_list(ptor);
        o_c.open_course(ptor, 1);
        o_c.open_content_editor(ptor);
        teacher.add_module(ptor);
        ptor.sleep(3000)
        teacher.add_quiz(ptor)
    })

    it('should add a FIRST header', function(){
        teacher.add_quiz_header(ptor, 'first header')
    })
    it('should add a MCQ question', function(){
        teacher.add_quiz_question_mcq(ptor, 'mcq question', 2, [1, 2])
    })
    it('should add a SECOND header', function(){
        teacher.add_quiz_header(ptor, 'second header')
    })
    it('should add an OCQ question', function(){
        teacher.add_quiz_question_ocq(ptor, 'ocq question', 2, 1)
    })
    it('should add a FREE question', function(){
        teacher.add_quiz_question_free(ptor, 'free question')
    })

    it('should add a MATCH question', function(){
        teacher.add_quiz_question_free(ptor, 'match question', 'match answer')
    })
    it('should add a DRAG question', function(){
        teacher.add_quiz_question_drag(ptor, 'drag question', 2)
    })
    it('should save the quiz', function(){
        teacher.save_quiz(ptor, o_c.feedback)
    })

    it('should go to student', function(){
        o_c.to_student(ptor);
        o_c.open_course_list_student(ptor)
        o_c.open_course(ptor, 1);
        o_c.open_lectures(ptor);
    })
    it('should answer mcq incorrect', function(){
        student.mcq_answer(ptor, 2, 2);
        student.mcq_answer(ptor, 2, 3);
    })

    it('should answer ocq correct', function(){
        student.ocq_answer(ptor, 4, 2);
    })

    it('should answer free question', function(){
        student.free_match_answer(ptor, 5, 'free answer')
    })

    it('should answer match question', function(){
        student.free_match_answer(ptor, 6, 'mat answer')
    })	

    it('should answer drag correct', function(){
        ptor.sleep(3000);
    })

    it('should submit',function(){
        student.submit_normal_quiz(ptor);
        under_review_no(1)
    })
    
    it('should delete course', function(){
        o_c.to_teacher(ptor);
        o_c.open_course_list(ptor);
        o_c.open_course(ptor, 1);
        o_c.press_content_navigator(ptor)
        teacher.open_module(ptor, 1);
        teacher.delete_item_by_number(ptor, 1, 1, o_c.feedback);
        teacher.delete_empty_module(ptor, 1, o_c.feedback)
        o_c.open_course_list(ptor);
        teacher.delete_course(ptor, 1);
        o_c.logout(ptor, o_c.feedback);
    })
})

describe('add required quiz',function(){
    it('should sign in as teacher', function(){
        o_c.press_login(ptor)
        o_c.sign_in(ptor, params.teacher_mail, params.password, o_c.feedback);
    })

    it('should create_course', function(){
        teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites, o_c.feedback);
    })

    it('should get the enrollment key and enroll student', function(){
        teacher.get_key_and_enroll(ptor);
    })

    it('should add a normal quiz', function(){
        o_c.open_course_list(ptor);
        o_c.open_course(ptor, 1);
        o_c.open_content_editor(ptor);
        teacher.add_module(ptor);
        ptor.sleep(3000)
        teacher.add_quiz(ptor)
    })

    it('should rename the quiz', function(){
        teacher.rename_item(ptor, 'New Required Quiz', o_c.feedback)
    })
    it('should make the quiz required', function(){
        teacher.make_quiz_required(ptor, o_c.feedback)
    })

    it('should add a FIRST header', function(){
        teacher.add_quiz_header(ptor, 'first header')
    })
    it('should add a MCQ question', function(){
        teacher.add_quiz_question_mcq(ptor, 'mcq question', 2, [1, 2])
    })
    it('should add a SECOND header', function(){
        teacher.add_quiz_header(ptor, 'second header')
    })
    it('should add an OCQ question', function(){
        teacher.add_quiz_question_ocq(ptor, 'ocq question', 2, 1)
    })
    it('should add a FREE question', function(){
        teacher.add_quiz_question_free(ptor, 'free question')
    })

    it('should add a MATCH question', function(){
        teacher.add_quiz_question_free(ptor, 'match question', 'match answer')
    })
    it('should add a DRAG question', function(){
        teacher.add_quiz_question_drag(ptor, 'drag question', 2)
    })
    it('should save the quiz', function(){
        teacher.save_quiz(ptor, o_c.feedback)
    })

    it('should go to student', function(){
        o_c.to_student(ptor);
        o_c.open_course_list_student(ptor)
        o_c.open_course(ptor, 1);
        o_c.open_lectures(ptor);
    })

    it('should check that quiz is required', function(){
        check_quiz_required(ptor)
    })

    it('should check number of attempts',function(){
        check_number_attempts(ptor, 0,1)
    })

    it('check submit button enabled',function(){
        check_submit_enabled(ptor)
    })

    it('should answer mcq incorrect', function(){
        student.mcq_answer(ptor, 2, 1);
        student.mcq_answer(ptor, 2, 2);
    })

    it('should answer ocq correct', function(){
        student.ocq_answer(ptor, 4, 1);
    })

    it('should answer free question', function(){
        student.free_match_answer(ptor, 5, 'free answer')
    })

    it('should answer match question', function(){
        student.free_match_answer(ptor, 6, 'match answer')
    })  

    it('should answer drag correct', function(){
        ptor.sleep(3000);
        student.drag_answer(ptor, 7);
        ptor.sleep(3000);
    })

    it('should submit and check correct and incorrect count',function(){
        student.submit_normal_quiz(ptor);
        correct_no(ptor, 4);
        under_review_no(1)
    })

    it('should check quiz status after submit',function(){
        no_attempt(ptor, 1)
        check_alertbox_msg(ptor)
        check_submit_disabled(ptor)
    })

    
    it('should delete course', function(){
        o_c.to_teacher(ptor);
        o_c.open_course_list(ptor);
        o_c.open_course(ptor, 1);
        o_c.press_content_navigator(ptor)
        teacher.open_module(ptor, 1);
        teacher.delete_item_by_number(ptor, 1, 1, o_c.feedback);
        teacher.delete_empty_module(ptor, 1, o_c.feedback)
        o_c.open_course_list(ptor);
        teacher.delete_course(ptor, 1);
        o_c.logout(ptor, o_c.feedback);
    })
})

xdescribe('',function(){
    it('should add a normal REQUIRED quiz', function(){
        teacher.add_quiz(ptor, 1, o_c.feedback);
    })
    //------
    // it('should open the first module', function(){
    // 	teacher.open_module(ptor, 1)
    // })
    //------
    it('should open the quiz', function(){
        teacher.open_item(ptor, 1, 5)
    })
    it('should rename the quiz', function(){
        teacher.rename_item(ptor, 'New Required Quiz', o_c.feedback)
    })
    it('should make the quiz required', function(){
        teacher.make_quiz_required(ptor, o_c.feedback)
    })

    it('should add a FIRST header', function(){
        teacher.add_quiz_header(ptor, 'first header')
    })
    it('should add a MCQ question', function(){
        teacher.add_quiz_question_mcq(ptor, 'mcq question', 2, [1, 2])
    })
    it('should add a SECOND header', function(){
        teacher.add_quiz_header(ptor, 'second header')
    })
    it('should add an OCQ question', function(){
        teacher.add_quiz_question_ocq(ptor, 'ocq question', 2, 1)
    })
    it('should add a FREE question', function(){
        teacher.add_quiz_question_free(ptor, 'free question', false)
    })

    it('should add a MATCH question', function(){
        teacher.add_quiz_question_free(ptor, 'match question', true, 'match answer')
    })
    it('should add a DRAG question', function(){
        teacher.add_quiz_question_drag(ptor, 'drag question', 2)
    })
    it('should save the quiz', function(){
        teacher.save_quiz(ptor, o_c.feedback)
    })



    it('should scroll to the top', function(){
        o_c.scroll_to_top(ptor)
    })
    it('should add a normal survey', function(){
        teacher.add_survey(ptor, 1, o_c.feedback)
    })

    it('should open the survey', function(){
        teacher.open_item(ptor, 1, 6)
    })

    it('should add a FIRST header', function(){
        teacher.add_quiz_header(ptor, 'first header')
    })
    it('should add a MCQ question for the SURVEY', function(){
        teacher.add_survey_question_mcq(ptor, 'mcq question', 2)
    })
    it('should add a SECOND header', function(){
        teacher.add_quiz_header(ptor, 'second header')
    })
    it('should add an OCQ question for the SURVEY', function(){
        teacher.add_survey_question_ocq(ptor, 'ocq question', 2)
    })
    it('should add a FREE question for the SURVEY', function(){
        teacher.add_survey_question_free(ptor, 'free question')
    })
    it('should scroll to bottom', function(){
        o_c.scroll_to_bottom(ptor)
    })
    it('should save the survey', function(){
        teacher.save_survey(ptor, o_c.feedback)
    })

    it('should scroll to the top', function(){
        o_c.scroll_to_top(ptor)
    })
    it('should create a new module', function(){
        teacher.add_module(ptor, o_c.feedback);
    })
    it('should open the created module', function(){
        teacher.open_module(ptor, 2)
    })
    it('should rename the module created', function(){
        teacher.rename_module(ptor, 'New Module 2')
    })

})

/////////////////////////////////////////////////////////////////
function correct_no(ptor, no){
    expect(element.all(by.className('color-green')).count()).toEqual(no)
}

function under_review_no(no){
    expect(element.all(by.className('color-gray')).count()).toEqual(no)
}

function partial_no(no){
    expect(element.all(by.className('color-orange')).count()).toEqual(no)
}

function incorrect_no(ptor, no){
    expect(element.all(by.className('color-red')).count()).toEqual(no)
}
function check_quiz_required(ptor){
    o_c.press_content_navigator(ptor)
    element(by.repeater('module in modules ').row(0)).click()
    var quiz = element(by.repeater('item in module.items').row(0)) 
    expect(quiz.getText()).toContain('New Required Quiz')
    expect(quiz.element(by.className('alert')).getText()).toEqual('Required')
    o_c.press_content_navigator(ptor)
}

function check_number_attempts(ptor, attempts, retries){
    expect(element(by.binding('status.attempts')).getText()).toContain(attempts+"/"+retries)
}

function no_attempt(ptor, retries){
    expect(element(by.binding('quiz.retries')).getText()).toContain('Used up all '+retries+' attempts')
}

function check_alertbox_msg(ptor){
    expect(element(by.className('warning')).getText()).toContain("You've submitted the Quiz and have no more attempts left")
}

function check_submit_disabled(ptor){
    expect(element(by.buttonText('Submit')).isEnabled()).toBe(false)
}
function check_submit_enabled(ptor){
    expect(element(by.buttonText('Submit')).isEnabled()).toBe(true)
}