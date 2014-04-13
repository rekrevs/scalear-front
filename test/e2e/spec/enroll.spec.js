describe('',function(){
    it('should join course', function(){
        joincourse(ptor,key);
    })    
})


//=====================================
//        join course by key
//=====================================
function joincourse(ptor, key)
{
    ptor.findElement(protractor.By.id('join_course')).then(function(link)
    {
        link.click();
    });
    ptor.findElement(protractor.By.name('key')).then(function(input)
    {
        input.sendKeys(key);
    });
    ptor.findElement(protractor.By.id('enroll_button')).then(function(button)
    {
        button.click();
    });
}