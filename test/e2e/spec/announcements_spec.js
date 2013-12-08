var current_date = new Date();
var enroll_key = '';
var names = new Array ();
var fetched_data = new Array();
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

describe('Announcements Page', function(){
    var ptor = protractor.getInstance();
    var driver = ptor.driver;

    var findByName = function(name){
        return driver.findElement(protractor.By.name(name));
    };
    var findById = function(id){
        return driver.findElement(protractor.By.id(id))
    };

    login(ptor, driver, 'admin@scalear.com', 'password', 'Administrator', findByName);

    describe('Teacher', function(){
        it('should go to course\'s announcements page', function(){
            ptor.get('/#/courses/1/announcements');
        });

    });
});

function doDeleteAnnouncements(ptor, driver){
    it('should delete all announcements', function(){
        ptor.findElements(protractor.By.className('delete_image')).then(function(delete_buttons){
            delete_buttons.forEach(function(button, i){
                button.click();
                var alert_dialog = ptor.switchTo().alert();
                alert_dialog.accept();
            });
        });
    });
}
