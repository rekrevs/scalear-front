var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module');
var youtube = require('./lib/youtube.js');

var ptor = protractor.getInstance();
var params = ptor.params
ptor.driver.manage().window().maximize();

xdescribe("invideo quiz time and name validation", function(){
	
	it('should sign in as teacher', function(){
		o_c.press_login(ptor);
		o_c.sign_in(ptor, params.teacher_mail, params.password);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
	})

	it('should add a module and lecture to create quizzes', function(){
		teacher.add_module(ptor);
		teacher.open_module(ptor, 1);
		teacher.add_lecture(ptor);			
		o_c.press_content_navigator(ptor);
		ptor.sleep(2000)
		teacher.init_lecture(ptor, "ocq_text_quiz","https://www.youtube.com/watch?v=SKqBmAHwSkg");
	})

	it("should create quiz and check for it's time", function(){
		create_and_check(ptor);
		ptor.navigate().refresh();
	})

	it("name validation", function(){
		o_c.press_content_navigator(ptor);
		o_c.scroll(ptor, 1000);
		change_name(ptor,"sleep");
		ptor.navigate().refresh();
	})

	it('should clear the course for deletion', function(){
		// o_c.to_teacher(ptor);
		o_c.open_course_list(ptor);
	    o_c.open_course(ptor, 1);
	    teacher.open_module(ptor, 1);
	    teacher.delete_item_by_number(ptor, 1, 1);
	    teacher.delete_empty_module(ptor, 1)
	})

	it('should delete course', function(){
		o_c.open_course_list(ptor);
	    teacher.delete_course(ptor, 1);
	    o_c.logout(ptor);
	})
})

describe("lec data validation", function(){
	
	it('should sign in as teacher', function(){
		o_c.press_login(ptor);
		o_c.sign_in(ptor, params.teacher_mail, params.password);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
	})

	it('should add a module and lecture to create quizzes', function(){
		teacher.add_module(ptor);
		teacher.open_module(ptor, 1);
		teacher.add_lecture(ptor);			
		o_c.press_content_navigator(ptor);
		teacher.init_lecture(ptor, "lecture","https://www.youtube.com/watch?v=SKqBmAHwSkg");
	})

	it('should change the name and validate', function(){
		change_lecture_name(' ');
		error_feedback("Name can't be blank");

	})

	it('should clear the course for deletion', function(){
		// o_c.to_teacher(ptor);
		o_c.open_course_list(ptor);
	    o_c.open_course(ptor, 1);
	    teacher.open_module(ptor, 1);
	    teacher.delete_item_by_number(ptor, 1, 1);
	    teacher.delete_empty_module(ptor, 1)
	})

	it('should delete course', function(){
		o_c.open_course_list(ptor);
	    teacher.delete_course(ptor, 1);
	    o_c.logout(ptor);
	})
})

function create_and_check(ptor){
	youtube.seek(ptor, 21);
	ptor.sleep(2000);
	locator.by_classname(ptor, 'timer').findElements(protractor.By.className('ng-binding')).then(function(timers){
		timers[0].getText().then(function(time){
			teacher.create_invideo_ocq_text_quiz(ptor);
			teacher.make_ocq_text_questions(ptor);
			element.all(by.name('quiz_time')).then(function(q_times){
				expect(q_times[0].getText()).toEqual(time);	
			})
		})
	})
}

function change_name(ptor, text){
	element.all(by.name('quiz_name')).then(function(q_names){
		ptor.actions().mouseMove(q_names[0]).perform().then(function(){
			element.all(by.className('fi-pencil')).then(function(pen){
				pen[0].click();
			})
		})
	})	
	ptor.sleep(5000);
		element(by.className('editable-input')).sendKeys('test');
		element(by.className('fi-check')).click();
		
		element.all(by.name('quiz_name')).then(function(q_names){
			expect(q_names[0].getText()).toEqual('test');
		})
}

function change_lecture_name(name){
	element(by.id('name')).click().then(function(){
		element(by.className('editable-input')).sendKeys(name)
		element(by.className('check')).click()
	})
}

function change_lecture_url(url){
	element(by.id('url')).click().then(function(){
		element(by.className('editable-input')).sendKeys(lec_url)
		element(by.className('check')).click();
	})
}

function error_feedback(error){
	element(by.className('editable-controls')).element(by.className('error')).then(function(err){
		expect(err.getText()).toContain(error);
	})
}