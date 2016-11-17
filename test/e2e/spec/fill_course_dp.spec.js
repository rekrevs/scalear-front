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

var q1_x = 169;
var q1_y = 127;

var q2_x = 169;
var q2_y = 157;

var q3_x = 169;
var q3_y = 187;

var d_q1_x = 169;
var d_q1_y = 70;

var d_q2_x = 169;
var d_q2_y = 130;

var d_q3_x = 169;
var d_q3_y = 190;


describe("Filling Course", function() {
  describe("Teacher", function() {
    var module_count
    var video_percent
    it("should login", function() {
      login_page.sign_in(params.teacher1.email, params.password)
    })

    it("should open course", function() {
      course_list.open()
      course_list.open_teacher_course(2)
    })
    it("should go to edit mode", function() {
      sub_header.open_edit_mode()
    })

    it("should create Distance modules", function() {
      navigator.modules.count().then(function(count) {
        module_count = count
        course_editor.add_module();
        course_editor.rename_module("Distance module 1")
        expect(navigator.modules.count()).toEqual(++module_count)
      })
    })

    it("should add items to the PI module", function() {
      browser.refresh()
      var module = navigator.module(module_count)
      module.open_content_items()
      content_items.add_dist_video()
      course_editor.rename_item("Distance lecture1 video quizzes")
      course_editor.change_item_url(params.url1)

      // module.open_content_items()
      // content_items.add_dist_video()
      // course_editor.rename_item("Distance lecture2 text quizzes")
      // course_editor.change_item_url(params.url1)

      // module.open_content_items()
      // content_items.add_dist_video()
      // course_editor.rename_item("Distance lecture3 video surveys")
      // course_editor.change_item_url(params.url1)
    })

    it("should open first lecture in Distance module", function() {
      // navigator.module(module_count).open()
      navigator.module(module_count).item(1).open()
      sleep(3000)
      browser.refresh()
      navigator.close()
    })

    it("should expect non-quiz element are hidden", function() {
      expect(invideo_quiz.editor_panel.isPresent()).toEqual(false);
      expect(invideo_quiz.start_handle.isPresent()).toEqual(false);
      expect(invideo_quiz.quiz_handle.isPresent()).toEqual(false);
      expect(invideo_quiz.end_handle.isPresent()).toEqual(false);
      expect(course_editor.preview_inclass_button.isDisplayed()).toEqual(false)
    })

    video_percent = 10
    it("should add video quizzes", function() {
      video.seek(video_percent)
      invideo_quiz.create(invideo_quiz.mcq)
    })
    it("should expect quiz elements to be visible", function() {
      expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
      expect(invideo_quiz.start_handle.isDisplayed()).toEqual(true);
      expect(invideo_quiz.quiz_handle.isDisplayed()).toEqual(true);
      expect(invideo_quiz.end_handle.isDisplayed()).toEqual(true);
      expect(invideo_quiz.start_checkbox.isSelected()).toEqual(true)
      expect(invideo_quiz.end_checkbox.isSelected()).toEqual(true)
      expect(course_editor.preview_inclass_button.isDisplayed()).toEqual(true)
    })
    it("should rename and add answers to quiz", function() {
      invideo_quiz.rename("Distance MCQ QUIZ")
      invideo_quiz.add_answer(q1_x, q1_y)
      invideo_quiz.mark_correct()
      invideo_quiz.type_explanation("explanation 1")
      invideo_quiz.hide_popover()
      invideo_quiz.add_answer(q2_x, q2_y)
      invideo_quiz.type_explanation("explanation 2")
      invideo_quiz.hide_popover()
      invideo_quiz.add_answer(q3_x, q3_y)
      invideo_quiz.mark_correct()
      invideo_quiz.type_explanation("explanation 3")
    })
    it("should save quiz", function() {
      invideo_quiz.save_quiz()
    })
    it("should expect non-quiz element are hidden after save", function() {
      expect(invideo_quiz.editor_panel.isPresent()).toEqual(false);
      expect(invideo_quiz.start_handle.isPresent()).toEqual(false);
      expect(invideo_quiz.quiz_handle.isPresent()).toEqual(false);
      expect(invideo_quiz.end_handle.isPresent()).toEqual(false);
      expect(course_editor.preview_inclass_button.isDisplayed()).toEqual(false)
    })

    it("should have correct number of quiz events in progress bar", function() {
      sleep(2000)
      expect(video.quizzes_events.count()).toEqual(1)
    })

    it("should have correct number of quiz events in progress bar", function() {
      sleep(2000)
      expect(video.quizzes_events.count()).toEqual(1)
    })

    it("should open quiz from progress bar", function() {
      video.seek(20)
      video.open_quiz(1)
    })
    it("should expect quiz elements to be visible", function() {
      expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
      expect(invideo_quiz.start_handle.isDisplayed()).toEqual(true);
      expect(invideo_quiz.quiz_handle.isDisplayed()).toEqual(true);
      expect(invideo_quiz.end_handle.isDisplayed()).toEqual(true);
      expect(invideo_quiz.start_checkbox.isSelected()).toEqual(true)
      expect(invideo_quiz.end_checkbox.isSelected()).toEqual(true)
      expect(course_editor.preview_inclass_button.isDisplayed()).toEqual(true)
    })
    it("should go to the correct quiz time", function() {
      var total_duration = utils.calculate_duration(params.video1.duration)
      var quiz_time_string = utils.percent_to_time_string(video_percent, total_duration)
      expect(video.current_time).toEqual(quiz_time_string)
      expect(invideo_quiz.time).toEqual("0" + quiz_time_string)
      expect(invideo_quiz.self_time).toEqual("00:02:00")
      expect(invideo_quiz.group_time).toEqual("00:02:00")
    })

    it("should display preview inclass panel", function() {
      expect(course_editor.preview_inclass_panel.isPresent()).toEqual(false)
      course_editor.open_preview_inclass()
      sleep(3000)
      expect(course_editor.preview_inclass_panel.isPresent()).toEqual(true)
      expect(course_editor.inclass_prev_button.isDisplayed()).toEqual(true)
      expect(course_editor.inclass_next_button.isDisplayed()).toEqual(true)
    })

    var total_duration = utils.calculate_duration(params.video1.duration)
    var offset = 4.9
    var quiz_time_string = utils.percent_to_time_string(video_percent, total_duration)
    var start_time_string = '0:00:13'//utils.percent_to_time_string(video_percent - offset, total_duration)
    var end_time_string = '0:00:42'//utils.percent_to_time_string(video_percent + offset, total_duration)

    it("should go through the preview inclass stages", function() {
      expect(video.current_time).toEqual(start_time_string)
      course_editor.inclass_next()
      expect(video.current_time).toEqual(quiz_time_string)
      course_editor.inclass_next()
      expect(video.current_time).toEqual(quiz_time_string)
      course_editor.inclass_next()
      expect(video.current_time).toEqual(quiz_time_string)
      course_editor.inclass_next()
      expect(video.current_time).toEqual(end_time_string)
      course_editor.inclass_next()
      expect(video.current_time).toEqual(end_time_string)
    })

    it("should go through the preview inclass stages", function() {
      course_editor.inclass_prev()
      expect(video.current_time).toEqual(quiz_time_string)
      course_editor.inclass_prev()
      expect(video.current_time).toEqual(quiz_time_string)
      course_editor.inclass_prev()
      expect(video.current_time).toEqual(quiz_time_string)
      course_editor.inclass_prev()
      expect(video.current_time).toEqual(start_time_string)
      course_editor.inclass_prev()
      expect(video.current_time).toEqual(start_time_string)
    })

    it("should logout", function() {
      header.logout()
    })


  })
})
