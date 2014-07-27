var ptor = protractor.getInstance();
var locator = require('./locators');
var o_c = require('./openers_and_clickers');
var params = ptor.params;

//////////////////////////////begin new_layout test mods /////////////////////////////////////////

exports.press_login = function(ptor){
    ptor.get(params.frontend);
    ptor.sleep(1000);
    
    locator.by_id(ptor, "login").then(function(l){
        l.click().then(function(){
            expect(locator.by_id(ptor,"user_email").isDisplayed()).toEqual(true);
            expect(locator.by_id(ptor,"user_passowrd").isDisplayed()).toEqual(true);
            expect(locator.by_id(ptor,"login_btn").isDisplayed()).toEqual(true);
        })
    })
}
//====================================================
//                      sign in
//====================================================
exports.sign_in = function(ptor, email, password){
    element(by.id('user_email')).sendKeys(email);
    element(by.id('user_passowrd')).sendKeys(password);
    element(by.id('login_btn')).click().then(function(){
        o_c.feedback(ptor, 'Signed in successfully');
    });
    // locator.by_id(ptor,'user_email').then(function(email_field) {
    //     email_field.sendKeys(email);
    // });
    // locator.by_id(ptor,'user_passowrd').then(function(password_field) {
    //     password_field.sendKeys(password);
    // });

    // locator.by_id(ptor, "login_btn").then(function(btn){
    //     btn.click().then(function() {
    //         o_c.feedback(ptor, 'Signed in successfully');
    //     });
    // });
}

exports.sign_in_admin = function(ptor){
    element(by.id('user_email')).sendKeys(params.admin_mail);
    element(by.id('user_passowrd')).sendKeys(params.admin_password);
    element(by.id('login_btn')).click()
}

//=====================================
//                logout
//=====================================
exports.logout = function(ptor) {
    this.open_account(ptor);
    locator.by_id(ptor, "logout").then(function(link) {
        link.click().then(function() {
            o_c.feedback(ptor, 'Signed out successfully');
        });
    })
}

//====================================================
//                      sign up
//====================================================
exports.sign_up_student = function(ptor, screen_name, fname, lname, mail, univer, biog, webs, password){
    ptor.get(params.frontend+'/users/student');
    o_c.fill_sign_up_forum(ptor, screen_name, fname, lname, mail, univer, biog, webs, password)
}
exports.sign_up_teacher = function(ptor, screen_name, fname, lname, mail, univer, biog, webs, password){
    ptor.get(params.frontend+'/users/teacher');
    o_c.fill_sign_up_forum(ptor, screen_name, fname, lname, mail, univer, biog, webs, password)
}

exports.fill_sign_up_forum=function(ptor, screen_name, fname, lname, mail, univer, biog, webs, password){
    element(by.model('user.name')).sendKeys(fname)
    element(by.model('user.last_name')).sendKeys(lname)
    element(by.model('user.email')).sendKeys(mail)
    element(by.model('user.university')).sendKeys(univer)
    element(by.model('user.link')).sendKeys(webs)
    element(by.model('user.bio')).sendKeys(biog)
    element(by.model('user.screen_name')).sendKeys(screen_name)
    element(by.model('user.password')).sendKeys(password)
    element(by.model('user.password_confirmation')).sendKeys(password)
    element(by.buttonText('Sign up')).click().then(function(){
        o_c.feedback(ptor, 'A message with a confirmation link has been sent to your email address. Please open the link to activate your account.');
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
//                  navigate home
//====================================================

exports.home = function(ptor){
    locator.by_id(ptor, 'home').then(function(home){
        home.click().then(function(){
            ptor.getCurrentUrl().then(function(url) {
                expect(url).toContain(params.frontend+'/course_list');
            });
        })
    })
}

exports.home_teacher = function(ptor){
    locator.by_id(ptor, 'home').then(function(home){
        home.click().then(function(){
            ptor.getCurrentUrl().then(function(url) {
                expect(url).toContain(params.frontend+'/courses');
            });
        })
    })
}

//====================================================
//               new menu openers
//====================================================
exports.open_dashboard = function(ptor){
    locator.by_id(ptor, 'dashboard').then(function(btn){
        btn.click();
        ptor.getCurrentUrl().then(function(url) {
            expect(url).toContain('dashboard');
        });
    })
}

exports.open_notifications = function(ptor){
    locator.by_id(ptor, 'notifications').then(function(btn){
        ptor.actions().mouseMove(btn).perform();
    })
}

exports.open_courses = function(ptor){
    locator.by_id(ptor, 'all_courses').then(function(btn){
        ptor.actions().mouseMove(btn).perform();
    })
}

exports.open_account = function(ptor){
    locator.by_id(ptor, 'account').then(function(btn){
        ptor.actions().mouseMove(btn).perform();
    })
}

exports.open_help = function(ptor){
    locator.by_id(ptor, 'help').then(function(btn){
        ptor.actions().mouseMove(btn).perform();
    })
}

exports.open_settings = function(ptor){
    locator.by_id(ptor, 'settings').then(function(btn){
        ptor.actions().mouseMove(btn).perform();
    })
}

exports.open_statistics = function(ptor){
   element(by.id('statistics')).click()
}

exports.open_content = function(ptor){
   element(by.id('content')).then(function(btn){
        ptor.actions().mouseMove(btn).perform();
    })
}

exports.open_online_content = function(ptor){
   element(by.id('new_online_content')).click()
}

exports.hide_dropmenu = function(ptor){
    // element(by.id('main')).click()
    element(by.id('content_navigator')).then(function(btn){
        ptor.actions().mouseMove(btn).perform();
    })
    
}

//====================================================
//               new sub-menu openers
//====================================================

exports.open_join_course = function(ptor){
    this.open_courses(ptor);
    locator.by_id(ptor, 'join_course').then(function(btn){
        btn.click();
    })
}

exports.open_new_course = function(ptor){
    this.open_courses(ptor);
    locator.by_id(ptor, 'new_course_sub').then(function(btn){
        btn.click();
        ptor.getCurrentUrl().then(function(url) {
            expect(url).toContain('courses/new');
        });
    })
}

exports.open_course_list = function(ptor){
    this.open_courses(ptor);
    locator.by_id(ptor, 'course_list').then(function(btn){
        btn.click();
        ptor.getCurrentUrl().then(function(url) {
            expect(url).toContain('courses');
        });
    })
}

exports.open_course_list_student = function(ptor){
    this.open_courses(ptor);
    locator.by_id(ptor, 'course_list').then(function(btn){
        btn.click();
        ptor.getCurrentUrl().then(function(url) {
            expect(url).toContain('course_list');
        });
    })
}


///////////////////////////////////////////////////////////////
//                          course openers
///////////////////////////////////////////////////////////////

exports.open_course_from_sub_menu = function(ptor, co_no){
    this.open_courses(ptor);
    ptor.sleep(3000);
    locator.by_repeater(ptor, "course in courses").then(function(courses){
        courses[co_no].click();
    })
}

//====================================================
//              open course by no whole-box
//====================================================
exports.open_course_whole = function(ptor, co_no){
    locator.s_by_classname(ptor, 'whole-box').then(function(course){
        course[co_no].findElement(protractor.By.className("looks-like-a-link")).click();
    })
}

//====================================================
//              open course by index
//====================================================
exports.open_course = function(ptor, co_no){
    element(by.repeater('course in courses').row(co_no)).element(by.className("button")).click();
}

///////////////////////////////////////////////////////
//                  content_navigator
///////////////////////////////////////////////////////
exports.press_content_navigator = function(ptor){
    locator.by_id(ptor, 'content_navigator').then(function(btn){
        btn.click();
    })
}
// //====================================================
// //          press course information button
// //====================================================

exports.open_course_info = function(ptor){
    this.open_settings(ptor);
    element(by.id('course_info')).click()
}

// //====================================================
// //          open enrolled students page
// //====================================================
exports.open_enrolled = function(ptor){
    this.open_settings(ptor);
    element(by.id('enrolled_students')).click()
}

// //====================================================
// //          open enrolled students page
// //====================================================
exports.open_announcements = function(ptor){
    this.open_settings(ptor);
    element(by.id('announcements')).click()
}


//=======================================================
//          switch from teacher to student
//=======================================================
exports.to_student = function(ptor){
    this.logout(ptor, this.feedback);
    this.sign_in(ptor, params.student_mail, params.password, this.feedback);   
}

//=======================================================
//          switch from student to teacher
//=======================================================
exports.to_teacher = function(ptor){
    this.logout(ptor, this.feedback);
    this.sign_in(ptor, params.teacher_mail, params.password, this.feedback);
}

///////////////////////////////////////////////////////
//                  notification controls
///////////////////////////////////////////////////////

exports.accept_notification = function(ptor,inv_no){
    browser.debugger()
    element(by.repeater('(id, invitation) in user.invitation_items').row(inv_no)).element(by.className('success')).click()
    // locator.by_id(ptor, 'notifications').then(function(btn){
    //     ptor.actions().mouseMove(btn).perform();
    // })
}

exports.reject_notification = function(ptor,inv_no){
    element(by.repeater('(id, invitation) in user.invitation_items').row(inv_no)).element(by.className('alert')).click()

    // locator.by_id(ptor, 'notifications').then(function(btn){
    //     ptor.actions().mouseMove(btn).perform();
    // })
}

// //====================================================
// //               press lectures button
// //====================================================
exports.open_lectures = function(ptor){ 
    element(by.id('course_content')).click()   
    // info_icon = ptor.findElement(protractor.By.id("lectures")).then(function(btn){
    //     btn.click();
    //     ptor.getCurrentUrl().then(function(url) {
    //         expect(url).toContain('courseware');
    //     });
    // })
}
//////////////////////////////end new_layout test mods /////////////////////////////////////////






// exports.sign_in_admin = function(ptor){
//     ptor.get(params.frontend);
//     ptor.sleep(1000);
//     ptor.findElement(protractor.By.id('user_email')).then(function(email_field) {
//         email_field.sendKeys("admin@scalable-learning.com");
//     });
//     ptor.findElement(protractor.By.id('user_passowrd')).then(function(password_field) {
//         password_field.sendKeys("admin_account_password");
//     });

//     ptor.findElement(protractor.By.xpath('//*[@id="main"]/div/div[1]/div/div/center/div[3]/form/div/table/tbody/tr/td[3]/table/tbody/tr[3]/td/input')).click();
// }

// //====================================================
// //                 confirm account
// //====================================================
// exports.confirm_account = function(ptor, smail, feedback){
//     ptor.driver.get('https://www.guerrillamail.com/inbox');
//         ptor.driver.findElement(protractor.By.id("inbox-id")).then(function(inbox){
//             inbox.click().then(function(){
//                 ptor.driver.findElement(protractor.By.xpath('//*[@id="inbox-id"]/input')).then(function(mail){
//                     mail.sendKeys(smail.split('@')[0]).then(function(){
//                         ptor.driver.findElement(protractor.By.xpath('//*[@id="inbox-id"]/button[1]')).then(function(set_btn){
//                             set_btn.click().then(function(){
//                                 ptor.driver.findElement(protractor.By.id('use-alias')).then(function(check_scram){
//                                     check_scram.click().then(function(){
//                                         ptor.driver.sleep(11000);
//                                         ptor.driver.findElements(protractor.By.tagName('td')).then(function(emails){
//                                             console.log(emails.length);
//                                             emails[1].click();
//                                             ptor.driver.sleep(3000).then(function(){
//                                                 ptor.driver.findElement(protractor.By.partialLinkText('confirmation?confirmation_token')).then(function(link){
//                                                     link.getAttribute('href').then(function(confirm_link){
//                                                         var final_link = params.frontend+confirm_link.split('.com/#')[1];
//                                                         ptor.driver.get(final_link).then(function(){
//                                                             feedback(ptor, 'Your account was successfully confirmed. You are now signed in.');
//                                                             ptor.driver.sleep(7000)
//                                                             ptor.navigate().refresh();
//                                                         })
//                                                     })
//                                                 })
//                                             })
//                                         })
//                                     })
//                                 })
//                             })
//                         })
//                     })
//                 });
//            })
//        })
// }



// //====================================================
// //                 open main app menu
// //====================================================
// // exports.open_tray = function(ptor){
// //     ptor.findElement(protractor.By.className('menu-icon')).then(function(toggler) {
// //         toggler.click()
// //         ptor.sleep(1000);
// //     });
// // }



// //====================================================
// //          press course information button
// //====================================================
// exports.open_info = function(ptor){
//     ptor.findElement(protractor.By.id("student_info")).then(function(btn){
//         btn.click();
//         ptor.getCurrentUrl().then(function(url) {
//             expect(url).toContain('course_information');
//         });
//     })
// }

// exports.open_info_teacher = function(ptor){
//     ptor.findElement(protractor.By.id("teacher_info")).then(function(btn){
//         btn.click();
//     })
// }

// exports.open_announcements_teacher = function(ptor){
//     ptor.findElement(protractor.By.id("announcements")).then(function(btn){
//         btn.click();
//     })
// }

// //====================================================
// //               press calendar button
// //====================================================
// exports.open_calendar = function(ptor){
//     info_icon = ptor.findElement(protractor.By.id("student_calendar")).then(function(btn){
//         btn.click();
//         ptor.getCurrentUrl().then(function(url) {
//             expect(url).toContain('events');
//         });
//     })
// }

// exports.open_calendar_teacher = function(ptor){
//     info_icon = ptor.findElement(protractor.By.id("teacher_calendar")).then(function(btn){
//         btn.click();
//         ptor.getCurrentUrl().then(function(url) {
//             expect(url).toContain('events');
//         });
//     })
// }
// //====================================================
// //               press lectures button
// //====================================================
// exports.open_lectures = function(ptor){
//     info_icon = ptor.findElement(protractor.By.id("lectures")).then(function(btn){
//         btn.click();
//         ptor.getCurrentUrl().then(function(url) {
//             expect(url).toContain('courseware');
//         });
//     })
// }

// exports.open_course_editor = function(ptor){
//     ptor.findElement(protractor.By.id("content")).then(function(btn){
//         btn.click();
//         ptor.getCurrentUrl().then(function(url) {
//             expect(url).toContain('course_editor');
//         });
//     })
// }
// //====================================================
// //               opens progress page
// //====================================================
// exports.open_progress_page = function(ptor){
//     ptor.findElement(protractor.By.id("progress")).then(function(btn){
//         btn.click();
//         ptor.getCurrentUrl().then(function(url) {
//             expect(url).toContain('progress');
//         });
//     })
// }

// //====================================================
// //          open enrolled students page
// //====================================================
// exports.open_enrolled = function(ptor){
//     info_icon = ptor.findElement(protractor.By.id("students")).then(function(btn){
//         btn.click();
//         ptor.getCurrentUrl().then(function(url) {
//             expect(url).toContain('enrolled_students');
//         });
//     })
// }

// //====================================================
// //                  open inclass
// //====================================================
// exports.open_inclass = function(ptor){
//     info_icon = ptor.findElement(protractor.By.id("inclass")).then(function(btn){
//         btn.click();
//         ptor.getCurrentUrl().then(function(url) {
//             expect(url).toContain('inclass');
//         });
//     })
// }
// //====================================================
// //                  delete account
// //====================================================
// exports.cancel_account = function(ptor, password, feedback){
//     ptor.findElement(protractor.By.id('settings_btn')).then(function(setting_btn){
//         ptor.sleep(500);
//         setting_btn.click().then(function(){
//             ptor.findElement(protractor.By.id('del_acc_btn')).then(function(del_btn){
//                 del_btn.click().then(function(){
//                     ptor.findElement(protractor.By.id('del_con_pwd')).then(function(pwd_field){
//                         pwd_field.sendKeys(password)
//                         ptor.findElement(protractor.By.id('del_ok_btn')).then(function(ok_btn){
//                             ok_btn.click().then(function(){
//                                 feedback(ptor,'Bye! Your account was successfully cancelled. We hope to see you again soon.');
//                             })
//                         })
//                     })
//                 })
//             })
//         })
//     })
// }

// //====================================================
// //               clear guerilla mail
// //====================================================
// exports.clean_mail = function(ptor){
//     ptor.driver.get('https://www.guerrillamail.com/inbox');
//     ptor.driver.findElement(protractor.By.id("inbox-id")).then(function(inbox){
//         inbox.click().then(function(){
//             ptor.driver.findElement(protractor.By.xpath('//*[@id="inbox-id"]/input')).then(function(mail){
//                 mail.sendKeys('studenttest').then(function(){
//                     ptor.driver.findElement(protractor.By.xpath('//*[@id="inbox-id"]/button[1]')).then(function(set_btn){
//                         set_btn.click().then(function(){
//                             ptor.driver.findElement(protractor.By.id('use-alias')).then(function(check_scram){
//                                 check_scram.click().then(function(){
//                                     ptor.sleep(11000);
//                                     ptor.driver.findElements(protractor.By.tagName('td')).then(function(emails){
//                                         console.log(emails.length);
//                                         emails[0].click();
//                                         ptor.sleep(2000).then(function(){
//                                             ptor.driver.findElement(protractor.By.id('del_button')).then(function(del_button){
//                                                 del_button.click();
//                                                 ptor.sleep(3000);
//                                             })
//                                         })
//                                     })
//                                 })
//                             })
//                         })
//                     })
//                 })
//             });
//        })
//    })
// }

// //====================================================
// //            open item by no from timeline
// //====================================================

// exports.open_item = function(ptor,item_no, total_item_no){
//     locator.s_by_classname(ptor, 'courseware-item-circle').then(function(item){
//         item[item_no-1].click();
//     })
// }

// //====================================================
// //                  select module
// //====================================================

// exports.open_module = function(ptor, module_no){
//     locator.by_xpath(ptor, "//table[@class='header-container']//button[.='Module 1']").then(function(mod_btn){
//         mod_btn.click();
//         expect(locator.by_classname(ptor,"multicol").isDisplayed()).toEqual(true);
//         locator.by_classname(ptor,"multicol").findElements(protractor.By.tagName('ul')).then(function(mod){
//             //expect(mod.length).toEqual(2);
//             // ptor.actions().mouseMove(mod[module_no-1]).perform();
//             // ptor.actions().mouseMove({x: 5, y: 5}).perform();
//             // ptor.actions().click(protractor.Button.RIGHT).perform();
//             // ptor.sleep(5000);
//             mod[module_no-1].click().then(function(){
//                 expect(locator.by_xpath(ptor, "//table[@class='header-container']//button[.='Module "+module_no+"']").isDisplayed()).toEqual(true);
//             })
//             ptor.sleep(5000);
//         })
//     })
// }


// //=====================================
// //        open profile
// //=====================================
// exports.openprofile = function(ptor)
// {
//     ptor.findElement(protractor.By.binding("current_user.name +' '+ current_user.last_name")).click();
// }


// //====================================================
// //                   sign up teacher
// //====================================================
// exports.sign_up_teacher = function(ptor, screen_name, fname, lname, studentmail, univer, biog, webs, password, feedback){
//     ptor.get(params.frontend+'/users/teacher');

//     ptor.findElement(protractor.By.id('screen_name')).then(function(screenname) {
//             screenname.sendKeys(screen_name);
//         });
//     ptor.findElement(protractor.By.id('name')).then(function(name) {
//             name.sendKeys(fname);
//         });
//     ptor.findElement(protractor.By.id('last_name')).then(function(lastname) {
//             lastname.sendKeys(lname);
//         });
//     ptor.findElement(protractor.By.id('user_email')).then(function(email) {
//             email.sendKeys(studentmail);
//         });
//     ptor.findElement(protractor.By.id('university')).then(function(uni) {
//             uni.sendKeys(univer);
//         });
//     ptor.findElement(protractor.By.id('bio')).then(function(bio) {
//             bio.sendKeys(biog);
//         });
//     ptor.findElement(protractor.By.id('link')).then(function(website) {
//             website.sendKeys(webs);
//         });
//     ptor.findElements(protractor.By.id('user_passowrd')).then(function(pass) {
//             console.log("number of element with id = user_passowrd = "+pass.length);
//             pass[0].sendKeys(password);
//             pass[1].sendKeys(password);
//         });
//     ptor.findElement(protractor.By.id('signup_btn')).then(function(signup_btn){
//         signup_btn.click().then(function(){
//             feedback(ptor, 'A message with a confirmation link has been sent to your email address. Please open the link to activate your account.');
//         });
//     });
// }
// //====================================================
// //               confirm teacher account
// //====================================================
// exports.confirm_account_teacher = function(ptor, mail ,feedback){
//     ptor.driver.get('https://www.guerrillamail.com/inbox');
//         ptor.driver.findElement(protractor.By.id("inbox-id")).then(function(inbox){
//             inbox.click().then(function(){
//                 ptor.driver.findElement(protractor.By.xpath('//*[@id="inbox-id"]/input')).then(function(mail){
//                     mail.sendKeys('teacher2').then(function(){
//                         ptor.driver.findElement(protractor.By.xpath('//*[@id="inbox-id"]/button[1]')).then(function(set_btn){
//                             set_btn.click().then(function(){
//                                 ptor.driver.findElement(protractor.By.id('use-alias')).then(function(check_scram){
//                                     check_scram.click().then(function(){
//                                         ptor.driver.sleep(11000);
//                                         ptor.driver.findElements(protractor.By.tagName('td')).then(function(emails){
//                                             console.log(emails.length);
//                                             emails[1].click();
//                                             ptor.driver.sleep(3000).then(function(){
//                                                 ptor.driver.findElement(protractor.By.partialLinkText('confirmation?confirmation_token')).then(function(link){
//                                                     link.getAttribute('href').then(function(confirm_link){
//                                                         var final_link = params.frontend+confirm_link.split('.com/#')[1];
//                                                         ptor.driver.get(final_link).then(function(){
//                                                             feedback(ptor, 'Your account was successfully confirmed. You are now signed in.');
//                                                         })
//                                                     })
//                                                 })
//                                             })
//                                         })
//                                     })
//                                 })
//                             })
//                         })
//                     })
//                 });
//            })
//        })
// }

// //=======================================================
// //          switch from student to teacher
// //=======================================================
// exports.to_teacher = function(ptor){
//     this.home(ptor);
//     this.open_tray(ptor);
//     this.logout(ptor, this.feedback);
//     this.sign_in(ptor, params.teacher_mail, params.password, this.feedback);
// }

// //=======================================================
// //          switch from teacher to student
// //=======================================================
// exports.to_student = function(ptor){
//     this.home_teacher(ptor);
//     this.open_tray(ptor);
//     this.logout(ptor, this.feedback);
//     this.sign_in(ptor, params.mail, params.password, this.feedback);   
// }

// //=======================================================
// //                  scroll into view
// //=======================================================

// exports.scroll = function(ptor, value) {
//     ptor.executeScript('window.scrollBy(0, ' + value + ')', '');
// }

// //=======================================================
// //                  scroll to top
// //=======================================================

// exports.scroll_to_top = function(ptor) {
//     ptor.executeScript('window.scrollBy(0, -20000)', '');
// }
// //=======================================================
// //                  scroll to bottom
// //=======================================================

// exports.scroll_to_bottom = function(ptor) {
//     ptor.executeScript('window.scrollBy(0, 20000)', '');
// }
// //=======================================================
// //                  scroll to element
// //=======================================================

// exports.scroll_element = function(ptor, element) {
//     element.getLocation().then(function(loc){
//         ptor.executeScript('window.scrollTo('+loc.x+','+loc.y+')', '');
//     })
    
// }

// //
// //
// //

// // exports.open_notifications = function(ptor, no){
// //    locator.by_id(ptor, 'notification_btn').click();
// //    locator.s_by_id(ptor, 'id').then(function(inv){
// //     inv[no-1].findElement(protractor.By.className('btn-success')).click().then(function(){
// //         o_c.feedback(ptor, 'ou have accepted the invitation to course')
// //     })
// //    })
// // }

// // exports.open_notification_shared = function(ptor, no){
// //    locator.by_id(ptor, 'notification_btn').click();
// //    locator.s_by_id(ptor, 'id').then(function(inv){
// //     inv[no-1].findElement(protractor.By.className('btn-success')).click().then(function(){
// //         o_c.feedback(ptor, 'ccepted shared Item')
// //         ptor.getCurrentUrl().then(function(url) {
// //             expect(url).toContain('show_shared');
// //         });
// //     })
// //    })
// // }

// exports.open_statistics = function(ptor){
//    locator.by_classname(ptor, 'statistics-button').click();
//     ptor.getCurrentUrl().then(function(url) {
//         expect(url).toContain('statistics');
//     });
// }

// exports.select_progress_item = function(item_number){
//     ptor.findElements(protractor.By.tagName('progress-item')).then(function(bullets){
//         bullets[item_number-1].click();
//     })
// }
