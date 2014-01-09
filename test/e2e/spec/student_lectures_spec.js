var util = require('util');
var enroll_key = '737f61e162';
var course_id = '383';
var choices = new Array();

    var ptor = protractor.getInstance();
    var driver = ptor.driver;

    var findByName = function(name){
        return driver.findElement(protractor.By.name(name));
    };
    var findById = function(id){
        return driver.findElement(protractor.By.id(id))
    };

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

//describe('Teacher', function(){
//    login(ptor, driver, 'admin@scalear.com', 'password', 'admin', findByName);
//    it('should create a new course', function(){
//        ptor = protractor.getInstance();
//        ptor.get('/#/courses/new');
//        ptor.findElements(protractor.By.tagName('input')).then(function(fields){
//            fields[fields.length-1].click();
//        });
//        ptor.findElements(protractor.By.className('controls')).then(function(rows){
//            expect(rows[0].getText()).toContain('Required');
//            expect(rows[1].getText()).toContain('Required');
//        });
//        ptor.findElements(protractor.By.tagName('input')).then(function(fields){
//            fields[0].sendKeys('TEST-101');
//            fields[1].sendKeys('Z Testing - Student Lectures');
//            fields[3].sendKeys('5');
//            fields[4].sendKeys('http://google.com/');
//            ptor.findElements(protractor.By.tagName('textarea')).then(function(fields){
//                fields[0].sendKeys('new description');
//                fields[1].sendKeys('new prerequisites');
//            });
//            ptor.findElements(protractor.By.tagName('select')).then(function(dropdown){
//                dropdown[0].click();
//                ptor.findElements(protractor.By.tagName('option')).then(function(options){
//                    options[1].click();
//                });
//            });
//            fields[fields.length-1].click();
//        });
//    });
//    it('should go to course information', function(){
//        ptor.findElement(protractor.By.className('dropdown-toggle')).click();
//        ptor.findElement(protractor.By.id('info')).click();
//    });
//    it('should display course enrollment key', function(){
//        ptor.findElements(protractor.By.tagName('p')).then(function(data){
//            data[0].getText().then(function(text){
//                enroll_key = text;
//            });
//        });
//    });
//    it('should save the course id', function(){
//        ptor.getCurrentUrl().then(function(text){
//            var test = text.split('/')
//            course_id = test[test.length-1];
////                console.log('course id is : '+course_id);
//        });
//    });
//    it('should navigate to course editor', function(){
//        ptor.get('/#/courses/'+course_id+'/course_editor');
//    });
//    it('should add a new module and open it', function(){
//        ptor.findElement(protractor.By.className('adding_module')).then(function(button){
//            button.click().then(function(){
//                ptor.findElement(protractor.By.className('trigger')).then(function(module){
//                     module.click();
//                });
//            });
//        });
//    });
//    it('should add a new lecture and open it', function(){
//        ptor.findElements(protractor.By.className('adding')).then(function(buttons){
//            buttons[0].click().then(function(){
//                ptor.findElement(protractor.By.className('trigger2')).then(function(lecture){
//                    lecture.click();
//                });
//            });
//        });
//    });
//    it('should modify lecture url', function(){
//        ptor.findElements(protractor.By.tagName('details-text')).then(function(details){
//            details[1].click().then(function(){
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.clear();
//                    field.sendKeys('http://www.youtube.com/watch?v=XtyzOo7nJrQ').then(function(){
//                        ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                            buttons[1].click().then(function(){
////                                feedback(ptor, 'Lecture was successfully updated.', 1);
//                            });
//                        });
//                    });
//                });
//            });
//        });
//    });
//    it('should wait for the video to load', function(){
//        ptor.wait(function(){
//            return ptor.isElementPresent(protractor.By.tagName('iframe')).then(function(value){
//                return value
//            });
//        });
//        ptor.sleep(10000);
//    });
//    //add mcq multiple
//    it('should add a new MCQ over video quiz', function(){
//        ptor.findElements(protractor.By.className('dropdown-toggle')).then(function(buttons){
//            buttons[1].click().then(function(){
//                ptor.findElement(protractor.By.className('insertQuiz')).then(function(option){
//                    option.click();
//                });
//            });
//        });
//    });
//    it('should edit the MCQ quiz time', function(){
//        ptor.findElements(protractor.By.tagName('editable_text')).then(function(editables){
//            ptor.actions().doubleClick(editables[1]).perform().then(function(){
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.clear();
//                    field.sendKeys('00:00:20');
//                });
//                ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm){
//                    confirm.click().then(function(){
////                        feedback(ptor, 'Quiz was successfully updated.', 1);
//                    });
//                });
//            });
//        });
//    });
//    it('should add quiz answers on top of the video - MCQ Video', function(){
//        var locx = 0, locy=0;
//        //double click in 3 different places, delta should be in y direction with a positive value
//        ptor.executeScript('window.scrollBy(0, -1000)', '');
//        ptor.findElement(protractor.By.className('ontop')).then(function(test){
//            ptor.actions().doubleClick(test).perform();
//            //-----------------------------------------//
//            ptor.findElements(protractor.By.className('dropped')).then(function(answers){
//                answers[answers.length-1].getLocation().then(function(pnode){
//                    locx = pnode.x+5;
//                    locy = pnode.y;
//                });
//                ptor.actions().dragAndDrop({x:locx, y:locy}, {x: 200, y:115}).perform();
//                ptor.findElement(protractor.By.className('popover-content')).then(function(popover){
//                    popover.isDisplayed().then(function(disp){
//                        expect(disp).toBe(true);
//                    });
//                });
//                ptor.findElement(protractor.By.className('must_save_check')).then(function(correct){
//                    correct.click();
//                });
//                expect(answers[answers.length-1].getAttribute('ng-src')).toContain('green');
//                ptor.findElements(protractor.By.className('must_save')).then(function(fields){
//                    fields[0].sendKeys('first answer');
//                    fields[1].sendKeys('first explanation');
//                });
//            });
//        });
//
//        ptor.findElement(protractor.By.className('ontop')).then(function(test){
//            var loc2x = 0, loc2y = 0;
//            ptor.actions().doubleClick(test).perform();
//            //-----------------------------------------//
//            ptor.findElements(protractor.By.className('dropped')).then(function(answers){
//                answers[answers.length-1].getLocation().then(function(pnode){
//                    loc2x = pnode.x+5;
//                    loc2y = pnode.y;
//                });
//                ptor.actions().dragAndDrop({x:loc2x, y:loc2y}, {x: 200, y:165}).perform();
//                ptor.findElement(protractor.By.className('popover-content')).then(function(popover){
//                    popover.isDisplayed().then(function(disp){
//                        expect(disp).toBe(true);
//                    });
//                });
//                ptor.findElement(protractor.By.className('must_save_check')).then(function(correct){
//                    correct.click();
//                });
//                ptor.findElements(protractor.By.className('must_save')).then(function(fields){
//                    fields[0].sendKeys('second answer');
//                    fields[1].sendKeys('second explanation');
//                });
//            });
//        });
//        ptor.findElement(protractor.By.className('ontop')).then(function(test){
//            var loc3x = 0, loc3y = 0;
//            ptor.actions().doubleClick(test).perform();
//            //-----------------------------------------//
//            ptor.findElements(protractor.By.className('dropped')).then(function(answers){
//                answers[answers.length-1].getLocation().then(function(pnode){
//                    loc3x = pnode.x+5;
//                    loc3y = pnode.y;
//                });
//                ptor.actions().dragAndDrop({x:loc3x, y:loc3y}, {x: 200, y:215}).perform();
//                ptor.findElement(protractor.By.className('popover-content')).then(function(popover){
//                    popover.isDisplayed().then(function(disp){
//                        expect(disp).toBe(true);
//                    });
//                });
//                ptor.findElements(protractor.By.className('must_save')).then(function(fields){
//                    fields[0].sendKeys('third answer');
//                    fields[1].sendKeys('third explanation');
//                });
//            });
//        });
//    });
//    doSave(ptor);
////    feedback(ptor, 'Quiz was successfully saved', 0);
//
//    //add ocq
//    it('should add a new OCQ over video quiz', function(){
//        ptor.findElements(protractor.By.className('dropdown-toggle')).then(function(buttons){
//            buttons[1].click().then(function(){
//                ptor.findElements(protractor.By.className('insertQuiz')).then(function(options){
//                    options[1].click();
//                });
//            });
//        });
//    });
//    it('should edit the OCQ quiz time', function(){
//        ptor.findElements(protractor.By.tagName('editable_text')).then(function(editables){
//            ptor.actions().doubleClick(editables[1]).perform().then(function(){
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.clear();
//                    field.sendKeys('00:00:30');
//                });
//                ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm){
//                    confirm.click().then(function(){
////                        feedback(ptor, 'Quiz was successfully updated.', 1);
//                    });
//                });
//            });
//        });
//    });
//    it('should add quiz answers on top of the video - OCQ Video', function(){
//        var locx = 0, locy=0;
//        //double click in 3 different places, delta should be in y direction with a positive value
//        ptor.executeScript('window.scrollBy(0, -1000)', '');
//        ptor.findElement(protractor.By.className('ontop')).then(function(test){
//            ptor.actions().doubleClick(test).perform();
//            //-----------------------------------------//
//            ptor.findElements(protractor.By.className('dropped')).then(function(answers){
//                answers[answers.length-1].getLocation().then(function(pnode){
//                    locx = pnode.x+5;
//                    locy = pnode.y;
//                });
//                ptor.actions().dragAndDrop({x:locx, y:locy}, {x: 200, y:115}).perform();
//                ptor.findElement(protractor.By.className('popover-content')).then(function(popover){
//                    popover.isDisplayed().then(function(disp){
//                        expect(disp).toBe(true);
//                    });
//                });
//                ptor.findElement(protractor.By.className('must_save_check')).then(function(correct){
//                    correct.click();
//                });
//                expect(answers[answers.length-1].getAttribute('ng-src')).toContain('green');
//                ptor.findElements(protractor.By.className('must_save')).then(function(fields){
//                    fields[0].sendKeys('first answer');
//                    fields[1].sendKeys('first explanation');
//                });
//            });
//        });
//
//        ptor.findElement(protractor.By.className('ontop')).then(function(test){
//            var loc2x = 0, loc2y = 0;
//            ptor.actions().doubleClick(test).perform();
//            //-----------------------------------------//
//            ptor.findElements(protractor.By.className('dropped')).then(function(answers){
//                answers[answers.length-1].getLocation().then(function(pnode){
//                    loc2x = pnode.x+5;
//                    loc2y = pnode.y;
//                });
//                ptor.actions().dragAndDrop({x:loc2x, y:loc2y}, {x: 200, y:165}).perform();
//                ptor.findElement(protractor.By.className('popover-content')).then(function(popover){
//                    popover.isDisplayed().then(function(disp){
//                        expect(disp).toBe(true);
//                    });
//                });
//                ptor.findElements(protractor.By.className('must_save')).then(function(fields){
//                    fields[0].sendKeys('second answer');
//                    fields[1].sendKeys('second explanation');
//                });
//            });
//        });
//        ptor.findElement(protractor.By.className('ontop')).then(function(test){
//            var loc3x = 0, loc3y = 0;
//            ptor.actions().doubleClick(test).perform();
//            //-----------------------------------------//
//            ptor.findElements(protractor.By.className('dropped')).then(function(answers){
//                answers[answers.length-1].getLocation().then(function(pnode){
//                    loc3x = pnode.x+5;
//                    loc3y = pnode.y;
//                });
//                ptor.actions().dragAndDrop({x:loc3x, y:loc3y}, {x: 200, y:215}).perform();
//                ptor.findElement(protractor.By.className('popover-content')).then(function(popover){
//                    popover.isDisplayed().then(function(disp){
//                        expect(disp).toBe(true);
//                    });
//                });
//                ptor.findElements(protractor.By.className('must_save')).then(function(fields){
//                    fields[0].sendKeys('third answer');
//                    fields[1].sendKeys('third explanation');
//                });
//            });
//        });
//    });
//    doSave(ptor);
////    feedback(ptor, 'Quiz was successfully saved', 0);
//
//    //add drag
//    it('should add a new DRAG over video quiz', function(){
//        ptor.findElements(protractor.By.className('dropdown-toggle')).then(function(buttons){
//            buttons[1].click().then(function(){
//                ptor.findElements(protractor.By.className('insertQuiz')).then(function(options){
//                    options[2].click();
//                });
//            });
//        });
//    });
//    it('should edit the drag quiz time', function(){
//        ptor.findElements(protractor.By.tagName('editable_text')).then(function(editables){
//            ptor.actions().doubleClick(editables[1]).perform().then(function(){
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.clear();
//                    field.sendKeys('00:00:40');
//                });
//                ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm){
//                    confirm.click().then(function(){
////                        feedback(ptor, 'Quiz was successfully updated.', 1);
//                    });
//                });
//            });
//        });
//    });
//    it('should add quiz answers on top of the video - DRAG Over Video', function(){
//        var locx = 0, locy=0;
//        //double click in 3 different places, delta should be in y direction with a positive value
//        ptor.executeScript('window.scrollBy(0, -1000)', '');
//        ptor.findElement(protractor.By.className('ontop')).then(function(test){
//            ptor.actions().doubleClick(test).perform();
//            //-----------------------------------------//
//            ptor.findElements(protractor.By.className('dropped')).then(function(answers){
//                answers[answers.length-1].getLocation().then(function(pnode){
//                    locx = pnode.x+5;
//                    locy = pnode.y;
//                });
//                ptor.actions().dragAndDrop({x:locx, y:locy}, {x: 200, y:115}).perform();
//            });
//        });
//
//        ptor.findElement(protractor.By.className('ontop')).then(function(test){
//            var loc2x = 0, loc2y = 0;
//            ptor.actions().doubleClick(test).perform();
//            //-----------------------------------------//
//            ptor.findElements(protractor.By.className('dropped')).then(function(answers){
//                answers[answers.length-1].getLocation().then(function(pnode){
//                    loc2x = pnode.x+5;
//                    loc2y = pnode.y;
//                });
//                ptor.actions().dragAndDrop({x:loc2x, y:loc2y}, {x: 200, y:165}).perform();
//            });
//        });
//
//
//        ptor.findElement(protractor.By.className('ontop')).then(function(test){
//            var loc3x = 0, loc3y = 0;
//            ptor.actions().doubleClick(test).perform();
//            //-----------------------------------------//
//            ptor.findElements(protractor.By.className('dropped')).then(function(answers){
//                answers[answers.length-1].getLocation().then(function(pnode){
//                    loc3x = pnode.x+5;
//                    loc3y = pnode.y;
//                });
//                ptor.actions().dragAndDrop({x:loc3x, y:loc3y}, {x: 200, y:215}).perform();
//            });
//        });
//
//        ptor.findElements(protractor.By.className('area')).then(function(fields){
//            fields[0].sendKeys('first answer');
//            fields[0].click();
//            ptor.findElement(protractor.By.className('popover-content')).then(function(popover){
//                popover.isDisplayed().then(function(disp){
//                    expect(disp).toBe(true);
//                });
//            });
//            ptor.findElements(protractor.By.className('must_save')).then(function(fields){
//                fields[0].sendKeys('correct explanation');
//                fields[1].sendKeys('first wrong explanation');
//                fields[2].sendKeys('second wrong explanation');
//            });
//
//            fields[fields.length-2].sendKeys('second answer');
//            fields[fields.length-2].click();
//            ptor.findElement(protractor.By.className('popover-content')).then(function(popover){
//                popover.isDisplayed().then(function(disp){
//                    expect(disp).toBe(true);
//                });
//            });
//            ptor.findElements(protractor.By.className('must_save')).then(function(fields){
//                fields[0].sendKeys('correct explanation');
//                fields[1].sendKeys('first wrong explanation');
//                fields[2].sendKeys('second wrong explanation');
//            });
//            fields[fields.length-1].sendKeys('third answer');
//            fields[fields.length-1].click();
//            ptor.findElement(protractor.By.className('popover-content')).then(function(popover){
//                popover.isDisplayed().then(function(disp){
//                    expect(disp).toBe(true);
//                });
//            });
//            ptor.findElements(protractor.By.className('must_save')).then(function(fields){
//                fields[0].sendKeys('correct explanation');
//                fields[1].sendKeys('first wrong explanation');
//                fields[2].sendKeys('second wrong explanation');
//            });
//        });
//    });
//    doSave(ptor);
////    feedback(ptor, 'Quiz was successfully saved', 0);
//
//    //creating a second module
//    it('should add a second new module and open it', function(){
//        ptor.findElement(protractor.By.className('adding_module')).then(function(button){
//            button.click().then(function(){
//                ptor.findElements(protractor.By.className('trigger')).then(function(modules){
//                    modules[modules.length-1].click();
//                });
//            });
//        });
//    });
//    it('should edit module\'s name', function(){
//       ptor.findElement(protractor.By.tagName('details-text')).then(function(name){
//           name.click().then(function(){
//               ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                   field.sendKeys(' 2').then(function(){
//                       ptor.findElement(protractor.By.className('icon-ok')).then(function(ok){
//                           ok.click();
////                           feedback(ptor, 'Module was successfully updated', 1);
//                       });
//                   });
//               });
//           });
//       });
//    });
//    scroll(ptor, '-500', '-500');
//    it('should add a second new lecture and open it', function(){
//        ptor.findElements(protractor.By.className('adding')).then(function(buttons){
//            buttons[buttons.length-3].click().then(function(){
//                ptor.findElements(protractor.By.className('trigger2')).then(function(lectures){
//                    lectures[lectures.length-1].click();
//                });
//            });
//        });
//    });
//    it('should modify lecture\'s name', function(){
//        ptor.findElement(protractor.By.tagName('details-text')).then(function(name){
//            name.click().then(function(){
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.sendKeys(' 2').then(function(){
//                        ptor.findElement(protractor.By.className('icon-ok')).then(function(ok){
//                            ok.click();
////                            feedback(ptor, 'Lecture was successfully updated', 1);
//                        });
//                    });
//                });
//            });
//        })
//    });
//    it('should modify lecture url', function(){
//        ptor.findElements(protractor.By.tagName('details-text')).then(function(details){
//            details[1].click().then(function(){
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.clear();
//                    field.sendKeys('http://www.youtube.com/watch?v=XtyzOo7nJrQ').then(function(){
//                        ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                            buttons[1].click().then(function(){
////                                feedback(ptor, 'Lecture was successfully updated.', 1);
//                            });
//                        });
//                    });
//                });
//            });
//        });
//    });
//    it('should wait for the video to load', function(){
//        ptor.wait(function(){
//            return ptor.isElementPresent(protractor.By.tagName('iframe')).then(function(value){
//                return value
//            });
//        });
//        ptor.sleep(10000);
//    });
//    //MCQ HTML
//    it('should add an MCQ HTML Quiz', function(){
//        ptor.findElements(protractor.By.className('dropdown-toggle')).then(function(buttons){
//            buttons[2].click().then(function(){
//                ptor.findElements(protractor.By.className('insertQuiz')).then(function(options){
//                    options[3].click().then(function(){
////                        feedback(ptor, 'Quiz was successfully created.', 1);
//                    });
//                });
//            });
//        });
//    });
//    it('should edit the MCQ HTML quiz time', function(){
//        ptor.findElements(protractor.By.tagName('editable_text')).then(function(editables){
//            ptor.actions().doubleClick(editables[1]).perform().then(function(){
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.clear();
//                    field.sendKeys('00:00:20');
//                });
//                ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm){
//                    confirm.click().then(function(){
////                        feedback(ptor, 'Quiz was successfully updated.', 1);
//                    });
//                });
//            });
//        });
//    });
//    scroll(ptor, '0', '-1000');
//    it('should add answers to the quiz', function(){
//        ptor.findElement(protractor.By.className('add_multiple_answer')).then(function(link){
//            link.click();
//            link.click();
//        });
//        ptor.findElements(protractor.By.tagName('input')).then(function(fields){
//            fields[1].sendKeys('first answer');
//            fields[2].click();
//            fields[3].sendKeys('first explanation');
//            fields[4].sendKeys('second answer');
//            fields[5].click();
//            fields[6].sendKeys('second explanation');
//            fields[7].sendKeys('third answer');
//            fields[9].sendKeys('third explanation');
//        });
//    });
//    doSave(ptor);
////    feedback(ptor, 'Quiz was successfully saved', 0);
//
//    //DRAG HTML
//    it('should add a DRAG HTML Quiz', function(){
//        ptor.findElements(protractor.By.className('dropdown-toggle')).then(function(buttons){
//            buttons[2].click().then(function(){
//                ptor.findElements(protractor.By.className('insertQuiz')).then(function(options){
//                    options[5].click().then(function(){
////                        feedback(ptor, 'Quiz was successfully created.', 1);
//                    });
//                });
//            });
//        });
//    });
//    it('should edit the DRAG HTML quiz time', function(){
//        ptor.findElements(protractor.By.tagName('editable_text')).then(function(editables){
//            ptor.actions().doubleClick(editables[1]).perform().then(function(){
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.clear();
//                    field.sendKeys('00:00:30');
//                });
//                ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm){
//                    confirm.click().then(function(){
////                        feedback(ptor, 'Quiz was successfully updated.', 1);
//                    });
//                });
//            });
//        });
//    });
//    scroll(ptor, '0', '-1000');
//    it('should add answers to the quiz', function(){
//        ptor.findElement(protractor.By.className('add_multiple_answer')).then(function(link){
//            link.click();
//            link.click();
//        });
//        ptor.findElements(protractor.By.tagName('input')).then(function(fields){
//            fields[1].sendKeys('first answer');
//            fields[2].sendKeys('second answer');
//            fields[3].sendKeys('third answer');
//        });
//    });
//    it('should re-arrange the items', function(){
//        ptor.findElements(protractor.By.className('drag-item')).then(function(drag_items){
//            ptor.actions().dragAndDrop(drag_items[1], drag_items[0]).perform();
//        });
//    });
//    doSave(ptor);
////    feedback(ptor, 'Quiz was successfully saved', 0);
//
//    //creating a third module
//    it('should add a second new module and open it', function(){
//        ptor.findElement(protractor.By.className('adding_module')).then(function(button){
//            button.click().then(function(){
//                ptor.findElements(protractor.By.className('trigger')).then(function(modules){
//                    modules[modules.length-1].click();
//                });
//            });
//        });
//    });
//    it('should edit module\'s name', function(){
//        ptor.findElement(protractor.By.tagName('details-text')).then(function(name){
//            name.click().then(function(){
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.sendKeys(' 3').then(function(){
//                        ptor.findElement(protractor.By.className('icon-ok')).then(function(ok){
//                            ok.click();
////                            feedback(ptor, 'Module was successfully updated', 1);
//                        });
//                    });
//                });
//            });
//        });
//    });
//    scroll(ptor, '-500', '-500');
//    it('should add a second new lecture and open it', function(){
//        ptor.findElements(protractor.By.className('adding')).then(function(buttons){
//            buttons[buttons.length-3].click().then(function(){
//                ptor.findElements(protractor.By.className('trigger2')).then(function(lectures){
//                    lectures[lectures.length-1].click();
//                });
//            });
//        });
//    });
//    it('should modify lecture\'s name', function(){
//        ptor.findElement(protractor.By.tagName('details-text')).then(function(name){
//            name.click().then(function(){
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.sendKeys(' 3').then(function(){
//                        ptor.findElement(protractor.By.className('icon-ok')).then(function(ok){
//                            ok.click();
////                            feedback(ptor, 'Lecture was successfully updated', 1);
//                        });
//                    });
//                });
//            });
//        })
//    });
//    it('should modify lecture url', function(){
//        ptor.findElements(protractor.By.tagName('details-text')).then(function(details){
//            details[1].click().then(function(){
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.clear();
//                    field.sendKeys('http://www.youtube.com/watch?v=XtyzOo7nJrQ').then(function(){
//                        ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                            buttons[1].click().then(function(){
////                                feedback(ptor, 'Lecture was successfully updated.', 1);
//                            });
//                        });
//                    });
//                });
//            });
//        });
//    });
//    it('should wait for the video to load', function(){
//        ptor.wait(function(){
//            return ptor.isElementPresent(protractor.By.tagName('iframe')).then(function(value){
//                return value
//            });
//        });
//        ptor.sleep(10000);
//    });
//    //MCQ HTML
//    it('should add an MCQ HTML Quiz', function(){
//        ptor.findElements(protractor.By.className('dropdown-toggle')).then(function(buttons){
//            buttons[2].click().then(function(){
//                ptor.findElements(protractor.By.className('insertQuiz')).then(function(options){
//                    options[3].click().then(function(){
////                        feedback(ptor, 'Quiz was successfully created.', 1);
//                    });
//                });
//            });
//        });
//    });
//    it('should edit the MCQ HTML quiz time', function(){
//        ptor.findElements(protractor.By.tagName('editable_text')).then(function(editables){
//            ptor.actions().doubleClick(editables[1]).perform().then(function(){
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.clear();
//                    field.sendKeys('00:00:20');
//                });
//                ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm){
//                    confirm.click().then(function(){
////                        feedback(ptor, 'Quiz was successfully updated.', 1);
//                    });
//                });
//            });
//        });
//    });
//    scroll(ptor, '0', '-1000');
//    it('should add answers to the quiz', function(){
//        ptor.findElement(protractor.By.className('add_multiple_answer')).then(function(link){
//            link.click();
//            link.click();
//        });
//        ptor.findElements(protractor.By.tagName('input')).then(function(fields){
//            fields[1].sendKeys('first answer');
//            fields[2].click();
//            fields[3].sendKeys('first explanation');
//            fields[4].sendKeys('second answer');
//            fields[5].click();
//            fields[6].sendKeys('second explanation');
//            fields[7].sendKeys('third answer');
//            fields[9].sendKeys('third explanation');
//        });
//    });
//    doSave(ptor);
////    feedback(ptor, 'Quiz was successfully saved', 0);
//
//    //add ocq
//    it('should add a new OCQ over video quiz', function(){
//        ptor.findElements(protractor.By.className('dropdown-toggle')).then(function(buttons){
//            buttons[1].click().then(function(){
//                ptor.findElements(protractor.By.className('insertQuiz')).then(function(options){
//                    options[1].click();
//                });
//            });
//        });
//    });
//    it('should edit the OCQ quiz time', function(){
//        ptor.findElements(protractor.By.tagName('editable_text')).then(function(editables){
//            ptor.actions().doubleClick(editables[1]).perform().then(function(){
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.clear();
//                    field.sendKeys('00:00:30');
//                });
//                ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm){
//                    confirm.click().then(function(){
////                        feedback(ptor, 'Quiz was successfully updated.', 1);
//                    });
//                });
//            });
//        });
//    });
//    it('should add quiz answers on top of the video - OCQ Video', function(){
//        var locx = 0, locy=0;
//        //double click in 3 different places, delta should be in y direction with a positive value
//        ptor.executeScript('window.scrollBy(0, -1000)', '');
//        ptor.findElement(protractor.By.className('ontop')).then(function(test){
//            ptor.actions().doubleClick(test).perform();
//            //-----------------------------------------//
//            ptor.findElements(protractor.By.className('dropped')).then(function(answers){
//                answers[answers.length-1].getLocation().then(function(pnode){
//                    locx = pnode.x+5;
//                    locy = pnode.y;
//                });
//                ptor.actions().dragAndDrop({x:locx, y:locy}, {x: 200, y:115}).perform();
//                ptor.findElement(protractor.By.className('popover-content')).then(function(popover){
//                    popover.isDisplayed().then(function(disp){
//                        expect(disp).toBe(true);
//                    });
//                });
//                ptor.findElement(protractor.By.className('must_save_check')).then(function(correct){
//                    correct.click();
//                });
//                expect(answers[answers.length-1].getAttribute('ng-src')).toContain('green');
//                ptor.findElements(protractor.By.className('must_save')).then(function(fields){
//                    fields[0].sendKeys('first answer');
//                    fields[1].sendKeys('first explanation');
//                });
//            });
//        });
//
//        ptor.findElement(protractor.By.className('ontop')).then(function(test){
//            var loc2x = 0, loc2y = 0;
//            ptor.actions().doubleClick(test).perform();
//            //-----------------------------------------//
//            ptor.findElements(protractor.By.className('dropped')).then(function(answers){
//                answers[answers.length-1].getLocation().then(function(pnode){
//                    loc2x = pnode.x+5;
//                    loc2y = pnode.y;
//                });
//                ptor.actions().dragAndDrop({x:loc2x, y:loc2y}, {x: 200, y:165}).perform();
//                ptor.findElement(protractor.By.className('popover-content')).then(function(popover){
//                    popover.isDisplayed().then(function(disp){
//                        expect(disp).toBe(true);
//                    });
//                });
//                ptor.findElements(protractor.By.className('must_save')).then(function(fields){
//                    fields[0].sendKeys('second answer');
//                    fields[1].sendKeys('second explanation');
//                });
//            });
//        });
//        ptor.findElement(protractor.By.className('ontop')).then(function(test){
//            var loc3x = 0, loc3y = 0;
//            ptor.actions().doubleClick(test).perform();
//            //-----------------------------------------//
//            ptor.findElements(protractor.By.className('dropped')).then(function(answers){
//                answers[answers.length-1].getLocation().then(function(pnode){
//                    loc3x = pnode.x+5;
//                    loc3y = pnode.y;
//                });
//                ptor.actions().dragAndDrop({x:loc3x, y:loc3y}, {x: 200, y:215}).perform();
//                ptor.findElement(protractor.By.className('popover-content')).then(function(popover){
//                    popover.isDisplayed().then(function(disp){
//                        expect(disp).toBe(true);
//                    });
//                });
//                ptor.findElements(protractor.By.className('must_save')).then(function(fields){
//                    fields[0].sendKeys('third answer');
//                    fields[1].sendKeys('third explanation');
//                });
//            });
//        });
//    });
//    doSave(ptor);
////    feedback(ptor, 'Quiz was successfully saved', 0);
//
//    //adding Normal quiz to first module
//    scroll(ptor, '-500', '-1000');
//    it('should open the first module and add a new quiz', function(){
//        ptor.findElement(protractor.By.className('trigger')).then(function(module){
//            module.click().then(function(){
//                ptor.findElements(protractor.By.className('adding')).then(function(buttons){
//                    buttons[1].click().then(function(){
////                        feedback(ptor, 'Quiz was successfully created.', 1);
//                    });
//                });
//            });
//        });
//    });
//    scroll(ptor, '-500','-500');
//    it('should open the created quiz', function(){
//        ptor.findElements(protractor.By.className('trigger2')).then(function(items){
//            items[1].click();
//        });
//    });
//    it('should make the quiz required', function(){
//        ptor.findElement(protractor.By.tagName('details-check')).then(function(detail){
//            detail.click().then(function(){
//                ptor.findElement(protractor.By.className('editable-input')).then(function(checkbox){
//                    checkbox.click().then(function(){
//                        ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm){
//                            confirm.click().then(function(){
////                                feedback(ptor, 'Quiz was successfully updated', 1);
//                            });
//                        });
//                    });
//                });
//            });
//        });
//    });
//    it('should add a Drag Question', function(){
//        ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//            buttons[1].click();
//        });
//        ptor.findElements(protractor.By.tagName('select')).then(function(dropdowns){
//            dropdowns[dropdowns.length-1].click().then(function(){
//                ptor.findElements(protractor.By.tagName('option')).then(function(options){
//                    options[options.length-1].click();
//                });
//            });
//        });
//        ptor.findElements(protractor.By.className('add_multiple_answer')).then(function(links){
//            links[links.length-1].click();
//            links[links.length-1].click();
//        });
//        ptor.findElements(protractor.By.tagName('input')).then(function(fields){
//            fields[0].sendKeys('DRAG Question');
//            fields[1].sendKeys('first answer');
//            fields[2].sendKeys('second answer');
//            fields[3].sendKeys('third answer');
//        });
//    });
//    it('should add an MCQ Question', function(){
//        ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//            buttons[1].click();
//        });
//        ptor.findElements(protractor.By.className('add_multiple_answer')).then(function(links){
//            links[links.length-1].click();
//            links[links.length-1].click();
//        });
//        ptor.findElements(protractor.By.tagName('input')).then(function(fields){
//            fields[4].sendKeys('MCQ Question');
//            fields[5].sendKeys('first answer');
//            fields[6].click();
//            fields[7].sendKeys('second answer');
//            fields[8].click();
//            fields[9].sendKeys('third answer');
//        });
//    });
//    it('should add an OCQ Question', function(){
//        ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//            buttons[1].click();
//        });
//        ptor.findElements(protractor.By.tagName('select')).then(function(dropdowns){
//            dropdowns[dropdowns.length-1].click().then(function(){
//                ptor.findElements(protractor.By.tagName('option')).then(function(options){
//                    options[options.length-2].click();
//                });
//            });
//        });
//        ptor.findElements(protractor.By.className('add_multiple_answer')).then(function(links){
//            links[links.length-1].click();
//            links[links.length-1].click();
//        });
//        ptor.findElements(protractor.By.tagName('input')).then(function(fields){
//            fields[11].sendKeys('OCQ Question');
//            fields[12].sendKeys('first answer');
//            fields[13].click();
//            fields[14].sendKeys('second answer');
//            fields[16].sendKeys('third answer');
//        });
//    });
//    it('should save the quiz', function(){
//        ptor.findElement(protractor.By.className('btn-primary')).then(function(button){
//            button.click().then(function(){
////                feedback(ptor, 'Quiz was successfully saved', 1);
//            });
//        });
//    });
//
//    //adding a survey to the second module
//    scroll(ptor, '-500', '-500');
//    it('should open the second module', function(){
//        ptor.findElements(protractor.By.className('trigger')).then(function(modules){
//            modules[1].click();
//        });
//    });
//    it('should add a new survey', function(){
//        ptor.findElements(protractor.By.className('adding')).then(function(buttons){
//            buttons[5].click();
//        });
//    });
//    it('should open the created survey', function(){
//        ptor.findElements(protractor.By.className('trigger2')).then(function(items){
//            items[3].click();
//        });
//    });
//    it('should add MCQ question to the survey', function(){
//        ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//            buttons[1].click();
//        });
//        ptor.findElement(protractor.By.className('add_multiple_answer')).then(function(button){
//            button.click();
//            button.click();
//        });
//        ptor.findElements(protractor.By.tagName('input')).then(function(fields){
//            fields[0].sendKeys('MCQ Question');
//            fields[1].sendKeys('first answer');
//            fields[2].sendKeys('second answer');
//            fields[3].sendKeys('third answer');
//        });
//    });
//    it('should add OCQ question to the survey', function(){
//        ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//            buttons[1].click();
//        });
//        ptor.findElements(protractor.By.tagName('select')).then(function(types){
//            types[types.length-1].click().then(function(){
//                ptor.findElements(protractor.By.tagName('option')).then(function(options){
//                    options[4].click();
//                });
//            });
//        });
//        ptor.findElements(protractor.By.className('add_multiple_answer')).then(function(buttons){
//            buttons[1].click();
//            buttons[1].click();
//        });
//        ptor.findElements(protractor.By.tagName('input')).then(function(fields){
//            fields[4].sendKeys('OCQ Question');
//            fields[5].sendKeys('first answer');
//            fields[6].sendKeys('second answer');
//            fields[7].sendKeys('third answer');
//        });
//    });
//    it('should add a free text question to the survey', function(){
//        ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//            buttons[1].click();
//        });
//        ptor.findElements(protractor.By.tagName('select')).then(function(types){
//            types[types.length-1].click().then(function(){
//                ptor.findElements(protractor.By.tagName('option')).then(function(options){
//                    options[8].click();
//                });
//            });
//        });
//        ptor.findElements(protractor.By.tagName('input')).then(function(fields){
//            fields[8].sendKeys('Free Question');
//        });
//    });
//    it('should save the survey', function(){
//        ptor.findElement(protractor.By.className('btn-primary')).then(function(button){
//            button.click().then(function(){
////                feedback(ptor, 'Survey was successfully saved', 1);
//            });
//        });
//    });
//    logout(ptor, driver);
//});

//---------------------------//student//---------------------------//
describe('Student', function(){
    login(ptor, driver, 'em_menshawi@hotmail.com', 'password', 'mahmoud', findByName);
//    signUp(ptor, driver, 'anystudent100', 'anystudent100@email.com', 'password', 1);
    it('should join the created course', function(){
        ptor.findElement(protractor.By.id('join_course')).then(function(link){
            link.click().then(function(){
                ptor.findElement(protractor.By.name('key')).then(function(field){
                    field.sendKeys(enroll_key).then(function(){
                        ptor.findElement(protractor.By.className('btn-primary')).then(function(button){
                            button.click();
                        });
                    });
                });
            });
        });
    });
    it('should navigate to course lectures', function(){
        ptor.get('/#/courses/'+course_id+'/courseware');
    });
    it('should open the first module and then open the first lecture', function(){
        ptor.findElements(protractor.By.className('trigger')).then(function(modules){
            modules[0].click().then(function(){
                ptor.findElements(protractor.By.className('trigger2')).then(function(lectures){
                    lectures[0].click();
                });
            });
        });
    });
//-------------------------------------//---------------------------////---------------------------////---------------------------//
//    it('should wait for the first in lecture quiz to appear', function(){
//        ptor.wait(function(){
//            return ptor.findElements(protractor.By.tagName('input')).then(function(inputs){
//                if(inputs.length == 6){
//                    return true;
//                }
//                return false;
//            });
//        });
//    });
//    it('should solve the MCQ quiz', function(){
//        ptor.findElements(protractor.By.tagName('input')).then(function(choices){
//            choices[0].click();
//            choices[1].click();
//            ptor.findElements(protractor.By.className('btn-primary')).then(function(buttons){
//                buttons[buttons.length-1].click().then(function(){
//                    ptor.wait(function(){
//                        return ptor.findElements(protractor.By.className('well')).then(function(inputs){
//                            if(inputs.length == 2){
//                                return true;
//                            }
//                            return false;
//                        });
//                    });
//                    ptor.findElements(protractor.By.className('well')).then(function(notifications){
//                        expect(notifications[1].getText()).toContain('Correct');
//                    });
//                });
//            });
//        });
//    });
//    it('should play the video and wait for the second in lecture quiz', function(){
//        driver.switchTo().frame(0);
//        driver.findElement(protractor.By.className('ytp-button-play')).then(function(play_button){
//            play_button.click();
//        });
//        driver.switchTo().defaultContent();
//        ptor.wait(function(){
//            return ptor.findElements(protractor.By.tagName('input')).then(function(inputs){
//                if(inputs.length == 6){
//                    return true;
//                }
//                return false;
//            });
//        });
//    });
//    it('should solve the second OCQ quiz', function(){
//        ptor.findElements(protractor.By.tagName('input')).then(function(choices){
//            choices[0].click();
//            ptor.findElements(protractor.By.className('btn-primary')).then(function(buttons){
//                buttons[buttons.length-1].click().then(function(){
//                    ptor.wait(function(){
//                        return ptor.findElements(protractor.By.className('well')).then(function(inputs){
//                            if(inputs.length == 2){
//                                return true;
//                            }
//                            return false;
//                        });
//                    });
//                    ptor.findElements(protractor.By.className('well')).then(function(notifications){
//                        expect(notifications[1].getText()).toContain('Correct');
//                    });
//                });
//            });
//        });
//    });
    //drag
//    it('should play the video and wait for the third in-lecture quiz', function(){
//        driver.switchTo().frame(0);
//        driver.findElement(protractor.By.className('ytp-button-play')).then(function(play_button){
//            play_button.click();
//        });
//        driver.switchTo().defaultContent();
//        ptor.wait(function(){
//            return ptor.findElements(protractor.By.tagName('student-drag')).then(function(drags){
//                if(drags.length == 3){
//                    return true;
//                }
//                return false;
//            });
//        });
//    });
//    it('should solve the DRAG quiz', function(){
//        var locationsx = new Array();
//        var locationsy = new Array();
//        ptor.findElements(protractor.By.className('drop-div')).then(function(dests){
//            dests[0].getLocation().then(function(location){
//                locationsx[0] = location.x+30;
//                locationsy[0] = location.y+20;
//            });
//            dests[1].getLocation().then(function(location){
//                locationsx[1] = location.x+30;
//                locationsy[1] = location.y+20;
//            });
//            dests[2].getLocation().then(function(location){
//                locationsx[2] = location.x+30;
//                locationsy[2] = location.y+20;
//            });
//            console.log(locationsx);
//            console.log(locationsy);
//        });
//        ptor.findElements(protractor.By.className('dragged')).then(function(answers){
//            answers.reverse();
//            answers.forEach(function(answer, i){
//                answer.getText().then(function(text){
//                    console.log(text);
//                    answer.getLocation().then(function(location){
//                        console.log((location.x+20) +' , '+(location.y+20));
//                        if(text == 'first answer'){
////                            ptor.findElements(protractor.By.className('drop-div')).then(function(locations){
////                                ptor.actions().dragAndDrop({x:locationsx[0], y:locationsy[0]}, {x:(location.x+20), y:(location.y+20)}).perform();
//                                ptor.actions().dragAndDrop({x:(location.x+100), y:(location.y+100)}, {x:location.x+20, y:location.y+20}).perform();
//                                ptor.sleep(10000);
////                            })
//                        }
//                        else if(text == 'second answer'){
////                            ptor.findElements(protractor.By.className('drop-div')).then(function(locations){
////                                ptor.actions().dragAndDrop({x:locationsx[1], y:locationsy[1]}, {x:(location.x+20), y:(location.y+20)}).perform();
//                                ptor.actions().dragAndDrop({x:(location.x+100), y:(location.y+100)}, {x:location.x+20, y:location.y+20}).perform();
//                                ptor.sleep(10000);
////                            });
//                        }
//                        else if(text == 'third answer'){
////                            ptor.findElements(protractor.By.className('drop-div')).then(function(locations){
////                                ptor.actions().dragAndDrop({x:locationsx[2], y:locationsy[2]}, {x:(location.x+20), y:(location.y+20)}).perform();
//                                ptor.actions().dragAndDrop({x:(location.x+100), y:(location.y+100)}, {x:location.x+20, y:location.y+20}).perform();
//                                ptor.sleep(10000);
////                            });
//                        }
//                    })
//                })
//            })
//        })
//    });
    it('should open the quiz in first module', function(){
        ptor.findElements(protractor.By.className('trigger2')).then(function(lectures){
            lectures[1].click();
        });
//        ptor.wait(function(){
//            return ptor.findElement(protractor.By.tagName('h4')).then(function(head){
//                head.getText().then(function(text){
//                    if(text == "New Quiz"){
//                        return true;
//                    }
//                    return false;
//                });
//            });
//        });
    });
    it('should display the answers available in the normal quiz in the first module', function(){
        ptor.findElements(protractor.By.tagName('th')).then(function(heads){
            expect(heads[0].getText()).toBe('1');
            expect(heads[1].getText()).toBe('DRAG Question');
            expect(heads[3].getText()).toBe('2');
            expect(heads[4].getText()).toBe('MCQ Question');
            expect(heads[6].getText()).toBe('3');
            expect(heads[7].getText()).toBe('OCQ Question');
        });
        ptor.findElement(protractor.By.id('middle')).then(function(middle){
            middle.findElements(protractor.By.tagName('td')).then(function(answers){
                expect(answers[5].getText()).toBe('first answer');
                expect(answers[9].getText()).toBe('second answer');
                expect(answers[13].getText()).toBe('third answer');

                expect(answers[17].getText()).toBe('first answer');
                expect(answers[21].getText()).toBe('second answer');
                expect(answers[25].getText()).toBe('third answer');
            });
        });
        ptor.findElements(protractor.By.repeater('answer in studentAnswers[question.id]')).then(function(drags){
            console.log(drags.length);
        });
    });
    it('should solve the normal quiz in the first module and save the answers', function(){
        ptor.findElements(protractor.By.className('handle')).then(function(drags){

            ptor.actions().dragAndDrop(drags[2], drags[0]).perform();
            ptor.actions().dragAndDrop(drags[1], drags[0]).perform();
        });

        var text;
        ptor.findElement(protractor.By.id('middle')).then(function(middle){
            middle.findElements(protractor.By.tagName('td')).then(function(data){
                data[1].getText().then(function(value){
                    text = value;
                    text.split('"').forEach(function(item, i){
                        choices[i] = item;
                    });
                });
            });
        });
        ptor.findElements(protractor.By.tagName('input')).then(function(checks){
            checks[0].click();
            checks[1].click();
            checks[3].click();
        });
        ptor.findElements(protractor.By.className('btn-primary')).then(function(buttons){
            buttons[0].click().then(function(){
//                feedback(ptor, 'Quiz was successfully saved', 1);
            });
        });
        doRefresh(ptor);
        ptor.findElements(protractor.By.tagName('input')).then(function(checks){
            expect(checks[0].getAttribute('checked')).toBe('true');
            expect(checks[1].getAttribute('checked')).toBe('true');
            expect(checks[2].getAttribute('checked')).toBe(null);
        });
        var counter = 0;
        ptor.findElement(protractor.By.id('middle')).then(function(middle){
            middle.findElements(protractor.By.tagName('td')).then(function(data){
                data[1].getText().then(function(value){
                    text = value;
                    text.split('"').forEach(function(item, i){
                        if(choices[i] == item){
                            counter++;
                        }
                    });
                    expect(choices.length).toBe(counter);
                });
            });
        });
    });
    it('should submit the answers', function(){
        ptor.findElements(protractor.By.tagName('input')).then(function(buttons){
            buttons[buttons.length-1].click();
        });
    });
    it('should see that all the attempts have been used', function(){
        ptor.findElement(protractor.By.className('alert')).then(function(alert){
            expect(alert.getText()).toContain('You\'ve submitted the Quiz and have no more attempts left');
        });
    });
//    it('should display which questions were solved correctly and which were not', function(){
//        ptor.findElement(protractor.By.id('middle')).then(function(middle))
//    });
//    cancelAccount(ptor, driver);
});


//functions definitions
function doRefresh(ptor){
    ptor.navigate().refresh();
}
function waitForElementNotVisible(element,ptor){
    ptor.wait(function(){
        return ptor.findElement(element).then(function(elem){
            return elem.getAttribute('class').then(function(classes){
                if(classes.indexOf('ng-hide') >= 0){
                    return true
                }
                return false
            })
        })
    })
}
function signUp(ptor, driver, name, email, password, role){
    if(role == 0){
        var which = 'Teacher';
    }
    else if(role == 1){
         var which = 'Student';
    }
    it('should sign up as a '+which, function(){
        driver.get(ptor.params.auth+'users/sign_up').then(function(){
            driver.findElements(protractor.By.tagName('input')).then(function(fields){
                fields[2].sendKeys(name);
                fields[3].sendKeys(email);
                fields[4].sendKeys(password);
                fields[5].sendKeys(password);
                if(role == 0){
                    //teacher
                    fields[6].click();
                }
                else if(role == 1){
                    fields[7].click();
                }
                fields[8].click().then(function(){
                    driver.findElement(protractor.By.id('flash_notice')).then(function(confirmation){
                        expect(confirmation.getText()).toContain('Welcome! You have signed up successfully.');
                    });
                    driver.get(ptor.params.frontend+'#/login').then(function(){
                        ptor.findElement(protractor.By.className('btn')).then(function(login_button){
                            login_button.click().then(function(){
                                driver.findElement(protractor.By.className('success')).then(function(button){
                                    button.click();
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

function cancelAccount(ptor, driver){
    it('should cancel the account', function(){
        driver.get(ptor.params.auth+'users/edit').then(function(){
            driver.findElement(protractor.By.linkText('Cancel my account')).then(function(link){
                link.click().then(function(){
                    var alert_dialog = ptor.switchTo().alert();
                    alert_dialog.accept();
                });
                driver.findElement(protractor.By.id('flash_notice')).then(function(confirmation){
                    expect(confirmation.getText()).toContain('Bye! Your account was successfully cancelled. We hope to see you again soon.');
                });
            });
        });
    });
}

function feedback(ptor, message, type){
    if(type==0){
        it('should display server\'s feedback', function(){
            ptor.wait(function(){
//                return ptor.isElementPresent(protractor.By.id('error_container')).then(function(value){
//                    return value
//                });
                var text = ptor.findElement(protractor.By.id('error_container')).then(function(error){
                    error.getText().then(function(text){
                        return text;
                    });
                });
                if(text.length>0){
                    return false;
                }
                else{
                    return true;
                }
            });
            ptor.findElement(protractor.By.id('error_container')).then(function(error){
                expect(error.getText()).toContain(message);
            });
        });
    }
    else if(type==1){
        ptor.wait(function(){
//            return ptor.isElementPresent(protractor.By.id('error_container')).then(function(value){
//                return value
//            });
            var text = ptor.findElement(protractor.By.id('error_container')).then(function(error){
                error.getText().then(function(text){
                    return text;
                });
            });
            if(text.length>0){
                return false;
            }
            else{
                return true;
            }
        });
        ptor.findElement(protractor.By.id('error_container')).then(function(error){
            expect(error.getText()).toContain(message);
        });
    }
}

function waitForElement(ptor, element){
    ptor.wait(function(){
        return ptor.isElementPresent(protractor.By.tagName('iframe')).then(function(value){
            return value
        });
    });
}
function doSave(ptor){
    it('should save', function(){
        ptor.findElement(protractor.By.id('done')).then(function(save){
            save.click();
        });
    });
}

function scroll(ptor, x, y){
    it('should scroll by '+x+' in x direction and by '+y+' in y direction', function(){
        ptor.executeScript('window.scrollBy('+x+', '+y+')', '');
    })
}