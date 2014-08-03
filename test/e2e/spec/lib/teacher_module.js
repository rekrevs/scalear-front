var ptor = protractor.getInstance();
var locator = require('./locators');
var o_c = require('./openers_and_clickers');
var student = require('./student_module')
var params = ptor.params;

//====================================================
//               add new course
//====================================================
exports.create_course = function(ptor, short_name, course_name, course_duration, discussion_link, image_link, course_description, prerequisites){
    	o_c.open_new_course(ptor);

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
		// locator.by_xpath(ptor, '//*[@id="main"]/div/div/div/form/center/div/div[4]/div[1]/input').then(function(dis_lnk){
		// 	dis_lnk.sendKeys(discussion_link);
		// })
		element(by.model("course.image_url")).sendKeys(image_link)
		element(by.model("course.description")).sendKeys(course_description)
		element(by.model("course.prerequisites")).sendKeys(prerequisites)
		ptor.executeScript('window.scrollBy(0, 1000)', '');
		// browser.debugger()
		element(by.buttonText("Create Course")).click().then(function(){
			 o_c.feedback(ptor, 'Course was successfully created.');
		})
		ptor.sleep(5000);
		// locator.s_by_model(ptor, 'course.image_url')[0].
		// locator.s_by_model(ptor, 'course.description')[0].then(function(crs_desc){
		// 	crs_desc.sendKeys(course_description);
		// })
		// locator.s_by_model(ptor, 'course.prerequisites')[0].then(function(pre_req){
		// 	pre_req.sendKeys(prerequisites);
		// })

		// ptor.executeScript('window.scrollBy(0, 1000)', '');
		// locator.by_classname(ptor, 'button').then(function(crt_crs_btn){
		// 	crt_crs_btn.click().then(function() {
	 //            o_c.feedback(ptor, 'Course was successfully created.');
	 //        });
		// })
}

//====================================================
//            get key and save in a holder
//====================================================
exports.get_key_and_enroll = function(ptor){
	this.open_settings_course_info(ptor);
	locator.by_id(ptor, 'enrollment_key').then(function(element){
		element.getText().then(function(text){
			o_c.logout(ptor);
			o_c.sign_in(ptor, params.mail, params.password);
			student.join_course(ptor, text);
			o_c.logout(ptor);
			o_c.sign_in(ptor, params.teacher_mail, params.password);
		})
	})
}

//====================================================
//            		delete course
//====================================================
exports.delete_course = function(ptor,co_no){
	var course = element(by.repeater('course in courses').row(co_no))
	course.element(by.className('delete')).click()
	course.element(by.className('fi-check')).click().then(function(){
		o_c.feedback(ptor, 'Course was successfully deleted.');
		// o_c.logout(ptor, o_c.feedback);
	})
	// o_c.open_tray(ptor);
	// o_c.logout(ptor, o_c.feedback);
	// o_c.sign_in(ptor, params.teacher_mail, params.password, o_c.feedback);
	// locator.by_xpath(ptor, '//*[@id="main"]/div/div/div/div/div[2]/div/span/a/img').then(function(x_btn){
	// 	x_btn.click().then(function(){
	// 		locator.by_xpath(ptor, '//*[@id="main"]/div/div/div/div/div[2]/div/span/div/span/a[1]/div').then(function(conf_del){
	// 			conf_del.click().then(function() {
	// 	            o_c.feedback(ptor, 'Course was successfully deleted.');
	// 	            o_c.home_teacher(ptor);
	// 				o_c.open_tray(ptor);
	// 				o_c.logout(ptor, o_c.feedback);
	// 	        });
	// 		})
	// 	})
	// })
}

// exports.delete_course_edited = function(ptor, co_no){
// 	var course = element(by.repeater('course in courses').row(co_no))
// 	course.element(by.className('delete')).click()
// 	course.element(by.className('fi-check')).click().then(function(){
// 		o_c.feedback(ptor, 'Course was successfully deleted.');
// 		o_c.logout(ptor, o_c.feedback);
// 	})
// }

// exports.just_delete_course = function(ptor){
//     locator.by_xpath(ptor, '//*[@id="main"]/div/div/div/div/div[2]/div/span/a/img').then(function(x_btn){
//         x_btn.click().then(function(){
//             locator.by_xpath(ptor, '//*[@id="main"]/div/div/div/div/div[2]/div/span/div/span/a[1]/div').then(function(conf_del){
//                 conf_del.click().then(function() {
//                     o_c.feedback(ptor, 'Course was successfully deleted.');
//                 });
//             })
//         })
//     })
// }


///////////////////////////////////////////////////////////////////////
////////////////////////course editor functions////////////////////////
///////////////////////////commonly used//////////////////////////////


//====================================================
//            		add / delete module
//====================================================

exports.add_module = function(ptor){
	o_c.open_content(ptor)
	element(by.id('new_module')).click().then(function(){
	 	o_c.feedback(ptor, 'Module was successfully created');	 	
	})
	o_c.hide_dropmenu(ptor)
	// locator.by_partial_text(ptor, '+ Add Module').then(function(add_mod){
 //        add_mod.click().then(function() {
 //           
 //        })
 //    })
}

exports.delete_empty_module = function(ptor, mo_no){
	element(by.repeater('module in modules').row(mo_no-1))
	.then(function(item){
		item.element(by.className('delete')).click()
		item.element(by.className('fi-check')).click().then(function(){
			o_c.feedback(ptor, 'was successfully deleted');
		})
	})
	// locator.by_repeater(ptor, 'module in modules').then(function(mods){
 //        mods[mo_no-1].findElement(protractor.By.className('delete')).then(function(del_btn){
 //            del_btn.click().then(function(){
 //            	mods[mo_no-1].findElement(protractor.By.className('fi-check')).then(function(conf_btn){
 //            		conf_btn.click().then(function(){
 //            			o_c.feedback(ptor, 'Module was successfully deleted');
 //            		})
 //            	})
 //            })
 //        })
 //    })
}

//====================================================
//            	delete item from module
//====================================================

exports.delete_item_by_number = function(ptor, mo_no, item_no){
	element(by.repeater('module in modules').row(mo_no-1))
	.element(by.repeater('item in module.items').row(item_no-1)).then(function(item){
		item.element(by.className('delete')).click()
		item.element(by.className('fi-check')).click().then(function(){
			o_c.feedback(ptor, 'was successfully deleted');
		})
	})
	// locator.by_repeater(ptor, 'module in modules').then(function(mods){
	// 	console.log("mods.length")
	// 	console.log(mods.length)
	// 	mods[mo_no-1].findElements(protractor.By.repeater('item in module.items')).then(function(items){
	// 		items[item_no-1].findElement(protractor.By.className('delete')).then(function(del_btn){
 //            	del_btn.click().then(function(){
 //            		items[item_no-1].findElement(protractor.By.className('fi-check')).then(function(conf_btn){
 //            			conf_btn.click().then(function(){
 //            				o_c.feedback(ptor, 'was successfully deleted');
 //            			})
 //            		})
 //            	})
 //            })
	// 	})
	// })
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
//            		change the name of an item
//====================================================
exports.rename_item = function(ptor, name){
	element(by.id('name')).click()
	.then(function(){
		element(by.className('editable-input')).sendKeys(name)
		element(by.className('check')).click().then(function(){
			o_c.feedback(ptor, 'successfully updated')			
			
		})	
	})
}



//https://www.youtube.com/watch?v=SKqBmAHwSkg#t=89
// exports.create_lecture = function(ptor, lecture_name, lecture_url){
// 	this.add_lecture(ptor, 1, o_c.feedback);
// 	locator.by_xpath(ptor, '//*[@id="modules"]/ul/li[1]').click().then(function(){
// 		locator.by_xpath(ptor, '//*[@id="details"]/center/span[2]/table/tbody/tr[1]/td[2]/details-text/a').click().then(function(){
// 			locator.by_xpath(ptor, '//*[@id="details"]/center/span[2]/table/tbody/tr[1]/td[2]/details-text/form/div/input').then(function(lec_nm){
// 				lec_nm.clear();
// 				lec_nm.sendKeys(lecture_name);
// 				locator.by_xpath(ptor, '//*[@id="details"]/center/span[2]/table/tbody/tr[1]/td[2]/details-text/form/div/span/button[1]').click().then(function(){
// 					o_c.feedback(ptor, 'Lecture was successfully updated.');
// 				})
// 			})
// 		})
// 		locator.by_xpath(ptor, '//*[@id="details"]/center/span[2]/table/tbody/tr[2]/td[2]/details-text/a').click().then(function(){
// 			locator.by_xpath(ptor, '//*[@id="details"]/center/span[2]/table/tbody/tr[2]/td[2]/details-text/form/div/input').then(function(lec_url){
// 				lec_url.clear();
// 				lec_url.sendKeys(lecture_url);
// 				locator.by_xpath(ptor, '//*[@id="details"]/center/span[2]/table/tbody/tr[2]/td[2]/details-text/form/div/span/button[1]').click().then(function(){
// 					//o_c.feedback(ptor, 'Lecture was successfully updated.');
// 				})
// 			})
// 			ptor.sleep(1000)
// 		})
// 	})
// }

//====================================================
//            		add mcq question for normal quiz
//====================================================
exports.add_quiz_question_mcq = function(ptor, question, number_of_additional_answers, correct){
	element(by.name('add_question')).click()
	var this_question = element.all(by.repeater('question in questions')).last()
	var add_button = this_question.element(by.className('add_multiple_answer'))
	var answer = this_question.all(by.repeater('answer in quiz.answers')).last().element(by.name('answer'))
	this_question.element(by.name('qlabel')).sendKeys(question)
	answer.sendKeys('answer0')
	for(var i=1; i<= number_of_additional_answers; i++){
		add_button.click()
		answer.sendKeys('answer'+i)
	}
	this_question.all(by.name('mcq')).then(function(checkboxes){
		correct.forEach(function(correct){
			checkboxes[correct-1].click();
		})
	})
}

//====================================================
//            		add ocq question for normal quiz
//====================================================
exports.add_quiz_question_ocq = function(ptor, question, number_of_additional_answers, correct){
	element(by.name('add_question')).click()
	var this_question = element.all(by.repeater('question in questions')).last()
	var add_button = this_question.element(by.className('add_multiple_answer'))
	var answer = this_question.all(by.repeater('answer in quiz.answers')).last().element(by.name('answer'))
	this_question.element(by.name('qlabel')).sendKeys(question)
	this_question.element(by.className('choices')).all(by.tagName('option')).get(1).click()
	answer.sendKeys('answer0')
	for(var i=1; i<= number_of_additional_answers; i++){
		add_button.click()
		answer.sendKeys('answer'+i)
	}
	this_question.all(by.id('radio_correct')).get(correct-1).click()
}

//====================================================
//            		add free question for normal quiz
//====================================================
exports.add_quiz_question_free = function(ptor, question, match_string){
	element(by.name('add_question')).click()
	var this_question = element.all(by.repeater('question in questions')).last()
	this_question.element(by.name('qlabel')).sendKeys(question)
	this_question.element(by.className('choices')).all(by.tagName('option')).get(2).click()
	if(match_string){
		this_question.element(by.model('quiz.match_type')).all(by.tagName('option')).get(1).click()
		this_question.element(by.name('answer')).sendKeys(match_string)
	}
}

//====================================================
//            		add drag question for normal quiz
//====================================================
exports.add_quiz_question_drag = function(ptor, question, number_of_additional_answers){
	element(by.name('add_question')).click()
	var this_question = element.all(by.repeater('question in questions')).last()
	var add_button = this_question.element(by.className('add_multiple_answer'))
	var answer = this_question.all(by.repeater('answer in quiz.answers')).last().element(by.name('answer'))
	this_question.element(by.name('qlabel')).sendKeys(question)
	this_question.element(by.className('choices')).all(by.tagName('option')).get(3).click()
	answer.sendKeys('answer0')
	for(var i=1; i<= number_of_additional_answers; i++){
		add_button.click()
		answer.sendKeys('answer'+i)
	}
}

//====================================================
//            		add mcq question for normal survey
//====================================================
exports.add_survey_question_mcq = function(ptor, question, number_of_additional_answers){
	element(by.name('add_question')).click()
	var this_question = element.all(by.repeater('question in questions')).last()
	var add_button = this_question.element(by.className('add_multiple_answer'))
	var answer = this_question.all(by.repeater('answer in quiz.answers')).last().element(by.name('answer'))
	this_question.element(by.name('qlabel')).sendKeys(question)
	answer.sendKeys('answer0')
	for(var i=1; i<= number_of_additional_answers; i++){
		add_button.click()
		answer.sendKeys('answer'+i)
	}
	// locator.by_name(ptor, 'add_question').then(function(add_question){
	// 	add_question.click().then(function(){
	// 		locator.s_by_name(ptor, 'qlabel').then(function(labels){
	// 			labels[labels.length-1].sendKeys(question).then(function(){
	// 				locator.s_by_classname(ptor, 'answer_div').then(function(answers_div){
	// 						answers_div[answers_div.length-1].findElement(protractor.By.className('add_multiple_answer')).then(function(link){
	// 						locator.s_by_name(ptor, 'answer').then(function(answers){
	// 							answers[answers.length-1].sendKeys('answer0')
	// 						})
	// 						var j = 1;
	// 						for(var i=0; i< number_of_additional_answers; i++){
	// 							link.click().then(function(){
	// 								locator.s_by_name(ptor, 'answer').then(function(answers){
	// 									answers[answers.length-1].sendKeys('answer'+j)
	// 									j++;

	// 								})
	// 							})
	// 						}
	// 					})
	// 				})
	// 			})
	// 		})
	// 	});
	// })
}

//====================================================
//            		add ocq question for normal survey
//====================================================
exports.add_survey_question_ocq = function(ptor, question, number_of_additional_answers){
	element(by.name('add_question')).click()
	var this_question = element.all(by.repeater('question in questions')).last()
	var add_button = this_question.element(by.className('add_multiple_answer'))
	var answer = this_question.all(by.repeater('answer in quiz.answers')).last().element(by.name('answer'))
	this_question.element(by.name('qlabel')).sendKeys(question)
	this_question.element(by.className('choices')).all(by.tagName('option')).get(1).click()
	answer.sendKeys('answer0')
	for(var i=1; i<= number_of_additional_answers; i++){
		add_button.click()
		answer.sendKeys('answer'+i)
	}
	// locator.by_name(ptor, 'add_question').then(function(add_question){
	// 	o_c.scroll_element(ptor, add_question)
	// 	add_question.click().then(function(){
	// 		locator.s_by_name(ptor, 'qlabel').then(function(labels){
	// 			labels[labels.length-1].sendKeys(question).then(function(){
	// 				locator.s_by_classname(ptor, 'choices').then(function(dropdowns){
	// 					dropdowns[dropdowns.length-1].findElements(protractor.By.tagName('option')).then(function(types){
	// 						types[1].click();
	// 					})
	// 				}).then(function(){
	// 					locator.s_by_classname(ptor, 'answer_div').then(function(answers_divs){
	// 						answers_divs[answers_divs.length-1].findElement(protractor.By.className('add_multiple_answer')).then(function(link){
	// 							locator.s_by_name(ptor, 'answer').then(function(answers){
	// 								answers[answers.length-1].sendKeys('answer0')
	// 							})
	// 							var j = 1;
	// 							for(var i=0; i< number_of_additional_answers; i++){
	// 								o_c.scroll_element(ptor, link)
	// 								link.click().then(function(){
	// 									locator.s_by_name(ptor, 'answer').then(function(answers){
	// 										answers[answers.length-1].sendKeys('answer'+j)
	// 										j++;

	// 									})
	// 								})
	// 							}
	// 						})
	// 					})
	// 				})
	// 			})
	// 		})
	// 	});
	// })
}

//====================================================
//            		add free question for normal survey
//====================================================
exports.add_survey_question_free = function(ptor, question){
	element(by.name('add_question')).click()
	var this_question = element.all(by.repeater('question in questions')).last()
	this_question.element(by.name('qlabel')).sendKeys(question)
	this_question.element(by.className('choices')).all(by.tagName('option')).get(2).click()
	// locator.by_name(ptor, 'add_question').then(function(add_question){
	// 	o_c.scroll_element(ptor, add_question)
	// 	add_question.click().then(function(){
	// 		locator.s_by_name(ptor, 'qlabel').then(function(labels){
	// 			labels[labels.length-1].sendKeys(question).then(function(){
	// 				locator.s_by_classname(ptor, 'choices').then(function(dropdowns){
	// 					dropdowns[dropdowns.length-1].findElements(protractor.By.tagName('option')).then(function(types){
	// 						types[2].click();
	// 					})
	// 				})
	// 			})
	// 		})
	// 	});
	// })
}

//====================================================
//            		adds a quiz header
//====================================================
exports.add_quiz_header = function(ptor, header){
	element(by.name('add_header')).click()
	element.all(by.className('ta-text')).last().sendKeys(header)
	// locator.by_name(ptor, 'add_header').then(function(add_header){
	// 	// o_c.scroll_element(ptor, add_header)
	// 	add_header.click().then(function(){
	// 		// console.log(locator.s_by_classname(ptor, 'ta-text'))
	// 		locator.s_by_classname(ptor, 'ta-text').then(function(fields){
	// 			fields[fields.length-1].sendKeys(header);
	// 		})
	// 	})
		
	// })
}

exports.add_survey_header = function(ptor, header){
	element(by.name('add_header')).click()
	element.all(by.className('ta-text')).last().sendKeys(header)
	// locator.by_name(ptor, 'add_header').then(function(add_header){
	// 	// o_c.scroll_element(ptor, add_header)
	// 	add_header.click().then(function(){
	// 		// console.log(locator.s_by_classname(ptor, 'ta-text'))
	// 		locator.s_by_classname(ptor, 'ta-text').then(function(fields){
	// 			fields[fields.length-1].sendKeys(header);
	// 		})
	// 	})
		
	// })
}

//====================================================
//            	save normal quiz or survey
//====================================================
exports.save_quiz = function(ptor){
	element(by.name('save_quiz')).click().then(function(){
		o_c.feedback(ptor, 'Quiz was successfully saved');
	})
}

//====================================================
//            	save normal survey
//====================================================
exports.save_survey = function(ptor){
	locator.by_name(ptor, 'save_quiz').click().then(function(){
		o_c.feedback(ptor, 'Survey was successfully saved');
	})
}

//====================================================
//            	make the quiz required
//====================================================
exports.make_quiz_required = function(ptor){
	element(by.tagName('details-check')).click()
	element(by.className('editable-input')).click()
	element(by.className('check')).click().then(function(){
		o_c.feedback(ptor, 'Quiz was successfully updated');
	})
	// locator.by_tag(ptor, 'details-check').click().then(function(){
	// 	locator.by_classname(ptor, 'editable-input').then(function(checkbox){
	// 		checkbox.click().then(function(){
	// 			locator.by_classname(ptor, 'icon-ok').then(function(confirm){
	// 				confirm.click().then(function(){
	// 					o_c.feedback(ptor, 'Quiz was successfully updated');
	// 				})
	// 			})
	// 		})
	// 	})
		
	// })
}

exports.make_survey_required = function(ptor){
	element(by.tagName('details-check')).click()
	element(by.className('editable-input')).click()
	element(by.className('check')).click().then(function(){
		o_c.feedback(ptor, 'Survey was successfully updated');
	})
	// locator.by_tag(ptor, 'details-check').click().then(function(){
	// 	locator.by_classname(ptor, 'editable-input').then(function(checkbox){
	// 		checkbox.click().then(function(){
	// 			locator.by_classname(ptor, 'icon-ok').then(function(confirm){
	// 				confirm.click().then(function(){
	// 					o_c.feedback(ptor, 'Quiz was successfully updated');
	// 				})
	// 			})
	// 		})
	// 	})
		
	// })
}

//====================================================
//				initialize a lecture with a url
//===================================================
exports.initialize_lecture = function(ptor, lec_name, lec_url){	
	element(by.id('name')).click()
	.then(function(){
		element(by.className('editable-input')).sendKeys(lec_name)
		element(by.className('check')).click().then(function(){
			// o_c.feedback(ptor, 'successfully updated')			
			element(by.id('url')).click()
			.then(function(){
				element(by.className('editable-input')).sendKeys(lec_url)
				element(by.className('check')).click()
				element(by.className('check')).click()
			})
		})	
	})

	// locator.by_id(ptor, 'details').then(function(details){
	// 	details.findElements(protractor.By.tagName("td")).then(function(td){
	// 		td[1].click().then(function(){
	// 			locator.by_classname(ptor, 'editable-input').then(function(field){
	// 				field.sendKeys(lec_name).then(function(){
	// 					locator.by_classname(ptor, 'fi-check').then(function(confirm_button){
	// 						confirm_button.click().then(function(){
	// 							o_c.feedback(ptor, 'successfully updated')
	// 						})
	// 					})
	// 				})
	// 			})
	// 		})
	// 		td[4].click().then(function(){
	// 			locator.by_classname(ptor, 'editable-input').then(function(field){
	// 				field.sendKeys(lec_url).then(function(){
	// 					locator.by_classname(ptor, 'fi-check').then(function(confirm_button){
	// 						confirm_button.click().then(function(){
	// 							o_c.feedback(ptor, 'successfully updated')
	// 						})
	// 					})
	// 				})
	// 			})		
	// 		})
	// 	})
	// })
}

//====================================================
//				rename a module
//===================================================
exports.rename_module = function(ptor, name){
	locator.by_classname(ptor, 'whole-middle').then(function(details){
		details.findElement(protractor.By.tagName('details-text')).click().then(function(){
			locator.by_classname(ptor, 'editable-input').then(function(field){
				field.sendKeys(name).then(function(){
					locator.by_classname(ptor, 'icon-ok').then(function(confirm_button){
						confirm_button.click().then(function(){
							o_c.feedback(ptor, 'successfully updated')
						})
					})
				})
			})
		})
	})
}

//====================================================
//              mark to be inclass
//====================================================

exports.check_inclass = function(ptor, no){
    locator.by_repeater(ptor, "item in timeline['lecture'][lec.meta.id].items").then(function(items){
        items[no-1].findElement(protractor.By.tagName('input')).then(function(ins){
        	ins.click();
        })
    })
}

exports.check_inclass_in_item = function(ptor, no, item_no){
    locator.by_repeater(ptor, "item in timeline['lecture'][lec.meta.id].items").then(function(items){
        items[no-1].findElements(protractor.By.tagName('input')).then(function(ins){
            ins[item_no-1].click();
        })
    })
}

//=====================================================
//				new nav_bar functions
//=====================================================
exports.open_progress_review_module = function(ptor){
    locator.by_id(ptor, 'progress').then(function(btn){
        btn.click().then(function(){
        	locator.by_id(ptor, 'review_module_progress').then(function(btn2){
        		btn2.click();
        	})
        })
    })
}

exports.open_progress_all_students = function(ptor){
    locator.by_id(ptor, 'progress').then(function(btn){
        btn.click().then(function(){
        	locator.by_id(ptor, 'all_student_progress').then(function(btn2){
        		btn2.click();
        	})
        })
    })
}

exports.open_inclass = function(ptor){
    locator.by_id(ptor, 'inclass').then(function(btn){
        btn.click();
    })
}

exports.open_content_new_module = function(ptor){
    locator.by_id(ptor, 'content').then(function(btn){
        btn.click().then(function(){
        	locator.by_id(ptor, 'new_module').then(function(btn2){
        		btn2.click().then(function(){
			        o_c.feedback(ptor, 'Module was successfully created')
				})
        	})
        })
    })
}

/////////////////////////////////////////////////////////////////////
//			online content creation => lecs quizzes etc
/////////////////////////////////////////////////////////////////////
exports.open_content_new_online_content = function(ptor){
    locator.by_id(ptor, 'content').then(function(btn){
        btn.click().then(function(){
        	locator.by_id(ptor, 'new_online_content').then(function(btn2){
        		btn2.click().then(function(){
        			locator.by_classname(ptor, 'modal-body').then(function(modal){
    					expect(modal.isDisplayed()).toEqual(true);    
  					})
        		})
        	})
        })
    })
}

//https://www.youtube.com/watch?v=SKqBmAHwSkg#t=89

exports.create_lecture = function(ptor){
    locator.by_id(ptor, 'content').then(function(btn){
        btn.click().then(function(){
        	locator.by_id(ptor, 'new_online_content').then(function(btn2){
        		btn2.click().then(function(){
        			locator.by_classname(ptor,'button-group').then(function(modal){
						modal.findElements(protractor.By.tagName("li")).then(function(btns){
							btns[0].click().then(function(){
								o_c.feedback(ptor,"Lecture was successfully created");
							})
						})
  					})
        		})
        	})
        })
    })
}

exports.create_quiz = function(ptor){
    locator.by_id(ptor, 'content').then(function(btn){
        btn.click().then(function(){
        	locator.by_id(ptor, 'new_online_content').then(function(btn2){
        		btn2.click().then(function(){
        			locator.by_classname(ptor,'button-group').then(function(modal){
						modal.findElements(protractor.By.tagName("li")).then(function(btns){
							btns[1].click().then(function(){
								o_c.feedback(ptor,"Lecture was successfully created");
							})
						})
  					})
        		})
        	})
        })
    })
}

exports.create_survey = function(ptor){
    locator.by_id(ptor, 'content').then(function(btn){
        btn.click().then(function(){
        	locator.by_id(ptor, 'new_online_content').then(function(btn2){
        		btn2.click().then(function(){
        			locator.by_classname(ptor,'button-group').then(function(modal){
						modal.findElements(protractor.By.tagName("li")).then(function(btns){
							btns[2].click().then(function(){
								o_c.feedback(ptor,"Lecture was successfully created");
							})
						})
  					})
        		})
        	})
        })
    })
}

/////////////////////////////////////////////////////////////////////
//						in video questions
//////////////////////////////////////////////////////////////////////
exports.open_content_new_in_video_ques = function(ptor){
    locator.by_id(ptor, 'content').then(function(btn){
        btn.click().then(function(){
        	locator.by_id(ptor, 'new_in_video_ques').then(function(btn2){
        		btn2.click();
        	})
        })
    })
}

/////////////////////////////////////////////////////////////////////////
exports.open_content_copy = function(ptor){
    locator.by_id(ptor, 'content').then(function(btn){
        btn.click().then(function(){
        	locator.by_id(ptor, 'copy').then(function(btn2){
        		btn2.click();
        	})
        })
    })
}

exports.open_content_paste = function(ptor){
    locator.by_id(ptor, 'content').then(function(btn){
        btn.click().then(function(){
        	locator.by_id(ptor, 'paste').then(function(btn2){
        		btn2.click();
        	})
        })
    })
}

exports.open_content_share_copy = function(ptor){
    locator.by_id(ptor, 'content').then(function(btn){
        btn.click().then(function(){
        	locator.by_id(ptor, 'share_copy').then(function(btn2){
        		btn2.click();
        	})
        })
    })
}

exports.open_content_preview = function(ptor){
    locator.by_id(ptor, 'content').then(function(btn){
        btn.click().then(function(){
        	locator.by_id(ptor, 'preview_as_student').then(function(btn2){
        		btn2.click();
        	})
        })
    })
}

exports.check_for_teacher_nav_bar = function(ptor){
    locator.by_id(ptor, 'teacher_left_nav').then(function(nav){
    	expect(nav.isDisplayed()).toEqual(true);    
  	})
}

//=====================================================
//			new nav_bar settings functions
//=====================================================

exports.open_settings_course_info = function(ptor){
    locator.by_id(ptor, 'settings').then(function(btn){
        btn.click().then(function(){
        	locator.by_id(ptor, 'course_info').then(function(btn2){
        		btn2.click();
        	})
        })
    })
}

exports.open_settings_announcements = function(ptor){
    locator.by_id(ptor, 'settings').then(function(btn){
        btn.click().then(function(){
        	locator.by_id(ptor, 'announcements').then(function(btn2){
        		btn2.click();
        	})
        })
    })
}

exports.open_settings_enrolled = function(ptor){
    locator.by_id(ptor, 'settings').then(function(btn){
        btn.click().then(function(){
        	locator.by_id(ptor, 'enrolled_students').then(function(btn2){
        		btn2.click();
        	})
        })
    })
}

// //====================================================
// //            		add lecture
// //====================================================

exports.add_lecture = function(ptor){
	o_c.open_content(ptor)
	o_c.open_online_content(ptor)
	element(by.id('video_item')).click().then(function(){
		o_c.feedback(ptor, 'Lecture was successfully created.')
	})
	o_c.hide_dropmenu(ptor)
}

// exports.add_lecture = function(ptor, mo_no){
// 	locator.by_repeater(ptor, 'module in modules').then(function(mods){
// 		mods[mo_no-1].click();
// 		mods[mo_no-1].findElement(protractor.By.partialLinkText("+ Add")).then(function(add_button){
// 			add_button.click().then(function(){
// 				locator.s_by_classname(ptor, 'add-menu-container').then(function(menus){
// 					menus[mo_no-1].findElements(protractor.By.className('add-item')).then(function(options){
// 						options[0].click().then(function(){
// 							o_c.feedback(ptor, 'Lecture was successfully created.')
// 						});
// 					})
// 				})
// 			})
// 		})
// 	})
// }

// //====================================================
// //            		add quiz
// //====================================================

exports.add_quiz = function(ptor){
	o_c.open_content(ptor)
	o_c.open_online_content(ptor)
	element(by.id('quiz_item')).click().then(function(){
		o_c.feedback(ptor, 'Quiz was successfully created.')
	})
	o_c.hide_dropmenu(ptor)
}

// //====================================================
// //            		add survey
// //====================================================

exports.add_survey = function(ptor){
	o_c.open_content(ptor)
	o_c.open_online_content(ptor)
	element(by.id('survey_item')).click().then(function(){
		o_c.feedback(ptor, 'Survey was successfully created.')
	})
	o_c.hide_dropmenu(ptor)
}
// exports.add_survey = function(ptor, mo_no){
// 	locator.by_repeater(ptor, 'module in modules').then(function(mods){
// 		mods[mo_no-1].findElement(protractor.By.className('item-buttons')).then(function(btns_frame){
// 			btns_frame.findElements(protractor.By.className('btn-success')).then(function(add_button){
// 				add_button[1].click().then(function(){
// 					locator.s_by_classname(ptor, 'add-menu-container').then(function(menus){
// 						menus[mo_no-1].findElements(protractor.By.className('add-item')).then(function(options){
// 							options[2].click().then(function(){
// 								o_c.feedback(ptor, 'Survey was successfully created.')
// 							});
// 						})
// 					})
// 				})
// 			})
// 		})
// 	})
// }
