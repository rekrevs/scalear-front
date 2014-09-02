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

exports.check_item_number = function(ptor, module_num, total_item_no){
  element(by.repeater('module in modules').row(module_num-1)).all(by.repeater('item in module.items')).then(function(items){
    expect(items.length).toEqual(total_item_no)
  })
    // locator.by_repeater(ptor, 'item in module.items').then(function(items){
    //     expect(items.length).toEqual(total_item_no);
    // })
}

exports.check_timeline_item_number = function(ptor, num){
  expect(element.all(by.repeater("l in items")).count()).toBe(num)
}

//=====================================
//        join course by key
//=====================================
exports.join_course = function(ptor, key){
    o_c.open_join_course(ptor);
    element(by.name('key')).sendKeys(key)
    element(by.buttonText('Enroll')).click()
}

//=====================================
//       check course information
//=====================================
exports.check_course_info = function(ptor, course_code, course_name, description, prereq, course_date, course_duration){
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
    // ptor.findElement(protractor.By.id('discussion_link')).then(function(disc_link){
    //     expect(disc_link.getText()).toContain(disscussion_link);
    // })
   // ptor.findElement(protractor.By.id('course_date')).then(function(date){
   //     date.getText().then(function(text){
   //         expect(course_date).toContain(text.split(" ")[1]);
   //     });
   // })
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
  element(by.repeater('question in quiz.questions').row(question_no-1)).element(by.tagName('textarea')).clear().sendKeys(desired_text)

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
//    submits a invideo quiz
//=====================================


exports.expect_quiz=function(ptor){
  expect(element(by.buttonText('Check Answer')).isDisplayed()).toEqual(true);
}

exports.answer_quiz=function(ptor){
  element(by.buttonText('Check Answer')).click()
}

exports.check_answer_correct=function(ptor){
  locator.by_tag(ptor,'notification').then(function(popover){
    expect(popover.getText()).toContain('Correct');
  })
}

exports.check_answer_incorrect=function(ptor){
  locator.by_tag(ptor,'notification').then(function(popover){
    expect(popover.getText()).toContain('Incorrect');
  })
}

exports.check_answer_thanks=function(ptor){
  locator.by_tag(ptor,'notification').then(function(popover){
    expect(popover.getText()).toContain('Thank you for your answer');
  })
}

exports.expect_drag_popover_on_hover_incorrect=function(ptor){
  locator.s_by_classname(ptor, 'ui-droppable').then(function(place){
    ptor.actions().mouseMove(place[0]).perform();
    ptor.actions().mouseMove({x: 5, y: 5}).perform();
    locator.by_classname(ptor, 'popover-title').then(function(popover){
      expect(popover.getText()).toContain("Incorrect");
    })

    ptor.actions().mouseMove(place[1]).perform();
    ptor.actions().mouseMove({x: 5, y: 5}).perform();
    locator.by_classname(ptor, 'popover-title').then(function(popover){
      expect(popover.getText()).toContain("Incorrect");
    })

    ptor.actions().mouseMove(place[2]).perform();
    ptor.actions().mouseMove({x: 5, y: 5}).perform();
    locator.by_classname(ptor, 'popover-title').then(function(popover){
      expect(popover.getText()).toContain("Incorrect");
    })
  })
}

exports.expect_drag_popover_on_hover_correct=function(ptor){
  locator.s_by_classname(ptor, 'ui-droppable').then(function(place){
    ptor.actions().mouseMove(place[0]).perform();
    ptor.actions().mouseMove({x: 5, y: 5}).perform();
    locator.by_classname(ptor, 'popover-title').then(function(popover){
      expect(popover.getText()).toContain("Correct");
    })

    ptor.actions().mouseMove(place[1]).perform();
    ptor.actions().mouseMove({x: 5, y: 5}).perform();
    locator.by_classname(ptor, 'popover-title').then(function(popover){
      expect(popover.getText()).toContain("Correct");
    })

    ptor.actions().mouseMove(place[2]).perform();
    ptor.actions().mouseMove({x: 5, y: 5}).perform();
    locator.by_classname(ptor, 'popover-title').then(function(popover){
      expect(popover.getText()).toContain("Correct");
    })
  })
}

exports.expect_popover_on_hover_correct=function(ptor, no){
  locator.by_id(ptor,'ontop').findElements(protractor.By.tagName('input')).then(function(check_boxes){
    ptor.actions().mouseMove(check_boxes[no-1]).perform();
    ptor.actions().mouseMove({x: 5, y: 5}).perform();
    locator.by_classname(ptor, 'popover-title').then(function(popover){
      expect(popover.getText()).toContain("Correct");
    })
  })
}

exports.expect_popover_on_hover_incorrect=function(ptor, no){
  locator.by_id(ptor,'ontop').findElements(protractor.By.tagName('input')).then(function(check_boxes){
    ptor.actions().mouseMove(check_boxes[no-1]).perform();
    ptor.actions().mouseMove({x: 5, y: 5}).perform();
    locator.by_classname(ptor, 'popover-title').then(function(popover){
      expect(popover.getText()).toContain("Incorrect");
    })
  })
}

exports.expect_no_popover=function(ptor, no){
  locator.by_id(ptor,'ontop').findElements(protractor.By.tagName('input')).then(function(check_boxes){
    ptor.actions().mouseMove(check_boxes[no-1]).perform();
    ptor.actions().mouseMove({x: 5, y: 5}).perform();
    ptor.isElementPresent(by.className('popover-title')).then(function(present){
          expect(present).toBe(false);
      })
  })
}

exports.check_explanation = function(ptor, no, exp){
  locator.by_id(ptor,'ontop').findElements(protractor.By.tagName('input')).then(function(check_boxes){
    ptor.actions().mouseMove(check_boxes[no-1]).perform();
    ptor.actions().mouseMove({x: 5, y: 5}).perform();
    locator.by_classname(ptor, 'popover').then(function(popover){
      expect(popover.getText()).toContain(exp);
    })
  })
}

//=====================================
//    answer mcq invideo quiz
//=====================================
exports.check_invideo_mcq_no=function(ptor, no){
  locator.by_id(ptor,'ontop').findElements(protractor.By.tagName('input')).then(function(check_boxes){
    expect(check_boxes.length).toEqual(no);
  })
}

exports.answer_invideo_mcq=function(ptor, choice_no){
  locator.by_id(ptor,'ontop').findElements(protractor.By.tagName('input')).then(function(check_boxes){
    check_boxes[choice_no-1].click();
  })
}

//=====================================
//    answer ocq invideo quiz
//=====================================
exports.check_invideo_ocq_no=function(ptor, no){
  locator.by_id(ptor,'ontop').findElements(protractor.By.tagName('input')).then(function(check_boxes){
    expect(check_boxes.length).toEqual(no);
  })
}

exports.answer_invideo_ocq=function(ptor, choice_no){
    locator.by_id(ptor,'ontop').findElements(protractor.By.tagName('input')).then(function(check_boxes){
    check_boxes[choice_no-1].click();
  })
}

//=====================================
//    answer drag invideo quiz
//=====================================

exports.check_text_drag_no=function(ptor, no){
  locator.by_classname(ptor,'drag-sort').findElements(protractor.By.tagName('li')).then(function(answer){
    expect(answer.length).toEqual(no);
  })
}

exports.check_drags_no=function(ptor, no){
  locator.by_repeater(ptor,'answer in selected_quiz.online_answers').then(function(check_boxes){
    expect(check_boxes.length).toEqual(no);
  })
}

exports.answer_text_drag_correct=function(ptor){
  for (var i = 0; i < 3; i++) {
    locator.by_classname(ptor,'drag-sort').findElements(protractor.By.className('ui-icon-arrowthick-2-n-s')).then(function(arrow){
      locator.by_classname(ptor,'drag-sort').findElements(protractor.By.tagName('li')).then(function(answer){
        answer[0].getText().then(function (text){
          if(text == 'answer 3'){
            ptor.actions().dragAndDrop(arrow[0], arrow[2]).perform();
          }
          else if(text == 'answer 2'){
            ptor.actions().dragAndDrop(arrow[0], arrow[1]).perform();
          }
        })
        answer[1].getText().then(function (text){
          if(text == 'answer 1'){
            ptor.actions().dragAndDrop(arrow[1], arrow[0]).perform();
          }
          else if(text == 'answer 3'){
            ptor.actions().dragAndDrop(arrow[1], arrow[2]).perform();
          }
        })
        answer[2].getText().then(function (text){
          if(text == 'answer 1'){
            ptor.actions().dragAndDrop(arrow[2], arrow[0]).perform();
          }
          else if(text == 'answer 2'){
            ptor.actions().dragAndDrop(arrow[2], arrow[1]).perform();
          }
        })    
      })
    })
  }
  ptor.sleep(3000);
}

 exports.answer_text_drag_incorrect=function(ptor){
  locator.by_classname(ptor,'drag-sort').findElements(protractor.By.className('ui-icon-arrowthick-2-n-s')).then(function(arrow){
    locator.by_classname(ptor,'drag-sort').findElements(protractor.By.tagName('li')).then(function(answer){
      answer[0].getText().then(function (text){
        if(text == 'answer 1'){
          ptor.actions().dragAndDrop(arrow[2], arrow[0]).perform();
        }
      })
      answer[1].getText().then(function (text){
        if(text == 'answer 1'){
          ptor.actions().dragAndDrop(arrow[1], arrow[2]).perform();
        }
        else if(text == 'answer 3'){
          ptor.actions().dragAndDrop(arrow[1], arrow[0]).perform();
        }
      })
      answer[2].getText().then(function (text){
        if(text == 'answer 3'){
          ptor.actions().dragAndDrop(arrow[0], arrow[2]).perform();
        }
        if(text == 'answer 1'){
          ptor.actions().dragAndDrop(arrow[2], arrow[0]).perform();
        }
      })
    })
  })
  ptor.sleep(3000);
}

exports.answer_drag_correct=function(ptor){
  //shuffle answers so all becomes clickable
  locator.s_by_classname(ptor,'dragged').then(function(answer){
      ptor.actions().mouseMove(answer[0]).perform();
      ptor.actions().mouseMove({x: 5, y: 5}).perform();
      ptor.actions().mouseDown().perform();
      ptor.actions().mouseMove({x: 100, y: 0}).perform();
      ptor.actions().mouseUp().perform();
      
      ptor.actions().mouseMove(answer[1]).perform();
      ptor.actions().mouseMove({x: 5, y: 5}).perform();
      ptor.actions().mouseDown().perform();
      ptor.actions().mouseMove({x: 200, y: 0}).perform();
      ptor.actions().mouseUp().perform();

      ptor.actions().mouseMove(answer[2]).perform();
      ptor.actions().mouseMove({x: 5, y: 5}).perform();
      ptor.actions().mouseDown().perform();
      ptor.actions().mouseMove({x: 300, y: 0}).perform();
      ptor.actions().mouseUp().perform();
    })
  locator.s_by_classname(ptor, 'ui-droppable').then(function(place){
    locator.s_by_classname(ptor,'dragged').then(function(answer){
      answer[0].getText().then(function (text){
        ptor.actions().mouseMove(answer[0]).perform();
        ptor.actions().mouseMove({x: 5, y: 5}).perform();
        ptor.actions().mouseDown().perform();
        ptor.actions().mouseMove(place[(text.split(' ')[1]-1)]).perform();
        ptor.actions().mouseMove({x: 5, y: 5}).perform();
        ptor.actions().mouseUp().perform(); 
      })

      answer[1].getText().then(function (text){
        ptor.actions().mouseMove(answer[1]).perform();
        ptor.actions().mouseMove({x: 5, y: 5}).perform();
        ptor.actions().mouseDown().perform();
        ptor.actions().mouseMove(place[(text.split(' ')[1]-1)]).perform();
        ptor.actions().mouseMove({x: 5, y: 5}).perform();
        ptor.actions().mouseUp().perform(); 
      })

      answer[2].getText().then(function (text){
        ptor.actions().mouseMove(answer[2]).perform();
        ptor.actions().mouseMove({x: 5, y: 5}).perform();
        ptor.actions().mouseDown().perform();
        ptor.actions().mouseMove(place[(text.split(' ')[1]-1)]).perform();
        ptor.actions().mouseMove({x: 5, y: 5}).perform();
        ptor.actions().mouseUp().perform(); 
      })
    })
  })
    ptor.sleep(3000);
}


exports.answer_drag_incorrect=function(ptor){
  //shuffle answers so all becomes clickable
  locator.s_by_classname(ptor,'dragged').then(function(answer){
      ptor.actions().mouseMove(answer[0]).perform();
      ptor.actions().mouseMove({x: 5, y: 5}).perform();
      ptor.actions().mouseDown().perform();
      ptor.actions().mouseMove({x: 100, y: 0}).perform();
      ptor.actions().mouseUp().perform();
      
      ptor.actions().mouseMove(answer[1]).perform();
      ptor.actions().mouseMove({x: 5, y: 5}).perform();
      ptor.actions().mouseDown().perform();
      ptor.actions().mouseMove({x: 200, y: 0}).perform();
      ptor.actions().mouseUp().perform();

      ptor.actions().mouseMove(answer[2]).perform();
      ptor.actions().mouseMove({x: 5, y: 5}).perform();
      ptor.actions().mouseDown().perform();
      ptor.actions().mouseMove({x: 300, y: 0}).perform();
      ptor.actions().mouseUp().perform();
    })
  locator.s_by_classname(ptor, 'ui-droppable').then(function(place){
    locator.s_by_classname(ptor,'dragged').then(function(answer){
      answer[2].getText().then(function (text){
        ptor.actions().mouseMove(answer[0]).perform();
        ptor.actions().mouseMove({x: 5, y: 5}).perform();
        ptor.actions().mouseDown().perform();
        ptor.actions().mouseMove(place[(text.split(' ')[1]-1)]).perform();
        ptor.actions().mouseMove({x: 5, y: 5}).perform();
        ptor.actions().mouseUp().perform(); 
      })

      answer[1].getText().then(function (text){
        ptor.actions().mouseMove(answer[2]).perform();
        ptor.actions().mouseMove({x: 5, y: 5}).perform();
        ptor.actions().mouseDown().perform();
        ptor.actions().mouseMove(place[(text.split(' ')[1]-1)]).perform();
        ptor.actions().mouseMove({x: 5, y: 5}).perform();
        ptor.actions().mouseUp().perform(); 
      })

      answer[0].getText().then(function (text){
        ptor.actions().mouseMove(answer[1]).perform();
        ptor.actions().mouseMove({x: 5, y: 5}).perform();
        ptor.actions().mouseDown().perform();
        ptor.actions().mouseMove(place[(text.split(' ')[1]-1)]).perform();
        ptor.actions().mouseMove({x: 5, y: 5}).perform();
        ptor.actions().mouseUp().perform(); 
      })
    })
  })
    ptor.sleep(3000);
}

exports.answer_free_text=function(ptor, text){
  locator.by_id(ptor,'ontop').findElement(protractor.By.tagName('textarea')).then(function(txt){
    txt.sendKeys(text);
  })
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

exports.add_really_confused=function(ptor){
  var confused_no = 0;
  element.all(by.name('confused-timeline-item')).then(function(items){
    confused_no = items.length
  })
  element(by.className('confusedDiv')).click().then(function(){
    ptor.sleep(1000)
    element(by.className('confusedDiv')).click().then(function(){
      expect(element.all(by.name('confused-timeline-item')).count()).toEqual(confused_no+1)
    })
  })
 
}

exports.create_note=function(ptor, text){
    locator.by_classname(ptor, 'notesDiv').then(function(not){
        not.click().then(function(){
            locator.by_classname(ptor, 'editable-controls').then(function(t){
                t.findElement(protractor.By.tagName('textarea')).sendKeys(text);
                ptor.sleep(3000);
                ptor.actions().sendKeys(protractor.Key.ENTER).perform();
            })
        })
    })
}
