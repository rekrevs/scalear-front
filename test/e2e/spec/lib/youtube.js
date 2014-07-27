////////////////////////////////////////////////////
/////////////////////notes for me///////////////////
//	click(protractor.Button.RIGHT)
//
//====================================================
// 				youtube functionality
//====================================================
var ptor = protractor.getInstance();
var functions = ptor.params;
var locator = require('./locators');

exports.is_paused = function(ptor){
    locator.by_classname(ptor, 'play').then(function(button) {
        expect(button.isDisplayed()).toBe(true);
    });
}

exports.is_playing = function(ptor){
    locator.by_classname(ptor,'pause').then(function(button) {
        expect(button.isDisplayed()).toBe(true);
    });
}

exports.press_play = function(ptor){
	locator.by_classname(ptor, 'play').then(function(button){
		button.click().then(function(){
			locator.by_classname(ptor,'pause').then(function(button) {
		        expect(button.isDisplayed()).toBe(true);
		    });
		})
	})
}

exports.press_pause = function (ptor){
	locator.by_classname(ptor, 'pause').then(function(button){
		button.click().then(function(){
			locator.by_classname(ptor, 'play').then(function(button) {
		        expect(button.isDisplayed()).toBe(true);
		    });
		})
	})
}

exports.get_current_video_time = function(ptor){
	locator.by_classname(ptor, 'timer').findElements(protractor.By.className('ng-binding')).then(function(timers){
		expect(timers[0].getText()).toEqual('50');
	})
}

exports.get_progress_bar_position = function(ptor, callback){
	var px, py;
	var pw, ph;
	locator.by_classname(ptor, 'elapsed').then(function(progess_bar){
		progess_bar.getLocation().then(function(location){
			px = location.x;
			py = location.y;
			progess_bar.getSize().then(function(size){
				pw = size.width;
				ph = size.height;
			}).then(function(){
					callback({
								x: px,
								y: py,
								w: pw,
								h: ph
							});
			   })
		})
	})
}

//=====================================
//	seek video given a percentage
//=====================================
exports.seek = function(ptor, percent){
	var pw, ph;
	var cw, ch;
	progress = element(by.className('progressBar'))
	ptor.wait(function() {
        return progress.isDisplayed().then(function(disp) {
            return disp;
        });
    });
	progress.getSize().then(function(size){
		pw = size.width;
		ph = size.height;
		ptor.actions().mouseMove(progress,{x: (percent*pw)/100, y: 4}).click().perform().then(function(){
			element(by.className('elapsed')).getSize().then(function(attr){
				cw = attr.width;
				expect(cw).toBeGreaterThan(Math.floor((percent*pw)/100)-2);
				expect(cw).toBeLessThan(Math.ceil((percent*pw)/100)+2);
				
			})
		})
	})
}