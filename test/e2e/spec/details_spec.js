var util = require('util');

describe("Teacher Lecture details page",function(){
  var ptor = protractor.getInstance();
  var driver = ptor.driver;

  var findByName = function(name){
            return driver.findElement(protractor.By.name(name));
  };
  var findById = function(id){
      return driver.findElement(protractor.By.id(id))
  };






  describe("first item",function(){

    it('should login', function(){
            driver.get("http://192.168.1.3:3000/en/users/sign_in");
            findByName("user[email]").sendKeys("admin@scalear.com");
            findByName("user[password]").sendKeys("password");
            findByName("commit").click();
            expect(findById('flash_notice').getText()).toEqual('Signed in successfully.')
    });

    // beforeEach(function(){
    //       ptor = protractor.getInstance();
    //       ptor.get('/#/course/13/course_editor');
    // });

    it('should open the first module', function(){
        ptor = protractor.getInstance();
        ptor.get('/#/courses/13/course_editor');
        ptor.findElement(protractor.By.className('trigger')).click();

    });

    it('should display the Details section',function(){     
      ptor.findElements(protractor.By.tagName('h3')).
        then(function(tag){
            expect(tag[1].getText()).toBe('Details');
        });
    });

    it('should display the module name and allow editing it', function(){
        ptor.findElements(protractor.By.className('editable-click')).then(function(name){
            expect(name[0].getText()).toBe('ISA 1');
            name[0].click();
            ptor.findElement(protractor.By.className('editable-input')).then(function(nameField){
                nameField.clear();
                nameField.sendKeys('new name');
            });
            ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                buttons[0].click();
            });
            expect(name[0].getText()).toBe('new name');
            name[0].click();
            ptor.findElement(protractor.By.className('editable-input')).then(function(nameField){
                nameField.clear();
                nameField.sendKeys('ISA 1');
            });
            ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                buttons[1].click();
            });
            expect(name[0].getText()).toBe('new name');
            name[0].click();
            ptor.findElement(protractor.By.className('editable-input')).then(function(nameField){
                nameField.clear();
                nameField.sendKeys('ISA 1');
            });
            ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                buttons[0].click();
            });
            expect(name[0].getText()).toBe('ISA 1');
        });
    });

    it('should display module description and allow editing it',function(){
      ptor.findElements(protractor.By.className('editable-click')).then(function(description){
        expect(description[description.length-1].getText()).toBe("Empty");
        description[description.length-1].click();
        ptor.findElement(protractor.By.className('editable-input')).then(function(descriptionTextBox){
            descriptionTextBox.sendKeys("dummy description");
            ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                buttons[0].click();
            });
        });
        ptor.sleep(2000);
        expect(description[description.length-1].getText()).toBe("dummy description");
        description[description.length-1].click();
        ptor.findElement(protractor.By.className('editable-input')).then(function(descriptionTextBox){
            descriptionTextBox.clear();
            descriptionTextBox.sendKeys(' ');
            ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                buttons[0].click();
            });
        });
        ptor.sleep(2000);
        expect(description[description.length-1].getText()).toBe('Empty');
        description[description.length-1].click();
        ptor.findElement(protractor.By.className('editable-input')).then(function(descriptionTextBox){
            descriptionTextBox.sendKeys('dummy description');
            ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                buttons[1].click();
            });
        });
        expect(description[description.length-1].getText()).toBe('Empty');

      });     
    });


    it('should open first lecture',function(){
        ptor.findElement(protractor.By.className('trigger')).click();
        ptor.findElement(protractor.By.className('trigger2')).click();
        //expect(ptor.findElement(protractor.By.tagName('loading_big')).isDisplayed()).toEqual(true)
    });

    it('should display the Details section',function(){
       ptor.findElements(protractor.By.tagName('h3')).
         then(function(tag){
           expect(tag[1].getText()).toBe('Details');
         });
    });

    it('should display lecture name and allow editing it',function(){
       //edit it
       ptor.findElement(protractor.By.binding('{{lecture.name}}')).then(function(elem){
         elem.isDisplayed().then(function(disp){
           expect(disp).toEqual(true)
         })
         expect(elem.getText()).toBe("ISA introduction");
       });
      
       ptor.findElement(protractor.By.className('editable-click')).then(function(name){
         expect(name.getText()).toBe('ISA introduction');
         name.click();
         ptor.findElement(protractor.By.className('editable-input')).then(function(nameTextBox){
             nameTextBox.clear();
             ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                 buttons[2].click();
             });
         });
        
         expect(name.getText()).toBe('ISA introduction');
         name.click();
         ptor.findElement(protractor.By.className('editable-input')).then(function(nameTextBox){
             nameTextBox.clear();
             nameTextBox.sendKeys('ISA Introduction');
             // ptor.sleep(10000);
             ptor.findElements(protractor.By.tagName('button')).then(function(button){
                 expect(button[1].getAttribute('type')).toBe('submit');
                 button[1].click();

             });
         });

         expect(name.getText()).toBe('ISA Introduction');
         name.click();
         ptor.findElement(protractor.By.className('editable-input')).then(function(nameTextBox){
             nameTextBox.clear();
             nameTextBox.sendKeys('ISA introduction');
             ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                 buttons[1].click();
             });
         });
         expect(name.getText()).toBe('ISA introduction');
        
       });
    });

    it('should display lecture video url and allow editing it',function(){
       ptor.findElement(protractor.By.tagName('iframe')).then(function(elem){
         elem.isDisplayed().then(function(disp){
           expect(disp).toEqual(true)
         })
         expect(elem.getAttribute('src')).toContain("PlavjNH_RRU");
       });

       ptor.findElements(protractor.By.className('editable-click')).then(function(editable_click){
         expect(editable_click[1].getText()).toBe('http://www.youtube.com/watch?v=PlavjNH_RRU');
         editable_click[1].click();
         //find the textfield and edit it
         ptor.findElement(protractor.By.className('editable-input')).then(function(urlField){
             urlField.clear();
             urlField.sendKeys('http://www.youtube.com/watch?v=jgoGBxlVslI');
         });
         //click the confirm button
         ptor.findElements(protractor.By.tagName('button')).then(function(button){
                 button[1].click();
         });
         //wait for video to load
         ptor.sleep(10000);
         //check video, thumbnail, author, duration, title, and aspect ratio
         ptor.findElement(protractor.By.tagName('iframe')).then(function(elem){
             elem.isDisplayed().then(function(disp){
             expect(disp).toEqual(true)
             });
             expect(elem.getAttribute('src')).toContain("jgoGBxlVslI");
         });
         ptor.findElement(protractor.By.className('bigimg')).then(function(thumbnail){
             expect(thumbnail.getAttribute('src')).toContain('jgoGBxlVslI');
         });
         expect(editable_click[2].getText()).toBe('smallscreen');
         ptor.findElement(protractor.By.binding('{{video.author}}')).then(function(author){
             expect(author.getText()).toBe('saasbook');
         });
         ptor.findElement(protractor.By.binding('lecture.duration')).then(function(duration){
             expect(duration.getText()).toBe('492 Seconds');
         });
         ptor.findElement(protractor.By.binding('{{video.title}}')).then(function(elem){
             expect(elem.getText()).toBe("CS169 v13 w5l2s9");
         });
         //check if the new url is correct
         expect(editable_click[1].getText()).toBe('http://www.youtube.com/watch?v=jgoGBxlVslI');

         //click to edit again
         editable_click[1].click();
         //find the textfield and edit it
         ptor.findElement(protractor.By.className('editable-input')).then(function(urlField){
             urlField.clear();
             urlField.sendKeys('http://www.youtube.com/watch?v=PlavjNH_RRU');
         });
         //don't confirm the change
         ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                 buttons[2].click();
         });
         expect(editable_click[1].getText()).toBe('http://www.youtube.com/watch?v=jgoGBxlVslI');
         editable_click[1].click();
         //find the textfield and edit it
         ptor.findElement(protractor.By.className('editable-input')).then(function(urlField){
             urlField.clear();
             urlField.sendKeys('http://www.youtube.com/watch?v=PlavjNH_RRU');
         });
         //confirm the change
         ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                 buttons[1].click();
         });
         ptor.sleep(10000);
         //check video, thumbnail, author, duration, title, and aspect ratio
         ptor.findElement(protractor.By.tagName('iframe')).then(function(elem){
             elem.isDisplayed().then(function(disp){
             expect(disp).toEqual(true)
             });
             expect(elem.getAttribute('src')).toContain("PlavjNH_RRU");
         });
         ptor.findElement(protractor.By.className('bigimg')).then(function(thumbnail){
             expect(thumbnail.getAttribute('src')).toContain('PlavjNH_RRU');
         });
         expect(editable_click[2].getText()).toBe('widescreen');
         ptor.findElement(protractor.By.binding('{{video.author}}')).then(function(author){
             expect(author.getText()).toBe('David B');
         });
         ptor.findElement(protractor.By.binding('lecture.duration')).then(function(duration){
             expect(duration.getText()).toBe('322 Seconds');
         });
         ptor.findElement(protractor.By.binding('{{video.title}}')).then(function(elem){
             expect(elem.getText()).toBe("L2.1-ISA Intro");
         });
         expect(editable_click[1].getText()).toBe('http://www.youtube.com/watch?v=PlavjNH_RRU')

       });
    });

    it('should display lecture video author',function(){
       ptor.findElement(protractor.By.binding('{{video.author}}')).then(function(elem){
         elem.isDisplayed().then(function(disp){
           expect(disp).toEqual(true)
         })
         expect(elem.getText()).toBe("David B")
       });
    });

    it('should display lecture video aspect ratio and allow changing it',function(){
       ptor.findElements(protractor.By.className('editable-click')).then(function(elem){
         elem[2].isDisplayed().then(function(disp){
           expect(disp).toEqual(true)
         })
         expect(elem[2].getText()).toBe("widescreen")
         elem[2].click();
         ptor.findElement(protractor.By.tagName('select')).then(function(dropDown){
             dropDown.click();
         });
         ptor.findElements(protractor.By.tagName('option')).then(function(options){
             options[1].click();
         });
         expect(elem[2].getText()).toBe("smallscreen");
         //wait for video to reload
         ptor.sleep(10000);
         ptor.findElement(protractor.By.id('youtube')).then(function(video){
             expect(video.getAttribute('class')).toContain('smallscreen');
         });

         elem[2].click();
         ptor.findElement(protractor.By.tagName('select')).then(function(dropDown){
             dropDown.click();
         });
         ptor.findElements(protractor.By.tagName('option')).then(function(options){
             options[0].click();
         });
         expect(elem[2].getText()).toBe("widescreen");
         //wait for video to reload
         ptor.sleep(10000);
         ptor.findElement(protractor.By.id('youtube')).then(function(video){
             expect(video.getAttribute('class')).toContain('widescreen');
         });

       });
    });

    it('should display lecture duration',function(){
       ptor.findElement(protractor.By.binding('{{lecture.duration}}')).then(function(elem){
         elem.isDisplayed().then(function(disp){
           expect(disp).toEqual(true)
         })
         expect(elem.getText()).toBe("322 Seconds")
       });
    });

    it('should display lecture title',function(){
       ptor.findElement(protractor.By.binding('{{video.title}}')).then(function(elem){
         elem.isDisplayed().then(function(disp){
           expect(disp).toEqual(true)
         })
         expect(elem.getText()).toBe("L2.1-ISA Intro");
       });
    });

    it('should display lecture slides and allows editing it',function(){
       ptor.findElements(protractor.By.className('editable-click')).then(function(slides){
          
         expect(slides[slides.length-2].getText()).toBe("http://www.it.uu.se/edu/course/homepage/darkdig/vt13/2-ISA%201.pdf");
         slides[slides.length-2].click();
         ptor.findElement(protractor.By.className('editable-input')).then(function(slidesTextBox){
             slidesTextBox.sendKeys("testLink");
             ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                 buttons[2].click();
             });
         });
         expect(slides[slides.length-2].getText()).toBe("http://www.it.uu.se/edu/course/homepage/darkdig/vt13/2-ISA%201.pdf");
         slides[slides.length-2].click();
         ptor.findElement(protractor.By.className('editable-input')).then(function(slidesTextBox){
             slidesTextBox.clear();
             slidesTextBox.sendKeys("testLink");
             ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                 buttons[1].click();
             });
         });
         expect(slides[slides.length-2].getText()).toBe("http://www.it.uu.se/edu/course/homepage/darkdig/vt13/2-ISA%201.pdf");
         slides[slides.length-2].click();
         ptor.findElement(protractor.By.className('editable-input')).then(function(slidesTextBox){
             slidesTextBox.clear();
             slidesTextBox.sendKeys("http://www.it.uu.se/edu/course/homepage/darkdig/vt13/2-ISA%201.pdf");
             ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                 buttons[1].click();
             });
         });
         expect(slides[slides.length-2].getText()).toBe("http://www.it.uu.se/edu/course/homepage/darkdig/vt13/2-ISA%201.pdf");
       });
    });

    it('should display lecture description and allow editing it',function(){
       ptor.findElements(protractor.By.className('editable-click')).then(function(description){
         expect(description[description.length-1].getText()).toBe("Empty");
         description[description.length-1].click();
         ptor.findElement(protractor.By.className('editable-input')).then(function(descriptionTextBox){
             descriptionTextBox.sendKeys("dummy description");
             ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                 buttons[1].click();
             });
         });
         ptor.sleep(2000);
         expect(description[description.length-1].getText()).toBe("dummy description");
         description[description.length-1].click();
         ptor.findElement(protractor.By.className('editable-input')).then(function(descriptionTextBox){
             descriptionTextBox.clear();
             descriptionTextBox.sendKeys(' ');
             ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                 buttons[1].click();
             });
         });
         ptor.sleep(2000);
         expect(description[description.length-1].getText()).toBe('Empty');
         description[description.length-1].click();
         ptor.findElement(protractor.By.className('editable-input')).then(function(descriptionTextBox){
             descriptionTextBox.sendKeys('dummy description');
             ptor.findElements(protractor.By.tagName('button')).then(function(buttons){
                 buttons[2].click();
             });
         });
         expect(description[description.length-1].getText()).toBe('Empty');

       });
    });

//DONE__________________________________________________________________________________________________________________________

    

    // it('should display lecture appearance date and allow changing it', function(){
    //   ptor.findElement(protractor.By.className('editable-checkbox')).then(function(status){
    //     expect(status.getText()).toBe("Using Module's Appearance Date");
    //     status.click();
    //     ptor.findElement(protractor.By.className('editable-input')).then(function(checkbox){
    //       checkbox.click();
    //       ptor.findElements(protractor.By.tagName('button')).then(function(confirmButton){
    //         confirmButton[1].click();
    //       });
    //     });
    //     expect(status.getText()).toBe("Not Using Module's Appearance Date");
    //     ptor.findElements(protractor.By.className('editable-click')).then(function(datePicker){
    //         datePicker[4].click();
    //         ptor.findElement/////////////////////////////////////////////////////////////////////////////////
    //     });
    //     status.click();
    //     ptor.findElement(protractor.By.className('editable-input')).then(function(checkbox){
    //       checkbox.click();
    //       ptor.findElement(protractor.By.tagName('button')).then(function(confirmButton){
    //         confirmButton.click();
    //       });
    //     });
    //     expect(status.getText()).toBe("Using Module's Appearance Date");
    //     status.click();
    //     ptor.findElement(protractor.By.className('editable-input')).then(function(checkbox){
    //       checkbox.click();
    //       ptor.findElements(protractor.By.tagName('button')).then(function(cancelButton){
    //         cancelButton[1].click();
    //       });
    //     });
    //     expect(status.getText()).toBe("Using Module's Appearance Date");
    //   });
    // });

    // it('should display lecture due date and allow changing it', function(){
    //   ptor.findElements(protractor.By.className('editable-checkbox')).then(function(status){
    //     expect(status[1].getText()).toBe("Using Module's Due Date");
    //     status[1].click();
    //     ptor.findElement(protractor.By.className('editable-input')).then(function(checkbox){
    //       checkbox.click();
    //       ptor.findElement(protractor.By.tagName('button')).then(function(confirmButton){
    //         confirmButton.click();
    //       });
    //     });
    //     expect(status[1].getText()).toBe("Not Using Module's Due Date");
    //     ptor.findElements(protractor.By.className('editable-click')).then(function(date){
    //       expect(date[5].getText()).toBe("22/03/2013");
    //       date[5].click();
    //       ptor.findElements(protractor.By.tagName('button')).then(function(cancelButton){
    //         cancelButton[1].click();
    //       });
    //       expect(date[5].getText()).toBe("22/03/2013");
    //       date[5].click();
    //       ptor.findElement(protractor.By.className('editable-input')).then(function(dateTextBox){
    //         dateTextBox.clear();
    //         dateTextBox.sendKeys('2013-03-25');
    //         ptor.findElements(protractor.By.tagName('button')).then(function(confirmButton){
    //           confirmButton[0].click();
    //         });
    //       });
    //       expect(date[5].getText()).toBe("25/03/2013");
    //     });
    //     status[1].click();
    //     ptor.findElement(protractor.By.className('editable-input')).then(function(checkbox){
    //       checkbox.click();
    //       ptor.findElement(protractor.By.tagName('button')).then(function(confirmButton){
    //         confirmButton.click();
    //       });
    //     });
    //     expect(status[1].getText()).toBe("Using Module's Due Date");
    //     status[1].click();
    //     ptor.findElement(protractor.By.className('editable-input')).then(function(checkbox){
    //       checkbox.click();
    //       ptor.findElements(protractor.By.tagName('button')).then(function(cancelButton){
    //         cancelButton[1].click();
    //       });
    //     });
    //     expect(status[1].getText()).toBe("Using Module's Due Date");
    //   });
    // });

    

    

    


    

  });

});
