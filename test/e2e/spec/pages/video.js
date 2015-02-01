'use strict';

var Video = function(){}

Video.prototype= Object.create({}, {
	progress_bar:{get:function(){return element(by.className("progressBar"))}},
	time:{get:function(){return element(by.className("timer"))}},
	play_button: {get:function(){return element(by.className("play"))}},
	pause_button:{get:function(){return element(by.className("pause"))}},
	is_paused: {value:function(){return this.play_button.isDisplayed()}},
	is_playing:{value:function(){return this.pause_button.isDisplayed()}},
	pause:{value:function(){return this.pause_button.click()}},
	play: {value:function(){return this.play_button.click()}},
	current_time:{get:function(){return this.time.element(by.binding("current_time")).getText()}},
	duration:{get:function(){return this.time.element(by.binding("total_duration")).getText()}},
	seek:{value:function(percent){
		this.wait_till_ready()
		var progress_bar = this.progress_bar
		this.progress_bar.getSize().then(function(size){
			browser.driver.actions().mouseMove(progress_bar,{x: (percent*size.width)/100, y: 4}).click().perform()
		})
	}},
	wait_till_ready:{value:function(){
		var progress_bar = this.progress_bar
		browser.driver.wait(function() {
	        return progress_bar.isPresent().then(function(disp) {
	            return disp;
	        }, 100000);
	    });
	}}
})

module.exports = Video;