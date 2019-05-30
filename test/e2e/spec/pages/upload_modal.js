var UploadModal = function () {};

UploadModal.prototype = Object.create({}, {
    have_permission_button:{get:function(){return element(by.id('start_upload'))}},
    have_permission:{value:function(){this.have_permission_button.click()}}
})
module.exports = UploadModal;