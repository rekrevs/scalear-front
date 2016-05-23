var ContentNavigator = require('./pages/content_navigator');
var CourseEditor = require('./pages/course_editor');
var CourseList = require('./pages/course_list');
var InvideoQuiz = require('./pages/invideo_quiz');
var NormalQuiz = require('./pages/normal_quiz');
var Video = require('./pages/video');
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
    it("should login", function() {
      login_page.sign_in(params.teacher1.email, params.password)
    })

    it("should open course", function() {
      course_list.open()
      course_list.open_course(1)
    })
    it("should go to edit mode", function() {
      sub_header.open_edit_mode()
    })

    // it("should create PI modules", function() {
    //   navigator.modules.count().then(function(count) {
    //     module_count = count
    //     course_editor.add_module();
    //     course_editor.rename_module("PI module 1")
    //     expect(navigator.modules.count()).toEqual(++module_count)
    //   })
    // })

    // it("should add items to the PI module", function() {
    //   // var module_count = navigator.modules.count()
    //   browser.refresh()
    //   var module = navigator.module(module_count)
    //   // module.open()
    //   module.open_content_items()
    //   content_items.add_pi_video()
    //   course_editor.rename_item("PI lecture1 video quizzes")
    //   course_editor.change_item_url(params.url1)

    //   module.open_content_items()
    //   content_items.add_pi_video()
    //   course_editor.rename_item("PI lecture2 text quizzes")
    //   course_editor.change_item_url(params.url1)

    //   module.open_content_items()
    //   content_items.add_pi_video()
    //   course_editor.rename_item("PI lecture3 video surveys")
    //   course_editor.change_item_url(params.url1)
    // })

    it("should open second lecture in first module", function() {
      module_count = 3
      navigator.module(module_count).open()
      navigator.module(module_count).item(1).open()
      browser.refresh()
    })

    it("should add video quizzes", function() {
      video.seek(10)
      expect(invideo_quiz.start_handle.isPresent()).toEqual(false);
      expect(invideo_quiz.quiz_handle.isPresent()).toEqual(false);
      expect(invideo_quiz.end_handle.isPresent()).toEqual(false);
      invideo_quiz.create(invideo_quiz.mcq)
      expect(invideo_quiz.start_handle.isDisplayed()).toEqual(true);
      expect(invideo_quiz.quiz_handle.isDisplayed()).toEqual(true);
      expect(invideo_quiz.end_handle.isDisplayed()).toEqual(true);
      invideo_quiz.rename("PI MCQ QUIZ")
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
      invideo_quiz.save_quiz()
      expect(invideo_quiz.editor_panel.isPresent()).toEqual(false);
      expect(invideo_quiz.start_handle.isPresent()).toEqual(false);
      expect(invideo_quiz.quiz_handle.isPresent()).toEqual(false);
      expect(invideo_quiz.end_handle.isPresent()).toEqual(false);

      // video.seek(20)
      // invideo_quiz.create(invideo_quiz.ocq)
      // expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
      // invideo_quiz.rename("OCQ QUIZ")
      // invideo_quiz.add_answer(q1_x, q1_y)
      // invideo_quiz.type_explanation("explanation 1")
      // invideo_quiz.hide_popover()
      // invideo_quiz.add_answer(q2_x, q2_y)
      // invideo_quiz.mark_correct()
      // invideo_quiz.type_explanation("explanation 2")
      // invideo_quiz.hide_popover()
      // invideo_quiz.add_answer(q3_x, q3_y)
      // invideo_quiz.type_explanation("explanation 3")
      // invideo_quiz.hide_popover()
      // invideo_quiz.save_quiz()
      // expect(invideo_quiz.editor_panel.isPresent()).toEqual(false);

      // video.seek(30)
      // invideo_quiz.create(invideo_quiz.drag)
      // expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
      // invideo_quiz.rename("DRAG QUIZ")
      // scroll_top()
      // invideo_quiz.add_answer_drag(d_q1_x, d_q1_y)
      // invideo_quiz.hide_popover()
      // invideo_quiz.add_answer_drag(d_q2_x, d_q2_y)
      // invideo_quiz.hide_popover()
      // invideo_quiz.add_answer_drag(d_q3_x, d_q3_y)
      // invideo_quiz.hide_popover()
      // invideo_quiz.save_quiz()
      // expect(invideo_quiz.editor_panel.isPresent()).toEqual(false);
    })

  })
})
