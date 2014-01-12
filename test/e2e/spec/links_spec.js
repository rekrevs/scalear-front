var util = require('util');
var enroll_key = '';

var course_id = '', module_id = '', lecture_id = '', quiz_id = '';
var teacher_links = new Array(), student_links = new Array();

function login(ptor, driver, email, password, name, findByName){
    it('should login', function(){
        driver.get(ptor.params.frontend+"#/login");
//        driver.get("http://angular-edu.herokuapp.com/#/login");
        ptor.findElement(protractor.By.className('btn')).then(function(login_button){
            login_button.click();
        });
        findByName("user[email]").sendKeys(email);
        findByName("user[password]").sendKeys(password);
        findByName("commit").click();
        ptor.findElements(protractor.By.tagName('a')).then(function(tags){
            tags[3].getText().then(function(value){
                expect(value.toLowerCase()).toContain(name.toLowerCase());
            })
        });
    });
}

function logout(ptor, driver){
    it('should logout from scalear Auth', function(){
        driver.get(ptor.params.auth).then(function(){
            driver.findElements(protractor.By.tagName('a')).then(function(logout){
                logout[4].click();
            });
        });
    });
}

function feedback(ptor, message){
    ptor.wait(function(){
        return ptor.findElement(protractor.By.id('error_container')).then(function(message){
            return message.getText().then(function(text){
                console.log(text);
                if(text.length > 2){

                    return true;
                }
                else{
                    return false;
                }
            });
        });
    });
    ptor.findElement(protractor.By.id('error_container')).then(function(error){
        expect(error.getText()).toContain(message);
    });
}

var findByName = function(name){
    return driver.findElement(protractor.By.name(name));
};
var ptor = protractor.getInstance();
var driver = ptor.driver;

describe('Links', function(){

//    describe('Teacher', function(){
        login(ptor, driver, 'anyteacher@email.com', 'password', 'anyteacher', findByName);
        it('should create a new course', function(){
            ptor.get('/#/courses/new');
            ptor.findElements(protractor.By.tagName('input')).then(function(fields){
                fields[fields.length-1].click();
            });
            ptor.findElements(protractor.By.className('controls')).then(function(rows){
                expect(rows[0].getText()).toContain('Required');
                expect(rows[1].getText()).toContain('Required');
            });
            ptor.findElements(protractor.By.tagName('input')).then(function(fields){
                fields[0].sendKeys('TEST-101');
                fields[1].sendKeys('Z Testing - Links');
                fields[3].sendKeys('5');
                fields[4].sendKeys('http://google.com/');
                ptor.findElements(protractor.By.tagName('textarea')).then(function(fields){
                    fields[0].sendKeys('new description');
                    fields[1].sendKeys('new prerequisites');
                });
//                ptor.findElements(protractor.By.tagName('select')).then(function(dropdown){
//                    dropdown[0].click();
                ptor.findElements(protractor.By.tagName('option')).then(function(options){
                    options[1].click();
                });
//                });
                fields[fields.length-1].click().then(function(){
                    feedback(ptor, 'Course was successfully created');
                });
            });
        });
        it('should go to course information', function(){
            ptor.findElement(protractor.By.className('dropdown-toggle')).click();
            ptor.findElement(protractor.By.id('info')).click();
        });
        it('should display course enrollment key', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                data[0].getText().then(function(text){
                    enroll_key = text;
                });
            });
        });
        it('should save the course id', function(){
            ptor.getCurrentUrl().then(function(text){
                var test = text.split('/')
                course_id = test[test.length-1];
            });
        });
        it('should save enrollment key', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                data[0].getText().then(function(text){
                    enroll_key = text;
                });
            });
        });
        it('should go to course editor', function(){
            ptor.get('/#/courses/'+course_id+'/course_editor');
        });
        it('should add a new module and open it', function(){
            ptor.findElement(protractor.By.className('adding_module')).then(function(button){
                button.click().then(function(){
                    feedback(ptor, 'created');
                });
            });
            ptor.findElement(protractor.By.className('trigger')).click();
        });
        it('should save module id', function(){
            ptor.getCurrentUrl().then(function(text){
                var test2 = text.split('/');
                module_id = test2[test2.length-1];
            });
        });
        it('should add a new lecture and open it', function(){
            ptor.findElements(protractor.By.className('adding')).then(function(adding){
                adding[adding.length-3].click().then(function(){
                    feedback(ptor, 'created');
                });
            });
//            feedback(ptor, 'Lecture was successfully created.');
            ptor.findElement(protractor.By.className('trigger2')).click();
        });
        it('should save lecture\'s id', function(){
            ptor.getCurrentUrl().then(function(text){
                var test3 = text.split('/');
                lecture_id = test3[test3.length-1];
            });
        });
        it('should add a new quiz and open it', function(){
            ptor.findElements(protractor.By.className('adding')).then(function(adding){
                adding[adding.length-2].click().then(function(){
                    feedback(ptor, 'created');
                });
            });
//            feedback(ptor, 'Lecture was successfully created.');
            ptor.findElements(protractor.By.className('trigger2')).then(function(lectures){
                lectures[lectures.length-1].click();
            });
        });
        it('should save quiz\'s id', function(){
            ptor.getCurrentUrl().then(function(text){
                var test4 = text.split('/');
                lecture_id = test4[test4.length-1];
            });
        });
//    it('should save all the links', function(){
//        teacher_links[0] = '/#/courses';
//        teacher_links[1] = '/#/courses/'+course_id;
//        teacher_links[2] = '/#/courses/'+course_id+'/enrolled_students';
//        teacher_links[3] = '/#/courses/'+course_id+'/teachers';
//        teacher_links[4] = '/#/courses/'+course_id+'/course_editor';
//        teacher_links[5] = '/#/courses/'+course_id+'/course_editor/modules/'+module_id;
//        teacher_links[6] = '/#/courses/'+course_id+'/course_editor/lectures/'+lecture_id;
//        teacher_links[7] = '/#/courses/'+course_id+'/course_editor/quizzes/'+quiz_id;
//        teacher_links[8] = '/#/courses/'+course_id+'/announcements';
//        teacher_links[9] = '/#/courses/'+course_id+'/events';
//        teacher_links[10] = '/#/courses/'+course_id+'/inclass/';
//        teacher_links[11] = '/#/courses/'+course_id+'/inclass/modules/'+module_id;
//        teacher_links[12] = '/#/courses/'+course_id+'/progress/main/';
//        teacher_links[13] = '/#/courses/'+course_id+'/progress/modules/'+module_id;
//
//        student_links[0] = '/#/student_courses';
//        student_links[1] = '/#/courses/'+course_id+'/student/events';
//        student_links[2] = '/#/courses/'+course_id+'/courseware';
//        student_links[3] = '/#/courses/'+course_id+'/courseware/lectures/'+lecture_id;
//        student_links[4] = '/#/courses/'+course_id+'/courseware/quizzes/'+quiz_id;
//        student_links[5] = '/#/courses/'+course_id+'/course_information';
//        console.log(teacher_links);
//        console.log(student_links);
//    });
        logout(ptor, driver);
//    });

//    describe('Student', function(){
    console.log(course_id);
        login(ptor, driver, 'anystudent@email.com', 'password', 'anystudent', findByName);
        testLink(ptor, '/#/courses', 'student_courses');
        testLink(ptor, '/#/courses/'+course_id, 'student_courses');
        testLink(ptor, '/#/courses/'+course_id+'/enrolled_students', 'student_courses');
        testLink(ptor, '/#/courses/'+course_id+'/teachers', 'student_courses');
        testLink(ptor, '/#/courses/'+course_id+'/course_editor', 'student_courses');
        testLink(ptor, '/#/courses/'+course_id+'/course_editor/modules/'+module_id, 'student_courses');
        testLink(ptor, '/#/courses/'+course_id+'/course_editor/lectures/'+lecture_id, 'student_courses');
        testLink(ptor, '/#/courses/'+course_id+'/course_editor/quizzes/'+quiz_id, 'student_courses');
        testLink(ptor, '/#/courses/'+course_id+'/announcements', 'student_courses');
        testLink(ptor, '/#/courses/'+course_id+'/events', 'student_courses');
        testLink(ptor, '/#/courses/'+course_id+'/inclass/', 'student_courses');
        testLink(ptor, '/#/courses/'+course_id+'/inclass/modules/'+module_id, 'student_courses');
        testLink(ptor, '/#/courses/'+course_id+'/progress/main/', 'student_courses');
        testLink(ptor, '/#/courses/'+course_id+'/progress/modules/'+module_id, 'student_courses');
        logout(ptor, driver);
//    });
//    describe('Teacher', function(){
        login(ptor, driver, 'anyteacher@email.com', 'password', 'anyteacher', findByName);
        testLink(ptor, '/#/student_courses', 'courses');
        testLink(ptor, '/#/courses/'+course_id+'/student/events', 'courses');
        testLink(ptor, '/#/courses/'+course_id+'/courseware', 'courses');
        testLink(ptor, '/#/courses/'+course_id+'/courseware/lectures/'+lecture_id, 'courses');
        testLink(ptor, '/#/courses/'+course_id+'/courseware/quizzes/'+quiz_id, 'courses');
        testLink(ptor, '/#/courses/'+course_id+'/course_information', 'courses');
        logout(ptor, driver);
//    });
});

function testLink(ptor, link, def_url){
    it('should try link \''+link+'\'', function(){
        console.log(link);
        ptor.get(link).then(function(){
            ptor.getCurrentUrl().then(function(url){
                expect(url.split('/')[url.split('/').length-1]).toBe(def_url);
            });
        });
    });
}