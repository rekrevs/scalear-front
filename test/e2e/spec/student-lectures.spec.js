var ptor = protractor.getInstance();
var driver = ptor.driver;
var functions = ptor.params;
var youtube = require('./lib/youtube');
var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');

describe('', function(){
    it('should login', function(){
        o_c.sign_in(ptor, functions.mail, functions.password, o_c.feedback);
    })
    it('should open the course to be tested', function(){
        o_c.open_course_whole(ptor);
    })
    it('should open tray',function(){
        o_c.open_tray(ptor);
    })
    it('should open lecture',function(){
        o_c.open_lectures(ptor);
    })
    it('should uncheck quiz',function(){
        uncheck_quiz(ptor);
        check_confused(ptor);
        youtube.seek(ptor, 50);
    })
    it('should check confused ',function(){
        press_confused_btn(ptor);
        ptor.sleep(5000);
    })
})

//===================================================
// quiz tab is checked by default so this uncheck it
//===================================================
function uncheck_quiz(ptor){
    locator.by_id(ptor, 'quiz_checkbox').then(function(btn){
        btn.click();
    })
}

//===================================================
// checks the confused check box to start testing
//===================================================
function check_confused(ptor){
    locator.by_id(ptor, 'confused_checkbox').then(function(btn){
        btn.click();
    })
}

//====================================================
//			increment confused and expect one
//====================================================

function press_confused_btn(ptor){
    locator.by_classname(ptor, 'confusedDiv').then(function(btn){
        btn.click().then(function(){
            locator.by_repeater(ptor, 'element in timeline').then(function(elements){
                expect(elements.length).toEqual(1);
            })
        })
    })
}

function check_confused_no(ptor, con_no){
    locator.by_repeater(ptor, 'element in timeline').then(function(elements){
        expect(elements.length).toEqual(con_no);
    })
}

//====================================================
//		check_confused_location
//====================================================

function check_confused_time(ptor){
    var pw, ph;
    var random_seek_point = 1;
    var confused_time;
    var youtube_time;
    locator.by_classname(ptor, 'progressBar').then(function(progress){
        progress.getSize().then(function(size){
            pw = size.width;
            ph = size.height;
            ptor.actions().mouseMove(progress).perform();
            ptor.actions().mouseMove({x: (random_seek_point*pw)/100, y: 4}).click().perform();
            locator.by_classname(ptor, 'confusedDiv').then(function(btn){
                btn.click().then(function(){
                    locator.by_classname(ptor, 'timer').findElements(protractor.By.className('ng-binding')).then(function(timers){
                        confused_time = timers[0].getText();
                        locator.by_classname(ptor, 'progress-events').then(function(btn2){
                            btn2.click();
                            locator.by_classname(ptor, 'timer').findElements(protractor.By.className('ng-binding')).then(function(timers){
                                youtube_time = timers[0].getText();
                                expect(confused_time).toEqual(youtube_time);
                            })
                        })
                    })
                })
            })
        })
    })
}

function check_confused_location(ptor){
    locator.by_classname(ptor, 'elapsed').then(function(progess_bar){
        progress_bar.then(function(location){
            press_confused_btn(ptor);

            locator.by_repeater(ptor, 'element in timeline').then(function(elements){
                elements[0].getLocation().then(function(loc){
                    expect(location.x).toEqual(loc.x);
                    expect(location.y).toEqual(loc.y);
                })
            })
        })
    }

                                               function check_confused_location(ptor){
        locator.by_classname(ptor, 'elapsed').then(function(progress_bar){
            progress_bar.getLocation().then(function(location){
                press_confused_btn(ptor);
                progress_bar.getSize().then(function(size){
                    locator.by_repeater(ptor, 'element in timeline').then(function(elements){
                        elements[0].getLocation().then(function(loc){
                            expect(location.x+size.width).toEqual(loc.x);
                            expect(location.y).toEqual(loc.y);
                        })
                    })
                })
            })
        })
    }
)


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



var locator = require('./lib/locators');
    var o_c = require('./lib/openers_and_clickers');
    var youtube = require('./lib/youtube');
    var teacher = require('./lib/teacher_module');
    var student = require('./lib/student_module');
    var lecture_middle = require('./lib/lecture_quizzes_management');
    var quiz_ov = require('./lib/quizzes_over_video');
    var survey_ov = require('./lib/surveys_over_video');
    var quiz_ov_text = require('./lib/quizzes_over_video_text');

    var ptor = protractor.getInstance();
    var params = ptor.params;
    ptor.driver.manage().window().maximize();

    xdescribe("1", function(){

        it('should sign in as teacher', function(){
            o_c.sign_in(ptor, params.teacher_mail, params.password, o_c.feedback);
        })

        it('should create_course', function(){
            teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites, o_c.feedback);
        })

        it('should get the enrollment key and enroll student', function(){
            teacher.get_key_and_enroll(ptor);
        })
        //test
        //////////////////////////////////////////////////////////////
        it('should open the course', function(){
            o_c.open_course_whole(ptor);
        })
        it('should create a new module', function(){
            teacher.add_module(ptor, o_c.feedback);
        })
        it('should open the created module', function(){
            teacher.open_module(ptor, 1)
        })

        it('should create a lecture', function(){
            teacher.create_lecture(ptor, null, 'http://www.youtube.com/watch?v=xGcG4cp2yzY', o_c.feedback);
            ptor.navigate().refresh();
        })
        it('should seek the video', function(){
            youtube.seek(ptor, 10)
        })

        it('should add an over video quiz MCQ', function(){
            quiz_ov.create_mcq_quiz(ptor, o_c.feedback)
            lecture_middle.rename_quiz(ptor, 1, 'MCQ QUIZ')
            o_c.scroll_to_top(ptor)
            quiz_ov.make_mcq_questions(ptor, 50, 50, 50, 100, 50, 150, o_c.feedback)
            lecture_middle.exit_quiz(ptor, o_c.feedback)
        })

        it('should seek the video', function(){
            youtube.seek(ptor, 20)
        })
        it('should add an over video quiz OCQ', function(){
            quiz_ov.create_ocq_quiz(ptor, o_c.feedback)
            lecture_middle.rename_quiz(ptor, 3, 'OCQ QUIZ')
            o_c.scroll_to_top(ptor)
            quiz_ov.make_ocq_questions(ptor, 50, 50, 50, 100, 50, 150, o_c.feedback)
            lecture_middle.exit_quiz(ptor, o_c.feedback)
        })

        it('should seek the video', function(){
            youtube.seek(ptor, 30)
        })
        it('should add an over video quiz DRAG', function(){
            quiz_ov.create_drag_quiz(ptor, o_c.feedback)
            lecture_middle.rename_quiz(ptor, 5, 'DRAG QUIZ')
            o_c.scroll_to_top(ptor)
            quiz_ov.make_drag_questions(ptor, 50, 50, 50, 100, 50, 150, o_c.feedback)
            lecture_middle.exit_quiz(ptor, o_c.feedback)
        })

        //////////////////////////////////////////////////////////////
        it('should login a student and check for coordinates', function(){
            o_c.to_student(ptor);
            o_c.open_course_whole(ptor);
            o_c.open_tray(ptor);
            o_c.open_lectures(ptor);
            youtube.seek(ptor, 50);
            expect_quiz(ptor);
            check_drag_questions_coord(ptor, d_q1_x, d_q1_y, d_q2_x, d_q2_y, d_q3_x, d_q3_y);
        })
        //end test

        it('should delete course', function(){
            //should choose one of home() or home_teacher() 
            //depending on the current state(student or teacher)
            o_c.home_teacher(ptor);
            teacher.delete_course(ptor, o_c.feedback);
        })
    })

    describe("2", function(){

        it('should sign in as teacher', function(){
            o_c.sign_in(ptor, "mena.happy@yahoo.com", params.password, o_c.feedback);
        })

        //test
        //////////////////////////////////////////////////////////////
        it('should open the course', function(){
            o_c.open_course_whole(ptor);
            o_c.open_tray(ptor);
            o_c.open_lectures(ptor);
            check_outline_ele_no(ptor, 11);
        })
    })

    function check_outline_ele_no(ptor, no){
        locator.by_repeater(ptor, 'e in timeline').then(function(ele){
            expect(ele.length).toEqual(no);
        })
    }
    
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    
    var locator = require('./lib/locators');
    var o_c = require('./lib/openers_and_clickers');
    var teacher = require('./lib/teacher_module');
    var student = require('./lib/student_module');
    var youtube = require('./lib/youtube');
    var discussions = require('./lib/discussion');

    var ptor = protractor.getInstance();
    var params = ptor.params
    ptor.driver.manage().window().maximize();


    xdescribe("1", function(){

        it('should sign in as teacher', function(){
            o_c.sign_in(ptor, params.teacher_mail, params.password, o_c.feedback);
        })

        it('should create_course', function(){
            teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites, o_c.feedback);
        })

        it('should get the enrollment key and enroll student', function() {
            teacher.get_key_and_enroll(ptor);
        })
        //test
        it('should add a module and lecture to create quizzes', function(){
            o_c.open_course_whole(ptor);
            teacher.add_module(ptor, o_c.feedback);
            teacher.open_module(ptor, 1);
            teacher.create_lecture(ptor, "mcq_quiz","https://www.youtube.com/watch?v=SKqBmAHwSkg", o_c.feedback);
        })

        it('should open the course to be tested', function(){
            o_c.to_student(ptor);
            o_c.open_course_whole(ptor);
            o_c.open_tray(ptor);
            o_c.open_lectures(ptor);
            discussions.ask_public_question(ptor, "question 1");
            check_discussion_no(ptor, 1);
        })


        it('should clear the course for deletion', function(){
            o_c.to_teacher(ptor);
            o_c.open_course_whole(ptor);

            teacher.open_module(ptor, 1);
            teacher.delete_item_by_number(ptor, 1, 1, o_c.feedback);

            teacher.delete_empty_module(ptor, 1, o_c.feedback);
        })
        //end test

        it('should delete course', function(){
            //should choose one of home() or home_teacher() 
            //depending on the current state(student or teacher)
            o_c.home(ptor);
            teacher.delete_course(ptor, o_c.feedback);
        })
    })

    describe("2", function(){

        it('should sign in as teacher', function(){
            o_c.sign_in(ptor, params.teacher_mail, params.password, o_c.feedback);
        })

        it('should create_course', function(){
            teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites, o_c.feedback);
        })

        it('should get the enrollment key and enroll student', function(){
            teacher.get_key_and_enroll(ptor);
        })
        //test
        it('should add a module and lecture to create quizzes', function(){
            o_c.open_course_whole(ptor);
            teacher.add_module(ptor, o_c.feedback);
            teacher.open_module(ptor, 1);
            teacher.create_lecture(ptor, "mcq_quiz","https://www.youtube.com/watch?v=SKqBmAHwSkg", o_c.feedback);
        })

        it('should open the course to be tested', function(){
            o_c.to_student(ptor);
            o_c.open_course_whole(ptor);
            o_c.open_tray(ptor);
            o_c.open_lectures(ptor);
            youtube.seek(ptor, 50);
            discussions.ask_public_question(ptor, "question 1");
            discussions.comment(ptor, 1, "comment 1");
            discussions.comment(ptor, 1, "comment 2");
            o_c.home(ptor);
            o_c.open_tray(ptor);
            o_c.logout(ptor, o_c.feedback);
            o_c.sign_in(ptor);
            discussions.flag(ptor, 1);
            discussions.flag_comment(ptor, 1, 2)
            ptor.sleep(15000);
            //check_discussion_location(ptor);
        })


        it('should clear the course for deletion', function(){
            o_c.to_teacher(ptor);
            o_c.open_course_whole(ptor);

            teacher.open_module(ptor, 1);
            teacher.delete_item_by_number(ptor, 1, 1, o_c.feedback);

            teacher.delete_empty_module(ptor, 1, o_c.feedback);
        })
        //end test

        it('should delete course', function(){
            //should choose one of home() or home_teacher() 
            //depending on the current state(student or teacher)
            o_c.home(ptor);
            teacher.delete_course(ptor, o_c.feedback);
        })
    })


    //===================================================
    // quiz tab is checked by default so this uncheck it
    //===================================================
    function uncheck_quiz(ptor){
        locator.by_id(ptor, 'quiz_checkbox').then(function(btn){
            btn.click();
        })
    }

    //===================================================
    // checks the disscussion check box to start testing
    //===================================================
    function check_discussion(ptor){
        locator.by_id(ptor, 'discussion_checkbox').then(function(btn){
            btn.click();
        })
    }

    //============================================================
    // checks the number of questions given a number as parameter
    //============================================================
    function check_discussion_no(ptor, dis_no){
        locator.by_repeater(ptor, 'element in timeline').then(function(elements){
            expect(elements.length).toEqual(dis_no);
        })
    }

    //=================================================================
    // checks the pausing and playing through the question submission
    //=================================================================

    function check_question_flow(ptor){
        locator.by_classname(ptor, 'questionDiv').then(function(btn){
            btn.click().then(function(){
                youtube.is_paused(ptor);
                locator.by_xpath(ptor, "//*[@id='show_question']/table/tbody/tr[1]/td/textarea").then(function(textarea){
                    textarea.sendKeys('question 1').then(function(){
                        locator.by_xpath(ptor, "//*[@id='show_question']/table/tbody/tr[2]/td[2]/input").then(function(save){
                            save.click().then(function(){
                                youtube.is_playing(ptor);
                            })
                        })
                    })
                })
            })
        })
    }

    //==========================================================
    // 		checks for the question appearance in videonotes
    //==========================================================

    function check_discussions_in_videonotes(ptor){
        var video_notes = 0;
        locator.by_id(ptor, 'video_notes').then(function(video_notes_btn){
            video_notes_btn.click().then(function(){
                ptor.sleep(2000);
                locator.s_by_classname(ptor, 'ace_breakpoint').then(function(notes){
                    video_notes = notes.length;
                    locator.by_id(ptor,'video_events').then(function(btn){
                        btn.click();
                    })
                    ask_a_question(ptor,'question ya zmeel');
                    ptor.sleep(10000);
                    locator.by_id(ptor, 'video_notes').then(function(video_notes_btn){
                        video_notes_btn.click().then(function(){
                            ptor.sleep(2000);
                            locator.s_by_classname(ptor, 'ace_breakpoint').then(function(notess){
                                expect(notess.length).toEqual(video_notes+1);
                            })
                        })
                    })
                })
            })
        })
    }

    function check_discussion_location(ptor){
        locator.by_classname(ptor, 'elapsed').then(function(progress_bar){
            progress_bar.getLocation().then(function(location){
                ask_public_question(ptor, "question 1");
                progress_bar.getSize().then(function(size){
                    locator.by_repeater(ptor, 'element in timeline').then(function(elements){
                        elements[0].getLocation().then(function(loc){
                            expect(location.x+size.width).toEqual(loc.x);
                            expect(location.y).toEqual(loc.y);
                        })
                    })
                })
            })
        })
    }

}