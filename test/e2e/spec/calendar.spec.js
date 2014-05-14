var ptor = protractor.getInstance();
var driver = ptor.driver;
var params = ptor.params;

var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');




describe('', function(){
	it('should go home', function(){
    o_c.home(ptor);
  })
  it('should open the course to be tested', function(){
    o_c.open_course_whole(ptor);
  })
  it('should test if calendar', function(){
    is_calendar(ptor)
  })

  it('should go home', function(){
    o_c.home(ptor);
  })
  it('should open the course to be tested', function(){
    o_c.open_course_whole(ptor);
  })
  it('should test if an element is in the right date', function(){
    is_current_month(ptor)
  })

  it('should go home', function(){
    o_c.home(ptor);
  })
  it('should open the course to be tested', function(){
    o_c.open_course_whole(ptor);
  })
  it('should test if an element is in the right date', function(){
    open_random_event(ptor);
  })
})