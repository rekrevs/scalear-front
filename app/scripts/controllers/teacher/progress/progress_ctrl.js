'use strict';

angular.module('scalearAngularApp')
  .controller('progressCtrl', ['$scope', '$stateParams', '$location','Course','$log', '$window','Page','$anchorScroll','$timeout', function ($scope, $stateParams, $location, Course, $log, $window,Page,$anchorScroll,$timeout) {

  		$window.scrollTo(0, 0);
  		Page.setTitle('Progress')
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

		$scope.scrollTo = function(item) {
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

	   	//modules selector functions
	   	$scope.initSelector = function(){
	   		var count = Math.ceil($scope.modules.length/10)
	   		$scope.dropdown_styling = '-webkit-column-count:'+count+';-moz-column-count:'+count+';column-count:'+count+';'
	   	}
	   	$scope.toggleSelector = function(){
	   		$scope.close_selector = !$scope.close_selector;
	   	}
	   	$scope.showModule = function(index){
	   		console.log('showing module')
	   		$scope.selected_module = $scope.modules[index]
	   		$scope.toggleSelector();
	   		console.log($scope.selected_module)
   		}
			
  }]);
	   	
