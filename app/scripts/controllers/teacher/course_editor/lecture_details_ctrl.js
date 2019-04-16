'use strict';

angular.module('scalearAngularApp')
  .controller('lectureDetailsCtrl', ['$stateParams', '$scope', '$state', '$log', '$rootScope', '$modal', '$filter', 'ItemsModel', 'DetailsNavigator', 'CourseEditor', 'LectureModel','VideoQuizModel', 'MarkerModel', 'ScalearUtils',function($stateParams, $scope, $state, $log, $rootScope, $modal, $filter, ItemsModel, DetailsNavigator, CourseEditor, LectureModel, VideoQuizModel, MarkerModel, ScalearUtils) {

    $scope.lecture = ItemsModel.getLecture($stateParams.lecture_id)

    $scope.video ={}
    if($scope.lecture.inclass){$scope.video.type = 1}
    else if($scope.lecture.distance_peer){$scope.video.type= 2}
    else{$scope.video.type = 0}

    ItemsModel.setSelectedItem($scope.lecture)
    var module = $scope.lecture.module()
    $scope.setting ={}
    $scope.setting.due_date_enabled = !CourseEditor.isDueDateDisabled($scope.lecture.due_date)
    $scope.disable_module_due_controls = CourseEditor.isDueDateDisabled(module.due_date)
    $scope.link_url = $state.href('course.module.courseware.lecture', { module_id: module.id, lecture_id: $scope.lecture.id }, { absolute: true })
    $scope.lecture_details_groups = DetailsNavigator.lecture_details_groups;
    $scope.getSelectedVideoQuiz = VideoQuizModel.getSelectedVideoQuiz
    $scope.getSelectedMarker = MarkerModel.getSelectedMarker
    VideoQuizModel.getQuizzes()
    MarkerModel.getMarkers()

    $scope.validateLecture = function(column, data) {
      var lecture = { id: $scope.lecture.id, course_id: $scope.lecture.course_id, group_id: $scope.lecture.group_id };
      lecture[column] = data;
      var temp_lecture = LectureModel.createInstance(lecture);
      if(column == 'url') {
        temp_lecture.url = $filter("formatURL")(temp_lecture.url)
        return temp_lecture.validateUrl(); // returns a promise
      } else {
        return temp_lecture.validate() // return a promise
      }
    };



    $scope.updateLecture = function() {
      $scope.lecture.update()
    }
    $scope.setVideoType = function(){
      $scope.lecture.inclass =  false
      $scope.lecture.distance_peer = false
      if($scope.video.type== 1){
        $scope.lecture.inclass = true
      }
      if($scope.video.type== 2){
        $scope.lecture.distance_peer = true
      }
      $scope.updateLecture()
    }
    $scope.updateDueDate = function() {
      var offset = 200
      var enabled = $scope.setting.due_date_enabled
      var due_date = new Date($scope.lecture.due_date)
      var week = 7
      var years = 0
      if(CourseEditor.isDueDateDisabled($scope.lecture.due_date) && enabled)
        years = -offset
      else if(!CourseEditor.isDueDateDisabled($scope.lecture.due_date) && !enabled)
        years = offset
      due_date.setFullYear(due_date.getFullYear() + years)

      var appearance_date = new Date($scope.lecture.appearance_time)
      if(due_date <= appearance_date) {
        due_date = appearance_date
        due_date.setDate(appearance_date.getDate() + week)
      }

      $scope.lecture.due_date = due_date
      $scope.setting.due_date_enabled = !CourseEditor.isDueDateDisabled($scope.lecture.due_date)
      $scope.lecture.due_date_module = !$scope.disable_module_due_controls && $scope.setting.due_date_enabled
    }

    $scope.visible = function(appearance_time) {
      return new Date(appearance_time) <= new Date()
    }
    
    $scope.getVimeoUploadAccessToken = function(){
      return $scope.lecture.getVimeoAccessToken() 
    }
    $scope.vimeoVideo={}
    $scope.vimeoVideo.id=0
    $scope.cancelTranscoding = function(){
      console.log( $scope.vimeoVideo.id)
      $scope.lecture.cancelTranscodingViemoVideo( $scope.vimeoVideo.id)  
    }
    $scope.droppedFile={}
    $scope.droppedFile.files=""
    $scope.showProgressModal = function() { 
      // console.log("in show progress bar at elcture details controller")
      console.log('file=>',$scope.droppedFile)
     
      $scope.openModal = $modal.open({
        windowClass: 'upload-progress-modal-window',
        scope:$scope,
        backdrop: 'static',
        template: "<div ng-show='consenting'><H1>Upload consent</H1>"+
        "<p>Click `Accept` to upload the video to scalable learning, which will only be seen by teachers and students enrolled in this course</p>"+
        "<p>Click `Cancel` your file will not be uploaded </p>"+               
        "<button type='button' ng-click='startUploading()'  class='right button success small'>Accept</button>"+
        "<button type='button' ng-click='cancelUploading()'  class='right button small with-margin-right'>Cancel</button></div>"+
        "<div ng-show='uploading'>"+
        "<H1 >Uploading</H1>"+
        "</br><div id='upload_progress_container'><div id='upload_progress_bar'></div></div>"+
        "</br><button class='right button small' ng-click='quitUploading()'>Cancel</button>"+
        "</div>"+
        "<div ng-show='transcoding'><span style='font-size: 2em; margin: .67em 0'>Processing</span>: {{transcodingProgress}}<img src='/images/dots.gif' width='50'></br><button class='right button small' ng-click='quitUploading()'>cancel</button></div>",      
        controller: ['$scope', '$modalInstance', '$rootScope',function ($scope, $modalInstance) {
          $scope.consenting=true
          $scope.uploading = false
          $scope.transcoding = false
          $scope.cancelUpload = false
          $scope.$watch('transcoding', function () {
          
            if ($scope.consenting==false && $scope.uploading === false && $scope.transcoding === false && $modalInstance) {
              $modalInstance.close()
            }
          })
          $scope.startUploading = function(){ console.log($scope)
            $scope.consenting=false
            $scope.uploading=true
            $scope.getVimeoUploadAccessToken()
              .then(function(accessToken){    
                var upload_canceled = false
                var uploader = new VimeoUpload({
                  file:$scope.$parent.droppedFile.files[0],
                  name:$scope.droppedFile.files[0].name,
                  token: accessToken,
                  onProgress: function (data) {        
                    var uploadedPercentage = Math.ceil((data.loaded/data.total*100)).toString()
                    angular.element('#upload_progress_bar')[0].setAttribute("style","width:"+uploadedPercentage+"%")                      
                    $scope.transcoding = false
                  },
                  onComplete: function (videoId, index) {console.log($scope)
                    $scope.transcoding=true
                    $scope.vid=videoId                
                    $scope.uploading=false
                    $scope.transcodingProgress='started'
                    $scope.$apply()
                    var isTranscoded = function(vimeo_vid_id,callback){
                      getTranscodData(vimeo_vid_id,callback)
                    }
                    var getTranscodData = function(callback,fn){
                      var http = new XMLHttpRequest()
                      var ask = "https://api.vimeo.com/videos/"+videoId+"?fields=transcode.status"
                      http.open('GET',ask,true)
                      http.setRequestHeader("Authorization","Bearer "+accessToken)//158e50263e24a8eba295b3a554a26bb6")
                      http.setRequestHeader('Content-Type', 'application/json')
                      http.onreadystatechange = function() { 
                        if (http.readyState === 4) { 
                          var transcode = JSON.parse(http.response) 
                          fn(transcode.transcode.status)
                        }
                      }
                      http.send()  
                    }       
                    var waitingTranscodDone = function (videoId) {
                      isTranscoded(videoId, function (is_transcoded) {                        
                        if (is_transcoded=="complete") {
                          $scope.transcodingProgress='complete'
                          ScalearUtils.safeApply()
                          $scope.lecture.url = 'https://vimeo.com/' + videoId.split(':')[0]                        
                          setTimeout(function(){ 
                            $scope.uploading= false
                            $scope.transcoding=false 
                            $scope.updateLectureUrl()
                          },1000)                        
                        } else {
                          $scope.transcodingProgress='in progess'
                          ScalearUtils.safeApply()
                          setTimeout(function () {
                            if ($scope.cancelUpload) return;
                            waitingTranscodDone(videoId)
                          }, 1000)
                        }
                        
                      })
                    }
                    waitingTranscodDone(videoId)
                  }
                });
                uploader.upload();         
                $scope.$watch('cancelUpload', function () { 
                  if ( $scope.cancelUpload){
                    upload_canceled = true
                    uploader.xhr.abort()
                    if($scope.transcoding){          
                      $scope.cancelTranscoding()
                    }               
                  }       
                })   
              })
          }
          $scope.cancelUploading = function(){
            $modalInstance.dismiss('cancel')
          }
          $scope.quitUploading = function () {
            // $rootScope.$broadcast('upload_canceled',{'cancel_upload':true})
            $scope.cancelUpload=true
            $modalInstance.dismiss('cancel')
          }
        }]
      })
    }
    $scope.updateLectureUrl = function() { 

      $scope.lecture.updateUrl()
        .then(function(should_trim) {
          should_trim && checkToTrim()      
         
        })

      $scope.lecture.updateVimeoUploadedVideos($scope.lecture.url)  

    }

    $scope.showQuiz = function(quiz) {
      $rootScope.$broadcast("show_online_quiz", quiz)
    }

    $scope.deleteQuiz = function(quiz) {
      $rootScope.$broadcast("delete_online_quiz", quiz)
    }

    $scope.showMarker = function(marker) {
      $rootScope.$broadcast("show_online_marker", marker)
    }

    $scope.deleteMarker = function(marker) {
      $rootScope.$broadcast("delete_online_marker", marker)
    }

    function checkToTrim() {
      $modal.open({
        templateUrl: '/views/teacher/course_editor/trim_modal.html',
        controller: ['$scope', '$rootScope', '$modalInstance', function($scope, $rootScope, $modalInstance) {
          $scope.trim = function() {
            $rootScope.$broadcast("start_trim_video")
            $modalInstance.close();
          }
          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
          }
        }]
      });
    }


  }]);
