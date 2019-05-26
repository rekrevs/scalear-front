'use strict';

angular.module('scalearAngularApp')
    .controller('UploadModalCtrl', ['$scope', '$modalInstance', '$rootScope', 'VimeoModel',function ($scope, $modalInstance, $rootScope,VimeoModel) {

        $scope.consenting = true
        $scope.uploading = false
        $scope.quitUpload = false
        $scope.$parent.transcoding = false

        $scope.$watch('transcoding', function () {
            if ($scope.consenting == false && $scope.uploading === false && $modalInstance) {
                $modalInstance.close()
            }
        })

        $scope.startUploading = function () {
            $scope.consenting = false
            $scope.uploading = true
            VimeoModel.getVimeoUploadDetails()
                .then(function (details) {
                    var uploader = new VimeoUpload({
                        file: $scope.$parent.droppedFile.files[0],
                        name: cutExtension($scope.droppedFile.files[0].name),
                        upload_details: details,
                        deleteCompleteLink: VimeoModel.deleteVimeoUploadLink,
                        updateVideoData: VimeoModel.updateVimeoVideoData,
                        onUploadProgress: function (data) {
                            var uploadedPercentage = calculatePercentage(data)
                            angular.element('#upload_progress_bar')[0].setAttribute("style", "width:" + uploadedPercentage + "%")
                        },
                        onUploadComplete: function (videoId) {
                            $scope.$parent.transcoding = true
                            var videoId = this.upload_details.video_id
                            this.upload_details.video_url = 'https://vimeo.com/' + videoId
                            $rootScope.$broadcast('transcoding_begins', { 'vimeoVidId': videoId })
                            VimeoModel.updateVimeoUploadedVideos(this.upload_details.video_url, 'transcoding', $scope.lecture.id, this.name)                          
                            $modalInstance.dismiss()
                        },
                        onTranscodComplete: function () {        
                            $scope.$parent.transcoding = false
                            $scope.lecture.url = this.upload_details.video_url
                            if ($scope.$parent.lecture.name == 'New Lecture') {
                                $scope.$parent.lecture.name =  $scope.lecture.name
                            }
                            $scope.updateLectureUrl()
                            setTimeout(function () {
                                $rootScope.$broadcast('transcoding_ends', {})
                                VimeoModel.updateVimeoUploadedVideos($scope.lecture.url,'complete', $scope.lecture.id)
                            }, 1000)
                        }
                    });
                    uploader.upload();
                    $scope.$on('transcoding_canceled', function (ev) {
                        $scope.$parent.transcoding = false
                        uploader.cancelTranscoding = true
                    })
                    $scope.$watch('quitUpload', function () {
                        if ($scope.quitUpload) {
                            uploader.xhr.abort()
                        }
                    })
                })
        }
        $scope.cancelUploading = function () {
            $modalInstance.dismiss('cancel')
        }
        $scope.quitUploading = function () {
            $scope.quitUpload = true
            $modalInstance.dismiss('cancel')
        }

        function cutExtension(extended_name) {
            return extended_name.includes('.') ? extended_name.slice(0, extended_name.lastIndexOf('.')) : name
        }
        function calculatePercentage(data) {
            return Math.ceil((data.loaded / data.total * 100)).toString()
        }
    }]);