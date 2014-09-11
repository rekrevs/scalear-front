var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module');
var youtube = require('./lib/youtube.js');
var disc = require('./lib/discussion.js');

var ptor = protractor.getInstance();
var params = ptor.params
ptor.driver.manage().window().maximize();

var screen_name = "dummy"
var fname = "fname"
var lname = "lname"
var mail = "dummy@sharklasers.com"
var univer = "uni"
var biog = "text w text"
var webs = ".com"
var password = "password"

describe("sign-up as teacher", function(){

	xit('should sign up as teacher', function(){
		o_c.sign_up_teacher(ptor, screen_name, fname, lname, mail, univer, biog, webs, password);
		expect(element(by.id('main')).getText()).toContain('Thanks for joining ScalableLearning!');
	})

	xit('should confirm account', function(){
		o_c.confirm_account(ptor, mail);
		expect(element(by.id('main')).getText()).toContain('Welcome to ScalableLearning');
	})

	it('should open account info to check for info', function(){
		 o_c.press_login(ptor);
        o_c.sign_in(ptor, mail, params.password);
		seek(ptor, 99);
		ptor.sleep(15000);
	})

})

function seek(ptor, percent){
	var pw, ph;
	var cw, ch;
	progress = element(by.className('ytp-play-progress'))
	ptor.wait(function() {
        return element(by.className('ytp-play-progress')).isPresent().then(function(disp) {
        	console.log("waiting")
            return disp;
        }, 120000);
    });
	progress.getSize().then(function(size){
		pw = size.width;
		ph = size.height;
		ptor.actions().mouseMove(progress,{x: (percent*pw)/100, y: 4}).click().perform();
	})
}