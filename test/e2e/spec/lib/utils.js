'use strict';
var utils = {
  new_session:function(){
    var b = browser.forkNewDriverInstance();
    browser.params.prepare(b)
    return b
  },
  switch_browser:function(custome_browser){
    browser = custome_browser
    element = custome_browser.element;
  },
  sleep: function(val) {
    return browser.driver.sleep(val);
  },
  refresh: function() {
    return browser.driver.navigate().refresh();
  },
  scroll: function(val) {
    return browser.driver.executeScript('window.scrollBy(0, ' + val + ')', '');
  },
  scroll_top: function() {
    return browser.driver.executeScript('window.scrollBy(0, -20000)', '');
  },
  scroll_bottom: function() {
    return browser.driver.executeScript('window.scrollBy(0, 30000)', '');
  },
  right_click: function(val) {
    return browser.actions().mouseMove(val).click(protractor.Button.RIGHT).perform();
  },
  calculate_duration: function(duration_obj) {
    return duration_obj.min * 60 + duration_obj.sec;
  },
  percent_to_time_string: function(percent, total_duration) {
    var time = ((total_duration * percent) / 100)
    return this.time_to_string(time)
  },
  time_to_string: function(time){
    var hr = Math.floor(time / 3600);
    var min = Math.floor((time - (hr * 3600)) / 60);
    var sec = Math.floor(time - (hr * 3600) - (min * 60));
    if(min < 10) { min = "0" + min; }
    if(sec < 10) { sec = "0" + sec; }
    return hr+':' + min + ':' + sec;
  }
}

module.exports = utils;
