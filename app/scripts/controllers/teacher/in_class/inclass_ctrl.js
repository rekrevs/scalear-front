'use strict';

angular.module('scalearAngularApp')
  .controller('inclassCtrl', ['$scope', '$filter', '$state', '$stateParams', '$location', 'Course','$log', '$window','Page', function ($scope, $filter, $state, $stateParams, $location, Course, $log, $window,Page) {

    // $window.scrollTo(0, 0);
    Page.setTitle('head.in_class')
    $scope.close_selector = false;
    $scope.modules_obj = {}
    Course.getCourse(
    	{course_id:$stateParams.course_id},
		function(data){
			$scope.modules = data.groups
			$scope.modules.forEach(function(module, index){
				$scope.modules_obj[module.id] = module;
			})
			$scope.initSelector();
			$log.debug($stateParams)
		}, 
		function(){

		}
	);

	$scope.getLocation= function(){
		var str = $location.path();
	 	var res = str.match(/.*\/modules\/(\d+)/);
	 	return res?res[1]:0
	}
	$scope.getSelectedModule = function(){
		var id = $scope.getLocation();
		return $filter('filter')($scope.modules, {'id': parseInt(id)}, true)[0]
	}
	$scope.toggleSelector = function(){
		// console.log('toggling')
		$scope.close_selector = !$scope.close_selector;
	}
	$scope.initSelector = function(){
   		var count = Math.ceil($scope.modules.length/10)
   		$scope.dropdown_styling = '-webkit-column-count:'+count+';-moz-column-count:'+count+';column-count:'+count+';'
   		$scope.selected_module = $scope.getSelectedModule();
   	}
   	$scope.shortenModuleName = function(name){
		if(name){
			if(name.length > 18) {
		    	name = name.substring(0,14)+"...";
			}
			return name;
		}
		else{
			return null;
		}
		
	}
	$scope.showModule = function(){
		$scope.selected_module = $scope.getSelectedModule()
		$scope.toggleSelector();
	}

  }]);
