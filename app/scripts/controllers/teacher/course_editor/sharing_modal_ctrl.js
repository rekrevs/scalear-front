'use strict';

angular.module('scalearAngularApp')
  .controller('sharingModalCtrl', ['$scope','$rootScope','$timeout','$window','$log','Module','$stateParams','Course','SharedItem','$modalInstance','$translate', 'selected_module', 'selected_item', function ($scope, $rootScope, $timeout,$window, $log, Module, $stateParams, courses,SharedItem,$modalInstance, $translate, selected_module, selected_item) {
    
  		var init =function(){  	
  			// $scope.item= selected_item
        console.log(selected_module)
        $scope.selected_module= selected_module
        $scope.selected_item= selected_item
        $scope.deSelectAll($scope.selected_module)
        console.log($scope.selected_item)
        if($scope.selected_item){
          $scope.selectItem($scope.selected_module, $scope.selected_item, null);
        }
        else{
          $scope.selectAll($scope.selected_module)
        }
  			// courses.getAllTeachers({course_id:null}, function(response){
     //        // $scope.courses=JSON.parse(response.courses);
     //        	console.log(response)
	    //         $scope.teachers = response.teachers;
	    //     });
  		}


  		$scope.shareItem= function(){
  			var selected = {modules:[], lectures:[], quizzes:[], customlinks:[]}
  			// $scope.modules.forEach(function(module){
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
  			// })

        if(!selected.modules.length && !selected.lectures.length && !selected.quizzes.length && !selected.customlinks.length){
          $scope.errors = $translate('sharing.nothing_selected')
        }
        else if(!$scope.selected_teacher)
          $scope.errors = $translate('sharing.please_enter_email')
        else{
          SharedItem.create({},{data: selected, shared_with: $scope.selected_teacher}, 
          	function(){
                $modalInstance.close();
                // selectNone()
            },
            function(response){
              // console.log(data)
              $scope.errors = response.data.errors
              console.log($scope.errors)
            })
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
        if(event)
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