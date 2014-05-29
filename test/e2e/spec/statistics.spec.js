var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module')

var ptor = protractor.getInstance();
var params = ptor.params
ptor.driver.manage().window().maximize();

var screen_name = "student";
var fname = "s";
var lname = "t";
var univer = "world university";
var biog = "kalam keteeer yege 140 char bs teacher";
var webs = "www.website.com";
var password = 'password';

xdescribe("1", function(){

    it('should add a student then check for statistics', function(){
        add_student_then_check(ptor);
    }, 300000);
})
    
xdescribe("2", function(){

    it('should add a teacher then check for statistics', function(){
        add_teacher_then_check(ptor);
    }, 300000);
})
  
xdescribe("3", function(){

    it('should add a course then check for statistics', function(){
        add_course_then_check(ptor);
    }, 300000);
})

describe("4", function(){

    it('should add a quiz then check for statistics', function(){
        add_quiz_then_check(ptor);
    }, 300000);
})

function add_student_then_check(ptor){
    var students_no = 0;
    o_c.sign_in_admin(ptor);
    o_c.open_tray(ptor);
    o_c.open_statistics(ptor);
    locator.s_by_classname(ptor, 'total_inner').then(function(t){
        t[8].getText().then(function(text){
            students_no = text;
        });
    })
    o_c.home_teacher(ptor);
    o_c.open_tray(ptor);
    o_c.logout(ptor, o_c.feedback);
    
    o_c.sign_up(ptor, screen_name, fname, lname, 'stu'+Math.floor((Math.random() * 99999999) + 1)+'@batee5.com', univer, biog, webs, password, o_c.feedback);
    ptor.sleep(3000);

    o_c.sign_in_admin(ptor);
    o_c.open_tray(ptor);
    o_c.open_statistics(ptor);
    locator.s_by_classname(ptor, 'total_inner').then(function(t){
        students_no = parseInt(students_no)+1;
        expect(t[8].getText()).toEqual(String(students_no));
    })
}

function add_teacher_then_check(ptor){
    var teachers_no = 0;
    o_c.sign_in_admin(ptor);
    o_c.open_tray(ptor);
    o_c.open_statistics(ptor);
    locator.s_by_classname(ptor, 'total_inner').then(function(t){
        t[9].getText().then(function(text){
            teachers_no = text;
        });
    })
    o_c.home_teacher(ptor);
    o_c.open_tray(ptor);
    o_c.logout(ptor, o_c.feedback);

    o_c.sign_up_teacher(ptor, screen_name, fname, lname, 'tea'+Math.floor((Math.random() * 99999999) + 1)+'@batee5.com', univer, biog, webs, password, o_c.feedback);
    ptor.sleep(3000);

    o_c.sign_in_admin(ptor);
    o_c.open_tray(ptor);
    o_c.open_statistics(ptor);
    locator.s_by_classname(ptor, 'total_inner').then(function(t){
        teachers_no = parseInt(teachers_no)+1;
        expect(t[9].getText()).toEqual(String(teachers_no));
    })
}


function add_course_then_check(ptor){
    var courses_no = 0;
    o_c.sign_in_admin(ptor);
    o_c.open_tray(ptor);
    o_c.open_statistics(ptor);
    locator.s_by_classname(ptor, 'total_inner').then(function(t){
        t[10].getText().then(function(text){
            courses_no = text;
        });
    })
    o_c.home_teacher(ptor);
    o_c.open_tray(ptor);
    o_c.logout(ptor, o_c.feedback);
    
    o_c.sign_in(ptor, params.teacher_mail, params.password, o_c.feedback);
    teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites, o_c.feedback);
    o_c.home_teacher(ptor);
    o_c.open_tray(ptor);
    o_c.logout(ptor, o_c.feedback);
    
    o_c.sign_in_admin(ptor);
    o_c.open_tray(ptor);
    o_c.open_statistics(ptor);
    locator.s_by_classname(ptor, 'total_inner').then(function(t){
        courses_no = parseInt(courses_no)+1;
        expect(t[10].getText()).toEqual(String(courses_no));
    })
    
    o_c.home_teacher(ptor);
    o_c.open_tray(ptor);
    o_c.logout(ptor, o_c.feedback);
    
    o_c.sign_in(ptor, params.teacher_mail, params.password, o_c.feedback);
    teacher.delete_course(ptor, o_c.feedback);
    
    o_c.sign_in_admin(ptor);
    o_c.open_tray(ptor);
    o_c.open_statistics(ptor);
    locator.s_by_classname(ptor, 'total_inner').then(function(t){
        courses_no = parseInt(courses_no)-1;
        expect(t[10].getText()).toEqual(String(courses_no));
    })
}


function add_quiz_then_check(ptor){
    var quizzes_no = 0;
    o_c.sign_in_admin(ptor);
    o_c.open_tray(ptor);
    o_c.open_statistics(ptor);
    locator.s_by_classname(ptor, 'total_inner').then(function(t){
        t[11].getText().then(function(text){
            quizzes_no = text;
        });
    })
    o_c.home_teacher(ptor);
    o_c.open_tray(ptor);
    o_c.logout(ptor, o_c.feedback);

    o_c.sign_in(ptor, params.teacher_mail, params.password, o_c.feedback);
    teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites, o_c.feedback);
    
    teacher.add_module(ptor, o_c.feedback);
    teacher.open_module(ptor, 1);
    teacher.add_quiz(ptor, 1, o_c.feedback)
    
    o_c.home_teacher(ptor);
    o_c.open_tray(ptor);
    o_c.logout(ptor, o_c.feedback);

    o_c.sign_in_admin(ptor);
    o_c.open_tray(ptor);
    o_c.open_statistics(ptor);
    locator.s_by_classname(ptor, 'total_inner').then(function(t){
        quizzes_no = parseInt(quizzes_no)+1;
        expect(t[11].getText()).toEqual(String(quizzes_no));
    })

    o_c.home_teacher(ptor);
    o_c.open_tray(ptor);
    o_c.logout(ptor, o_c.feedback);

    o_c.sign_in(ptor, params.teacher_mail, params.password, o_c.feedback);
    o_c.open_course_whole(ptor);
    teacher.open_module(ptor, 1);
    teacher.delete_item_by_number(ptor, 1, 1, o_c.feedback);
    teacher.delete_empty_module(ptor, 1, o_c.feedback)
    o_c.home_teacher(ptor);
    teacher.delete_course(ptor, o_c.feedback);

    o_c.sign_in_admin(ptor);
    o_c.open_tray(ptor);
    o_c.open_statistics(ptor);
    locator.s_by_classname(ptor, 'total_inner').then(function(t){
        quizzes_no = parseInt(quizzes_no)-1;
        expect(t[11].getText()).toEqual(String(quizzes_no));
    })
}