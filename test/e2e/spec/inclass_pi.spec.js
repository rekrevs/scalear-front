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


describe("PI Inclass", function() {
  describe("Teacher", function() {
    var module_count
    var teacher_browser = browser
    var student_browser = utils.new_session()
    it("should login", function() {
      login_page.sign_in(params.teacher1.email, params.password)
    })

    it("should open course", function() {
      course_list.open()
      course_list.open_course(1)
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

    it("should go to student mode",function(){
      utils.switch_browser(student_browser)
      login_page.sign_in(params.student1.email, params.password)
      course_list.open()
      course_list.open_course(1)
    })

    it("should open student inclass",function(){
      var module = navigator.module(module_count)
      module.open()
      module.open_student_inclass()
      sleep(6000)
    })

    it("should have correct student inclass content",function(){
      expect(student_inclass_page.title).toEqual("PI module 1")
      expect(student_inclass_page.get_block_text(1)).toEqual("Intro")
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

    it("should go to next stage",function(){
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

    it("should go to next stage",function(){
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
      expect(student_inclass_page.self_choices.count()).toEqual(3)
      expect(student_inclass_page.self_choice(1).getText()).toContain("Answer 1")
      expect(student_inclass_page.self_choice(2).getText()).toContain("Answer 2")
      expect(student_inclass_page.self_choice(3).getText()).toContain("Answer 3")
      expect(student_inclass_page.self_vote_button.isDisplayed()).toEqual(true)
      expect(student_inclass_page.alert_box.isDisplayed()).toEqual(true)
      expect(student_inclass_page.alert_box.getText()).toContain("Please choose your answer")
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
      expect(student_inclass_page.self_selected_choices.count()).toEqual(2)
      expect(student_inclass_page.self_selected_choice(1).getText()).toContain("Answer 1")
      expect(student_inclass_page.self_selected_choice(2).getText()).toContain("Answer 3")
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

      expect(student_inclass_page.self_selected_choices.count()).toEqual(2)
      expect(student_inclass_page.self_selected_choice(1).getText()).toContain("Answer 2")
      expect(student_inclass_page.self_selected_choice(2).getText()).toContain("Answer 3")
      expect(student_inclass_page.self_retry_btn.isDisplayed()).toEqual(true)
      expect(student_inclass_page.self_next_btn.isDisplayed()).toEqual(true)
    })

    it("should go to next stage",function(){
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
      expect(student_inclass_page.group_choices.count()).toEqual(3)
      expect(student_inclass_page.group_choice(1).getText()).toContain("Answer 1")
      expect(student_inclass_page.group_choice(2).getText()).toContain("Answer 2")
      expect(student_inclass_page.group_choice(3).getText()).toContain("Answer 3")
      expect(student_inclass_page.group_vote_button.isDisplayed()).toEqual(true)
      expect(student_inclass_page.group_note.isDisplayed()).toEqual(true)
      expect(student_inclass_page.alert_box.isDisplayed()).toEqual(true)
      expect(student_inclass_page.alert_box.getText()).toContain("Please choose your answer")
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

      expect(student_inclass_page.group_selected_choices.count()).toEqual(2)
      expect(student_inclass_page.group_selected_choice(1).getText()).toContain("Answer 1")
      expect(student_inclass_page.group_selected_choice(2).getText()).toContain("Answer 3")

      // expect(student_inclass_page.group_self_selected_choices.count()).toEqual(2)
      // expect(student_inclass_page.group_self_selected_choice(1).getText()).toContain("Answer 2")
      // expect(student_inclass_page.group_self_selected_choice(2).getText()).toContain("Answer 3")

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
      expect(student_inclass_page.group_selected_choices.count()).toEqual(2)
      expect(student_inclass_page.group_selected_choice(1).getText()).toContain("Answer 2")
      expect(student_inclass_page.group_selected_choice(2).getText()).toContain("Answer 3")

      // expect(student_inclass_page.group_self_selected_choices.count()).toEqual(2)
      // expect(student_inclass_page.group_self_selected_choice(1).getText()).toContain("Answer 2")
      // expect(student_inclass_page.group_self_selected_choice(2).getText()).toContain("Answer 3")

      expect(student_inclass_page.group_retry_btn.isDisplayed()).toEqual(true)
      expect(student_inclass_page.group_next_btn.isDisplayed()).toEqual(true)
    })

    it("should go to next stage",function(){
      student_inclass_page.group_next()
    })

    it("should show the discussion stage",function(){
      expect(student_inclass_page.noclass.isDisplayed()).toEqual(false)
      expect(student_inclass_page.intro.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self.isDisplayed()).toEqual(false)
      expect(student_inclass_page.self_answered.isDisplayed()).toEqual(false)
      expect(student_inclass_page.group.isDisplayed()).toEqual(false)
      expect(student_inclass_page.group_answered.isDisplayed()).toEqual(false)
      expect(student_inclass_page.discussion.isDisplayed()).toEqual(false)
      expect(student_inclass_page.get_block(4).getAttribute('class')).toContain("active")
      expect(student_inclass_page.discussion_self_selected_choices.count()).toEqual(2)
      expect(student_inclass_page.discussion_self_selected_choice(1).getText()).toContain("Answer 2")
      expect(student_inclass_page.discussion_self_selected_choice(2).getText()).toContain("Answer 3")
      expect(student_inclass_page.discussion_group_selected_choices.count()).toEqual(2)
      expect(student_inclass_page.discussion_group_selected_choice(1).getText()).toContain("Answer 2")
      expect(student_inclass_page.discussion_group_selected_choice(2).getText()).toContain("Answer 3")
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
      expect(student_inclass_page.discussion.isDisplayed()).toEqual(false)
      expect(student_inclass_page.get_block(4).getAttribute('class')).toContain("active")
      expect(student_inclass_page.discussion_self_selected_choices.count()).toEqual(2)
      expect(student_inclass_page.discussion_self_selected_choice(1).getText()).toContain("Answer 2")
      expect(student_inclass_page.discussion_self_selected_choice(2).getText()).toContain("Answer 3")
      expect(student_inclass_page.discussion_group_selected_choices.count()).toEqual(2)
      expect(student_inclass_page.discussion_group_selected_choice(1).getText()).toContain("Answer 2")
      expect(student_inclass_page.discussion_group_selected_choice(2).getText()).toContain("Answer 3")
      expect(student_inclass_page.discussion_continue_button.isDisplayed()).toEqual(true)
    })

    it("should go to teacher inclass review",function(){
      utils.switch_browser(teacher_browser)
      inclass_page.start_inclass_review()
      review_model.wait_till_ready()
    })

    // it("should have correct review content",function() {
    //   expect(review_model.lecture_title).toEqual("PI lecture1 video quizzes")
    //   expect(review_model.quiz_title).toEqual("PI MCQ QUIZ")
    //   expect(review_model.connected_blocks.count()).toEqual(5)
    //   expect(review_model.get_block_text(1)).toEqual("Intro")
    //   expect(review_model.get_block_text(2)).toEqual("Self")
    //   expect(review_model.get_block_text(3)).toEqual("Group")
    //   expect(review_model.get_block_text(4)).toEqual("Discussion")
    //   expect(review_model.get_block_text(5)).toEqual("")
    //   expect(review_model.get_block(5).getAttribute('class')).toContain("small_circles")
    //   expect(review_model.get_block(1).getAttribute('class')).toContain("active")
    //   expect(review_model.chart.isDisplayed()).toEqual(false)
    // })

    // it("should go to second inclass stage", function(){
    //   review_model.next()
    //   expect(review_model.lecture_title).toEqual("PI lecture1 video quizzes")
    //   expect(review_model.quiz_title).toEqual("PI MCQ QUIZ")
    //   expect(review_model.connected_blocks.count()).toEqual(5)
    //   expect(review_model.get_block_text(1)).toEqual("Intro")
    //   expect(review_model.get_block_text(2)).toEqual("Self")
    //   expect(review_model.get_block_text(3)).toEqual("Group")
    //   expect(review_model.get_block_text(4)).toEqual("Discussion")
    //   expect(review_model.get_block_text(5)).toEqual("")
    //   expect(review_model.get_block(5).getAttribute('class')).toContain("small_circles")
    //   expect(review_model.get_block(2).getAttribute('class')).toContain("active")
    //   expect(review_model.chart.isDisplayed()).toEqual(false)
    // })

    // it("should go to third inclass stage", function(){
    //   review_model.next()
    //   expect(review_model.lecture_title).toEqual("PI lecture1 video quizzes")
    //   expect(review_model.quiz_title).toEqual("PI MCQ QUIZ")
    //   expect(review_model.connected_blocks.count()).toEqual(5)
    //   expect(review_model.get_block_text(1)).toEqual("Intro")
    //   expect(review_model.get_block_text(2)).toEqual("Self")
    //   expect(review_model.get_block_text(3)).toEqual("Group")
    //   expect(review_model.get_block_text(4)).toEqual("Discussion")
    //   expect(review_model.get_block_text(5)).toEqual("")
    //   expect(review_model.get_block(5).getAttribute('class')).toContain("small_circles")
    //   expect(review_model.get_block(3).getAttribute('class')).toContain("active")
    //   expect(review_model.chart.isDisplayed()).toEqual(false)
    // })

    // it("should go to forth inclass stage", function(){
    //   review_model.next()
    //   expect(review_model.lecture_title).toEqual("PI lecture1 video quizzes")
    //   expect(review_model.quiz_title).toEqual("PI MCQ QUIZ")
    //   expect(review_model.connected_blocks.count()).toEqual(5)
    //   expect(review_model.get_block_text(1)).toEqual("Intro")
    //   expect(review_model.get_block_text(2)).toEqual("Self")
    //   expect(review_model.get_block_text(3)).toEqual("Group")
    //   expect(review_model.get_block_text(4)).toEqual("Discussion")
    //   expect(review_model.get_block_text(5)).toEqual("")
    //   expect(review_model.get_block(5).getAttribute('class')).toContain("small_circles")
    //   expect(review_model.get_block(4).getAttribute('class')).toContain("active")
    //   expect(review_model.chart.isDisplayed()).toEqual(true)
    // })

    // it("should go to final inclass stage", function(){
    //   review_model.next()
    //   expect(review_model.lecture_title).toEqual("PI lecture1 video quizzes")
    //   expect(review_model.quiz_title).toEqual("PI MCQ QUIZ")
    //   expect(review_model.connected_blocks.count()).toEqual(5)
    //   expect(review_model.get_block_text(1)).toEqual("Intro")
    //   expect(review_model.get_block_text(2)).toEqual("Self")
    //   expect(review_model.get_block_text(3)).toEqual("Group")
    //   expect(review_model.get_block_text(4)).toEqual("Discussion")
    //   expect(review_model.get_block_text(5)).toEqual("")
    //   expect(review_model.get_block(5).getAttribute('class')).toContain("small_circles")
    //   expect(review_model.get_block(5).getAttribute('class')).toContain("active")
    //   expect(review_model.chart.isDisplayed()).toEqual(true)
    // })

    // it("should go back to forth inclass stage", function(){
    //   review_model.previous()
    //   expect(review_model.lecture_title).toEqual("PI lecture1 video quizzes")
    //   expect(review_model.quiz_title).toEqual("PI MCQ QUIZ")
    //   expect(review_model.connected_blocks.count()).toEqual(5)
    //   expect(review_model.get_block_text(1)).toEqual("Intro")
    //   expect(review_model.get_block_text(2)).toEqual("Self")
    //   expect(review_model.get_block_text(3)).toEqual("Group")
    //   expect(review_model.get_block_text(4)).toEqual("Discussion")
    //   expect(review_model.get_block_text(5)).toEqual("")
    //   expect(review_model.get_block(5).getAttribute('class')).toContain("small_circles")
    //   expect(review_model.get_block(4).getAttribute('class')).toContain("active")
    //   expect(review_model.chart.isDisplayed()).toEqual(true)
    // })

    // it("should go back to third inclass stage", function(){
    //   review_model.previous()
    //   expect(review_model.lecture_title).toEqual("PI lecture1 video quizzes")
    //   expect(review_model.quiz_title).toEqual("PI MCQ QUIZ")
    //   expect(review_model.connected_blocks.count()).toEqual(5)
    //   expect(review_model.get_block_text(1)).toEqual("Intro")
    //   expect(review_model.get_block_text(2)).toEqual("Self")
    //   expect(review_model.get_block_text(3)).toEqual("Group")
    //   expect(review_model.get_block_text(4)).toEqual("Discussion")
    //   expect(review_model.get_block_text(5)).toEqual("")
    //   expect(review_model.get_block(5).getAttribute('class')).toContain("small_circles")
    //   expect(review_model.get_block(3).getAttribute('class')).toContain("active")
    //   expect(review_model.chart.isDisplayed()).toEqual(false)
    // })

    // it("should go back to second inclass stage", function(){
    //   review_model.previous()
    //   expect(review_model.lecture_title).toEqual("PI lecture1 video quizzes")
    //   expect(review_model.quiz_title).toEqual("PI MCQ QUIZ")
    //   expect(review_model.connected_blocks.count()).toEqual(5)
    //   expect(review_model.get_block_text(1)).toEqual("Intro")
    //   expect(review_model.get_block_text(2)).toEqual("Self")
    //   expect(review_model.get_block_text(3)).toEqual("Group")
    //   expect(review_model.get_block_text(4)).toEqual("Discussion")
    //   expect(review_model.get_block_text(5)).toEqual("")
    //   expect(review_model.get_block(5).getAttribute('class')).toContain("small_circles")
    //   expect(review_model.get_block(2).getAttribute('class')).toContain("active")
    //   expect(review_model.chart.isDisplayed()).toEqual(false)
    // })

    // it("should go back to first inclass stage", function(){
    //   review_model.previous()
    //   expect(review_model.lecture_title).toEqual("PI lecture1 video quizzes")
    //   expect(review_model.quiz_title).toEqual("PI MCQ QUIZ")
    //   expect(review_model.connected_blocks.count()).toEqual(5)
    //   expect(review_model.get_block_text(1)).toEqual("Intro")
    //   expect(review_model.get_block_text(2)).toEqual("Self")
    //   expect(review_model.get_block_text(3)).toEqual("Group")
    //   expect(review_model.get_block_text(4)).toEqual("Discussion")
    //   expect(review_model.get_block_text(5)).toEqual("")
    //   expect(review_model.get_block(5).getAttribute('class')).toContain("small_circles")
    //   expect(review_model.get_block(1).getAttribute('class')).toContain("active")
    //   expect(review_model.chart.isDisplayed()).toEqual(false)
    // })

    // it("should try to go to stage before first", function(){
    //   review_model.previous()
    //   expect(review_model.lecture_title).toEqual("PI lecture1 video quizzes")
    //   expect(review_model.quiz_title).toEqual("PI MCQ QUIZ")
    //   expect(review_model.connected_blocks.count()).toEqual(5)
    //   expect(review_model.get_block_text(1)).toEqual("Intro")
    //   expect(review_model.get_block_text(2)).toEqual("Self")
    //   expect(review_model.get_block_text(3)).toEqual("Group")
    //   expect(review_model.get_block_text(4)).toEqual("Discussion")
    //   expect(review_model.get_block_text(5)).toEqual("")
    //   expect(review_model.get_block(5).getAttribute('class')).toContain("small_circles")
    //   expect(review_model.get_block(1).getAttribute('class')).toContain("active")
    //   expect(review_model.chart.isDisplayed()).toEqual(false)
    // })
  })
})
