var util = require('util');

describe("Teacher Course Editor page",function(){
  var ptor = protractor.getInstance();
  var driver = ptor.driver;

  var findByName = function(name){
            return driver.findElement(protractor.By.name(name));
  };
  var findById = function(id){
      return driver.findElement(protractor.By.id(id))
  };






  describe("Modules",function(){

    it('should login', function(){
            driver.get("http://localhost:3000/en/users/sign_in");
            findByName("user[email]").sendKeys("admin@scalear.com");
            findByName("user[password]").sendKeys("password");
            findByName("commit").click();
            expect(findById('flash_notice').getText()).toEqual('Signed in successfully.')
    });


    it('should create a module', function(){
        ptor = protractor.getInstance();
        ptor.get('/#/courses/13/course_editor');

        ptor.findElements(protractor.By.className('trigger')).then(function(modules){
            expect(modules.length).toBe(13);
            ptor.findElement(protractor.By.className('adding_module')).then(function(add_module){
                add_module.click();
                ptor.sleep(2000);
            });
        });
        ptor.findElements(protractor.By.className('trigger')).then(function(modules){
            expect(modules.length).toBe(14);
        });

    });
    it('should open the module', function(){
        ptor.findElements(protractor.By.className('trigger')).then(function(modules){
            modules[modules.length-1].click();
//            ptor.findElements(protractor.By.className('inner')).then(function(inner){
////                expect(inner.length).toBe(1);
//            });
        });
    });

    it('should ')

      //need to find a way to click on the delete button

//    it('should delete the module', function(){
//        ptor.findElement(protractor.By.xpath('//module[14]/delete_button/a')).then(function(delete_buttons){
////            delete_buttons[delete_buttons.length-1].click();
//            delete_buttons.click();
//        });
//        ptor.sleep(20000);
//        var alert_box = ptor.switchTo().alert();
//        alert_box.dismiss();
//
////        ptor.findElements(protractor.By.className('trigger')).then(function(modules){
////            expect(modules.length).toBe(14);
////        });
////
////        ptor.findElements(protractor.By.xpath('//module[14]/h5/delete_button/a')).then(function(delete_buttons){
////            delete_buttons[delete_buttons.length-1].click();
////        });
////        var alert_box = ptor.switchTo().alert();
////        alert_box.accept();
////
////        ptor.findElements(protractor.By.className('trigger')).then(function(modules){
////            expect(modules.length).toBe(13);
////        });
//
//
//
//    });

  });
});
