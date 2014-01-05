var current_date = new Date();
var no_students, no_modules, percentage, dummy, enroll_key='', course_id='276', module_id='';
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
//var tomorrow_keys = formatDate(getNextDay(new Date()), 0);
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
//Progress Tests


describe('Progress Chart', function(){
    var ptor = protractor.getInstance();
    var driver = ptor.driver;

    var findByName = function(name){
        return driver.findElement(protractor.By.name(name));
    };
    var findById = function(id){
        return driver.findElement(protractor.By.id(id))
    };
    describe('Teacher', function(){
        login(ptor, driver, 'admin@scalear.com', 'password', 'Administrator', findByName);
//        it('should go to the main progress page for a course', function(){
//            ptor.get('/#/courses/134/progress/main');
//        });
        it('should create a new course', function(){
            ptor = protractor.getInstance();
            ptor.get('/#/courses/new');
            ptor.findElements(protractor.By.tagName('input')).then(function(fields){
                fields[0].sendKeys('TEST-101');
                fields[1].sendKeys('Z Testing Course');
//                fields[2].sendKeys(today_keys);
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
        it('should go to course information page', function(){
            ptor.findElement(protractor.By.className('dropdown-toggle')).click();
            ptor.findElement(protractor.By.id('info')).click();
        });
        it('should save the course id', function(){
            ptor.getCurrentUrl().then(function(text){
                var test = text.split('/')
                course_id = test[test.length-1];
//                console.log('course id is : '+course_id);
            })
        })
        it('should save enrollment key', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                data[0].getText().then(function(text){
                    enroll_key = text;
                });
            });
        });
        it('should go to course editor', function(){
            ptor.findElement(protractor.By.id('course_editor_link')).then(function(link){
                link.click();
            });
        });
        it('should add a new module and open it', function(){
            ptor.findElement(protractor.By.className('adding_module')).then(function(button){
                button.click();
            });
            ptor.findElement(protractor.By.className('trigger')).click();
        });
        it('should save module id', function(){
            ptor.getCurrentUrl().then(function(text){
                var test2 = text.split('/');
                module_id = test2[test2.length-1];
//                console.log('module id is '+module_id);
            })
        })
        it('should edit module name', function(){
            ptor.findElement(protractor.By.tagName('details-text')).then(function(field){
                field.click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys('First Module');
                });
                ptor.findElement(protractor.By.className('btn-primary')).click();
//                feedback(ptor, 'Module Successfully Updated');
            });
        });
        it('should add a new lecture and open it', function(){
            ptor.findElements(protractor.By.className('adding')).then(function(adding){
                adding[adding.length-3].click();
            });
//            feedback(ptor, 'Lecture was successfully created.');
            ptor.findElement(protractor.By.className('trigger2')).click();
        });
        it('should edit lecture video', function(){
            ptor.findElements(protractor.By.tagName('details-text')).then(function(url){
                url[1].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys('http://www.youtube.com/watch?v=XtyzOo7nJrQ');
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(confirm){
                    confirm[1].click();
                })
//                feedback(ptor, 'Lecture was successfully updated.');
            });
        });
        it('should wait', function(){
            ptor.sleep(10000);
        });
        it('should add an MCQ quiz', function(){
            ptor.findElements(protractor.By.className('dropdown-toggle')).then(function(lists){
                lists[1].click();
                ptor.findElement(protractor.By.className('insertQuiz')).then(function(option){
                    option.click();
                });
            });
        });
        it('should edit quiz name and time', function(){
            ptor.findElement(protractor.By.tagName('editable_text')).then(function(name){
                ptor.actions().doubleClick(name).perform();
            });
            ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                field.clear();
                field.sendKeys('First Quiz');
            });
            ptor.findElement(protractor.By.className('icon-ok')).click();
//            feedback(ptor, 'Quiz was successfully updated. -');
            ptor.findElements(protractor.By.tagName('editable_text')).then(function(time){
                ptor.actions().doubleClick(time[1]).perform();
            });
            ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                field.clear();
                field.sendKeys('00:01:07');
            });
            ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm){
                confirm.click();
            });
//            feedback(ptor, 'Quiz was successfully updated. -');
        });
        addMCQAnswers(ptor);
        doSave(ptor);
        doExit(ptor);
        it('should add a new lecture and open it', function(){
            ptor.findElements(protractor.By.className('adding')).then(function(adding){
                adding[adding.length-3].click();
            });
//            feedback(ptor, 'Lecture was successfully created.');
            ptor.findElements(protractor.By.className('trigger2')).then(function(lectures){
                lectures[lectures.length-1].click();
            })
        });
        it('should edit lecture name', function(){
            ptor.findElements(protractor.By.tagName('details-text')).then(function(details){
                details[0].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys('New Lecture2');
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(confirm){
                    confirm[1].click();
                });
            });
        });
        it('should edit lecture video', function(){
            ptor.findElements(protractor.By.tagName('details-text')).then(function(url){
                url[1].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys('http://www.youtube.com/watch?v=PlavjNH_RRU');
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(confirm){
                    confirm[1].click();
                })
//                feedback(ptor, 'Lecture was successfully updated.');
            });
        });
        it('should wait', function(){
            ptor.sleep(10000);
        });
        it('should add an MCQ quiz', function(){
            ptor.findElements(protractor.By.className('dropdown-toggle')).then(function(lists){
                lists[2].click();
                ptor.findElements(protractor.By.className('insertQuiz')).then(function(options){
                    options[options.length-2].click();
                });
            });
        });
        it('should edit quiz name and time', function(){
            ptor.findElement(protractor.By.tagName('editable_text')).then(function(name){
                ptor.actions().doubleClick(name).perform();
            });
            ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                field.clear();
                field.sendKeys('New Quiz2');
            });
            ptor.findElement(protractor.By.className('icon-ok')).click();
//            feedback(ptor, 'Quiz was successfully updated. -');
            ptor.findElements(protractor.By.tagName('editable_text')).then(function(time){
                ptor.actions().doubleClick(time[1]).perform();
            });
            ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                field.clear();
                field.sendKeys('00:00:12');
            });
            ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm){
                confirm.click();
            });
//            feedback(ptor, 'Quiz was successfully updated. -');
        });
        it('should insert answers', function(){
            ptor.findElement(protractor.By.className('add_multiple_answer')).then(function(addButton){
                addButton.click();
            });
            ptor.findElements(protractor.By.tagName('input')).then(function(answers){
//                answers[1].clear();
                answers[1].sendKeys('First Answer');
//                answers[2].clear();
                answers[3].sendKeys('First Explanation');
//                answers[3].clear();
                answers[4].sendKeys('Second Answer');
//                answers[4].clear();
                answers[6].sendKeys('Second Explanation');
            });
            ptor.findElement(protractor.By.id('radio_correct')).then(function(radio){
                radio.click();
            });
        });
        doSave(ptor);
        doExit(ptor);
        it('should add a new quiz and open it', function(){
            ptor.findElements(protractor.By.className('adding')).then(function(adding){
                adding[adding.length-2].click();
            });
//            feedback(ptor, 'Lecture was successfully created.');
            ptor.findElements(protractor.By.className('trigger2')).then(function(lectures){
                lectures[lectures.length-1].click();
            });
        });
        it('should make the quiz required', function(){
            ptor.findElements(protractor.By.tagName('details-check')).then(function(details){
                details[0].click();
            });
            ptor.findElements(protractor.By.tagName('input')).then(function(inputs){
                inputs[inputs.length-1].click();
            });
            ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                buttons[buttons.length-2].click();
            });
        });
        it('should add question and answers', function(){
            ptor.executeScript('window.scrollBy(0, -1000)', '');
            ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                buttons[1].click();
            });
            ptor.findElement(protractor.By.className('add_multiple_answer')).then(function(addButton){
                addButton.click();
                addButton.click();
            });
            ptor.findElements(protractor.By.tagName('input')).then(function(fields){
                fields[0].sendKeys('First Question');
                fields[1].sendKeys('First Answer');
                fields[2].click();
                fields[3].sendKeys('Second Answer');
                fields[5].sendKeys('Third Answer');
            });
        });
        it('should save the quiz', function(){
            ptor.findElements(protractor.By.tagName('button')).then(function(save){
                save[2].click();
            });
        });
        it('should add a new quiz and open it', function(){
            ptor.findElements(protractor.By.className('adding')).then(function(adding){
                adding[adding.length-2].click();
            });
//            feedback(ptor, 'Lecture was successfully created.');
            ptor.findElements(protractor.By.className('trigger2')).then(function(lectures){
                lectures[lectures.length-1].click();
            });
        });
        it('should edit the quiz name', function(){
//            ptor.executeScript('window.scrollBy(0, -1000)', '');
            ptor.findElement(protractor.By.tagName('details-text')).then(function(field){
                field.click();
            });
            ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                field.clear();
                field.sendKeys('New Quiz2');
            });
            ptor.findElements(protractor.By.tagName('button')).then(function(confirm){
                confirm[3].click();
            });
        })
        it('should add question and answers', function(){
            ptor.executeScript('window.scrollBy(0, -1000)', '');
            ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                buttons[1].click();
            });
            ptor.findElement(protractor.By.className('add_multiple_answer')).then(function(addButton){
                addButton.click();
            });
            ptor.findElement(protractor.By.tagName('select')).then(function(dropdown){
                dropdown.click();
                ptor.findElements(protractor.By.tagName('option')).then(function(options){
                    options[1].click();
                });
            })
            ptor.findElements(protractor.By.tagName('input')).then(function(fields){
                fields[0].sendKeys('First Question');
                fields[1].sendKeys('Should be correct');
                fields[2].click();
                fields[3].sendKeys('should be false');
            });
        });
        it('should save the quiz', function(){
            ptor.findElements(protractor.By.tagName('button')).then(function(save){
                save[2].click();
            });
        });

        it('should add a new survey and open it', function(){
            ptor.findElements(protractor.By.className('adding')).then(function(adding){
                adding[adding.length-1].click();
            });
//            feedback(ptor, 'Lecture was successfully created.');
            ptor.findElements(protractor.By.className('trigger2')).then(function(lectures){
                lectures[lectures.length-1].click();
            });
        });
        it('should add question and answers', function(){
            ptor.executeScript('window.scrollBy(0, -1000)', '');
            ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                buttons[1].click();
            });
            ptor.findElement(protractor.By.className('add_multiple_answer')).then(function(addButton){
                addButton.click();
            });
            ptor.findElements(protractor.By.tagName('input')).then(function(fields){
                fields[0].sendKeys('First Question');
                fields[1].sendKeys('first answer');
                fields[2].sendKeys('second answer');
            });
        });
        it('should add question and answers', function(){
            ptor.executeScript('window.scrollBy(0, -1000)', '');
            ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                buttons[1].click();
            });
            ptor.findElements(protractor.By.tagName('select')).then(function(dropdowns){
                dropdowns[dropdowns.length-1].click();
                ptor.findElements(protractor.By.tagName('option')).then(function(options){
                    options[options.length-2].click();
                });
            })
            ptor.findElements(protractor.By.className('add_multiple_answer')).then(function(addButtons){
                addButtons[addButtons.length-1].click();
            });
            ptor.findElements(protractor.By.tagName('input')).then(function(fields){
                fields[3].sendKeys('Second Question');
                fields[4].sendKeys('first answer');
                fields[5].sendKeys('second answer');
            });
        });
        it('should add question and answers', function(){
            ptor.executeScript('window.scrollBy(0, -1000)', '');
            ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                buttons[1].click();
            });
            ptor.findElements(protractor.By.tagName('select')).then(function(dropdowns){
                dropdowns[dropdowns.length-1].click();
                ptor.findElements(protractor.By.tagName('option')).then(function(options){
                    options[options.length-1].click();
                });
            })
            ptor.findElements(protractor.By.tagName('input')).then(function(fields){
                fields[6].sendKeys('Third Question');

            });
            ptor.sleep(10000);
        });
        it('should save the quiz', function(){
            ptor.findElements(protractor.By.tagName('button')).then(function(save){
                save[2].click();
            });
            ptor.sleep(5000);
        });

        //add second module
        it('should add a new module and open it', function(){
            ptor.findElement(protractor.By.className('adding_module')).then(function(button){
                button.click();
            });
            ptor.findElements(protractor.By.className('trigger')).then(function(modules){
                modules[modules.length-1].click();
            });
        });
        it('should edit module name', function(){
            ptor.findElement(protractor.By.tagName('details-text')).then(function(field){
                field.click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys('Second Module');
                });
                ptor.findElement(protractor.By.className('btn-primary')).click();
//                feedback(ptor, 'Module Successfully Updated');
            });
        });
        it('should add a new lecture and open it', function(){
            ptor.findElements(protractor.By.className('adding')).then(function(adding){
                adding[adding.length-3].click();
            });
//            feedback(ptor, 'Lecture was successfully created.');
            ptor.findElements(protractor.By.className('trigger2')).then(function(lectures){
                lectures[lectures.length-1].click();
            });
        });
        it('should edit lecture\'s name', function(){
            ptor.findElement(protractor.By.tagName('details-text')).then(function(field){
                field.click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(input){
                    input.clear();
                    input.sendKeys('Second Lecture');
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(confirm){
                    confirm[1].click();
                });
            });
        });
        it('should edit lecture video', function(){
            ptor.findElements(protractor.By.tagName('details-text')).then(function(url){
                url[1].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys('http://www.youtube.com/watch?v=XtyzOo7nJrQ');
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(confirm){
                    confirm[1].click();
                })
//                feedback(ptor, 'Lecture was successfully updated.');
            });
        });
        it('should wait', function(){
            ptor.sleep(3000);
        });
        it('should add a new quiz and open it', function(){
            ptor.findElements(protractor.By.className('adding')).then(function(adding){
                adding[adding.length-2].click();
            });
//            feedback(ptor, 'Lecture was successfully created.');
            ptor.findElements(protractor.By.className('trigger2')).then(function(lectures){
                lectures[lectures.length-1].click();
            });
        });
        it('should make the quiz required', function(){
            ptor.findElements(protractor.By.tagName('details-check')).then(function(details){
                details[0].click();
            });
            ptor.findElements(protractor.By.tagName('input')).then(function(inputs){
                inputs[inputs.length-1].click();
            });
            ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                buttons[buttons.length-2].click();
            });
        });
        it('should add question and answers', function(){
            ptor.executeScript('window.scrollBy(0, -1000)', '');
            ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                buttons[1].click();
            });
            ptor.findElement(protractor.By.className('add_multiple_answer')).then(function(addButton){
                addButton.click();
            });
            ptor.findElements(protractor.By.tagName('input')).then(function(fields){
                fields[0].sendKeys('Second Quiz');
                fields[1].sendKeys('First Answer');
                fields[3].sendKeys('Second Answer');
                fields[4].click();
            });
        });
        it('should save the quiz', function(){
            ptor.findElements(protractor.By.tagName('button')).then(function(save){
                save[2].click();
            });
        });
        it('should add a new survey', function(){
            ptor.findElements(protractor.By.className('adding')).then(function(adding){
                adding[adding.length-1].click();
            });
//            feedback(ptor, 'Lecture was successfully created.');
        });

        //add third module
        it('should add a new module and open it', function(){
            ptor.findElement(protractor.By.className('adding_module')).then(function(button){
                button.click();
            });
            ptor.findElements(protractor.By.className('trigger')).then(function(modules){
                modules[modules.length-1].click();
            });
        });
        it('should edit module name', function(){
            ptor.findElement(protractor.By.tagName('details-text')).then(function(field){
                field.click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys('Third Module');
                });
                ptor.findElement(protractor.By.className('btn-primary')).click();
//                feedback(ptor, 'Module Successfully Updated');
            });
        });
        it('should add a new lecture and open it', function(){
            ptor.findElements(protractor.By.className('adding')).then(function(adding){
                adding[adding.length-3].click();
            });
//            feedback(ptor, 'Lecture was successfully created.');
            ptor.findElements(protractor.By.className('trigger2')).then(function(lectures){
                lectures[lectures.length-1].click();
            });
        });
        it('should edit lecture\'s name', function(){
            ptor.findElement(protractor.By.tagName('details-text')).then(function(field){
                field.click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(input){
                    input.clear();
                    input.sendKeys('Third Lecture');
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(confirm){
                    confirm[1].click();
                });
            });
        });
        it('should edit lecture video', function(){
            ptor.findElements(protractor.By.tagName('details-text')).then(function(url){
                url[1].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys('http://www.youtube.com/watch?v=XtyzOo7nJrQ');
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(confirm){
                    confirm[1].click();
                })
//                feedback(ptor, 'Lecture was successfully updated.');
            });
        });
        it('should wait', function(){
            ptor.sleep(3000);
        });
        it('should add a new quiz and open it', function(){
            ptor.findElements(protractor.By.className('adding')).then(function(adding){
                adding[adding.length-2].click();
            });
//            feedback(ptor, 'Lecture was successfully created.');
        });
        it('should add a new survey', function(){
            ptor.findElements(protractor.By.className('adding')).then(function(adding){
                adding[adding.length-1].click();
            });
//            feedback(ptor, 'Lecture was successfully created.');
//            console.log(enroll_key);
        });
        logout(driver);
    });
    describe('Student', function(){
        login(ptor, driver, 'bahia.sharkawy@gmail.com', 'password', 'bahia', findByName);
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
                proceed.click();
            });
        });
        it('should go the course', function(){
            ptor.findElements(protractor.By.binding('course.name')).then(function(courses){
                courses[courses.length-1].click();
            });
        });
        it('should go to the lectures page', function(){
            ptor.findElement(protractor.By.id('lectures_link')).click();
        });
        it('should open first module', function(){
            ptor.findElement(protractor.By.className('trigger')).click();
        });
        it('should open new lecture 2', function(){
            ptor.findElements(protractor.By.className('trigger2')).then(function(lectures){
                lectures[1].click();
                ptor.sleep(5000);
            });
        });
        it('should click on New QUIZ 2', function(){
            ptor.findElement(protractor.By.xpath('//*[@id="middle"]/div/table/tbody/tr/td[2]/p')).click();
            ptor.sleep(2000);
        });
        it('should select first answer', function(){
            ptor.findElement(protractor.By.tagName('input')).click();
        });
        it('should click on check answer', function(){
            ptor.findElements(protractor.By.className('btn-primary')).then(function(buttons){
                buttons[1].click();
            });
        });
        it('should open new quiz 2', function(){
            ptor.findElements(protractor.By.className('trigger2')).then(function(lectures){
                lectures[3].click();
                ptor.sleep(5000);
            });
        });
        it('should select the second answer - should be false', function(){
            ptor.findElements(protractor.By.tagName('input')).then(function(inputs){
                inputs[1].click();
                inputs[3].click();
            });
        });
        it('should open new survey', function(){
            ptor.findElements(protractor.By.className('trigger2')).then(function(lectures){
                lectures[4].click();
                ptor.sleep(5000);
            });
        });
        it('should select the survey answers', function(){
            ptor.findElements(protractor.By.tagName('input')).then(function(inputs){
                inputs[0].click();
                inputs[3].click();
                ptor.findElement(protractor.By.tagName('textarea')).then(function(field){
                    field.sendKeys('third answer');
                });
                inputs[4].click();
            });
        });
        it('should open the second module', function(){
            ptor.findElements(protractor.By.className('trigger')).then(function(modules){
                modules[1].click();
            });
        });
        it('should click on the second lecture and then click on the new quiz', function(){
            ptor.executeScript('window.scrollBy(0, -1000)', '');
            ptor.findElements(protractor.By.className('trigger2')).then(function(lectures){
                lectures[5].click();
                ptor.sleep(10000);
                lectures[6].click();
                ptor.sleep(10000);
            });
        });
        it('should solve the quiz', function(){
            ptor.findElements(protractor.By.tagName('input')).then(function(inputs){
                inputs[1].click();
                inputs[3].click();
            });
        });

        logout(driver);
        login(ptor, driver, 'em_menshawi@hotmail.com', 'password', 'mahmoud menshawi', findByName);
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
                proceed.click();
            });
        });
        it('should go to the course', function(){
            ptor.findElements(protractor.By.binding('course.name')).then(function(courses){
                courses[courses.length-1].click();
            });
        });
        it('should go to the lectures page', function(){
            ptor.findElement(protractor.By.id('lectures_link')).click();
        });
        it('should open first module', function(){
            ptor.findElement(protractor.By.className('trigger')).click();
        });
        it('should open new lecture', function(){
            ptor.findElements(protractor.By.className('trigger2')).then(function(lectures){
                lectures[0].click();
                ptor.sleep(5000);
            });
        });
        it('should click on First Quiz', function(){
            ptor.findElement(protractor.By.xpath('//*[@id="middle"]/div/table/tbody/tr/td[2]/p')).click();
            ptor.sleep(2000);
        });
        it('should select first answer', function(){
            ptor.findElement(protractor.By.name('student_answer')).click();
        });
        it('should click on check answer', function(){
            ptor.findElements(protractor.By.className('btn-primary')).then(function(buttons){
                buttons[1].click();
            });
        });

        it('should open new lecture 2', function(){
            ptor.executeScript('window.scrollBy(0, -1000)', '');
            ptor.findElements(protractor.By.className('trigger2')).then(function(lectures){
                lectures[1].click();
                ptor.sleep(9000);
            });
        });
        it('should click on question', function(){
//            driver.switchTo().frame(0);
            driver.findElement(protractor.By.className("questionDiv")).then(function(button){
                button.click();
                driver.findElement(protractor.By.className('question')).then(function(field){
                    field.sendKeys('why isn\'t it working?')
                });
                driver.findElement(protractor.By.className('submit_question')).then(function(submit_button){
                    submit_button.click();
//                    ptor.sleep(1000);
                });
            });
//            driver.switchTo().defaultContent();
        })
        it('should click on New QUIZ 2', function(){
            ptor.findElement(protractor.By.xpath('//*[@id="middle"]/div/table/tbody/tr/td[2]/p')).click();
            ptor.sleep(5000);
        });
        it('should select second answer', function(){
            ptor.findElements(protractor.By.tagName('input')).then(function(inputs){
                inputs[1].click();
            });
        });
        it('should click on check answer', function(){
            ptor.findElements(protractor.By.className('btn-primary')).then(function(buttons){
                buttons[1].click();
            });
        });
        it('should go to New Quiz', function(){
            ptor.findElements(protractor.By.className('trigger2')).then(function(lectures){
                lectures[2].click();
                ptor.sleep(5000);
            });
        });
        it('should select first answer', function(){
            ptor.findElement(protractor.By.tagName('input')).click();
        });
        it('should submit the answer', function(){
            ptor.findElements(protractor.By.className('btn-primary')).then(function(buttons){
                buttons[1].click();
            });
        });
        it('should open second module', function(){
            ptor.findElements(protractor.By.className('trigger')).then(function(modules){
                modules[1].click();
            });
        });
        it('should open second lecture then open second quiz', function(){
            ptor.executeScript('window.scrollBy(0, -1000)', '');
            ptor.findElements(protractor.By.className('trigger2')).then(function(lectures){
                lectures[5].click();
                ptor.sleep(7000);
                lectures[6].click();
            });
        });
        it('should select the first answer and submit the quiz', function(){
            ptor.findElements(protractor.By.tagName('input')).then(function(answers){
                answers[0].click();
            });
            ptor.findElements(protractor.By.className('btn-primary')).then(function(buttons){
                buttons[1].click();
            });
        });
        it('should open the third module', function(){
            ptor.findElements(protractor.By.className('trigger')).then(function(modules){
                modules[2].click();
            });
        });
        it('should open the third lecture and then open New Quiz', function(){
            ptor.findElements(protractor.By.className('trigger2')).then(function(lectures){
                lectures[8].click();
                ptor.sleep(5000);
                lectures[9].click();
            });
        });
        logout(driver);
    });
    describe('Teacher', function(){
        login(ptor, driver, 'admin@scalear.com', 'password', 'admin', findByName);
        it('should go to the main progress page', function(){
            ptor.get('/#/courses/'+course_id+'/progress/main');
        });
    })


    describe('Module Progress', function(){
        it('should display two tabs', function(){
            ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div/ul/li[1]/a')).then(function(first_tab){
                expect(first_tab.getText()).toBe('Module Progress');
            });
            ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div/ul/li[2]/a')).then(function(second_tab){
                expect(second_tab.getText()).toBe('Module Chart');
            });
        });
        it('should display the chart title', function(){
            ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div/div/div[1]/h3')).then(function(title){
                expect(title.getText()).toBe('Module Progress Charts');
            });
        });
        it('should display correct student names and emails', function(){
            ptor.findElements(protractor.By.repeater('student in students')).then(function(names){
                expect(names[0].getText()).toBe('Bahia');
                ptor.actions().mouseMove(names[0]).perform();
                ptor.findElement(protractor.By.className('tooltip')).then(function(tooltip){
                    expect(tooltip.getText()).toBe('bahia.sharkawy@gmail.com');
                });
                expect(names[1].getText()).toBe('Mahmoud Menshawi');
                ptor.actions().mouseMove(names[1]).perform().then(function(){
                    ptor.sleep(500);
                    ptor.findElement(protractor.By.className('tooltip')).then(function(tooltip){
                        expect(tooltip.getText()).toBe('em_menshawi@hotmail.com');
                    });
                });


            });
        });
        it('should display modules\' names in their correct order', function(){
            ptor.findElements(protractor.By.repeater('name in columnNames')).then(function(modules){
                expect(modules.length).toBe(3);
                no_modules = modules.length;
                expect(modules[0].getText()).toBe('First Module');
                expect(modules[1].getText()).toBe('Second Module');
                expect(modules[2].getText()).toBe('Third Module');
            });
        });
        it('should display which modules were finished by each user correctly', function(){
            ptor.findElements(protractor.By.repeater('student in students')).then(function(students){
                expect(students.length).toBe(2);
                no_students = students.length;
                ptor.findElements(protractor.By.className('marker')).then(function(markers){
                    for(var s=0; s<no_students; s++){
                        for(var m=0; m<no_modules; m++){
                            p = (no_modules*s)+m;
                            if(p==0){
                                expect(markers[p].getAttribute('src')).toContain('Not_Finished.png');
                            }
                            else if(p==1){
                                expect(markers[p].getAttribute('src')).toContain('Finished_on_Time.png');
                            }
                            else if(p==2){
                                expect(markers[p].getAttribute('src')).toContain('Not_Finished.png');
                            }
                            else if(p==3){
                                expect(markers[p].getAttribute('src')).toContain('Finished_on_Time.png');
                            }
                            else if(p==4){
                                expect(markers[p].getAttribute('src')).toContain('Finished_on_Time.png');
                            }
                            else if(p==5){
                                expect(markers[p].getAttribute('src')).toContain('Finished_on_Time.png');
                            }
                        }
                    }
                });
            });

        });
        it('should be able to change the status of each module for each student', function(){
            ptor.findElements(protractor.By.className('marker')).then(function(markers){
                markers[0].click().then(function(){

                    ptor.findElements(protractor.By.tagName('input')).then(function(options){
                        options[1].click().then(function(){
                            ptor.findElements(protractor.By.className('marker')).then(function(image){
                                expect(image[0].getAttribute('src')).toContain('Finished_on_Time.png');
                            });
                        }).then(function(){
                                ptor.navigate().refresh();
                            });
                    })
                });
            });
            ptor.findElements(protractor.By.className('marker')).then(function(markers){
                markers[0].click().then(function(){
                    ptor.sleep(500);
                    ptor.findElements(protractor.By.tagName('input')).then(function(options){
                        options[0].click().then(function(){
                            ptor.findElements(protractor.By.className('marker')).then(function(image){
                                expect(image[0].getAttribute('src')).toContain('Not_Finished.png');
                            });
                        });
                    })
                });
            });
        });
    });

    describe('Teacher', function(){
        it('should go to course editor', function(){
            ptor.get('/#/courses/'+course_id+'/course_editor');
        });
        it('should change the order of the modules and go back to the progress page', function(){
            ptor.findElements(protractor.By.className('handle')).then(function(handles){
                browser.actions().dragAndDrop(handles[6], handles[0]).perform();
            });
        });
        it('should go back to progress pages', function(){
            ptor.get('/#/courses/'+course_id+'/progress/main');
        })
    });

    describe('Module Progress', function(){
        it('should display correct student names and emails after sorting modules', function(){
            ptor.findElements(protractor.By.repeater('student in students')).then(function(names){
                expect(names[0].getText()).toBe('Bahia');
                ptor.actions().mouseMove(names[0]).perform();
                ptor.findElement(protractor.By.className('tooltip')).then(function(tooltip){
                    expect(tooltip.getText()).toBe('bahia.sharkawy@gmail.com');
                });
                expect(names[1].getText()).toBe('Mahmoud Menshawi');
                ptor.actions().mouseMove(names[1]).perform().then(function(){
                    ptor.sleep(500);
                    ptor.findElement(protractor.By.className('tooltip')).then(function(tooltip){
                        expect(tooltip.getText()).toBe('em_menshawi@hotmail.com');
                    });
                });


            });
        });
        it('should display modules\' names in their correct order after sorting modules', function(){
            ptor.findElements(protractor.By.repeater('name in columnNames')).then(function(modules){
                expect(modules.length).toBe(3);
                no_modules = modules.length;
                expect(modules[0].getText()).toBe('Second Module');
                expect(modules[1].getText()).toBe('First Module');
                expect(modules[2].getText()).toBe('Third Module');
            });
        });
        it('should display which modules were finished by each user correctly after sorting modules', function(){
            ptor.findElements(protractor.By.repeater('student in students')).then(function(students){
                expect(students.length).toBe(2);
                no_students = students.length;
                ptor.findElements(protractor.By.className('marker')).then(function(markers){
                    for(var s=0; s<no_students; s++){
                        for(var m=0; m<no_modules; m++){
                            p = (no_modules*s)+m;
                            if(p==0){
                                expect(markers[p].getAttribute('src')).toContain('Finished_on_Time.png');
                            }
                            else if(p==1){
                                expect(markers[p].getAttribute('src')).toContain('Not_Finished.png');
                            }
                            else if(p==2){
                                expect(markers[p].getAttribute('src')).toContain('Not_Finished.png');
                            }
                            else if(p==3){
                                expect(markers[p].getAttribute('src')).toContain('Finished_on_Time.png');
                            }
                            else if(p==4){
                                expect(markers[p].getAttribute('src')).toContain('Finished_on_Time.png');
                            }
                            else if(p==5){
                                expect(markers[p].getAttribute('src')).toContain('Finished_on_Time.png');
                            }
                        }
                    }
                });
            });

        });
    });
    describe('Teacher', function(){
        it('should go to course editor', function(){
            ptor.get('/#/courses/'+course_id+'/course_editor');
        });
        it('should change the order of the modules and go back to the progress page', function(){
            ptor.findElements(protractor.By.className('handle')).then(function(handles){
                browser.actions().dragAndDrop(handles[4], handles[0]).perform();
//                ptor.sleep(10000);
            });
        });
        it('should go back to progress pages', function(){
            ptor.get('/#/courses/'+course_id+'/progress/main');
        });
        it('should navigate to the Module Chart tab', function(){
            ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div/ul/li[2]/a')).then(function(second_tab){
                second_tab.click();
            });
        });
    });
    describe('Module Chart', function(){
        it('should display correct titles on the chart', function(){
            ptor.sleep(1000);
            ptor.findElements(protractor.By.tagName('text')).then(function(titles){
                expect(titles[0].getText()).toContain('Qu');
                expect(titles[1].getText()).toContain('Lec');
                expect(titles[7].getText()).toContain('Bah');
                expect(titles[8].getText()).toContain('Mah');
                expect(titles[9].getText()).toBe('Statistics');
            });
        });
        it('should display correct progress bar for each student', function(){
            ptor.findElements(protractor.By.tagName('rect')).then(function(bars){
                percentage = [];
                bars[14].getAttribute('width').then(function(value){
                    expect(value).toBe('351');
                    percentage[0] = (value/703)*100;
                    expect(percentage[0]).toBeGreaterThan(48);
                    expect(percentage[0]).toBeLessThan(50);
                });
                bars[15].getAttribute('width').then(function(value){
                    expect(value).toBe('703');
//                    console.log(value);
                    percentage[1] = (value/703)*100;
                    expect(percentage[1]).toBe(100);
                });
                bars[16].getAttribute('width').then(function(value){
                    expect(value).toBe('351');
                    percentage[2] = (value/703)*100;
                    expect(percentage[2]).toBeGreaterThan(48);
                    expect(percentage[2]).toBeLessThan(50);
                });
                bars[17].getAttribute('width').then(function(value){
                    expect(value).toBe('703');
//                    console.log(value);
                    percentage[3] = (value/703)*100;
                    expect(percentage[3]).toBe(100);
                });
            });
        });
        it('should show the popover with student name and percentage when hovering on each bar 1', function(){
            ptor.findElements(protractor.By.tagName('rect')).then(function(rects){
                rects[14].click()
                    .then(function(){
                        ptor.findElements(protractor.By.tagName('text')).then(function(texts){
                            expect(texts[texts.length-3].getText()).toBe('Bahia');
                            expect(texts[texts.length-2].getText()).toBe('Quiz:');
                            expect(texts[texts.length-1].getText()).toBe('50%');
                        });
                    });
                ptor.navigate().refresh();
                ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div/ul/li[2]/a')).then(function(second_tab){
                    second_tab.click();
                    ptor.sleep(3000);
                });
            });
        });
        it('should show the popover with student name and percentage when hovering on each bar 2', function(){
            ptor.findElements(protractor.By.tagName('rect')).then(function(rects){
                rects[15].click()
                    .then(function(){
                        ptor.findElements(protractor.By.tagName('text')).then(function(texts){
                            expect(texts[texts.length-3].getText()).toBe('Mahmoud Menshawi');
                            expect(texts[texts.length-2].getText()).toBe('Quiz:');
                            expect(texts[texts.length-1].getText()).toBe('100%');
                        });
                    });
                ptor.navigate().refresh();
                ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div/ul/li[2]/a')).then(function(second_tab){
                    second_tab.click();
                    ptor.sleep(3000);
                });
            });
        });
        it('should show the popover with student name and percentage when hovering on each bar 3', function(){
            ptor.findElements(protractor.By.tagName('rect')).then(function(rects){
                rects[16].click()
                    .then(function(){
                        ptor.findElements(protractor.By.tagName('text')).then(function(texts){
                            expect(texts[texts.length-3].getText()).toBe('Bahia');
                            expect(texts[texts.length-2].getText()).toBe('Lecture:');
                            expect(texts[texts.length-1].getText()).toBe('50%');
                        });
                    });
                ptor.navigate().refresh();
                ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div/ul/li[2]/a')).then(function(second_tab){
                    second_tab.click();
                    ptor.sleep(3000);
                });
            });
        });
        it('should show the popover with student name and percentage when hovering on each bar 4', function(){
            ptor.findElements(protractor.By.tagName('rect')).then(function(rects){
                rects[17].click()
                    .then(function(){
                        ptor.findElements(protractor.By.tagName('text')).then(function(texts){
                            expect(texts[texts.length-3].getText()).toBe('Mahmoud Menshawi');
                            expect(texts[texts.length-2].getText()).toBe('Lecture:');
                            expect(texts[texts.length-1].getText()).toBe('100%');
                        });
                    });
                ptor.navigate().refresh();
                ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div/ul/li[2]/a')).then(function(second_tab){
                    second_tab.click();
                    ptor.sleep(3000);
                });
            });
        });
    });
    describe('Modules Progress', function(){
        it('should go to a module', function(){
            ptor.get('/#/courses/'+course_id+'/progress/modules/'+module_id);
            ptor.sleep(2000);
        });
        it('should display correct titles on the top chart', function(){
            ptor.findElements(protractor.By.tagName('text')).then(function(texts){
                expect(texts[0].getText()).toBe('Module Progress Charts');
                expect(texts[1].getText()).toBe('Students');
                expect(texts[texts.length-1].getText()).toBe('Number of Students');
                expect(texts[5].getText()).toBe('Completed Late');
                expect(texts[4].getText()).toBe('Completed on Time');
                expect(texts[3].getText()).toBe('Watched <= 50%');
                expect(texts[2].getText()).toBe('Not Started Watching');
//                expect(texts[texts.length-1].getText()).toBe('Number of Students');
            });
        });
        it('should display the bars on the top chart and display their data when hovering on them', function(){
            ptor.findElements(protractor.By.tagName('rect')).then(function(rects){
                rects[12].click()
                    .then(function(){
                        ptor.findElements(protractor.By.tagName('text')).then(function(texts){
                            expect(texts[12].getText()).toBe('Watched <= 50%');
                            expect(texts[13].getText()).toBe('Students:');
                            expect(texts[14].getText()).toBe('1');
                        });
                    });
                rects[13].click()
                    .then(function(){
                        ptor.findElements(protractor.By.tagName('text')).then(function(texts){
                            expect(texts[12].getText()).toBe('Completed on Time');
                            expect(texts[13].getText()).toBe('Students:');
                            expect(texts[14].getText()).toBe('1');
                        });
                    });
            });
        });
        it('should click on each question in the lecture quizzes tab and make sure that the video seeks to that question', function(){
            ptor.findElements(protractor.By.className('seeker')).then(function(seekers){
                ptor.sleep(5000);
                expect(seekers[0].getText()).toBe('Question 1\nNew Lecture');
                expect(seekers[1].getText()).toBe('Question 2\nNew Lecture2');
                seekers[0].click()
                    .then(function(){
                        ptor.sleep(4000);
                        driver.switchTo().frame(0);
                        driver.findElement(protractor.By.className("ytp-time-current")).then(function(time){
                            expect(time.getText()).toBe('1:07');
                        });
                        driver.switchTo().defaultContent();
                        ptor.findElement(protractor.By.tagName('iframe')).then(function(player){
                            expect(player.getAttribute('src')).toContain('XtyzOo7nJrQ');
                        });
                    });
                seekers[1].click()
                    .then(function(){
                        ptor.sleep(4000);
                        driver.switchTo().frame(0);
                        driver.findElement(protractor.By.className("ytp-time-current")).then(function(time){
                            expect(time.getText()).toBe('0:12');
                        });
                        driver.switchTo().defaultContent();
                        ptor.findElement(protractor.By.tagName('iframe')).then(function(player){
                            expect(player.getAttribute('src')).toContain('PlavjNH_RRU');
                        })
                    });

            });
        });
        it('should display the correct titles on the first quiz chart in lecture quizzes', function(){
            ptor.findElements(protractor.By.tagName('text')).then(function(titles){
                expect(titles[15].getText()).toBe('First Quiz');
                expect(titles[16].getText()).toBe('Incorrect');
                expect(titles[17].getText()).toBe('Correct');
                expect(titles[18].getText()).toBe('OK (Correct)');
                expect(titles[19].getText()).toBe('Cancel (Incorrect)');
                expect(titles[20].getText()).toBe('Other (Incorrect)');
                expect(titles[26].getText()).toBe('Number of Students');
            });
        });
        it('should display the bars on the first quiz chart in lecture quizzes and display their data when hovering on them', function(){
            ptor.findElements(protractor.By.tagName('rect')).then(function(rects){
                rects[33].click()
                    .then(function(){
                        ptor.findElements(protractor.By.tagName('text')).then(function(texts){
                            expect(texts[27].getText()).toBe('OK (Correct)');
                            expect(texts[28].getText()).toBe('Correct:');
                            expect(texts[29].getText()).toBe('1');
                        });
                    });
            });
        });
        it('should display correct titles on the chart for the second quiz in lecture quizzes', function(){
            ptor.findElements(protractor.By.tagName('text')).then(function(titles){
                expect(titles[30].getText()).toBe('New Quiz2');
                expect(titles[31].getText()).toBe('Incorrect');
                expect(titles[32].getText()).toBe('Correct');
                expect(titles[33].getText()).toBe('First Answer (Correct)');
                expect(titles[34].getText()).toBe('Second Answer (Incorrect)');
                expect(titles[40].getText()).toBe('Number of Students');
            })
        });
        it('should display the bar information when hovering on it for the second quiz in lecture quizzes', function(){
            ptor.executeScript('window.scrollBy(0, 1000)', '');
            ptor.findElements(protractor.By.tagName('rect')).then(function(rects){
                rects[57].click()
                    .then(function(){
                        ptor.findElements(protractor.By.tagName('text')).then(function(texts){
                            expect(texts[41].getText()).toBe('First Answer (Correct)');
                            expect(texts[42].getText()).toBe('Correct:');
                            expect(texts[43].getText()).toBe('1');
                        });
                    });
                rects[60].click()
                    .then(function(){
                        ptor.findElements(protractor.By.tagName('text')).then(function(texts){
                            expect(texts[41].getText()).toBe('Second Answer (Incorrect)');
                            expect(texts[42].getText()).toBe('Incorrect:');
                            expect(texts[43].getText()).toBe('1');
                        });
                    });
            });
        });
        doRefresh(ptor);
        it('should go to lecture statistics tab', function(){
            ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div[2]/ul/li[2]/a')).then(function(tab){
                tab.click();
            });
        });

        it('should display the charts extended for all lectures in module', function(){
            ptor.findElements(protractor.By.className('lecture_name')).then(function(lectures){
                expect(lectures.length).toBe(2);
                expect(lectures[0].getText()).toBe('New Lecture');
                expect(lectures[1].getText()).toBe('New Lecture2');
            });
        });

        it('should seek the video when an element on the chart is clicked', function(){
            ptor.findElements(protractor.By.tagName('rect')).then(function(rects){
//                ptor.navigate().refresh();
//                ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div[2]/ul/li[2]/a')).then(function(tab){
//                    tab.click();
//                    ptor.sleep(7000);
//                });

                rects[rects.length-3].click()
                    .then(function(){
                        ptor.executeScript('window.scrollBy(0, -2000)', '');
                        ptor.sleep(20000);
                        ptor.findElement(protractor.By.className('google-visualization-tooltip')).then(function(tooltip){
                            tooltip.getText().then(function(value){
                                var test = value;
                                dummy = test;
                                expect(test).toContain('why isn\'t it working?');
                                expect(test).toContain(dummy.split('\n#')[0]);
                            });
                            ptor.sleep(5000);
                        });
                        ptor.findElements(protractor.By.tagName('iframe')).then(function(player){
                            expect(player[1].getAttribute('src')).toContain('PlavjNH_RRU');
                        });
                        driver.switchTo().frame(1);
                        driver.findElement(protractor.By.className("ytp-time-current")).then(function(time){
                            expect(time.getText()).toBe('0:00');
                        });
                        driver.switchTo().defaultContent();
                    });
            });
            ptor.executeScript('window.scrollBy(0, -2000)', '');
        });
        //---------------------------------------------------------------------//
        it('should go to a module and then go to the lecture progress tab', function(){
            ptor.get('/#/courses/'+course_id+'/progress/modules/'+module_id).then(function(){
                ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div[2]/ul/li[3]/a')).then(function(tab){
                    tab.click();
                });
            });
        });
        describe('Lecture Progress', function(){
            it('should display the chart title', function(){
                ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div[2]/div/div[3]/tab3/h3')).then(function(title){
                    expect(title.getText()).toBe('Lecture Progress Chart');
                });
            });
            it('should display correct student names and emails', function(){
                ptor.findElements(protractor.By.repeater('student in students')).then(function(names){
                    expect(names[0].getText()).toBe('Bahia');
                    ptor.actions().mouseMove(names[0]).perform();
                    ptor.findElement(protractor.By.className('tooltip')).then(function(tooltip){
                        expect(tooltip.getText()).toBe('bahia.sharkawy@gmail.com');
                    });
                    expect(names[1].getText()).toBe('Mahmoud Menshawi');
                    ptor.actions().mouseMove(names[1]).perform().then(function(){
                        ptor.sleep(500);
                        ptor.findElement(protractor.By.className('tooltip')).then(function(tooltip){
                            expect(tooltip.getText()).toBe('em_menshawi@hotmail.com');
                        });
                    });
                });
            });
            it('should display lectures\' names in their correct order', function(){
                ptor.findElements(protractor.By.repeater('name in columnNames')).then(function(modules){
                    expect(modules.length).toBe(2);
                    no_modules = modules.length;
                    expect(modules[0].getText()).toBe('New Lecture');
                    expect(modules[1].getText()).toBe('New Lecture2');
                });
            });
            it('should display which modules were finished by each user correctly', function(){
                ptor.findElements(protractor.By.repeater('student in students')).then(function(students){
                    expect(students.length).toBe(2);
                    no_students = students.length;
                    ptor.findElements(protractor.By.className('marker')).then(function(markers){
                        for(var s=0; s<no_students; s++){
                            for(var m=0; m<no_modules; m++){
                                p = (no_modules*s)+m;
                                if(p==0){
                                    expect(markers[p].getAttribute('src')).toContain('Not_Finished.png');
                                }
                                else if(p==1){
                                    expect(markers[p].getAttribute('src')).toContain('Finished_on_Time.png');
                                }
                                else if(p==2){
                                    expect(markers[p].getAttribute('src')).toContain('Finished_on_Time.png');
                                }
                                else if(p==3){
                                    expect(markers[p].getAttribute('src')).toContain('Finished_on_Time.png');
                                }
                            }
                        }
                    });
                });

            });
        });
        it('should go to course editor', function(){
            ptor.get('/#/courses/'+course_id+'/course_editor');
        });
        it('should open the first module', function(){
            ptor.findElement(protractor.By.className('trigger')).then(function(module){
                module.click();
            });
        });
        it('should change the order of the lectures inside the module and go back to the progress page', function(){
            ptor.findElements(protractor.By.className('handle')).then(function(handles){
                browser.actions().dragAndDrop(handles[2], handles[1]).perform();
            });
        });
        it('should go back to progress pages', function(){
            ptor.get('/#/courses/'+course_id+'/progress/modules/'+module_id).then(function(){
                ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div[2]/ul/li[3]/a')).then(function(tab){
                    tab.click();
                });
            });
        });
        it('should display the chart title', function(){
            ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div[2]/div/div[3]/tab3/h3')).then(function(title){
                expect(title.getText()).toBe('Lecture Progress Chart');
            });
        });
        it('should display correct student names and emails after sorting the lectures', function(){
            ptor.findElements(protractor.By.repeater('student in students')).then(function(names){
                expect(names[0].getText()).toBe('Bahia');
                ptor.actions().mouseMove(names[0]).perform();
                ptor.findElement(protractor.By.className('tooltip')).then(function(tooltip){
                    expect(tooltip.getText()).toBe('bahia.sharkawy@gmail.com');
                });
                expect(names[1].getText()).toBe('Mahmoud Menshawi');
                ptor.actions().mouseMove(names[1]).perform().then(function(){
                    ptor.sleep(500);
                    ptor.findElement(protractor.By.className('tooltip')).then(function(tooltip){
                        expect(tooltip.getText()).toBe('em_menshawi@hotmail.com');
                    });
                });
            });
        });
        it('should display lectures\' names in their correct order after sorting the lectures', function(){
            ptor.findElements(protractor.By.repeater('name in columnNames')).then(function(modules){
                expect(modules.length).toBe(2);
                no_modules = modules.length;
                expect(modules[0].getText()).toBe('New Lecture2');
                expect(modules[1].getText()).toBe('New Lecture');
            });
        });
        it('should display which modules were finished by each user correctly after sorting the lectures', function(){
            ptor.findElements(protractor.By.repeater('student in students')).then(function(students){
                expect(students.length).toBe(2);
                no_students = students.length;
                ptor.findElements(protractor.By.className('marker')).then(function(markers){
                    for(var s=0; s<no_students; s++){
                        for(var m=0; m<no_modules; m++){
                            p = (no_modules*s)+m;
                            if(p==0){
                                expect(markers[p].getAttribute('src')).toContain('Finished_on_Time.png');
                            }
                            else if(p==1){
                                expect(markers[p].getAttribute('src')).toContain('Not_Finished.png');
                            }
                            else if(p==2){
                                expect(markers[p].getAttribute('src')).toContain('Finished_on_Time.png');
                            }
                            else if(p==3){
                                expect(markers[p].getAttribute('src')).toContain('Finished_on_Time.png');
                            }
                        }
                    }
                });
            });
        });
        it('should go to course editor', function(){
            ptor.get('/#/courses/'+course_id+'/course_editor');
        });
        it('should open the first module', function(){
            ptor.findElement(protractor.By.className('trigger')).then(function(module){
                module.click();
            });
        });
        it('should change the order of the lectures inside the module and go back to the progress page', function(){
            ptor.findElements(protractor.By.className('handle')).then(function(handles){
                browser.actions().dragAndDrop(handles[2], handles[1]).perform();
            });
        });
        it('should go back to progress pages', function(){
            ptor.get('/#/courses/'+course_id+'/progress/modules/'+module_id).then(function(){
                ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div[2]/ul/li[4]/a')).then(function(tab){
                    tab.click();
                });
            });
        });


        //test the quizzes Progress tab
        describe('Quizzes Progress', function(){

            it('should display the chart title', function(){
                ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div[2]/div/div[4]/tab4/h3')).then(function(title){
                    expect(title.getText()).toBe('Quiz Progress Chart');
                });
            });
            it('should display correct student names and emails', function(){
                ptor.findElements(protractor.By.repeater('student in students')).then(function(names){
                    expect(names[0].getText()).toBe('Bahia');
                    ptor.actions().mouseMove(names[0]).perform();
                    ptor.findElement(protractor.By.className('tooltip')).then(function(tooltip){
                        expect(tooltip.getText()).toBe('bahia.sharkawy@gmail.com');
                    });
                    expect(names[1].getText()).toBe('Mahmoud Menshawi');
                    ptor.actions().mouseMove(names[1]).perform().then(function(){
                        ptor.sleep(500);
                        ptor.findElement(protractor.By.className('tooltip')).then(function(tooltip){
                            expect(tooltip.getText()).toBe('em_menshawi@hotmail.com');
                        });
                    });
                });
            });
            it('should display quizzes\' names in their correct order', function(){
                ptor.findElements(protractor.By.repeater('name in columnNames')).then(function(modules){
                    expect(modules.length).toBe(2);
                    no_modules = modules.length;
                    expect(modules[0].getText()).toBe('New Quiz');
                    expect(modules[1].getText()).toBe('New Quiz2');
                });
            });
            it('should display which quizzes were finished by each user correctly', function(){
                ptor.findElements(protractor.By.repeater('student in students')).then(function(students){
                    expect(students.length).toBe(2);
                    no_students = students.length;
                    ptor.findElements(protractor.By.className('marker')).then(function(markers){
                        for(var s=0; s<no_students; s++){
                            for(var m=0; m<no_modules; m++){
                                p = (no_modules*s)+m;
                                if(p==0){
                                    expect(markers[p].getAttribute('src')).toContain('Not_Finished.png');
                                }
                                else if(p==1){
                                    expect(markers[p].getAttribute('src')).toContain('Finished_on_Time.png');
                                }
                                else if(p==2){
                                    expect(markers[p].getAttribute('src')).toContain('Finished_on_Time.png');
                                }
                                else if(p==3){
                                    expect(markers[p].getAttribute('src')).toContain('Not_Finished.png');
                                }
                            }
                        }
                    });
                });

            });
        });
        it('should go to course editor', function(){
            ptor.get('/#/courses/'+course_id+'/course_editor');
        });
        it('should open the first module', function(){
            ptor.findElement(protractor.By.className('trigger')).then(function(module){
                module.click();
            });
        });
        it('should change the order of the quizzes inside the module and go back to the progress page', function(){
            ptor.findElements(protractor.By.className('handle')).then(function(handles){
                browser.actions().dragAndDrop(handles[4], handles[3]).perform();
            });
        });
        it('should go back to progress pages', function(){
            ptor.get('/#/courses/'+course_id+'/progress/modules/'+module_id).then(function(){
                ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div[2]/ul/li[4]/a')).then(function(tab){
                    tab.click();
                });
            });
        });
        it('should display the chart title', function(){
            ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div[2]/div/div[4]/tab4/h3')).then(function(title){
                expect(title.getText()).toBe('Quiz Progress Chart');
            });
        });
        it('should display correct student names and emails after sorting the quizzes', function(){
            ptor.findElements(protractor.By.repeater('student in students')).then(function(names){
                expect(names[0].getText()).toBe('Bahia');
                ptor.actions().mouseMove(names[0]).perform();
                ptor.findElement(protractor.By.className('tooltip')).then(function(tooltip){
                    expect(tooltip.getText()).toBe('bahia.sharkawy@gmail.com');
                });
                expect(names[1].getText()).toBe('Mahmoud Menshawi');
                ptor.actions().mouseMove(names[1]).perform().then(function(){
                    ptor.sleep(500);
                    ptor.findElement(protractor.By.className('tooltip')).then(function(tooltip){
                        expect(tooltip.getText()).toBe('em_menshawi@hotmail.com');
                    });
                });
            });
        });
        it('should display quizzes\' names in their correct order after sorting them', function(){
            ptor.findElements(protractor.By.repeater('name in columnNames')).then(function(modules){
                expect(modules.length).toBe(2);
                no_modules = modules.length;
                expect(modules[0].getText()).toBe('New Quiz2');
                expect(modules[1].getText()).toBe('New Quiz');
            });
        });
        it('should display which quizzes were finished by each user correctly after sorting them', function(){
            ptor.findElements(protractor.By.repeater('student in students')).then(function(students){
                expect(students.length).toBe(2);
                no_students = students.length;
                ptor.findElements(protractor.By.className('marker')).then(function(markers){
                    for(var s=0; s<no_students; s++){
                        for(var m=0; m<no_modules; m++){
                            p = (no_modules*s)+m;
                            if(p==0){
                                expect(markers[p].getAttribute('src')).toContain('Finished_on_Time.png');
                            }
                            else if(p==1){
                                expect(markers[p].getAttribute('src')).toContain('Not_Finished.png');
                            }
                            else if(p==2){
                                expect(markers[p].getAttribute('src')).toContain('Not_Finished.png');
                            }
                            else if(p==3){
                                expect(markers[p].getAttribute('src')).toContain('Finished_on_Time.png');
                            }
                        }
                    }
                });
            });
        });
        it('should go to course editor', function(){
            ptor.get('/#/courses/'+course_id+'/course_editor');
        });
        it('should open the first module', function(){
            ptor.findElement(protractor.By.className('trigger')).then(function(module){
                module.click();
            });
        });
        it('should change the order of the quizzes inside the module', function(){
            ptor.findElements(protractor.By.className('handle')).then(function(handles){
                browser.actions().dragAndDrop(handles[4], handles[3]).perform();
            });
        });
        it('should go back to progress pages', function(){
            ptor.get('/#/courses/'+course_id+'/progress/modules/'+module_id);
        })
        it('should go to the Surveys tab', function(){
            ptor.executeScript('window.scrollBy(0, -2000)', '');
            ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div[2]/ul/li[5]/a')).then(function(tab){
                tab.click();
            });
        });
        it('should display the survey charts with thier data', function(){
            ptor.sleep(1500);
                ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div[2]/div/div[5]/tab5/div/center/b')).then(function(survey_name){
                    expect(survey_name.getText()).toBe('New Survey');
                });
                ptor.findElements(protractor.By.tagName('text')).then(function(texts){
                    expect(texts[texts.length-20].getText()).toBe('First Question');
                    expect(texts[texts.length-19].getText()).toBe('Answered');
                    expect(texts[texts.length-18].getText()).toBe('first answer');
                    expect(texts[texts.length-17].getText()).toBe('second answer');
                    expect(texts[texts.length-11].getText()).toBe('Number of Students');
                    expect(texts[texts.length-10].getText()).toBe('Second Question');
                    expect(texts[texts.length-9].getText()).toBe('Answered');
                    expect(texts[texts.length-8].getText()).toBe('first answer');
                    expect(texts[texts.length-7].getText()).toBe('second answer');
                    expect(texts[texts.length-1].getText()).toBe('Number of Students');
                });
                ptor.findElements(protractor.By.tagName('rect')).then(function(rects){
                    ptor.executeScript('window.scrollBy(0, 500)', '');
                    rects[rects.length-17].click()
                        .then(function(){
//                            ptor.sleep(20000);
                            ptor.findElements(protractor.By.tagName('text')).then(function(texts){
//                                texts.forEach(function(text, i){
//                                    text.getText().then(function(value){
//                                        console.log(value);
//                                    })
//                                })
                                expect(texts[texts.length-13].getText()).toBe('first answer');
                                expect(texts[texts.length-12].getText()).toBe('Answered:');
                                expect(texts[texts.length-11].getText()).toBe('1');
                            });
                        });
                    rects[rects.length-2].click()
                        .then(function(){
                            ptor.findElements(protractor.By.tagName('text')).then(function(texts){
                                expect(texts[texts.length-3].getText()).toBe('second answer');
                                expect(texts[texts.length-2].getText()).toBe('Answered:');
                                expect(texts[texts.length-1].getText()).toBe('1');
                            });
                        });
                });
        });
        doRefresh(ptor);
        it('should go to the Quizzes tab', function(){
            ptor.executeScript('window.scrollBy(0, -2000)', '');
            ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div[2]/ul/li[6]/a')).then(function(tab){
                tab.click();
                ptor.sleep(2000);
            });
        });
        it('should display the two quizzes charts with thier data', function(){
            ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div[2]/div/div[6]/tab6/select')).then(function(dropdown){
                ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div[2]/div/div[6]/tab6/div/center/b')).then(function(quiz_name){
                    expect(quiz_name.getText()).toBe('New Quiz');
                });
                ptor.findElements(protractor.By.tagName('text')).then(function(texts){
//                    texts.forEach(function(text, i){
//                        text.getText().then(function(value){
//                            console.log(value+' + '+i);
//                        });
//                    });
                    expect(texts[texts.length-12].getText()).toBe('First Question');
                    expect(texts[texts.length-11].getText()).toBe('Incorrect');
                    expect(texts[texts.length-10].getText()).toBe('Correct');
                    expect(texts[texts.length-9].getText()).toBe('First Answer (Correct)');
                    expect(texts[texts.length-8].getText()).toBe('Second Answer (Incorrect)');
                    expect(texts[texts.length-7].getText()).toBe('Third Answer (Incorrect)');
                    expect(texts[texts.length-1].getText()).toBe('Number of Students');
                });
                ptor.findElements(protractor.By.tagName('rect')).then(function(rects){
                    rects[rects.length-7].click()
                        .then(function(){
                            ptor.findElements(protractor.By.tagName('text')).then(function(texts){
                                expect(texts[texts.length-3].getText()).toBe('First Answer (Correct)');
                                expect(texts[texts.length-2].getText()).toBe('Correct:');
                                expect(texts[texts.length-1].getText()).toBe('1');
                            });
                        });
                });
                dropdown.click().then(function(){
                    ptor.findElements(protractor.By.tagName('option')).then(function(options){
                        options[2].click();
                    });
                    ptor.sleep(2000);
                });
                ptor.findElements(protractor.By.tagName('text')).then(function(texts){
//                    texts.forEach(function(text, i){
//                        text.getText().then(function(value){
//                            console.log(value+' + '+i);
//                        });
//                    });
                    expect(texts[texts.length-11].getText()).toBe('First Question');
                    expect(texts[texts.length-10].getText()).toBe('Incorrect');
                    expect(texts[texts.length-9].getText()).toBe('Correct');
                    expect(texts[texts.length-8].getText()).toBe('Should be correct (Correct)');
                    expect(texts[texts.length-7].getText()).toBe('should be false (Incorrect)');
                    expect(texts[texts.length-1].getText()).toBe('Number of Students');
                });
                ptor.findElements(protractor.By.tagName('rect')).then(function(rects){
                    rects[rects.length-2].click()
                        .then(function(){
                            ptor.findElements(protractor.By.tagName('text')).then(function(texts){
                                expect(texts[texts.length-3].getText()).toBe('should be false (Incorrect)');
                                expect(texts[texts.length-2].getText()).toBe('Incorrect:');
                                expect(texts[texts.length-1].getText()).toBe('1');
                            });
                        });
                });
            });
        });
    });
});

describe('Teacher', function(){
    var ptor = protractor.getInstance();
    var driver = ptor.driver;
    var ptor = protractor.getInstance();
    var driver = ptor.driver;

    it('should navigate to In-Class', function(){
        ptor.get('/#/courses/'+course_id+'/inclass');
//        ptor.findElement(protractor.By.id('inclass_link')).then(function(link){
//            link.click();
//        });
    });
})

//In-Class Tests
describe('In-Class', function(){
    var ptor = protractor.getInstance();

    describe('Main View', function(){
        it('should display the list of modules in course', function(){
            expect(ptor.findElement(protractor.By.className('nav-header')).getText()).toBe('MODULES');
            ptor.findElements(protractor.By.repeater('module in modules')).then(function(items){
                expect(items.length).toBe(3);
            });
            ptor.findElements(protractor.By.repeater('module in modules')).then(function(names){
                expect(names[0].getText()).toBe('First Module');
                expect(names[1].getText()).toBe('Second Module');
                expect(names[2].getText()).toBe('Third Module');
            });
        });
        it('should display correct module information when selecting any of them from the list on the left', function(){
            ptor.findElements(protractor.By.repeater('module in modules')).then(function(names){
                names[2].click().then(function(){
                    ptor.findElement(protractor.By.tagName('h3')).then(function(header){
                        expect(header.getText()).toBe('Third Module');
                    });
                    ptor.findElements(protractor.By.tagName('h4')).then(function(texts){
                        expect(texts[0].getText()).toBe('Display Lecture Results');
                        expect(texts[1].getText()).toBe('Review Lecture Results');
                    });
                });
                names[1].click().then(function(){
                    ptor.findElement(protractor.By.tagName('h3')).then(function(header){
                        expect(header.getText()).toBe('Second Module');
                    });
                    ptor.findElements(protractor.By.tagName('h4')).then(function(texts){
                        expect(texts[0].getText()).toBe('Display Lecture Results');
                        expect(texts[1].getText()).toBe('Review Lecture Results');
                    });
                });
                names[0].click().then(function(){
                    ptor.findElement(protractor.By.tagName('h3')).then(function(header){
                        expect(header.getText()).toBe('First Module');
                    });
                    ptor.findElements(protractor.By.tagName('h4')).then(function(texts){
                        expect(texts[0].getText()).toBe('Display Lecture Results');
                        expect(texts[1].getText()).toBe('Review Lecture Results');
                    });
                });


            });
        });
        it('should display buttons for displaying lecture results', function(){
            ptor.findElements(protractor.By.className('btn-primary')).then(function(buttons){
                expect(buttons[0].getText()).toBe('Display Quizzes');
                expect(buttons[1].getText()).toBe('Display Questions');
                expect(buttons[2].getText()).toBe('Display Surveys');
            });
        });
        it('should display buttons for reviewing lecture results', function(){
            ptor.findElements(protractor.By.className('btn')).then(function(buttons){
                expect(buttons[3].getText()).toBe('Review Quizzes');
                expect(buttons[4].getText()).toBe('Review Questions');
                expect(buttons[5].getText()).toBe('Review Surveys');
            });
        });
    });
    reviewQuizzesModal(ptor);
    describe('Review Quizzes', function(){
        it('should exit the modal', function(){
            ptor.findElement(protractor.By.xpath('/html/body/div[4]/div[1]/a')).click();
        });
    });
    describe('Main View', function(){
        it('should click on Display Quizzes', function(){
            ptor.findElement(protractor.By.className('btn-primary')).click();
        });
    })
    describe('Display Quizzes', function(){
        it('should display the display quizzes modal', function(){
            ptor.findElement(protractor.By.className('modal')).then(function(modal){
                modal.isDisplayed().then(function(disp){
                    expect(disp).toEqual(true)
                });
            });
        });
        it('should display the video container', function(){
            ptor.sleep(10000);
            ptor.findElement(protractor.By.tagName('youtube')).then(function(video){
                video.isDisplayed().then(function(disp){
                    expect(disp).toEqual(true);
                });
            });
        });
        it('should display the play button', function(){
            ptor.findElement(protractor.By.className('play_button')).then(function(play){
                play.isDisplayed().then(function(disp){
                    expect(disp).toEqual(true);
                });
            });
        });
        it('should display the mute button', function(){
            ptor.findElement(protractor.By.className('mute_button')).then(function(play){
                play.isDisplayed().then(function(disp){
                    expect(disp).toEqual(true);
                });
            });
        });
        it('should display the -5 and +5 buttons and >> , << buttons', function(){
            ptor.findElements(protractor.By.className('btn')).then(function(buttons){
                expect(buttons[6].getText()).toBe('-5');
                expect(buttons[7].getText()).toBe('<<');
                expect(buttons[8].getText()).toBe('+5');
                expect(buttons[9].getText()).toBe('>>');
            });
        });
        it('should display the first quiz title', function(){
            expect(ptor.findElement(protractor.By.className('question_title')).getText()).toBe('First Quiz');
        });
        it('should display the quiz chart with its correct data', function(){
            ptor.findElements(protractor.By.tagName('text')).then(function(texts){
                expect(texts[0].getText()).toContain('Inco');
                expect(texts[1].getText()).toContain('Corr');
                expect(texts[2].getText()).toBe('OK (Correct)');
                expect(texts[3].getText()).toBe('Cancel (Incorrect)');
                expect(texts[4].getText()).toBe('Other (Incorrect)');
                expect(texts[10].getText()).toBe('% of Students');
            });
            ptor.findElements(protractor.By.tagName('rect')).then(function(rects){
                rects[14].getAttribute('height').then(function(height){
                    expect(height).toBe('122');
                    expect(height/122*100).toBe(100);
                });
                rects[14].click().then(function(){
                    ptor.findElements(protractor.By.tagName('text')).then(function(texts){
                        expect(texts[11].getText()).toBe('OK (Correct)');
                        expect(texts[12].getText()).toBe('Correct:');
                        expect(texts[13].getText()).toBe('100');
                    });
                });
            });
        });
        it('should move to next quiz', function(){
            ptor.findElements(protractor.By.className('btn')).then(function(buttons){
                buttons[9].click();
            });
        });
        it('should display the second quiz title', function(){
            expect(ptor.findElement(protractor.By.className('question_title')).getText()).toBe('New Quiz2');
        });
        it('should display the quiz chart with its correct data', function(){
            ptor.findElements(protractor.By.tagName('text')).then(function(texts){
                expect(texts[0].getText()).toContain('Inc');
                expect(texts[1].getText()).toContain('Cor');
                expect(texts[2].getText()).toBe('First Answer (Correct)');
                expect(texts[3].getText()).toBe('Second Answer (Incorrect)');
                expect(texts[9].getText()).toBe('% of Students');
            });
            ptor.findElements(protractor.By.tagName('rect')).then(function(rects){
                rects[14].getAttribute('height').then(function(height){
                    expect(height).toBe('101');
                });
                rects[14].click().then(function(){
                    ptor.findElements(protractor.By.tagName('text')).then(function(texts){
                        expect(texts[10].getText()).toBe('First Answer (Correct)');
                        expect(texts[11].getText()).toBe('Correct:');
                        expect(texts[12].getText()).toBe('50');
                    });
                });
            });
        });
        it('should go back to the first quiz', function(){
            ptor.findElements(protractor.By.className('btn')).then(function(buttons){
                buttons[7].click();
            });
        });
        it('should display the quiz chart with its correct data', function(){
            ptor.findElements(protractor.By.tagName('text')).then(function(texts){
                expect(texts[0].getText()).toContain('Inco');
                expect(texts[1].getText()).toContain('Cor');
                expect(texts[2].getText()).toBe('OK (Correct)');
                expect(texts[3].getText()).toBe('Cancel (Incorrect)');
                expect(texts[4].getText()).toBe('Other (Incorrect)');
                expect(texts[10].getText()).toBe('% of Students');
            });
            ptor.findElements(protractor.By.tagName('rect')).then(function(rects){
                rects[14].getAttribute('height').then(function(height){
                    expect(height).toBe('122');
                    expect(height/122*100).toBe(100);
                });
                rects[14].click().then(function(){
                    ptor.findElements(protractor.By.tagName('text')).then(function(texts){
                        expect(texts[11].getText()).toBe('OK (Correct)');
                        expect(texts[12].getText()).toBe('Correct:');
                        expect(texts[13].getText()).toBe('100');
                    });
                });
            });
        });
        it('should exit the modal', function(){
            ptor.findElement(protractor.By.className('exit_btn')).click();
        });
    });

    reviewQuizzesModal(ptor);
    describe('Review Quizzes', function(){
        it('should hide one of the quizzes', function(){
            ptor.findElements(protractor.By.tagName('input')).then(function(checkboxes){
                checkboxes[1].click();
            });
        });
        feedback(ptor, 'Quiz is now hidden', 0);
        it('should exit the modal', function(){
            ptor.findElement(protractor.By.xpath('/html/body/div[4]/div[1]/a')).click();
        });
    });
    describe('Main View', function(){
        it('should go to Display Quizzes', function(){
            ptor.findElement(protractor.By.className('btn-primary')).then(function(button){
                button.click();
            });
        });
    });
    describe('Display Quizzes', function(){
        it('<< and >> buttons should be disabled', function(){
            ptor.findElements(protractor.By.className('btn')).then(function(buttons){
                expect(buttons[7].getAttribute('disabled')).toBe('true');
                expect(buttons[9].getAttribute('disabled')).toBe('true');
            });
        });
        it('should display the quiz chart with its correct data', function(){
            ptor.findElements(protractor.By.tagName('text')).then(function(texts){
                expect(texts[0].getText()).toContain('Inco');
                expect(texts[1].getText()).toContain('Cor');
                expect(texts[2].getText()).toBe('OK (Correct)');
                expect(texts[3].getText()).toBe('Cancel (Incorrect)');
                expect(texts[4].getText()).toBe('Other (Incorrect)');
                expect(texts[10].getText()).toBe('% of Students');
            });
            ptor.findElements(protractor.By.tagName('rect')).then(function(rects){
                rects[14].getAttribute('height').then(function(height){
                    expect(height).toBe('122');
                    expect(height/122*100).toBe(100);
                });
                rects[14].click().then(function(){
                    ptor.findElements(protractor.By.tagName('text')).then(function(texts){
                        expect(texts[11].getText()).toBe('OK (Correct)');
                        expect(texts[12].getText()).toBe('Correct:');
                        expect(texts[13].getText()).toBe('100');
                    });
                });
            });
        });
        it('should exit the modal', function(){
            ptor.findElement(protractor.By.className('exit_btn')).then(function(button){
                button.click();
            });
        });
    });
    reviewQuizzesModal(ptor);
    describe('Review Quizzes', function(){
        it('should hide the other quiz', function(){
            ptor.findElements(protractor.By.tagName('input')).then(function(checkboxes){
                checkboxes[0].click();
            });
        });
        feedback(ptor, 'Quiz is now hidden', 0);
        it('should exit the modal', function(){
            ptor.findElement(protractor.By.xpath('/html/body/div[4]/div[1]/a')).click();
        });
    });
    describe('Main View', function(){
        it('should show the disabled display quizzes button', function(){
            ptor.findElement(protractor.By.className('btn-primary')).then(function(button){
                expect(button.getAttribute('disabled')).toBe('true');
                button.click();
            });
        });
    });
//    describe('Display Quizzes', function(){
//        it('shouldn\'t display a modal', function(){
//            ptor.findElement(protractor.By.className('modal')).then(function(modal){
//                modal.isDisplayed().then(function(disp){
//                    expect(disp).toEqual(false)
//                });
//            });
//        });
//        doRefresh(ptor);
//    });
    reviewQuizzesModal(ptor);
    describe('Review Quizzes', function(){
        it('should unhide all quizzes', function(){
            ptor.findElements(protractor.By.tagName('input')).then(function(checkboxes){
                checkboxes[0].click();
                feedback(ptor, 'Quiz is now visible', 1);
                checkboxes[1].click();
                feedback(ptor, 'Quiz is now visible', 1);
            });
        });
        it('should exit the modal', function(){
            ptor.findElement(protractor.By.xpath('/html/body/div[4]/div[1]/a')).click();
        });
    });
    describe('Main View', function(){
        it('should go to Display Quizzes', function(){
            ptor.findElement(protractor.By.className('btn-primary')).click();
        });
    });
    describe('Display Quizzes', function(){
        it('should display the display quizzes modal', function(){
            ptor.findElement(protractor.By.className('modal')).then(function(modal){
                modal.isDisplayed().then(function(disp){
                    expect(disp).toEqual(true)
                });
            });
        });
        it('should display the video container', function(){
            ptor.sleep(10000);
            ptor.findElement(protractor.By.tagName('youtube')).then(function(video){
                video.isDisplayed().then(function(disp){
                    expect(disp).toEqual(true);
                });
            });
        });
        it('should display the play button', function(){
            ptor.findElement(protractor.By.className('play_button')).then(function(play){
                play.isDisplayed().then(function(disp){
                    expect(disp).toEqual(true);
                });
            });
        });
        it('should display the mute button', function(){
            ptor.findElement(protractor.By.className('mute_button')).then(function(play){
                play.isDisplayed().then(function(disp){
                    expect(disp).toEqual(true);
                });
            });
        });
        it('should display the -5 and +5 buttons and >> , << buttons', function(){
            ptor.findElements(protractor.By.className('btn')).then(function(buttons){
                expect(buttons[6].getText()).toBe('-5');
                expect(buttons[7].getText()).toBe('<<');
                expect(buttons[8].getText()).toBe('+5');
                expect(buttons[9].getText()).toBe('>>');
            });
        });
        it('should display the first quiz title', function(){
            expect(ptor.findElement(protractor.By.className('question_title')).getText()).toBe('First Quiz');
        });
        it('should display the quiz chart with its correct data', function(){
            ptor.findElements(protractor.By.tagName('text')).then(function(texts){
                expect(texts[0].getText()).toContain('Inc');
                expect(texts[1].getText()).toContain('Cor');
                expect(texts[2].getText()).toBe('OK (Correct)');
                expect(texts[3].getText()).toBe('Cancel (Incorrect)');
                expect(texts[4].getText()).toBe('Other (Incorrect)');
                expect(texts[10].getText()).toBe('% of Students');
            });
            ptor.findElements(protractor.By.tagName('rect')).then(function(rects){
                rects[14].getAttribute('height').then(function(height){
                    expect(height).toBe('122');
                    expect(height/122*100).toBe(100);
                });
                rects[14].click().then(function(){
                    ptor.findElements(protractor.By.tagName('text')).then(function(texts){
                        expect(texts[11].getText()).toBe('OK (Correct)');
                        expect(texts[12].getText()).toBe('Correct:');
                        expect(texts[13].getText()).toBe('100');
                    });
                });
            });
        });
        it('should move to next quiz', function(){
            ptor.findElements(protractor.By.className('btn')).then(function(buttons){
                buttons[9].click();
            });
        });
        it('should display the second quiz title', function(){
            expect(ptor.findElement(protractor.By.className('question_title')).getText()).toBe('New Quiz2');
        });
        it('should display the quiz chart with its correct data', function(){
            ptor.findElements(protractor.By.tagName('text')).then(function(texts){
                expect(texts[0].getText()).toContain('Inc');
                expect(texts[1].getText()).toContain('Cor');
                expect(texts[2].getText()).toBe('First Answer (Correct)');
                expect(texts[3].getText()).toBe('Second Answer (Incorrect)');
                expect(texts[9].getText()).toBe('% of Students');
            });
            ptor.findElements(protractor.By.tagName('rect')).then(function(rects){
                rects[14].getAttribute('height').then(function(height){
                    expect(height).toBe('101');
                });
                rects[14].click().then(function(){
                    ptor.findElements(protractor.By.tagName('text')).then(function(texts){
                        expect(texts[10].getText()).toBe('First Answer (Correct)');
                        expect(texts[11].getText()).toBe('Correct:');
                        expect(texts[12].getText()).toBe('50');
                    });
                });
            });
        });
        it('should go back to the first quiz', function(){
            ptor.findElements(protractor.By.className('btn')).then(function(buttons){
                buttons[7].click();
            });
        });
        it('should display the quiz chart with its correct data', function(){
            ptor.findElements(protractor.By.tagName('text')).then(function(texts){
                expect(texts[0].getText()).toContain('Inc');
                expect(texts[1].getText()).toContain('Cor');
                expect(texts[2].getText()).toBe('OK (Correct)');
                expect(texts[3].getText()).toBe('Cancel (Incorrect)');
                expect(texts[4].getText()).toBe('Other (Incorrect)');
                expect(texts[10].getText()).toBe('% of Students');
            });
            ptor.findElements(protractor.By.tagName('rect')).then(function(rects){
                rects[14].getAttribute('height').then(function(height){
                    expect(height).toBe('122');
                    expect(height/122*100).toBe(100);
                });
                rects[14].click().then(function(){
                    ptor.findElements(protractor.By.tagName('text')).then(function(texts){
                        expect(texts[11].getText()).toBe('OK (Correct)');
                        expect(texts[12].getText()).toBe('Correct:');
                        expect(texts[13].getText()).toBe('100');
                    });
                });
            });
        });
        it('should exit the modal', function(){
            ptor.findElement(protractor.By.className('exit_btn')).click();
        });
    });
    reviewQuestionsModal(ptor);
    describe('Review Questions', function(){
        it('should exit the modal', function(){
            ptor.findElements(protractor.By.tagName('a')).then(function(buttons){
                buttons[buttons.length-2].click();
            });
        });
    });
    describe('Main View', function(){
        it('should go to Display Questions', function(){
            ptor.findElements(protractor.By.className('btn-primary')).then(function(buttons){
                buttons[1].click();
            });
        });
    });
    describe('Display Questions', function(){
        it('should display the display questions modal', function(){
            ptor.findElement(protractor.By.className('modal')).then(function(modal){
                modal.isDisplayed().then(function(disp){
                    expect(disp).toEqual(true)
                });
            });
        });
        it('should display the video container', function(){
            ptor.sleep(10000);
            ptor.findElement(protractor.By.tagName('youtube')).then(function(video){
                video.isDisplayed().then(function(disp){
                    expect(disp).toEqual(true);
                });
            });
        });
        it('should display the play button', function(){
            ptor.findElement(protractor.By.className('play_button')).then(function(play){
                play.isDisplayed().then(function(disp){
                    expect(disp).toEqual(true);
                });
            });
        });
        it('should display the mute button', function(){
            ptor.findElement(protractor.By.className('mute_button')).then(function(play){
                play.isDisplayed().then(function(disp){
                    expect(disp).toEqual(true);
                });
            });
        });
        it('should display the -5 and +5 buttons and >> , << buttons', function(){
            ptor.findElements(protractor.By.className('btn')).then(function(buttons){
                expect(buttons[6].getText()).toBe('-5');
                expect(buttons[7].getText()).toBe('<<');
                expect(buttons[8].getText()).toBe('+5');
                expect(buttons[9].getText()).toBe('>>');
            });
        });
        it('should display the question posted by student', function(){
            ptor.findElements(protractor.By.repeater('question in questions')).then(function(questions){
                expect(questions[0].getText()).toBe('why isn\'t it working?');
            });
        });
        it('should exit the modal', function(){
            ptor.findElement(protractor.By.className('exit_btn')).then(function(button){
                button.click();
            });
        });
    });
    reviewQuestionsModal(ptor);
    describe('Review Questions', function(){
        it('should hide the question', function(){
            ptor.findElement(protractor.By.tagName('input')).then(function(hide){
                hide.click().then(function(){
                    feedback(ptor, 'Question is now hidden', 1);
                });
            });
        });
        it('should exit the modal', function(){
            ptor.findElements(protractor.By.tagName('a')).then(function(buttons){
                buttons[buttons.length-2].click();
            });
        });
    });
    describe('Main View', function(){
        it('should show disabled button', function(){
            ptor.findElements(protractor.By.className('btn-primary')).then(function(buttons){
                expect(buttons[1].getAttribute('disabled')).toBe('true');
                buttons[1].click();
            });
        });
    });
//    describe('Display Questions', function(){
//        it('should not display the \'display questions\' modal', function(){
//            ptor.findElement(protractor.By.className('modal')).then(function(modal){
//                modal.isDisplayed().then(function(disp){
//                    expect(disp).toEqual(false)
//                });
//            });
//        });
//    });
    describe('Main View', function(){
        doRefresh(ptor);
        it('should open the Review Questions', function(){
            ptor.findElements(protractor.By.className('btn')).then(function(buttons){
                buttons[4].click();
            });
        });
    });
    describe('Review Questions', function(){
        it('should unhide the question', function(){
            ptor.findElement(protractor.By.tagName('input')).then(function(hide){
                hide.click().then(function(){
                    feedback(ptor, 'Question is now visible');
                });
            });
        });
        it('should exit the modal', function(){
            ptor.findElements(protractor.By.tagName('a')).then(function(buttons){
                buttons[buttons.length-2].click();
            });
        });
    });
    describe('Main View', function(){
        it('should open Display Questions', function(){
            ptor.findElements(protractor.By.className('btn-primary')).then(function(buttons){
                buttons[1].click();
            });
        });
    });
    describe('Display Questions', function(){
        it('should display the display questions modal', function(){
            ptor.findElement(protractor.By.className('modal')).then(function(modal){
                modal.isDisplayed().then(function(disp){
                    expect(disp).toEqual(true)
                });
            });
        });
        it('should display the video container', function(){
            ptor.sleep(10000);
            ptor.findElement(protractor.By.tagName('youtube')).then(function(video){
                video.isDisplayed().then(function(disp){
                    expect(disp).toEqual(true);
                });
            });
        });
        it('should display the play button', function(){
            ptor.findElement(protractor.By.className('play_button')).then(function(play){
                play.isDisplayed().then(function(disp){
                    expect(disp).toEqual(true);
                });
            });
        });
        it('should display the mute button', function(){
            ptor.findElement(protractor.By.className('mute_button')).then(function(play){
                play.isDisplayed().then(function(disp){
                    expect(disp).toEqual(true);
                });
            });
        });
        it('should display the -5 and +5 buttons and >> , << buttons', function(){
            ptor.findElements(protractor.By.className('btn')).then(function(buttons){
                expect(buttons[6].getText()).toBe('-5');
                expect(buttons[7].getText()).toBe('<<');
                expect(buttons[8].getText()).toBe('+5');
                expect(buttons[9].getText()).toBe('>>');
            });
        });
        it('should display the question posted by student', function(){
            ptor.findElements(protractor.By.repeater('question in questions')).then(function(questions){
                expect(questions[0].getText()).toBe('why isn\'t it working?');
            });
        });
        it('should exit the modal', function(){
            ptor.findElement(protractor.By.className('exit_btn')).then(function(button){
                button.click();
            });
        });
    });
    //start survey
    describe('Main View', function(){
        it('should got to Review Surveys', function(){
            ptor.findElements(protractor.By.className('btn')).then(function(buttons){
                buttons[5].click();
            });
        });
    });
    describe('Display Surveys', function(){
        it('should display a fullscreen modal', function(){
            ptor.findElement(protractor.By.className('modal')).then(function(modal){
                modal.isDisplayed().then(function(disp){
                    expect(disp).toBe(true);
                });
            });
        });
        it('should display modal title', function(){
            ptor.findElements(protractor.By.tagName('h4')).then(function(titles){
                expect(titles[titles.length-1].getText()).toBe('Review Student Surveys on First Module');
            });
        });
        it('should display a table', function(){
            ptor.findElement(protractor.By.tagName('th')).then(function(table_head){
                table_head.isDisplayed().then(function(disp){
                    expect(disp).toBe(true);
                });
            });
        });
        it('should display two charts', function(){
            ptor.findElements(protractor.By.className('chart')).then(function(charts){
                expect(charts.length).toBe(2);
            });
        });
        it('should mark the two charts as shown', function(){
            ptor.findElements(protractor.By.tagName('input')).then(function(checkboxes){
                checkboxes[0].click().then(function(){
                    feedback(ptor, 'Question was successfully updated - now visible', 1);
                });
                checkboxes[1].click().then(function(){
                    feedback(ptor, 'Question was successfully updated - now visible', 1);
                });
            });
        });
        it('should exit the modal', function(){
            ptor.findElement(protractor.By.id('exit_btn')).then(function(button){
                button.click();
            });
        });
    });
    describe('Main View', function(){
        it('should go to Display Surveys', function(){
            ptor.findElements(protractor.By.className('btn-primary')).then(function(buttons){
                buttons[2].click();
            });
        });
    });
    describe('Display Surveys', function(){
        it('should display a fullscreen modal', function(){
            ptor.findElement(protractor.By.className('modal')).then(function(modal){
                modal.isDisplayed().then(function(disp){
                    expect(disp).toBe(true);
                });
            });
        });
        it('should display two charts', function(){
            ptor.findElements(protractor.By.className('chart')).then(function(charts){
                expect(charts.length).toBe(2);
            });
        });
        it('should exit the modal', function(){
            ptor.findElement(protractor.By.linkText('Exit')).then(function(button){
                button.click();
            });
        });
    });
    describe('Main View', function(){
        it('should go to Review Surveys', function(){
            ptor.findElements(protractor.By.className('btn')).then(function(buttons){
                buttons[5].click();
            });
        });
    });
    describe('Review Surveys', function(){
        it('should display a fullscreen modal', function(){
            ptor.findElement(protractor.By.className('modal')).then(function(modal){
                modal.isDisplayed().then(function(disp){
                    expect(disp).toBe(true);
                });
            });
        });
        it('should display the Free Text Questions', function(){
            ptor.findElements(protractor.By.tagName('h3')).then(function(titles){
                expect(titles[1].getText()).toBe('Free Text Question');
            });
        });
        it('should mark the question as shown', function(){
            ptor.findElements(protractor.By.tagName('input')).then(function(checkboxes){
                checkboxes[2].click().then(function(){
                    feedback(ptor, 'Question was successfully updated - now visible', 1);
                });
            });
        });
        it('should display the question body', function(){
            ptor.findElements(protractor.By.tagName('tr')).then(function(questions){
                expect(questions[3].getText()).toContain('Third Question');
            });
        });
        it('should display the answer to the question', function(){
            ptor.findElements(protractor.By.repeater('answer in question.answers|survey:display_only')).then(function(answers){
                expect(answers[0].getText()).toContain('third answer');
            });
        });
        it('should allow replying to the answer of the question', function(){
            ptor.findElements(protractor.By.repeater('answer in question.answers|survey:display_only')).then(function(links){
                links[0].findElement(protractor.By.tagName('a')).then(function(answer){
                    answer.click().then(function(){
                        ptor.findElements(protractor.By.tagName('textarea')).then(function(fields){
                            fields[fields.length-1].sendKeys('response').then(function(){
                                ptor.findElements(protractor.By.className('btn-mini')).then(function(buttons){
                                    buttons[buttons.length-1].click().then(function(){
                                        feedback(ptor, 'Response Saved', 1);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
        it('should display the response that was sent', function(){
            ptor.findElement(protractor.By.binding('answer.response')).then(function(response){
                expect(response.getText()).toBe('response');
            });
        });
        it('should allow deleting the response', function(){
            ptor.findElement(protractor.By.className('btn-mini')).then(function(button){
                button.click().then(function(){
                    feedback(ptor, 'Response was successfully deleted.', 1);
                });
            });
        });
        it('should exit the modal', function(){
            ptor.findElements(protractor.By.linkText('Exit')).then(function(buttons){
                buttons[1].click();
            });
        });
    });
    describe('Main View', function(){
        it('should go to Display Surveys', function(){
            ptor.findElements(protractor.By.className('btn-primary')).then(function(buttons){
                buttons[2].click();
            });
        });
    });
    describe('Display Surveys', function(){
        it('should display a fullscreen modal', function(){
            ptor.findElement(protractor.By.className('modal')).then(function(modal){
                modal.isDisplayed().then(function(disp){
                    expect(disp).toBe(true);
                });
            });
        });
        it('should display two charts', function(){
            ptor.findElements(protractor.By.className('chart')).then(function(charts){
                expect(charts.length).toBe(2);
            });
        });
        it('should display the free text question', function(){
            ptor.findElements(protractor.By.tagName('h3')).then(function(titles){
                expect(titles[1].getText()).toBe('Free Text Question');
            });
        });
        it('should display the question body', function(){
            ptor.findElements(protractor.By.tagName('tr')).then(function(questions){
                expect(questions[3].getText()).toContain('Third Question');
            });
        });
        it('should display the answer to the question', function(){
            ptor.findElement(protractor.By.linkText('third answer')).then(function(answer){
                answer.isDisplayed().then(function(disp){
                    expect(disp).toBe(true);
                });
            });
        });
        it('should exit the modal', function(){
            ptor.findElement(protractor.By.linkText('Exit')).then(function(button){
                button.click();
            });
        });
    });
    describe('Teacher', function(){
        it('should go to course editor', function(){
            ptor.get('/#/courses/'+course_id+'/course_editor');
        });
        it('should delete all the modules', function(){
            ptor.findElements(protractor.By.className('trigger')).then(function(modules){
                modules[modules.length-1].click().then(function(){
                    ptor.findElements(protractor.By.className('delete')).then(function(deletes){
                        deletes[deletes.length-1].click().then(function(){
                            ptor.findElements(protractor.By.className('btn-danger')).then(function(buttons){
                                buttons[buttons.length-1].click();
                            });
                            ptor.sleep(1000);
                        });
                        deletes[deletes.length-2].click().then(function(){
                            ptor.findElements(protractor.By.className('btn-danger')).then(function(buttons){
                                buttons[buttons.length-1].click();
                            });
                            ptor.sleep(1000);
                        });
                        deletes[deletes.length-3].click().then(function(){
                            ptor.findElements(protractor.By.className('btn-danger')).then(function(buttons){
                                buttons[buttons.length-1].click();
                            });
                            ptor.sleep(1000);
                        });
                        deletes[deletes.length-4].click().then(function(){
                            ptor.findElements(protractor.By.className('btn-danger')).then(function(buttons){
                                buttons[buttons.length-1].click();
                            });
                            ptor.sleep(1000);
                        });
                    });
                });
            });
            //delete second module
            ptor.findElements(protractor.By.className('trigger')).then(function(modules){
                modules[modules.length-1].click().then(function(){
                    ptor.findElements(protractor.By.className('delete')).then(function(deletes){
                        deletes[deletes.length-1].click().then(function(){
                            ptor.findElements(protractor.By.className('btn-danger')).then(function(buttons){
                                buttons[buttons.length-1].click();
                            });
                            ptor.sleep(1000);
                        });
                        deletes[deletes.length-2].click().then(function(){
                            ptor.findElements(protractor.By.className('btn-danger')).then(function(buttons){
                                buttons[buttons.length-1].click();
                            });
                            ptor.sleep(1000);
                        });
                        deletes[deletes.length-3].click().then(function(){
                            ptor.findElements(protractor.By.className('btn-danger')).then(function(buttons){
                                buttons[buttons.length-1].click();
                            });
                            ptor.sleep(1000);
                        });
                        deletes[deletes.length-4].click().then(function(){
                            ptor.findElements(protractor.By.className('btn-danger')).then(function(buttons){
                                buttons[buttons.length-1].click();
                            });
                            ptor.sleep(1000);
                        });
                    });
                });
            });

            //delete first module
            ptor.findElements(protractor.By.className('trigger')).then(function(modules){
                modules[modules.length-1].click().then(function(){
                    ptor.findElements(protractor.By.className('delete')).then(function(deletes){
                        deletes[deletes.length-1].click().then(function(){
                            ptor.findElements(protractor.By.className('btn-danger')).then(function(buttons){
                                buttons[buttons.length-1].click();
                            });
                            ptor.sleep(1000);
                        });
                        deletes[deletes.length-2].click().then(function(){
                            ptor.findElements(protractor.By.className('btn-danger')).then(function(buttons){
                                buttons[buttons.length-1].click();
                            });
                            ptor.sleep(1000);
                        });
                        deletes[deletes.length-3].click().then(function(){
                            ptor.findElements(protractor.By.className('btn-danger')).then(function(buttons){
                                buttons[buttons.length-1].click();
                            });
                            ptor.sleep(1000);
                        });
                        deletes[deletes.length-4].click().then(function(){
                            ptor.findElements(protractor.By.className('btn-danger')).then(function(buttons){
                                buttons[buttons.length-1].click();
                            });
                            ptor.sleep(1000);
                        });
                        deletes[deletes.length-5].click().then(function(){
                            ptor.findElements(protractor.By.className('btn-danger')).then(function(buttons){
                                buttons[buttons.length-1].click();
                            });
                            ptor.sleep(1000);
                        });
                        deletes[deletes.length-6].click().then(function(){
                            ptor.findElements(protractor.By.className('btn-danger')).then(function(buttons){
                                buttons[buttons.length-1].click();
                            });
                            ptor.sleep(1000);
                        });
                    });
                });
            });

        });
        it('should delete the course', function(){
            ptor.get('/#/courses').then(function(){
                ptor.findElements(protractor.By.className('delete')).then(function(buttons){
                    buttons[buttons.length-1].click().then(function(){
                        ptor.findElements(protractor.By.className('btn-danger')).then(function(buttons){
                            buttons[buttons.length-1].click();
                            feedback(ptor, 'Course was successfully deleted.', 1);
                        });
                        ptor.sleep(1000);
                    });
                });
            });
        });


    })

});
//functions

function reviewQuestionsModal(ptor){
    describe('Review Questions', function(){
        it('should display a full screen modal', function(){
            ptor.findElements(protractor.By.className('btn')).then(function(buttons){
                buttons[4].click().then(function(){
                    ptor.findElement(protractor.By.className('modal')).then(function(modal){
                        modal.isDisplayed().then(function(disp){
                            expect(disp).toEqual(true)
                        });
                    });
                });
            });
        });
        it('should display modal title', function(){
            ptor.findElements(protractor.By.tagName('h4')).then(function(titles){
                expect(titles[titles.length-1].getText()).toBe('Review Student Questions on First Module');
            });
        });
        it('should display a table', function(){
            ptor.findElement(protractor.By.tagName('th')).then(function(table_head){
                table_head.isDisplayed().then(function(disp){
                    expect(disp).toBe(true);
                });
            });
        });
        it('should display one question', function(){
            ptor.findElements(protractor.By.repeater('question in review_questions')).then(function(questions){
                expect(questions.length).toBe(1);
            });
        });
        it('should display a hide checkbox for each question', function(){
            ptor.findElements(protractor.By.tagName('input')).then(function(checkboxes){
                expect(checkboxes.length).toBe(1);
            })
        });
        it('should display the question data', function(){
            ptor.findElements(protractor.By.tagName('td')).then(function(data){
                expect(data[1].getText()).toBe('why isn\'t it working?');
                expect(data[2].getText()).toBe('New Lecture2');
//                expect(data[3].getText()).toBe('00:00:08');
            });
        });
    });
}

function reviewQuizzesModal(ptor){
    describe('Review Quizzes', function(){
        it('should open a fullscreen modal', function(){
            ptor.findElements(protractor.By.className('btn')).then(function(buttons){
                buttons[3].click().then(function(){
                    ptor.findElement(protractor.By.className('modal')).then(function(modal){
                        modal.isDisplayed().then(function(disp){
                            expect(disp).toEqual(true)
                        });
                    });
                });
            });
        });
        it('should display modal title', function(){
            ptor.findElements(protractor.By.tagName('h4')).then(function(titles){
                expect(titles[titles.length-1].getText()).toBe('Review lecture quizzes on First Module');
            });
        });
        it('should display the table head', function(){
            expect(ptor.findElement(protractor.By.tagName('th')).getText()).toBe('Hide');
        });
        it('should display two charts for two quizzes', function(){
            ptor.findElements(protractor.By.repeater('id in lecture_data.question_ids')).then(function(charts){
                expect(charts.length).toBe(2);
            })
        });
        it('should display a hide checkbox for each quiz', function(){
            ptor.findElements(protractor.By.tagName('input')).then(function(checkboxes){
                expect(checkboxes.length).toBe(2);
            })
        });
        it('should display the chart for the first quiz with its correct data', function(){
            ptor.findElements(protractor.By.tagName('text')).then(function(names){
                expect(names[0].getText()).toBe('First Quiz');
                expect(names[1].getText()).toBe('Incorrect');
                expect(names[2].getText()).toBe('Correct');
                expect(names[3].getText()).toBe('OK (Correct)');
                expect(names[4].getText()).toBe('Cancel (Incorrect)');
                expect(names[5].getText()).toBe('Other (Incorrect)');
                expect(names[11].getText()).toBe('Number of Students');
            });
            ptor.findElements(protractor.By.tagName('rect')).then(function(rects){
                rects[13].getAttribute('height').then(function(height){
                    expect(height).toBe('122');
                    expect(height/122*100).toBe(100);
                });
                rects[13].click().then(function(){
                    ptor.findElements(protractor.By.tagName('text')).then(function(names){
                        expect(names[12].getText()).toBe('OK (Correct)');
                        expect(names[13].getText()).toBe('Correct:');
                        expect(names[14].getText()).toBe('1');
                    });
                });
            });
        });
        doRefresh(ptor);
        it('should click on Review Quizzes', function(){
            ptor.findElements(protractor.By.className('btn')).then(function(buttons){
                buttons[3].click();
            });
        });
        it('should display the chart for the first quiz with its correct data', function(){
            ptor.findElements(protractor.By.tagName('text')).then(function(names){
                expect(names[12].getText()).toBe('New Quiz2');
                expect(names[13].getText()).toBe('Incorrect');
                expect(names[14].getText()).toBe('Correct');
                expect(names[15].getText()).toBe('First Answer (Correct)')
                expect(names[16].getText()).toBe('Second Answer (Incorrect)')
                expect(names[22].getText()).toBe('Number of Students');
            });
            ptor.findElements(protractor.By.tagName('rect')).then(function(rects){
                rects[33].getAttribute('height').then(function(height){
                    expect(height).toBe('122');
                    expect(height/122*100).toBe(100);
                });
                rects[36].getAttribute('height').then(function(height){
                    expect(height).toBe('122');
                    expect(height/122*100).toBe(100);
                });
                rects[33].click().then(function(){
                    ptor.findElements(protractor.By.tagName('text')).then(function(names){
                        expect(names[23].getText()).toBe('First Answer (Correct)');
                        expect(names[24].getText()).toBe('Correct:');
                        expect(names[25].getText()).toBe('1');
                    });
                });
                ptor.findElement(protractor.By.tagName('text')).click();
                rects[36].click().then(function(){
                    ptor.findElements(protractor.By.tagName('text')).then(function(names){
                        expect(names[23].getText()).toBe('Second Answer (Incorrect)');
                        expect(names[24].getText()).toBe('Incorrect:');
                        expect(names[25].getText()).toBe('1');
                    });
                });
            });
        });
    });

}



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

function doRefresh(ptor){
    it('should refresh the page', function(){
        ptor.navigate().refresh();
    });
}

//function openMCQ(ptor){
//    it('should reopen the quiz', function(){
//        ptor.findElement(protractor.By.tagName('editable_text')).then(function(quiz_name){
//            quiz_name.click();
//        });
//    });
//}
//
//function openOCQ(ptor){
//    it('should reopen the quiz', function(){
//        ptor.findElement(protractor.By.tagName('editable_text')).then(function(quiz_name){
//            quiz_name.click();
//        });
//    });
//}

function doExit(ptor){
    it('should exit without saving', function(){
        ptor.findElements(protractor.By.id('done')).then(function(exit){
            exit[1].click();
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

function addMCQAnswers(ptor){
    it('should add quiz answers on top of the video - MCQ Video', function(){
        //double click in 3 different places, delta should be in y direction with a positive value
        ptor.executeScript('window.scrollBy(0, -1000)', '');
        ptor.findElement(protractor.By.className('ontop')).then(function(test){
            ptor.actions().doubleClick(test).perform();
            //-----------------------------------------//
            ptor.findElements(protractor.By.className('dropped')).then(function(answers){
                ptor.actions().dragAndDrop(answers[answers.length-1], {x: 200, y:115}).perform();
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
                    fields[0].sendKeys('OK');
                    fields[1].sendKeys('OK');
                });
            });
            //-----------------------------------------//
            ptor.actions().doubleClick(test).perform();
            ptor.findElements(protractor.By.className('dropped')).then(function(answers){
                ptor.actions().dragAndDrop(answers[answers.length-1], {x: 200, y:165}).perform();
                ptor.findElement(protractor.By.className('popover-content')).then(function(popover){
                    popover.isDisplayed().then(function(disp){
                        expect(disp).toBe(true);
                    });
                });
                ptor.findElements(protractor.By.className('must_save')).then(function(fields){
                    fields[0].sendKeys('Cancel');
                    fields[1].sendKeys('Cancel');
                });
            });
            //-----------------------------------------//
            ptor.actions().doubleClick(test).perform();
            ptor.findElements(protractor.By.className('dropped')).then(function(answers){
                ptor.actions().dragAndDrop(answers[answers.length-1], {x: 200, y:215}).perform();
                ptor.findElement(protractor.By.className('popover-content')).then(function(popover){
                    popover.isDisplayed().then(function(disp){
                        expect(disp).toBe(true);
                    });
                });
                ptor.findElements(protractor.By.className('must_save')).then(function(fields){
                    fields[0].sendKeys('Other');
                    fields[1].sendKeys('Other');
                });
            });

        });
    });
}

