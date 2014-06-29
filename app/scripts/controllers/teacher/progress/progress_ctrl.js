'use strict';

angular.module('scalearAngularApp')
  .controller('progressCtrl', ['$scope', '$stateParams', '$location','Course','$log', '$window','Page','$anchorScroll','$timeout', '$filter', '$state',function ($scope, $stateParams, $location, Course, $log, $window,Page,$anchorScroll,$timeout, $filter, $state) {


  		Page.setTitle('head.progress')

   		//Course.getCourse({course_id:$stateParams.course_id},
  		$scope.open=[]
  		$scope.close_selector = false;
   		Course.getCourseEditor({course_id:$stateParams.course_id},
			function(data){
				$scope.modules = data.groups
				$log.debug(data)
				$scope.initSelector();
			}, 
			function(){

			}
		)
			
		$scope.getLocation= function(){
			var str = $location.path();
		 	var res = str.match(/.*\/modules\/(\d+)/);
		 	return res?res[1]:0
		}

		$scope.invertOpen = function(id)
		{
			if($scope.open[id])
				$scope.open[id] = false
			else{ 
				for(var i in $scope.open)
					$scope.open[i]=false;
				$scope.open[id] = true
			}
		}
		// $scope.showItem = function(item){
		// 	$timeout(function(){$state.go('course.progress.lecture', {module_id: item.group_id});});
		// 	$scope.scrollTo(item);
		// }

		$scope.scrollTo = function(item) {
			$scope.selected_item = item.id 
			var id
			if(item.class_name == 'quiz')
				id = item.quiz_type
			else
				id="lecture"
			id+="_"+item.id

	      $location.hash(id);
	      $anchorScroll();
	      $timeout(function(){$window.scrollTo($window.scrollX, $window.scrollY-44)})
	   	}
	   	// $scope.clearCurrent = function(){
	   	// 	$scope.selected_module = null;
	   	// }

	   	//modules selector functions
	   	$scope.initSelector = function(){
	   		var count = Math.ceil($scope.modules.length/10)
	   		$scope.dropdown_styling = '-webkit-column-count:'+count+';-moz-column-count:'+count+';column-count:'+count+';'
	   		$scope.selected_module = $filter('filter')($scope.modules, {'id': parseInt($state.params.module_id)}, true)[0]
	   	}
	   	$scope.toggleSelector = function(){
  			$window.scrollTo(0, 0);
	   		$scope.close_selector = !$scope.close_selector;
	   	}
	   	// $scope.showModule = function(index){
	   	// 	console.log('showing module')
	   	// 	$scope.selected_module = $scope.modules[index]
	   	// 	$scope.toggleSelector();
	   	// 	console.log($scope.selected_module)
   		// }
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
		$scope.$on('mainMenuToggled', function(event, collapsed){
			if(collapsed == true){
				$scope.close_selector = false;
			}
		})
			
  }]);
	   	
