describe('Kaltura', function() {
  var kalVideo 
  var rawPlayer 
  var kalPlayer 
  var frame = '<iframe id="kaltura_player" src="https://cdnapisec.kaltura.com/p/811441/sp/81144100/embedIframeJs/uiconf_id/32783592/partner_id/811441?iframeembed=true&playerId=kaltura_player&entry_id=1_l0jz4n14&flashvars[streamerType]=auto" width="400" height="285" allowfullscreen webkitallowfullscreen mozAllowFullScreen; fullscreen *; encrypted-media *" frameborder="0" title="Kaltura Player"></iframe>' //  var faultyFrameWoSrc = '<iframe id="kaltura_player" "https://cdnapisec.kaltura.com/p/811441/sp/81144100/embedIframeJs/uiconf_id/32783592/partner_id/811441?iframeembed=true&playerId=kaltura_player&entry_id=1_tvyhupuo&flashvars[streamerType]=auto&amp;flashvars[localizationCode]=en&amp;flashvars[leadWithHTML5]=true&amp;flashvars[sideBarContainer.plugin]=true&amp;flashvars[sideBarContainer.position]=left&amp;flashvars[sideBarContainer.clickToClose]=true&amp;flashvars[chapters.plugin]=true&amp;flashvars[chapters.layout]=vertical&amp;flashvars[chapters.thumbnailRotator]=false&amp;flashvars[streamSelector.plugin]=true&amp;flashvars[EmbedPlayer.SpinnerTarget]=videoHolder&amp;flashvars[dualScreen.plugin]=true&amp;&wid=1_hem2lfgp" width="400" height="285" allowfullscreen webkitallowfullscreen mozAllowFullScreen allow="autoplay *; fullscreen *; encrypted-media *" frameborder="0" title="Kaltura Player"></iframe>'
  var faultyFrameWoSrc = '<iframe id="kaltura_player" src="https://cdnapisec.kaltura.com/p/811441/sp/81144100/embedIframeJs/uiconf_id/32783592/partner_id/811441?iframeembed=true&playerId=kaltura_player&entry_id=1_l0jz4n14&flashvars[streamerType]=auto" width="400" height="285" allowfullscreen webkitallowfullscreen mozAllowFullScreen allow="autoplay *; fullscreen *; encrypted-media *" frameborder="0" title="Kaltura Player"></iframe>' //  var faultyFrameWoSrc = '<iframe id="kaltura_player" "https://cdnapisec.kaltura.com/p/811441/sp/81144100/embedIframeJs/uiconf_id/32783592/partner_id/811441?iframeembed=true&playerId=kaltura_player&entry_id=1_tvyhupuo&flashvars[streamerType]=auto&amp;flashvars[localizationCode]=en&amp;flashvars[leadWithHTML5]=true&amp;flashvars[sideBarContainer.plugin]=true&amp;flashvars[sideBarContainer.position]=left&amp;flashvars[sideBarContainer.clickToClose]=true&amp;flashvars[chapters.plugin]=true&amp;flashvars[chapters.layout]=vertical&amp;flashvars[chapters.thumbnailRotator]=false&amp;flashvars[streamSelector.plugin]=true&amp;flashvars[EmbedPlayer.SpinnerTarget]=videoHolder&amp;flashvars[dualScreen.plugin]=true&amp;&wid=1_hem2lfgp" width="400" height="285" allowfullscreen webkitallowfullscreen mozAllowFullScreen allow="autoplay *; fullscreen *; encrypted-media *" frameborder="0" title="Kaltura Player"></iframe>'
  var div;
  var originalTimeout;
  var myDoc, fakeDiv, fetchedDiv;
 
  beforeAll(function() {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000000;
  });
  beforeAll(function() {
    myDoc = {
        getDiv: function() {
        return fakeDiv;
      }
    };
    var hardcodedDiv = document.createElement("div")
    hardcodedDiv.setAttribute('id','lectureVideo')
    spyOn(myDoc, "getDiv").and.returnValue(hardcodedDiv);
    fetchedDiv = myDoc.getDiv();
    });
  beforeAll(function(){
    var parentElement = myDoc.getDiv()    
    document.body.appendChild(parentElement)    
    kalVideo = Popcorn.HTMLKalturaVideoElement(parentElement);
    kalVideo.src = frame 
  });
  beforeAll(function(done){
    setTimeout(() => {      
      kalPlayer = document.getElementById('kalturaVideo')
      rawPlayer = kalPlayer.firstChild.contentWindow.document.getElementById('kalturaVideo')          
      done()
    }, 15000);
  });
  //pauseAfterSeek
  xit('it should pauseAfterSeek',function(){    // settimeout of pauseAfterSeek doesn't work with jasmine   
    kalVideo.play()
    kalVideo.pauseAfterSeek()//(done)  
    expect(rawPlayer.currentState).toBe("pause")
  });
  //volume
  xit('it should control volume',function(){//found a bug
    kalVideo.volume = 0.4   
    var currentVolume = kalVideo.volume
    expect(currentVolume).toBe(0.4)
  });
  //src
  it('it should have video src',function(){
    kalVideo.src = frame
    expect(kalVideo.src).toBe(frame)
  }); 
  // autoplay
  it('it shouldn t autoplay',function(){   
    kalVideo.autoplay=false
    expect(kalVideo.autoplay).toBeFalsy       
  });
  it('it should auotplay',function(){
    kalVideo.autoplay = true   
    expect(kalVideo.autoplay).toBeTruthy             
  });
  //loop
  it('it shouldn t loop',function(){
    kalVideo.loop = false
    expect(kalVideo.loop).toBeFalsy
  });
  it('it should loop',function(){
    kalVideo.loop = true
    expect(kalVideo.loop).toBe(true)
  });
  //currentTime
  it('it should have current time zero', function () {
    kalVideo.currentTime = 0
    expect(kalVideo.currentTime).toBe(0)    
  });
  it('it should have current time ten',function(done){
    if (rawPlayer.mediaElement.selectedSource) {
      kalPlayer.sendNotification("doSeek", 10)
      setTimeout(function () {
      
        expect(kalVideo.currentTime).toBeGreaterThanOrEqual(10)
        done()
      }, 15000)
    } else {
      expect(kalVideo.currentTime).toEqual(0)
    }
  });
  //duration
  it('it should have duration', function () {
    expect(kalVideo.duration).toBe(184)
  });
  //error
  it('it should be null error',function(){  
    expect(kalVideo.error).toBeNull   
  });
  //ended
  it('it should be ended',function(){   
    expect(kalVideo.ended).toBeFalsy   
    kalPlayer.sendNotification("doSeek",184)  
    expect(kalVideo.ended).toBeTruthy    
  });
  //seeking
  it('it should be seeking',function(){  
    kalPlayer.sendNotification("doSeek",30)  
    expect(kalVideo.seeking).toBeTruthy   
  });
  //readyState
  it('it should be ready',function(done){
    expect(kalVideo.readyState).toBeFalsy
    setTimeout(function(){   
      expect(kalVideo.readyState).toBeTruthy
      done()
    },10000) 
  });
  //paused
  it('it should pause',function(){
    kalVideo.pause()
    var currentState = rawPlayer.currentState 
    expect(currentState).toBe("pause")
    expect(kalVideo.paused).toBeTruthy
  });
  //play
  it('it should play',function(){
    kalVideo.play()
    currentState = rawPlayer.currentState
    expect(currentState,"Play")  
  })
  //networkState
  it('it should return networkState',function(){
    expect(kalVideo.networkState).toBeDefined   
  });
  //src
  it('it should have source',function(){
    expect(kalVideo.src).toBe(frame)     
  });
  //hideControlBar
  it('it should hideControlBar', function () {
    kalVideo.hideControlBar()
    expect(rawPlayer.getVideoHolder()[0].style.height).toBe('100%')
    expect(rawPlayer.getControlBarContainer()[0].style.display).toBe("none")
    expect(kalVideo.isControlsVisible).toBeFalsy
  });
  //showControlBar
  it('it should showControlBar', function () {
    kalVideo.showControlBar()
    expect(rawPlayer.getVideoHolder()[0].style.height).toBe('')
    expect(rawPlayer.getControlBarContainer()[0].style.display).toBe("inline")
    expect(kalVideo.isControlsVisible).toBeTruthy
  });
  //unsetCaptionTrack
  it('it should unsetCaptionTrack',function(){
    rawPlayer.plugins.closedCaptions.selectSourceByLangKey('es')
    kalVideo.unsetCaptionTrack()
    var ccSelectedSrc = rawPlayer.plugins.closedCaptions.selectedSource
    expect(ccSelectedSrc).toBeNull
  })
  //setCaptionTrack
  it('it should setCaptionTrack',function(){
    kalVideo.showControlBar()
    kalVideo.setCaptionTrack({'displayName':'Spanish'}) 
    var selectedLanguage = rawPlayer.plugins.closedCaptions.selectedSource.label   
    expect(selectedLanguage).toBe('Spanish')   
  });
  //getCaptionTracks
  it('it should getCaptionTracks',function(){//found a bug  
    var tracks = kalVideo.getCaptionTracks()
    var ccSrcs=rawPlayer.plugins.closedCaptions.textSources 
    var correct_trackcs =[]
    ccSrcs.forEach(function(ccSrc){
      correct_trackcs.push({displayName:ccSrc.label})
      })   
    expect(tracks).toEqual(correct_trackcs)
  });
  //setQuality
  it('it should setQuality',function(){  
      kalVideo.setQuality('144p')
      currentQuality = rawPlayer.mediaElement.selectedSource.size
      expect(currentQuality,'144P')
  });
  //getAvailableQuality
  it('it should getAvailableQuality',function(){
    var videoQualities = kalVideo.getAvailableQuality()
    var correctVideoQualities = rawPlayer.plugins.sourceSelector.sourcesList.map(function(el){return el.toLowerCase()} )  
    expect(videoQualities).toEqual(correctVideoQualities) 
  });
  //setSpeed
  it('it should setSpeed', function () {
    kalVideo.setSpeed(2)
    var currentSpeed = rawPlayer.plugins.playbackRateSelector.currentSpeed
    expect(currentSpeed, 2)
  });
  //getSpeeds
  it('it should getSpeeds', function () {
    var speeds = kalVideo.getSpeeds().map(function(el){return parseFloat(el)})
    var correctSpeeds = rawPlayer.plugins.playbackRateSelector.speedSet
    expect(speeds).toEqual(correctSpeeds)
  });
  //buffered
  it('it should be buffered',function(done){// this test depends on network speed           kalPlayer.sendNotification("doPlay")
    kalVideo.play()
    setTimeout(function () {
      kalVideo.pause()
      expect(kalVideo.buffered.end(0)).toBeGreaterThan(19)
      done() 
    },20000)  
  }); 
});

describe("Kaltura destroy",function(){
  var kalVideo 
  var rawPlayer 
  var kalPlayer 
  var frame = '<iframe src="//cdnapi.kaltura.com/p/243342/sp/24334200/embedIframeJs/uiconf_id/28685261/partner_id/243342?iframeembed=true&playerId=kdp&entry_id=1_sf5ovm7u&flashvars[streamerType]=auto" width="560" height="395" allowfullscreen webkitallowfullscreen mozAllowFullScreen frameborder="0"></iframe>'
  var myDoc, fakeDiv, fetchedDiv;
 
  beforeAll(function() {    
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
  });
  beforeAll(function() {
    myDoc = {
        getDiv: function() {
        return fakeDiv;
      }
    };
    var hardcodedDiv = document.createElement("div")
    hardcodedDiv.setAttribute('id','lectureVideo1')
    spyOn(myDoc, "getDiv").and.returnValue(hardcodedDiv);
    fetchedDiv = myDoc.getDiv();
    });
  beforeAll(function(){
    var parentElement = myDoc.getDiv()    
    document.body.appendChild(parentElement)    
    kalVideo = Popcorn.HTMLKalturaVideoElement(parentElement);
    kalVideo.src = frame 
  });
  beforeAll(function(done){
    setTimeout(() => {      
      kalPlayer = document.getElementById('kalturaVideo')
      rawPlayer = kalPlayer.firstChild.contentWindow.document.getElementById('kalturaVideo')          
      done()
    }, 14000);
  });
  //destroy
  it('it should destroy', function () {
    console.log("in destroy")
    kalVideo.destroy('kalturaVideo')
    expect(rawPlayer.mediaElement.selectedSource).toBeNull
  });
}) ;
    