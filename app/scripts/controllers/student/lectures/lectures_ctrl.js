'use strict';

angular.module('scalearAngularApp')
  .controller('studentLecturesCtrl', ['$scope','Course','$stateParams','$rootScope', '$log','$window', '$state', function ($scope, Course, $stateParams, $rootScope, $log, $window, $state) {

	$window.scrollTo(0, 0);
	if($stateParams.lecture_id){
		$scope.current_item = $stateParams.lecture_id
	}
	else if($stateParams.quiz_id){
		$scope.current_item = $stateParams.quiz_id
	}
	else{
		$scope.current_item = ''
	}
	
    var init = function()
    {
    	$scope.open_id="-1";
		$scope.open={};
		$scope.oneAtATime = true;
		$scope.modules_obj = {}
		$scope.items_obj = {}

		$scope.close_selector = false;
  		$scope.hide = true;
	
	    Course.getCourseware(
	    	{course_id: $stateParams.course_id}, function(data){
				$scope.course= JSON.parse(data.course);
				$scope.today = data.today;	
				$log.debug($scope.course);
				$scope.initSelector();
	    	});
	}
	
	init();
	$scope.initSelector = function(){
		$scope.course.groups.forEach(function(module){
			$scope.modules_obj[module.id] = module;
			// console.log(module)
			// module.items.forEach(function(item){
			// 	$scope.items_obj[item.class_name][item.id] = item;
			// });
		});
		console.log($scope.modules_obj)
		if($state.params.module_id){
			$scope.open_module = $state.params.module_id
			$scope.current_module = $scope.modules_obj[$scope.open_module]
		}
		if($scope.course.groups.length > 10){
	    	$scope.columns = Math.ceil(($scope.course.groups.length/10)+1)
	    }
	    else{
	    	$scope.columns = 1
	    }
	    $scope.columns_style = 'column-count:'+$scope.columns+'; -webkit-column-count: '+$scope.columns+'; -moz-column-count: '+$scope.columns+'; -ms-column-count: '+$scope.columns+'; -o-column-count: '+$scope.columns+';';
	    
		$scope.toggleSelector(false);
		$scope.hide=true;

	}
	$scope.toggleSelector = function(should_unhide){
		if(should_unhide && $scope.hide == true)
			$scope.hide=false;
		$scope.close_selector = !$scope.close_selector;
	}

	$scope.shortenModuleName = function(name){
		if(name.length > 20) {
		    name = name.substring(0,14)+"...";
		}
		return name;
	}
	$scope.showModule = function(module_id){
		$scope.current_module = $scope.modules_obj[module_id];
	}
	$scope.$watch('current_module', function(){
		if($scope.current_module){
			$scope.short_name = $scope.shortenModuleName($scope.current_module.name);
			$scope.spacing = 80/$scope.current_module.quizzes.concat($scope.current_module.lectures).length
			console.log($scope.spacing)
		}
	})
	$scope.getSpacingValue = function(item){

	}

   //  $rootScope.$on("accordianReload", function(event, args) {
  	// 	$log.debug("reloading accordian now..");
  	// 	init();
  	// });
    
 //    $scope.$on('accordianUpdate', function(event, message) {
	// 	$log.debug("updating accordian now")
	// 	$scope.open_id=message.g_id;
	// 	console.log('here' +$scope.open_id)
	// 	$scope.open[message.g_id]= true;
	// 	$scope.highlight_item=message.type;
	// 	$scope.highlight_id=message.id;
	// });	
    
  }]);
