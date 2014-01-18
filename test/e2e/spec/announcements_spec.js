var util = require('util');
var enroll_key = '';
var names = new Array ();
var course_id = '';

//var frontend = 'http://localhost:9000/';
//var backend = 'http://localhost:3000/';
//var auth = 'http://localhost:4000/';

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

describe('Announcements Page', function(){
    var ptor = protractor.getInstance();
    var driver = ptor.driver;

    var findByName = function(name){
        return driver.findElement(protractor.By.name(name));
    };
    var findById = function(id){
        return driver.findElement(protractor.By.id(id))
    };

    login(ptor, driver, 'anyteacher@email.com', 'password', 'anyteacher', findByName);

    describe('Teacher', function(){
        it('should create a new course', function(){
            browser.driver.manage().window().setSize(ptor.params.width, ptor.params.height);
            browser.driver.manage().window().setPosition(0, 0);
            ptor = protractor.getInstance();
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
                fields[1].sendKeys('ZZ');
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
//                console.log('course id is : '+course_id);
            });
        });
        it('should go to course\'s announcements page', function(){
//            ptor.findElement(protractor.By.id('announcements_link')).then(function(link){
//                link.click();
//            });
            ptor.get('/#/courses/'+course_id+'/announcements');
        });
    });
    it('should display current course announcements ordered by date', function(){
        ptor.findElements(protractor.By.repeater('announcement in announcements')).then(function(announcements){
            expect(announcements.length).toBe(0);
        });
    });
    expectNoAnnouncements(ptor);
    doRefresh(ptor);
    expectNoAnnouncements(ptor);
    addAnnouncement(ptor, driver, 'announcement 1');
    doClose(ptor);
    expectNoAnnouncements(ptor);

    addAnnouncement(ptor, driver, 'announcement 1');
    doSave(ptor);
    it('should display server\'s confirmation', function(){
        feedback(ptor, 'Announcement was successfully created.');
    });

    addAnnouncement(ptor, driver, 'announcement 2');
    doSave(ptor);
    it('should display server\'s confirmation', function(){
        feedback(ptor, 'Announcement was successfully created.');
    });

    addAnnouncement(ptor, driver, 'announcement 3');
    doSave(ptor);
    it('should display server\'s confirmation', function(){
        feedback(ptor, 'Announcement was successfully created.');
    });

    addAnnouncement(ptor, driver, 'announcement 4');
    doSave(ptor);
    it('should display server\'s confirmation', function(){
        feedback(ptor, 'Announcement was successfully created.');
    });

    addAnnouncement(ptor, driver, 'announcement 5');
    doSave(ptor);
    it('should display server\'s confirmation', function(){
        feedback(ptor, 'Announcement was successfully created.');
    });

    it('should display the added announcements', function(){
        ptor.findElements(protractor.By.repeater('announcement in announcements')).then(function(announcements){
            expect(announcements.length).toBe(5);
        });
        ptor.findElements(protractor.By.binding('announcement.announcement')).then(function(announcements){
            announcements.forEach(function(announcement, i){
                expect(announcement.getText()).toBe('announcement '+(i+1));
            });
        });
    });

    doRefresh(ptor);

    it('should display the added announcements after refresh', function(){
        ptor.findElements(protractor.By.repeater('announcement in announcements')).then(function(announcements){
            expect(announcements.length).toBe(5);
        });
        ptor.findElements(protractor.By.binding('announcement.announcement')).then(function(announcements){
            announcements.forEach(function(announcement, i){
                expect(announcement.getText()).toBe('announcement '+(i+1));
            });
        });
    });

    logout(ptor, driver);
    login(ptor, driver, 'menshawi@guerrillamail.com', 'password', 'menshawi', findByName);
    describe('Student', function(){
        it('should enroll in the course that was created', function(){
            ptor.findElement(protractor.By.id('join_course')).then(function(join_course){
                join_course.click();
            });
        });
        it('should enter the enrollment key and proceed', function(){
            ptor.findElement(protractor.By.tagName('input')).then(function(key_field){
                key_field.clear();
                key_field.sendKeys(enroll_key);
            });
            ptor.findElement(protractor.By.className('btn-primary')).then(function(proceed){
                proceed.click().then(function(){
                    ptor.sleep(3000);
                });
            });
        });
//        it('should click on the course name', function(){
//            ptor.findElements(protractor.By.binding('course.name')).then(function(courses){
//                courses[courses.length-1].click();
//            });
//        });
        it('should go to course\'s events page', function(){
//            ptor.findElement(protractor.By.id('calendar_link')).then(function(link){
//                link.click();
//            });
            ptor.get('/#/courses/'+course_id+'/student/events');
        });
    });
    it('should display the announcements added by teacher', function(){
        ptor.findElements(protractor.By.repeater('a in announcements')).then(function(announcements){
            expect(announcements.length).toBe(5);
        });
        ptor.findElements(protractor.By.binding('a.announcement')).then(function(announcements){
            announcements.reverse();
            announcements.forEach(function(announcement, i){
                expect(announcement.getText()).toBe('announcement '+(i+1));
            });
        });
    });
    logout(ptor, driver);
//
    login(ptor, driver, 'anyteacher@email.com', 'password', 'anyteacher', findByName);
//
    describe('Teacher', function(){
//        it('should click on the course name', function(){
//            ptor.findElements(protractor.By.binding('course.name')).then(function(courses){
//                courses[courses.length-1].click();
//            });
//        });
        it('should go to course\'s announcements page', function(){
//            ptor.findElement(protractor.By.id('announcements_link')).then(function(link){
//                link.click();
//            });
            ptor.get('/#/courses/'+course_id+'/announcements');
        });
    });

//    editAnnouncements(ptor, driver, 'announcement');
    it('should allow editing the announcements', function(){
        ptor.findElements(protractor.By.binding('announcement.announcement')).then(function(announcements){
            announcements.forEach(function(announcement, i){
//                console.log(i);
                announcement.click();
//                ptor.findElement(protractor.By.id('tinymce_body_ifr')).then(function(tinymce_ifr){
//                    driver.switchTo().frame(tinymce_ifr);
                    ptor.findElement(protractor.By.className("ta-editor")).then(function(field){
                        field.clear();
                        field.sendKeys((i+1)+' announcement');
                    });
//                    driver.switchTo().defaultContent();
//                });

                if(i == 0){
                    ptor.findElement(protractor.By.id('close_button')).then(function(close){
                        close.click();
                    });
                }
                else{
                    ptor.findElement(protractor.By.id('save_button')).then(function(save){
                        save.click().then(function(){
                            feedback(ptor, 'Announcement was successfully updated.');
                        });

                    });
                }
            });
        });
    });
    addAnnouncement(ptor, driver, '6 announcement');
    doSave(ptor);
    it('should display server\'s confirmation', function(){
        feedback(ptor, 'Announcement was successfully created.');
    });


//
    it('should display modified announcements', function(){
        ptor.findElements(protractor.By.repeater('announcement in announcements')).then(function(announcements){
            expect(announcements.length).toBe(6);
        });
        ptor.findElements(protractor.By.binding('announcement.announcement')).then(function(announcements){
            announcements.forEach(function(announcement, i){
                if(i == 0){
                    expect(announcement.getText()).toBe('announcement '+(i+1));
                }
                else{
                    expect(announcement.getText()).toContain((i+1)+' announcement');
                }
            });
        });
    });

    addAnnouncement(ptor, driver, '');
    it('should try to save', function(){
        ptor.findElement(protractor.By.id('save_button')).then(function(save){
            save.click();
        });
    })
    it('should refuse to save because the announcement is empty', function(){
        ptor.sleep(1000);
        ptor.findElements(protractor.By.className('errormessage')).then(function(messages){
            expect(messages[messages.length-1].getText()).toContain('can\'t be blank');
        });
    });
    doClose(ptor);
//
    doRefresh(ptor);
//
    it('should display modified announcements after refresh', function(){
        ptor.findElements(protractor.By.repeater('announcement in announcements')).then(function(announcements){
            expect(announcements.length).toBe(6);
        });
        ptor.findElements(protractor.By.binding('announcement.announcement')).then(function(announcements){
            announcements.forEach(function(announcement, i){
                if(i == 0){
                    expect(announcement.getText()).toBe('announcement '+(i+1));
                }
                else{
                    expect(announcement.getText()).toContain((i+1)+' announcement');
                }
            });
        });
    });
//
    logout(ptor, driver);
    login(ptor, driver, 'menshawi@guerrillamail.com', 'password', 'menshawi', findByName);
    describe('Student', function(){
//        it('should click on the course name', function(){
//            ptor.findElements(protractor.By.binding('course.name')).then(function(courses){
//                courses[courses.length-1].click();
//            });
//        });
        it('should go to course\'s events page', function(){
//            ptor.findElement(protractor.By.id('calendar_link')).then(function(link){
//                link.click();
//            });
            ptor.get('/#/courses/'+course_id+'/student/events');
        });
    });
    it('should display the announcements added by teacher after modification', function(){
        ptor.findElements(protractor.By.repeater('a in announcements')).then(function(announcements){
            expect(announcements.length).toBe(6);
        });
        ptor.findElements(protractor.By.binding('a.announcement')).then(function(announcements){
            announcements.reverse();
            announcements.forEach(function(announcement, i){
                if(i == 0){
                    expect(announcement.getText()).toBe('announcement '+(i+1));
                }
                else{
                    expect(announcement.getText()).toContain((i+1)+' announcement');
                }
            });
        });
    });
    logout(ptor, driver);
    login(ptor, driver, 'anyteacher@email.com', 'password', 'anyteacher', findByName);
    doDeleteAnnouncements(ptor);
    describe('Teacher', function(){
        it('should navigate to courses list page', function(){
            ptor.get('/#/courses');
        });
        it('should delete the created course', function(){
            ptor.findElements(protractor.By.className('delete')).then(function(delete_buttons){
                delete_buttons[delete_buttons.length-1].click();
                ptor.findElement(protractor.By.className('btn-danger')).then(function(button){
                    button.click().then(function(){
                        feedback(ptor, 'Course was successfully deleted.');
                    });
                });
            });
        });
        logout(ptor, driver);
    });
});

function scroll(ptor, value){
    it('should scroll by '+value, function(){
        ptor.executeScript('window.scrollBy(0, '+value+')', '');
    });
}

function doDeleteAnnouncements(ptor){
    it('should go to course\'s announcements page', function(){
        ptor.get('/#/courses/'+course_id+'/announcements');
//        ptor.findElement(protractor.By.id('announcements_link')).then(function(link){
//            link.click();
//        });
    });
    it('should delete all announcements', function(){
        ptor.findElements(protractor.By.className('delete')).then(function(delete_buttons){
            delete_buttons.forEach(function(button, i){
                button.click();
                ptor.findElement(protractor.By.className('btn-danger')).then(function(button){
                    button.click();
                    feedback(ptor, 'Announcement was successfully deleted.');
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

function doRefresh(ptor){
    it('should refresh the page', function(){
        ptor.navigate().refresh();
    });
}

function addAnnouncement(ptor, driver, body){
    it('should add a new announcement', function(){
        ptor.findElement(protractor.By.id('new_announcement')).then(function(add_button){
            add_button.click();
        });
//        ptor.findElement(protractor.By.id('tinymce_body_ifr')).then(function(tinymce_ifr){
//            ptor.switchTo().frame(tinymce_ifr);
//            driver.findElement(protractor.By.tagName("body")).sendKeys(body);
//            driver.switchTo().defaultContent();
//        });
        ptor.findElement(protractor.By.className('ta-editor')).then(function(field){
            field.sendKeys(body);
        });
    });
}

//function editAnnouncements(ptor, driver, body){
//    it('should allow editing the announcements', function(){
//        ptor.findElements(protractor.By.binding('announcement.announcement')).then(function(announcements){
//            announcements.forEach(function(announcement, i){
//                announcement.click().then(function(){
//                    ptor.findElement(protractor.By.id('tinymce_body_ifr')).then(function(tinymce_ifr){
//                        ptor.switchTo().frame(tinymce_ifr);
//                        driver.findElement(protractor.By.tagName("body")).then(function(field){
//                            field.clear();
//                            field.sendKeys((i+1)+' '+body);
//                        });
//                        driver.switchTo().defaultContent();
//                    });
//                });
//                if(i == 0){
//                    doClose(ptor);
//                }
//                else{
//                    doSave(ptor);
//                }
//            });
//        });
//    });
//}

function expectNoAnnouncements(ptor){
    it('should display no announcements at all', function(){
        ptor.findElements(protractor.By.repeater('announcement in announcements')).then(function(announcements){
            expect(announcements.length).toBe(0);
        });
    });
}

function doSave(ptor){
    it('should save the announcement', function(){
        ptor.findElement(protractor.By.id('save_button')).then(function(save){
            save.click().then(function(){
                ptor.findElements(protractor.By.repeater('announcement in announcements')).then(function(announcements){
                    announcements[announcements.length-1].getText().then(function(text){
                        console.log(text);
                    });
                })
            });
        });
    })
}

function doClose(ptor){
    it('should close the announcement', function(){
        ptor.findElement(protractor.By.id('close_button')).then(function(close){
            close.click();
        });
    })
}