'use strict';

angular.module('scalearAngularApp')

.controller('courseEditorCtrl', ['$rootScope', '$stateParams', '$scope', '$state', 'Course', 'Module', 'Lecture','Quiz','CourseEditor','$location', '$translate','$log','$window','Page','$modal','Impersonate', '$cookieStore', '$timeout', function ($rootScope, $stateParams, $scope, $state, Course, Module, Lecture,Quiz,CourseEditor, $location, $translate, $log, $window, Page,$modal,Impersonate, $cookieStore, $timeout) {

 	$window.scrollTo(0, 0);
 	Page.setTitle('head.content')
 	$scope.tree_toggled = false, $scope.details_toggled = false, $scope.not_module = false, $scope.collapse_add = true; 
 	/***********************Functions*******************************/
 	// $state.$watch('params', function(){
 		if($state.params.lecture_id || $state.params.quiz_id){
			$scope.not_module = true;
		}
		else{
			$scope.not_module = false;	
		}
 	// })
 	var init = function(){
 		console.log($state.params['module_id'])
 		console.log($state.params['lecture_id'])
 		console.log($state.params['quiz_id'])
 		$scope.open_id="-1";
	    $scope.open={};
	    $scope.oneAtATime = true;
	    $scope.init_loading=true
 		Course.getCourseEditor(
 			{course_id:$stateParams.course_id},
 			function(data){
		 		$scope.course=data.course
		 		$scope.modules=data.groups
		 		$scope.module_obj ={}
		 		$scope.items_obj ={}
                $scope.items_obj["lecture"]={}
                $scope.items_obj["quiz"]={}
		 		$scope.modules.forEach(function(module){
		 			$scope.module_obj[module.id] = module
		 			module.items.forEach(function(item){
		 				$scope.items_obj[item.class_name][item.id] = item
		 			})
		 		})

		 		$scope.init_loading=false
		    },
		    function(){
		    }
	    );
 	}

 	$scope.toggleTree = function(){
 		var menu = angular.element('#tree'), value;
 		if($scope.tree_toggled == false){
			menu.css('left', '30px')	
 			console.log('first');
 		}
 		else{
			menu.css('left', '-238px')
 			console.log('second');
 		}
 		$scope.tree_toggled = !$scope.tree_toggled;

 	}
 	$scope.toggleDetails = function(){
 		$scope.details_toggled = !$scope.details_toggled;
 	}
 	
 	$scope.capitalize = function(s)
 	{
 		return CourseEditor.capitalize(s)
 	}

 	$scope.impersonate = function(){
        $cookieStore.put('old_user_id', $rootScope.current_user.id)
        $cookieStore.put('course_id', $stateParams.course_id)
        Impersonate.create({},{course_id: $stateParams.course_id},
          function(data){
            console.log(data)
            console.log("good")
            $rootScope.preview_as_student = true
            $cookieStore.put('preview_as_student', true)            
            $cookieStore.put('new_user_id', data.user.id)            
            $state.go('course.lectures',{course_id: $stateParams.course_id})
          },
          function(){
            console.log("bad")
          }
        )
  	}

 	$scope.addModule=function(){
    	$log.debug("adding mod")
    	$scope.module_loading=true
    	$log.debug("course id is "+$stateParams.course_id);
    	Module.newModule({course_id: $stateParams.course_id, lang:$translate.uses()},{},
	    	function(module){
	    		$log.debug(module)
	    		module.group.items=[]
	    		$scope.modules.push(module.group)
	    		$scope.module_obj[module.group.id] = module.group
    			$scope.module_loading=false
	    	}, 
	    	function(){}
		);
    }

    $scope.removeModule=function(event, index){
    	$log.debug("remove mod")
    	event.preventDefault();
  		event.stopPropagation();  
  		var m_id= $scope.modules[index].id;
	    	Module.destroy(
	    		{
	    			course_id: $stateParams.course_id,
	    			module_id: m_id
	    		},{},
	    		function(response){
	    			$log.debug(response)
	    				var module = $scope.modules.splice(index, 1)
	    				delete $scope.module_obj[module.id]
	    			 	var str = $location.path();
					 	var res = str.match(/.*\/modules\/(\d+)/);
					 	if(res && res[1]==m_id)
	    			 		$state.go('course.course_editor')
	    			
	    		},
	    		function(){}
			);
    }

    $scope.addLecture=function(module_index){
    	$log.debug("adding lec "+ module_index)
    	$log.debug($scope.modules)
    	$scope.item_loading=true
    	Lecture.newLecture({course_id: $stateParams.course_id, group: $scope.modules[module_index].id},
	    	function(data){
	    		$log.debug(data)
	    		data.lecture.class_name='lecture'
	    	    $scope.modules[module_index].items.push(data.lecture)
	    	    $scope.items_obj["lecture"][data.lecture.id] = data.lecture
    			$scope.item_loading=false
	    	}, 
	    	function(){}
		);
    }

    $scope.removeLecture=function(module_index, item_index){
    	$log.debug("remove lec " + module_index + " " + item_index) 
    	var l_id=$scope.modules[module_index].items[item_index].id
	    	Lecture.destroy(
	    		{
	    			course_id: $stateParams.course_id, 
	    			lecture_id: $scope.modules[module_index].items[item_index].id
	    		},
	    		{},
	    		function(response){
	    			 $log.debug(response)
	    			 var item = $scope.modules[module_index].items.splice(item_index, 1)
	    			 delete $scope.items_obj["lecture"][item.id]

	    			 var str = $location.path();
					 var res = str.match(/.*\/lectures\/(\d+)/);
					 if(res && res[1]==l_id)
	    			 	$state.go('course.course_editor')
	    		},
	    		function(){}
			);
    }
    
    $scope.addQuiz=function(module_index, type){
    	$log.debug("adding quiz "+ module_index)
    	$log.debug($scope.modules)
    	$scope.item_loading=true
    	Quiz.newQuiz({course_id: $stateParams.course_id, group: $scope.modules[module_index].id, type:type},
    	{},

	    	function(data){
	    		$log.debug(data)
	    		data.quiz.class_name='quiz'
	    	    $scope.modules[module_index].items.push(data.quiz)
	    	    $scope.items_obj["quiz"][data.quiz.id] = data.quiz
    			$scope.item_loading=false
	    	}, 
	    	function(){}
		);
    }
    
    $scope.removeQuiz=function(module_index, item_index){
    	$log.debug("remove quiz " + module_index + " " + item_index) 
    	var q_id=$scope.modules[module_index].items[item_index].id;
	    	Quiz.destroy(
	    		{course_id: $stateParams.course_id,
	    		 quiz_id: q_id},
	    		{},
	    		function(response){
	    			 var quiz = $scope.modules[module_index].items.splice(item_index, 1)
	    			 delete $scope.items_obj["quiz"][quiz.id]
	    			 var str = $location.path();
					 var res = str.match(/.*\/quizzes\/(\d+)/);
					 if(res && res[1]==q_id)
	    			 	$state.go('course.course_editor')
	    		},
	    		function(){}
			);
    }

    $scope.closeAll=function(index){
    	for(var i in $scope.modules)
    		if(i != index)
    			$scope.modules[i].open = false

    	$scope.modules[index].open=! $scope.modules[index].open
    	$scope.open_id = null
    }

    // $scope.moduleCopy=function(module_id){
    // 	$scope.module_overlay = true 
    // 	Module.moduleCopy(
    // 		{
    // 			course_id: $stateParams.course_id, 
    // 		 	module_id: module_id
    // 		},{},
    // 		function(data){
    // 			console.log(data)
	   //  		$scope.modules.push(data.group)
	   //  		$scope.module_obj[data.group.id] = data.group
	   //  		$scope.module_obj[data.group.id].items.forEach(function(item){
	   //  			$scope.items_obj[item.class_name][item.id] = item
	   //  		})
    // 			$scope.module_overlay=false
    // 		},
    // 		function(){}
    // 		)
    // }

    $scope.copy=function(item){
    	$rootScope.clipboard = {id:item.id, name:item.name, type:item.class_name||'module'}
    }

    $scope.paste=function(module_id, module_index){
    	console.log("Dsf")
    	var clipboard = $rootScope.clipboard
    	$rootScope.clipboard = null

    	if(clipboard.type == 'module')
	 		pasteModule(clipboard)
	 	else if(clipboard.type == 'lecture')
	 		pasteLecture(clipboard, module_id,module_index)
	 	else if(clipboard.type == 'quiz')
	 		pasteQuiz(clipboard, module_id, module_index)
    }

   var pasteModule=function(module){
   		$scope.module_overlay = true 
    	Module.moduleCopy(
		{course_id: $stateParams.course_id	},
		{module_id: module.id},
		function(data){
			console.log(data)
    		$scope.modules.push(data.group)
    		$scope.module_obj[data.group.id] = data.group
    		$scope.module_obj[data.group.id].items.forEach(function(item){
    			$scope.items_obj[item.class_name][item.id] = item
    		})
			$scope.module_overlay=false
		},
		function(){}
		)
    }

    var pasteLecture=function(item, module_id, module_index){
    	$scope.item_overlay = true  
    	Lecture.lectureCopy(
    		{course_id: $stateParams.course_id},
    		{
    			lecture_id: item.id,
    			module_id :module_id
    		},
    		function(data){
    			console.log(data)
    			$scope.item_overlay = false 
    			data.lecture.class_name='lecture'
    			$scope.modules[module_index].items.push(data.lecture)
                $scope.items_obj["lecture"][data.lecture.id] = data.lecture
    		}, 
    		function(){}
		)
    }

    var pasteQuiz=function(item, module_id, module_index){
    	$scope.item_overlay = true  
    	Quiz.quizCopy(
    		{course_id: $stateParams.course_id},
    		{
    			quiz_id: item.id,
    			module_id:module_id
    		},
    		function(data){
    			console.log(data)
    			$scope.item_overlay = false 
    			data.quiz.class_name='quiz'
    			$scope.modules[module_index].items.push(data.quiz)
                $scope.items_obj["quiz"][data.quiz.id] = data.quiz
    		}, 
    		function(){}
		)
    }

    // $scope.itemCopy=function(item_id,class_name, module_index){
    // 	console.log(item_id)    	
    // 	if(class_name == 'lecture')
    // 		lectureCopy(item_id,module_index)
    // 	else
    // 		quizCopy(item_id, module_index)

    // }

  //   var lectureCopy=function(lecture_id,module_index){
  //   	$scope.item_overlay = true  
  //   	Lecture.lectureCopy(
  //   		{
  //   			course_id: $stateParams.course_id, 
  //   			lecture_id: lecture_id
  //   		},{},
  //   		function(data){
  //   			console.log(data)
  //   			$scope.item_overlay = false 
  //   			data.lecture.class_name='lecture'
  //   			$scope.modules[module_index].items.push(data.lecture)
  //               $scope.items_obj["lecture"][data.lecture.id] = data.lecture
  //   		}, 
  //   		function(){}
		// )
  //   }

    var quizCopy=function(quiz_id,module_index){
    	console.log("quiz copy")
    	$scope.item_overlay = true  
    	Quiz.quizCopy(
    		{
    			course_id: $stateParams.course_id, 
    			quiz_id: quiz_id
    		},{},
    		function(data){
    			console.log(data)
    			$scope.item_overlay = false 
    			data.quiz.class_name='quiz'
    			$scope.modules[module_index].items.push(data.quiz)
                $scope.items_obj["quiz"][data.quiz.id] = data.quiz
    		}, 
    		function(){}
		)
    }

    $scope.openShareModal = function (id, class_name) {
	    var modalInstance = $modal.open({
	      templateUrl: '/views/teacher/course_editor/sharing_modal.html',
	      controller: "sharingModalCtrl",	      
	      resolve: {
	        selected_item: function () {
	        	if(class_name)
	        		return $scope.items_obj[class_name][id]	
	        },
	        selected_module:function(){
	        	if(class_name)
	        		return $scope.module_obj[$scope.items_obj[class_name][id].group_id]
	        	return $scope.module_obj[id]
	        },
	        modules: function(){
	        	return $scope.modules
	        }
	      }
	    });

	    modalInstance.result.then(function () {
        	console.log("shared")
        	selectNone()
      	},function () {
        	console.log("close")
        	selectNone()
      	});
  	};

	var selectNone = function(){
		$scope.modules.forEach(function(module){
			module.selected = false
			module.items.forEach(function(item){
				item.selected = false
			})
		})
	}

      

    /*************************************************************************************/
    
	$rootScope.$on('accordianUpdate', function(event, message) {
		$scope.open_id=message;
		$scope.open[message]= true;
	});

 	$scope.moduleSortableOptions={
 		axis: 'y',
		dropOnEmpty: false,
		handle: '.handle',
		cursor: 'crosshair',
		items: '.module',
		opacity: 0.4,
		scroll: true,
		update: function(e, ui) {
			Module.saveSort({course_id:$stateParams.course_id},
				{group: $scope.modules},
				function(response){
					$log.debug(response)
				},
				function(){
					$log.debug('Error')
				}
			);
		},
 	}

 	$scope.itemSortableOptions={
		axis: 'y',
		dropOnEmpty: false,
		handle: '.handle',
		cursor: 'crosshair',
		items: '.item',
		opacity: 0.4,
		scroll: true,
		update: function(e, ui) {
			var group_id=ui.item.scope().item.group_id
			var group_position=ui.item.scope().$parent.module.position -1
			Lecture.saveSort(
				{course_id:$stateParams.course_id, 
				 group: ui.item.scope().item.group_id},
				{items: $scope.modules[group_position].items},
				function(response){
					$log.debug(response)
				},
				function(){
					$log.debug('error')
				}
			);
		},
 	}
 	$scope.toggleAdd = function(){
 		$scope.collapse_add = !$scope.collapse_add;
 	}

	init();



}]);



