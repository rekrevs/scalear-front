var ptor = protractor.getInstance();
params = ptor.params;

describe('sign up scens', function() {
    var text, value, bool, source, url, title;
    var TestVars = {};

    it('sign up with wrong password confirmation', function() {
        browser.get("http://staging.scalable-learning.com/#/users/student");
        element(by.id("screen_name")).sendKeys("menahappy");
        element(by.id("name")).sendKeys("mena");
        element(by.id("last_name")).sendKeys("happy");
        element(by.id("user_email")).sendKeys("mena.happy@yahoo.com");
        element(by.id("university")).sendKeys("ACU");
        element(by.id("bio")).sendKeys("bio");
        element(by.id("link")).sendKeys("webs");
        element(by.id("user_passowrd")).sendKeys("password");
        element(by.xpath("//div[@class='signup-fields-container']/table/tbody/tr/td[3]/table/tbody/tr[5]/td[2]/input")).sendKeys("pass");
        element(by.id("signup_btn")).click();
        text = element(by.tagName('html')).getText();
        expect(text).toContain("" + "doesn't match confirmation");
    })
    it('sign up with already used email', function() {
        ptor.navigate().refresh();
        element(by.id("screen_name")).sendKeys("menahappy");
        element(by.id("name")).sendKeys("mena");
        element(by.id("last_name")).sendKeys("happy");
        element(by.id("user_email")).sendKeys("mena.happy@yahoo.com");
        element(by.id("university")).sendKeys("ACU");
        element(by.id("bio")).sendKeys("bio");
        element(by.id("link")).sendKeys("webs");
        element(by.id("user_passowrd")).sendKeys("password");
        element(by.xpath("//div[@class='signup-fields-container']/table/tbody/tr/td[3]/table/tbody/tr[5]/td[2]/input")).sendKeys("password");
        element(by.id("signup_btn")).click();
        text = element(by.tagName('html')).getText();
        expect(text).toContain("" + "has already been taken");
    })
    it('sign up without password confirmation', function() {
        ptor.navigate().refresh();
        element(by.id("screen_name")).sendKeys("menahappy");
        element(by.id("name")).sendKeys("mena");
        element(by.id("last_name")).sendKeys("happy");
        element(by.id("user_email")).sendKeys("mena.happy@yahoo.com");
        element(by.id("university")).sendKeys("ACU");
        element(by.id("bio")).sendKeys("bio");
        element(by.id("link")).sendKeys("webs");
        element(by.id("user_passowrd")).sendKeys("password");
        element(by.id("signup_btn")).click();
        text = element(by.tagName('html')).getText();
        expect(text).toContain("" + "doesn't match confirmation");
    })
    it('sign up without password', function() {
        ptor.navigate().refresh();
        element(by.id("screen_name")).sendKeys("menahappy");
        element(by.id("name")).sendKeys("mena");
        element(by.id("last_name")).sendKeys("happy");
        element(by.id("user_email")).sendKeys("mena.happy@yahoo.com");
        element(by.id("university")).sendKeys("ACU");
        element(by.id("bio")).sendKeys("bio");
        element(by.id("link")).sendKeys("webs");
        element(by.id("user_passowrd")).sendKeys("");
        element(by.xpath("//div[@class='signup-fields-container']/table/tbody/tr/td[3]/table/tbody/tr[5]/td[2]/input")).sendKeys("password");
        element(by.id("signup_btn")).click();
        text = element(by.tagName('html')).getText();
        expect(text).toContain("" + "can't be blank,doesn't match confirmation");
    });
});
