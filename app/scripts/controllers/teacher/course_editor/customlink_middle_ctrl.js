'use strict';

angular.module('scalearAngularApp')
  .controller('customLinkMiddleCtrl', ['$stateParams', '$scope', 'ItemsModel', function($stateParams, $scope, ItemsModel) {
    $scope.link = ItemsModel.getLink($stateParams.customlink_id)
    ItemsModel.setSelectedItem($scope.link)
  }]);
