var ptor = protractor.getInstance();
var driver = ptor.driver;

var frontend = 'http://localhost:9000/';
var backend = 'http://localhost:3000/';
var auth = 'http://localhost:4000/';

var suser = 'bahia.sharkawy@gmail.com';
var tuser = 'anyteacher@email.com';

var spass = 'password';
var tpass = 'password';

var enrollment_key = '340126646c'; //testing course enrollment key

browser.driver.manage().window().maximize();

describe('enroll', function(){
    login(ptor, suser, spass);
    joincourse(ptor, enrollment_key);
    
});
//=====================================
//        feedback
//=====================================
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

//=====================================
//        login
//=====================================
function login(ptor, email, password) {
    it('should login', function() {
        ptor.get('/');
        
        ptor.findElements(protractor.By.id('user_email')).then(function(email_field) {
            email_field[1].sendKeys(email);
        });
        ptor.findElement(protractor.By.id('user_passowrd')).then(function(password_field) {
            password_field.sendKeys(password);
        });

        ptor.findElements(protractor.By.tagName('input')).then(function(fields){
            fields[13].click().then(function() {
                feedback(ptor, 'Signed in successfully');
            });
        });
    });
}
//=====================================
//        logout
//=====================================
function logout(ptor, driver) {
    it('should logout', function() {
        ptor.sleep(3000);
        ptor.findElement(protractor.By.id('logout_link')).then(function(link) {
            link.click().then(function() {
                
            });
        });
 });
}
//=====================================
//        logout hidden
//=====================================
function logoutHidden(ptor, driver) {
    it('should logout', function() {
        var hid = ptor.findElement(protractor.By.id('logout_link'));
        driver.executeScript("arguments[0].click()", hid).then(function() {
            feedback(ptor, 'Signed out successfully.');
        });
    }, 30000);
}
//=====================================
//        opentray
//=====================================
function opentray(ptor,driver)
{
    it('open tray', function() {
        ptor.findElement(protractor.By.className('menu-icon')).then(function(toggler) {
            toggler.click()
        });
    });
}
//=====================================
//        join course
//=====================================
function joincourse(ptor, key)
{
    it('should open enrollment dialog', function(){
        ptor.findElement(protractor.By.id('join_course')).then(function(link)
        {
            link.click();
        });
    });

    it('should put in enrollment key', function()
    {
        ptor.findElement(protractor.By.name('key')).then(function(input)
        {
            input.sendKeys(key);
        });
    });

    it('should press ok button', function()
    {
        ptor.findElement(protractor.By.id('enroll_button')).then(function(button)
        {
            button.click();
        });
    });
}