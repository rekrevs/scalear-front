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
var Inclass = require('./pages/teacher/inclass');
var StudentInclass = require('./pages/student/inclass');
var InclassReviewModel = require('./pages/teacher/inclass_review_model');
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
var inclass_page = new Inclass()
var student_inclass_page = new StudentInclass()
var review_model = new InclassReviewModel

var d_q3_y = 190;

var teacher_browser ;
var student_browser;
var student2_browser;
var module_count;

describe("PI Inclass", function() {
teacher_browser = browser
student_browser = utils.new_session()
student2_browser = utils.new_session()

  describe('Teacher', function(){

    it("should login", function() {
      login_page.sign_in(params.teacher1.email, params.password)
    })

    it("should open course", function() {
      course_list.open()
      course_list.open_teacher_course(2)
    })

    it("should go to inclass mode", function() {
      sub_header.open_inclass_mode()
    })

    it("should open first lecture in pi module", function() {
      navigator.modules.count().then(function(count) {
        module_count = count
        navigator.module(module_count).open()
      })
    })

    it("should check correct inclass review content", function() {
      expect(inclass_page.title).toEqual("In-class Review: PI module 1")
      expect(inclass_page.display_button.isDisplayed()).toEqual(true);
      expect(inclass_page.display_button.isEnabled()).toEqual(true);
      var module = inclass_page.module_item(1)
      expect(module.title).toEqual("PI lecture1 video quizzes")
      expect(module.inclass_quizzes.count()).toEqual(1)
      var inclass_quiz = module.inclass_quiz(1)
      expect(inclass_quiz.title).toEqual("Quiz: PI MCQ QUIZ")
      expect(inclass_quiz.visibility_box.isSelected()).toEqual(true)
    })

    it("should check correct inclass time estimate", function() {
      expect(inclass_page.total_inclass_time).toEqual("8");
      expect(inclass_page.total_pi_time).toEqual("8")
      expect(inclass_page.total_pi_quizzes).toEqual("1")
      expect(inclass_page.total_review_time).toEqual("0")
      expect(inclass_page.total_review_quizzes).toEqual("0")
      expect(inclass_page.total_review_discussions).toEqual("0")
      expect(inclass_page.total_review_surveys).toEqual("0")
    })

  })
  describe('Student 1 go inClass', function(){
    it("should go to student mode",function(){
      utils.switch_browser(student_browser)
      login_page.sign_in(params.student1.email, params.password)
      course_list.open()
      course_list.open_student_course(2)
    })

    it("should open student inclass",function(){
      var module = navigator.module(module_count)
      // var module = navigator.module(1)
      module.open()
      module.open_student_inclass()
      sleep(6000)
    })


    it("should have correct student inclass content",function(){
      expect(student_inclass_page.title).toEqual("PI module 1")
      expect(student_inclass_page.get_block_text(1)).toEqual("Intro")
      expect(student_inclass_page.get_block_text(2)).toEqual("Self")
      expect(student_inclass_page.get_block_text(3)).toEqual("Group")
      expect(student_inclass_page.get_block_text(4)).toEqual("Discussion")
    })


    it("should show no class running",function(){
      expect(student_inclass_page.noclass.isDisplayed()).toEqual(true)
      expect(student_inclass_page.noclass.getText()).toContain("The in-class session has not started")
      expect(student_inclass_page.noclass.getText()).toContain("Please try again later or click on the 'Refresh' button below")
      expect(student_inclass_page.refresh_button.isDisplayed()).toEqual(true)
    })
    it("should try to go to next stage student inclass",function(){
      student_inclass_page.refresh()

      expect(student_inclass_page.title).toEqual("PI module 1")
      expect(student_inclass_page.noclass.isDisplayed()).toEqual(true)
      expect(student_inclass_page.noclass.getText()).toContain("The in-class session has not started")
      expect(student_inclass_page.noclass.getText()).toContain("Please try again later or click on the 'Refresh' button below")
      expect(student_inclass_page.refresh_button.isDisplayed()).toEqual(true)
    })

  })

  describe('Student 2 go inClass', function(){
    it("should go to student mode",function(){
      utils.switch_browser(student2_browser)
      login_page.sign_in(params.student2.email, params.password)
      course_list.open()
      course_list.open_student_course(2)
    })

    it("should open student inclass",function(){
      var module = navigator.module(module_count)
      // var module = navigator.module(1)
      module.open()
      module.open_student_inclass()
      sleep(6000)
    })


    it("should have correct student inclass content",function(){
      expect(student_inclass_page.title).toEqual("PI module 1")
      expect(student_inclass_page.get_block_text(1)).toEqual("Intro")
      expect(student_inclass_page.get_block_text(2)).toEqual("Self")
      expect(student_inclass_page.get_block_text(3)).toEqual("Group")
      expect(student_inclass_page.get_block_text(4)).toEqual("Discussion")
    })


    it("should show no class running",function(){
      expect(student_inclass_page.noclass.isDisplayed()).toEqual(true)
      expect(student_inclass_page.noclass.getText()).toContain("The in-class session has not started")
      expect(student_inclass_page.noclass.getText()).toContain("Please try again later or click on the 'Refresh' button below")
      expect(student_inclass_page.refresh_button.isDisplayed()).toEqual(true)
    })
    it("should try to go to next stage student inclass",function(){
      student_inclass_page.refresh()

      expect(student_inclass_page.title).toEqual("PI module 1")
      expect(student_inclass_page.noclass.isDisplayed()).toEqual(true)
      expect(student_inclass_page.noclass.getText()).toContain("The in-class session has not started")
      expect(student_inclass_page.noclass.getText()).toContain("Please try again later or click on the 'Refresh' button below")
      expect(student_inclass_page.refresh_button.isDisplayed()).toEqual(true)
    })

  })

  describe('Teacher start inClass', function(){

    it('Should start in class review First Stage', function(){
      utils.switch_browser(teacher_browser)
      inclass_page.start_inclass_review();
      expect(review_model.review_model.isDisplayed()).toEqual(true)
      expect(review_model.lecture_title.getText()).toEqual("PI lecture1 video quizzes")
      expect(review_model.question_block.isDisplayed()).toEqual(true)
      expect(review_model.quiz_title.getText()).toBe("PI MCQ QUIZ ( multiple choice )")
      expect(review_model.get_block(1).getAttribute('class')).toContain("active")
      expect(review_model.get_block_text(1)).toEqual("Intro")
      expect(review_model.get_block_text(2)).toEqual("Self")
      expect(review_model.get_block_text(3)).toEqual("Group")
      expect(review_model.get_block_text(4)).toEqual("Discussion")
      expect(review_model.get_block_text(5)).toEqual("")
      expect(review_model.get_block(5).getAttribute('class')).toContain("small_circles")
      expect(review_model.connected_blocks.count()).toEqual(5)
      expect(review_model.chart.isDisplayed()).toEqual(false)
      expect(review_model.next_button.isDisplayed()).toEqual(true)
      expect(review_model.prev_button.isDisplayed()).toEqual(true)
      expect(review_model.exit_button.isDisplayed()).toEqual(true)


      // expect(review_model.review_model.isDisplayed()).toEqual(true)
    })
  })

  describe('Student 1 go to intro', function(){

    it("should go to next stage",function(){
      utils.switch_browser(student_browser)
      student_inclass_page.refresh()
    })

    it("should show student inclass intro",function(){
      expect(student_inclass_page.noclass.isDisplayed()).toEqual(false)
      expect(student_inclass_page.intro.isDisplayed()).toEqual(true)
      expect(student_inclass_page.get_block(1).getAttribute('class')).toContain("active")
      expect(student_inclass_page.intro.getText()).toContain("The in-class question has not started")
      expect(student_inclass_page.intro.getText()).toContain("Click on 'Next' when the question shows up")
      expect(student_inclass_page.intro_next_button.isDisplayed()).toEqual(true)
    })

    it("should try to go to next stage student inclass",function(){
      student_inclass_page.intro_next()
      expect(student_inclass_page.noclass.isDisplayed()).toEqual(false)
      expect(student_inclass_page.intro.isDisplayed()).toEqual(true)
      expect(student_inclass_page.get_block(1).getAttribute('class')).toContain("active")
      expect(student_inclass_page.intro.getText()).toContain("The in-class question has not started")
      expect(student_inclass_page.intro.getText()).toContain("Click on 'Next' when the question shows up")
      expect(student_inclass_page.intro_next_button.isDisplayed()).toEqual(true)
    })
  })

  describe('Student 2 go to intro', function(){

    it("should go to next stage",function(){
      utils.switch_browser(student2_browser)
      student_inclass_page.refresh()
    })

    it("should show student inclass intro",function(){
      expect(student_inclass_page.noclass.isDisplayed()).toEqual(false)
      expect(student_inclass_page.intro.isDisplayed()).toEqual(true)
      expect(student_inclass_page.get_block(1).getAttribute('class')).toContain("active")
      expect(student_inclass_page.intro.getText()).toContain("The in-class question has not started")
      expect(student_inclass_page.intro.getText()).toContain("Click on 'Next' when the question shows up")
      expect(student_inclass_page.intro_next_button.isDisplayed()).toEqual(true)
    })

    it("should try to go to next stage student inclass",function(){
      student_inclass_page.intro_next()
      expect(student_inclass_page.noclass.isDisplayed()).toEqual(false)
      expect(student_inclass_page.intro.isDisplayed()).toEqual(true)
      expect(student_inclass_page.get_block(1).getAttribute('class')).toContain("active")
      expect(student_inclass_page.intro.getText()).toContain("The in-class question has not started")
      expect(student_inclass_page.intro.getText()).toContain("Click on 'Next' when the question shows up")
      expect(student_inclass_page.intro_next_button.isDisplayed()).toEqual(true)
    })
  })

  describe('Teacher start Self stage', function(){


    it('Should go to the Self Stage', function(){
      utils.switch_browser(teacher_browser)
      review_model.next()
      expect(review_model.review_model.isDisplayed()).toEqual(true)
      expect(review_model.lecture_title.getText()).toEqual("PI lecture1 video quizzes")
      expect(review_model.question_block.isDisplayed()).toEqual(true)
      expect(review_model.quiz_title.getText()).toBe("PI MCQ QUIZ ( multiple choice )")

      expect(review_model.get_block(2).getAttribute('class')).toContain("active")
      // expect(element(by.className('active')).getText()).toContain('Self')
      expect(review_model.get_block_text(1)).toEqual("Intro")
      expect(review_model.get_block_text(2)).toEqual("Self")
      expect(review_model.get_block_text(3)).toEqual("Group")
      expect(review_model.get_block_text(4)).toEqual("Discussion")
      expect(review_model.get_block_text(5)).toEqual("")
      expect(review_model.get_block(5).getAttribute('class')).toContain("small_circles")
      expect(review_model.connected_blocks.count()).toEqual(5)
      expect(review_model.chart.isDisplayed()).toEqual(false)
      expect(review_model.next_button.isDisplayed()).toEqual(true)
      expect(review_model.prev_button.isDisplayed()).toEqual(true)
      expect(review_model.exit_button.isDisplayed()).toEqual(true)
    })

  })
  describe('Student  1 solve Self Qs', function(){

    it("should go to next stage",function(){
      utils.switch_browser(student_browser)
      student_inclass_page.intro_next()
    })

    it("should show the self question choices", function(){
      expect(student_inclass_page.noclass.isDisplayed()).toEqual(false)
      expect(student_inclass_page.intro.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self.isDisplayed()).toEqual(true)
      expect(student_inclass_page.self_note.isDisplayed()).toEqual(true)
      expect(student_inclass_page.get_block(2).getAttribute('class')).toContain("active")
      expect(student_inclass_page.self_choices.count()).toEqual(3)
      expect(student_inclass_page.self_choice(1).getText()).toContain("Answer 1")
      expect(student_inclass_page.self_choice(2).getText()).toContain("Answer 2")
      expect(student_inclass_page.self_choice(3).getText()).toContain("Answer 3")
      expect(student_inclass_page.self_vote_button.isDisplayed()).toEqual(true)
      expect(student_inclass_page.alert_box.isDisplayed()).toEqual(false)
    })

    it("should vote without selecting any choice",function(){
      student_inclass_page.self_vote()
      expect(student_inclass_page.noclass.isDisplayed()).toEqual(false)
      expect(student_inclass_page.intro.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self.isDisplayed()).toEqual(true)
      expect(student_inclass_page.self_note.isDisplayed()).toEqual(true)
      expect(student_inclass_page.get_block(2).getAttribute('class')).toContain("active")
      expect(student_inclass_page.alert_box.isDisplayed()).toEqual(true)
      expect(student_inclass_page.alert_box.getText()).toContain("Please choose your answer")

      expect(student_inclass_page.self_choices.count()).toEqual(3)
      expect(student_inclass_page.self_choice(1).getText()).toContain("Answer 1")
      expect(student_inclass_page.self_choice(2).getText()).toContain("Answer 2")
      expect(student_inclass_page.self_choice(3).getText()).toContain("Answer 3")
      expect(student_inclass_page.self_vote_button.isDisplayed()).toEqual(true)

      // expect(student_inclass_page.self_retry_btn.isDisplayed()).toEqual(true)
      // expect(student_inclass_page.self_next_btn.isDisplayed()).toEqual(true)
      // student_inclass_page.self_next()
      // expect(student_inclass_page.self_wait_alert.isDisplayed()).toEqual(true)
      // expect(student_inclass_page.self_wait_alert.getText()).toContain("Please wait for the teacher to continue")
      // student_inclass_page.self_retry()

    })

    it("should select first and third choice",function(){
      expect(student_inclass_page.self_choice(1).getAttribute('class')).not.toContain("selected")
      expect(student_inclass_page.self_choice(2).getAttribute('class')).not.toContain("selected")
      expect(student_inclass_page.self_choice(3).getAttribute('class')).not.toContain("selected")
      student_inclass_page.self_choice(1).click()
      expect(student_inclass_page.self_choice(1).getAttribute('class')).toContain("selected")
      expect(student_inclass_page.self_choice(2).getAttribute('class')).not.toContain("selected")
      student_inclass_page.self_choice(3).click()
      expect(student_inclass_page.self_choice(3).getAttribute('class')).toContain("selected")
      expect(student_inclass_page.self_choice(2).getAttribute('class')).not.toContain("selected")
    })

    it("should check that selected answers remain after browser refresh",function(){
      browser.refresh()
      expect(student_inclass_page.noclass.isDisplayed()).toEqual(false)
      expect(student_inclass_page.intro.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self.isDisplayed()).toEqual(true)
      expect(student_inclass_page.self_note.isDisplayed()).toEqual(true)
      expect(student_inclass_page.get_block(2).getAttribute('class')).toContain("active")
      expect(student_inclass_page.self_choices.count()).toEqual(3)
      expect(student_inclass_page.self_choice(1).getText()).toContain("Answer 1")
      expect(student_inclass_page.self_choice(2).getText()).toContain("Answer 2")
      expect(student_inclass_page.self_choice(3).getText()).toContain("Answer 3")
      expect(student_inclass_page.self_vote_button.isDisplayed()).toEqual(true)
      expect(student_inclass_page.self_choice(1).getAttribute('class')).toContain("selected")
      expect(student_inclass_page.self_choice(2).getAttribute('class')).not.toContain("selected")
      expect(student_inclass_page.self_choice(3).getAttribute('class')).toContain("selected")
    })

    it("should vote for selected answer and check selected answers",function(){
      student_inclass_page.self_vote()
      expect(student_inclass_page.noclass.isDisplayed()).toEqual(false)
      expect(student_inclass_page.intro.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self_answered.isDisplayed()).toEqual(true)
      expect(student_inclass_page.get_block(2).getAttribute('class')).toContain("active")
      expect(student_inclass_page.self_selected_choices.count()).toEqual(3)
      expect(student_inclass_page.self_selected_choice(1).getText()).toContain("Answer 1")
      expect(student_inclass_page.self_selected_choice(2).isDisplayed()).toEqual(false)
      expect(student_inclass_page.self_selected_choice(3).getText()).toContain("Answer 3")
      expect(student_inclass_page.self_retry_btn.isDisplayed()).toEqual(true)
      expect(student_inclass_page.self_next_btn.isDisplayed()).toEqual(true)
    })

    it("should try to go to next stage in student inclass",function(){
      student_inclass_page.self_next()
      expect(student_inclass_page.self_wait_alert.isDisplayed()).toEqual(true)
      expect(student_inclass_page.self_wait_alert.getText()).toContain("Please wait for the teacher to continue")
    })

    it("should retry quiz student inclass",function(){
      student_inclass_page.self_retry()
      expect(student_inclass_page.noclass.isDisplayed()).toEqual(false)
      expect(student_inclass_page.intro.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self.isDisplayed()).toEqual(true)
      expect(student_inclass_page.self_note.isDisplayed()).toEqual(true)
      expect(student_inclass_page.get_block(2).getAttribute('class')).toContain("active")
      expect(student_inclass_page.self_choices.count()).toEqual(3)
      expect(student_inclass_page.self_choice(1).getText()).toContain("Answer 1")
      expect(student_inclass_page.self_choice(2).getText()).toContain("Answer 2")
      expect(student_inclass_page.self_choice(3).getText()).toContain("Answer 3")
      expect(student_inclass_page.self_vote_button.isDisplayed()).toEqual(true)
      expect(student_inclass_page.alert_box.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self_choice(1).getAttribute('class')).toContain("selected")
      expect(student_inclass_page.self_choice(2).getAttribute('class')).not.toContain("selected")
      expect(student_inclass_page.self_choice(3).getAttribute('class')).toContain("selected")
    })

    it("should change selected answer",function(){
      student_inclass_page.self_choice(1).click()
      student_inclass_page.self_choice(2).click()
      sleep(2000)
      expect(student_inclass_page.self_choice(1).getAttribute('class')).not.toContain("selected")
      expect(student_inclass_page.self_choice(2).getAttribute('class')).toContain("selected")
      expect(student_inclass_page.self_choice(3).getAttribute('class')).toContain("selected")
    })

    it("should vote with new selected answer and check selected answers",function(){
      student_inclass_page.self_vote()
      expect(student_inclass_page.noclass.isDisplayed()).toEqual(false)
      expect(student_inclass_page.intro.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self_answered.isDisplayed()).toEqual(true)
      expect(student_inclass_page.get_block(2).getAttribute('class')).toContain("active")

      expect(student_inclass_page.self_selected_choices.count()).toEqual(3)
      expect(student_inclass_page.self_selected_choice(1).isDisplayed()).toEqual(false)
      expect(student_inclass_page.self_selected_choice(2).getText()).toContain("Answer 2")
      expect(student_inclass_page.self_selected_choice(3).getText()).toContain("Answer 3")
      expect(student_inclass_page.self_retry_btn.isDisplayed()).toEqual(true)
      expect(student_inclass_page.self_next_btn.isDisplayed()).toEqual(true)
    })

    it("should try to go to next stage in student inclass",function(){
      student_inclass_page.self_next()
      expect(student_inclass_page.self_wait_alert.isDisplayed()).toEqual(true)
      expect(student_inclass_page.self_wait_alert.getText()).toContain("Please wait for the teacher to continue")
    })
  })

  describe('Student 2 solve Self Qs', function(){

    it("should go to next stage",function(){
      utils.switch_browser(student2_browser)
      student_inclass_page.intro_next()
    })

    it("should show the self question choices", function(){
      expect(student_inclass_page.noclass.isDisplayed()).toEqual(false)
      expect(student_inclass_page.intro.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self.isDisplayed()).toEqual(true)
      expect(student_inclass_page.self_note.isDisplayed()).toEqual(true)
      expect(student_inclass_page.get_block(2).getAttribute('class')).toContain("active")
      expect(student_inclass_page.self_choices.count()).toEqual(3)
      expect(student_inclass_page.self_choice(1).getText()).toContain("Answer 1")
      expect(student_inclass_page.self_choice(2).getText()).toContain("Answer 2")
      expect(student_inclass_page.self_choice(3).getText()).toContain("Answer 3")
      expect(student_inclass_page.self_vote_button.isDisplayed()).toEqual(true)
      expect(student_inclass_page.alert_box.isDisplayed()).toEqual(false)
    })

    it("should vote without selecting any choice",function(){
      student_inclass_page.self_vote()
      expect(student_inclass_page.noclass.isDisplayed()).toEqual(false)
      expect(student_inclass_page.intro.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self.isDisplayed()).toEqual(true)
      expect(student_inclass_page.self_note.isDisplayed()).toEqual(true)
      expect(student_inclass_page.get_block(2).getAttribute('class')).toContain("active")
      expect(student_inclass_page.alert_box.isDisplayed()).toEqual(true)
      expect(student_inclass_page.alert_box.getText()).toContain("Please choose your answer")

      expect(student_inclass_page.self_choices.count()).toEqual(3)
      expect(student_inclass_page.self_choice(1).getText()).toContain("Answer 1")
      expect(student_inclass_page.self_choice(2).getText()).toContain("Answer 2")
      expect(student_inclass_page.self_choice(3).getText()).toContain("Answer 3")
      expect(student_inclass_page.self_vote_button.isDisplayed()).toEqual(true)


      // expect(student_inclass_page.self_retry_btn.isDisplayed()).toEqual(true)
      // expect(student_inclass_page.self_next_btn.isDisplayed()).toEqual(true)
      // student_inclass_page.self_next()
      // expect(student_inclass_page.self_wait_alert.isDisplayed()).toEqual(true)
      // expect(student_inclass_page.self_wait_alert.getText()).toContain("Please wait for the teacher to continue")
      // student_inclass_page.self_retry()

    })

    it("should select first and third choice",function(){
      expect(student_inclass_page.self_choice(1).getAttribute('class')).not.toContain("selected")
      expect(student_inclass_page.self_choice(2).getAttribute('class')).not.toContain("selected")
      expect(student_inclass_page.self_choice(3).getAttribute('class')).not.toContain("selected")
      student_inclass_page.self_choice(1).click()
      expect(student_inclass_page.self_choice(1).getAttribute('class')).toContain("selected")
      expect(student_inclass_page.self_choice(2).getAttribute('class')).not.toContain("selected")
      student_inclass_page.self_choice(3).click()
      expect(student_inclass_page.self_choice(3).getAttribute('class')).toContain("selected")
      expect(student_inclass_page.self_choice(2).getAttribute('class')).not.toContain("selected")
    })

    it("should check that selected answers remain after browser refresh",function(){
      browser.refresh()
      expect(student_inclass_page.noclass.isDisplayed()).toEqual(false)
      expect(student_inclass_page.intro.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self.isDisplayed()).toEqual(true)
      expect(student_inclass_page.self_note.isDisplayed()).toEqual(true)
      expect(student_inclass_page.get_block(2).getAttribute('class')).toContain("active")
      expect(student_inclass_page.self_choices.count()).toEqual(3)
      expect(student_inclass_page.self_choice(1).getText()).toContain("Answer 1")
      expect(student_inclass_page.self_choice(2).getText()).toContain("Answer 2")
      expect(student_inclass_page.self_choice(3).getText()).toContain("Answer 3")
      expect(student_inclass_page.self_vote_button.isDisplayed()).toEqual(true)
      expect(student_inclass_page.self_choice(1).getAttribute('class')).toContain("selected")
      expect(student_inclass_page.self_choice(2).getAttribute('class')).not.toContain("selected")
      expect(student_inclass_page.self_choice(3).getAttribute('class')).toContain("selected")
    })

    it("should vote for selected answer and check selected answers",function(){
      student_inclass_page.self_vote()
      expect(student_inclass_page.noclass.isDisplayed()).toEqual(false)
      expect(student_inclass_page.intro.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self_answered.isDisplayed()).toEqual(true)
      expect(student_inclass_page.get_block(2).getAttribute('class')).toContain("active")
      expect(student_inclass_page.self_selected_choices.count()).toEqual(3)
      expect(student_inclass_page.self_selected_choice(1).getText()).toContain("Answer 1")
      expect(student_inclass_page.self_selected_choice(2).isDisplayed()).toEqual(false)
      expect(student_inclass_page.self_selected_choice(3).getText()).toContain("Answer 3")
      expect(student_inclass_page.self_retry_btn.isDisplayed()).toEqual(true)
      expect(student_inclass_page.self_next_btn.isDisplayed()).toEqual(true)
    })

    it("should try to go to next stage in student inclass",function(){
      student_inclass_page.self_next()
      expect(student_inclass_page.self_wait_alert.isDisplayed()).toEqual(true)
      expect(student_inclass_page.self_wait_alert.getText()).toContain("Please wait for the teacher to continue")
    })

    it("should retry quiz student inclass",function(){
      student_inclass_page.self_retry()
      expect(student_inclass_page.noclass.isDisplayed()).toEqual(false)
      expect(student_inclass_page.intro.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self.isDisplayed()).toEqual(true)
      expect(student_inclass_page.self_note.isDisplayed()).toEqual(true)
      expect(student_inclass_page.get_block(2).getAttribute('class')).toContain("active")
      expect(student_inclass_page.self_choices.count()).toEqual(3)
      expect(student_inclass_page.self_choice(1).getText()).toContain("Answer 1")
      expect(student_inclass_page.self_choice(2).getText()).toContain("Answer 2")
      expect(student_inclass_page.self_choice(3).getText()).toContain("Answer 3")
      expect(student_inclass_page.self_vote_button.isDisplayed()).toEqual(true)
      expect(student_inclass_page.alert_box.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self_choice(1).getAttribute('class')).toContain("selected")
      expect(student_inclass_page.self_choice(2).getAttribute('class')).not.toContain("selected")
      expect(student_inclass_page.self_choice(3).getAttribute('class')).toContain("selected")
    })

    it("should change selected answer",function(){
      student_inclass_page.self_choice(1).click()
      student_inclass_page.self_choice(2).click()
      sleep(2000)
      expect(student_inclass_page.self_choice(1).getAttribute('class')).not.toContain("selected")
      expect(student_inclass_page.self_choice(2).getAttribute('class')).toContain("selected")
      expect(student_inclass_page.self_choice(3).getAttribute('class')).toContain("selected")
    })

    it("should vote with new selected answer and check selected answers",function(){
      student_inclass_page.self_vote()
      expect(student_inclass_page.noclass.isDisplayed()).toEqual(false)
      expect(student_inclass_page.intro.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self_answered.isDisplayed()).toEqual(true)
      expect(student_inclass_page.get_block(2).getAttribute('class')).toContain("active")

      expect(student_inclass_page.self_selected_choices.count()).toEqual(3)
      expect(student_inclass_page.self_selected_choice(1).isDisplayed()).toEqual(false)
      expect(student_inclass_page.self_selected_choice(2).getText()).toContain("Answer 2")
      expect(student_inclass_page.self_selected_choice(3).getText()).toContain("Answer 3")
      expect(student_inclass_page.self_retry_btn.isDisplayed()).toEqual(true)
      expect(student_inclass_page.self_next_btn.isDisplayed()).toEqual(true)
    })

    it("should try to go to next stage in student inclass",function(){
      student_inclass_page.self_next()
      expect(student_inclass_page.self_wait_alert.isDisplayed()).toEqual(true)
      expect(student_inclass_page.self_wait_alert.getText()).toContain("Please wait for the teacher to continue")
    })
  })
  describe('Teacher start Group stage', function(){


    // it('Should check for solvers count', function(){
    //   expect(element(by.binding('session_votes')).getText()).toBe('(1/1)')
    // })

    it('Should go to the Group Stage', function(){
      utils.switch_browser(teacher_browser)
      review_model.next()
      expect(review_model.review_model.isDisplayed()).toEqual(true)
      expect(review_model.lecture_title.getText()).toEqual("PI lecture1 video quizzes")
      expect(review_model.question_block.isDisplayed()).toEqual(true)
      expect(review_model.quiz_title.getText()).toBe("PI MCQ QUIZ ( multiple choice )")

      expect(review_model.get_block(3).getAttribute('class')).toContain("active")
      // expect(element(by.className('active')).getText()).toContain('Group')
      expect(review_model.get_block_text(1)).toEqual("Intro")
      expect(review_model.get_block_text(2)).toEqual("Self")
      expect(review_model.get_block_text(3)).toEqual("Group")
      expect(review_model.get_block_text(4)).toEqual("Discussion")
      expect(review_model.get_block_text(5)).toEqual("")
      expect(review_model.get_block(5).getAttribute('class')).toContain("small_circles")
      expect(review_model.connected_blocks.count()).toEqual(5)
      expect(review_model.chart.isDisplayed()).toEqual(false)
      expect(review_model.next_button.isDisplayed()).toEqual(true)
      expect(review_model.prev_button.isDisplayed()).toEqual(true)
      expect(review_model.exit_button.isDisplayed()).toEqual(true)
    })

  })
  describe('Student 1 solve group Qs', function(){

    it("should go to next stage",function(){
      utils.switch_browser(student_browser)
      student_inclass_page.self_next()
    })

    it("should show the group question choices",function(){
      expect(student_inclass_page.noclass.isDisplayed()).toEqual(false)
      expect(student_inclass_page.intro.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self_answered.isDisplayed()).toEqual(false)
      expect(student_inclass_page.group.isDisplayed()).toEqual(true)

      expect(student_inclass_page.get_block(3).getAttribute('class')).toContain("active")
      expect(student_inclass_page.group_choices.count()).toEqual(3)
      expect(student_inclass_page.group_choice(1).getText()).toContain("Answer 1")
      expect(student_inclass_page.group_choice(2).getText()).toContain("Answer 2")
      expect(student_inclass_page.group_choice(3).getText()).toContain("Answer 3")
      expect(student_inclass_page.group_vote_button.isDisplayed()).toEqual(true)
      expect(student_inclass_page.group_note.isDisplayed()).toEqual(true)
      expect(student_inclass_page.alert_box.isDisplayed()).toEqual(false)
    })

    it("should vote without selecting any choice",function(){
      student_inclass_page.group_vote()
      expect(student_inclass_page.noclass.isDisplayed()).toEqual(false)
      expect(student_inclass_page.intro.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self_answered.isDisplayed()).toEqual(false)
      expect(student_inclass_page.group.isDisplayed()).toEqual(true)
      expect(student_inclass_page.get_block(3).getAttribute('class')).toContain("active")
      expect(student_inclass_page.alert_box.isDisplayed()).toEqual(true)
      expect(student_inclass_page.alert_box.getText()).toContain("Please choose your answer")

      expect(student_inclass_page.group_choices.count()).toEqual(3)
      expect(student_inclass_page.group_choice(1).getText()).toContain("Answer 1")
      expect(student_inclass_page.group_choice(2).getText()).toContain("Answer 2")
      expect(student_inclass_page.group_choice(3).getText()).toContain("Answer 3")
      expect(student_inclass_page.group_vote_button.isDisplayed()).toEqual(true)
      expect(student_inclass_page.group_note.isDisplayed()).toEqual(true)

    })

    it("should select first and third choice",function(){
      expect(student_inclass_page.group_choice(1).getAttribute('class')).not.toContain("selected")
      expect(student_inclass_page.group_choice(2).getAttribute('class')).not.toContain("selected")
      expect(student_inclass_page.group_choice(3).getAttribute('class')).not.toContain("selected")
      student_inclass_page.group_choice(1).click()
      expect(student_inclass_page.group_choice(1).getAttribute('class')).toContain("selected")
      expect(student_inclass_page.group_choice(2).getAttribute('class')).not.toContain("selected")
      student_inclass_page.group_choice(3).click()
      expect(student_inclass_page.group_choice(3).getAttribute('class')).toContain("selected")
      expect(student_inclass_page.group_choice(2).getAttribute('class')).not.toContain("selected")
    })

    it("should check that selected answers remain after browser refresh",function(){
      browser.refresh()
      expect(student_inclass_page.noclass.isDisplayed()).toEqual(false)
      expect(student_inclass_page.intro.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self_answered.isDisplayed()).toEqual(false)
      expect(student_inclass_page.group.isDisplayed()).toEqual(true)
      expect(student_inclass_page.get_block(3).getAttribute('class')).toContain("active")
      expect(student_inclass_page.group_choices.count()).toEqual(3)
      expect(student_inclass_page.group_choice(1).getText()).toContain("Answer 1")
      expect(student_inclass_page.group_choice(2).getText()).toContain("Answer 2")
      expect(student_inclass_page.group_choice(3).getText()).toContain("Answer 3")
      expect(student_inclass_page.group_vote_button.isDisplayed()).toEqual(true)
      expect(student_inclass_page.group_choice(1).getAttribute('class')).toContain("selected")
      expect(student_inclass_page.group_choice(2).getAttribute('class')).not.toContain("selected")
      expect(student_inclass_page.group_choice(3).getAttribute('class')).toContain("selected")
    })

    it("should vote for selected answer and check selected answers",function(){
      student_inclass_page.group_vote()
      expect(student_inclass_page.noclass.isDisplayed()).toEqual(false)
      expect(student_inclass_page.intro.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self_answered.isDisplayed()).toEqual(false)
      expect(student_inclass_page.group.isDisplayed()).toEqual(false)
      expect(student_inclass_page.group_answered.isDisplayed()).toEqual(true)
      expect(student_inclass_page.get_block(3).getAttribute('class')).toContain("active")
      sleep(2000)

      expect(student_inclass_page.group_self_selected_choices.count()).toEqual(3)
      expect(student_inclass_page.group_self_selected_choice(1).isDisplayed()).toEqual(false)
      expect(student_inclass_page.group_self_selected_choice(2).getText()).toContain("Answer 2")
      expect(student_inclass_page.group_self_selected_choice(3).getText()).toContain("Answer 3")

      expect(student_inclass_page.group_selected_choices.count()).toEqual(3)
      expect(student_inclass_page.group_selected_choice(1).getText()).toContain("Answer 1")
      expect(student_inclass_page.group_selected_choice(2).isDisplayed()).toEqual(false)
      expect(student_inclass_page.group_selected_choice(3).getText()).toContain("Answer 3")


      expect(student_inclass_page.group_retry_btn.isDisplayed()).toEqual(true)
      expect(student_inclass_page.group_next_btn.isDisplayed()).toEqual(true)
    })

    it("should try to go to next stage in student inclass",function(){
      student_inclass_page.group_next()
      expect(student_inclass_page.group_wait_alert.isDisplayed()).toEqual(true)
      expect(student_inclass_page.group_wait_alert.getText()).toContain("Please wait for the teacher to continue")
    })

    it("should retry quiz student inclass",function(){
      student_inclass_page.group_retry()
      expect(student_inclass_page.noclass.isDisplayed()).toEqual(false)
      expect(student_inclass_page.intro.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self_answered.isDisplayed()).toEqual(false)
      expect(student_inclass_page.group.isDisplayed()).toEqual(true)
      expect(student_inclass_page.group_answered.isDisplayed()).toEqual(false)

      expect(student_inclass_page.get_block(3).getAttribute('class')).toContain("active")
      expect(student_inclass_page.group_choices.count()).toEqual(3)
      expect(student_inclass_page.group_choice(1).getText()).toContain("Answer 1")
      expect(student_inclass_page.group_choice(2).getText()).toContain("Answer 2")
      expect(student_inclass_page.group_choice(3).getText()).toContain("Answer 3")
      expect(student_inclass_page.group_vote_button.isDisplayed()).toEqual(true)
      expect(student_inclass_page.alert_box.isDisplayed()).toEqual(false)
      expect(student_inclass_page.group_choice(1).getAttribute('class')).toContain("selected")
      expect(student_inclass_page.group_choice(2).getAttribute('class')).not.toContain("selected")
      expect(student_inclass_page.group_choice(3).getAttribute('class')).toContain("selected")
    })

    it("should change selected answer",function(){
      student_inclass_page.group_choice(1).click()
      student_inclass_page.group_choice(2).click()
      expect(student_inclass_page.group_choice(1).getAttribute('class')).not.toContain("selected")
      expect(student_inclass_page.group_choice(2).getAttribute('class')).toContain("selected")
      expect(student_inclass_page.group_choice(3).getAttribute('class')).toContain("selected")
    })

    it("should vote with new selected answer and check selected answers",function(){
      student_inclass_page.group_vote()
      expect(student_inclass_page.noclass.isDisplayed()).toEqual(false)
      expect(student_inclass_page.intro.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self_answered.isDisplayed()).toEqual(false)
      expect(student_inclass_page.group.isDisplayed()).toEqual(false)
      expect(student_inclass_page.group_answered.isDisplayed()).toEqual(true)

      expect(student_inclass_page.get_block(3).getAttribute('class')).toContain("active")
      expect(student_inclass_page.group_answered.isDisplayed()).toEqual(true)

      expect(student_inclass_page.group_self_selected_choices.count()).toEqual(3)
      expect(student_inclass_page.group_self_selected_choice(1).isDisplayed()).toEqual(false)
      expect(student_inclass_page.group_self_selected_choice(2).getText()).toContain("Answer 2")
      expect(student_inclass_page.group_self_selected_choice(3).getText()).toContain("Answer 3")


      expect(student_inclass_page.group_selected_choices.count()).toEqual(3)
      expect(student_inclass_page.group_selected_choice(1).isDisplayed()).toEqual(false)
      expect(student_inclass_page.group_selected_choice(2).getText()).toContain("Answer 2")
      expect(student_inclass_page.group_selected_choice(3).getText()).toContain("Answer 3")


      expect(student_inclass_page.group_retry_btn.isDisplayed()).toEqual(true)
      expect(student_inclass_page.group_next_btn.isDisplayed()).toEqual(true)
    })

    it("should try to go to next stage in student inclass",function(){
      student_inclass_page.group_next()
      expect(student_inclass_page.group_wait_alert.isDisplayed()).toEqual(true)
      expect(student_inclass_page.group_wait_alert.getText()).toContain("Please wait for the teacher to continue")
    })
  })

  describe('Student 2 solve group Qs', function(){

    it("should go to next stage",function(){
      utils.switch_browser(student2_browser)
      student_inclass_page.self_next()
    })

    it("should show the group question choices",function(){
      expect(student_inclass_page.noclass.isDisplayed()).toEqual(false)
      expect(student_inclass_page.intro.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self_answered.isDisplayed()).toEqual(false)
      expect(student_inclass_page.group.isDisplayed()).toEqual(true)

      expect(student_inclass_page.get_block(3).getAttribute('class')).toContain("active")
      expect(student_inclass_page.group_choices.count()).toEqual(3)
      expect(student_inclass_page.group_choice(1).getText()).toContain("Answer 1")
      expect(student_inclass_page.group_choice(2).getText()).toContain("Answer 2")
      expect(student_inclass_page.group_choice(3).getText()).toContain("Answer 3")
      expect(student_inclass_page.group_vote_button.isDisplayed()).toEqual(true)
      expect(student_inclass_page.group_note.isDisplayed()).toEqual(true)
      expect(student_inclass_page.alert_box.isDisplayed()).toEqual(false)
    })

    it("should vote without selecting any choice",function(){
      student_inclass_page.group_vote()
      expect(student_inclass_page.noclass.isDisplayed()).toEqual(false)
      expect(student_inclass_page.intro.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self_answered.isDisplayed()).toEqual(false)
      expect(student_inclass_page.group.isDisplayed()).toEqual(true)
      expect(student_inclass_page.get_block(3).getAttribute('class')).toContain("active")
      expect(student_inclass_page.alert_box.isDisplayed()).toEqual(true)
      expect(student_inclass_page.alert_box.getText()).toContain("Please choose your answer")

      expect(student_inclass_page.group_choices.count()).toEqual(3)
      expect(student_inclass_page.group_choice(1).getText()).toContain("Answer 1")
      expect(student_inclass_page.group_choice(2).getText()).toContain("Answer 2")
      expect(student_inclass_page.group_choice(3).getText()).toContain("Answer 3")
      expect(student_inclass_page.group_vote_button.isDisplayed()).toEqual(true)
      expect(student_inclass_page.group_note.isDisplayed()).toEqual(true)

      
    })

    it("should select first and third choice",function(){
      expect(student_inclass_page.group_choice(1).getAttribute('class')).not.toContain("selected")
      expect(student_inclass_page.group_choice(2).getAttribute('class')).not.toContain("selected")
      expect(student_inclass_page.group_choice(3).getAttribute('class')).not.toContain("selected")
      student_inclass_page.group_choice(1).click()
      expect(student_inclass_page.group_choice(1).getAttribute('class')).toContain("selected")
      expect(student_inclass_page.group_choice(2).getAttribute('class')).not.toContain("selected")
      student_inclass_page.group_choice(3).click()
      expect(student_inclass_page.group_choice(3).getAttribute('class')).toContain("selected")
      expect(student_inclass_page.group_choice(2).getAttribute('class')).not.toContain("selected")
    })

    it("should check that selected answers remain after browser refresh",function(){
      browser.refresh()
      expect(student_inclass_page.noclass.isDisplayed()).toEqual(false)
      expect(student_inclass_page.intro.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self_answered.isDisplayed()).toEqual(false)
      expect(student_inclass_page.group.isDisplayed()).toEqual(true)
      expect(student_inclass_page.get_block(3).getAttribute('class')).toContain("active")
      expect(student_inclass_page.group_choices.count()).toEqual(3)
      expect(student_inclass_page.group_choice(1).getText()).toContain("Answer 1")
      expect(student_inclass_page.group_choice(2).getText()).toContain("Answer 2")
      expect(student_inclass_page.group_choice(3).getText()).toContain("Answer 3")
      expect(student_inclass_page.group_vote_button.isDisplayed()).toEqual(true)
      expect(student_inclass_page.group_choice(1).getAttribute('class')).toContain("selected")
      expect(student_inclass_page.group_choice(2).getAttribute('class')).not.toContain("selected")
      expect(student_inclass_page.group_choice(3).getAttribute('class')).toContain("selected")
    })

    it("should vote for selected answer and check selected answers",function(){
      student_inclass_page.group_vote()
      expect(student_inclass_page.noclass.isDisplayed()).toEqual(false)
      expect(student_inclass_page.intro.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self_answered.isDisplayed()).toEqual(false)
      expect(student_inclass_page.group.isDisplayed()).toEqual(false)
      expect(student_inclass_page.group_answered.isDisplayed()).toEqual(true)
      expect(student_inclass_page.get_block(3).getAttribute('class')).toContain("active")
      sleep(2000)

      expect(student_inclass_page.group_self_selected_choices.count()).toEqual(3)
      expect(student_inclass_page.group_self_selected_choice(1).isDisplayed()).toEqual(false)
      expect(student_inclass_page.group_self_selected_choice(2).getText()).toContain("Answer 2")
      expect(student_inclass_page.group_self_selected_choice(3).getText()).toContain("Answer 3")

      expect(student_inclass_page.group_selected_choices.count()).toEqual(3)
      expect(student_inclass_page.group_selected_choice(1).getText()).toContain("Answer 1")
      expect(student_inclass_page.group_selected_choice(2).isDisplayed()).toEqual(false)
      expect(student_inclass_page.group_selected_choice(3).getText()).toContain("Answer 3")


      expect(student_inclass_page.group_retry_btn.isDisplayed()).toEqual(true)
      expect(student_inclass_page.group_next_btn.isDisplayed()).toEqual(true)
    })

    it("should try to go to next stage in student inclass",function(){
      student_inclass_page.group_next()
      expect(student_inclass_page.group_wait_alert.isDisplayed()).toEqual(true)
      expect(student_inclass_page.group_wait_alert.getText()).toContain("Please wait for the teacher to continue")
    })

    it("should retry quiz student inclass",function(){
      student_inclass_page.group_retry()
      expect(student_inclass_page.noclass.isDisplayed()).toEqual(false)
      expect(student_inclass_page.intro.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self_answered.isDisplayed()).toEqual(false)
      expect(student_inclass_page.group.isDisplayed()).toEqual(true)
      expect(student_inclass_page.group_answered.isDisplayed()).toEqual(false)

      expect(student_inclass_page.get_block(3).getAttribute('class')).toContain("active")
      expect(student_inclass_page.group_choices.count()).toEqual(3)
      expect(student_inclass_page.group_choice(1).getText()).toContain("Answer 1")
      expect(student_inclass_page.group_choice(2).getText()).toContain("Answer 2")
      expect(student_inclass_page.group_choice(3).getText()).toContain("Answer 3")
      expect(student_inclass_page.group_vote_button.isDisplayed()).toEqual(true)
      expect(student_inclass_page.alert_box.isDisplayed()).toEqual(false)
      expect(student_inclass_page.group_choice(1).getAttribute('class')).toContain("selected")
      expect(student_inclass_page.group_choice(2).getAttribute('class')).not.toContain("selected")
      expect(student_inclass_page.group_choice(3).getAttribute('class')).toContain("selected")
    })

    it("should change selected answer",function(){
      student_inclass_page.group_choice(1).click()
      student_inclass_page.group_choice(2).click()
      expect(student_inclass_page.group_choice(1).getAttribute('class')).not.toContain("selected")
      expect(student_inclass_page.group_choice(2).getAttribute('class')).toContain("selected")
      expect(student_inclass_page.group_choice(3).getAttribute('class')).toContain("selected")
    })

    it("should vote with new selected answer and check selected answers",function(){
      student_inclass_page.group_vote()
      expect(student_inclass_page.noclass.isDisplayed()).toEqual(false)
      expect(student_inclass_page.intro.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self_answered.isDisplayed()).toEqual(false)
      expect(student_inclass_page.group.isDisplayed()).toEqual(false)
      expect(student_inclass_page.group_answered.isDisplayed()).toEqual(true)

      expect(student_inclass_page.get_block(3).getAttribute('class')).toContain("active")
      expect(student_inclass_page.group_answered.isDisplayed()).toEqual(true)

      expect(student_inclass_page.group_self_selected_choices.count()).toEqual(3)
      expect(student_inclass_page.group_self_selected_choice(1).isDisplayed()).toEqual(false)
      expect(student_inclass_page.group_self_selected_choice(2).getText()).toContain("Answer 2")
      expect(student_inclass_page.group_self_selected_choice(3).getText()).toContain("Answer 3")


      expect(student_inclass_page.group_selected_choices.count()).toEqual(3)
      expect(student_inclass_page.group_selected_choice(1).isDisplayed()).toEqual(false)
      expect(student_inclass_page.group_selected_choice(2).getText()).toContain("Answer 2")
      expect(student_inclass_page.group_selected_choice(3).getText()).toContain("Answer 3")


      expect(student_inclass_page.group_retry_btn.isDisplayed()).toEqual(true)
      expect(student_inclass_page.group_next_btn.isDisplayed()).toEqual(true)
    })

    it("should try to go to next stage in student inclass",function(){
      student_inclass_page.group_next()
      expect(student_inclass_page.group_wait_alert.isDisplayed()).toEqual(true)
      expect(student_inclass_page.group_wait_alert.getText()).toContain("Please wait for the teacher to continue")
    })
  })

  describe('Teacher start Discussion stage', function(){


    it('Should go to the Discussion Stage', function(){
      utils.switch_browser(teacher_browser)
      review_model.next()
      expect(review_model.review_model.isDisplayed()).toEqual(true)
      expect(review_model.lecture_title.getText()).toEqual("PI lecture1 video quizzes")
      expect(review_model.question_block.isDisplayed()).toEqual(true)
      expect(review_model.quiz_title.getText()).toBe("PI MCQ QUIZ ( multiple choice )")

      expect(review_model.get_block(4).getAttribute('class')).toContain("active")

      expect(review_model.get_block_text(1)).toEqual("Intro")
      expect(review_model.get_block_text(2)).toEqual("Self")
      expect(review_model.get_block_text(3)).toEqual("Group")
      expect(review_model.get_block_text(4)).toEqual("Discussion")
      expect(review_model.get_block_text(5)).toEqual("")
      expect(review_model.get_block(5).getAttribute('class')).toContain("small_circles")
      expect(review_model.connected_blocks.count()).toEqual(5)
      expect(review_model.next_button.isDisplayed()).toEqual(true)
      expect(review_model.prev_button.isDisplayed()).toEqual(true)
      expect(review_model.exit_button.isDisplayed()).toEqual(true)
      expect(review_model.chart.isDisplayed()).toEqual(true)
    })

    // it('Should check the chart info', function(){
    //
    // })

  })

  describe('Student 1 go to Discussion', function(){

    it("should go to next stage",function(){
      utils.switch_browser(student_browser)
      student_inclass_page.group_next()
    })

    it("should show the discussion stage",function(){
      expect(student_inclass_page.noclass.isDisplayed()).toEqual(false)
      expect(student_inclass_page.intro.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self_answered.isDisplayed()).toEqual(false)
      expect(student_inclass_page.group.isDisplayed()).toEqual(false)
      expect(student_inclass_page.group_answered.isDisplayed()).toEqual(false)
      expect(student_inclass_page.discussion.isDisplayed()).toEqual(true)
      expect(student_inclass_page.get_block(4).getAttribute('class')).toContain("active")


      expect(student_inclass_page.discussion_self_selected_choices.count()).toEqual(3)
      expect(student_inclass_page.discussion_self_selected_choice(1).isDisplayed()).toEqual(false)
      expect(student_inclass_page.discussion_self_selected_choice(2).getText()).toContain("Answer 2")
      expect(student_inclass_page.discussion_self_selected_choice(3).getText()).toContain("Answer 3")


      expect(student_inclass_page.discussion_group_selected_choices.count()).toEqual(3)
      expect(student_inclass_page.discussion_group_selected_choice(1).isDisplayed()).toEqual(false)
      expect(student_inclass_page.discussion_group_selected_choice(2).getText()).toContain("Answer 2")
      expect(student_inclass_page.discussion_group_selected_choice(3).getText()).toContain("Answer 3")
      expect(student_inclass_page.discussion_continue_button.isDisplayed()).toEqual(true)
    })

    it("should try to go to next stage",function(){
      student_inclass_page.discussion_continue()
      expect(student_inclass_page.noclass.isDisplayed()).toEqual(false)
      expect(student_inclass_page.intro.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self_answered.isDisplayed()).toEqual(false)
      expect(student_inclass_page.group.isDisplayed()).toEqual(false)
      expect(student_inclass_page.group_answered.isDisplayed()).toEqual(false)
      expect(student_inclass_page.discussion.isDisplayed()).toEqual(true)
      expect(student_inclass_page.get_block(4).getAttribute('class')).toContain("active")
      expect(student_inclass_page.discussion_self_selected_choices.count()).toEqual(3)
      expect(student_inclass_page.discussion_self_selected_choice(1).isDisplayed()).toEqual(false)
      expect(student_inclass_page.discussion_self_selected_choice(2).getText()).toContain("Answer 2")
      expect(student_inclass_page.discussion_self_selected_choice(3).getText()).toContain("Answer 3")
      expect(student_inclass_page.discussion_group_selected_choices.count()).toEqual(3)
      expect(student_inclass_page.discussion_group_selected_choice(1).isDisplayed()).toEqual(false)
      expect(student_inclass_page.discussion_group_selected_choice(2).getText()).toContain("Answer 2")
      expect(student_inclass_page.discussion_group_selected_choice(3).getText()).toContain("Answer 3")
      expect(student_inclass_page.discussion_continue_button.isDisplayed()).toEqual(true)
    })
  })


  describe('Student 2 go to Discussion', function(){

    it("should go to next stage",function(){
      utils.switch_browser(student2_browser)
      student_inclass_page.group_next()
    })

    it("should show the discussion stage",function(){
      expect(student_inclass_page.noclass.isDisplayed()).toEqual(false)
      expect(student_inclass_page.intro.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self_answered.isDisplayed()).toEqual(false)
      expect(student_inclass_page.group.isDisplayed()).toEqual(false)
      expect(student_inclass_page.group_answered.isDisplayed()).toEqual(false)
      expect(student_inclass_page.discussion.isDisplayed()).toEqual(true)
      expect(student_inclass_page.get_block(4).getAttribute('class')).toContain("active")


      expect(student_inclass_page.discussion_self_selected_choices.count()).toEqual(3)
      expect(student_inclass_page.discussion_self_selected_choice(1).isDisplayed()).toEqual(false)
      expect(student_inclass_page.discussion_self_selected_choice(2).getText()).toContain("Answer 2")
      expect(student_inclass_page.discussion_self_selected_choice(3).getText()).toContain("Answer 3")


      expect(student_inclass_page.discussion_group_selected_choices.count()).toEqual(3)
      expect(student_inclass_page.discussion_group_selected_choice(1).isDisplayed()).toEqual(false)
      expect(student_inclass_page.discussion_group_selected_choice(2).getText()).toContain("Answer 2")
      expect(student_inclass_page.discussion_group_selected_choice(3).getText()).toContain("Answer 3")
      expect(student_inclass_page.discussion_continue_button.isDisplayed()).toEqual(true)
    })

    it("should try to go to next stage",function(){
      student_inclass_page.discussion_continue()
      expect(student_inclass_page.noclass.isDisplayed()).toEqual(false)
      expect(student_inclass_page.intro.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self_answered.isDisplayed()).toEqual(false)
      expect(student_inclass_page.group.isDisplayed()).toEqual(false)
      expect(student_inclass_page.group_answered.isDisplayed()).toEqual(false)
      expect(student_inclass_page.discussion.isDisplayed()).toEqual(true)
      expect(student_inclass_page.get_block(4).getAttribute('class')).toContain("active")
      expect(student_inclass_page.discussion_self_selected_choices.count()).toEqual(3)
      expect(student_inclass_page.discussion_self_selected_choice(1).isDisplayed()).toEqual(false)
      expect(student_inclass_page.discussion_self_selected_choice(2).getText()).toContain("Answer 2")
      expect(student_inclass_page.discussion_self_selected_choice(3).getText()).toContain("Answer 3")
      expect(student_inclass_page.discussion_group_selected_choices.count()).toEqual(3)
      expect(student_inclass_page.discussion_group_selected_choice(1).isDisplayed()).toEqual(false)
      expect(student_inclass_page.discussion_group_selected_choice(2).getText()).toContain("Answer 2")
      expect(student_inclass_page.discussion_group_selected_choice(3).getText()).toContain("Answer 3")
      expect(student_inclass_page.discussion_continue_button.isDisplayed()).toEqual(true)
    })
  })



  describe('Teacher Start last Stage', function(){

    it('Should go to the Last Stage', function(){
      utils.switch_browser(teacher_browser)
      review_model.next()
      expect(review_model.review_model.isDisplayed()).toEqual(true)
      expect(review_model.lecture_title.getText()).toEqual("PI lecture1 video quizzes")
      expect(review_model.question_block.isDisplayed()).toEqual(true)
      expect(review_model.quiz_title.getText()).toBe("PI MCQ QUIZ ( multiple choice )")

      expect(review_model.get_block(5).getAttribute('class')).toContain("active")

      expect(review_model.get_block_text(1)).toEqual("Intro")
      expect(review_model.get_block_text(2)).toEqual("Self")
      expect(review_model.get_block_text(3)).toEqual("Group")
      expect(review_model.get_block_text(4)).toEqual("Discussion")
      expect(review_model.get_block_text(5)).toEqual("")
      expect(review_model.get_block(5).getAttribute('class')).toContain("small_circles")
      expect(review_model.connected_blocks.count()).toEqual(5)
      expect(review_model.next_button.isDisplayed()).toEqual(true)
      expect(review_model.prev_button.isDisplayed()).toEqual(true)
      expect(review_model.exit_button.isDisplayed()).toEqual(true)
      expect(review_model.chart.isDisplayed()).toEqual(true)
    })

    xit('Should go to the blackscreen', function(){
      review_model.next()
      expect(element(by.className('blackscreen')).getText()).toEqual('Review finished. Press ESC to end')

    })

    xit('Should be back to inClass Review', function(){
      browser.actions().sendKeys(protractor.Key.ESCAPE).perform();

      expect(inclass_page.title).toEqual("In-class Review:PI module 1")
      expect(inclass_page.display_button.isDisplayed()).toEqual(true);
      expect(inclass_page.display_button.isEnabled()).toEqual(true);
      var module = inclass_page.module_item(1)
      expect(module.title).toEqual("PI lecture1 video quizzes")
      expect(module.inclass_quizzes.count()).toEqual(1)
      var inclass_quiz = module.inclass_quiz(1)
      expect(inclass_quiz.title).toEqual("Quiz: PI MCQ QUIZ")
      expect(inclass_quiz.visibility_box.isSelected()).toEqual(true)

      expect(inclass_page.total_inclass_time).toEqual("8");
      expect(inclass_page.total_pi_time).toEqual("8")
      expect(inclass_page.total_pi_quizzes).toEqual("1")
      expect(inclass_page.total_review_time).toEqual("0")
      expect(inclass_page.total_review_quizzes).toEqual("0")
      expect(inclass_page.total_review_discussions).toEqual("0")
      expect(inclass_page.total_review_surveys).toEqual("0")

    })

  })

  describe('Student 1 should try to continue', function(){
    it("should try to go to next stage",function(){
      utils.switch_browser(student_browser)
      student_inclass_page.discussion_continue()
      expect(student_inclass_page.noclass.isDisplayed()).toEqual(false)
      expect(student_inclass_page.intro.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self_answered.isDisplayed()).toEqual(false)
      expect(student_inclass_page.group.isDisplayed()).toEqual(false)
      expect(student_inclass_page.group_answered.isDisplayed()).toEqual(false)
      expect(student_inclass_page.discussion.isDisplayed()).toEqual(true)
      expect(student_inclass_page.get_block(4).getAttribute('class')).toContain("active")
      expect(student_inclass_page.discussion_self_selected_choices.count()).toEqual(3)
      expect(student_inclass_page.discussion_self_selected_choice(1).isDisplayed()).toEqual(false)
      expect(student_inclass_page.discussion_self_selected_choice(2).getText()).toContain("Answer 2")
      expect(student_inclass_page.discussion_self_selected_choice(3).getText()).toContain("Answer 3")
      expect(student_inclass_page.discussion_group_selected_choices.count()).toEqual(3)
      expect(student_inclass_page.discussion_group_selected_choice(1).isDisplayed()).toEqual(false)
      expect(student_inclass_page.discussion_group_selected_choice(2).getText()).toContain("Answer 2")
      expect(student_inclass_page.discussion_group_selected_choice(3).getText()).toContain("Answer 3")
      expect(student_inclass_page.discussion_continue_button.isDisplayed()).toEqual(true)
    })
  })

  describe('Student 2 should try to continue', function(){
    it("should try to go to next stage",function(){
      utils.switch_browser(student2_browser)
      student_inclass_page.discussion_continue()
      expect(student_inclass_page.noclass.isDisplayed()).toEqual(false)
      expect(student_inclass_page.intro.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self_answered.isDisplayed()).toEqual(false)
      expect(student_inclass_page.group.isDisplayed()).toEqual(false)
      expect(student_inclass_page.group_answered.isDisplayed()).toEqual(false)
      expect(student_inclass_page.discussion.isDisplayed()).toEqual(true)
      expect(student_inclass_page.get_block(4).getAttribute('class')).toContain("active")
      expect(student_inclass_page.discussion_self_selected_choices.count()).toEqual(3)
      expect(student_inclass_page.discussion_self_selected_choice(1).isDisplayed()).toEqual(false)
      expect(student_inclass_page.discussion_self_selected_choice(2).getText()).toContain("Answer 2")
      expect(student_inclass_page.discussion_self_selected_choice(3).getText()).toContain("Answer 3")
      expect(student_inclass_page.discussion_group_selected_choices.count()).toEqual(3)
      expect(student_inclass_page.discussion_group_selected_choice(1).isDisplayed()).toEqual(false)
      expect(student_inclass_page.discussion_group_selected_choice(2).getText()).toContain("Answer 2")
      expect(student_inclass_page.discussion_group_selected_choice(3).getText()).toContain("Answer 3")
      expect(student_inclass_page.discussion_continue_button.isDisplayed()).toEqual(true)
    })
  })

  describe('Teacher should go back', function(){

    it('Should be back to discussions', function(){
      utils.switch_browser(teacher_browser)
      review_model.previous()

      expect(review_model.review_model.isDisplayed()).toEqual(true)
      expect(review_model.lecture_title.getText()).toEqual("PI lecture1 video quizzes")
      expect(review_model.question_block.isDisplayed()).toEqual(true)
      expect(review_model.quiz_title.getText()).toBe("PI MCQ QUIZ ( multiple choice )")

      expect(review_model.get_block(4).getAttribute('class')).toContain("active")

      expect(review_model.get_block_text(1)).toEqual("Intro")
      expect(review_model.get_block_text(2)).toEqual("Self")
      expect(review_model.get_block_text(3)).toEqual("Group")
      expect(review_model.get_block_text(4)).toEqual("Discussion")
      expect(review_model.get_block_text(5)).toEqual("")
      expect(review_model.get_block(5).getAttribute('class')).toContain("small_circles")
      expect(review_model.connected_blocks.count()).toEqual(5)
      expect(review_model.next_button.isDisplayed()).toEqual(true)
      expect(review_model.prev_button.isDisplayed()).toEqual(true)
      expect(review_model.exit_button.isDisplayed()).toEqual(true)
      expect(review_model.chart.isDisplayed()).toEqual(true)

    })
    it('Should be back to Group', function(){
      review_model.previous()
      expect(review_model.review_model.isDisplayed()).toEqual(true)
      expect(review_model.lecture_title.getText()).toEqual("PI lecture1 video quizzes")
      expect(review_model.question_block.isDisplayed()).toEqual(true)
      expect(review_model.quiz_title.getText()).toBe("PI MCQ QUIZ ( multiple choice )")

      expect(review_model.get_block(3).getAttribute('class')).toContain("active")
      // expect(element(by.className('active')).getText()).toContain('Group')
      expect(review_model.get_block_text(1)).toEqual("Intro")
      expect(review_model.get_block_text(2)).toEqual("Self")
      expect(review_model.get_block_text(3)).toEqual("Group")
      expect(review_model.get_block_text(4)).toEqual("Discussion")
      expect(review_model.get_block_text(5)).toEqual("")
      expect(review_model.get_block(5).getAttribute('class')).toContain("small_circles")
      expect(review_model.connected_blocks.count()).toEqual(5)
      expect(review_model.chart.isDisplayed()).toEqual(false)
      expect(review_model.next_button.isDisplayed()).toEqual(true)
      expect(review_model.prev_button.isDisplayed()).toEqual(true)
      expect(review_model.exit_button.isDisplayed()).toEqual(true)

    })
    it('Should be back to Self', function(){
      review_model.previous()
      expect(review_model.review_model.isDisplayed()).toEqual(true)
      expect(review_model.lecture_title.getText()).toEqual("PI lecture1 video quizzes")
      expect(review_model.question_block.isDisplayed()).toEqual(true)
      expect(review_model.quiz_title.getText()).toBe("PI MCQ QUIZ ( multiple choice )")

      expect(review_model.get_block(2).getAttribute('class')).toContain("active")
      // expect(element(by.className('active')).getText()).toContain('Self')
      expect(review_model.get_block_text(1)).toEqual("Intro")
      expect(review_model.get_block_text(2)).toEqual("Self")
      expect(review_model.get_block_text(3)).toEqual("Group")
      expect(review_model.get_block_text(4)).toEqual("Discussion")
      expect(review_model.get_block_text(5)).toEqual("")
      expect(review_model.get_block(5).getAttribute('class')).toContain("small_circles")
      expect(review_model.connected_blocks.count()).toEqual(5)
      expect(review_model.chart.isDisplayed()).toEqual(false)
      expect(review_model.next_button.isDisplayed()).toEqual(true)
      expect(review_model.prev_button.isDisplayed()).toEqual(true)
      expect(review_model.exit_button.isDisplayed()).toEqual(true)
    })
    it('Should be back to Intro', function(){
      review_model.previous()
      expect(review_model.review_model.isDisplayed()).toEqual(true)
      expect(review_model.lecture_title.getText()).toEqual("PI lecture1 video quizzes")
      expect(review_model.question_block.isDisplayed()).toEqual(true)
      expect(review_model.quiz_title.getText()).toBe("PI MCQ QUIZ ( multiple choice )")
      expect(review_model.get_block(1).getAttribute('class')).toContain("active")
      expect(review_model.get_block_text(1)).toEqual("Intro")
      expect(review_model.get_block_text(2)).toEqual("Self")
      expect(review_model.get_block_text(3)).toEqual("Group")
      expect(review_model.get_block_text(4)).toEqual("Discussion")
      expect(review_model.get_block_text(5)).toEqual("")
      expect(review_model.get_block(5).getAttribute('class')).toContain("small_circles")
      expect(review_model.connected_blocks.count()).toEqual(5)
      expect(review_model.chart.isDisplayed()).toEqual(false)
      expect(review_model.next_button.isDisplayed()).toEqual(true)
      expect(review_model.prev_button.isDisplayed()).toEqual(true)
      expect(review_model.exit_button.isDisplayed()).toEqual(true)
    })

    it('Should try to get before Intro', function(){
      review_model.previous()
      expect(review_model.review_model.isDisplayed()).toEqual(true)
      expect(review_model.lecture_title.getText()).toEqual("PI lecture1 video quizzes")
      expect(review_model.question_block.isDisplayed()).toEqual(true)
      expect(review_model.quiz_title.getText()).toBe("PI MCQ QUIZ ( multiple choice )")
      expect(review_model.get_block(1).getAttribute('class')).toContain("active")
      expect(review_model.get_block_text(1)).toEqual("Intro")
      expect(review_model.get_block_text(2)).toEqual("Self")
      expect(review_model.get_block_text(3)).toEqual("Group")
      expect(review_model.get_block_text(4)).toEqual("Discussion")
      expect(review_model.get_block_text(5)).toEqual("")
      expect(review_model.get_block(5).getAttribute('class')).toContain("small_circles")
      expect(review_model.connected_blocks.count()).toEqual(5)
      expect(review_model.chart.isDisplayed()).toEqual(false)
      expect(review_model.next_button.isDisplayed()).toEqual(true)
      expect(review_model.prev_button.isDisplayed()).toEqual(true)
      expect(review_model.exit_button.isDisplayed()).toEqual(true)
    })

  })

  describe('Teacher end it', function(){

    it('Should go to the blackscreen', function(){
      utils.switch_browser(teacher_browser)
      review_model.next()
      review_model.next()
      review_model.next()
      review_model.next()
      review_model.next()
      expect(element(by.className('blackscreen')).getText()).toEqual('Review finished. Press ESC to end')

    })

    it('Should be back to inClass Review', function(){
      browser.actions().sendKeys(protractor.Key.ESCAPE).perform();

      expect(inclass_page.title).toEqual("In-class Review: PI module 1")
      expect(inclass_page.display_button.isDisplayed()).toEqual(true);
      expect(inclass_page.display_button.isEnabled()).toEqual(true);
      var module = inclass_page.module_item(1)
      expect(module.title).toEqual("PI lecture1 video quizzes")
      expect(module.inclass_quizzes.count()).toEqual(1)
      var inclass_quiz = module.inclass_quiz(1)
      expect(inclass_quiz.title).toEqual("Quiz: PI MCQ QUIZ")
      expect(inclass_quiz.visibility_box.isSelected()).toEqual(true)

      expect(inclass_page.total_inclass_time).toEqual("8");
      expect(inclass_page.total_pi_time).toEqual("8")
      expect(inclass_page.total_pi_quizzes).toEqual("1")
      expect(inclass_page.total_review_time).toEqual("0")
      expect(inclass_page.total_review_quizzes).toEqual("0")
      expect(inclass_page.total_review_discussions).toEqual("0")
      expect(inclass_page.total_review_surveys).toEqual("0")
    })
    it("should delete items in first module and module itself",function(){
          // it("should go to edit mode", function() {
      sub_header.open_edit_mode()
    // })
      var module = navigator.module(1)
      module.open()
      expect(module.items.count()).toEqual(3)
      module.item(3).delete()
      expect(module.items.count()).toEqual(2)
      module.item(2).delete()
      expect(module.items.count()).toEqual(1)
      module.item(1).delete()
      expect(module.items.count()).toEqual(0)
      module.delete()
      expect(navigator.modules.count()).toEqual(0)
    })
    it("should logout", function() {
      header.logout()
    })

  })

})
