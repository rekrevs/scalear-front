var ptor = protractor.getInstance();
var driver = ptor.driver;
var params = ptor.params;

var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');

var no_of_announcments = 3;
var announcmenttext = 'kalam';
var announcment_date = 'May 4th 2014';

describe('', function(){
  it('should go home', function(){
    o_c.home(ptor);
  })
  it('should open course by name', function(){
    o_c.open_course_whole(ptor);
  })
  it('should check the number of announcements', function(){
    check_number_of_announcments(ptor, no_of_announcments);
  })
  xit('should confirm the announcment has the right date', function(){
    check_announcment_with_date(ptor, 3, announcment_date)
  })
})

function check_number_of_announcments(ptor, no_of_ann){
  locator.by_repeater(ptor, 'a in announcements').then(function(announcments) {
            expect(announcments.length).toEqual(no_of_ann);
  });
  locator.s_by_binding(ptor, 'a.announcement').then(function(announcments) {
    announcments.reverse();
    announcments.forEach(function(announcment, i) {
      expect(announcment.getText()).toEqual('announcement ' + (i + 1));
    });
  });
}

function check_announcment_with_date(ptor, ann_no, ann_date){
    locator.s_by_classname(ptor, 'well-lg').then(function(date){
      date.reverse();
      expect(date[ann_no-1].getText()).toContain(ann_date);
    });
}
