var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module')

var ptor = protractor.getInstance();
var params = ptor.params
ptor.driver.manage().window().maximize();

xdescribe("answer normal survey correctly", function(){

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

    it('should add a normal survey', function(){
        o_c.open_course_list(ptor);
        o_c.open_course(ptor, 1);
        o_c.open_content_editor(ptor);
        teacher.add_module(ptor);
        ptor.sleep(3000)
        teacher.add_survey(ptor)
    })

    it('should add a FIRST header', function(){
        teacher.add_survey_header(ptor, 'first header')
    })
    it('should add a MCQ question', function(){
        teacher.add_survey_question_mcq(ptor, 'mcq question', 2)
    })
    it('should add a SECOND header', function(){
        teacher.add_survey_header(ptor, 'second header')
    })
    it('should add an OCQ question', function(){
        teacher.add_survey_question_ocq(ptor, 'ocq question', 2, 1)
    })
    it('should add a FREE question', function(){
        teacher.add_survey_question_free(ptor, 'free question')
    })

    it('should save the survey', function(){
        teacher.save_survey(ptor, o_c.feedback)
    })

    it('should go to student', function(){
        o_c.to_student(ptor);
        o_c.open_course_list(ptor)
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

    it('should save',function(){
        student.save_survey(ptor);
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


describe('add required survey',function(){

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

    it('should add a normal survey', function(){
        o_c.open_course_list(ptor);
        o_c.open_course(ptor, 1);
        o_c.open_content_editor(ptor);
        teacher.add_module(ptor);
        ptor.sleep(3000)
        teacher.add_survey(ptor)
    })

    it('should rename the survey', function(){
        teacher.rename_item(ptor, 'New Required Survey', o_c.feedback)
    })
    it('should make the quiz required', function(){
        teacher.make_survey_required(ptor, o_c.feedback)
    })

    it('should add a FIRST header', function(){
        teacher.add_survey_header(ptor, 'first header')
    })
    it('should add a MCQ question', function(){
        teacher.add_survey_question_mcq(ptor, 'mcq question', 2)
    })
    it('should add a SECOND header', function(){
        teacher.add_survey_header(ptor, 'second header')
    })
    it('should add an OCQ question', function(){
        teacher.add_survey_question_ocq(ptor, 'ocq question', 2)
    })
    it('should add a FREE question', function(){
        teacher.add_survey_question_free(ptor, 'free question')
    })

    it('should save the survey', function(){
        teacher.save_survey(ptor, o_c.feedback)
    })

    it('should go to student', function(){
        o_c.to_student(ptor);
        o_c.open_course_list(ptor)
        o_c.open_course(ptor, 1);
        o_c.open_lectures(ptor);
    })

    it('should check that survey is required', function(){
        check_survey_required(ptor)
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

    it('should save',function(){
        student.save_survey(ptor);
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


/////////////////////////////////////////////////////////////////

function check_survey_required(ptor){
    o_c.press_content_navigator(ptor)
    element(by.repeater('module in modules').row(0)).click()
    var quiz = element(by.repeater('item in module.items').row(0)) 
    expect(quiz.getText()).toContain('New Required Survey')
    expect(quiz.element(by.className('alert')).getText()).toEqual('Required')
    o_c.press_content_navigator(ptor)
}