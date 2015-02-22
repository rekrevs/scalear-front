'use strict';

angular.module('scalearAngularApp')
    .controller('lectureDetailsCtrl', ['$stateParams', '$scope', '$http', '$q', '$state', 'Lecture', '$translate', '$log', '$filter','$rootScope',
        function($stateParams, $scope, $http, $q, $state, Lecture, $translate, $log, $filter, $rootScope) {

            
            //**************************FUNCTIONS****************************************///
            $scope.is_youtube = false
            $scope.validateLecture = function(column, data) {
                var d = $q.defer();
                var lecture = {}
                console.log(data)
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
                    function() {                        
                        if(column == 'url'){
                            var type = $scope.isYoutube(data)
                            console.log(type)
                            if(type) {
                                var id = type[1]//lecture.url.split("v=")[1].split("&")[0]
                                console.log(id)
                                var url = "http://gdata.youtube.com/feeds/api/videos/" + id + "?alt=json&v=2&callback=JSON_CALLBACK"
                                $http.jsonp(url).success(function(data) {
                                    if(parseInt(data.entry.media$group.yt$duration.seconds)<1){
                                        d.reject($translate('lectures.vidoe_not_exist'));
                                        return d.promise
                                    }
                                    else{
                                        d.resolve()
                                    }
                                }).error(function(){
                                    d.reject($translate('lectures.vidoe_not_exist'));
                                    return d.promise
                                }); 
                            }
                            else if(isMP4(lecture.url))
                                d.resolve() 
                            else 
                                d.reject($translate('lectures.incompatible_link'))                  
                        }
                        else{
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

            $scope.$parent.updateLecture = function(data, type) {
                var modified_lecture = angular.copy($scope.lecture);
                delete modified_lecture.id;
                delete modified_lecture.created_at;
                delete modified_lecture.updated_at;
                delete modified_lecture.class_name;
                delete modified_lecture.className;
                delete modified_lecture.detected_aspect_ratio;
                delete modified_lecture.due_date_enabled
                delete modified_lecture.disable_due_controls

                $log.debug(modified_lecture)

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
                var enabled = $scope.lecture.due_date_enabled
                var due_date = new Date($scope.lecture.due_date)
                var week = 7
                if(isDueDateDisabled($scope.lecture.due_date) && enabled) 
                    var years =  -200 
                else if(!isDueDateDisabled($scope.lecture.due_date) && !enabled)
                    var years  =  200
                else
                    var years = 0
                due_date.setFullYear(due_date.getFullYear()+ years)

                var appearance_date = new Date($scope.lecture.appearance_time)
                if(due_date <= appearance_date){
                    due_date=appearance_date
                    due_date.setDate(appearance_date.getDate()+ week)
                }

                $scope.lecture.due_date = due_date
                $scope.lecture.due_date_enabled =!isDueDateDisabled($scope.lecture.due_date)
                $scope.lecture.due_date_module = !$scope.lecture.disable_due_controls && $scope.lecture.due_date_enabled
            }
            $scope.visible = function(appearance_time) {
                if (new Date(appearance_time) <= new Date()) {
                    return true;
                } else {
                    return false;
                }
            }

            $scope.updateLectureUrl= function(){                
                $scope.lecture.aspect_ratio = "widescreen"
                if($scope.lecture.url){
                    var type = $scope.isYoutube($scope.lecture.url)
                    if(type){
                        console.log('type initialized')  
                        if(!isFinalUrl($scope.lecture.url))
                            $scope.lecture.url = "https://www.youtube.com/watch?v="+type[1];                                         
                        getYoutubeDetails(type[1]).then(function(){
                            $scope.updateLecture();
                            $rootScope.$broadcast("update_module_time", $scope.lecture.group_id)
                        })
                    }
                    else{
                        console.log('type not initialized')  
                        $scope.updateLecture();
                        $rootScope.$broadcast("update_module_time", $scope.lecture.group_id)
                    }

                }
                
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
                var url="http://gdata.youtube.com/feeds/api/videos/"+id+"?alt=json&v=2&callback=JSON_CALLBACK"
                $http.jsonp(url)
                    .success(function (data) {
                        $log.debug(data.entry)
                        $scope.video={}
                        $scope.video.title = data.entry.title.$t;
                        $scope.video.author = data.entry.author[0].name.$t;
        		        $scope.lecture.duration = data.entry.media$group.yt$duration.seconds
                        $scope.video.thumbnail = "<img class=bigimg src="+data.entry.media$group.media$thumbnail[0].url+" />";  
                        d.resolve()                   
                    });
                return d.promise;
            }

            //********************************************************************//
            var item_unwatch = $scope.$watch('items_obj["lecture"]['+$stateParams.lecture_id+']', function(){
                if($scope.items_obj && $scope.items_obj["lecture"][$stateParams.lecture_id]){
                    $scope.lecture=$scope.items_obj["lecture"][$stateParams.lecture_id]
                    if($scope.lecture.url && $scope.lecture.url!="none"){
                        var video_id = $scope.isYoutube($scope.lecture.url)
                        if(video_id)
                            getYoutubeDetails(video_id[1]);
                    }
                    // else
                        // $scope.lecture.url = $translate("lectures.add_video")
                    if($scope.lecture.due_date) 
                        $scope.lecture.due_date_enabled =!isDueDateDisabled($scope.lecture.due_date) 
                    
                    item_unwatch()      
                    var module_unwatch = $scope.$watch('module_obj[' + $scope.lecture.group_id + ']',function(){                  
                        if ($scope.lecture.appearance_time_module) { 
                            $scope.lecture.appearance_time = $scope.module_obj[$scope.lecture.group_id].appearance_time; 
                        } 
                        if(isDueDateDisabled($scope.module_obj[$scope.lecture.group_id].due_date)){
                            $scope.lecture.disable_due_controls = true//isDueDateDisabled($scope.module_obj[$scope.lecture.group_id].due_date)
                            $scope.lecture.due_date_module = false
                        }
                        else{
                            $scope.lecture.disable_due_controls = false
                        }
                        if ($scope.lecture.due_date_module) { 
                            $scope.lecture.due_date = $scope.module_obj[$scope.lecture.group_id].due_date; 
                            // $scope.lecture.due_date_enabled = !isDueDateDisabled() 
                        }
                        module_unwatch() 
                    })
                    $scope.link_url=$state.href('course.module.courseware.lecture', {module_id: $scope.lecture.group_id, lecture_id:$scope.lecture.id}, {absolute: true}) 
                }
            })

}]);
