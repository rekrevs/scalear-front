'use strict';

angular.module('scalearAngularApp')
    .controller('studentCourseInformationCtrl', ['$scope', '$stateParams', 'Course', '$window','Page',
        function($scope, $stateParams, Course, $window, Page) {

            Page.setTitle('Information');
            $window.scrollTo(0, 0);
            Course.show({
                    course_id: $stateParams.course_id
                },
                function(data) {
                    $scope.course = data.course;
                    $scope.teachers = data.teachers;
                },
                function() {}
            )

            $scope.url_with_protocol = function(url) {
                if (url)
                    return url.match(/^http/) ? url : 'http://' + url;
                else
                    return url;
            }
        }
    ]);