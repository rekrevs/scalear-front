var locator = require('./locators');
var o_c = require('./openers_and_clickers');
var youtube = require('./youtube');
var teacher = require('./teacher_module');
var student = require('./student_module');
var ptor = protractor.getInstance();
var params = ptor.params


exports.selectTabInMainProgress = function(which_tab){
	element(by.className('tabs')).all(by.tagName('dd')).get(which_tab-1).click()
	// locator.by_classname(ptor, 'nav-tabs').then(function(tabs_container){
	// 	tabs_container.findElements(protractor.By.tagName('li')).then(function(tabs){
	// 		tabs[which_tab-1].click();
	// 	})
	// })
}
exports.verifyModuleProgressTable = function(students, modules, checkmarks){
	var rows=element(by.tagName('table')).all(by.tagName('tr'))
	rows.get(0).all(by.repeater('name in columnNames')).then(function(module_names){
		expect(modules.length).toBe(module_names.length)
		module_names.forEach(function(name, i){
			expect(name.getText()).toBe(modules[i])
		})
	})
	students.forEach(function(student, i){
		var fields = rows.get(i+1).all(by.tagName('td'))
		expect(fields.get(0).getText()).toBe(student)
		checkmarks[student].forEach(function(checkmark, j){
			fields.get(j+1).element(by.tagName('img')).getAttribute('src').then(function(src){
				expect(src.toLowerCase()).toContain(checkmark)
			})
		})
	})
	// locator.by_xpath(ptor, '//*[@id="details"]/ui-view/div/div/div[1]/div/progress_matrix/div[2]/table').then(function(table){
	// 	table.findElements(protractor.By.tagName('tr')).then(function(table_rows){
	// 		table_rows[0].findElements(protractor.By.repeater('name in columnNames')).then(function(module_names){
	// 			expect(modules.length).toBe(module_names.length)
	// 			module_names.forEach(function(name, i){
	// 				expect(name.getText()).toBe(modules[i])
	// 			})
	// 		})
	// 		students.forEach(function(student, i){
	// 			table_rows[i+1].findElements(protractor.By.tagName('td')).then(function(fields){
	// 				expect(fields[0].getText()).toBe(student)
	// 				checkmarks[student].forEach(function(checkmark, j){
	// 					fields[j+1].findElement(protractor.By.tagName('img')).then(function(status){
	// 						status.getAttribute('src').then(function(src){
	// 							expect(src.toLowerCase()).toContain(checkmarks[student][j])
	// 						})
	// 					})
	// 				})
	// 			})
	// 		})	
	// 	})
	// })
}

exports.overrideStatus = function(student_no, module_no, desired_status){
	element(by.tagName('table')).all(by.tagName('tr')).get(student_no)
	.all(by.tagName('td')).get(module_no).element(by.tagName('img')).click()
	
	element(by.className('popover')).all(by.tagName('input'))
	.get(desired_status-1).click()
	// .then(function(){
	// 	o_c.feedback(ptor, 'successfully changed')
	// })

	element(by.tagName('table')).all(by.tagName('tr')).get(student_no)
	.all(by.tagName('td')).get(module_no).element(by.tagName('img')).click()
	// locator.by_xpath(ptor, '//*[@id="details"]/ui-view/div/div/div[1]/div/progress_matrix/div[2]/table').then(function(table){
	// 	table.findElements(protractor.By.tagName('tr')).then(function(students){
	// 		students[student_no].findElements(protractor.By.tagName('td')).then(function(modules){
	// 			modules[module_no].findElement(protractor.By.tagName('img')).then(function(status){
	// 				status.click().then(function(){
	// 					locator.by_classname(ptor, 'popover').then(function(popover){
	// 						popover.findElements(protractor.By.tagName('input')).then(function(choices){
	// 							choices[desired_status-1].click().then(function(){
	// 								o_c.feedback(ptor, 'successfully changed')
	// 							})
	// 						})
	// 					})
	// 				})
	// 			})
	// 		})
	// 	})
	// })
}


exports.checkStatusImage = function(student_no, module_no, should_be){
	element(by.tagName('table')).all(by.tagName('tr')).get(student_no)
	.all(by.tagName('td')).get(module_no).element(by.tagName('img'))
	.getAttribute('src').then(function(src){
		expect(src.toLowerCase()).toContain(should_be)
	})
	// locator.by_xpath(ptor, '//*[@id="details"]/ui-view/div/div/div[1]/div/progress_matrix/div[2]/table').then(function(table){
	// 	table.findElements(protractor.By.tagName('tr')).then(function(students){
	// 		students[student_no].findElements(protractor.By.tagName('td')).then(function(modules){
	// 			modules[module_no].findElement(protractor.By.tagName('img')).then(function(status){
	// 				status.getAttribute('src').then(function(src){
	// 					expect(src.toLowerCase()).toContain(should_be)
	// 				})
	// 			})
	// 		})
	// 	})
	// })
}

exports.wholeProgressBar = function(student_no, which_bar, student_name, percentage){
	locator.by_tag(ptor, 'svg').then(function(main_chart){
		main_chart.findElements(protractor.By.tagName('g')).then(function(parts){
			parts[5].findElement(protractor.By.tagName('g')).then(function(bars_container){
				bars_container.findElements(protractor.By.tagName('g')).then(function(bars_array){
					bars_array[1].findElements(protractor.By.tagName('rect')).then(function(bars){
						if(which_bar == 0){
							bars[student_no-1].click().then(function(){
								parts[parts.length-1].findElements(protractor.By.tagName('text')).then(function(values){
									expect(values[0].getText()).toContain(student_name)
									expect(values[2].getText()).toContain(percentage)
								})
								// bars_array[1].findElement(protractor.By.tagName('g')).then(function(popover){
								// 	expect(popover.getText()).toContain(student_name)
								// 	expect(popover.getText()).toContain(percentage)
								// })
							})
						}
						else if(which_bar == 1){
							bars[(bars.length/2) + student_no -1].click().then(function(){
								parts[parts.length-1].findElements(protractor.By.tagName('text')).then(function(values){
									expect(values[0].getText()).toContain(student_name)
									expect(values[2].getText()).toContain(percentage)
								})
								// bars_array[1].findElement(protractor.By.tagName('g')).then(function(popover){
								// 	expect(popover.getText()).toContain(student_name)
								// 	expect(popover.getText()).toContain(percentage)
								// })
							})	
						}
					})
				})
			})

		})
	})
}


exports.checkModuleProgressChart = function(which_bar, number_of_students){
	locator.by_classname(ptor, 'progress_chart').then(function(chart_div){
		chart_div.findElements(protractor.By.tagName('svg')).then(function(main_charts){
			main_charts[0].findElement(protractor.By.tagName('g')).then(function(bars_container){
				bars_container.findElements(protractor.By.tagName('g')).then(function(inners){
					inners[2].findElements(protractor.By.tagName('rect')).then(function(bars){
						bars[which_bar-1].click().then(function(){
							main_charts[main_charts.length-1].findElements(protractor.By.tagName('text')).then(function(values){
								values[values.length-1].getText().then(function(value){
									expect(parseInt(value)).toBe(number_of_students)
								})
							})
						})
					})
				})
			})
		})
	})
}

exports.verifyModuleTitlesAndCountOnTimeline = function(modules_items, filter){
	locator.by_repeater(ptor, 'module_item in module.items').then(function(items){
		expect(items.length).toBe(modules_items.length)
		modules_items.forEach(function(item, i){
			items[i].findElements(protractor.By.className('ul_item')).then(function(sub_items){
				var total = 0
				if(filter == 'confused')
					total = item.confused.length
				else if(filter == 'charts')
					total = item.questions.length + item.free_text.length
				else if(filter == 'discussion')
					total = item.discussion.length
				else
					total = item.questions.length+item.free_text.length+item.discussion.length+item.confused.length
				expect(sub_items.length).toBe(total)
			})
			items[i].findElement(protractor.By.className('title')).then(function(title){
				var summary = "("
				if(item.duration){
					summary+=item.duration+', '
					// expect(duration_questions.getText()).toContain(item.duration)
				}
				summary+=(item.questions.length+item.free_text.length) +' Questions)'
				var main_title = item.name+" "+ summary
				expect(title.getText()).toEqual(main_title)
				// title.findElement(protractor.By.tagName('span')).then(function(duration_questions){
					
				// 	expect(duration_questions.getText()).toContain(summary)
				// })
			})
		})
	})
}

exports.verifyModuleTitlesAndCountFiltered=function(modules_items,filter_type){
	locator.by_repeater(ptor,'(key,val) in filters').then(function(filters) {
  		filters.forEach(function(filter){	
		  	filter.evaluate('val').then(function(val){
		  		if(val == filter_type){
		  			filter.findElement(protractor.By.tagName('input')).click().then(function(){
		  				exports.verifyModuleTitlesAndCountOnTimeline(modules_items,filter_type)
		  			})
		  		}
		  	})
	  	})
	});
}

exports.checkQuizChart = function(item_index,question_index, which_bar, number_of_students){
	locator.by_repeater(ptor, 'module_item in module.items').then(function(items){
		items[item_index].findElements(protractor.By.className('progress_chart')).then(function(charts){
			charts[question_index].findElements(protractor.By.tagName('svg')).then(function(chart){
				chart[0].findElement(protractor.By.tagName('g')).then(function(bars_container){
					bars_container.findElements(protractor.By.tagName('g')).then(function(inners){
						inners[2].findElements(protractor.By.tagName('rect')).then(function(bars){
							bars[which_bar-1].click().then(function(){
								chart[chart.length-1].findElements(protractor.By.tagName('text')).then(function(values){
									values[values.length-1].getText().then(function(value){
										expect(parseInt(value)).toBe(number_of_students)
										// inners[2].findElement(protractor.By.tagName('g')).then(function(inner_rec){
										// 	// inner_rec.click()
										// })
									})
								})
							})
						})
					})
				})
			})
		})
	})
}

exports.checkConfusedTitle=function(item_index,title_index, module_items){
	var confused = module_items[item_index].confused[title_index]
	var title = element(by.repeater('module_item in module.items').row(item_index)).all(by.className('color-blue')).get(title_index)
	expect(title.element(by.className('inner_title')).getText()).toEqual('['+confused.time+'] '+confused.title+':')
	expect(title.element(by.className('inner_value')).getText()).toEqual(confused.count.toString())
	// locator.by_repeater(ptor, 'module_item in module.items').then(function(items){
	// 	items[item_index].findElements(protractor.By.className('blue')).then(function(titles){
			
	// 		expect(titles[title_index].findElement(protractor.By.className('inner_title')).getText()).toEqual('['+confused.time+'] '+confused.title+':')
	// 		expect(titles[title_index].findElement(protractor.By.className('inner_value')).getText()).toEqual(confused.count.toString())
	// 	})
	// })
}

exports.checkInvideoQuizTitle=function(item_index,title_index, module_items, percentage, count){
	var question = module_items[item_index].questions[title_index]	
	var title = element(by.repeater('module_item in module.items').row(item_index)).all(by.className('color-green')).get(title_index).element(by.className('inner_title'))
	expect(title.getText()).toEqual('['+question.time+'] Quiz: '+question.title+' ('+question.type+') - '+count+' students ('+percentage+'%) voted for review')
	// 		expect(titles[title_index].findElement(protractor.By.className('inner_title')).getText()).toEqual('['+question.time+'] Quiz: '+question.title+' ('+question.type+') - '+percentage+'% of students voted for review')
	// })
	// locator.by_repeater(ptor, 'module_item in module.items').then(function(items){
	// 	items[item_index].findElements(protractor.By.className('green')).then(function(titles){
	// 		var question = module_items[item_index].questions[title_index]
	// 		expect(titles[title_index].findElement(protractor.By.className('inner_title')).getText()).toEqual('['+question.time+'] Quiz: '+question.title+' ('+question.type+') - '+percentage+'% of students voted for review')
	// 	})
	// })
}

exports.checkInvideoSurveyTitle=function(item_index,title_index, module_items){
	var question = module_items[item_index].questions[title_index]
	var title = element(by.repeater('module_item in module.items').row(item_index)).all(by.className('color-green')).get(title_index).element(by.className('inner_title'))
	expect(title.getText()).toEqual('['+question.time+'] Survey: '+question.title+' ('+question.type+')')

	// locator.by_repeater(ptor, 'module_item in module.items').then(function(items){
	// 	items[item_index].findElements(protractor.By.className('green')).then(function(titles){
			
	// 	})
	// })
}

exports.showVideoQuizInclass=function(item_index, index){
	var checkbox = element(by.repeater('module_item in module.items').row(item_index)).all(by.className('color-green')).get(index).element(by.tagName('input'))
	expect(checkbox.getAttribute('checked')).toBe(null)
	checkbox.click()
	expect(checkbox.getAttribute('checked')).toBe("true")

	// locator.by_repeater(ptor, 'module_item in module.items').then(function(items){
	// 	items[item_index].findElements(protractor.By.className('green')).then(function(discussion){
	// 		var checkbox = discussion[index].findElement(protractor.By.tagName('input'))
	// 		expect(checkbox.getAttribute('checked')).toBe(null)
	// 		checkbox.click(function(){
	// 			expect(checkbox.getAttribute('checked')).toBe("true")
	// 		})
	// 	})
	// })
}

exports.hideVideoQuizInclass=function(item_index, index){
	var checkbox = element(by.repeater('module_item in module.items').row(item_index)).all(by.className('color-green')).get(index).element(by.tagName('input'))
	expect(checkbox.getAttribute('checked')).toBe("true")
	checkbox.click()
	expect(checkbox.getAttribute('checked')).toBe(null)

	// locator.by_repeater(ptor, 'module_item in module.items').then(function(items){
	// 	items[item_index].findElements(protractor.By.className('green')).then(function(discussion){
	// 		var checkbox = discussion[index].findElement(protractor.By.tagName('input'))
	// 		expect(checkbox.getAttribute('checked')).toBe("true")
	// 		checkbox.click(function(){
	// 			expect(checkbox.getAttribute('checked')).toBe(null)
	// 		})
	// 	})
	// })
}

exports.checkDiscussionTitle=function(item_index,title_index, module_items){
	var discussion = module_items[item_index].discussion[title_index]
	var title= element(by.repeater('module_item in module.items').row(item_index)).all(by.className('color-coral')).get(title_index).element(by.className('inner_title'))
	expect(title.getText()).toEqual('['+discussion.time+'] Discussion:')

	// locator.by_repeater(ptor, 'module_item in module.items').then(function(items){
	// 	items[item_index].findElements(protractor.By.className('coral')).then(function(titles){
			
	// 		expect(titles[title_index].findElement(protractor.By.className('inner_title')).getText()).toEqual('['+discussion.time+'] Discussion:')
	// 	})
	// })
}

exports.checkDiscussionContent=function(item_index,index, module_items){
	var discussion = module_items[item_index].discussion[index]
	var content = element(by.repeater('module_item in module.items').row(item_index)).all(by.className('color-coral')).get(index)
	expect(content.element(by.className('disc_screen_name')).getText()).toEqual(discussion.screen_name+':')
	expect(content.element(by.className('disc_content')).getText()).toEqual(discussion.title)
	expect(content.element(by.className('disc_flags_count')).getText()).toEqual(discussion.flags.toString())
	expect(content.element(by.className('disc_votes_count')).getText()).toEqual(discussion.likes.toString())

	var public_img = content.element(by.className('disc_screen_name')).element(by.className('public_img'))
	var private_img = content.element(by.className('disc_screen_name')).element(by.className('private_img'))
	if(discussion.type == 'private'){		
		expect(public_img.isDisplayed()).toBe(false)
		expect(private_img.isDisplayed()).toBe(true)
	}
	else{
		expect(public_img.isDisplayed()).toBe(true)
		expect(private_img.isDisplayed()).toBe(false)
	}
}

exports.addReplyToDiscussion=function(item_index, index, msg){
	var discussion = element(by.repeater('module_item in module.items').row(item_index)).all(by.className('color-coral')).get(index)
	var reply_button = discussion.element(by.className('success'))
	var text_area = discussion.element(by.model('discussion.post.temp_response'))
	var cancel_button= discussion.element(by.className('alert'))
	var send = discussion.element(by.className('send_comment'))
	reply_button.click()
	expect(reply_button.isDisplayed()).toBe(false)
	expect(text_area.isDisplayed()).toBe(true)
	expect(cancel_button.isDisplayed()).toBe(true)
	text_area.sendKeys(msg)
	send.click()
	expect(reply_button.isDisplayed()).toBe(true)
	expect(text_area.isDisplayed()).toBe(false)
	expect(cancel_button.isDisplayed()).toBe(false)

	// locator.by_repeater(ptor, 'module_item in module.items').then(function(items){
	// 	items[item_index].findElements(protractor.By.className('coral')).then(function(discussion){
	// 		var reply_button = discussion[index].findElement(protractor.By.className('btn-success'))
	// 		var text_area = discussion[index].findElement(protractor.By.model('discussion.post.temp_response'))
	// 		var cancel_button= discussion[index].findElement(protractor.By.className('btn-danger'))
	// 		reply_button.click().then(function(){
	// 			expect(reply_button.isDisplayed()).toBe(false)
	// 			expect(text_area.isDisplayed()).toBe(true)
	// 			expect(cancel_button.isDisplayed()).toBe(true)
	// 		})
	// 		text_area.sendKeys(msg)
	// 		discussion[index].findElement(protractor.By.className('send')).click().then(function(){
	// 			expect(reply_button.isDisplayed()).toBe(true)
	// 			expect(text_area.isDisplayed()).toBe(false)
	// 			expect(cancel_button.isDisplayed()).toBe(false)
	// 		})
	// 	})
	// })
}

exports.checkDiscussionComment=function(item_index, discussion_index, comment_index,content){
	var discussion = element(by.repeater('module_item in module.items').row(item_index)).all(by.className('color-coral')).get(discussion_index)
	var comment = discussion.element(by.repeater('comment in discussion.post.comments').row(comment_index))
	expect(comment.element(by.className('comment_screen_name')).getText()).toEqual(content.screen_name)
	expect(comment.element(by.className('comment_content')).getText()).toEqual(content.title)
	expect(comment.element(by.className('comment_flags_count')).getText()).toEqual(content.flags.toString())
	expect(comment.element(by.className('comment_votes_count')).getText()).toEqual(content.likes.toString())
}

exports.deleteDiscussionComment=function(item_index, discussion_index, comment_index){
	var discussion = element(by.repeater('module_item in module.items').row(item_index)).all(by.className('color-coral')).get(discussion_index)
	var comment = discussion.element(by.repeater('comment in discussion.post.comments').row(comment_index))
	comment.element(by.className('alert')).click()

	// var discussion = element(by.repeater('module_item in module.items').row(item_index)).all(by.className('color-coral')).get(discussion_index)
	// locator.by_repeater(ptor, 'module_item in module.items').then(function(items){
	// 	items[item_index].findElements(protractor.By.className('coral')).then(function(discussion){
	// 		discussion[discussion_index].findElement(protractor.By.className('delete')).click().then(function(){
	// 			discussion[discussion_index].findElement(protractor.By.className('icon-ok')).click()
	// 		})
			
	// 	})
	// })
}

exports.showDiscussionInclass=function(item_index, index){
	var checkbox = element(by.repeater('module_item in module.items').row(item_index)).all(by.className('color-coral')).get(index).element(by.tagName('input'))
	expect(checkbox.getAttribute('checked')).toBe(null)
	checkbox.click()
	expect(checkbox.getAttribute('checked')).toBe("true")


	// locator.by_repeater(ptor, 'module_item in module.items').then(function(items){
	// 	items[item_index].findElements(protractor.By.className('coral')).then(function(discussion){
	// 		var checkbox = discussion[index].findElement(protractor.By.tagName('input'))
	// 		expect(checkbox.getAttribute('checked')).toBe(null)
	// 		checkbox.click(function(){
	// 			expect(checkbox.getAttribute('checked')).toBe("true")
	// 		})
	// 	})
	// })
}

exports.hideDiscussionInclass=function(item_index, index){
	var checkbox = element(by.repeater('module_item in module.items').row(item_index)).all(by.className('color-coral')).get(index).element(by.tagName('input'))
	expect(checkbox.getAttribute('checked')).toBe("true")
	checkbox.click()
	expect(checkbox.getAttribute('checked')).toBe(null)
	// locator.by_repeater(ptor, 'module_item in module.items').then(function(items){
	// 	items[item_index].findElements(protractor.By.className('coral')).then(function(discussion){
	// 		var checkbox = discussion[index].findElement(protractor.By.tagName('input'))
	// 		expect(checkbox.getAttribute('checked')).toBe("true")
	// 		checkbox.click(function(){
	// 			expect(checkbox.getAttribute('checked')).toBe(null)
	// 		})
	// 	})
	// })
}

exports.checkTimeEstimate=function(value){
	expect(element(by.binding('inclass_estimate')).getText()).toEqual(value+' minutes')
}

exports.checkQuizTitle=function(item_index,title_index, module_items){
	var question = module_items[item_index].questions[title_index]
	var title= element(by.repeater('module_item in module.items').row(item_index)).all(by.className('color-blue')).get(title_index).element(by.className('inner_title'))
	expect(title.getText()).toEqual('Title: '+question.title+' ('+question.type+')')

	// locator.by_repeater(ptor, 'module_item in module.items').then(function(items){
	// 	items[item_index].findElements(protractor.By.className('blue')).then(function(titles){
			
	// 	})
	// })
}


exports.checkQuizFreeTextTitle=function(item_index,title_index, module_items){
	var free_text = module_items[item_index].free_text[title_index]
	var title= element(by.repeater('module_item in module.items').row(item_index)).all(by.className('color-coral')).get(title_index).element(by.className('inner_title'))
	expect(title.getText()).toEqual('Free Text Question: '+free_text.title)
	
	// locator.by_repeater(ptor, 'module_item in module.items').then(function(items){
	// 	items[item_index].findElements(protractor.By.className('coral')).then(function(titles){
			
	// 	})
	// })
}

exports.checkQuizFreeTextAnswers=function(item_index, index, module_items){
	var free_text = module_items[item_index].free_text[index]
	var content= element(by.repeater('module_item in module.items').row(item_index)).all(by.className('color-coral')).get(index)
	content.all(by.binding('answer.answer')).then(function(answers){
		answers.forEach(function(answer,i){
			expect(answer.getText()).toEqual(free_text.answers[i].title)
		})
	})
	

	// locator.by_repeater(ptor, 'module_item in module.items').then(function(items){
	// 	items[item_index].findElements(protractor.By.className('coral')).then(function(content){
			
	// 		content[index].findElements(protractor.By.binding('answer.answer')).then(function(answers){
	// 			answers.forEach(function(answer,i){
	// 				expect(answer.getText()).toEqual(free_text.answers[i].title)
	// 			})
	// 		})
	// 	})
	// })
}

exports.checkQuizFreeTextGrades=function(item_index, index, module_items){
	var free_text = module_items[item_index].free_text[index]		
	var content= element(by.repeater('module_item in module.items').row(item_index)).all(by.className('color-coral')).get(index)
	content.all(by.tagName('details-select')).then(function(grades){
		grades.forEach(function(grade,i){
			expect(grade.getText()).toEqual(free_text.answers[i].grade)
		})
	})

	// locator.by_repeater(ptor, 'module_item in module.items').then(function(items){
	// 	items[item_index].findElements(protractor.By.className('coral')).then(function(content){
				
	// 		content[index].findElements(protractor.By.tagName('details-select')).then(function(grades){
	// 			grades.forEach(function(grade,i){
	// 				expect(grade.getText()).toEqual(free_text.answers[i].grade)
	// 			})
	// 		})
	// 	})
	// })
}

exports.ChangeQuizFreeTextGrade=function(item_index, index, key, value){
	var content= element(by.repeater('module_item in module.items').row(item_index)).all(by.className('color-coral')).get(index)
	content.all(by.tagName('details-select')).then(function(grades){
		grades.forEach(function(grade,i){
			grade.click()
			grade.element(by.tagName('select')).all(by.tagName('option')).get(key).click()
			expect(grade.getText()).toEqual(value)
		})
	})
	// locator.by_repeater(ptor, 'module_item in module.items').then(function(items){
	// 	items[item_index].findElements(protractor.By.className('coral')).then(function(content){
	// 		content[index].findElements(protractor.By.tagName('details-select')).then(function(grades){
	// 			grades.forEach(function(grade,i){
	// 				grade.click().then(function(){
	// 					grade.findElement(protractor.By.tagName('select')).then(function(){
	// 						grade.findElements(protractor.By.tagName('option')).then(function(options){
	// 							options[key].click().then(function(){
	// 								content[index].click()
	// 								expect(grade.getText()).toEqual(value)
	// 							});
	// 						})
	// 					})
	// 				})
	// 			})
	// 		})
	// 	})
	// })
}

exports.addReplyToFreeText=function(item_index, index, msg){
	var free_text= element(by.repeater('module_item in module.items').row(item_index)).all(by.className('color-coral')).get(index)
	var reply_button = free_text.element(by.className('success'))
	var text_area = free_text.element(by.model('answer.temp_response'))
	var cancel_button= free_text.element(by.className('alert'))
	var send = free_text.element(by.className('send_feedback'))
	reply_button.click()
	expect(reply_button.isDisplayed()).toBe(false)
	expect(text_area.isDisplayed()).toBe(true)
	expect(cancel_button.isDisplayed()).toBe(true)
	text_area.sendKeys(msg)
	send.click()
	expect(reply_button.isDisplayed()).toBe(true)
	expect(text_area.isDisplayed()).toBe(false)
	expect(cancel_button.isDisplayed()).toBe(false)
	// locator.by_repeater(ptor, 'module_item in module.items').then(function(items){
	// 	items[item_index].findElements(protractor.By.className('coral')).then(function(discussion){
			
	// 		reply_button.click().then(function(){
	// 			expect(reply_button.isDisplayed()).toBe(false)
	// 			expect(text_area.isDisplayed()).toBe(true)
	// 			expect(cancel_button.isDisplayed()).toBe(true)
	// 		})
	// 		text_area.sendKeys(msg)
	// 		discussion[index].findElement(protractor.By.className('send')).click().then(function(){
	// 			expect(reply_button.isDisplayed()).toBe(true)
	// 			expect(text_area.isDisplayed()).toBe(false)
	// 			expect(cancel_button.isDisplayed()).toBe(false)
	// 		})
	// 	})
	// })
}

exports.checkReplyToFreeText=function(item_index, index, msg){
	var free_text= element(by.repeater('module_item in module.items').row(item_index)).all(by.className('color-coral')).get(index)
	expect(free_text.element(by.binding('answer.response')).getText()).toEqual(msg)
}

exports.deleteReplyToFreeText=function(item_index, index, ans_index){
	var free_text = element(by.repeater('module_item in module.items').row(item_index)).all(by.className('color-coral')).get(index)
	var answer = free_text.element(by.repeater('answer in item.data.answers').row(ans_index))
	answer.element(by.className('alert')).click()
}

exports.checkQuizChartInclass = function(bar, number_of_students, percentage){
	// element(by.className('original_chart')).element(by.tagName('svg')).element(by.tagName('g'))
	// .all(by.tagName('g')).get(1).all(by.tagName())


	locator.by_classname(ptor, 'original_chart').findElements(protractor.By.tagName('svg')).then(function(chart){
		chart[0].findElement(protractor.By.tagName('g')).then(function(bars_container){
			bars_container.findElements(protractor.By.tagName('g')).then(function(inners){
				inners[2].findElements(protractor.By.tagName('rect')).then(function(bars){
					bars[bar-1].click().then(function(){
						locator.by_classname(ptor, 'google-visualization-tooltip').getText().then(function(text){
							expect(text).toContain(number_of_students+" answers ("+percentage+"%)")
						})
					})
				})
			})
		})
	})
}
