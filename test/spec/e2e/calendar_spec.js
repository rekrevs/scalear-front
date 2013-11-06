describe('Scalear 2.0', function() {
	describe('Calendar View', function(){
		var ptor = protractor.getInstance();
        var driver = ptor.driver;

//		beforeEach(function(){
//			ptor = protractor.getInstance();
//			ptor.get('/#/teacher/calendar');
//		});

        var findByName = function(name) {
            return driver.findElement(protractor.By.name(name));
        };
        var findById = function(id) {
            return driver.findElement(protractor.By.id(id));
        };

        it('should login', function(){
            driver.get("http://0.0.0.0:3000/en/users/sign_in");
            findByName("user[email]").sendKeys("adming@scalear.com");
            findByName("user[password]").sendKeys("password");
            findByName("commit").click();
            expect(findById('flash_notice').getText()).toEqual('Signed in successfully.')
        });

	    it ('should display the Calendar', function() {
            ptor = protractor.getInstance();
            ptor.get('/#/teacher/calendar');
            ptor.findElement(protractor.By.id('teacherCalendar')).
                then(function(promise){
                    console.log(promise);
                });
        });
        it ('should display current month name', function() {
            ptor = protractor.getInstance();
            ptor.get('/#/teacher/calendar');
            ptor.findElement(protractor.By.id('teacherCalendar')).
                then(function(promise){
                    console.log(promise);
                });
        });


	});
});