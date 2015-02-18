'use strict';

angular.module('scalearAngularApp')
    .controller('studentCourseInformationCtrl', ['$scope', '$stateParams', 'Course', '$window','Page', '$filter', '$state', '$timeout','$rootScope','ContentNavigator', function($scope, $stateParams, Course, $window, Page, $filter, $state, $timeout,$rootScope,ContentNavigator) {

    Page.setTitle('head.information');
    Page.startTour();
    ContentNavigator.open()
    $scope.init = function(){
        Course.show({course_id: $stateParams.course_id},
            function(data) {
                $scope.teachers = data.teachers;
                if($scope.course.discussion_link)
                    $scope.short_url = $scope.shorten($scope.course.discussion_link, 20)
            }
        )
        getAnnouncements()
    }

    $scope.goToContent=function(){
        if($scope.next_item.module != -1){
            var params = {'module_id': $scope.next_item.module}    
            params[$scope.next_item.item.class_name+'_id'] = $scope.next_item.item.id
            $state.go('course.module.courseware.'+$scope.next_item.item.class_name, params)
        }
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

    var getAnnouncements=function(){
        Course.getAnnouncements(
            {course_id: $stateParams.course_id},
            function(data){
                console.log("data",data)
                $scope.announcements = data
            }
        )
    }
    $scope.init();
    
}]);