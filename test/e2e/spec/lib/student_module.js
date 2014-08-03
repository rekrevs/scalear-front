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
exports.join_course = function(ptor, key)
{
    o_c.open_join_course(ptor);
    
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
//    solves normal quiz MCQ question
//=====================================
exports.mcq_answer = function(ptor, question_no, choice_no){
  locator.by_repeater(ptor, 'question in quiz.questions').then(function(rep){
    rep[question_no-1].findElements(protractor.By.tagName('input')).then(function(check_boxes){
        check_boxes[choice_no-1].click();
    })
  })
}

//=====================================
//    solves normal quiz OCQ question
//=====================================

exports.ocq_answer = function(ptor, question_no, choice_no){
  locator.by_repeater(ptor, 'question in quiz.questions').then(function(rep){
    rep[question_no-1].findElements(protractor.By.tagName('input')).then(function(check_boxes){
      check_boxes[choice_no-1].click();
    })
  })
}

//=====================================
//    solves normal quiz DRAG question
//=====================================

exports.drag_answer = function(ptor, question_no){
  for (var i = 0; i < 3; i++) {
    locator.by_repeater(ptor, 'question in quiz.questions').then(function(rep){
      rep[question_no-1].findElements(protractor.By.className('ui-icon-arrowthick-2-n-s')).then(function(arrow){
        rep[question_no-1].findElements(protractor.By.tagName('li')).then(function(answer){
          answer[0].getText().then(function (text){
            if(text == 'answer2'){
              ptor.actions().dragAndDrop(arrow[0], arrow[2]).perform();
            }
            else if(text == 'answer1'){
              ptor.actions().dragAndDrop(arrow[0], arrow[1]).perform();
            }
          })
          answer[1].getText().then(function (text){
            if(text == 'answer0'){
              ptor.actions().dragAndDrop(arrow[1], arrow[0]).perform();
            }
            else if(text == 'answer2'){
              ptor.actions().dragAndDrop(arrow[1], arrow[2]).perform();
            }
          })
          answer[2].getText().then(function (text){
            if(text == 'answer0'){
              ptor.actions().dragAndDrop(arrow[2], arrow[0]).perform();
            }
            else if(text == 'answer1'){
              ptor.actions().dragAndDrop(arrow[2], arrow[1]).perform();
            }
          })
        })
      })
    })
  };
ptor.sleep(3000);
}

//======================================================
//    solves normal quiz free or match string question
//======================================================

exports.free_match_answer = function(ptor, question_no, desired_text){
    locator.by_repeater(ptor, 'question in quiz.questions').then(function(rep){
        rep[question_no-1].findElement(protractor.By.tagName('textarea')).then(function(text_area){
          text_area.sendKeys(desired_text)
        })
    })
}
    
//=====================================
//    submits a normal quiz
//=====================================

exports.submit_normal_quiz = function(ptor){
  locator.by_xpath(ptor, '//*[@id="middle"]/center/form/input[2]').then(function(btn){
    btn.click();
  })
}

//=====================================
//          press confused btn
//=====================================

exports.press_confused_btn = function(ptor){
  locator.by_classname(ptor, 'confusedDiv').then(function(btn){
    btn.click().then(function(){
      locator.by_repeater(ptor, 'element in timeline').then(function(elements){
        expect(elements.length).toEqual(1);
      })
    })
  })
}
