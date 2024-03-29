// // var ptor = protractor.getInstance();
// var locator = require('./locators');
// var o_c = require('./openers_and_clickers');
// var student = require('./student_module')
// // var params = ptor.params;

//====================================================
//               add new course
//====================================================
var sleep = require('./utils').sleep;

exports.create_course = function(ptor, short_name, course_name, course_duration, discussion_link, image_link, course_description, prerequisites){
    	o_c.open_new_course(ptor);

		element(by.model("course.short_name")).sendKeys(short_name)
		element(by.model("course.name")).sendKeys(course_name)
		element(by.model("course.duration")).sendKeys(course_duration)
		element(by.model("course.image_url")).sendKeys(image_link)
		element(by.model("course.description")).sendKeys(course_description)
		element(by.model("course.prerequisites")).sendKeys(prerequisites)
		o_c.scroll(ptor, 1000)

		element(by.buttonText("Create Course")).click();

		ptor.sleep(5000);
}

//====================================================
//            get key and save in a holder
//====================================================
exports.get_key_and_enroll = function(ptor, email, password){
	o_c.open_course_info(ptor);
	element(by.binding('course.unique_identifier')).getText().then(function(text){
		o_c.logout(ptor);
		o_c.sign_in(ptor, email, password);
		student.join_course(ptor, text);
		// o_c.logout(ptor);
		// o_c.sign_in(ptor, params.teacher1.email, params.password);
	})
	// locator.by_id(ptor, 'enrollment_key').then(function(element){
	// 	element.getText().then(function(text){

	// 	})
	// })
}

//====================================================
//            		delete course
//====================================================
exports.delete_course = function(ptor,co_no){
	var course = element(by.id('main_course_list')).element(by.repeater('course in courses').row(co_no-1))
	course.element(by.className('delete')).click()
	course.element(by.className('fi-check')).click()

	// .then(function(){
	//  o_c.feedback(ptor, 'Course was successfully deleted.');
	// 	o_c.logout(ptor);
	// })
	// o_c.open_tray(ptor);
	// o_c.logout(ptor, o_c.feedback);
	// o_c.sign_in(ptor, params.teacher1.email, params.password, o_c.feedback);
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
	element.all(by.repeater('module in modules')).count().then(function(count){
		var module_count = count
		o_c.open_content(ptor);
		element(by.id('new_module')).click()
		expect(element.all(by.repeater('module in modules')).count()).toEqual(module_count+1)
		o_c.hide_dropmenu(ptor);
	})
}

exports.delete_empty_module = function(ptor, mo_no){
	// var module_count = 0
	element.all(by.repeater('module in modules')).count().then(function(count){
		var module_count = count

		element(by.repeater('module in modules').row(mo_no-1))
		.then(function(item){
			item.element(by.className('delete')).click()
			item.element(by.className('fi-check')).click()
			// .then(function(){
			// 	o_c.feedback(ptor, 'was successfully deleted');
			// })
		})
		expect(element.all(by.repeater('module in modules')).count()).toEqual(module_count-1)
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
//            		add - edit / delete course links
//====================================================

exports.add_course_link = function(ptor){
	element.all(by.repeater('link in links')).count().then(function(count){
		var links_count = count
		o_c.open_content(ptor);
		o_c.open_online_content(ptor)
		element(by.id('link_item')).click()
		expect(element.all(by.repeater('link in links')).count()).toEqual(links_count+1)
		o_c.hide_dropmenu(ptor);
	})
}

exports.delete_course_link = function(ptor, link_no){
	element.all(by.repeater('link in links')).count().then(function(count){
		var links_count = count

		element(by.repeater('link in links').row(link_no-1))
		.then(function(item){
			item.element(by.className('delete')).click()
			item.element(by.className('fi-check')).click()
			// .then(function(){
			// 	o_c.feedback(ptor, 'was successfully deleted');
			// })
		})
		expect(element.all(by.repeater('link in links')).count()).toEqual(links_count-1)
	})
}

exports.edit_course_link_info = function(link_no, name, link){
	element(by.repeater('link in links').row(link_no-1))
		.then(function(item){
			item.element(by.tagName("details-text")).click().then(function(){
				element(by.className('editable-input')).sendKeys(name)
				element(by.className('check')).click()
			})
			item.element(by.tagName("details-link")).click().then(function(){
				element(by.className('editable-input')).sendKeys(link)
				element(by.className('check')).click()
			})
		})
}

exports.add_module_link = function(ptor){
	element.all(by.repeater('doc in module.custom_links')).count().then(function(count){
		var links_count = count
		element(by.id('add_module_link')).click()
		expect(element.all(by.repeater('doc in module.custom_links')).count()).toEqual(links_count+1)
	})
}

exports.delete_module_link = function(ptor, link_no){
	element.all(by.repeater('doc in module.custom_links')).count().then(function(count){
		var links_count = count

		element(by.repeater('doc in module.custom_links').row(link_no-1))
		.then(function(item){
			item.element(by.className('delete')).click()
			item.element(by.className('fi-check')).click()
			// .then(function(){
			// 	o_c.feedback(ptor, 'was successfully deleted');
			// })
		})
		expect(element.all(by.repeater('doc in module.custom_links')).count()).toEqual(links_count-1)
	})
}

exports.edit_module_link_info = function(link_no, name, link){
	element(by.repeater('doc in module.custom_links').row(link_no-1))
		.then(function(item){
			item.element(by.tagName("details-text")).click().then(function(){
				element(by.className('editable-input')).sendKeys(name)
				element(by.className('check')).click()
			})
			item.element(by.tagName("details-link")).click().then(function(){
				element(by.className('editable-input')).sendKeys(link)
				element(by.className('check')).click()
			})
		})
}

//====================================================
//            	delete item from module
//====================================================

exports.delete_item_by_number = function(ptor, mo_no, item_no){
	element(by.repeater('module in modules').row(mo_no-1)).all(by.repeater('item in module.items')).count().then(function(count){
		var item_count = count

		element(by.repeater('module in modules').row(mo_no-1))
		.element(by.repeater('item in module.items').row(item_no-1)).then(function(item){
			item.element(by.className('delete')).click()
			item.element(by.className('fi-check')).click()
			// .then(function(){
			// 	o_c.feedback(ptor, 'was successfully deleted');
			// })
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
		expect(element(by.repeater('module in modules').row(mo_no-1)).all(by.repeater('item in module.items')).count()).toEqual(item_count-1)
	})

}

//====================================================
//            click on a module to expand
//====================================================

exports.open_module = function(ptor, mo_no){
	element(by.className('content-navigator-container')).element(by.repeater('module in modules').row(mo_no-1)).click()
	// locator.by_repeater(ptor, 'module in modules').then(function(mods){
	// 	mods[mo_no-1].click();
	// })
}

//====================================================
//            click on an item to edit
//====================================================
exports.open_item = function(ptor, mo_no, item_no){
	 element(by.repeater('module in modules').row(mo_no-1)).element(by.repeater('item in module.items').row(item_no-1)).click()
}


//====================================================
//            click on an course_links to expand
//====================================================
exports.open_course_links = function(){
  element(by.className('content-navigator-container')).element(by.className('links_accordion')).click()
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
		element(by.className('editable-input')).clear().sendKeys(name)
		element(by.className('check')).click()

		expect(element(by.id('name')).getText()).toContain(name)
		// .then(function(){
		// 	o_c.feedback(ptor, 'successfully updated')

		// })
	})
}

exports.change_lecture_inorder=function(){
	element(by.model('lecture.required')).click()
}

exports.change_quiz_inorder=function(){
	element(by.model('quiz.required')).click()
}

exports.change_survey_inorder=function(){
	element(by.model('quiz.required')).click()
}


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

exports.reorder_drag_answer = function(ptor){
  var this_question = element.all(by.repeater('question in questions')).last()
  var handles = this_question.all(by.className('drag-item'))
  var answers = this_question.all(by.repeater('answer in quiz.answers'))
  ptor.actions().dragAndDrop(handles.get(0), handles.get(1)).perform();
  ptor.actions().dragAndDrop(handles.get(0), handles.get(2)).perform();
  for(var i=0; i<3; i++){
    answers.get(0).getText().then(function(text){
      if(text == 'answer1')
        ptor.actions().dragAndDrop(handles.get(0), handles.get(1)).perform();
      else if(text == 'answer2')
        ptor.actions().dragAndDrop(handles.get(0), handles.get(2)).perform();
    })
    answers.get(1).getText().then(function(text){
      if(text == 'answer0')
        ptor.actions().dragAndDrop(handles.get(1), handles.get(0)).perform();
      else if(text == 'answer2')
        ptor.actions().dragAndDrop(handles.get(1), handles.get(2)).perform();
    })
    answers.get(2).getText().then(function(text){
      if(text == 'answer0')
        ptor.actions().dragAndDrop(handles.get(2), handles.get(0)).perform();
      else if(text == 'answer1')
        ptor.actions().dragAndDrop(handles.get(2), handles.get(1)).perform();
    })
  }
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
	element(by.name('save_quiz')).click()
	// .then(function(){
	// 	o_c.feedback(ptor, 'Quiz was successfully saved');
	// })
}

//====================================================
//            	save normal survey
//====================================================
exports.save_survey = function(ptor){
	locator.by_name(ptor, 'save_quiz').click()
	// .then(function(){
	// 	o_c.feedback(ptor, 'Survey was successfully saved');
	// })
}

//====================================================
//            	make the quiz required
//====================================================
exports.change_quiz_required = function(){
	element(by.model('quiz.graded')).click()
}

exports.change_survey_required = function(ptor){
	element(by.model('quiz.graded')).click()
}

exports.change_lecture_required = function(){
	element(by.model('lecture.graded')).click()
}

exports.open_lecture_settings= function(){
	element(by.id("lec_settings")).click()
}

exports.open_lecture_video_settings= function(){
	element(by.id("video_settings")).click()
}

exports.change_attempt_num=function(num){
	element(by.tagName('details-number')).click()
	element(by.className('editable-input')).sendKeys(num)
	element(by.className('check')).click()
	expect(element(by.tagName('details-number')).getText()).toEqual(""+num)
}


//====================================================
//				rename a module
//===================================================
exports.rename_module = function(ptor, name){
	element(by.id("module")).element(by.tagName("details-text")).click().then(function(){
		element(by.className('editable-input')).clear().sendKeys(name)
		element(by.className('check')).click()
	})

	// locator.by_classname(ptor, 'whole-middle').then(function(details){
	// 	details.findElement(protractor.By.tagName('details-text')).click().then(function(){
	// 		locator.by_classname(ptor, 'editable-input').then(function(field){
	// 			field.sendKeys(name).then(function(){
	// 				locator.by_classname(ptor, 'fi-check').then(function(confirm_button){
	// 					confirm_button.click()
	// 					// .then(function(){
	// 					// 	o_c.feedback(ptor, 'successfully updated')
	// 					// })
	// 				})
	// 			})
	// 		})
	// 	})
	// })
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
// exports.create_lecture = function(ptor){
//     locator.by_id(ptor, 'content').then(function(btn){
//         btn.click().then(function(){
//         	locator.by_id(ptor, 'new_online_content').then(function(btn2){
//         		btn2.click().then(function(){
//         			locator.by_classname(ptor,'button-group').then(function(modal){
// 						modal.findElements(protractor.By.tagName("li")).then(function(btns){
// 							btns[0].click().then(function(){
// 								o_c.feedback(ptor,"Lecture was successfully created");
// 							})
// 						})
//   					})
//         		})
//         	})
//         })
//     })
// }

exports.init_lecture = function(ptor, lec_name, lec_url){
	element(by.id('name')).click()
	.then(function(){
		element(by.className('editable-input')).clear().sendKeys(lec_name)
		element(by.className('check')).click().then(function(){
			// o_c.feedback(ptor, 'successfully updated')
			element(by.id('url')).click()
			.then(function(){
				element(by.className('editable-input')).clear().sendKeys(lec_url)
				element(by.className('check')).click();
			})
		})
	})
}


// exports.create_quiz = function(ptor){
//     locator.by_id(ptor, 'content').then(function(btn){
//         btn.click().then(function(){
//         	locator.by_id(ptor, 'new_online_content').then(function(btn2){
//         		btn2.click().then(function(){
//         			locator.by_classname(ptor,'button-group').then(function(modal){
// 						modal.findElements(protractor.By.tagName("li")).then(function(btns){
// 							btns[1].click().then(function(){
// 								o_c.feedback(ptor,"Lecture was successfully created");
// 							})
// 						})
//   					})
//         		})
//         	})
//         })
//     })
// }

// exports.create_survey = function(ptor){
//     locator.by_id(ptor, 'content').then(function(btn){
//         btn.click().then(function(){
//         	locator.by_id(ptor, 'new_online_content').then(function(btn2){
//         		btn2.click().then(function(){
//         			locator.by_classname(ptor,'button-group').then(function(modal){
// 						modal.findElements(protractor.By.tagName("li")).then(function(btns){
// 							btns[2].click().then(function(){
// 								o_c.feedback(ptor,"Lecture was successfully created");
// 							})
// 						})
//   					})
//         		})
//         	})
//         })
//     })
// }

/////////////////////////////////////////////////////////////////////
//						in video questions
//////////////////////////////////////////////////////////////////////
exports.add_in_video_ques = function(){
	element(by.id('new_question')).click()
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

// exports.open_course_info = function(ptor){
// 	o_c.press_content_navigator()
// 	element(by.id('course_info')).click()
//     // locator.by_id(ptor, 'settings').then(function(btn){
//     //     btn.click().then(function(){
//     //     	locator.by_id(ptor, 'course_info').then(function(btn2){
//     //     		btn2.click();
//     //     	})
//     //     })
//     // })
// }

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

exports.open_settings_add_students = function(ptor){
    locator.by_id(ptor, 'settings').then(function(btn){
        btn.click().then(function(){
        	locator.by_id(ptor, 'add_students').then(function(btn2){
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
	element(by.id('video_item')).click()
	// .then(function(){
	// 	o_c.feedback(ptor, 'Lecture was successfully created.')
	// })
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
	element(by.id('quiz_item')).click()
	// .then(function(){
	// 	o_c.feedback(ptor, 'Quiz was successfully created.')
	// })
	o_c.hide_dropmenu(ptor)
}

// //====================================================
// //            		add survey
// //====================================================

exports.add_survey = function(ptor){
	o_c.open_content(ptor)
	o_c.open_online_content(ptor)
	element(by.id('survey_item')).click()
	// .then(function(){
	// 	o_c.feedback(ptor, 'Survey was successfully created.')
	// })
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

// //====================================================
// //            		add invideo quizzes
// //====================================================

var create_invideo_quiz=function(id){
	exports.add_in_video_ques();
	element(by.id(id)).click()
	expect(element(by.id("editing")).isDisplayed()).toEqual(true);
}

exports.create_invideo_drag_text_quiz=function(){
	create_invideo_quiz("drag_text")
}

exports.create_invideo_drag_quiz=function(){
	create_invideo_quiz("drag")
}

exports.create_invideo_mcq_text_quiz=function(){
	create_invideo_quiz("mcq_text")
}

exports.create_invideo_mcq_quiz=function(){
	create_invideo_quiz("mcq")
}

exports.create_invideo_mcq_survey=function(){
	create_invideo_quiz("mcq_sur")
}

exports.create_invideo_ocq_text_quiz=function(){
	create_invideo_quiz("ocq_text")
}

exports.create_invideo_ocq_quiz=function(){
	create_invideo_quiz("ocq")
}

exports.create_invideo_ocq_survey=function(){
	create_invideo_quiz("ocq_sur")
}

exports.create_invideo_free_text_quiz=function(){
	create_invideo_quiz("free_text")
}

exports.exit_invideo_quiz = function(){
	element(by.buttonText("Exit")).click()
}

exports.cancel_invideo_quiz = function(){
	element(by.buttonText('Cancel')).click()
}

exports.rename_invideo_quiz = function(name){
	// var editable = element(by.repeater('quiz in quiz_list').row(quiz_no-1)).element(by.tagName('editable_text'))
	// var pencil = element(by.repeater('quiz in quiz_list').row(quiz_no-1)).element(by.className('fi-pencil'))
	// ptor.actions().mouseMove(editable).perform()
	// pencil.click()
	element(by.className('quiz_name')).clear().sendKeys(name)
	// editable.element(by.className('fi-check')).click()
}

exports.change_invideo_quiz_time= function(time){
	element(by.className('quiz_time')).clear().sendKeys(time)
}

exports.make_mcq_text_questions=function(ptor){

	locator.by_id(ptor,'ontop').then(function(ontop){
		ontop.findElement(protractor.By.partialLinkText('Add Answer')).click();
		ontop.findElement(protractor.By.partialLinkText('Add Answer')).click();

		ontop.findElements(protractor.By.name('mcq')).then(function(check){
			o_c.scroll(ptor, 0);
			check[0].click();
			check[2].click();
		})
		ontop.findElements(protractor.By.name('answer')).then(function(answer){
			answer[0].sendKeys("answer 1");
			answer[1].sendKeys("answer 2");
			answer[2].sendKeys("answer 3");
		})


		element.all(by.model("answer.explanation")).then(function(ex){
			ex[0].sendKeys("explanation 1");
			ex[1].sendKeys("explanation 2");
			ex[2].sendKeys("explanation 3");
		})

		// ptor.sleep(2000);
		o_c.scroll(ptor, 1000);
		element(by.buttonText('Done')).click()
		// .then(function(btn){
		// 	btn.click().then(function(){
		// 		o_c.feedback(ptor, 'Quiz was successfully saved');
		// 	})
		// })
	})
}

exports.make_mcq_questions=function(ptor, q1_x, q1_y, q2_x, q2_y, q3_x, q3_y){
	var ontop_w = 0;
	var ontop_h = 0;
	locator.by_id(ptor,'ontop').then(function(ontop){
		ontop.getSize().then(function(size){
			ontop_w = size.width;
			ontop_h = size.height

			ptor.actions().mouseMove(ontop).perform();
			ptor.actions().mouseMove(ontop,{x: q1_x, y: q1_y}).perform();
			ptor.actions().doubleClick().perform();
			ptor.actions().click().perform();
			ptor.sleep(1000)
			locator.by_classname(ptor, 'must_save_check').click();
			// element(by.id("correct_checkbox")).click()
			element.all(by.model("data.explanation")).then(function(ex){
				ex[0].sendKeys("explanation 1");
			})

			ptor.actions().mouseMove(ontop).perform();
			ptor.actions().mouseMove({x: 5, y: 5}).perform();
			ptor.actions().click().perform();

			ptor.sleep(1000);

			ptor.actions().mouseMove(ontop).perform();
			ptor.actions().mouseMove(ontop,{x: q2_x, y: q2_y}).perform();
			ptor.actions().doubleClick().perform();
			ptor.actions().click().perform();
			element.all(by.model("data.explanation")).then(function(ex){
				ex[0].sendKeys("explanation 2");
			})

			ptor.actions().mouseMove(ontop).perform();
			ptor.actions().mouseMove({x: 5, y: 5}).perform();
			ptor.actions().click().perform();

			ptor.sleep(1000);

			ptor.actions().mouseMove(ontop).perform();
			ptor.actions().mouseMove(ontop,{x: q3_x, y: q3_y}).perform();
			ptor.actions().doubleClick().perform();
			ptor.actions().click().perform();
			ptor.sleep(1000)
			// element(by.className("popover-content")).element(by.className('must_save_check')).click()
			locator.by_classname(ptor, 'must_save_check').click();
			element.all(by.model("data.explanation")).then(function(ex){
				ex[0].sendKeys("explanation 3");
			})

			ptor.sleep(1000);
			o_c.scroll(ptor, 1000);
			element(by.buttonText('Done')).click()
			// .then(function(btn){
			// 	btn.click().then(function(){
			// 		o_c.feedback(ptor, 'Quiz was successfully saved');
			// 	})
			// })
		})
	})
}

exports.make_mcq_survey_questions=function(ptor, q1_x, q1_y, q2_x, q2_y, q3_x, q3_y){
	locator.by_id(ptor,'ontop').then(function(ontop){
		ptor.actions().mouseMove(ontop).perform();
		ptor.actions().mouseMove(ontop, {x: q1_x, y: q1_y}).perform();
		ptor.actions().doubleClick().perform();
		ptor.actions().click().perform();

		ptor.actions().mouseMove(ontop).perform();
		ptor.actions().mouseMove({x: 5, y: 5}).perform();
		ptor.actions().click().perform();

		ptor.actions().mouseMove(ontop).perform();
		ptor.actions().mouseMove(ontop, {x: q2_x, y: q2_y}).perform();
		ptor.actions().doubleClick().perform();

		ptor.actions().mouseMove(ontop).perform();
		ptor.actions().mouseMove({x: 5, y: 5}).perform();
		ptor.actions().click().perform();

		ptor.actions().mouseMove(ontop).perform();
		ptor.actions().mouseMove(ontop, {x: q3_x, y: q3_y}).perform();
		ptor.actions().doubleClick().perform();
		ptor.actions().click().perform();

		ptor.sleep(2000);
		o_c.scroll(ptor, 1000);
		element(by.buttonText('Done')).click()
		// .then(function(btn){
		// 	btn.click().then(function(){
		// 		o_c.feedback(ptor, 'Quiz was successfully saved');
		// 	})
		// })
	})
}

exports.make_ocq_text_questions=function(ptor){
	locator.by_id(ptor,'ontop').then(function(ontop){
		ontop.findElement(protractor.By.partialLinkText('Add Answer')).click();
		ontop.findElement(protractor.By.partialLinkText('Add Answer')).click();

		ontop.findElements(protractor.By.name('answer')).then(function(answer){
			answer[0].sendKeys("answer 1");
			answer[1].sendKeys("answer 2");
			answer[2].sendKeys("answer 3");
		})
		ontop.findElements(protractor.By.id('radio_correct')).then(function(check){
			check[1].click();
		})

		element.all(by.model("answer.explanation")).then(function(ex){
			ex[0].sendKeys("explanation 1");
			ex[1].sendKeys("explanation 2");
			ex[2].sendKeys("explanation 3");
		})

		ptor.sleep(2000);
		o_c.scroll(ptor, 1000);
		element(by.buttonText('Done')).click()
		// .then(function(btn){
		// 	btn.click().then(function(){
		// 		o_c.feedback(ptor, 'Quiz was successfully saved');
		// 	})
		// })
	})
}

exports.make_ocq_questions=function(q1_x, q1_y, q2_x, q2_y, q3_x, q3_y){
    browser.driver.findElement(by.id('ontop')).then(function(ontop){
		browser.actions().mouseMove(ontop).perform();
		browser.actions().mouseMove(ontop,{x: q1_x, y: q1_y}).perform();
		browser.actions().doubleClick().perform();

		element(by.id('correct_checkbox')).click();
		element(by.model("data.explanation")).sendKeys("explanation 1");
		sleep(2000)
		browser.actions().click().perform();

		browser.actions().mouseMove(ontop).perform();
		browser.actions().mouseMove({x: 5, y: 5}).perform();
		browser.actions().click().perform();
		sleep(1000);

		browser.actions().mouseMove(ontop).perform();
		browser.actions().mouseMove(ontop,{x: q2_x, y: q2_y}).perform();
		browser.actions().doubleClick().perform();
		sleep(1000)
	  
		element(by.model("data.explanation")).sendKeys("explanation 2");
		sleep(2000)
		browser.actions().click().perform();

		browser.actions().mouseMove(ontop).perform();
		browser.actions().mouseMove({x: 5, y: 5}).perform();
        browser.sleep(2000);

		browser.actions().mouseMove(ontop).perform();
		browser.actions().mouseMove(ontop, {x: q3_x, y: q3_y}).perform();
		browser.actions().doubleClick().perform();
	

		element(by.model("data.explanation")).sendKeys("explanation 3");
		sleep(2000)
		browser.actions().click().perform();

		sleep(1000)

		element(by.buttonText('Done')).click()

		sleep(20000)
	})
}

exports.make_ocq_survey_questions=function(ptor, q1_x, q1_y, q2_x, q2_y, q3_x, q3_y){
	locator.by_id(ptor,'ontop').then(function(ontop){
		ptor.actions().mouseMove(ontop).perform();
		ptor.actions().mouseMove(ontop, {x: q1_x, y: q1_y}).perform();
		ptor.actions().doubleClick().perform();
		ptor.actions().click().perform();

		ptor.actions().mouseMove(ontop).perform();
		ptor.actions().mouseMove({x: 5, y: 5}).perform();
		ptor.actions().click().perform();

		ptor.actions().mouseMove(ontop).perform();
		ptor.actions().mouseMove(ontop, {x: q2_x, y: q2_y}).perform();
		ptor.actions().doubleClick().perform();

		ptor.actions().mouseMove(ontop).perform();
		ptor.actions().mouseMove({x: 5, y: 5}).perform();
		ptor.actions().click().perform();

		ptor.actions().mouseMove(ontop).perform();
		ptor.actions().mouseMove(ontop, {x: q3_x, y: q3_y}).perform();
		ptor.actions().doubleClick().perform();
		ptor.actions().click().perform();

		ptor.sleep(2000);
		o_c.scroll(ptor, 1000);
		element(by.buttonText('Done')).click()
		// .then(function(btn){
		// 	btn.click().then(function(){
		// 		o_c.feedback(ptor, 'Quiz was successfully saved');
		// 	})
		// })
	})
}


exports.make_drag_questions=function(ptor, q1_x, q1_y, q2_x, q2_y, q3_x, q3_y){
	locator.by_id(ptor,'ontop').then(function(ontop){
		ptor.actions().mouseMove(ontop).perform();
		ptor.actions().mouseMove(ontop, {x: q1_x, y: q1_y}).perform();
		ptor.actions().doubleClick().perform();

		ptor.actions().mouseMove(ontop).perform();
		ptor.actions().mouseMove(ontop, {x: q2_x, y: q2_y}).perform();
		ptor.actions().doubleClick().perform();

		ptor.actions().mouseMove(ontop).perform();
		ptor.actions().mouseMove(ontop, {x: q3_x, y: q3_y}).perform();
		ptor.actions().doubleClick().perform();

		ptor.sleep(2000);
		o_c.scroll(ptor, 1000);
		element(by.buttonText('Done')).click()
		// .then(function(btn){
		// 	btn.click().then(function(){
		// 		o_c.feedback(ptor, 'Quiz was successfully saved');
		// 	})
		// })
	})
}

exports.make_drag_text_questions=function(ptor){
	locator.by_id(ptor,'ontop').then(function(ontop){
		ontop.findElement(protractor.By.partialLinkText('Add Answer')).click();
		ontop.findElement(protractor.By.partialLinkText('Add Answer')).click();

		ontop.findElements(protractor.By.name('answer')).then(function(answer){
			answer[0].sendKeys("answer 1");
			answer[1].sendKeys("answer 2");
			answer[2].sendKeys("answer 3");
		})
		ptor.sleep(2000);
		o_c.scroll(ptor, 1000);
		element(by.buttonText('Done')).click()
		// .then(function(btn){
		// 	btn.click().then(function(){
		// 		o_c.feedback(ptor, 'Quiz was successfully saved');
		// 	})
		// })
	})
}

exports.make_free_text_questions=function(ptor){
		ptor.sleep(2000);
		o_c.scroll(ptor, 1000);
		element(by.buttonText('Done')).click()
		// .then(function(btn){
		// 	btn.click().then(function(){
		// 		o_c.feedback(ptor, 'Quiz was successfully saved');
		// 	})
		// })
}

exports.make_match_text_questions=function(ptor, text){
		locator.by_id(ptor,'ontop').findElement(protractor.By.tagName('select')).then(function(ontop){
            ontop.click().then(function(){
                ptor.sleep(2000);
                locator.by_id(ptor,'ontop').findElements(protractor.By.tagName('option')).then(function(options){
                    options[1].click().then(function(){
                        ptor.sleep(2000);
                        locator.by_id(ptor,'ontop').findElements(protractor.By.tagName('input')).then(function(ins){
                            ins[1].sendKeys(text);
                        })
                    })
                })
            })
        })
		ptor.sleep(2000);
		o_c.scroll(ptor, 1000);
		element(by.buttonText('Done')).click()
		// .then(function(btn){
		// 	btn.click().then(function(){
		// 		o_c.feedback(ptor, 'Quiz was successfully saved');
		// 	})
		// })
}




// //====================================================
// //            		share module
// //====================================================
exports.share_module=function(ptor, mo_no, share_with){
	o_c.open_content(ptor)
	element(by.id('share_copy')).click()
	o_c.hide_dropmenu(ptor)
	var items=element(by.className('shared-tree')).all(by.tagName('a'))
	var checkboxes = element(by.className('shared-tree')).all(by.tagName('input'))
	expect(items.count()).toEqual(mo_no)
	expect(checkboxes.count()).toEqual(mo_no)
	checkboxes.each(function(checkbox){
		expect(checkbox.getAttribute('checked')).toBe('true')
	})

	element(by.model('$parent.selected_teacher')).sendKeys(share_with)
	element(by.buttonText('Share')).click()
	// .then(function(){
	// 	o_c.feedback(ptor, 'Data was successfully shared with')
	// })

}

exports.share_item=function(ptor, item_no, share_with){
	o_c.open_content(ptor)
	element(by.id('share_copy')).click()
	o_c.hide_dropmenu(ptor)
	var items=element(by.className('shared-tree')).all(by.tagName('a'))
	var checkboxes = element(by.className('shared-tree')).all(by.tagName('input'))
	expect(checkboxes.get(0).getAttribute('checked')).toBe(null)
	expect(checkboxes.get(item_no).getAttribute('checked')).toBe('true')
	element(by.model('$parent.selected_teacher')).sendKeys(share_with)
	element(by.buttonText('Share')).click()
	// .then(function(){
	// 	o_c.feedback(ptor, 'Data was successfully shared with')
	// })
}

exports.check_module_number = function(ptor, no_of_mo){
  locator.by_repeater(ptor, 'module in modules').then(function(mods){
    expect(mods.length).toEqual(no_of_mo);
  })
}

exports.check_item_number = function(ptor, module_num, total_item_no){
  element(by.repeater('module in modules').row(module_num-1)).all(by.repeater('item in module.items')).then(function(items){
    expect(items.length).toEqual(total_item_no)
  })
}

//====================================================
//               Announcements
//====================================================

exports.create_new_announcement=function(ptor, ann_txt){
	element(by.id('new_announcement')).click()
	element(by.className('ta-editor')).sendKeys(ann_txt)
	element(by.id('save_button')).click()
	// .then(function(){
	// 	o_c.feedback(ptor,'Announcement was successfully created.');
	// })
}

exports.check_number_of_announcments=function(ptor, no_of_ann){
  locator.by_repeater(ptor, 'announcement in announcements').then(function(announcments) {
      expect(announcments.length).toEqual(no_of_ann);
  });
}


exports.check_announcements_data=function(ptor, no_of_ann){
	locator.s_by_binding(ptor, 'a.announcement').then(function(announcments) {
    	announcments.reverse();
    	announcments.forEach(function(announcment, i) {
      		expect(announcment.getText()).toEqual('announcement ' + (i + 1));
    	});
  	});
}

exports.delete_announcement=function(ann_no){
	ann = element(by.repeater('announcement in announcements').row(ann_no-1))
	ann.element(by.className('delete')).click()
	ann.element(by.className('fi-check')).click()
}

exports.check_announcment_with_date=function(ptor, ann_no, ann_date){
    locator.s_by_classname(ptor, 'well-lg').then(function(date){
      date.reverse();
      expect(date[ann_no-1].getText()).toContain(ann_date);
    });
}

//====================================================
//               Course Information
//====================================================

exports.change_course_info=function(ptor, course_description, prerequisites, short_name, course_name, discussion_link, course_duration){
    locator.by_id(ptor, 'desc').then(function(desc){
		desc.click();
        locator.by_classname(ptor, 'editable-has-buttons').then(function(txt_area){
			txt_area.clear();
			txt_area.sendKeys(course_description);
		})
        locator.by_classname(ptor, 'check').then(function(submit_btn){
			submit_btn.click()
			// .then(function(){
   //              feedback(ptor,'Course was successfully updated');
   //          });
		})
	})

    locator.by_id(ptor, 'preq').then(function(prereq){
		prereq.click();
        locator.by_classname(ptor, 'editable-has-buttons').then(function(txt_area){
			txt_area.clear();
			txt_area.sendKeys(prerequisites);
		})
        locator.by_classname(ptor, 'check').then(function(submit_btn){
			submit_btn.click()
			// .then(function(){
   //              feedback(ptor,'Course was successfully updated');
   //          });
		})
	})

    locator.by_id(ptor, 'short_name').then(function(shrt_nm){
		shrt_nm.click();
        locator.by_classname(ptor, 'editable-has-buttons').then(function(txt_area){
			txt_area.clear();
			txt_area.sendKeys(short_name);
		})
        locator.by_classname(ptor, 'check').then(function(submit_btn){
			submit_btn.click()
			// .then(function(){
   //              feedback(ptor,'Course was successfully updated');
   //          });
		})
	})

    locator.by_id(ptor, 'course_name').then(function(crs_nm){
		crs_nm.click();
        locator.by_classname(ptor, 'editable-has-buttons').then(function(txt_area){
			txt_area.clear();
			txt_area.sendKeys(course_name);
		})
        locator.by_classname(ptor, 'check').then(function(submit_btn){
			submit_btn.click()
			// .then(function(){
   //              feedback(ptor,'Course was successfully updated');
   //          });
		})
	})

 //    locator.by_xpath(ptor, '//*[@id="main"]/div/div/div/ui-view/div[1]/span/ul[2]/details-link/a').then(function(disc_lnk){
	// 	disc_lnk.click();
 //        locator.by_classname(ptor, 'editable-has-buttons').then(function(txt_area){
	// 		txt_area.clear();
	// 		txt_area.sendKeys(discussion_link);
	// 	})
 //        locator.by_classname(ptor, 'check').then(function(submit_btn){
	// 		submit_btn.click().then(function(){
 //                feedback(ptor,'Course was successfully updated');
 //            });
	// 	})
	// })

    locator.by_id(ptor, 'duration').then(function(crs_dur){
		crs_dur.click();
        locator.by_classname(ptor, 'editable-has-buttons').then(function(txt_area){
			txt_area.clear();
			txt_area.sendKeys(course_duration);
		})
        locator.by_classname(ptor, 'check').then(function(submit_btn){
			submit_btn.click()
			// .then(function(){
   //              feedback(ptor,'Course was successfully updated');
   //          });
		})
	})
	ptor.sleep(3000);
}
