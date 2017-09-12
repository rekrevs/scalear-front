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
var MarkerPanel = require('./pages/marker');


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
var marker = new MarkerPanel();

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
    it("should login", function() {
      login_page.sign_in(params.teacher1.email, params.password)
    })
    it("should open course", function() {
      course_list.open()
      course_list.open_teacher_course(1)
    })
    it("should go to edit mode", function() {
      sub_header.open_edit_mode()
    })
    describe("Create Modules",function(){
      it("should create modules", function() {
        expect(navigator.modules.count()).toEqual(0)
        course_editor.add_module();
        course_editor.rename_module("module 1")
        expect(navigator.modules.count()).toEqual(1)
        navigator.add_module();
        course_editor.rename_module("module 2")
        expect(navigator.modules.count()).toEqual(2)
      })

      it("should add items to the first module", function() {
        var module = navigator.module(1)
        module.open()
        module.open_content_items()
        content_items.add_video()
          // sleep(5000)
        course_editor.rename_item("lecture1 video quizzes")
        course_editor.change_item_url(params.url1)
          // video.wait_till_ready()

        module.open_content_items()
        content_items.add_video()
        course_editor.rename_item("lecture2 text quizzes")
        course_editor.change_item_url(params.url1)
          // video.wait_till_ready()

        module.open_content_items()
        content_items.add_video()
        course_editor.rename_item("lecture3 video surveys")
        course_editor.change_item_url(params.url1)
          // video.wait_till_ready()

        module.open_content_items()
        content_items.add_quiz()
        course_editor.rename_item("quiz1")

        module.open_content_items()
        content_items.add_quiz()
        course_editor.rename_item("quiz2")

        module.open_content_items()
        content_items.add_survey()
        course_editor.rename_item("survey1")
      })

      it("should add items to the second module", function() {
        var module = navigator.module(2)
        module.open()
        module.open_content_items()
        content_items.add_video()
        course_editor.rename_item("lecture4 video quizzes")
        course_editor.change_item_url(params.url1)
          // video.wait_till_ready()

        module.open_content_items()
        content_items.add_video()
        course_editor.rename_item("lecture5 text quizzes")
        course_editor.change_item_url(params.url1)
          // video.wait_till_ready()

        module.open_content_items()
        content_items.add_video()
        course_editor.rename_item("lecture6 video surveys")
        course_editor.change_item_url(params.url1)
          // video.wait_till_ready()

        module.open_content_items()
        content_items.add_quiz()
        course_editor.rename_item("quiz3")

        module.open_content_items()
        content_items.add_quiz()
        course_editor.rename_item("quiz4")

        module.open_content_items()
        content_items.add_survey()
        course_editor.rename_item("survey2")
      })
    })
    describe("First Lecture",function(){
        it("should open first lecture in first module", function() {
            navigator.module(1).open()
            navigator.module(1).item(1).open()
            navigator.close()
        })
        it("should add video quizzes", function() {
            video.seek(10)
            invideo_quiz.create(invideo_quiz.mcq)
            expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
            invideo_quiz.rename("MCQ QUIZ")
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
            video.seek(20)
            invideo_quiz.create(invideo_quiz.ocq)
            expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
            invideo_quiz.rename("OCQ QUIZ")
            invideo_quiz.add_answer(q1_x, q1_y)
            invideo_quiz.type_explanation("explanation 1")
            invideo_quiz.hide_popover()
            invideo_quiz.add_answer(q2_x, q2_y)
            invideo_quiz.mark_correct()
            invideo_quiz.type_explanation("explanation 2")
            invideo_quiz.hide_popover()
            invideo_quiz.add_answer(q3_x, q3_y)
            invideo_quiz.type_explanation("explanation 3")
            invideo_quiz.hide_popover()
            invideo_quiz.save_quiz()
            expect(invideo_quiz.editor_panel.isPresent()).toEqual(false);
            video.seek(30)
            video.current_time.then(function(result){expect(result).toEqual("0:00:00")} )
            invideo_quiz.create(invideo_quiz.drag)
            expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
            invideo_quiz.rename("DRAG QUIZ")
            scroll_top()
            invideo_quiz.add_answer_drag(d_q1_x, d_q1_y)
            invideo_quiz.hide_popover()
            invideo_quiz.add_answer_drag(d_q2_x, d_q2_y)
            invideo_quiz.hide_popover()
            invideo_quiz.add_answer_drag(d_q3_x, d_q3_y)
            invideo_quiz.hide_popover()
            invideo_quiz.save_quiz()
            expect(invideo_quiz.editor_panel.isPresent()).toEqual(false);
        })
        
        it("should open second lecture in first module", function() {
            navigator.open()
            navigator.module(1).open()
            navigator.module(1).item(2).open()
            navigator.close()
        })
        
        it("should add video text quizzes", function() {
            video.seek(10)
            invideo_quiz.create(invideo_quiz.mcq_text)
            expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
            invideo_quiz.rename('MCQ TEXT QUIZ')
            invideo_quiz.type_text_answer(1, "answer 1")
            invideo_quiz.type_text_explanation(1, "explanation 1")
            invideo_quiz.text_answer_correct(1)
            invideo_quiz.add_text_answer()
            invideo_quiz.type_text_answer(2, "answer 2")
            invideo_quiz.type_text_explanation(2, "explanation 2")
            invideo_quiz.add_text_answer()
            invideo_quiz.type_text_answer(3, "answer 3")
            invideo_quiz.type_text_explanation(3, "explanation 3")
            invideo_quiz.text_answer_correct(3)
            invideo_quiz.save_quiz()
            expect(invideo_quiz.editor_panel.isPresent()).toEqual(false);
            video.seek(20)
            invideo_quiz.create(invideo_quiz.ocq_text)
            expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
            invideo_quiz.rename('OCQ TEXT QUIZ')
            invideo_quiz.type_text_answer(1, "answer 1")
            invideo_quiz.type_text_explanation(1, "explanation 1")
            invideo_quiz.add_text_answer()
            invideo_quiz.type_text_answer(2, "answer 2")
            invideo_quiz.type_text_explanation(2, "explanation 2")
            invideo_quiz.text_answer_correct(2)
            invideo_quiz.add_text_answer()
            invideo_quiz.type_text_answer(3, "answer 3")
            invideo_quiz.type_text_explanation(3, "explanation 3")
            invideo_quiz.save_quiz()
            expect(invideo_quiz.editor_panel.isPresent()).toEqual(false);
            video.seek(30)
            invideo_quiz.create(invideo_quiz.drag_text)
            expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
            invideo_quiz.rename('DRAG TEXT QUIZ')
            invideo_quiz.type_text_answer(1, "answer 1")
            invideo_quiz.add_text_answer()
            invideo_quiz.type_text_answer(2, "answer 2")
            invideo_quiz.add_text_answer()
            invideo_quiz.type_text_answer(3, "answer 3")
            invideo_quiz.save_quiz()
            expect(invideo_quiz.editor_panel.isPresent()).toEqual(false);
        })
        it("should open third lecture in first module", function() {
            navigator.open()
            navigator.module(1).open()
            navigator.module(1).item(3).open()
            navigator.close()
        })
        it("should add video surveys", function() {
            video.seek(10)
            invideo_quiz.create(invideo_quiz.mcq_survey)
            expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
            invideo_quiz.rename('MCQ SURVEY')
            invideo_quiz.add_answer(q1_x, q1_y)
            invideo_quiz.hide_popover()
            invideo_quiz.add_answer(q2_x, q2_y)
            invideo_quiz.hide_popover()
            invideo_quiz.add_answer(q3_x, q3_y)
            invideo_quiz.hide_popover()
            invideo_quiz.save_quiz()
            expect(invideo_quiz.editor_panel.isPresent()).toEqual(false);
            sleep(5000)

            video.seek(20)
            invideo_quiz.create(invideo_quiz.ocq_survey)
            expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
            invideo_quiz.rename('OCQ SURVEY')
            invideo_quiz.add_answer(q1_x, q1_y)
            invideo_quiz.hide_popover()
            invideo_quiz.add_answer(q2_x, q2_y)
            invideo_quiz.hide_popover()
            invideo_quiz.add_answer(q3_x, q3_y)
            invideo_quiz.hide_popover()
            invideo_quiz.save_quiz()
            expect(invideo_quiz.editor_panel.isPresent()).toEqual(false);
            sleep(5000)
        })
        it("should open first quiz in first module", function() {
            navigator.open()
            navigator.module(1).open()
            navigator.module(1).item(4).open()
        })

        it("should add questions to quiz", function() {
            expect(quiz.questions.count()).toEqual(0)
            quiz.add_header()
            expect(quiz.questions.count()).toEqual(1)
            quiz.type_header('first header')

            quiz.add_question()
            expect(quiz.questions.count()).toEqual(2)
            var question = quiz.question(2)
            expect(question.answers.count()).toEqual(1)
            question.type_title('mcq question')
            question.type_answer("answer 1")
            question.correct_answer()
            question.add_answer()
            question.type_answer("answer 2")
            question.add_answer()
            question.type_answer("answer 3")
            question.correct_answer()
            expect(question.answers.count()).toEqual(3)

            quiz.add_header()
            expect(quiz.questions.count()).toEqual(3)
            quiz.type_header('second header')

            quiz.add_question()
            expect(quiz.questions.count()).toEqual(4)
            var question = quiz.question(4)
            expect(question.answers.count()).toEqual(1)
            question.type_title('ocq question')
            question.change_type_ocq()
            question.type_answer("answer 1")
            question.correct_answer()
            question.add_answer()
            question.type_answer("answer 2")
            question.add_answer()
            question.type_answer("answer 3")
            expect(question.answers.count()).toEqual(3)

            quiz.add_question()
            expect(quiz.questions.count()).toEqual(5)
            var question = quiz.question(5)
            question.type_title('free question')
            question.change_type_free_text()

            quiz.add_question()
            expect(quiz.questions.count()).toEqual(6)
            var question = quiz.question(6)
            question.type_title('match question')
            question.change_type_match_text()
            question.type_free_answer('match answer')

            quiz.add_question()
            expect(quiz.questions.count()).toEqual(7)
            var question = quiz.question(7)
            expect(question.answers.count()).toEqual(1)
            question.type_title('drag question')
            question.change_type_drag()
            question.type_answer("answer 1")
            question.add_answer()
            question.type_answer("answer 2")
            question.add_answer()
            question.type_answer("answer 3")
            expect(question.answers.count()).toEqual(3)

            quiz.publish()
            quiz.save()
        })

        it("should open second quiz in first module", function() {
            navigator.module(1).open()
            navigator.module(1).item(5).open()
        })

        it("should add questions to quiz", function() {
            expect(quiz.questions.count()).toEqual(0)
            quiz.add_header()
            expect(quiz.questions.count()).toEqual(1)
            quiz.type_header('first header')

            quiz.add_question()
            expect(quiz.questions.count()).toEqual(2)
            var question = quiz.question(2)
            question.type_title('mcq question')
            question.type_answer("answer 1")
            question.correct_answer()
            question.add_answer()
            question.type_answer("answer 2")
            question.add_answer()
            question.type_answer("answer 3")
            question.correct_answer()

            quiz.add_header()
            expect(quiz.questions.count()).toEqual(3)
            quiz.type_header('second header')

            quiz.add_question()
            expect(quiz.questions.count()).toEqual(4)
            var question = quiz.question(4)
            question.type_title('ocq question')
            question.change_type_ocq()
            question.type_answer("answer 1")
            question.correct_answer()
            question.add_answer()
            question.type_answer("answer 2")
            question.add_answer()
            question.type_answer("answer 3")

            quiz.add_question()
            expect(quiz.questions.count()).toEqual(5)
            var question = quiz.question(5)
            question.type_title('free question')
            question.change_type_free_text()

            quiz.add_question()
            expect(quiz.questions.count()).toEqual(6)
            var question = quiz.question(6)
            question.type_title('match question')
            question.change_type_match_text()
            question.type_free_answer('match answer')

            quiz.add_question()
            expect(quiz.questions.count()).toEqual(7)
            var question = quiz.question(7)
            question.type_title('drag question')
            question.change_type_drag()
            question.type_answer("answer 1")
            question.add_answer()
            question.type_answer("answer 2")
            question.add_answer()
            question.type_answer("answer 3")

            quiz.publish()
            quiz.save()
        })

        it("should open survey in first module", function() {
            navigator.module(1).open()
            navigator.module(1).item(6).open()
        })

        it("should add questions to survey", function() {
            expect(quiz.questions.count()).toEqual(0)
            quiz.add_header()
            expect(quiz.questions.count()).toEqual(1)
            quiz.type_header('first header')

            quiz.add_question()
            expect(quiz.questions.count()).toEqual(2)
            var question = quiz.question(2)
            question.type_title('mcq question')
            question.type_answer("answer 1")
            question.add_answer()
            question.type_answer("answer 2")
            question.add_answer()
            question.type_answer("answer 3")

            quiz.add_header()
            expect(quiz.questions.count()).toEqual(3)
            quiz.type_header('second header')

            quiz.add_question()
            expect(quiz.questions.count()).toEqual(4)
            var question = quiz.question(4)
            question.type_title('ocq question')
            question.change_type_ocq()
            question.type_answer("answer 1")
            question.add_answer()
            question.type_answer("answer 2")
            question.add_answer()
            question.type_answer("answer 3")

            quiz.add_question()
            expect(quiz.questions.count()).toEqual(5)
            var question = quiz.question(5)
            question.type_title('free question')
            question.change_type_free_text()

            quiz.publish()
            quiz.save()
        })
    })
    /////////////////////////////////////
    describe("Second Lecture",function(){
        it("should open first lecture in second module", function() {
            // browser.refresh()
            navigator.module(2).open()
            navigator.module(2).item(1).open()
            navigator.close()
        })
        it("should add video quizzes", function() {
            video.seek(10)
            invideo_quiz.create(invideo_quiz.mcq)
            expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
            invideo_quiz.rename("MCQ QUIZ")
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

            video.seek(20)
            invideo_quiz.create(invideo_quiz.ocq)
            expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
            invideo_quiz.rename("OCQ QUIZ")
            invideo_quiz.add_answer(q1_x, q1_y)
            invideo_quiz.type_explanation("explanation 1")
            invideo_quiz.hide_popover()
            invideo_quiz.add_answer(q2_x, q2_y)
            invideo_quiz.mark_correct()
            invideo_quiz.type_explanation("explanation 2")
            invideo_quiz.hide_popover()
            invideo_quiz.add_answer(q3_x, q3_y)
            invideo_quiz.type_explanation("explanation 3")
            invideo_quiz.hide_popover()
            invideo_quiz.save_quiz()

            video.seek(30)
            invideo_quiz.create(invideo_quiz.drag)
            expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
            invideo_quiz.rename("DRAG QUIZ")
            scroll_top()
            invideo_quiz.add_answer(d_q1_x, d_q1_y)
            invideo_quiz.hide_popover()
            invideo_quiz.add_answer(d_q2_x, d_q2_y)
            invideo_quiz.hide_popover()
            invideo_quiz.add_answer(d_q3_x, d_q3_y)
            invideo_quiz.hide_popover()
            invideo_quiz.save_quiz()
          })
        
        it("should open second lecture in second module", function() {
            navigator.open()
            navigator.module(2).open()
            navigator.module(2).item(2).open()
            navigator.close()
        })

        it("should add video text quizzes", function() {
            video.seek(10)
            invideo_quiz.create(invideo_quiz.mcq_text)
            invideo_quiz.rename('MCQ TEXT QUIZ')
            invideo_quiz.type_text_answer(1, "answer 1")
            invideo_quiz.type_text_explanation(1, "explanation 1")
            invideo_quiz.text_answer_correct(1)
            invideo_quiz.add_text_answer()
            invideo_quiz.type_text_answer(2, "answer 2")
            invideo_quiz.type_text_explanation(2, "explanation 2")
            invideo_quiz.add_text_answer()
            invideo_quiz.type_text_answer(3, "answer 3")
            invideo_quiz.type_text_explanation(3, "explanation 3")
            invideo_quiz.text_answer_correct(3)
            invideo_quiz.save_quiz()

            video.seek(20)
            invideo_quiz.create(invideo_quiz.ocq_text)
            invideo_quiz.rename('OCQ TEXT QUIZ')
            invideo_quiz.type_text_answer(1, "answer 1")
            invideo_quiz.type_text_explanation(1, "explanation 1")
            invideo_quiz.add_text_answer()
            invideo_quiz.type_text_answer(2, "answer 2")
            invideo_quiz.type_text_explanation(2, "explanation 2")
            invideo_quiz.text_answer_correct(2)
            invideo_quiz.add_text_answer()
            invideo_quiz.type_text_answer(3, "answer 3")
            invideo_quiz.type_text_explanation(3, "explanation 3")
            invideo_quiz.save_quiz()

            video.seek(30)
            invideo_quiz.create(invideo_quiz.drag_text)
            invideo_quiz.rename('DRAG TEXT QUIZ')
            invideo_quiz.type_text_answer(1, "answer 1")
            invideo_quiz.add_text_answer()
            invideo_quiz.type_text_answer(2, "answer 2")
            invideo_quiz.add_text_answer()
            invideo_quiz.type_text_answer(3, "answer 3")
            invideo_quiz.save_quiz()
        })

        it("should open third lecture in second module", function() {
            navigator.open()
            navigator.module(2).open()
            navigator.module(2).item(3).open()
            navigator.close()
        })

        it("should add video surveys", function() {
            video.seek(10)
            invideo_quiz.create(invideo_quiz.mcq_survey)
            invideo_quiz.rename('MCQ SURVEY')
            invideo_quiz.add_answer(q1_x, q1_y)
            invideo_quiz.hide_popover()
            invideo_quiz.add_answer(q2_x, q2_y)
            invideo_quiz.hide_popover()
            invideo_quiz.add_answer(q3_x, q3_y)
            invideo_quiz.hide_popover()
            invideo_quiz.save_quiz()

            video.seek(20)
            invideo_quiz.create(invideo_quiz.ocq_survey)
            invideo_quiz.rename('OCQ SURVEY')
            invideo_quiz.add_answer(q1_x, q1_y)
            invideo_quiz.hide_popover()
            invideo_quiz.add_answer(q2_x, q2_y)
            invideo_quiz.hide_popover()
            invideo_quiz.add_answer(q3_x, q3_y)
            invideo_quiz.hide_popover()
            invideo_quiz.save_quiz()
        })

        it("should open quiz in second module", function() {
            navigator.open()
            navigator.module(2).open()
            navigator.module(2).item(4).open()
        })

        it("should add questions to quiz", function() {
            expect(quiz.questions.count()).toEqual(0)
            quiz.add_header()
            expect(quiz.questions.count()).toEqual(1)
            quiz.type_header('first header')

            quiz.add_question()
            expect(quiz.questions.count()).toEqual(2)
            var question = quiz.question(2)
            question.type_title('mcq question')
            question.type_answer("answer 1")
            question.correct_answer()
            question.add_answer()
            question.type_answer("answer 2")
            question.add_answer()
            question.type_answer("answer 3")
            question.correct_answer()

            quiz.add_header()
            expect(quiz.questions.count()).toEqual(3)
            quiz.type_header('second header')

            quiz.add_question()
            expect(quiz.questions.count()).toEqual(4)
            var question = quiz.question(4)
            question.type_title('ocq question')
            question.change_type_ocq()
            question.type_answer("answer 1")
            question.correct_answer()
            question.add_answer()
            question.type_answer("answer 2")
            question.add_answer()
            question.type_answer("answer 3")

            quiz.add_question()
            expect(quiz.questions.count()).toEqual(5)
            var question = quiz.question(5)
            question.type_title('free question')
            question.change_type_free_text()

            quiz.add_question()
            expect(quiz.questions.count()).toEqual(6)
            var question = quiz.question(6)
            question.type_title('match question')
            question.change_type_match_text()
            question.type_free_answer('match answer')

            quiz.add_question()
            expect(quiz.questions.count()).toEqual(7)
            var question = quiz.question(7)
            question.type_title('drag question')
            question.change_type_drag()
            question.type_answer("answer 1")
            question.add_answer()
            question.type_answer("answer 2")
            question.add_answer()
            question.type_answer("answer 3")

            quiz.publish()
            quiz.save()

        })

        it("should open second quiz in second module", function() {
            navigator.module(2).open()
            navigator.module(2).item(5).open()
        })

        it("should add questions to quiz", function() {
            expect(quiz.questions.count()).toEqual(0)
            quiz.add_header()
            expect(quiz.questions.count()).toEqual(1)
            quiz.type_header('first header')

            quiz.add_question()
            expect(quiz.questions.count()).toEqual(2)
            var question = quiz.question(2)
            question.type_title('mcq question')
            question.type_answer("answer 1")
            question.correct_answer()
            question.add_answer()
            question.type_answer("answer 2")
            question.add_answer()
            question.type_answer("answer 3")
            question.correct_answer()

            quiz.add_header()
            expect(quiz.questions.count()).toEqual(3)
            quiz.type_header('second header')

            quiz.add_question()
            expect(quiz.questions.count()).toEqual(4)
            var question = quiz.question(4)
            question.type_title('ocq question')
            question.change_type_ocq()
            question.type_answer("answer 1")
            question.correct_answer()
            question.add_answer()
            question.type_answer("answer 2")
            question.add_answer()
            question.type_answer("answer 3")

            quiz.add_question()
            expect(quiz.questions.count()).toEqual(5)
            var question = quiz.question(5)
            question.type_title('free question')
            question.change_type_free_text()

            quiz.add_question()
            expect(quiz.questions.count()).toEqual(6)
            var question = quiz.question(6)
            question.type_title('match question')
            question.change_type_match_text()
            question.type_free_answer('match answer')

            quiz.add_question()
            expect(quiz.questions.count()).toEqual(7)
            var question = quiz.question(7)
            question.type_title('drag question')
            question.change_type_drag()
            question.type_answer("answer 1")
            question.add_answer()
            question.type_answer("answer 2")
            question.add_answer()
            question.type_answer("answer 3")

            quiz.publish()
            quiz.save()
        })

        it("should open survey in second module", function() {
            navigator.module(2).open()
            navigator.module(2).item(6).open()
        })

        it("should add questions to survey", function() {
            expect(quiz.questions.count()).toEqual(0)
            quiz.add_header()
            expect(quiz.questions.count()).toEqual(1)
            quiz.type_header('first header')

            quiz.add_question()
            expect(quiz.questions.count()).toEqual(2)
            var question = quiz.question(2)
            question.type_title('mcq question')
            question.type_answer("answer 1")
            question.add_answer()
            question.type_answer("answer 2")
            question.add_answer()
            question.type_answer("answer 3")

            quiz.add_header()
            expect(quiz.questions.count()).toEqual(3)
            quiz.type_header('second header')

            quiz.add_question()
            expect(quiz.questions.count()).toEqual(4)
            var question = quiz.question(4)
            question.type_title('ocq question')
            question.change_type_ocq()
            question.type_answer("answer 1")
            question.add_answer()
            question.type_answer("answer 2")
            question.add_answer()
            question.type_answer("answer 3")

            quiz.add_question()
            expect(quiz.questions.count()).toEqual(5)
            var question = quiz.question(5)
            question.type_title('free question')
            question.change_type_free_text()

            quiz.publish()
            quiz.save()
        })
    })
    /////////////////////////////////////
    describe("Thrid Lecture",function(){
        it("should open course", function() {
            course_list.open()
            course_list.open_teacher_course(1)
        })
        it("should go to edit mode", function() {
            sub_header.open_edit_mode()
        })    
        it("should create modules", function() {
            expect(navigator.modules.count()).toEqual(2)
            course_editor.add_module();
            course_editor.rename_module("module 3")
            expect(navigator.modules.count()).toEqual(3)
        })
        it("should add lecture to the 3rd module", function() {
            browser.refresh()
            var module = navigator.module(3)
            module.open()
            module.open_content_items()
            content_items.add_video()
            course_editor.rename_item("lecture1 video quizzes")
            course_editor.change_item_url(params.url1)
        })
        it("should open first lecture in module module", function() {
            navigator.module(3).open()
            navigator.module(3).item(1).open()
            navigator.close()
        })
        // Case where there are no text in answers (html)
        it("Case where there are no text in answers (html)", function() {
            video.seek(20)
            invideo_quiz.create(invideo_quiz.ocq_text)
            expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
            // invideo_quiz.answer.clear()
            invideo_quiz.type_text_answer(1, "")
            // invideo_quiz.text_answer_correct(1)
            expect(invideo_quiz.text_answer(1).getText()).toEqual('');
            invideo_quiz.save_quiz()
            expect(invideo_quiz.editor_panel.isPresent()).toEqual(true);
            expect(invideo_quiz.alert.isPresent()).toEqual(true);
            browser.actions().mouseMove(invideo_quiz.alert).perform();
            expect(invideo_quiz.alert.getText()).toContain("Please correct the errors above");
            expect(invideo_quiz.errors_answers.count()).toEqual(1);        
            // expect(invideo_quiz.errors_answer(1).getText()).toContain("Required!");
            invideo_quiz.delete_from_editor()
        })
        // Case where there are no correct answers in quiz(html) 
        it("Case where there are no correct answers in quiz(html)", function() {
            video.seek(10)
            invideo_quiz.create(invideo_quiz.ocq_text)
            expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
            invideo_quiz.type_text_answer(1, "answer 1")

            invideo_quiz.save_quiz()
            expect(invideo_quiz.editor_panel.isPresent()).toEqual(true);
            expect(invideo_quiz.alert.isPresent()).toEqual(true);
            browser.actions().mouseMove(invideo_quiz.alert).perform();
            sleep(4000)
            expect(invideo_quiz.alert.getText()).toContain("Quiz doesn't have a correct answer");
            invideo_quiz.delete_from_editor()
        })   
        // Case where there are no answers in quiz (html) 
        it("Case where there are no answers in quiz (html)", function() {
            video.seek(10)
            invideo_quiz.create(invideo_quiz.ocq_text)
            expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
            invideo_quiz.type_text_answer(1, "answer 1")

            invideo_quiz.save_quiz()
            expect(invideo_quiz.editor_panel.isPresent()).toEqual(true);
            expect(invideo_quiz.alert.isPresent()).toEqual(true);
            browser.actions().mouseMove(invideo_quiz.alert).perform();
            sleep(4000)
            expect(invideo_quiz.alert.getText()).toContain("Quiz doesn't have a correct answer");
            invideo_quiz.delete_from_editor()
        })
        // Case where there are no answers in quiz (invideo) 
        it("Case where there are no answers in quiz (invideo)", function() {
            video.seek(10)
            invideo_quiz.create(invideo_quiz.mcq)
            expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
            invideo_quiz.rename("MCQ QUIZ")
            invideo_quiz.save_quiz()
            expect(invideo_quiz.editor_panel.isPresent()).toEqual(true);
            expect(invideo_quiz.alert.isPresent()).toEqual(true);
            browser.actions().mouseMove(invideo_quiz.alert).perform();
            expect(invideo_quiz.alert.getText()).toContain("Quiz doesn't have a correct answer");
            invideo_quiz.delete_from_editor()
        })
        // Case where there are no correct answers in quiz(invideo) 
        it("Case where there are no correct answers in quiz(invideo)", function() {
            video.seek(30)
            invideo_quiz.create(invideo_quiz.mcq)
            expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
            invideo_quiz.rename("MCQ QUIZ")
            expect(invideo_quiz.alert.isDisplayed()).toEqual(false);
            invideo_quiz.add_answer(q1_x, q1_y)
            invideo_quiz.hide_popover()
            invideo_quiz.add_answer(q2_x, q2_y)
            invideo_quiz.save_quiz()
            expect(invideo_quiz.editor_panel.isPresent()).toEqual(true);
            expect(invideo_quiz.alert.isDisplayed()).toEqual(true);
            browser.actions().mouseMove(invideo_quiz.alert).perform();
            expect(invideo_quiz.alert.getText()).toContain("Quiz doesn't have a correct answer");
            invideo_quiz.add_answer(q3_x, q3_y)
            invideo_quiz.mark_correct()      
            invideo_quiz.save_quiz()
            expect(invideo_quiz.editor_panel.isPresent()).toEqual(false);
            invideo_quiz.delete(1)
            expect(invideo_quiz.count).toEqual(0)
        })        
        // // Case where there are no text in answers (invideo)  COULD NOT PRODUCE IT BECAUSE OF A BUG
        // it("Case where there are no text in answers (invideo)", function() {
        //   video.seek(10)
        //   invideo_quiz.create(invideo_quiz.mcq)
        //   expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
        //   invideo_quiz.rename("MCQ QUIZ")
        //   invideo_quiz.add_answer(q1_x, q1_y)
        //   invideo_quiz.type_answer("")
        //   // invideo_quiz.answer.clear()
        //   expect(invideo_quiz.answer.getText()).toEqual('');
        //   invideo_quiz.hide_popover()
        //   invideo_quiz.save_quiz()
        //   expect(invideo_quiz.editor_panel.isPresent()).toEqual(true);
        //   expect(invideo_quiz.alert.isPresent()).toEqual(true);
        //   browser.actions().mouseMove(invideo_quiz.alert).perform();
        //   expect(invideo_quiz.alert.getText()).toContain("Please provide the answer text for each choice");
        //   invideo_quiz.delete_from_editor()
        // })              
        // it("should add video quiz", function() {
        //   video.seek(10)
        //   invideo_quiz.create(invideo_quiz.drag)
        //   expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
        //   scroll_top()
        //   invideo_quiz.add_answer_drag(d_q1_x, d_q1_y)
        //   expect(invideo_quiz.answer.getText()).toEqual(' ');
        //   invideo_quiz.answer.clear()
        //   sleep(1000)
        //   expect(invideo_quiz.answer.getText()).toEqual(' ');
        //   invideo_quiz.hide_popover()
        //   invideo_quiz.save_quiz()
        //   expect(invideo_quiz.editor_panel.isPresent()).toEqual(false);sss
        // })

        it("should add video quizzes and markers", function() {
            video.seek(10)
            sleep(1000)
            invideo_quiz.create(invideo_quiz.mcq)
            expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
            invideo_quiz.rename("MCQ QUIZ")
            invideo_quiz.add_answer(q1_x, q1_y)
            invideo_quiz.mark_correct()
            invideo_quiz.type_explanation("explanation 1")
            invideo_quiz.hide_popover()
            invideo_quiz.save_quiz()
            expect(invideo_quiz.editor_panel.isPresent()).toEqual(false);
            // sleep(3000)
        })
        it("should add video quizzes and markers", function() {
            video.seek(57)
            sleep(1000)
            marker.create_shortcut()
            marker.type_title("1st Marker")
            marker.type_annotation("1st Annotation Marker")
            marker.save_marker()
            expect(marker.editor_panel.isPresent()).toEqual(false);
            expect(marker.annotation_video.isPresent()).toEqual(false);
        })
        // Case where you add a quiz then go to another quiz 
        it("Case where you add a quiz then go to another quiz",function(){
            browser.refresh()
            video.seek(20)
            invideo_quiz.create(invideo_quiz.ocq)
            expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
            invideo_quiz.rename("OCQ QUIZ")
            invideo_quiz.add_answer(q2_x, q2_y)
            invideo_quiz.mark_correct()        
            invideo_quiz.type_explanation("explanation 1")
            invideo_quiz.hide_popover()
            invideo_quiz.save_quiz()
            expect(invideo_quiz.editor_panel.isPresent()).toEqual(false);

            invideo_quiz.quiz(1).click()
            expect(invideo_quiz.answers.count()).toEqual(1)
            invideo_quiz.rename("MCQ QUIZ updated")
            invideo_quiz.add_answer(q2_x, q2_y)
            invideo_quiz.mark_correct()
            invideo_quiz.type_explanation("explanation 2")
            invideo_quiz.hide_popover()
     
            invideo_quiz.quiz(2).click()
            expect(invideo_quiz.name.getText()).toEqual("OCQ QUIZ")
            expect(invideo_quiz.answers.count()).toEqual(1)   
            invideo_quiz.quiz(1).click()
            expect(invideo_quiz.name.getText()).toEqual("MCQ QUIZ updated")
            expect(invideo_quiz.answers.count()).toEqual(2)
        })
        // Case where you add a quiz then go to another marker 
        it("Case where you add a quiz then go to another marker",function(){

            browser.refresh()
            video.seek(34)
            sleep(1000)
            invideo_quiz.create(invideo_quiz.ocq)
            expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
            invideo_quiz.rename("OCQ QUIZ")
            invideo_quiz.add_answer(q2_x, q2_y)
            invideo_quiz.mark_correct()        
            invideo_quiz.type_explanation("explanation 1")
            invideo_quiz.hide_popover()
            invideo_quiz.save_quiz()
            expect(invideo_quiz.editor_panel.isPresent()).toEqual(false);

            marker.marker_list(1).click()
            marker.type_title("1st Marker_updated_quiz")
            ////  
            invideo_quiz.quiz(3).click()
            expect(invideo_quiz.name.getText()).toEqual("OCQ QUIZ")
            expect(invideo_quiz.answers.count()).toEqual(1)
            marker.marker_list(1).click()
            expect(marker.marker(1).text).toContain("1st Marker_updated_quiz")
            marker.save_marker()          
        })      
        // Case where you add a marker then go to another marker
        it("Case where you add a marker then go to another marker",function(){      
            video.seek(69)
            sleep(1000)
            marker.create_shortcut()
            expect(marker.editor_panel.isDisplayed()).toEqual(true);
            expect(marker.annotation_video.isPresent()).toEqual(false);      
            marker.type_title("2nd Marker")
            marker.type_annotation("2nd Annotation Marker")
            marker.save_marker()
            expect(marker.markers.count()).toEqual(2)

            marker.marker_list(1).click()
            marker.type_title("1st Marker_updated_marker")
            ////  
            marker.marker_list(2).click()
            sleep(100)
            expect(marker.marker(2).text).toContain("2nd Marker")
            marker.marker_list(1).click()
            sleep(100)
            expect(marker.marker(1).text).toContain("1st Marker_updated_marker")
            marker.save_marker()          

        })
        // Case where you add a marker then go to another quiz       
        it("Case where you add a marker then go to another quiz",function(){      
            video.seek(79)
            marker.create_shortcut()
            expect(marker.editor_panel.isDisplayed()).toEqual(true);
            expect(marker.annotation_video.isPresent()).toEqual(false);      
            marker.type_title("3rd Marker")
            marker.type_annotation("3rd Annotation Marker")
            marker.save_marker()
            expect(marker.markers.count()).toEqual(3)

            invideo_quiz.quiz(1).click()
            expect(invideo_quiz.answers.count()).toEqual(2)
            invideo_quiz.rename("MCQ QUIZ updated_marker_quiz_marker")
            invideo_quiz.add_answer(q3_x, q3_y)
            invideo_quiz.mark_correct()
            invideo_quiz.type_explanation("explanation 3")
            invideo_quiz.hide_popover()

            marker.marker_list(3).click()
            expect(marker.marker(3).text).toContain("3rd Marker")
            invideo_quiz.quiz(1).click()
            expect(invideo_quiz.name.getText()).toEqual("MCQ QUIZ updated_marker_quiz_marker")
            expect(invideo_quiz.answers.count()).toEqual(3)
            invideo_quiz.save_quiz()
        })
        // Playing a video while a quiz is shown should hide it 
        it("Playing a video while a quiz is shown should hide it (answers) ",function(){
            browser.refresh()
            invideo_quiz.quiz(1).click()
            expect(invideo_quiz.answers.count()).toEqual(3)
            expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
            expect(invideo_quiz.in_video_answer(1).isDisplayed()).toEqual(true)
            expect(invideo_quiz.in_video_answer(2).isDisplayed()).toEqual(true)
            expect(invideo_quiz.in_video_answer(3).isDisplayed()).toEqual(true)        
            expect(invideo_quiz.answers.count()).toEqual(3)
            video.play()
            expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
            expect(invideo_quiz.in_video_answer(1).isDisplayed()).toEqual(false)
            expect(invideo_quiz.in_video_answer(2).isDisplayed()).toEqual(false)
            expect(invideo_quiz.in_video_answer(3).isDisplayed()).toEqual(false)
            expect(invideo_quiz.answers.count()).toEqual(3)
            invideo_quiz.save_quiz()
            expect(invideo_quiz.editor_panel.isPresent()).toEqual(false);
            expect(invideo_quiz.answers.count()).toEqual(0)        
        })
        // Passing by a marker while playing a video should show it      
        it("Passing by a marker while playing a video should show it ",function(){
            browser.refresh()
            video.wait_till_ready()
            video.play()
            video.seek(56)
            marker.wait_for_marker()
            expect(marker.annotation_video.isDisplayed()).toEqual(true)
            expect(marker.annotation_video.isPresent()).toEqual(true);
        })
        // Passing by a quiz while playing a video should show it 
        it("Passing by a quiz while playing a video should show it ",function(){
            video.wait_till_ready()
            video.seek(9)
            invideo_quiz.wait_for_quiz()
            expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
            expect(invideo_quiz.name.getText()).toEqual("MCQ QUIZ updated_marker_quiz_marker")
            expect(invideo_quiz.answers.count()).toEqual(3)                        
            invideo_quiz.save_quiz()
        })
        // Deleting a non-empty module
        it("should delete thrid module ",function(){
            var module = navigator.module(3)
            module.open()
            module.delete()
            course_editor.confirm_delete_module()
            sleep(500)
            expect(navigator.modules.count()).toEqual(2)
        })
    })
    describe("Fourth Lecture",function(){
        it("should open course", function() {
          course_list.open()
          course_list.open_teacher_course(1)
        })
        it("should go to edit mode", function() {
          sub_header.open_edit_mode()
        })    
        // Adding content without being inside a module 
        it("Adding content without being inside a module", function() {
            expect(navigator.modules.count()).toEqual(2)
            course_editor.new_item_course_editor.click()
            content_items.add_video()
            course_editor.change_item_url(params.url1)
            expect(navigator.modules.count()).toEqual(3)
            browser.refresh()
            var module = navigator.module(3)
            // navigator.module(3).open()
            // navigator.module(3).item(1).open()
            module.open()
            expect(navigator.module(3).items.count()).toEqual(1)
            course_editor.new_item_course_editor.click()
            content_items.add_quiz()
            module.open()                    
            course_editor.new_item_course_editor.click()
            content_items.add_link()                
        })
        it("should add video quiz", function() {
            var module = navigator.module(3)
            module.open()
            module.item(1).open()
            // course_editor.open_lecture_settings();
            video.seek(10)
            invideo_quiz.create(invideo_quiz.mcq)
            expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
            invideo_quiz.rename("MCQ QUIZ")
            invideo_quiz.add_answer(q1_x, q1_y)
            invideo_quiz.mark_correct()
            invideo_quiz.type_explanation("explanation 1")
            invideo_quiz.hide_popover()
            invideo_quiz.save_quiz()
        })
        // Switching a lecture to different types (inclass, distance, …) 
        it("Switching a lecture to different types (inclass, distance, …)", function() {
            browser.refresh()
            var module = navigator.module(3)
            module.open()
            module.item(1).open()
            course_editor.open_lecture_settings();
            invideo_quiz.quiz(1).click()
            expect(course_editor.lecture_video_checkbox.isSelected()).toEqual(true);
            expect(invideo_quiz.self_time_field.isDisplayed()).toEqual(false)
            expect(invideo_quiz.intro_time_field.isDisplayed()).toEqual(false)
            course_editor.change_lecture_video_to_inclass()
            expect(course_editor.lecture_video_checkbox.isSelected()).toEqual(false);
            expect(course_editor.lecture_inclass_video_checkbox.isSelected()).toEqual(true);
            expect(invideo_quiz.self_time_field.isDisplayed()).toEqual(true)
            expect(invideo_quiz.intro_time_field.isDisplayed()).toEqual(true)
            browser.refresh()
            module.open()
            module.item(1).open()
            invideo_quiz.quiz(1).click()
            course_editor.open_lecture_settings();
            expect(course_editor.lecture_video_checkbox.isSelected()).toEqual(false);
            expect(course_editor.lecture_inclass_video_checkbox.isSelected()).toEqual(true);
            course_editor.change_lecture_video_to_distance_peer()
            expect(course_editor.lecture_video_checkbox.isSelected()).toEqual(false);
            expect(course_editor.lecture_inclass_video_checkbox.isSelected()).toEqual(false);
            expect(course_editor.lecture_distance_peer_video_checkbox.isSelected()).toEqual(true);
            expect(invideo_quiz.self_time_field.isDisplayed()).toEqual(true)
            expect(invideo_quiz.intro_time_field.isDisplayed()).toEqual(false)
            browser.refresh()
            module.open()
            module.item(1).open()
            course_editor.open_lecture_settings();
            invideo_quiz.quiz(1).click()
            expect(course_editor.lecture_video_checkbox.isSelected()).toEqual(false);
            expect(course_editor.lecture_inclass_video_checkbox.isSelected()).toEqual(false);
            expect(course_editor.lecture_distance_peer_video_checkbox.isSelected()).toEqual(true);
            course_editor.change_lecture_video_to_normal()
            expect(course_editor.lecture_video_checkbox.isSelected()).toEqual(true);
            expect(course_editor.lecture_inclass_video_checkbox.isSelected()).toEqual(false);
            expect(course_editor.lecture_distance_peer_video_checkbox.isSelected()).toEqual(false);
            expect(invideo_quiz.self_time_field.isDisplayed()).toEqual(false)
            expect(invideo_quiz.intro_time_field.isDisplayed()).toEqual(false)
            browser.refresh()
            module.open()
            module.item(1).open()
            course_editor.open_lecture_settings();
            invideo_quiz.quiz(1).click()
            expect(course_editor.lecture_video_checkbox.isSelected()).toEqual(true);
            expect(course_editor.lecture_inclass_video_checkbox.isSelected()).toEqual(false);
            expect(course_editor.lecture_distance_peer_video_checkbox.isSelected()).toEqual(false);
        })

        // Deleting a lecture, quiz or link while being on it 
        it("Deleting a lecture, quiz or link while being on it", function() {
            var module = navigator.module(3)
            module.open()
            module.item(3).open()
            expect(course_editor.new_item_course_editor.isPresent()).toEqual(false)
            module.item(3).delete()
            expect(module.items.count()).toEqual(2)
            expect(course_editor.new_item_course_editor.isDisplayed()).toEqual(true)
            module.open()
            module.item(2).open()
            expect(course_editor.new_item_course_editor.isPresent()).toEqual(false)
            module.item(2).delete()
            expect(module.items.count()).toEqual(1)
            expect(course_editor.new_item_course_editor.isDisplayed()).toEqual(true)
            module.open()
            module.item(1).open()
            expect(course_editor.new_item_course_editor.isPresent()).toEqual(false)
            module.item(1).delete()
            expect(module.items.count()).toEqual(0)
            expect(course_editor.new_item_course_editor.isDisplayed()).toEqual(true)
            module.delete()
            expect(navigator.modules.count()).toEqual(2)
        })

        // it("should delete fourth module ",function(){
        //     var module = navigator.module(3)
        //     module.open()
        //     module.delete()
        //     course_editor.confirm_delete_module()
        //     expect(navigator.modules.count()).toEqual(2)
        // })
    })
    it("should logout", function() {
      header.logout()
    })
  })
})
