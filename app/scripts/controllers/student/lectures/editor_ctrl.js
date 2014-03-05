'use strict';

angular.module('scalearAngularApp')
    .controller('EditorCtrl', ['$scope','editor','doc','$stateParams','$rootScope', '$log','$window', function ($scope, editor,doc, $stateParams, $rootScope, $log, $window) {

//    $scope.editor = editor;
//    $scope.doc = doc;
//
//    $scope.init = function () {
//        $scope.sync = {};
//
//        if (doc.info && undefined !== doc.info.syncNotesVideo) {
//            $scope.sync.enabled = doc.info.syncNotesVideo;
//        }
//        else {
//            console.log("here!")
//            $scope.sync.enabled = true;
//        }
//
//    };
//
////    $scope.insert = function(){
////        editor.insert($scope.insert_at);
////    }
//
    $scope.save = function(){
        //console.log("in save");
        for(var e in $scope.editors)
        {
            if($scope.editors[e].doc.dirty)
                $scope.editors[e].save();
        }

    }
//
    $scope.disableSave= function(){
        for(var e in $scope.editors)
        {
            if($scope.editors[e].doc.dirty)
                return false;
        }
        return true;
    }
//
//
//    $scope.$on('loaded', $scope.init);
//
//    $scope.init();
}]);