var util = require('util');

var current_date = new Date(),
    enroll_key = '',
    course_id = '',
    module_id = '',
    lecture_id = '';
//var location1x, location1y, location2x, location2y, location3x, location3y;
var locationx = [];
var locationy = [];

function getNextDay(date) {
    var result = date;
    result.setTime(date.getTime() + 86400000);
    return result;
}

function getNextWeek(date) {
    var result = date;
    result.setTime(date.getTime() + 604800000);
    return result;
}

//function noZero(date_string){
//    var left = date_string.split('/')[0];
//    var middle = date_string.split('/')[1];
//    var right = date_string.split('/')[2];
//    var first = left.split('')[0];
//    var second = left.split('')[1];
//    first = first.replace('0','');
//    return first+second+'/'+middle+'/'+right;
//}

function formatDate(date, which) {
    var dd = date.getDate();
    if (dd < 10) {
        dd = '0' + dd;
    }
    var mm = date.getMonth() + 1;
    if (mm < 10) {
        mm = '0' + mm;
    }
    var yyyy = date.getFullYear();
    if (which == 0) {
        return mm + '/' + dd.toString() + '/' + yyyy;
    } else if (which == 1) {
        return dd + '/' + mm + '/' + yyyy;
    }
}

function login(ptor, driver, email, password, name, findByName) {
    it('should login', function() {
        ptor.get(ptor.params.frontend + 'users/login');
        ptor.findElement(protractor.By.id('user_email')).then(function(email_field) {
            email_field.sendKeys(email);
        });
        ptor.findElement(protractor.By.id('user_passowrd')).then(function(password_field) {
            password_field.sendKeys(password);
        });
        ptor.findElements(protractor.By.tagName('input')).then(function(fields) {
            fields[3].click().then(function() {
                feedback(ptor, 'Signed in successfully');
            });
        });

        ptor.findElement(protractor.By.xpath('/html/body/header/nav/div/ul[1]/li[1]/a/span')).then(function(tag) {
            tag.getText().then(function(value) {
                expect(value.toLowerCase()).toContain(name.toLowerCase());
            });
        });

    });
}

function logout(ptor, driver) {
    it('should logout', function() {
        ptor.findElement(protractor.By.linkText('Logout')).then(function(link) {
            link.click().then(function() {
                feedback(ptor, 'Signed out successfully.');
            });
        });
    });
}

var today_keys = formatDate(new Date(), 0);
var tomorrow_keys = formatDate(getNextDay(new Date()), 0);
var after_tomorrow_keys = formatDate(getNextDay(getNextDay(new Date())), 0);
var next_day_week_keys = formatDate(getNextWeek(getNextDay(new Date())), 0);
var next_week_keys = formatDate(getNextWeek(new Date()), 0);


var today = formatDate(new Date(), 1);
var tomorrow = formatDate(getNextDay(new Date()), 1);
var after_tomorrow = formatDate(getNextDay(getNextDay(new Date())), 1);
var next_day_week = formatDate(getNextWeek(getNextDay(new Date())), 1);
var next_week = formatDate(getNextWeek(new Date()), 1);

describe("Course Editor", function() {
    var ptor = protractor.getInstance();
    var driver = ptor.driver;

    var findByName = function(name) {
        return driver.findElement(protractor.By.name(name));
    };
    var findById = function(id) {
        return driver.findElement(protractor.By.id(id))
    };

    describe('Teacher', function() {
        login(ptor, driver, 'anyteacher@email.com', 'password', 'anyteacher', findByName);
        it('should create a new course', function() {
            browser.driver.manage().window().setSize(ptor.params.width, ptor.params.height);
            browser.driver.manage().window().setPosition(0, 0);
            ptor = protractor.getInstance();
            ptor.get('/#/courses/new');
            ptor.findElements(protractor.By.tagName('input')).then(function(fields) {
                fields[0].sendKeys('TEST-102');
                fields[1].sendKeys('ZZ Testing');
                //                fields[2].sendKeys(today_keys);
                fields[3].sendKeys('5');
                fields[4].sendKeys('http://google.com/');
                ptor.findElements(protractor.By.tagName('textarea')).then(function(fields) {
                    fields[0].sendKeys('new description');
                    fields[1].sendKeys('new prerequisites');
                });
                //                ptor.findElements(protractor.By.tagName('select')).then(function(dropdown){
                //                    dropdown[0].click();
                ptor.findElements(protractor.By.tagName('option')).then(function(options) {
                    options[1].click();
                });
                //                });
                fields[fields.length - 3].click().then(function() {
                    feedback(ptor, 'created');
                });
            });
        });
        it('should go to course information page', function() {
            ptor.findElement(protractor.By.className('dropdown-toggle')).click();
            ptor.findElement(protractor.By.id('info')).click();
        });
        it('should save the course id', function() {
            ptor.getCurrentUrl().then(function(text) {
                var test = text.split('/')
                course_id = test[test.length - 1];
                //                console.log('course id is : '+course_id);
            })
        })
        it('should save enrollment key', function() {
            ptor.findElements(protractor.By.tagName('p')).then(function(data) {
                data[0].getText().then(function(text) {
                    enroll_key = text;
                });
            });
        });
        it('should go to course editor', function() {
            ptor.findElement(protractor.By.id('course_editor_link')).then(function(link) {
                link.click();
            });
        });
        it('should add a new module and open it', function() {
            ptor.findElement(protractor.By.className('adding_module')).then(function(button) {
                button.click().then(function() {
                    feedback(ptor, 'created');
                });
            });
            ptor.findElement(protractor.By.className('trigger')).click();
        });
        it('should save module id', function() {
            ptor.getCurrentUrl().then(function(text) {
                var test2 = text.split('/');
                module_id = test2[test2.length - 1];
                //                console.log('module id is '+module_id);
            });
        });
        it('should edit module name', function() {
            ptor.findElement(protractor.By.tagName('details-text')).then(function(field) {
                field.click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.clear();
                    field.sendKeys('1');
                });
                ptor.findElement(protractor.By.className('btn-primary')).click().then(function() {
                    feedback(ptor, 'updated');
                });
                //                feedback(ptor, 'Module Successfully Updated');
            });
        });
        it('should add 4 new lectures', function() {
            ptor.findElements(protractor.By.className('btn-mini')).then(function(adding) {
                adding[adding.length - 3].click().then(function() {
                    feedback(ptor, 'created');
                });
                adding[adding.length - 3].click().then(function() {
                    feedback(ptor, 'created');
                });
                adding[adding.length - 3].click().then(function() {
                    feedback(ptor, 'created');
                });
                adding[adding.length - 3].click().then(function() {
                    feedback(ptor, 'created');
                });
            });
        });
    });


    //starting here//

    describe("Modules Section (Left)", function() {
        it('should allow creating a module', function() {
            var test;
            ptor.findElements(protractor.By.className('trigger')).then(function(modules) {
                test = modules.length;
                ptor.findElement(protractor.By.className('adding_module')).then(function(add_module) {
                    add_module.click().then(function() {
                        feedback(ptor, 'created');
                    });
                });
                ptor.findElements(protractor.By.className('trigger')).then(function(modules) {
                    expect(modules.length).toBe(test + 1);
                });
                ptor.findElements(protractor.By.className('trigger')).then(function(modules) {
                    modules[modules.length - 1].click();
                });
            });
        });
    });
    describe("Right Section", function() {

        it('should display the module name and allow editing it', function() {
            ptor.findElements(protractor.By.className('editable-click')).then(function(name) {
                expect(name[0].getText()).toBe('New Module');
                name[0].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(nameField) {
                    nameField.clear();
                    nameField.sendKeys('module name');
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                    buttons[0].click().then(function() {
                        feedback(ptor, 'updated');
                    });
                });
                expect(name[0].getText()).toBe('module name');
                //old test cases
                name[0].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(nameField) {
                    nameField.clear();
                    nameField.sendKeys('2');
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                    buttons[1].click();
                });
                expect(name[0].getText()).toBe('module name');
                name[0].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(nameField) {
                    nameField.clear();
                    nameField.sendKeys('2');
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                    buttons[0].click().then(function() {
                        feedback(ptor, 'updated');
                    });
                });
                expect(name[0].getText()).toBe('2');
            });
        });
        it('should display module\'s appearance date and allow editing it', function() {
            //----------------------//
            //edit appearance date//
            ptor.findElement(protractor.By.id('details')).then(function(details){
                details.findElement(protractor.By.className('icon')).then(function(warning){
                    expect(warning.isDisplayed()).toBe(false);
                });
            });
            ptor.findElements(protractor.By.className('editable-click')).then(function(details) {
                expect(details[1].getText()).toBe(today);
                details[1].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.clear();
                    field.sendKeys(tomorrow_keys);
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                    buttons[buttons.length - 2].click().then(function() {
                        feedback(ptor, 'updated');
                    });
                });
                details[1].getText().then(function(text) {
                    expect(text).toBe(tomorrow);
                });

                details[1].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.clear();
                    field.sendKeys(today_keys);
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                    buttons[buttons.length - 1].click();
                });
                details[1].getText().then(function(text) {
                    expect(text).toBe(tomorrow);
                });
                
            });
        });

        it('should display module\'s due date and allow editing it', function() {
            ptor.findElements(protractor.By.className('editable-click')).then(function(details) {
                expect(details[2].getText()).toBe(next_week);
                details[2].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.clear();
                    field.sendKeys(next_day_week_keys);
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                    buttons[buttons.length - 2].click().then(function() {
                        feedback(ptor, 'updated');
                    });
                });
                details[2].getText().then(function(text) {
                    expect(text).toBe(next_day_week);
                });
                details[2].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.clear();
                    field.sendKeys(tomorrow_keys);
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                    buttons[buttons.length - 1].click();
                });
                details[2].getText().then(function(text) {
                    expect(text).toBe(next_day_week);
                });
            });
        });

        it('should display module description and allow editing it', function() {
            ptor.findElements(protractor.By.className('editable-click')).then(function(description) {
                expect(description[description.length - 1].getText()).toBe("Empty");
                description[description.length - 1].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(descriptionTextBox) {
                    descriptionTextBox.sendKeys("dummy description");
                    ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                        buttons[0].click().then(function() {
                            feedback(ptor, 'updated');
                        });
                    });
                });
                //                ptor.sleep(2000);
                expect(description[description.length - 1].getText()).toBe("dummy description");
                //old test cases
                description[description.length - 1].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(descriptionTextBox) {
                    descriptionTextBox.clear();
                    descriptionTextBox.sendKeys(' ');
                    ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                        buttons[0].click().then(function() {
                            feedback(ptor, 'updated');
                        });
                    });
                });
                //                ptor.sleep(2000);
                expect(description[description.length - 1].getText()).toBe('Empty');
                description[description.length - 1].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(descriptionTextBox) {
                    descriptionTextBox.sendKeys('dummy description');
                    ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                        buttons[1].click();
                    });
                });
                expect(description[description.length - 1].getText()).toBe('Empty');
            });
        });
        //refresh and see if the data remains the same//
        it('should refresh the page', function() {
            ptor.navigate().refresh();
            ptor.sleep(2000);
        });
        it('should make sure the details are correct after refreshing page', function() {
            ptor.findElements(protractor.By.className('editable-click')).then(function(details) {
                expect(details[0].getText()).toBe('2')
                expect(details[1].getText()).toBe(tomorrow)
                expect(details[2].getText()).toBe(next_day_week)
                expect(details[3].getText()).toBe('Empty')
            });
        });
    });
    describe("Left Section", function() {


        it('should open the module', function() {
            ptor.get('/#/courses/' + course_id + '/course_editor');
            ptor.findElements(protractor.By.className('trigger')).then(function(modules) {
                modules[modules.length - 1].click();
            });
        });
        it('should add a new lecture', function() {
            ptor.findElements(protractor.By.className('btn-mini')).then(function(buttons) {
                buttons[buttons.length - 3].click().then(function() {
                    feedback(ptor, 'created');
                });
            });
            ptor.findElements(protractor.By.className('trigger2')).then(function(quiz) {
                expect(quiz[quiz.length - 1].getText()).toBe('New Lecture');
            })
        });
        it('should open a lecture', function() {
            ptor.findElements(protractor.By.className('trigger2')).then(function(quizes) {
                quizes[quizes.length - 1].click();
                //                quizes[0].click();
            });
        });
    });

    describe('Right Section', function() {

        it('should display the Details section', function() {
            ptor.findElements(protractor.By.tagName('h3')).
            then(function(tag) {
                expect(tag[5].getText()).toBe('Lecture Details');
            });
        });

        it('should display lecture name and allow editing it', function() {
            //edit it
            ptor.findElement(protractor.By.binding('{{lecture.name}}')).then(function(elem) {
                elem.isDisplayed().then(function(disp) {
                    expect(disp).toEqual(true)
                })
                expect(elem.getText()).toBe("New Lecture");
            });

            ptor.findElement(protractor.By.className('editable-click')).then(function(name) {
                expect(name.getText()).toBe('New Lecture');
                name.click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(nameTextBox) {
                    nameTextBox.clear();
                    ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                        buttons[2].click();
                    });
                });

                expect(name.getText()).toBe('New Lecture');
                name.click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(nameTextBox) {
                    nameTextBox.clear();
                    nameTextBox.sendKeys('My Lecture');
                    // ptor.sleep(10000);
                    ptor.findElements(protractor.By.tagName('button')).then(function(button) {
                        expect(button[1].getAttribute('type')).toBe('submit');
                        button[1].click().then(function() {
                            feedback(ptor, 'updated');
                        });

                    });
                });

                expect(name.getText()).toBe('My Lecture');
            });
        });

        it('should display lecture video url and allow editing it', function() {
            //            ptor.findElement(protractor.By.tagName('iframe')).then(function(elem){
            //                elem.isDisplayed().then(function(disp){
            //                    expect(disp).toEqual(true)
            //                })
            //                expect(elem.getAttribute('src')).toContain("none");
            //            });

            ptor.findElements(protractor.By.className('editable-click')).then(function(editable_click) {
                expect(editable_click[1].getText()).toBe('none');
                editable_click[1].click();
                //find the textfield and edit it
                ptor.findElement(protractor.By.className('editable-input')).then(function(urlField) {
                    urlField.clear();
                    urlField.sendKeys('http://www.youtube.com/watch?v=XtyzOo7nJrQ');
                });
                //click the confirm button
                ptor.findElements(protractor.By.tagName('button')).then(function(button) {
                    button[1].click();
                });
                ptor.wait(function(){
                    return ptor.findElement(protractor.By.className('overlay')).then(function(loading){
                        return loading.isDisplayed().then(function(disp){
                            console.log('.');
                            return !disp;
                        });
                    });
                });
                //wait for video to load
                ptor.sleep(10000);
                //check video, thumbnail, author, duration, title, and aspect ratio
                ptor.findElement(protractor.By.tagName('iframe')).then(function(elem) {
                    elem.isDisplayed().then(function(disp) {
                        expect(disp).toEqual(true)
                    });
                    expect(elem.getAttribute('src')).toContain("XtyzOo7nJrQ");
                });
                ptor.findElement(protractor.By.className('bigimg')).then(function(thumbnail) {
                    expect(thumbnail.getAttribute('src')).toContain('XtyzOo7nJrQ');
                });
                expect(editable_click[2].getText()).toBe('smallscreen');
                ptor.findElement(protractor.By.binding('{{video.author}}')).then(function(author) {
                    expect(author.getText()).toContain('Roman Nurik');
                });
                ptor.findElement(protractor.By.binding('lecture.duration')).then(function(duration) {
                    expect(duration.getText()).toBe('00:09:49');
                });
                ptor.findElement(protractor.By.binding('{{video.title}}')).then(function(elem) {
                    expect(elem.getText()).toContain("Android Developers — Visual Design Screencast — Creating custom button assets");
                });
                //check if the new url is correct
                expect(editable_click[1].getText()).toBe('http://www.youtube.com/watch?v=XtyzOo7nJrQ');

                //click to edit again
                editable_click[1].click();
                //find the textfield and edit it
                ptor.findElement(protractor.By.className('editable-input')).then(function(urlField) {
                    urlField.clear();
                    urlField.sendKeys('http://www.youtube.com/watch?v=PlavjNH_RRU');
                });
                //don't confirm the change
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                    buttons[2].click();
                });
                expect(editable_click[1].getText()).toBe('http://www.youtube.com/watch?v=XtyzOo7nJrQ');
                editable_click[1].click();
                //find the textfield and edit it
                ptor.findElement(protractor.By.className('editable-input')).then(function(urlField) {
                    urlField.clear();
                    urlField.sendKeys('http://www.youtube.com/watch?v=PlavjNH_RRU');
                });
                //confirm the change
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                    buttons[1].click();
                });
                ptor.wait(function(){
                    return ptor.findElement(protractor.By.className('overlay')).then(function(loading){
                        return loading.isDisplayed().then(function(disp){
                            return !disp;
                        });
                    });
                });
                ptor.sleep(5000);
                //check video, thumbnail, author, duration, title, and aspect ratio
                ptor.findElement(protractor.By.tagName('iframe')).then(function(elem) {
                    elem.isDisplayed().then(function(disp) {
                        expect(disp).toEqual(true)
                    });
                    expect(elem.getAttribute('src')).toContain("PlavjNH_RRU");
                });
                ptor.findElement(protractor.By.className('bigimg')).then(function(thumbnail) {
                    expect(thumbnail.getAttribute('src')).toContain('PlavjNH_RRU');
                });
                expect(editable_click[2].getText()).toBe('widescreen');
                ptor.findElement(protractor.By.binding('{{video.author}}')).then(function(author) {
                    expect(author.getText()).toBe('David B');
                });
                ptor.findElement(protractor.By.binding('lecture.duration')).then(function(duration) {
                    expect(duration.getText()).toBe('00:05:22');
                });
                ptor.findElement(protractor.By.binding('{{video.title}}')).then(function(elem) {
                    expect(elem.getText()).toBe("L2.1-ISA Intro");
                });
                expect(editable_click[1].getText()).toBe('http://www.youtube.com/watch?v=PlavjNH_RRU')

            });
        });

        it('should display lecture video author', function() {
            ptor.findElement(protractor.By.binding('{{video.author}}')).then(function(elem) {
                elem.isDisplayed().then(function(disp) {
                    expect(disp).toEqual(true)
                })
                expect(elem.getText()).toBe("David B")
            });
        });

        it('should display lecture video aspect ratio and allow changing it', function() {
            ptor.findElements(protractor.By.className('editable-click')).then(function(elem) {
                elem[2].isDisplayed().then(function(disp) {
                    expect(disp).toEqual(true)
                });
                expect(elem[2].getText()).toBe("widescreen")
                elem[2].click();
                //                ptor.findElement(protractor.By.tagName('select')).then(function(dropDown){
                //                    dropDown.click();
                //                });
                ptor.findElements(protractor.By.tagName('option')).then(function(options) {
                    options[1].click().then(function() {
                        feedback(ptor, 'updated');
                    });
                });
                expect(elem[2].getText()).toBe("smallscreen");
                //wait for video to reload
                //                ptor.sleep(5000);
                ptor.findElement(protractor.By.className('videoborder')).then(function(video) {
                    expect(video.getAttribute('class')).toContain('smallscreen');
                });

                elem[2].click();
                //                ptor.findElement(protractor.By.tagName('select')).then(function(dropDown){
                //                    dropDown.isDisplayed().then(function(disp){
                //                        expect(disp).toBe(true);
                //                    });
                //                    dropDown.click();
                //                });
                ptor.findElements(protractor.By.tagName('option')).then(function(options) {
                    options[0].click().then(function() {
                        feedback(ptor, 'updated');
                    });
                });
                expect(elem[2].getText()).toBe("widescreen");
                //wait for video to reload
                //                ptor.sleep(5000);
                ptor.findElement(protractor.By.className('videoborder')).then(function(video) {
                    expect(video.getAttribute('class')).toContain('widescreen');
                });

            });
        });

        it('should display lecture duration', function() {
            ptor.findElement(protractor.By.binding('lecture.duration')).then(function(elem) {
                elem.isDisplayed().then(function(disp) {
                    expect(disp).toEqual(true)
                })
                expect(elem.getText()).toBe("00:05:22")
            });
        });

        it('should display lecture title', function() {
            ptor.findElement(protractor.By.binding('{{video.title}}')).then(function(elem) {
                elem.isDisplayed().then(function(disp) {
                    expect(disp).toEqual(true)
                })
                expect(elem.getText()).toBe("L2.1-ISA Intro");
            });
        });
        it('should display lecture appearance date and allow editing it', function() {
            //use module's appearance date//
            ptor.findElements(protractor.By.className('editable-click')).then(function(details) {
                expect(details[3].getText()).toBe('Using Module\'s Appearance Date');
                details[3].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.click();
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                    buttons[buttons.length - 2].click().then(function() {
                        feedback(ptor, 'updated');
                    });
                });
                expect(details[3].getText()).toBe('Not Using Module\'s Appearance Date');
                details[3].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.click();
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                    buttons[buttons.length - 1].click();
                });
                expect(details[3].getText()).toBe('Not Using Module\'s Appearance Date');
                //------------------------------//
                //edit appearance date//
                expect(details[4].getText()).toBe(tomorrow);
                details[4].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.clear();
                    field.sendKeys(after_tomorrow_keys);
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                    buttons[buttons.length - 2].click().then(function() {
                        feedback(ptor, 'updated');
                        ptor.sleep(3000);
                    });
                });
                details[4].getText().then(function(text) {
                    expect(text).toBe(after_tomorrow);
                });
                details[4].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.clear();
                    field.sendKeys(today_keys);
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                    buttons[buttons.length - 1].click();
                });
                details[4].getText().then(function(text) {
                    expect(text).toBe(after_tomorrow);
                });
                
            });

        });
        it('should display lecture due date and allow editing it', function() {
            //use module's appearance date//
            ptor.findElements(protractor.By.className('editable-click')).then(function(details) {
                expect(details[5].getText()).toBe('Using Module\'s due Date');
                details[5].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.click();
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                    buttons[buttons.length - 2].click().then(function() {
                        feedback(ptor, 'updated');
                    });
                });
                expect(details[5].getText()).toBe('Not Using Module\'s due Date');
                details[5].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.click();
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                    buttons[buttons.length - 1].click();
                });
                expect(details[5].getText()).toBe('Not Using Module\'s due Date');
                //------------------------------//
                //edit appearance date//
                expect(details[6].getText()).toBe(next_day_week);
                details[6].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.clear();
                    field.sendKeys(next_week_keys);
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                    buttons[buttons.length - 2].click().then(function() {
                        feedback(ptor, 'updated');
                    });
                });
                details[6].getText().then(function(text) {
                    expect(text).toBe(next_week);
                });
                details[6].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.clear();
                    field.sendKeys(tomorrow_keys);
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                    buttons[buttons.length - 1].click();
                });
                details[6].getText().then(function(text) {
                    expect(text).toBe(next_week);
                });
            });

        });

        it('should display lecture slides and allows editing it', function() {
            ptor.findElements(protractor.By.className('editable-click')).then(function(slides) {

                expect(slides[slides.length - 2].getText()).toBe("none");
                slides[slides.length - 2].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(slidesTextBox) {
                    slidesTextBox.sendKeys("testLink");
                    ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                        buttons[2].click();
                    });
                });
                expect(slides[slides.length - 2].getText()).toBe("none");
                slides[slides.length - 2].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(slidesTextBox) {
                    slidesTextBox.clear();
                    slidesTextBox.sendKeys("testLink");
                    ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                        buttons[1].click();
                    });
                });
                //                expect(slides[slides.length-2].getText()).toBe(" ");
                slides[slides.length - 2].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(slidesTextBox) {
                    slidesTextBox.clear();
                    slidesTextBox.sendKeys("http://www.it.uu.se/edu/course/homepage/darkdig/vt13/2-ISA%201.pdf");
                    ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                        buttons[1].click().then(function() {
                            feedback(ptor, 'updated');
                        });
                    });
                });
                expect(slides[slides.length - 2].getText()).toBe("http://www.it.uu.se/edu/course/homepage/darkdig/vt13/2-ISA%201.pdf");
            });
        });

        it('should display lecture description and allow editing it', function() {
            ptor.findElements(protractor.By.className('editable-click')).then(function(description) {
                expect(description[description.length - 1].getText()).toBe("Empty");
                description[description.length - 1].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(descriptionTextBox) {
                    descriptionTextBox.sendKeys("dummy description");
                    ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                        buttons[1].click().then(function() {
                            feedback(ptor, 'updated');
                        });
                    });
                });
                //                ptor.sleep(2000);
                expect(description[description.length - 1].getText()).toBe("dummy description");
                description[description.length - 1].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(descriptionTextBox) {
                    descriptionTextBox.clear();
                    descriptionTextBox.sendKeys(' ');
                    ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                        buttons[1].click().then(function() {
                            feedback(ptor, 'updated');
                        });
                    });
                });
                //                ptor.sleep(2000);
                expect(description[description.length - 1].getText()).toBe('Empty');
                description[description.length - 1].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(descriptionTextBox) {
                    descriptionTextBox.sendKeys('dummy description');
                    ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                        buttons[2].click();
                    });
                });
                expect(description[description.length - 1].getText()).toBe('Empty');

            });
        });
        //refresh and see if the data remains the same//
        it('should refresh the page', function() {
            ptor.navigate().refresh();
        });
        it('should make sure lecture details are correct after refreshing page', function() {
            ptor.findElements(protractor.By.className('editable-click')).then(function(details) {
                expect(details[0].getText()).toBe('My Lecture')
                expect(details[1].getText()).toContain('PlavjNH_RRU')
                expect(details[2].getText()).toBe('widescreen')
                expect(details[3].getText()).toBe('Not Using Module\'s Appearance Date')
                expect(details[4].getText()).toBe(after_tomorrow)
                expect(details[5].getText()).toBe('Not Using Module\'s due Date')
                expect(details[6].getText()).toBe(next_week)
                expect(details[7].getText()).toBe('http://www.it.uu.se/edu/course/homepage/darkdig/vt13/2-ISA%201.pdf')
                expect(details[8].getText()).toBe('Empty')
            });
            ptor.findElement(protractor.By.className('bigimg')).then(function(thumb) {
                expect(thumb.getAttribute('src')).toContain('PlavjNH_RRU');
            });
            ptor.findElements(protractor.By.tagName('label')).then(function(labels) {
                expect(labels[0].getText()).toBe('L2.1-ISA Intro');
                expect(labels[1].getText()).toBe('David B');
                expect(labels[2].getText()).toBe('00:05:22');
            });
        });
        it('should save lecture id', function() {
            ptor.getCurrentUrl().then(function(text) {
                var test3 = text.split('/');
                lecture_id = test3[test3.length - 1];
                //                console.log('lecture id is '+lecture_id);
            })
        })
    });

    describe("Lecture Middle Section", function() {
        //makes sure everything is displayed correctly
        it('should display Lecture Name', function() {
            ptor.get('#/courses/' + course_id + '/course_editor/lectures/' + lecture_id);

            ptor.findElements(protractor.By.tagName('h3')).then(function(names) {
                expect(names[1].getText()).toBe('My Lecture');
            });
        });
        it('should display the \'edit in full screen\' button', function() {
            ptor.findElement(protractor.By.className('big')).then(function(button) {
                expect(button.getText()).toBe('Edit in Full Screen');
            });
        });
        waitForOverlay(ptor);
        it('should display a player with the correct video loaded into it', function() {
            ptor.findElement(protractor.By.tagName('iframe')).then(function(elem) {
                elem.isDisplayed().then(function(disp) {
                    expect(disp).toEqual(true)
                });
                expect(elem.getAttribute('src')).toContain("PlavjNH_RRU");
            });
        });
        it('should display the \'insert quiz (over video & text)\' buttons', function() {
            ptor.findElements(protractor.By.tagName('dropdown_list')).then(function(buttons) {
                expect(buttons.length).toBe(2);
            });

        });
        waitForOverlay(ptor);
        MCQTest(0, ptor);
        doRefresh(ptor);
        waitForOverlay(ptor);
        MCQTest(1, ptor);
        doRefresh(ptor);
        waitForOverlay(ptor);
        // OCQTest(0, ptor);
        // doRefresh(ptor);
        // waitForOverlay(ptor);
        // OCQTest(1, ptor);
        // doRefresh(ptor);
        // waitForOverlay(ptor);
        // DRAGTest(0, ptor);
        // doRefresh(ptor);
        // waitForOverlay(ptor);
        // DRAGTest(1, ptor);
        // doRefresh(ptor);
        // waitForOverlay(ptor);
    });

    describe('Over Video', function() {
        // MCQOCQVideo(ptor, 0);
        // MCQOCQVideo(ptor, 1);
        // DRAGVideo(ptor);
    });
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------//

    describe("Left Section", function() {
        //        it('should go to the course editor page', function(){
        //            ptor.get('/#/courses/'+course_id+'/course_editor/modules/'+module_id);
        //        })
        it('should add a new quiz', function() {
            console.log('starting add quiz');
            //            ptor.executeScript('window.scrollBy(0, -1000)', '');
            ptor.findElements(protractor.By.className('btn-mini')).then(function(buttons) {
                buttons[buttons.length - 2].click().then(function() {
                    feedback(ptor, 'created');
                });
            });
            ptor.findElements(protractor.By.className('trigger2')).then(function(quiz) {
                expect(quiz[quiz.length - 1].getText()).toBe('New Quiz');
            })
        });
        it('should open a quiz', function() {
            ptor.findElements(protractor.By.className('trigger2')).then(function(quizes) {
                quizes[quizes.length - 1].click();
            });
        });

    });
    describe("Right Section", function() {
        it('should display quiz details and allow editing it', function() {
            ptor.findElement(protractor.By.tagName('h3')).then(function(title) {
                expect(title.getText()).toBe('Quiz Details');
            });
            ptor.findElements(protractor.By.className('editable-click')).then(function(details) {
                //edit quiz name//
                expect(details[0].getText()).toBe('New Quiz');
                details[0].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.clear();
                    field.sendKeys("My Quiz");
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                    buttons[buttons.length - 2].click().then(function() {
                        feedback(ptor, 'updated');
                    });
                });
                expect(details[0].getText()).toBe('My Quiz');
                details[0].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.clear();
                    field.sendKeys("New Quiz");
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                    buttons[buttons.length - 1].click();
                });
                expect(details[0].getText()).toBe('My Quiz');
                //quiz required or not//
                expect(details[1].getText()).toBe('This Quiz is Not Required');
                details[1].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.click();
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                    buttons[buttons.length - 2].click().then(function() {
                        feedback(ptor, 'updated');
                    });
                });
                expect(details[1].getText()).toBe('This Quiz is Required');
                details[1].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.click();
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                    buttons[buttons.length - 1].click();
                });
                expect(details[1].getText()).toBe('This Quiz is Required');
                //edit quiz retries//
                expect(details[2].getText()).toBe('0');
                details[2].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.clear();
                    field.sendKeys("10")
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                    buttons[buttons.length - 2].click().then(function() {
                        feedback(ptor, 'updated');
                    });
                });
                expect(details[2].getText()).toBe('10');
                details[2].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.clear();
                    field.sendKeys("0")
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                    buttons[buttons.length - 1].click();
                });
                expect(details[2].getText()).toBe('10');
                //use module's appearance date//
                expect(details[3].getText()).toBe('Using Module\'s Appearance Date');
                details[3].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.click();
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                    buttons[buttons.length - 2].click().then(function() {
                        feedback(ptor, 'updated');
                    });
                });
                expect(details[3].getText()).toBe('Not Using Module\'s Appearance Date');
                details[3].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.click();
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                    buttons[buttons.length - 1].click();
                });
                expect(details[3].getText()).toBe('Not Using Module\'s Appearance Date');
                //------------------------------//
                //edit appearance date//
                expect(details[4].getText()).toBe(tomorrow);
                details[4].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.clear();
                    field.sendKeys(after_tomorrow_keys);
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                    buttons[buttons.length - 2].click().then(function() {
                        feedback(ptor, 'updated');
                    });
                });
                details[4].getText().then(function(text) {
                    //
                    expect(text).toBe(after_tomorrow);
                });
                details[4].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.clear();
                    field.sendKeys(tomorrow_keys);
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                    buttons[buttons.length - 1].click();
                });
                details[4].getText().then(function(text) {
                    //
                    expect(text).toBe(after_tomorrow);
                });
                
                //use module's due date//
                expect(details[5].getText()).toBe('Using Module\'s due Date');
                details[5].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.click();
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                    buttons[buttons.length - 2].click().then(function() {
                        feedback(ptor, 'updated');
                    });
                });
                expect(details[5].getText()).toBe('Not Using Module\'s due Date');
                details[5].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.click();
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                    buttons[buttons.length - 1].click();
                });
                expect(details[5].getText()).toBe('Not Using Module\'s due Date');
                //------------------------------//
                //edit due date//
                expect(details[6].getText()).toBe(next_day_week);
                details[6].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.clear();
                    field.sendKeys(next_week_keys);
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                    buttons[buttons.length - 2].click().then(function() {
                        feedback(ptor, 'updated');
                    });
                });
                details[6].getText().then(function(text) {
                    expect(text).toBe(next_week);
                });
                details[6].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.clear();
                    field.sendKeys(next_day_week_keys);
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                    buttons[buttons.length - 1].click();
                });
                details[6].getText().then(function(text) {
                    expect(text).toBe(next_week);
                });
                //edit instructions//
                expect(details[7].getText()).toBe('Please choose the correct answer(s)');
                details[7].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.clear();
                    field.sendKeys("new instructions")
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                    buttons[buttons.length - 2].click().then(function() {
                        feedback(ptor, 'updated');
                    });
                });
                expect(details[7].getText()).toBe('new instructions');
                details[7].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.clear();
                    field.sendKeys("old instructions")
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                    buttons[buttons.length - 1].click();
                });
                expect(details[7].getText()).toBe('new instructions');
            });
        });
        //refresh and see if the data remains the same//
        it('should refresh the page', function() {
            //            ptor.reload();
            ptor.navigate().refresh();
        });
        it('should make sure quiz details are correct after refreshing page', function() {
            ptor.findElements(protractor.By.className('editable-click')).then(function(details) {
                expect(details[0].getText()).toBe('My Quiz')
                expect(details[1].getText()).toBe('This Quiz is Required')
                expect(details[2].getText()).toBe('10')
                expect(details[3].getText()).toBe('Not Using Module\'s Appearance Date')
                expect(details[4].getText()).toBe(after_tomorrow)
                expect(details[5].getText()).toBe('Not Using Module\'s due Date')
                expect(details[6].getText()).toBe(next_week)
                expect(details[7].getText()).toBe('new instructions')
            });
        });
    });
    describe('Middle Section', function() {
        it('should wiat for the overlay to disappear', function(){
            ptor.wait(function(){
                return ptor.findElement(protractor.By.className('overlay')).then(function(loading){
                    return loading.isDisplayed().then(function(disp){
                        return !disp;
                    });
                });
            });
        });
        it('should allow adding questions to quiz', function() {
            ptor.findElements(protractor.By.className('btn')).then(function(buttons) {
                buttons[buttons.length - 3].click();
                ptor.findElements(protractor.By.tagName('input')).then(function(fields) {
                    fields[0].sendKeys('first MCQ question');
                    fields[1].sendKeys('first answer');
                    fields[2].click();
                });
                ptor.findElement(protractor.By.className('add_multiple_answer')).click();
                ptor.findElements(protractor.By.name('answer')).then(function(fields) {
                    fields[fields.length-1].sendKeys('second answer');
                });
                ptor.findElement(protractor.By.className('add_multiple_answer')).click();
                ptor.findElements(protractor.By.name('answer')).then(function(fields) {
                    fields[fields.length-1].sendKeys('third answer');
                });


                buttons[buttons.length - 3].click();

                ptor.findElements(protractor.By.tagName('input')).then(function(fields) {
                    fields[7].sendKeys('first OCQ question');
                    // ptor.findElement(protractor.By.tagName('select')).then(function(question_type) {
                        // question_type.click();
                        ptor.findElements(protractor.By.tagName('option')).then(function(options) {
                            options[options.length - 2].click();
                        });
                    // });

                });
                ptor.findElements(protractor.By.tagName('input')).then(function(fields) {
                    fields[8].sendKeys('first answer');
                    fields[9].click();
                });
                ptor.findElements(protractor.By.className('add_multiple_answer')).then(function(add_multiple) {
                    add_multiple[add_multiple.length - 1].click();
                });
                ptor.findElements(protractor.By.name('answer')).then(function(fields) {
                    fields[fields.length-1].sendKeys('second answer');
                });
                ptor.findElements(protractor.By.className('add_multiple_answer')).then(function(add_multiple) {
                    add_multiple[add_multiple.length - 1].click();
                });
                ptor.findElements(protractor.By.name('answer')).then(function(fields) {
                    fields[fields.length-1].sendKeys('third answer');
                });

                buttons[buttons.length - 3].click();

                ptor.findElements(protractor.By.tagName('input')).then(function(fields) {
                    fields[14].sendKeys('first DRAG question');
                    // ptor.findElements(protractor.By.tagName('select')).then(function(question_type) {
                        // question_type[question_type.length - 1].click();
                        ptor.findElements(protractor.By.tagName('option')).then(function(options) {
                            options[options.length - 1].click();
                        });
                    // });

                });
                ptor.findElements(protractor.By.name('answer')).then(function(fields) {
                    fields[fields.length-1].sendKeys('first answer');
                });
                ptor.findElements(protractor.By.className('add_multiple_answer')).then(function(add_multiple) {
                    add_multiple[add_multiple.length - 1].click();
                });
                ptor.findElements(protractor.By.name('answer')).then(function(fields) {
                    fields[fields.length-1].sendKeys('second answer');
                });
                ptor.findElements(protractor.By.className('add_multiple_answer')).then(function(add_multiple) {
                    add_multiple[add_multiple.length - 1].click();
                });
                ptor.findElements(protractor.By.name('answer')).then(function(fields) {
                    fields[fields.length-1].sendKeys('third answer');
                });
            });
        });
        it('should allow sorting DRAG question answers', function() {
            ptor.findElements(protractor.By.className('drag-item')).then(function(drag_handles) {
                ptor.actions().dragAndDrop(drag_handles[drag_handles.length - 1], drag_handles[drag_handles.length - 2]).perform();
            });
        });
        ptor.sleep('1000');
        it('should save the questions', function() {
            ptor.findElements(protractor.By.className('btn')).then(function(buttons) {
                buttons[buttons.length - 2].click().then(function() {
                    feedback(ptor, 'saved');
                });
                //                ptor.sleep(1000);
            });
        });
        //refresh and see if the data remains the same//
        it('should refresh the page', function() {
            ptor.navigate().refresh();
        });
        it('should display correct questions and answers', function() {
            ptor.findElements(protractor.By.tagName('input')).then(function(questions) {
                expect(questions[0].getAttribute('value')).toBe('first MCQ question')
                expect(questions[1].getAttribute('value')).toBe('first answer')
                expect(questions[2].getAttribute('checked')).toBe('true')
                expect(questions[3].getAttribute('value')).toBe('second answer')
                expect(questions[4].getAttribute('checked')).toBe(null);
                expect(questions[5].getAttribute('value')).toBe('third answer')
                expect(questions[6].getAttribute('checked')).toBe(null);
                expect(questions[7].getAttribute('value')).toBe('first OCQ question')
                expect(questions[8].getAttribute('value')).toBe('first answer')
                expect(questions[10].getAttribute('value')).toBe('second answer')
                expect(questions[12].getAttribute('value')).toBe('third answer')
                expect(questions[14].getAttribute('value')).toBe('first DRAG question')
                expect(questions[15].getAttribute('value')).toBe('first answer')
                expect(questions[16].getAttribute('value')).toBe('third answer')
                expect(questions[17].getAttribute('value')).toBe('second answer')
            });
        });
        //delete an answer from each question
        it('should delete an answer from each question', function() {
            ptor.findElement(protractor.By.id('middle')).then(function(middle) {
                middle.findElements(protractor.By.className('delete')).then(function(buttons) {
                    buttons[1].click().then(function() {
                        ptor.findElement(protractor.By.className('btn-danger')).then(function(button) {
                            //                                buttons[buttons.length-1].click();
                            button.click();
                        });
                    });
                    buttons[5].click().then(function() {
                        ptor.findElement(protractor.By.className('btn-danger')).then(function(button) {
                            //                                buttons[buttons.length-1].click();
                            button.click();
                        });
                    });
                    buttons[9].click().then(function() {
                        ptor.findElement(protractor.By.className('btn-danger')).then(function(button) {
                            //                                buttons[buttons.length-1].click();
                            button.click();
                        });
                    });
                });
            });
            console.log('answers should be deleted');
        });
        it('should try to save the questions after deleting answers but it should fail', function() {
            ptor.findElements(protractor.By.className('btn')).then(function(buttons) {
                buttons[buttons.length - 2].click();
                ptor.sleep(1000);
            });
            //            ptor.findElement(protractor.By.className('alert-error')).then(function(error){
            //                expect(error.getText()).toContain('errors');
            //            })
            //        var error = ptor.findElement(protractor.By.className('alert-error'));
            //        expect(error.getText()).toContain('You\'ve got some errors');
        });
        it('should select one correct answer for each question', function() {
            ptor.executeScript('window.scrollBy(0, -200)', '');
            ptor.findElement(protractor.By.name('mcq')).then(function(checkbox) {
                checkbox.click();
            });
            ptor.findElements(protractor.By.tagName('input')).then(function(fields) {
                fields[7].click();
            })
        });
        it('should try to save the questions after deleting answers and it should succeed', function() {
            ptor.findElements(protractor.By.className('btn')).then(function(buttons) {
                buttons[buttons.length - 2].click().then(function() {
                    feedback(ptor, 'saved');
                });
                //                ptor.sleep(1000);
            });
            var error = ptor.findElements(protractor.By.className('alert-error'));
            expect(error.length).toBe(undefined);
        });
        it('should refresh the page', function() {
            ptor.navigate().refresh();
        });
        it('should display correct questions and answers', function() {
            ptor.findElements(protractor.By.tagName('input')).then(function(questions) {
                expect(questions[0].getAttribute('value')).toBe('first MCQ question')
                expect(questions[1].getAttribute('value')).toBe('second answer')
                expect(questions[2].getAttribute('checked')).toBe('true')
                expect(questions[3].getAttribute('value')).toBe('third answer')
                expect(questions[4].getAttribute('checked')).toBe(null);
                expect(questions[5].getAttribute('value')).toBe('first OCQ question')
                expect(questions[6].getAttribute('value')).toBe('second answer')
                expect(questions[8].getAttribute('value')).toBe('third answer')
                expect(questions[10].getAttribute('value')).toBe('first DRAG question')
                expect(questions[11].getAttribute('value')).toBe('third answer')
                expect(questions[12].getAttribute('value')).toBe('second answer')
            });
        });
        it('should delete each question', function() {
            ptor.findElement(protractor.By.id('middle')).then(function(middle) {
                middle.findElements(protractor.By.className('delete')).then(function(buttons) {
                    buttons[0].click().then(function() {
                        ptor.findElement(protractor.By.className('btn-danger')).then(function(button) {
                            //                                buttons[buttons.length-1].click();
                            button.click();
                        });
                    })
                    buttons[3].click().then(function() {
                        ptor.findElement(protractor.By.className('btn-danger')).then(function(button) {
                            //                                buttons[buttons.length-1].click();
                            button.click();
                        });
                    })
                    buttons[6].click().then(function() {
                        ptor.findElement(protractor.By.className('btn-danger')).then(function(button) {
                            //                                buttons[buttons.length-1].click();
                            button.click();
                        });
                    })
                })
            })
            ptor.findElements(protractor.By.className('btn')).then(function(buttons) {
                buttons[buttons.length - 2].click().then(function() {
                    feedback(ptor, 'saved');
                });
                //                ptor.sleep(1000);
            });
        });
        it('should refresh the page', function() {
            ptor.navigate().refresh();
        });
        it('should display 0 questions', function() {
            ptor.findElement(protractor.By.id('middle')).then(function(middle){
                middle.findElements(protractor.By.tagName('label')).then(function(questions) {
                    expect(questions.length).toBe(0);
                });
            });
        });
    });
    describe('Left Section', function() {
        it('should add a new survey', function() {
            ptor.findElements(protractor.By.className('btn-mini')).then(function(buttons) {
                buttons[buttons.length - 1].click().then(function() {
                    feedback(ptor, 'created');
                });
            });
            ptor.findElements(protractor.By.className('trigger2')).then(function(quiz) {
                expect(quiz[quiz.length - 1].getText()).toBe('New Survey');
            })
        });
        it('should open a survey', function() {
            ptor.findElements(protractor.By.className('trigger2')).then(function(quizes) {
                quizes[quizes.length - 1].click();
            });
        });
    });
    describe('Right Section', function() {
        it('should display survey details and allow editing it', function() {
            ptor.findElements(protractor.By.tagName('h3')).then(function(titles) {
                expect(titles[1].getText()).toBe('Survey Details');
            });
            ptor.findElements(protractor.By.className('editable-click')).then(function(details) {
                //edit quiz name//
                expect(details[0].getText()).toBe('New Survey');
                details[0].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.clear();
                    field.sendKeys("My Survey");
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                    buttons[buttons.length - 2].click().then(function() {
                        feedback(ptor, 'updated');
                    });
                });
                expect(details[0].getText()).toBe('My Survey');
                details[0].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.clear();
                    field.sendKeys("New Survey");
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                    buttons[buttons.length - 1].click();
                });
                expect(details[0].getText()).toBe('My Survey');
                //use module's appearance date//
                expect(details[1].getText()).toBe('Using Module\'s Appearance Date');
                details[1].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.click();
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                    buttons[buttons.length - 2].click().then(function() {
                        feedback(ptor, 'updated');
                    });
                });
                expect(details[1].getText()).toBe('Not Using Module\'s Appearance Date');
                details[1].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.click();
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                    buttons[buttons.length - 1].click();
                });
                expect(details[1].getText()).toBe('Not Using Module\'s Appearance Date');
                //----------------------//
                //edit appearance date//
                expect(details[2].getText()).toBe(tomorrow);
                details[2].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.clear();
                    field.sendKeys(after_tomorrow_keys);
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                    buttons[buttons.length - 2].click().then(function() {
                        feedback(ptor, 'updated');
                    });
                });
                details[2].getText().then(function(text) {
                    expect(text).toBe(after_tomorrow);
                });
                details[2].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.clear();
                    field.sendKeys(tomorrow_keys);
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                    buttons[buttons.length - 1].click();
                });
                details[2].getText().then(function(text) {
                    expect(text).toBe(after_tomorrow);
                });

                //use module's due date//
                expect(details[3].getText()).toBe('Using Module\'s due Date');
                details[3].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.click();
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                    buttons[buttons.length - 2].click().then(function() {
                        feedback(ptor, 'updated');
                    });
                });
                expect(details[3].getText()).toBe('Not Using Module\'s due Date');
                details[3].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.click();
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                    buttons[buttons.length - 1].click();
                });
                expect(details[3].getText()).toBe('Not Using Module\'s due Date');
                //----------------------//
                //edit due date//
                expect(details[4].getText()).toBe(next_day_week);
                details[4].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.clear();
                    field.sendKeys(next_week_keys);
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                    buttons[buttons.length - 2].click().then(function() {
                        feedback(ptor, 'updated');
                    });
                });
                details[4].getText().then(function(text) {
                    expect(text).toBe(next_week);
                });
                details[4].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.clear();
                    field.sendKeys(next_day_week_keys);
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                    buttons[buttons.length - 1].click();
                });
                details[4].getText().then(function(text) {
                    expect(text).toBe(next_week);
                });
                //edit instructions//
                expect(details[5].getText()).toBe('Please fill in the survey.');
                details[5].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.clear();
                    field.sendKeys("new instructions")
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                    buttons[buttons.length - 2].click().then(function() {
                        feedback(ptor, 'updated');
                    });
                });
                expect(details[5].getText()).toBe('new instructions');
                details[5].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                    field.clear();
                    field.sendKeys("old instructions")
                });
                ptor.findElements(protractor.By.tagName('button')).then(function(buttons) {
                    buttons[buttons.length - 1].click();
                });
                expect(details[5].getText()).toBe('new instructions');
            });
        });
        //refresh and see if the data remains the same//
        it('should refresh the page', function() {
            //            ptor.reload();
            ptor.navigate().refresh();
        });
        it('should make sure survey details are correct after refreshing page', function() {
            ptor.findElements(protractor.By.className('editable-click')).then(function(details) {
                expect(details[0].getText()).toBe('My Survey')
                expect(details[1].getText()).toBe('Not Using Module\'s Appearance Date')
                expect(details[2].getText()).toBe(after_tomorrow)
                expect(details[3].getText()).toBe('Not Using Module\'s due Date')
                expect(details[4].getText()).toBe(next_week)
                expect(details[5].getText()).toBe('new instructions')
            });
        });
    });
    describe('Middle Section', function() {
        it('should allow adding questions to survey', function() {
            ptor.findElements(protractor.By.className('btn')).then(function(buttons) {
                buttons[buttons.length - 3].click();
                ptor.findElements(protractor.By.tagName('input')).then(function(fields) {
                    fields[0].sendKeys('first MCQ question');
                    fields[1].sendKeys('first answer');
                });
                ptor.findElement(protractor.By.className('add_multiple_answer')).click();
                ptor.findElements(protractor.By.name('answer')).then(function(fields) {
                    fields[fields.length - 1].sendKeys('second answer');
                });
                ptor.findElement(protractor.By.className('add_multiple_answer')).click();
                ptor.findElements(protractor.By.name('answer')).then(function(fields) {
                    fields[fields.length - 1].sendKeys('third answer');
                });


                buttons[buttons.length - 3].click();

                ptor.findElements(protractor.By.tagName('input')).then(function(fields) {
                    fields[4].sendKeys('first OCQ question');
                    // ptor.findElement(protractor.By.tagName('select')).then(function(question_type) {
                        // question_type.click();
                        ptor.findElements(protractor.By.tagName('option')).then(function(options) {
                            options[options.length - 2].click();
                        });
                    // });

                });
                ptor.findElements(protractor.By.tagName('input')).then(function(fields) {
                    fields[5].sendKeys('first answer');
                });
                ptor.findElements(protractor.By.className('add_multiple_answer')).then(function(add_multiple) {
                    add_multiple[add_multiple.length - 1].click();
                });
                ptor.findElements(protractor.By.name('answer')).then(function(fields) {
                    fields[fields.length-1].sendKeys('second answer');
                });
                ptor.findElements(protractor.By.className('add_multiple_answer')).then(function(add_multiple) {
                    add_multiple[add_multiple.length - 1].click();
                });
                ptor.findElements(protractor.By.name('answer')).then(function(fields) {
                    fields[fields.length-1].sendKeys('third answer');
                });

                buttons[buttons.length - 3].click();

                ptor.findElements(protractor.By.tagName('input')).then(function(fields) {
                    fields[8].sendKeys('first FREE TEXT question');
                    // ptor.findElements(protractor.By.tagName('select')).then(function(question_type) {
                        // question_type[question_type.length - 1].click();
                        ptor.findElements(protractor.By.tagName('option')).then(function(options) {
                            options[options.length - 1].click();
                        });
                    // });

                });
            });
        });
        it('should save the questions', function() {
            ptor.findElements(protractor.By.className('btn')).then(function(buttons) {
                buttons[buttons.length - 2].click().then(function() {
                    feedback(ptor, 'saved');
                });
                //                ptor.sleep(1000);
            });
        });
        //refresh and see if the data remains the same//
        it('should refresh the page', function() {
            ptor.navigate().refresh();
        });
        it('should display correct questions and answers', function() {
            ptor.findElements(protractor.By.tagName('input')).then(function(questions) {
                expect(questions[0].getAttribute('value')).toBe('first MCQ question')
                expect(questions[1].getAttribute('value')).toBe('first answer')
                expect(questions[2].getAttribute('value')).toBe('second answer')
                expect(questions[3].getAttribute('value')).toBe('third answer')
                expect(questions[4].getAttribute('value')).toBe('first OCQ question')
                expect(questions[5].getAttribute('value')).toBe('first answer')
                expect(questions[6].getAttribute('value')).toBe('second answer')
                expect(questions[7].getAttribute('value')).toBe('third answer')
                expect(questions[8].getAttribute('value')).toBe('first FREE TEXT question')
            });
        });
        //delete an answer from each question
        it('should delete an answer from each question', function() {
            ptor.findElement(protractor.By.id('middle')).then(function(middle) {
                middle.findElements(protractor.By.className('delete')).then(function(buttons) {
                    buttons[1].click().then(function() {
                        ptor.findElement(protractor.By.className('btn-danger')).then(function(button) {
                            //                                buttons[buttons.length-1].click();
                            button.click();
                        });
                    });
                    buttons[5].click().then(function() {
                        ptor.findElement(protractor.By.className('btn-danger')).then(function(button) {
                            //                                buttons[buttons.length-1].click();
                            button.click();
                        });
                    });
                });
            });
        });
        it('should try to save the questions after deleting answers', function() {
            ptor.findElements(protractor.By.className('btn')).then(function(buttons) {
                buttons[buttons.length - 2].click().then(function() {
                    feedback(ptor, 'saved');
                });
                //                ptor.sleep(1000);
            });
            var error = ptor.findElements(protractor.By.className('alert-error'));
            expect(error.length).toBe(undefined);
        });
        it('should refresh the page', function() {
            ptor.navigate().refresh();
        });
        waitForOverlay(ptor);
        it('should display correct questions and answers', function() {
            ptor.findElements(protractor.By.tagName('input')).then(function(questions) {
                expect(questions[0].getAttribute('value')).toBe('first MCQ question')
                expect(questions[1].getAttribute('value')).toBe('second answer')
                expect(questions[2].getAttribute('value')).toBe('third answer')
                expect(questions[3].getAttribute('value')).toBe('first OCQ question')
                expect(questions[4].getAttribute('value')).toBe('second answer')
                expect(questions[5].getAttribute('value')).toBe('third answer')
                expect(questions[6].getAttribute('value')).toBe('first FREE TEXT question')
            });
        });
        it('should delete each question', function() {
            ptor.findElement(protractor.By.id('middle')).then(function(middle) {
                middle.findElements(protractor.By.className('delete')).then(function(buttons) {
                    buttons[0].click().then(function() {
                        ptor.findElement(protractor.By.className('btn-danger')).then(function(button) {
                            //                                buttons[buttons.length-1].click();
                            button.click();
                        });
                    });
                    buttons[3].click().then(function() {
                        ptor.findElement(protractor.By.className('btn-danger')).then(function(button) {
                            //                                buttons[buttons.length-1].click();
                            button.click();
                        });
                    });
                    buttons[6].click().then(function() {
                        ptor.findElement(protractor.By.className('btn-danger')).then(function(button) {
                            //                                buttons[buttons.length-1].click();
                            button.click();
                        });
                    });
                });
            });
            ptor.executeScript('window.scrollBy(0, -2000)', '');
            ptor.findElements(protractor.By.className('btn-primary')).then(function(buttons) {
                buttons[0].click().then(function() {
                    feedback(ptor, 'saved');
                });
                //                ptor.sleep(1000);
            });
        });
        it('should refresh the page', function() {
            ptor.navigate().refresh();
        });
        it('should display 0 questions', function() {
            ptor.findElement(protractor.By.id('middle')).then(function(middle){
                middle.findElements(protractor.By.tagName('label')).then(function(questions) {
                    expect(questions.length).toBe(0);
                });
            })
        });
    });
    describe('Left Section', function() {
        it('should allow sorting quizes, lectures, and surveys', function() {
            ptor.findElements(protractor.By.className('handle')).then(function(handles) {
                ptor.actions().dragAndDrop(handles[handles.length - 1], handles[handles.length - 2]).perform().then(function() {
                    feedback(ptor, 'Sorted');
                });
            });
            //            ptor.sleep(1000);
            ptor.findElements(protractor.By.className('trigger2')).then(function(triggers2) {
                expect(triggers2[triggers2.length - 2].getText()).toBe('My Survey');
                expect(triggers2[triggers2.length - 1].getText()).toBe('My Quiz');
            });
        });
        it('should allow sorting the modules by drag and drop', function() {
            ptor.findElements(protractor.By.className('trigger')).then(function(modules) {
                modules[modules.length - 1].click();
            });
            ptor.findElements(protractor.By.className('handle')).then(function(handles) {
                ptor.actions().dragAndDrop(handles[handles.length - 4], handles[0]).perform().then(function() {
                    feedback(ptor, 'Sorted');
                });
                ptor.sleep(1000);
            });
            ptor.findElements(protractor.By.className('trigger')).then(function(triggers) {
                expect(triggers[triggers.length - 2].getText()).toBe('2');
                expect(triggers[triggers.length - 1].getText()).toBe('1');
            });
        });
    });
    describe('Left Section', function() {
        it('should delete All lectures and modules', function() {
            ptor.findElements(protractor.By.className('module')).then(function(modules) {
                for (var i = modules.length - 1; i >= 0; i--) {
                    modules[i].click()
                    modules[i].findElements(protractor.By.className('delete')).then(function(delete_buttons) {
                        //                        console.log(delete_buttons.length)
                        for (var n = delete_buttons.length - 1; n >= 0; n--) {
                            delete_buttons[n].click().then(function() {
                                ptor.findElement(protractor.By.className('btn-danger')).click().then(function() {
                                    feedback(ptor, 'deleted');
                                });
                            });
                        }
                    });
                }
            });
        });
        it('should delete the created course', function() {
            ptor.get('/#/courses');
            ptor.findElements(protractor.By.className('delete')).then(function(delete_buttons) {
                delete_buttons[delete_buttons.length - 1].click();
                ptor.findElements(protractor.By.className('btn-danger')).then(function(danger_button) {
                    danger_button[danger_button.length - 1].click().then(function() {
                        feedback(ptor, 'deleted');
                    });
                });
            });
        });
    });
});

//-----------------------//
//functions

function MCQTest(mode, ptor) {
    //    doRefresh(ptor);
    it('should sleep', function() {
        ptor.sleep(10000);
    });
    var modeName = 'normal';
    if (mode == 1) {
        modeName = 'fullscreen';
        it('should go to fullscreen mode', function() {
            ptor.executeScript('window.scrollBy(0, -2000)', '');
            ptor.findElement(protractor.By.className('fullscreenLink')).then(function(fullscreen_button) {
                fullscreen_button.click();
            });
        });

    }
    it('should insert an MCQ quiz in ' + modeName + ' mode', function() {
        console.log('starting MCQ ' + modeName);
        ptor.findElements(protractor.By.className('dropdown-toggle')).then(function(lists) {
            lists[2].click();
        });
        ptor.findElements(protractor.By.className('insertQuiz')).then(function(options) {
            options[3].click().then(function() {
                feedback(ptor, 'created');
            });
        });
        ptor.findElement(protractor.By.className('ontop')).then(function(container) {
            container.isDisplayed().then(function(disp) {
                expect(disp).toBe(true);
            });
        });
        ptor.findElement(protractor.By.id('editing')).then(function(editing) {
            expect(editing.getText()).toContain('New Quiz');
        });
        ptor.findElements(protractor.By.tagName('editable_text')).then(function(editables) {
            expect(editables[0].getText()).toBe('New Quiz');
            //edit quiz name
            ptor.actions().mouseMove(editables[0]).perform().then(function(){
                editables[0].findElement(protractor.By.className('icon-pencil')).then(function(edit){
                    edit.click();
                })
            });
            // ptor.actions().doubleClick(editables[0]).perform();
            ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                field.clear();
                field.sendKeys('My Quiz');
                ptor.findElements(protractor.By.className('btn-primary')).then(function(buttons) {
                    buttons[1].click().then(function() {
                        feedback(ptor, 'updated');
                    });
                });
            });
            expect(editables[0].getText()).toBe('My Quiz');
            // ptor.actions().doubleClick(editables[0]).perform();
            ptor.actions().mouseMove(editables[0]).perform().then(function(){
                editables[0].findElement(protractor.By.className('icon-pencil')).then(function(edit){
                    edit.click();
                })
            });
            ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                field.clear();
                field.sendKeys('New Quiz');
                ptor.findElement(protractor.By.className('icon-remove')).then(function(remove_button) {
                    remove_button.click();
                });
            });
            expect(editables[0].getText()).toBe('My Quiz');
            //                edit quiz time
            //                HAS A BUG RIGHT NOW
            //                make sure quiz type is MCQ
            ptor.findElements(protractor.By.tagName('td')).then(function(data) {
                expect(data[6].getText()).toBe('MCQ');
            });
        });
    });
    //enter the answers
    it('should add answers and explanations to MCQ quiz', function() {
        ptor.findElements(protractor.By.name('answer')).then(function(fields) {
            fields[fields.length - 1].sendKeys('first answer');
        });
        ptor.findElements(protractor.By.className('explain')).then(function(fields) {
            fields[fields.length - 1].sendKeys('first Explanation');
        });
        ptor.findElement(protractor.By.className('add_multiple_answer')).click();
        ptor.findElements(protractor.By.name('answer')).then(function(fields) {
            fields[fields.length - 1].sendKeys('second answer');
        });
        ptor.findElements(protractor.By.className('explain')).then(function(fields) {
            fields[fields.length - 1].sendKeys('second Explanation');
        });
        ptor.findElement(protractor.By.className('add_multiple_answer')).click();
        ptor.findElements(protractor.By.name('answer')).then(function(fields) {
            fields[fields.length - 1].sendKeys('third answer');
        });
        ptor.findElements(protractor.By.className('explain')).then(function(fields) {
            fields[fields.length - 1].sendKeys('third Explanation');
        });
    });
    //try to save
    //expect it to fail
    it('should try to save when no answer is marked correct and it should fail', function() {
        ptor.findElement(protractor.By.className('btn-primary')).then(function(save_button) {
            save_button.click();
        });
        ptor.sleep(2000);
        ////        ptor.findElement(protractor.By.id('middle')).then(function(middle){
        //            ptor.findElements(protractor.By.className('alert-error')).then(function(errors){
        //                errors[errors.length-3].getText().then(function(value){
        //                    console.log(value);
        //                })
        //                expect(error.getText()).toContain('errors');
        //            });
        ////        });
        //        var error = ptor.findElement(protractor.By.className('alert-error'));
        //        expect(error.getText()).toContain('You\'ve got some errors');
    });
    //check correct answer
    //save
    it('should mark an answer as correct', function() {
        ptor.findElement(protractor.By.name('mcq')).then(function(correct_check) {
            correct_check.click();
        });
        ptor.findElement(protractor.By.className('btn-primary')).then(function(save_button) {
            save_button.click().then(function() {
                feedback(ptor, 'saved');
            });
        });
        var error = ptor.findElement(protractor.By.className('alert-error'));
        expect(error.getText()).toBe('');
    });
    //    waitForFeedback(ptor);
    it('should refresh the page', function() {
        ptor.navigate().refresh();
        ptor.sleep(7000);
    });
    waitForOverlay(ptor);
    if (mode == 1) {
        it('should go to fullscreen mode', function() {
            ptor.findElement(protractor.By.className('fullscreenLink')).then(function(fullscreen_button) {
                fullscreen_button.click();
            });
        });
    }
    it('should open the quiz after refresh', function() {
        ptor.findElement(protractor.By.tagName('editable_text')).then(function(editable) {
            editable.click();
        });
    });
    it('should make sure the mcq quiz data is the same after refresh', function() {
        //check quiz data
        ptor.findElement(protractor.By.name('qlabel')).then(function(question_label) {
            expect(question_label.getAttribute('value')).toBe('My Quiz');
        });
        ptor.findElements(protractor.By.name('answer')).then(function(answers) {
            expect(answers[0].getAttribute('value')).toBe('first answer');
            expect(answers[1].getAttribute('value')).toBe('second answer');
            expect(answers[2].getAttribute('value')).toBe('third answer');
            //                expect(answers[0].getText()).toBe('first answer');
            //                expect(answers[1].getText()).toBe('second answer');
            //                expect(answers[2].getText()).toBe('third answer');
        });
        ptor.findElement(protractor.By.name('mcq')).then(function(correct) {
            expect(correct.getAttribute('checked')).toBe('true');
        });
        ptor.findElements(protractor.By.className('explain')).then(function(explanations) {
            expect(explanations[0].getAttribute('value')).toBe('first Explanation');
            expect(explanations[1].getAttribute('value')).toBe('second Explanation');
            expect(explanations[2].getAttribute('value')).toBe('third Explanation');
        });
    });
    //answer deletion
    it('should delete an answer from mcq quiz', function() {
        ptor.findElements(protractor.By.className('delete')).then(function(delete_buttons) {
            delete_buttons[delete_buttons.length - 4].click().then(function() {
                ptor.findElement(protractor.By.className('btn-danger')).then(function(button) {
                    //                                buttons[buttons.length-1].click();
                    button.click();
                });
            });
        });
    });
    it('should select a correct answer after deletion (mcq)', function() {
        ptor.findElement(protractor.By.name('mcq')).then(function(correct_check) {
            correct_check.click();
        });
    });
    it('should save mcq quiz after deleting an answer', function() {
        ptor.findElement(protractor.By.className('btn-primary')).then(function(save_button) {
            save_button.click().then(function() {
                feedback(ptor, 'saved');
            });
        });
        var error = ptor.findElement(protractor.By.className('alert-error'));
        expect(error.getText()).toBe('');
    });
    //    waitForFeedback(ptor);
    it('should refresh the page', function() {
        ptor.navigate().refresh();
        ptor.sleep(7000);
    });
    waitForOverlay(ptor);
    if (mode == 1) {
        it('should go to fullscreen mode', function() {
            ptor.findElement(protractor.By.className('fullscreenLink')).then(function(fullscreen_button) {
                fullscreen_button.click();
            });
        });
    }
    it('should open the quiz after refresh', function() {
        ptor.executeScript('window.scrollBy(0, 1000)', '');
        ptor.findElement(protractor.By.tagName('editable_text')).then(function(editable) {
            editable.click();
        });
    });
    it('should make sure the mcq quiz data is the same after deletion then refresh', function() {
        //check quiz data
        ptor.findElement(protractor.By.name('qlabel')).then(function(question_label) {
            expect(question_label.getAttribute('value')).toBe('My Quiz');
        });
        ptor.findElements(protractor.By.name('answer')).then(function(answers) {
            expect(answers[0].getAttribute('value')).toBe('second answer');
            expect(answers[1].getAttribute('value')).toBe('third answer');
        });
        ptor.findElement(protractor.By.name('mcq')).then(function(correct) {
            expect(correct.getAttribute('checked')).toBe('true');
        });
        ptor.findElements(protractor.By.className('explain')).then(function(explanations) {
            expect(explanations[0].getAttribute('value')).toBe('second Explanation');
            expect(explanations[1].getAttribute('value')).toBe('third Explanation');
        });
    });
    it('should delete mcq quiz (text)', function() {
        ptor.findElements(protractor.By.className('delete')).then(function(delete_buttons) {
            delete_buttons[delete_buttons.length - 1].click().then(function() {
                ptor.findElement(protractor.By.className('btn-danger')).then(function(button) {
                    //                                buttons[buttons.length-1].click();
                    button.click().then(function() {
                        feedback(ptor, 'deleted');
                    });
                });
            });
        });
        ptor.findElements(protractor.By.tagName('editable_text')).then(function(editables) {
            expect(editables.length).toBe(0);
        });
    });
    if (mode == 1) {
        it('should exit fullscreen mode', function() {
            console.log('exiting fullscreen mode');
            ptor.findElements(protractor.By.className('fullscreenLink')).then(function(links) {
                links[1].click();
            });
        });
    }
}

function OCQTest(mode, ptor) {

    var modeName = 'normal';
    if (mode == 1) {
        modeName = 'fullscreen';
        it('should go to fullscreen mode', function() {
            ptor.executeScript('window.scrollBy(0, -2000)', '');
            ptor.findElement(protractor.By.className('fullscreenLink')).then(function(fullscreen_button) {
                fullscreen_button.click();
            });
        });
    }
    it('should insert an OCQ quiz in ' + modeName + ' mode', function() {
        console.log('starting OCQ ' + modeName);
        ptor.findElements(protractor.By.className('dropdown-toggle')).then(function(lists) {
            lists[lists.length - 1].click();
        });
        ptor.findElements(protractor.By.className('insertQuiz')).then(function(options) {
            options[4].click().then(function() {
                feedback(ptor, 'created');
            });
        });
        ptor.findElement(protractor.By.className('ontop')).then(function(container) {
            container.isDisplayed().then(function(disp) {
                expect(disp).toBe(true);
            });
        });
        ptor.findElement(protractor.By.id('editing')).then(function(editing) {
            expect(editing.getText()).toContain('New Quiz');
        });
        ptor.findElements(protractor.By.tagName('editable_text')).then(function(editables) {
            expect(editables[0].getText()).toBe('New Quiz');
            //edit quiz name
            ptor.actions().doubleClick(editables[0]).perform();
            ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                field.clear();
                field.sendKeys('My Quiz');
                ptor.findElements(protractor.By.className('btn-primary')).then(function(buttons) {
                    buttons[1].click().then(function() {
                        feedback(ptor, 'updated');
                    });
                });
            });
            expect(editables[0].getText()).toBe('My Quiz');
            ptor.actions().doubleClick(editables[0]).perform();
            ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                field.clear();
                field.sendKeys('New Quiz');
                ptor.findElement(protractor.By.className('icon-remove')).then(function(remove_button) {
                    remove_button.click();
                });
            });
            expect(editables[0].getText()).toBe('My Quiz');
            //                edit quiz time
            //                HAS A BUG RIGHT NOW
            //                make sure quiz type is MCQ
            ptor.findElements(protractor.By.tagName('td')).then(function(data) {
                expect(data[6].getText()).toBe('OCQ');
            });
        });
    });
    //enter the answers
    it('should add answers and explanations to OCQ quiz', function() {
        ptor.findElements(protractor.By.name('answer')).then(function(fields) {
            fields[fields.length - 1].sendKeys('first answer');
        });
        ptor.findElements(protractor.By.className('explain')).then(function(fields) {
            fields[fields.length - 1].sendKeys('first Explanation');
        });
        ptor.findElement(protractor.By.className('add_multiple_answer')).click();
        ptor.findElements(protractor.By.name('answer')).then(function(fields) {
            fields[fields.length - 1].sendKeys('second answer');
        });
        ptor.findElements(protractor.By.className('explain')).then(function(fields) {
            fields[fields.length - 1].sendKeys('second Explanation');
        });
        ptor.findElement(protractor.By.className('add_multiple_answer')).click();
        ptor.findElements(protractor.By.name('answer')).then(function(fields) {
            fields[fields.length - 1].sendKeys('third answer');
        });
        ptor.findElements(protractor.By.className('explain')).then(function(fields) {
            fields[fields.length - 1].sendKeys('third Explanation');
        });
    });
    //try to save
    //expect it to fail
    it('should try to save when no answer is marked correct and it should fail', function() {
        ptor.findElement(protractor.By.className('btn-primary')).then(function(save_button) {
            save_button.click();
        });
        ptor.sleep(2000);
        ////        ptor.findElement(protractor.By.id('middle')).then(function(middle){
        //        ptor.findElements(protractor.By.className('alert-error')).then(function(errors){
        //            errors[errors.length-3].getText().then(function(value){
        //                console.log(value);
        //            })
        //            expect(error.getText()).toContain('errors');
        //        });
        ////        });
        //        var error = ptor.findElement(protractor.By.className('alert-error'));
        //        expect(error.getText()).toContain('You\'ve got some errors');
    });
    //check correct answer
    //save
    it('should mark an answer as correct', function() {
        ptor.findElement(protractor.By.id('radio_correct')).then(function(correct_radio) {
            correct_radio.click();
        });
        ptor.findElement(protractor.By.className('btn-primary')).then(function(save_button) {
            save_button.click().then(function() {
                feedback(ptor, 'saved');
            });
        });
        var error = ptor.findElement(protractor.By.className('alert-error'));
        expect(error.getText()).toBe('');
    });
    //    waitForFeedback(ptor);
    it('should refresh the page', function() {
        ptor.navigate().refresh();
        ptor.sleep(7000);
    });
    waitForOverlay(ptor);
    if (mode == 1) {
        it('should go to fullscreen mode', function() {
            ptor.findElement(protractor.By.className('fullscreenLink')).then(function(fullscreen_button) {
                fullscreen_button.click();
            });
        });
    }
    it('should open the quiz after refresh', function() {
        ptor.executeScript('window.scrollBy(0, 1000)', '');
        ptor.findElement(protractor.By.tagName('editable_text')).then(function(editable) {
            editable.click().then(function() {
                ptor.sleep(3000);
            });
        });
    });
    it('should make sure the OCQ quiz data is the same after refresh', function() {
        //check quiz data
        ptor.findElement(protractor.By.name('qlabel')).then(function(question_label) {
            expect(question_label.getAttribute('value')).toBe('My Quiz');
        });
        ptor.findElements(protractor.By.name('answer')).then(function(answers) {
            expect(answers[0].getAttribute('value')).toBe('first answer');
            expect(answers[1].getAttribute('value')).toBe('second answer');
            expect(answers[2].getAttribute('value')).toBe('third answer');
        });
        //        ptor.findElement(protractor.By.id('radio_correct')).then(function(correct){
        //            expect(correct.getAttribute('checked')).toBe('true');
        //        });
        ptor.findElements(protractor.By.className('explain')).then(function(explanations) {
            expect(explanations[0].getAttribute('value')).toBe('first Explanation');
            expect(explanations[1].getAttribute('value')).toBe('second Explanation');
            expect(explanations[2].getAttribute('value')).toBe('third Explanation');
        });
    });
    //answer deletion
    it('should delete an answer from OCQ quiz', function() {
        ptor.findElements(protractor.By.className('delete')).then(function(delete_buttons) {
            delete_buttons[delete_buttons.length - 4].click().then(function() {
                ptor.findElement(protractor.By.className('btn-danger')).then(function(button) {
                    //                                buttons[buttons.length-1].click();
                    button.click();
                });
            });
        });
    });
    it('should select a correct answer after deletion (OCQ)', function() {
        ptor.findElement(protractor.By.id('radio_correct')).then(function(correct_check) {
            correct_check.click();
        });
    });
    it('should save OCQ quiz after deleting an answer', function() {
        ptor.findElement(protractor.By.className('btn-primary')).then(function(save_button) {
            save_button.click().then(function() {
                feedback(ptor, 'saved');
            });
        });
        var error = ptor.findElement(protractor.By.className('alert-error'));
        expect(error.getText()).toBe('');
    });
    //    waitForFeedback(ptor);
    it('should refresh the page', function() {
        ptor.navigate().refresh();
        ptor.sleep(7000);
    });
    waitForOverlay(ptor);
    if (mode == 1) {
        it('should go to fullscreen mode', function() {
            ptor.findElement(protractor.By.className('fullscreenLink')).then(function(fullscreen_button) {
                fullscreen_button.click();
            });
        });
    }
    it('should open the quiz after refresh', function() {
        ptor.executeScript('window.scrollBy(0, 1000)', '');
        ptor.findElement(protractor.By.tagName('editable_text')).then(function(editable) {
            editable.click().then(function() {
                ptor.sleep(3000);
            });
        });
    });
    it('should make sure the OCQ quiz data is the same after deletion', function() {
        //check quiz data
        ptor.findElement(protractor.By.name('qlabel')).then(function(question_label) {
            expect(question_label.getAttribute('value')).toBe('My Quiz');
        });
        ptor.findElements(protractor.By.name('answer')).then(function(answers) {
            expect(answers[0].getAttribute('value')).toBe('second answer');
            expect(answers[1].getAttribute('value')).toBe('third answer');
        });
        //        ptor.findElement(protractor.By.name('mcq')).then(function(correct){
        //            expect(correct.getAttribute('checked')).toBe('true');
        //        });
        ptor.findElements(protractor.By.className('explain')).then(function(explanations) {
            expect(explanations[0].getAttribute('value')).toBe('second Explanation');
            expect(explanations[1].getAttribute('value')).toBe('third Explanation');
        });
    });
    it('should delete OCQ quiz (text)', function() {
        ptor.findElements(protractor.By.className('delete')).then(function(delete_buttons) {
            delete_buttons[delete_buttons.length - 1].click().then(function() {
                ptor.findElement(protractor.By.className('btn-danger')).then(function(button) {
                    //                                buttons[buttons.length-1].click();
                    button.click().then(function() {
                        feedback(ptor, 'deleted');
                    });
                });
            });

        });
        ptor.findElements(protractor.By.tagName('editable_text')).then(function(editables) {
            expect(editables.length).toBe(0);
        });
    });
    if (mode == 1) {
        it('should exit fullscreen mode', function() {
            console.log('exiting fullscreen mode');
            ptor.findElements(protractor.By.className('fullscreenLink')).then(function(links) {
                links[links.length - 1].click();
            });
        });
    }
}

function DRAGTest(mode, ptor) {
    var modeName = 'normal';
    if (mode == 1) {
        modeName = 'fullscreen';
        it('should go to fullscreen mode', function() {
            ptor.executeScript('window.scrollBy(0, -2000)', '');
            ptor.findElement(protractor.By.className('fullscreenLink')).then(function(fullscreen_button) {
                fullscreen_button.click();
            });
        });
    }
    it('should insert a DRAG quiz in ' + modeName + ' mode', function() {
        console.log('starting DRAG ' + modeName);
        ptor.findElements(protractor.By.className('dropdown-toggle')).then(function(lists) {
            lists[lists.length - 1].click();
        });
        ptor.findElements(protractor.By.className('insertQuiz')).then(function(options) {
            options[5].click().then(function() {
                feedback(ptor, 'created');
            });
        });
        ptor.findElement(protractor.By.className('ontop')).then(function(container) {
            container.isDisplayed().then(function(disp) {
                expect(disp).toBe(true);
            });
        });
        ptor.findElement(protractor.By.id('editing')).then(function(editing) {
            expect(editing.getText()).toContain('New Quiz');
        });
        ptor.findElements(protractor.By.tagName('editable_text')).then(function(editables) {
            expect(editables[0].getText()).toBe('New Quiz');
            //edit quiz name
            ptor.actions().doubleClick(editables[0]).perform();
            ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                field.clear();
                field.sendKeys('My Quiz');
                ptor.findElements(protractor.By.className('btn-primary')).then(function(buttons) {
                    buttons[1].click().then(function() {
                        feedback(ptor, 'updated');
                    });
                });
            });
            expect(editables[0].getText()).toBe('My Quiz');
            ptor.actions().doubleClick(editables[0]).perform();
            ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                field.clear();
                field.sendKeys('New Quiz');
                ptor.findElement(protractor.By.className('icon-remove')).then(function(remove_button) {
                    remove_button.click();
                });
            });
            expect(editables[0].getText()).toBe('My Quiz');
            //                edit quiz time
            //                HAS A BUG RIGHT NOW
            //                make sure quiz type is MCQ
            ptor.findElements(protractor.By.tagName('td')).then(function(data) {
                expect(data[6].getText()).toBe('drag');
            });
        });
    });
    //enter the answers
    it('should add answers to DRAG quiz', function() {
        ptor.findElements(protractor.By.name('answer')).then(function(fields) {
            fields[fields.length - 1].sendKeys('first answer');
        });
        ptor.findElement(protractor.By.className('add_multiple_answer')).click();
        ptor.findElements(protractor.By.name('answer')).then(function(fields) {
            fields[fields.length - 1].sendKeys('second answer');
        });
        ptor.findElement(protractor.By.className('add_multiple_answer')).click();
        ptor.findElements(protractor.By.name('answer')).then(function(fields) {
            fields[fields.length - 1].sendKeys('third answer');
        });
    });
    it('should sort the answers', function() {
        ptor.findElements(protractor.By.className('drag-item')).then(function(drag_items) {
            ptor.actions().dragAndDrop(drag_items[1], drag_items[0]).perform();
        });
        ptor.findElements(protractor.By.name('answer')).then(function(answers) {
            expect(answers[0].getAttribute('value')).toBe('second answer');
            expect(answers[1].getAttribute('value')).toBe('first answer');
            expect(answers[2].getAttribute('value')).toBe('third answer');
        });
    });
    //try to save
    //expected to succeed
    it('should save the DRAG quiz', function() {
        ptor.findElement(protractor.By.className('btn-primary')).then(function(save_button) {
            save_button.click().then(function() {
                feedback(ptor, 'saved');
            });
        });
        var error = ptor.findElement(protractor.By.className('alert-error'));
        expect(error.getText()).toBe('');
    });
    //    waitForFeedback(ptor);
    it('should refresh the page', function() {
        ptor.navigate().refresh();
        ptor.sleep(7000);
    });
    waitForOverlay(ptor);
    if (mode == 1) {
        it('should go to fullscreen mode', function() {
            ptor.findElement(protractor.By.className('fullscreenLink')).then(function(fullscreen_button) {
                fullscreen_button.click();
            });
        });
    }
    it('should open the quiz after refresh', function() {
        ptor.executeScript('window.scrollBy(0, 1000)', '');
        ptor.findElement(protractor.By.tagName('editable_text')).then(function(editable) {
            editable.click().then(function() {
                ptor.sleep(3000);
            });
        });
    });
    it('should make sure the DRAG quiz data is the same after refresh', function() {
        //check quiz data
        ptor.findElement(protractor.By.name('qlabel')).then(function(question_label) {
            expect(question_label.getAttribute('value')).toBe('My Quiz');
        });
        ptor.findElements(protractor.By.name('answer')).then(function(answers) {
            expect(answers[0].getAttribute('value')).toBe('second answer');
            expect(answers[1].getAttribute('value')).toBe('first answer');
            expect(answers[2].getAttribute('value')).toBe('third answer');
        });
    });
    //answer deletion
    it('should delete an answer from DRAG quiz', function() {
        ptor.findElements(protractor.By.className('delete')).then(function(delete_buttons) {
            delete_buttons[delete_buttons.length - 4].click().then(function() {
                ptor.findElement(protractor.By.className('btn-danger')).then(function(button) {
                    //                                buttons[buttons.length-1].click();
                    button.click();
                });
            });
        });
    });
    it('should save DRAG quiz after deleting an answer', function() {
        ptor.findElement(protractor.By.className('btn-primary')).then(function(save_button) {
            save_button.click().then(function() {
                feedback(ptor, 'saved');
            });
        });
        var error = ptor.findElement(protractor.By.className('alert-error'));
        expect(error.getText()).toBe('');
    });
    //    waitForFeedback(ptor);
    it('should refresh the page', function() {
        ptor.navigate().refresh();
        ptor.sleep(7000);
    });
    waitForOverlay(ptor);
    if (mode == 1) {
        it('should go to fullscreen mode', function() {
            ptor.findElement(protractor.By.className('fullscreenLink')).then(function(fullscreen_button) {
                fullscreen_button.click();
            });
        });
    }
    it('should open the quiz after refresh', function() {
        ptor.executeScript('window.scrollBy(0, 1000)', '');
        ptor.findElement(protractor.By.tagName('editable_text')).then(function(editable) {
            editable.click().then(function() {
                ptor.sleep(3000);
            });
        });
    });
    it('should make sure the DRAG quiz data is the same after deletion', function() {
        //check quiz data
        ptor.findElement(protractor.By.name('qlabel')).then(function(question_label) {
            expect(question_label.getAttribute('value')).toBe('My Quiz');
        });
        ptor.findElements(protractor.By.name('answer')).then(function(answers) {
            expect(answers[0].getAttribute('value')).toBe('first answer');
            expect(answers[1].getAttribute('value')).toBe('third answer');
        });
    });
    it('should delete DRAG quiz (text)', function() {
        ptor.findElements(protractor.By.className('delete')).then(function(delete_buttons) {
            delete_buttons[delete_buttons.length - 1].click().then(function() {
                ptor.findElement(protractor.By.className('btn-danger')).then(function(button) {
                    //                                buttons[buttons.length-1].click();
                    button.click().then(function() {
                        feedback(ptor, 'deleted');
                    });
                });
            });
        });
        ptor.findElements(protractor.By.tagName('editable_text')).then(function(editables) {
            expect(editables.length).toBe(0);
        });
    });
    if (mode == 1) {
        it('should exit fullscreen mode', function() {
            console.log('exiting fullscreen mode');
            ptor.findElements(protractor.By.className('fullscreenLink')).then(function(links) {
                links[links.length - 1].click();
            });
        });
    }
}

function DRAGVideo(ptor) {
    doRefresh(ptor);
    doWait(ptor);
    it('should insert DRAG over video quiz', function() {
        ptor.findElements(protractor.By.className('dropdown-toggle')).then(function(buttons) {
            buttons[1].click();
        });
        ptor.findElements(protractor.By.className('insertQuiz')).then(function(options) {
            options[2].click().then(function() {
                feedback(ptor, 'created');
            });
        });
    });
    it('should display the transparent layer on top of the video - DRAG Video', function() {
        ptor.findElement(protractor.By.className('ontop')).then(function(container) {
            container.isDisplayed().then(function(disp) {
                expect(disp).toBe(true);
            });
            expect(container.getAttribute('style')).toBe('background-color: transparent;');
        });
    });
    it('should show the DRAG quiz name', function() {
        ptor.findElement(protractor.By.tagName('editable_text')).then(function(quiz_name) {
            expect(quiz_name.getText()).toBe('New Quiz');
        });
    });
    it('should allow changing DRAG quiz name', function() {
        ptor.findElement(protractor.By.id('editing')).then(function(editing) {
            expect(editing.getText()).toContain('New Quiz');
        });
        ptor.findElements(protractor.By.tagName('editable_text')).then(function(editables) {
            expect(editables[0].getText()).toBe('New Quiz');
            //edit quiz name
            ptor.actions().doubleClick(editables[0]).perform();
            ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                field.clear();
                field.sendKeys('My Quiz');
                ptor.findElements(protractor.By.className('btn-primary')).then(function(buttons) {
                    buttons[1].click().then(function() {
                        feedback(ptor, 'updated');
                    });
                });
            });
            expect(editables[0].getText()).toBe('My Quiz');
            ptor.actions().doubleClick(editables[0]).perform();
            ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                field.clear();
                field.sendKeys('New Quiz');
                ptor.findElement(protractor.By.className('icon-remove')).then(function(remove_button) {
                    remove_button.click();
                });
            });
            expect(editables[0].getText()).toBe('My Quiz');
        });
    });
    it('should allow changing quiz time - DRAG Video', function() {
        ptor.findElements(protractor.By.tagName('editable_text')).then(function(time) {
            ptor.actions().doubleClick(time[1]).perform();
            ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                field.clear();
                field.sendKeys('any text');
                ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm) {
                    confirm.click();
                });
                ptor.findElement(protractor.By.className('editable-error')).then(function(errormessage) {
                    expect(errormessage.getText()).toContain('Incorrect Format for Time');
                });
                field.clear();
                field.sendKeys('00:00:00');
                ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm) {
                    confirm.click();
                });
                ptor.findElement(protractor.By.className('editable-error')).then(function(errormessage) {
                    expect(errormessage.getText()).toContain('Time Outside Video Range');
                });
                field.clear();
                field.sendKeys('00:05:21');
                ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm) {
                    confirm.click();
                });
                ptor.findElement(protractor.By.className('editable-error')).then(function(errormessage) {
                    expect(errormessage.getText()).toContain('Time Outside Video Range');
                });
                field.clear();
                field.sendKeys('00:01:07');
                ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm) {
                    confirm.click().then(function() {
                        feedback(ptor, 'updated');
                    });
                });
            });
        });
    });
    addDRAGAnswers(ptor);
    doExit(ptor);
    openMCQ(ptor);
    addDRAGAnswers(ptor);
    doSave(ptor);
    it('should display server\'s feedback', function() {
        feedback(ptor, 'saved');
    })
    doRefresh(ptor);
    doWait(ptor);
    openMCQ(ptor);
    it('should make sure that the answers locations were saved', function() {
        ptor.wait(function() {
            return ptor.findElements(protractor.By.className('dropped')).then(function(inputs) {
                if (inputs.length > 0) {
                    return true;
                }
                return false;
            });
        });
        console.log('hena');
        ptor.findElements(protractor.By.className('dropped')).then(function(answers) {
            var p = 0;
            var j = 0;
            for (var i = 0; i < answers.length; i++) {
                answers[i].getLocation().then(function(location) {
                    expect(location.x).toBe(locationx[j]);
                    expect(location.y).toBe(locationy[j]);
                    j++;
                });
            }
        });
    });
    it('should make sure that the answers details were saved', function() {
        console.log('hena2');
        ptor.findElements(protractor.By.className('area')).then(function(fields) {
            expect(fields[0].getAttribute('value')).toBe('first answer');
            fields[0].click();
            ptor.findElement(protractor.By.className('popover-content')).then(function(popover) {
                popover.isDisplayed().then(function(disp) {
                    expect(disp).toBe(true);
                });
            });
            ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                expect(fields[0].getAttribute('value')).toBe('correct explanation');
                expect(fields[1].getAttribute('value')).toBe('first wrong explanation');
                expect(fields[2].getAttribute('value')).toBe('second wrong explanation');
            });

            expect(fields[1].getAttribute('value')).toBe('second answer');
            fields[1].click();
            ptor.findElement(protractor.By.className('popover-content')).then(function(popover) {
                popover.isDisplayed().then(function(disp) {
                    expect(disp).toBe(true);
                });
            });
            ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                expect(fields[0].getAttribute('value')).toBe('correct explanation');
                expect(fields[1].getAttribute('value')).toBe('first wrong explanation');
                expect(fields[2].getAttribute('value')).toBe('second wrong explanation');
            });
            expect(fields[2].getAttribute('value')).toBe('third answer');
            fields[2].click();
            ptor.findElement(protractor.By.className('popover-content')).then(function(popover) {
                popover.isDisplayed().then(function(disp) {
                    expect(disp).toBe(true);
                });
            });
            ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                expect(fields[0].getAttribute('value')).toBe('correct explanation');
                expect(fields[1].getAttribute('value')).toBe('first wrong explanation');
                expect(fields[2].getAttribute('value')).toBe('second wrong explanation');
            });
        });
    });
    doRefresh(ptor);
    doWait(ptor);
    //    scroll(ptor, '1000');
    openMCQ(ptor);
    editDRAGAnswers(ptor);
    doSave(ptor);
    it('should display server\'s feedback', function() {
        feedback(ptor, 'saved');
    })
    doExit(ptor);
    doRefresh(ptor);
    doWait(ptor);
    //    scroll(ptor, '1000');
    openMCQ(ptor);
    //    scroll(ptor, '-1000');
    it('should make sure that the answers locations are the same', function() {
        ptor.wait(function() {
            return ptor.findElements(protractor.By.className('dropped')).then(function(inputs) {
                if (inputs.length > 0) {
                    return true;
                }
                return false;
            });
        })
        ptor.findElements(protractor.By.className('dropped')).then(function(answers) {
            var p = 0;
            var j = 0;
            for (var i = 0; i < answers.length; i++) {
                answers[i].getLocation().then(function(location) {
                    expect(location.x).toBe(locationx[j]);
                    expect(location.y).toBe(locationy[j]);
                    j++;
                });
            }
        });
    });
    it('should make sure that the answers details were saved after editing them', function() {
        ptor.findElements(protractor.By.className('area')).then(function(fields) {
            expect(fields[0].getAttribute('value')).toBe('1 answer');
            fields[0].click();
            ptor.findElement(protractor.By.className('popover-content')).then(function(popover) {
                popover.isDisplayed().then(function(disp) {
                    expect(disp).toBe(true);
                });
            });
            ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                expect(fields[0].getAttribute('value')).toBe('right explanation');
                expect(fields[1].getAttribute('value')).toBe('1 wrong explanation');
                expect(fields[2].getAttribute('value')).toBe('2 wrong explanation');
            });

            expect(fields[1].getAttribute('value')).toBe('2 answer');
            fields[1].click();
            ptor.findElement(protractor.By.className('popover-content')).then(function(popover) {
                popover.isDisplayed().then(function(disp) {
                    expect(disp).toBe(true);
                });
            });
            ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                expect(fields[0].getAttribute('value')).toBe('right explanation');
                expect(fields[1].getAttribute('value')).toBe('1 wrong explanation');
                expect(fields[2].getAttribute('value')).toBe('2 wrong explanation');
            });
            expect(fields[2].getAttribute('value')).toBe('3 answer');
            fields[2].click();
            ptor.findElement(protractor.By.className('popover-content')).then(function(popover) {
                popover.isDisplayed().then(function(disp) {
                    expect(disp).toBe(true);
                });
            });
            ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                expect(fields[0].getAttribute('value')).toBe('right explanation');
                expect(fields[1].getAttribute('value')).toBe('1 wrong explanation');
                expect(fields[2].getAttribute('value')).toBe('2 wrong explanation');
            });
        });
    });
    doRefresh(ptor);
    doWait(ptor);
    doChangeAspectRatio(ptor, 1);
    openMCQ(ptor);
    verifyPositions(ptor, 1);
    doExit(ptor);
    doChangeAspectRatio(ptor, 0);
    openMCQ(ptor);
    doDeleteAnswer(ptor, 1);
    doSave(ptor);
    it('should display server\'s feedback', function() {
        feedback(ptor, 'saved');
    });
    doRefresh(ptor);
    doWait(ptor);
    openMCQ(ptor);
    it('should make sure that the correct answer was deleted', function() {
        ptor.wait(function() {
            return ptor.findElements(protractor.By.className('dropped')).then(function(inputs) {
                if (inputs.length > 0) {
                    return true;
                }
                return false;
            });
        })
        ptor.findElements(protractor.By.className('area')).then(function(answers) {
            expect(answers.length).toBe(2);
            expect(answers[0].getAttribute('value')).toBe('2 answer');
            expect(answers[1].getAttribute('value')).toBe('3 answer');
            answers[0].click();
            ptor.findElements(protractor.By.className('must_save')).then(function(explanations) {
                expect(explanations.length).toBe(2);
                expect(explanations[0].getAttribute('value')).toBe('right explanation');
                expect(explanations[1].getAttribute('value')).toBe('2 wrong explanation');
            });
            answers[1].click();
            ptor.findElements(protractor.By.className('must_save')).then(function(explanations) {
                expect(explanations.length).toBe(2);
                expect(explanations[0].getAttribute('value')).toBe('right explanation');
                expect(explanations[1].getAttribute('value')).toBe('2 wrong explanation');
            });
        });
    });
    //edit the created quiz in fullscreen mode
    goFullscreen(ptor);
    it('should show the MCQ quiz name', function() {
        ptor.findElement(protractor.By.tagName('editable_text')).then(function(quiz_name) {
            expect(quiz_name.getText()).toBe('My Quiz');
        });
    });
    it('should allow changing DRAG quiz name', function() {
        ptor.findElement(protractor.By.id('editing')).then(function(editing) {
            expect(editing.getText()).toContain('My Quiz');
        });
        ptor.findElements(protractor.By.tagName('editable_text')).then(function(editables) {
            expect(editables[0].getText()).toBe('My Quiz');
            //edit quiz name
            ptor.actions().doubleClick(editables[0]).perform();
            ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                field.clear();
                field.sendKeys('The Quiz');
                ptor.findElements(protractor.By.className('btn-primary')).then(function(buttons) {
                    buttons[1].click().then(function() {
                        feedback(ptor, 'updated');
                    });
                });
            });
            expect(editables[0].getText()).toBe('The Quiz');
            ptor.actions().doubleClick(editables[0]).perform();
            ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                field.clear();
                field.sendKeys('New Quiz');
                ptor.findElement(protractor.By.className('icon-remove')).then(function(remove_button) {
                    remove_button.click();
                });
            });
            expect(editables[0].getText()).toBe('The Quiz');
        });
    });
    it('should allow changing quiz time - DRAG Video', function() {
        ptor.findElements(protractor.By.tagName('editable_text')).then(function(time) {
            ptor.actions().doubleClick(time[1]).perform();
            ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                field.clear();
                field.sendKeys('any text');
                ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm) {
                    confirm.click();
                });
                ptor.findElement(protractor.By.className('editable-error')).then(function(errormessage) {
                    expect(errormessage.getText()).toContain('Incorrect Format for Time');
                });
                field.clear();
                field.sendKeys('00:00:00');
                ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm) {
                    confirm.click();
                });
                ptor.findElement(protractor.By.className('editable-error')).then(function(errormessage) {
                    expect(errormessage.getText()).toContain('Time Outside Video Range');
                });
                field.clear();
                field.sendKeys('00:05:21');
                ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm) {
                    confirm.click();
                });
                ptor.findElement(protractor.By.className('editable-error')).then(function(errormessage) {
                    expect(errormessage.getText()).toContain('Time Outside Video Range');
                });
                field.clear();
                field.sendKeys('00:01:10');
                ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm) {
                    confirm.click().then(function() {
                        feedback(ptor, 'updated');
                    });
                });
            });
            expect(time[1].getText()).toBe('00:01:10');
        });
    });
    moveAnswers(ptor, -50, 0, 1);
    it('should edit the answers content', function() {
        ptor.findElements(protractor.By.className('area')).then(function(fields) {
            fields[0].clear().then(function() {
                fields[0].sendKeys('second answer');
            });
            fields[1].clear().then(function() {
                fields[1].sendKeys('third answer');
            });
            fields[0].click();
            ptor.findElements(protractor.By.className('must_save')).then(function(explanations) {
                explanations[0].clear();
                explanations[0].sendKeys('correct explanation');
                explanations[1].clear();
                explanations[1].sendKeys('second wrong explanation');

            });
            fields[1].click();
            ptor.findElements(protractor.By.className('must_save')).then(function(explanations) {
                explanations[0].clear();
                explanations[0].sendKeys('correct explanation');
                explanations[1].clear();
                explanations[1].sendKeys('second wrong explanation');

            });
        });
    });
    doSave(ptor);
    it('should display server\'s feedback', function() {
        feedback(ptor, 'saved');
    });
    doRefresh(ptor);
    doWait(ptor);
    goFullscreen(ptor);
    openMCQ(ptor);
    verifyPositions(ptor, 1);
    it('should make sure that the answers were saved correctly', function() {
        ptor.findElements(protractor.By.className('area')).then(function(answers) {
            expect(answers.length).toBe(2);
            expect(answers[0].getAttribute('value')).toBe('second answer');
            expect(answers[1].getAttribute('value')).toBe('third answer');
            answers[0].click();
            ptor.findElements(protractor.By.className('must_save')).then(function(explanations) {
                expect(explanations.length).toBe(2);
                expect(explanations[0].getAttribute('value')).toBe('correct explanation');
                expect(explanations[1].getAttribute('value')).toBe('second wrong explanation');
            });
            answers[1].click();
            ptor.findElements(protractor.By.className('must_save')).then(function(explanations) {
                expect(explanations.length).toBe(2);
                expect(explanations[0].getAttribute('value')).toBe('correct explanation');
                expect(explanations[1].getAttribute('value')).toBe('second wrong explanation');
            });
        });
    });
    doDelete(ptor);
    exitFullscreen(ptor);
    doRefresh(ptor);
    doWait(ptor);
    it('should make sure that the quiz was deleted', function() {
        ptor.findElements(protractor.By.repeater('quiz in quiz_list')).then(function(rows) {
            expect(rows.length).toBe(0);
        });
    });

    //reverse

    doRefresh(ptor);
    doWait(ptor);
    goFullscreen(ptor);
    it('should insert DRAG over video quiz', function() {
        ptor.findElements(protractor.By.className('dropdown-toggle')).then(function(buttons) {
            buttons[1].click();
        });
        ptor.findElements(protractor.By.className('insertQuiz')).then(function(options) {
            options[2].click().then(function() {
                feedback(ptor, 'created');
            });
        });
    });
    it('should display the transparent layer on top of the video - DRAG Video', function() {
        ptor.findElement(protractor.By.className('ontop')).then(function(container) {
            container.isDisplayed().then(function(disp) {
                expect(disp).toBe(true);
            });
            expect(container.getAttribute('style')).toContain('background-color: transparent;');
        });
    });
    it('should show the DRAG quiz name', function() {
        ptor.findElement(protractor.By.tagName('editable_text')).then(function(quiz_name) {
            expect(quiz_name.getText()).toBe('New Quiz');
        });
    });
    it('should allow changing DRAG quiz name', function() {
        ptor.findElement(protractor.By.id('editing')).then(function(editing) {
            expect(editing.getText()).toContain('New Quiz');
        });
        ptor.findElements(protractor.By.tagName('editable_text')).then(function(editables) {
            expect(editables[0].getText()).toBe('New Quiz');
            //edit quiz name
            ptor.actions().doubleClick(editables[0]).perform();
            ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                field.clear();
                field.sendKeys('My Quiz');
                ptor.findElements(protractor.By.className('btn-primary')).then(function(buttons) {
                    buttons[1].click().then(function() {
                        feedback(ptor, 'updated');
                    });
                });
            });
            expect(editables[0].getText()).toBe('My Quiz');
            ptor.actions().doubleClick(editables[0]).perform();
            ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                field.clear();
                field.sendKeys('New Quiz');
                ptor.findElement(protractor.By.className('icon-remove')).then(function(remove_button) {
                    remove_button.click();
                });
            });
            expect(editables[0].getText()).toBe('My Quiz');
        });
    });
    scroll(ptor, '0', '2000');
    it('should allow changing quiz time - DRAG Video', function() {
        ptor.findElements(protractor.By.tagName('editable_text')).then(function(time) {
            ptor.actions().doubleClick(time[1]).perform();
            ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                field.clear();
                field.sendKeys('any text');
                ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm) {
                    confirm.click();
                });
                ptor.findElement(protractor.By.className('editable-error')).then(function(errormessage) {
                    expect(errormessage.getText()).toContain('Incorrect Format for Time');
                });
                field.clear();
                field.sendKeys('00:00:00');
                ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm) {
                    confirm.click();
                });
                ptor.findElement(protractor.By.className('editable-error')).then(function(errormessage) {
                    expect(errormessage.getText()).toContain('Time Outside Video Range');
                });
                field.clear();
                field.sendKeys('00:05:21');
                ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm) {
                    confirm.click();
                });
                ptor.findElement(protractor.By.className('editable-error')).then(function(errormessage) {
                    expect(errormessage.getText()).toContain('Time Outside Video Range');
                });
                field.clear();
                field.sendKeys('00:01:07');
                ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm) {
                    confirm.click().then(function() {
                        feedback(ptor, 'updated');
                    });
                });
            });
        });
    });
    addDRAGAnswers(ptor);
    doExit(ptor);
    openMCQ(ptor);
    addDRAGAnswers(ptor);
    doSave(ptor);
    it('should display server\'s feedback', function() {
        feedback(ptor, 'saved');
    })
    doRefresh(ptor);
    doWait(ptor);
    goFullscreen(ptor);
    openMCQ(ptor);
    it('should make sure that the answers locations were saved', function() {
        ptor.findElements(protractor.By.className('dropped')).then(function(answers) {
            var p = 0;
            var j = 0;
            for (var i = 0; i < answers.length; i++) {
                answers[i].getLocation().then(function(location) {
                    expect(location.x).toBe(locationx[j]);
                    expect(location.y).toBe(locationy[j]);
                    j++;
                });
            }
        });
    });
    it('should make sure that the answers details were saved', function() {
        ptor.findElements(protractor.By.className('area')).then(function(fields) {
            expect(fields[0].getAttribute('value')).toBe('first answer');
            fields[0].click();
            ptor.findElement(protractor.By.className('popover-content')).then(function(popover) {
                popover.isDisplayed().then(function(disp) {
                    expect(disp).toBe(true);
                });
            });
            ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                expect(fields[0].getAttribute('value')).toBe('correct explanation');
                expect(fields[1].getAttribute('value')).toBe('first wrong explanation');
                expect(fields[2].getAttribute('value')).toBe('second wrong explanation');
            });

            expect(fields[1].getAttribute('value')).toBe('second answer');
            fields[1].click();
            ptor.findElement(protractor.By.className('popover-content')).then(function(popover) {
                popover.isDisplayed().then(function(disp) {
                    expect(disp).toBe(true);
                });
            });
            ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                expect(fields[0].getAttribute('value')).toBe('correct explanation');
                expect(fields[1].getAttribute('value')).toBe('first wrong explanation');
                expect(fields[2].getAttribute('value')).toBe('second wrong explanation');
            });
            expect(fields[2].getAttribute('value')).toBe('third answer');
            fields[2].click();
            ptor.findElement(protractor.By.className('popover-content')).then(function(popover) {
                popover.isDisplayed().then(function(disp) {
                    expect(disp).toBe(true);
                });
            });
            ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                expect(fields[0].getAttribute('value')).toBe('correct explanation');
                expect(fields[1].getAttribute('value')).toBe('first wrong explanation');
                expect(fields[2].getAttribute('value')).toBe('second wrong explanation');
            });
        });
    });
    doRefresh(ptor);
    doWait(ptor);
    goFullscreen(ptor);
    //    scroll(ptor, '1000');
    openMCQ(ptor);
    editDRAGAnswers(ptor);
    doSave(ptor);
    it('should display server\'s feedback', function() {
        feedback(ptor, 'saved');
    })
    doExit(ptor);
    doRefresh(ptor);
    doWait(ptor);
    goFullscreen(ptor);
    //    scroll(ptor, '1000');
    openMCQ(ptor);
    //    scroll(ptor, '-1000');
    it('should make sure that the answers locations are the same', function() {
        ptor.findElements(protractor.By.className('dropped')).then(function(answers) {
            var p = 0;
            var j = 0;
            for (var i = 0; i < answers.length; i++) {
                answers[i].getLocation().then(function(location) {
                    expect(location.x).toBe(locationx[j]);
                    expect(location.y).toBe(locationy[j]);
                    j++;
                });
            }
        });
    });
    it('should make sure that the answers details were saved after editing them', function() {
        ptor.findElements(protractor.By.className('area')).then(function(fields) {
            expect(fields[0].getAttribute('value')).toBe('1 answer');
            fields[0].click();
            ptor.findElement(protractor.By.className('popover-content')).then(function(popover) {
                popover.isDisplayed().then(function(disp) {
                    expect(disp).toBe(true);
                });
            });
            ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                expect(fields[0].getAttribute('value')).toBe('right explanation');
                expect(fields[1].getAttribute('value')).toBe('1 wrong explanation');
                expect(fields[2].getAttribute('value')).toBe('2 wrong explanation');
            });

            expect(fields[1].getAttribute('value')).toBe('2 answer');
            fields[1].click();
            ptor.findElement(protractor.By.className('popover-content')).then(function(popover) {
                popover.isDisplayed().then(function(disp) {
                    expect(disp).toBe(true);
                });
            });
            ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                expect(fields[0].getAttribute('value')).toBe('right explanation');
                expect(fields[1].getAttribute('value')).toBe('1 wrong explanation');
                expect(fields[2].getAttribute('value')).toBe('2 wrong explanation');
            });
            expect(fields[2].getAttribute('value')).toBe('3 answer');
            fields[2].click();
            ptor.findElement(protractor.By.className('popover-content')).then(function(popover) {
                popover.isDisplayed().then(function(disp) {
                    expect(disp).toBe(true);
                });
            });
            ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                expect(fields[0].getAttribute('value')).toBe('right explanation');
                expect(fields[1].getAttribute('value')).toBe('1 wrong explanation');
                expect(fields[2].getAttribute('value')).toBe('2 wrong explanation');
            });
        });
    });
    doRefresh(ptor);
    doWait(ptor);
    goFullscreen(ptor);
    openMCQ(ptor);
    doDeleteAnswer(ptor, 1);
    doSave(ptor);
    it('should display server\'s feedback', function() {
        feedback(ptor, 'saved');
    })
    doRefresh(ptor);
    doWait(ptor);
    goFullscreen(ptor);
    openMCQ(ptor);
    it('should make sure that the correct answer was deleted', function() {
        ptor.findElements(protractor.By.className('area')).then(function(answers) {
            expect(answers.length).toBe(2);
            expect(answers[0].getAttribute('value')).toBe('2 answer');
            expect(answers[1].getAttribute('value')).toBe('3 answer');
            answers[0].click();
            ptor.findElements(protractor.By.className('must_save')).then(function(explanations) {
                expect(explanations.length).toBe(2);
                expect(explanations[0].getAttribute('value')).toBe('right explanation');
                expect(explanations[1].getAttribute('value')).toBe('2 wrong explanation');
            });
            answers[1].click();
            ptor.findElements(protractor.By.className('must_save')).then(function(explanations) {
                expect(explanations.length).toBe(2);
                expect(explanations[0].getAttribute('value')).toBe('right explanation');
                expect(explanations[1].getAttribute('value')).toBe('2 wrong explanation');
            });
        });
    });
    //edit the created quiz in normal mode
    exitFullscreen(ptor);
    it('should show the MCQ quiz name', function() {
        ptor.findElement(protractor.By.tagName('editable_text')).then(function(quiz_name) {
            expect(quiz_name.getText()).toBe('My Quiz');
        });
    });
    it('should allow changing MCQ quiz name', function() {
        ptor.findElement(protractor.By.id('editing')).then(function(editing) {
            expect(editing.getText()).toContain('My Quiz');
        });
        ptor.findElements(protractor.By.tagName('editable_text')).then(function(editables) {
            expect(editables[0].getText()).toBe('My Quiz');
            //edit quiz name
            ptor.actions().doubleClick(editables[0]).perform();
            ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                field.clear();
                field.sendKeys('The Quiz');
                ptor.findElements(protractor.By.className('btn-primary')).then(function(buttons) {
                    buttons[1].click().then(function() {
                        feedback(ptor, 'updated');
                    });
                });
            });
            expect(editables[0].getText()).toBe('The Quiz');
            ptor.actions().doubleClick(editables[0]).perform();
            ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                field.clear();
                field.sendKeys('New Quiz');
                ptor.findElement(protractor.By.className('icon-remove')).then(function(remove_button) {
                    remove_button.click();
                });
            });
            expect(editables[0].getText()).toBe('The Quiz');
        });
    });
    it('should allow changing quiz time - MCQ Video', function() {
        ptor.findElements(protractor.By.tagName('editable_text')).then(function(time) {
            ptor.actions().doubleClick(time[1]).perform();
            ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                field.clear();
                field.sendKeys('any text');
                ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm) {
                    confirm.click();
                });
                ptor.findElement(protractor.By.className('editable-error')).then(function(errormessage) {
                    expect(errormessage.getText()).toContain('Incorrect Format for Time');
                });
                field.clear();
                field.sendKeys('00:00:00');
                ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm) {
                    confirm.click();
                });
                ptor.findElement(protractor.By.className('editable-error')).then(function(errormessage) {
                    expect(errormessage.getText()).toContain('Time Outside Video Range');
                });
                field.clear();
                field.sendKeys('00:05:21');
                ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm) {
                    confirm.click();
                });
                ptor.findElement(protractor.By.className('editable-error')).then(function(errormessage) {
                    expect(errormessage.getText()).toContain('Time Outside Video Range');
                });
                field.clear();
                field.sendKeys('00:01:10');
                ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm) {
                    confirm.click().then(function() {
                        feedback(ptor, 'updated');
                    });
                });
            });
            expect(time[1].getText()).toBe('00:01:10');
        });
    });
    moveAnswers(ptor, -50, 0, 1);
    it('should edit the answers content', function() {
        ptor.findElements(protractor.By.className('area')).then(function(fields) {
            fields[0].clear().then(function() {
                fields[0].sendKeys('second answer');
            });
            fields[1].clear().then(function() {
                fields[1].sendKeys('third answer');
            });
            fields[0].click();
            ptor.findElements(protractor.By.className('must_save')).then(function(explanations) {
                explanations[0].clear();
                explanations[0].sendKeys('correct explanation');
                explanations[1].clear();
                explanations[1].sendKeys('second wrong explanation');

            });
            fields[1].click();
            ptor.findElements(protractor.By.className('must_save')).then(function(explanations) {
                explanations[0].clear();
                explanations[0].sendKeys('correct explanation');
                explanations[1].clear();
                explanations[1].sendKeys('second wrong explanation');

            });
        });
    });
    doSave(ptor);
    it('should display server\'s feedback', function() {
        feedback(ptor, 'saved');
    });
    doRefresh(ptor);
    doWait(ptor);
    openMCQ(ptor);
    verifyPositions(ptor, 1);
    it('should make sure that the answers were saved correctly', function() {
        ptor.findElements(protractor.By.className('area')).then(function(answers) {
            expect(answers.length).toBe(2);
            expect(answers[0].getAttribute('value')).toBe('second answer');
            expect(answers[1].getAttribute('value')).toBe('third answer');
            answers[0].click();
            ptor.findElements(protractor.By.className('must_save')).then(function(explanations) {
                expect(explanations.length).toBe(2);
                expect(explanations[0].getAttribute('value')).toBe('correct explanation');
                expect(explanations[1].getAttribute('value')).toBe('second wrong explanation');
            });
            answers[1].click();
            ptor.findElements(protractor.By.className('must_save')).then(function(explanations) {
                expect(explanations.length).toBe(2);
                expect(explanations[0].getAttribute('value')).toBe('correct explanation');
                expect(explanations[1].getAttribute('value')).toBe('second wrong explanation');
            });
        });
    });
    doDelete(ptor);
    doRefresh(ptor);
    doWait(ptor);
    it('should make sure that the quiz was deleted', function() {
        ptor.findElements(protractor.By.repeater('quiz in quiz_list')).then(function(rows) {
            expect(rows.length).toBe(0);
        });
    });


}

function editDRAGAnswers(ptor) {
    it('should edit the DRAG QUIZ answers details', function() {
        ptor.findElements(protractor.By.className('area')).then(function(fields) {
            fields[0].clear();
            fields[0].sendKeys('1 answer');
            fields[0].click();
            ptor.findElement(protractor.By.className('popover-content')).then(function(popover) {
                popover.isDisplayed().then(function(disp) {
                    expect(disp).toBe(true);
                });
            });
            ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                fields[0].clear();
                fields[0].sendKeys('right explanation');
                fields[1].clear();
                fields[1].sendKeys('1 wrong explanation');
                fields[2].clear();
                fields[2].sendKeys('2 wrong explanation');
            });

            fields[1].clear();
            fields[1].sendKeys('2 answer');
            fields[1].click();
            ptor.findElement(protractor.By.className('popover-content')).then(function(popover) {
                popover.isDisplayed().then(function(disp) {
                    expect(disp).toBe(true);
                });
            });
            ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                fields[0].clear();
                fields[0].sendKeys('right explanation');
                fields[1].clear();
                fields[1].sendKeys('1 wrong explanation');
                fields[2].clear();
                fields[2].sendKeys('2 wrong explanation');
            });
            fields[2].clear();
            fields[2].sendKeys('3 answer');
            fields[2].click();
            ptor.findElement(protractor.By.className('popover-content')).then(function(popover) {
                popover.isDisplayed().then(function(disp) {
                    expect(disp).toBe(true);
                });
            });
            ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                fields[0].clear();
                fields[0].sendKeys('right explanation');
                fields[1].clear();
                fields[1].sendKeys('1 wrong explanation');
                fields[2].clear();
                fields[2].sendKeys('2 wrong explanation');
            });
        });
    });
}

function addDRAGAnswers(ptor) {
    it('should add quiz answers on top of the video - DRAG Video', function() {
        var locx = 0,
            locy = 0;
        locationx = new Array();
        locationy = new Array();
        //double click in 3 different places, delta should be in y direction with a positive value
        ptor.executeScript('window.scrollBy(0, -1000)', '');
        ptor.findElement(protractor.By.className('ontop')).then(function(test) {
            ptor.actions().doubleClick(test).perform();
            //-----------------------------------------//
            ptor.findElements(protractor.By.className('dropped')).then(function(answers) {
                answers[answers.length - 1].getLocation().then(function(pnode) {
                    locx = pnode.x + 5;
                    locy = pnode.y;
                });
                ptor.actions().dragAndDrop({
                    x: locx,
                    y: locy
                }, {
                    x: 200,
                    y: 115
                }).perform();
                answers[answers.length - 1].getLocation().then(function(location) {
                    locationx.splice(locationx.length, 0, location.x);
                    locationy.splice(locationy.length, 0, location.y);
                    //                    console.log(locationx[locationx.length-1] + " " + locationy[locationy.length-1]);
                });
            });
        });

        ptor.findElement(protractor.By.className('ontop')).then(function(test) {
            var loc2x = 0,
                loc2y = 0;
            ptor.actions().doubleClick(test).perform();
            //-----------------------------------------//
            ptor.findElements(protractor.By.className('dropped')).then(function(answers) {
                answers[answers.length - 1].getLocation().then(function(pnode) {
                    loc2x = pnode.x + 5;
                    loc2y = pnode.y;
                });
                ptor.actions().dragAndDrop({
                    x: loc2x,
                    y: loc2y
                }, {
                    x: 200,
                    y: 185
                }).perform();
                answers[answers.length - 1].getLocation().then(function(location) {
                    locationx.splice(locationx.length, 0, location.x);
                    locationy.splice(locationy.length, 0, location.y);
                    //                    console.log(locationx[locationx.length-1] + " " + locationy[locationy.length-1]);
                });
            });
        });


        ptor.findElement(protractor.By.className('ontop')).then(function(test) {
            var loc3x = 0,
                loc3y = 0;
            ptor.actions().doubleClick(test).perform();
            //-----------------------------------------//
            ptor.findElements(protractor.By.className('dropped')).then(function(answers) {
                answers[answers.length - 1].getLocation().then(function(pnode) {
                    loc3x = pnode.x + 5;
                    loc3y = pnode.y;
                });
                ptor.actions().dragAndDrop({
                    x: loc3x,
                    y: loc3y
                }, {
                    x: 200,
                    y: 255
                }).perform();
                answers[answers.length - 1].getLocation().then(function(location) {
                    locationx.splice(locationx.length, 0, location.x);
                    locationy.splice(locationy.length, 0, location.y);
                    //                    console.log(locationx[locationx.length-1] + " " + locationy[locationy.length-1]);
                });
            });
        });

        ptor.findElements(protractor.By.className('area')).then(function(fields) {
            fields[0].sendKeys('first answer');
            fields[0].click();
            ptor.findElement(protractor.By.className('popover-content')).then(function(popover) {
                popover.isDisplayed().then(function(disp) {
                    expect(disp).toBe(true);
                });
            });
            ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                fields[0].sendKeys('correct explanation');
                fields[1].sendKeys('first wrong explanation');
                fields[2].sendKeys('second wrong explanation');
            });

            fields[fields.length - 2].sendKeys('second answer');
            fields[fields.length - 2].click();
            ptor.findElement(protractor.By.className('popover-content')).then(function(popover) {
                popover.isDisplayed().then(function(disp) {
                    expect(disp).toBe(true);
                });
            });
            ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                fields[0].sendKeys('correct explanation');
                fields[1].sendKeys('first wrong explanation');
                fields[2].sendKeys('second wrong explanation');
            });
            fields[fields.length - 1].sendKeys('third answer');
            fields[fields.length - 1].click();
            ptor.findElement(protractor.By.className('popover-content')).then(function(popover) {
                popover.isDisplayed().then(function(disp) {
                    expect(disp).toBe(true);
                });
            });
            ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                fields[0].sendKeys('correct explanation');
                fields[1].sendKeys('first wrong explanation');
                fields[2].sendKeys('second wrong explanation');
            });
        });
    });
}

function MCQOCQVideo(ptor, type) {
    doRefresh(ptor);
    doWait(ptor);
    it('should insert MCQ over video quiz', function() {
        ptor.findElements(protractor.By.className('dropdown-toggle')).then(function(buttons) {
            buttons[1].click();
        });
        if (type == 0) {
            ptor.findElements(protractor.By.className('insertQuiz')).then(function(options) {
                options[0].click().then(function() {
                    feedback(ptor, 'created');
                });
            });
        } else if (type == 1) {
            ptor.findElements(protractor.By.className('insertQuiz')).then(function(options) {
                options[1].click().then(function() {
                    feedback(ptor, 'created');
                });
            });
        }

    });
    it('should display the transparent layer on top of the video - MCQ Video', function() {
        ptor.findElement(protractor.By.className('ontop')).then(function(container) {
            container.isDisplayed().then(function(disp) {
                expect(disp).toBe(true);
            });
            expect(container.getAttribute('style')).toBe('background-color: transparent;');
        });
    });
    it('should show the MCQ quiz name', function() {
        ptor.findElement(protractor.By.tagName('editable_text')).then(function(quiz_name) {
            expect(quiz_name.getText()).toBe('New Quiz');
        });
    });
    it('should allow changing MCQ quiz name', function() {
        ptor.findElement(protractor.By.id('editing')).then(function(editing) {
            expect(editing.getText()).toContain('New Quiz');
        });
        ptor.findElements(protractor.By.tagName('editable_text')).then(function(editables) {
            expect(editables[0].getText()).toBe('New Quiz');
            //edit quiz name
            ptor.actions().doubleClick(editables[0]).perform();
            ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                field.clear();
                field.sendKeys('My Quiz');
                ptor.findElements(protractor.By.className('btn-primary')).then(function(buttons) {
                    buttons[1].click().then(function() {
                        feedback(ptor, 'updated');
                    });
                });
            });
            expect(editables[0].getText()).toBe('My Quiz');
            ptor.actions().doubleClick(editables[0]).perform();
            ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                field.clear();
                field.sendKeys('New Quiz');
                ptor.findElement(protractor.By.className('icon-remove')).then(function(remove_button) {
                    remove_button.click();
                });
            });
            expect(editables[0].getText()).toBe('My Quiz');
        });
    });
    it('should allow changing quiz time - MCQ Video', function() {
        ptor.findElements(protractor.By.tagName('editable_text')).then(function(time) {
            ptor.actions().doubleClick(time[1]).perform();
            ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                field.clear();
                field.sendKeys('any text');
                ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm) {
                    confirm.click();
                });
                ptor.findElement(protractor.By.className('editable-error')).then(function(errormessage) {
                    expect(errormessage.getText()).toContain('Incorrect Format for Time');
                });
                field.clear();
                field.sendKeys('00:00:00');
                ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm) {
                    confirm.click();
                });
                ptor.findElement(protractor.By.className('editable-error')).then(function(errormessage) {
                    expect(errormessage.getText()).toContain('Time Outside Video Range');
                });
                field.clear();
                field.sendKeys('00:05:21');
                ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm) {
                    confirm.click();
                });
                ptor.findElement(protractor.By.className('editable-error')).then(function(errormessage) {
                    expect(errormessage.getText()).toContain('Time Outside Video Range');
                });
                field.clear();
                field.sendKeys('00:01:07');
                ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm) {
                    confirm.click().then(function() {
                        feedback(ptor, 'updated');
                    });
                });
            });
        });
    });
    //add and then don't save
    addMCQAnswers(ptor);
    doExit(ptor);
    openMCQ(ptor);
    //add and then save
    addMCQAnswers(ptor);
    doSave(ptor);
    it('should display server\'s feedback', function() {
        feedback(ptor, 'saved');
    });
    openMCQ(ptor);

    it('should make sure that the answers details were saved', function() {
        ptor.findElements(protractor.By.className('answer_img')).then(function(answers) {
            var p = 0;
            var j = 0;
            for (var i = 0; i < answers.length; i++) {
                answers[i].getLocation().then(function(location) {
                    expect(location.x).toBe(locationx[j]);
                    expect(location.y).toBe(locationy[j]);
                    j++;
                });
                answers[i].click();
                ptor.findElement(protractor.By.className('popover-content')).then(function(popover) {
                    popover.isDisplayed().then(function(disp) {
                        expect(disp).toBe(true);
                    });
                });
                if (i == answers.length - 3) {
                    expect(answers[i].getAttribute('ng-src')).toContain('green');
                    ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                        expect(fields[0].getAttribute('value')).toBe('first answer');
                        expect(fields[1].getAttribute('value')).toBe('first explanation');
                    });
                }
                if (i == answers.length - 2) {
                    ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                        expect(fields[0].getAttribute('value')).toBe('second answer');
                        expect(fields[1].getAttribute('value')).toBe('second explanation');
                    });
                }
                if (i == answers.length - 1) {
                    ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                        expect(fields[0].getAttribute('value')).toBe('third answer');
                        expect(fields[1].getAttribute('value')).toBe('third explanation');
                    });
                }

            }
        });

    });
    doRefresh(ptor);
    doWait(ptor);
    openMCQ(ptor);
    manipulateAnswers(ptor, false, 2);
    doSave(ptor);
    it('should display server\'s feedback', function() {
        feedback(ptor, 'saved');
    })
    //    waitForFeedback(ptor);
    doExit(ptor);
    doRefresh(ptor);
    doWait(ptor);
    scroll(ptor, '1000');
    openMCQ(ptor);
    scroll(ptor, '-1000');
    it('should make sure that the answers details were saved after editing them', function() {
        ptor.findElements(protractor.By.className('answer_img')).then(function(answers) {
            var p = 0;
            var j = 0;
            for (var i = 0; i < answers.length; i++) {
                answers[i].getLocation().then(function(location) {
                    expect(location.x).toBe(locationx[j]);
                    expect(location.y).toBe(locationy[j]);
                    j++;
                });
                answers[i].click();
                ptor.findElement(protractor.By.className('popover-content')).then(function(popover) {
                    popover.isDisplayed().then(function(disp) {
                        expect(disp).toBe(true);
                    });
                });
                if (i == answers.length - 1) {
                    ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                        expect(fields[0].getAttribute('value')).toBe('3 answer');
                        expect(fields[1].getAttribute('value')).toBe('3 explanation');
                    });
                }
                if (i == answers.length - 2) {
                    ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                        expect(fields[0].getAttribute('value')).toBe('2 answer');
                        expect(fields[1].getAttribute('value')).toBe('2 explanation');
                    });
                }
                if (i == answers.length - 3) {
                    expect(answers[i].getAttribute('ng-src')).toContain('green');
                    ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                        expect(fields[0].getAttribute('value')).toBe('1 answer');
                        expect(fields[1].getAttribute('value')).toBe('1 explanation');
                    });
                }

            }
        });

    });
    doChangeAspectRatio(ptor, 1);
    verifyPositions(ptor, 0);
    doChangeAspectRatio(ptor, 0);
    doDeleteAnswer(ptor, 0);
    doSave(ptor);
    it('should not be able to save', function() {
        ptor.sleep(2000);
        ////        ptor.findElement(protractor.By.id('middle')).then(function(middle){
        //        ptor.findElements(protractor.By.className('alert-error')).then(function(errors){
        //            errors[errors.length-3].getText().then(function(value){
        //                console.log(value);
        //            })
        //            expect(error.getText()).toContain('errors');
        //        });
        ////        });
        //        var error = ptor.findElement(protractor.By.className('alert-error'));
        //        expect(error.getText()).toContain('You\'ve got some errors');
    });
    it('should select an answer as the correct one', function() {
        ptor.findElement(protractor.By.className('answer_img')).then(function(answer) {
            answer.click();
            ptor.findElement(protractor.By.className('popover-content')).then(function(popover) {
                popover.isDisplayed().then(function(disp) {
                    expect(disp).toBe(true);
                });
            });
            ptor.findElement(protractor.By.className('must_save_check')).then(function(checkbox) {
                checkbox.click();
            });
        });
    });
    doSave(ptor);
    it('should display server\'s feedback', function() {
        feedback(ptor, 'saved');
    })
    //    waitForFeedback(ptor);
    doRefresh(ptor);
    doWait(ptor);
    openMCQ(ptor);
    it('should make sure that the answer was deleted', function() {
        ptor.findElements(protractor.By.className('answer_img')).then(function(answers) {
            expect(answers.length).toBe(2);
        });
        ptor.findElements(protractor.By.className('answer_img')).then(function(answers) {
            var j = 1;
            for (var i = 0; i < answers.length; i++) {
                answers[i].getLocation().then(function(location) {
                    expect(location.x).toBe(locationx[j]);
                    expect(location.y).toBe(locationy[j]);
                    j++;
                });
                answers[i].click();
                ptor.findElement(protractor.By.className('popover-content')).then(function(popover) {
                    popover.isDisplayed().then(function(disp) {
                        expect(disp).toBe(true);
                    });
                });
                if (i == answers.length - 1) {
                    ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                        expect(fields[0].getAttribute('value')).toBe('3 answer');
                        expect(fields[1].getAttribute('value')).toBe('3 explanation');
                    });
                }
                if (i == answers.length - 2) {
                    expect(answers[i].getAttribute('ng-src')).toContain('green');
                    ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                        expect(fields[0].getAttribute('value')).toBe('2 answer');
                        expect(fields[1].getAttribute('value')).toBe('2 explanation');
                    });
                }
            }
        });
    });

    //--------------------//
    //edit the created quiz in fullscreen mode

    goFullscreen(ptor);
    it('should show the MCQ quiz name', function() {
        ptor.findElement(protractor.By.tagName('editable_text')).then(function(quiz_name) {
            expect(quiz_name.getText()).toBe('My Quiz');
        });
    });
    it('should allow changing MCQ quiz name', function() {
        ptor.findElement(protractor.By.id('editing')).then(function(editing) {
            expect(editing.getText()).toContain('My Quiz');
        });
        ptor.findElements(protractor.By.tagName('editable_text')).then(function(editables) {
            expect(editables[0].getText()).toBe('My Quiz');
            //edit quiz name
            ptor.actions().doubleClick(editables[0]).perform();
            ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                field.clear();
                field.sendKeys('The Quiz');
                ptor.findElements(protractor.By.className('btn-primary')).then(function(buttons) {
                    buttons[1].click().then(function() {
                        feedback(ptor, 'updated');
                    });
                });
            });
            expect(editables[0].getText()).toBe('The Quiz');
            ptor.actions().doubleClick(editables[0]).perform();
            ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                field.clear();
                field.sendKeys('New Quiz');
                ptor.findElement(protractor.By.className('icon-remove')).then(function(remove_button) {
                    remove_button.click();
                });
            });
            expect(editables[0].getText()).toBe('The Quiz');
        });
    });
    it('should allow changing quiz time - MCQ Video', function() {
        ptor.findElements(protractor.By.tagName('editable_text')).then(function(time) {
            ptor.actions().doubleClick(time[1]).perform();
            ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                field.clear();
                field.sendKeys('any text');
                ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm) {
                    confirm.click();
                });
                ptor.findElement(protractor.By.className('editable-error')).then(function(errormessage) {
                    expect(errormessage.getText()).toContain('Incorrect Format for Time');
                });
                field.clear();
                field.sendKeys('00:00:00');
                ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm) {
                    confirm.click();
                });
                ptor.findElement(protractor.By.className('editable-error')).then(function(errormessage) {
                    expect(errormessage.getText()).toContain('Time Outside Video Range');
                });
                field.clear();
                field.sendKeys('00:05:21');
                ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm) {
                    confirm.click();
                });
                ptor.findElement(protractor.By.className('editable-error')).then(function(errormessage) {
                    expect(errormessage.getText()).toContain('Time Outside Video Range');
                });
                field.clear();
                field.sendKeys('00:01:10');
                ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm) {
                    confirm.click().then(function() {
                        feedback(ptor, 'updated');
                    });
                });
            });
            expect(time[1].getText()).toBe('00:01:10');
        });
    });

    moveAnswers(ptor, 50, 0, 0);
    it('should edit answers\' content', function() {
        ptor.findElements(protractor.By.className('answer_img')).then(function(answers) {
            answers.forEach(function(ans, i) {
                var bb = [2, 1];
                ans.click()
                ptor.findElement(protractor.By.className('popover-content')).then(function(popover) {
                    popover.isDisplayed().then(function(disp) {
                        expect(disp).toBe(true);
                    });
                });
                ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                    fields[0].clear();
                    fields[0].sendKeys(convertText(i + 1) + ' answer');
                    fields[1].clear();
                    fields[1].sendKeys(convertText(i + 1) + ' explanation');
                });
            });
        });
    });
    doExit(ptor);
    openMCQ(ptor);
    it('should make sure that the changes were not saved', function() {
        ptor.findElements(protractor.By.className('answer_img')).then(function(answers) {
            var aa = [1, 0];
            answers.forEach(function(ans, i) {
                ans.click();
                ptor.findElement(protractor.By.className('popover-content')).then(function(popover) {
                    popover.isDisplayed().then(function(disp) {
                        expect(disp).toBe(true);
                    });
                });
                ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                    expect(fields[0].getAttribute('value')).toBe(i + 2 + ' answer');
                    expect(fields[1].getAttribute('value')).toBe(i + 2 + ' explanation');
                });
            });
        });
    });

    moveAnswers(ptor, 50, 0, 0);
    it('should edit answers\' content', function() {
        ptor.findElements(protractor.By.className('answer_img')).then(function(answers) {
            answers.forEach(function(ans, i) {
                var bb = [2, 1];
                ans.click()
                ptor.findElement(protractor.By.className('popover-content')).then(function(popover) {
                    popover.isDisplayed().then(function(disp) {
                        expect(disp).toBe(true);
                    });
                });
                ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                    fields[0].clear();
                    fields[0].sendKeys(convertText(i + 1) + ' answer');
                    fields[1].clear();
                    fields[1].sendKeys(convertText(i + 1) + ' explanation');
                });
            });
        });
    });
    doSave(ptor);
    it('should display server\'s feedback', function() {
        feedback(ptor, 'saved');
    });
    //    waitForFeedback(ptor);
    doExit(ptor);
    doRefresh(ptor);
    doWait(ptor);
    goFullscreen(ptor);
    openMCQ(ptor);
    it('should make sure that the changes were saved', function() {
        ptor.findElements(protractor.By.className('answer_img')).then(function(answers) {
            var aa = [1, 0];
            answers.forEach(function(ans, i) {
                ans.click();
                ptor.findElement(protractor.By.className('popover-content')).then(function(popover) {
                    popover.isDisplayed().then(function(disp) {
                        expect(disp).toBe(true);
                    });
                });
                ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                    expect(fields[0].getAttribute('value')).toBe(convertText(i + 1) + ' answer');
                    expect(fields[1].getAttribute('value')).toBe(convertText(i + 1) + ' explanation');
                });
            })
        });
    });
    doDelete(ptor);
    exitFullscreen(ptor);
    doRefresh(ptor);
    doWait(ptor);
    it('should make sure that the quiz was deleted', function() {
        ptor.findElements(protractor.By.repeater('quiz in quiz_list')).then(function(rows) {
            expect(rows.length).toBe(0);
        });
    });
    //reverse
    goFullscreen(ptor);
    it('should insert MCQ over video quiz', function() {
        ptor.findElements(protractor.By.className('dropdown-toggle')).then(function(buttons) {
            buttons[1].click();
        });
        if (type == 0) {
            ptor.findElements(protractor.By.className('insertQuiz')).then(function(options) {
                options[0].click().then(function() {
                    feedback(ptor, 'created');
                });
            });
        } else if (type == 1) {
            ptor.findElements(protractor.By.className('insertQuiz')).then(function(options) {
                options[1].click().then(function() {
                    feedback(ptor, 'created');
                });
            });
        }
    });
    it('should display the transparent layer on top of the video - MCQ Video', function() {
        ptor.findElement(protractor.By.className('ontop')).then(function(container) {
            container.isDisplayed().then(function(disp) {
                expect(disp).toBe(true);
            });
            expect(container.getAttribute('style')).toContain('background-color: transparent;');
        });
    });
    it('should show the MCQ quiz name', function() {
        ptor.findElement(protractor.By.tagName('editable_text')).then(function(quiz_name) {
            expect(quiz_name.getText()).toBe('New Quiz');
        });
    });
    it('should allow changing MCQ quiz name', function() {
        ptor.findElement(protractor.By.id('editing')).then(function(editing) {
            expect(editing.getText()).toContain('New Quiz');
        });
        ptor.findElements(protractor.By.tagName('editable_text')).then(function(editables) {
            expect(editables[0].getText()).toBe('New Quiz');
            //edit quiz name
            ptor.actions().doubleClick(editables[0]).perform();
            ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                field.clear();
                field.sendKeys('My Quiz');
                ptor.findElements(protractor.By.className('btn-primary')).then(function(buttons) {
                    buttons[1].click().then(function() {
                        feedback(ptor, 'updated');
                    });
                });
            });
            expect(editables[0].getText()).toBe('My Quiz');
            ptor.actions().doubleClick(editables[0]).perform();
            ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                field.clear();
                field.sendKeys('New Quiz');
                ptor.findElement(protractor.By.className('icon-remove')).then(function(remove_button) {
                    remove_button.click();
                });
            });
            expect(editables[0].getText()).toBe('My Quiz');
        });
    });
    it('should allow changing quiz time - MCQ Video', function() {
        ptor.findElements(protractor.By.tagName('editable_text')).then(function(time) {
            ptor.actions().doubleClick(time[1]).perform();
            ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                field.clear();
                field.sendKeys('any text');
                ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm) {
                    confirm.click();
                });
                ptor.findElement(protractor.By.className('editable-error')).then(function(errormessage) {
                    expect(errormessage.getText()).toContain('Incorrect Format for Time');
                });
                field.clear();
                field.sendKeys('00:00:00');
                ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm) {
                    confirm.click();
                });
                ptor.findElement(protractor.By.className('editable-error')).then(function(errormessage) {
                    expect(errormessage.getText()).toContain('Time Outside Video Range');
                });
                field.clear();
                field.sendKeys('00:05:21');
                ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm) {
                    confirm.click();
                });
                ptor.findElement(protractor.By.className('editable-error')).then(function(errormessage) {
                    expect(errormessage.getText()).toContain('Time Outside Video Range');
                });
                field.clear();
                field.sendKeys('00:01:07');
                ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm) {
                    confirm.click().then(function() {
                        feedback(ptor, 'updated');
                    });
                });
            });
        });
    });
    //add and then don't save
    addMCQAnswers(ptor);
    doExit(ptor);
    openMCQ(ptor);
    //add and then save
    addMCQAnswers(ptor);
    doSave(ptor);
    it('should display server\'s feedback', function() {
        feedback(ptor, 'saved');
    })
    //    waitForFeedback(ptor);
    openMCQ(ptor);

    it('should make sure that the answers details were saved', function() {
        ptor.findElements(protractor.By.className('answer_img')).then(function(answers) {
            var p = 0;
            var j = 0;
            for (var i = 0; i < answers.length; i++) {
                answers[i].getLocation().then(function(location) {
                    expect(location.x).toBe(locationx[j]);
                    expect(location.y).toBe(locationy[j]);
                    j++;
                });
                answers[i].click();
                ptor.findElement(protractor.By.className('popover-content')).then(function(popover) {
                    popover.isDisplayed().then(function(disp) {
                        expect(disp).toBe(true);
                    });
                });
                if (i == answers.length - 3) {
                    expect(answers[i].getAttribute('ng-src')).toContain('green');
                    ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                        expect(fields[0].getAttribute('value')).toBe('first answer');
                        expect(fields[1].getAttribute('value')).toBe('first explanation');
                    });
                }
                if (i == answers.length - 2) {
                    ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                        expect(fields[0].getAttribute('value')).toBe('second answer');
                        expect(fields[1].getAttribute('value')).toBe('second explanation');
                    });
                }
                if (i == answers.length - 1) {
                    ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                        expect(fields[0].getAttribute('value')).toBe('third answer');
                        expect(fields[1].getAttribute('value')).toBe('third explanation');
                    });
                }

            }
        });

    });
    doRefresh(ptor);
    doWait(ptor);
    goFullscreen(ptor);
    openMCQ(ptor);
    manipulateAnswers(ptor, false, 2);
    doSave(ptor);
    it('should display server\'s feedback', function() {
        feedback(ptor, 'saved');
    })
    //    waitForFeedback(ptor);
    doExit(ptor);
    doRefresh(ptor);
    doWait(ptor);
    goFullscreen(ptor);
    openMCQ(ptor);
    it('should make sure that the answers details were saved after editing them', function() {
        ptor.findElements(protractor.By.className('answer_img')).then(function(answers) {
            var p = 0;
            var j = 0;
            for (var i = 0; i < answers.length; i++) {
                answers[i].getLocation().then(function(location) {
                    expect(location.x).toBe(locationx[j]);
                    expect(location.y).toBe(locationy[j]);
                    j++;
                });
                answers[i].click();
                ptor.findElement(protractor.By.className('popover-content')).then(function(popover) {
                    popover.isDisplayed().then(function(disp) {
                        expect(disp).toBe(true);
                    });
                });
                if (i == answers.length - 1) {
                    ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                        expect(fields[0].getAttribute('value')).toBe('3 answer');
                        expect(fields[1].getAttribute('value')).toBe('3 explanation');
                    });
                }
                if (i == answers.length - 2) {
                    ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                        expect(fields[0].getAttribute('value')).toBe('2 answer');
                        expect(fields[1].getAttribute('value')).toBe('2 explanation');
                    });
                }
                if (i == answers.length - 3) {
                    expect(answers[i].getAttribute('ng-src')).toContain('green');
                    ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                        expect(fields[0].getAttribute('value')).toBe('1 answer');
                        expect(fields[1].getAttribute('value')).toBe('1 explanation');
                    });
                }

            }
        });

    });
    doDeleteAnswer(ptor, 0);
    doSave(ptor);
    //    it('should not be able to save', function(){
    //        ptor.sleep(2000);
    ////        ptor.findElement(protractor.By.id('middle')).then(function(middle){
    //        ptor.findElements(protractor.By.className('alert-error')).then(function(errors){
    //            errors[errors.length-3].getText().then(function(value){
    //                console.log(value);
    //            })
    //            expect(error.getText()).toContain('errors');
    //        });
    ////        });
    ////        var error = ptor.findElement(protractor.By.className('alert-error'));
    ////        expect(error.getText()).toContain('You\'ve got some errors');
    //    });
    it('should select an answer as the correct one', function() {
        ptor.findElement(protractor.By.className('answer_img')).then(function(answer) {
            answer.click();
            ptor.findElement(protractor.By.className('popover-content')).then(function(popover) {
                popover.isDisplayed().then(function(disp) {
                    expect(disp).toBe(true);
                });
            });
            ptor.findElement(protractor.By.className('must_save_check')).then(function(checkbox) {
                checkbox.click();
            });
        });
    });
    doSave(ptor);
    it('should display server\'s feedback', function() {
        feedback(ptor, 'saved');
    })
    //    waitForFeedback(ptor);
    doRefresh(ptor);
    doWait(ptor);
    goFullscreen(ptor);
    openMCQ(ptor);
    it('should make sure that the answer was deleted', function() {
        ptor.findElements(protractor.By.className('answer_img')).then(function(answers) {
            expect(answers.length).toBe(2);
        });
        ptor.findElements(protractor.By.className('answer_img')).then(function(answers) {
            var j = 1;
            for (var i = 0; i < answers.length; i++) {
                answers[i].getLocation().then(function(location) {
                    expect(location.x).toBe(locationx[j]);
                    expect(location.y).toBe(locationy[j]);
                    j++;
                });
                answers[i].click();
                ptor.findElement(protractor.By.className('popover-content')).then(function(popover) {
                    popover.isDisplayed().then(function(disp) {
                        expect(disp).toBe(true);
                    });
                });
                if (i == answers.length - 1) {
                    ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                        expect(fields[0].getAttribute('value')).toBe('3 answer');
                        expect(fields[1].getAttribute('value')).toBe('3 explanation');
                    });
                }
                if (i == answers.length - 2) {
                    expect(answers[i].getAttribute('ng-src')).toContain('green');
                    ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                        expect(fields[0].getAttribute('value')).toBe('2 answer');
                        expect(fields[1].getAttribute('value')).toBe('2 explanation');
                    });
                }
            }
        });
    });
    doExit(ptor);
    doRefresh(ptor);
    doWait(ptor);
    openMCQ(ptor);
    it('should show the MCQ quiz name', function() {
        ptor.findElement(protractor.By.tagName('editable_text')).then(function(quiz_name) {
            expect(quiz_name.getText()).toBe('My Quiz');
        });
    });
    it('should allow changing MCQ quiz name', function() {
        ptor.findElement(protractor.By.id('editing')).then(function(editing) {
            expect(editing.getText()).toContain('My Quiz');
        });
        ptor.findElements(protractor.By.tagName('editable_text')).then(function(editables) {
            expect(editables[0].getText()).toBe('My Quiz');
            //edit quiz name
            ptor.actions().doubleClick(editables[0]).perform();
            ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                field.clear();
                field.sendKeys('The Quiz');
                ptor.findElements(protractor.By.className('btn-primary')).then(function(buttons) {
                    buttons[1].click().then(function() {
                        feedback(ptor, 'updated');
                    });
                });
            });
            expect(editables[0].getText()).toBe('The Quiz');
            ptor.actions().doubleClick(editables[0]).perform();
            ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                field.clear();
                field.sendKeys('New Quiz');
                ptor.findElement(protractor.By.className('icon-remove')).then(function(remove_button) {
                    remove_button.click();
                });
            });
            expect(editables[0].getText()).toBe('The Quiz');
        });
    });
    it('should allow changing quiz time - MCQ Video', function() {
        ptor.findElements(protractor.By.tagName('editable_text')).then(function(time) {
            ptor.actions().doubleClick(time[1]).perform();
            ptor.findElement(protractor.By.className('editable-input')).then(function(field) {
                field.clear();
                field.sendKeys('any text');
                ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm) {
                    confirm.click();
                });
                ptor.findElement(protractor.By.className('editable-error')).then(function(errormessage) {
                    expect(errormessage.getText()).toContain('Incorrect Format for Time');
                });
                field.clear();
                field.sendKeys('00:00:00');
                ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm) {
                    confirm.click();
                });
                ptor.findElement(protractor.By.className('editable-error')).then(function(errormessage) {
                    expect(errormessage.getText()).toContain('Time Outside Video Range');
                });
                field.clear();
                field.sendKeys('00:05:21');
                ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm) {
                    confirm.click();
                });
                ptor.findElement(protractor.By.className('editable-error')).then(function(errormessage) {
                    expect(errormessage.getText()).toContain('Time Outside Video Range');
                });
                field.clear();
                field.sendKeys('00:01:10');
                ptor.findElement(protractor.By.className('icon-ok')).then(function(confirm) {
                    confirm.click().then(function() {
                        feedback(ptor, 'updated');
                    });
                });
            });
            expect(time[1].getText()).toBe('00:01:10');
        });
    });
    scroll(ptor, '-1000');
    moveAnswers(ptor, 50, 0, 0);
    it('should edit answers\' content', function() {
        ptor.findElements(protractor.By.className('answer_img')).then(function(answers) {
            answers.forEach(function(ans, i) {
                var bb = [2, 1];
                ans.click()
                ptor.findElement(protractor.By.className('popover-content')).then(function(popover) {
                    popover.isDisplayed().then(function(disp) {
                        expect(disp).toBe(true);
                    });
                });
                ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                    fields[0].clear();
                    fields[0].sendKeys(convertText(i + 1) + ' answer');
                    fields[1].clear();
                    fields[1].sendKeys(convertText(i + 1) + ' explanation');
                });
            });
        });
    });
    doExit(ptor);
    openMCQ(ptor);
    it('should make sure that the changes were not saved', function() {
        ptor.findElements(protractor.By.className('answer_img')).then(function(answers) {
            var aa = [1, 0];
            answers.forEach(function(ans, i) {
                ans.click();
                ptor.findElement(protractor.By.className('popover-content')).then(function(popover) {
                    popover.isDisplayed().then(function(disp) {
                        expect(disp).toBe(true);
                    });
                });
                ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                    expect(fields[0].getAttribute('value')).toBe(i + 2 + ' answer');
                    expect(fields[1].getAttribute('value')).toBe(i + 2 + ' explanation');
                });
            });
        });
    });

    moveAnswers(ptor, 50, 0, 0);
    it('should edit answers\' content', function() {
        ptor.findElements(protractor.By.className('answer_img')).then(function(answers) {
            answers.forEach(function(ans, i) {
                var bb = [2, 1];
                ans.click()
                ptor.findElement(protractor.By.className('popover-content')).then(function(popover) {
                    popover.isDisplayed().then(function(disp) {
                        expect(disp).toBe(true);
                    });
                });
                ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                    fields[0].clear();
                    fields[0].sendKeys(convertText(i + 1) + ' answer');
                    fields[1].clear();
                    fields[1].sendKeys(convertText(i + 1) + ' explanation');
                });
            });
        });
    });
    doSave(ptor);
    it('should display server\'s feedback', function() {
        feedback(ptor, 'saved');
    })
    //    waitForFeedback(ptor);
    doExit(ptor);
    doRefresh(ptor);
    doWait(ptor);
    scroll(ptor, '1000');
    openMCQ(ptor);
    scroll(ptor, '-1000');
    it('should make sure that the changes were saved - here', function() {
        ptor.findElements(protractor.By.className('answer_img')).then(function(answers) {
            var aa = [1, 0];
            answers.forEach(function(ans, i) {
                ans.click();
                ptor.findElement(protractor.By.className('popover-content')).then(function(popover) {
                    popover.isDisplayed().then(function(disp) {
                        expect(disp).toBe(true);
                    });
                });
                ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                    expect(fields[0].getAttribute('value')).toBe(convertText(i + 1) + ' answer');
                    expect(fields[1].getAttribute('value')).toBe(convertText(i + 1) + ' explanation');
                });
            })
        });
    });
    doDelete(ptor);
    doRefresh(ptor);
    doWait(ptor);
    it('should make sure that the quiz was deleted', function() {
        ptor.findElements(protractor.By.repeater('quiz in quiz_list')).then(function(rows) {
            expect(rows.length).toBe(0);
        });
    });
}

function convertText(no) {
    if (no == 0) {
        return 'zero';
    } else if (no == 1) {
        return 'first';
    } else if (no == 2) {
        return 'second';
    } else if (no == 3) {
        return 'third';
    } else if (no == 4) {
        return 'fourth';
    } else if (no == 5) {
        return 'fifth';
    }
}

function moveAnswers(ptor, x, y, type) {
    if (type == 0) {
        it('should move the question answers', function() {
            ptor.findElements(protractor.By.className('answer_img')).then(function(answers) {
                //                var aa=[2,1,0];
                answers.forEach(function(ans, i) {
                    //                    expect(ans.getAttribute('id')).toBe('');
                    ptor.actions().dragAndDrop(ans, {
                        x: x,
                        y: y
                    }).perform();
                });
            });
        });
    } else if (type == 1) {
        it('should move the \'drag quiz\' answers', function() {
            ptor.findElements(protractor.By.className('dropped')).then(function(answers) {
                answers.forEach(function(ans, i) {
                    ptor.actions().dragAndDrop(ans, {
                        x: x,
                        y: y
                    }).perform();
                });
            });
        });
    }

}

function verifyPositions(ptor, type) {
    var className
    if (type == 0) {
        className = "answer_img";
    } else if (type == 1) {
        className = "dropped";
    }
    it('should make sure that the positions of answers are still the same', function() {
        ptor.wait(function() {
            return ptor.findElements(protractor.By.className(className)).then(function(inputs) {
                if (inputs.length > 0) {
                    return true;
                }
                return false;
            });
        })
        ptor.findElements(protractor.By.className(className)).then(function(answers) {
            var j = 0;
            for (var i = 0; i < answers.length; i++) {
                answers[i].getLocation().then(function(location) {
                    expect(location.x).toBe(locationx[j]);
                    expect(location.y).toBe(locationy[j]);
                    j++;
                });
            }
        });
    });
}

function addMCQAnswers(ptor) {
    it('should add quiz answers on top of the video - MCQ Video', function() {
        var locx = 0,
            locy = 0;
        locationx = new Array();
        locationy = new Array();
        //double click in 3 different places, delta should be in y direction with a positive value
        ptor.executeScript('window.scrollBy(0, -1000)', '');
        ptor.findElement(protractor.By.className('ontop')).then(function(test) {
            ptor.actions().doubleClick(test).perform();
            //-----------------------------------------//
            ptor.findElements(protractor.By.className('dropped')).then(function(answers) {
                answers[answers.length - 1].getLocation().then(function(pnode) {
                    locx = pnode.x + 5;
                    locy = pnode.y;
                });
                ptor.actions().dragAndDrop({
                    x: locx,
                    y: locy
                }, {
                    x: 200,
                    y: 115
                }).perform();
                answers[answers.length - 1].getLocation().then(function(location) {
                    locationx.splice(locationx.length, 0, location.x);
                    locationy.splice(locationy.length, 0, location.y);
                    //                    console.log(locationx[locationx.length-1] + " " + locationy[locationy.length-1]);
                });
                ptor.findElement(protractor.By.className('popover-content')).then(function(popover) {
                    popover.isDisplayed().then(function(disp) {
                        expect(disp).toBe(true);
                    });
                });
                ptor.findElement(protractor.By.className('must_save_check')).then(function(correct) {
                    correct.click();
                });
                expect(answers[answers.length - 1].getAttribute('ng-src')).toContain('green');
                ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                    fields[0].sendKeys('first answer');
                    fields[1].sendKeys('first explanation');
                });
            });
        });

        ptor.findElement(protractor.By.className('ontop')).then(function(test) {
            var loc2x = 0,
                loc2y = 0;
            ptor.actions().doubleClick(test).perform();
            //-----------------------------------------//
            ptor.findElements(protractor.By.className('dropped')).then(function(answers) {
                answers[answers.length - 1].getLocation().then(function(pnode) {
                    loc2x = pnode.x + 5;
                    loc2y = pnode.y;
                });
                ptor.actions().dragAndDrop({
                    x: loc2x,
                    y: loc2y
                }, {
                    x: 200,
                    y: 165
                }).perform();
                answers[answers.length - 1].getLocation().then(function(location) {
                    locationx.splice(locationx.length, 0, location.x);
                    locationy.splice(locationy.length, 0, location.y);
                    //                    console.log(locationx[locationx.length-1] + " " + locationy[locationy.length-1]);
                });
                ptor.findElement(protractor.By.className('popover-content')).then(function(popover) {
                    popover.isDisplayed().then(function(disp) {
                        expect(disp).toBe(true);
                    });
                });
                ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                    fields[0].sendKeys('second answer');
                    fields[1].sendKeys('second explanation');
                });
            });
        });


        ptor.findElement(protractor.By.className('ontop')).then(function(test) {
            var loc3x = 0,
                loc3y = 0;
            ptor.actions().doubleClick(test).perform();
            //-----------------------------------------//
            ptor.findElements(protractor.By.className('dropped')).then(function(answers) {
                answers[answers.length - 1].getLocation().then(function(pnode) {
                    loc3x = pnode.x + 5;
                    loc3y = pnode.y;
                });
                ptor.actions().dragAndDrop({
                    x: loc3x,
                    y: loc3y
                }, {
                    x: 200,
                    y: 215
                }).perform();
                answers[answers.length - 1].getLocation().then(function(location) {
                    locationx.splice(locationx.length, 0, location.x);
                    locationy.splice(locationy.length, 0, location.y);
                    //                    console.log(locationx[locationx.length-1] + " " + locationy[locationy.length-1]);
                });
                ptor.findElement(protractor.By.className('popover-content')).then(function(popover) {
                    popover.isDisplayed().then(function(disp) {
                        expect(disp).toBe(true);
                    });
                });
                ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                    fields[0].sendKeys('third answer');
                    fields[1].sendKeys('third explanation');
                });
            });
        });
    });
}

function openMCQ(ptor) {
    it('should reopen the quiz', function() {
        ptor.findElement(protractor.By.tagName('editable_text')).then(function(quiz_name) {
            quiz_name.click().then(function() {
                ptor.sleep(5000);
            });
        });
    });
}

function doExit(ptor) {
    it('should exit without saving', function() {
        ptor.findElements(protractor.By.id('done')).then(function(exit) {
            exit[1].click();
        });
    });
}

function doSave(ptor) {
    it('should save', function() {
        ptor.findElement(protractor.By.id('done')).then(function(save) {
            save.click();
        });
    });
}

function doDelete(ptor) {
    it('should delete the quiz', function() {
        ptor.findElements(protractor.By.className('delete')).then(function(delete_buttons) {
            delete_buttons[delete_buttons.length - 1].click().then(function() {
                ptor.findElement(protractor.By.className('btn-danger')).then(function(button) {
                    //                                buttons[buttons.length-1].click();
                    button.click().then(function() {
                        feedback(ptor, 'deleted');
                    });
                });
            });
        });
    });

}

function doRefresh(ptor) {
    it('should refresh the page', function() {
        ptor.navigate().refresh();

    });
}

function doChangeAspectRatio(ptor, which) {
    if (which == 0) {
        con = "to widescreen";
    } else if (which == 1) {
        con = "to smallscreen";
    } else {
        return;
    }
    it('should change video\'s aspect ratio', function() {
        ptor.findElement(protractor.By.tagName('details-select')).then(function(aspect) {
            aspect.click();
        });
        //        ptor.findElement(protractor.By.tagName('select')).then(function(dropDown){
        //            dropDown.isDisplayed().then(function(disp){
        //                expect(disp).toBe(true);
        //            });
        //            dropDown.click();
        //        });
        ptor.findElements(protractor.By.tagName('option')).then(function(options) {
            options[which].click().then(function() {
                feedback(ptor, 'updated');
            });
        });
    });
}

function doDeleteAnswer(ptor, type) {
    if (type == 0) {
        it('should delete an answer from MCQ question - Over Video', function() {
            ptor.findElement(protractor.By.className('answer_img')).then(function(answer) {
                answer.click();
            });
            ptor.findElement(protractor.By.className('popover-content')).then(function(popover) {
                popover.isDisplayed().then(function(disp) {
                    expect(disp).toBe(true);
                });
            });
            ptor.findElement(protractor.By.className('remove_button')).then(function(remove) {
                remove.click();
            });
        });
    } else if (type == 1) {
        it('should delete an answer from DRAG QUIZ - Over Video', function() {
            ptor.findElement(protractor.By.className('area')).then(function(field) {
                field.click();
                ptor.sleep(20000);
                ptor.findElement(protractor.By.className('remove_button')).click();
            })
        })
    } else if (type == 2) {

    }

}

function goFullscreen(ptor) {
    it('should go to fullscreen mode', function() {
        ptor.findElement(protractor.By.className('fullscreenLink')).then(function(fullscreen_button) {
            fullscreen_button.click();
        });
    });
}

function exitFullscreen(ptor) {
    it('should exit fullscreen mode', function() {
        console.log('exiting fullscreen mode');
        ptor.findElements(protractor.By.className('fullscreenLink')).then(function(links) {
            links[1].click();
        });
    });
}

function doWait(ptor) {
    it('should wait', function() {
        ptor.wait(function() {
            return ptor.findElement(protractor.By.className('overlay')).then(function(loading) {
                return loading.isDisplayed().then(function(disp) {
                    return !disp;
                });
            });
        });
        ptor.sleep(10000);
    });
}

function manipulateAnswers(ptor, moveAnswers, input) {
    var addData, editData;
    if (input == 0 || input > 2 || input < 0) {
        addData = false;
        editData = false;
    } else if (input == 1) {
        addData = true;
        editData = false;
    } else if (input == 2) {
        addData = false;
        editData = true;
    }
    var i = 0;
    var add_option = '';
    var edit_option = '';
    var move_option = '';

    if (addData == true) {
        add_option = ', add data';
    }
    if (moveAnswers == true) {
        move_option = ', reposition answers';
    }
    if (editData == true) {
        edit_option = ', edit answers'
    }

    it('should ' + move_option + edit_option + add_option, function() {
        if (moveAnswers == true) {
            ptor.findElements(protractor.By.className('answer_img')).then(function(answers) {
                answers.forEach(function(ans, i) {
                    var answer_text = '';
                    var answer_explain_text = '';
                    if (moveAnswers == true) {
                        var aa = [0, 1, 0]
                        var value = 115 + (i * 50);
                        ptor.actions().dragAndDrop(answers[aa[i]], {
                            x: 200,
                            y: value
                        }).perform();
                    }
                    if (addData == true || editData == true) {

                        ptor.findElement(protractor.By.className('popover-content')).then(function(popover) {
                            popover.isDisplayed().then(function(disp) {
                                expect(disp).toBe(true);
                            });
                        });
                        if (i == 0) {
                            ptor.findElement(protractor.By.className('must_save_check')).then(function(correct) {
                                correct.click();
                            });
                        }
                        if (addData == true) {
                            if (i == 0) {
                                console.log('adding ' + i);
                                answer_text = 'first answer';
                                answer_explain_text = 'first explanation';
                            }
                            if (i == 1) {
                                console.log('adding ' + i);
                                answer_text = 'second answer';
                                answer_explain_text = 'second explanation';
                            }
                            if (i == 2) {
                                console.log('adding ' + i);
                                answer_text = 'third answer';
                                answer_explain_text = 'third explanation';
                            }

                            ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                                console.log('committed');
                                fields[0].sendKeys(answer_text);
                                fields[1].sendKeys(answer_explain_text);
                            });
                        } else if (editData == true) {

                            if (i == 0) {
                                //                                console.log('editing '+i);
                                answer_text = '3 answer';
                                answer_explain_text = '3 explanation';
                            }
                            if (i == 1) {
                                //                                console.log('editing '+i);
                                answer_text = '2 answer';
                                answer_explain_text = '2 explanation';
                            }
                            if (i == 2) {
                                //                                console.log('editing '+i);
                                answer_text = '1 answer';
                                answer_explain_text = '1 explanation';
                            }

                            ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                                console.log('committed')
                                fields[0].clear();
                                fields[0].sendKeys(answer_text);
                                fields[1].clear();
                                fields[1].sendKeys(answer_explain_text);
                            });
                        }

                    }
                })
            });
        } else if (moveAnswers == false) {
            ptor.findElements(protractor.By.className('answer_img')).then(function(answers) {
                answers.forEach(function(and, m) {
                    var bb = [2, 1, 0];
                    var answer = '';
                    var explanation = '';
                    answers[bb[m]].click();
                    ptor.findElement(protractor.By.className('popover-content')).then(function(popover) {
                        popover.isDisplayed().then(function(disp) {
                            expect(disp).toBe(true);
                        });
                    });

                    if (addData == true) {
                        if (bb[m] == answers.length - 1) {
                            ptor.findElement(protractor.By.className('must_save_check')).then(function(correct) {
                                correct.click();
                            });
                        }
                        if (bb[m] == 2) {
                            console.log('adding ' + m);
                            answer = '1 answer';
                            explanation = 'first explanation';
                        }
                        if (bb[m] == 1) {
                            console.log('adding ' + m);
                            answer = '2 answer';
                            explanation = 'first explanation';
                        }
                        if (bb[m] == 0) {
                            console.log('adding ' + m);
                            answer = '3 answer';
                            explanation = 'first explanation';
                        }
                        ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                            console.log('committed')
                            fields[0].clear();
                            fields[0].sendKeys(answer);
                            fields[1].clear();
                            fields[1].sendKeys(explanation);
                        });
                    } else if (editData == true) {
                        if (bb[m] == 2) {
                            //                            console.log('editing '+m);
                            answer = '3 answer';
                            explanation = '3 explanation';
                        }
                        if (bb[m] == 1) {
                            //                            console.log('editing '+m);
                            answer = '2 answer';
                            explanation = '2 explanation';
                        }
                        if (bb[m] == 0) {
                            //                            console.log('editing '+m);
                            answer = '1 answer';
                            explanation = '1 explanation';
                        }
                        ptor.findElements(protractor.By.className('must_save')).then(function(fields) {
                            //                            console.log('committed')
                            fields[0].clear();
                            fields[0].sendKeys(answer);
                            fields[1].clear();
                            fields[1].sendKeys(explanation);
                        });
                    }
                })
            });
        }
    });

}

function waitForFeedback(ptor) {
    it('should wait for server feedback', function() {
        ptor.wait(function() {
            return ptor.findElement(protractor.By.id('error_container')).then(function(message) {
                return message.getText().then(function(text) {
                    console.log(text);
                    if (text.length > 2) {

                        return true;
                    } else {
                        return false;
                    }

                });
            });
        });
    });
}

function scroll(ptor, value) {
    it('should scroll by ' + value, function() {
        ptor.executeScript('window.scrollBy(0, ' + value + ')', '');
    })
}

function feedback(ptor, message) {
    ptor.wait(function() {
        return ptor.findElement(protractor.By.id('error_container')).then(function(message) {
            return message.getText().then(function(text) {
                console.log(text);
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

function waitForOverlay(ptor) {
    it('should wait for the loading sign to disappear', function() {
        ptor.wait(function() {
            return ptor.findElement(protractor.By.className('overlay')).then(function(loading) {
                return loading.isDisplayed().then(function(disp) {
                    return !disp;
                });
            });
        });
    });
}