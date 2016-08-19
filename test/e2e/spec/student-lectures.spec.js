var Header = require('./pages/header');
var Login = require('./pages/login');
var CourseEditor = require('./pages/course_editor');
var ContentNavigator = require('./pages/content_navigator');
var CourseInformation = require('./pages/course_information');
var CourseList = require('./pages/course_list');
var StudentLecture = require('./pages/student/lecture');
var scroll = require('./lib/utils').scroll;
var sleep = require('./lib/utils').sleep;
var Video = require('./pages/video');

var params = browser.params;

var header = new Header()
var login_page = new Login()
var course_editor = new CourseEditor()
var course_info = new CourseInformation()
var course_list = new CourseList()
var student_lec = new StudentLecture()
var video = new Video();

var duration={ min:6, sec:5}
var total_duration = duration.min*60+duration.sec

describe("Student Lecture",function(){
    describe("Teacher",function(){
        it("should logout", function(){
            header.logout()
        })
    })
    describe("Student",function(){
        it("should login", function(){
            login_page.sign_in(params.student1.email, params.password)
        })
        var navigator = new ContentNavigator(0)
        it("should open course",function(){
            course_list.open()
            course_list.open_course(1)
        })
        it("should add a confused",function(){
            video.seek(30)
            expect(student_lec.lecture(1).confused.count()).toEqual(0)
            student_lec.add_confused()
            expect(student_lec.lecture(1).confused.count()).toEqual(1)
            expect(student_lec.lecture(1).items.count()).toEqual(4)
        })
        it("should add public discussions",function(){
            student_lec.add_discussion()
            expect(student_lec.lecture(1).editable_discussion.isDisplayed()).toEqual(true)
            student_lec.lecture(1).type_discussion("question 1")
            student_lec.lecture(1).change_discussion_public()
            student_lec.lecture(1).save_discussion()
            expect(student_lec.lecture(1).discussions.count()).toEqual(1)
            expect(student_lec.lecture(1).editable_discussion.isPresent()).toEqual(false)
            expect(student_lec.lecture(1).items.count()).toEqual(5)
        })
        it("should add a private discussion",function(){
            student_lec.add_discussion()
            student_lec.lecture(1).type_discussion("question 2")
            student_lec.lecture(1).change_discussion_private()
            student_lec.lecture(1).save_discussion()
            expect(student_lec.lecture(1).discussions.count()).toEqual(2)
            expect(student_lec.lecture(1).items.count()).toEqual(6)
        })
    })

})
// describe("3", function(){

//     it('should sign in as teacher', function(){
//         // o_c.press_login(ptor);
//         o_c.sign_in(ptor, params.teacher1.email, params.password);
//     })

//     it('should create_course', function(){
//         teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
//     })

//     it('should add a module and lecture to create quizzes', function(){
//         // o_c.sign_in(ptor, params.teacher1.email, params.password);
//         // o_c.open_course_list(ptor);
//         // o_c.open_course(ptor, 1);
//         teacher.add_module(ptor);
//         teacher.open_module(ptor, 1);
//         teacher.add_lecture(ptor);
//         // o_c.press_content_navigator(ptor);
//         // ptor.sleep(2000)
//         teacher.init_lecture(ptor, "lecture 1","https://www.youtube.com/watch?v=SKqBmAHwSkg");
//     })

//     it('should get the enrollment key and enroll student', function(){
//         teacher.get_key_and_enroll(ptor, params.student1.email, params.password);
//     })

//     it('should open the course to be tested', function(){
//         // o_c.to_student(ptor);
//         o_c.open_course_list(ptor);
//         o_c.open_course(ptor, 1);
//         // o_c.press_content_navigator(ptor);
//         // teacher.open_module(ptor, 1);
//         // o_c.press_content_navigator(ptor);
//         youtube.seek(ptor, 50);
//         discussions.ask_public_question(ptor, "question 1");
//         discussions.comment(ptor, 1, "comment 1");
//         discussions.comment(ptor, 1, "comment 2");

//         discussions.ask_public_question(ptor, "question 2");
//         discussions.comment(ptor, 2, "comment 1");
//         discussions.comment(ptor, 2, "comment 2");
//     })

//     it('should clear the course for deletion', function(){
//         o_c.to_teacher(ptor);
//         o_c.open_course_list(ptor);
//         o_c.open_course(ptor, 1);
//         teacher.open_module(ptor, 1);
//         teacher.delete_item_by_number(ptor, 1, 1);
//         teacher.delete_empty_module(ptor, 1)
//     })

//     it('should delete course', function(){
//         o_c.open_course_list(ptor);
//         teacher.delete_course(ptor, 1);
//         o_c.logout(ptor);
//     })
// })

// describe("4", function(){
//     it('should sign in as teacher', function(){
//         // o_c.press_login(ptor);
//         o_c.sign_in(ptor, params.teacher1.email, params.password);
//     })

//     it('should create_course', function(){
//         teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
//     })

//     it('should add a module and lecture to create quizzes', function(){
//         // o_c.sign_in(ptor, params.teacher1.email, params.password);
//         // o_c.open_course_list(ptor);
//         // o_c.open_course(ptor, 1);
//         teacher.add_module(ptor);
//         teacher.open_module(ptor, 1);
//         teacher.add_lecture(ptor);
//         // o_c.press_content_navigator(ptor);
//         // ptor.sleep(2000)
//         teacher.init_lecture(ptor, "lecture 1","https://www.youtube.com/watch?v=SKqBmAHwSkg");
//     })

//     it('should get the enrollment key and enroll student', function(){
//         teacher.get_key_and_enroll(ptor, params.student1.email, params.password);
//     })

//     it('should open the course to be tested and create a note', function(){
//         // o_c.to_student(ptor);
//         o_c.open_course_list(ptor);
//         o_c.open_course(ptor, 1);
//         // o_c.press_content_navigator(ptor);
//         // teacher.open_module(ptor, 1);
//         // o_c.press_content_navigator(ptor);
//         youtube.seek(ptor, 50);
//         student.create_note(ptor, 'This is a new note');
//         check_outline_ele_no(1, 1);
//     })

//     it('should clear the course for deletion', function(){
//         o_c.to_teacher(ptor);
//         o_c.open_course_list(ptor);
//         o_c.open_course(ptor, 1);
//         teacher.open_module(ptor, 1);
//         teacher.delete_item_by_number(ptor, 1, 1);
//         teacher.delete_empty_module(ptor, 1)
//     })

//     it('should delete course', function(){
//         o_c.open_course_list(ptor);
//         teacher.delete_course(ptor, 1);
//         o_c.logout(ptor);
//     })
// })

// describe("5", function(){
//     it('should sign in as teacher', function(){
//         // o_c.press_login(ptor);
//         o_c.sign_in(ptor, params.teacher1.email, params.password);
//     })

//     it('should create_course', function(){
//         teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
//     })

//     it('should add a module and lecture to create quizzes', function(){
//         // o_c.sign_in(ptor, params.teacher1.email, params.password);
//         // o_c.open_course_list(ptor);
//         // o_c.open_course(ptor, 1);
//         teacher.add_module(ptor);
//         teacher.open_module(ptor, 1);
//         teacher.add_lecture(ptor);
//         o_c.press_content_navigator(ptor);
//         ptor.sleep(2000)
//         teacher.init_lecture(ptor, "lecture 1","https://www.youtube.com/watch?v=SKqBmAHwSkg");
//         teacher.open_lecture_settings()
//         teacher.change_lecture_inorder()
//     })

//     it('should seek and add an over video quiz MCQ', function(){
//         youtube.seek(ptor, 10);
//         teacher.create_invideo_mcq_quiz(ptor);
//         teacher.rename_invideo_quiz('MCQ QUIZ')
//         o_c.scroll_to_top(ptor)
//         teacher.make_mcq_questions(ptor, q1_x, q1_y, q2_x, q2_y, q3_x, q3_y);
//         // teacher.exit_invideo_quiz()
//         // o_c.scroll_to_top(ptor)
//     })

//     it('should seek and add an over video quiz OCQ', function(){
//         youtube.seek(ptor, 21)
//         teacher.create_invideo_ocq_quiz(ptor);
//         teacher.rename_invideo_quiz('OCQ QUIZ')
//         o_c.scroll_to_top(ptor)
//         teacher.make_ocq_questions(ptor, q1_x, q1_y, q2_x, q2_y, q3_x, q3_y);
//         // teacher.exit_invideo_quiz()
//         // o_c.scroll_to_top(ptor)
//     })

//     it('should add another lecture', function(){
//         teacher.add_lecture(ptor);
//         o_c.press_content_navigator(ptor);
//         ptor.sleep(2000)
//         teacher.init_lecture(ptor, "lecture 2","https://www.youtube.com/watch?v=SKqBmAHwSkg");
//     })

//     it('should seek and add an over video quiz MCQ', function(){
//         youtube.seek(ptor, 10);
//         teacher.create_invideo_mcq_quiz(ptor);
//         teacher.rename_invideo_quiz('MCQ QUIZ 2')
//         o_c.scroll_to_top(ptor)
//         teacher.make_mcq_questions(ptor, q1_x, q1_y, q2_x, q2_y, q3_x, q3_y);
//         // teacher.exit_invideo_quiz()
//         // o_c.scroll_to_top(ptor)
//     })

//     it('should seek and add an over video quiz OCQ', function(){
//         youtube.seek(ptor, 21)
//         teacher.create_invideo_ocq_quiz(ptor);
//         teacher.rename_invideo_quiz('OCQ QUIZ 2')
//         o_c.scroll_to_top(ptor)
//         teacher.make_ocq_questions(ptor, q1_x, q1_y, q2_x, q2_y, q3_x, q3_y);
//         // teacher.exit_invideo_quiz()
//         // o_c.scroll_to_top(ptor)
//     })

//     it('should get the enrollment key and enroll student', function(){
//         o_c.press_content_navigator(ptor);
//         ptor.sleep(2000)
//         teacher.get_key_and_enroll(ptor, params.student1.email, params.password);
//     })

//     it('should open the course to be tested', function(){
//         // o_c.to_student(ptor);
//         o_c.open_course_list(ptor);
//         o_c.open_course(ptor, 1);
//     })

//     it('should check num of lec and subitems', function(){
//         check_num_of_lectures(2)
//         check_outline_ele_no(1, 2);
//         check_outline_ele_no(2, 2);
//     })

//     it('should check lecture is selected', function(){
//         check_lecture_selected(1)
//     })

//     it('should check quiz names', function(){
//         check_item_name(1,1,"MCQ QUIZ")
//         check_item_name(1,2,"OCQ QUIZ")
//     })

//     it('should add confused ',function(){
//         youtube.seek(ptor, 30);
//         student.press_confused_btn(ptor);
//         ptor.sleep(2000);
//         check_outline_ele_no(1, 3);
//     })

//     it('should check confused names', function(){
//         check_item_name(1,3,"Confused")
//     })

//     it('should add note', function(){
//         youtube.seek(ptor, 50);
//         student.create_note(ptor, 'This is a new note');
//         check_outline_ele_no(1, 4);
//     })

//     it('should check note value', function(){
//         check_item_name(1,4,"This is a new note")
//     })

//      it('should seek and answer quiz', function(){
//         youtube.press_play(ptor)
//         youtube.seek(ptor, 9.9);
//         ptor.sleep(3000)
//         student.expect_quiz(ptor);
//         student.answer_invideo_mcq(ptor, 1);
//         student.answer_invideo_mcq(ptor, 3);
//         student.answer_quiz(ptor);
//     })

//     it('should seek and answer quiz', function(){
//         youtube.press_play(ptor)
//         youtube.seek(ptor, 20.9);
//         ptor.sleep(3000)
//         student.expect_quiz(ptor);
//         student.answer_invideo_ocq(ptor, 1);
//         student.answer_invideo_ocq(ptor, 3);
//         student.answer_quiz(ptor);
//     })

//     it('should navigate through all subitems', function(){
//         click_on_subitem(1,3)
//         ptor.sleep(2000)
//         get_video_time(ptor, 30)
//         click_on_subitem(1,4)
//         get_video_time(ptor, 50)

//     })

//     it('should open second lecture', function(){
//         o_c.open_item(ptor, 2)
//     })

//     it('should check lecture is selected', function(){
//         check_lecture_selected(2)
//     })

//     it('should check quiz names', function(){
//         check_item_name(2,1,"MCQ QUIZ 2")
//         check_item_name(2,2,"OCQ QUIZ 2")
//     })

//     it('should add discussions ',function(){
//         youtube.seek(ptor, 30);
//         discussions.ask_public_question(ptor, "question 1");
//         check_outline_ele_no(2, 3);
//         youtube.seek(ptor, 35);
//         discussions.ask_private_question(ptor, "question 2");
//         check_outline_ele_no(2, 4);
//     })

//     it('should add really confused', function(){
//         youtube.seek(ptor, 50);
//         student.add_really_confused(ptor)
//         check_outline_ele_no(2, 5);
//     })

//     it('should check confused value', function(){
//         check_item_name(2,5,"Really Confused")
//     })

//     it('should seek and answer quiz', function(){
//         // youtube.press_play(ptor)
//         youtube.seek(ptor, 10);
//         ptor.sleep(3000)
//         student.expect_quiz(ptor);
//         student.answer_invideo_mcq(ptor, 1);
//         student.answer_invideo_mcq(ptor, 3);
//         student.answer_quiz(ptor);
//     })

//     it('should seek and answer quiz', function(){
//         // youtube.press_play(ptor)
//         youtube.seek(ptor, 21);
//         ptor.sleep(3000)
//         student.expect_quiz(ptor);
//         student.answer_invideo_ocq(ptor, 1);
//         student.answer_invideo_ocq(ptor, 3);
//         student.answer_quiz(ptor);
//     })

//     it('should navigate through all subitems', function(){
//         click_on_subitem(2,3)
//         ptor.sleep(2000)
//         get_video_time(ptor, 30)
//         click_on_subitem(2,4)
//         ptor.sleep(2000)
//         get_video_time(ptor, 35)
//         click_on_subitem(2,5)
//         ptor.sleep(2000)
//         get_video_time(ptor, 50)
//     })

//      it('should navigate through all subitems from different lectures', function(){
//         click_on_subitem(1,3)
//         get_video_time(ptor, 30)
//         click_on_subitem(2,4)
//         get_video_time(ptor, 35)
//     })


//     it('should clear the course for deletion', function(){
//         o_c.to_teacher(ptor);
//         o_c.open_course_list(ptor);
//         o_c.open_course(ptor, 1);
//         teacher.open_module(ptor, 1);
//         teacher.delete_item_by_number(ptor, 1, 1);
//         teacher.delete_item_by_number(ptor, 1, 1);
//         teacher.delete_empty_module(ptor, 1)
//     })

//     it('should delete course', function(){
//         o_c.open_course_list(ptor);
//         teacher.delete_course(ptor, 1);
//         o_c.logout(ptor);
//     })
// })

// describe("6", function(){
//     it('should sign in as teacher', function(){
//         // o_c.press_login(ptor);
//         o_c.sign_in(ptor, params.teacher1.email, params.password);
//     })

//     it('should create_course', function(){
//         teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
//     })

//     it('should add a module and lecture to create quizzes', function(){
//         // o_c.sign_in(ptor, params.teacher1.email, params.password);
//         // o_c.open_course_list(ptor);
//         // o_c.open_course(ptor, 1);
//         teacher.add_module(ptor);
//         teacher.open_module(ptor, 1);
//         teacher.add_lecture(ptor);
//         o_c.press_content_navigator(ptor);
//         ptor.sleep(2000)
//         teacher.init_lecture(ptor, "lecture 1","https://www.youtube.com/watch?v=SKqBmAHwSkg");
//         teacher.open_lecture_settings()
//         teacher.change_lecture_required()
//         teacher.change_lecture_inorder()
//     })

//     it('should seek and add an over video quiz MCQ', function(){
//         youtube.seek(ptor, 10);
//         teacher.create_invideo_mcq_quiz(ptor);
//         teacher.make_mcq_questions(ptor, q1_x, q1_y, q2_x, q2_y, q3_x, q3_y);
//         // teacher.exit_invideo_quiz()
//         // o_c.scroll_to_top(ptor)
//     })

//     it('should add another lecture', function(){
//         teacher.add_lecture(ptor);
//         o_c.press_content_navigator(ptor);
//         ptor.sleep(2000)
//         teacher.init_lecture(ptor, "lecture 2","https://www.youtube.com/watch?v=SKqBmAHwSkg");
//     })

//     it('should seek and add an over video quiz MCQ', function(){
//         youtube.seek(ptor, 10);
//         teacher.create_invideo_mcq_quiz(ptor);
//         teacher.make_mcq_questions(ptor, q1_x, q1_y, q2_x, q2_y, q3_x, q3_y);
//         // teacher.exit_invideo_quiz()
//         // o_c.scroll_to_top(ptor)
//     })

//     it('should seek and add an over video quiz OCQ', function(){
//         youtube.seek(ptor, 21)
//         teacher.create_invideo_ocq_quiz(ptor);
//         teacher.make_ocq_questions(ptor, q1_x, q1_y, q2_x, q2_y, q3_x, q3_y);
//         // teacher.exit_invideo_quiz()
//         // o_c.scroll_to_top(ptor)
//     })

//     it('should add a quiz', function(){
//         teacher.add_quiz(ptor);
//         teacher.add_quiz_header(ptor, 'first header')
//         teacher.add_quiz_question_mcq(ptor, 'mcq question', 2, [1, 2])
//         teacher.add_quiz_header(ptor, 'second header')
//         teacher.add_quiz_question_ocq(ptor, 'ocq question', 2, 1)
//         teacher.add_quiz_question_free(ptor, 'free question')
//         teacher.save_quiz(ptor)
//     })

//     it('should add a module and lecture that is not required', function(){
//         teacher.add_module(ptor);
//         teacher.add_lecture(ptor);
//         o_c.press_content_navigator(ptor);
//         ptor.sleep(2000)
//         teacher.init_lecture(ptor, "lecture 1","https://www.youtube.com/watch?v=SKqBmAHwSkg");
//         teacher.open_lecture_settings()
//         teacher.change_lecture_required()
//     })

//     it('should seek and add an over video quiz MCQ', function(){
//         youtube.seek(ptor, 10);
//         teacher.create_invideo_mcq_quiz(ptor);
//         teacher.make_mcq_questions(ptor, q1_x, q1_y, q2_x, q2_y, q3_x, q3_y);
//         // teacher.exit_invideo_quiz()
//         // o_c.scroll_to_top(ptor)
//     })

//     it('should add a not required quiz', function(){
//         teacher.add_quiz(ptor);
//         teacher.change_quiz_required()
//         teacher.add_quiz_header(ptor, 'first header')
//         teacher.add_quiz_question_mcq(ptor, 'mcq question', 2, [1, 2])
//         teacher.add_quiz_header(ptor, 'second header')
//         teacher.add_quiz_question_ocq(ptor, 'ocq question', 2, 1)
//         teacher.add_quiz_question_free(ptor, 'free question')
//         teacher.save_quiz(ptor)
//     })

//     it('should get the enrollment key and enroll student', function(){
//         teacher.get_key_and_enroll(ptor, params.student1.email, params.password);
//     })

//     it('should open the course to be tested', function(){
//         o_c.to_student(ptor);
//         o_c.open_course_list(ptor);
//         o_c.open_course(ptor, 1);
//     })

//     it('should check that none of the modules and items are marked done', function(){
//         o_c.press_content_navigator(ptor);
//         o_c.open_module(ptor,1)
//         module_done(1, false)
//         ptor.sleep(2000)
//         item_done(1, 1, false)
//         item_done(1, 2, false)
//         item_done(1, 3, false)
//         o_c.open_module(ptor,2)
//         module_done(2, false)
//         item_done(2, 1, false)
//         item_done(2, 2, false)
//     })

//     it('should open first module', function(){
//         o_c.open_module(ptor,1)
//     })

//     it('should solve second lecture quiz', function(){
//         o_c.open_item_from_navigator(1, 2)
//         // o_c.press_content_navigator(ptor);
//         // ptor.sleep(1000)
//         youtube.press_play(ptor)
//         youtube.seek(ptor, 9.9);
//         ptor.sleep(3000)
//         student.expect_quiz(ptor);
//         student.answer_invideo_mcq(ptor, 1);
//         student.answer_invideo_mcq(ptor, 3);
//         student.answer_quiz(ptor);
//         item_done(1, 2, false)
//         youtube.press_play(ptor)
//         youtube.seek(ptor, 20.9);
//         ptor.sleep(3000)
//         student.expect_quiz(ptor);
//         student.answer_invideo_ocq(ptor, 1);
//         student.answer_quiz(ptor);
//         item_done(1, 2, false)
//         youtube.press_play(ptor)
//         youtube.seek(ptor, 25);
//         ptor.sleep(5000)
//         youtube.seek(ptor, 75);
//         ptor.sleep(5000)
//         youtube.seek(ptor, 99);
//         ptor.sleep(10000)
//         item_done(1, 2, true)
//         module_done(1, false)
//         module_done(2, false)

//     })

//     it('should solve quiz', function(){
//         // o_c.press_content_navigator(ptor);
//         o_c.open_item_from_navigator(1, 3)
//         student.mcq_answer(ptor, 2, 2);
//         student.ocq_answer(ptor, 4, 2);
//         student.free_match_answer(ptor, 5, 'free answer')
//         student.submit_normal_quiz(ptor);
//         item_done(1, 2, true)
//         item_done(1, 3, true)
//         module_done(1, false)
//         module_done(2, false)
//     })

//     it('should solve first lecture', function(){
//         o_c.open_item_from_navigator(1, 1)
//         // o_c.press_content_navigator(ptor);
//         // ptor.sleep(1000)
//         youtube.press_play(ptor)
//         youtube.seek(ptor, 9.9);
//         ptor.sleep(3000)
//         student.expect_quiz(ptor);
//         student.answer_invideo_mcq(ptor, 1);
//         student.answer_invideo_mcq(ptor, 3);
//         student.answer_quiz(ptor);
//         item_done(1, 1, false)
//         item_done(1, 2, true)
//         item_done(1, 3, true)
//         youtube.press_play(ptor)
//         youtube.seek(ptor, 25);
//         ptor.sleep(5000)
//         youtube.seek(ptor, 75);
//         ptor.sleep(5000)
//         youtube.seek(ptor, 99);
//         ptor.sleep(10000)
//         item_done(1, 1, true)
//         item_done(1, 2, true)
//         item_done(1, 3, true)
//         module_done(1, true)
//         module_done(2, false)
//     })

//     it('should open second module', function(){
//         // o_c.press_content_navigator(ptor);
//         // ptor.sleep(1000)
//         o_c.open_module(ptor,2)
//     })

//     it('should solve lecture', function(){
//         o_c.open_item_from_navigator(2, 1)
//         // ptor.sleep(10000)
//         // o_c.press_content_navigator(ptor);
//         // ptor.sleep(1000)
//         youtube.press_play(ptor)
//         youtube.seek(ptor, 9.9);
//         ptor.sleep(3000)
//         student.expect_quiz(ptor);
//         student.answer_invideo_mcq(ptor, 1);
//         student.answer_invideo_mcq(ptor, 3);
//         student.answer_quiz(ptor);
//         item_done(2, 1, false)
//         item_done(2, 2, false)
//         module_done(1, true)
//         module_done(2, false)
//         youtube.press_play(ptor)
//         youtube.seek(ptor, 25);
//         ptor.sleep(5000)
//         youtube.seek(ptor, 75);
//         ptor.sleep(5000)
//         youtube.seek(ptor, 99);
//         ptor.sleep(10000)
//         item_done(2, 1, true)
//         item_done(2, 2, false)
//         module_done(1, true)
//         module_done(2, false)

//     })

//     it('should solve quiz', function(){
//         // o_c.press_content_navigator(ptor);
//         o_c.open_item_from_navigator(2, 2)
//         student.mcq_answer(ptor, 2, 2);
//         student.ocq_answer(ptor, 4, 2);
//         student.free_match_answer(ptor, 5, 'free answer')
//         student.submit_normal_quiz(ptor);
//         item_done(2, 1, true)
//         item_done(2, 2, true)
//         module_done(1, true)
//         module_done(2, true)
//     })


//     it('should clear the course for deletion', function(){
//         o_c.to_teacher(ptor);
//         o_c.open_course_list(ptor);
//         o_c.open_course(ptor, 1);

//         teacher.open_module(ptor, 2);
//         teacher.delete_item_by_number(ptor, 2, 1);
//         teacher.delete_item_by_number(ptor, 2, 1);
//         teacher.delete_empty_module(ptor, 2)

//         teacher.open_module(ptor, 1);
//         teacher.delete_item_by_number(ptor, 1, 1);
//         teacher.delete_item_by_number(ptor, 1, 1);
//         teacher.delete_item_by_number(ptor, 1, 1);
//         teacher.delete_empty_module(ptor, 1)
//     })

//     it('should delete course', function(){
//         o_c.open_course_list(ptor);
//         teacher.delete_course(ptor, 1);
//         o_c.logout(ptor);
//     })
// })

// describe("7", function(){
//     it('should sign in as teacher', function(){
//         // o_c.press_login(ptor);
//         o_c.sign_in(ptor, params.teacher1.email, params.password);
//     })

//     it('should create_course', function(){
//         teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
//     })

//     it('should add a module and lecture to create quizzes', function(){
//         // o_c.sign_in(ptor, params.teacher1.email, params.password);
//         // o_c.open_course_list(ptor);
//         // o_c.open_course(ptor, 1);
//         teacher.add_module(ptor);
//         teacher.open_module(ptor, 1);
//         teacher.add_lecture(ptor);
//         o_c.press_content_navigator(ptor);
//         ptor.sleep(2000)
//         teacher.init_lecture(ptor, "lecture 1","https://www.youtube.com/watch?v=SKqBmAHwSkg");
//     })

//     it('should seek and add an over video quiz MCQ', function(){
//         youtube.seek(ptor, 10);
//         teacher.create_invideo_mcq_quiz(ptor);
//         teacher.make_mcq_questions(ptor, q1_x, q1_y, q2_x, q2_y, q3_x, q3_y);
//         // teacher.exit_invideo_quiz()
//         // o_c.scroll_to_top(ptor)
//     })

//     it('should add another lecture', function(){
//         teacher.add_lecture(ptor);
//         o_c.press_content_navigator(ptor);
//         ptor.sleep(2000)
//         teacher.init_lecture(ptor, "lecture 2","https://www.youtube.com/watch?v=SKqBmAHwSkg");
//     })

//     it('should seek and add an over video quiz MCQ', function(){
//         youtube.seek(ptor, 10);
//         teacher.create_invideo_mcq_quiz(ptor);
//         teacher.make_mcq_questions(ptor, q1_x, q1_y, q2_x, q2_y, q3_x, q3_y);
//         // teacher.exit_invideo_quiz()
//         // o_c.scroll_to_top(ptor)
//     })

//     it('should add another lecture', function(){
//         teacher.add_lecture(ptor);
//         o_c.press_content_navigator(ptor);
//         ptor.sleep(2000)
//         teacher.init_lecture(ptor, "lecture 3","https://www.youtube.com/watch?v=SKqBmAHwSkg");
//         teacher.open_lecture_settings()
//         teacher.change_lecture_inorder()
//     })

//     it('should seek and add an over video quiz MCQ', function(){
//         youtube.seek(ptor, 10);
//         teacher.create_invideo_mcq_quiz(ptor);
//         teacher.make_mcq_questions(ptor, q1_x, q1_y, q2_x, q2_y, q3_x, q3_y);
//         // teacher.exit_invideo_quiz()
//         // o_c.scroll_to_top(ptor)
//     })

//     it('should add a quiz', function(){
//         teacher.add_quiz(ptor);
//         teacher.add_quiz_header(ptor, 'first header')
//         teacher.add_quiz_question_mcq(ptor, 'mcq question', 2, [1, 2])
//         teacher.add_quiz_header(ptor, 'second header')
//         teacher.add_quiz_question_ocq(ptor, 'ocq question', 2, 1)
//         teacher.add_quiz_question_free(ptor, 'free question')
//         teacher.save_quiz(ptor)
//     })

//     it('should add a module and quiz', function(){
//         teacher.add_module(ptor);
//         teacher.add_quiz(ptor);
//         teacher.change_quiz_inorder()
//         o_c.scroll_to_top(ptor)
//         teacher.add_quiz_header(ptor, 'first header')
//         teacher.add_quiz_question_mcq(ptor, 'mcq question', 2, [1, 2])
//         teacher.add_quiz_header(ptor, 'second header')
//         teacher.add_quiz_question_ocq(ptor, 'ocq question', 2, 1)
//         teacher.add_quiz_question_free(ptor, 'free question')
//         teacher.save_quiz(ptor)
//     })

//     it('should add survey', function(){
//         o_c.scroll_to_top(ptor)
//         teacher.add_survey(ptor)
//         teacher.add_survey_header(ptor, 'first header')
//         teacher.add_survey_question_mcq(ptor, 'mcq question', 2)
//         teacher.add_survey_header(ptor, 'second header')
//         teacher.add_survey_question_ocq(ptor, 'ocq question', 2)
//         teacher.add_survey_question_free(ptor, 'free question')
//         teacher.save_survey(ptor)
//     })

//     it('should add survey', function(){
//         teacher.add_survey(ptor)
//         teacher.change_survey_inorder()
//         o_c.scroll_to_top(ptor)
//         teacher.add_survey_header(ptor, 'first header')
//         teacher.add_survey_question_mcq(ptor, 'mcq question', 2)
//         teacher.add_survey_header(ptor, 'second header')
//         teacher.add_survey_question_ocq(ptor, 'ocq question', 2)
//         teacher.add_survey_question_free(ptor, 'free question')
//         teacher.save_survey(ptor)
//     })

//     it('should add lecture', function(){
//         o_c.scroll_to_top(ptor)
//         teacher.add_lecture(ptor);
//         teacher.init_lecture(ptor, "lecture 1","https://www.youtube.com/watch?v=SKqBmAHwSkg");
//         teacher.open_lecture_settings()
//         teacher.change_lecture_inorder()
//     })

//     it('should get the enrollment key and enroll student', function(){
//         teacher.get_key_and_enroll(ptor, params.student1.email, params.password);
//     })

//     it('should open the course to be tested', function(){
//         // o_c.to_student(ptor);
//         o_c.open_course_list(ptor);
//         o_c.open_course(ptor, 1);
//     })

//     it('should go through all items and see that they are not solvable', function(){
//         o_c.press_content_navigator(ptor);
//         ptor.sleep(1000)
//         o_c.open_module(ptor,1)
//         o_c.open_item_from_navigator(1, 1)
//         check_required_msg(false)
//         o_c.open_item_from_navigator(1, 2)
//         check_required_msg(true)
//         o_c.open_item_from_navigator(1, 3)
//         check_required_msg(true)
//         o_c.open_item_from_navigator(1, 4)
//         check_required_msg(true)

//         o_c.open_module(ptor,2)
//         o_c.open_item_from_navigator(2, 1)
//         check_required_msg(false)
//         o_c.open_item_from_navigator(2, 2)
//         check_required_msg(false)
//         o_c.open_item_from_navigator(2, 3)
//         check_required_msg(true)
//         o_c.open_item_from_navigator(2, 4)
//         check_required_msg(true)
//     })

//     it('should solve first lecture quiz only and check for required message showing', function(){
//         o_c.open_module(ptor,1)
//         o_c.open_item_from_navigator(1, 1)
//         youtube.press_play(ptor)
//         youtube.seek(ptor, 9.9);
//         ptor.sleep(3000)
//         student.expect_quiz(ptor);
//         student.answer_invideo_mcq(ptor, 1);
//         student.answer_quiz(ptor);
//         o_c.open_item_from_navigator(1, 2)
//         check_required_msg(true)
//         o_c.open_item_from_navigator(1, 3)
//         check_required_msg(true)
//         o_c.open_item_from_navigator(1, 4)
//         check_required_msg(true)

//     })

//     it('should watch the first lecture and check for required message not showing', function(){
//         o_c.open_item_from_navigator(1, 1)
//         youtube.press_play(ptor)
//         youtube.seek(ptor, 25);
//         ptor.sleep(5000)
//         youtube.seek(ptor, 75);
//         ptor.sleep(5000)
//         youtube.seek(ptor, 99);
//         ptor.sleep(10000)
//         o_c.open_item_from_navigator(1, 2)
//         check_required_msg(false)
//         o_c.open_item_from_navigator(1, 3)
//         check_required_msg(true)
//         o_c.open_item_from_navigator(1, 4)
//         check_required_msg(true)
//     })

//     it('should solve second lecture quiz and check for required message showing', function(){
//         o_c.open_item_from_navigator(1, 2)
//         ptor.sleep(1000)
//         youtube.press_play(ptor)
//         youtube.seek(ptor, 9.9);
//         ptor.sleep(3000)
//         student.expect_quiz(ptor);
//         student.answer_invideo_mcq(ptor, 1);
//         student.answer_quiz(ptor);
//         o_c.open_item_from_navigator(1, 3)
//         check_required_msg(true)
//         o_c.open_item_from_navigator(1, 4)
//         check_required_msg(true)
//     })

//     it('should watch second lecture and check for required message not showing', function(){
//         o_c.open_item_from_navigator(1, 2)
//         youtube.press_play(ptor)
//         youtube.seek(ptor, 25);
//         ptor.sleep(5000)
//         youtube.seek(ptor, 75);
//         ptor.sleep(5000)
//         youtube.seek(ptor, 99);
//         ptor.sleep(10000)
//         o_c.open_item_from_navigator(1, 3)
//         check_required_msg(false)
//         o_c.open_item_from_navigator(1, 4)
//         check_required_msg(false)
//     })

//     it('should solve quizzes and check for required message', function(){
//         o_c.open_module(ptor,2)
//         o_c.open_item_from_navigator(2, 1)
//         student.mcq_answer(ptor, 2, 2);
//         student.ocq_answer(ptor, 4, 2);
//         student.free_match_answer(ptor, 5, 'free answer')
//         student.submit_normal_quiz(ptor);
//         o_c.open_item_from_navigator(2, 2)
//         check_required_msg(false)
//         o_c.open_item_from_navigator(2, 3)
//         check_required_msg(true)
//         o_c.open_item_from_navigator(2, 4)
//         check_required_msg(true)

//         o_c.open_item_from_navigator(2, 2)
//         student.mcq_answer(ptor, 2, 1);
//         student.mcq_answer(ptor, 2, 2);
//         student.ocq_answer(ptor, 4, 1);
//         student.free_match_answer(ptor, 5, 'free answer')
//         student.save_survey(ptor);
//         o_c.open_item_from_navigator(2, 3)
//         check_required_msg(false)
//         o_c.open_item_from_navigator(2, 4)
//         check_required_msg(false)
//     })

//     it('should clear the course for deletion', function(){
//         o_c.to_teacher(ptor);
//         o_c.open_course_list(ptor);
//         o_c.open_course(ptor, 1);

//         teacher.open_module(ptor, 2);
//         teacher.delete_item_by_number(ptor, 2, 1);
//         teacher.delete_item_by_number(ptor, 2, 1);
//         teacher.delete_item_by_number(ptor, 2, 1);
//         teacher.delete_item_by_number(ptor, 2, 1);
//         teacher.delete_empty_module(ptor, 2)

//         teacher.open_module(ptor, 1);
//         teacher.delete_item_by_number(ptor, 1, 1);
//         teacher.delete_item_by_number(ptor, 1, 1);
//         teacher.delete_item_by_number(ptor, 1, 1);
//         teacher.delete_item_by_number(ptor, 1, 1);
//         teacher.delete_empty_module(ptor, 1)
//     })

//     it('should delete course', function(){
//         o_c.open_course_list(ptor);
//         teacher.delete_course(ptor, 1);
//         o_c.logout(ptor);
//     })
// })

// describe("course with no modules", function(){
//     it('should sign in as teacher', function(){
//         // o_c.press_login(ptor);
//         o_c.sign_in(ptor, params.teacher1.email, params.password);
//     })

//     it('should create_course', function(){
//         teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
//     })

//     it('should get the enrollment key and enroll student', function(){
//         teacher.get_key_and_enroll(ptor, params.student1.email, params.password);
//     })

//     // it('should add a module and lecture to create quizzes', function(){
//     //     o_c.sign_in(ptor, params.student1.email, params.password);
//     // })

//     it('should open the course to be tested and create a note', function(){
//         // o_c.to_student(ptor);
//         o_c.open_course_list(ptor);
//         o_c.open_course(ptor, 1);
//         o_c.press_content_navigator(ptor);
//         student.check_module_number(ptor, 0);
//     })

//     it('should clear the course for deletion', function(){
//         o_c.to_teacher(ptor);
//     })

//     it('should delete course', function(){
//         o_c.open_course_list(ptor);
//         teacher.delete_course(ptor, 1);
//         o_c.logout(ptor);
//     })
// })

// describe("course with empty module", function(){
//     it('should sign in as teacher', function(){
//         // o_c.press_login(ptor);
//         o_c.sign_in(ptor, params.teacher1.email, params.password);
//     })

//     it('should create_course', function(){
//         teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
//     })

//     it('should add a module', function(){
//         // o_c.sign_in(ptor, params.teacher1.email, params.password);
//         // o_c.open_course_list(ptor);
//         // o_c.open_course(ptor, 1);
//         teacher.add_module(ptor);
//     })

//     it('should get the enrollment key and enroll student', function(){
//         teacher.get_key_and_enroll(ptor, params.student1.email, params.password);
//     })

//     it('should open the course to be tested and create a note', function(){
//         // o_c.to_student(ptor);
//         o_c.open_course_list(ptor);
//         o_c.open_course(ptor, 1);
//         o_c.press_content_navigator(ptor);
//         student.check_module_number(ptor, 0);
//     })

//     it('should clear the course for deletion', function(){
//         o_c.to_teacher(ptor);
//         o_c.open_course_list(ptor);
//         o_c.open_course(ptor, 1);
//         teacher.open_module(ptor, 1);
//         teacher.delete_empty_module(ptor, 1)
//     })

//     it('should delete course', function(){
//         o_c.open_course_list(ptor);
//         teacher.delete_course(ptor, 1);
//         o_c.logout(ptor);
//     })
// })


// /////////////////////////////////////////////////////////
// //              test specific functions
// /////////////////////////////////////////////////////////

// function check_confused_no(ptor, con_no){
//     locator.by_repeater(ptor, 'element in timeline').then(function(elements){
//         expect(elements.length).toEqual(con_no);
//     })
// }

// function check_confused_time(ptor){
//     var pw, ph;
//     var random_seek_point = 1;
//     var confused_time;
//     var youtube_time;
//     locator.by_classname(ptor, 'progressBar').then(function(progress){
//         progress.getSize().then(function(size){
//             pw = size.width;
//             ph = size.height;
//             ptor.actions().mouseMove(progress).perform();
//             ptor.actions().mouseMove({x: (random_seek_point*pw)/100, y: 4}).click().perform();
//             locator.by_classname(ptor, 'confusedDiv').then(function(btn){
//                 btn.click().then(function(){
//                     locator.by_classname(ptor, 'timer').findElements(protractor.By.className('ng-binding')).then(function(timers){
//                         confused_time = timers[0].getText();
//                         locator.by_classname(ptor, 'progress-events').then(function(btn2){
//                             btn2.click();
//                             locator.by_classname(ptor, 'timer').findElements(protractor.By.className('ng-binding')).then(function(timers){
//                                 youtube_time = timers[0].getText();
//                                 expect(confused_time).toEqual(youtube_time);
//                             })
//                         })
//                     })
//                 })
//             })
//         })
//     })
// }

// function check_confused_location(ptor){
//     locator.by_classname(ptor, 'elapsed').then(function(progress_bar){
//         progress_bar.getLocation().then(function(location){
//             press_confused_btn(ptor);
//             progress_bar.getSize().then(function(size){
//                 locator.by_repeater(ptor, 'element in timeline').then(function(elements){
//                     elements[0].getLocation().then(function(loc){
//                         expect(location.x+size.width).toEqual(loc.x);
//                         expect(location.y).toEqual(loc.y);
//                     })
//                 })
//             })
//         })
//     })
// }

// function check_outline_ele_no(lec_no, no){
//     var count = element(by.repeater('l in items').row(lec_no-1)).all(by.repeater('item in timeline[l.id].items')).count()
//     expect(count).toEqual(no)
// }

// function check_num_of_lectures(no){
//     expect(element.all(by.repeater('l in items')).count()).toEqual(no)
// }

// function check_lecture_selected(no){
//     expect(element(by.repeater('l in items').row(no-1)).getAttribute("class")).toContain('black')
// }

// function check_item_name(lec_no, no, name){
//     var item_name = element(by.repeater('l in items').row(lec_no-1)).element(by.repeater('item in timeline[l.id].items').row(no-1)).getText()
//     expect(item_name).toEqual(name)
// }
// function check_discussion_name(lec_no, no, student_name, q_title){
//     var item = element(by.repeater('l in items').row(lec_no-1)).element(by.repeater('item in timeline[l.id].items').row(no-1))
//     var student = item.element(by.binding('item.data.screen_name')).getText()
//     var question = item.element(by.binding('item.data.content')).getText()
//     expect(student).toEqual(student_name)
//     expect(question).toEqual("Q. "+q_title)
// }

// function get_video_time(ptor, time){
//     expect(youtube.get_current_video_time(ptor)).toEqual(roundTimeToPercentage(time,total_duration))
// }

// function click_on_subitem(lec_no, item_no){
//     element(by.repeater('l in items').row(lec_no-1)).element(by.repeater('item in timeline[l.id].items').row(item_no-1))
//     .element(by.className('timeline-icon-container')).element(by.tagName('img')).click()
// }

// function roundTimeToPercentage(percent, duration){
//     var time = Math.floor((duration*percent)/100)
//     var hr  = Math.floor(time / 3600);
//     var min = Math.floor((time - (hr * 3600))/60);
//     var sec = Math.floor(time - (hr * 3600) -  (min * 60));
//     if (min < 10) { min = "0" + min; }
//     if (sec < 10) { sec  = "0" + sec; }
//     return  '00:'+min + ':' + sec;
// }

// function module_done(mo_no, val){
//     var check = element(by.repeater('module in modules').row(mo_no-1)).element(by.className('fi-check'))
//     expect(check.isDisplayed()).toEqual(val)
// }

// function item_done(mo_no, item_no, val){
//     var check =  element(by.repeater('module in modules').row(mo_no-1)).element(by.repeater('item in module.items').row(item_no-1)).element(by.className('fi-check'))
//     expect(check.isDisplayed()).toEqual(val)
// }

// function check_required_msg(val){
//     expect(element(by.className('no_solve')).isPresent()).toEqual(val)
// }
