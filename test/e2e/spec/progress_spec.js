var current_date = new Date();
var no_students, no_modules, percentage;

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
        driver.get("http://10.0.0.16:9000/#/login");
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
        driver.get("http://10.0.0.16:4000/");
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
    var findById = function(id){
        return driver.findElement(protractor.By.id(id))
    };
    describe('Teacher', function(){
        login(ptor, driver, 'admin@scalear.com', 'password', 'Administrator', findByName);
        it('should go to the main progress page for a course', function(){
            ptor.get('/#/courses/134/progress/main');
        });
    });
    describe('Module Progress', function(){
        it('should display two tabs', function(){
            ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div/ul/li[1]')).then(function(first_tab){
                expect(first_tab.getAttribute('class')).toContain('active');
                expect(first_tab.getText()).toBe('Module Progress');
            });
            ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div/ul/li[2]')).then(function(second_tab){
                expect(second_tab.getText()).toBe('Module Chart');
            });
        });
        it('should display the chart title', function(){
            ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div/div/div[1]/h3')).then(function(title){
                expect(title.getText()).toBe('Module Progress Chart');
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
                    ptor.sleep(500);
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
            ptor.get('/#/courses/134/course_editor');
        });
        it('should change the order of the modules and go back to the progress page', function(){
            ptor.findElements(protractor.By.className('handle')).then(function(handles){
                browser.actions().dragAndDrop(handles[5], handles[0]).perform();
            });
        });
        it('should go back to progress pages', function(){
            ptor.get('/#/courses/134/progress/main');
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
                                expect(markers[p].getAttribute('src')).toContain('Not_Finished.png.png');
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
            ptor.get('/#/courses/134/course_editor');
        });
        it('should change the order of the modules and go back to the progress page', function(){
            ptor.findElements(protractor.By.className('handle')).then(function(handles){
                browser.actions().dragAndDrop(handles[4], handles[0]).perform();
            });
        });
        it('should go back to progress pages', function(){
            ptor.get('/#/courses/134/progress/main');
        });
        it('should navigate to the Module Chart tab', function(){
            ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div/ul/li[2]')).then(function(second_tab){
                second_tab.click();
            });
        });
    });
    describe('Module Chart', function(){
        it('should display correct titles on the chart', function(){
            ptor.sleep(1000);
            ptor.findElements(protractor.By.tagName('text')).then(function(titles){
                expect(titles[0].getText()).toBe('Quiz');
                expect(titles[1].getText()).toBe('Lecture');
                expect(titles[2].getText()).toBe('Bahia');
                expect(titles[3].getText()).toBe('Mahmoud Mensha...');
                expect(titles[4].getText()).toBe('Statistics');
            });
        });
        it('should display correct progress bar for each student', function(){
            ptor.findElements(protractor.By.tagName('rect')).then(function(bars){
                percentage = new Array();
                bars[13].getAttribute('width').then(function(value){
                    expect(value).toBe('300');
                    percentage[0] = (value/600)*100;
                    expect(percentage[0]).toBe(50);
                });
                bars[14].getAttribute('width').then(function(value){
                    expect(value).toBe('600');
                    percentage[1] = (value/600)*100;
                    expect(percentage[1]).toBe(100);
                });
                bars[15].getAttribute('width').then(function(value){
                    expect(value).toBe('0');
                    percentage[2] = (value/600)*100;
                    expect(percentage[2]).toBe(0);
                });
                bars[16].getAttribute('width').then(function(value){
                    expect(value).toBe('600');
                    percentage[3] = (value/600)*100;
                    expect(percentage[3]).toBe(100);
                });
            });
        });
//        it('should show the popover with student name and percentage when hovering on each bar', function(){
//            ptor.findElements(protractor.By.tagName('//*[@id="details"]/ui-view/div/div/div[2]/div/div[1]/div/svg/g[2]/g[3]/g[2]/text')).then(function(name){
//                ptor.actions().mouseMove(name).perform().then(function(){
//                    ptor.sleep(10000);
//                })
//            })
//            ptor.findElements(protractor.By.tagName('rect')).then(function(bars){
//                ptor.actions().mouseMove(bars[13]).perform().then(function(){
////                    ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div/div/div[2]/div/div[1]/div/svg/g[2]/g[1]/g[2]/g[1]/rect[1]')).then(function(bar){
////                        ptor.actions().mouseMove(bar).perform().then(function(){
//                            ptor.sleep(10000);
//                            ptor.findElements(protractor.By.tagName('text')).then(function(text){
//                                text.forEach(function(t, i){
//                                    t.getText().then(function(value){
//                                        console.log(value+' + '+i);
//                                    });
//                                });
//                            })
////                        });
////                    });
//                });
//
//
//            });
//        });
    });
    describe('Modules Progress', function(){
        it('should go to a module and then go to the lecture progress tab', function(){
            ptor.get('/#/courses/134/progress/modules/608').then(function(){
                ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div[2]/ul/li[3]')).then(function(tab){
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
            ptor.get('/#/courses/134/course_editor');
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
            ptor.get('/#/courses/134/progress/modules/608').then(function(){
                ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div[2]/ul/li[3]')).then(function(tab){
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
            ptor.get('/#/courses/134/course_editor');
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
            ptor.get('/#/courses/134/progress/modules/608').then(function(){
                ptor.findElement(protractor.By.xpath('//*[@id="details"]/ui-view/div[2]/ul/li[3]')).then(function(tab){
                    tab.click();
                });
            });
        });
    });



});

function doRefresh(ptor){
    it('should refresh the page', function(){
        ptor.navigate().refresh();
    });
}