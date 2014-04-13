var ptor = protractor.getInstance();
var driver = ptor.driver;
var functions = ptor.params;

var mail = 'mena.happy@yahoo.com'
var password = 'password';

var course_name = 'csc-303';
var no_of_announcments = 3;

var announcmenttext = 'kalam';
var announcment_date = 'Apr 8, 2014 2:28:21 PM';

describe('', function(){
  it('should login', function(){
    functions.sign_in(ptor, mail, password, functions.feedback);
  })
  it('should open course by name', function(){
    functions.open_course_by_name(ptor, course_name);
  })
  it('should check the number of announcements', function(){
    check_number_of_announcments(ptor, no_of_announcments);
  })
  it('should confirm the announcment has the right date', function(){
    check_announcment_with_date(ptor, 3, announcment_date)
  })
})

function check_number_of_announcments(ptor, no_of_ann){
  ptor.findElements(protractor.By.repeater('a in announcements')).then(function(announcments) {
            expect(announcments.length).toEqual(no_of_ann);
        });
  ptor.findElements(protractor.By.binding('a.announcement')).then(function(announcments) {
    announcments.reverse();
    announcments.forEach(function(announcment, i) {
      expect(announcment.getText()).toEqual('announcement ' + (i + 1));
    });
  });
}

function check_announcment_with_date(ptor, ann_no, ann_date){
    ptor.findElements(protractor.By.className('well-lg')).then(function(date){
      date.reverse();
      expect(date[ann_no-1].getText()).toContain(ann_date);
    });
}
