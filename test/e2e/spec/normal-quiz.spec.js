var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module')

var ptor = protractor.getInstance();
var params = ptor.params
ptor.driver.manage().window().maximize();

// describe('add required quiz and answer it',function(){
//     it('should sign in as teacher', function(){
//         o_c.press_login(ptor)
//         o_c.sign_in(ptor, params.teacher1.email, params.password);
//     })

//     it('should create_course', function(){
//         teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
//     })

//     it('should add a normal quiz', function(){
//         // o_c.sign_in(ptor, params.teacher1.email, params.password);
//         // o_c.open_course_list(ptor);
//         // o_c.open_course(ptor, 1);
//         // o_c.open_content_editor(ptor);
//         teacher.add_module(ptor);
//         // ptor.sleep(3000)
//         teacher.add_quiz(ptor)
//     })

//     it('should rename the quiz', function(){
//         teacher.rename_item(ptor, 'New Required Quiz')
//     })

//     it('should add a FIRST header', function(){
//         teacher.add_quiz_header(ptor, 'first header')
//     })
//     it('should add a MCQ question', function(){
//         teacher.add_quiz_question_mcq(ptor, 'mcq question', 2, [1, 2])
//     })
//     it('should add a SECOND header', function(){
//         teacher.add_quiz_header(ptor, 'second header')
//     })
//     it('should add an OCQ question', function(){
//         teacher.add_quiz_question_ocq(ptor, 'ocq question', 2, 1)
//     })
//     it('should add a FREE question', function(){
//         teacher.add_quiz_question_free(ptor, 'free question')
//     })

//     it('should add a MATCH question', function(){
//         teacher.add_quiz_question_free(ptor, 'match question', 'match answer')
//     })
//     it('should add a DRAG question', function(){
//         teacher.add_quiz_question_drag(ptor, 'drag question', 2)
//     })

//     it('should reorder drag question', function(){
//         teacher.add_quiz_question_drag(ptor, 'drag question', 2)
//         teacher.reorder_drag_answer(ptor)
//     })
//     it('should save the quiz', function(){
//         teacher.save_quiz(ptor)
//     })

//     it('should get the enrollment key and enroll student', function(){
//         teacher.get_key_and_enroll(ptor, params.student1.email, params.password);
//     })

//     it('should go to student', function(){
//         // o_c.to_student(ptor);
//         o_c.open_course_list(ptor)
//         o_c.open_course(ptor, 1);
//         // o_c.open_lectures(ptor);
//     })

//     it('should check quiz name', function(){
//         check_quiz_name(ptor, 'New Required Quiz')
//     })

//     it('should check number of attempts',function(){
//         check_number_attempts(ptor, 0,1)
//     })

//     it('check submit button enabled',function(){
//         check_submit_enabled(ptor)
//     })

//     it('should answer mcq incorrect', function(){
//         // student.mcq_answer(ptor, 2, 1);
//         student.mcq_answer(ptor, 2, 2);
//     })

//     it('should answer ocq correct', function(){
//         student.ocq_answer(ptor, 4, 1);
//     })

//     it('should answer free question', function(){
//         student.free_match_answer(ptor, 5, 'free answer')
//     })

//     it('should answer match question', function(){
//         student.free_match_answer(ptor, 6, 'match answer')
//     })

//     it('should answer drag correct', function(){
//         ptor.sleep(3000);
//         student.drag_answer(ptor, 7);
//         ptor.sleep(3000);
//     })

//     it('should submit and check correct and incorrect count',function(){
//         student.submit_normal_quiz(ptor);
//         incorrect_no(1)
//         correct_no(3);
//         under_review_no(1)
//     })

//     it('should check quiz status after submit',function(){
//         o_c.scroll_to_top(ptor)
//         no_attempt(ptor, 1)
//         check_alertbox_msg(ptor)
//         check_submit_disabled(ptor)
//     })

//     it('should delete course', function(){
//         o_c.to_teacher(ptor);
//         o_c.open_course_list(ptor);
//         o_c.open_course(ptor, 1);
//         // o_c.press_content_navigator(ptor)
//         teacher.open_module(ptor, 1);
//         teacher.delete_item_by_number(ptor, 1, 1);
//         teacher.delete_empty_module(ptor, 1)
//         o_c.open_course_list(ptor);
//         teacher.delete_course(ptor, 1);
//         o_c.logout(ptor);
//     })
// })

// describe("add optional quiz and answer it incorrect with multiple attempts", function(){

//     it('should sign in as teacher', function(){
//         // o_c.press_login(ptor)
//         o_c.sign_in(ptor, params.teacher1.email, params.password);
//     })

//     it('should create_course', function(){
//         teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
//     })

//     it('should add a normal quiz', function(){
//         // o_c.sign_in(ptor, params.teacher1.email, params.password);
//         // o_c.open_course_list(ptor);
//         // o_c.open_course(ptor, 1);
//         // o_c.open_content_editor(ptor);
//         teacher.add_module(ptor);
//         // ptor.sleep(3000)
//         teacher.add_quiz(ptor)
//     })

//     it('make quiz not required', function(){
//         teacher.change_quiz_required()
//     })

//     it('increase attempts number', function(){
//         teacher.change_attempt_num(1)
//     })

//     it('should add a FIRST header', function(){
//         teacher.add_quiz_header(ptor, 'first header')
//     })
//     it('should add a MCQ question', function(){
//         teacher.add_quiz_question_mcq(ptor, 'mcq question', 2, [1, 2])
//     })
//     it('should add a SECOND header', function(){
//         teacher.add_quiz_header(ptor, 'second header')
//     })
//     it('should add an OCQ question', function(){
//         teacher.add_quiz_question_ocq(ptor, 'ocq question', 2, 1)
//     })
//     it('should add a FREE question', function(){
//         teacher.add_quiz_question_free(ptor, 'free question')
//     })

//     it('should add a MATCH question', function(){
//         teacher.add_quiz_question_free(ptor, 'match question', 'match answer')
//     })
//     it('should add a DRAG question', function(){
//         teacher.add_quiz_question_drag(ptor, 'drag question', 2)
//     })
//     it('should save the quiz', function(){
//         teacher.save_quiz(ptor)
//     })

//     it('should get the enrollment key and enroll student', function(){
//         teacher.get_key_and_enroll(ptor, params.student1.email, params.password);
//     })

//     it('should go to student', function(){
//         // o_c.to_student(ptor);
//         o_c.open_course_list(ptor)
//         o_c.open_course(ptor, 1);
//         // o_c.open_lectures(ptor);
//     })

//     it('should check number of attempts',function(){
//         check_number_attempts(ptor, 0,2)
//     })

//     it('should check optional tag displayed',function(){
//         check_optional_tag_exist()
//     })

//     it('check submit button enabled',function(){
//         check_submit_enabled(ptor)
//     })

//     it('should answer mcq incorrect', function(){
//         student.mcq_answer(ptor, 2, 2);
//         student.mcq_answer(ptor, 2, 3);
//     })

//     it('should answer ocq correct', function(){
//         student.ocq_answer(ptor, 4, 2);
//     })

//     it('should answer free question', function(){
//         student.free_match_answer(ptor, 5, 'free answer')
//     })

//     it('should answer match question', function(){
//         student.free_match_answer(ptor, 6, 'mat answer')
//     })

//     // it('should answer drag correct', function(){
//     //     ptor.sleep(2000);
//     // })

//     it('should submit',function(){
//         ptor.sleep(30000)
//         student.submit_normal_quiz(ptor);
//         incorrect_no(4)
//         under_review_no(1)
//     })

//     it('should check quiz status after submit',function(){
//         o_c.scroll_to_top(ptor)
//         // no_attempt(ptor, 1)
//         check_number_attempts(ptor, 1,2)
//         check_submit_enabled(ptor)
//     })

//     it('should answer mcq incorrect', function(){
//         student.mcq_answer(ptor, 2, 1);
//         student.mcq_answer(ptor, 2, 3);
//     })

//     it('should answer ocq correct', function(){
//         student.ocq_answer(ptor, 4, 1);
//     })

//     it('should answer free question', function(){
//         student.free_match_answer(ptor, 5, 'free answer')
//     })

//     it('should answer match question', function(){
//         student.free_match_answer(ptor, 6, 'match answer')
//     })

//     it('should answer drag correct', function(){
//         ptor.sleep(3000);
//         student.drag_answer(ptor, 7);
//         ptor.sleep(3000);
//     })

//     it('should submit and check correct and incorrect count',function(){
//         student.submit_normal_quiz(ptor);
//         incorrect_no(0)
//         correct_no(4);
//         under_review_no(1)
//         no_attempt(ptor, 2)
//         check_submit_disabled(ptor)
//     })

//     // it('should delete course', function(){
//     //     o_c.to_teacher(ptor);
//     //     o_c.open_course_list(ptor);
//     //     o_c.open_course(ptor, 1);
//     //     // o_c.press_content_navigator(ptor)
//     //     teacher.open_module(ptor, 1);
//     //     teacher.delete_item_by_number(ptor, 1, 1);
//     //     teacher.delete_empty_module(ptor, 1)
//     //     o_c.open_course_list(ptor);
//     //     teacher.delete_course(ptor, 1);
//     //     o_c.logout(ptor);
//     // })
// })

describe('add quiz and student saves it',function(){
    it('should sign in as teacher', function(){
        o_c.sign_in(ptor, params.teacher1.email, params.password);
    })

    it('should create_course', function(){
        teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
    })

    it('should add a normal quiz', function(){
        // o_c.sign_in(ptor, params.teacher1.email, params.password);
        // o_c.open_course_list(ptor);
        // o_c.open_course(ptor, 1);
        teacher.add_module(ptor);
        // ptor.sleep(3000)
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
        teacher.save_quiz(ptor)
    })

    it('should get the enrollment key and enroll student', function(){
        teacher.get_key_and_enroll(ptor, params.student1.email, params.password);
    })

    it('should go to student', function(){
        // o_c.to_student(ptor);
        o_c.open_course_list(ptor)
        o_c.open_course(ptor, 1);
        // o_c.open_lectures(ptor);
    })

    it('should check number of attempts',function(){
        check_number_attempts(ptor, 0,1)
    })

    it('check submit button enabled',function(){
        check_submit_enabled(ptor)
    })

    it('should answer mcq incorrect', function(){
        // student.mcq_answer(ptor, 2, 1);
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

    it('should save and check correct and incorrect count',function(){
        student.save_normal_quiz(ptor);
        incorrect_no(0)
        correct_no(0);
        under_review_no(0)
    })

    it('should check number of attempts',function(){
        check_number_attempts(ptor, 0,1)
    })

    it('check submit button enabled',function(){
        check_submit_enabled(ptor)
    })

    it('should refresh',function(){
        ptor.navigate().refresh();
    })

    it('should check student answers',function(){
        student.check_mcq_answer(ptor, 2, 2);
        student.check_ocq_answer(ptor, 4, 1);
        o_c.scroll(ptor, 500)
        student.check_free_match_answer(ptor, 5, 'free answer')
        student.check_free_match_answer(ptor, 6, 'match answer')
        o_c.scroll_to_bottom(ptor)
        student.check_drag_answer(ptor, 7);
    })

    it('should delete course', function(){
        o_c.to_teacher(ptor);
        o_c.open_course_list(ptor);
        o_c.open_course(ptor, 1);
        teacher.open_module(ptor, 1);
        teacher.delete_item_by_number(ptor, 1, 1);
        teacher.delete_empty_module(ptor, 1)
        o_c.open_course_list(ptor);
        teacher.delete_course(ptor, 1);
        o_c.logout(ptor);
    })
})


/////////////////////////////////////////////////////////////////
function correct_no(no){
    expect(element.all(by.className('correct')).count()).toEqual(no)
}

function under_review_no(no){
    expect(element.all(by.className('under_review')).count()).toEqual(no)
}

function partial_no(no){
    expect(element.all(by.className('partial')).count()).toEqual(no)
}

function incorrect_no(no){
    expect(element.all(by.className('incorrect')).count()).toEqual(no)
}
function check_quiz_name(ptor, name){
    o_c.press_content_navigator(ptor)
    element(by.repeater('module in modules ').row(0)).click()
    var quiz = element(by.repeater('item in module.items').row(0))
    expect(quiz.getText()).toContain(name)
    // expect(quiz.element(by.className('alert')).getText()).toEqual('Required')
    o_c.press_content_navigator(ptor)
}

function check_number_attempts(ptor, attempts, retries){
    expect(element(by.binding('status.attempts')).getText()).toContain(attempts+"/"+retries)
}

function no_attempt(ptor, retries){
    expect(element(by.binding('quiz.retries')).getText()).toContain('Used up all '+retries+' attempts')
}

function check_alertbox_msg(ptor){
    expect(element(by.className('warning')).getText()).toContain("You've submitted the quiz and have no more attempts left")
}

function check_submit_disabled(ptor){
    expect(element(by.buttonText('Submit')).isEnabled()).toBe(false)
}
function check_submit_enabled(ptor){
    expect(element(by.buttonText('Submit')).isEnabled()).toBe(true)
}

function check_optional_tag_exist(){
    expect(element(by.className('label')).isDisplayed()).toBe(true)
    expect(element(by.className('label')).getText()).toEqual("Optional")
}
