var ptor = protractor.getInstance();
var locator = require('./locators');
var o_c = require('./openers_and_clickers');
var student = require('./student_module')
var params = ptor.params;

//====================================================
//               add new course
//====================================================
exports.create_course = function(ptor, short_name, course_name, course_duration, discussion_link, image_link, course_description, prerequisites, feedback){
    locator.by_id(ptor, 'new_course').then(function(new_crs_btn){
    	new_crs_btn.click().then(function(){
    	
    		locator.by_name(ptor, 'short').then(function(shrt_nm){
    			shrt_nm.sendKeys(short_name);
    		})
    		locator.by_name(ptor, 'name').then(function(crs_nm){
    			crs_nm.sendKeys(course_name);
    		})
    		// locator.by_name(ptor, 'date').then(function(date){
    		// 	date.click().then(function(){
    		// 		locator.by_xpath(ptor, '//*[@id="main"]/div/div/div/form/center/div/div[3]/div[1]/ul/li[1]/li/table/tbody').then(function(dates){

    		// 		})
    		// 	})
    		// })
    		locator.by_name(ptor, 'duration').then(function(crs_dur){
    			crs_dur.sendKeys(course_duration);
    		})
    		locator.by_xpath(ptor, '//*[@id="main"]/div/div/div/form/center/div/div[4]/div[1]/input').then(function(dis_lnk){
    			dis_lnk.sendKeys(discussion_link);
    		})
    		locator.by_xpath(ptor, '//*[@id="main"]/div/div/div/form/center/div/div[4]/div[2]/input').then(function(img_lnk){
    			img_lnk.sendKeys(image_link);
    		})
    		locator.by_xpath(ptor, '//*[@id="main"]/div/div/div/form/center/div/div[5]/textarea').then(function(crs_desc){
    			crs_desc.sendKeys(course_description);
    		})
    		locator.by_xpath(ptor, '//*[@id="main"]/div/div/div/form/center/div/div[6]/textarea').then(function(pre_req){
    			pre_req.sendKeys(prerequisites);
    		})

    		ptor.executeScript('window.scrollBy(0, 1000)', '');
    		locator.by_xpath(ptor, '//*[@id="main"]/div/div/div/form/center/div/div[8]/input').then(function(crt_crs_btn){
    			crt_crs_btn.click().then(function() {
		            feedback(ptor, 'Course was successfully created.');
		        });
    		})
    	})
    })
}

//====================================================
//            get key and save in a holder
//====================================================
exports.get_key_and_enroll = function(ptor){
	o_c.open_tray(ptor);
	o_c.open_info_teacher(ptor);
	locator.by_xpath(ptor, '//*[@id="main"]/div/div/div/ui-view/div[1]/span/ul[1]').then(function(element){
		element.getText().then(function(text){
			o_c.home_teacher(ptor);
			o_c.open_tray(ptor);
			o_c.logout(ptor, o_c.feedback);
			o_c.sign_in(ptor, params.mail, params.password, o_c.feedback);
			student.join_course(ptor, text, o_c.feedback);
			o_c.home(ptor);
			o_c.open_tray(ptor);
			o_c.logout(ptor, o_c.feedback);
			o_c.sign_in(ptor, params.teacher_mail, params.password, o_c.feedback);
		})
	})
}

//====================================================
//            		delete course
//====================================================
exports.delete_course = function(ptor, feedback){
	o_c.open_tray(ptor);
	o_c.logout(ptor, o_c.feedback);
	o_c.sign_in(ptor, params.teacher_mail, params.password, o_c.feedback);
	locator.by_xpath(ptor, '//*[@id="main"]/div/div/div/div/div[2]/div/span/a/img').then(function(x_btn){
		x_btn.click().then(function(){
			locator.by_xpath(ptor, '//*[@id="main"]/div/div/div/div/div[2]/div/span/div/span/a[1]/div').then(function(conf_del){
				conf_del.click().then(function() {
		            feedback(ptor, 'Course was successfully deleted.');
		            o_c.home_teacher(ptor);
					o_c.open_tray(ptor);
					o_c.logout(ptor, o_c.feedback);
		        });
			})
		})
	})
}

///////////////////////////////////////////////////////////////////////
////////////////////////course editor functions////////////////////////
///////////////////////////commonly used//////////////////////////////


//====================================================
//            		add / delete module
//====================================================

exports.add_module = function(ptor, feedback){
	locator.by_classname(ptor, 'adding_module').then(function(add_mod){
        add_mod.click().then(function() {
            feedback(ptor, 'Module was successfully created');
        })
    })
}

exports.delete_empty_module = function(ptor, mo_no, feedback){
	locator.by_repeater(ptor, 'module in modules').then(function(mods){
        mods[mo_no-1].findElement(protractor.By.className('delete')).then(function(del_btn){
            del_btn.click().then(function(){
            	mods[mo_no-1].findElement(protractor.By.className('btn-danger')).then(function(conf_btn){
            		conf_btn.click().then(function(){
            			feedback(ptor, 'Module was successfully deleted');
            		})
            	})
            })
        })
    })
}


//====================================================
//            		add lecture
//====================================================

exports.add_lecture = function(ptor, mo_no, feedback){
	locator.by_repeater(ptor, 'module in modules').then(function(mods){
		mods[mo_no-1].findElement(protractor.By.className('item-buttons')).then(function(btns_frame){
			btns_frame.findElement(protractor.By.className('btn-success')).then(function(add_button){
				add_button.click().then(function(){
					locator.by_classname(ptor, 'add-menu-container').then(function(menu){
						menu.findElements(protractor.By.className('add-item')).then(function(options){
							options[0].click().then(function(){
								feedback(ptor, 'Lecture was successfully created.')
							});
						})
					})
				})
			})
		})
	})
}

//====================================================
//            		add quiz
//====================================================

exports.add_quiz = function(ptor, mo_no, feedback){
	locator.by_repeater(ptor, 'module in modules').then(function(mods){
		mods[mo_no-1].findElement(protractor.By.className('item-buttons')).then(function(btns_frame){
			btns_frame.findElement(protractor.By.className('btn-success')).then(function(add_button){
				add_button.click().then(function(){
					locator.by_classname(ptor, 'add-menu-container').then(function(menu){
						menu.findElements(protractor.By.className('add-item')).then(function(options){
							options[1].click().then(function(){
								feedback(ptor, 'Quiz was successfully created.')
							});
						})
					})
				})
			})
		})
	})
}

//====================================================
//            	delete item from module
//====================================================

exports.delete_item_by_number = function(ptor, mo_no, item_no, feedback){
	locator.by_repeater(ptor, 'module in modules').then(function(mods){
		mods[mo_no-1].findElements(protractor.By.repeater('item in module.items')).then(function(items){
			items[item_no-1].findElement(protractor.By.className('delete')).then(function(del_btn){
            	del_btn.click().then(function(){
            		items[item_no-1].findElement(protractor.By.className('btn-danger')).then(function(conf_btn){
            			conf_btn.click().then(function(){
            				feedback(ptor, 'Lecture was successfully deleted');
            			})
            		})
            	})
            })
		})
	})
	ptor.sleep(1000);
}

//====================================================
//            click on a module to expand
//====================================================

exports.open_module = function(ptor, mo_no){
	locator.by_repeater(ptor, 'module in modules').then(function(mods){
		mods[mo_no-1].click();
	})
}

//====================================================
//            click on a module to edit
//====================================================
exports.open_item = function(ptor, mo_no, item_no){
	locator.by_repeater(ptor, 'module in modules').then(function(mods){
		mods[mo_no-1].findElements(protractor.By.repeater('item in module.items')).then(function(items){
			items[item_no-1].click();
		})
	})
}

//====================================================
//            		change time zone
//====================================================
//refer to the timezone ref for values
exports.change_time_zone = function(ptor, value){
	locator.by_xpath(ptor, '//*[@id="main"]/div/div/div/ui-view/center/table/tbody/tr[2]/td/ul[5]/details-time-zone/a').then(function(select){
		select.click().then(function(){
			locator.by_xpath(ptor, '//*[@id="main"]/div/div/div/ui-view/center/table/tbody/tr[2]/td/ul[5]/details-time-zone/form/div/select').then(function(s){
				s.click().then(function(){
					s.findElements(protractor.By.tagName('option')).then(function(options){
						options[value].click();
					})
				})
			})	
		})
	})
}


//====================================================
//            		change module name
//====================================================
exports.change_module_name = function(ptor, name, feedback){
	locator.by_xpath(ptor, '//*[@id="middle"]/div[2]/div[1]/details-text/a').then(function(mod){
		mod.click().then(function(){
			locator.by_xpath(ptor, '//*[@id="middle"]/div[2]/div[1]/details-text/form/div/input').then(function(mod_name){
				mod_name.clear();
				mod_name.sendKeys(name);
				locator.by_xpath(ptor, '//*[@id="middle"]/div[2]/div[1]/details-text/form/div/span/button[1]').click().then(function(){
					feedback(ptor, 'Module was successfully updated');
				})
			})
		})
	})
}

//====================================================
//            		change module name
//====================================================
exports.change_quiz_name = function(ptor, name, feedback){
	locator.by_xpath(ptor, '//*[@id="details"]/center/span[2]/table/tbody/tr[1]/td[2]/details-text/a').then(function(quiz){
		quiz.click().then(function(){
			locator.by_classname(ptor, 'editable-input').then(function(quiz_name){
				quiz_name.clear();
				quiz_name.sendKeys(name);
				locator.by_classname(ptor, 'icon-ok').click().then(function(){
					feedback(ptor, 'Quiz was successfully updated');
				})
			})
		})
	})
}

//https://www.youtube.com/watch?v=SKqBmAHwSkg#t=89
exports.create_lecture = function(ptor, lecture_name, lecture_url, feedback){
	this.add_lecture(ptor, 1, o_c.feedback);
	locator.by_xpath(ptor, '//*[@id="modules"]/ul/li[1]').click().then(function(){
		// locator.by_xpath(ptor, '//*[@id="details"]/center/span[2]/table/tbody/tr[1]/td[2]/details-text/a').click().then(function(){
		// 	locator.by_xpath(ptor, '//*[@id="details"]/center/span[2]/table/tbody/tr[1]/td[2]/details-text/form/div/input').then(function(lec_nm){
		// 		lec_nm.clear();
		// 		lec_nm.sendKeys(lecture_name);
		// 		locator.by_xpath(ptor, '//*[@id="details"]/center/span[2]/table/tbody/tr[1]/td[2]/details-text/form/div/span/button[1]').click().then(function(){
		// 			feedback(ptor, 'Lecture was successfully updated.');
		// 		})
		// 	})
		// })
		locator.by_xpath(ptor, '//*[@id="details"]/center/span[2]/table/tbody/tr[2]/td[2]/details-text/a').click().then(function(){
			locator.by_xpath(ptor, '//*[@id="details"]/center/span[2]/table/tbody/tr[2]/td[2]/details-text/form/div/input').then(function(lec_url){
				lec_url.clear();
				lec_url.sendKeys(lecture_url);
				locator.by_xpath(ptor, '//*[@id="details"]/center/span[2]/table/tbody/tr[2]/td[2]/details-text/form/div/span/button[1]').click().then(function(){
					//feedback(ptor, 'Lecture was successfully updated.');
				})
			})
			ptor.sleep(1000)
		})
	})
}

//https://www.youtube.com/watch?v=SKqBmAHwSkg#t=89
exports.create_lecture_in_module = function(ptor, lecture_name, lecture_url, mo_no, feedback){
	this.add_lecture(ptor, mo_no, o_c.feedback);
	locator.by_xpath(ptor, '//*[@id="modules"]/ul/li[1]').click().then(function(){
		// locator.by_xpath(ptor, '//*[@id="details"]/center/span[2]/table/tbody/tr[1]/td[2]/details-text/a').click().then(function(){
		// 	locator.by_xpath(ptor, '//*[@id="details"]/center/span[2]/table/tbody/tr[1]/td[2]/details-text/form/div/input').then(function(lec_nm){
		// 		lec_nm.clear();
		// 		lec_nm.sendKeys(lecture_name);
		// 		locator.by_xpath(ptor, '//*[@id="details"]/center/span[2]/table/tbody/tr[1]/td[2]/details-text/form/div/span/button[1]').click().then(function(){
		// 			feedback(ptor, 'Lecture was successfully updated.');
		// 		})
		// 	})
		// })
		locator.by_xpath(ptor, '//*[@id="details"]/center/span[2]/table/tbody/tr[2]/td[2]/details-text/a').click().then(function(){
			locator.by_xpath(ptor, '//*[@id="details"]/center/span[2]/table/tbody/tr[2]/td[2]/details-text/form/div/input').then(function(lec_url){
				lec_url.clear();
				lec_url.sendKeys(lecture_url);
				locator.by_xpath(ptor, '//*[@id="details"]/center/span[2]/table/tbody/tr[2]/td[2]/details-text/form/div/span/button[1]').click().then(function(){
					//feedback(ptor, 'Lecture was successfully updated.');
				})
			})
			ptor.sleep(1000)
		})
	})
}



//====================================================
//            		add mcq question for normal quiz
//====================================================
exports.add_quiz_question_mcq = function(ptor, question, answer1, answer2, answer3, correct){
	locator.by_classname(ptor, 'well').then(function(well){
		well.findElement(protractor.By.tagName('button')).click().then(function(){
			locator.by_name(ptor, 'qlabel').sendKeys(question).then(function(){
				locator.s_by_name(ptor, 'answer').then(function(answers){
					answers[answers.length-3].sendKeys(answer1)
					answers[answers.length-2].sendKeys(answer2)
					answers[answers.length-1].sendKeys(answer3)
				}).then(function(){
					locator.s_by_name(ptor, 'mcq').then(function(checkboxes){
						checkboxes[correct-1].click();
					})
				})
			})
		});
	})
}

//====================================================
//            		add mcq question for normal quiz
//====================================================
exports.add_quiz_question_ocq = function(ptor, question, answer1, answer2, answer3, correct){
	
}

//====================================================
//            		add mcq question for normal quiz
//====================================================
exports.add_quiz_question_free = function(ptor, question){
	
}

//====================================================
//            		add mcq question for normal quiz
//====================================================
exports.add_quiz_question_drag = function(ptor, question, answer1, answer2, answer3){
	
}

//====================================================
//            		adds a quiz header
//====================================================
exports.add_quiz_header = function(ptor, header){
	locator.by_name(ptor, 'add_header').click().then(function(){
		locator.s_by_class_name(ptor, 'ta-text')[locator.s_by_class_name(ptor, 'ta-text').length-1].sendKeys(header);
	})
	
}













