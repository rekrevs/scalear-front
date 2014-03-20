'use strict';

angular.module('scalearAngularApp')
  .controller('sharingModalCtrl', ['$scope','$rootScope','$timeout','$window','$log','Module','$stateParams','Course','selected_item','selected_module','modules','SharedItem', function ($scope, $rootScope, $timeout,$window, $log, Module, $stateParams, courses,selected_item,selected_module,modules,SharedItem) {
    
  		var init =function(){  	
  			$scope.item= selected_item
  			$scope.selected_module= selected_module
  			$scope.collapse={}
  			$scope.collapse[$scope.selected_module.id]='true'
  			$scope.modules = modules
  			$scope.modules.forEach(function(module){
  				if(module == $scope.selected_module){
  					console.log($scope.item)
  					if($scope.item)
						module.items.forEach(function(item){
							if(item == $scope.item)
								$scope.selectItem(module, item, event)
						})
					else
  						$scope.selectAll(module,event)
  				}

  			})
  			courses.getAllTeachers({course_id:null}, function(response){
            // $scope.courses=JSON.parse(response.courses);
            	console.log(response)
	            $scope.teachers = response.teachers;
	        });
  		}


  		$scope.shareItem= function(){
  			var selected = {modules:[], lecture:[], quiz:[]}
  			$scope.modules.forEach(function(module){
  				if(module.selected)
  					selected.modules.push(module.id)
  				else
  					module.items.forEach(function(item){
  						if(item.selected)
  							selected[item.class_name].push(item.id)
  					})
  			})
  			console.log($scope.selected_teacher)
            SharedItem.create({},{data: selected, shared_with: $scope.selected_teacher}, 
        	function(){
                console.log("success")
                // $state.go("course_list");
            })
        }

        $scope.selectAll=function(module,event){
			module.selected = !module.selected
        	module.items.forEach(function(item){
        		item.selected=module.selected
        	})
        	event.stopPropagation()
        }

        $scope.selectItem=function(module, item, event){
        	event.stopPropagation()
        	item.selected = !item.selected
        	var count = 0
        	module.items.forEach(function(item){
        		if(item.selected)
        			count+=1
        	})
        	module.selected = count == module.items.length
        }

  		init()

  }]);