var locator = require('./lib/locators');
var progress = require('./lib/progress');
var o_c = require('./lib/openers_and_clickers');
var youtube = require('./lib/youtube');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module');


var ptor = protractor.getInstance();
var params = ptor.params
var student_names = ['studenttest2 sharklasers','student test']
var student_emails = [params.student2.email, params.student1.email]
var module_names = ['New Module', 'New Module 2']
var checkmarks = {'student test': ['on_time', 'not_finished'], 'studenttest2 sharklasers': ['not_finished', 'not_finished']}
// ptor.driver.manage().window().maximize();
ptor.driver.manage().window().setSize(ptor.params.width, ptor.params.height);
ptor.driver.manage().window().setPosition(0, 0);

describe("teacher", function(){
	it('should login', function(){
		o_c.press_login(ptor)
		o_c.sign_in(ptor, params.teacher1.email, params.password, o_c.feedback);
	})
	it('should open the first course', function(){
		o_c.open_course_list(ptor);
    	o_c.open_course(ptor, 1);
	})
	it('should go to the progress page', function(){
		// o_c.open_tray(ptor)
		o_c.open_progress(ptor)
		o_c.open_all_progress(ptor)
	})
})
describe('Progress Main Page', function(){
	it('should be displayed', function(){
		expect(ptor.getCurrentUrl()).toContain('progress')
	})
	it('should display two tabs, Module Progress and Module Chart', function(){
		var list = element(by.className('tabs')).all(by.tagName('dd'))
		expect(list.get(0).getText()).toBe('Course Progress')
		expect(list.get(1).getText()).toBe('Progress Graph')
	})
	it('should display a table that contains the data', function(){
		expect(element(by.tagName('table')).isDisplayed()).toBe(true)
	})
	it('should display the correct data inside the table', function(){
		progress.verifyModuleProgressTable(student_names, module_names, checkmarks)
	})
})
describe('Teacher', function(){
	it('should change the status for Student Two and New Module to be \'not done\'', function(){
		progress.overrideStatus(1, 1, 2)
		progress.checkStatusImage(1, 1, 'on_time')
	})

	it('should change the status for Student Test and New Module 2 to be \'finished on time\'', function(){
		progress.overrideStatus(2, 2, 2)
		progress.checkStatusImage(2, 2, 'on_time')
	})
	it('should revert them back', function(){
		progress.overrideStatus(1, 1, 1)
		progress.checkStatusImage(1, 1, 'not_finished')

		progress.overrideStatus(2, 2, 1)
		progress.checkStatusImage(2, 2, 'not_finished')
	})

})
describe('Module Chart', function(){
	it('should show that Student Two solved only 50% of quizzes', function(){
		progress.selectTabInMainProgress(2)
		progress.wholeProgressBar(2, 0, student_names[0], 50)
		ptor.navigate().refresh()
	})
	it('should show that Student Two solved only 50% of lectures\' quizzes', function(){
		progress.selectTabInMainProgress(2)
		progress.wholeProgressBar(2, 1, student_names[0], 50)
		ptor.navigate().refresh()
	})

	it('should show that Student Test solved only 50% of quizzes', function(){
		progress.selectTabInMainProgress(2)
		progress.wholeProgressBar(1, 0, student_names[1], 50)
		ptor.navigate().refresh()
	})
	it('should show that Student Test solved only 81% of lectures\' quizzes', function(){
		progress.selectTabInMainProgress(2)
		progress.wholeProgressBar(1, 1, student_names[1], 81)
		ptor.navigate().refresh()
	})
})
