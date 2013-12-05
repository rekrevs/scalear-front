var util = require('util');

var current_date = new Date();
var enroll_key = '';
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
//        driver.get("http://10.0.0.16:9000/#/login");
        driver.get("http://angular-edu.herokuapp.com/#/login");
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
//        driver.get("http://10.0.0.16:4000/");
        driver.get("http://scalear-auth.herokuapp.com");
        driver.findElements(protractor.By.tagName('a')).then(function(logout){
            logout[4].click();
        });
    });
}


describe("Course Information Pages",function(){
    var ptor = protractor.getInstance();
    var driver = ptor.driver;

    var findByName = function(name){
        return driver.findElement(protractor.By.name(name));
    };
    var findById = function(id){
        return driver.findElement(protractor.By.id(id))
    };

//    login(ptor, driver, 'admin@scalear.com', 'password', 'Administrator', findByName);
    login(ptor, driver, 'admin@scalear.com', 'password', 'admin', findByName);

    describe('Courses Page', function(){
        it('should create a new course', function(){
            ptor = protractor.getInstance();
            ptor.get('/#/courses/new');
            ptor.findElements(protractor.By.tagName('input')).then(function(fields){
                fields[fields.length-1].click();
            });
            ptor.findElements(protractor.By.className('controls')).then(function(rows){
                expect(rows[0].getText()).toContain('Course Short Name is Required');
                expect(rows[1].getText()).toContain('Course Name is Required');
                expect(rows[2].getText()).toContain('Course Start Date is Required');
                expect(rows[3].getText()).toContain('Course Duration is Required');
                expect(rows[7].getText()).toContain('Course Time Zone is Required');
            });
            ptor.findElements(protractor.By.tagName('input')).then(function(fields){
                fields[0].sendKeys('TEST-101');
                fields[1].sendKeys('Testing Course');
                fields[2].sendKeys(today_keys);
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
        it('should go to course', function(){
            ptor.findElement(protractor.By.className('dropdown-toggle')).click();
            ptor.findElement(protractor.By.id('info')).click();
        });
    });
    describe('Teacher Course Information', function(){
        it('should show course short name and course title', function(){
            ptor.findElement(protractor.By.tagName('h3')).then(function(title){
                expect(title.getText()).toBe('TEST-101 | Testing Course');
            });
        });
        it('should display course enrollment key', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                data[0].getText().then(function(text){
                    enroll_key = text;
                });
            });
        });
        it('should display course start date', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                expect(data[1].getText()).toBe(today);
            });
        });
        it('should display course duration', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                expect(data[2].getText()).toBe('5 Weeks');
            });
        });
        it('should display course discussion forum link', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                expect(data[3].getText()).toBe('http://google.com/ | Visit Link');
            });
        });
        it('should display course Description', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                expect(data[4].getText()).toBe('new description');
            });
        });
        it('should display course prerequisites', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                expect(data[5].getText()).toBe('new prerequisites');
            });
        });
        it('should display course time zone', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                expect(data[6].getText()).toBe('Abu Dhabi');
            });
        });

        it('should edit start date', function(){
            ptor.findElement(protractor.By.tagName('details-date')).then(function(date_field){
                date_field.click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys(tomorrow_keys);
                });
                ptor.findElement(protractor.By.className('icon-remove')).click();
                expect(date_field.getText()).toBe(today);
                date_field.click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys('any text');
                });
                ptor.findElement(protractor.By.className('icon-ok')).click();
                expect(date_field.getText()).toBe('empty');
                date_field.click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys(tomorrow_keys);
                });
                ptor.findElement(protractor.By.className('icon-ok')).click();
                expect(date_field.getText()).toBe(tomorrow);
            });
        });
        it('should edit duration', function(){
            ptor.findElement(protractor.By.tagName('details-text')).then(function(duration_field){
                duration_field.click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys('10');
                });
                ptor.findElement(protractor.By.className('icon-remove')).click();
                expect(duration_field.getText()).toBe('5');
                duration_field.click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys('any text');
                });
                ptor.findElement(protractor.By.className('icon-ok')).click();
                expect(duration_field.getText()).toBe('5');
                duration_field.click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys('-10');
                });
                ptor.findElement(protractor.By.className('icon-ok')).click();
                expect(duration_field.getText()).toBe('5');
                duration_field.click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys('10');
                });
                ptor.findElement(protractor.By.className('icon-ok')).click();
                expect(duration_field.getText()).toBe('10');
            });
        });
        it('should edit discussion forum link', function(){
            ptor.findElements(protractor.By.tagName('details-text')).then(function(fields){
                fields[1].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys('http://www.anylink.com/');
                });
                ptor.findElement(protractor.By.className('icon-remove')).click();
                expect(fields[1].getText()).toBe('http://google.com/');
                fields[1].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys(' ');
                });
                ptor.findElement(protractor.By.className('icon-ok')).click();
                expect(fields[1].getText()).toBe('empty');

                fields[1].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys('http://www.google.com');
                });
                ptor.findElement(protractor.By.className('icon-ok')).click();
                expect(fields[1].getText()).toBe('http://www.google.com');
            });
        });
        it('should edit course description', function(){
            ptor.findElements(protractor.By.tagName('big-area')).then(function(fields){
                fields[0].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys('anything');
                });
                ptor.findElement(protractor.By.className('icon-remove')).click();
                expect(fields[0].getText()).toBe('new description');

                fields[0].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys(' ');
                });
                ptor.findElement(protractor.By.className('icon-ok')).click();
                expect(fields[0].getText()).toBe('Empty');

                fields[0].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys('any description');
                });
                ptor.findElement(protractor.By.className('icon-ok')).click();
                expect(fields[0].getText()).toBe('any description');
            });
        });
        it('should edit course prerequisites', function(){
            ptor.findElements(protractor.By.tagName('big-area')).then(function(fields){
                fields[1].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys('anything');
                });
                ptor.findElement(protractor.By.className('icon-remove')).click();
                expect(fields[1].getText()).toBe('new prerequisites');

                fields[1].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys(' ');
                });
                ptor.findElement(protractor.By.className('icon-ok')).click();
                expect(fields[1].getText()).toBe('Empty');

                fields[1].click();
                ptor.findElement(protractor.By.className('editable-input')).then(function(field){
                    field.clear();
                    field.sendKeys('any prerequisites');
                });
                ptor.findElement(protractor.By.className('icon-ok')).click();
                expect(fields[1].getText()).toBe('any prerequisites');
            });
        });
        it('should edit course time zone', function(){
            ptor.findElement(protractor.By.tagName('details-select')).then(function(field){
                field.click();
                ptor.findElements(protractor.By.tagName('select')).then(function(dropdown){
                    dropdown[0].click();
                    ptor.findElements(protractor.By.tagName('option')).then(function(options){
                        options[2].click();
                    });
                });
                expect(field.getText()).toBe('Alaska')
            });
        });
        it('should refresh the page', function(){
            ptor.navigate().refresh();
        });
        it('should show course short name and course title after refresh', function(){
            ptor.findElement(protractor.By.tagName('h3')).then(function(title){
                expect(title.getText()).toBe('TEST-101 | Testing Course');
            });
        });

        it('should display course start date after refresh', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                expect(data[1].getText()).toBe(tomorrow);
            });
        });
        it('should display course duration after refresh', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                expect(data[2].getText()).toBe('10 Weeks');
            });
        });
        it('should display course discussion forum link after refresh', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                expect(data[3].getText()).toBe('http://www.google.com | Visit Link');
            });
        });
        it('should display course Description after refresh', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                expect(data[4].getText()).toBe('any description');
            });
        });
        it('should display course prerequisites after refresh', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                expect(data[5].getText()).toBe('any prerequisites');
            });
        });
        it('should display course time zone after refresh', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                expect(data[6].getText()).toBe('Alaska');
            });
        });
    });
    describe('Teacher Course Enrolled Students', function(){

    });
    describe('Teacher Course Teachers', function(){
        it('should go to teachers', function(){
            ptor.findElement(protractor.By.className('dropdown-toggle')).click();
            ptor.findElement(protractor.By.id('teachers')).click();
        });
        it('should display the course teacher only', function(){
            ptor.findElements(protractor.By.id('teacher')).then(function(teachers){
                expect(teachers.length).toBe(1);
            });
        });
        it('should display teacher\'s email', function(){
            ptor.findElement(protractor.By.id('email')).then(function(email){
                expect(email.getText()).toBe('admin@scalear.com');
            })
        });
        it('should display teacher\'s role', function(){
            ptor.findElement(protractor.By.id('role')).then(function(role){
                expect(role.getText()).toBe('Professor');
            });
        });
        it('should display teacher\'s status', function(){
            ptor.findElement(protractor.By.id('status')).then(function(status){
                expect(status.getText()).toBe('Owner');
            });
        });

        it('should add new rows for teachers', function(){
            ptor.findElement(protractor.By.id('add_teacher')).then(function(add_teacher){
                add_teacher.click();
                ptor.findElements(protractor.By.id('new_teacher')).then(function(new_teachers){
                    expect(new_teachers.length).toBe(1);
                });
                add_teacher.click();
                add_teacher.click();
                ptor.findElements(protractor.By.id('new_teacher')).then(function(new_teachers){
                    expect(new_teachers.length).toBe(3);
                });
                ptor.findElement(protractor.By.id('delete_new_teacher')).click();
                ptor.findElements(protractor.By.id('new_teacher')).then(function(new_teachers){
                    expect(new_teachers.length).toBe(2);
                });
            });
        });
        it('should input new teachers\' emails', function(){
            ptor.findElements(protractor.By.id('new_email')).then(function(emails){
                emails[0].sendKeys('prof@email.com');
                emails[1].sendKeys('ta@email.com');
            })
        });
        it('should select new teachers\' roles', function(){
            ptor.findElements(protractor.By.tagName('select')).then(function(roles){
                roles[0].click();
                ptor.findElements(protractor.By.tagName('option')).then(function(options){
                    options[1].click();
                });
                roles[1].click();
                ptor.findElements(protractor.By.tagName('option')).then(function(options){
                    options[options.length-1].click();
                });
            })

        });
        it('should save new teachers', function(){
//            ptor.sleep(10000);
            ptor.findElement(protractor.By.className('btn-primary')).click();
        });
        it('should display teachers\' emails', function(){
            ptor.findElements(protractor.By.id('email')).then(function(emails){
                expect(emails[0].getText()).toBe('admin@scalear.com');
                expect(emails[1].getText()).toBe('prof@email.com');
                expect(emails[2].getText()).toBe('ta@email.com');
            })
        });
        it('should display teachers\' roles', function(){
            ptor.findElements(protractor.By.id('role')).then(function(roles){
                expect(roles[0].getText()).toBe('Professor');
                expect(roles[1].getText()).toBe('Professor');
                expect(roles[2].getText()).toBe('TA');
            });
        });
        it('should display teachers\' status', function(){
            ptor.findElements(protractor.By.id('status')).then(function(status){
                expect(status[0].getText()).toBe('Owner');
                expect(status[1].getText()).toBe('Pending');
                expect(status[2].getText()).toBe('Pending');

            });
        });
        it('should delete a teacher', function(){
            ptor.findElements(protractor.By.id('delete_teacher')).then(function(delete_buttons){
                delete_buttons[delete_buttons.length-1].click();
                var alert_dialog = ptor.switchTo().alert();
                alert_dialog.dismiss();
                ptor.findElements(protractor.By.id('teacher')).then(function(teachers){
                    expect(teachers.length).toBe(3);
                });
                delete_buttons[delete_buttons.length-1].click();
                var alert_dialog = ptor.switchTo().alert();
                alert_dialog.accept();
                ptor.findElements(protractor.By.id('teacher')).then(function(teachers){
                    expect(teachers.length).toBe(2);
                });
            })
        });

        it('should allow editing teachers\' roles', function(){
            ptor.findElements(protractor.By.tagName('details-select')).then(function(roles){
                roles[roles.length-1].click();
                ptor.findElement(protractor.By.tagName('select')).click();
                ptor.findElements(protractor.By.tagName('option')).then(function(options){
                    options[options.length-1].click();
                });
            });
        });
        it('should refresh the page', function(){
            ptor.navigate().refresh();
        });
        it('should make sure that the role has changed', function(){
            ptor.findElements(protractor.By.id('role')).then(function(roles){
                expect(roles[roles.length-1].getText()).toBe('TA');
            });
        });
    });
    describe('Teacher', function(){
        logout(ptor, driver);
    });
    describe('Student', function(){
        login(ptor, driver, 'em_menshawi@hotmail.com', 'password', 'Mahmoud Menshawi', findByName);
        it('should enroll in the course that was created', function(){
            ptor.findElement(protractor.By.id('join_course')).then(function(join_course){
                join_course.click();
            });
        });
//        it('should try to proceed without enrollment key', function(){
//            ptor.findElement(protractor.By.className('btn-primary')).then(function(proceed){
//                proceed.click();
//            });
////            ptor.findElement(protractor.By.className('help-inline')).then(function(validation){
////                expect(validation.getText()).toBe('Required!');
////            });
//        });
        it('should try to proceed with a wrong enrollment key', function(){
            ptor.findElement(protractor.By.tagName('input')).then(function(key_field){
                key_field.sendKeys('anykey');
            });
            ptor.findElement(protractor.By.className('btn-primary')).then(function(proceed){
                proceed.click();
            });
            ptor.findElement(protractor.By.className('errormessage')).then(function(validation){
                expect(validation.getText()).toBe('Course Does Not Exist');
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
        it('should click on the course name', function(){
            ptor.findElements(protractor.By.tagName('a')).then(function(links){
                links[links.length-2].click();
            });
        });
        it('should go to course information page', function(){
            ptor.findElements(protractor.By.tagName('a')).then(function(links){
                links[12].click();
            });
        });
    });
    describe('Course Information page', function(){
        it('should show course short name and course title', function(){
            ptor.findElement(protractor.By.tagName('h3')).then(function(title){
                expect(title.getText()).toBe('TEST-101 | Testing Course');
            });
        });
        it('should display correct start date', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                data[0].getText().then(function(text){
                    var start_date = new Date(text);
                    expect(formatDate(start_date, 1)).toBe(tomorrow);
                });
            });
        });
        it('should display correct course duration', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                expect(data[1].getText()).toBe('10 Weeks');
            });
        });
        it('should display correct discussion forum link', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                expect(data[2].getText()).toBe('http://www.google.com');
            });
        });
        it('should display correct course description', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                expect(data[3].getText()).toBe('any description');
            });
        });
        it('should display correct course prerequisites', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                expect(data[4].getText()).toBe('any prerequisites');
            });
        });
    });
    describe('Student', function(){
        logout(ptor, driver);
    });
    describe('Student', function(){
        login(ptor, driver, 'bahia.sharkawy@gmail.com', 'password', 'bahia sharkawy', findByName);
        it('should enroll in the course that was created', function(){
            ptor.findElement(protractor.By.id('join_course')).then(function(join_course){
                join_course.click();
            });
        });
//        it('should try to proceed without enrollment key', function(){
//            ptor.findElement(protractor.By.className('btn-primary')).then(function(proceed){
//                proceed.click();
//            });
////            ptor.findElement(protractor.By.className('help-inline')).then(function(validation){
////                expect(validation.getText()).toBe('Required!');
////            });
//        });
        it('should try to proceed with a wrong enrollment key', function(){
            ptor.findElement(protractor.By.tagName('input')).then(function(key_field){
                key_field.sendKeys('anykey');
            });
            ptor.findElement(protractor.By.className('btn-primary')).then(function(proceed){
                proceed.click();
            });
            ptor.findElement(protractor.By.className('errormessage')).then(function(validation){
                expect(validation.getText()).toBe('Course Does Not Exist');
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
        it('should click on the course name', function(){
            ptor.findElements(protractor.By.tagName('a')).then(function(links){
                links[links.length-2].click();
            });
        });
        it('should go to course information page', function(){
            ptor.findElements(protractor.By.tagName('a')).then(function(links){
                links[12].click();
            });
        });
    });
    describe('Course Information page', function(){
        it('should show course short name and course title', function(){
            ptor.findElement(protractor.By.tagName('h3')).then(function(title){
                expect(title.getText()).toBe('TEST-101 | Testing Course');
            });
        });
        it('should display correct start date', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                data[0].getText().then(function(text){
                    var start_date = new Date(text);
                    expect(formatDate(start_date, 1)).toBe(tomorrow);
                });
            });
        });
        it('should display correct course duration', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                expect(data[1].getText()).toBe('10 Weeks');
            });
        });
        it('should display correct discussion forum link', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                expect(data[2].getText()).toBe('http://www.google.com');
            });
        });
        it('should display correct course description', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                expect(data[3].getText()).toBe('any description');
            });
        });
        it('should display correct course prerequisites', function(){
            ptor.findElements(protractor.By.tagName('p')).then(function(data){
                expect(data[4].getText()).toBe('any prerequisites');
            });
        });
    });
    describe('Student', function(){
        logout(ptor, driver);
    });
    describe('Teacher', function(){
        login(ptor, driver, 'admin@scalear.com', 'password', 'admin', findByName);
//        login(ptor, driver, 'admin@scalear.com', 'password', 'Administrator', findByName);
        it('should go to course', function(){
            ptor.findElements(protractor.By.tagName('a')).then(function(links){
                links[links.length-6].click();
            });
        });
        it('should go to enrolled students page', function(){
            ptor.executeScript('window.scrollBy(0, -1000)', '');
            ptor.findElement(protractor.By.className('dropdown-toggle')).click();
            ptor.findElement(protractor.By.id('enrolled')).click();
        });
    });
    describe('Enrolled Students Page', function(){
        it('should display all enrolled students in the course', function(){
            ptor.findElements(protractor.By.tagName('tr')).then(function(rows){
                expect(rows.length).toBe(3);
            });
            ptor.findElements(protractor.By.tagName('td')).then(function(data){
//                expect(data[0].getText()).toBe('Bahia');
                expect(data[0].getText()).toBe('bahia sharkawy');
                expect(data[1].getText()).toBe('bahia.sharkawy@gmail.com');
                expect(data[4].getText()).toBe('Mahmoud Menshawi');
                expect(data[5].getText()).toBe('em_menshawi@hotmail.com');
            });
        });
        it('should filter the students according to the search text', function(){
            ptor.findElement(protractor.By.id('search')).then(function(search_field){
                search_field.sendKeys('anything');
                ptor.findElements(protractor.By.tagName('tr')).then(function(rows){
                    expect(rows.length).toBe(1);
                });
                search_field.clear();
                search_field.sendKeys('mahmoud');
                ptor.findElements(protractor.By.tagName('tr')).then(function(rows){
                    expect(rows.length).toBe(2);
                });
                ptor.findElements(protractor.By.tagName('td')).then(function(data){
                    expect(data[0].getText()).toBe('Mahmoud Menshawi');
                    expect(data[1].getText()).toBe('em_menshawi@hotmail.com');
                });
                search_field.clear();
                search_field.sendKeys('bahia');
                ptor.findElements(protractor.By.tagName('tr')).then(function(rows){
                    expect(rows.length).toBe(2);
                });
                ptor.findElements(protractor.By.tagName('td')).then(function(data){
//                    expect(data[0].getText()).toBe('Bahia');
                    expect(data[0].getText()).toBe('bahia sharkawy');
                    expect(data[1].getText()).toBe('bahia.sharkawy@gmail.com');
                });
            });
        });
        it('should allow emailing one student', function(){
            ptor.findElement(protractor.By.id('email_address')).then(function(email){
                email.click();
            });
            ptor.findElement(protractor.By.id('to')).then(function(email_field){
                expect(email_field.getAttribute('value')).toBe('bahia.sharkawy@gmail.com');
            });
        });

        it('should enter email subject', function(){
            ptor.findElement(protractor.By.id('subject')).then(function(subject_field){
                subject_field.sendKeys('any subject');
            });
        });
        it('should enter email body', function(){
            ptor.findElement(protractor.By.id('tinymce_body_ifr')).then(function(tinymce_ifr){
                ptor.switchTo().frame(tinymce_ifr);
                driver.findElement(protractor.By.tagName("body")).sendKeys('anything');
                driver.switchTo().defaultContent();
//                ptor.findElement(protractor.By.tagName('body')).then(function(body_field){
//                    body_field.sendKeys(('anything'));
//                });
            });

        });
        it('should send the email', function(){
            driver.findElement(protractor.By.id('send_email')).click();
        });

        it('should allow emailing several students', function(){
            ptor.findElements(protractor.By.className('checks')).then(function(checkboxes){
                expect(checkboxes.length).toBe(2);
                checkboxes[0].click();
                checkboxes[1].click();
            });
            ptor.findElement(protractor.By.id('email_button')).then(function(email_button){
                email_button.click();
            });
            ptor.findElement(protractor.By.id('to')).then(function(email_field){
                expect(email_field.getAttribute('value')).toBe('bahia.sharkawy@gmail.com; em_menshawi@hotmail.com; ');
            });
        });
        it('should enter email subject', function(){
            ptor.findElement(protractor.By.id('subject')).then(function(subject_field){
                subject_field.sendKeys('any subject');
            });
        });
        it('should enter email body', function(){
            ptor.findElement(protractor.By.id('tinymce_body_ifr')).then(function(tinymce_ifr){
                ptor.switchTo().frame(tinymce_ifr);
                driver.findElement(protractor.By.tagName("body")).sendKeys('anything');
                driver.switchTo().defaultContent();
            });
        });
        it('should send the email', function(){
            driver.findElement(protractor.By.id('send_emails')).click();
        });

        it('should allow removing students from course', function(){
            ptor.findElements(protractor.By.id('remove_button')).then(function(remove){
                remove[0].click();
                var alert_dialog = ptor.switchTo().alert();
                alert_dialog.accept();
                remove[1].click();
                alert_dialog = ptor.switchTo().alert();
                alert_dialog.accept();
                ptor.findElements(protractor.By.tagName('tr')).then(function(rows){
                    expect(rows.length).toBe(1);
                });
            });
        });

        it('should refresh the page', function(){
            ptor.navigate().refresh();
        });
        it('should display no students enrolled under the course', function(){
            ptor.findElements(protractor.By.tagName('tr')).then(function(rows){
                expect(rows.length).toBe(1);
            });
        });

    });

    describe('Teacher', function(){
        it('should navigate to courses list page', function(){
            ptor.get('/#/courses');
        });
        it('should delete the created course', function(){
            ptor.findElements(protractor.By.className('delete_image')).then(function(delete_buttons){
                delete_buttons[delete_buttons.length-1].click();
                var alert_dialog = ptor.switchTo().alert();
                alert_dialog.accept();
                ptor.sleep(1000);
            });
        });
    });



});



