var current_date = new Date();
var no_students, no_modules, percentage, dummy, enroll_key = '',
    course_id = '',
    module_id = '',
    quiz_id = '';
//var frontend = 'http://localhost:9000/';
//var backend = 'http://localhost:3000/';
//var auth = 'http://localhost:4000/';

function getNextDay(date) {
    var result = date;
    result.setTime(date.getTime() + 86400000);
    return result;
}

function formatDate(date, which) {
    var dd = date.getDate();
    if (dd < 10) {
        dd = '0' + dd;
    }
    var mm = date.getMonth() + 1;
    var yyyy = date.getFullYear();
    if (which == 0) {
        return mm + '/' + dd.toString() + '/' + yyyy;
    } else if (which == 1) {
        return dd + '/' + mm + '/' + yyyy;
    }
}


var today_keys = formatDate(new Date(), 0);
var today = formatDate(new Date(), 1);
//var tomorrow_keys = formatDate(getNextDay(new Date()), 0);
var tomorrow = formatDate(getNextDay(new Date()), 1);

function login(ptor, driver, email, password, name, findByName) {
    it('should login', function() {
        ptor.get(ptor.params.frontend + 'users/login');
        ptor.findElement(protractor.By.id('user_email')).then(function(email_field) {
            email_field.sendKeys(email);
        });
        ptor.findElement(protractor.By.id('user_passowrd')).then(function(password_field) {
            password_field.sendKeys(password);
        });
        ptor.findElements(protractor.By.tagName('input')).then(function(fields) {
            fields[3].click().then(function() {
                feedback(ptor, 'Signed in successfully');
            });
        });

        ptor.findElement(protractor.By.xpath('/html/body/header/nav/div/ul[1]/li[1]/a/span')).then(function(tag) {
            tag.getText().then(function(value) {
                expect(value.toLowerCase()).toContain(name.toLowerCase());
            });
        });

    });
}

function logout(ptor, driver) {
    it('should logout', function() {
        ptor.findElement(protractor.By.linkText('Logout')).then(function(link) {
            link.click().then(function() {
                feedback(ptor, 'Signed out successfully.');
            });
        });
    });
}
//Progress Tests

var ptor = protractor.getInstance();
var driver = ptor.driver;
var findByName = function(name) {
    return driver.findElement(protractor.By.name(name));
};
var findById = function(id) {
    return driver.findElement(protractor.By.id(id))
};


describe('Teacher', function() {
    login(ptor, driver, 'anyteacher@email.com', 'password', 'anyteacher', findByName);
    it('should create a new course', function() {
        browser.driver.manage().window().setSize(ptor.params.width, ptor.params.height);
        browser.driver.manage().window().setPosition(0, 0);
        ptor.get('/#/courses/new');
        ptor.findElements(protractor.By.tagName('input')).then(function(fields) {
            fields[fields.length - 3].click();
        });
        ptor.findElements(protractor.By.className('controls')).then(function(rows) {
            expect(rows[0].getText()).toContain('Required');
            expect(rows[1].getText()).toContain('Required');
        });
        ptor.findElements(protractor.By.tagName('input')).then(function(fields) {
            fields[0].sendKeys('TEST-101');
            fields[1].sendKeys('Z Testing - Links');
            fields[3].sendKeys('5');
            fields[4].sendKeys('http://google.com/');
            ptor.findElements(protractor.By.tagName('textarea')).then(function(fields) {
                fields[0].sendKeys('new description');
                fields[1].sendKeys('new prerequisites');
            });
            //                ptor.findElements(protractor.By.tagName('select')).then(function(dropdown){
            //                    dropdown[0].click();
            ptor.findElements(protractor.By.tagName('option')).then(function(options) {
                options[1].click();
            });
            //                });
            fields[fields.length - 3].click().then(function() {
                feedback(ptor, 'Course was successfully created');
            });
        });
    });
    it('should go to course information', function() {
        ptor.findElement(protractor.By.className('dropdown-toggle')).click();
        ptor.findElement(protractor.By.id('info')).click();
    });
    it('should display course enrollment key', function() {
        ptor.findElements(protractor.By.tagName('p')).then(function(data) {
            data[2].getText().then(function(text) {
                enroll_key = text;
            });
        });
    });
    it('should save the course id', function() {
        ptor.getCurrentUrl().then(function(text) {
            var test = text.split('/')
            course_id = test[test.length - 1];
        });
    });
    it('should save enrollment key', function() {
        ptor.findElements(protractor.By.tagName('p')).then(function(data) {
            data[0].getText().then(function(text) {
                enroll_key = text;
            });
        });
    });
    it('should go to course editor', function() {
        ptor.get('/#/courses/' + course_id + '/course_editor');
    });
    it('should add a new module and open it', function() {
        ptor.findElement(protractor.By.className('adding_module')).then(function(button) {
            button.click().then(function() {
                feedback(ptor, 'created');
            });
        });
        ptor.findElement(protractor.By.className('trigger')).click();
    });
    it('should save module id', function() {
        ptor.getCurrentUrl().then(function(text) {
            var test2 = text.split('/');
            module_id = test2[test2.length - 1];
        });
    });
    it('should add a new lecture and open it', function() {
        ptor.findElements(protractor.By.className('adding')).then(function(adding) {
            adding[adding.length - 3].click().then(function() {
                feedback(ptor, 'created');
            });
        });
        //            feedback(ptor, 'Lecture was successfully created.');
        ptor.findElement(protractor.By.className('trigger2')).click();
    });
    it('should save lecture\'s id', function() {
        ptor.getCurrentUrl().then(function(text) {
            var test3 = text.split('/');
            lecture_id = test3[test3.length - 1];
        });
    });
    it('should add a new quiz and open it', function() {
        ptor.findElements(protractor.By.className('adding')).then(function(adding) {
            adding[adding.length - 2].click().then(function() {
                feedback(ptor, 'created');
            });
        });
        //            feedback(ptor, 'Lecture was successfully created.');
        ptor.findElements(protractor.By.className('trigger2')).then(function(lectures) {
            lectures[lectures.length - 1].click();
        });
    });
    it('should save quiz\'s id', function() {
        ptor.getCurrentUrl().then(function(text) {
            var test4 = text.split('/');
            quiz_id = test4[test4.length - 1];
        });
    });
    logout(ptor, driver);
});

describe('Student', function() {
    it('should log the course id', function() {
        console.log('course id ' + course_id);
    });
    login(ptor, driver, 'anystudent@email.com', 'password', 'anystudent', findByName);
    it('should test the link \'courses\'', function() {
        testLink(ptor, '/#/courses', 'course_list');
    });
    it('should test the link \'course information\'', function() {
        testLink(ptor, '/#/courses/' + course_id, 'course_list');
    });
    it('should test the link \'enrolled students\'', function() {
        testLink(ptor, '/#/courses/' + course_id + '/enrolled_students', 'course_list');
    });
    it('should test the link \'teachers\'', function() {
        testLink(ptor, '/#/courses/' + course_id + '/teachers', 'course_list');
    });
    it('should test the link \'course editor\'', function() {
        testLink(ptor, '/#/courses/' + course_id + '/course_editor', 'course_list');
    });
    it('should test the link \'course editor modules\'', function() {
        testLink(ptor, '/#/courses/' + course_id + '/course_editor/modules/' + module_id, 'course_list');
    });
    it('should test the link \'course editor lectures\'', function() {
        testLink(ptor, '/#/courses/' + course_id + '/course_editor/lectures/' + lecture_id, 'course_list');
    });
    it('should test the link \'course editor quizzes\'', function() {
        testLink(ptor, '/#/courses/' + course_id + '/course_editor/quizzes/' + quiz_id, 'course_list');
    });
    it('should test the link \'announcements\'', function() {
        testLink(ptor, '/#/courses/' + course_id + '/announcements', 'course_list');
    });
    it('should test the link \'events\'', function() {
        testLink(ptor, '/#/courses/' + course_id + '/events', 'course_list');
    });
    it('should test the link \'in class\'', function() {
        testLink(ptor, '/#/courses/' + course_id + '/inclass/', 'course_list');
    });
    it('should test the link \'inclass modules\'', function() {
        testLink(ptor, '/#/courses/' + course_id + '/inclass/modules/' + module_id, 'course_list');
    });
    it('should test the link \'progress main\'', function() {
        testLink(ptor, '/#/courses/' + course_id + '/progress/main/', 'course_list');
    });
    it('should test the link \'progress modules\'', function() {
        testLink(ptor, '/#/courses/' + course_id + '/progress/modules/' + module_id, 'course_list');
    });
    logout(ptor, driver);
});

describe('Teacher', function() {
    login(ptor, driver, 'anyteacher@email.com', 'password', 'anyteacher', findByName);
    it('should test the link \'/#/course_list\'', function() {
        testLink(ptor, '/#/course_list', 'courses');
    });
    it('should test the link \'student events\'', function() {
        testLink(ptor, '/#/courses/' + course_id + '/student/events', 'courses');
    });
    it('should test the link \'courseware\'', function() {
        testLink(ptor, '/#/courses/' + course_id + '/courseware', 'courses');
    });
    it('should test the link \'courseware lectures\'', function() {
        testLink(ptor, '/#/courses/' + course_id + '/courseware/lectures/' + lecture_id, 'courses');
    });
    it('should test the link \'courseware quizzes\'', function() {
        testLink(ptor, '/#/courses/' + course_id + '/courseware/quizzes/' + quiz_id, 'courses');
    });
    it('should test the link \'course information\'', function() {
        testLink(ptor, '/#/courses/' + course_id + '/course_information', 'courses');
    });


    it('should go to course editor', function() {
        ptor.get('/#/courses/' + course_id + '/course_editor');
    });
    it('should delete All lectures and modules', function() {
        ptor.findElements(protractor.By.className('module')).then(function(modules) {
            for (var i = modules.length - 1; i >= 0; i--) {
                modules[i].click()
                modules[i].findElements(protractor.By.className('delete')).then(function(delete_buttons) {
                    for (var n = delete_buttons.length - 1; n >= 0; n--) {
                        delete_buttons[n].click().then(function() {
                            ptor.findElement(protractor.By.className('btn-danger')).click().then(function() {
                                feedback(ptor, 'deleted');
                            })
                        });
                    }
                });
            }
        });
    });
    it('should delete the created course', function() {
        ptor.get('/#/courses');
        ptor.findElements(protractor.By.className('delete')).then(function(delete_buttons) {
            delete_buttons[delete_buttons.length - 1].click();
            ptor.findElements(protractor.By.className('btn-danger')).then(function(danger_button) {
                danger_button[danger_button.length - 1].click().then(function() {
                    feedback(ptor, 'deleted');
                });
            });
        });
    });

    logout(ptor, driver);
});

function testLink(ptor, link, def_url) {
    //    console.log(link);
    ptor.get(link).then(function() {
        ptor.getCurrentUrl().then(function(url) {
            expect(url.split('/')[url.split('/').length - 1]).toBe(def_url);
        });
    });
}

function feedback(ptor, message) {
    ptor.wait(function() {
        return ptor.findElement(protractor.By.id('error_container')).then(function(message) {
            return message.getText().then(function(text) {
                if (text.length > 2) {
                    console.log(text);
                    return true;
                } else {
                    return false;
                }
            });
        });
    });
    ptor.findElement(protractor.By.id('error_container')).then(function(error) {
        expect(error.getText()).toContain(message);
    });
}