'use strict';

angular.module('scalearAngularApp')
    .controller('lectureDetailsCtrl', ['$stateParams', '$scope', '$http', '$q', '$state', 'Lecture', '$translate', '$log', '$filter',
        function($stateParams, $scope, $http, $q, $state, Lecture, $translate, $log, $filter) {

            var current_url;
            $scope.video={}
            //**************************FUNCTIONS****************************************///
            $scope.validateLecture = function(column, data) {
                var d = $q.defer();
                var lecture = {}

                lecture[column] = data;
                if (column == 'url' && invalid_url(data)) {
                    $log.debug(data)
                    d.resolve($translate('courses.invalid_input'));
                }

                Lecture.validateLecture({
                        course_id: $scope.lecture.course_id,
                        lecture_id: $scope.lecture.id
                    },
                    lecture,
                    function(data) {                        
                        if(lecture.url && lecture.url.split("v=")[1]){
                            var id = lecture.url.split("v=")[1].split("&")[0]
                            var url = "http://gdata.youtube.com/feeds/api/videos/" + id + "?alt=json&v=2&callback=JSON_CALLBACK"
                            $http.jsonp(url).success(function(data) {
                                if(data.entry.media$group.yt$duration.seconds<1)
                                    d.reject($translate(lectures.vidoe_not_exist));
                                else
                                    d.resolve()
                            }).error(function(){
                                d.reject($translate(lectures.vidoe_not_exist));
                            });                    
                        }
                        else
                            d.resolve()
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

            $scope.$parent.updateLecture = function(data, type) {
                // if (data && data instanceof Date) {
                //     data.setMinutes(data.getMinutes() + 120);
                //     $scope.lecture[type] = data
                // }
                var modified_lecture = angular.copy($scope.lecture);
                delete modified_lecture.id;
                delete modified_lecture.created_at;
                delete modified_lecture.updated_at;
                delete modified_lecture.class_name;
                delete modified_lecture.className;
                delete modified_lecture.detected_aspect_ratio;
                delete modified_lecture.due_date_enabled

                $log.debug(modified_lecture)

                Lecture.update({
                        course_id: $scope.lecture.course_id,
                        lecture_id: $scope.lecture.id
                    }, {
                        lecture: modified_lecture
                    },
                    function(data) {
                        $log.debug(data)
                        // $scope.modules.forEach(function(module, i) {
                        //     if (module.id == $scope.lecture.group_id) {
                        //         if ($scope.lecture.appearance_time_module) {
                        //             $scope.lecture.appearance_time = module.appearance_time;
                        //         }
                        //         if ($scope.lecture.due_date_module) {
                        //             $scope.lecture.due_date = module.due_date;
                        //         }
                        //     }
                        // });
                    },
                    function() {
                        
                    }
                );
            }
            var isDueDateDisabled=function(){
                var due = new Date($scope.lecture.due_date)
                var today = new Date()
                return due.getFullYear() > today.getFullYear()+100
            }

            $scope.updateDueDate=function(type,enabled){
                var d = new Date($scope.lecture.due_date)
                if(isDueDateDisabled() && enabled) 
                    var years =  -200 
                else if(!isDueDateDisabled() && !enabled)
                    var years  =  200
                else
                    var years = 0
                d.setFullYear(d.getFullYear()+ years)
                $scope.lecture.due_date = d
                $scope.lecture.due_date_enabled =!isDueDateDisabled()
            }
            $scope.visible = function(appearance_time) {
                if (new Date(appearance_time) <= new Date()) {
                    return true;
                } else {
                    return false;
                }
            }

//            $scope.updateLectureUrl = function() {
//                urlFormat()
//                $scope.lecture.aspect_ratio = ""
//                if ($scope.lecture.url)
//                    getYoutubeDetails();
//            }
            $scope.updateLectureUrl= function(){                
                $scope.lecture.aspect_ratio = "widescreen"
                if($scope.lecture.url){
                    var type = isYoutube($scope.lecture.url)
                    if(type)                        
                        getYoutubeDetails(type[1]);
                }
                $scope.updateLecture();
            }

            $scope.updateSlidesUrl = function() {
                $scope.lecture.slides = $filter('formatURL')($scope.lecture.slides)
                $scope.updateLecture()
            }


            // var urlFormat =function(){
            //     var url=
            //     var video_id = isYoutube($scope.lecture.url)
            //     if(video_id) {
            //     //$scope.lecture.url= "http://www.youtube.com/watch?v="+video_id[1];
            //         return video_id; //"youtube";
            //     }
            //     else{
            //         return "other"
            //     }
            // }

            var invalid_url=function(url){
                return (!isMP4(url) && !isYoutube(url) && url.trim().length>0)
            }

            var isMP4= function(url)
            {
                return url.match(/(.*mp4$)/);
            }
            var isYoutube= function(url){
                return url.match(/(?:https?:\/{2})?(?:w{3}\.)?(?:youtu|y2u)(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]{11})/);
            }

            var getYoutubeDetails= function(id){
                //var id=$scope.lecture.url.split("v=")[1]

                if(id){
                    //id= id.split("&")[0]
                    var url="http://gdata.youtube.com/feeds/api/videos/"+id+"?alt=json&v=2&callback=JSON_CALLBACK"
                    $http.jsonp(url)
                    .success(function (data) {
                        $log.debug(data.entry)
                        $scope.video.title = data.entry.title.$t;
                        $scope.video.author = data.entry.author[0].name.$t;
                        var updateFlag = $scope.lecture.duration
        		        $scope.lecture.duration = data.entry.media$group.yt$duration.seconds
                        //if(data.entry.media$group.yt$aspectRatio == null || data.entry.media$group.yt$aspectRatio == undefined)
                        //	$scope.lecture.detected_aspect_ratio="smallscreen";
                        //else
                        //	$scope.lecture.detected_aspect_ratio = data.entry.media$group.yt$aspectRatio.$t;

                        //	$scope.lecture.aspect_ratio = $scope.lecture.aspect_ratio || $scope.lecture.detected_aspect_ratio
                        //$scope.lecture.aspect_ratio = "widescreen"
                        $scope.video.thumbnail = "<img class=bigimg src="+data.entry.media$group.media$thumbnail[0].url+" />";

                        //why did i need this?
                        //if(id != current_url){
                        //	$scope.updateLecture()
                        //		$log.debug("update flag is true")
                        //}
                    });
                }
                else
                $scope.lecture.aspect_ratio = "widescreen"

            }

            // var getVideoDetails = function(){
            //     console.log("Sdfs")
            //     $scope.lecture.duration = $scope.$parent.lecture_player.controls.getDuration()
            // }

            //********************************************************************//

            $log.debug("made it in details!!");
            $scope.screen_options = [
                    {value: "widescreen",  text: 'widescreen'},
                    {value: "smallscreen", text: 'smallscreen'}
            ]
            $scope.$watch('items_obj["lecture"]['+$stateParams.lecture_id+']', function(){
                if($scope.items_obj && $scope.items_obj["lecture"][$stateParams.lecture_id]){
                    $scope.lecture=$scope.items_obj["lecture"][$stateParams.lecture_id]
                    if($scope.lecture.url && $scope.lecture.url!="none"){
                        var video_id = isYoutube($scope.lecture.url)
                        if(video_id)
                            getYoutubeDetails(video_id[1]);
                    }
                    if($scope.lecture.due_date) 
                        $scope.lecture.due_date_enabled =!isDueDateDisabled() 
                              
                    $scope.$watch('module_obj[' + $scope.lecture.group_id + ']',function(){                  
                        if ($scope.lecture.appearance_time_module) { 
                            $scope.lecture.appearance_time = $scope.module_obj[$scope.lecture.group_id].appearance_time; 
                        } 
                        if ($scope.lecture.due_date_module) { 
                            $scope.lecture.due_date = $scope.module_obj[$scope.lecture.group_id].due_date; 
                            $scope.lecture.due_date_enabled = !isDueDateDisabled() 
                        } 
                    }) 
                }
            })

}]);
