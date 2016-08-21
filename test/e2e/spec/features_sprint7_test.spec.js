var Header = require('./pages/header');
var Login = require('./pages/login');
var Signup = require('./pages/sign_up');
var GuerrillaMail = require('./pages/guerrilla_mail');
var CourseEditor = require('./pages/course_editor');
var ContentNavigator = require('./pages/content_navigator');
var CourseInformation = require('./pages/course_information');
var CourseList = require('./pages/course_list');
var StudentLecture = require('./pages/student/lecture');
var ShareModal = require('./pages/share_modal');
var SharedPage = require('./pages/shared_page');
var NewCourse = require('./pages/new_course');
var scroll = require('./lib/utils').scroll;
var sleep = require('./lib/utils').sleep;
var Video = require('./pages/video');
var AccountInformation = require('./pages/account_information');
var StudentList = require('./pages/teacher/student_list');
var params = browser.params;

var header = new Header()
var login_page = new Login()
var signup_page = new Signup()
var guerrilla_mail_page = new GuerrillaMail()
var course_editor = new CourseEditor()
var course_info = new CourseInformation()
var course_list = new CourseList()
var student_lec = new StudentLecture()
var share_window = new ShareModal()
var shared = new SharedPage()
var new_course = new NewCourse()
var video = new Video();
var	info = new AccountInformation();
var student_list = new StudentList();
// SCAL-876 Account info: Delete Account ubtton should be
xdescribe("Delete Account button",function(){
	it("should login",function(){
        login_page.sign_in(params.teacher1.email, params.password)
   })
    it("should delete teacher account",function(){
        header.open_account_information()
		element(by.css('[ng-click="confirmDelete()"]')).click()
        element(by.css('h3')).getText().then(function (text) { expect(text).toEqual("Are you sure you want to delete your account?") });
        expect(element(by.id('del_ok_btn')).getAttribute('value')).toEqual("Delete my account")
		element(by.css('[ng-click="cancel()"]')).click()

    })
    it("should logout", function() {
      header.logout()
    })
})
// SCAL-1017: Add email address to after-registration page frontend: check on email in users/thanks
// SCAL-571 At first login we should show the privacy policy and require students to click "I understand"	check on I understand when new user confirm
xdescribe("Add User ",function(){
	describe("Sign up Teacher 1",function(){
		describe("guerrillamail",function(){
			it("should sign up as teacher",function(){
				console.log(params.teacher3.email)
				signup_page.sign_up('teacher')
				signup_page.create(params.teacher3.email, params.guerrillamail_password , params.guerrillamail_sch_uni_name , '1' , params.teacher_first_name ,params.teacher3.email)
			})
			it("should check url thanks pages",function(){
				sleep(6000)
				expect(browser.driver.getCurrentUrl()).toContain('thanks')
		        element(by.css('h5 b')).getText().then(function (text) { expect(text).toEqual(params.teacher3.email) });

			})
			it("should open guerrillamail website",function(){
				browser.actions().sendKeys(protractor.Key.chord(protractor.Key.CONTROL, "n")).perform();
				browser.getAllWindowHandles().then(function (handles) {
				var secondWindowHandle = handles[1];
				var firstWindowHandle = handles[0];

				browser.switchTo().window(secondWindowHandle)
					.then(function () {
				    	guerrilla_mail_page.open_url(params.guerrillamail_url)
					})
				});
			})
			it("should change guerrillamail email ",function(){
				guerrilla_mail_page.change_mail_name(params.teacher3.email)
				sleep(60000)
			})
			it("should check mails count ",function(){
				 guerrilla_mail_page.count_row().then(function(coun){expect(coun).toEqual(2)})
			})
			it("should open the last mail ",function(){
				 sleep(10000)
				 guerrilla_mail_page.open_last_mail()
				 sleep(6000)
			})
			describe("Guerrilla website tab ",function(){
				it("should confirm the mail",function(){
					guerrilla_mail_page.confirm_email()
					sleep(22000)
					browser.getAllWindowHandles().then(function (handles) {
						var thridWindowHandle = handles[2];
						var secondWindowHandle = handles[1];
						var firstWindowHandle = handles[0];
						browser.switchTo().window(firstWindowHandle)
						.then(function () {
							guerrilla_mail_page.open_url(params.frontend)
							sleep(5000)
							browser.switchTo().window(thridWindowHandle) })
						.then(function () {
							browser.close(); //close the current browser
						}).then(function(){
							browser.switchTo().window(firstWindowHandle) //Switch to previous tab
							.then(function(){
								browser.ignoreSynchronization = false;
								sleep(1000)
							});
						});
					})
				})
			})
			it("should check course information page ",function(){
				sleep(3000)
			    signup_page.skip_button()
				sleep(5000)
				expect(browser.driver.getCurrentUrl()).toContain('courses')
			})
			it("should logout",function(){
	            header.logout()
	        })
	    })
	})
	describe("guerrillamail teacher 1",function(){
		it("should login",function(){
            login_page.sign_in(params.teacher3.email, params.guerrillamail_password)
       })
		it("should check that course has been removed",function(){
        	course_list.open()
        	expect(course_list.courses.count()).toEqual(0)
        })
		it("should delete teacher account",function(){
            header.open_account_information()
            header.delete_user(params.guerrillamail_password)
        })
	})
})

// SCAL-1309: Videos should stay at the end and not go back to the beginning
// SCAL-1023:Add course view controls at bottom of All Courses page
// SCAL-878: Feedback form should not show "course" if not in a course
xdescribe("Videos should stay at the end",function(){
	describe("student",function(){
		it("should login", function(){
			login_page.sign_in(params.student1.email, params.password)
		})
		var navigator = new ContentNavigator(1)
		it('check course view controls appears all the time', function(){
			course_list.open()
			expect(element.all(by.model('searchText')).isDisplayed()).toEqual([ true ]);
			browser.executeScript('$("body").scrollTop(1000);') //Note that your code is represented as a String here!         
			expect(element.all(by.model('searchText')).isDisplayed()).toEqual([ true ]);
		})
		it('check feedback doesnot show course in options', function(){
			header.open_support()
			element(by.css('[ng-model="selected_type"]')).all(by.tagName('option')).count().then(function(result){expect(result).toEqual(1)} )
			header.close_support()
		})

		it('should open first course', function(){
			course_list.open_student_course(1)
		})
		it('check feedback does show course in options', function(){
			header.open_support()
			element(by.css('[ng-model="selected_type"]')).all(by.tagName('option')).count().then(function(result){expect(result).toEqual(2)} )
			header.close_support()
		})

		xit("should open first module",function(){
			navigator.module(1).open()
			navigator.close()
		})
		xit('should watch video and pass by all milestones 100 %', function(){
			video.play()
		  	video.seek(99);
	        student_lec.wait_for_video_end()
	        video.current_time.then(function(result){expect(result).toEqual("0:04:46")} )
	        video.current_time.then(function(result){expect(result).not.toEqual("0:00:00")} )
		})	
		it("should logout",function(){
            header.logout()
        })

	})
})

// SCAL-1154: Allow users to pick first day of the week for calendar
xdescribe("Pick first day of the week for Calendar",function(){
	it("should login",function(){
        login_page.sign_in(params.teacher1.email, params.password)
   })
    it("should change first day to Sat",function(){
        header.open_account_information()
        info.choose_first_day(6)
        info.save(params.password)
        header.open_dashboard()
        $('tr th').getText().then(function (text) { expect(text).toEqual("Sat") });
    })
    it("should change first day to Sun",function(){
        header.open_account_information()
        info.choose_first_day(0)
        info.save(params.password)
        header.open_dashboard()
        $('tr th').getText().then(function (text) { expect(text).toEqual("Sun") });
    })
    it("should logout", function() {
      header.logout()
    })
})

// SCAL-1283: Export student list	
xdescribe("Export student list",function(){
	describe("teacher ",function(){		
		it("should login",function(){
		    login_page.sign_in(params.teacher1.email, params.password)
		})
		it('should open student list', function(){
			course_list.open()
			course_list.open_teacher_course(1)
			student_list.open()
		})

		it('check export student message appears', function(){
			student_list.click_export_student_list()
			expect(student_list.export_student_list_message.isDisplayed()).toBe(true);
		})
		it('check export student message does not appear', function(){
			sleep(7000)
			expect(student_list.export_student_list_message.isDisplayed()).toBe(false);
		})
		it("should logout", function() {
		  header.logout()
		})
    })
})


// SCAL-1332: Export course clarification	frontend: check on button “Export anonymized course data” and when clicked “"Your anonymized course data will be emailed to you shortly.” appears 
xdescribe("Export course clarification",function(){
	describe("teacher ",function(){		
		it("should login",function(){
		    login_page.sign_in(params.teacher1.email, params.password)
		})
		it('should open student list', function(){
			course_list.open()
			course_list.open_teacher_course(1)
			course_info.open()
		})

		it('check export student message appears', function(){
			course_info.click_export_anonymized_data()
			expect(course_info.export_anonymized_data_message.isDisplayed()).toBe(true);
		})
		it('check export student message does not appear', function(){
			sleep(7000)
			expect(course_info.export_anonymized_data_message.isDisplayed()).toBe(false);
		})
		it("should logout", function() {
		  header.logout()
		})
    })
})

//SCAL-1282: Enable/disable registration
//SCAL-967:Need an "add course URL"
describe("Need an 'add course URL' and  Enable/disable registration",function(){
	describe("teacher ",function(){		
		it("should login",function(){
		    login_page.sign_in(params.teacher1.email, params.password)
		})
		it('should open student list', function(){
			course_list.open()
			course_list.open_teacher_course(1)
			student_list.open()
		})

		it('should removed student from course', function(){
			student_list.click_remove_student()
			expect(student_list.student_delete_button.count()).toEqual(3)
			student_list.delete_student(0)
			// expect(student_list.export_student_list_message.isDisplayed()).toBe(true);
		})
		it('should open student list', function(){
			// course_list.open()
			// course_list.open_teacher_course(1)
			// course_info.open()
		})

		it('should disable registration', function(){
			// course_info.click_export_anonymized_data()
			// expect(course_info.export_anonymized_data_message.isDisplayed()).toBe(true);
		})
		
		it('should copy url link to params', function(){
			// course_info.click_export_anonymized_data()
			// expect(course_info.export_anonymized_data_message.isDisplayed()).toBe(true);
		})

		it("should logout", function() {
		  header.logout()
		})
    })
})

