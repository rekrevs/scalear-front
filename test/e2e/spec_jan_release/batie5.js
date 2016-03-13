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

function login(ptor, driver, email, password, name) {
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



describe("Test 1", function(){
    var ptor = protractor.getInstance();
    var driver = ptor.driver;
    login(ptor, driver, 'anyteacher@email.com', 'password', 'anyteacher');
    it('should go to create new course', function(){
        ptor.get('/#/courses/new');
        ptor.findElement(protractor.By.className('span12')).then(function(span12){
            span12.findElements(protractor.By.tagName('input')).then(function(inputs){
                expect(inputs.length).toEqual(6);
            });
        });
    });
    it('should input the course information', function(){
        ptor.findElements(protractor.By.tagName('input')).then(function(fields){
            fields[0].sendKeys('1234');
            fields[1].sendKeys('1234 Course');
            fields[3].sendKeys('2');
        });
        ptor.findElements(protractor.By.tagName('option')).then(function(options){
            options[1].click();
        });
    });
    it('should create the course', function(){
        ptor.findElement(protractor.By.className('form-actions')).then(function(form){
            form.findElement(protractor.By.className('btn')).then(function(confirm){
                confirm.click().then(function(){
                    feedback(ptor, 'created');
                });
            })
        })
    })
    it('should store the course id', function(){
        ptor.getCurrentUrl().then(function(url){            
                course_id = url;
                console.log(course_id);
        })
        
    })

});


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






