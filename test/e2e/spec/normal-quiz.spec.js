var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module')

var ptor = protractor.getInstance();
var params = ptor.params
// ptor.driver.manage().window().maximize();
ptor.driver.manage().window().setSize(ptor.params.width, ptor.params.height);
ptor.driver.manage().window().setPosition(0, 0);



describe("teacher", function(){

	// it('should sign in as teacher', function(){
	// 	o_c.sign_in(ptor, params.teacher_mail, params.password, o_c.feedback);
	// })

	// it('should create_course', function(){
	// 	teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites, o_c.feedback);
	// })

	// it('should get the enrollment key and enroll student', function(){
	// 	teacher.get_key_and_enroll(ptor);
	// })
	//test
	//------
	it('should sign in', function(){
		o_c.sign_in(ptor, params.teacher_mail, params.password, o_c.feedback);
	})
	//------
	// it('should open the course', function(){
	// 	o_c.open_course_whole(ptor);
	// })
	// it('should create a new module', function(){
	// 	teacher.add_module(ptor, o_c.feedback);
	// })
	// it('should add a normal quiz', function(){
	// 	teacher.open_module(ptor, 1)
	// 	teacher.add_quiz(ptor, 1, o_c.feedback);
	// })
	//------
	// it('should open the first module', function(){
	// 	teacher.open_module(ptor, 1)
	// })
	//------
	// it('should open the quiz', function(){
	// 	teacher.open_item(ptor, 1, 1)
	// })

	// it('should add a FIRST header', function(){
	// 	teacher.add_quiz_header(ptor, 'first header')
	// })
	// it('should add a MCQ question', function(){
	// 	teacher.add_quiz_question_mcq(ptor, 'mcq question', 2, [1, 2])
	// })
	// it('should add a SECOND header', function(){
	// 	teacher.add_quiz_header(ptor, 'second header')
	// })
	// it('should add an OCQ question', function(){
	// 	teacher.add_quiz_question_ocq(ptor, 'ocq question', 2, 1)
	// })
	// it('should add a FREE question', function(){
	// 	teacher.add_quiz_question_free(ptor, 'free question', false)
	// })
	
	// it('should add a FREE question', function(){
	// 	teacher.add_quiz_question_free(ptor, 'match question', true, 'match answer')
	// })
	// it('should add a DRAG question', function(){
	// 	teacher.add_quiz_question_drag(ptor, 'drag question', 2)
	// })
	// it('should save the quiz', function(){
	// 	teacher.save_quiz(ptor, o_c.feedback)
	// })

	it('should switch to student', function(){
		o_c.to_student(ptor)
	})

	it('should open the first course', function(){
		o_c.open_course_whole(ptor)
	})
	it('should go to the courseware page', function(){
		o_c.open_tray(ptor)
		o_c.open_lectures(ptor)
	})
	it('should open the quiz',function(){
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
	

	//end test

	// it('should delete course', function(){
	// 	//should choose one of home() or home_teacher() 
	// 	//depending on the current state(student or teacher)
	// 	o_c.home(ptor);
	// 	teacher.delete_course(ptor, o_c.feedback);
	// })
})

/////////////////////////////////////////////////////////
//				test specific functions
/////////////////////////////////////////////////////////

function check_heads(ptor){
  ptor.findElements(protractor.By.tagName('th')).then(function(heads){
   expect(heads[0].getText()).toBe('1');
   expect(heads[1].getText()).toBe('mcq question');
   expect(heads[3].getText()).toBe('2');
   expect(heads[4].getText()).toBe('ocq question');
   expect(heads[6].getText()).toBe('3');
   expect(heads[7].getText()).toBe('free question');
   expect(heads[8].getText()).toBe('4');
   expect(heads[9].getText()).toBe('match question');
   expect(heads[10].getText()).toBe('5');
   expect(heads[11].getText()).toBe('drag question');
 });
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











