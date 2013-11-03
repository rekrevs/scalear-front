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
        var findByTag = function(name){
            return driver.findElement(protractor.By.tagName(name));
        }
        var findByClass = function(name){
            return driver.findElement(protractor.By.className(name));
        }

        //TEACHER'S TEST CASES

        it('should login', function(){
            driver.get("http://0.0.0.0:3000/en/users/sign_in");
            findByName("user[email]").sendKeys("admin@scalear.com");
            findByName("user[password]").sendKeys("password");
            findByName("commit").click();
            expect(findById('flash_notice').getText()).toEqual('Signed in successfully.');
        });

	    it ('should display the Calendar', function() {
            ptor = protractor.getInstance();
            ptor.get('/#/teacher/calendar');
            ptor.findElement(protractor.By.id('teacherCalendar')).
                then(function(promise){
                    
                });
        }, 10000);

        it ('should display current month name', function() {
            ptor = protractor.getInstance();
            ptor.get('/#/teacher/calendar');
            ptor.findElement(protractor.By.tagName('h2')).
                then(function(promise){
                    expect(promise.getText()).toEqual('November 2013')
                });
        }, 10000);

        it ('should be able to go to prev. month', function() {
            ptor = protractor.getInstance();
            ptor.get('/#/teacher/calendar');
            ptor.findElement(protractor.By.className('fc-button-prev')).click().
                then(function(promise){
                    ptor.findElement(protractor.By.tagName('h2')).
                        then(function(promise){
                            expect(promise.getText()).toEqual('October 2013')
                        });
                });
        }, 10000);
        it ('should be able to go to next month', function() {
            ptor = protractor.getInstance();
            ptor.get('/#/teacher/calendar');
            ptor.findElement(protractor.By.className('fc-button-next')).click().
                then(function(promise){
                    ptor.findElement(protractor.By.tagName('h2')).
                        then(function(promise){
                            expect(promise.getText()).toEqual('December 2013')
                        });
                });
        }, 10000);

        it ('should be able to go directly to today', function() {
            ptor = protractor.getInstance();
            ptor.get('/#/teacher/calendar');
            ptor.findElement(protractor.By.className('fc-button-prev')).click();
            ptor.findElement(protractor.By.className('fc-button-prev')).click();
            ptor.findElement(protractor.By.className('fc-button-today')).click().
                then(function(promise){
                    ptor.findElement(protractor.By.tagName('h2')).
                        then(function(promise){
                            expect(promise.getText()).toEqual('November 2013')
                        });
                });
        }, 10000);

        it ('should display all the events for the current month', function() {
            ptor = protractor.getInstance();
            ptor.get('/#/teacher/calendar');
            ptor.findElements(protractor.By.className('fc-event-title')).
                then(function(promise){
                    expect(promise.length).toEqual(2)
                });
        }, 20000);
        it ('should display all the events for the current month', function() {
            ptor = protractor.getInstance();
            ptor.get('/#/teacher/calendar');
            ptor.findElement(protractor.By.className('fc-button-prev')).click();
            ptor.findElement(protractor.By.className('fc-button-prev')).click();
            ptor.findElement(protractor.By.className('fc-button-prev')).click();
            ptor.findElement(protractor.By.className('fc-button-prev')).click();
            ptor.findElement(protractor.By.className('fc-button-prev')).click();
            ptor.findElement(protractor.By.className('fc-button-prev')).click();

            ptor.findElements(protractor.By.className('fc-event-title')).
                then(function(promise){
                    expect(promise.length).toEqual(7)
                });
        }, 20000);
        it ('should display event names', function() {
            ptor = protractor.getInstance();
            ptor.get('/#/teacher/calendar');
            ptor.findElements(protractor.By.className('fc-event-title')).
                then(function(promise){
                    expect(promise[0].getText()).toEqual('New Module due');
                    expect(promise[1].getText()).toEqual('New Module due');
                });
        }, 20000);
        // it ('should display clickable elements', function() {
        //     ptor = protractor.getInstance();
        //     ptor.get('/#/teacher/calendar');
        //     ptor.findElements(protractor.By.className('fc-event-title')).
        //         then(function(promise){
        //             promise[0].click().
        //                 then(function(promise){
        //                     expect(ptor.getCurrentUrl()).toContain("436/13")
        //                 });
        //         });
        // }, 20000);




	});
});