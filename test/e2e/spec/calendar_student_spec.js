var util = require('util');

//var frontend = 'http://localhost:9000/';
//var backend = 'http://localhost:3000/';
//var auth = 'http://localhost:4000/';

var current_date = new Date(), enroll_key='', course_id='', module_id='', lecture_id='', quiz_id='';
var month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";

//var location1x, location1y, location2x, location2y, location3x, location3y;
var locationx = [];
var locationy = [];
function getNextDay(date){
    var result = date;
    result.setTime(date.getTime() + 86400000);
    return result;
}

function getNextWeek(date){
    var result = date;
    result.setTime(date.getTime() + 604800000);
    return result;
}
function getNextMonth(date){
    var result = date;
    result.setMonth(result.getMonth()+1)
    result.setDate(15)
    return result;
}
function getLastMonthDay(date){
    var result = date;
    result.setMonth(result.getMonth()-1)
    result.setDate(14)
    return result;
}
function getLastMonth(date){
    var result = date;
    result.setMonth(result.getMonth()-1)
    result.setDate(15)
    return result;
}

function noZero(date_string){
    var left = date_string.split('/')[0];
    var middle = date_string.split('/')[1];
    var right = date_string.split('/')[2];
    var first = left.split('')[0];
    var second = left.split('')[1];
    first = first.replace('0','');
    return first+second+'/'+middle+'/'+right;
}

function formatDate(date, which){
    var dd = date.getDate();
    if(dd < 10){
        dd = '0'+dd;
    }
    var mm = date.getMonth()+1;
    if(mm<10){
        mm = '0'+mm;
    }
    var yyyy = date.getFullYear();
    if(which == 0){
        return mm+'/'+dd.toString()+'/'+yyyy;
    }
    else if(which == 1){
        return dd+'/'+mm+'/'+yyyy;
    }
}

function waitForElement(element, ptor){
    ptor.wait(function(){
        return ptor.isElementPresent(element).then(function(value){
            return value
        });
    });
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

var today_keys = formatDate(new Date(), 0);
var tomorrow_keys = formatDate(getNextDay(new Date()), 0);
var after_tomorrow_keys = formatDate(getNextDay(getNextDay(new Date())), 0);
var next_day_week_keys = formatDate(getNextWeek(getNextDay(new Date())), 0);
var next_week_keys = formatDate(getNextWeek(new Date()), 0);
var next_month_keys = formatDate(getNextMonth(new Date()), 0);
var last_month_day_keys = formatDate(getLastMonthDay(new Date()), 0);
var last_month_keys = formatDate(getLastMonth(new Date()), 0);


var today = formatDate(new Date(), 1);
var tomorrow = formatDate(getNextDay(new Date()), 1);
var after_tomorrow = formatDate(getNextDay(getNextDay(new Date())), 1);
var next_day_week = formatDate(getNextWeek(getNextDay(new Date())), 1);
var next_week = formatDate(getNextWeek(new Date()), 1);
var next_month = formatDate(getNextMonth(new Date()), 1);
var last_month_day = formatDate(getLastMonthDay(new Date()), 1);
var last_month = formatDate(getLastMonth(new Date()), 1);


describe("Calendar",function(){
    var ptor = protractor.getInstance();
    var driver = ptor.driver;

    var findByName = function(name){
        return driver.findElement(protractor.By.name(name));
    };
    var findById = function(id){
        return driver.findElement(protractor.By.id(id))
    };

    describe('Teacher', function(){
        login(ptor, driver, 'anyteacher@email.com', 'password', 'anyteacher', findByName);
        it('should create a new course', function(){
            browser.driver.manage().window().setSize(ptor.params.width, ptor.params.height);
            browser.driver.manage().window().setPosition(0, 0);
            ptor = protractor.getInstance();
            ptor.get('/#/courses/new');
            ptor.findElements(protractor.By.tagName('input')).then(function(fields){
                fields[0].sendKeys('TEST-102');
                fields[1].sendKeys('Z Testing - Content Editor');
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
                    feedback(ptor, 'created');
                });
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
            })
        })
        it('should save enrollment key', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                data[0].getText().then(function(text){
                    enroll_key = text;
                });
            });
        });
 ///////////////////////////////////////////////       
        it('should go to course editor', function(){
//            ptor.findElement(protractor.By.id('course_editor_link')).then(function(link){
//                link.click();
//            });
            ptor.get('/#/courses/'+course_id+'/course_editor');
        });
        it('should add a new module and open it', function(){
            ptor.findElement(protractor.By.className('adding_module')).then(function(button){
                button.click().then(function(){
                    feedback(ptor, 'created');
                });
            });
            ptor.findElement(protractor.By.className('trigger')).click();
        });
        it('should save module id', function(){
            ptor.getCurrentUrl().then(function(text){
                var test2 = text.split('/');
                module_id = test2[test2.length-1];
            });
        });
        it('should edit module name', function(){
            ptor.findElement(protractor.By.tagName('details-text')).then(function(field){
                field.click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys('1');
                });
                ptor.findElement(protractor.By.className('btn-primary')).click().then(function(){
                    feedback(ptor, 'updated');
                });
            });
        });
        it("should edit module's due date", function(){
            ptor.findElements(protractor.By.className('editable-click')).then(function(details){
                details[2].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys(next_day_week_keys);
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                    buttons[buttons.length-2].click().then(function(){
                        feedback(ptor, 'updated');
                    });
                });
                details[2].getText().then(function(text){
                    expect(text).toBe(next_day_week);
                });
            });
        });
        it('should add a new lecture', function(){
            ptor.findElements(protractor.By.className('btn-mini')).then(function(adding){
                adding[adding.length-3].click().then(function(){
                    feedback(ptor, 'created');
                });
            });
        });
        it('should modify details', function(){
            ptor.findElement(protractor.By.className('trigger2')).click();
            ptor.findElement(protractor.By.className('editable-click')).then(function(name){
                expect(name.getText()).toBe('New Lecture');
                name.click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(nameTextBox){
                    nameTextBox.clear();
                    nameTextBox.sendKeys('My Lecture 1');
                    ptor.findElements(protractor.By.tagName('button')).then(function(button){
                        button[1].click().then(function(){
                            feedback(ptor, 'updated');
                        });
                    });
                });
                expect(name.getText()).toBe('My Lecture 1');
            });
            ptor.findElements(protractor.By.className('editable-click')).then(function(editable_click){
                expect(editable_click[1].getText()).toBe('none');
                editable_click[1].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(urlField){
                    urlField.clear();
                    urlField.sendKeys('http://www.youtube.com/watch?v=jgoGBxlVslI');
                   
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(button){
                    button[1].click();
                });
                

                waitForElement(protractor.By.tagName('iframe'), ptor)

                ptor.findElement(protractor.By.tagName('iframe')).then(function(elem){
                    elem.isDisplayed().then(function(disp){
                        expect(disp).toEqual(true)
                    });
                    expect(elem.getAttribute('src')).toContain("jgoGBxlVslI");
                });

                waitForElementNotVisible(protractor.By.className('overlay'), ptor)
                
            })
        });
        MCQTest(0, ptor);
        it('should refresh the page', function(){
            ptor.navigate().refresh();
            ptor.executeScript('window.scrollBy(0, -1000)', '');
        });

////////////////////////////////////////////////////////////////
        it('should add a second module and open it', function(){
            ptor.findElement(protractor.By.className('adding_module')).then(function(button){
                button.click().then(function(){
                    feedback(ptor, 'created');
                });
            });
            ptor.findElements(protractor.By.className('trigger')).then(function(modules){
                modules[modules.length-1].click();
            })
        });
        it('should save module id', function(){
            ptor.getCurrentUrl().then(function(text){
                var test2 = text.split('/');
                module_id = test2[test2.length-1];
            });
        });
        it('should edit module name', function(){
            ptor.findElement(protractor.By.tagName('details-text')).then(function(field){
                field.click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys('2');
                });
                ptor.findElement(protractor.By.className('btn-primary')).click().then(function(){
                    feedback(ptor, 'updated');
                });
            });
        });

        it("should edit module's due date", function(){
            ptor.findElements(protractor.By.className('editable-click')).then(function(details){
                details[2].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys(next_month_keys);
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                    buttons[buttons.length-2].click().then(function(){
                        feedback(ptor, 'updated');
                    });
                });
                details[2].getText().then(function(text){
                    expect(text).toBe(next_month);
                });
            });
        });

        it('should add a new lecture', function(){
            ptor.findElements(protractor.By.className('btn-mini')).then(function(adding){
                console.log("adding.length")
                console.log(adding.length)
                adding[adding.length-3].click().then(function(){
                    feedback(ptor, 'created')
                });
            });
        });
        it('should modify details', function(){
            ptor.findElements(protractor.By.className('trigger2')).then(function(lectures){
                lectures[lectures.length-1].click();
            });
            ptor.findElement(protractor.By.className('editable-click')).then(function(name){
                expect(name.getText()).toBe('New Lecture');
                name.click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(nameTextBox){
                    nameTextBox.clear();
                    nameTextBox.sendKeys('My Lecture 2');
                    ptor.findElements(protractor.By.tagName('button')).then(function(button){
                        button[1].click().then(function(){
                            feedback(ptor, 'updated');
                        });
                    });
                });
                expect(name.getText()).toBe('My Lecture 2');
            });
            ptor.findElements(protractor.By.className('editable-click')).then(function(editable_click){
                expect(editable_click[1].getText()).toBe('none');
                editable_click[1].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(urlField){
                    urlField.clear();
                    urlField.sendKeys('http://www.youtube.com/watch?v=jgoGBxlVslI');
                   
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(button){
                    button[1].click();
                });
                
                waitForElement(protractor.By.tagName('iframe'), ptor)
                
                ptor.findElement(protractor.By.tagName('iframe')).then(function(elem){
                    elem.isDisplayed().then(function(disp){
                        expect(disp).toEqual(true)
                    });
                    expect(elem.getAttribute('src')).toContain("jgoGBxlVslI");
                });

                waitForElementNotVisible(protractor.By.className('overlay'),ptor)
            })
        });
        MCQTest(0, ptor);
        it('should refresh the page', function(){
            ptor.navigate().refresh();
            ptor.executeScript('window.scrollBy(0, -1000)', '');
        });
        
        it('should add a new quiz', function(){
            console.log('starting add quiz');
            ptor.findElements(protractor.By.className('btn-mini')).then(function(buttons){
                buttons[buttons.length-2].click().then(function(){
                    feedback(ptor, 'created');
                });
            });
            ptor.findElements(protractor.By.className('trigger2')).then(function(quiz){
                expect(quiz[quiz.length-1].getText()).toBe('New Quiz');
            })
        });
        it('should open a quiz', function(){
            ptor.findElements(protractor.By.className('trigger2')).then(function(quizzes){
                quizzes[quizzes.length-1].click();
            });
        });
        it('should save quiz id', function(){
            ptor.getCurrentUrl().then(function(text){
                var test2 = text.split('/');
                quiz_id = test2[test2.length-1];
            });
        });
         it('should allow adding questions to quiz', function(){
            ptor.findElements(protractor.By.className('btn')).then(function(buttons){
                buttons[buttons.length-2].click();
                ptor.findElements(protractor.By.tagName('input')).then(function(fields){
                    fields[fields.length-3].sendKeys('first MCQ question');
                    fields[fields.length-2].sendKeys('first answer');
                    fields[fields.length-1].click();
                });
                ptor.findElement(protractor.By.className('add_multiple_answer')).click();
                ptor.findElements(protractor.By.name('answer')).then(function(fields){
                    fields[fields.length-1].sendKeys('second answer');
                });
                ptor.findElement(protractor.By.className('add_multiple_answer')).click();
                ptor.findElements(protractor.By.name('answer')).then(function(fields){
                    fields[fields.length-1].sendKeys('third answer');
                });

                buttons[buttons.length-2].click();

                ptor.findElements(protractor.By.tagName('input')).then(function(fields){
                    fields[fields.length-3].sendKeys('first OCQ question');
                    ptor.findElement(protractor.By.tagName('select')).then(function(question_type){
                        question_type.click();
                        ptor.findElements(protractor.By.tagName('option')).then(function(options){
                            options[options.length-2].click();
                        });
                    });
                });
                ptor.findElements(protractor.By.tagName('input')).then(function(fields){
                    fields[fields.length-2].sendKeys('first answer');
                    fields[fields.length-1].click();
                });
                ptor.findElements(protractor.By.className('add_multiple_answer')).then(function(add_multiple){
                    add_multiple[add_multiple.length-1].click();
                });
                ptor.findElements(protractor.By.name('answer')).then(function(fields){
                    fields[fields.length-1].sendKeys('second answer');
                });
                ptor.findElements(protractor.By.className('add_multiple_answer')).then(function(add_multiple){
                    add_multiple[add_multiple.length-1].click();
                });                ptor.findElements(protractor.By.name('answer')).then(function(fields){
                    fields[fields.length-1].sendKeys('third answer');
                });
            });
        });
        it('should save the questions', function(){
            ptor.findElements(protractor.By.className('btn')).then(function(buttons){
                buttons[buttons.length-1].click().then(function(){
                    feedback(ptor, 'saved');
                });
            });
        });

        it('should refresh the page', function(){
            ptor.navigate().refresh();
            ptor.executeScript('window.scrollBy(0, -1000)', '');
        });
        ////////////////////////////////////////////////////////////////
        it('should add a third module and open it', function(){
            ptor.findElement(protractor.By.className('adding_module')).then(function(button){
                button.click().then(function(){
                    feedback(ptor, 'created');
                });
            });

            ptor.findElements(protractor.By.className('trigger')).then(function(modules){
                modules[modules.length-1].click();
            })
        });
        it('should save module id', function(){
            ptor.getCurrentUrl().then(function(text){
                var test2 = text.split('/');
                module_id = test2[test2.length-1];
            });
        });
        it('should edit module name', function(){
            ptor.findElement(protractor.By.tagName('details-text')).then(function(field){
                field.click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys('3');
                });
                ptor.findElement(protractor.By.className('btn-primary')).click().then(function(){
                    feedback(ptor, 'updated');
                });
            });
        });

        it("should edit module's apperance date", function(){
            ptor.findElements(protractor.By.className('editable-click')).then(function(details){
                details[1].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys(last_month_day_keys);
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                    buttons[buttons.length-2].click().then(function(){
                        feedback(ptor, 'updated');
                    });
                });
                details[1].getText().then(function(text){
                    expect(text).toBe(last_month_day);
                });
            });
        });

        it("should edit module's due date", function(){
            ptor.findElements(protractor.By.className('editable-click')).then(function(details){
                details[2].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys(last_month_keys);
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                    buttons[buttons.length-2].click().then(function(){
                        feedback(ptor, 'updated');
                    });
                });
                details[2].getText().then(function(text){
                    expect(text).toBe(last_month);
                });
            });
        });
        it('should add a new quiz', function(){
            console.log('starting add quiz');
            ptor.findElements(protractor.By.className('btn-mini')).then(function(buttons){
                buttons[buttons.length-2].click().then(function(){
                    feedback(ptor, 'created');
                });
            });
            ptor.findElements(protractor.By.className('trigger2')).then(function(quiz){
                expect(quiz[quiz.length-1].getText()).toBe('New Quiz');
            })
        });
        it('should open a quiz', function(){
            ptor.findElements(protractor.By.className('trigger2')).then(function(quizzes){
                quizzes[quizzes.length-1].click();
                console.log('should open quiz')
            });
        });
         it('should allow adding questions to quiz', function(){
            ptor.findElements(protractor.By.className('btn')).then(function(buttons){
                buttons[buttons.length-2].click();
                ptor.findElements(protractor.By.tagName('input')).then(function(fields){
                    fields[fields.length-3].sendKeys('first MCQ question');
                    fields[fields.length-2].sendKeys('first answer');
                    fields[fields.length-1].click();
                });
                ptor.findElement(protractor.By.className('add_multiple_answer')).click();
                ptor.findElements(protractor.By.name('answer')).then(function(fields){
                    fields[fields.length-1].sendKeys('second answer');
                });
                ptor.findElement(protractor.By.className('add_multiple_answer')).click();
                ptor.findElements(protractor.By.name('answer')).then(function(fields){
                    fields[fields.length-1].sendKeys('third answer');
                });

                buttons[buttons.length-2].click();

                ptor.findElements(protractor.By.tagName('input')).then(function(fields){
                    fields[fields.length-3].sendKeys('first OCQ question');
                    ptor.findElement(protractor.By.tagName('select')).then(function(question_type){
                        question_type.click();
                        ptor.findElements(protractor.By.tagName('option')).then(function(options){
                            options[options.length-2].click();
                        });
                    });
                });
                ptor.findElements(protractor.By.tagName('input')).then(function(fields){
                    fields[fields.length-2].sendKeys('first answer');
                    fields[fields.length-1].click();
                });
                ptor.findElements(protractor.By.className('add_multiple_answer')).then(function(add_multiple){
                    add_multiple[add_multiple.length-1].click();
                });
                ptor.findElements(protractor.By.name('answer')).then(function(fields){
                    fields[fields.length-1].sendKeys('second answer');
                });
                ptor.findElements(protractor.By.className('add_multiple_answer')).then(function(add_multiple){
                    add_multiple[add_multiple.length-1].click();
                });                ptor.findElements(protractor.By.name('answer')).then(function(fields){
                    fields[fields.length-1].sendKeys('third answer');
                });
            });
        });
        it('should save the questions', function(){
            ptor.findElements(protractor.By.className('btn')).then(function(buttons){
                buttons[buttons.length-1].click().then(function(){
                    feedback(ptor, 'saved');
                });
            });
        });
        logout(ptor, driver);

    });
//////////////////////////////////////////////////////////////////////////////////////////
    describe('Student', function(){
        login(ptor, driver, 'anystudent@email.com', 'password', 'anystudent', findByName);
        
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
                    ptor.sleep(5000);
                });
            });
        });
//        it('should click on the course name', function(){
//            ptor.findElements(protractor.By.binding('course.name')).then(function(courses){
//                courses[courses.length-1].click();
//            });
//        });
        it('should be in Calendar page', function(){
            ptor.get('/#/courses/'+course_id+'/student/events');
            ptor.findElement(protractor.By.tagName('h2')).
                then(function(promise){
                    expect(promise.getText()).toEqual(month[current_date.getMonth()]+" "+current_date.getFullYear())
            });
        });
        it ('should be able to go to prev month', function() {
            ptor.findElement(protractor.By.className('fc-button-prev')).click().
                then(function(promise){
                    ptor.findElement(protractor.By.tagName('h2')).
                        then(function(promise){
                            var prev_date = new Date()
                            prev_date.setMonth(current_date.getMonth()-1)
                            expect(promise.getText()).toEqual(month[prev_date.getMonth()]+" "+prev_date.getFullYear())
                        });
                });
        });

        it ('should display all the events for the current month', function() {
            ptor.findElements(protractor.By.className('fc-event')).
                then(function(events){
                    expect(events.length).toEqual(1)  
                    expect(events[0].getAttribute('style')).toContain('red')
                    events[0].findElement(protractor.By.className('fc-event-title')).then(function(title){
                        expect(title.getText()).toEqual('3 due')
                    })
                });
        });
        it ('should answer all questions in quiz', function() {
            ptor.findElement(protractor.By.className('fc-event')).click()
            ptor.findElement(protractor.By.tagName('h4')).getText().then(function(text){
                expect(text).toEqual('New Quiz')
            })
            ptor.findElements(protractor.By.tagName('input')).then(function(inputs){
                inputs[0].click();
                inputs[3].click();
                inputs[inputs.length-1].click().then(function(){
                    feedback(ptor, 'saved');
                });
            });
        });

        it ('should check if module color has changed', function() {
            ptor.get('/#/courses/'+course_id+'/student/events');
            ptor.findElement(protractor.By.className('fc-button-prev')).click()
            ptor.findElements(protractor.By.className('fc-event')).then(function(events){
                    expect(events.length).toEqual(1)  
                    expect(events[0].getAttribute('style')).toContain('green')
                    events[0].findElement(protractor.By.className('fc-event-title')).then(function(title){
                        expect(title.getText()).toEqual('3 due')
                    })
                });
        });

        it ('should be able to go directly to today', function() {
            ptor.findElement(protractor.By.className('fc-button-prev')).click();
            ptor.findElement(protractor.By.className('fc-button-prev')).click();
            ptor.findElement(protractor.By.className('fc-button-today')).click().
                then(function(promise){
                    ptor.findElement(protractor.By.tagName('h2')).
                        then(function(promise){
                            expect(promise.getText()).toEqual(month[current_date.getMonth()]+" "+current_date.getFullYear())
                        });
                });
        });

        it ('should display all the events for the current month', function() {
            ptor.findElements(protractor.By.className('fc-event')).
                then(function(events){
                    expect(events.length).toEqual(1)  
                    expect(events[0].getAttribute('style')).toContain('orange')
                    events[0].findElement(protractor.By.className('fc-event-title')).then(function(title){
                        expect(title.getText()).toEqual('1 due')
                    })
                });
        });
        it ('should open the module when clicking an event', function() {
            ptor.findElements(protractor.By.className('fc-event')).
                then(function(events){                    
                    events[0].click()
                });
            ptor.findElement(protractor.By.tagName('h3')).getText().then(function(text){
                expect(text).toEqual('My Lecture 1')
            })
        });
        it ('should check if module color has changed', function() {
            ptor.get('/#/courses/'+course_id+'/student/events');
            ptor.findElements(protractor.By.className('fc-event')).then(function(events){
                    expect(events.length).toEqual(1)  
                    expect(events[0].getAttribute('style')).toContain('orange')
                    events[0].findElement(protractor.By.className('fc-event-title')).then(function(title){
                        expect(title.getText()).toEqual('1 due')
                    })
                });
        });
        it ('should answer all questions in lecture', function() {
            ptor.findElements(protractor.By.className('fc-event')).
                then(function(events){                    
                    events[0].click()
                });
            ptor.findElement(protractor.By.tagName('h3')).getText().then(function(text){
                expect(text).toEqual('My Lecture 1')
            }) 

            ptor.wait(function(){                    
               return ptor.isElementPresent(protractor.By.tagName('iframe')).then(function(value){
                    return value
                })
            }) 

            ptor.wait(function(){                    
               return ptor.findElements(protractor.By.tagName('input')).then(function(inputs){
                    if(inputs.length > 3)
                        return true
                    return false
                })
            }) 

             ptor.findElement(protractor.By.tagName('input')).click();
             ptor.findElements(protractor.By.className('btn-primary')).then(function(buttons){
                buttons[1].click().then(function(){
                    ptor.sleep(10000);
                });
            });
                      
        });
         it('should refresh the page', function(){
            ptor.navigate().refresh();
        });
        it('should check if module color has changed', function() {
            ptor.get('/#/courses/'+course_id+'/student/events');
            ptor.findElements(protractor.By.className('fc-event')).then(function(events){
                    expect(events.length).toEqual(1)  
                    expect(events[0].getAttribute('style')).toContain('green')
                    events[0].findElement(protractor.By.className('fc-event-title')).then(function(title){
                        expect(title.getText()).toEqual('1 due')
                    })
                });
        });

        it ('should be able to go to next month', function() {
            ptor.findElement(protractor.By.className('fc-button-next')).click().
                then(function(promise){
                    ptor.findElement(protractor.By.tagName('h2')).
                        then(function(promise){
                            var next_date = new Date()
                            next_date.setMonth(current_date.getMonth()+1)
                            expect(promise.getText()).toEqual(month[next_date.getMonth()]+" "+next_date.getFullYear())
                        });
                });
        });
        it ('should display all the events for the current month', function() {
            ptor.findElements(protractor.By.className('fc-event')).
                then(function(events){
                    expect(events.length).toEqual(1)  
                    expect(events[0].getAttribute('style')).toContain('orange')
                    events[0].findElement(protractor.By.className('fc-event-title')).then(function(title){
                        expect(title.getText()).toEqual('2 due')
                    })
                });
        });
        it ('should open the module when clicking an event', function() {
            ptor.findElement(protractor.By.className('fc-event')).click()
            ptor.findElement(protractor.By.tagName('h3')).getText().then(function(text){
                expect(text).toEqual('My Lecture 2')
            })
        });
        it ('should check if module color has changed', function() {
            ptor.get('/#/courses/'+course_id+'/student/events');
            ptor.findElement(protractor.By.className('fc-button-next')).click()
            ptor.findElements(protractor.By.className('fc-event')).then(function(events){
                    expect(events.length).toEqual(1)  
                    expect(events[0].getAttribute('style')).toContain('orange')
                    events[0].findElement(protractor.By.className('fc-event-title')).then(function(title){
                        expect(title.getText()).toEqual('2 due')
                    })
                });
        });
       
        it ('should answer all questions in lecture', function() {
            ptor.findElement(protractor.By.className('fc-event')).click()
            ptor.findElement(protractor.By.tagName('h3')).getText().then(function(text){
                expect(text).toEqual('My Lecture 2')
            }) 
            ptor.wait(function(){                    
               return ptor.isElementPresent(protractor.By.tagName('iframe')).then(function(value){
                    return value
                })
            }) 

            ptor.wait(function(){                    
               return ptor.findElements(protractor.By.tagName('input')).then(function(inputs){
                    if(inputs.length > 3)
                        return true
                    return false
                })
            }) 

             ptor.findElement(protractor.By.tagName('input')).click();
             ptor.findElements(protractor.By.className('btn-primary')).then(function(buttons){
                buttons[1].click().then(function(){
                    ptor.sleep(10000);
                })
            });                      
        });

        it ('should check if module color has not changed', function() {
            ptor.get('/#/courses/'+course_id+'/student/events');
            ptor.findElement(protractor.By.className('fc-button-next')).click()
            ptor.findElements(protractor.By.className('fc-event')).then(function(events){
                    expect(events.length).toEqual(1)  
                    expect(events[0].getAttribute('style')).toContain('orange')
                    events[0].findElement(protractor.By.className('fc-event-title')).then(function(title){
                        expect(title.getText()).toEqual('2 due')
                    })
                });
        });

        it('should answer quiz questions', function() {
            ptor.get('/#/courses/'+course_id+'/courseware/quizzes/'+quiz_id);
            ptor.findElement(protractor.By.tagName('h4')).getText().then(function(text){
                expect(text).toEqual('New Quiz')
            })
            ptor.findElements(protractor.By.tagName('input')).then(function(inputs){
                console.log(inputs.length)
                inputs[0].click();
                inputs[3].click();
                inputs[inputs.length-1].click().then(function(){
                    feedback(ptor, 'saved');
                });
            });
        });

        it ('should check if module color has changed', function() {
            ptor.get('/#/courses/'+course_id+'/student/events');
            ptor.findElement(protractor.By.className('fc-button-next')).click()
            ptor.findElements(protractor.By.className('fc-event')).then(function(events){
                    expect(events.length).toEqual(1)  
                    expect(events[0].getAttribute('style')).toContain('green')
                    events[0].findElement(protractor.By.className('fc-event-title')).then(function(title){
                        expect(title.getText()).toEqual('2 due')
                    })
                });
        });

        logout(ptor, driver);
     })
/////////////////////////////////////////////////////////
    describe('Revert Back', function(){
         login(ptor, driver, 'anyteacher@email.com', 'password', 'anyteacher', findByName);
         it('should open the course',function(){
            ptor.get('/#/courses/'+course_id+'/course_editor');
         })
        it('should delete All lectures and modules', function(){
            ptor.findElements(protractor.By.className('module')).then(function(modules){
                for(var i=modules.length-1; i>=0; i--){
                    modules[i].click()
                    modules[i].findElements(protractor.By.className('delete')).then(function(delete_buttons){
                        console.log(delete_buttons.length)
                        for(var n=delete_buttons.length-1; n>=0; n--){
                            delete_buttons[n].click().then(function(){
                                ptor.findElement(protractor.By.className('btn-danger')).click().then(function(){
                                    feedback(ptor, 'deleted');
                                })
                            });
                        }
                    });
                }                            
            });
        });
        it('should delete the created course', function(){
            ptor.get('/#/courses');
            ptor.findElements(protractor.By.className('delete')).then(function(delete_buttons){
                delete_buttons[delete_buttons.length-1].click();
                ptor.findElements(protractor.By.className('btn-danger')).then(function(danger_button){
                    danger_button[danger_button.length-1].click().then(function(){
                        feedback(ptor, 'deleted');
                    });
                })
            });
        });
        logout(ptor, driver);

    });
        
});

/**************************************/
function MCQTest(mode, ptor){
    it('should sleep', function(){
        ptor.sleep(10000);
    });
    var modeName = 'normal';
    if(mode == 1){
        modeName = 'fullscreen';
        it('should go to fullscreen mode', function(){
            ptor.executeScript('window.scrollBy(0, -2000)', '');
            ptor.findElement(protractor.By.className('fullscreenLink')).then(function(fullscreen_button){
                fullscreen_button.click();
            });
        });

    }
    it('should insert an MCQ quiz in '+modeName+' mode', function(){
        console.log('starting MCQ '+modeName);
        ptor.findElements(protractor.By.className('dropdown-toggle')).then(function(lists){
            lists[2].click();
        });
        ptor.findElements(protractor.By.className('insertQuiz')).then(function(options){
            options[3].click();
        });
        ptor.findElement(protractor.By.className('ontop')).then(function(container){
            container.isDisplayed().then(function(disp){
                expect(disp).toBe(true);
            });
        });
        ptor.findElement(protractor.By.id('editing')).then(function(editing){
            expect(editing.getText()).toContain('New Quiz');
        });
        ptor.findElements(protractor.By.tagName('editable_text')).then(function(editables){
            expect(editables[0].getText()).toBe('New Quiz');
            //edit quiz name
            ptor.actions().doubleClick(editables[0]).perform();
            ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                field.clear();
                field.sendKeys('My Quiz');
                ptor.findElements(protractor.By.className('btn-primary')).then(function(buttons){
                    buttons[1].click();
                });
            });
            expect(editables[0].getText()).toBe('My Quiz');
            ptor.actions().doubleClick(editables[0]).perform();
            ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                field.clear();
                field.sendKeys('New Quiz');
                ptor.findElement(protractor.By.className('icon-remove')).then(function(remove_button){
                    remove_button.click();
                });
            });
            expect(editables[0].getText()).toBe('My Quiz');
            ptor.findElements(protractor.By.tagName('td')).then(function(data){
                expect(data[6].getText()).toBe('MCQ');
            });
        });
    });
    //enter the answers
    it('should add answers and explanations to MCQ quiz', function(){
        ptor.findElements(protractor.By.name('answer')).then(function(fields){
            fields[fields.length-1].sendKeys('first answer');
        });
        ptor.findElements(protractor.By.className('explain')).then(function(fields){
            fields[fields.length-1].sendKeys('first Explanation');
        });
        ptor.findElement(protractor.By.className('add_multiple_answer')).click();
        ptor.findElements(protractor.By.name('answer')).then(function(fields){
            fields[fields.length-1].sendKeys('second answer');
        });
        ptor.findElements(protractor.By.className('explain')).then(function(fields){
            fields[fields.length-1].sendKeys('second Explanation');
        });
        ptor.findElement(protractor.By.className('add_multiple_answer')).click();
        ptor.findElements(protractor.By.name('answer')).then(function(fields){
            fields[fields.length-1].sendKeys('third answer');
        });
        ptor.findElements(protractor.By.className('explain')).then(function(fields){
            fields[fields.length-1].sendKeys('third Explanation');
        });
    });
   
    it('should mark an answer as correct', function(){
        ptor.findElement(protractor.By.name('mcq')).then(function(correct_check){
            correct_check.click();
        });
        ptor.findElement(protractor.By.className('btn-primary')).then(function(save_button){
            save_button.click();
        });
        var error = ptor.findElement(protractor.By.className('alert-error'));
        expect(error.getText()).toBe('');
    });
}

