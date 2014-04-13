var ptor = protractor.getInstance();
var driver = ptor.driver;
var functions = ptor.params;

var mail = 'mena.happy@yahoo.com'
var password = 'password';

var course_name = 'csc-303';

var element = 'Module 1';
var date;

describe('', function(){
	it('should login', function(){
    functions.sign_in(ptor, mail, password, functions.feedback);
  })
  it('should open the course to be tested', function(){
    functions.open_course_by_name(ptor, course_name);
  })
  it('should test if an element is in the right date', function(){
    check_element_date(ptor, element)
  })
})

function check_element_date(ptor, element, date){
  functions.wait_for_element(ptor, protractor.By.partialLinkText(element));
  ptor.findElement(protractor.By.partialLinkText(element)).then(function(wanted_element){
    wanted_element.click();
  })
}
