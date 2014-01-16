var util = require('util');

var frontend = 'http://localhost:9000/';
var backend = 'http://localhost:3000/';
var auth = 'http://localhost:4000/';

var enroll_key = '', course_id = '';
function getNextDay(date){
    var result = date;
    result.setTime(date.getTime() + 86400000);
    return result;
}
function formatDate(date, which){
    var dd = date.getDate();
    if(dd < 10){
        dd = '0'+dd;
    }
    var mm = date.getMonth()+1;
    if(mm < 10)
        mm = '0'+mm
    var yyyy = date.getFullYear();
    if(which == 0){
        return mm+'/'+dd.toString()+'/'+yyyy;
    }
    else if(which == 1){
        return dd+'/'+mm+'/'+yyyy;
    }
}


var today_keys = formatDate(new Date(), 0);
var today = formatDate(new Date(), 1);
var tomorrow_keys = formatDate(getNextDay(new Date()), 0);
var tomorrow = formatDate(getNextDay(new Date()), 1);

function login(ptor, driver, email, password, name, findByName){
    it('should login', function(){
        driver.get(ptor.params.auth+'users/sign_in');
        findByName("user[email]").sendKeys(email);
        findByName("user[password]").sendKeys(password);
        findByName("commit").click();
        driver.get(ptor.params.frontend).then(function(){
            ptor.findElements(protractor.By.tagName('a')).then(function(tags){
                tags[3].getText().then(function(value){
                    expect(value.toLowerCase()).toContain(name.toLowerCase());
                });
            });
        });
    });
}

function logout(ptor, driver){
    it('should logout', function(){
        ptor.findElement(protractor.By.linkText('Logout')).then(function(link){
            link.click().then(function(){
                driver.findElement(protractor.By.id('flash_notice')).then(function(notice){
                    expect(notice.getText()).toContain('Signed out successfully.');
                });
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


describe("Course Information Pages",function(){
    var ptor = protractor.getInstance();
    var driver = ptor.driver;

    var findByName = function(name){
        return driver.findElement(protractor.By.name(name));
    };
    var findById = function(id){
        return driver.findElement(protractor.By.id(id))
    };

//    login(ptor, driver, 'admin@scalear.com', 'password', 'Administrator', findByName);
    login(ptor, driver, 'anyteacher@email.com', 'password', 'anyteacher', findByName);

    describe('Courses Page', function(){
        it('should create a new course', function(){
            browser.driver.manage().window().setSize(ptor.params.width, ptor.params.height);
            browser.driver.manage().window().setPosition(0, 0);
//            ptor = protractor.getInstance();
            ptor.get('/#/courses/new');
            ptor.findElements(protractor.By.tagName('input')).then(function(fields){
                fields[fields.length-1].click();
            });
            ptor.findElements(protractor.By.className('controls')).then(function(rows){
                expect(rows[0].getText()).toContain('Required');
                expect(rows[1].getText()).toContain('Required');
                //expect(rows[2].getText()).toContain('Required');
                expect(rows[3].getText()).toContain('Required');
                expect(rows[7].getText()).toContain('Required');
            });
            ptor.findElements(protractor.By.tagName('input')).then(function(fields){
                fields[0].sendKeys('TEST-101');
                fields[1].sendKeys('Z Testing Course');
                fields[2].clear()
                fields[2].sendKeys(today_keys);
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
                fields[fields.length-1].click();
            });
            feedback(ptor, 'Course was successfully created.');
        });
        it('should go to course information', function(){
            ptor.findElement(protractor.By.className('dropdown-toggle')).click();
            ptor.findElement(protractor.By.id('info')).click();
        });
    });
    describe('Teacher Course Information', function(){
        it('should save course id', function(){
            ptor.getCurrentUrl().then(function(text){
                course_id = text.split('/')[text.split('/').length-1];
            });
        })
        it('should show course short name and course title', function(){
            ptor.findElement(protractor.By.tagName('h3')).then(function(title){
                expect(title.getText()).toBe('TEST-101 | Z Testing Course');
            });
        });
        it('should display course enrollment key', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                data[0].getText().then(function(text){
                    enroll_key = text;
                });
            });
        });
        it('should display course start date', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                console.log(today)
                expect(data[1].getText()).toBe(today);
            });
        });
        it('should display course duration', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                expect(data[2].getText()).toBe('5 Weeks');
            });
        });
        it('should display course discussion forum link', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                expect(data[3].getText()).toBe('http://google.com/ | Visit Link');
            });
        });
        it('should display course Description', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                expect(data[4].getText()).toBe('new description');
            });
        });
        it('should display course prerequisites', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                expect(data[5].getText()).toBe('new prerequisites');
            });
        });
        it('should display course time zone', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                expect(data[6].getText()).toBe('Abu Dhabi');
            });
        });

        it('should edit start date', function(){
            ptor.executeScript('window.scrollBy(0, -1000)', '');
            ptor.findElement(protractor.By.tagName('details-date')).then(function(date_field){
                date_field.click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys(tomorrow_keys);
                });
                ptor.findElement(protractor.By.className('icon-remove')).click();
                expect(date_field.getText()).toBe(today);
                date_field.click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys('any text');
                });
                ptor.findElement(protractor.By.className('icon-ok')).click();
                expect(date_field.getText()).toBe(today);
                date_field.click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys(tomorrow_keys);
                });
                ptor.findElement(protractor.By.className('icon-ok')).click();
                feedback(ptor, 'Course was successfully updated.');
                expect(date_field.getText()).toBe(tomorrow);
            });
        });
        it('should edit duration', function(){
            ptor.findElement(protractor.By.tagName('details-text')).then(function(duration_field){
                duration_field.click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys('10');
                });
                ptor.findElement(protractor.By.className('icon-remove')).click();
                expect(duration_field.getText()).toBe('5');
                duration_field.click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys('any text');
                });
                ptor.findElement(protractor.By.className('icon-ok')).click();
                expect(duration_field.getText()).toBe('Duration is not a number');
                duration_field.click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys('-10');
                });
                ptor.findElement(protractor.By.className('icon-ok')).click();
                expect(duration_field.getText()).toBe('Duration must be greater than 0');
                duration_field.click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys('10');
                });
                ptor.findElement(protractor.By.className('icon-ok')).click();
                feedback(ptor, 'Course was successfully updated.');
                expect(duration_field.getText()).toBe('10');
            });
        });
        it('should edit discussion forum link', function(){
            ptor.findElements(protractor.By.tagName('details-text')).then(function(fields){
                fields[1].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys('http://www.anylink.com/');
                });
                ptor.findElement(protractor.By.className('icon-remove')).click();
                expect(fields[1].getText()).toBe('http://google.com/');
                fields[1].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys(' ');
                });
                ptor.findElement(protractor.By.className('icon-ok')).click();
                expect(fields[1].getText()).toBe('Empty');

                fields[1].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys('http://www.google.com');
                });
                ptor.findElement(protractor.By.className('icon-ok')).click();
                feedback(ptor, 'Course was successfully updated.');
                expect(fields[1].getText()).toBe('http://www.google.com');
            });
        });
        it('should edit course description', function(){
            ptor.findElements(protractor.By.tagName('big-area')).then(function(fields){
                fields[0].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys('anything');
                });
                ptor.findElement(protractor.By.className('icon-remove')).click();
                expect(fields[0].getText()).toBe('new description');

                fields[0].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys(' ');
                });
                ptor.findElement(protractor.By.className('icon-ok')).click();
                feedback(ptor, 'Course was successfully updated.');
                expect(fields[0].getText()).toBe('Empty');

                fields[0].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys('any description');
                });
                ptor.findElement(protractor.By.className('icon-ok')).click();
                feedback(ptor, 'Course was successfully updated.');
                expect(fields[0].getText()).toBe('any description');
            });
        });
        it('should edit course prerequisites', function(){
            ptor.findElements(protractor.By.tagName('big-area')).then(function(fields){
                fields[1].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys('anything');
                });
                ptor.findElement(protractor.By.className('icon-remove')).click();
                expect(fields[1].getText()).toBe('new prerequisites');

                fields[1].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys(' ');
                });
                ptor.findElement(protractor.By.className('icon-ok')).click();
                feedback(ptor, 'Course was successfully updated.');
                expect(fields[1].getText()).toBe('Empty');

                fields[1].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys('any prerequisites');
                });
                ptor.findElement(protractor.By.className('icon-ok')).click();
                feedback(ptor, 'Course was successfully updated.');
                expect(fields[1].getText()).toBe('any prerequisites');
            });
        });
        it('should edit course time zone', function(){
            ptor.findElement(protractor.By.tagName('details-time-zone')).then(function(field){
                field.click();
//                ptor.findElements(protractor.By.tagName('select')).then(function(dropdown){
//                    dropdown[0].click();
                    ptor.findElements(protractor.By.tagName('option')).then(function(options){
                        options[2].click();
                    });
//                });
                feedback(ptor, 'Course was successfully updated.');
                expect(field.getText()).toBe('Alaska')
            });
        });
        it('should refresh the page', function(){
            ptor.navigate().refresh();
        });
        it('should show course short name and course title after refresh', function(){
            ptor.findElement(protractor.By.tagName('h3')).then(function(title){
                expect(title.getText()).toBe('TEST-101 | Z Testing Course');
            });
        });

        it('should display course start date after refresh', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                expect(data[1].getText()).toBe(tomorrow);
            });
        });
        it('should display course duration after refresh', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                expect(data[2].getText()).toBe('10 Weeks');
            });
        });
        it('should display course discussion forum link after refresh', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                expect(data[3].getText()).toBe('http://www.google.com | Visit Link');
            });
        });
        it('should display course Description after refresh', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                expect(data[4].getText()).toBe('any description');
            });
        });
        it('should display course prerequisites after refresh', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                expect(data[5].getText()).toBe('any prerequisites');
            });
        });
        it('should display course time zone after refresh', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                expect(data[6].getText()).toBe('Alaska');
            });
        });
    });

    describe('Teacher Course Teachers', function(){
        it('should go to teachers', function(){
            ptor.findElement(protractor.By.className('dropdown-toggle')).click();
            ptor.findElement(protractor.By.id('teachers')).click();
        });
        it('should display the course teacher only', function(){
            ptor.findElements(protractor.By.id('teacher')).then(function(teachers){
                expect(teachers.length).toBe(1);
            });
        });
        it('should display teacher\'s email', function(){
            ptor.findElement(protractor.By.id('email')).then(function(email){
                expect(email.getText()).toBe('anyteacher@email.com');
            })
        });
        it('should display teacher\'s role', function(){
            ptor.findElement(protractor.By.id('role')).then(function(role){
                expect(role.getText()).toBe('Professor');
            });
        });
        it('should display teacher\'s status', function(){
            ptor.findElement(protractor.By.id('status')).then(function(status){
                expect(status.getText()).toBe('Owner');
            });
        });

        it('should add new row for teacher', function(){
            ptor.findElement(protractor.By.id('add_teacher')).then(function(add_teacher){
                add_teacher.click();
                ptor.findElements(protractor.By.id('new_teacher')).then(function(new_teachers){
                    expect(new_teachers.length).toBe(1);
                });
                add_teacher.click();
                add_teacher.click();
                ptor.findElements(protractor.By.id('new_teacher')).then(function(new_teachers){
                    expect(new_teachers.length).toBe(1);
                });
                ptor.findElements(protractor.By.className('delete')).then(function(delete_buttons){
                    delete_buttons[delete_buttons.length-1].click()
                })
                ptor.findElements(protractor.By.id('new_teacher')).then(function(new_teachers){
                    expect(new_teachers.length).toBe(0);
                });
            });
            ptor.findElement(protractor.By.id('add_teacher')).then(function(add_teacher){
                add_teacher.click();
                ptor.findElements(protractor.By.id('new_teacher')).then(function(new_teachers){
                    expect(new_teachers.length).toBe(1);
                });
                ptor.findElement(protractor.By.id('new_email')).then(function(email){
                    email.sendKeys('bahiafayez@hotmail.com');
                })
            })
//            ptor.findElement(protractor.By.tagName('select')).then(function(role){
//                role.click();
                ptor.findElements(protractor.By.tagName('option')).then(function(options){
                    options[1].click();
                });
//            })
            ptor.findElement(protractor.By.className('btn-primary')).click();
            feedback(ptor, 'Saved');
        });
        logout(ptor, driver);
        login(ptor, driver, 'bahiafayez@hotmail.com', 'password', 'bahia', findByName);
        it('should see notifications and reject the invitation', function(){
            ptor.findElement(protractor.By.linkText('Notifications')).then(function(link){
                link.click().then(function(){
                    ptor.findElement(protractor.By.className('modal')).then(function(modal){
                        expect(modal.getText()).toContain('by anyteacher, as a Professor');
                    });
                    ptor.findElement(protractor.By.className('btn-danger')).then(function(button){
                        button.click().then(function(){
                            feedback(ptor, 'rejected');
                        });
                    });
                });
            });
        });
        logout(ptor, driver);
        login(ptor, driver, 'anyteacher@email.com', 'password', 'anyteacher', findByName);
        it('should go to course teachers page', function(){
            ptor.get('/#/courses/'+course_id+'/teachers');
        });
        it('should display only one teacher', function(){
            ptor.findElements(protractor.By.id('email')).then(function(teachers){
                expect(teachers.length).toBe(1);
            });
        });
        it('should add another row for teacher', function(){
            ptor.findElement(protractor.By.id('add_teacher')).then(function(add_teacher){
                add_teacher.click();
                ptor.findElements(protractor.By.id('new_teacher')).then(function(new_teachers){
                    expect(new_teachers.length).toBe(1);
                });
                ptor.findElement(protractor.By.id('new_email')).then(function(email){
                    email.sendKeys('bahiafayez@hotmail.com');
                });
            })
//            ptor.findElement(protractor.By.tagName('select')).then(function(role){
//                role.click();
                ptor.findElements(protractor.By.tagName('option')).then(function(options){
                    options[options.length-1].click();
                });
//            })
            ptor.findElement(protractor.By.className('btn-primary')).click();
            feedback(ptor, 'Saved');
        });
        logout(ptor, driver);
        login(ptor, driver, 'bahiafayez@hotmail.com', 'password', 'bahia', findByName);
        it('should see notifications and accept the invitation', function(){
            ptor.findElement(protractor.By.linkText('Notifications')).then(function(link){
                link.click().then(function(){
                    ptor.findElement(protractor.By.className('modal')).then(function(modal){
                        expect(modal.getText()).toContain('by anyteacher, as a Teacher Assistant');
                    });
                    ptor.findElement(protractor.By.className('btn-primary')).then(function(button){
                        button.click().then(function(){
                            feedback(ptor, 'You have accepted the invitation');
                        });
                    });
                });
            });
        });
        logout(ptor, driver);
        login(ptor, driver, 'anyteacher@email.com', 'password', 'anyteacher', findByName);
        it('should go to course teachers page', function(){
            ptor.get('/#/courses/'+course_id+'/teachers');
        });
        it('should display two teachers', function(){
            ptor.findElements(protractor.By.id('email')).then(function(teachers){
                expect(teachers.length).toBe(2);
            });
        });
        it('should display teachers\' emails', function(){
            ptor.findElements(protractor.By.id('email')).then(function(emails){
                expect(emails[0].getText()).toBe('anyteacher@email.com');
                expect(emails[1].getText()).toBe('bahiafayez@hotmail.com');
            });
        });
        it('should display teachers\' roles', function(){
            ptor.findElements(protractor.By.id('role')).then(function(roles){
                expect(roles[0].getText()).toBe('Professor');
                expect(roles[1].getText()).toBe('TA');
            });
        });
        it('should display teachers\' status', function(){
            ptor.findElements(protractor.By.id('status')).then(function(status){
                expect(status[0].getText()).toBe('Owner');
            });
        });
        it('should allow editing teachers\' roles', function(){
            ptor.findElements(protractor.By.tagName('details-select')).then(function(roles){
                roles[roles.length-1].click();
//                ptor.findElement(protractor.By.tagName('select')).then(function(select){
//                    select.click().then(function(){
                        ptor.findElements(protractor.By.tagName('option')).then(function(options){
                            options[options.length-2].click();
                        });
                        ptor.sleep(4000);
//                    });
//                })
            });
        });
        it('should refresh the page', function(){
            ptor.navigate().refresh();
        });
        it('should make sure that the role has changed', function(){
            ptor.findElements(protractor.By.id('role')).then(function(roles){
                expect(roles[roles.length-1].getText()).toBe('Professor');
            });
        });
        it('should delete a teacher', function(){
            ptor.findElements(protractor.By.className('delete')).then(function(delete_buttons){
                delete_buttons[delete_buttons.length-1].click();
                ptor.findElement(protractor.By.className('btn-danger')).then(function(button){
                    button.click().then(function(){
                        feedback(ptor, 'Teacher successfully removed from course');
                    });
                });
            });
            ptor.findElements(protractor.By.id('teacher')).then(function(teachers){
                expect(teachers.length).toBe(1);
            });
        });
        logout(ptor, driver);
    });
    describe('Student', function(){
        login(ptor, driver, 'anystudent@email.com', 'password', 'anystudent', findByName);
        it('should enroll in the course that was created', function(){
            ptor.findElement(protractor.By.id('join_course')).then(function(join_course){
                join_course.click();
            });
        });
//        it('should try to proceed without enrollment key', function(){
//            ptor.findElement(protractor.By.className('btn-primary')).then(function(proceed){
//                proceed.click();
//            });
////            ptor.findElement(protractor.By.className('help-inline')).then(function(validation){
////                expect(validation.getText()).toBe('Required!');
////            });
//        });
        it('should try to proceed with a wrong enrollment key', function(){
            ptor.findElement(protractor.By.tagName('input')).then(function(key_field){
                key_field.sendKeys('anykey');
            });
            ptor.findElement(protractor.By.className('btn-primary')).then(function(proceed){
                proceed.click();
            });
            ptor.findElement(protractor.By.className('errormessage')).then(function(validation){
                expect(validation.getText()).toBe('Course does not exist');
            });
        });
        it('should enter the enrollment key and proceed', function(){
            ptor.findElement(protractor.By.tagName('input')).then(function(key_field){
                key_field.clear();
                key_field.sendKeys(enroll_key);
            });
            ptor.findElement(protractor.By.className('btn-primary')).then(function(proceed){
                proceed.click().then(function(){
//                    feedback(ptor, 'Successfully Joined Course');
                    ptor.sleep(3000);
                });
            });
        });
//        it('should click on the course name', function(){
//            ptor.findElements(protractor.By.binding('course.name')).then(function(courses){
//                courses[courses.length-1].click();
//            });
////            ptor.findElements(protractor.By.binding('course.name')).then(function(links){
////                links[links.length-1].click();
////            });
////            ptor.sleep(20000);
//        });
        it('should go to course information page', function(){
//            ptor.findElement(protractor.By.id('course_information_link')).then(function(info_page){
//                info_page.click();
//            });
            ptor.get('/#/courses/'+course_id+'/course_information');
        });
    });
    describe('Course Information page', function(){
        it('should show course short name and course title', function(){
            ptor.findElement(protractor.By.tagName('h3')).then(function(title){
                expect(title.getText()).toBe('TEST-101 | Z Testing Course');
            });
        });
        it('should display correct start date', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                data[0].getText().then(function(text){
                    var start_date = new Date(text);
                    expect(formatDate(start_date, 1)).toBe(tomorrow);
                });
            });
        });
        it('should display correct course duration', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                expect(data[1].getText()).toContain('10');
            });
        });
        it('should display correct discussion forum link', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                expect(data[2].getText()).toBe('http://www.google.com');
            });
        });
        it('should display correct course description', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                expect(data[3].getText()).toBe('any description');
            });
        });
        it('should display correct course prerequisites', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                expect(data[4].getText()).toBe('any prerequisites');
            });
        });
    });
    describe('Student', function(){
        logout(ptor, driver);
    });
    describe('Student', function(){
        login(ptor, driver, 'bahia.sharkawy@gmail.com', 'password', 'Bahia', findByName);
        it('should enroll in the course that was created', function(){
            ptor.findElement(protractor.By.id('join_course')).then(function(join_course){
                join_course.click();
            });
        });
//        it('should try to proceed without enrollment key', function(){
//            ptor.findElement(protractor.By.className('btn-primary')).then(function(proceed){
//                proceed.click();
//            });
////            ptor.findElement(protractor.By.className('help-inline')).then(function(validation){
////                expect(validation.getText()).toBe('Required!');
////            });
//        });
        it('should try to proceed with a wrong enrollment key', function(){
            ptor.findElement(protractor.By.tagName('input')).then(function(key_field){
                key_field.sendKeys('anykey');
            });
            ptor.findElement(protractor.By.className('btn-primary')).then(function(proceed){
                proceed.click();
            });
            ptor.findElement(protractor.By.className('errormessage')).then(function(validation){
                expect(validation.getText()).toBe('Course does not exist');
            });
        });
        it('should enter the enrollment key and proceed', function(){
            ptor.findElement(protractor.By.tagName('input')).then(function(key_field){
                key_field.clear();
                key_field.sendKeys(enroll_key);
            });
            ptor.findElement(protractor.By.className('btn-primary')).then(function(proceed){
                proceed.click().then(function(){
//                    feedback(ptor, 'Successfully Joined Course');
                    ptor.sleep(3000);
                });
            });
        });
//        it('should click on the course name', function(){
//            ptor.findElements(protractor.By.binding('course.name')).then(function(courses){
//                courses[courses.length-1].click();
//            });
//        });
        it('should go to course information page', function(){
//            ptor.findElement(protractor.By.id('course_information_link')).then(function(info_page){
//                info_page.click();
//            });
            ptor.get('/#/courses/'+course_id+'/course_information');
        });
    });
    describe('Course Information page', function(){
        it('should show course short name and course title', function(){
            ptor.findElement(protractor.By.tagName('h3')).then(function(title){
                expect(title.getText()).toBe('TEST-101 | Z Testing Course');
            });
        });
        it('should display correct start date', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                data[0].getText().then(function(text){
                    var start_date = new Date(text);
                    expect(formatDate(start_date, 1)).toBe(tomorrow);
                });
            });
        });
        it('should display correct course duration', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                expect(data[1].getText()).toContain('10');
            });
        });
        it('should display correct discussion forum link', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                expect(data[2].getText()).toBe('http://www.google.com');
            });
        });
        it('should display correct course description', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                expect(data[3].getText()).toBe('any description');
            });
        });
        it('should display correct course prerequisites', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                expect(data[4].getText()).toBe('any prerequisites');
            });
        });
    });
    describe('Student', function(){
        logout(ptor, driver);
    });
    describe('Teacher', function(){
//        login(ptor, driver, 'admin@scalear.com', 'password', 'Administrator', findByName);
        login(ptor, driver, 'anyteacher@email.com', 'password', 'anyteacher', findByName);
        it('should go to enrolled students page', function(){
//            ptor.findElements(protractor.By.binding('course.name')).then(function(courses){
//                courses[courses.length-1].click();
//            });
//            ptor.findElements(protractor.By.tagName('a')).then(function(links){
//                links[links.length-6].click();
//            });
            ptor.get('/#/courses/'+course_id+'/enrolled_students');
        });
//        it('should go to enrolled students page', function(){
//            ptor.executeScript('window.scrollBy(0, -1000)', '');
//            ptor.findElement(protractor.By.className('dropdown-toggle')).click();
//            ptor.findElement(protractor.By.id('enrolled')).click();
//        });
    });
    describe('Enrolled Students Page', function(){
        it('should display all enrolled students in the course', function(){
            ptor.findElements(protractor.By.tagName('tr')).then(function(rows){
                expect(rows.length).toBe(3);
            });
            ptor.findElements(protractor.By.tagName('td')).then(function(data){
                expect(data[0].getText()).toBe('anystudent');
                expect(data[1].getText()).toBe('anystudent@email.com');
                expect(data[4].getText()).toBe('Bahia');
                expect(data[5].getText()).toBe('bahia.sharkawy@gmail.com');
            });
        });
        it('should filter the students according to the search text', function(){
            ptor.findElement(protractor.By.id('search')).then(function(search_field){
                search_field.sendKeys('anything');
                ptor.findElements(protractor.By.tagName('tr')).then(function(rows){
                    expect(rows.length).toBe(1);
                });
                search_field.clear();
                search_field.sendKeys('anystudent');
                ptor.findElements(protractor.By.tagName('tr')).then(function(rows){
                    expect(rows.length).toBe(2);
                });
                ptor.findElements(protractor.By.tagName('td')).then(function(data){
                    expect(data[0].getText()).toBe('anystudent');
                    expect(data[1].getText()).toBe('anystudent@email.com');
                });
                search_field.clear();
                search_field.sendKeys('bahia');
                ptor.findElements(protractor.By.tagName('tr')).then(function(rows){
                    expect(rows.length).toBe(2);
                });
                ptor.findElements(protractor.By.tagName('td')).then(function(data){
//                    expect(data[0].getText()).toBe('Bahia');
                    expect(data[0].getText()).toBe('Bahia');
                    expect(data[1].getText()).toBe('bahia.sharkawy@gmail.com');
                });
            });
        });
        it('should allow emailing one student', function(){
            ptor.findElement(protractor.By.id('email_address')).then(function(email){
                email.click();
            });
            ptor.findElement(protractor.By.id('to')).then(function(email_field){
                expect(email_field.getAttribute('value')).toContain('bahia.sharkawy@gmail.com');
            });
        });

        it('should enter email subject', function(){
            ptor.findElement(protractor.By.id('subject')).then(function(subject_field){
                subject_field.sendKeys('any subject');
            });
        });
        it('should enter email body', function(){
            ptor.findElement(protractor.By.className('ta-editor')).then(function(ta_editor){
                //ptor.switchTo().frame(ta-editor);
                ta_editor.sendKeys('anything');
                //driver.switchTo().defaultContent();
//                ptor.findElement(protractor.By.tagName('body')).then(function(body_field){
//                    body_field.sendKeys(('anything'));
//                });
            });

        });
        it('should send the email', function(){
            ptor.findElement(protractor.By.id('send_emails')).click().then(function(){
                feedback(ptor, 'Email will be sent shortly');
            });
        });

        it('should allow emailing several students', function(){
            ptor.findElements(protractor.By.className('checks')).then(function(checkboxes){
                expect(checkboxes.length).toBe(2);
                checkboxes[0].click();
                checkboxes[1].click();
            });
            ptor.findElement(protractor.By.id('email_button')).then(function(email_button){
                email_button.click();
            });
            ptor.findElement(protractor.By.id('to')).then(function(email_field){
                expect(email_field.getAttribute('value')).toBe('bahia.sharkawy@gmail.com; anystudent@email.com; ');
            });
        });
        it('should enter email subject', function(){
            ptor.findElement(protractor.By.id('subject')).then(function(subject_field){
                subject_field.sendKeys('any subject');
            });
        });
        it('should enter email body', function(){
            ptor.findElement(protractor.By.className('ta-editor')).then(function(ta_editor){
                //ptor.switchTo().frame(ta-editor);
                ta_editor.sendKeys('anything');
                //driver.switchTo().defaultContent();
//                ptor.findElement(protractor.By.tagName('body')).then(function(body_field){
//                    body_field.sendKeys(('anything'));
//                });
            });
        });
        it('should send the email', function(){
            ptor.findElement(protractor.By.id('send_emails')).click().then(function(){
                feedback(ptor, 'Email will be sent shortly');
            });
        });

        it('should allow removing students from course', function(){
            ptor.findElements(protractor.By.className('delete')).then(function(delete_buttons){
                delete_buttons[delete_buttons.length-1].click();
//                var alert_dialog = ptor.switchTo().alert();
//                alert_dialog.accept();
                ptor.findElement(protractor.By.className('btn-danger')).then(function(button){
                    button.click().then(function(){
                        feedback(ptor, 'was removed from Course');
                    });
                });
            });
            ptor.findElements(protractor.By.className('delete')).then(function(delete_buttons){
                delete_buttons[delete_buttons.length-1].click();
//                var alert_dialog = ptor.switchTo().alert();
//                alert_dialog.accept();
                ptor.findElement(protractor.By.className('btn-danger')).then(function(button){
                    button.click().then(function(){
                        feedback(ptor, 'was removed from Course');
                    });
                });
            });
            ptor.findElements(protractor.By.tagName('tr')).then(function(rows){
                expect(rows.length).toBe(1);
            });
            // ptor.findElements(protractor.By.id('remove_button')).then(function(remove){
            //     remove[0].click();
            //     var alert_dialog = ptor.switchTo().alert();
            //     alert_dialog.accept();
            //     remove[1].click();
            //     alert_dialog = ptor.switchTo().alert();
            //     alert_dialog.accept();
            //     ptor.findElements(protractor.By.tagName('tr')).then(function(rows){
            //         expect(rows.length).toBe(1);
            //     });
            // });
        });

        it('should refresh the page', function(){
            ptor.navigate().refresh();
        });
        it('should display no students enrolled under the course', function(){
            ptor.findElements(protractor.By.tagName('tr')).then(function(rows){
                expect(rows.length).toBe(1);
            });
        });

    });

    describe('Teacher', function(){
        it('should navigate to courses list page', function(){
            ptor.get('/#/courses');
        });
        it('should delete the created course', function(){
           ptor.findElements(protractor.By.className('delete')).then(function(delete_buttons){
                delete_buttons[delete_buttons.length-1].click();
//                var alert_dialog = ptor.switchTo().alert();
//                alert_dialog.accept();
                ptor.findElement(protractor.By.className('btn-danger')).then(function(button){
                    button.click().then(function(){
                        feedback(ptor, 'Course was successfully deleted.');
                    });
                });
            });
            // ptor.findElements(protractor.By.className('delete_image')).then(function(delete_buttons){
            //     delete_buttons[delete_buttons.length-1].click();
            //     var alert_dialog = ptor.switchTo().alert();
            //     alert_dialog.accept();
            //     ptor.sleep(1000);
            // });
        });
        logout(ptor, driver);
    });
});



