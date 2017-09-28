var ShareModal = function () {};

ShareModal.prototype = Object.create({}, {
	shared_tree:{get:function(){return element(by.className('shared-tree'))}},
	items:{get:function(){return this.shared_tree.all(by.tagName('a'))}},
	checkboxes:{get:function(){return this.shared_tree.all(by.tagName('input'))}},
	email_field:{get:function(){return element(by.model('selected_teacher.email'))}},
	share_button:{get:function(){return element(by.buttonText('Share'))}},
	type_teacher_email:{value:function(email){this.email_field.sendKeys(email)}},
	share:{value:function(){this.share_button.click()}},
	checked:{value:function(num){return this.checkboxes.get(num-1).getAttribute('checked')}},
	checkbox:{value:function(num){return this.checkboxes.get(num-1)}},
})
module.exports = ShareModal;