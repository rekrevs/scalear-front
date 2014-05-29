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

exports.verifyModuleTitlesOnTimeline = function(modules_items, count){
	locator.by_repeater(ptor, 'module_item in module.items').then(function(items){
		expect(items.length).toBe(count)
		modules_items.forEach(function(item, i){
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











