    var locator = require('./lib/locators');
    var o_c = require('./lib/openers_and_clickers');
    var teacher = require('./lib/teacher_module');
    var student = require('./lib/student_module');
    var youtube = require('./lib/youtube.js');

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
            ask_public_question(ptor, "question 1");
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
            ask_public_question(ptor, "question 1");
            comment(ptor, 1, "comment 1");
            comment(ptor, 1, "comment 2");
            o_c.home(ptor);
            o_c.open_tray(ptor);
            o_c.logout(ptor, o_c.feedback);
            o_c.sign_in(ptor);
            flag(ptor, 1);
            flag_comment(ptor, 1, 2)
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
    //ask private question and check the total number of question
    //============================================================

    function ask_private_question(ptor, text){
        locator.by_classname(ptor, 'questionDiv').click();

        locator.by_id(ptor, 'show_question').then(function(ele){
            ele.findElement(protractor.By.tagName('textarea')).sendKeys(text);
            ele.findElement(protractor.By.className('btn-primary')).click();
        })
    }


    function ask_public_question(ptor, text){
        locator.by_classname(ptor, 'questionDiv').click();

        locator.by_id(ptor, 'show_question').then(function(ele){
            ele.findElement(protractor.By.tagName('textarea')).sendKeys(text);
            ele.findElement(protractor.By.tagName('select')).click().then(function(){
                ele.findElements(protractor.By.tagName('option')).then(function(op){
                    op[1].click();
                })
            })
            ele.findElement(protractor.By.className('btn-primary')).click();
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
    //		ask a question given the question context
    //==========================================================

    function ask_a_question(ptor, ques_string){
        var questions_no = 0;
        locator.by_repeater(ptor, 'element in timeline').then(function(questions){
            questions_no = questions.length;
        })
        locator.by_classname(ptor, 'questionDiv').then(function(btn){
            btn.click().then(function(){
                locator.by_xpath(ptor, "//*[@id='show_question']/table/tbody/tr[1]/td/textarea").then(function(textarea){
                    textarea.sendKeys(ques_string).then(function(){
                        locator.by_xpath(ptor, "//*[@id='show_question']/table/tbody/tr[2]/td[2]/input").then(function(save){
                            save.click().then(function(){
                                locator.by_repeater(ptor, 'element in timeline').then(function(elements){
                                    expect(elements.length).toEqual(questions_no+1);
                                })
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

    function comment(ptor, q_no, text){
        locator.by_repeater(ptor, 'item in timeline').then(function(ques){
            ques[q_no-1].findElement(protractor.By.tagName('textarea')).sendKeys(text);
            ques[q_no-1].findElement(protractor.By.className('btn-small')).click();
            ques[q_no-1].findElement(protractor.By.className('btn-small')).click();
        })
    }

    function flag(ptor, q_no){
        locator.by_repeater(ptor, 'item in timeline').then(function(ques){
            ques[q_no-1].findElement(protractor.By.className('flag')).click();
        })	
    }

    function flag_comment(ptor, q_no, co_no){
        locator.by_repeater(ptor, 'item in timeline').then(function(ques){
            ques[q_no-1].findElements(protractor.By.repeater('comment_data in item.data.comments')).then(function(comments){
                comments[co_no-1].findElement(protractor.By.className('flag')).click();
            })
        })	
    }

    function vote_up(ptor, q_no){
        locator.by_repeater(ptor, 'item in timeline').then(function(ques){
                ques[q_no-1].findElement(protractor.By.className('icon-chevron-up')).click();
        })
    }

    function vote_down(ptor, q_no){
        locator.by_repeater(ptor, 'item in timeline').then(function(ques){
                ques[q_no-1].findElement(protractor.By.className('icon-chevron-down')).click();
        })
    }

    function vote_comment_up(ptor, q_no, co_no){
        locator.by_repeater(ptor, 'item in timeline').then(function(ques){
            ques[q_no-1].findElements(protractor.By.repeater('comment_data in item.data.comments')).then(function(comments){
                comments[co_no-1].findElement(protractor.By.className('icon-chevron-up')).click();
            })
        })	
    }

    function vote_comment_down(ptor, q_no, co_no){
        locator.by_repeater(ptor, 'item in timeline').then(function(ques){
            ques[q_no-1].findElements(protractor.By.repeater('comment_data in item.data.comments')).then(function(comments){
                comments[co_no-1].findElement(protractor.By.className('icon-chevron-down')).click();
            })
        })	
    }