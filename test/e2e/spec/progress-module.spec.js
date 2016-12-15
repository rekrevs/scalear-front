var ContentNavigator = require('./pages/content_navigator');
var CourseEditor = require('./pages/course_editor');
var CourseList = require('./pages/course_list');
var InvideoQuiz = require('./pages/invideo_quiz');
var NormalQuiz = require('./pages/normal_quiz');
var Video = require('./pages/video');
var sleep = require('./lib/utils').sleep;
var refresh= require('./lib/utils').refresh;
var Login = require('./pages/login');
var Header = require('./pages/header');
var SubHeader = require('./pages/sub_header');
var ContentItems = require('./pages/content_items');
var ModuleProgress = require('./pages/module_progress');
var StudentQuiz = require('./pages/student/quiz');
var StudentLecture = require('./pages/student/lecture');

var params = browser.params;
var header = new Header()
var sub_header = new SubHeader()
var course_editor = new CourseEditor()
var login_page = new Login()
var course_list = new CourseList()
var video = new Video();
var invideo_quiz = new InvideoQuiz();
var quiz = new NormalQuiz();
var content_items= new ContentItems()
var navigator = new ContentNavigator(1)
var module_progress = new ModuleProgress()
var student_quiz = new StudentQuiz()
var student_lec = new StudentLecture()

var student_names = ['studenttest2 sharklasers', 'student test']
var teacher_name = "teacher1"
var student_emails = [params.student2.email, params.student1.email]
var module_names = ['New Module', 'New Module 2']
var checkmarks = {'studenttest2 sharklasers': ['on_time', 'not_finished'], 'student test': ['on_time', 'not_finished']}
var duration={ min:4, sec:46}
var total_duration = duration.min*60+duration.sec
var modules_items = {
	'New Module': [{
					'name':'lecture1 video quizzes',
					'duration': '00:04:47',
					'questions': [
						{title:'MCQ QUIZ', type:'MCQ', time:roundTimeToPercentage(10, total_duration), vote_count:1, vote_percent:34},
						{title:'OCQ QUIZ', type:'OCQ', time:roundTimeToPercentage(20, total_duration), vote_count:1, vote_percent:34},
						{title:'DRAG QUIZ', type:'drag', time:roundTimeToPercentage(30, total_duration), vote_count:0, vote_percent:0}
					],
					'free_text':[],
					'discussion':[
						{title: 'Private Question', type:'private', time:roundTimeToPercentage(15, total_duration), likes:'0', flags:'0', screen_name:params.student1.online_name},
						{title: 'Public Question', type:'public', time:roundTimeToPercentage(35, total_duration), likes:'2', flags:'1', screen_name:params.student1.online_name},
						{title: 'private question by second student', type:'private', time:roundTimeToPercentage(40, total_duration), likes:'0', flags:'0', screen_name:params.student2.online_name}
					],
					'confused':[],
					},
					{
					'name':'lecture2 text quizzes',
					'duration': '00:04:47',
					'questions': [
						{title:'MCQ TEXT QUIZ', type:'MCQ', time:roundTimeToPercentage(10, total_duration), vote_count:2, vote_percent:67},
						{title:'OCQ TEXT QUIZ', type:'OCQ', time:roundTimeToPercentage(20, total_duration), vote_count:1, vote_percent:34},
						{title:'DRAG TEXT QUIZ', type:'drag', time:roundTimeToPercentage(30, total_duration), vote_count:1, vote_percent:34}
					],
					'free_text':[],
					'discussion':[],
					'confused':[],
					},
					{
					'name':'lecture3 video surveys',
					'duration': '00:04:47',
					'questions':  [
						{title:'MCQ SURVEY', type:'MCQ', time:roundTimeToPercentage(10, total_duration)},
						{title:'OCQ SURVEY', type:'OCQ', time:roundTimeToPercentage(20, total_duration)}
					],
					'free_text':[],
					'discussion':[],
					'confused':[],
					},
					{
					'name':'quiz1',
					'questions': [
						{title:'mcq question', type: 'MCQ'},
						{title:'ocq question', type:'OCQ'},
						{title:'drag question', type:'drag'}
					],
					'free_text':[
						{title:'free question', answers:[{title:'free answer', grade:'Under Review'}]},
						{title:'match question', answers:[{title:'match answer', grade:'Correct'}]},
					],
					'discussion':[],
					'confused':[]
					},
					{
					'name':'quiz2',
					'questions': [
						{title:'mcq question', type: 'MCQ'},
						{title:'ocq question', type:'OCQ'},
						{title:'drag question', type:'drag'}
					],
					'free_text':[
						{title:'free question', answers:[{title:'second free answer', grade:'Under Review'},{title:'second second free answer', grade:'Under Review'}]},
						{title:'match question',answers:[{title:"shouldn't match answer", grade:'Incorrect'},{title:"match answer", grade:'Correct'}]},
					],
					'discussion':[],
					'confused':[],
					},
					{
					'name':'survey1',
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
					'name':'lecture4 video quizzes',
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
					'name':'lecture5 text quizzes',
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
					'name':'lecture6 video surveys',
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
					'name':'quiz3',
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
					'name':'quiz4',
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
					'name':'survey2',
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
var comment0 = {title: "first comment", likes:0, flags:0, screen_name:params.student2.online_name}
var comment1 = {title: "second comment", likes:2, flags:1, screen_name:'Student-00A0'}
var comment2 = {title: "teacher can reply to discussions", likes:0, flags:0, screen_name:params.teacher1.online_name}
var comment3 = {title: "still can add many comments", likes:0, flags:0, screen_name:params.teacher1.online_name}

// module_progress = Module 1, 2 , 3 level(1)
// module item =  lecture , normal quizes level ( 2 )


describe("check course review", function(){
	describe("Teacher", function(){
		it("should login",function(){
			login_page.sign_in(params.teacher1.email, params.password)
		})
		it("should open course",function(){
			course_list.open()
			course_list.open_teacher_course(1)
		})
		it("should go to review mode",function(){
			sub_header.open_review_mode()
		})
		describe('First Module Progress Page', function(){
			it("should open first moduel",function(){
				navigator.module(1).open()
				element(by.className('module-review')).click()
			})
			it('should have a video container', function(){
				expect(element(by.id('progress_lec_video')).isPresent()).toEqual(true)
			})
			it('should display the module progress chart showing that the two students finished on time', function(){
				refresh()
					sleep(10000)
				expect(module_progress.getModuleChartValueAt(1)).toBe('1')
				refresh()
					sleep(10000)
				expect(module_progress.getModuleChartValueAt(4)).toBe('2')
			})
			it('should display headings for each item in the module with the item name, duration and number of questions and verify sub items count', function(){
				expect(module_progress.module_items.count()).toBe(modules_items['New Module'].length)
				modules_items['New Module'].forEach(function(item, i){					
					var total = item.questions.length+item.free_text.length+item.discussion.length+item.confused.length
					// console.log(module_progress.module_item(i+1))
					// console.log(module_progress.module_item(i+1).items)
					// console.log(total)
					expect(module_progress.module_item(i+1).items.count()).toBe(total)
					var summary = "("
					if(item.duration)
						summary+=item.duration+', '
					summary+=(item.questions.length+item.free_text.length) +' Questions)'
					var main_title = item.name+" "+ summary
					expect(module_progress.module_item(i+1).title).toContain(main_title)
				})
			})
			describe('First lecture',function(){
				it('should display correct quiz titles',function(){
					var question = modules_items['New Module'][0].questions[0]
					expect(module_progress.module_item(1).quiz(1).quiz_title).toEqual('['+question.time+'] Quiz: '+question.title+' ('+question.type+') - '+question.vote_count+' students ('+question.vote_percent+'%) voted for review')
					module_progress.module_item(1).quiz(1).show_inclass_click()
					expect(module_progress.module_item(1).quiz(1).show_inclass_box.isSelected()).toEqual(true)

					var question = modules_items['New Module'][0].questions[1]
					expect(module_progress.module_item(1).quiz(2).quiz_title).toEqual('['+question.time+'] Quiz: '+question.title+' ('+question.type+') - '+question.vote_count+' students ('+question.vote_percent+'%) voted for review')
					module_progress.module_item(1).quiz(2).show_inclass_click()
					expect(module_progress.module_item(1).quiz(2).show_inclass_box.isSelected()).toEqual(true)

					var question = modules_items['New Module'][0].questions[2]
					expect(module_progress.module_item(1).quiz(3).quiz_title).toEqual('['+question.time+'] Quiz: '+question.title+' ('+question.type+') - '+question.vote_count+' students ('+question.vote_percent+'%) voted for review')
					module_progress.module_item(1).quiz(3).show_inclass_click()
					expect(module_progress.module_item(1).quiz(3).show_inclass_box.isSelected()).toEqual(true)
				})
				it('should display correct total In-Class time',function(){
					expect(module_progress.time_estimate_total_time).toEqual('Total In-Class Time:\n9 minutes')
				})
				it('should display quiz statistics correct',function(){
					//  Quiz 1
					refresh()
					sleep(5000)
					expect(module_progress.module_item(1).quiz(1).getModuleChartValueAt(1)).toBe('2')
					refresh()
					sleep(5000)
					expect(module_progress.module_item(1).quiz(1).getModuleChartValueAt(3)).toBe('2')
					// Quiz 2
					refresh()
					sleep(5000)
					expect(module_progress.module_item(1).quiz(2).getModuleChartValueAt(4)).toBe('1')
					refresh()
					sleep(5000)
					expect(module_progress.module_item(1).quiz(2).getModuleChartValueAt(2)).toBe('1')
					// Quiz 3
					refresh()
					sleep(5000)
					expect(module_progress.module_item(1).quiz(3).getModuleChartValueAt(1)).toBe('2')
					refresh()
					sleep(5000)
					expect(module_progress.module_item(1).quiz(3).getModuleChartValueAt(2)).toBe('2')
					refresh()
					sleep(5000)
					expect(module_progress.module_item(1).quiz(3).getModuleChartValueAt(3)).toBe('2')
				})
				it('should have correct discussion titles and content',function(){
					// Discussion 1
					var discussion = modules_items['New Module'][0].discussion[0]
					expect(module_progress.module_item(1).discussion(1).discussion_title).toEqual('['+discussion.time+'] Discussion:')
					expect(module_progress.module_item(1).discussion(1).discussion_student_name).toEqual(discussion.screen_name+':')
					expect(module_progress.module_item(1).discussion(1).discussion_student_content).toEqual(discussion.title)
					expect(module_progress.module_item(1).discussion(1).discussion_student_private.isDisplayed()).toEqual(true)
					module_progress.module_item(1).discussion(1).show_inclass_click()
					expect(module_progress.module_item(1).discussion(1).show_inclass_box.isSelected()).toEqual(true)
					// Discussion 2
					var discussion = modules_items['New Module'][0].discussion[1]
					expect(module_progress.module_item(1).discussion(2).discussion_title).toEqual('['+discussion.time+'] Discussion:')
					expect(module_progress.module_item(1).discussion(2).discussion_student_name).toEqual(discussion.screen_name+':')
					expect(module_progress.module_item(1).discussion(2).discussion_student_content).toEqual(discussion.title)
					expect(module_progress.module_item(1).discussion(2).discussion_student_flags).toEqual(discussion.flags)
					expect(module_progress.module_item(1).discussion(2).discussion_student_likes).toEqual(discussion.likes)
					expect(module_progress.module_item(1).discussion(2).discussion_student_public.isDisplayed()).toEqual(true)
					module_progress.module_item(1).discussion(2).show_inclass_click()
					expect(module_progress.module_item(1).discussion(2).show_inclass_box.isSelected()).toEqual(true)
					module_progress.module_item(1).discussion(2).comments_count().then(function(coun){expect(coun).toEqual(2)})

					// Discussion 3
					var discussion = modules_items['New Module'][0].discussion[2]
					expect(module_progress.module_item(1).discussion(3).discussion_title).toEqual('['+discussion.time+'] Discussion:')
					expect(module_progress.module_item(1).discussion(3).discussion_student_name).toEqual(discussion.screen_name+':')
					expect(module_progress.module_item(1).discussion(3).discussion_student_content).toEqual(discussion.title)
					expect(module_progress.module_item(1).discussion(3).discussion_student_private.isDisplayed()).toEqual(true)
					module_progress.module_item(1).discussion(3).show_inclass_click()
					expect(module_progress.module_item(1).discussion(3).show_inclass_box.isSelected()).toEqual(true)
				})
				it('should display correct total In-Class time',function(){
					expect(module_progress.time_estimate_total_time).toEqual('Total In-Class Time:\n15 minutes')
					module_progress.module_item(1).quiz(1).show_inclass_click()
					module_progress.module_item(1).quiz(2).show_inclass_click()
					module_progress.module_item(1).quiz(3).show_inclass_click()
					module_progress.module_item(1).discussion(1).show_inclass_click()
					module_progress.module_item(1).discussion(2).show_inclass_click()
					module_progress.module_item(1).discussion(3).show_inclass_click()
				})
				it('should be able to add a replay to discussion',function(){
					module_progress.module_item(1).discussion(2).reply("reply")
					module_progress.module_item(1).discussion(2).comments_count().then(function(coun){expect(coun).toEqual(3)})
				})
				it('should be able to delete discussion', function(){
					module_progress.module_item(1).discussion(2).delete_discussion()
				})

			})
			describe('Second Lecture',function(){
				it('should display correct quiz titles',function(){
					var question = modules_items['New Module'][1].questions[0]
					expect(module_progress.module_item(2).quiz(1).quiz_title).toEqual('['+question.time+'] Quiz: '+question.title+' ('+question.type+') - '+question.vote_count+' students ('+question.vote_percent+'%) voted for review')
					module_progress.module_item(2).quiz(1).show_inclass_click()
					expect(module_progress.module_item(2).quiz(1).show_inclass_box.isSelected()).toEqual(true)

					var question = modules_items['New Module'][1].questions[1]
					expect(module_progress.module_item(2).quiz(2).quiz_title).toEqual('['+question.time+'] Quiz: '+question.title+' ('+question.type+') - '+question.vote_count+' students ('+question.vote_percent+'%) voted for review')
					module_progress.module_item(2).quiz(2).show_inclass_click()
					expect(module_progress.module_item(2).quiz(2).show_inclass_box.isSelected()).toEqual(true)

					var question = modules_items['New Module'][1].questions[2]
					expect(module_progress.module_item(2).quiz(3).quiz_title).toEqual('['+question.time+'] Quiz: '+question.title+' ('+question.type+') - '+question.vote_count+' students ('+question.vote_percent+'%) voted for review')
					module_progress.module_item(2).quiz(3).show_inclass_click()
					expect(module_progress.module_item(2).quiz(3).show_inclass_box.isSelected()).toEqual(true)
				})
				it('should display correct total In-Class time',function(){
					expect(module_progress.time_estimate_total_time).toEqual('Total In-Class Time:\n9 minutes')
				})
				it('should display quiz statistics correct',function(){
					//  Quiz 1
					refresh()
					sleep(5000)
					expect(module_progress.module_item(2).quiz(1).getModuleChartValueAt(1)).toBe('1')
					refresh()
					sleep(5000)
					expect(module_progress.module_item(2).quiz(1).getModuleChartValueAt(3)).toBe('1')
					refresh()
					sleep(5000)
					expect(module_progress.module_item(2).quiz(1).getModuleChartValueAt(5)).toBe('1')
					// Quiz 2
					refresh()
					sleep(5000)
					expect(module_progress.module_item(2).quiz(2).getModuleChartValueAt(4)).toBe('1')
					refresh()
					sleep(8000)
					expect(module_progress.module_item(2).quiz(2).getModuleChartValueAt(2)).toBe('1')
					// Quiz 3
					refresh()
					sleep(5000)
					expect(module_progress.module_item(2).quiz(3).getModuleChartValueAt(3)).toBe('1')
				})
				it('should display correct total In-Class time',function(){
					module_progress.module_item(2).quiz(1).show_inclass_click()
					module_progress.module_item(2).quiz(2).show_inclass_click()
					module_progress.module_item(2).quiz(3).show_inclass_click()
					expect(module_progress.time_estimate_total_time).toEqual('Total In-Class Time:\n0 minutes')
				})
			})
			describe('Third Lecture',function(){
				it('should display correct quiz titles',function(){
					var question = modules_items['New Module'][2].questions[0]
					expect(module_progress.module_item(3).quiz(1).quiz_title).toEqual('['+question.time+'] Survey: '+question.title+' ('+question.type+')')
					module_progress.module_item(3).quiz(1).show_inclass_click()
					expect(module_progress.module_item(3).quiz(1).show_inclass_box.isSelected()).toEqual(true)

					var question = modules_items['New Module'][2].questions[1]
					expect(module_progress.module_item(3).quiz(2).quiz_title).toEqual('['+question.time+'] Survey: '+question.title+' ('+question.type+')')
					module_progress.module_item(3).quiz(2).show_inclass_click()
					expect(module_progress.module_item(3).quiz(2).show_inclass_box.isSelected()).toEqual(true)
				})
				it('should display correct total In-Class time',function(){
					expect(module_progress.time_estimate_total_time).toEqual('Total In-Class Time:\n6 minutes')
				})
				it('should display quiz statistics correct',function(){
					//  Quiz 1
					refresh()
					sleep(5000)
					expect(module_progress.module_item(3).quiz(1).getModuleChartValueAt(4)).toBe('2')
					refresh()
					sleep(5000)
					expect(module_progress.module_item(3).quiz(1).getModuleChartValueAt(5)).toBe('1')
					// Quiz 2
					refresh()
					sleep(5000)
					expect(module_progress.module_item(3).quiz(2).getModuleChartValueAt(5)).toBe('2')
				})
				it('should display correct total In-Class time',function(){
					module_progress.module_item(3).quiz(1).show_inclass_click()
					module_progress.module_item(3).quiz(2).show_inclass_click()
					expect(module_progress.time_estimate_total_time).toEqual('Total In-Class Time:\n0 minutes')
				})
			})
			describe('Quiz 1',function(){
				it('should display correct quiz titles',function(){
					sleep(5000)
					var question = modules_items['New Module'][3].questions[0]
					expect(module_progress.module_item(4).question_quiz(1).quiz_title).toEqual('Title: '+question.title+' ('+question.type+')')

					var question = modules_items['New Module'][3].questions[1]
					expect(module_progress.module_item(4).question_quiz(2).quiz_title).toEqual('Title: '+question.title+' ('+question.type+')')

					var question = modules_items['New Module'][3].questions[2]
					expect(module_progress.module_item(4).question_quiz(3).quiz_title).toEqual('Title: '+question.title+' ('+question.type+')')

				})
				it('should display quiz statistics correct',function(){
					//  Quiz 1
					refresh()
					sleep(5000)
					expect(module_progress.module_item(4).question_quiz(1).getModuleChartValueAt(1)).toBe('1')
					refresh()
					sleep(5000)
					expect(module_progress.module_item(4).question_quiz(1).getModuleChartValueAt(3)).toBe('1')
					// Quiz 2
					refresh()
					sleep(5000)
					expect(module_progress.module_item(4).question_quiz(2).getModuleChartValueAt(1)).toBe('1')
					//  Quiz 3
					refresh()
					sleep(5000)
					expect(module_progress.module_item(4).question_quiz(3).getModuleChartValueAt(1)).toBe('1')
					refresh()
					sleep(5000)
					expect(module_progress.module_item(4).question_quiz(3).getModuleChartValueAt(2)).toBe('1')
					refresh()
					sleep(5000)
					expect(module_progress.module_item(4).question_quiz(3).getModuleChartValueAt(3)).toBe('1')
				})
				it('should have correct freetext answer',function(){
					var discussion = modules_items['New Module'][3].free_text[0]
					module_progress.module_item(4).freetextquestion(1).answers.count().then(function(coun){expect(coun).toEqual(1)})
					expect(module_progress.module_item(4).freetextquestion(1).title).toEqual('Free Text Question: '+discussion.title)
					expect(module_progress.module_item(4).freetextquestion(1).answer(1)).toEqual(discussion.answers[0].title)
					expect(module_progress.module_item(4).freetextquestion(1).grade(1)).toEqual(discussion.answers[0].grade)
					module_progress.module_item(4).freetextquestion(1).grade_change(1, 2)
					expect(module_progress.module_item(4).freetextquestion(1).grade(1)).toEqual("Incorrect")
					module_progress.module_item(4).freetextquestion(1).grade_change(1, 1)
					expect(module_progress.module_item(4).freetextquestion(1).grade(1)).toEqual(discussion.answers[0].grade)

					var discussion = modules_items['New Module'][3].free_text[1]
					module_progress.module_item(4).freetextquestion(2).answers.count().then(function(coun){expect(coun).toEqual(1)})
					expect(module_progress.module_item(4).freetextquestion(2).title).toEqual('Free Text Question: '+discussion.title)
					expect(module_progress.module_item(4).freetextquestion(2).answer(1)).toEqual(discussion.answers[0].title)
					expect(module_progress.module_item(4).freetextquestion(2).grade(1)).toEqual(discussion.answers[0].grade)
					module_progress.module_item(4).freetextquestion(2).grade_change(1, 2)
					expect(module_progress.module_item(4).freetextquestion(2).grade(1)).toEqual("Incorrect")
					module_progress.module_item(4).freetextquestion(2).grade_change(1, 4)
					expect(module_progress.module_item(4).freetextquestion(2).grade(1)).toEqual(discussion.answers[0].grade)
				})
			})
			describe('Quiz 2',function(){
				it('should display correct quiz titles',function(){
					var question = modules_items['New Module'][4].questions[0]
					expect(module_progress.module_item(5).question_quiz(1).quiz_title).toEqual('Title: '+question.title+' ('+question.type+')')

					var question = modules_items['New Module'][4].questions[1]
					expect(module_progress.module_item(5).question_quiz(2).quiz_title).toEqual('Title: '+question.title+' ('+question.type+')')

					var question = modules_items['New Module'][4].questions[2]
					expect(module_progress.module_item(5).question_quiz(3).quiz_title).toEqual('Title: '+question.title+' ('+question.type+')')
				})
				it('should display quiz statistics correct',function(){
					//  Quiz 1
					refresh()
					sleep(5000)
					expect(module_progress.module_item(5).question_quiz(1).getModuleChartValueAt(1)).toBe('2')
					refresh()
					sleep(5000)
					expect(module_progress.module_item(5).question_quiz(1).getModuleChartValueAt(3)).toBe('1')
					refresh()
					sleep(5000)
					expect(module_progress.module_item(5).question_quiz(1).getModuleChartValueAt(5)).toBe('1')
					// Quiz 2
					refresh()
					sleep(5000)
					expect(module_progress.module_item(5).question_quiz(2).getModuleChartValueAt(1)).toBe('1')
					refresh()
					sleep(5000)
					expect(module_progress.module_item(5).question_quiz(2).getModuleChartValueAt(5)).toBe('1')
					//  Quiz 3
					refresh()
					sleep(5000)
					expect(module_progress.module_item(5).question_quiz(3).getModuleChartValueAt(1)).toBe('2')
					refresh()
					sleep(5000)
					expect(module_progress.module_item(5).question_quiz(3).getModuleChartValueAt(2)).toBe('2')
					refresh()
					sleep(5000)
					expect(module_progress.module_item(5).question_quiz(3).getModuleChartValueAt(3)).toBe('2')
				})
				it('should have correct freetext answer',function(){
					var discussion = modules_items['New Module'][4].free_text[0]
					module_progress.module_item(5).freetextquestion(1).answers.count().then(function(coun){expect(coun).toEqual(2)})
					expect(module_progress.module_item(5).freetextquestion(1).title).toEqual('Free Text Question: '+discussion.title)
					expect(module_progress.module_item(5).freetextquestion(1).answer(1)).toEqual(discussion.answers[0].title)
					expect(module_progress.module_item(5).freetextquestion(1).grade(1)).toEqual(discussion.answers[0].grade)
					module_progress.module_item(5).freetextquestion(1).grade_change(1, 2)
					expect(module_progress.module_item(5).freetextquestion(1).grade(1)).toEqual("Incorrect")
					module_progress.module_item(5).freetextquestion(1).grade_change(1, 1)
					expect(module_progress.module_item(5).freetextquestion(1).grade(1)).toEqual(discussion.answers[1].grade)

					expect(module_progress.module_item(5).freetextquestion(1).answer(2)).toEqual(discussion.answers[1].title)
					expect(module_progress.module_item(5).freetextquestion(1).grade(2)).toEqual(discussion.answers[1].grade)
					module_progress.module_item(5).freetextquestion(1).grade_change(2, 2)
					expect(module_progress.module_item(5).freetextquestion(1).grade(2)).toEqual("Incorrect")
					module_progress.module_item(5).freetextquestion(1).grade_change(2, 1)
					expect(module_progress.module_item(5).freetextquestion(1).grade(2)).toEqual(discussion.answers[1].grade)

					var discussion = modules_items['New Module'][4].free_text[1]
					module_progress.module_item(5).freetextquestion(2).answers.count().then(function(coun){expect(coun).toEqual(2)})
					expect(module_progress.module_item(5).freetextquestion(2).title).toEqual('Free Text Question: '+discussion.title)
					expect(module_progress.module_item(5).freetextquestion(2).answer(1)).toEqual(discussion.answers[0].title)
					expect(module_progress.module_item(5).freetextquestion(2).grade(1)).toEqual(discussion.answers[0].grade)
					module_progress.module_item(5).freetextquestion(2).grade_change(1, 4)
					expect(module_progress.module_item(5).freetextquestion(2).grade(1)).toEqual("Correct")
					module_progress.module_item(5).freetextquestion(2).grade_change(1, 2)
					expect(module_progress.module_item(5).freetextquestion(2).grade(1)).toEqual(discussion.answers[0].grade)

					expect(module_progress.module_item(5).freetextquestion(2).title).toEqual('Free Text Question: '+discussion.title)
					expect(module_progress.module_item(5).freetextquestion(2).answer(2)).toEqual(discussion.answers[1].title)
					expect(module_progress.module_item(5).freetextquestion(2).grade(2)).toEqual(discussion.answers[1].grade)
					module_progress.module_item(5).freetextquestion(2).grade_change(2, 2)
					expect(module_progress.module_item(5).freetextquestion(2).grade(2)).toEqual("Incorrect")
					module_progress.module_item(5).freetextquestion(2).grade_change(2, 4)
					expect(module_progress.module_item(5).freetextquestion(2).grade(2)).toEqual(discussion.answers[1].grade)
				})
				it('should click on related button ',function(){
					module_progress.module_item(5).freetextquestion(1).clickonRelated(1)
					var discussion = modules_items['New Module'][4].free_text[0]
					module_progress.module_item(5).freetextquestion(1).answers.count().then(function(coun){expect(coun).toEqual(1)})

					var discussion = modules_items['New Module'][4].free_text[1]
					module_progress.module_item(5).freetextquestion(2).answers.count().then(function(coun){expect(coun).toEqual(1)})
				})
				it('should check related answers to student',function(){
					module_progress.module_item(5).clickonSeeall()
					var discussion = modules_items['New Module'][4].free_text[0]
					module_progress.module_item(5).freetextquestion(1).answers.count().then(function(coun){expect(coun).toEqual(2)})

					var discussion = modules_items['New Module'][4].free_text[1]
					module_progress.module_item(5).freetextquestion(2).answers.count().then(function(coun){expect(coun).toEqual(2)})
				})
				it('should have change grade of answer for student 2',function(){
					var discussion = modules_items['New Module'][4].free_text[0]
					expect(module_progress.module_item(5).freetextquestion(1).grade(2)).toEqual(discussion.answers[1].grade)
					module_progress.module_item(5).freetextquestion(1).grade_change(2, 2)
					expect(module_progress.module_item(5).freetextquestion(1).grade(2)).toEqual("Incorrect")

					var discussion = modules_items['New Module'][4].free_text[1]
					expect(module_progress.module_item(5).freetextquestion(2).grade(2)).toEqual(discussion.answers[1].grade)
					module_progress.module_item(5).freetextquestion(2).grade_change(2, 2)
					expect(module_progress.module_item(5).freetextquestion(2).grade(2)).toEqual("Incorrect")
				})
				it("should logout",function(){
					header.logout()
				})
				describe('Student 2',function(){
					it("login in",function(){
						login_page.sign_in(params.student2.email, params.password)
					})
					it("should open quiz 2 in first module ",function(){
						course_list.open()
						course_list.open_student_course(1)
						navigator.module(1).open()
						navigator.module(1).item(5).open()
					})
					it("should check that grade of quiz",function(){
						expect(student_quiz.incorrect.count()).toEqual(3)
						expect(student_quiz.correct.count()).toEqual(2)
					})
					it("should logout",function(){
						header.logout()
					})
				})
				it("teacher should login",function(){
					login_page.sign_in(params.teacher1.email, params.password)
				})
				it("should open course",function(){
					course_list.open()
					course_list.open_teacher_course(1)
				})
				it("should go to review mode",function(){
					sub_header.open_review_mode()
				})
				it("should open first moduel",function(){
					navigator.module(1).open()
					element(by.className('module-review')).click()
				})
				it('should revert the grade of answer for student 2',function(){
					var discussion = modules_items['New Module'][4].free_text[0]
					expect(module_progress.module_item(5).freetextquestion(1).grade(2)).toEqual("Incorrect")
					module_progress.module_item(5).freetextquestion(1).grade_change(2, 1)
					expect(module_progress.module_item(5).freetextquestion(1).grade(2)).toEqual(discussion.answers[1].grade)

					var discussion = modules_items['New Module'][4].free_text[1]
					expect(module_progress.module_item(5).freetextquestion(2).grade(2)).toEqual("Incorrect")
					module_progress.module_item(5).freetextquestion(2).grade_change(2, 4)
					expect(module_progress.module_item(5).freetextquestion(2).grade(2)).toEqual(discussion.answers[1].grade)
				})
			})
			describe('Survey',function(){
				it('should display correct Survey titles',function(){
					var question = modules_items['New Module'][5].questions[0]
					expect(module_progress.module_item(6).question_quiz(1).quiz_title).toEqual('Title: '+question.title+' ('+question.type+')')

					var question = modules_items['New Module'][5].questions[1]
					expect(module_progress.module_item(6).question_quiz(2).quiz_title).toEqual('Title: '+question.title+' ('+question.type+')')
				})
				it('should display quiz statistics correct',function(){
					//  Quiz 1
					refresh()
					sleep(5000)
					expect(module_progress.module_item(6).question_quiz(1).getModuleChartValueAt(1)).toBe('1')
					refresh()
					sleep(5000)
					expect(module_progress.module_item(6).question_quiz(1).getModuleChartValueAt(2)).toBe('1')
					// Quiz 2
					refresh()
					sleep(5000)
					expect(module_progress.module_item(6).question_quiz(2).getModuleChartValueAt(2)).toBe('1')
				})
				it('should display freetext question statistics correct',function(){
					var discussion = modules_items['New Module'][5].free_text[0]
					module_progress.module_item(6).freetextquestion(1).answers.count().then(function(coun){expect(coun).toEqual(1)})
					expect(module_progress.module_item(6).freetextquestion(1).title).toEqual('Free Text Question: '+discussion.title)
					expect(module_progress.module_item(6).freetextquestion(1).answer(1)).toEqual(discussion.answers[0].title)
					module_progress.module_item(6).question_quiz(1).show_inclass_click()
					module_progress.module_item(6).question_quiz(2).show_inclass_click()
					module_progress.module_item(6).freetextquestion(1).show_inclass_click()
				})
				it('should display correct total In-Class time',function(){
					expect(module_progress.time_estimate_total_time).toEqual('Total In-Class Time:\n6 minutes')
					module_progress.module_item(6).question_quiz(1).show_inclass_click()
					module_progress.module_item(6).question_quiz(2).show_inclass_click()
					module_progress.module_item(6).freetextquestion(1).show_inclass_click()
					expect(module_progress.time_estimate_total_time).toEqual('Total In-Class Time:\n0 minutes')
				})
				it('should be able to add a replay to discussion',function(){
					module_progress.module_item(6).freetextquestion(1).reply("reply")
				})
				it('should be able to delete a replay to  discussion', function(){
					module_progress.module_item(6).freetextquestion(1).delete_reply()
				})
				it('should make survey visible to students',function(){
					module_progress.module_item(6).makevisible()
				})

				it("should logout",function(){
					header.logout()
				})
				describe('Student 2',function(){
					it(" login in",function(){
						login_page.sign_in(params.student2.email, params.password)
					})
					it("should open first moduel",function(){
						course_list.open()
						course_list.open_student_course(1)
						navigator.module(1).open()
						navigator.module(1).item(6).open()
					})
					it(" check that survey is visible",function(){
						expect(module_progress.module_item(6).suveryresults.isPresent()).toBe(true)
					})
					it("should logout",function(){
						header.logout()
					})
				})
				it("teacher should login",function(){
					login_page.sign_in(params.teacher1.email, params.password)
				})
				it("should open course",function(){
					course_list.open()
					course_list.open_teacher_course(1)
				})
				it("should go to review mode",function(){
					sub_header.open_review_mode()
				})
				it("should open first moduel",function(){
					navigator.module(1).open()
					element(by.className('module-review')).click()
				})
				it('should hide surveyresults',function(){
					module_progress.module_item(6).hidevisible()
				})
				it("should logout",function(){
					header.logout()
				})
				describe('Revert disussion',function(){
					describe('Student 2',function(){
						it(" login in",function(){
							login_page.sign_in(params.student2.email, params.password)
						})
						it("should open first moduel",function(){
							course_list.open()
							course_list.open_student_course(1)
							navigator.module(1).open()
							navigator.module(1).item(6).open()
						})
						it(" check that survey is not visible",function(){
							expect(module_progress.module_item(6).suveryresults.isPresent()).toBe(false)
						})
						it('should open first lecture in first module', function(){
							navigator.module(1).open()
							navigator.module(1).item(1).open()
						})
						it("should open timeline",function(){
							student_lec.open_timeline()
						})
						xit("should delete discussion post",function(){
							student_lec.lecture(1).discussion(1).delete()
							expect(student_lec.lecture(1).discussions.count()).toEqual(0)
							expect(student_lec.lecture(1).items.count()).toEqual(3)
						})
						// it("should delete discussion post",function(){
						// 	student_lec.lecture(1).discussion(2).delete()
						// 	expect(student_lec.lecture(1).discussions.count()).toEqual(0)
						// 	expect(student_lec.lecture(1).items.count()).toEqual(3)
						// })
						it("should logout",function(){
							// student_lec.open_timeline()
							header.logout()
						})
					})
					describe('Student 1',function(){
						it(" login in",function(){
							login_page.sign_in(params.student1.email, params.password)
						})
						it('should open first lecture in first module', function(){
							course_list.open()
							course_list.open_student_course(1)
							navigator.module(1).open()
							navigator.module(1).item(1).open()
						})
						// it("should open timeline",function(){
						// 	// student_lec.open_timeline()
						// })
						it("should delete discussion post",function(){
							student_lec.lecture(1).discussion(1).delete()
							expect(student_lec.lecture(1).discussions.count()).toEqual(0)
							expect(student_lec.lecture(1).items.count()).toEqual(3)
						})
						it("should logout",function(){
							student_lec.open_timeline()
							header.logout()
						})
					})
					describe('Student 2',function(){
						it(" login in",function(){
							login_page.sign_in(params.student2.email, params.password)
						})
						it('should open first lecture in first module', function(){
							course_list.open()
							course_list.open_student_course(1)
							navigator.module(1).open()
							navigator.module(1).item(1).open()
						})
						// it("should open timeline",function(){
						// 	// student_lec.open_timeline()
						// })
						it("should delete discussion post",function(){
							student_lec.lecture(1).discussion(1).delete()
							expect(student_lec.lecture(1).discussions.count()).toEqual(0)
							expect(student_lec.lecture(1).items.count()).toEqual(3)
						})
						it("should logout",function(){
							student_lec.open_timeline()
							header.logout()
						})
					})
					// it("teacher should login",function(){
					// 	login_page.sign_in(params.teacher1.email, params.password)
					// })
				})
			})
		})
		// it("should logout",function(){
		// 	header.logout()
		// })
	})
})

// describe('First Module Progress Page', function(){
// 	describe('First lecture',function(){
// 		it('should display quiz statistics correct',function(){})
// 		it('should have correct discussion titles and content',function(){})
// 		it('should have correct confused titles',function(){
// 			progress.checkConfusedTitle(0,0,modules_items['New Module'])
// 		})
// 		it('should be able to show quiz inclass and have correct time estimate',function(){})
// 		it('should be able to show disussion inclass and have correct time estimate',function(){})
// 		it('should be able to show video quizzes and disussion inclass and have correct time estimate',function(){})
// 		it('should be able to add a replay to discussion',function(){})
// 		it('should be able to delete discussion', function(){})
// 	})
// 	describe('Second Lecture',function(){
// 		it('should display correct quiz titles',function(){
// 			progress.checkInvideoQuizTitle(1,0,modules_items['New Module'], 100, 2)
// 			progress.checkInvideoQuizTitle(1,1,modules_items['New Module'], 50, 1)
// 			progress.checkInvideoQuizTitle(1,2,modules_items['New Module'], 0, 0)
// 		})
// 		it('should display quiz statistics correct',function(){
// 			progress.checkQuizChart(1,0,1,1)
// 			progress.checkQuizChart(1,1,4,1)
// 			progress.checkQuizChart(1,2,1,1)
// 			ptor.navigate().refresh();
// 			progress.checkQuizChart(1,0,5,1)
// 			progress.checkQuizChart(1,1,2,1)
// 			progress.checkQuizChart(1,2,2,1)
// 			ptor.navigate().refresh();
// 			progress.checkQuizChart(1,0,3,1)
// 			progress.checkQuizChart(1,2,3,1)
// 		})
// 		it('should have correct discussion titles and content',function(){
// 			progress.checkDiscussionTitle(1,0,modules_items['New Module'])
// 			progress.checkDiscussionContent(1,0,modules_items['New Module'])
// 		})
// 		it('should have correct confused titles',function(){
// 			progress.checkConfusedTitle(1,0,modules_items['New Module'])
// 		})
// 		it('should be able to show quiz inclass and have correct time estimate',function(){
// 			progress.checkTimeEstimate(0)
// 			progress.showVideoQuizInclass(1,0)
// 			progress.checkTimeEstimate(3)
// 			progress.showVideoQuizInclass(1,1)
// 			progress.checkTimeEstimate(6)
// 			progress.showVideoQuizInclass(1,2)
// 			progress.checkTimeEstimate(9)
// 			progress.hideVideoQuizInclass(1,0)
// 			progress.checkTimeEstimate(6)
// 			progress.hideVideoQuizInclass(1,1)
// 			progress.checkTimeEstimate(3)
// 			progress.hideVideoQuizInclass(1,2)
// 			progress.checkTimeEstimate(0)
// 		})
// 		it('should be able to show disussion inclass and have correct time estimate',function(){
// 			progress.checkTimeEstimate(0)
// 			progress.showDiscussionInclass(1,0)
// 			progress.checkTimeEstimate(2)
// 			progress.hideDiscussionInclass(1,0)
// 			progress.checkTimeEstimate(0)
// 		})
// 		it('should be able to show video quizzes and disussion inclass and have correct time estimate',function(){
// 			progress.checkTimeEstimate(0)
// 			progress.showDiscussionInclass(1,0)
// 			progress.checkTimeEstimate(2)
// 			progress.showVideoQuizInclass(1,0)
// 			progress.checkTimeEstimate(5)
// 			progress.hideDiscussionInclass(1,0)
// 			progress.checkTimeEstimate(3)
// 			progress.hideVideoQuizInclass(1,0)
// 			progress.checkTimeEstimate(0)
// 		})

// 		it('should be able to add a replay to discussion',function(){
// 			progress.checkDiscussionComment(1,0,0,comment0)
// 			progress.addReplyToDiscussion(1,0,comment1.title)
// 			progress.checkDiscussionComment(1,0,1,comment1)
// 			progress.addReplyToDiscussion(1,0,comment2.title)
// 			progress.checkDiscussionComment(1,0,2,comment2)
// 		})
// 		it('should be able to delete discussion', function(){
// 			progress.deleteDiscussionComment(1,0,1)
// 			progress.checkDiscussionComment(1,0,0,comment0)
// 			progress.checkDiscussionComment(1,0,1,comment2)
// 			progress.deleteDiscussionComment(1,0,1)
// 			progress.checkDiscussionComment(1,0,0,comment0)
// 		})
// 	})
// 	describe('Third Lecture',function(){
// 		it('should display correct quiz titles',function(){
// 			progress.checkInvideoSurveyTitle(2,0,modules_items['New Module'])
// 			progress.checkInvideoSurveyTitle(2,1,modules_items['New Module'])
// 		})
// 		it('should display quiz statistics correct',function(){
// 			progress.checkQuizChart(2,0,4,2)
// 			ptor.navigate().refresh();
// 			progress.checkQuizChart(2,0,5,1)
// 			progress.checkQuizChart(2,1,5,2)
// 		})
// 		it('should have correct confused titles',function(){
// 			progress.checkConfusedTitle(2,0,modules_items['New Module'])
// 		})
// 		it('should be able to show quiz inclass and have correct time estimate',function(){
// 			progress.checkTimeEstimate(0)
// 			progress.showVideoQuizInclass(2,0)
// 			progress.checkTimeEstimate(3)
// 			progress.showVideoQuizInclass(2,1)
// 			progress.checkTimeEstimate(6)
// 			progress.hideVideoQuizInclass(2,0)
// 			progress.checkTimeEstimate(3)
// 			progress.hideVideoQuizInclass(2,1)
// 			progress.checkTimeEstimate(0)
// 		})
// 	})
// 	describe('First Quiz',function(){
// 		it('should display correct quiz titles',function(){
// 			progress.checkQuizTitle(3,0,modules_items['New Module'])
// 			progress.checkQuizTitle(3,1,modules_items['New Module'])
// 			progress.checkQuizTitle(3,2,modules_items['New Module'])
// 		})
// 		it('should display quiz statistics correct',function(){
// 			progress.checkQuizChart(3,1,1,1)
// 			progress.checkQuizChart(3,2,1,1)
// 			ptor.navigate().refresh();
// 			progress.checkQuizChart(3,0,2,1)
// 			progress.checkQuizChart(3,2,2,1)
// 			ptor.navigate().refresh();
// 			progress.checkQuizChart(3,0,6,1)
// 			progress.checkQuizChart(3,2,3,1)
// 		})
// 		it('should have correct free text question title',function(){
// 			progress.checkQuizFreeTextTitle(3,0, modules_items['New Module'])
// 			progress.checkQuizFreeTextTitle(3,1, modules_items['New Module'])
// 		})
// 		it('should have correct free text content',function(){
// 			progress.checkQuizFreeTextAnswers(3,0, modules_items['New Module'])
// 			progress.checkQuizFreeTextGrades(3,0, modules_items['New Module'])
// 			progress.ChangeQuizFreeTextGrade(3,0,1,'Wrong')
// 			progress.ChangeQuizFreeTextGrade(3,0,0,'Under Review')
// 			progress.checkQuizFreeTextAnswers(3,1, modules_items['New Module'])
// 			progress.checkQuizFreeTextGrades(3,1, modules_items['New Module'])
// 			progress.ChangeQuizFreeTextGrade(3,1,2,'Partial')
// 			progress.ChangeQuizFreeTextGrade(3,1,3,'Good')
// 		})
// 	})
// 	describe('Second Quiz',function(){
// 		it('should display correct quiz titles',function(){
// 			progress.checkQuizTitle(4,0,modules_items['New Module'])
// 			progress.checkQuizTitle(4,1,modules_items['New Module'])
// 			progress.checkQuizTitle(4,2,modules_items['New Module'])
// 		})
// 		it('should display quiz statistics correct',function(){
// 			progress.checkQuizChart(4,0,1,2)
// 			progress.checkQuizChart(4,1,1,1)
// 			progress.checkQuizChart(4,2,1,2)
// 			ptor.navigate().refresh();
// 			progress.checkQuizChart(4,0,2,2)
// 			progress.checkQuizChart(4,1,5,1)
// 			progress.checkQuizChart(4,2,2,2)
// 			ptor.navigate().refresh();
// 			progress.checkQuizChart(4,2,3,2)
// 		})
// 		it('should have correct free text question title',function(){
// 			progress.checkQuizFreeTextTitle(4,0, modules_items['New Module'])
// 			progress.checkQuizFreeTextTitle(4,1, modules_items['New Module'])
// 		})
// 		it('should have correct free text content',function(){
// 			progress.checkQuizFreeTextAnswers(4,0, modules_items['New Module'])
// 			progress.checkQuizFreeTextGrades(4,0, modules_items['New Module'])
// 			progress.ChangeQuizFreeTextGrade(4,0,1,'Wrong')
// 			progress.ChangeQuizFreeTextGrade(4,0,0,'Under Review')
// 			progress.checkQuizFreeTextAnswers(4,1, modules_items['New Module'])
// 			progress.checkQuizFreeTextGrades(4,1, modules_items['New Module'])
// 		})
// 	})
// 	describe('First Survey',function(){
// 		it('should display correct survey titles',function(){
// 			progress.checkQuizTitle(5,0,modules_items['New Module'])
// 			progress.checkQuizTitle(5,1,modules_items['New Module'])
// 		})
// 		it('should display survey statistics correct',function(){
// 			progress.checkQuizChart(5,0,1,1)
// 			ptor.navigate().refresh();
// 			progress.checkQuizChart(5,0,2,1)
// 			progress.checkQuizChart(5,1,2,1)
// 		})
// 		it('should have correct free text question title',function(){
// 			progress.checkQuizFreeTextTitle(5,0, modules_items['New Module'])
// 		})
// 		it('should have correct free text content',function(){
// 			progress.checkQuizFreeTextAnswers(5,0, modules_items['New Module'])
// 		})
// 		it('should replay to free text question',function(){
// 			var reply_msg = "Reply to Free text question"
// 			progress.addReplyToFreeText(5,0, reply_msg)
// 			progress.checkReplyToFreeText(5,0, reply_msg)
// 			// o_c.scroll_to_bottom(ptor)
// 			// progress.deleteReplyToFreeText(5,0,0)
// 		})
// 	})

// })

// describe('Teacher', function(){
// 	it('should select the second module', function(){
// 		o_c.press_content_navigator(ptor)
//     	teacher.open_module(ptor, 2);
//     	o_c.press_content_navigator(ptor)
// 		o_c.open_progress(ptor)
// 		o_c.open_module_progress(ptor)
// 		o_c.hide_dropmenu(ptor)
// 	})
// })
// describe('Content Navigator Button', function(){
// 	it('should display the name of the module selected', function(){
// 		checkNameOnSelectorButton('New Module 2')
// 	})
// })
// // describe('Navigation Bullets', function(){
// // 	it('should have the same count as the items under the second module', function(){
// // 		verifyNumberOfBullets(6)
// // 	})
// // })

// describe('Second Module Progress Page', function(){
// 	it('should have a video container', function(){
// 		expect(element(by.className('videoborder')).isDisplayed()).toEqual(true)
// 	})
// 	it('should display the module progress chart showing that the one student not started watching', function(){
// 		progress.checkModuleProgressChart(1, 1)
// 	})
// 	it('should display headings for each item in the module with the item name, duration and number of questions and verify sub items count', function(){
// 		progress.verifyModuleTitlesAndCountOnTimeline(modules_items['New Module 2'])
// 	})

// 	describe('First lecture',function(){
// 		it('should display correct quiz titles',function(){
// 			progress.checkInvideoQuizTitle(0,0,modules_items['New Module 2'], 0, 0)
// 			progress.checkInvideoQuizTitle(0,1,modules_items['New Module 2'], 50 ,1)
// 			progress.checkInvideoQuizTitle(0,2,modules_items['New Module 2'], 0, 0)
// 		})
// 		it('should display quiz statistics correct',function(){
// 			progress.checkQuizChart(0,0,1,1)
// 			progress.checkQuizChart(0,1,4,1)
// 		})
// 		it('should be able to show quiz inclass and have correct time estimate',function(){
// 			progress.checkTimeEstimate(0)
// 			progress.showVideoQuizInclass(0,0)
// 			progress.checkTimeEstimate(3)
// 			progress.showVideoQuizInclass(0,1)
// 			progress.checkTimeEstimate(6)
// 			progress.showVideoQuizInclass(0,2)
// 			progress.checkTimeEstimate(9)
// 			progress.hideVideoQuizInclass(0,0)
// 			progress.checkTimeEstimate(6)
// 			progress.hideVideoQuizInclass(0,1)
// 			progress.checkTimeEstimate(3)
// 			progress.hideVideoQuizInclass(0,2)
// 			progress.checkTimeEstimate(0)
// 		})
// 	})
// 	describe('Second Lecture',function(){
// 		it('should display correct quiz titles',function(){
// 			progress.checkInvideoQuizTitle(1,0,modules_items['New Module 2'], 0, 0)
// 			progress.checkInvideoQuizTitle(1,1,modules_items['New Module 2'], 0, 0)
// 			progress.checkInvideoQuizTitle(1,2,modules_items['New Module 2'], 0, 0)
// 		})
// 		it('should be able to show quiz inclass and have correct time estimate',function(){
// 			progress.checkTimeEstimate(0)
// 			progress.showVideoQuizInclass(1,0)
// 			progress.checkTimeEstimate(3)
// 			progress.showVideoQuizInclass(1,1)
// 			progress.checkTimeEstimate(6)
// 			progress.showVideoQuizInclass(1,2)
// 			progress.checkTimeEstimate(9)
// 			progress.hideVideoQuizInclass(1,0)
// 			progress.checkTimeEstimate(6)
// 			progress.hideVideoQuizInclass(1,1)
// 			progress.checkTimeEstimate(3)
// 			progress.hideVideoQuizInclass(1,2)
// 			progress.checkTimeEstimate(0)
// 		})
// 	})
// 	describe('Third Lecture',function(){
// 		it('should display correct quiz titles',function(){
// 			progress.checkInvideoSurveyTitle(2,0,modules_items['New Module 2'])
// 			progress.checkInvideoSurveyTitle(2,1,modules_items['New Module 2'])
// 		})
// 		it('should display quiz statistics correct',function(){
// 			progress.checkQuizChart(2,0,6,1)
// 			progress.checkQuizChart(2,1,4,1)
// 		})
// 		it('should be able to show quiz inclass and have correct time estimate',function(){
// 			progress.checkTimeEstimate(0)
// 			progress.showVideoQuizInclass(2,0)
// 			progress.checkTimeEstimate(3)
// 			progress.showVideoQuizInclass(2,1)
// 			progress.checkTimeEstimate(6)
// 			progress.hideVideoQuizInclass(2,0)
// 			progress.checkTimeEstimate(3)
// 			progress.hideVideoQuizInclass(2,1)
// 			progress.checkTimeEstimate(0)
// 		})
// 	})
// 	describe('First Quiz',function(){
// 		it('should display correct quiz titles',function(){
// 			progress.checkQuizTitle(3,0,modules_items['New Module 2'])
// 			progress.checkQuizTitle(3,1,modules_items['New Module 2'])
// 			progress.checkQuizTitle(3,2,modules_items['New Module 2'])
// 		})
// 		it('should have correct free text question title',function(){
// 			progress.checkQuizFreeTextTitle(3,0, modules_items['New Module 2'])
// 			progress.checkQuizFreeTextTitle(3,1, modules_items['New Module 2'])
// 		})
// 	})
// 	describe('Second Quiz',function(){
// 		it('should display correct quiz titles',function(){
// 			progress.checkQuizTitle(4,0,modules_items['New Module 2'])
// 			progress.checkQuizTitle(4,1,modules_items['New Module 2'])
// 			progress.checkQuizTitle(4,2,modules_items['New Module 2'])
// 		})
// 		it('should have correct free text question title',function(){
// 			progress.checkQuizFreeTextTitle(4,0, modules_items['New Module 2'])
// 			progress.checkQuizFreeTextTitle(4,1, modules_items['New Module 2'])
// 		})
// 	})
// 	describe('First Survey',function(){
// 		it('should display correct survey titles',function(){
// 			progress.checkQuizTitle(5,0,modules_items['New Module 2'])
// 			progress.checkQuizTitle(5,1,modules_items['New Module 2'])
// 		})
// 		it('should have correct free text question title',function(){
// 			progress.checkQuizFreeTextTitle(5,0, modules_items['New Module 2'])
// 		})
// 	})

// })

// function checkNameOnSelectorButton(name){
// 	expect(element(by.id('content_navigator')).getText()).toEqual(params.short_name+': '+name)
// }

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
