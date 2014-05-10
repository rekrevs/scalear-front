var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');

var ptor = protractor.getInstance();
var params = ptor.params
ptor.driver.manage().window().maximize();

var screen_name = "teacher test";
var fname = "teacher";
var lname = "test";
var univer = "world university";
var studentmail = 'teacher2@sharklasers.com';
var biog = "kalam keteeer yege 140 char bs teacher";
var webs = "www.website.com";
var password = 'password';

describe('sign up teacher',function(){
	it('should fill signup form', function(){
		o_c.sign_up_teacher(ptor, screen_name, fname, lname, studentmail, univer, biog, webs, password, o_c.feedback);
	})

	it('should fill confirm account', function(){
	    o_c.confirm_account_teacher(ptor, o_c.feedback);
	    ptor.sleep(3000);
	})	
})