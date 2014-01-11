var util = require('util');
var enroll_key = '';
var names = new Array ();
var fetched_data = new Array();

//var frontend = 'http://localhost:9000/';
//var backend = 'http://localhost:3000/';
//var auth = 'http://localhost:4000/';

function getNextDay(date){
    var result = date;
    result.setTime(date.getTime() + 86400000);
    return result;
}
function formatDate(date, which){
    var dd = date.getDate();
    if(dd < 10){
        dd = '0'+dd;
    }
    var mm = date.getMonth()+1;
    var yyyy = date.getFullYear();
    if(which == 0){
        return mm+'/'+dd.toString()+'/'+yyyy;
    }
    else if(which == 1){
        return dd+'/'+mm+'/'+yyyy;
    }
}
var today = formatDate(new Date(), 1);
var tomorrow = formatDate(getNextDay(new Date()), 1);

function login(ptor, driver, email, password, name, findByName){
    it('should login', function(){
        driver.get(ptor.params.frontend+"#/login");
//        driver.get("http://angular-edu.herokuapp.com/#/login");
        ptor.findElement(protractor.By.className('btn')).then(function(login_button){
            login_button.click();
        });
        findByName("user[email]").sendKeys(email);
        findByName("user[password]").sendKeys(password);
        findByName("commit").click();
        ptor.findElements(protractor.By.tagName('a')).then(function(tags){
            tags[3].getText().then(function(value){
                expect(value.toLowerCase()).toContain(name.toLowerCase());
            })
        });
    });
}

function logout(ptor, driver){
    it('should logout from scalear Auth', function(){
        driver.get(ptor.params.auth).then(function(){
            driver.findElements(protractor.By.tagName('a')).then(function(logout){
                logout[4].click();
            });
        });
    });
}

function compare(original, sorted){
    if(original.length == sorted.length){
        sum = 0;
        for(var i = 0; i< original.length; i++){
//            console.log(original[i]+', '+sorted[i]);
            if(original[i] == sorted[i]){
                sum++;
            }
        }
        if(sum == original.length){
            return true;
        }
        else{
            return false;
        }
    }
    else{
        return -1;
    }
}


describe('Course Pages', function(){
    var ptor = protractor.getInstance();
    var driver = ptor.driver;

    var findByName = function(name){
        return driver.findElement(protractor.By.name(name));
    };
    var findById = function(id){
        return driver.findElement(protractor.By.id(id))
    };

    login(ptor, driver, 'anyteacher@email.com', 'password', 'anyteacher', findByName);
//
    describe('Courses List', function(){
        it('should display the list of courses sorted by Course Name by default', function(){

            ptor = protractor.getInstance();
            ptor.get('/#/courses');
//            ptor.findElements(protractor.By.repeater('course in courses')).then(function(courses){
//                expect(courses.length).toBe(14);
//            });
            ptor.findElement(protractor.By.tagName('td')).then(function(t){

                ptor.findElements(protractor.By.binding('course.name')).then(function(data){
//                    fetched_data = data;
                    //                sorted_data.sort();
                    data.forEach(function(name, i){

                            name.getText().then(function(text){
                                fetched_data[i] = text.toLowerCase();
                                names[i] = text.toLowerCase();
                            });
                    })
                }).then(function(){
                        names.sort();
                        expect(compare(fetched_data, names)).toBe(true);
                });
            });
        });
        it('should sort the names descending and see if they are displayed correctly', function(){
            ptor.findElement(protractor.By.xpath('//*[@id="main"]/div/div[1]/div/div/div/div/table/thead/tr/th[2]/a')).then(function(sort_by_name){
                sort_by_name.click();
                ptor.findElements(protractor.By.binding('course.name')).then(function(data){
                    data.forEach(function(name, i){
                        name.getText().then(function(text){
                            fetched_data[i] = text.toLowerCase();
                            names[i] = text.toLowerCase();
                        });
                    })
                }).then(function(){
                        names.sort();
                        names.reverse();
                        expect(compare(fetched_data, names)).toBe(true);
                });
            });
        });
        it('should sort the courses according to course code - ascending', function(){
            ptor.findElement(protractor.By.xpath('//*[@id="main"]/div/div[1]/div/div/div/div/table/thead/tr/th[1]/a')).then(function(sort){
                sort.click();
                ptor.findElements(protractor.By.binding('course.short_name')).then(function(data){
                    data.forEach(function(name, i){
                        name.getText().then(function(text){
                            fetched_data[i] = text.toLowerCase();
                            names[i] = text.toLowerCase();
                        });
                    })
                }).then(function(){
                        names.sort();
                        expect(compare(fetched_data, names)).toBe(true);
                    });
            });
        });
        it('should sort the courses according to course code - descending', function(){
            ptor.findElement(protractor.By.xpath('//*[@id="main"]/div/div[1]/div/div/div/div/table/thead/tr/th[1]/a')).then(function(sort){
                sort.click();
                ptor.findElements(protractor.By.binding('course.short_name')).then(function(data){
                    data.forEach(function(name, i){
                        name.getText().then(function(text){
                            fetched_data[i] = text.toLowerCase();
                            names[i] = text.toLowerCase();
                        });
                    })
                }).then(function(){
                        names.sort();
                        names.reverse();
                        expect(compare(fetched_data, names)).toBe(true);
                    });
            });
        });

        it('should sort the courses according to number of students - ascending', function(){
            ptor.findElement(protractor.By.xpath('//*[@id="main"]/div/div[1]/div/div/div/div/table/thead/tr/th[5]/a')).then(function(sort){
                sort.click();
                ptor.findElements(protractor.By.binding('course.enrolled_students.length')).then(function(data){
                    data.forEach(function(name, i){
                        name.getText().then(function(text){
                            fetched_data[i] = parseInt(text);
                            names[i] = parseInt(text);
                        });
                    })
                }).then(function(){
                        names.sort(function(a,b){return a-b});
                        expect(compare(fetched_data, names)).toBe(true);
                    });
            });
        });
        it('should sort the courses according to number of students - descending', function(){
            ptor.findElement(protractor.By.xpath('//*[@id="main"]/div/div[1]/div/div/div/div/table/thead/tr/th[5]/a')).then(function(sort){
                sort.click();
                ptor.findElements(protractor.By.binding('course.enrolled_students.length')).then(function(data){
                    data.forEach(function(name, i){
                        name.getText().then(function(text){
                            fetched_data[i] = parseInt(text);
                            names[i] = parseInt(text);
                        });
                    })
                }).then(function(){
                        names.sort(function(a,b){return b-a});
                        expect(compare(fetched_data, names)).toBe(true);
                    });
            });
        });

        it('should sort the courses according to number of lectures - ascending', function(){
            ptor.findElement(protractor.By.xpath('//*[@id="main"]/div/div[1]/div/div/div/div/table/thead/tr/th[6]/a')).then(function(sort){
                sort.click();
                ptor.findElements(protractor.By.binding('course.lectures.length')).then(function(data){
                    data.forEach(function(name, i){
                        name.getText().then(function(text){
                            fetched_data[i] = parseInt(text);
                            names[i] = parseInt(text);
                        });
                    })
                }).then(function(){
                        names.sort(function(a,b){return a-b});
                        expect(compare(fetched_data, names)).toBe(true);
                    });
            });
        });
        it('should sort the courses according to number of lectures - descending', function(){
            ptor.findElement(protractor.By.xpath('//*[@id="main"]/div/div[1]/div/div/div/div/table/thead/tr/th[6]/a')).then(function(sort){
                sort.click();
                ptor.findElements(protractor.By.binding('course.lectures.length')).then(function(data){
                    data.forEach(function(name, i){
                        name.getText().then(function(text){
                            fetched_data[i] = parseInt(text);
                            names[i] = parseInt(text);
                        });
                    })
                }).then(function(){
                        names.sort(function(a,b){return b-a});
                        expect(compare(fetched_data, names)).toBe(true);
                    });
            });
        });

        it('should sort the courses according to number of quizzes - ascending', function(){
            ptor.findElement(protractor.By.xpath('//*[@id="main"]/div/div[1]/div/div/div/div/table/thead/tr/th[7]/a')).then(function(sort){
                sort.click();
                ptor.findElements(protractor.By.binding('course.quiz.length')).then(function(data){
                    data.forEach(function(name, i){
                        name.getText().then(function(text){
                            fetched_data[i] = parseInt(text);
                            names[i] = parseInt(text);
                        });
                    })
                }).then(function(){
                        names.sort(function(a,b){return a-b});
                        expect(compare(fetched_data, names)).toBe(true);
                    });
            });
        });
        it('should sort the courses according to number of quizzes - descending', function(){
            ptor.findElement(protractor.By.xpath('//*[@id="main"]/div/div[1]/div/div/div/div/table/thead/tr/th[7]/a')).then(function(sort){
                sort.click();
                ptor.findElements(protractor.By.binding('course.quiz.length')).then(function(data){
                    data.forEach(function(name, i){
                        name.getText().then(function(text){
                            fetched_data[i] = parseInt(text);
                            names[i] = parseInt(text);
                        });
                    })
                }).then(function(){
                        names.sort(function(a,b){return b-a});
                        expect(compare(fetched_data, names)).toBe(true);
                    });
            });
        });

        it('should sort the courses according to number of surveys - ascending', function(){
            ptor.findElement(protractor.By.xpath('//*[@id="main"]/div/div[1]/div/div/div/div/table/thead/tr/th[8]/a')).then(function(sort){
                sort.click();
                ptor.findElements(protractor.By.binding('course.survey.length')).then(function(data){
                    data.forEach(function(name, i){
                        name.getText().then(function(text){
                            fetched_data[i] = parseInt(text);
                            names[i] = parseInt(text);
                        });
                    })
                }).then(function(){
                        names.sort(function(a,b){return a-b});
                        expect(compare(fetched_data, names)).toBe(true);
                    });
            });
        });
        it('should sort the courses according to number of surveys - descending', function(){
            ptor.findElement(protractor.By.xpath('//*[@id="main"]/div/div[1]/div/div/div/div/table/thead/tr/th[8]/a')).then(function(sort){
                sort.click();
                ptor.findElements(protractor.By.binding('course.survey.length')).then(function(data){
                    data.forEach(function(name, i){
                        name.getText().then(function(text){
                            fetched_data[i] = parseInt(text);
                            names[i] = parseInt(text);
                        });
                    })
                }).then(function(){
                        names.sort(function(a,b){return b-a});
                        expect(compare(fetched_data, names)).toBe(true);
                    });
            });
        });

//        it('should create a new course', function(){
//            ptor.get('/#/courses/new');
//            ptor.findElements(protractor.By.tagName('input')).then(function(fields){
//                fields[fields.length-1].click();
//            });
//            ptor.findElements(protractor.By.className('controls')).then(function(rows){
//                expect(rows[0].getText()).toContain('Course Short Name is Required');
//                expect(rows[1].getText()).toContain('Course Name is Required');
//                expect(rows[2].getText()).toContain('Course Start Date is Required');
//                expect(rows[3].getText()).toContain('Course Duration is Required');
//                expect(rows[7].getText()).toContain('Course Time Zone is Required');
//            });
//            ptor.findElements(protractor.By.tagName('input')).then(function(fields){
//                fields[0].sendKeys('TEST-101');
//                fields[1].sendKeys('Testing Course');
//                fields[2].sendKeys(today_keys);
//                fields[3].sendKeys('5');
//                fields[4].sendKeys('http://google.com/');
//                ptor.findElements(protractor.By.tagName('textarea')).then(function(fields){
//                    fields[0].sendKeys('new description');
//                    fields[1].sendKeys('new prerequisites');
//                });
//                ptor.findElements(protractor.By.tagName('select')).then(function(dropdown){
//                    dropdown[0].click();
//                    ptor.findElements(protractor.By.tagName('option')).then(function(options){
//                        options[1].click();
//                    });
//                });
//                fields[fields.length-1].click();
//            });
//        });
//        it('should go to course', function(){
//            ptor.findElement(protractor.By.className('dropdown-toggle')).click();
//            ptor.findElement(protractor.By.id('info')).click().then(function(){
//                ptor.findElements(protractor.By.tagName('p')).then(function(data){
//                    data[0].getText().then(function(text){
//                        enroll_key = text;
//                    });
//                });
//            });
//        });
        logout(ptor, driver);
        login(ptor, driver, 'bahia.sharkawy@gmail.com', 'password', 'Bahia', findByName);
        it('should display the list of courses sorted by Course Name by default', function(){
            names = new Array();
            fetched_data = new Array();
//            ptor = protractor.getInstance();
//            ptor.get('/#/courses');
//            ptor.findElements(protractor.By.repeater('course in courses')).then(function(courses){
//                expect(courses.length).toBe(3);
//            });
            ptor.findElement(protractor.By.tagName('td')).then(function(t){

                ptor.findElements(protractor.By.binding('course.name')).then(function(data){
                    data.forEach(function(name, i){
                        name.getText().then(function(text){
                            fetched_data[i] = text.toLowerCase();
                            names[i] = text.toLowerCase();
                        });
                    })
                }).then(function(){
                        names.sort();
                        expect(compare(fetched_data, names)).toBe(true);
                    });
            });
        });
        it('should sort the names descending and see if they are displayed correctly', function(){
            ptor.findElement(protractor.By.xpath('//*[@id="main"]/div/div[1]/div/div/div/div/table/thead/tr/th[2]/a')).then(function(sort_by_name){
                sort_by_name.click();
                ptor.findElements(protractor.By.binding('course.name')).then(function(data){
                    data.forEach(function(name, i){
                        name.getText().then(function(text){
                            fetched_data[i] = text.toLowerCase();
                            names[i] = text.toLowerCase();
                        });
                    })
                }).then(function(){
                        names.sort();
                        names.reverse();
                        expect(compare(fetched_data, names)).toBe(true);
                    });
            });
        });
        it('should sort the courses according to course code - ascending', function(){
            ptor.findElement(protractor.By.xpath('//*[@id="main"]/div/div[1]/div/div/div/div/table/thead/tr/th[1]/a')).then(function(sort){
                sort.click();
                ptor.findElements(protractor.By.binding('course.short_name')).then(function(data){
                    data.forEach(function(name, i){
                        name.getText().then(function(text){
                            fetched_data[i] = text.toLowerCase();
                            names[i] = text.toLowerCase();
                        });
                    })
                }).then(function(){
                        names.sort();
                        expect(compare(fetched_data, names)).toBe(true);
                    });
            });
        });
        it('should sort the courses according to course code - descending', function(){
            ptor.findElement(protractor.By.xpath('//*[@id="main"]/div/div[1]/div/div/div/div/table/thead/tr/th[1]/a')).then(function(sort){
                sort.click();
                ptor.findElements(protractor.By.binding('course.short_name')).then(function(data){
                    data.forEach(function(name, i){
                        name.getText().then(function(text){
                            fetched_data[i] = text.toLowerCase();
                            names[i] = text.toLowerCase();
                        });
                    })
                }).then(function(){
                        names.sort();
                        names.reverse();
                        expect(compare(fetched_data, names)).toBe(true);
                    });
            });
        });
        //---------------------------------------------------------------------------//

//        describe('Student', function(){
//            it('should enroll in the course that was created', function(){
//                ptor.findElement(protractor.By.id('join_course')).then(function(join_course){
//                    join_course.click();
//                });
//            });
//            it('should try to proceed with a wrong enrollment key', function(){
//                ptor.findElement(protractor.By.tagName('input')).then(function(key_field){
//                    key_field.sendKeys('anykey');
//                });
//                ptor.findElement(protractor.By.className('btn-primary')).then(function(proceed){
//                    proceed.click();
//                });
//                ptor.findElement(protractor.By.className('errormessage')).then(function(validation){
//                    expect(validation.getText()).toBe('Course Does Not Exist');
//                });
//            });
//            it('should enter the enrollment key and proceed', function(){
//                ptor.findElement(protractor.By.tagName('input')).then(function(key_field){
//                    key_field.clear();
//                    key_field.sendKeys(enroll_key);
//                });
//                ptor.findElement(protractor.By.className('btn-primary')).then(function(proceed){
//                    proceed.click();
//                });
//            });
//            it('should click on the course name', function(){
//                ptor.findElements(protractor.By.tagName('a')).then(function(links){
//                    links[links.length-2].click();
//                });
//            });
//            it('should go to course information page', function(){
//                ptor.findElements(protractor.By.tagName('a')).then(function(links){
//                    links[12].click();
//                });
//            });
//        });


    });
});