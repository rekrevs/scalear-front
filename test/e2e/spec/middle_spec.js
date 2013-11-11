xdescribe("Teacher Lecture middle page",function(){

	var ptor = protractor.getInstance();

	describe("first item",function(){

        it('should login', function(){
            driver.get("http://0.0.0.0:3000/en/users/sign_in");
            findByName("user[email]").sendKeys("admin@scalear.com");
            findByName("user[password]").sendKeys("password");
            findByName("commit").click();
            expect(findById('flash_notice').getText()).toEqual('Signed in successfully.')
        });

        it('should open the first module', function(){
            ptor = protractor.getInstance();
            ptor.get('/#/courses/13/course_editor');
            ptor.findElement(protractor.By.className('trigger')).click();

        });
        it('should display the middle section', function(){
            ptor.findElement(protractor.By.className('trigger')).click();

        });

		it("should have a title with same lecture name",function(){
			ptor.findElement(protractor.By.binding('{{lecture.name}}')).then(function(elem){
				expect(elem.getText()).toBe('The First Lecture')
			})
		});
		it("should have a youtube player with correct video",function(){
			ptor.findElement(protractor.By.tagName('youtube')).then(function(elem){
				expect(elem.getInnerHtml()).toContain('PpPK66XbJqk')
			})
		});
		it("should have a quiz list with correct count",function(){
			ptor.findElements(protractor.By.repeater('quiz in quizList').column('{{quiz.question}}')).then(function(elems){
				expect(elems.length).toEqual(5)
			});
		});	

	});


});