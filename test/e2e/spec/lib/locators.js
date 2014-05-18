//======================================================
//                      element locators
//======================================================
exports.by_classname = function(ptor, classname){
	return ptor.findElement(protractor.By.className(classname))
}

exports.by_binding = function(ptor, bind){
	return ptor.findElement(protractor.By.binding(bind))
}

exports.by_id = function(ptor, idt){
	return ptor.findElement(protractor.By.id(idt))
}

exports.by_repeater = function(ptor, text){
	return ptor.findElements(protractor.By.repeater(text))
}

exports.by_xpath = function(ptor, path){
	return ptor.findElement(protractor.By.xpath(path))
}

exports.by_partial_text = function(ptor, text){
	return ptor.findElement(protractor.By.partialLinkText(text))
}

exports.by_name = function(ptor, name){
	return ptor.findElement(protractor.By.name(name))
}

exports.by_tag = function(ptor, tag){
	return ptor.findElement(protractor.By.tagName(tag))
}

//======================================================
//                  elementsss locators
//======================================================

exports.s_by_classname = function(ptor, classname){
  return ptor.findElements(protractor.By.className(classname))
}
exports.s_by_name = function(ptor, name){
  return ptor.findElements(protractor.By.name(name))
}

exports.s_by_binding = function(ptor, bind){
  return ptor.findElements(protractor.By.binding(bind))
}

exports.s_by_id = function(ptor, idt){
  return ptor.findElements(protractor.By.id(idt))
}

exports.s_by_xpath = function(ptor, path){
  return ptor.findElements(protractor.By.xpath(path))
}