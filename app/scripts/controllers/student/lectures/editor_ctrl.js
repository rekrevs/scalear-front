'use strict';

angular.module('scalearAngularApp')
    .controller('EditorCtrl', ['$scope','editor','doc','$stateParams','$rootScope', '$log','$window', function ($scope, editor,doc, $stateParams, $rootScope, $log, $window) {

    $scope.editor = editor;
    $scope.doc = doc;

    $scope.init = function () {
        $scope.sync = {};

        if (doc.info && undefined !== doc.info.syncNotesVideo) {
            $scope.sync.enabled = doc.info.syncNotesVideo;
        }
        else {
            console.log("here!")
            $scope.sync.enabled = true;
        }

    };

    $scope.save = function(){
        console.log("in save");
        editor.save();
    }

    $scope.$on('loaded', $scope.init);

    $scope.init();
}]);