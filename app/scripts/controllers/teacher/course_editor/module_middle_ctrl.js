'use strict';

angular.module('scalearAngularApp')
  .controller('moduleMiddleCtrl', ['$scope', '$state', 'Module', 'CustomLink', '$stateParams', '$translate', 'ModuleModel', function($scope, $state, Module, CustomLink, $stateParams, $translate, ModuleModel) {

    (function init() {
      $scope.module = ModuleModel.getSelectedModule()
      getStatistics()
    })()

    function getStatistics() {
      ModuleModel.getStatistics()
        .then(function(data) {
          $scope.module_statistics = data
        })
    }

    $scope.$on("update_module_statistics", function() {
      getStatistics()
    })

  }]);
