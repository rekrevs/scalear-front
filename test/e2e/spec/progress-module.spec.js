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
var modules_items = {
	'New Module': [{
					'name':'New Lecture', 
					'duration': '00:04:47',
					'questions': 3
					},
					{
					'name':'New Lecture Text', 
					'duration': '00:04:47',
					'questions': 3
					},
					{
					'name':'New Lecture Surveys', 
					'duration': '00:04:47',
					'questions': 2
					},
					{
					'name':'New Quiz', 
					'questions': 5
					},
					{
					'name':'New Required Quiz', 
					'questions': 5
					},
					{
					'name':'New Survey', 
					'questions': 3
					}],
	'New Module 2': [{
					'name':'New Lecture', 
					'duration': '00:04:47',
					'questions': 3
					},
					{
					'name':'New Lecture Text', 
					'duration': '00:04:47',
					'questions': 3
					},
					{
					'name':'New Lecture Surveys', 
					'duration': '00:04:47',
					'questions': 2
					},
					{
					'name':'New Quiz', 
					'questions': 5
					},
					{
					'name':'New Required Quiz', 
					'questions': 5
					},
					{
					'name':'New Survey', 
					'questions': 3
					}]
}
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
})
describe('Teacher', function(){
	it('should select the first module', function(){
		student.open_module_number(ptor, 1)
	})
})
describe('Modules Selector Button', function(){
	it('should display the name of the module selected', function(){
		checkNameOnSelectorButton('New Module')
	})
})
describe('Navigation Bullets', function(){
	it('should have the same count as the items under the first module', function(){
		verifyNumberOfBullets(6)
	})
})
describe('Module Progress Page', function(){
	it('should have a video container', function(){
		ptor.findElement(protractor.By.className('video-showroom')).then(function(video){
			expect(video.isDisplayed()).toBe(true)
		})
	})
	it('should display the module progress chart showing that the two students finished on time', function(){
		progress.checkModuleProgressChart(3, 2)
	})
	it('should display headings for each item in the module with the item name, duration and number of questions', function(){
		progress.verifyModuleTitlesOnTimeline(modules_items['New Module'], modules_items['New Module'].length)
	})
})




function checkModuleProgressTableVisible(){
	locator.by_xpath(ptor, '//*[@id="details"]/ui-view/div/div/div[1]/div/progress_matrix/div[2]/table').then(function(table){
		expect(table.isDisplayed()).toBe(true)
	})
}
function checkNameOnSelectorButton(name){
	locator.by_classname(ptor, 'modules-collapser').then(function(button){
		expect(button.getText()).toBe(name)
	})
}
function verifyNumberOfBullets(number){
	ptor.findElements(protractor.By.tagName('progress-item')).then(function(bullets){
		expect(bullets.length).toBe(number)
	})
}


