'use strict';

angular.module('scalearAngularApp')
  .controller('customLinkDetailsCtrl', ['$stateParams', '$scope', '$q', '$filter', 'CustomLink', '$log', 'ItemsModel', 'LinkModel', function($stateParams, $scope, $q, $filter, CustomLink, $log, ItemsModel, LinkModel) {

    $scope.link = ItemsModel.getLink($stateParams.customlink_id)
    ItemsModel.setSelectedItem($scope.link)

    $scope.validateLink = function(column, data) {
      var link = { id: $scope.link.id }
      link[column] = data;
      var temp_link = LinkModel.createInstance(link)
      return temp_link.validate()
    }

    $scope.updateLink = function() {
      $scope.link.update()
        .then(function() {
          $scope.link.errors = ""
        })
        .catch(function(resp) {
          $scope.link.errors = resp.data.errors;
        });
    }

  }]);
