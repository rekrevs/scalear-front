var ptor = protractor.getInstance();
var driver = ptor.driver;
var functions = ptor.params;

describe('', function(){
	it('should login', function(){
    	functions.sign_in(ptor, functions.mail, functions.password, functions.feedback);
  	})
	it('should open the course to be tested', function(){
	    functions.open_course_by_name(ptor, functions.course_name);
	})
	it('should open the lectures view',function(){
		functions.open_tray(ptor);
		functions.open_lectures(ptor);
		uncheck_quiz(ptor);
		check_confused(ptor);
		press_pause(ptor);
		//et_current_video_time(ptor);
		check_confused_no(ptor, 2);
		ptor.sleep(5000);
	})
})

//===================================================
// quiz tab is checked by default so this uncheck it
//===================================================
function uncheck_quiz(ptor){
	functions.by_id(ptor, 'quiz_checkbox').then(function(btn){
		btn.click();
	})
}

//===================================================
// checks the confused check box to start testing
//===================================================
function check_confused(ptor){
	functions.by_id(ptor, 'confused_checkbox').then(function(btn){
		btn.click();
	})
}
//====================================================
// 				youtube functionality
//====================================================
function is_paused(){
    functions.by_classname(ptor, 'play').then(function(button) {
        expect(button.isDisplayed()).toBe(true);
    });
}

function is_playing(){
    functions.by_classname(ptor,'pause').then(function(button) {
        expect(button.isDisplayed()).toBe(true);
    });
}

function press_play(ptor){
	functions.by_classname(ptor, 'play').then(function(button){
		button.click().then(function(){
			functions.by_classname(ptor,'pause').then(function(button) {
		        expect(button.isDisplayed()).toBe(true);
		    });
		})
	})
}

function press_pause(ptor){
	functions.by_classname(ptor, 'pause').then(function(button){
		button.click().then(function(){
			functions.by_classname(ptor, 'play').then(function(button) {
		        expect(button.isDisplayed()).toBe(true);
		    });
		})
	})
}

function get_current_video_time(ptor){
	functions.by_classname(ptor, 'timer').findElements(protractor.By.className('ng-binding')).then(function(timers){
		expect(timers[0].getText()).toEqual('50');
	})
}

//====================================================
//			increment confused and expect one
//====================================================

function press_confused_btn(ptor){
	functions.by_classname(ptor, 'confusedDiv').then(function(btn){
		btn.click().then(function(){
			functions.by_repeater(ptor, 'element in timeline').then(function(elements){
				expect(elements.length).toEqual(1);
			})
		})
	})
}

function check_confused_no(ptor, con_no){
	functions.by_repeater(ptor, 'element in timeline').then(function(elements){
				expect(elements.length).toEqual(con_no);
	})
}

