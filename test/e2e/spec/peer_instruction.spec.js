var AccountInformation = require('./pages/account_information');
var sleep = require('./lib/utils').sleep;
var refresh = require('./lib/utils').refresh;
var Login = require('./pages/login');
var Header = require('./pages/header');

var login_page = new Login()
var info = new AccountInformation();
var header = new Header()
var params = browser.params;


describe("Should Blah!", function(){
  it("should login as teacher",function(){
    var browser2 = browser.forkNewDriverInstance(true);
  })
})
