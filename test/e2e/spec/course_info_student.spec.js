var ptor = protractor.getInstance();
var driver = ptor.driver;

var frontend = 'http://localhost:9000/';

var functions = ptor.params;
var mail = 'mena.happy@yahoo.com';
var password = 'password';

var course_name ='course';
var course_code = 'csc-303';
var description = 'kalam keter'
var prerequisites = 'kalam';
var disscussion_link = 'testing';
var course_date = 'April 7 2014';
var course_duration = '19';

describe('', function(){
	it('should sign in', function(){
		functions.sign_in(ptor, mail, password, functions.feedback)
	})
	it('should open course', function(){
		functions.open_course_by_name(ptor, course_name)
	})
	it('should open nav_bar', function(){
		functions.open_tray(ptor);
	})
	it('should click course info btn', function(){
		ptor.findElement(protractor.By.id('info')).then(function(info_btn){
			info_btn.click();
		})
	})
	it('should check the course info page url', function(){
		ptor.waitForAngular();
		ptor.getCurrentUrl().then(function(url){
			expect(url).toContain('course_information');
		})
	})
	it('should check course information', function(){
		check_course_info(ptor, course_code, course_name, description, prerequisites, disscussion_link, course_date, course_duration);
	})
});

check_course_info = function(ptor, course_code, course_name, description, prereq, disscussion_link, course_date, course_duration){
	ptor.findElement(protractor.By.id('course_code_name')).then(function(code_name){
		expect(code_name.getText()).toContain(course_code);
		expect(code_name.getText()).toContain(course_name);
	})
	ptor.findElement(protractor.By.id('course_description')).then(function(course_description){
		expect(course_description.getText()).toContain(description);
	})
	ptor.findElement(protractor.By.id('course_prerequisites')).then(function(prerequisites){
		expect(prerequisites.getText()).toContain(prereq);
	})
	ptor.findElement(protractor.By.id('discussion_link')).then(function(disc_link){
		expect(disc_link.getText()).toContain(disscussion_link);
	})
	ptor.findElement(protractor.By.id('course_date')).then(function(date){
		expect(date.getText()).toContain(course_date);
	})
	ptor.findElement(protractor.By.id('course_duration')).then(function(duration){
		expect(duration.getText()).toContain(course_duration);
	})
}