'use strict';

angular.module('scalearAngularApp')
    .controller('lectureDetailsCtrl', ['$stateParams', '$scope', '$http', '$q', '$state', 'Lecture', '$translate', '$log', '$filter',
        function($stateParams, $scope, $http, $q, $state, Lecture, $translate, $log, $filter) {

            var current_url;
            //**************************FUNCTIONS****************************************///
            $scope.validateLecture = function(column, data) {
                var d = $q.defer();
                var lecture = {}

                lecture[column] = data;
                if (column == 'url' && getVideoId(data) == null) {
                    $log.debug(data)
                    d.resolve($translate('courses.invalid_input'));
                }
                Lecture.validateLecture({
                        course_id: $scope.lecture.course_id,
                        lecture_id: $scope.lecture.id
                    },
                    lecture,
                    function(data) {
                        d.resolve()
                    }, function(data) {
                        $log.debug(data.status);
                        $log.debug(data);
                        if (data.status == 422)
                            d.resolve(data.data.errors.join());
                        else
                            d.reject('Server Error');
                    }
                )
                return d.promise;
            };

            $scope.updateLecture = function(data, type) {
                if (data && data instanceof Date) {
                    data.setMinutes(data.getMinutes() + 120);
                    $scope.lecture[type] = data
                }
                var modified_lecture = angular.copy($scope.lecture);
                delete modified_lecture.id;
                delete modified_lecture.created_at;
                delete modified_lecture.updated_at;
                delete modified_lecture.class_name;
                delete modified_lecture.className;
                delete modified_lecture.detected_aspect_ratio;

                $log.debug(modified_lecture)

                Lecture.update({
                        course_id: $scope.lecture.course_id,
                        lecture_id: $scope.lecture.id
                    }, {
                        lecture: modified_lecture
                    },
                    function(data) {
                        $log.debug(data)
                    },
                    function() {
                        //alert("Failed to update lecture, please check your internet connection")
                    }
                );
            }

            $scope.visible = function(appearance_time) {
                if (new Date(appearance_time) <= new Date()) {
                    return true;
                } else {
                    return false;
                }
            }

            $scope.updateLectureUrl = function() {
                urlFormat()
                $scope.lecture.aspect_ratio = ""
                if ($scope.lecture.url)
                    getYoutubeDetails();
            }

            $scope.updateSlidesUrl = function() {
                $scope.lecture.slides = $filter('formatURL')($scope.lecture.slides)
                $scope.updateLecture()
            }

            var urlFormat = function() {
                var url = $scope.lecture.url
                var video_id = getVideoId(url)
                if (video_id) {
                    $scope.lecture.url = "http://www.youtube.com/watch?v=" + video_id[1];
                }
            }

            var getVideoId = function(url) {
                return url.match(/(?:https?:\/{2})?(?:w{3}\.)?(?:youtu|y2u)(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]{11})/);
            }

            var getYoutubeDetails = function() {
                var id = $scope.lecture.url.split("v=")[1]
                $scope.video = {}
                if (id) {
                    id = id.split("&")[0]
                    var url = "http://gdata.youtube.com/feeds/api/videos/" + id + "?alt=json&v=2&callback=JSON_CALLBACK"
                    $http.jsonp(url)
                        .success(function(data) {
                            $log.debug(data.entry)
                            $scope.video.title = data.entry.title.$t;
                            $scope.video.author = data.entry.author[0].name.$t;
                            var updateFlag = $scope.lecture.duration
                            $scope.lecture.duration = data.entry.media$group.yt$duration.seconds
                            if (data.entry.media$group.yt$aspectRatio == null || data.entry.media$group.yt$aspectRatio == undefined)
                                $scope.lecture.detected_aspect_ratio = "smallscreen";
                            else
                                $scope.lecture.detected_aspect_ratio = data.entry.media$group.yt$aspectRatio.$t;

                            $scope.lecture.aspect_ratio = $scope.lecture.aspect_ratio || $scope.lecture.detected_aspect_ratio

                            $scope.video.thumbnail = "<img class=bigimg src=" + data.entry.media$group.media$thumbnail[0].url + " />";
                            if (id != current_url) {
                                $scope.updateLecture()
                                $log.debug("update flag is true")
                            }
                        });
                } else
                    $scope.lecture.aspect_ratio = "widescreen"

            }

            //********************************************************************//

            $log.debug("made it in details!!");
            $scope.screen_options = [{
                value: "widescreen",
                text: 'widescreen'
            }, {
                value: "smallscreen",
                text: 'smallscreen'
            }]
            $scope.$watch('items_obj[' + $stateParams.lecture_id + ']', function() {
                if ($scope.items_obj && $scope.items_obj[$stateParams.lecture_id]) {
                    $scope.lecture = $scope.items_obj[$stateParams.lecture_id]
                    if ($scope.lecture.url && $scope.lecture.url != "none") {
                        current_url = $scope.lecture.url.split("v=")[1];
                        current_url = current_url.split("&")[0]
                        getYoutubeDetails();
                    }
                }
            })



        }
    ]);