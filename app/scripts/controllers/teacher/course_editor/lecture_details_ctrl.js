'use strict';

angular.module('scalearAngularApp')
  .controller('lectureDetailsCtrl', ['$stateParams', '$scope', '$state', '$log', '$rootScope', '$modal', '$filter', 'ItemsModel', 'DetailsNavigator', 'CourseEditor', 'LectureModel','VideoQuizModel', 'MarkerModel', 'ScalearUtils','VimeoModel','VideoInformation','Lecture','ErrorHandler',function($stateParams, $scope, $state, $log, $rootScope, $modal, $filter, ItemsModel, DetailsNavigator, CourseEditor, LectureModel, VideoQuizModel, MarkerModel, ScalearUtils, VimeoModel, VideoInformation, Lecture, ErrorHandler) {

    $scope.lecture = ItemsModel.getLecture($stateParams.lecture_id)
    $scope.url_old  = $scope.lecture.url
    $scope.start_time_old = $scope.lecture.start_time
    $scope.end_time_old = $scope.lecture.end_time

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

    $scope.droppedFile = {}
    $scope.droppedFile.files = ""

    $scope.showUploadModal = function () {
      $scope.openModal = $modal.open({
        windowClass: 'upload-progress-modal-window',
        scope: $scope,
        backdrop: 'static',
        templateUrl:'/views/teacher/course_editor/video_upload_modal.html',
        controller: 'UploadModalCtrl'
      })
    }
   
    $scope.updateLectureUrl = function () {
      $scope.lecture.updateUrl()
        .then(function (should_trim) {
          should_trim && checkToTrim($scope.url_old,$scope.lecture)
          $scope.url_old = $scope.lecture.url
        })
       
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

    $scope.exportVideo = function () {
      // ErrorHandler.showMessage("video export to feedbackFruit started", 'errorMessage', 4000, 'success');
      // angular.element('#export_button_2_fbf')[0].disabled = true
      // var tooltip = angular.element('.tooltip')[0]
      // if (tooltip){
      //   tooltip.remove()
      // }
      console.log($rootScope)
      Lecture.exportLectureToFeedbackFruit({
        course_id: $scope.lecture.course_id,
        lecture_id: $scope.lecture.id
      },{}
      ,function(response){
        angular.element('#export_button_2_fbf')[0].disabled = false
        if (response.notice){
          ErrorHandler.showMessage("video export to feedbackFruit accomplished", 'errorMessage', 4000, 'success');
        } else {
          ErrorHandler.showMessage("video export failed", 'errorMessage', 4000, 'error');
        }
      })
      checkToExport()
    };
    function checkToExport() {
      $modal.open({
        templateUrl: '/views/teacher/course_editor/export_modal.html',
        controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
          $scope.confirmExport = function(){
            $modalInstance.close();
          }
        }]
      });
    }
    function checkToTrim(url,lecture) {
      $modal.open({
        templateUrl: '/views/teacher/course_editor/trim_modal.html',
        controller: ['$scope', '$rootScope', '$modalInstance', function ($scope, $rootScope, $modalInstance) {
          console.log('url:', url)
          $scope.hideKeepTrimBtn = url == 'none' ? true : false
          $scope.trim = function () {
            var isVimeo = VideoInformation.isVimeo(lecture.url)
            if (isVimeo) {
              VideoInformation.waitForDurationSetup().then(function (duration) {
                lecture.duration = duration
                lecture.start_time = 0
                lecture.end_time = lecture.duration
                console.log(duration)
                lecture.update().then(function () {
                  $rootScope.$broadcast("update_module_time", lecture.group_id)
                  $rootScope.$broadcast("start_trim_video")
                })
              })
            } else {
              $rootScope.$broadcast("start_trim_video")
            }
            $modalInstance.close();
          }
          $scope.cancel = function () {
            VideoInformation.waitForDurationSetup().then(function (duration) {
              lecture.duration = duration
              lecture.start_time = 0
              lecture.end_time = lecture.duration
              lecture.update().then(function () {
                $rootScope.$broadcast("update_module_time", lecture.group_id)
              });
             
            })
            $modalInstance.dismiss('cancel');
          }
          $scope.keepPreviousTrim = function(){
            $modalInstance.close();
          }
        }]
      });
    }


  }]);
