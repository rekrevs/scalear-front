var current_date = new Date();
var no_students, no_modules, percentage, dummy;

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
        });
        driver.get("http://localhost:4000/");
//        driver.get("http://scalear-auth.herokuapp.com");
        driver.findElements(protractor.By.tagName('a')).then(function(logout){
            logout[4].click();
        });
    });
}

describe('Progress Chart', function(){
    var ptor = protractor.getInstance();
    var driver = ptor.driver;

    var findByName = function(name){
        return driver.findElement(protractor.By.name(name));
    };
//    var findById = function(id){
//        return driver.findElement(protractor.By.id(id))
//    };
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
                fields[1].sendKeys('Testing Course');
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
            ptor.findElements(protractor.By.className('btn-mini')).then(function(adding){
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



    });

//    describe('Module Progress', function(){
//        it('should display two tabs', function(){
//            ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div/ul/li[1]/a')).then(function(first_tab){
//                expect(first_tab.getText()).toBe('Module Progress');
//            });
//            ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div/ul/li[2]/a')).then(function(second_tab){
//                expect(second_tab.getText()).toBe('Module Chart');
//            });
//        });
//        it('should display the chart title', function(){
//            ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div/div/div[1]/h3')).then(function(title){
//                expect(title.getText()).toBe('Module Progress Charts');
//            });
//        });
//        it('should display correct student names and emails', function(){
//            ptor.findElements(protractor.By.repeater('student in students')).then(function(names){
//                expect(names[0].getText()).toBe('Bahia');
//                ptor.actions().mouseMove(names[0]).perform();
//                ptor.findElement(protractor.By.className('tooltip')).then(function(tooltip){
//                    expect(tooltip.getText()).toBe('bahia.sharkawy@gmail.com');
//                });
//                expect(names[1].getText()).toBe('Mahmoud Menshawi');
//                ptor.actions().mouseMove(names[1]).perform().then(function(){
//                    ptor.sleep(500);
//                    ptor.findElement(protractor.By.className('tooltip')).then(function(tooltip){
//                        expect(tooltip.getText()).toBe('em_menshawi@hotmail.com');
//                    });
//                });
//
//
//            });
//        });
//        it('should display modules\' names in their correct order', function(){
//            ptor.findElements(protractor.By.repeater('name in columnNames')).then(function(modules){
//                expect(modules.length).toBe(3);
//                no_modules = modules.length;
//                expect(modules[0].getText()).toBe('First Module');
//                expect(modules[1].getText()).toBe('Second Module');
//                expect(modules[2].getText()).toBe('Third Module');
//            });
//        });
//        it('should display which modules were finished by each user correctly', function(){
//            ptor.findElements(protractor.By.repeater('student in students')).then(function(students){
//                expect(students.length).toBe(2);
//                no_students = students.length;
//                ptor.findElements(protractor.By.className('marker')).then(function(markers){
//                    for(var s=0; s<no_students; s++){
//                        for(var m=0; m<no_modules; m++){
//                            p = (no_modules*s)+m;
//                            if(p==0){
//                                expect(markers[p].getAttribute('src')).toContain('Not_Finished.png');
//                            }
//                            else if(p==1){
//                                expect(markers[p].getAttribute('src')).toContain('Finished_on_Time.png');
//                            }
//                            else if(p==2){
//                                expect(markers[p].getAttribute('src')).toContain('Not_Finished.png');
//                            }
//                            else if(p==3){
//                                expect(markers[p].getAttribute('src')).toContain('Finished_on_Time.png');
//                            }
//                            else if(p==4){
//                                expect(markers[p].getAttribute('src')).toContain('Finished_on_Time.png');
//                            }
//                            else if(p==5){
//                                expect(markers[p].getAttribute('src')).toContain('Finished_on_Time.png');
//                            }
//                        }
//                    }
//                });
//            });
//
//        });
//        it('should be able to change the status of each module for each student', function(){
//            ptor.findElements(protractor.By.className('marker')).then(function(markers){
//                markers[0].click().then(function(){
//
//                    ptor.findElements(protractor.By.tagName('input')).then(function(options){
//                        options[1].click().then(function(){
//                            ptor.findElements(protractor.By.className('marker')).then(function(image){
//                                expect(image[0].getAttribute('src')).toContain('Finished_on_Time.png');
//                            });
//                        }).then(function(){
//                                ptor.navigate().refresh();
//                            });
//                    })
//                });
//            });
//            ptor.findElements(protractor.By.className('marker')).then(function(markers){
//                markers[0].click().then(function(){
//                    ptor.sleep(500);
//                    ptor.findElements(protractor.By.tagName('input')).then(function(options){
//                        options[0].click().then(function(){
//                            ptor.findElements(protractor.By.className('marker')).then(function(image){
//                                expect(image[0].getAttribute('src')).toContain('Not_Finished.png');
//                            });
//                        });
//                    })
//                });
//            });
//        });
//    });
//
//    describe('Teacher', function(){
//        it('should go to course editor', function(){
//            ptor.get('/#/courses/134/course_editor');
//        });
//        it('should change the order of the modules and go back to the progress page', function(){
//            ptor.findElements(protractor.By.className('handle')).then(function(handles){
//                browser.actions().dragAndDrop(handles[6], handles[0]).perform();
//            });
//        });
//        it('should go back to progress pages', function(){
//            ptor.get('/#/courses/134/progress/main');
//        })
//    });
//
//    describe('Module Progress', function(){
//        it('should display correct student names and emails after sorting modules', function(){
//            ptor.findElements(protractor.By.repeater('student in students')).then(function(names){
//                expect(names[0].getText()).toBe('Bahia');
//                ptor.actions().mouseMove(names[0]).perform();
//                ptor.findElement(protractor.By.className('tooltip')).then(function(tooltip){
//                    expect(tooltip.getText()).toBe('bahia.sharkawy@gmail.com');
//                });
//                expect(names[1].getText()).toBe('Mahmoud Menshawi');
//                ptor.actions().mouseMove(names[1]).perform().then(function(){
//                    ptor.sleep(500);
//                    ptor.findElement(protractor.By.className('tooltip')).then(function(tooltip){
//                        expect(tooltip.getText()).toBe('em_menshawi@hotmail.com');
//                    });
//                });
//
//
//            });
//        });
//        it('should display modules\' names in their correct order after sorting modules', function(){
//            ptor.findElements(protractor.By.repeater('name in columnNames')).then(function(modules){
//                expect(modules.length).toBe(3);
//                no_modules = modules.length;
//                expect(modules[0].getText()).toBe('Second Module');
//                expect(modules[1].getText()).toBe('First Module');
//                expect(modules[2].getText()).toBe('Third Module');
//            });
//        });
//        it('should display which modules were finished by each user correctly after sorting modules', function(){
//            ptor.findElements(protractor.By.repeater('student in students')).then(function(students){
//                expect(students.length).toBe(2);
//                no_students = students.length;
//                ptor.findElements(protractor.By.className('marker')).then(function(markers){
//                    for(var s=0; s<no_students; s++){
//                        for(var m=0; m<no_modules; m++){
//                            p = (no_modules*s)+m;
//                            if(p==0){
//                                expect(markers[p].getAttribute('src')).toContain('Finished_on_Time.png');
//                            }
//                            else if(p==1){
//                                expect(markers[p].getAttribute('src')).toContain('Not_Finished.png');
//                            }
//                            else if(p==2){
//                                expect(markers[p].getAttribute('src')).toContain('Not_Finished.png');
//                            }
//                            else if(p==3){
//                                expect(markers[p].getAttribute('src')).toContain('Finished_on_Time.png');
//                            }
//                            else if(p==4){
//                                expect(markers[p].getAttribute('src')).toContain('Finished_on_Time.png');
//                            }
//                            else if(p==5){
//                                expect(markers[p].getAttribute('src')).toContain('Finished_on_Time.png');
//                            }
//                        }
//                    }
//                });
//            });
//
//        });
//    });
//    describe('Teacher', function(){
//        it('should go to course editor', function(){
//            ptor.get('/#/courses/134/course_editor');
//        });
//        it('should change the order of the modules and go back to the progress page', function(){
//            ptor.findElements(protractor.By.className('handle')).then(function(handles){
//                browser.actions().dragAndDrop(handles[4], handles[0]).perform();
////                ptor.sleep(10000);
//            });
//        });
//        it('should go back to progress pages', function(){
//            ptor.get('/#/courses/134/progress/main');
//        });
//        it('should navigate to the Module Chart tab', function(){
//            ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div/ul/li[2]/a')).then(function(second_tab){
//                second_tab.click();
//            });
//        });
//    });
//    describe('Module Chart', function(){
//        it('should display correct titles on the chart', function(){
//            ptor.sleep(1000);
//            ptor.findElements(protractor.By.tagName('text')).then(function(titles){
//                expect(titles[0].getText()).toBe('Quiz');
//                expect(titles[1].getText()).toBe('Lecture');
//                expect(titles[2].getText()).toBe('Bahia');
//                expect(titles[3].getText()).toBe('Mahmoud Mensha...');
//                expect(titles[4].getText()).toBe('Statistics');
//            });
//        });
//        it('should display correct progress bar for each student', function(){
//            ptor.findElements(protractor.By.tagName('rect')).then(function(bars){
//                percentage = [];
//                bars[13].getAttribute('width').then(function(value){
//                    expect(value).toBe('300');
//                    percentage[0] = (value/600)*100;
//                    expect(percentage[0]).toBe(50);
//                });
//                bars[14].getAttribute('width').then(function(value){
//                    expect(value).toBe('600');
//                    percentage[1] = (value/600)*100;
//                    expect(percentage[1]).toBe(100);
//                });
//                bars[15].getAttribute('width').then(function(value){
//                    expect(value).toBe('300');
//                    percentage[2] = (value/600)*100;
//                    expect(percentage[2]).toBe(50);
//                });
//                bars[16].getAttribute('width').then(function(value){
//                    expect(value).toBe('600');
//                    percentage[3] = (value/600)*100;
//                    expect(percentage[3]).toBe(100);
//                });
//            });
//        });
//        it('should show the popover with student name and percentage when hovering on each bar', function(){
//            ptor.findElements(protractor.By.tagName('rect')).then(function(rects){
//                rects[13].click()
//                    .then(function(){
//                        ptor.findElements(protractor.By.tagName('text')).then(function(texts){
//                            expect(texts[texts.length-3].getText()).toBe('Bahia');
//                            expect(texts[texts.length-2].getText()).toBe('Quiz:');
//                            expect(texts[texts.length-1].getText()).toBe('50%');
//                        });
//                    });
//
//                rects[14].click()
//                    .then(function(){
//                        ptor.findElements(protractor.By.tagName('text')).then(function(texts){
//                            expect(texts[texts.length-3].getText()).toBe('Mahmoud Menshawi');
//                            expect(texts[texts.length-2].getText()).toBe('Quiz:');
//                            expect(texts[texts.length-1].getText()).toBe('100%');
//                        });
//                    });
//
//                rects[15].click()
//                    .then(function(){
//                        ptor.findElements(protractor.By.tagName('text')).then(function(texts){
//                            expect(texts[texts.length-3].getText()).toBe('Bahia');
//                            expect(texts[texts.length-2].getText()).toBe('Lecture:');
//                            expect(texts[texts.length-1].getText()).toBe('50%');
//                        });
//                    });
//
//                rects[16].click()
//                    .then(function(){
//                        ptor.findElements(protractor.By.tagName('text')).then(function(texts){
//                            expect(texts[texts.length-3].getText()).toBe('Mahmoud Menshawi');
//                            expect(texts[texts.length-2].getText()).toBe('Lecture:');
//                            expect(texts[texts.length-1].getText()).toBe('100%');
//                        });
//                    });
//            });
//        });
//    });
//    describe('Modules Progress', function(){
//        it('should go to a module', function(){
//            ptor.get('/#/courses/134/progress/modules/608');
//            ptor.sleep(2000);
//        });
//        it('should display correct titles on the top chart', function(){
//            ptor.findElements(protractor.By.tagName('text')).then(function(texts){
//                expect(texts[0].getText()).toBe('Module Progress Charts');
//                expect(texts[1].getText()).toBe('Students');
//                expect(texts[texts.length-1].getText()).toBe('Number of Students');
//                expect(texts[5].getText()).toBe('Completed Late');
//                expect(texts[4].getText()).toBe('Completed on Time');
//                expect(texts[3].getText()).toBe('Watched <= 50%');
//                expect(texts[2].getText()).toBe('Not Started Watching');
////                expect(texts[texts.length-1].getText()).toBe('Number of Students');
//            });
//        });
//        it('should display the bars on the top chart and display their data when hovering on them', function(){
//            ptor.findElements(protractor.By.tagName('rect')).then(function(rects){
//                rects[12].click()
//                    .then(function(){
//                        ptor.findElements(protractor.By.tagName('text')).then(function(texts){
//                            expect(texts[12].getText()).toBe('Watched <= 50%');
//                            expect(texts[13].getText()).toBe('Students:');
//                            expect(texts[14].getText()).toBe('1');
//                        });
//                    });
//                rects[13].click()
//                    .then(function(){
//                        ptor.findElements(protractor.By.tagName('text')).then(function(texts){
//                            expect(texts[12].getText()).toBe('Completed on Time');
//                            expect(texts[13].getText()).toBe('Students:');
//                            expect(texts[14].getText()).toBe('1');
//                        });
//                    });
//            });
//        });
//        it('should click on each question in the lecture quizzes tab and make sure that the video seeks to that question', function(){
//            ptor.findElements(protractor.By.className('seeker')).then(function(seekers){
//                ptor.sleep(5000);
//                expect(seekers[0].getText()).toBe('Question 1\nNew Lecture');
//                expect(seekers[1].getText()).toBe('Question 2\nNew Lecture2');
//                seekers[0].click()
//                    .then(function(){
//                        ptor.sleep(2500);
//                        driver.switchTo().frame(0);
//                        driver.findElement(protractor.By.className("ytp-time-current")).then(function(time){
//                            expect(time.getText()).toBe('1:07');
//                        });
//                        driver.switchTo().defaultContent();
//                        ptor.findElement(protractor.By.tagName('iframe')).then(function(player){
//                            expect(player.getAttribute('src')).toContain('XtyzOo7nJrQ');
//                        });
//                    });
//                seekers[1].click()
//                    .then(function(){
//                        ptor.sleep(2500);
//                        driver.switchTo().frame(0);
//                        driver.findElement(protractor.By.className("ytp-time-current")).then(function(time){
//                            expect(time.getText()).toBe('0:12');
//                        });
//                        driver.switchTo().defaultContent();
//                        ptor.findElement(protractor.By.tagName('iframe')).then(function(player){
//                            expect(player.getAttribute('src')).toContain('PlavjNH_RRU');
//                        })
//                    });
//
//            });
//        });
//        it('should display the correct titles on the first quiz chart in lecture quizzes', function(){
//            ptor.findElements(protractor.By.tagName('text')).then(function(titles){
//                expect(titles[15].getText()).toBe('First Quiz');
//                expect(titles[16].getText()).toBe('Incorrect');
//                expect(titles[17].getText()).toBe('Correct');
//                expect(titles[18].getText()).toBe('OK (Correct)');
//                expect(titles[19].getText()).toBe('Cancel (Incorrect)');
//                expect(titles[20].getText()).toBe('Other (Incorrect)');
//                expect(titles[26].getText()).toBe('Number of Students');
//            });
//        });
//        it('should display the bars on the first quiz chart in lecture quizzes and display their data when hovering on them', function(){
//            ptor.findElements(protractor.By.tagName('rect')).then(function(rects){
//                rects[33].click()
//                    .then(function(){
//                        ptor.findElements(protractor.By.tagName('text')).then(function(texts){
//                            expect(texts[27].getText()).toBe('OK (Correct)');
//                            expect(texts[28].getText()).toBe('Correct:');
//                            expect(texts[29].getText()).toBe('1');
//                        });
//                    });
//            });
//        });
//        it('should display correct titles on the chart for the second quiz in lecture quizzes', function(){
//            ptor.findElements(protractor.By.tagName('text')).then(function(titles){
//                expect(titles[30].getText()).toBe('New Quiz2');
//                expect(titles[31].getText()).toBe('Incorrect');
//                expect(titles[32].getText()).toBe('Correct');
//                expect(titles[33].getText()).toBe('First Answer (Correct)');
//                expect(titles[34].getText()).toBe('Second Answer (Incorrect)');
//                expect(titles[40].getText()).toBe('Number of Students');
//            })
//        });
//        it('should display the bar information when hovering on it for the second quiz in lecture quizzes', function(){
//            ptor.executeScript('window.scrollBy(0, 1000)', '');
//            ptor.findElements(protractor.By.tagName('rect')).then(function(rects){
//                rects[57].click()
//                    .then(function(){
//                        ptor.findElements(protractor.By.tagName('text')).then(function(texts){
//                            expect(texts[41].getText()).toBe('First Answer (Correct)');
//                            expect(texts[42].getText()).toBe('Correct:');
//                            expect(texts[43].getText()).toBe('1');
//                        });
//                    });
//                rects[60].click()
//                    .then(function(){
//                        ptor.findElements(protractor.By.tagName('text')).then(function(texts){
//                            expect(texts[41].getText()).toBe('Second Answer (Incorrect)');
//                            expect(texts[42].getText()).toBe('Incorrect:');
//                            expect(texts[43].getText()).toBe('1');
//                        });
//                    });
//            });
//        });
//        doRefresh(ptor);
//        it('should go to lecture statistics tab', function(){
//            ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div[2]/ul/li[2]/a')).then(function(tab){
//                tab.click();
//            });
//        });
//
//        it('should display the charts extended for all lectures in module', function(){
//            ptor.findElements(protractor.By.className('lecture_name')).then(function(lectures){
//                expect(lectures.length).toBe(2);
//                expect(lectures[0].getText()).toBe('New Lecture');
//                expect(lectures[1].getText()).toBe('New Lecture2');
//            });
//        });
//
//        it('should seek the video when an element on the chart is clicked', function(){
//            ptor.findElements(protractor.By.tagName('rect')).then(function(rects){
////                ptor.navigate().refresh();
////                ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div[2]/ul/li[2]/a')).then(function(tab){
////                    tab.click();
////                    ptor.sleep(7000);
////                });
//
//                rects[115].click()
//                    .then(function(){
//                        ptor.findElement(protractor.By.className('google-visualization-tooltip')).then(function(tooltip){
//                            tooltip.getText().then(function(value){
//                                var test = value;
//                                dummy = test;
//                                expect(test).toContain('why isn\'t it working?');
//                                expect(test).toContain(dummy.split('\n#')[0]);
//                            });
//                            ptor.sleep(5000);
//                        });
//                        ptor.findElement(protractor.By.tagName('iframe')).then(function(player){
//                            expect(player.getAttribute('src')).toContain('PlavjNH_RRU');
//                        })
//                        driver.switchTo().frame(1);
//                        driver.findElement(protractor.By.className("ytp-time-current")).then(function(time){
//                            expect(time.getText()).toBe(dummy.split('\n#')[0].replace('0:0', ''));
//                        });
//                        driver.switchTo().defaultContent();
//                    });
//            });
//            ptor.executeScript('window.scrollBy(0, -2000)', '');
//            ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/center/b')).click();
//            ptor.findElements(protractor.By.tagName('rect')).then(function(rects){
//                rects[114].click()
//                    .then(function(){
//                        ptor.findElement(protractor.By.className('google-visualization-tooltip')).then(function(tooltip){
//                            tooltip.getText().then(function(value){
//                                var test = value;
//                                dummy = test;
//                                expect(test).toContain('What is this?');
//                                expect(test).toContain(dummy.split('\n#')[0]);
//                            });
//                            ptor.sleep(5000);
//                        });
//                        ptor.findElement(protractor.By.tagName('iframe')).then(function(player){
//                            expect(player.getAttribute('src')).toContain('XtyzOo7nJrQ');
//                        })
////                        driver.switchTo().frame(1);
////                        driver.findElement(protractor.By.className("ytp-time-current")).then(function(time){
////                            expect(time.getText()).toBe(dummy.split('\n#')[0].replace('0:0', ''));
////                        });
////                        driver.switchTo().defaultContent();
//                    });
//            });
//        });
        //---------------------------------------------------------------------//
//        it('should go to a module and then go to the lecture progress tab', function(){
//            ptor.get('/#/courses/134/progress/modules/608').then(function(){
//                ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div[2]/ul/li[3]/a')).then(function(tab){
//                    tab.click();
//                });
//            });
//        });
//        describe('Lecture Progress', function(){
//            it('should display the chart title', function(){
//                ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div[2]/div/div[3]/tab3/h3')).then(function(title){
//                    expect(title.getText()).toBe('Lecture Progress Chart');
//                });
//            });
//            it('should display correct student names and emails', function(){
//                ptor.findElements(protractor.By.repeater('student in students')).then(function(names){
//                    expect(names[0].getText()).toBe('Bahia');
//                    ptor.actions().mouseMove(names[0]).perform();
//                    ptor.findElement(protractor.By.className('tooltip')).then(function(tooltip){
//                        expect(tooltip.getText()).toBe('bahia.sharkawy@gmail.com');
//                    });
//                    expect(names[1].getText()).toBe('Mahmoud Menshawi');
//                    ptor.actions().mouseMove(names[1]).perform().then(function(){
//                        ptor.sleep(500);
//                        ptor.findElement(protractor.By.className('tooltip')).then(function(tooltip){
//                            expect(tooltip.getText()).toBe('em_menshawi@hotmail.com');
//                        });
//                    });
//                });
//            });
//            it('should display lectures\' names in their correct order', function(){
//                ptor.findElements(protractor.By.repeater('name in columnNames')).then(function(modules){
//                    expect(modules.length).toBe(2);
//                    no_modules = modules.length;
//                    expect(modules[0].getText()).toBe('New Lecture');
//                    expect(modules[1].getText()).toBe('New Lecture2');
//                });
//            });
//            it('should display which modules were finished by each user correctly', function(){
//                ptor.findElements(protractor.By.repeater('student in students')).then(function(students){
//                    expect(students.length).toBe(2);
//                    no_students = students.length;
//                    ptor.findElements(protractor.By.className('marker')).then(function(markers){
//                        for(var s=0; s<no_students; s++){
//                            for(var m=0; m<no_modules; m++){
//                                p = (no_modules*s)+m;
//                                if(p==0){
//                                    expect(markers[p].getAttribute('src')).toContain('Not_Finished.png');
//                                }
//                                else if(p==1){
//                                    expect(markers[p].getAttribute('src')).toContain('Finished_on_Time.png');
//                                }
//                                else if(p==2){
//                                    expect(markers[p].getAttribute('src')).toContain('Finished_on_Time.png');
//                                }
//                                else if(p==3){
//                                    expect(markers[p].getAttribute('src')).toContain('Finished_on_Time.png');
//                                }
//                            }
//                        }
//                    });
//                });
//
//            });
//        });
//        it('should go to course editor', function(){
//            ptor.get('/#/courses/134/course_editor');
//        });
//        it('should open the first module', function(){
//            ptor.findElement(protractor.By.className('trigger')).then(function(module){
//                module.click();
//            });
//        });
//        it('should change the order of the lectures inside the module and go back to the progress page', function(){
//            ptor.findElements(protractor.By.className('handle')).then(function(handles){
//                browser.actions().dragAndDrop(handles[2], handles[1]).perform();
//            });
//        });
//        it('should go back to progress pages', function(){
//            ptor.get('/#/courses/134/progress/modules/608').then(function(){
//                ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div[2]/ul/li[3]/a')).then(function(tab){
//                    tab.click();
//                });
//            });
//        });
//        it('should display the chart title', function(){
//            ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div[2]/div/div[3]/tab3/h3')).then(function(title){
//                expect(title.getText()).toBe('Lecture Progress Chart');
//            });
//        });
//        it('should display correct student names and emails after sorting the lectures', function(){
//            ptor.findElements(protractor.By.repeater('student in students')).then(function(names){
//                expect(names[0].getText()).toBe('Bahia');
//                ptor.actions().mouseMove(names[0]).perform();
//                ptor.findElement(protractor.By.className('tooltip')).then(function(tooltip){
//                    expect(tooltip.getText()).toBe('bahia.sharkawy@gmail.com');
//                });
//                expect(names[1].getText()).toBe('Mahmoud Menshawi');
//                ptor.actions().mouseMove(names[1]).perform().then(function(){
//                    ptor.sleep(500);
//                    ptor.findElement(protractor.By.className('tooltip')).then(function(tooltip){
//                        expect(tooltip.getText()).toBe('em_menshawi@hotmail.com');
//                    });
//                });
//            });
//        });
//        it('should display lectures\' names in their correct order after sorting the lectures', function(){
//            ptor.findElements(protractor.By.repeater('name in columnNames')).then(function(modules){
//                expect(modules.length).toBe(2);
//                no_modules = modules.length;
//                expect(modules[0].getText()).toBe('New Lecture2');
//                expect(modules[1].getText()).toBe('New Lecture');
//            });
//        });
//        it('should display which modules were finished by each user correctly after sorting the lectures', function(){
//            ptor.findElements(protractor.By.repeater('student in students')).then(function(students){
//                expect(students.length).toBe(2);
//                no_students = students.length;
//                ptor.findElements(protractor.By.className('marker')).then(function(markers){
//                    for(var s=0; s<no_students; s++){
//                        for(var m=0; m<no_modules; m++){
//                            p = (no_modules*s)+m;
//                            if(p==0){
//                                expect(markers[p].getAttribute('src')).toContain('Finished_on_Time.png');
//                            }
//                            else if(p==1){
//                                expect(markers[p].getAttribute('src')).toContain('Not_Finished.png');
//                            }
//                            else if(p==2){
//                                expect(markers[p].getAttribute('src')).toContain('Finished_on_Time.png');
//                            }
//                            else if(p==3){
//                                expect(markers[p].getAttribute('src')).toContain('Finished_on_Time.png');
//                            }
//                        }
//                    }
//                });
//            });
//        });
//        it('should go to course editor', function(){
//            ptor.get('/#/courses/134/course_editor');
//        });
//        it('should open the first module', function(){
//            ptor.findElement(protractor.By.className('trigger')).then(function(module){
//                module.click();
//            });
//        });
//        it('should change the order of the lectures inside the module and go back to the progress page', function(){
//            ptor.findElements(protractor.By.className('handle')).then(function(handles){
//                browser.actions().dragAndDrop(handles[2], handles[1]).perform();
//            });
//        });
//        it('should go back to progress pages', function(){
//            ptor.get('/#/courses/134/progress/modules/608').then(function(){
//                ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div[2]/ul/li[4]/a')).then(function(tab){
//                    tab.click();
//                });
//            });
//        });
//
//
//        //test the quizzes Progress tab
//        describe('Quizzes Progress', function(){
//
//            it('should display the chart title', function(){
//                ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div[2]/div/div[4]/tab4/h3')).then(function(title){
//                    expect(title.getText()).toBe('Quiz Progress Chart');
//                });
//            });
//            it('should display correct student names and emails', function(){
//                ptor.findElements(protractor.By.repeater('student in students')).then(function(names){
//                    expect(names[0].getText()).toBe('Bahia');
//                    ptor.actions().mouseMove(names[0]).perform();
//                    ptor.findElement(protractor.By.className('tooltip')).then(function(tooltip){
//                        expect(tooltip.getText()).toBe('bahia.sharkawy@gmail.com');
//                    });
//                    expect(names[1].getText()).toBe('Mahmoud Menshawi');
//                    ptor.actions().mouseMove(names[1]).perform().then(function(){
//                        ptor.sleep(500);
//                        ptor.findElement(protractor.By.className('tooltip')).then(function(tooltip){
//                            expect(tooltip.getText()).toBe('em_menshawi@hotmail.com');
//                        });
//                    });
//                });
//            });
//            it('should display quizzes\' names in their correct order', function(){
//                ptor.findElements(protractor.By.repeater('name in columnNames')).then(function(modules){
//                    expect(modules.length).toBe(2);
//                    no_modules = modules.length;
//                    expect(modules[0].getText()).toBe('New Quiz');
//                    expect(modules[1].getText()).toBe('New Quiz2');
//                });
//            });
//            it('should display which quizzes were finished by each user correctly', function(){
//                ptor.findElements(protractor.By.repeater('student in students')).then(function(students){
//                    expect(students.length).toBe(2);
//                    no_students = students.length;
//                    ptor.findElements(protractor.By.className('marker')).then(function(markers){
//                        for(var s=0; s<no_students; s++){
//                            for(var m=0; m<no_modules; m++){
//                                p = (no_modules*s)+m;
//                                if(p==0){
//                                    expect(markers[p].getAttribute('src')).toContain('Not_Finished.png');
//                                }
//                                else if(p==1){
//                                    expect(markers[p].getAttribute('src')).toContain('Finished_on_Time.png');
//                                }
//                                else if(p==2){
//                                    expect(markers[p].getAttribute('src')).toContain('Finished_on_Time.png');
//                                }
//                                else if(p==3){
//                                    expect(markers[p].getAttribute('src')).toContain('Not_Finished.png');
//                                }
//                            }
//                        }
//                    });
//                });
//
//            });
//        });
//        it('should go to course editor', function(){
//            ptor.get('/#/courses/134/course_editor');
//        });
//        it('should open the first module', function(){
//            ptor.findElement(protractor.By.className('trigger')).then(function(module){
//                module.click();
//            });
//        });
//        it('should change the order of the quizzes inside the module and go back to the progress page', function(){
//            ptor.findElements(protractor.By.className('handle')).then(function(handles){
//                browser.actions().dragAndDrop(handles[4], handles[3]).perform();
//            });
//        });
//        it('should go back to progress pages', function(){
//            ptor.get('/#/courses/134/progress/modules/608').then(function(){
//                ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div[2]/ul/li[4]/a')).then(function(tab){
//                    tab.click();
//                });
//            });
//        });
//        it('should display the chart title', function(){
//            ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div[2]/div/div[4]/tab4/h3')).then(function(title){
//                expect(title.getText()).toBe('Quiz Progress Chart');
//            });
//        });
//        it('should display correct student names and emails after sorting the quizzes', function(){
//            ptor.findElements(protractor.By.repeater('student in students')).then(function(names){
//                expect(names[0].getText()).toBe('Bahia');
//                ptor.actions().mouseMove(names[0]).perform();
//                ptor.findElement(protractor.By.className('tooltip')).then(function(tooltip){
//                    expect(tooltip.getText()).toBe('bahia.sharkawy@gmail.com');
//                });
//                expect(names[1].getText()).toBe('Mahmoud Menshawi');
//                ptor.actions().mouseMove(names[1]).perform().then(function(){
//                    ptor.sleep(500);
//                    ptor.findElement(protractor.By.className('tooltip')).then(function(tooltip){
//                        expect(tooltip.getText()).toBe('em_menshawi@hotmail.com');
//                    });
//                });
//            });
//        });
//        it('should display quizzes\' names in their correct order after sorting them', function(){
//            ptor.findElements(protractor.By.repeater('name in columnNames')).then(function(modules){
//                expect(modules.length).toBe(2);
//                no_modules = modules.length;
//                expect(modules[0].getText()).toBe('New Quiz2');
//                expect(modules[1].getText()).toBe('New Quiz');
//            });
//        });
//        it('should display which quizzes were finished by each user correctly after sorting them', function(){
//            ptor.findElements(protractor.By.repeater('student in students')).then(function(students){
//                expect(students.length).toBe(2);
//                no_students = students.length;
//                ptor.findElements(protractor.By.className('marker')).then(function(markers){
//                    for(var s=0; s<no_students; s++){
//                        for(var m=0; m<no_modules; m++){
//                            p = (no_modules*s)+m;
//                            if(p==0){
//                                expect(markers[p].getAttribute('src')).toContain('Finished_on_Time.png');
//                            }
//                            else if(p==1){
//                                expect(markers[p].getAttribute('src')).toContain('Not_Finished.png');
//                            }
//                            else if(p==2){
//                                expect(markers[p].getAttribute('src')).toContain('Not_Finished.png');
//                            }
//                            else if(p==3){
//                                expect(markers[p].getAttribute('src')).toContain('Finished_on_Time.png');
//                            }
//                        }
//                    }
//                });
//            });
//        });
//        it('should go to course editor', function(){
//            ptor.get('/#/courses/134/course_editor');
//        });
//        it('should open the first module', function(){
//            ptor.findElement(protractor.By.className('trigger')).then(function(module){
//                module.click();
//            });
//        });
//        it('should change the order of the quizzes inside the module', function(){
//            ptor.findElements(protractor.By.className('handle')).then(function(handles){
//                browser.actions().dragAndDrop(handles[4], handles[3]).perform();
//            });
//        });
//        it('should go back to progress pages', function(){
//            ptor.get('/#/courses/134/progress/modules/608');
//        })
//        it('should go to the Surveys tab', function(){
//            ptor.executeScript('window.scrollBy(0, -2000)', '');
//            ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div[2]/ul/li[5]/a')).then(function(tab){
//                tab.click();
//            });
//        });
//        it('should display the survey charts with thier data', function(){
//            ptor.sleep(1500);
//                ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div[2]/div/div[5]/tab5/div/center/b')).then(function(survey_name){
//                    expect(survey_name.getText()).toBe('New Survey');
//                });
//                ptor.findElements(protractor.By.tagName('text')).then(function(texts){
//                    expect(texts[texts.length-20].getText()).toBe('First Question');
//                    expect(texts[texts.length-19].getText()).toBe('Answered');
//                    expect(texts[texts.length-18].getText()).toBe('first answer');
//                    expect(texts[texts.length-17].getText()).toBe('second answer');
//                    expect(texts[texts.length-11].getText()).toBe('Number of Students');
//                    expect(texts[texts.length-10].getText()).toBe('Second Question');
//                    expect(texts[texts.length-9].getText()).toBe('Answered');
//                    expect(texts[texts.length-8].getText()).toBe('first answer');
//                    expect(texts[texts.length-7].getText()).toBe('second answer');
//                    expect(texts[texts.length-1].getText()).toBe('Number of Students');
//                });
//                ptor.findElements(protractor.By.tagName('rect')).then(function(rects){
//                    ptor.executeScript('window.scrollBy(0, 500)', '');
//                    rects[rects.length-17].click()
//                        .then(function(){
////                            ptor.sleep(20000);
//                            ptor.findElements(protractor.By.tagName('text')).then(function(texts){
//                                texts.forEach(function(text, i){
//                                    text.getText().then(function(value){
//                                        console.log(value);
//                                    })
//                                })
//                                expect(texts[texts.length-13].getText()).toBe('first answer');
//                                expect(texts[texts.length-12].getText()).toBe('Answered:');
//                                expect(texts[texts.length-11].getText()).toBe('1');
//                            });
//                        });
//                    rects[rects.length-2].click()
//                        .then(function(){
//                            ptor.findElements(protractor.By.tagName('text')).then(function(texts){
//                                expect(texts[texts.length-3].getText()).toBe('second answer');
//                                expect(texts[texts.length-2].getText()).toBe('Answered:');
//                                expect(texts[texts.length-1].getText()).toBe('1');
//                            });
//                        });
//                });
//        });
//        doRefresh(ptor);
//        it('should go to the Quizzes tab', function(){
//            ptor.executeScript('window.scrollBy(0, -2000)', '');
//            ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div[2]/ul/li[6]/a')).then(function(tab){
//                tab.click();
//                ptor.sleep(2000);
//            });
//        });
//        it('should display the two quizzes charts with thier data', function(){
//            ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div[2]/div/div[6]/tab6/select')).then(function(dropdown){
//                ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div[2]/div/div[6]/tab6/div/center/b')).then(function(quiz_name){
//                    expect(quiz_name.getText()).toBe('New Quiz');
//                });
//                ptor.findElements(protractor.By.tagName('text')).then(function(texts){
////                    texts.forEach(function(text, i){
////                        text.getText().then(function(value){
////                            console.log(value+' + '+i);
////                        });
////                    });
//                    expect(texts[texts.length-12].getText()).toBe('First Question');
//                    expect(texts[texts.length-11].getText()).toBe('Incorrect');
//                    expect(texts[texts.length-10].getText()).toBe('Correct');
//                    expect(texts[texts.length-9].getText()).toBe('First Answer (Correct)');
//                    expect(texts[texts.length-8].getText()).toBe('Second Answer (Incorrect)');
//                    expect(texts[texts.length-7].getText()).toBe('Third Answer (Incorrect)');
//                    expect(texts[texts.length-1].getText()).toBe('Number of Students');
//                });
//                ptor.findElements(protractor.By.tagName('rect')).then(function(rects){
//                    rects[rects.length-7].click()
//                        .then(function(){
//                            ptor.findElements(protractor.By.tagName('text')).then(function(texts){
//                                expect(texts[texts.length-3].getText()).toBe('First Answer (Correct)');
//                                expect(texts[texts.length-2].getText()).toBe('Correct:');
//                                expect(texts[texts.length-1].getText()).toBe('1');
//                            });
//                        });
//                });
//                dropdown.click().then(function(){
//                    ptor.findElements(protractor.By.tagName('option')).then(function(options){
//                        options[2].click();
//                    });
//                    ptor.sleep(2000);
//                });
//                ptor.findElements(protractor.By.tagName('text')).then(function(texts){
////                    texts.forEach(function(text, i){
////                        text.getText().then(function(value){
////                            console.log(value+' + '+i);
////                        });
////                    });
//                    expect(texts[texts.length-11].getText()).toBe('First Question');
//                    expect(texts[texts.length-10].getText()).toBe('Incorrect');
//                    expect(texts[texts.length-9].getText()).toBe('Correct');
//                    expect(texts[texts.length-8].getText()).toBe('Should be correct (Correct)');
//                    expect(texts[texts.length-7].getText()).toBe('should be false (Incorrect)');
//                    expect(texts[texts.length-1].getText()).toBe('Number of Students');
//                });
//                ptor.findElements(protractor.By.tagName('rect')).then(function(rects){
//                    rects[rects.length-2].click()
//                        .then(function(){
//                            ptor.findElements(protractor.By.tagName('text')).then(function(texts){
//                                expect(texts[texts.length-3].getText()).toBe('should be false (Incorrect)');
//                                expect(texts[texts.length-2].getText()).toBe('Incorrect:');
//                                expect(texts[texts.length-1].getText()).toBe('1');
//                            });
//                        });
//                });
//            });
//        });
//    });



});
//
function doRefresh(ptor){
    it('should refresh the page', function(){
        ptor.navigate().refresh();
    });
}

function feedback(ptor, message){
    ptor.sleep(2000);
    ptor.findElement(protractor.By.className('errorMessage')).then(function(error){
        expect(error.getText()).toBe(message);
    });
}

function openMCQ(ptor){
    it('should reopen the quiz', function(){
        ptor.findElement(protractor.By.tagName('editable_text')).then(function(quiz_name){
            quiz_name.click();
        });
    });
}

function openOCQ(ptor){
    it('should reopen the quiz', function(){
        ptor.findElement(protractor.By.tagName('editable_text')).then(function(quiz_name){
            quiz_name.click();
        });
    });
}

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

