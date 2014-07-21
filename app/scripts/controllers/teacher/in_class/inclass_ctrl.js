'use strict';

angular.module('scalearAngularApp')
  .controller('inclassCtrl', ['$scope', '$filter', '$state', '$stateParams', '$location', 'Course','$log', '$window','Page', '$rootScope', function ($scope, $filter, $state, $stateParams, $location, Course, $log, $window,Page, $rootScope) {

    // $window.scrollTo(0, 0);
    Page.setTitle('head.in_class')
    // $scope.close_selector = false;
    $scope.module_obj = {}
    Course.getCourse(
    	{course_id:$stateParams.course_id},
		function(data){
			$scope.modules = data.groups
			$scope.modules.forEach(function(module, index){
				$scope.module_obj[module.id] = module;
			})
			if($state.params.module_id)
				$scope.selected_module = $scope.module_obj[$state.params.module_id]
			// $scope.initSelector();
			$log.debug($stateParams)
		}, 
		function(){

		}
	);

	// $scope.getLocation= function(){
	// 	var str = $location.path();
	//  	var res = str.match(/.*\/modules\/(\d+)/);
	//  	return res?res[1]:0
	// }
	// $scope.getSelectedModule = function(){
	// 	var id = $scope.getLocation();
	// 	return $filter('filter')($scope.modules, {'id': parseInt(id)}, true)[0]
	// }
	// $scope.toggleSelector = function(){
	// 	// console.log('toggling')
	// 	$scope.close_selector = !$scope.close_selector;
	// }
	// $scope.initSelector = function(){
 //   		var count = Math.ceil($scope.modules.length/10)
 //   		$scope.dropdown_styling = '-webkit-column-count:'+count+';-moz-column-count:'+count+';column-count:'+count+';'
 //   		$scope.selected_module = $scope.getSelectedModule();
 //   	}
 //   	$scope.shortenModuleName = function(name){
	// 	if(name){
	// 		if(name.length > 18) {
	// 	    	name = name.substring(0,14)+"...";
	// 		}
	// 		return name;
	// 	}
	// 	else{
	// 		return null;
	// 	}
		
	// }
	$scope.showModule = function(module){
		$scope.selected_module = module//$scope.getSelectedModule()
		$state.go('course.inclass.module',{module_id: module.id})
		// $scope.toggleSelector();
	}
	$scope.$on('mainMenuToggled', function(event, collapsed){
		console.log(collapsed)
		if(collapsed == true){
			$scope.close_selector = false;
		}
	})

  }]);
