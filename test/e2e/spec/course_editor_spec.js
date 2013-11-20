var util = require('util');

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
        driver.get("http://10.0.0.16:3000/en/users/sign_in");
        findByName("user[email]").sendKeys("admin@scalear.com");
        findByName("user[password]").sendKeys("password");
        findByName("commit").click();
        expect(findById('flash_notice').getText()).toEqual('Signed in successfully.')
    });


    describe("Modules Section (Left)", function(){
        it('should create a module', function(){
            ptor = protractor.getInstance();
            ptor.get('/#/courses/13/course_editor');

            ptor.findElements(protractor.By.className('trigger')).then(function(modules){
                expect(modules.length).toBe(13);
                ptor.findElement(protractor.By.className('adding_module')).then(function(add_module){
                    add_module.click();
                    ptor.sleep(2000);
                });
            });
            ptor.findElements(protractor.By.className('trigger')).then(function(modules){
                expect(modules.length).toBe(14);
            });

        });
        it('should open the module', function(){
            ptor.findElements(protractor.By.className('trigger')).then(function(modules){
                modules[modules.length-1].click();
            });
        });
        ptor.sleep(2000);
        it('should add a new lecture', function(){
            ptor.findElements(protractor.By.className('btn-mini')).then(function(buttons){
                buttons[buttons.length-3].click();
            });
//            ptor.sleep(2000);
            ptor.findElements(protractor.By.className('trigger2')).then(function(lectures){
                expect(lectures[lectures.length-1].getText()).toBe('New Lecture')
            });
        });
        it('should add a new quiz', function(){
            ptor.findElements(protractor.By.className('btn-mini')).then(function(buttons){
                buttons[buttons.length-2].click();
            });
//            ptor.sleep(2000);
            ptor.findElements(protractor.By.className('trigger2')).then(function(quiz){
                expect(quiz[quiz.length-1].getText()).toBe('New Quiz');
            })
        });
        it('should add a new survey', function(){
            ptor.findElements(protractor.By.className('btn-mini')).then(function(buttons){
                buttons[buttons.length-1].click();
            });
//            ptor.sleep(2000);
            ptor.findElements(protractor.By.className('trigger2')).then(function(survey){
                expect(survey[survey.length-1].getText()).toBe('New Survey');
            })
        });

        it('should open a quiz', function(){
            ptor.findElements(protractor.By.className('trigger2')).then(function(quizes){
                quizes[quizes.length-2].click();
            });
        });

        //need to find a way to click on the delete button

    });

//
//
//    describe('Right Section', function(){
//
//        it('should display quiz details and allow editing it', function(){
//            ptor.findElement(protractor.By.tagName('h3')).then(function(title){
//                expect(title.getText()).toBe('Details');
//            });
//            ptor.findElements(protractor.By.className('editable-click')).then(function(details){
//
//                expect(details[0].getText()).toBe('New Quiz');
//                details[0].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.clear();
//                    field.sendKeys("My Quiz")
//                });
//                ptor.findElements(protractor.By.className('btn')).then(function(buttons){
//                    buttons[buttons.length-2].click();
//                });
//                expect(details[0].getText()).toBe('My Quiz');
//
//
//
//                expect(details[1].getText()).toBe('This Quiz is Not Required');
//                details[1].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.click();
//                });
//                ptor.findElements(protractor.By.className('btn')).then(function(buttons){
//                    buttons[buttons.length-2].click();
//                });
//                expect(details[1].getText()).toBe('This Quiz is Required');
//
//
//
//                expect(details[2].getText()).toBe('0');
//                details[2].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.clear();
//                    field.sendKeys("10")
//                });
//                ptor.findElements(protractor.By.className('btn')).then(function(buttons){
//                    buttons[buttons.length-2].click();
//                });
//                expect(details[2].getText()).toBe('10');
//
//
//
//                expect(details[3].getText()).toBe('Using Module\'s Appearance Date');
//                details[3].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.click();
//                });
//                ptor.findElements(protractor.By.className('btn')).then(function(buttons){
//                    buttons[buttons.length-2].click();
//                });
//                expect(details[3].getText()).toBe('Not Using Module\'s Appearance Date');
//
//
//
//                expect(details[5].getText()).toBe('Using Module\'s Due Date');
//                details[5].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.click();
//                });
//                ptor.findElements(protractor.By.className('btn')).then(function(buttons){
//                    buttons[buttons.length-2].click();
//                });
//                expect(details[5].getText()).toBe('Not Using Module\'s Due Date');
//
//
//
//                expect(details[7].getText()).toBe('Please choose the correct answer(s)');
//                details[7].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
//                    field.clear();
//                    field.sendKeys("new instructions")
//                });
//                ptor.findElements(protractor.By.className('btn')).then(function(buttons){
//                    buttons[buttons.length-2].click();
//                });
//                expect(details[7].getText()).toBe('new instructions');
//            });
//        });
//    });
//
//    describe('Middle Section', function(){
//        it('should allow adding quesions to quiz', function(){
//            ptor.findElements(protractor.By.className('btn')).then(function(buttons){
//                buttons[buttons.length-2].click();
//                ptor.findElements(protractor.By.tagName('input')).then(function(fields){
//                    fields[fields.length-3].sendKeys('first mcq question');
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
//                buttons[buttons.length-1].click();
//            });
//        });
//    });



    describe("Modules Section (Left)", function(){
        it('should open a survey', function(){
            ptor.findElements(protractor.By.className('trigger2')).then(function(quizes){
                quizes[quizes.length-1].click();
            });
        });
    });


    describe('Right Section', function(){

        it('should display survey details and allow editing it', function(){
            ptor.findElement(protractor.By.tagName('h3')).then(function(title){
                expect(title.getText()).toBe('Details');
            });
            ptor.findElements(protractor.By.className('editable-click')).then(function(details){

                expect(details[0].getText()).toBe('New Survey');
                details[0].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys("My Survey")
                });
                ptor.findElements(protractor.By.className('btn')).then(function(buttons){
                    buttons[buttons.length-2].click();
                });
                expect(details[0].getText()).toBe('My Survey');


                expect(details[1].getText()).toBe('Using Module\'s Appearance Date');
                details[1].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.click();
                });
                ptor.findElements(protractor.By.className('btn')).then(function(buttons){
                    buttons[buttons.length-2].click();
                });
                expect(details[1].getText()).toBe('Not Using Module\'s Appearance Date');



                expect(details[3].getText()).toBe('Using Module\'s Due Date');
                details[3].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.click();
                });
                ptor.findElements(protractor.By.className('btn')).then(function(buttons){
                    buttons[buttons.length-2].click();
                });
                expect(details[3].getText()).toBe('Not Using Module\'s Due Date');



                expect(details[5].getText()).toBe('Please fill in the survey.');
                details[5].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys("new instructions")
                });
                ptor.findElements(protractor.By.className('btn')).then(function(buttons){
                    buttons[buttons.length-2].click();
                });
                expect(details[5].getText()).toBe('new instructions');
            });
        });
    });

    describe('Middle Section', function(){
        it('should allow adding quesions to quiz', function(){
            ptor.findElements(protractor.By.className('btn')).then(function(buttons){
                buttons[buttons.length-2].click();
                ptor.findElements(protractor.By.tagName('input')).then(function(fields){
                    fields[fields.length-3].sendKeys('first mcq question');
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

                buttons[buttons.length-2].click();

                ptor.findElements(protractor.By.tagName('input')).then(function(fields){
                    fields[fields.length-3].sendKeys('first TEXT question');
                    ptor.findElements(protractor.By.tagName('select')).then(function(question_type){
                        question_type[question_type.length-1].click();
                        ptor.findElements(protractor.By.tagName('option')).then(function(options){
                            options[options.length-1].click();
                        });
                    });

                });

                //save questions
                buttons[buttons.length-1].click();
            });
        });
    });

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
//        it('should open the first module', function(){
//            ptor = protractor.getInstance();
//            ptor.get('/#/courses/13/course_editor');
//            ptor.findElement(protractor.By.className('trigger')).click();
//
//        });
//
//        it('should display the Details section',function(){
//            ptor.findElements(protractor.By.tagName('h3')).
//                then(function(tag){
//                    expect(tag[1].getText()).toBe('Details');
//                });
//        });
//
//        it('should display the module name and allow editing it', function(){
//            ptor.findElements(protractor.By.className('editable-click')).then(function(name){
//                expect(name[0].getText()).toBe('ISA 1');
//                name[0].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(nameField){
//                    nameField.clear();
//                    nameField.sendKeys('new name');
//                });
//                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                    buttons[0].click();
//                });
//                expect(name[0].getText()).toBe('new name');
//                name[0].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(nameField){
//                    nameField.clear();
//                    nameField.sendKeys('ISA 1');
//                });
//                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                    buttons[1].click();
//                });
//                expect(name[0].getText()).toBe('new name');
//                name[0].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(nameField){
//                    nameField.clear();
//                    nameField.sendKeys('ISA 1');
//                });
//                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                    buttons[0].click();
//                });
//                expect(name[0].getText()).toBe('ISA 1');
//            });
//        });
//
//        it('should display module description and allow editing it',function(){
//            ptor.findElements(protractor.By.className('editable-click')).then(function(description){
//                expect(description[description.length-1].getText()).toBe("Empty");
//                description[description.length-1].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(descriptionTextBox){
//                    descriptionTextBox.sendKeys("dummy description");
//                    ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                        buttons[0].click();
//                    });
//                });
//                ptor.sleep(2000);
//                expect(description[description.length-1].getText()).toBe("dummy description");
//                description[description.length-1].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(descriptionTextBox){
//                    descriptionTextBox.clear();
//                    descriptionTextBox.sendKeys(' ');
//                    ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                        buttons[0].click();
//                    });
//                });
//                ptor.sleep(2000);
//                expect(description[description.length-1].getText()).toBe('Empty');
//                description[description.length-1].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(descriptionTextBox){
//                    descriptionTextBox.sendKeys('dummy description');
//                    ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                        buttons[1].click();
//                    });
//                });
//                expect(description[description.length-1].getText()).toBe('Empty');
//
//            });
//        });
//
//
//        it('should open first lecture',function(){
//            ptor.findElement(protractor.By.className('trigger')).click();
//            ptor.findElement(protractor.By.className('trigger2')).click();
//            //expect(ptor.findElement(protractor.By.tagName('loading_big')).isDisplayed()).toEqual(true)
//        });
//
//        it('should display the Details section',function(){
//            ptor.findElements(protractor.By.tagName('h3')).
//                then(function(tag){
//                    expect(tag[1].getText()).toBe('Details');
//                });
//        });
//
//        it('should display lecture name and allow editing it',function(){
//            //edit it
//            ptor.findElement(protractor.By.binding('{{lecture.name}}')).then(function(elem){
//                elem.isDisplayed().then(function(disp){
//                    expect(disp).toEqual(true)
//                })
//                expect(elem.getText()).toBe("ISA introduction");
//            });
//
//            ptor.findElement(protractor.By.className('editable-click')).then(function(name){
//                expect(name.getText()).toBe('ISA introduction');
//                name.click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(nameTextBox){
//                    nameTextBox.clear();
//                    ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                        buttons[2].click();
//                    });
//                });
//
//                expect(name.getText()).toBe('ISA introduction');
//                name.click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(nameTextBox){
//                    nameTextBox.clear();
//                    nameTextBox.sendKeys('ISA Introduction');
//                    // ptor.sleep(10000);
//                    ptor.findElements(protractor.By.tagName('button')).then(function(button){
//                        expect(button[1].getAttribute('type')).toBe('submit');
//                        button[1].click();
//
//                    });
//                });
//
//                expect(name.getText()).toBe('ISA Introduction');
//                name.click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(nameTextBox){
//                    nameTextBox.clear();
//                    nameTextBox.sendKeys('ISA introduction');
//                    ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                        buttons[1].click();
//                    });
//                });
//                expect(name.getText()).toBe('ISA introduction');
//
//            });
//        });
//
//        it('should display lecture video url and allow editing it',function(){
//            ptor.findElement(protractor.By.tagName('iframe')).then(function(elem){
//                elem.isDisplayed().then(function(disp){
//                    expect(disp).toEqual(true)
//                })
//                expect(elem.getAttribute('src')).toContain("PlavjNH_RRU");
//            });
//
//            ptor.findElements(protractor.By.className('editable-click')).then(function(editable_click){
//                expect(editable_click[1].getText()).toBe('http://www.youtube.com/watch?v=PlavjNH_RRU');
//                editable_click[1].click();
//                //find the textfield and edit it
//                ptor.findElement(protractor.By.className('editable-input')).then(function(urlField){
//                    urlField.clear();
//                    urlField.sendKeys('http://www.youtube.com/watch?v=jgoGBxlVslI');
//                });
//                //click the confirm button
//                ptor.findElements(protractor.By.tagName('button')).then(function(button){
//                    button[1].click();
//                });
//                //wait for video to load
//                ptor.sleep(10000);
//                //check video, thumbnail, author, duration, title, and aspect ratio
//                ptor.findElement(protractor.By.tagName('iframe')).then(function(elem){
//                    elem.isDisplayed().then(function(disp){
//                        expect(disp).toEqual(true)
//                    });
//                    expect(elem.getAttribute('src')).toContain("jgoGBxlVslI");
//                });
//                ptor.findElement(protractor.By.className('bigimg')).then(function(thumbnail){
//                    expect(thumbnail.getAttribute('src')).toContain('jgoGBxlVslI');
//                });
//                expect(editable_click[2].getText()).toBe('smallscreen');
//                ptor.findElement(protractor.By.binding('{{video.author}}')).then(function(author){
//                    expect(author.getText()).toBe('saasbook');
//                });
//                ptor.findElement(protractor.By.binding('lecture.duration')).then(function(duration){
//                    expect(duration.getText()).toBe('492 Seconds');
//                });
//                ptor.findElement(protractor.By.binding('{{video.title}}')).then(function(elem){
//                    expect(elem.getText()).toBe("CS169 v13 w5l2s9");
//                });
//                //check if the new url is correct
//                expect(editable_click[1].getText()).toBe('http://www.youtube.com/watch?v=jgoGBxlVslI');
//
//                //click to edit again
//                editable_click[1].click();
//                //find the textfield and edit it
//                ptor.findElement(protractor.By.className('editable-input')).then(function(urlField){
//                    urlField.clear();
//                    urlField.sendKeys('http://www.youtube.com/watch?v=PlavjNH_RRU');
//                });
//                //don't confirm the change
//                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                    buttons[2].click();
//                });
//                expect(editable_click[1].getText()).toBe('http://www.youtube.com/watch?v=jgoGBxlVslI');
//                editable_click[1].click();
//                //find the textfield and edit it
//                ptor.findElement(protractor.By.className('editable-input')).then(function(urlField){
//                    urlField.clear();
//                    urlField.sendKeys('http://www.youtube.com/watch?v=PlavjNH_RRU');
//                });
//                //confirm the change
//                ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                    buttons[1].click();
//                });
//                ptor.sleep(10000);
//                //check video, thumbnail, author, duration, title, and aspect ratio
//                ptor.findElement(protractor.By.tagName('iframe')).then(function(elem){
//                    elem.isDisplayed().then(function(disp){
//                        expect(disp).toEqual(true)
//                    });
//                    expect(elem.getAttribute('src')).toContain("PlavjNH_RRU");
//                });
//                ptor.findElement(protractor.By.className('bigimg')).then(function(thumbnail){
//                    expect(thumbnail.getAttribute('src')).toContain('PlavjNH_RRU');
//                });
//                expect(editable_click[2].getText()).toBe('widescreen');
//                ptor.findElement(protractor.By.binding('{{video.author}}')).then(function(author){
//                    expect(author.getText()).toBe('David B');
//                });
//                ptor.findElement(protractor.By.binding('lecture.duration')).then(function(duration){
//                    expect(duration.getText()).toBe('322 Seconds');
//                });
//                ptor.findElement(protractor.By.binding('{{video.title}}')).then(function(elem){
//                    expect(elem.getText()).toBe("L2.1-ISA Intro");
//                });
//                expect(editable_click[1].getText()).toBe('http://www.youtube.com/watch?v=PlavjNH_RRU')
//
//            });
//        });
//
//        it('should display lecture video author',function(){
//            ptor.findElement(protractor.By.binding('{{video.author}}')).then(function(elem){
//                elem.isDisplayed().then(function(disp){
//                    expect(disp).toEqual(true)
//                })
//                expect(elem.getText()).toBe("David B")
//            });
//        });
//
//        it('should display lecture video aspect ratio and allow changing it',function(){
//            ptor.findElements(protractor.By.className('editable-click')).then(function(elem){
//                elem[2].isDisplayed().then(function(disp){
//                    expect(disp).toEqual(true)
//                })
//                expect(elem[2].getText()).toBe("widescreen")
//                elem[2].click();
//                ptor.findElement(protractor.By.tagName('select')).then(function(dropDown){
//                    dropDown.click();
//                });
//                ptor.findElements(protractor.By.tagName('option')).then(function(options){
//                    options[1].click();
//                });
//                expect(elem[2].getText()).toBe("smallscreen");
//                //wait for video to reload
//                ptor.sleep(10000);
//                ptor.findElement(protractor.By.id('youtube')).then(function(video){
//                    expect(video.getAttribute('class')).toContain('smallscreen');
//                });
//
//                elem[2].click();
//                ptor.findElement(protractor.By.tagName('select')).then(function(dropDown){
//                    dropDown.click();
//                });
//                ptor.findElements(protractor.By.tagName('option')).then(function(options){
//                    options[0].click();
//                });
//                expect(elem[2].getText()).toBe("widescreen");
//                //wait for video to reload
//                ptor.sleep(10000);
//                ptor.findElement(protractor.By.id('youtube')).then(function(video){
//                    expect(video.getAttribute('class')).toContain('widescreen');
//                });
//
//            });
//        });
//
//        it('should display lecture duration',function(){
//            ptor.findElement(protractor.By.binding('{{lecture.duration}}')).then(function(elem){
//                elem.isDisplayed().then(function(disp){
//                    expect(disp).toEqual(true)
//                })
//                expect(elem.getText()).toBe("322 Seconds")
//            });
//        });
//
//        it('should display lecture title',function(){
//            ptor.findElement(protractor.By.binding('{{video.title}}')).then(function(elem){
//                elem.isDisplayed().then(function(disp){
//                    expect(disp).toEqual(true)
//                })
//                expect(elem.getText()).toBe("L2.1-ISA Intro");
//            });
//        });
//
//        it('should display lecture slides and allows editing it',function(){
//            ptor.findElements(protractor.By.className('editable-click')).then(function(slides){
//
//                expect(slides[slides.length-2].getText()).toBe("http://www.it.uu.se/edu/course/homepage/darkdig/vt13/2-ISA%201.pdf");
//                slides[slides.length-2].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(slidesTextBox){
//                    slidesTextBox.sendKeys("testLink");
//                    ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                        buttons[2].click();
//                    });
//                });
//                expect(slides[slides.length-2].getText()).toBe("http://www.it.uu.se/edu/course/homepage/darkdig/vt13/2-ISA%201.pdf");
//                slides[slides.length-2].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(slidesTextBox){
//                    slidesTextBox.clear();
//                    slidesTextBox.sendKeys("testLink");
//                    ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                        buttons[1].click();
//                    });
//                });
//                expect(slides[slides.length-2].getText()).toBe("http://www.it.uu.se/edu/course/homepage/darkdig/vt13/2-ISA%201.pdf");
//                slides[slides.length-2].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(slidesTextBox){
//                    slidesTextBox.clear();
//                    slidesTextBox.sendKeys("http://www.it.uu.se/edu/course/homepage/darkdig/vt13/2-ISA%201.pdf");
//                    ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                        buttons[1].click();
//                    });
//                });
//                expect(slides[slides.length-2].getText()).toBe("http://www.it.uu.se/edu/course/homepage/darkdig/vt13/2-ISA%201.pdf");
//            });
//        });
//
//        it('should display lecture description and allow editing it',function(){
//            ptor.findElements(protractor.By.className('editable-click')).then(function(description){
//                expect(description[description.length-1].getText()).toBe("Empty");
//                description[description.length-1].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(descriptionTextBox){
//                    descriptionTextBox.sendKeys("dummy description");
//                    ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                        buttons[1].click();
//                    });
//                });
//                ptor.sleep(2000);
//                expect(description[description.length-1].getText()).toBe("dummy description");
//                description[description.length-1].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(descriptionTextBox){
//                    descriptionTextBox.clear();
//                    descriptionTextBox.sendKeys(' ');
//                    ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                        buttons[1].click();
//                    });
//                });
//                ptor.sleep(2000);
//                expect(description[description.length-1].getText()).toBe('Empty');
//                description[description.length-1].click();
//                ptor.findElement(protractor.By.className('editable-input')).then(function(descriptionTextBox){
//                    descriptionTextBox.sendKeys('dummy description');
//                    ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
//                        buttons[2].click();
//                    });
//                });
//                expect(description[description.length-1].getText()).toBe('Empty');
//
//            });
//        });
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