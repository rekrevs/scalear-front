var current_date = new Date();
var no_students, no_modules, percentage, dummy, enroll_key = '',
    course_id = '',
    module_id = '';

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
    // it('should go to course', function() {
    //     ptor.get('/#/courses/' + course_id);
    // })
    it('should create a new course', function() {
        ptor = protractor.getInstance();
        ptor.get('/#/courses/new');
        browser.driver.manage().window().setSize(ptor.params.width, ptor.params.height);
        browser.driver.manage().window().setPosition(0, 0);
        ptor.findElements(protractor.By.tagName('input')).then(function(fields) {
            fields[0].sendKeys('TEST-101');
            fields[1].sendKeys('Z Testing Course');
            fields[3].sendKeys('5');
            fields[4].sendKeys('http://google.com/');
            ptor.findElements(protractor.By.tagName('textarea')).then(function(fields) {
                fields[0].sendKeys('new description');
                fields[1].sendKeys('new prerequisites');
            });
            ptor.findElements(protractor.By.tagName('option')).then(function(options) {
                options[1].click();
            });
            fields[fields.length - 3].click().then(function() {
                feedback(ptor, 'created');
            });
        });
    });
    it('should go to course editor and try to produce the bug', function() {
        ptor.findElement(protractor.By.className('adding_module')).then(function(button) {
            button.click().then(function() {
                ptor.findElement(protractor.By.className('trigger')).then(function(module) {
                    module.click().then(function() {
                        ptor.findElement(protractor.By.className('adding')).then(function(add_lecture) {
                            add_lecture.click().then(function() {
                                ptor.findElement(protractor.By.className('trigger2')).then(function(lecture) {
                                    lecture.click().then(function() {
                                        ptor.findElement(protractor.By.tagName('details-text')).then(function(name) {
                                            name.click().then(function() {
                                                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                                                    field.clear();
                                                    field.sendKeys('new name').then(function() {
                                                        ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm) {
                                                            confirm.click().then(function() {
                                                                feedback(ptor, 'updated');
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                        ptor.findElements(protractor.By.tagName('details-text')).then(function(url) {
                                            url[1].click().then(function() {
                                                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                                                    field.clear();
                                                    field.sendKeys('anything').then(function() {
                                                        ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm) {
                                                            confirm.click().then(function() {
                                                                ptor.findElement(protractor.By.className('editable-error')).then(function(error) {
                                                                    expect(error.getText()).toContain('Invalid Input');
                                                                });
                                                            });
                                                        });
                                                    });
                                                    field.clear();
                                                    field.sendKeys('http://www.youtube.com/watch?v=PlavjNH_RRU').then(function() {
                                                        ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm) {
                                                            confirm.click().then(function() {
                                                                feedback(ptor, 'updated');
                                                            });
                                                        });
                                                    });
                                                });
                                            })
                                        })
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
    it('should see only one video', function() {
        ptor.wait(function() {
            // return ptor.findElement(protractor.By.tagName('iframe')).then(function(frame) {
            //     return frame.isDisplayed().then(function(disp) {
            //         return disp;
            //     });
            // });
            return ptor.isElementPresent(protractor.By.tagName('iframe')).then(function(present) {
                return present;
            });
        });
        ptor.sleep(10000);
        ptor.findElements(protractor.By.tagName('iframe')).then(function(frames) {
            expect(frames.length).toBe(1);
        });
    });
    it('should make sure that only one course was created', function() {
        ptor.get('/#/courses').then(function() {
            ptor.findElements(protractor.By.repeater('course in courses')).then(function(courses) {
                expect(courses.length).toBe(1);
                courses[0].findElement(protractor.By.tagName('td')).then(function(short) {
                    short.findElement(protractor.By.tagName('a')).then(function(link) {
                        link.click();
                    });
                });
            });
        });
    });
    it('should go to course information page', function() {
        ptor.findElement(protractor.By.className('dropdown-toggle')).click();
        ptor.findElement(protractor.By.id('info')).click();
    });
    it('should save the course id', function() {
        ptor.getCurrentUrl().then(function(text) {
            var test = text.split('/')
            course_id = test[test.length - 1];
        });
    });
    it('should save enrollment key', function() {
        ptor.findElements(protractor.By.tagName('p')).then(function(data) {
            data[2].getText().then(function(text) {
                enroll_key = text;
            });
        });
    });
    it('should be able to change short name', function() {
        ptor.findElement(protractor.By.tagName('details-text')).then(function(short_name) {
            short_name.click().then(function() {
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.clear();
                    field.sendKeys(' ').then(function() {
                        ptor.findElement(protractor.By.className('icon-ok')).then(function(button) {
                            button.click().then(function() {
                                ptor.findElement(protractor.By.className('editable-error')).then(function(error) {
                                    expect(error.getText()).toContain('Short name can\'t be blank');
                                });
                            });
                        });
                    })
                    field.sendKeys('New Short').then(function() {
                        ptor.findElement(protractor.By.className('icon-ok')).then(function(button) {
                            button.click().then(function() {
                                feedback(ptor, 'Course was successfully updated.');
                            });
                        });
                    });
                });
            });
        });
    });
    it('should be able to change course name', function() {
        ptor.findElements(protractor.By.tagName('details-text')).then(function(course_name) {
            course_name[1].click().then(function() {
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.clear();
                    field.sendKeys(' ').then(function() {
                        ptor.findElement(protractor.By.className('icon-ok')).then(function(button) {
                            button.click().then(function() {
                                ptor.findElement(protractor.By.className('editable-error')).then(function(error) {
                                    expect(error.getText()).toContain('Name can\'t be blank');
                                });
                            });
                        });
                    });
                    field.sendKeys('New Course Name').then(function() {
                        ptor.findElement(protractor.By.className('icon-ok')).then(function(button) {
                            button.click().then(function() {
                                feedback(ptor, 'Course was successfully updated.');
                            });
                        });
                    });
                });
            });
        });
    });
    it('should refresh the page and make sure that the names were saved', function() {
        ptor.navigate().refresh().then(function() {
            ptor.findElements(protractor.By.tagName('details-text')).then(function(names) {
                expect(names[0].getText()).toBe('New Short');
                expect(names[1].getText()).toBe('New Course Name');
            });
        });
    });
    it('should make sure that the names reflected in the courses page', function() {
        ptor.get('/#/courses').then(function() {
            ptor.findElements(protractor.By.tagName('tr')).then(function(rows) {
                rows[rows.length - 1].findElements(protractor.By.tagName('td')).then(function(names) {
                    expect(names[0].getText()).toContain('New Short');
                    expect(names[1].getText()).toContain('New Course Name');
                });
            });
        });
    });
    logout(ptor, driver);
});
describe('Student', function() {
    login(ptor, driver, 'anystudent@email.com', 'password', 'anystudent', findByName);
    it('should enroll in the course that was created', function() {
        ptor.findElement(protractor.By.id('join_course')).then(function(join_course) {
            join_course.click();
        });
    });
    it('should enter the enrollment key and proceed', function() {
        ptor.findElement(protractor.By.className('modal')).then(function(modal){
            modal.findElement(protractor.By.tagName('input')).then(function(key_field) {
                key_field.clear();
                key_field.sendKeys(enroll_key);
            });
        });
        ptor.findElement(protractor.By.className('btn-primary')).then(function(proceed) {
            proceed.click().then(function() {
                ptor.sleep(5000);
            });
        });
    });
    it('should go to course information page and make sure that the course name is displayed correctly', function() {
        ptor.get('/#/courses/' + course_id + '/course_information').then(function() {
            ptor.findElement(protractor.By.id('course_information')).then(function(information) {
                information.findElement(protractor.By.tagName('h3')).then(function(title) {
                    expect(title.getText()).toContain('New Short');
                    expect(title.getText()).toContain('New Course Name');
                });
            });
        });
    });
    logout(ptor, driver);
});
describe('Teacher', function() {
    login(ptor, driver, 'anyteacher@email.com', 'password', 'anyteacher', findByName);
    it('should go to course editor', function() {
        console.log('Started 2.0.2');
        ptor.get('/#/courses/' + course_id + '/course_editor');
    });
    it('should open the first module and then open the first lecture', function() {
        ptor.findElement(protractor.By.className('trigger')).then(function(module) {
            module.click().then(function() {
                ptor.findElement(protractor.By.className('trigger2')).then(function(lecture) {
                    lecture.click().then(function() {
                        ptor.wait(function() {
                            // return ptor.findElement(protractor.By.tagName('iframe')).then(function(video) {
                            //     return video.isDisplayed().then(function(disp) {
                            //         return disp;
                            //     });
                            // });
                            return ptor.isElementPresent(protractor.By.tagName('iframe')).then(function(present) {
                                return present;
                            });
                        });
                    });
                });
            });
        });
        ptor.sleep(10000);
    })
    it('should try adding two MCQ Over Video Quizzes at the same time', function() {
        ptor.findElements(protractor.By.className('dropdown-toggle')).then(function(lists) {
            lists[lists.length - 2].click().then(function() {
                ptor.findElements(protractor.By.className('insertQuiz')).then(function(quizzes) {
                    quizzes[0].click().then(function() {
                        feedback(ptor, 'created');
                    });
                });
            });
            lists[lists.length - 2].click().then(function() {
                ptor.findElements(protractor.By.className('insertQuiz')).then(function(quizzes) {
                    quizzes[0].click().then(function() {
                        feedback(ptor, 'created');
                    });
                });
            });
        });
    });
    it('should see the two quizzes in different times', function() {
        ptor.findElements(protractor.By.tagName('editable_text')).then(function(times) {
            times[times.length - 1].getText().then(function(value) {
                expect(times[times.length - 3].getText()).not.toEqual(value);
            })

        });
    });
    addMCQAnswers(ptor);
    it('should edit quiz name', function() {
        ptor.findElements(protractor.By.tagName('editable_text')).then(function(names) {
            ptor.actions().doubleClick(names[names.length - 2]).perform().then(function() {
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.sendKeys('2').then(function() {
                        ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm) {
                            confirm.click().then(function() {
                                feedback(ptor, 'updated');
                                ptor.sleep(10000);
                            });
                        });
                    });
                });
            });
        });
    });
    it('should see their answers not deleted', function() {
        ptor.findElements(protractor.By.className('dropped')).then(function(dropped) {
            expect(dropped.length).toBe(3);
        });
    });
    doSave(ptor);
    it('should open the first quiz', function() {
        ptor.findElement(protractor.By.tagName('editable_text')).then(function(quiz) {
            quiz.click();
        });
    });
    addMCQAnswers(ptor);
    doSave(ptor);
    it('should add a new lecture', function() {
        ptor.findElements(protractor.By.className('adding')).then(function(add_lecture) {
            add_lecture[add_lecture.length - 3].click().then(function() {
                feedback(ptor, 'created');
            });
        });
        ptor.findElements(protractor.By.className('trigger2')).then(function(lectures) {
            lectures[lectures.length - 1].click();
        });
    });
    it('should edit lecture url', function() {
        ptor.findElements(protractor.By.tagName('details-text')).then(function(url) {
            url[1].click().then(function() {
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.clear();
                    field.sendKeys('http://www.youtube.com/watch?v=PlavjNH_RRU').then(function() {
                        ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm) {
                            confirm.click().then(function() {
                                feedback(ptor, 'updated');
                                ptor.wait(function() {
                                    return ptor.isElementPresent(protractor.By.tagName('iframe')).then(function(present) {
                                        return present;
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
        ptor.sleep(10000);
    });
    it('should try adding two MCQ Over Video Quizzes at the same time', function() {
        ptor.findElements(protractor.By.className('dropdown-toggle')).then(function(lists) {
            lists[lists.length - 2].click().then(function() {
                ptor.findElements(protractor.By.className('insertQuiz')).then(function(quizzes) {
                    quizzes[0].click().then(function() {
                        feedback(ptor, 'created');
                    });
                });
            });
            lists[lists.length - 2].click().then(function() {
                ptor.findElements(protractor.By.className('insertQuiz')).then(function(quizzes) {
                    quizzes[0].click().then(function() {
                        feedback(ptor, 'created');
                    });
                });
            });
        });
    });
    addMCQAnswers(ptor);
    doSave(ptor);
    it('should open the first quiz', function() {
        ptor.findElement(protractor.By.tagName('editable_text')).then(function(quiz) {
            quiz.click();
        });
    });
    addMCQAnswers(ptor);
    doSave(ptor);
    it('should edit quiz names', function() {
        ptor.findElements(protractor.By.tagName('editable_text')).then(function(names) {
            ptor.actions().doubleClick(names[names.length - 2]).perform().then(function() {
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.sendKeys('4').then(function() {
                        ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm) {
                            confirm.click().then(function() {
                                feedback(ptor, 'updated');
                                ptor.sleep(10000);
                            });
                        });
                    });
                });
            });
            ptor.actions().doubleClick(names[names.length - 4]).perform().then(function() {
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.sendKeys('3').then(function() {
                        ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm) {
                            confirm.click().then(function() {
                                feedback(ptor, 'updated');
                                ptor.sleep(10000);
                            });
                        });
                    });
                });
            });
        });
    });
    it('should go to in-class', function() {
        ptor.executeScript('window.scrollBy(0, -1000)', '');
        ptor.findElement(protractor.By.id('inclass_link')).then(function(link) {
            link.click();
        });
    });
    it('should open the module and then click on display quizzes', function() {
        ptor.findElements(protractor.By.repeater('module in modules')).then(function(modules) {
            modules[0].findElement(protractor.By.tagName('a')).then(function(module) {
                module.click().then(function() {
                    ptor.findElements(protractor.By.className('btn-primary')).then(function(buttons) {
                        buttons[0].click().then(function() {
                            ptor.wait(function() {
                                return ptor.isElementPresent(protractor.By.tagName('iframe')).then(function(present) {
                                    return present;
                                });
                            });
                            ptor.sleep(10000);
                        });
                    });
                });
            });
        });
    });
    it('should see the video paused', function() {
        ptor.findElement(protractor.By.className('play_button')).then(function(button) {
            expect(button.isDisplayed()).toBe(true);
        });
    });
    it('should display the first quiz name', function() {
        ptor.findElement(protractor.By.className('question_title')).then(function(title) {
            expect(title.getText()).toBe('New Quiz');
        });
    });
    it('should navigate to next quiz', function() {
        ptor.findElements(protractor.By.className('btn')).then(function(buttons) {
            buttons[9].click();
        });
    });

    it('should display the second quiz name', function() {
        ptor.findElement(protractor.By.className('question_title')).then(function(title) {
            expect(title.getText()).toBe('2');
        });
    });
    it('should navigate to next quiz', function() {
        ptor.findElements(protractor.By.className('btn')).then(function(buttons) {
            buttons[9].click();
        });
    });

    it('should display the third quiz name', function() {
        ptor.findElement(protractor.By.className('question_title')).then(function(title) {
            expect(title.getText()).toBe('3');
        });
    });
    it('should navigate to next quiz', function() {
        ptor.findElements(protractor.By.className('btn')).then(function(buttons) {
            buttons[9].click();
        });
    });

    it('should display the fourth quiz name', function() {
        ptor.findElement(protractor.By.className('question_title')).then(function(title) {
            expect(title.getText()).toBe('4');
        });
    });


    ///////////
    it('should navigate to previous quiz', function() {
        ptor.findElements(protractor.By.className('btn')).then(function(buttons) {
            buttons[7].click();
        });
    });

    it('should display the third quiz name', function() {
        ptor.findElement(protractor.By.className('question_title')).then(function(title) {
            expect(title.getText()).toBe('3');
        });
    });
    it('should navigate to previous quiz', function() {
        ptor.findElements(protractor.By.className('btn')).then(function(buttons) {
            buttons[7].click();
        });
    });

    it('should display the second quiz name', function() {
        ptor.findElement(protractor.By.className('question_title')).then(function(title) {
            expect(title.getText()).toBe('2');
        });
    });
    it('should navigate to previous quiz', function() {
        ptor.findElements(protractor.By.className('btn')).then(function(buttons) {
            buttons[7].click();
        });
    });

    it('should display the first quiz name', function() {
        ptor.findElement(protractor.By.className('question_title')).then(function(title) {
            expect(title.getText()).toBe('New Quiz');
        });
    });

    // delete the course and lecture
    it('should delete All lectures and modules', function() {
        ptor.get('/#/courses/' + course_id + '/course_editor');
        ptor.findElements(protractor.By.className('module')).then(function(modules) {
            for (var i = modules.length - 1; i >= 0; i--) {
                modules[i].click()
                modules[i].findElements(protractor.By.className('delete')).then(function(delete_buttons) {
                    //                        console.log(delete_buttons.length)
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
});


//functions
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

function addMCQAnswers(ptor) {
    it('should add quiz answers on top of the video - MCQ Video', function() {
        var locx = 0,
            locy = 0;
        locationx = new Array();
        locationy = new Array();
        //double click in 3 different places, delta should be in y direction with a positive value
        ptor.executeScript('window.scrollBy(0, -1000)', '');
        ptor.findElement(protractor.By.className('ontop')).then(function(test) {
            ptor.actions().doubleClick(test).perform();
            //-----------------------------------------//
            ptor.findElements(protractor.By.className('dropped')).then(function(answers) {
                answers[answers.length - 1].getLocation().then(function(pnode) {
                    locx = pnode.x + 5;
                    locy = pnode.y;
                });
                ptor.actions().dragAndDrop({
                    x: locx,
                    y: locy
                }, {
                    x: 200,
                    y: 115
                }).perform();
                answers[answers.length - 1].getLocation().then(function(location) {
                    locationx.splice(locationx.length, 0, location.x);
                    locationy.splice(locationy.length, 0, location.y);
                    //                    console.log(locationx[locationx.length-1] + " " + locationy[locationy.length-1]);
                });
                ptor.findElement(protractor.By.className('popover-content')).then(function(popover) {
                    popover.isDisplayed().then(function(disp) {
                        expect(disp).toBe(true);
                    });
                });
                ptor.findElement(protractor.By.className('must_save_check')).then(function(correct) {
                    correct.click();
                });
                expect(answers[answers.length - 1].getAttribute('ng-src')).toContain('green');
                ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                    fields[0].sendKeys('first answer');
                    fields[1].sendKeys('first explanation');
                });
            });
        });

        ptor.findElement(protractor.By.className('ontop')).then(function(test) {
            var loc2x = 0,
                loc2y = 0;
            ptor.actions().doubleClick(test).perform();
            //-----------------------------------------//
            ptor.findElements(protractor.By.className('dropped')).then(function(answers) {
                answers[answers.length - 1].getLocation().then(function(pnode) {
                    loc2x = pnode.x + 5;
                    loc2y = pnode.y;
                });
                ptor.actions().dragAndDrop({
                    x: loc2x,
                    y: loc2y
                }, {
                    x: 200,
                    y: 165
                }).perform();
                answers[answers.length - 1].getLocation().then(function(location) {
                    locationx.splice(locationx.length, 0, location.x);
                    locationy.splice(locationy.length, 0, location.y);
                    //                    console.log(locationx[locationx.length-1] + " " + locationy[locationy.length-1]);
                });
                ptor.findElement(protractor.By.className('popover-content')).then(function(popover) {
                    popover.isDisplayed().then(function(disp) {
                        expect(disp).toBe(true);
                    });
                });
                ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                    fields[0].sendKeys('second answer');
                    fields[1].sendKeys('second explanation');
                });
            });
        });


        ptor.findElement(protractor.By.className('ontop')).then(function(test) {
            var loc3x = 0,
                loc3y = 0;
            ptor.actions().doubleClick(test).perform();
            //-----------------------------------------//
            ptor.findElements(protractor.By.className('dropped')).then(function(answers) {
                answers[answers.length - 1].getLocation().then(function(pnode) {
                    loc3x = pnode.x + 5;
                    loc3y = pnode.y;
                });
                ptor.actions().dragAndDrop({
                    x: loc3x,
                    y: loc3y
                }, {
                    x: 200,
                    y: 215
                }).perform();
                answers[answers.length - 1].getLocation().then(function(location) {
                    locationx.splice(locationx.length, 0, location.x);
                    locationy.splice(locationy.length, 0, location.y);
                    //                    console.log(locationx[locationx.length-1] + " " + locationy[locationy.length-1]);
                });
                ptor.findElement(protractor.By.className('popover-content')).then(function(popover) {
                    popover.isDisplayed().then(function(disp) {
                        expect(disp).toBe(true);
                    });
                });
                ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                    fields[0].sendKeys('third answer');
                    fields[1].sendKeys('third explanation');
                });
            });
        });
    });
}

function doSave(ptor) {
    it('should save', function() {
        ptor.findElement(protractor.By.id('done')).then(function(save) {
            save.click().then(function() {
                feedback(ptor, 'saved')
            });
        });
    });
}