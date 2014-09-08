var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module');
var youtube = require('./lib/youtube.js');
var disc = require('./lib/discussion.js');

var ptor = protractor.getInstance();
var params = ptor.params
ptor.driver.manage().window().maximize();

var screen_name = "teacher"
var fname = "david"
var lname = "sverker"
var mail = "daviddavid@sharklasers.com"
var univer = "uni"
var biog = "text w text"
var webs = ".com"
var password = "password"

describe("sign-up as teacher", function(){

	xit('should sign up as teacher', function(){
		o_c.sign_up_teacher(ptor, screen_name, fname, lname, mail, univer, biog, webs, password);
		expect(element(by.id('main')).getText()).toContain('Thanks for joining ScalableLearning!');
	})

	it('should confirm account', function(){
		o_c.confirm_account(ptor, mail);
	})
})