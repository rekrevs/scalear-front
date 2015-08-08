'use strict';
var Header = require('./header');
var Dashboard = function(){}

Dashboard.prototype= Object.create({}, {
	events:{get:function(){return element.all(by.repeater('event in events'))}},
	open:{value:function(){
		var header = new Header()
		header.open_dashboard()
		browser.driver.wait(function() {
	      return browser.driver.getCurrentUrl().then(function(url) {
	        return /dashboard/.test(url);
	      });
	    });
	}},
})

module.exports = Dashboard;