'use strict';

angular.module('scalearAngularApp')
    .controller('customLinkDetailsCtrl', ['$stateParams', '$scope', '$q', '$filter','CustomLink','$log', function($stateParams, $scope, $q, $filter, CustomLink,$log) {
        
        $scope.$watch('items_obj["customlink"]['+$stateParams.customlink_id+']', function(){
            if($scope.items_obj && $scope.items_obj["customlink"][$stateParams.customlink_id]){
                $scope.link=$scope.items_obj["customlink"][$stateParams.customlink_id]
            }
        })


        $scope.validateLink= function(column, data){
            $log.debug($scope.link)
            var d = $q.defer();
            var doc={}
            doc[column]=data;
            CustomLink.validate(
                {link_id: $scope.link.id},
                {link:doc},
                function(){
                    d.resolve()
                },function(data){
                    if(data.status==422)
                        d.resolve(data.data.errors[0]);
                    else
                        d.reject('Server Error');
                }
            )
            return d.promise;
        }

        $scope.updateLink=function(){
            $scope.link.url = $filter("formatURL")($scope.link.url)
            CustomLink.update(
                {link_id: $scope.link.id},
                {"link":{
                    url: $scope.link.url,
                    name: $scope.link.name
                    }
                },
                function(){
                    $scope.link.errors=""
                },
                function(resp){
                    $scope.link.errors=resp.data.errors;
                }
            );
        }

}]);
