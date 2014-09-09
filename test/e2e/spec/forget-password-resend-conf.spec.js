var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module');
var youtube = require('./lib/youtube.js');

var ptor = protractor.getInstance();
var params = ptor.params
ptor.driver.manage().window().maximize();

var mail = 'david15551@sharklasers.com';
var password = "password1";

describe("forget password", function(){
	
	it('should press forget password', function(){
		o_c.press_login(ptor);
		element(by.id('forget_password')).click();
		element(by.id('setting_user_email')).sendKeys(mail);
		element(by.id('forget_btn')).click();
		ptor.sleep(15000);
		confirm_account(ptor, mail);
		element(by.id('setting_user_password')).sendKeys(password);
		element(by.id('setting_user_password_confirmation')).sendKeys(password);
		element(by.id('change_password')).click();
		o_c.logout(ptor);

		// o_c.sign_in(ptor, mail, "password").then(function(){
		// 	o_c.feedback(ptor, "valid").then(function(){
		// 		o_c.sign_in(ptor, mail, password).then(function(){
		// 			ptor.getCurrentUrl().then(function(url) {
		// 				expect(url).toContain('dashboard');
		// 			})
		// 		})
		// 	})
		// })
	})
})

 function confirm_account(ptor, smail){
    ptor.driver.get('https://www.guerrillamail.com/inbox');
        ptor.driver.findElement(protractor.By.id("inbox-id")).then(function(inbox){
            inbox.click().then(function(){
                ptor.driver.findElement(protractor.By.xpath('//*[@id="inbox-id"]/input')).then(function(mail){
                    mail.clear()
                    mail.sendKeys(smail.split('@')[0]).then(function(){
                        ptor.driver.findElement(protractor.By.xpath('//*[@id="inbox-id"]/button[1]')).then(function(set_btn){
                            set_btn.click().then(function(){
                                ptor.driver.findElement(protractor.By.id('use-alias')).then(function(check_scram){
                                    check_scram.click().then(function(){
                                        ptor.driver.sleep(11000);
                                        ptor.driver.findElements(protractor.By.tagName('td')).then(function(emails){
                                            console.log(emails.length);
                                            emails[1].click();
                                            ptor.driver.sleep(3000).then(function(){
                                                ptor.driver.findElement(protractor.By.partialLinkText('?reset_password')).then(function(link){
                                                    link.getText().then(function(confirm_link){
                                                        console.log(confirm_link);
                                                        var final_link = params.frontend+confirm_link.split('#')[1];
                                                        ptor.driver.get(final_link).then(function(){
                                                            // feedback(ptor, 'Your account was successfully confirmed. You are now signed in.');
                                                            ptor.driver.sleep(7000)
                                                            ptor.navigate().refresh();
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                });
           })
       })
}