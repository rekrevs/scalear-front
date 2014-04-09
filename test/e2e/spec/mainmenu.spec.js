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

var mail = 'mena.happy@yahoo.com'

describe('', function(){
	it('should login', function(){
		functions.sign_in(ptor, mail, password, functions.feedback)
	})
	it('should open tray', function(){
		functions.open_tray(ptor).then(function(){
			console.log('eshta');
		})
	})
})