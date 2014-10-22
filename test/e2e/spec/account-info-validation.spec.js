var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');

var ptor = protractor.getInstance();
var params = ptor.params
ptor.driver.manage().window().maximize();

var screen_name = "student test"
var fname = "student"
var lname = "test"
var mail = "studenttest@sharklasers.com"
var univer = "world university"
var biog = "kalam keteeer yege 140 char"
var webs = "www.website.com"
var password = "password"

var screen_name_new = "Student 0_1"
var fname_new = "Test_1"
var lname_new = "Student_1"
var mail_new = "student1_1@email.com"
var univer_new = "uni_1"
var biog_new = "text w text_1"
var webs_new = ".com_1"
var password_new = "password_1"

describe("sign-up as teacher", function(){

	it('should open account info to check for info', function(){
		o_c.press_login(ptor);
        o_c.sign_in(ptor, mail, params.password);
        o_c.open_account(ptor);
	    element(by.id('account_information')).click();
	})

	it("should check for info", function(){
		expect(element(by.model('user.name')).getAttribute('value')).toEqual(fname);
		expect(element(by.model('user.last_name')).getAttribute('value')).toEqual(lname);
		expect(element(by.model('user.email')).getAttribute('value')).toEqual(mail);
		expect(element(by.model('user.university')).getAttribute('value')).toEqual(univer);
		expect(element(by.model('user.screen_name')).getAttribute('value')).toEqual(screen_name);
		expect(element(by.model('user.link')).getAttribute('value')).toEqual(webs);
		expect(element(by.model('user.bio')).getAttribute('value')).toEqual(biog);
	})

	it("should change for info", function(){
		element(by.model('user.name')).clear().sendKeys(fname_new);
		element(by.model('user.last_name')).clear().sendKeys(lname_new);
		element(by.model('user.email')).clear().sendKeys(mail_new);
		element(by.model('user.university')).clear().sendKeys(univer_new);
		element(by.model('user.screen_name')).clear().sendKeys(screen_name_new);
		element(by.model('user.link')).clear().sendKeys(webs_new);
		element(by.model('user.bio')).clear().sendKeys(biog_new);
		element(by.id('update_info')).click();
		element(by.model('user.current_password')).sendKeys('password');
		element(by.id('update_info_modal')).click();
		ptor.navigate().refresh();
	})

	it("should check for info", function(){
		expect(element(by.model('user.name')).getAttribute('value')).toEqual(fname_new);
		expect(element(by.model('user.last_name')).getAttribute('value')).toEqual(lname_new);
		expect(element(by.model('user.email')).getAttribute('value')).toEqual(mail);
		expect(element(by.model('user.university')).getAttribute('value')).toEqual(univer_new);
		expect(element(by.model('user.screen_name')).getAttribute('value')).toEqual(screen_name_new);
		expect(element(by.model('user.link')).getAttribute('value')).toEqual(webs_new);
		expect(element(by.model('user.bio')).getAttribute('value')).toEqual(biog_new);
	})

	it("should change for info", function(){
		element(by.model('user.name')).clear().sendKeys(fname);
		element(by.model('user.last_name')).clear().sendKeys(lname);
		element(by.model('user.email')).clear().sendKeys(mail);
		element(by.model('user.university')).clear().sendKeys(univer);
		element(by.model('user.screen_name')).clear().sendKeys(screen_name);
		element(by.model('user.link')).clear().sendKeys(webs);
		element(by.model('user.bio')).clear().sendKeys(biog);
		element(by.id('update_info')).click();
		element(by.model('user.current_password')).sendKeys('password');
		element(by.id('update_info_modal')).click();
		ptor.navigate().refresh();
	})

	it("should check for info", function(){
		expect(element(by.model('user.name')).getAttribute('value')).toEqual(fname);
		expect(element(by.model('user.last_name')).getAttribute('value')).toEqual(lname);
		expect(element(by.model('user.email')).getAttribute('value')).toEqual(mail);
		expect(element(by.model('user.university')).getAttribute('value')).toEqual(univer);
		expect(element(by.model('user.screen_name')).getAttribute('value')).toEqual(screen_name);
		expect(element(by.model('user.link')).getAttribute('value')).toEqual(webs);
		expect(element(by.model('user.bio')).getAttribute('value')).toEqual(biog);
	})
})
