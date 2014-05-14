var ptor = protractor.getInstance();
var driver = ptor.driver;

var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');
var params = ptor.params;

var screen_name = "student test";
var fname = "student";
var lname = "test";
var univer = "world university";
var studentmail = 'studenttest@sharklasers.com';
var biog = "kalam keteeer yege 140 char";
var webs = "www.website.com";
var password = 'password';

ptor.driver.manage().window().maximize();

describe('', function(){ 
  xit('should create user', function(){
   o_c.sign_up(ptor, screen_name, fname, lname, studentmail, univer, biog, webs, password, o_c.feedback);
  })
  it('should confirm user',function(){
    o_c.confirm_account(ptor, o_c.feedback);
    ptor.sleep(3000);
  }) 
  xit('should sign_in account',function(){
    o_c.sign_in(ptor, studentmail, password, o_c.feedback);
    ptor.sleep(2000);
  })
  xit('should delete user',function(){
    o_c.open_tray(ptor);
    o_c.cancel_account(ptor, params.password, o_c.feedback)
  })  
});

