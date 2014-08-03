var ptor = protractor.getInstance();
var locator = require('./locators');
var o_c = require('./openers_and_clickers');
var params = ptor.params;


//=====================================
//        new layout testing
//=====================================
exports.check_module_number = function(ptor, no_of_mo){
  locator.by_repeater(ptor, 'module in modules').then(function(mods){
    expect(mods.length).toEqual(no_of_mo);
  })
}

exports.check_item_number = function(ptor, total_item_no){
    locator.by_repeater(ptor, 'item in module.items').then(function(items){
        expect(items.length).toEqual(total_item_no);
    })
}

//=====================================
//        join course by key
//=====================================
<<<<<<< HEAD
exports.join_course = function(ptor, key)
{
    o_c.open_join_course(ptor);
    locator.by_id(ptor,'join_course').then(function(link)
    {
        link.click();
    });
    locator.by_name(ptor, 'key').then(function(input)
    {
        input.sendKeys(key);
    });
    locator.by_xpath(ptor, '/html/body/div[4]/div/div[2]/button[1]').then(function(button)
    {
        button.click();
    });
}

//=====================================
//       check course information
//=====================================
exports.check_course_info = function(ptor, course_code, course_name, description, prereq, disscussion_link, course_date, course_duration){
    ptor.findElement(protractor.By.id('course_code_name')).then(function(code_name){
        expect(code_name.getText()).toContain(course_code);
        expect(code_name.getText()).toContain(course_name);
    })
    ptor.findElement(protractor.By.id('course_description')).then(function(course_description){
        expect(course_description.getText()).toContain(description);
    })
    ptor.findElement(protractor.By.id('course_prerequisites')).then(function(prerequisites){
        expect(prerequisites.getText()).toContain(prereq);
    })
    ptor.findElement(protractor.By.id('discussion_link')).then(function(disc_link){
        expect(disc_link.getText()).toContain(disscussion_link);
    })
//    ptor.findElement(protractor.By.id('course_date')).then(function(date){
//        date.getText().then(function(text){
//            expect(course_date).toContain(text.split(" ")[1]);
//        });
//    })
    ptor.findElement(protractor.By.id('course_duration')).then(function(duration){
        expect(duration.getText()).toContain(course_duration);
    })
}

//=====================================
//    solves normal quiz MCQ or OCQ question
//=====================================
exports.mcq_answer = function(ptor, question_no, choice_no){
  this.solve_quiz_question(ptor, question_no, choice_no)
}

exports.ocq_answer = function(ptor, question_no, choice_no){
  this.solve_quiz_question(ptor, question_no, choice_no)
}

exports.solve_quiz_question=function(ptor, question_no, choice_no){
  element(by.repeater('question in quiz.questions').row(question_no-1)).all(by.tagName('input')).get(choice_no-1).click()
}
//=====================================
//    solves normal quiz DRAG question
//=====================================

exports.drag_answer = function(ptor, question_no){
  var this_question = element(by.repeater('question in quiz.questions').row(question_no-1))
  var handles = this_question.all(by.className('handle'))
  var answers = this_question.all(by.tagName('li'))
  for(var i=0; i<3; i++){
    answers.get(0).getText().then(function(text){
      if(text == 'answer1')
        ptor.actions().dragAndDrop(handles.get(0), handles.get(1)).perform();
      else if(text == 'answer2')
        ptor.actions().dragAndDrop(handles.get(0), handles.get(2)).perform();
    })
    answers.get(1).getText().then(function(text){
      if(text == 'answer0')
        ptor.actions().dragAndDrop(handles.get(1), handles.get(0)).perform();
      else if(text == 'answer2')
        ptor.actions().dragAndDrop(handles.get(1), handles.get(2)).perform();
    })
    answers.get(2).getText().then(function(text){
      if(text == 'answer0')
        ptor.actions().dragAndDrop(handles.get(2), handles.get(0)).perform();
      else if(text == 'answer1')
        ptor.actions().dragAndDrop(handles.get(2), handles.get(1)).perform();
    })
  }
}

//======================================================
//    solves normal quiz free or match string question
//======================================================

exports.free_match_answer = function(ptor, question_no, desired_text){
  element(by.repeater('question in quiz.questions').row(question_no-1)).element(by.tagName('textarea')).sendKeys(desired_text)

    // locator.by_repeater(ptor, 'question in quiz.questions').then(function(rep){
    //     rep[question_no-1].findElement(protractor.By.tagName('textarea')).then(function(text_area){
    //       text_area.sendKeys(desired_text)
    //     })
    // })
}
    
//=====================================
//    submits a normal quiz
//=====================================

exports.submit_normal_quiz = function(ptor){
  element(by.buttonText('Submit')).click()
}

exports.save_survey = function(ptor){
  element(by.buttonText('Save')).click()
}

//=====================================
//          press confused btn
//=====================================

exports.press_confused_btn = function(ptor){
  var confused_no = 0;
  element.all(by.name('confused-timeline-item')).then(function(items){
    confused_no = items.length
  })
  element(by.className('confusedDiv')).click().then(function(){
    expect(element.all(by.name('confused-timeline-item')).count()).toEqual(confused_no+1)
  })
}
