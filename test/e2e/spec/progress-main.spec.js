var locator = require('./lib/locators');
var progress = require('./lib/progress');
var o_c = require('./lib/openers_and_clickers');
var youtube = require('./lib/youtube');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module');


var ptor = protractor.getInstance();
var params = ptor.params
var student_names = ['student two', 'student test'] 
var student_emails = [params.student_mail_2, params.mail]
var module_names = ['New Module', 'New Module 2']
var checkmarks = {'student two': ['on_time', 'not_finished'], 'student test': ['on_time', 'not_finished']}
// ptor.driver.manage().window().maximize();
ptor.driver.manage().window().setSize(ptor.params.width, ptor.params.height);
ptor.driver.manage().window().setPosition(0, 0);

describe("teacher", function(){
	it('should login', function(){
		o_c.sign_in(ptor, params.teacher_mail, params.password, o_c.feedback);	
	})
	it('should open the first course', function(){
		o_c.open_course_whole(ptor);
	})
	it('should go to the progress page', function(){
		o_c.open_tray(ptor)
		o_c.open_progress_page(ptor)
	})
})
describe('Progress Main Page', function(){
	it('should be displayed', function(){
		expect(ptor.getCurrentUrl()).toContain('progress/main')
	})
	it('should display two tabs, Module Progress and Module Chart', function(){
		locator.by_classname(ptor, 'nav-tabs').then(function(tabs){
			tabs.findElements(protractor.By.tagName('li')).then(function(titles){
				expect(titles[0].getText()).toBe('Module Progress')
				expect(titles[1].getText()).toBe('Module Chart')
			})
		})
	})
	it('should display a table that contains the data', function(){
		checkModuleProgressTableVisible()
	})
	it('should display the correct data inside the table', function(){
		progress.verifyModuleProgressTable(student_names, module_names, checkmarks)
	})
})
describe('Teacher', function(){
	it('should change the status for Student Two and New Module to be \'not done\'', function(){
		progress.overrideStatus(1, 1, 3)
		progress.checkStatusImage(1, 1, 'not_finished')
	})

	it('should change the status for Student Test and New Module 2 to be \'finished on time\'', function(){
		progress.overrideStatus(2, 2, 2)
		progress.checkStatusImage(2, 2, 'on_time')
	})
	it('should revert them back', function(){
		progress.overrideStatus(1, 1, 1)
		progress.checkStatusImage(1, 1, 'on_time')

		progress.overrideStatus(2, 2, 1)
		progress.checkStatusImage(2, 2, 'not_finished')		
	})
	it('should switch to the Module Chart Tab', function(){
		progress.selectTabInMainProgress(2)
	})
})
describe('Module Chart', function(){
	it('should show that Student Two solved only 50% of quizzes', function(){
		progress.wholeProgressBar(1, 0, student_names[0], 50)
		ptor.navigate().refresh()
	})
	it('should show that Student Two solved only 50% of lectures\' quizzes', function(){
		progress.selectTabInMainProgress(2)
		progress.wholeProgressBar(1, 1, student_names[0], 50)	
		ptor.navigate().refresh()
	})

	it('should show that Student Test solved only 50% of quizzes', function(){
		progress.selectTabInMainProgress(2)
		progress.wholeProgressBar(2, 0, student_names[1], 50)
		ptor.navigate().refresh()
	})
	it('should show that Student Test solved only 81% of lectures\' quizzes', function(){
		progress.selectTabInMainProgress(2)
		progress.wholeProgressBar(2, 1, student_names[1], 81)
		ptor.navigate().refresh()
	})
})



function checkModuleProgressTableVisible(){
	locator.by_xpath(ptor, '//*[@id="details"]/ui-view/div/div/div[1]/div/progress_matrix/div[2]/table').then(function(table){
		expect(table.isDisplayed()).toBe(true)
	})
}



