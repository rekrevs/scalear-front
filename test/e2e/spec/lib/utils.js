'use strict';
var utils= {
 sleep: function(val){return browser.driver.sleep(val)},
 refresh: function(){return browser.driver.navigate().refresh()},
 scroll: function(val){return browser.driver.executeScript('window.scrollBy(0, ' + val + ')', '')},
 scroll_top: function(val){return browser.driver.executeScript('window.scrollBy(0, -20000)', '')},
 scroll_bottom: function(val){return browser.driver.executeScript('window.scrollBy(0, 30000)', '')}
}

module.exports = utils;