var util = require('util');

var current_date = new Date();

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
var tomorrow_keys = formatDate(getNextDay(new Date()), 0);
var next_day_week_keys = formatDate(getNextWeek(getNextDay(new Date())), 0);

var today = formatDate(new Date(), 1);
var tomorrow = formatDate(getNextDay(new Date()), 1);
var next_day_week = formatDate(getNextWeek(getNextDay(new Date())), 1);
var next_week = formatDate(getNextWeek(new Date()), 1);

describe("Course Editor",function(){
    var ptor = protractor.getInstance();
    var driver = ptor.driver;

    var findByName = function(name){
        return driver.findElement(protractor.By.name(name));
    };
    var findById = function(id){
        return driver.findElement(protractor.By.id(id))
    };

    it('should login', function(){
        driver.get("http://10.0.0.16:9000/#/login");
        ptor.findElement(protractor.By.className('btn')).then(function(login_button){
            login_button.click();
        });
        findByName("user[email]").sendKeys("admin@scalear.com");
        findByName("user[password]").sendKeys("password");
        findByName("commit").click();
        ptor.findElements(protractor.By.tagName('a')).then(function(tags){
            expect(tags[3].getText()).toContain('You are signed in as');

        });
//        driver.get("http://10.0.0.16/#/login")
    });


    describe("Modules Section (Left)", function(){
        it('should allow creating a module', function(){
            ptor = protractor.getInstance();
            ptor.get('/#/courses/3/course_editor');
            var test;
            ptor.findElements(protractor.By.className('trigger')).then(function(modules){
                test = modules.length;
                ptor.findElement(protractor.By.className('adding_module')).then(function(add_module){
                    add_module.click();
                });
                ptor.findElements(protractor.By.className('trigger')).then(function(modules){
                    expect(modules.length).toBe(test+1);
                });
                ptor.findElements(protractor.By.className('trigger')).then(function(modules){
                    modules[modules.length-1].click();
                });
            });
        });
    });
    describe("Right Section", function(){

        it('should display the module name and allow editing it', function(){
            ptor.findElements(protractor.By.className('editable-click')).then(function(name){
                expect(name[0].getText()).toBe('New Module');
                name[0].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(nameField){
                    nameField.clear();
                    nameField.sendKeys('module name');
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                    buttons[0].click();
                });
                expect(name[0].getText()).toBe('module name');
                //old test cases
                name[0].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(nameField){
                    nameField.clear();
                    nameField.sendKeys('2');
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                    buttons[1].click();
                });
                expect(name[0].getText()).toBe('module name');
                name[0].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(nameField){
                    nameField.clear();
                    nameField.sendKeys('2');
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                    buttons[0].click();
                });
                expect(name[0].getText()).toBe('2');
            });
        });
        it('should display module\'s appearance date and allow editing it', function(){
            //----------------------//
            //edit appearance date//
            ptor.findElements(protractor.By.className('editable-click')).then(function(details){
                expect(details[1].getText()).toBe(today);
                details[1].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys(tomorrow_keys);
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                    buttons[buttons.length-2].click();
                });
                expect(details[1].getText()).toBe(tomorrow);
                details[1].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys(today_keys);
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                    buttons[buttons.length-1].click();
                });
                expect(details[1].getText()).toBe(tomorrow);
            });
        });

        it('should display module\'s due date and allow editing it', function(){
            ptor.findElements(protractor.By.className('editable-click')).then(function(details){
                expect(details[2].getText()).toBe(next_week);
                details[2].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys(next_day_week_keys);
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                    buttons[buttons.length-2].click();
                });
                expect(details[2].getText()).toBe(next_day_week);
                details[2].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys(tomorrow_keys);
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                    buttons[buttons.length-1].click();
                });
                expect(details[2].getText()).toBe(next_day_week);
            });
        });

        it('should display module description and allow editing it',function(){
            ptor.findElements(protractor.By.className('editable-click')).then(function(description){
                expect(description[description.length-1].getText()).toBe("Empty");
                description[description.length-1].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(descriptionTextBox){
                    descriptionTextBox.sendKeys("dummy description");
                    ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                        buttons[0].click();
                    });
                });
                ptor.sleep(2000);
                expect(description[description.length-1].getText()).toBe("dummy description");
                //old test cases
                description[description.length-1].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(descriptionTextBox){
                    descriptionTextBox.clear();
                    descriptionTextBox.sendKeys(' ');
                    ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                        buttons[0].click();
                    });
                });
                ptor.sleep(2000);
                expect(description[description.length-1].getText()).toBe('Empty');
                description[description.length-1].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(descriptionTextBox){
                    descriptionTextBox.sendKeys('dummy description');
                    ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                        buttons[1].click();
                    });
                });
                expect(description[description.length-1].getText()).toBe('Empty');
            });
        });
        //refresh and see if the data remains the same//
        it('should refresh the page', function(){
            ptor.navigate().refresh();
            ptor.sleep(2000);
        });
        it('should make sure the details are correct after refreshing page', function(){
            ptor.findElements(protractor.By.className('editable-click')).then(function(details){
                expect(details[0].getText()).toBe('2')
                expect(details[1].getText()).toBe(tomorrow)
                expect(details[2].getText()).toBe(next_day_week)
                expect(details[3].getText()).toBe('Empty')
            });
        });
    });
    describe("Left Section", function(){
        it('should open the module', function(){
            ptor.findElements(protractor.By.className('trigger')).then(function(modules){
                modules[modules.length-1].click();
            });
        });
        it('should add a new lecture', function(){
            ptor.findElements(protractor.By.className('btn-mini')).then(function(buttons){
                buttons[buttons.length-3].click();
            });
            ptor.findElements(protractor.By.className('trigger2')).then(function(quiz){
                expect(quiz[quiz.length-1].getText()).toBe('New Lecture');
            })
        });
        it('should open a lecture', function(){
            ptor.findElements(protractor.By.className('trigger2')).then(function(quizes){
                quizes[quizes.length-1].click();
            });
        });
    });

    describe('Right Section', function(){

        it('should display the Details section',function(){
            ptor.findElements(protractor.By.tagName('h3')).
                then(function(tag){
                    expect(tag[1].getText()).toBe('Details');
                });
        });

        it('should display lecture name and allow editing it',function(){
            //edit it
            ptor.findElement(protractor.By.binding('{{lecture.name}}')).then(function(elem){
                elem.isDisplayed().then(function(disp){
                    expect(disp).toEqual(true)
                })
                expect(elem.getText()).toBe("New Lecture");
            });

            ptor.findElement(protractor.By.className('editable-click')).then(function(name){
                expect(name.getText()).toBe('New Lecture');
                name.click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(nameTextBox){
                    nameTextBox.clear();
                    ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                        buttons[2].click();
                    });
                });

                expect(name.getText()).toBe('New Lecture');
                name.click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(nameTextBox){
                    nameTextBox.clear();
                    nameTextBox.sendKeys('My Lecture');
                    // ptor.sleep(10000);
                    ptor.findElements(protractor.By.tagName('button')).then(function(button){
                        expect(button[1].getAttribute('type')).toBe('submit');
                        button[1].click();

                    });
                });

                expect(name.getText()).toBe('My Lecture');
            });
        });

        it('should display lecture video url and allow editing it',function(){
//            ptor.findElement(protractor.By.tagName('iframe')).then(function(elem){
//                elem.isDisplayed().then(function(disp){
//                    expect(disp).toEqual(true)
//                })
//                expect(elem.getAttribute('src')).toContain("none");
//            });

            ptor.findElements(protractor.By.className('editable-click')).then(function(editable_click){
                expect(editable_click[1].getText()).toBe('none');
                editable_click[1].click();
                //find the textfield and edit it
                ptor.findElement(protractor.By.className('editable-input')).then(function(urlField){
                    urlField.clear();
                    urlField.sendKeys('http://www.youtube.com/watch?v=jgoGBxlVslI');
                });
                //click the confirm button
                ptor.findElements(protractor.By.tagName('button')).then(function(button){
                    button[1].click();
                });
                //wait for video to load
                ptor.sleep(5000);
                //check video, thumbnail, author, duration, title, and aspect ratio
                ptor.findElement(protractor.By.tagName('iframe')).then(function(elem){
                    elem.isDisplayed().then(function(disp){
                        expect(disp).toEqual(true)
                    });
                    expect(elem.getAttribute('src')).toContain("jgoGBxlVslI");
                });
                ptor.findElement(protractor.By.className('bigimg')).then(function(thumbnail){
                    expect(thumbnail.getAttribute('src')).toContain('jgoGBxlVslI');
                });
                expect(editable_click[2].getText()).toBe('smallscreen');
                ptor.findElement(protractor.By.binding('{{video.author}}')).then(function(author){
                    expect(author.getText()).toBe('saasbook');
                });
                ptor.findElement(protractor.By.binding('lecture.duration')).then(function(duration){
                    expect(duration.getText()).toBe('492 Seconds');
                });
                ptor.findElement(protractor.By.binding('{{video.title}}')).then(function(elem){
                    expect(elem.getText()).toBe("CS169 v13 w5l2s9");
                });
                //check if the new url is correct
                expect(editable_click[1].getText()).toBe('http://www.youtube.com/watch?v=jgoGBxlVslI');

                //click to edit again
                editable_click[1].click();
                //find the textfield and edit it
                ptor.findElement(protractor.By.className('editable-input')).then(function(urlField){
                    urlField.clear();
                    urlField.sendKeys('http://www.youtube.com/watch?v=PlavjNH_RRU');
                });
                //don't confirm the change
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                    buttons[2].click();
                });
                expect(editable_click[1].getText()).toBe('http://www.youtube.com/watch?v=jgoGBxlVslI');
                editable_click[1].click();
                //find the textfield and edit it
                ptor.findElement(protractor.By.className('editable-input')).then(function(urlField){
                    urlField.clear();
                    urlField.sendKeys('http://www.youtube.com/watch?v=PlavjNH_RRU');
                });
                //confirm the change
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                    buttons[1].click();
                });
                ptor.sleep(5000);
                //check video, thumbnail, author, duration, title, and aspect ratio
                ptor.findElement(protractor.By.tagName('iframe')).then(function(elem){
                    elem.isDisplayed().then(function(disp){
                        expect(disp).toEqual(true)
                    });
                    expect(elem.getAttribute('src')).toContain("PlavjNH_RRU");
                });
                ptor.findElement(protractor.By.className('bigimg')).then(function(thumbnail){
                    expect(thumbnail.getAttribute('src')).toContain('PlavjNH_RRU');
                });
                expect(editable_click[2].getText()).toBe('widescreen');
                ptor.findElement(protractor.By.binding('{{video.author}}')).then(function(author){
                    expect(author.getText()).toBe('David B');
                });
                ptor.findElement(protractor.By.binding('lecture.duration')).then(function(duration){
                    expect(duration.getText()).toBe('322 Seconds');
                });
                ptor.findElement(protractor.By.binding('{{video.title}}')).then(function(elem){
                    expect(elem.getText()).toBe("L2.1-ISA Intro");
                });
                expect(editable_click[1].getText()).toBe('http://www.youtube.com/watch?v=PlavjNH_RRU')

            });
        });

        it('should display lecture video author',function(){
            ptor.findElement(protractor.By.binding('{{video.author}}')).then(function(elem){
                elem.isDisplayed().then(function(disp){
                    expect(disp).toEqual(true)
                })
                expect(elem.getText()).toBe("David B")
            });
        });

        it('should display lecture video aspect ratio and allow changing it',function(){
            ptor.findElements(protractor.By.className('editable-click')).then(function(elem){
                elem[2].isDisplayed().then(function(disp){
                    expect(disp).toEqual(true)
                });
                expect(elem[2].getText()).toBe("widescreen")
                elem[2].click();
                ptor.findElement(protractor.By.tagName('select')).then(function(dropDown){
                    dropDown.click();
                });
                ptor.findElements(protractor.By.tagName('option')).then(function(options){
                    options[1].click();
                });
                expect(elem[2].getText()).toBe("smallscreen");
                //wait for video to reload
                ptor.sleep(5000);
                ptor.findElement(protractor.By.className('videoborder')).then(function(video){
                    expect(video.getAttribute('class')).toContain('smallscreen');
                });

                elem[2].click();
                ptor.findElement(protractor.By.tagName('select')).then(function(dropDown){
                    dropDown.isDisplayed().then(function(disp){
                        expect(disp).toBe(true);
                    });
                    dropDown.click();
                });
                ptor.findElements(protractor.By.tagName('option')).then(function(options){
                    options[0].click();
                });
                expect(elem[2].getText()).toBe("widescreen");
                //wait for video to reload
                ptor.sleep(5000);
                ptor.findElement(protractor.By.className('videoborder')).then(function(video){
                    expect(video.getAttribute('class')).toContain('widescreen');
                });

            });
        });

        it('should display lecture duration',function(){
            ptor.findElement(protractor.By.binding('{{lecture.duration}}')).then(function(elem){
                elem.isDisplayed().then(function(disp){
                    expect(disp).toEqual(true)
                })
                expect(elem.getText()).toBe("322 Seconds")
            });
        });

        it('should display lecture title',function(){
            ptor.findElement(protractor.By.binding('{{video.title}}')).then(function(elem){
                elem.isDisplayed().then(function(disp){
                    expect(disp).toEqual(true)
                })
                expect(elem.getText()).toBe("L2.1-ISA Intro");
            });
        });
        it('should display appearance date and allow editing it', function(){
            //use module's appearance date//
            ptor.findElements(protractor.By.className('editable-click')).then(function(details){
                expect(details[3].getText()).toBe('Using Module\'s Appearance Date');
                details[3].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.click();
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                    buttons[buttons.length-2].click();
                });
                expect(details[3].getText()).toBe('Not Using Module\'s Appearance Date');
                details[3].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.click();
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                    buttons[buttons.length-1].click();
                });
                expect(details[3].getText()).toBe('Not Using Module\'s Appearance Date');
                //------------------------------//
                //edit appearance date//
                expect(details[4].getText()).toBe(today);
                details[4].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys(tomorrow_keys);
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                    buttons[buttons.length-2].click();
                });
                expect(details[4].getText()).toBe(tomorrow);
                details[4].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys(today_keys);
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                    buttons[buttons.length-1].click();
                });
                expect(details[4].getText()).toBe(tomorrow);
            });

        });
//        it('should display due date and allow editing it', function(){
//            //use module's due date//
//            expect(details[5].getText()).toBe('Using Module\'s Due Date');
//            details[5].click();
//            ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                field.click();
//            });
//            ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                buttons[buttons.length-2].click();
//            });
//            expect(details[5].getText()).toBe('Not Using Module\'s Due Date');
//            details[5].click();
//            ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                field.click();
//            });
//            ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                buttons[buttons.length-1].click();
//            });
//            expect(details[5].getText()).toBe('Not Using Module\'s Due Date');
//            //------------------------------//
//            //edit due date//
//            expect(details[6].getText()).toBe(next_week);
//            details[6].click();
//            ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                field.clear();
//                field.sendKeys(next_day_week_keys);
//            });
//            ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                buttons[buttons.length-2].click();
//            });
//            expect(details[6].getText()).toBe(next_day_week);
//            details[6].click();
//            ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                field.clear();
//                field.sendKeys(tomorrow_keys);
//            });
//            ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                buttons[buttons.length-1].click();
//            });
//            expect(details[6].getText()).toBe(next_day_week);
//        });

        it('should display lecture slides and allows editing it',function(){
            ptor.findElements(protractor.By.className('editable-click')).then(function(slides){

                expect(slides[slides.length-2].getText()).toBe("none");
                slides[slides.length-2].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(slidesTextBox){
                    slidesTextBox.sendKeys("testLink");
                    ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                        buttons[2].click();
                    });
                });
                expect(slides[slides.length-2].getText()).toBe("none");
                slides[slides.length-2].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(slidesTextBox){
                    slidesTextBox.clear();
                    slidesTextBox.sendKeys("testLink");
                    ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                        buttons[1].click();
                    });
                });
                expect(slides[slides.length-2].getText()).toBe(" ");
                slides[slides.length-2].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(slidesTextBox){
                    slidesTextBox.clear();
                    slidesTextBox.sendKeys("http://www.it.uu.se/edu/course/homepage/darkdig/vt13/2-ISA%201.pdf");
                    ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                        buttons[1].click();
                    });
                });
                expect(slides[slides.length-2].getText()).toBe("http://www.it.uu.se/edu/course/homepage/darkdig/vt13/2-ISA%201.pdf");
            });
        });

        it('should display lecture description and allow editing it',function(){
            ptor.findElements(protractor.By.className('editable-click')).then(function(description){
                expect(description[description.length-1].getText()).toBe("Empty");
                description[description.length-1].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(descriptionTextBox){
                    descriptionTextBox.sendKeys("dummy description");
                    ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                        buttons[1].click();
                    });
                });
                ptor.sleep(2000);
                expect(description[description.length-1].getText()).toBe("dummy description");
                description[description.length-1].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(descriptionTextBox){
                    descriptionTextBox.clear();
                    descriptionTextBox.sendKeys(' ');
                    ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                        buttons[1].click();
                    });
                });
                ptor.sleep(2000);
                expect(description[description.length-1].getText()).toBe('Empty');
                description[description.length-1].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(descriptionTextBox){
                    descriptionTextBox.sendKeys('dummy description');
                    ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                        buttons[2].click();
                    });
                });
                expect(description[description.length-1].getText()).toBe('Empty');

            });
        });
    });









//    describe("Left Section", function(){
//        it('should add a new quiz', function(){
//            ptor.findElements(protractor.By.className('btn-mini')).then(function(buttons){
//                buttons[buttons.length-2].click();
//            });
//            ptor.findElements(protractor.By.className('trigger2')).then(function(quiz){
//                expect(quiz[quiz.length-1].getText()).toBe('New Quiz');
//            })
//        });
//        it('should open a quiz', function(){
//            ptor.findElements(protractor.By.className('trigger2')).then(function(quizes){
//                quizes[quizes.length-1].click();
//            });
//        });
//
//    });
//    describe("Right Section", function(){
//        it('should display quiz details and allow editing it', function(){
//            ptor.findElement(protractor.By.tagName('h3')).then(function(title){
//                expect(title.getText()).toBe('Details');
//            });
//            ptor.findElements(protractor.By.className('editable-click')).then(function(details){
//                //edit quiz name//
//                expect(details[0].getText()).toBe('New Quiz');
//                details[0].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.clear();
//                    field.sendKeys("My Quiz");
//                });
//                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                    buttons[buttons.length-2].click();
//                });
//                expect(details[0].getText()).toBe('My Quiz');
//                details[0].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.clear();
//                    field.sendKeys("New Quiz");
//                });
//                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                    buttons[buttons.length-1].click();
//                });
//                expect(details[0].getText()).toBe('My Quiz');
//                //quiz required or not//
//                expect(details[1].getText()).toBe('This Quiz is Not Required');
//                details[1].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.click();
//                });
//                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                    buttons[buttons.length-2].click();
//                });
//                expect(details[1].getText()).toBe('This Quiz is Required');
//                details[1].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.click();
//                });
//                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                    buttons[buttons.length-1].click();
//                });
//                expect(details[1].getText()).toBe('This Quiz is Required');
//                //edit quiz retries//
//                expect(details[2].getText()).toBe('0');
//                details[2].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.clear();
//                    field.sendKeys("10")
//                });
//                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                    buttons[buttons.length-2].click();
//                });
//                expect(details[2].getText()).toBe('10');
//                details[2].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.clear();
//                    field.sendKeys("0")
//                });
//                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                    buttons[buttons.length-1].click();
//                });
//                expect(details[2].getText()).toBe('10');
//                //use module's appearance date//
//                expect(details[3].getText()).toBe('Using Module\'s Appearance Date');
//                details[3].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.click();
//                });
//                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                    buttons[buttons.length-2].click();
//                });
//                expect(details[3].getText()).toBe('Not Using Module\'s Appearance Date');
//                details[3].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.click();
//                });
//                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                    buttons[buttons.length-1].click();
//                });
//                expect(details[3].getText()).toBe('Not Using Module\'s Appearance Date');
//                //------------------------------//
//                //edit appearance date//
//                expect(details[4].getText()).toBe(today);
//                details[4].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.clear();
//                    field.sendKeys(tomorrow_keys);
//                });
//                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                    buttons[buttons.length-2].click();
//                });
//                expect(details[4].getText()).toBe(tomorrow);
//                details[4].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.clear();
//                    field.sendKeys(today_keys);
//                });
//                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                    buttons[buttons.length-1].click();
//                });
//                expect(details[4].getText()).toBe(tomorrow);
//                //use module's due date//
//                expect(details[5].getText()).toBe('Using Module\'s Due Date');
//                details[5].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.click();
//                });
//                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                    buttons[buttons.length-2].click();
//                });
//                expect(details[5].getText()).toBe('Not Using Module\'s Due Date');
//                details[5].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.click();
//                });
//                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                    buttons[buttons.length-1].click();
//                });
//                expect(details[5].getText()).toBe('Not Using Module\'s Due Date');
//                //------------------------------//
//                //edit due date//
//                expect(details[6].getText()).toBe(next_week);
//                details[6].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.clear();
//                    field.sendKeys(next_day_week_keys);
//                });
//                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                    buttons[buttons.length-2].click();
//                });
//                expect(details[6].getText()).toBe(next_day_week);
//                details[6].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.clear();
//                    field.sendKeys(tomorrow_keys);
//                });
//                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                    buttons[buttons.length-1].click();
//                });
//                expect(details[6].getText()).toBe(next_day_week);
//                //edit instructions//
//                expect(details[7].getText()).toBe('Please choose the correct answer(s)');
//                details[7].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.clear();
//                    field.sendKeys("new instructions")
//                });
//                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                    buttons[buttons.length-2].click();
//                });
//                expect(details[7].getText()).toBe('new instructions');
//                details[7].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.clear();
//                    field.sendKeys("old instructions")
//                });
//                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                    buttons[buttons.length-1].click();
//                });
//                expect(details[7].getText()).toBe('new instructions');
//            });
//        });
//        //refresh and see if the data remains the same//
//        it('should refresh the page', function(){
////            ptor.reload();
//            ptor.navigate().refresh();
//        });
//        it('should make sure the details are correct after refreshing page', function(){
//            ptor.findElements(protractor.By.className('editable-click')).then(function(details){
//                expect(details[0].getText()).toBe('My Quiz')
//                expect(details[1].getText()).toBe('This Quiz is Required')
//                expect(details[2].getText()).toBe('10')
//                expect(details[3].getText()).toBe('Not Using Module\'s Appearance Date')
//                expect(details[4].getText()).toBe(tomorrow)
//                expect(details[5].getText()).toBe('Not Using Module\'s Due Date')
//                expect(details[6].getText()).toBe(next_day_week)
//                expect(details[7].getText()).toBe('new instructions')
//            });
//        });
//    });
//    describe('Middle Section', function(){
//        it('should allow adding questions to quiz', function(){
//            ptor.findElements(protractor.By.className('btn')).then(function(buttons){
//                buttons[buttons.length-2].click();
//                ptor.findElements(protractor.By.tagName('input')).then(function(fields){
//                    fields[fields.length-3].sendKeys('first MCQ question');
//                    fields[fields.length-2].sendKeys('first answer');
//                    fields[fields.length-1].click();
//                });
//                ptor.findElement(protractor.By.className('add_multiple_answer')).click();
//                ptor.findElements(protractor.By.name('answer')).then(function(fields){
//                    fields[fields.length-1].sendKeys('second answer');
//                });
//                ptor.findElement(protractor.By.className('add_multiple_answer')).click();
//                ptor.findElements(protractor.By.name('answer')).then(function(fields){
//                    fields[fields.length-1].sendKeys('third answer');
//                });
//
//
//                buttons[buttons.length-2].click();
//
//                ptor.findElements(protractor.By.tagName('input')).then(function(fields){
//                    fields[fields.length-3].sendKeys('first OCQ question');
//                    ptor.findElement(protractor.By.tagName('select')).then(function(question_type){
//                        question_type.click();
//                        ptor.findElements(protractor.By.tagName('option')).then(function(options){
//                            options[options.length-2].click();
//                        });
//                    });
//
//                });
//                ptor.findElements(protractor.By.tagName('input')).then(function(fields){
//                    fields[fields.length-2].sendKeys('first answer');
//                    fields[fields.length-1].click();
//                });
//                ptor.findElements(protractor.By.className('add_multiple_answer')).then(function(add_multiple){
//                    add_multiple[add_multiple.length-1].click();
//                });
//                ptor.findElements(protractor.By.name('answer')).then(function(fields){
//                    fields[fields.length-1].sendKeys('second answer');
//                });
//                ptor.findElements(protractor.By.className('add_multiple_answer')).then(function(add_multiple){
//                    add_multiple[add_multiple.length-1].click();
//                });                ptor.findElements(protractor.By.name('answer')).then(function(fields){
//                    fields[fields.length-1].sendKeys('third answer');
//                });
//
//                buttons[buttons.length-2].click();
//
//                ptor.findElements(protractor.By.tagName('input')).then(function(fields){
//                    fields[fields.length-3].sendKeys('first DRAG question');
//                    ptor.findElements(protractor.By.tagName('select')).then(function(question_type){
//                        question_type[question_type.length-1].click();
//                        ptor.findElements(protractor.By.tagName('option')).then(function(options){
//                            options[options.length-1].click();
//                        });
//                    });
//
//                });
//                ptor.findElements(protractor.By.name('answer')).then(function(fields){
//                    fields[fields.length-1].sendKeys('first answer');
//                });
//                ptor.findElements(protractor.By.className('add_multiple_answer')).then(function(add_multiple){
//                    add_multiple[add_multiple.length-1].click();
//                });
//                ptor.findElements(protractor.By.name('answer')).then(function(fields){
//                    fields[fields.length-1].sendKeys('second answer');
//                });
//                ptor.findElements(protractor.By.className('add_multiple_answer')).then(function(add_multiple){
//                    add_multiple[add_multiple.length-1].click();
//                });
//                ptor.findElements(protractor.By.name('answer')).then(function(fields){
//                    fields[fields.length-1].sendKeys('third answer');
//                });
//            });
//        });
//        it('should allow sorting DRAG question answers', function(){
//            ptor.findElements(protractor.By.className('ui-icon')).then(function(drag_handles){
//                ptor.actions().dragAndDrop(drag_handles[drag_handles.length-1], drag_handles[drag_handles.length-2]).perform();
//            });
//        });
//        ptor.sleep('1000');
//        it('should save the questions', function(){
//            ptor.findElements(protractor.By.className('btn')).then(function(buttons){
//                buttons[buttons.length-1].click();
//                ptor.sleep(1000);
//            });
//        });
//        //refresh and see if the data remains the same//
//        it('should refresh the page', function(){
//            ptor.navigate().refresh();
//        });
//        it('should display correct questions and answers', function(){
//            ptor.findElements(protractor.By.tagName('input')).then(function(questions){
//                expect(questions[0].getAttribute('value')).toBe('first MCQ question')
//                expect(questions[1].getAttribute('value')).toBe('first answer')
//                expect(questions[2].getAttribute('checked')).toBe('true')
//                expect(questions[3].getAttribute('value')).toBe('second answer')
//                expect(questions[4].getAttribute('checked')).toBe(null);
//                expect(questions[5].getAttribute('value')).toBe('third answer')
//                expect(questions[6].getAttribute('checked')).toBe(null);
//                expect(questions[7].getAttribute('value')).toBe('first OCQ question')
//                expect(questions[8].getAttribute('value')).toBe('first answer')
//                expect(questions[10].getAttribute('value')).toBe('second answer')
//                expect(questions[12].getAttribute('value')).toBe('third answer')
//                expect(questions[14].getAttribute('value')).toBe('first DRAG question')
//                expect(questions[15].getAttribute('value')).toBe('first answer')
//                expect(questions[16].getAttribute('value')).toBe('third answer')
//                expect(questions[17].getAttribute('value')).toBe('second answer')
//            });
//        });
//        //delete an answer from each question
//        it('should delete an answer from each question', function(){
//            ptor.findElements(protractor.By.className('real_delete_ans')).then(function(delete_buttons){
//                delete_buttons[0].click();
//                var alert_dialog = ptor.switchTo().alert();
//                alert_dialog.accept();
//            });
//            ptor.findElements(protractor.By.className('real_delete_ans')).then(function(delete_buttons){
//                delete_buttons[2].click();
//                var alert_dialog = ptor.switchTo().alert();
//                alert_dialog.accept();
//            });
//            ptor.findElements(protractor.By.className('delete_drag')).then(function(delete_buttons){
//                delete_buttons[0].click();
//                var alert_dialog = ptor.switchTo().alert();
//                alert_dialog.accept();
//            });
//        });
//        it('should try to save the questions after deleting answers but it should fail', function(){
//            ptor.findElements(protractor.By.className('btn')).then(function(buttons){
//                buttons[buttons.length-1].click();
//                ptor.sleep(1000);
//            });
//            var error = ptor.findElement(protractor.By.className('alert-error'));
//            expect(error.getText()).toContain('You\'ve got some errors.');
//        });
//        it('should select one correct answer for each question', function(){
//            ptor.executeScript('window.scrollBy(0, -200)', '');
//            ptor.findElement(protractor.By.name('mcq')).then(function(checkbox){
//                checkbox.click();
//            });
//            ptor.findElements(protractor.By.tagName('input')).then(function(fields){
//                fields[7].click();
//            })
//        });
//        it('should try to save the questions after deleting answers and it should succeed', function(){
//            ptor.findElements(protractor.By.className('btn')).then(function(buttons){
//                buttons[buttons.length-1].click();
//                ptor.sleep(1000);
//            });
//            var error = ptor.findElements(protractor.By.className('alert-error'));
//            expect(error.length).toBe(undefined);
//        });
//        it('should refresh the page', function(){
//            ptor.navigate().refresh();
//        });
//        it('should display correct questions and answers', function(){
//            ptor.findElements(protractor.By.tagName('input')).then(function(questions){
//                expect(questions[0].getAttribute('value')).toBe('first MCQ question')
//                expect(questions[1].getAttribute('value')).toBe('second answer')
//                expect(questions[2].getAttribute('checked')).toBe('true')
//                expect(questions[3].getAttribute('value')).toBe('third answer')
//                expect(questions[4].getAttribute('checked')).toBe(null);
//                expect(questions[5].getAttribute('value')).toBe('first OCQ question')
//                expect(questions[6].getAttribute('value')).toBe('second answer')
//                expect(questions[8].getAttribute('value')).toBe('third answer')
//                expect(questions[10].getAttribute('value')).toBe('first DRAG question')
//                expect(questions[11].getAttribute('value')).toBe('third answer')
//                expect(questions[12].getAttribute('value')).toBe('second answer')
//            });
//        });
//        it('should delete each question', function(){
//            ptor.findElements(protractor.By.className('delete_option')).then(function(delete_questions){
//                expect(delete_questions.length).toBe(3);
//                delete_questions[0].click();
//                var alert_dialog = ptor.switchTo().alert();
//                alert_dialog.dismiss();
//                ptor.findElements(protractor.By.className('q_label')).then(function(labels){
//                    expect(labels.length).toBe(6);
//                });
//                delete_questions[0].click();
//                var alert_dialog = ptor.switchTo().alert();
//                alert_dialog.dismiss();
//            });
//            ptor.findElements(protractor.By.className('delete_option')).then(function(delete_questions){
//                expect(delete_questions.length).toBe(3);
//                delete_questions[0].click();
//                var alert_dialog = ptor.switchTo().alert();
//                alert_dialog.dismiss();
//                ptor.findElements(protractor.By.className('q_label')).then(function(labels){
//                    expect(labels.length).toBe(6);
//                });
//                delete_questions[0].click();
//                alert_dialog = ptor.switchTo().alert();
//                alert_dialog.accept();
//            });
//            ptor.findElements(protractor.By.className('delete_option')).then(function(delete_questions){
//                expect(delete_questions.length).toBe(2);
//                delete_questions[0].click();
//                var alert_dialog = ptor.switchTo().alert();
//                alert_dialog.accept();
//            });
//            ptor.findElements(protractor.By.className('delete_option')).then(function(delete_questions){
//                expect(delete_questions.length).toBe(1);
//                delete_questions[0].click();
//                var alert_dialog = ptor.switchTo().alert();
//                alert_dialog.accept();
//            });
//            ptor.findElements(protractor.By.className('btn')).then(function(buttons){
//                buttons[buttons.length-1].click();
//                ptor.sleep(1000);
//            });
//            ptor.findElements(protractor.By.className('btn')).then(function(buttons){
//                buttons[buttons.length-1].click();
//                ptor.sleep(1000);
//            });
//        });
//        it('should refresh the page', function(){
//            ptor.navigate().refresh();
//        });
//        it('should display 0 questions', function(){
//            ptor.findElements(protractor.By.tagName('label')).then(function(questions){
//                expect(questions.length).toBe(0);
//            });
//        });
//    });
//    describe('Left Section', function(){
//        it('should add a new survey', function(){
//            ptor.findElements(protractor.By.className('btn-mini')).then(function(buttons){
//                buttons[buttons.length-1].click();
//            });
//            ptor.findElements(protractor.By.className('trigger2')).then(function(quiz){
//                expect(quiz[quiz.length-1].getText()).toBe('New Survey');
//            })
//        });
//        it('should open a survey', function(){
//            ptor.findElements(protractor.By.className('trigger2')).then(function(quizes){
//                quizes[quizes.length-1].click();
//            });
//        });
//    });
//    describe('Right Section', function(){
//        it('should display survey details and allow editing it', function(){
//            ptor.findElement(protractor.By.tagName('h3')).then(function(title){
//                expect(title.getText()).toBe('Details');
//            });
//            ptor.findElements(protractor.By.className('editable-click')).then(function(details){
//                //edit quiz name//
//                expect(details[0].getText()).toBe('New Survey');
//                details[0].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.clear();
//                    field.sendKeys("My Survey");
//                });
//                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                    buttons[buttons.length-2].click();
//                });
//                expect(details[0].getText()).toBe('My Survey');
//                details[0].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.clear();
//                    field.sendKeys("New Survey");
//                });
//                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                    buttons[buttons.length-1].click();
//                });
//                expect(details[0].getText()).toBe('My Survey');
//                //use module's appearance date//
//                expect(details[1].getText()).toBe('Using Module\'s Appearance Date');
//                details[1].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.click();
//                });
//                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                    buttons[buttons.length-2].click();
//                });
//                expect(details[1].getText()).toBe('Not Using Module\'s Appearance Date');
//                details[1].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.click();
//                });
//                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                    buttons[buttons.length-1].click();
//                });
//                expect(details[1].getText()).toBe('Not Using Module\'s Appearance Date');
//                //----------------------//
//                //edit appearance date//
//                expect(details[2].getText()).toBe(today);
//                details[2].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.clear();
//                    field.sendKeys(tomorrow_keys);
//                });
//                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                    buttons[buttons.length-2].click();
//                });
//                expect(details[2].getText()).toBe(tomorrow);
//                details[2].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.clear();
//                    field.sendKeys(today_keys);
//                });
//                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                    buttons[buttons.length-1].click();
//                });
//                expect(details[2].getText()).toBe(tomorrow);
//                //use module's due date//
//                expect(details[3].getText()).toBe('Using Module\'s Due Date');
//                details[3].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.click();
//                });
//                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                    buttons[buttons.length-2].click();
//                });
//                expect(details[3].getText()).toBe('Not Using Module\'s Due Date');
//                details[3].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.click();
//                });
//                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                    buttons[buttons.length-1].click();
//                });
//                expect(details[3].getText()).toBe('Not Using Module\'s Due Date');
//                //----------------------//
//                //edit due date//
//                expect(details[4].getText()).toBe(next_week);
//                details[4].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.clear();
//                    field.sendKeys(next_day_week_keys);
//                });
//                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                    buttons[buttons.length-2].click();
//                });
//                expect(details[4].getText()).toBe(next_day_week);
//                details[4].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.clear();
//                    field.sendKeys(tomorrow_keys);
//                });
//                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                    buttons[buttons.length-1].click();
//                });
//                expect(details[4].getText()).toBe(next_day_week);
//                //edit instructions//
//                expect(details[5].getText()).toBe('Please fill in the survey.');
//                details[5].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.clear();
//                    field.sendKeys("new instructions")
//                });
//                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                    buttons[buttons.length-2].click();
//                });
//                expect(details[5].getText()).toBe('new instructions');
//                details[5].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.clear();
//                    field.sendKeys("old instructions")
//                });
//                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                    buttons[buttons.length-1].click();
//                });
//                expect(details[5].getText()).toBe('new instructions');
//            });
//        });
//        //refresh and see if the data remains the same//
//        it('should refresh the page', function(){
////            ptor.reload();
//            ptor.navigate().refresh();
//        });
//        it('should make sure the details are correct after refreshing page', function(){
//            ptor.findElements(protractor.By.className('editable-click')).then(function(details){
//                expect(details[0].getText()).toBe('My Survey')
//                expect(details[1].getText()).toBe('Not Using Module\'s Appearance Date')
//                expect(details[2].getText()).toBe(tomorrow)
//                expect(details[3].getText()).toBe('Not Using Module\'s Due Date')
//                expect(details[4].getText()).toBe(next_day_week)
//                expect(details[5].getText()).toBe('new instructions')
//            });
//        });
//    });
//    describe('Middle Section', function(){
//        it('should allow adding questions to survey', function(){
//            ptor.findElements(protractor.By.className('btn')).then(function(buttons){
//                buttons[buttons.length-2].click();
//                ptor.findElements(protractor.By.tagName('input')).then(function(fields){
//                    fields[fields.length-2].sendKeys('first MCQ question');
//                    fields[fields.length-1].sendKeys('first answer');
//                });
//                ptor.findElement(protractor.By.className('add_multiple_answer')).click();
//                ptor.findElements(protractor.By.name('answer')).then(function(fields){
//                    fields[fields.length-1].sendKeys('second answer');
//                });
//                ptor.findElement(protractor.By.className('add_multiple_answer')).click();
//                ptor.findElements(protractor.By.name('answer')).then(function(fields){
//                    fields[fields.length-1].sendKeys('third answer');
//                });
//
//
//                buttons[buttons.length-2].click();
//
//                ptor.findElements(protractor.By.tagName('input')).then(function(fields){
//                    fields[fields.length-2].sendKeys('first OCQ question');
//                    ptor.findElement(protractor.By.tagName('select')).then(function(question_type){
//                        question_type.click();
//                        ptor.findElements(protractor.By.tagName('option')).then(function(options){
//                            options[options.length-2].click();
//                        });
//                    });
//
//                });
//                ptor.findElements(protractor.By.tagName('input')).then(function(fields){
//                    fields[fields.length-1].sendKeys('first answer');
//                });
//                ptor.findElements(protractor.By.className('add_multiple_answer')).then(function(add_multiple){
//                    add_multiple[add_multiple.length-1].click();
//                });
//                ptor.findElements(protractor.By.name('answer')).then(function(fields){
//                    fields[fields.length-1].sendKeys('second answer');
//                });
//                ptor.findElements(protractor.By.className('add_multiple_answer')).then(function(add_multiple){
//                    add_multiple[add_multiple.length-1].click();
//                });                ptor.findElements(protractor.By.name('answer')).then(function(fields){
//                    fields[fields.length-1].sendKeys('third answer');
//                });
//
//                buttons[buttons.length-2].click();
//
//                ptor.findElements(protractor.By.tagName('input')).then(function(fields){
//                    fields[fields.length-2].sendKeys('first FREE TEXT question');
//                    ptor.findElements(protractor.By.tagName('select')).then(function(question_type){
//                        question_type[question_type.length-1].click();
//                        ptor.findElements(protractor.By.tagName('option')).then(function(options){
//                            options[options.length-1].click();
//                        });
//                    });
//
//                });
//            });
//        });
//        it('should save the questions', function(){
//            ptor.findElements(protractor.By.className('btn')).then(function(buttons){
//                buttons[buttons.length-1].click();
//                ptor.sleep(1000);
//            });
//        });
//        //refresh and see if the data remains the same//
//        it('should refresh the page', function(){
//            ptor.navigate().refresh();
//        });
//        it('should display correct questions and answers', function(){
//            ptor.findElements(protractor.By.tagName('input')).then(function(questions){
//                expect(questions[0].getAttribute('value')).toBe('first MCQ question')
//                expect(questions[1].getAttribute('value')).toBe('first answer')
//                expect(questions[2].getAttribute('value')).toBe('second answer')
//                expect(questions[3].getAttribute('value')).toBe('third answer')
//                expect(questions[4].getAttribute('value')).toBe('first OCQ question')
//                expect(questions[5].getAttribute('value')).toBe('first answer')
//                expect(questions[6].getAttribute('value')).toBe('second answer')
//                expect(questions[7].getAttribute('value')).toBe('third answer')
//                expect(questions[8].getAttribute('value')).toBe('first FREE TEXT question')
//            });
//        });
//        //delete an answer from each question
//        it('should delete an answer from each question', function(){
//            ptor.findElements(protractor.By.className('real_delete_ans')).then(function(delete_buttons){
//                delete_buttons[0].click();
//                var alert_dialog = ptor.switchTo().alert();
//                alert_dialog.accept();
//            });
//            ptor.findElements(protractor.By.className('real_delete_ans')).then(function(delete_buttons){
//                delete_buttons[2].click();
//                var alert_dialog = ptor.switchTo().alert();
//                alert_dialog.accept();
//            });
//        });
//        it('should try to save the questions after deleting answers', function(){
//            ptor.findElements(protractor.By.className('btn')).then(function(buttons){
//                buttons[buttons.length-1].click();
//                ptor.sleep(1000);
//            });
//            var error = ptor.findElements(protractor.By.className('alert-error'));
//            expect(error.length).toBe(undefined);
//        });
//        it('should refresh the page', function(){
//            ptor.navigate().refresh();
//        });
//        it('should display correct questions and answers', function(){
//            ptor.findElements(protractor.By.tagName('input')).then(function(questions){
//                expect(questions[0].getAttribute('value')).toBe('first MCQ question')
//                expect(questions[1].getAttribute('value')).toBe('second answer')
//                expect(questions[2].getAttribute('value')).toBe('third answer')
//                expect(questions[3].getAttribute('value')).toBe('first OCQ question')
//                expect(questions[4].getAttribute('value')).toBe('second answer')
//                expect(questions[5].getAttribute('value')).toBe('third answer')
//                expect(questions[6].getAttribute('value')).toBe('first FREE TEXT question')
//            });
//        });
//        it('should delete each question', function(){
//            ptor.findElements(protractor.By.className('delete_option')).then(function(delete_questions){
//                expect(delete_questions.length).toBe(3);
//                delete_questions[0].click();
//                var alert_dialog = ptor.switchTo().alert();
//                alert_dialog.dismiss();
//                ptor.findElements(protractor.By.className('q_label')).then(function(labels){
//                    expect(labels.length).toBe(6);
//                });
//                delete_questions[0].click();
//                alert_dialog = ptor.switchTo().alert();
//                alert_dialog.accept();
//            });
//            ptor.findElements(protractor.By.className('delete_option')).then(function(delete_questions){
//                expect(delete_questions.length).toBe(2);
//                delete_questions[0].click();
//                var alert_dialog = ptor.switchTo().alert();
//                alert_dialog.accept();
//            });
//            ptor.findElements(protractor.By.className('delete_option')).then(function(delete_questions){
//                expect(delete_questions.length).toBe(1);
//                delete_questions[0].click();
//                var alert_dialog = ptor.switchTo().alert();
//                alert_dialog.accept();
//            });
//            ptor.findElements(protractor.By.className('btn')).then(function(buttons){
//                buttons[buttons.length-1].click();
//                ptor.sleep(1000);
//            });
//        });
//        it('should refresh the page', function(){
//            ptor.navigate().refresh();
//        });
//        it('should display 0 questions', function(){
//            ptor.findElements(protractor.By.tagName('label')).then(function(questions){
//                expect(questions.length).toBe(0);
//            });
//        });
//    });
//    describe('Left Section', function(){
//        it('should allow sorting quizes, lectures, and surveys', function(){
//            ptor.findElements(protractor.By.className('handle')).then(function(handles){
//                ptor.actions().dragAndDrop(handles[handles.length-1], handles[handles.length-2]).perform();
//            });
//            ptor.sleep(1000);
//            ptor.findElements(protractor.By.className('trigger2')).then(function(triggers2){
//                expect(triggers2[triggers2.length-2].getText()).toBe('My Survey');
//                expect(triggers2[triggers2.length-1].getText()).toBe('My Quiz');
//            });
//        });
//    });
//    describe('Left Section', function(){
//        it('should allow deleting quizes, surveys, or lectures', function(){
//            ptor.findElements(protractor.By.className('delete_image')).then(function(delete_buttons){
//                delete_buttons[delete_buttons.length-1].click();
//                var alert_dialog = ptor.switchTo().alert();
//                alert_dialog.accept();
//            });
//            ptor.findElements(protractor.By.className('delete_image')).then(function(delete_buttons){
//                delete_buttons[delete_buttons.length-1].click();
//                alert_dialog = ptor.switchTo().alert();
//                alert_dialog.accept();
//            });
//        });
//        it('should allow sorting the modules by drag and drop', function(){
//            ptor.findElements(protractor.By.className('handle')).then(function(handles){
//                ptor.actions().dragAndDrop(handles[handles.length-1], handles[0]).perform();
//                ptor.sleep(1000);
//            });
//            ptor.findElements(protractor.By.className('trigger')).then(function(triggers){
//                expect(triggers[triggers.length-2].getText()).toBe('2');
//                expect(triggers[triggers.length-1].getText()).toBe('1');
//            });
//        });
//        it('should allow deleting modules', function(){
//            ptor.findElements(protractor.By.className('delete_image')).then(function(delete_buttons){
//                delete_buttons[0].click();
//                var alert_dialog = ptor.switchTo().alert();
//                alert_dialog.accept();
//            });
//        });
//    });


//-------------- lecture module ------------------------//

//    describe("Details Section (Right)",function(){
//
//
//
//        // beforeEach(function(){
//        //       ptor = protractor.getInstance();
//        //       ptor.get('/#/course/13/course_editor');
//        // });
//
//
//
////DONE__________________________________________________________________________________________________________________________
//
////    it('should display module appearance date and allow changing it', function(){
////        ptor.findElements(protractor.By.className('editable-click')).then(function(appearance_date){
////            expect(appearance_date[1].getText()).toBe('02/10/2013');
////            appearance_date[1].click();
////            ptor.findElement(protractor.By.className('editable-input')).then(function(date_field){
////                date_field.clear();
////                date_field.sendKeys('02/15/2013');
////                ptor.findElement(protractor.By.className('btn-primary')).then(function(confirmButton){
////                    confirmButton.click();
////                });
////            });
////            ptor.sleep(2000);
////            browser().reload();
////            ptor.sleep(2000);
////            expect(appearance_date[1].getText()).toBe('02/15/2013');
////
////
////
////        });
////    });
//
////    it('should display lecture appearance date and allow changing it', function(){
////       ptor.findElement(protractor.By.className('editable-checkbox')).then(function(status){
////         expect(status.getText()).toBe("Using Module's Appearance Date");
////         status.click();
////         ptor.findElement(protractor.By.className('editable-input')).then(function(checkbox){
////           checkbox.click();
////           ptor.findElements(protractor.By.tagName('button')).then(function(confirmButton){
////             confirmButton[1].click();
////           });
////         });
////         expect(status.getText()).toBe("Not Using Module's Appearance Date");
////         ptor.findElements(protractor.By.className('editable-click')).then(function(datePicker){
////             datePicker[4].click();
////             ptor.findElement/////////////////////////////////////////////////////////////////////////////////
////         });
////         status.click();
////         ptor.findElement(protractor.By.className('editable-input')).then(function(checkbox){
////           checkbox.click();
////           ptor.findElement(protractor.By.tagName('button')).then(function(confirmButton){
////             confirmButton.click();
////           });
////         });
////         expect(status.getText()).toBe("Using Module's Appearance Date");
////         status.click();
////         ptor.findElement(protractor.By.className('editable-input')).then(function(checkbox){
////           checkbox.click();
////           ptor.findElements(protractor.By.tagName('button')).then(function(cancelButton){
////             cancelButton[1].click();
////           });
////         });
////         expect(status.getText()).toBe("Using Module's Appearance Date");
////       });
////    });
//
//        // it('should display lecture due date and allow changing it', function(){
//        //   ptor.findElements(protractor.By.className('editable-checkbox')).then(function(status){
//        //     expect(status[1].getText()).toBe("Using Module's Due Date");
//        //     status[1].click();
//        //     ptor.findElement(protractor.By.className('editable-input')).then(function(checkbox){
//        //       checkbox.click();
//        //       ptor.findElement(protractor.By.tagName('button')).then(function(confirmButton){
//        //         confirmButton.click();
//        //       });
//        //     });
//        //     expect(status[1].getText()).toBe("Not Using Module's Due Date");
//        //     ptor.findElements(protractor.By.className('editable-click')).then(function(date){
//        //       expect(date[5].getText()).toBe("22/03/2013");
//        //       date[5].click();
//        //       ptor.findElements(protractor.By.tagName('button')).then(function(cancelButton){
//        //         cancelButton[1].click();
//        //       });
//        //       expect(date[5].getText()).toBe("22/03/2013");
//        //       date[5].click();
//        //       ptor.findElement(protractor.By.className('editable-input')).then(function(dateTextBox){
//        //         dateTextBox.clear();
//        //         dateTextBox.sendKeys('2013-03-25');
//        //         ptor.findElements(protractor.By.tagName('button')).then(function(confirmButton){
//        //           confirmButton[0].click();
//        //         });
//        //       });
//        //       expect(date[5].getText()).toBe("25/03/2013");
//        //     });
//        //     status[1].click();
//        //     ptor.findElement(protractor.By.className('editable-input')).then(function(checkbox){
//        //       checkbox.click();
//        //       ptor.findElement(protractor.By.tagName('button')).then(function(confirmButton){
//        //         confirmButton.click();
//        //       });
//        //     });
//        //     expect(status[1].getText()).toBe("Using Module's Due Date");
//        //     status[1].click();
//        //     ptor.findElement(protractor.By.className('editable-input')).then(function(checkbox){
//        //       checkbox.click();
//        //       ptor.findElements(protractor.By.tagName('button')).then(function(cancelButton){
//        //         cancelButton[1].click();
//        //       });
//        //     });
//        //     expect(status[1].getText()).toBe("Using Module's Due Date");
//        //   });
//        // });
//
//
//
//
//
//
//
//
//
//
//    });

});