var ptor = protractor.getInstance();
var driver = ptor.driver;

var frontend = 'http://localhost:9000/';
var backend = 'http://localhost:3000/';
var auth = 'http://localhost:4000/';

var suser = 'bahia.sharkawy@gmail.com';
var tuser = 'anyteacher@email.com';

var spass = 'password';
var tpass = 'password';

browser.driver.manage().window().maximize();

describe('login', function(){    

   login(ptor,suser,spass); 
    //openprofile(ptor);
    opencourse(ptor);
    opentray(ptor,driver);
    opencourseinfo(ptor);
    opentray(ptor, driver);
    logoutHidden(ptor, driver);
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
        
        //ptor.findElements(protractor.By.tagName('input')).then(function(fields){
        //   //for(var r=0;r<=fields.length-1;r++)
        //    var index = 0;
        //    while (index<fields.length)
        //    {
        //        fields[index].getAttribute('value').then(function (val) {
        //        console.log(index+"--"+val);
        //        if (val == 'Sign in') {
        //            console.log(i);
        //        }
        //        });
        //        index++;
        //    }
        //});
        
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
}
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
//        open profile
//=====================================
function openprofile(ptor)
{
    it('open profile', function() {
        ptor.findElement(protractor.By.binding("current_user.name +' '+ current_user.last_name")).click();
    });
}
//=====================================
//        open course
//=====================================
function opencourse(ptor)
{
    it('open course', function() {
        ptor.sleep(3000);
        ptor.findElement(protractor.By.linkText('Computer Architecture')).then(function(link) {
            link.click();
        });
    });
}
//=====================================
//        open course info
//=====================================
function opencourseinfo(ptor)
{
    it('should open course info', function() {
        ptor.sleep(3000);
        ptor.findElement(protractor.By.linkText('Information')).then(function(link) {
            link.click();
        });
    });
}