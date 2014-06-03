var ptor = protractor.getInstance();
var locator = require('./locators');
var params = ptor.params;

//=====================================
//        join course by key
//=====================================
exports.join_course = function(ptor, key, feedback)
{
    locator.by_id(ptor,'join_course').then(function(link)
    {
        link.click();
    });
    locator.by_name(ptor, 'key').then(function(input)
    {
        input.sendKeys(key);
    });
    locator.by_xpath(ptor, '/html/body/div[6]/div[3]/button[1]').then(function(button)
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
//    check number of modules/items
//=====================================
exports.check_module_number = function(ptor, no_of_mo){
    locator.by_xpath(ptor, '//*[@id="main"]/div/div/div/ui-view/div[1]/div[1]').findElement(protractor.By.tagName('button')).then(function(mod_btn){
        mod_btn.click();
        expect(locator.by_classname(ptor,"multicol").isDisplayed()).toEqual(true);
        locator.by_classname(ptor,"multicol").findElements(protractor.By.tagName('ul')).then(function(mod){
            expect(mod.length).toEqual(no_of_mo);
        })
        mod_btn.click();
    })
}

exports.check_timeline_item_number = function(ptor, total_item_no){
    locator.s_by_classname(ptor, 'courseware-item-circle').then(function(items){
        expect(items.length).toEqual(total_item_no);
    })
}

exports.open_module_number = function(ptor, mo_no){
    locator.by_classname(ptor, 'modules-collapser').then(function(mod_btn){
        mod_btn.click();
        ptor.sleep(500)
        expect(locator.by_classname(ptor,"multicol").isDisplayed()).toEqual(true);
        locator.by_repeater(ptor,'module in modules').then(function(modules){
          modules[mo_no-1].findElement(protractor.By.tagName('ul')).then(function(module){
            module.click();
          })
        })
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
