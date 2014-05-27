var ptor = protractor.getInstance();
var locator = require('./locators');
var o_c = require('./openers_and_clickers');
var params = ptor.params;

//====================================================
//               open the first course
//====================================================
exports.open_course = function(ptor){
    locator.by_partial_text(ptor, '|').then(function(course){
    course[0].click();
 })
}

//====================================================
//               open course by name
//====================================================
exports.open_course_by_name = function(ptor, course_name){
    locator.by_partial_text(ptor, course_name).then(function(course){
        course.click();
    })
}

//====================================================
//              open course whole-box way
//====================================================
exports.open_course_whole = function(ptor){
    locator.s_by_classname(ptor, 'whole-box').then(function(course){
        course[0].click();
    })
}

//====================================================
//                      sign in
//====================================================
exports.sign_in = function(ptor, email, password, feedback){
    ptor.get(params.frontend);
    ptor.sleep(1000);
    ptor.findElement(protractor.By.id('user_email')).then(function(email_field) {
        email_field.sendKeys(email);
    });
    ptor.findElement(protractor.By.id('user_passowrd')).then(function(password_field) {
        password_field.sendKeys(password);
    });

    ptor.findElement(protractor.By.xpath('//*[@id="main"]/div/div[1]/div/div/center/div[3]/form/div/table/tbody/tr/td[3]/table/tbody/tr[3]/td/input')).then(function(fields){
        fields.click().then(function() {
            feedback(ptor, 'Signed in successfully');
        });
    });
}

//====================================================
//                      sign up
//====================================================
exports.sign_up = function(ptor, screen_name, fname, lname, studentmail, univer, biog, webs, password, feedback){
    ptor.get(params.frontend+'/users/student');

    ptor.findElement(protractor.By.id('screen_name')).then(function(screenname) {
            screenname.sendKeys(screen_name);
        });
    ptor.findElement(protractor.By.id('name')).then(function(name) {
            name.sendKeys(fname);
        });
    ptor.findElement(protractor.By.id('last_name')).then(function(lastname) {
            lastname.sendKeys(lname);
        });
    ptor.findElement(protractor.By.id('user_email')).then(function(email) {
            email.sendKeys(studentmail);
        });
    ptor.findElement(protractor.By.id('university')).then(function(uni) {
            uni.sendKeys(univer);
        });
    ptor.findElement(protractor.By.id('bio')).then(function(bio) {
            bio.sendKeys(biog);
        });
    ptor.findElement(protractor.By.id('link')).then(function(website) {
            website.sendKeys(webs);
        });
    ptor.findElements(protractor.By.id('user_passowrd')).then(function(pass) {
            console.log("number of element with id = user_passowrd = "+pass.length);
            pass[0].sendKeys(password);
            pass[1].sendKeys(password);
        });
    ptor.findElement(protractor.By.id('signup_btn')).then(function(signup_btn){
        signup_btn.click().then(function(){
            feedback(ptor, 'A message with a confirmation link has been sent to your email address. Please open the link to activate your account.');
        });
    });
}
//====================================================
//                 confirm account
//====================================================
exports.confirm_account = function(ptor, smail, feedback){
    ptor.driver.get('https://www.guerrillamail.com/inbox');
        ptor.driver.findElement(protractor.By.id("inbox-id")).then(function(inbox){
            inbox.click().then(function(){
                ptor.driver.findElement(protractor.By.xpath('//*[@id="inbox-id"]/input')).then(function(mail){
                    mail.sendKeys(smail.split('@')[0]).then(function(){
                        ptor.driver.findElement(protractor.By.xpath('//*[@id="inbox-id"]/button[1]')).then(function(set_btn){
                            set_btn.click().then(function(){
                                ptor.driver.findElement(protractor.By.id('use-alias')).then(function(check_scram){
                                    check_scram.click().then(function(){
                                        ptor.driver.sleep(11000);
                                        ptor.driver.findElements(protractor.By.tagName('td')).then(function(emails){
                                            console.log(emails.length);
                                            emails[1].click();
                                            ptor.driver.sleep(3000).then(function(){
                                                ptor.driver.findElement(protractor.By.partialLinkText('confirmation?confirmation_token')).then(function(link){
                                                    link.getAttribute('href').then(function(confirm_link){
                                                        var final_link = params.frontend+confirm_link.split('.com/#')[1];
                                                        ptor.driver.get(final_link).then(function(){
                                                            feedback(ptor, 'Your account was successfully confirmed. You are now signed in.');
                                                            ptor.driver.sleep(7000)
                                                            ptor.navigate().refresh();
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                });
           })
       })
}

//====================================================
//                    feedback
//====================================================
exports.feedback = function(ptor, message){
    ptor.wait(function() {
        return ptor.findElement(protractor.By.id('error_container')).then(function(message) {
            return message.getText().then(function(text) {
                //console.log(text);
                if (text.length > 2) {
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

//====================================================
//                 open main app menu
//====================================================
exports.open_tray = function(ptor){
    ptor.findElement(protractor.By.className('menu-icon')).then(function(toggler) {
        toggler.click()
        ptor.sleep(1000);
    });
}

//====================================================
//          press course information button
//====================================================
exports.open_info = function(ptor){
    ptor.findElement(protractor.By.id("student_info")).then(function(btn){
        btn.click();
        ptor.getCurrentUrl().then(function(url) {
            expect(url).toContain('course_information');
        });
    })
}

exports.open_info_teacher = function(ptor){
    ptor.findElement(protractor.By.id("teacher_info")).then(function(btn){
        btn.click();
    })
}

exports.open_announcements_teacher = function(ptor){
    ptor.findElement(protractor.By.id("announcements")).then(function(btn){
        btn.click();
    })
}

//====================================================
//               press calendar button
//====================================================
exports.open_calendar = function(ptor){
    info_icon = ptor.findElement(protractor.By.id("student_calendar")).then(function(btn){
        btn.click();
        ptor.getCurrentUrl().then(function(url) {
            expect(url).toContain('events');
        });
    })
}

exports.open_calendar_teacher = function(ptor){
    info_icon = ptor.findElement(protractor.By.id("teacher_calendar")).then(function(btn){
        btn.click();
        ptor.getCurrentUrl().then(function(url) {
            expect(url).toContain('events');
        });
    })
}
//====================================================
//               press lectures button
//====================================================
exports.open_lectures = function(ptor){
    info_icon = ptor.findElement(protractor.By.id("lectures")).then(function(btn){
        btn.click();
        ptor.getCurrentUrl().then(function(url) {
            expect(url).toContain('courseware');
        });
    })
}

exports.open_course_editor = function(ptor){
    ptor.findElement(protractor.By.id("content")).then(function(btn){
        btn.click();
        ptor.getCurrentUrl().then(function(url) {
            expect(url).toContain('course_editor');
        });
    })
}

//====================================================
//          open enrolled students page
//====================================================
exports.open_enrolled = function(ptor){
    info_icon = ptor.findElement(protractor.By.id("students")).then(function(btn){
        btn.click();
        ptor.getCurrentUrl().then(function(url) {
            expect(url).toContain('enrolled_students');
        });
    })
}

//====================================================
//                  open inclass
//====================================================
exports.open_inclass = function(ptor){
    info_icon = ptor.findElement(protractor.By.id("inclass")).then(function(btn){
        btn.click();
        ptor.getCurrentUrl().then(function(url) {
            expect(url).toContain('inclass');
        });
    })
}
//====================================================
//                  delete account
//====================================================
exports.cancel_account = function(ptor, password, feedback){
    ptor.findElement(protractor.By.id('settings_btn')).then(function(setting_btn){
        ptor.sleep(500);
        setting_btn.click().then(function(){
            ptor.findElement(protractor.By.id('del_acc_btn')).then(function(del_btn){
                del_btn.click().then(function(){
                    ptor.findElement(protractor.By.id('del_con_pwd')).then(function(pwd_field){
                        pwd_field.sendKeys(password)
                        ptor.findElement(protractor.By.id('del_ok_btn')).then(function(ok_btn){
                            ok_btn.click().then(function(){
                                feedback(ptor,'Bye! Your account was successfully cancelled. We hope to see you again soon.');
                            })
                        })
                    })
                })
            })
        })
    })
}

//====================================================
//               clear guerilla mail
//====================================================
exports.clean_mail = function(ptor){
    ptor.driver.get('https://www.guerrillamail.com/inbox');
    ptor.driver.findElement(protractor.By.id("inbox-id")).then(function(inbox){
        inbox.click().then(function(){
            ptor.driver.findElement(protractor.By.xpath('//*[@id="inbox-id"]/input')).then(function(mail){
                mail.sendKeys('studenttest').then(function(){
                    ptor.driver.findElement(protractor.By.xpath('//*[@id="inbox-id"]/button[1]')).then(function(set_btn){
                        set_btn.click().then(function(){
                            ptor.driver.findElement(protractor.By.id('use-alias')).then(function(check_scram){
                                check_scram.click().then(function(){
                                    ptor.sleep(11000);
                                    ptor.driver.findElements(protractor.By.tagName('td')).then(function(emails){
                                        console.log(emails.length);
                                        emails[0].click();
                                        ptor.sleep(2000).then(function(){
                                            ptor.driver.findElement(protractor.By.id('del_button')).then(function(del_button){
                                                del_button.click();
                                                ptor.sleep(3000);
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            });
       })
   })
}

//====================================================
//                  navigate home
//====================================================

exports.home = function(ptor){
    locator.by_classname(ptor, 'modern-logo').then(function(home){
        home.click().then(function(){
            ptor.getCurrentUrl().then(function(url) {
                expect(url).toContain(params.frontend+'/student_courses');
            });
        })
    })
}

exports.home_teacher = function(ptor){
    locator.by_classname(ptor, 'modern-logo').then(function(home){
        home.click().then(function(){
            ptor.getCurrentUrl().then(function(url) {
                expect(url).toContain(params.frontend+'/courses');
            });
        })
    })
}

//====================================================
//            open item by no from timeline
//====================================================

exports.open_item = function(ptor,item_no, total_item_no){
    locator.s_by_classname(ptor, 'courseware-item-circle').then(function(item){
        item[item_no-1].click();
    })
}

//====================================================
//                  select module
//====================================================

exports.open_module = function(ptor, module_no){
    locator.by_xpath(ptor, "//table[@class='header-container']//button[.='Module 1']").then(function(mod_btn){
        mod_btn.click();
        expect(locator.by_classname(ptor,"multicol").isDisplayed()).toEqual(true);
        locator.by_classname(ptor,"multicol").findElements(protractor.By.tagName('ul')).then(function(mod){
            //expect(mod.length).toEqual(2);
            // ptor.actions().mouseMove(mod[module_no-1]).perform();
            // ptor.actions().mouseMove({x: 5, y: 5}).perform();
            // ptor.actions().click(protractor.Button.RIGHT).perform();
            // ptor.sleep(5000);
            mod[module_no-1].click().then(function(){
                expect(locator.by_xpath(ptor, "//table[@class='header-container']//button[.='Module "+module_no+"']").isDisplayed()).toEqual(true);
            })
            ptor.sleep(5000);
        })
    })
}

//=====================================
//        logout
//=====================================
exports.logout = function(ptor, feedback) {
    ptor.findElement(protractor.By.id('logout-link')).then(function(link) {
        link.click().then(function() {
            feedback(ptor, 'Signed out successfully');
        });
    })
}
//=====================================
//        logout hidden
//=====================================
exports.logoutHidden = function(ptor, feedback) {
        var hid = ptor.findElement(protractor.By.id('logout_link'));
        driver.executeScript("arguments[0].click()", hid).then(function() {
            feedback(ptor, 'Signed out successfully.');
        });
}

//=====================================
//        open profile
//=====================================
exports.openprofile = function(ptor)
{
    ptor.findElement(protractor.By.binding("current_user.name +' '+ current_user.last_name")).click();
}


//====================================================
//                   sign up teacher
//====================================================
exports.sign_up_teacher = function(ptor, screen_name, fname, lname, studentmail, univer, biog, webs, password, feedback){
    ptor.get(params.frontend+'/users/teacher');

    ptor.findElement(protractor.By.id('screen_name')).then(function(screenname) {
            screenname.sendKeys(screen_name);
        });
    ptor.findElement(protractor.By.id('name')).then(function(name) {
            name.sendKeys(fname);
        });
    ptor.findElement(protractor.By.id('last_name')).then(function(lastname) {
            lastname.sendKeys(lname);
        });
    ptor.findElement(protractor.By.id('user_email')).then(function(email) {
            email.sendKeys(studentmail);
        });
    ptor.findElement(protractor.By.id('university')).then(function(uni) {
            uni.sendKeys(univer);
        });
    ptor.findElement(protractor.By.id('bio')).then(function(bio) {
            bio.sendKeys(biog);
        });
    ptor.findElement(protractor.By.id('link')).then(function(website) {
            website.sendKeys(webs);
        });
    ptor.findElements(protractor.By.id('user_passowrd')).then(function(pass) {
            console.log("number of element with id = user_passowrd = "+pass.length);
            pass[0].sendKeys(password);
            pass[1].sendKeys(password);
        });
    ptor.findElement(protractor.By.id('signup_btn')).then(function(signup_btn){
        signup_btn.click().then(function(){
            feedback(ptor, 'A message with a confirmation link has been sent to your email address. Please open the link to activate your account.');
        });
    });
}
//====================================================
//               confirm teacher account
//====================================================
exports.confirm_account_teacher = function(ptor, mail ,feedback){
    ptor.driver.get('https://www.guerrillamail.com/inbox');
        ptor.driver.findElement(protractor.By.id("inbox-id")).then(function(inbox){
            inbox.click().then(function(){
                ptor.driver.findElement(protractor.By.xpath('//*[@id="inbox-id"]/input')).then(function(mail){
                    mail.sendKeys('teacher2').then(function(){
                        ptor.driver.findElement(protractor.By.xpath('//*[@id="inbox-id"]/button[1]')).then(function(set_btn){
                            set_btn.click().then(function(){
                                ptor.driver.findElement(protractor.By.id('use-alias')).then(function(check_scram){
                                    check_scram.click().then(function(){
                                        ptor.driver.sleep(11000);
                                        ptor.driver.findElements(protractor.By.tagName('td')).then(function(emails){
                                            console.log(emails.length);
                                            emails[1].click();
                                            ptor.driver.sleep(3000).then(function(){
                                                ptor.driver.findElement(protractor.By.partialLinkText('confirmation?confirmation_token')).then(function(link){
                                                    link.getAttribute('href').then(function(confirm_link){
                                                        var final_link = params.frontend+confirm_link.split('.com/#')[1];
                                                        ptor.driver.get(final_link).then(function(){
                                                            feedback(ptor, 'Your account was successfully confirmed. You are now signed in.');
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                });
           })
       })
}

//=======================================================
//          switch from student to teacher
//=======================================================
exports.to_teacher = function(ptor){
    this.home(ptor);
    this.open_tray(ptor);
    this.logout(ptor, this.feedback);
    this.sign_in(ptor, params.teacher_mail, params.password, this.feedback);
}

//=======================================================
//          switch from teacher to student
//=======================================================
exports.to_student = function(ptor){
    this.home_teacher(ptor);
    this.open_tray(ptor);
    this.logout(ptor, this.feedback);
    this.sign_in(ptor, params.mail, params.password, this.feedback);   
}

//=======================================================
//                  scroll into view
//=======================================================

exports.scroll = function(ptor, value) {
    ptor.executeScript('window.scrollBy(0, ' + value + ')', '');
}

//=======================================================
//                  scroll to top
//=======================================================

exports.scroll_to_top = function(ptor) {
    ptor.executeScript('window.scrollBy(0, -20000)', '');
}
//=======================================================
//                  scroll to bottom
//=======================================================

exports.scroll_to_bottom = function(ptor) {
    ptor.executeScript('window.scrollBy(0, 20000)', '');
}
//=======================================================
//                  scroll to element
//=======================================================

exports.scroll_element = function(ptor, element) {
    element.getLocation().then(function(loc){
        ptor.executeScript('window.scrollTo('+loc.x+','+loc.y+')', '');
    })
    
}

//
//
//

exports.open_notifications = function(ptor, no){
   locator.by_id(ptor, 'notification_btn').click();
   locator.s_by_id(ptor, 'id').then(function(inv){
    inv[no-1].findElement(protractor.By.className('btn-success')).click().then(function(){
        o_c.feedback(ptor, 'ou have accepted the invitation to course')
    })
   })
}