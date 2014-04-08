var ptor = protractor.getInstance();
var driver = ptor.driver;

var frontend = 'http://localhost:9000/';

var screen_name = "student test";
var fname = "student";
var lname = "test";
var univer = "world university";
var studentmail = 'studenttest@sharklasers.com';
var biog = "kalam keteeer yege 140 char";
var webs = "www.website.com";
var password = 'password';
var enrollment_key = '';
var functions = ptor.params;

describe('', function(){
	it('should create user', funcion(){
		functions.sign_up(ptor, screen_name, fname, lname, studentmail, univer, biog, webs, password, functions.feedback);
	})

	it('should confirm that user', funcion(){
		functions.confirm_account(ptor, functions.feedback);
	})
})