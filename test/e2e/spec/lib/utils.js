'use strict';
var utils= {
 sleep: function(val){return browser.driver.sleep(val)},
 refresh: function(){return browser.driver.navigate().refresh()},
 scroll: function(val){return browser.driver.executeScript('window.scrollBy(0, ' + val + ')', '');}
}

module.exports = utils;