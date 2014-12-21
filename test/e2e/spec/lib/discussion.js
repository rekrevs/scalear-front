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
    element(by.id('ask_question_button')).click();
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

exports.flag = function(ptor, q_no){
    locator.s_by_name(ptor, 'discussion-timeline-item').then(function(questions){
        questions[q_no-1].findElement(protractor.By.name('flag')).then(function(f){
            f.findElements(protractor.By.tagName('img')).then(function(img){
                img[1].click();
            })
        })
    })
}

exports.unflag = function(ptor, q_no){
    locator.s_by_name(ptor, 'discussion-timeline-item').then(function(questions){
        questions[q_no-1].findElement(protractor.By.name('flag')).then(function(f){
            f.findElements(protractor.By.tagName('img')).then(function(img){
                img[0].click();
            })
        })
    })
}

exports.vote_up = function(ptor, q_no){
    locator.s_by_name(ptor, 'discussion-timeline-item').then(function(questions){
        questions[q_no-1].findElement(protractor.By.tagName('voting-button')).then(function(f){
            f.findElements(protractor.By.tagName('img')).then(function(img){
                img[0].click();
            })
        })
    })
}

exports.vote_down = function(ptor, q_no){
    locator.s_by_name(ptor, 'discussion-timeline-item').then(function(questions){
        questions[q_no-1].findElement(protractor.By.tagName('voting-button')).then(function(f){
            f.findElements(protractor.By.tagName('img')).then(function(img){
                img[0].click();
            })
        })
    })
}

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

////////////////////////////////////
exports.flag_comment = function(ptor, q_no, co_no){
    locator.s_by_name(ptor, 'discussion-timeline-item').then(function(questions){
        questions[q_no-1].findElements(protractor.By.className('discussion-comment')).then(function(comments){
            comments[co_no-1].findElement(protractor.By.name('flag_comment')).then(function(f){
                f.findElements(protractor.By.tagName('img')).then(function(img){
                    img[1].click();
                })
            })
        })
    })
}

exports.unflag_comment = function(ptor, q_no, co_no){
    locator.s_by_name(ptor, 'discussion-timeline-item').then(function(questions){
        questions[q_no-1].findElements(protractor.By.className('discussion-comment')).then(function(comments){
            comments[co_no-1].findElement(protractor.By.name('flag_comment')).then(function(f){
                f.findElements(protractor.By.tagName('img')).then(function(img){
                    img[0].click();
                })
            })
        })
    })
}

exports.vote_comment_up = function(ptor, q_no, co_no){
    locator.s_by_name(ptor, 'discussion-timeline-item').then(function(questions){
        questions[q_no-1].findElements(protractor.By.className('discussion-comment')).then(function(comments){
            comments[co_no-1].findElement(protractor.By.tagName('voting-button')).then(function(f){
                f.findElements(protractor.By.tagName('img')).then(function(img){
                    img[0].click();
                })
            })
        })
    })
}

exports.vote_comment_down = function(ptor, q_no, co_no){
    locator.s_by_name(ptor, 'discussion-timeline-item').then(function(questions){
        questions[q_no-1].findElements(protractor.By.className('discussion-comment')).then(function(comments){
            comments[co_no-1].findElement(protractor.By.tagName('voting-button')).then(function(f){
                f.findElements(protractor.By.tagName('img')).then(function(img){
                    img[1].click();
                })
            })
        })
    })
}