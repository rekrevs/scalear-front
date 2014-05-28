var ptor = protractor.getInstance();
var locator = require('./locators');
var params = ptor.params;

exports.ask_private_question = function(ptor, text){
    locator.by_classname(ptor, 'questionDiv').click();

    locator.by_id(ptor, 'show_question').then(function(ele){
        ele.findElement(protractor.By.tagName('textarea')).sendKeys(text);
        ele.findElement(protractor.By.className('btn-primary')).click();
    })
}


exports.ask_public_question = function(ptor, text){
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

//==========================================================
//      ask a question given the question context
//==========================================================

exports.ask_a_question = function(ptor, ques_string){
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


exports.comment = function(ptor, q_no, text){
    // locator.by_repeater(ptor, 'item in timeline').then(function(ques){
    //     ques[q_no-1].findElement(protractor.By.tagName('textarea')).sendKeys(text);
    //     ques[q_no-1].findElement(protractor.By.className('btn-small')).click();
    //     ques[q_no-1].findElement(protractor.By.className('btn-small')).click();
    // })
    locator.s_by_name(ptor, 'discussion-timeline-item').then(function(questions){
        questions[q_no-1].findElement(protractor.By.tagName('textarea')).sendKeys(text);
        questions[q_no-1].findElement(protractor.By.className('btn-small')).click();
        questions[q_no-1].findElement(protractor.By.className('btn-small')).click();
    })
}

exports.flag = function(ptor, q_no){
    // locator.by_repeater(ptor, 'item in timeline').then(function(ques){
    //     ques[q_no-1].findElement(protractor.By.className('flag')).click();
    // })  
    locator.s_by_name(ptor, 'discussion-timeline-item').then(function(questions){
        questions[q_no-1].findElement(protractor.By.className('flag')).click();
    })

}

exports.flag_comment = function(ptor, q_no, co_no){
    // locator.by_repeater(ptor, 'item in timeline').then(function(ques){
    //     ques[q_no-1].findElements(protractor.By.repeater('comment_data in item.data.comments')).then(function(comments){
    //         comments[co_no-1].findElement(protractor.By.className('flag')).click();
    //     })
    // })  
    locator.s_by_name(ptor, 'discussion-timeline-item').then(function(questions){
        questions[q_no-1].findElements(protractor.By.repeater('comment_data in item.data.comments')).then(function(comments){
            comments[co_no-1].findElement(protractor.By.className('flag')).click();
        })
    })
}

exports.vote_up = function(ptor, q_no){
    // locator.by_repeater(ptor, 'item in timeline').then(function(ques){
    //         ques[q_no-1].findElement(protractor.By.className('icon-chevron-up')).click();
    // })
    locator.s_by_name(ptor, 'discussion-timeline-item').then(function(questions){
        questions[q_no-1].findElement(protractor.By.className('icon-chevron-up')).click();
    })
}

exports.vote_down = function(ptor, q_no){
    // locator.by_repeater(ptor, 'item in timeline').then(function(ques){
    //         ques[q_no-1].findElement(protractor.By.className('icon-chevron-down')).click();
    // })
    locator.s_by_name(ptor, 'discussion-timeline-item').then(function(questions){
        questions[q_no-1].findElement(protractor.By.className('icon-chevron-down')).click();
    })
}

exports.vote_comment_up = function(ptor, q_no, co_no){
    // locator.by_repeater(ptor, 'item in timeline').then(function(ques){
    //     ques[q_no-1].findElements(protractor.By.repeater('comment_data in item.data.comments')).then(function(comments){
    //         comments[co_no-1].findElement(protractor.By.className('icon-chevron-up')).click();
    //     })
    // })  
    locator.s_by_name(ptor, 'discussion-timeline-item').then(function(questions){
        questions[q_no-1].findElements(protractor.By.repeater('comment_data in item.data.comments')).then(function(comments){
            comments[co_no-1].findElement(protractor.By.className('icon-chevron-up')).click();
        })
    })
}

exports.vote_comment_down = function(ptor, q_no, co_no){
    // locator.by_repeater(ptor, 'item in timeline').then(function(ques){
    //     ques[q_no-1].findElements(protractor.By.repeater('comment_data in item.data.comments')).then(function(comments){
    //         comments[co_no-1].findElement(protractor.By.className('icon-chevron-down')).click();
    //     })
    // }) 
    locator.s_by_name(ptor, 'discussion-timeline-item').then(function(questions){
        questions[q_no-1].findElements(protractor.By.repeater('comment_data in item.data.comments')).then(function(comments){
            comments[co_no-1].findElement(protractor.By.className('icon-chevron-down')).click();
        })
    })
}