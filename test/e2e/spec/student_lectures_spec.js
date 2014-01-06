var util = require('util');
var enroll_key = '';
var course_id = '';

var frontend = 'http://localhost:9000/';
var backend = 'http://localhost:3000/';
var auth = 'http://localhost:4000/';

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
        driver.get(frontend+"#/login");
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

function logout(driver){
    it('should logout from scalear Auth', function(){
        driver.get(auth).then(function(){
            driver.findElements(protractor.By.tagName('a')).then(function(logout){
                logout[4].click();
            });
        });
    });
}

describe('Teacher', function(){
    var ptor = protractor.getInstance();
    var driver = ptor.driver;

    var findByName = function(name){
        return driver.findElement(protractor.By.name(name));
    };
    var findById = function(id){
        return driver.findElement(protractor.By.id(id))
    };
    login(ptor, driver, 'admin@scalear.com', 'password', 'admin', findByName);
    it('should create a new course', function(){
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
            fields[1].sendKeys('Z Testing - Student Lectures');
            fields[3].sendKeys('5');
            fields[4].sendKeys('http://google.com/');
            ptor.findElements(protractor.By.tagName('textarea')).then(function(fields){
                fields[0].sendKeys('new description');
                fields[1].sendKeys('new prerequisites');
            });
            ptor.findElements(protractor.By.tagName('select')).then(function(dropdown){
                dropdown[0].click();
                ptor.findElements(protractor.By.tagName('option')).then(function(options){
                    options[1].click();
                });
            });
            fields[fields.length-1].click();
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
    it('should navigate to course editor', function(){
        ptor.get('/#/courses/'+course_id+'/course_editor');
    });
    it('should add a new module and open it', function(){
        ptor.findElement(protractor.By.className('adding_module')).then(function(button){
            button.click().then(function(){
                ptor.findElement(protractor.By.className('trigger')).then(function(module){
                     module.click();
                });
            });
        });
    });
    it('should add a new lecture and open it', function(){
        ptor.findElements(protractor.By.className('adding')).then(function(buttons){
            buttons[0].click().then(function(){
                ptor.findElement(protractor.By.className('trigger2')).then(function(lecture){
                    lecture.click();
                });
            });
        });
    });
    it('should modify lecture url', function(){
        ptor.findElements(protractor.By.tagName('details-text')).then(function(details){
            details[1].click().then(function(){
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys('http://www.youtube.com/watch?v=XtyzOo7nJrQ').then(function(){
                        ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                            buttons[1].click().then(function(){
                                feedback(ptor, 'Lecture was successfully updated.', 1);
                            });
                        });
                    });
                });
            });
        });
    });
    it('should wait for the video to load', function(){
        ptor.wait(function(){
            return ptor.isElementPresent(protractor.By.tagName('iframe')).then(function(value){
                return value
            });
        });
        ptor.sleep(10000);
    });
    //add mcq multiple
    it('should add a new MCQ over video quiz', function(){
        ptor.findElements(protractor.By.className('dropdown-toggle')).then(function(buttons){
            buttons[1].click().then(function(){
                ptor.findElement(protractor.By.className('insertQuiz')).then(function(option){
                    option.click();
                });
            });
        });
    });
    it('should edit the MCQ quiz time', function(){
        ptor.findElements(protractor.By.tagName('editable_text')).then(function(editables){
            ptor.actions().doubleClick(editables[1]).perform().then(function(){
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys('00:01:00');
                });
                ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm){
                    confirm.click().then(function(){
                        feedback(ptor, 'Quiz was successfully updated.', 1);
                    });
                });
            });
        });
    });
    it('should add quiz answers on top of the video - MCQ Video', function(){
        var locx = 0, locy=0;
        //double click in 3 different places, delta should be in y direction with a positive value
        ptor.executeScript('window.scrollBy(0, -1000)', '');
        ptor.findElement(protractor.By.className('ontop')).then(function(test){
            ptor.actions().doubleClick(test).perform();
            //-----------------------------------------//
            ptor.findElements(protractor.By.className('dropped')).then(function(answers){
                answers[answers.length-1].getLocation().then(function(pnode){
                    locx = pnode.x+5;
                    locy = pnode.y;
                });
                ptor.actions().dragAndDrop({x:locx, y:locy}, {x: 200, y:115}).perform();
                ptor.findElement(protractor.By.className('popover-content')).then(function(popover){
                    popover.isDisplayed().then(function(disp){
                        expect(disp).toBe(true);
                    });
                });
                ptor.findElement(protractor.By.className('must_save_check')).then(function(correct){
                    correct.click();
                });
                expect(answers[answers.length-1].getAttribute('ng-src')).toContain('green');
                ptor.findElements(protractor.By.className('must_save')).then(function(fields){
                    fields[0].sendKeys('first answer');
                    fields[1].sendKeys('first explanation');
                });
            });
        });

        ptor.findElement(protractor.By.className('ontop')).then(function(test){
            var loc2x = 0, loc2y = 0;
            ptor.actions().doubleClick(test).perform();
            //-----------------------------------------//
            ptor.findElements(protractor.By.className('dropped')).then(function(answers){
                answers[answers.length-1].getLocation().then(function(pnode){
                    loc2x = pnode.x+5;
                    loc2y = pnode.y;
                });
                ptor.actions().dragAndDrop({x:loc2x, y:loc2y}, {x: 200, y:165}).perform();
                ptor.findElement(protractor.By.className('popover-content')).then(function(popover){
                    popover.isDisplayed().then(function(disp){
                        expect(disp).toBe(true);
                    });
                });
                ptor.findElement(protractor.By.className('must_save_check')).then(function(correct){
                    correct.click();
                });
                ptor.findElements(protractor.By.className('must_save')).then(function(fields){
                    fields[0].sendKeys('second answer');
                    fields[1].sendKeys('second explanation');
                });
            });
        });
        ptor.findElement(protractor.By.className('ontop')).then(function(test){
            var loc3x = 0, loc3y = 0;
            ptor.actions().doubleClick(test).perform();
            //-----------------------------------------//
            ptor.findElements(protractor.By.className('dropped')).then(function(answers){
                answers[answers.length-1].getLocation().then(function(pnode){
                    loc3x = pnode.x+5;
                    loc3y = pnode.y;
                });
                ptor.actions().dragAndDrop({x:loc3x, y:loc3y}, {x: 200, y:215}).perform();
                ptor.findElement(protractor.By.className('popover-content')).then(function(popover){
                    popover.isDisplayed().then(function(disp){
                        expect(disp).toBe(true);
                    });
                });
                ptor.findElements(protractor.By.className('must_save')).then(function(fields){
                    fields[0].sendKeys('third answer');
                    fields[1].sendKeys('third explanation');
                });
            });
        });
    });
    doSave(ptor);
    feedback(ptor, 'Quiz was successfully saved', 0);

    //add ocq
    it('should add a new OCQ over video quiz', function(){
        ptor.findElements(protractor.By.className('dropdown-toggle')).then(function(buttons){
            buttons[1].click().then(function(){
                ptor.findElements(protractor.By.className('insertQuiz')).then(function(options){
                    options[1].click();
                });
            });
        });
    });
    it('should edit the OCQ quiz time', function(){
        ptor.findElements(protractor.By.tagName('editable_text')).then(function(editables){
            ptor.actions().doubleClick(editables[1]).perform().then(function(){
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys('00:02:00');
                });
                ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm){
                    confirm.click().then(function(){
                        feedback(ptor, 'Quiz was successfully updated.', 1);
                    });
                });
            });
        });
    });
    it('should add quiz answers on top of the video - OCQ Video', function(){
        var locx = 0, locy=0;
        //double click in 3 different places, delta should be in y direction with a positive value
        ptor.executeScript('window.scrollBy(0, -1000)', '');
        ptor.findElement(protractor.By.className('ontop')).then(function(test){
            ptor.actions().doubleClick(test).perform();
            //-----------------------------------------//
            ptor.findElements(protractor.By.className('dropped')).then(function(answers){
                answers[answers.length-1].getLocation().then(function(pnode){
                    locx = pnode.x+5;
                    locy = pnode.y;
                });
                ptor.actions().dragAndDrop({x:locx, y:locy}, {x: 200, y:115}).perform();
                ptor.findElement(protractor.By.className('popover-content')).then(function(popover){
                    popover.isDisplayed().then(function(disp){
                        expect(disp).toBe(true);
                    });
                });
                ptor.findElement(protractor.By.className('must_save_check')).then(function(correct){
                    correct.click();
                });
                expect(answers[answers.length-1].getAttribute('ng-src')).toContain('green');
                ptor.findElements(protractor.By.className('must_save')).then(function(fields){
                    fields[0].sendKeys('first answer');
                    fields[1].sendKeys('first explanation');
                });
            });
        });

        ptor.findElement(protractor.By.className('ontop')).then(function(test){
            var loc2x = 0, loc2y = 0;
            ptor.actions().doubleClick(test).perform();
            //-----------------------------------------//
            ptor.findElements(protractor.By.className('dropped')).then(function(answers){
                answers[answers.length-1].getLocation().then(function(pnode){
                    loc2x = pnode.x+5;
                    loc2y = pnode.y;
                });
                ptor.actions().dragAndDrop({x:loc2x, y:loc2y}, {x: 200, y:165}).perform();
                ptor.findElement(protractor.By.className('popover-content')).then(function(popover){
                    popover.isDisplayed().then(function(disp){
                        expect(disp).toBe(true);
                    });
                });
                ptor.findElements(protractor.By.className('must_save')).then(function(fields){
                    fields[0].sendKeys('second answer');
                    fields[1].sendKeys('second explanation');
                });
            });
        });
        ptor.findElement(protractor.By.className('ontop')).then(function(test){
            var loc3x = 0, loc3y = 0;
            ptor.actions().doubleClick(test).perform();
            //-----------------------------------------//
            ptor.findElements(protractor.By.className('dropped')).then(function(answers){
                answers[answers.length-1].getLocation().then(function(pnode){
                    loc3x = pnode.x+5;
                    loc3y = pnode.y;
                });
                ptor.actions().dragAndDrop({x:loc3x, y:loc3y}, {x: 200, y:215}).perform();
                ptor.findElement(protractor.By.className('popover-content')).then(function(popover){
                    popover.isDisplayed().then(function(disp){
                        expect(disp).toBe(true);
                    });
                });
                ptor.findElements(protractor.By.className('must_save')).then(function(fields){
                    fields[0].sendKeys('third answer');
                    fields[1].sendKeys('third explanation');
                });
            });
        });
    });
    doSave(ptor);
    feedback(ptor, 'Quiz was successfully saved', 0);

    //add drag
    it('should add a new DRAG over video quiz', function(){
        ptor.findElements(protractor.By.className('dropdown-toggle')).then(function(buttons){
            buttons[1].click().then(function(){
                ptor.findElements(protractor.By.className('insertQuiz')).then(function(options){
                    options[2].click();
                });
            });
        });
    });
    it('should edit the drag quiz time', function(){
        ptor.findElements(protractor.By.tagName('editable_text')).then(function(editables){
            ptor.actions().doubleClick(editables[1]).perform().then(function(){
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys('00:03:00');
                });
                ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm){
                    confirm.click().then(function(){
                        feedback(ptor, 'Quiz was successfully updated.', 1);
                    });
                });
            });
        });
    });
    it('should add quiz answers on top of the video - DRAG Over Video', function(){
        var locx = 0, locy=0;
        //double click in 3 different places, delta should be in y direction with a positive value
        ptor.executeScript('window.scrollBy(0, -1000)', '');
        ptor.findElement(protractor.By.className('ontop')).then(function(test){
            ptor.actions().doubleClick(test).perform();
            //-----------------------------------------//
            ptor.findElements(protractor.By.className('dropped')).then(function(answers){
                answers[answers.length-1].getLocation().then(function(pnode){
                    locx = pnode.x+5;
                    locy = pnode.y;
                });
                ptor.actions().dragAndDrop({x:locx, y:locy}, {x: 200, y:115}).perform();
            });
        });

        ptor.findElement(protractor.By.className('ontop')).then(function(test){
            var loc2x = 0, loc2y = 0;
            ptor.actions().doubleClick(test).perform();
            //-----------------------------------------//
            ptor.findElements(protractor.By.className('dropped')).then(function(answers){
                answers[answers.length-1].getLocation().then(function(pnode){
                    loc2x = pnode.x+5;
                    loc2y = pnode.y;
                });
                ptor.actions().dragAndDrop({x:loc2x, y:loc2y}, {x: 200, y:165}).perform();
            });
        });


        ptor.findElement(protractor.By.className('ontop')).then(function(test){
            var loc3x = 0, loc3y = 0;
            ptor.actions().doubleClick(test).perform();
            //-----------------------------------------//
            ptor.findElements(protractor.By.className('dropped')).then(function(answers){
                answers[answers.length-1].getLocation().then(function(pnode){
                    loc3x = pnode.x+5;
                    loc3y = pnode.y;
                });
                ptor.actions().dragAndDrop({x:loc3x, y:loc3y}, {x: 200, y:215}).perform();
            });
        });

        ptor.findElements(protractor.By.className('area')).then(function(fields){
            fields[0].sendKeys('first answer');
            fields[0].click();
            ptor.findElement(protractor.By.className('popover-content')).then(function(popover){
                popover.isDisplayed().then(function(disp){
                    expect(disp).toBe(true);
                });
            });
            ptor.findElements(protractor.By.className('must_save')).then(function(fields){
                fields[0].sendKeys('correct explanation');
                fields[1].sendKeys('first wrong explanation');
                fields[2].sendKeys('second wrong explanation');
            });

            fields[fields.length-2].sendKeys('second answer');
            fields[fields.length-2].click();
            ptor.findElement(protractor.By.className('popover-content')).then(function(popover){
                popover.isDisplayed().then(function(disp){
                    expect(disp).toBe(true);
                });
            });
            ptor.findElements(protractor.By.className('must_save')).then(function(fields){
                fields[0].sendKeys('correct explanation');
                fields[1].sendKeys('first wrong explanation');
                fields[2].sendKeys('second wrong explanation');
            });
            fields[fields.length-1].sendKeys('third answer');
            fields[fields.length-1].click();
            ptor.findElement(protractor.By.className('popover-content')).then(function(popover){
                popover.isDisplayed().then(function(disp){
                    expect(disp).toBe(true);
                });
            });
            ptor.findElements(protractor.By.className('must_save')).then(function(fields){
                fields[0].sendKeys('correct explanation');
                fields[1].sendKeys('first wrong explanation');
                fields[2].sendKeys('second wrong explanation');
            });
        });
    });
    doSave(ptor);
    feedback(ptor, 'Quiz was successfully saved', 0);

//creating a second module
    it('should add a new module and open it', function(){
        ptor.findElement(protractor.By.className('adding_module')).then(function(button){
            button.click().then(function(){
                ptor.findElements(protractor.By.className('trigger')).then(function(modules){
                    modules[modules.length-1].click();
                });
            });
        });
    });
    it('should edit module\'s name', function(){
       ptor.findElement(protractor.By.tagName('details-text')).then(function(name){
           name.click().then(function(){
               ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                   field.sendKeys(' 2').then(function(){
                       ptor.findElement(protractor.By.className('icon-ok')).then(function(ok){
                           ok.click();
                           feedback(ptor, 'Module was successfully updated', 1);
                       });
                   });
               });
           });
       });
    });
    it('should add a new lecture and open it', function(){
        ptor.findElements(protractor.By.className('adding')).then(function(buttons){
            buttons[0].click().then(function(){
                ptor.findElement(protractor.By.className('trigger2')).then(function(lecture){
                    lecture.click();
                });
            });
        });
    });
    it('should modify lecture\'s name', function(){
        ptor.findElement(protractor.By.tagName('details-text')).then(function(name){
            name.click().then(function(){
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.sendKeys(' 2').then(function(){
                        ptor.findElement(protractor.By.className('icon-ok')).then(function(ok){
                            ok.click();
                            feedback(ptor, 'Lecture was successfully updated', 1);
                        });
                    });
                });
            });
        })
    });
    it('should modify lecture url', function(){
        ptor.findElements(protractor.By.tagName('details-text')).then(function(details){
            details[1].click().then(function(){
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys('http://www.youtube.com/watch?v=XtyzOo7nJrQ').then(function(){
                        ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                            buttons[1].click().then(function(){
                                feedback(ptor, 'Lecture was successfully updated.', 1);
                            });
                        });
                    });
                });
            });
        });
    });
    it('should wait for the video to load', function(){
        ptor.wait(function(){
            return ptor.isElementPresent(protractor.By.tagName('iframe')).then(function(value){
                return value
            });
        });
        ptor.sleep(10000);
    });

});


//functions definitions
function feedback(ptor, message, type){
    if(type==0){
        it('should display server\'s feedback', function(){
            ptor.findElement(protractor.By.id('error_container')).then(function(error){
                expect(error.getText()).toContain(message);
            });
        });
    }
    else if(type==1){
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