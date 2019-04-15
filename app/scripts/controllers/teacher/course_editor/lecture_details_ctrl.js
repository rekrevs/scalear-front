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
    $scope.showProgressModal = function() { 
      // console.log("in show progress bar at elcture details controller")
      
      $scope.openModal = $modal.open({
        windowClass: 'upload-progress-modal-window',
        template: "<div><p>Click `I agree` to upload the video to scalable learning, the last will only be seen by teachers and students enrolled in this course"+
        "Click `Cancel` your file will not be uploaded "+
        "</p><div>"+        
        "<div><button type='button' ng-click>I agree</button></div>"+
        "<div><button type='button' ng-click=>I agree</button></div>"+
        "<div ng-show='uploading'>"+
        "<H2 >Uploading</H2>"+
        "</br><div id='upload_progress_container'><div id='upload_progress_bar'></div></div>"+
        "</br><button class='right button' ng-click='quitUploading()'>cancel</button>"+
        "</div>"+
        "<div ng-show='transcoding'><H2>Transcoding</H2><img src='/images/dots.gif' width='50'></br><button class='right button' ng-click='quitUploading()'>cancel</button></div>",      
        controller: ['$scope', '$modalInstance', '$rootScope',function ($scope, $modalInstance) {
          $scope.uploading = true
          $scope.transcoding = false

          $rootScope.$on('update_progress', function (ev, { "uploading": uploading, "transcoding": transcoding }) {
            $scope.transcoding = transcoding
            $scope.uploading = uploading
            $scope.$apply()
            // console.log("in on:", uploading, transcoding)
            if (uploading === false && transcoding === false && $modalInstance) {
              $modalInstance.close()
            }
          })

          $scope.quitUploading = function () {
            $rootScope.$broadcast('upload_canceled',{'cancel_upload':true})
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
