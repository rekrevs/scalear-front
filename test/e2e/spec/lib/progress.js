var locator = require('./locators');
var o_c = require('./openers_and_clickers');
var youtube = require('./youtube');
var teacher = require('./teacher_module');
var student = require('./student_module');
var ptor = protractor.getInstance();
var params = ptor.params


exports.selectTabInMainProgress = function(which_tab){
	locator.by_classname(ptor, 'nav-tabs').then(function(tabs_container){
		tabs_container.findElements(protractor.By.tagName('li')).then(function(tabs){
			tabs[which_tab-1].click();
		})
	})
}
exports.verifyModuleProgressTable = function(students, modules, checkmarks){
	locator.by_xpath(ptor, '//*[@id="details"]/ui-view/div/div/div[1]/div/progress_matrix/div[2]/table').then(function(table){
		table.findElements(protractor.By.tagName('tr')).then(function(table_rows){
			table_rows[0].findElements(protractor.By.repeater('name in columnNames')).then(function(module_names){
				expect(modules.length).toBe(module_names.length)
				module_names.forEach(function(name, i){
					expect(name.getText()).toBe(modules[i])
				})
			})
			students.forEach(function(student, i){
				table_rows[i+1].findElements(protractor.By.tagName('td')).then(function(fields){
					expect(fields[0].getText()).toBe(student)
					checkmarks[student].forEach(function(checkmark, j){
						fields[j+1].findElement(protractor.By.tagName('img')).then(function(status){
							status.getAttribute('src').then(function(src){
								expect(src.toLowerCase()).toContain(checkmarks[student][j])
							})
						})
					})
				})
			})	
		})
	})
}

exports.overrideStatus = function(student_no, module_no, desired_status){
	locator.by_xpath(ptor, '//*[@id="details"]/ui-view/div/div/div[1]/div/progress_matrix/div[2]/table').then(function(table){
		table.findElements(protractor.By.tagName('tr')).then(function(students){
			students[student_no].findElements(protractor.By.tagName('td')).then(function(modules){
				modules[module_no].findElement(protractor.By.tagName('img')).then(function(status){
					status.click().then(function(){
						locator.by_classname(ptor, 'popover').then(function(popover){
							popover.findElements(protractor.By.tagName('input')).then(function(choices){
								choices[desired_status-1].click().then(function(){
									o_c.feedback(ptor, 'successfully changed')
								})
							})
						})
					})
				})
			})
		})
	})
}


exports.checkStatusImage = function(student_no, module_no, should_be){
	locator.by_xpath(ptor, '//*[@id="details"]/ui-view/div/div/div[1]/div/progress_matrix/div[2]/table').then(function(table){
		table.findElements(protractor.By.tagName('tr')).then(function(students){
			students[student_no].findElements(protractor.By.tagName('td')).then(function(modules){
				modules[module_no].findElement(protractor.By.tagName('img')).then(function(status){
					status.getAttribute('src').then(function(src){
						expect(src.toLowerCase()).toContain(should_be)
					})
				})
			})
		})
	})
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
					total = item.confused+item.really_confused
				else if(filter == 'charts')
					total = item.questions
				else if(filter == 'discussion')
					total = item.discussion
				else
					total = item.questions+item.discussion +item.confused+item.really_confused
				
				expect(sub_items.length).toBe(total)
			})
			items[i].findElement(protractor.By.className('title')).then(function(title){
				expect(title.getText()).toContain(item.name)
				title.findElement(protractor.By.tagName('span')).then(function(duration_questions){
					if(item.duration){
						expect(duration_questions.getText()).toContain(item.duration)
					}
					expect(duration_questions.getText()).toContain(item.questions+' Questions')
				})
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
										inners[2].findElement(protractor.By.tagName('g')).then(function(inner_rec){
											inner_rec.click()
										})
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
	locator.by_repeater(ptor, 'module_item in module.items').then(function(items){
		items[item_index].findElements(protractor.By.className('blue')).then(function(titles){
			var confused = module_items[item_index].confused[title_index]
			expect(titles[title_index].$('.inner_title').getText()).toEqual('['+confused.time+'] '+confused.title+':')
			expect(titles[title_index].$('.inner_value').getText()).toEqual(confused.count.toString())
		})
	})
}

exports.checkInvideoQuizTitle=function(item_index,title_index, module_items, percentage){
	locator.by_repeater(ptor, 'module_item in module.items').then(function(items){
		items[item_index].findElements(protractor.By.className('green')).then(function(titles){
			var question = module_items[item_index].questions[title_index]
			expect(titles[title_index].$('.inner_title').getText()).toEqual('['+question.time+'] Quiz: '+question.title+' ('+question.type+') - '+percentage+'% of students voted for review')
		})
	})
}

exports.checkDiscussionTitle=function(item_index,title_index, module_items){
	locator.by_repeater(ptor, 'module_item in module.items').then(function(items){
		items[item_index].findElements(protractor.By.className('coral')).then(function(titles){
			var discussion = module_items[item_index].discussion[title_index]
			expect(titles[title_index].findElement(protractor.By.className('inner_title'))).toEqual('['+discussion.time+'] Discussion:')
		})
	})
}

exports.checkDiscussionContent=function(item_index,index, module_items){
	locator.by_repeater(ptor, 'module_item in module.items').then(function(items){
		items[item_index].findElements(protractor.By.className('coral')).then(function(content){
			var discussion = module_items[item_index].discussion[index]
			expect(content[index].findElement(protractor.By.binding('discussion.post.screen_name')).getText()).toEqual(discussion.screen_name+':')
			expect(content[index].findElement(protractor.By.binding('discussion.post.content')).getText()).toEqual(discussion.title)
			expect(content[index].findElement(protractor.By.binding('discussion.post.flags_count')).getText()).toEqual(discussion.flags.toString())
			expect(content[index].findElement(protractor.By.binding('discussion.post.votes_count')).getText()).toEqual(discussion.likes.toString())
			if(discussion.type == 'private'){
				o_c.scroll(ptor,50)
				expect(content[index].findElement(protractor.By.binding('discussion.post.screen_name')).findElement(protractor.By.className('public_img')).isDisplayed()).toBe(false)
				expect(content[index].findElement(protractor.By.binding('discussion.post.screen_name')).findElement(protractor.By.className('private_img')).isDisplayed()).toBe(true)
			}
			else{
				o_c.scroll(ptor,50)
				expect(content[index].findElement(protractor.By.binding('discussion.post.screen_name')).findElement(protractor.By.className('public_img')).isDisplayed()).toBe(true)
				expect(content[index].findElement(protractor.By.binding('discussion.post.screen_name')).findElement(protractor.By.className('private_img')).isDisplayed()).toBe(false)
			}
		})
	})
}

exports.addReplyToDiscussion=function(item_index, index, msg){
	locator.by_repeater(ptor, 'module_item in module.items').then(function(items){
		items[item_index].findElements(protractor.By.className('coral')).then(function(discussion){
			var reply_button = discussion[index].findElement(protractor.By.className('btn-success'))
			var text_area = discussion[index].findElement(protractor.By.model('discussion.post.temp_response'))
			var cancel_button= discussion[index].findElement(protractor.By.className('btn-danger'))
			reply_button.click().then(function(){
				expect(reply_button.isDisplayed()).toBe(false)
				expect(text_area.isDisplayed()).toBe(true)
				expect(cancel_button.isDisplayed()).toBe(true)
			})
			text_area.sendKeys(msg)
			discussion[index].findElement(protractor.By.className('send')).click().then(function(){
				expect(reply_button.isDisplayed()).toBe(true)
				expect(text_area.isDisplayed()).toBe(false)
				expect(cancel_button.isDisplayed()).toBe(false)
			})
		})
	})
}

exports.checkDiscussionComment=function(item_index, discussion_index, comment_index,content){
	locator.by_repeater(ptor, 'module_item in module.items').then(function(items){
		items[item_index].findElements(protractor.By.className('coral')).then(function(discussion){
			var comment= discussion[discussion_index].findElement(protractor.By.repeater('comment in discussion.post.comments').row(comment_index))
			expect(comment.findElement(protractor.By.binding('comment.comment.screen_name')).getText()).toEqual(content.screen_name+': ')
			expect(comment.findElement(protractor.By.binding('comment.comment.content')).getText()).toEqual(content.title)
			expect(comment.findElement(protractor.By.binding('comment.comment.flags_count')).getText()).toEqual(content.flags.toString())
			expect(comment.findElement(protractor.By.binding('comment.comment.votes_count')).getText()).toEqual(content.likes.toString())
		})
	})
}

exports.deleteDiscussionComment=function(item_index, discussion_index){
	locator.by_repeater(ptor, 'module_item in module.items').then(function(items){
		items[item_index].findElements(protractor.By.className('coral')).then(function(discussion){
			discussion[discussion_index].findElement(protractor.By.className('delete')).click().then(function(){
				discussion[discussion_index].findElement(protractor.By.className('icon-ok')).click()
			})
			
		})
	})
}

exports.showDiscussionInclass=function(item_index, index){
	locator.by_repeater(ptor, 'module_item in module.items').then(function(items){
		items[item_index].findElements(protractor.By.className('coral')).then(function(discussion){
			var checkbox = discussion[index].findElement(protractor.By.tagName('input'))
			expect(checkbox.getAttribute('checked')).toBe(null)
			checkbox.click(function(){
				expect(checkbox.getAttribute('checked')).toBe("true")
			})
		})
	})
}

exports.hideDiscussionInclass=function(item_index, index){
	locator.by_repeater(ptor, 'module_item in module.items').then(function(items){
		items[item_index].findElements(protractor.By.className('coral')).then(function(discussion){
			var checkbox = discussion[index].findElement(protractor.By.tagName('input'))
			expect(checkbox.getAttribute('checked')).toBe("true")
			checkbox.click(function(){
				expect(checkbox.getAttribute('checked')).toBe(null)
			})
		})
	})
}

exports.checkTimeEstimate=function(value){
	expect(element(by.binding('inclass_estimate')).getText()).toEqual(value+' minutes')
}

exports.checkQuizFreeTextTitle=function(item_index,title_index, module_items){
	locator.by_repeater(ptor, 'module_item in module.items').then(function(items){
		items[item_index].findElements(protractor.By.className('ul_item')).then(function(titles){
			var free_text = module_items[item_index].questions[title_index]
			expect(titles[title_index].findElement(protractor.By.className('inner_title')).getText()).toEqual('Free Text Question: '+free_text.title)
		})
	})
}

