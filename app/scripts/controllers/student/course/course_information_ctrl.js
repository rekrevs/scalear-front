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
        var length = typeof(l) != "undefined" ? l : 50;
        var link = url.replace("http://","").replace("https://","");
        if(link.length <= length)
            return link
        var chunk_length = length/2
        var start_chunk = shortString(link, chunk_length, false);
        var end_chunk = shortString(link, chunk_length, true);
        return start_chunk + ".." + end_chunk;
    }

    var shortString = function(s, l, reverse){
        var stop_chars = [' ','/', '&'];
        var acceptable_shortness = l * 0.80; // When to start looking for stop characters
        var text = reverse? s.split("").reverse().join("") : s;
        var short_s = "";

        for(var i=0; i < l-1; i++){
            short_s += text[i];
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