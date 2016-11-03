var ContentNavigator = require('./pages/content_navigator');
var CourseEditor = require('./pages/course_editor');
var CourseList = require('./pages/course_list');
var InvideoQuiz = require('./pages/invideo_quiz');
var NormalQuiz = require('./pages/normal_quiz');
var Video = require('./pages/video');
var utils = require('./lib/utils');
var sleep = require('./lib/utils').sleep;
var Login = require('./pages/login');
var Header = require('./pages/header');
var SubHeader = require('./pages/sub_header');
var ContentItems = require('./pages/content_items');
var StudentDistancePeer = require('./pages/student/inclass_dp');
var scroll_top = require('./lib/utils').scroll_top;

var params = browser.params;
var header = new Header()
var sub_header = new SubHeader()
var course_editor = new CourseEditor()
var login_page = new Login()
var course_list = new CourseList()
var video = new Video();
var invideo_quiz = new InvideoQuiz();
var quiz = new NormalQuiz();
var content_items = new ContentItems()
var navigator = new ContentNavigator(1)
var student_page = new StudentDistancePeer()

var d_q3_y = 190;

var student_browser;
var student2_browser;
var module_count;


describe('Distance Peer',function(){
  student_browser = browser
  student2_browser = utils.new_session()

  describe('Student 1', function(){
    it('Should login and open module', function(){
      login_page.sign_in(params.student1.email, params.password)
      course_list.open()
      course_list.open_student_course(2)
      navigator.module(1).item(1).open()
    })

    it('Invite Modal should show up', function(){
      browser.driver.wait(function() {
          return element(by.css("[ng-show='invite_student']")).isPresent().then(function(present){
            return present
          })
        });
      expect(student_page.student_invite_btns.isDisplayed()).toBe(true)
      expect(student_page.student_invite_btns.count()).toEqual(2)
      expect(student_page.close_invite_btn.isDisplayed()).toBe(true)
      expect(student_page.invite_title).toContain('Invite a student')
    })

    it('Should invite Student 2', function(){
      student_page.invite_student(1)
      expect(student_page.wait_title).toBe('Wait For Acceptance')
      expect(student_page.invited_student.getText()).toContain('student2')
      expect(student_page.invite_wait_btn.isDisplayed()).toBe(true)
      expect(student_page.close_wait_btn.isDisplayed()).toBe(true)

    })
  })


  describe('Student 2', function(){
    it('Should login and open Module', function(){
      utils.switch_browser(student2_browser)
      login_page.sign_in(params.student2.email, params.password)
      course_list.open()
      course_list.open_student_course(2)
      navigator.module(1).item(1).open()
    })

    it('Should See he\'s invited and cancel invitation', function(){
      browser.driver.wait(function() {
          return element(by.css("[ng-show='check_if_invited']")).isPresent().then(function(present){
            return present
          })
        });
      expect(student_page.if_invited_title).totoBe('You are invited by')
      expect(student_page.got_invited_by(1).getText()).toContain('student1')
      expect(student_page.invite_if_Invited_btn.isDisplayed()).toBe(true)
      expect(student_page.close_if_Invited_btn.isDisplayed()).toBe(true)

      student_page.close_if_Invited_btn.click()
    })

    it('Should be back to lecture', function(){
      
    })

  })


  describe('Student 1', function(){
    it('Should know student2 refused invitation', function(){
      utils.switch_browser(browser)
    })

    it('Should invite student2 again', function(){
      student_page.start_dp_btn.click()
      expect(student_page.students_btns.isDisplayed()).toBe(true)
      // expect(student_page.closeModal.isDisplayed()).toBe(true)
      student_page.invite_student(1)
    })
  })

  describe('Student 2', function(){

    it('Should accept student1 invitation', function(){
      utils.switch_browser(student2_browser)
    })

    it('Should start the video', function(){
      video.play()

    })

    it('Should try and seek past quiz time', function(){

    })
  })

  describe('Student 1', function(){
    it('Should be able to start session', function(){
      utils.switch_browser(browser)
    })

    it('Should start the session', function(){
      video.play()

    })

    it('Should try and seek past quiz time', function(){

    })

  })


  describe('Student 2', function(){
    it('Should be at quiz start', function(){
      utils.switch_browser(student2_browser)

    })

    it('Should try and continue the session', function(){

    })

  })


  describe('Student 1', function(){
    it('Should be at quiz start', function(){
      utils.switch_browser(browser)

    })

    it('Should start the intro', function(){

    })

    it('Should try and seek past quiz time', function(){

    })
  })


  describe('Student 2', function(){
    it('Should start the Intro', function(){
      utils.switch_browser(student2_browser)
    })

    it('Should try and seek past quiz time', function(){

    })

  })


  describe('Student 1', function(){
    it('Should reach Self quiz', function(){
      utils.switch_browser(browser)

    })

    it('Should try to resume the session', function(){

    })

  })

  describe('Student 2', function(){
    it('Should reach Self quiz', function(){
      utils.switch_browser(student2_browser)

      browser.driver.wait(function() {
          return element(by.className("play")).isPresent().then(function(present){
            return present
          })
        });

    })
  })

  describe('Student 1', function(){

  })
  describe('Student 2', function(){

  })
  describe('Student 1', function(){

  })
  describe('Student 2', function(){

  })
  describe('Student 1', function(){

  })
  describe('Student 1', function(){

  })
  describe('Student 1', function(){

  })

})
