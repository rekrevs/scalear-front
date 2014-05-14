var ptor = protractor.getInstance();
params = ptor.params;

describe('Selenium Test Case', function() {
  it('should execute test case without errors', function() {
    var text, value, bool, source, url, title;
    var TestVars = {};
    browser.get("http://staging.scalable-learning.com/");

    element(by.id("user_email")).sendKeys("teacher2@sharklasers.com");
    element(by.id("user_passowrd")).sendKeys("password");
    element(by.css("input.btn.btn-warning")).click();
    
    element(by.id("new_course")).click();
    
    element(by.name("short")).sendKeys("csc-test");
    element(by.name("duration")).click();
    element(by.css("div.form-actions > input.btn.btn-success")).click();
    bool = ptor.isElementPresent(by.xpath("//div[@class='main-fields-container']/div[2]/div[2]/span[2]"));
      expect(bool).toBe(true);
    text = element(by.tagName('html')).getText();
    expect(text).toContain("" + "can't be blank");
    
    ptor.navigate.refresh();
    element(by.name("name")).sendKeys("testing course 100");
    element(by.name("duration")).click();
    element(by.css("div.form-actions > input.btn.btn-success")).click();
    bool = ptor.isElementPresent(by.css("div.field > span.errormessage.ng-binding"));
      expect(bool).toBe(true);
    text = element(by.tagName('html')).getText();
    expect(text).toContain("" + "can't be blank");
    
    ptor.navigate.refresh();
    element(by.name("short")).sendKeys("csc-test");
    element(by.name("name")).sendKeys("testing course 100");
    element(by.name("duration")).click();
    element(by.css("div.form-actions > input.btn.btn-success")).click();
    bool = ptor.isElementPresent(by.xpath("//div[@class='main-fields-container']/div[3]/div[2]/span[3]"));
      expect(bool).toBe(true);
    text = element(by.tagName('html')).getText();
    expect(text).toContain("" + "can't be blank,is not a number");
    
    element(by.name("duration")).sendKeys("12");
    element(by.css("div.form-actions > input.btn.btn-success")).click();
    bool = ptor.isElementPresent(by.xpath("//div[@class='main-fields-container']/div[7]/div[1]/span[2]"));
      expect(bool).toBe(false);
  });
});
