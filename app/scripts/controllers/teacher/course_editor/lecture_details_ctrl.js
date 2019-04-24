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

    $scope.getVimeoUploadAccessToken = function () {
      return $scope.lecture.getVimeoAccessToken()
    }
    $scope.vimeoVideo = {}
    $scope.vimeoVideo.id = 0

    $scope.droppedFile = {}
    $scope.droppedFile.files = ""
    $scope.showProgressModal = function () {
      $scope.openModal = $modal.open({
        windowClass: 'upload-progress-modal-window',
        scope: $scope,
        backdrop: 'static',
        template: "<div ng-show='consenting'><H1>Permission to Upload Videos</H1>" +
          "<div class='muted with-margin-bottom'><p>By uploading this video you confirm that you have permission to use this video on ScalableLearning and that this video will only be used for teaching.<br>Videos uploaded to ScalableLearning will only be seen by teachers and students enrolled in the course and administrators <br>ScalableLearning reserves the right to remove inappropriate content</p></div>" +
          "<button type='button' ng-click='startUploading()'  class='right button success small'>I Have Permission</button>" +
          "<button type='button' ng-click='cancelUploading()'  class='right button small with-margin-right'>Cancel Upload</button></div>" +
          "<div ng-show='uploading'>" +
          "<H1 >Uploading</H1>" +
          "<span class='muted with-margin-bottom'>Please wait...</span>" +
          "<div id='upload_progress_container'><p id='upload_progress_bar'></p></div>" +
          "</br><button class='right button small' ng-click='quitUploading()'>Cancel</button>" +
          "</div>",
        controller: ['$scope', '$modalInstance', '$rootScope', function ($scope, $modalInstance) {
          $scope.consenting = true
          $scope.uploading = false
          $scope.cancelUpload = false
          $scope.$watch('transcoding', function () {
            if ($scope.consenting == false && $scope.uploading === false && $scope.transcoding === false && $modalInstance) {
              $modalInstance.close()
            }
          })
          $scope.startUploading = function () {
            $scope.consenting = false
            $scope.uploading = true
            $scope.getVimeoUploadAccessToken()
              .then(function (accessToken) {
                var uploader = new VimeoUpload({
                  file: $scope.$parent.droppedFile.files[0],
                  name: $scope.droppedFile.files[0].name,
                  token: accessToken,
                  onProgress: function (data) {
                    var uploadedPercentage = Math.ceil((data.loaded / data.total * 100)).toString()
                    angular.element('#upload_progress_bar')[0].setAttribute("style", "width:" + uploadedPercentage + "%")
                    $scope.transcoding = false
                  },
                  onComplete: function (videoId, index) {
                    $modalInstance.dismiss()

                    $rootScope.$broadcast('transcoding_begins', { 'vimeoVidId': videoId })
                    $scope.terminate = false

                    $scope.$apply()
                    var videoId = videoId.split(':')[0]
                    $scope.$on('transcoding_canceled', function (ev) {
                      $scope.terminate = true
                    })
                    var isTranscoded = function (vimeo_vid_id, callback) {
                      getTranscodData(vimeo_vid_id, callback)
                    }
                    var getTranscodData = function (callback, fn) {
                      var http = new XMLHttpRequest()
                      var ask = "https://api.vimeo.com/videos/" + videoId + "?fields=transcode.status"
                      http.open('GET', ask, true)
                      http.setRequestHeader("Authorization", "Bearer " + accessToken)//158e50263e24a8eba295b3a554a26bb6")
                      http.setRequestHeader('Content-Type', 'application/json')
                      http.onreadystatechange = function () {
                        if (http.readyState === 4) {
                          var transcode = JSON.parse(http.response)
                          fn(transcode.transcode.status)
                        }
                      }
                      if ($scope.terminate) return
                      http.send()
                    }
                    var waitingTranscodDone = function (videoId) {
                      isTranscoded(videoId, function (is_transcoded) {
                        if (is_transcoded == "complete") {
                          $rootScope.$broadcast('transcoding_ends', {})
                          $scope.transcodingProgress = 'complete'
                          $scope.lecture.url = 'https://vimeo.com/' + videoId
                          ScalearUtils.safeApply()
                          setTimeout(function () {
                            $scope.uploading = false
                            $scope.transcoding = false
                            $scope.updateLectureUrl()
                          }, 1000)
                        } else {
                          $scope.transcodingProgress = 'in progess'
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
                  if ($scope.cancelUpload) {
                    uploader.xhr.abort()
                  }
                })
              })
          }
          $scope.cancelUploading = function () {
            $modalInstance.dismiss('cancel')
          }
          $scope.quitUploading = function () {
            $scope.cancelUpload = true
            $modalInstance.dismiss('cancel')
          }
        }]
      })
    }

    $scope.updateLectureUrl = function () {
      $scope.lecture.updateUrl()
        .then(function (should_trim) {
          should_trim && checkToTrim()
        })
      $scope.lecture.updateVimeoUploadedVideos($scope.lecture.url)
    }

    $scope.showQuiz = function (quiz) {
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
