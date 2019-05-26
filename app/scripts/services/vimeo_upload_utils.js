'use strict';

angular.module('scalearAngularApp')
    .factory('VimeoUtils', ['$resource', 'scalear_api', 'headers', '$http', '$stateParams', '$translate', function ($resource, scalear_api, headers, $http, $stateParams, $translate) {
        $http.defaults.useXDomain = true;
        return $resource(scalear_api.host + '/:lang/vimeo_uploads/:action', {}, {
            "updateVimeoUploads": { method: 'POST', ignoreLoadingBar: true, params: { action: 'update_vimeo_table' }, headers: headers },
            "generateVimeoUploadDetails": { method: 'GET', ignoreLoadingBar: true, params: { action: 'get_vimeo_upload_details' }, headers: headers },
            "deleteUploadedVimeoVideo": { method: 'DELETE', params: { action: 'delete_vimeo_video_angular' }, headers: headers },
            "getUploadingStatus": { method: 'GET', params: { action: 'get_uploading_status' }, headers: headers },
            "getVimeoVideoId": { method: 'GET', params: { action: 'get_vimeo_video_id' }, headers: headers },
            "deleteUploadLink": { method: 'DELETE', params: { action: 'delete_complete_link' }, headers: headers },
            "updateVimeoUploadedVideoData": { method: 'POST', params: { action: 'update_vimeo_video_data' }, headers: headers }
        });

    }]).factory("VimeoModel", ['VimeoUtils', function (VimeoUtils) {
        var service = {}
        service.deleteVideo = function (vimeo_video_id, lec_id) {
            return VimeoUtils.deleteUploadedVimeoVideo({
                vimeo_vid_id: vimeo_video_id,
                lecture_id: lec_id
            }, {})
                .$promise
        }

        service.deleteVimeoUploadLink = function (link) {
            return VimeoUtils.deleteUploadLink({
                link: link
            }, {})
                .$promise
        }

        service.updateVimeoUploadedVideos = function (vimeo_url, status, lecture_id, title, video_name) {
            return VimeoUtils.updateVimeoUploads({
                url: vimeo_url,
                status: status,
                lecture_id: lecture_id,
                title: title,
                video_name: video_name
            }, {})
                .$promise
        }

        service.updateVimeoVideoData = function (video_id, data) {
            return VimeoUtils.updateVimeoUploadedVideoData({
                video_id: video_id,
                name: data.name
            }, {})
                .$promise
        }

        service.getVimeoVideoId = function (lecture_id) {
            return VimeoUtils.getVimeoVideoId({
                id: lecture_id
            }, {})
                .$promise
                .then(function (data) {
                    return data.vimeo_video_id
                })
        }

        service.getVimeoUploadingStatus = function (lecture_id) {
            return VimeoUtils.getUploadingStatus({
                id: lecture_id
            }, { id: lecture_id })
                .$promise
                .then(function (data) {
                    return data.status
                })
        }

        service.getVimeoUploadDetails = function () {
            return VimeoUtils.generateVimeoUploadDetails({
            }, {})
                .$promise
                .then(function (data) {
                    return data.details
                })
        }

        return service
    }])
