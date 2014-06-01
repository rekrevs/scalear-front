var locator = require('./lib/locators');
var progress = require('./lib/progress');
var o_c = require('./lib/openers_and_clickers');
var youtube = require('./lib/youtube');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module');

//progress_student2
var ptor = protractor.getInstance();
var params = ptor.params
var student_names = ['student two', 'student test']
var teacher_name = "teacher test" 
var student_emails = [params.student_mail_2, params.mail]
var module_names = ['New Module', 'New Module 2']
var checkmarks = {'student two': ['on_time', 'not_finished'], 'student test': ['on_time', 'not_finished']}
var duration={ min:4, sec:47}
var total_duration = duration.min*60+duration.sec
var modules_items = {
	'New Module': [{
					'name':'New Lecture', 
					'duration': '00:04:47',
					'questions': [
						{title:'MCQ QUIZ', type:'MCQ', time:roundTimeToPercentage(10, total_duration)},
						{title:'OCQ QUIZ', type:'OCQ', time:roundTimeToPercentage(20, total_duration)}, 
						{title:'DRAG QUIZ', type:'DRAG', time:roundTimeToPercentage(30, total_duration)}
					],
					'discussion':[{title: 'private question by second student', type:'private', time:roundTimeToPercentage(40, total_duration), likes:0, flags:0, screen_name:'student test'}],
					'confused':[{title: 'confused', count:1, time:roundTimeToPercentage(45, total_duration)}],
					// 'really_confused':0
					},
					{
					'name':'New Lecture Text', 
					'duration': '00:04:47',
					'questions': 3,
					'discussion':1,
					'confused':1,
					'really_confused':0
					},
					{
					'name':'New Lecture Surveys', 
					'duration': '00:04:47',
					'questions': 2,
					'discussion':0,
					'confused':0,
					'really_confused':1
					},
					{
					'name':'New Quiz', 
					'questions': 5,
					'discussion':0,
					'confused':0,
					'really_confused':0
					},
					{
					'name':'New Required Quiz', 
					'questions': 5,
					'discussion':0,
					'confused':0,
					'really_confused':0
					},
					{
					'name':'New Survey', 
					'questions': 3,
					'discussion':0,
					'confused':0,
					'really_confused':0
					}],
	'New Module 2': [{
					'name':'New Lecture', 
					'duration': '00:04:47',
					'questions': 3,
					'discussion':0,
					'confused':0,
					'really_confused':0
					},
					{
					'name':'New Lecture Text', 
					'duration': '00:04:47',
					'questions': 3,
					'discussion':0,
					'confused':0,
					'really_confused':0
					},
					{
					'name':'New Lecture Surveys', 
					'duration': '00:04:47',
					'questions': 2,
					'discussion':0,
					'confused':0,
					'really_confused':0
					},
					{
					'name':'New Quiz', 
					'questions': 5,
					'discussion':0,
					'confused':0,
					'really_confused':0
					},
					{
					'name':'New Required Quiz', 
					'questions': 5,
					'discussion':0,
					'confused':0,
					'really_confused':0
					},
					{
					'name':'New Survey', 
					'questions': 3,
					'discussion':0,
					'confused':0,
					'really_confused':0
					}]
}
var comment1 = {title: "teacher can reply to discussions", likes:0, flags:0, screen_name:teacher_name}
var comment2 = {title: "still can add many comments", likes:0, flags:0, screen_name:teacher_name}
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
xdescribe('Modules Selector Button', function(){
	it('should display the name of the module selected', function(){
		checkNameOnSelectorButton('New Module')
	})
})
xdescribe('Navigation Bullets', function(){
	it('should have the same count as the items under the first module', function(){
		verifyNumberOfBullets(6)
	})
})
describe('Module Progress Page', function(){
	// it('should have a video container', function(){
	// 	ptor.findElement(protractor.By.className('video-showroom')).then(function(video){
	// 		expect(video.isDisplayed()).toBe(true)
	// 	})
	// })
	// it('should display the module progress chart showing that the two students finished on time', function(){
	// 	progress.checkModuleProgressChart(3, 2)
	// })
	// it('should display headings for each item in the module with the item name, duration and number of questions and verify sub items count', function(){
	// 	progress.verifyModuleTitlesAndCountOnTimeline(modules_items['New Module'])
	// })
// 	// it('should display heading and content filtered by charts',function(){
// 	// 	progress.verifyModuleTitlesAndCountFiltered(modules_items['New Module'], 'charts')
// 	// })
	describe('First lecture',function(){
		// it('should display correct quiz titles',function(){
		// 	progress.checkQuizTitle(0,0,modules_items['New Module'], 50)
		// 	progress.checkQuizTitle(0,1,modules_items['New Module'], 50)
		// 	progress.checkQuizTitle(0,2,modules_items['New Module'], 0)
		// })
		// it('should display quiz statistics correct',function(){
		// 	progress.checkQuizChart(0,0,1,2)
		// 	progress.checkQuizChart(0,1,4,1)
		// 	progress.checkQuizChart(0,2,1,2)
		// 	ptor.navigate().refresh();
		// 	// progress.checkQuizChart(0,0,2,0)
		// 	progress.checkQuizChart(0,1,2,1)
		// 	progress.checkQuizChart(0,2,2,2)
		// 	ptor.navigate().refresh();
		// 	progress.checkQuizChart(0,0,3,2)
		// 	// progress.checkQuizChart(0,1,3,0)
		// 	progress.checkQuizChart(0,2,3,2)
		// })
		// it('should have correct discussion titles and content',function(){
		// 	progress.checkDiscussionTitle(0,0,modules_items['New Module'])
		// 	progress.checkDiscussionContent(0,0,modules_items['New Module'])
		// })
		// it('should have correct confused titles',function(){
		// 	progress.checkConfusedTitle(0,0,modules_items['New Module'])
		// 	// progress.checkDiscussionContent(0,0,modules_items['New Module'])
		// })
		// it('should be able to show quiz inclass and have correct time estimate',function(){
		// 	progress.checkTimeEstimate(0)
		// 	progress.showVideoQuizInclass(0,0)
		// 	progress.checkTimeEstimate(3)
		// 	progress.showVideoQuizInclass(0,1)
		// 	progress.checkTimeEstimate(6)
		// 	progress.showVideoQuizInclass(0,2)
		// 	progress.checkTimeEstimate(9)
		// 	progress.hideVideoQuizInclass(0,0)
		// 	progress.checkTimeEstimate(6)
		// 	progress.hideVideoQuizInclass(0,1)
		// 	progress.checkTimeEstimate(3)
		// 	progress.hideVideoQuizInclass(0,2)
		// 	progress.checkTimeEstimate(0)
		// })
		// it('should be able to show disussion inclass and have correct time estimate',function(){
		// 	progress.checkTimeEstimate(0)
		// 	progress.showDiscussionInclass(0,0)
		// 	progress.checkTimeEstimate(2)
		// 	progress.hideDiscussionInclass(0,0)
		// 	progress.checkTimeEstimate(0)
		// })
		// it('should be able to show video quizzes and disussion inclass and have correct time estimate',function(){
		// 	progress.checkTimeEstimate(0)
		// 	progress.showDiscussionInclass(0,0)
		// 	progress.checkTimeEstimate(2)
		// 	progress.showVideoQuizInclass(0,0)
		// 	progress.checkTimeEstimate(5)
		// 	progress.hideDiscussionInclass(0,0)
		// 	progress.checkTimeEstimate(3)
		// 	progress.hideVideoQuizInclass(0,0)
		// 	progress.checkTimeEstimate(0)
		// })

		it('should be able to add a replay to discussion',function(){			
			progress.addReplyToDiscussion(0,0,comment1.title)
			progress.checkDiscussionComment(0,0,0,comment1)
			progress.addReplyToDiscussion(0,0,comment2.title)
			progress.checkDiscussionComment(0,0,1,comment2)
		})
		it('should be able to delete discussion', function(){
			progress.deleteDiscussionComment(0,0,0)
			progress.checkDiscussionComment(0,0,0,comment2)
			progress.deleteDiscussionComment(0,0,0)
		})
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

function roundTimeToPercentage(percent, duration){
	var time = Math.floor((duration*percent)/100)
	var hr  = Math.floor(time / 3600);
  	var min = Math.floor((time - (hr * 3600))/60);
  	var sec = Math.floor(time - (hr * 3600) -  (min * 60));
  	if (min < 10) { min = "0" + min; }
  	if (sec < 10) { sec  = "0" + sec; }
  	return  min + ':' + sec;
}


