'use strict';

angular.module('scalearAngularApp')
  .controller('sharingModalCtrl', ['$scope','$rootScope','$timeout','$window','$log','Module','$stateParams','Course','SharedItem','$modalInstance','$translate', 'selected_module', 'selected_item', function ($scope, $rootScope, $timeout,$window, $log, Module, $stateParams, courses,SharedItem,$modalInstance, $translate, selected_module, selected_item) {
    
  		var init =function(){ 
        $scope.selected_module = selected_module
        $scope.selected_item = selected_item
        $scope.selected_teacher = {}

        $scope.deSelectAll($scope.selected_module)
        if($scope.selected_item)
          $scope.selectItem($scope.selected_module, $scope.selected_item, null);
        else
          $scope.selectAll($scope.selected_module)
  		}

  		$scope.shareItem= function(data){
        console.log($scope.selected_teacher.email)
  			var selected = {modules:[], lectures:[], quizzes:[], customlinks:[]}
				if($scope.selected_module.selected)
					selected.modules.push($scope.selected_module.id)
				else
					$scope.selected_module.items.forEach(function(item){
						if(item.selected){
              if(item.class_name == 'lecture')
                selected['lectures'].push(item.id)
              else if (item.class_name == 'quiz')
                selected['quizzes'].push(item.id)
              else if (item.class_name == 'customlink')
                selected['customlinks'].push(item.id)
            }
					})

        if(!selected.modules.length && !selected.lectures.length && !selected.quizzes.length && !selected.customlinks.length){
          $scope.errors = $translate.instant('sharing.nothing_selected')
        }
        else if(!$scope.selected_teacher.email)
          $scope.errors = $translate.instant('sharing.please_enter_email')
        else{
          SharedItem.create({},{data: selected, shared_with: $scope.selected_teacher.email}, 
          	function(){
                $modalInstance.close();
            },
            function(response){
              $scope.errors = response.data.errors
              $log.debug($scope.errors)
            }
          )
        }
      }

      $scope.selectAll=function(module,event){
	      module.selected = !module.selected
      	module.items.forEach(function(item){
      		item.selected=module.selected
      	})
        if(event)
    	   event.stopPropagation()
      }

      $scope.deSelectAll=function(module){
        module.selected = false
        module.items.forEach(function(item){
          item.selected=module.selected
        })
      }

      $scope.selectItem=function(module, item, event){
        if(event){
          event.stopPropagation()
        }
        else{
          item.selected = !item.selected
        }
        // item.selected = !item.selected
        var count = 0
      	module.items.forEach(function(item){
      		if(item.selected)
      			count+=1
      	})
      	module.selected = count == module.items.length
      }

  		init()

  }]);