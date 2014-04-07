var ptor = protractor.getInstance();
//var nosyncptor = protractor.getInstance();
var driver = ptor.driver;

var frontend = 'http://localhost:9000/';
var backend = 'http://localhost:3000/';
var auth = 'http://localhost:4000/';
var signupurl = 'http://localhost:9000/#/users/student';

var suser = 'bahia.sharkawy@gmail.com';
var tuser = 'anyteacher@email.com';

var spass = 'password';
var tpass = 'password';

var screen_name = "student test";
var fname = "student";
var lname = "test";
var univer = "world university";
var studentmail = 'studenttest@sharklasers.com';
var biog = "kalam keteeer yege 140 char";
var webs = "www.website.com";
var password = 'password';
var enrollment_key = '';
var functions = ptor.params //testing course enrollment key
/*//////////////////////////////////////////
//			params
cancel_account: function(ptor , name ,password)
open_tray: function(ptor)
feedback: function(ptor, message)
confirm_account: function(ptor)
sign_up: function(ptor)
log_out: function(ptor)
sign_in: function(ptor, email, password, feedback)
*/

ptor.driver.manage().window().maximize();
ptor.sleep(3000);
describe('signup', function(){ 
    // it('should create user', function(){
    //     functions.sign_up(ptor, screen_name, fname, lname, studentmail, univer, biog, webs, password, functions.feedback);
    // })
    // it('should confirm user',function(){
    //      functions.confirm_account(ptor, functions.feedback);
    //      functions.clean_mail(ptor);
    // }) 
    it('should delete account',function(){
     	 functions.sign_in(ptor, studentmail, password, functions.feedback);
     	 functions.open_tray(ptor);
     	 functions.cancel_account(ptor , studentmail ,password, functions.feedback);
         ptor.sleep(5000);
    })  
});

