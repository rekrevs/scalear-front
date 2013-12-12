var current_date = new Date();
var enroll_key = '';
var names = new Array ();
var fetched_data = new Array();
var enroll_key = '';

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
        driver.get("http://localhost:9000/#/login");
//        driver.get("http://angular-edu.herokuapp.com/#/login");
        ptor.findElement(protractor.By.className('btn')).then(function(login_button){
            login_button.click();
        });
        findByName("user[email]").sendKeys(email);
        findByName("user[password]").sendKeys(password);
        findByName("commit").click();
        ptor.findElements(protractor.By.tagName('a')).then(function(tags){
            expect(tags[3].getText()).toContain(name);
        });
    });
}

function logout(ptor, driver){
    it('should logout', function(){
        ptor.findElements(protractor.By.tagName('a')).then(function(logout){
            logout[5].click();
            logout[5].getText().then(function(value){
                console.log(value+'here');
            })
        });
        ptor.sleep(2000);
        driver.get("http://localhost:4000/");
//        driver.get("http://scalear-auth.herokuapp.com");

        driver.findElements(protractor.By.tagName('a')).then(function(logout){
            logout[4].getText().then(function(value){
                console.log(value+'there');
            })
            logout[4].click();
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

    login(ptor, driver, 'admin@scalear.com', 'password', 'Administrator', findByName);

    describe('Teacher', function(){
        it('should go to course\'s announcements page', function(){
            var ptor = protractor.getInstance();
            ptor.get('/#/courses/134/announcements');
        });
    });
    it('should display current course announcements ordered by date', function(){
        ptor.findElements(protractor.By.repeater('announcement in announcements')).then(function(announcements){
            expect(announcements.length).toBe(5);
        });
    });
    doDeleteAnnouncements(ptor);
    expectNoAnnouncements(ptor);
    doRefresh(ptor);
    expectNoAnnouncements(ptor);
    addAnnouncement(ptor, driver, 'announcement 1');
    doClose(ptor);
    expectNoAnnouncements(ptor);

    addAnnouncement(ptor, driver, 'announcement 1');
    doSave(ptor);

    addAnnouncement(ptor, driver, 'announcement 2');
    doSave(ptor);

    addAnnouncement(ptor, driver, 'announcement 3');
    doSave(ptor);

    addAnnouncement(ptor, driver, 'announcement 4');
    doSave(ptor);

    addAnnouncement(ptor, driver, 'announcement 5');
    doSave(ptor);

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
    login(ptor, driver, 'bahia.sharkawy@gmail.com', 'password', 'Bahia', findByName);
    describe('Student', function(){
        it('should go to cource\'s events page', function(){
            var ptor = protractor.getInstance();
            ptor.get('/#/courses/134/student/events');
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
    login(ptor, driver, 'admin@scalear.com', 'password', 'Administrator', findByName);
//
    describe('Teacher', function(){
        it('should go to course\'s announcements page', function(){
            var ptor = protractor.getInstance();
            ptor.get('/#/courses/134/announcements');
        });
    });

//    editAnnouncements(ptor, driver, 'announcement');
    it('should allow editing the announcements', function(){
        ptor.findElements(protractor.By.binding('announcement.announcement')).then(function(announcements){
            announcements.forEach(function(announcement, i){
//                console.log(i);
                announcement.click();
                ptor.findElement(protractor.By.id('tinymce_body_ifr')).then(function(tinymce_ifr){
                    driver.switchTo().frame(tinymce_ifr);
                    driver.findElement(protractor.By.tagName("body")).then(function(field){
                        field.clear();
                        field.sendKeys((i+1)+' announcement');
                    });
                    driver.switchTo().defaultContent();
                });

                if(i == 0){
                    ptor.findElement(protractor.By.id('close_button')).then(function(close){
                        close.click();
                    });
                }
                else{
                    ptor.findElement(protractor.By.id('save_button')).then(function(save){
                        save.click();
                    });
                }
            });
        });
    });


//
    it('should display modified announcements', function(){
        ptor.findElements(protractor.By.repeater('announcement in announcements')).then(function(announcements){
            expect(announcements.length).toBe(5);
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
    doSave(ptor)
    it('should refuse to save because the announcement is empty', function(){
        ptor.findElement(protractor.By.className('errormessage')).then(function(message){
            expect(message.getText()).toContain('can\'t be blank');
        });
    });
    doClose(ptor);
//
    doRefresh(ptor);
//
    it('should display modified announcements after refresh', function(){
        ptor.findElements(protractor.By.repeater('announcement in announcements')).then(function(announcements){
            expect(announcements.length).toBe(5);
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
    login(ptor, driver, 'bahia.sharkawy@gmail.com', 'password', 'Bahia', findByName);
    describe('Student', function(){
        it('should go to cource\'s events page', function(){
            var ptor = protractor.getInstance();
            ptor.get('/#/courses/134/student/events');
        });
    });
    it('should display the announcements added by teacher', function(){
        ptor.findElements(protractor.By.repeater('a in announcements')).then(function(announcements){
            expect(announcements.length).toBe(5);
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
});

function doDeleteAnnouncements(ptor){
    it('should delete all announcements', function(){
        ptor.findElements(protractor.By.className('delete_image')).then(function(delete_buttons){
            delete_buttons.forEach(function(button, i){
                button.click();
                var alert_dialog = ptor.switchTo().alert();
                alert_dialog.accept();
            });
        });
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
        ptor.findElement(protractor.By.id('tinymce_body_ifr')).then(function(tinymce_ifr){
            ptor.switchTo().frame(tinymce_ifr);
            driver.findElement(protractor.By.tagName("body")).sendKeys(body);
            driver.switchTo().defaultContent();
        });
    });
}

function editAnnouncements(ptor, driver, body){
    it('should allow editing the announcements', function(){
        ptor.findElements(protractor.By.binding('announcement.announcement')).then(function(announcements){
            announcements.forEach(function(announcement, i){
                announcement.click().then(function(){
                    ptor.findElement(protractor.By.id('tinymce_body_ifr')).then(function(tinymce_ifr){
                        ptor.switchTo().frame(tinymce_ifr);
                        driver.findElement(protractor.By.tagName("body")).then(function(field){
                            field.clear();
                            field.sendKeys((i+1)+' '+body);
                        });
                        driver.switchTo().defaultContent();
                    });
                });
                if(i == 0){
                    doClose(ptor);
                }
                else{
                    doSave(ptor);
                }
            });
        });
    });
}

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
            save.click();
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