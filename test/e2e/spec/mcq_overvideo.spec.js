var youtube = require('./lib/youtube');
var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');

var ptor = protractor.getInstance();
var params = ptor.p1arams

describe("", function(){
	it('should sign in', function(){
        o_c.sign_in(ptor, params.mail, params.password, o_c.feedback)
    })

    it('should open course', function(){
    	o_c.open_course_whole(ptor)
    })

    it('should open tray',function(){
		o_c.open_tray(ptor);
	})

	it('should open lecture',function(){
		o_c.open_lectures(ptor);
	})

	it('should seek to 30%',function(){
		youtube.seek(ptor, 30);
		ptor.sleep(3000)
	})
	xit('should open lecture',function(){
		o_c.open_lectures(ptor);
	})
})