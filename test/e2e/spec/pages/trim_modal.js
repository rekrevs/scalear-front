var TrimModal = function () {};

TrimModal.prototype = Object.create({}, {
    cancel_trim_button:{get:function(){return element(by.id('cancel-btn'))}},
    cancel_trim:{value:function(){this.cancel_trim_button.click()}}
})
module.exports = TrimModal;