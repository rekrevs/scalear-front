'use strict';

angular.module('scalearAngularApp')
    .controller('lectureDetailsCtrl', ['$stateParams', '$scope', '$http', '$q', '$state', 'Lecture', '$translate', '$log', '$filter','$rootScope','scalear_utils','OnlineQuiz','OnlineMarker','Timeline','$modal', function($stateParams, $scope, $http, $q, $state, Lecture, $translate, $log, $filter, $rootScope, scalear_utils, OnlineQuiz, OnlineMarker, Timeline, $modal) {

    var item_unwatch = $scope.$watch('items_obj["lecture"]['+$stateParams.lecture_id+']', function(){
        if($scope.items_obj && $scope.items_obj["lecture"][$stateParams.lecture_id]){
            $scope.lecture=$scope.items_obj["lecture"][$stateParams.lecture_id]
            $log.debug($scope.items_obj["lecture"][$stateParams.lecture_id])
            if($scope.lecture.url && $scope.lecture.url!="none"){
                var video_id = $scope.isYoutube($scope.lecture.url)
                if(video_id)
                    getYoutubeDetails(video_id[1]);
            }
            if($scope.lecture.due_date)
                $scope.lecture.due_date_enabled =!isDueDateDisabled($scope.lecture.due_date)
            $scope.lecture.visible_to_student = $scope.visible($scope.lecture.appearance_time)

            item_unwatch()
            var module_unwatch = $scope.$watch('module_obj[' + $scope.lecture.group_id + ']',function(){
                // if ($scope.lecture.appearance_time_module) {
                //     $scope.lecture.appearance_time = $scope.module_obj[$scope.lecture.group_id].appearance_time;
                // }
                $scope.lecture.disable_module_due_controls = isDueDateDisabled($scope.module_obj[$scope.lecture.group_id].due_date)//isDueDateDisabled($scope.module_obj[$scope.lecture.group_id].due_date)

                // if ($scope.lecture.due_date_module) {
                //     $scope.lecture.due_date = $scope.module_obj[$scope.lecture.group_id].due_date;
                // }
                module_unwatch()
            })
            $scope.link_url=$state.href('course.module.courseware.lecture', {module_id: $scope.lecture.group_id, lecture_id:$scope.lecture.id}, {absolute: true})
            $scope.lecture.timeline = new Timeline()
            getQuizList()
            getMarkerList()
        }
    })

    $scope.is_youtube = false

    $scope.validateLecture = function(column, data) {
        var d = $q.defer();
        var lecture = {}
        $log.debug(data)
        lecture[column] = data;
        if (column == 'url' && invalid_url(data)) {
            $log.debug(data)
            d.resolve($translate('editor.details.incompatible_video_link'));
        }

        Lecture.validateLecture({
                course_id: $scope.lecture.course_id,
                lecture_id: $scope.lecture.id
            },
            lecture,
            function() {
                if(column == 'url'){
                    var type = $scope.isYoutube(data)
                    $log.debug(type)
                    if(type) {
                        var id = type[1]//lecture.url.split("v=")[1].split("&")[0]
                        $log.debug(id)
                        // var url = "http://gdata.youtube.com/feeds/api/videos/" + id + "?alt=json&v=2&callback=JSON_CALLBACK"
                        var url = "https://www.googleapis.com/youtube/v3/videos?id=" +
                                  id + 
                                  "&part=status&key=AIzaSyAztqrTO5FZE2xPI4XDYbLeOXE0vtWoTMk"
                        /*
                        $http.jsonp(url).success(function(data) {
                            // if(parseInt(data.entry.media$group.yt$duration.seconds)<1){
                            if(data.items[0].status.uploadStatus != "processed"){
                                d.reject($translate('editor.details.vidoe_not_exist'));
                                return d.promise
                            }
                            else{
                                d.resolve()
                            }
                        }).error(function(){
                            d.reject($translate('editor.details.vidoe_not_exist'));
                            return d.promise
                        });
                        */
                        
                        $.getJSON(url, 
                            function (data, status) {
                                $log.debug({status: status, data: data});
                                if(data.items.length > 0) {
                                    d.resolve();
                                }
                                else {
                                    d.reject($translate('editor.details.vidoe_not_exist'));
                                    return d.promise;
                                }
                            }).error(function(){
                                $log.debug({status: status, data: data});
                                d.reject($translate('editor.details.vidoe_not_exist'));
                                return d.promise
                                });
                    }
                    else if(isMP4(lecture.url)) {
                        d.resolve()
                    }
                    else {
                        d.reject($translate('editor.details.incompatible_video_link'))
                    }
                }
                else {
                    d.resolve()
                }
            },
            function(data) {
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

    $scope.$parent.updateLecture = function() {
        var modified_lecture = angular.copy($scope.lecture);
        delete modified_lecture.id;
        delete modified_lecture.created_at;
        delete modified_lecture.updated_at;
        delete modified_lecture.class_name;
        delete modified_lecture.className;
        delete modified_lecture.detected_aspect_ratio;
        delete modified_lecture.due_date_enabled
        delete modified_lecture.disable_module_due_controls
        delete modified_lecture.timeline
        delete modified_lecture.visible_to_student

        Lecture.update({
                course_id: $scope.lecture.course_id,
                lecture_id: $scope.lecture.id
            }, {
                lecture: modified_lecture
            },
            function(data) {
                $scope.lecture.appearance_time = data.lecture.appearance_time
                // $scope.course.selected_module.total_time += data.lecture.duration
                $scope.lecture.due_date = data.lecture.due_date
            },
            function() {

            }
        );
    }
    var isDueDateDisabled=function(due_date){
        var due = new Date(due_date)
        var today = new Date()
        return due.getFullYear() > today.getFullYear()+100
    }

    $scope.updateDueDate=function(){
        var offset = 200
        var enabled = $scope.lecture.due_date_enabled
        var due_date = new Date($scope.lecture.due_date)
        var week = 7
        var year = 0
        if(isDueDateDisabled($scope.lecture.due_date) && enabled)
            years =  -offset
        else if(!isDueDateDisabled($scope.lecture.due_date) && !enabled)
            years  =  offset
        due_date.setFullYear(due_date.getFullYear()+ years)

        var appearance_date = new Date($scope.lecture.appearance_time)
        if(due_date <= appearance_date){
            due_date=appearance_date
            due_date.setDate(appearance_date.getDate()+ week)
        }

        $scope.lecture.due_date = due_date
        $scope.lecture.due_date_enabled =!isDueDateDisabled($scope.lecture.due_date)
        $scope.lecture.due_date_module = !$scope.lecture.disable_module_due_controls && $scope.lecture.due_date_enabled
    }

    $scope.updateAppearanceDate=function(){
        var offset = 200
        var apperance = new Date($scope.lecture.appearance_time)
        var week = 7
        var year = 0
        var visible = $scope.visible($scope.lecture.appearance_time)
        year = visible? offset : -offset
        apperance.setFullYear(apperance.getFullYear()+ year)
        console.debug(apperance, visible)
        $scope.lecture.appearance_time = apperance
        $scope.lecture.visible_to_student = !visible
    }

    $scope.visible = function(appearance_time) {
        return new Date(appearance_time) <= new Date()
    }

    $scope.updateLectureUrl= function(){
        $scope.lecture.aspect_ratio = "widescreen"
        $scope.lecture.url = $scope.lecture.url.trim()
        if($scope.lecture.url && $scope.lecture.url!="none" && $scope.lecture.url!="http://"){
            var type = $scope.isYoutube($scope.lecture.url)
            if(type){
                $log.debug('type initialized')
                if(!isFinalUrl($scope.lecture.url))
                    $scope.lecture.url = "https://www.youtube.com/watch?v="+type[1];
                getYoutubeDetails(type[1]).then(function(){
                    $scope.lecture.start_time = 0
                    $scope.lecture.end_time = $scope.lecture.duration
                    $scope.updateLecture();
                    $rootScope.$broadcast("update_module_time", $scope.lecture.group_id)
                    checkToTrim()
                })
            }
            else{
              var video = $('video')
              video.bind('loadeddata', function(e) {
                $log.debug('type not initialized')
                $scope.lecture.start_time = 0
                $scope.lecture.end_time = e.target.duration || 0
                $scope.updateLecture();
                $rootScope.$broadcast("update_module_time", $scope.lecture.group_id)
              });
            }

            // startTrimVideo()
        }
        else
          $scope.lecture.url = "none"
    }

    $scope.updateSlidesUrl = function() {
        $scope.lecture.slides = $filter('formatURL')($scope.lecture.slides)
        $scope.updateLecture()
    }

    var invalid_url=function(url){
        return (!isMP4(url) && !$scope.isYoutube(url) && url.trim().length>0)
    }

    var isMP4= function(url){
        return url.match(/(.*mp4$)/);
    }

    $scope.isYoutube= function(url){
        var match = url.match(/(?:https?:\/{2})?(?:w{3}\.)?(?:youtu|y2u)(?:be)?\.(?:com|be)(?:\/watch\?v=|\/).*(?:v=)([^\s&]{11})/);
        if(!match)
            return url.match(/(?:https?:\/{2})?(?:w{3}\.)?(?:youtu|y2u)(?:be)?\.(?:com|be)(?:\/watch\?v=|\/).*(?:v=)?([^\s&]{11})/);
        else return match
    }

    var isFinalUrl= function(url){
        return url.match(/^(http|https):\/\/www\.youtube\.com\/watch\?v=[^\s]{11}[\W\w]*$/);
    }

    var getYoutubeDetails= function(id){
        $scope.is_youtube = true
        var d = $q.defer()
        // var url="https://gdata.youtube.com/feeds/api/videos/"+id+"?alt=json&v=2&callback=JSON_CALLBACK"
        var url="https://www.googleapis.com/youtube/v3/videos?id=" + id + "&part=contentDetails,snippet&key=AIzaSyAztqrTO5FZE2xPI4XDYbLeOXE0vtWoTMk&callback=JSON_CALLBACK"
                 // https://www.googleapis.com/youtube/v3/videos?id=xU5TBS_MsA&part=contentDetails        &key=AIzaSyAztqrTO5FZE2xPI4XDYbLeOXE0vtWoTMk&fields=items(contentDetails(duration))&callback=jsonp1431029921616
        $http.jsonp(url)
            .success(function (data) {
                $scope.video={}
                $scope.video.title = data.items[0].snippet.title//data.entry.title.$t;
                $scope.video.author =data.items[0].snippet.channelTitle//data.entry.author[0].name.$t;
		        var duration = scalear_utils.parseDuration(data.items[0].contentDetails.duration)
                $scope.lecture.duration = $scope.lecture.duration || (duration.hour*(60*60)+duration.minute*(60)+duration.second)//data.entry.media$group.yt$duration.seconds
                // $scope.video.thumbnail = "<img class=bigimg src="+data.entry.media$group.media$thumbnail[0].url+" />";
                d.resolve()
            });

        return d.promise;
    }

    var getQuizList= function(){
        $scope.$parent.$parent.quiz_list = null
        OnlineQuiz.getQuizList(
            {lecture_id:$stateParams.lecture_id},
            function(data){
                $scope.$parent.$parent.quiz_list = data.quizList
                data.quizList.forEach(function(quiz){
                    $scope.lecture.timeline.add(quiz.time, "quiz", quiz)
                })
            }
        );
    }

    $scope.showQuiz=function(quiz){
        $rootScope.$broadcast("show_online_quiz", quiz)
    }

    $scope.deleteQuiz=function(quiz){
        $rootScope.$broadcast("delete_online_quiz", quiz)
    }

    var getMarkerList= function(){
        $scope.$parent.$parent.marker_list = null
        OnlineMarker.getMarkerList(
            {lecture_id:$stateParams.lecture_id},
            function(data){
                $scope.$parent.$parent.marker_list = data.markerList
                data.markerList.forEach(function(marker){
                    $scope.lecture.timeline.add(marker.time, "marker", marker)
                })
            }
        );
    }

    $scope.showMarker=function(marker){
        $rootScope.$broadcast("show_online_marker", marker)
    }

    $scope.deleteMarker=function(marker){
        $rootScope.$broadcast("delete_online_marker", marker)
    }

    // var startTrimVideo=function(){
    //     $rootScope.$broadcast("start_trim_video")
    // }



    var checkToTrim=function(){
        $modal.open({
            templateUrl: '/views/teacher/course_editor/trim_modal.html',
            controller: ['$scope', '$rootScope', '$modalInstance',function($scope, $rootScope, $modalInstance){
                $scope.trim=function(){
                    $rootScope.$broadcast("start_trim_video")
                    $modalInstance.close();
                }
                $scope.cancel=function(){
                    $modalInstance.dismiss('cancel');
                }
            }]
        });
    }


}]);
