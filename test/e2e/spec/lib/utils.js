'use strict';
var utils= {
 sleep: function(val){return browser.driver.sleep(val)},
 refresh: function(){return browser.driver.navigate().refresh()},
 scroll: function(val){return browser.driver.executeScript('window.scrollBy(0, ' + val + ')', '')},
 scroll_top: function(){return browser.driver.executeScript('window.scrollBy(0, -20000)', '')},
 scroll_bottom: function(){return browser.driver.executeScript('window.scrollBy(0, 30000)', '')},
 right_click:function(val){return browser.actions().mouseMove(val).click(protractor.Button.RIGHT).perform()}
}

module.exports = utils;