// A reference configuration file.
exports.config = {
    // ----- How to setup Selenium -----
    //
    // There are three ways to specify how to use Selenium. Specify one of the
    // following:
    //
    // 1. seleniumServerJar - to start Selenium Standalone locally.
    // 2. seleniumAddress - to connect to a Selenium server which is already
    //    running.
    // 3. sauceUser/sauceKey - to use remote Selenium servers via SauceLabs.

    // The location of the selenium standalone server .jar file.
    seleniumServerJar: null, //'selenium/selenium-server-standalone-2.39.0.jar',
    // The port to start the selenium server on, or null if the server should
    // find its own unused port.
    //seleniumPort: 4444,
    // Chromedriver location is used to help the selenium standalone server
    // find chromedriver. This will be passed to the selenium jar as
    // the system property webdriver.chrome.driver. If null, selenium will
    // attempt to find chromedriver using PATH.
    //  chromeDriver: './selenium/chromedriver',
    // Additional command line options to pass to selenium. For example,
    // if you need to change the browser timeout, use
    // seleniumArgs: ['-browserTimeout=60'],
    seleniumArgs: [],

    // If sauceUser and sauceKey are specified, seleniumServerJar will be ignored.
    // The tests will be run remotely using SauceLabs.
    sauceUser: null,
    sauceKey: null,

    // The address of a running selenium server. If specified, Protractor will
    // connect to an already running instance of selenium. This usually looks like
    seleniumAddress: 'http://localhost:4444/wd/hub',



    // The timeout for each script run on the browser. This should be longer
    // than the maximum time your application needs to stabilize between tasks.
    allScriptsTimeout: 120000,

    // ----- What tests to run -----
    //
    // Spec patterns are relative to the location of this config.
    specs: [
        'test/e2e/spec/mainmenu.spec.js',

    ],

    // ----- Capabilities to be passed to the webdriver instance ----
    //
    // For a full list of available capabilities, see
    // https://code.google.com/p/selenium/wiki/DesiredCapabilities
    // and
    // https://code.google.com/p/selenium/source/browse/javascript/webdriver/capabilities.js
    capabilities: {
        'browserName': 'chrome'
    },

    // ----- More information for your tests ----
    //
    // A base URL for your application under test. Calls to protractor.get()
    // with relative paths will be prepended with this.
    baseUrl: 'http://localhost:9000/#/',
    // baseUrl: 'http://staging.scalable-learning.com/#/',


    // Selector for the element housing the angular app - this defaults to
    // body, but is necessary if ng-app is on a descendant of <body>
    rootElement: 'body',

    // A callback function called once protractor is ready and available, and
    // before the specs are executed
    // You can specify a file containing code to run by setting onPrepare to
    // the filename string.
    onPrepare: function() {
        // At this point, global 'protractor' object will be set up, and jasmine
        // will be available. For example, you can add a Jasmine reporter with:
        //     jasmine.getEnv().addReporter(new jasmine.JUnitXmlReporter(
        //         'outputdir/', true, true));
    },

    // The params object will be passed directly to the protractor instance,
    // and can be accessed from your test. It is an arbitrary object and can
    // contain anything you my need in your test.
    // This can be changed via the command line as:
    //   --params.login.user 'Joe'
    params: {

        frontend: 'http://localhost:9000/#/',
        // frontend: 'http://staging.scalable-learning.com/#/',
        sign_in: function(ptor, email, password, feedback){
            ptor.get('http://localhost:9000/#/');
            ptor.sleep(1000);
            ptor.findElement(protractor.By.id('user_email')).then(function(email_field) {
                email_field.sendKeys(email);
            });
            ptor.findElement(protractor.By.id('user_passowrd')).then(function(password_field) {
                password_field.sendKeys(password);
            });
            
            ptor.findElement(protractor.By.xpath('//*[@id="main"]/div/div[1]/div/div/center/div[3]/form/div/table/tbody/tr/td[3]/table/tbody/tr[3]/td/input')).then(function(fields){
                fields.click().then(function() {
                    feedback(ptor, 'Signed in successfully');
                });
            });
        },
        log_out: function(ptor){
            ptor.sleep(3000);
            ptor.findElement(protractor.By.id('logout_link')).then(function(link) {
                link.click().then(function() {
                    
                });
            });
        },
        sign_up: function(ptor, screen_name, fname, lname, studentmail, univer, biog, webs, password, feedback){
            ptor.get('http://localhost:9000/#/users/student');

            ptor.findElement(protractor.By.id('screen_name')).then(function(screenname) {
                    screenname.sendKeys(screen_name);
                });
            ptor.findElement(protractor.By.id('name')).then(function(name) {
                    name.sendKeys(fname);
                });
            ptor.findElement(protractor.By.id('last_name')).then(function(lastname) {
                    lastname.sendKeys(lname);
                });
            ptor.findElement(protractor.By.id('user_email')).then(function(email) {
                    email.sendKeys(studentmail);
                });
            ptor.findElement(protractor.By.id('university')).then(function(uni) {
                    uni.sendKeys(univer);
                });
            ptor.findElement(protractor.By.id('bio')).then(function(bio) {
                    bio.sendKeys(biog);
                });
            ptor.findElement(protractor.By.id('link')).then(function(website) {
                    website.sendKeys(webs);
                });
            ptor.findElements(protractor.By.id('user_passowrd')).then(function(pass) {
                    console.log("number of element with id = user_passowrd = "+pass.length);
                    pass[0].sendKeys(password);
                    pass[1].sendKeys(password);
                });
            ptor.findElement(protractor.By.id('signup_btn')).then(function(signup_btn){
                signup_btn.click().then(function(){
                    feedback(ptor, 'A message with a confirmation link has been sent to your email address. Please open the link to activate your account.');
                });
            });
        },
        confirm_account: function(ptor, feedback){
            ptor.driver.get('https://www.guerrillamail.com/inbox');
                ptor.driver.findElement(protractor.By.id("inbox-id")).then(function(inbox){
                    inbox.click().then(function(){
                        ptor.driver.findElement(protractor.By.xpath('//*[@id="inbox-id"]/input')).then(function(mail){
                            mail.sendKeys('studenttest').then(function(){
                                ptor.driver.findElement(protractor.By.xpath('//*[@id="inbox-id"]/button[1]')).then(function(set_btn){
                                    set_btn.click().then(function(){
                                        ptor.driver.findElement(protractor.By.id('use-alias')).then(function(check_scram){
                                            check_scram.click().then(function(){
                                                ptor.driver.sleep(11000);
                                                ptor.driver.findElements(protractor.By.tagName('td')).then(function(emails){
                                                    console.log(emails.length);
                                                    emails[1].click();
                                                    ptor.driver.sleep(3000).then(function(){
                                                        ptor.driver.findElement(protractor.By.partialLinkText('confirmation?confirmation_token')).then(function(confirm_link){
                                                            ptor.executeScript('window.scrollTo(0,800);');
                                                            confirm_link.click();
                                                            ptor.driver.sleep(5000);
                                                            feedback(ptor, 'conf');
                                                            ptor.driver.close()
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })   
                            })
                        });
                   })
               })
        },
        feedback: function(ptor, message){
            ptor.wait(function() {
                return ptor.findElement(protractor.By.id('error_container')).then(function(message) {
                    return message.getText().then(function(text) {
                        console.log(text);
                        if (text.length > 2) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                });
            });

            ptor.findElement(protractor.By.id('error_container')).then(function(error) {
                expect(error.getText()).toContain(message);
            });
        },
        open_tray: function(ptor){
            ptor.findElement(protractor.By.className('menu-icon')).then(function(toggler) {
                toggler.click()
                ptor.sleep(1000);
            });
        },
        cancel_account: function(ptor , name ,password, feedback){
            ptor.findElement(protractor.By.id('settings_btn')).then(function(setting_btn){
                ptor.sleep(500);
                setting_btn.click().then(function(){
                    ptor.findElement(protractor.By.id('del_acc_btn')).then(function(del_btn){
                        del_btn.click().then(function(){
                            ptor.findElement(protractor.By.id('del_con_pwd')).then(function(pwd_field){
                                pwd_field.sendKeys(password)
                                ptor.findElement(protractor.By.id('del_ok_btn')).then(function(ok_btn){
                                    ok_btn.click().then(function(){
                                        feedback(ptor,'Bye! Your account was successfully cancelled. We hope to see you again soon.');
                                    })
                                })
                            })
                        })
                    })
                })
            })
        },

        clean_mail: function(ptor){
            ptor.driver.get('https://www.guerrillamail.com/inbox');
                ptor.driver.findElement(protractor.By.id("inbox-id")).then(function(inbox){
                    inbox.click().then(function(){
                        ptor.driver.findElement(protractor.By.xpath('//*[@id="inbox-id"]/input')).then(function(mail){
                            mail.sendKeys('studenttest').then(function(){
                                ptor.driver.findElement(protractor.By.xpath('//*[@id="inbox-id"]/button[1]')).then(function(set_btn){
                                    set_btn.click().then(function(){
                                        ptor.driver.findElement(protractor.By.id('use-alias')).then(function(check_scram){
                                            check_scram.click().then(function(){
                                                ptor.sleep(11000);
                                                ptor.driver.findElements(protractor.By.tagName('td')).then(function(emails){
                                                    console.log(emails.length);
                                                    emails[0].click();
                                                    ptor.sleep(2000).then(function(){
                                                        ptor.driver.findElement(protractor.By.id('del_button')).then(function(del_button){
                                                            del_button.click();
                                                            ptor.sleep(3000);
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })   
                            })
                        });
                   })
               })
        }

    },

    // ----- Options to be passed to minijasminenode -----
    //
    // See the full list at https://github.com/juliemr/minijasminenode
    jasmineNodeOpts: {
        // onComplete will be called just before the driver quits.
        onComplete: null,
        // If true, display spec names.
        isVerbose: false,
        // If true, print colors to the terminal.
        showColors: true,
        // If true, include stack traces in failures.
        includeStackTrace: true,
        // Default time to wait in ms before a test fails.
        defaultTimeoutInterval: 60000
    }
};