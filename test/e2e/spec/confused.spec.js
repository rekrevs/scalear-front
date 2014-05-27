var ptor = protractor.getInstance();
var driver = ptor.driver;
var functions = ptor.params;
var youtube = require('./lib/youtube');
var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');

describe('', function(){
	it('should login', function(){
    	o_c.sign_in(ptor, functions.mail, functions.password, o_c.feedback);
  	})
	it('should open the course to be tested', function(){
	    o_c.open_course_whole(ptor);
	})
	it('should open tray',function(){
		o_c.open_tray(ptor);
	})
	it('should open lecture',function(){
		o_c.open_lectures(ptor);
	})
	it('should uncheck quiz',function(){
		uncheck_quiz(ptor);
		check_confused(ptor);
		youtube.seek(ptor, 50);
	})
	it('should check confused ',function(){
		press_confused_btn(ptor);
		ptor.sleep(5000);
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
// checks the confused check box to start testing
//===================================================
function check_confused(ptor){
	locator.by_id(ptor, 'confused_checkbox').then(function(btn){
		btn.click();
	})
}

//====================================================
//			increment confused and expect one
//====================================================

function press_confused_btn(ptor){
	locator.by_classname(ptor, 'confusedDiv').then(function(btn){
		btn.click().then(function(){
			locator.by_repeater(ptor, 'element in timeline').then(function(elements){
				expect(elements.length).toEqual(1);
			})
		})
	})
}

function check_confused_no(ptor, con_no){
	locator.by_repeater(ptor, 'element in timeline').then(function(elements){
				expect(elements.length).toEqual(con_no);
	})
}

//====================================================
//		check_confused_location
//====================================================

function check_confused_time(ptor){
	var pw, ph;
	var random_seek_point = 1;
	var confused_time;
	var youtube_time;
	locator.by_classname(ptor, 'progressBar').then(function(progress){
			progress.getSize().then(function(size){
				pw = size.width;
				ph = size.height;
				ptor.actions().mouseMove(progress).perform();
				ptor.actions().mouseMove({x: (random_seek_point*pw)/100, y: 4}).click().perform();
				locator.by_classname(ptor, 'confusedDiv').then(function(btn){
					btn.click().then(function(){
						locator.by_classname(ptor, 'timer').findElements(protractor.By.className('ng-binding')).then(function(timers){
							confused_time = timers[0].getText();
							locator.by_classname(ptor, 'progress-events').then(function(btn2){
								btn2.click();
								locator.by_classname(ptor, 'timer').findElements(protractor.By.className('ng-binding')).then(function(timers){
									youtube_time = timers[0].getText();
									expect(confused_time).toEqual(youtube_time);
								})
							})
						})
					})
				})
			})
		})
}

function check_confused_location(ptor){
	locator.by_classname(ptor, 'elapsed').then(function(progess_bar){
		progress_bar.then(function(location){
			press_confused_btn(ptor);

			locator.by_repeater(ptor, 'element in timeline').then(function(elements){
				elements[0].getLocation().then(function(loc){
					expect(location.x).toEqual(loc.x);
					expect(location.y).toEqual(loc.y);
				})
			})
		})
}
                                               
    function check_confused_location(ptor){
        locator.by_classname(ptor, 'elapsed').then(function(progress_bar){
            progress_bar.getLocation().then(function(location){
                press_confused_btn(ptor);
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
// var pw, ph;
// 	var cw, ch;
// 	locator.by_classname(ptor, 'progressBar').then(function(progress){
// 			progress.getSize().then(function(size){
// 				pw = size.width;
// 				ph = size.height;
// 				ptor.actions().mouseMove(progress).perform();
// 				ptor.actions().mouseMove({x: (percent*pw)/100, y: 4}).click().perform().then(function(){
// 					locator.by_classname(ptor, 'elapsed').then(function(progress_bar){
// 						progress_bar.getSize().then(function(attr){
// 							cw = attr.width;
// 							expect(cw).toEqual(Math.ceil((percent*pw)/100));
// 						})
// 					})
// 				})
// 			})
// 	})