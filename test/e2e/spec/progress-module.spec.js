var locator = require('./lib/locators');
var progress = require('./lib/progress');
var o_c = require('./lib/openers_and_clickers');
var youtube = require('./lib/youtube');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module');

//progress_student2
var ptor = protractor.getInstance();
var params = ptor.params
var student_names = ['studenttest2 sharklasers', 'student test']
var teacher_name = "teacher1" 
var student_emails = [params.student2_mail, params.student_mail]
var module_names = ['New Module', 'New Module 2']
var checkmarks = {'studenttest2 sharklasers': ['on_time', 'not_finished'], 'student test': ['on_time', 'not_finished']}
var duration={ min:4, sec:47}
var total_duration = duration.min*60+duration.sec
var modules_items = {
	'New Module': [{
					'name':'New Lecture', 
					'duration': '00:04:47',
					'questions': [
						{title:'MCQ QUIZ', type:'MCQ', time:roundTimeToPercentage(10, total_duration)},
						{title:'OCQ QUIZ', type:'OCQ', time:roundTimeToPercentage(20, total_duration)}, 
						{title:'DRAG QUIZ', type:'drag', time:roundTimeToPercentage(30, total_duration)}
					],
					'free_text':[],
					'discussion':[{title: 'private question by second student', type:'private', time:roundToNearestQuarter(40, total_duration), likes:0, flags:0, screen_name:'studenttest2'}],
					'confused':[{title: 'Confused', count:1, time:roundToNearestQuarter(45, total_duration)}],
					},
					{
					'name':'New Lecture Text', 
					'duration': '00:04:47',
					'questions': [
						{title:'MCQ TEXT QUIZ', type:'MCQ', time:roundTimeToPercentage(10, total_duration)},
						{title:'OCQ TEXT QUIZ', type:'OCQ', time:roundTimeToPercentage(20, total_duration)}, 
						{title:'DRAG TEXT QUIZ', type:'drag', time:roundTimeToPercentage(30, total_duration)}
					],
					'free_text':[],
					'discussion':[{title: 'public question by second student', type:'public', time:roundToNearestQuarter(40, total_duration), likes:1, flags:0, screen_name:'studenttest2'}],
					'confused':[{title: 'Confused', count:1, time:roundToNearestQuarter(25, total_duration)}],
					},
					{
					'name':'New Lecture Surveys', 
					'duration': '00:04:47',
					'questions':  [
						{title:'MCQ SURVEY', type:'MCQ', time:roundTimeToPercentage(10, total_duration)},
						{title:'OCQ SURVEY', type:'OCQ', time:roundTimeToPercentage(20, total_duration)}
					],
					'free_text':[],
					'discussion':[],
					'confused':[{title: 'Really confused', count:1, time:roundToNearestQuarter(25, total_duration)}],
					},
					{
					'name':'New Quiz', 
					'questions': [
						{title:'mcq question', type: 'MCQ'},
						{title:'ocq question', type:'OCQ'},						
						{title:'drag question', type:'drag'}
					],
					'free_text':[
						{title:'free question', answers:[{title:'free answer', grade:'Under Review'}]},
						{title:'match question', answers:[{title:'match answer', grade:'Good'}]},
					],
					'discussion':[],
					'confused':[]
					},
					{
					'name':'New Required Quiz', 
					'questions': [
						{title:'mcq question', type: 'MCQ'},
						{title:'ocq question', type:'OCQ'},						
						{title:'drag question', type:'drag'}
					],
					'free_text':[
						{title:'free question', answers:[{title:'second free answer', grade:'Under Review'},{title:'second second free answer', grade:'Under Review'}]},
						{title:'match question',answers:[{title:"shouldn't match answer", grade:'Wrong'},{title:"match answer", grade:'Good'}]},
					],
					'discussion':[],
					'confused':[],
					},
					{
					'name':'New Survey', 
					'questions': [
						{title:'mcq question', type: 'MCQ'},
						{title:'ocq question', type:'OCQ'},						
					],
					'free_text':[
						{title:'free question', answers:[{title:'first student free answer'}]},
					],
					'discussion':[],
					'confused':[],
					}],
	'New Module 2': [{
					'name':'New Lecture', 
					'duration': '00:04:47',
					'questions': [
						{title:'MCQ QUIZ', type:'MCQ', time:roundTimeToPercentage(10, total_duration)},
						{title:'OCQ QUIZ', type:'OCQ', time:roundTimeToPercentage(20, total_duration)}, 
						{title:'DRAG QUIZ', type:'drag', time:roundTimeToPercentage(30, total_duration)}
					],
					'free_text':[],
					'discussion':[],
					'confused':[],
					},
					{
					'name':'New Lecture Text', 
					'duration': '00:04:47',
					'questions': [
						{title:'MCQ TEXT QUIZ', type:'MCQ', time:roundTimeToPercentage(10, total_duration)},
						{title:'OCQ TEXT QUIZ', type:'OCQ', time:roundTimeToPercentage(20, total_duration)}, 
						{title:'DRAG TEXT QUIZ', type:'drag', time:roundTimeToPercentage(30, total_duration)}
					],
					'free_text':[],
					'discussion':[],
					'confused':[],
					},
					{
					'name':'New Lecture Surveys', 
					'duration': '00:04:47',
					'questions': [
						{title:'MCQ SURVEY', type:'MCQ', time:roundTimeToPercentage(10, total_duration)},
						{title:'OCQ SURVEY', type:'OCQ', time:roundTimeToPercentage(20, total_duration)}
					],
					'free_text':[],
					'discussion':[],
					'confused':[],
					},
					{
					'name':'New Quiz', 
					'questions': [
						{title:'mcq question', type: 'MCQ'},
						{title:'ocq question', type:'OCQ'},						
						{title:'drag question', type:'drag'}
					],
					'free_text':[
						{title:'free question', answers:[]},
						{title:'match question', answers:[]},
					],
					'discussion':[],
					'confused':[],
					},
					{
					'name':'New Required Quiz', 
					'questions': [
						{title:'mcq question', type: 'MCQ'},
						{title:'ocq question', type:'OCQ'},						
						{title:'drag question', type:'drag'}
					],
					'free_text':[
						{title:'free question', answers:[]},
						{title:'match question', answers:[]},
					],
					'discussion':[],
					'confused':[],
					},
					{
					'name':'New Survey', 
					'questions': [
						{title:'mcq question', type: 'MCQ'},
						{title:'ocq question', type:'OCQ'},						
					],
					'free_text':[
						{title:'free question', answers:[]},
					],
					'discussion':[],
					'confused':[],
					}]
}
var comment0 = {title: "comment by first student", likes:0, flags:0, screen_name:'student test'}
var comment1 = {title: "teacher can reply to discussions", likes:0, flags:0, screen_name:teacher_name}
var comment2 = {title: "still can add many comments", likes:0, flags:0, screen_name:teacher_name}
// ptor.driver.manage().window().maximize();
ptor.driver.manage().window().setSize(ptor.params.width, ptor.params.height);
ptor.driver.manage().window().setPosition(0, 0);

describe("teacher", function(){
	it('should login', function(){
		o_c.press_login(ptor)
		o_c.sign_in(ptor, params.teacher_mail, params.password, o_c.feedback);	
	})
	it('should open the first course', function(){
		o_c.open_course_list(ptor);
    	o_c.open_course(ptor, 1);
	})
	it('should go to the progress page', function(){
		o_c.press_content_navigator(ptor)
    	teacher.open_module(ptor, 1);
		o_c.open_progress(ptor)
		o_c.open_module_progress(ptor)
	})
})

describe('Modules Selector Button', function(){
	it('should display the name of the module selected', function(){
		checkNameOnSelectorButton('New Module')
	})
})
// describe('Navigation Bullets', function(){
// 	it('should have the same count as the items under the first module', function(){
// 		verifyNumberOfBullets(6)
// 	})
// })
describe('First Module Progress Page', function(){
	it('should have a video container', function(){
		expect(element(by.className('videoborder')).isDisplayed()).toEqual(true)
	})
	it('should display the module progress chart showing that the two students finished on time', function(){
		progress.checkModuleProgressChart(3, 2)
	})
	it('should display headings for each item in the module with the item name, duration and number of questions and verify sub items count', function(){
		progress.verifyModuleTitlesAndCountOnTimeline(modules_items['New Module'])
	})
				// it('should display heading and content filtered by charts',function(){
				// 	progress.verifyModuleTitlesAndCountFiltered(modules_items['New Module'], 'charts')
				// })
	describe('First lecture',function(){
		it('should display correct quiz titles',function(){
			progress.checkInvideoQuizTitle(0,0,modules_items['New Module'], 50)
			progress.checkInvideoQuizTitle(0,1,modules_items['New Module'], 50)
			progress.checkInvideoQuizTitle(0,2,modules_items['New Module'], 0)
		})
		it('should display quiz statistics correct',function(){
			progress.checkQuizChart(0,0,1,2)
			progress.checkQuizChart(0,1,4,1)
			progress.checkQuizChart(0,2,1,2)
			ptor.navigate().refresh();
			progress.checkQuizChart(0,1,2,1)
			progress.checkQuizChart(0,2,2,2)
			ptor.navigate().refresh();
			progress.checkQuizChart(0,0,3,2)
			progress.checkQuizChart(0,2,3,2)
		})
		it('should have correct discussion titles and content',function(){
			progress.checkDiscussionTitle(0,0,modules_items['New Module'])
			progress.checkDiscussionContent(0,0,modules_items['New Module'])
		})
		it('should have correct confused titles',function(){
			progress.checkConfusedTitle(0,0,modules_items['New Module'])
		})
		it('should be able to show quiz inclass and have correct time estimate',function(){
			progress.checkTimeEstimate(0)
			progress.showVideoQuizInclass(0,0)
			progress.checkTimeEstimate(3)
			progress.showVideoQuizInclass(0,1)
			progress.checkTimeEstimate(6)
			progress.showVideoQuizInclass(0,2)
			progress.checkTimeEstimate(9)
			progress.hideVideoQuizInclass(0,0)
			progress.checkTimeEstimate(6)
			progress.hideVideoQuizInclass(0,1)
			progress.checkTimeEstimate(3)
			progress.hideVideoQuizInclass(0,2)
			progress.checkTimeEstimate(0)
		})
		it('should be able to show disussion inclass and have correct time estimate',function(){
			progress.checkTimeEstimate(0)
			progress.showDiscussionInclass(0,0)
			progress.checkTimeEstimate(2)
			progress.hideDiscussionInclass(0,0)
			progress.checkTimeEstimate(0)
		})
		it('should be able to show video quizzes and disussion inclass and have correct time estimate',function(){
			progress.checkTimeEstimate(0)
			progress.showDiscussionInclass(0,0)
			progress.checkTimeEstimate(2)
			progress.showVideoQuizInclass(0,0)
			progress.checkTimeEstimate(5)
			progress.hideDiscussionInclass(0,0)
			progress.checkTimeEstimate(3)
			progress.hideVideoQuizInclass(0,0)
			progress.checkTimeEstimate(0)
		})

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
	describe('Second Lecture',function(){
		it('should display correct quiz titles',function(){
			progress.checkInvideoQuizTitle(1,0,modules_items['New Module'], 100)
			progress.checkInvideoQuizTitle(1,1,modules_items['New Module'], 50)
			progress.checkInvideoQuizTitle(1,2,modules_items['New Module'], 50)
		})
		it('should display quiz statistics correct',function(){
			progress.checkQuizChart(1,0,1,1)
			progress.checkQuizChart(1,1,1,1)
			progress.checkQuizChart(1,2,1,2)
			ptor.navigate().refresh();
			progress.checkQuizChart(1,0,5,1)
			progress.checkQuizChart(1,1,5,1)
			progress.checkQuizChart(1,2,2,1)
			ptor.navigate().refresh();
			progress.checkQuizChart(1,0,3,1)
			progress.checkQuizChart(1,2,3,1)
		})
		it('should have correct discussion titles and content',function(){
			progress.checkDiscussionTitle(1,0,modules_items['New Module'])
			progress.checkDiscussionContent(1,0,modules_items['New Module'])
		})
		it('should have correct confused titles',function(){
			progress.checkConfusedTitle(1,0,modules_items['New Module'])
		})
		it('should be able to show quiz inclass and have correct time estimate',function(){
			progress.checkTimeEstimate(0)
			progress.showVideoQuizInclass(1,0)
			progress.checkTimeEstimate(3)
			progress.showVideoQuizInclass(1,1)
			progress.checkTimeEstimate(6)
			progress.showVideoQuizInclass(1,2)
			progress.checkTimeEstimate(9)
			progress.hideVideoQuizInclass(1,0)
			progress.checkTimeEstimate(6)
			progress.hideVideoQuizInclass(1,1)
			progress.checkTimeEstimate(3)
			progress.hideVideoQuizInclass(1,2)
			progress.checkTimeEstimate(0)
		})
		it('should be able to show disussion inclass and have correct time estimate',function(){
			progress.checkTimeEstimate(0)
			progress.showDiscussionInclass(1,0)
			progress.checkTimeEstimate(2)
			progress.hideDiscussionInclass(1,0)
			progress.checkTimeEstimate(0)
		})
		it('should be able to show video quizzes and disussion inclass and have correct time estimate',function(){
			progress.checkTimeEstimate(0)
			progress.showDiscussionInclass(1,0)
			progress.checkTimeEstimate(2)
			progress.showVideoQuizInclass(1,0)
			progress.checkTimeEstimate(5)
			progress.hideDiscussionInclass(1,0)
			progress.checkTimeEstimate(3)
			progress.hideVideoQuizInclass(1,0)
			progress.checkTimeEstimate(0)
		})

		it('should be able to add a replay to discussion',function(){	
			progress.checkDiscussionComment(1,0,0,comment0)
			progress.addReplyToDiscussion(1,0,comment1.title)
			progress.checkDiscussionComment(1,0,1,comment1)
			progress.addReplyToDiscussion(1,0,comment2.title)
			progress.checkDiscussionComment(1,0,2,comment2)
		})
		it('should be able to delete discussion', function(){
			progress.deleteDiscussionComment(1,0,1)
			progress.checkDiscussionComment(1,0,0,comment0)
			progress.checkDiscussionComment(1,0,1,comment2)
			progress.deleteDiscussionComment(1,0,1)
			progress.checkDiscussionComment(1,0,0,comment0)
		})
	})
	describe('Third Lecture',function(){
		it('should display correct quiz titles',function(){
			progress.checkInvideoSurveyTitle(2,0,modules_items['New Module'])
			progress.checkInvideoSurveyTitle(2,1,modules_items['New Module'])
		})
		it('should display quiz statistics correct',function(){
			progress.checkQuizChart(2,0,4,2)
			ptor.navigate().refresh();
			progress.checkQuizChart(2,0,5,1)
			progress.checkQuizChart(2,1,5,2)
		})
		it('should have correct confused titles',function(){
			progress.checkConfusedTitle(2,0,modules_items['New Module'])
		})
		it('should be able to show quiz inclass and have correct time estimate',function(){
			progress.checkTimeEstimate(0)
			progress.showVideoQuizInclass(2,0)
			progress.checkTimeEstimate(3)
			progress.showVideoQuizInclass(2,1)
			progress.checkTimeEstimate(6)
			progress.hideVideoQuizInclass(2,0)
			progress.checkTimeEstimate(3)
			progress.hideVideoQuizInclass(2,1)
			progress.checkTimeEstimate(0)
		})
	})
	describe('First Quiz',function(){
		it('should display correct quiz titles',function(){
			progress.checkQuizTitle(3,0,modules_items['New Module'])
			progress.checkQuizTitle(3,1,modules_items['New Module'])
			progress.checkQuizTitle(3,2,modules_items['New Module'])
		})
		it('should display quiz statistics correct',function(){
			progress.checkQuizChart(3,1,1,1)
			progress.checkQuizChart(3,2,1,1)
			ptor.navigate().refresh();
			progress.checkQuizChart(3,0,2,1)
			progress.checkQuizChart(3,2,2,1)
			ptor.navigate().refresh();
			progress.checkQuizChart(3,0,6,1)
			progress.checkQuizChart(3,2,3,1)
		})
		it('should have correct free text question title',function(){
			progress.checkQuizFreeTextTitle(3,0, modules_items['New Module'])
			progress.checkQuizFreeTextTitle(3,1, modules_items['New Module'])
		})
		it('should have correct free text content',function(){
			progress.checkQuizFreeTextAnswers(3,0, modules_items['New Module'])
			progress.checkQuizFreeTextGrades(3,0, modules_items['New Module'])
			progress.ChangeQuizFreeTextGrade(3,0,1,'Wrong')
			progress.ChangeQuizFreeTextGrade(3,0,0,'Under Review')
			progress.checkQuizFreeTextAnswers(3,1, modules_items['New Module'])
			progress.checkQuizFreeTextGrades(3,1, modules_items['New Module'])
			progress.ChangeQuizFreeTextGrade(3,1,2,'Partial')
			progress.ChangeQuizFreeTextGrade(3,1,3,'Good')
		})
	})
	describe('Second Quiz',function(){
		it('should display correct quiz titles',function(){
			progress.checkQuizTitle(4,0,modules_items['New Module'])
			progress.checkQuizTitle(4,1,modules_items['New Module'])
			progress.checkQuizTitle(4,2,modules_items['New Module'])
		})
		it('should display quiz statistics correct',function(){
			progress.checkQuizChart(4,0,1,2)
			progress.checkQuizChart(4,1,1,1)
			progress.checkQuizChart(4,2,1,2)
			ptor.navigate().refresh();
			progress.checkQuizChart(4,0,2,2)
			progress.checkQuizChart(4,1,5,1)
			progress.checkQuizChart(4,2,2,2)
			ptor.navigate().refresh();
			progress.checkQuizChart(4,2,3,2)
		})
		it('should have correct free text question title',function(){
			progress.checkQuizFreeTextTitle(4,0, modules_items['New Module'])
			progress.checkQuizFreeTextTitle(4,1, modules_items['New Module'])
		})
		it('should have correct free text content',function(){
			progress.checkQuizFreeTextAnswers(4,0, modules_items['New Module'])
			progress.checkQuizFreeTextGrades(4,0, modules_items['New Module'])
			progress.ChangeQuizFreeTextGrade(4,0,1,'Wrong')
			progress.ChangeQuizFreeTextGrade(4,0,0,'Under Review')
			progress.checkQuizFreeTextAnswers(4,1, modules_items['New Module'])
			progress.checkQuizFreeTextGrades(4,1, modules_items['New Module'])
		})
	})
	describe('First Survey',function(){
		it('should display correct survey titles',function(){
			progress.checkQuizTitle(5,0,modules_items['New Module'])
			progress.checkQuizTitle(5,1,modules_items['New Module'])
		})
		it('should display survey statistics correct',function(){
			progress.checkQuizChart(5,0,1,1)
			ptor.navigate().refresh();
			progress.checkQuizChart(5,0,2,1)
			progress.checkQuizChart(5,1,2,1)
		})
		it('should have correct free text question title',function(){
			progress.checkQuizFreeTextTitle(5,0, modules_items['New Module'])
		})
		it('should have correct free text content',function(){
			progress.checkQuizFreeTextAnswers(5,0, modules_items['New Module'])
		})
		it('should replay to free text question',function(){
			var reply_msg = "Reply to Free text question" 
			progress.addReplyToFreeText(5,0, reply_msg)
			progress.checkReplyToFreeText(5,0, reply_msg)
		})
	})
	
})

describe('Teacher', function(){
	it('should select the second module', function(){
		// o_c.press_content_navigator(ptor)
    	teacher.open_module(ptor, 2);
	})
})
describe('Modules Selector Button', function(){
	it('should display the name of the module selected', function(){
		checkNameOnSelectorButton('New Module 2')
	})
})
// describe('Navigation Bullets', function(){
// 	it('should have the same count as the items under the second module', function(){
// 		verifyNumberOfBullets(6)
// 	})
// })

describe('Second Module Progress Page', function(){
	it('should have a video container', function(){
		expect(element(by.className('videoborder')).isDisplayed()).toEqual(true)
	})
	it('should display the module progress chart showing that the one student not started watching', function(){
		progress.checkModuleProgressChart(1, 1)
	})
	it('should display headings for each item in the module with the item name, duration and number of questions and verify sub items count', function(){
		progress.verifyModuleTitlesAndCountOnTimeline(modules_items['New Module 2'])
	})

	describe('First lecture',function(){
		it('should display correct quiz titles',function(){
			progress.checkInvideoQuizTitle(0,0,modules_items['New Module 2'], 0)
			progress.checkInvideoQuizTitle(0,1,modules_items['New Module 2'], 50)
			progress.checkInvideoQuizTitle(0,2,modules_items['New Module 2'], 0)
		})
		it('should display quiz statistics correct',function(){
			progress.checkQuizChart(0,0,1,1)
			progress.checkQuizChart(0,1,4,1)
		})
		it('should be able to show quiz inclass and have correct time estimate',function(){
			progress.checkTimeEstimate(0)
			progress.showVideoQuizInclass(0,0)
			progress.checkTimeEstimate(3)
			progress.showVideoQuizInclass(0,1)
			progress.checkTimeEstimate(6)
			progress.showVideoQuizInclass(0,2)
			progress.checkTimeEstimate(9)
			progress.hideVideoQuizInclass(0,0)
			progress.checkTimeEstimate(6)
			progress.hideVideoQuizInclass(0,1)
			progress.checkTimeEstimate(3)
			progress.hideVideoQuizInclass(0,2)
			progress.checkTimeEstimate(0)
		})
	})
	describe('Second Lecture',function(){
		it('should display correct quiz titles',function(){
			progress.checkInvideoQuizTitle(1,0,modules_items['New Module 2'], 0)
			progress.checkInvideoQuizTitle(1,1,modules_items['New Module 2'], 0)
			progress.checkInvideoQuizTitle(1,2,modules_items['New Module 2'], 0)
		})
		it('should be able to show quiz inclass and have correct time estimate',function(){
			progress.checkTimeEstimate(0)
			progress.showVideoQuizInclass(1,0)
			progress.checkTimeEstimate(3)
			progress.showVideoQuizInclass(1,1)
			progress.checkTimeEstimate(6)
			progress.showVideoQuizInclass(1,2)
			progress.checkTimeEstimate(9)
			progress.hideVideoQuizInclass(1,0)
			progress.checkTimeEstimate(6)
			progress.hideVideoQuizInclass(1,1)
			progress.checkTimeEstimate(3)
			progress.hideVideoQuizInclass(1,2)
			progress.checkTimeEstimate(0)
		})
	})
	describe('Third Lecture',function(){
		it('should display correct quiz titles',function(){
			progress.checkInvideoSurveyTitle(2,0,modules_items['New Module 2'])
			progress.checkInvideoSurveyTitle(2,1,modules_items['New Module 2'])
		})
		it('should display quiz statistics correct',function(){
			progress.checkQuizChart(2,0,6,1)
			progress.checkQuizChart(2,1,4,1)
		})
		it('should be able to show quiz inclass and have correct time estimate',function(){
			progress.checkTimeEstimate(0)
			progress.showVideoQuizInclass(2,0)
			progress.checkTimeEstimate(3)
			progress.showVideoQuizInclass(2,1)
			progress.checkTimeEstimate(6)
			progress.hideVideoQuizInclass(2,0)
			progress.checkTimeEstimate(3)
			progress.hideVideoQuizInclass(2,1)
			progress.checkTimeEstimate(0)
		})
	})
	describe('First Quiz',function(){
		it('should display correct quiz titles',function(){
			progress.checkQuizTitle(3,0,modules_items['New Module 2'])
			progress.checkQuizTitle(3,1,modules_items['New Module 2'])
			progress.checkQuizTitle(3,2,modules_items['New Module 2'])
		})
		it('should have correct free text question title',function(){
			progress.checkQuizFreeTextTitle(3,0, modules_items['New Module 2'])
			progress.checkQuizFreeTextTitle(3,1, modules_items['New Module 2'])
		})
	})
	describe('Second Quiz',function(){
		it('should display correct quiz titles',function(){
			progress.checkQuizTitle(4,0,modules_items['New Module 2'])
			progress.checkQuizTitle(4,1,modules_items['New Module 2'])
			progress.checkQuizTitle(4,2,modules_items['New Module 2'])
		})
		it('should have correct free text question title',function(){
			progress.checkQuizFreeTextTitle(4,0, modules_items['New Module 2'])
			progress.checkQuizFreeTextTitle(4,1, modules_items['New Module 2'])
		})
	})
	describe('First Survey',function(){
		it('should display correct survey titles',function(){
			progress.checkQuizTitle(5,0,modules_items['New Module 2'])
			progress.checkQuizTitle(5,1,modules_items['New Module 2'])
		})
		it('should have correct free text question title',function(){
			progress.checkQuizFreeTextTitle(5,0, modules_items['New Module 2'])
		})
	})
	
})

function checkNameOnSelectorButton(name){
	expect(element(by.id('content_navigator')).getText()).toEqual(params.short_name+': '+name)
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

function roundToNearestQuarter(percent, duration){
	var time = Math.floor((duration*percent)/100)
	var hr  = Math.floor(time / 3600);
  	var min = Math.floor((time - (hr * 3600))/60);
  	var sec = Math.floor(time - (hr * 3600) -  (min * 60));
 	sec = (Math.floor(sec/15) * 15) % 60;
 	if (min < 10) { min = "0" + min; }
  	if (sec < 10) { sec  = "0" + sec; }
  	return  min + ':' + sec;
}


