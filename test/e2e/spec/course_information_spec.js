var util = require('util');

var current_date = new Date();
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
//        driver.get("http://angular-edu.herokuapp.com/#/login");
        driver.get("http://10.0.0.16:9000/#/login");
        ptor.findElement(protractor.By.className('btn')).then(function(login_button){
            login_button.click();
        });
//        findByName("user[email]").sendKeys("bahiafayez@hotmail.com");
//        findByName("user[password]").sendKeys("password");
        findByName("user[email]").sendKeys("admin@scalear.com");
        findByName("user[password]").sendKeys("password");
        findByName("commit").click();
        ptor.findElements(protractor.By.tagName('a')).then(function(tags){
            expect(tags[3].getText()).toContain('Administrator');

        });
//        driver.get("http://10.0.0.16/#/login")
    });
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
                expect(fields[0].getText()).toBe('empty');

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
                expect(fields[1].getText()).toBe('empty');

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
});
