var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module');
var youtube = require('./lib/youtube');
var discussions = require('./lib/discussion');

var ptor = protractor.getInstance();
var params = ptor.params
ptor.driver.manage().window().maximize();

var screen_name = "student_teacher";
var fname = "s";
var lname = "t";
var univer = "world university";
var biog = "kalam keteeer yege 140 char bs teacher";
var webs = "www.website.com";
var password = 'password';

describe("1", function(){

    it('should add a student then check for statistics', function(){
        o_c.press_login(ptor)
        add_student_then_check(ptor);
    });
})

describe("2", function(){

    it('should add a teacher then check for statistics', function(){
        // o_c.press_login(ptor)
        add_teacher_then_check(ptor);
    });
})

describe("3", function(){

    it('should add a course then check for statistics', function(){
        // o_c.press_login(ptor)
        add_course_then_check(ptor);
    });
})

describe("4", function(){

    it('should add a quiz then check for statistics', function(){
        // o_c.press_login(ptor)
        add_quiz_then_check(ptor);
    });
})

describe("5", function(){

    it('should add a survey then check for statistics', function(){
        // o_c.press_login(ptor)
        add_survey_then_check(ptor);
    });
})

describe("6", function(){

    it('should add a lecture then check for statistics', function(){
        // o_c.press_login(ptor)
        add_lecture_then_check(ptor);
    });
})

describe("7", function(){

    it('should add a question then check for statistics', function(){
        // o_c.press_login(ptor)
        add_question_then_check(ptor);
    });
})

describe("8", function(){

    it('should add a confused then check for statistics', function(){
        // o_c.press_login(ptor)
        add_confused_then_check(ptor);
    });
})

function add_student_then_check(ptor){
    var students_no = 0;
    o_c.sign_in_admin(ptor);
    o_c.open_statistics(ptor);
    element(by.binding('Total_Students')).getText().then(function(text){
        students_no = text;
    })
    o_c.logout(ptor);
    ptor.sleep(2000);
    // var student_email =
    o_c.sign_up_student(ptor, screen_name, fname, lname, 'stu'+Math.floor((Math.random() * 99999999) + 1)+'@email.com', univer, biog, webs, password);
    ptor.sleep(3000);
    o_c.press_login(ptor)
    o_c.sign_in_admin(ptor);
    o_c.open_statistics(ptor);

    element(by.binding('Total_Students')).getText().then(function(text){
        students_no = parseInt(students_no)+1;
        expect(text).toEqual(String(students_no))
    })
    o_c.logout(ptor);
    // o_c.sign_in(ptor, params.teacher1.email, params.password);
}

function add_teacher_then_check(ptor){
    var teachers_no = 0;
    o_c.sign_in_admin(ptor);
    o_c.open_statistics(ptor);
    element(by.binding('Total_Teachers')).getText().then(function(text){
        teachers_no = text;
    })
    o_c.logout(ptor);
    ptor.sleep(2000);
    o_c.sign_up_teacher(ptor, screen_name, fname, lname, 'tea'+Math.floor((Math.random() * 99999999) + 1)+'@batee5.com', univer, biog, webs, password);
    ptor.sleep(3000);
    o_c.press_login(ptor)
    o_c.sign_in_admin(ptor);
    o_c.open_statistics(ptor);
    element(by.binding('Total_Teachers')).getText().then(function(text){
        teachers_no = parseInt(teachers_no)+1;
        expect(text).toEqual(String(teachers_no))
    })
    o_c.logout(ptor);
}


function add_course_then_check(ptor){
    var courses_no = 0;
    o_c.sign_in_admin(ptor);
    o_c.open_statistics(ptor);
    element(by.binding('Total_Courses')).getText().then(function(text){
        courses_no = text;
    })
    o_c.logout(ptor);

    o_c.sign_in(ptor, params.teacher1.email, params.password);
    teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);

    o_c.logout(ptor);
    o_c.sign_in_admin(ptor);

    o_c.open_statistics(ptor);
    element(by.binding('Total_Courses')).getText().then(function(text){
        courses_no = parseInt(courses_no)+1;
        expect(text).toEqual(String(courses_no))
    })
    o_c.logout(ptor);

    o_c.sign_in(ptor, params.teacher1.email, params.password);
    o_c.open_course_list(ptor);
    teacher.delete_course(ptor, 1);
    o_c.logout(ptor);
    o_c.sign_in_admin(ptor)
    o_c.open_statistics(ptor);
    element(by.binding('Total_Courses')).getText().then(function(text){
        courses_no = parseInt(courses_no)-1;
        expect(text).toEqual(String(courses_no))
    })
    o_c.logout(ptor);
}


function add_quiz_then_check(ptor){
    var quizzes_no = 0;
    o_c.sign_in_admin(ptor);
    o_c.open_statistics(ptor);
    element(by.binding('Total_Quizzes')).getText().then(function(text){
        quizzes_no = text;
    })
    o_c.logout(ptor);

    o_c.sign_in(ptor, params.teacher1.email, params.password);
    teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);

    teacher.add_module(ptor);
    ptor.sleep(3000)
    teacher.add_quiz(ptor)
    o_c.logout(ptor);

    o_c.sign_in_admin(ptor);
    o_c.open_statistics(ptor);
    element(by.binding('Total_Quizzes')).getText().then(function(text){
        quizzes_no = parseInt(quizzes_no)+1;
        expect(text).toEqual(String(quizzes_no))
    })
    o_c.logout(ptor);

    o_c.sign_in(ptor, params.teacher1.email, params.password);
    o_c.open_course_list(ptor);
    o_c.open_course(ptor, 1);
    // o_c.press_content_navigator(ptor)
    teacher.open_module(ptor, 1);
    teacher.delete_item_by_number(ptor, 1, 1);
    teacher.delete_empty_module(ptor, 1)
    o_c.open_course_list(ptor);
    teacher.delete_course(ptor, 1);
    o_c.logout(ptor);

    o_c.sign_in_admin(ptor);
    o_c.open_statistics(ptor);
    element(by.binding('Total_Quizzes')).getText().then(function(text){
        quizzes_no = parseInt(quizzes_no)-1;
        expect(text).toEqual(String(quizzes_no))
    })
    o_c.logout(ptor);
}


function add_survey_then_check(ptor){
    var surveys_no = 0;
    o_c.sign_in_admin(ptor);
    o_c.open_statistics(ptor);
    element(by.binding('Total_Surveys')).getText().then(function(text){
        surveys_no = text;
    })
    o_c.logout(ptor);

    o_c.sign_in(ptor, params.teacher1.email, params.password);
    teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);

    teacher.add_module(ptor);
    ptor.sleep(3000)
    teacher.add_survey(ptor)
    o_c.logout(ptor);

    o_c.sign_in_admin(ptor);
    o_c.open_statistics(ptor);
    element(by.binding('Total_Surveys')).getText().then(function(text){
        surveys_no = parseInt(surveys_no)+1;
        expect(text).toEqual(String(surveys_no))
    })
    o_c.logout(ptor);

    o_c.sign_in(ptor, params.teacher1.email, params.password);
    o_c.open_course_list(ptor);
    o_c.open_course(ptor, 1);
    // o_c.press_content_navigator(ptor)
    teacher.open_module(ptor, 1);
    teacher.delete_item_by_number(ptor, 1, 1);
    teacher.delete_empty_module(ptor, 1)
    o_c.open_course_list(ptor);
    teacher.delete_course(ptor, 1);
    o_c.logout(ptor);

    o_c.sign_in_admin(ptor);
    o_c.open_statistics(ptor);
    element(by.binding('Total_Surveys')).getText().then(function(text){
        surveys_no = parseInt(surveys_no)-1;
        expect(text).toEqual(String(surveys_no))
    })
    o_c.logout(ptor);
}

function add_lecture_then_check(ptor){
    var lectures_no = 0;
    o_c.sign_in_admin(ptor);
    o_c.open_statistics(ptor);
    element(by.binding('Total_Lectures')).getText().then(function(text){
        lectures_no = text;
    })
    o_c.logout(ptor);

    o_c.sign_in(ptor, params.teacher1.email, params.password);
    teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);

    teacher.add_module(ptor);
    ptor.sleep(3000)
    teacher.add_lecture(ptor)
    o_c.logout(ptor);

    o_c.sign_in_admin(ptor);
    o_c.open_statistics(ptor);
    element(by.binding('Total_Lectures')).getText().then(function(text){
        lectures_no = parseInt(lectures_no)+1;
        expect(text).toEqual(String(lectures_no))
    })
    o_c.logout(ptor);

    o_c.sign_in(ptor, params.teacher1.email, params.password);
    o_c.open_course_list(ptor);
    o_c.open_course(ptor, 1);
    // o_c.press_content_navigator(ptor)
    teacher.open_module(ptor, 1);
    teacher.delete_item_by_number(ptor, 1, 1);
    teacher.delete_empty_module(ptor, 1)
    o_c.open_course_list(ptor);
    teacher.delete_course(ptor, 1);
    o_c.logout(ptor);

    o_c.sign_in_admin(ptor);
    o_c.open_statistics(ptor);
    element(by.binding('Total_Lectures')).getText().then(function(text){
        lectures_no = parseInt(lectures_no)-1;
        expect(text).toEqual(String(lectures_no))
    })
    o_c.logout(ptor);
}

function add_question_then_check(ptor){
    var question_no = 0;
    o_c.sign_in_admin(ptor);
    o_c.open_statistics(ptor);
    element(by.binding('Total_Questions_Asked')).getText().then(function(text){
        question_no = text;
    })
    o_c.logout(ptor);

    o_c.sign_in(ptor, params.teacher1.email, params.password);
    teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
    teacher.add_module(ptor);
    ptor.sleep(3000)
    teacher.add_lecture(ptor)
    teacher.init_lecture(ptor, "lec", "https://www.youtube.com/watch?v=SKqBmAHwSkg");
    teacher.get_key_and_enroll(ptor, params.student1.email, params.password);
    // o_c.sign_in(ptor, params.student1.email, params.password);
    // o_c.to_student(ptor);
    o_c.open_course_list(ptor)
    o_c.open_course(ptor, 1);
    // o_c.open_lectures(ptor);
    youtube.seek(ptor, 50);
    discussions.ask_public_question(ptor, "question 1");
    o_c.logout(ptor);

    o_c.sign_in_admin(ptor);
    o_c.open_statistics(ptor);
    element(by.binding('Total_Questions_Asked')).getText().then(function(text){
        question_no = parseInt(question_no)+1;
        expect(text).toEqual(String(question_no))
    })
    o_c.logout(ptor);

    o_c.sign_in(ptor, params.teacher1.email, params.password);
    o_c.open_course_list(ptor);
    o_c.open_course(ptor, 1);
    // o_c.press_content_navigator(ptor)
    teacher.open_module(ptor, 1);
    teacher.delete_item_by_number(ptor, 1, 1);
    teacher.delete_empty_module(ptor, 1)
    o_c.open_course_list(ptor);
    teacher.delete_course(ptor, 1);
    o_c.logout(ptor);

    o_c.sign_in_admin(ptor);
    o_c.open_statistics(ptor);
    element(by.binding('Total_Questions_Asked')).getText().then(function(text){
        question_no = parseInt(question_no)-1;
        expect(text).toEqual(String(question_no))
    })
    o_c.logout(ptor);
}

function add_confused_then_check(ptor){
    var con_no = 0;
    o_c.sign_in_admin(ptor);
    o_c.open_statistics(ptor);
    element(by.binding('Total_Confused')).getText().then(function(text){
        con_no = text;
    })
    o_c.logout(ptor);

    o_c.sign_in(ptor, params.teacher1.email, params.password);
    teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
    teacher.add_module(ptor);
    ptor.sleep(3000)
    teacher.add_lecture(ptor)
    teacher.init_lecture(ptor, "lec", "https://www.youtube.com/watch?v=SKqBmAHwSkg");
    teacher.get_key_and_enroll(ptor, params.student1.email, params.password);
    // o_c.sign_in(ptor, params.student1.email, params.password);
    o_c.open_course_list(ptor)
    o_c.open_course(ptor, 1);
    // o_c.open_lectures(ptor);
    youtube.seek(ptor, 50);
    student.press_confused_btn(ptor);
    o_c.logout(ptor);

    o_c.sign_in_admin(ptor);
    o_c.open_statistics(ptor);
    element(by.binding('Total_Confused')).getText().then(function(text){
        con_no = parseInt(con_no)+1;
        expect(text).toEqual(String(con_no))
    })
    o_c.logout(ptor);

    o_c.sign_in(ptor, params.teacher1.email, params.password);
    o_c.open_course_list(ptor);
    o_c.open_course(ptor, 1);
    // o_c.press_content_navigator(ptor)
    teacher.open_module(ptor, 1);
    teacher.delete_item_by_number(ptor, 1, 1);
    teacher.delete_empty_module(ptor, 1)
    o_c.open_course_list(ptor);
    teacher.delete_course(ptor, 1);
    o_c.logout(ptor);

    o_c.sign_in_admin(ptor);
    o_c.open_statistics(ptor);
    element(by.binding('Total_Confused')).getText().then(function(text){
        con_no = parseInt(con_no)-1;
        expect(text).toEqual(String(con_no))
    })
    o_c.logout(ptor);
}
