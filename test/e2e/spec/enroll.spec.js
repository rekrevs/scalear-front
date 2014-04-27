var key = '342524bade'
var ptor = protractor.getInstance();

var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');

var params = ptor.params;

describe('',function(){
    it('should sign in', function(){
        o_c.sign_in(ptor, params.mail, params.password, o_c.feedback)
    })
    it('should join course', function(){
        joincourse(ptor,key);
    })
})


//=====================================
//        join course by key
//=====================================
function joincourse(ptor, key)
{
    locator.by_id(ptor,'join_course').then(function(link)
    {
        link.click();
    });
    locator.by_name(ptor, 'key').then(function(input)
    {
        input.sendKeys(key);
    });
    locator.by_xpath(ptor, '/html/body/div[5]/div[3]/button[1]').then(function(button)
    {
        button.click();
    });
}