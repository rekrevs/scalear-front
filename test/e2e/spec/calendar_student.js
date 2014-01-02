var util = require('util');

var frontend = 'http://localhost:9000/';
var backend = 'http://localhost:3000/';
var auth = 'http://localhost:4000/';

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


describe("Course Information Pages",function(){
    var ptor = protractor.getInstance();
    var driver = ptor.driver;

    var findByName = function(name){
        return driver.findElement(protractor.By.name(name));
    };
    var findById = function(id){
        return driver.findElement(protractor.By.id(id))
    };

    login(ptor, driver, 'admin@scalear.com', 'password', 'Administrator', findByName);
//    login(ptor, driver, 'admin@scalear.com', 'password', 'admin', findByName);

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
        
    });
    
    describe('Teacher', function(){
        logout(driver);
    });
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
                proceed.click();
            });
        });
        it('should click on the course name', function(){
            ptor.findElements(protractor.By.binding('course.name')).then(function(courses){
                courses[courses.length-1].click();
            });
        });
        
    });
    
    describe('Student', function(){
        logout(driver);
    });
   
    describe('Teacher', function(){
        login(ptor, driver, 'admin@scalear.com', 'password', 'Administrator', findByName);
        it('should go to course', function(){
            ptor.findElements(protractor.By.binding('course.name')).then(function(courses){
                courses[courses.length-1].click();
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



