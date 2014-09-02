var ptor = protractor.getInstance();
var locator = require('./locators');
var params = ptor.params;

exports.ask_private_question = function(ptor, text){
    this.ask_a_question(ptor, text, 0)
}


exports.ask_public_question = function(ptor, text){
    this.ask_a_question(ptor, text, 1)
}

//==========================================================
//      ask a question given the question context
//==========================================================

exports.ask_a_question = function(ptor, ques_string, type){
    var questions_no = 0;
    element.all(by.name('discussion-timeline-item')).then(function(items){
        questions_no = items.length
    })
    element(by.className('questionDiv')).click();
    var question = element(by.id('show_question'))

    question.element(by.tagName('textarea')).sendKeys(ques_string);
    question.element(by.tagName('select')).click().then(function(){
        question.all(by.tagName('option')).then(function(options){
            options[type].click()
        })
    })
    element(by.buttonText('Ask')).click().then(function(){
        expect(element.all(by.name('discussion-timeline-item')).count()).toEqual(questions_no+1)
    })
}

// discussion-comment
exports.comment = function(ptor, q_no, text){
    locator.s_by_partial_text(ptor, 'Comment').then(function(c){
        c[q_no-1].click();        
    })
    locator.s_by_name(ptor, 'comment_area').then(function(ca){
        ca[q_no-1].sendKeys(text).then(function(){
            ptor.actions().sendKeys(protractor.Key.ENTER).perform();
        })
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
        questions[q_no-1].findElement(protractor.By.className('upvote')).click();
    })
}

exports.vote_down = function(ptor, q_no){
    // locator.by_repeater(ptor, 'item in timeline').then(function(ques){
    //         ques[q_no-1].findElement(protractor.By.className('icon-chevron-down')).click();
    // })
    locator.s_by_name(ptor, 'discussion-timeline-item').then(function(questions){
        questions[q_no-1].findElement(protractor.By.className('downvote')).click();
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