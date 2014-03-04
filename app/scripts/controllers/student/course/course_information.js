'use strict';

angular.module('scalearAngularApp')
    .controller('studentCourseInformationCtrl', ['$scope', '$stateParams', 'Course', '$window',
        function($scope, $stateParams, Course, $window) {
            $window.scrollTo(0, 0);
            $scope.init = function(){
                Course.show({
                    course_id: $stateParams.course_id
                    },
                    function(data) {
                        $scope.course = data.course;
                        $scope.teachers = data.teachers;
                        console.log($scope.teachers)
                        if(!$scope.course.image){
                            $scope.image_link = "../images/course.png";
                        }
                        else{
                            $scope.image_link = $scope.course.image;
                        }
                        $scope.short_url = $scope.shorten($scope.course.discussion_link, 20)
                    },
                    function() {}
                )
            }

            $scope.url_with_protocol = function(url) {
                if (url)
                    return url.match(/^http/) ? url : 'http://' + url;
                else
                    return url;
            }
            $scope.shorten = function(url, l){
                var l = typeof(l) != "undefined" ? l : 50;
                var chunk_l = (l/2);
                var url = url.replace("http://","").replace("https://","");

                if(url.length <= l){ return url; }

                var start_chunk = shortString(url, chunk_l, false);
                var end_chunk = shortString(url, chunk_l, true);
                return start_chunk + ".." + end_chunk;
            }
            var shortString = function(s, l, reverse){
                var stop_chars = [' ','/', '&'];
                var acceptable_shortness = l * 0.80; // When to start looking for stop characters
                var reverse = typeof(reverse) != "undefined" ? reverse : false;
                var s = reverse ? s.split("").reverse().join("") : s;
                var short_s = "";

                for(var i=0; i < l-1; i++){
                    short_s += s[i];
                    if(i >= acceptable_shortness && stop_chars.indexOf(s[i]) >= 0){
                        break;
                    }
                }
                if(reverse){ return short_s.split("").reverse().join(""); }
                return short_s;
            }

            $scope.init();

        }
    ]);