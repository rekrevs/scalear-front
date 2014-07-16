var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');

var ptor = protractor.getInstance();
var params = ptor.params
ptor.driver.manage().window().maximize();


xdescribe("main menu teacher", function(){

	it('should sign in as teacher', function(){
		o_c.sign_in(ptor, params.teacher_mail, params.password, o_c.feedback);
	})

	it('should open dashboard', function(){
		o_c.open_dashboard(ptor);
	})

	it('should hover on notifications', function(){
		o_c.open_notifications(ptor);
		ptor.sleep(5000);
	})	

	it('should hover on courses', function(){
		o_c.open_courses(ptor);
		ptor.sleep(5000);
	})

	it('should hover on courses', function(){
		o_c.open_account(ptor);
		ptor.sleep(5000);
	})

	it('should hover on courses', function(){
		o_c.open_help(ptor);
		ptor.sleep(5000);
	})

	it('should logout', function(){
		o_c.logout(ptor);
	})

})

xdescribe("main menu teacher", function(){

	it('should sign in as teacher', function(){
		o_c.sign_in(ptor, params.teacher_mail, params.password);
	})

	it('should open a new course form', function(){
		o_c.open_course_whole(ptor,0);
	})
	
	xit('should logout', function(){
		o_c.logout(ptor);
	})

})