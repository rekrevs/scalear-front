var youtube = require('./lib/youtube');
var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');

var ptor = protractor.getInstance();
var params = ptor.params
ptor.driver.manage().window().maximize();


describe("answer correctly", function(){
  it('should sign in', function(){
    o_c.sign_in(ptor, params.mail, params.password, o_c.feedback)
  })

  it('should open course', function(){
    o_c.open_course_whole(ptor)
  })

  it('should open tray',function(){
    o_c.open_tray(ptor);
  })

  it('should open module 2 then quiz 1',function(){
    o_c.open_lectures(ptor);
    o_c.open_module(ptor, 2);
    o_c.open_item(ptor, 1);
  })

  it('should check heads and answers number', function(){
    check_heads(ptor, 3);
    mcq_no(ptor,  3);
    ocq_no(ptor,  4);
    drag_no(ptor, 3)
  })

  it('should answer mcq correct', function(){
    mcq_answer(ptor, 2);
    mcq_answer(ptor, 3);
  })

  it('should answer ocq correct', function(){
    ocq_answer(ptor, 2);
  })

  it('should answer drag correct', function(){
    ptor.sleep(3000);
    drag_answer(ptor);
    ptor.sleep(3000);
  })

  it('should submit',function(){
    submit(ptor);
  })

  it('should check correctness of answers', function(){

  })
  
})

function check_heads(ptor){
  ptor.findElements(protractor.By.tagName('th')).then(function(heads){
   expect(heads[0].getText()).toBe('1');
   expect(heads[1].getText()).toBe('mcq question');
   expect(heads[3].getText()).toBe('2');
   expect(heads[4].getText()).toBe('ocq question');
   expect(heads[6].getText()).toBe('3');
   expect(heads[7].getText()).toBe('drag question');
 });
}

function mcq_no(ptor, no){
  locator.by_repeater(ptor, 'question in quiz.questions').then(function(rep){
    rep[0].findElements(protractor.By.tagName('input')).then(function(check_boxes){
      expect(check_boxes.length).toEqual(no);
    })
  })
}

function ocq_no(ptor, no){
  locator.by_repeater(ptor, 'question in quiz.questions').then(function(rep){
    rep[1].findElements(protractor.By.tagName('input')).then(function(check_boxes){
      expect(check_boxes.length).toEqual(no);
    })
  })
}

function drag_no(ptor, no){
  locator.by_repeater(ptor, 'question in quiz.questions').then(function(rep){
    rep[2].findElements(protractor.By.tagName('li')).then(function(check_boxes){
      expect(check_boxes.length).toEqual(no);
    })
  })
}

function mcq_answer(ptor, choice_no){
  locator.by_repeater(ptor, 'question in quiz.questions').then(function(rep){
    rep[0].findElements(protractor.By.tagName('input')).then(function(check_boxes){
      check_boxes[choice_no-1].click();
    })
  })
}

function ocq_answer(ptor, choice_no){
  locator.by_repeater(ptor, 'question in quiz.questions').then(function(rep){
    rep[1].findElements(protractor.By.tagName('input')).then(function(check_boxes){
      check_boxes[choice_no-1].click();
    })
  })
}

function drag_answer(ptor){
  for (var i = 0; i < 3; i++) {
    locator.by_repeater(ptor, 'question in quiz.questions').then(function(rep){
      rep[2].findElements(protractor.By.className('ui-icon-arrowthick-2-n-s')).then(function(arrow){
        rep[2].findElements(protractor.By.tagName('li')).then(function(answer){
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
    })
  };
ptor.sleep(3000);
}

function submit(ptor){
  locator.by_xpath(ptor, '//*[@id="middle"]/center/form/input[2]').then(function(btn){
    btn.click();
  })
}

