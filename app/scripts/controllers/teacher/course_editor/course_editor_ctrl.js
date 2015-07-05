'use strict';

angular.module('scalearAngularApp')

.controller('courseEditorCtrl', ['$rootScope', '$stateParams', '$scope', '$state', 'Course', 'Module', 'Lecture','Quiz','$translate','$log','Page','$modal', '$timeout','$filter','CustomLink','ContentNavigator','DetailsNavigator','Preview','scalear_utils', function ($rootScope, $stateParams, $scope, $state, Course, Module, Lecture,Quiz, $translate, $log, Page,$modal, $timeout, $filter, CustomLink, ContentNavigator, DetailsNavigator, Preview, scalear_utils) {

 	// $window.scrollTo(0, 0);
 	Page.setTitle('head.content')

    ContentNavigator.open()
    DetailsNavigator.open()
    $scope.DetailsNavigator = DetailsNavigator
    $scope.ContentNavigator = ContentNavigator
    $scope.delayed_details_status = DetailsNavigator.getStatus()
    $scope.delayed_details_status2 = DetailsNavigator.getStatus()
    $scope.$on('details_navigator_change',function(ev, status){
        console.log("datails status event", status)
        if(!status){
            $scope.delayed_details_status2 = false
            $timeout(function(){
                $scope.delayed_details_status = false
            },350)
          }
          else{
            $scope.delayed_details_status = true
            $timeout(function(){
                $scope.delayed_details_status2 = true
            },350)
        }
    })



    
    
    $scope.$on('share_copy', function(event, data){
        openSharingModal(data)      
    })

     $scope.$on('add_module', function(event){
         $scope.addModule()
    })

     // $scope.$on('activate_preview',function(){
     //    $scope.impersonate()
     // })

    $scope.$on('add_item', function(event, type){
        if(!$state.params.module_id){
            $scope.addModule(function(module_id){
                $timeout(function(){
                    addItemBytype(type, module_id)
                })
            })
        }
        else
            addItemBytype(type)
        ContentNavigator.open()
    })

     $scope.$on('delete_module',function(event, module){
        $scope.removeModule(module)
     })

     $scope.$on('delete_item',function(event, item){
        if(item.class_name == 'lecture')
            $scope.removeLecture(item)
        else if(item.class_name == 'customlink')
            $scope.removeCustomLink(item)
        else
            $scope.removeQuiz(item)
     })

     // $scope.$on('add_link',function(){
     //    $scope.addCustomLink()
     // })

    // $scope.$on('remove_link',function(event, link){
    //     $scope.removeCustomLink(link)
    //  })

    // $scope.$on('update_link',function(event, link){
    //     $scope.updateCustomLink(link)
    // })

    $scope.$on('copy_item', function(event, item){
        console.log('caught copy')
        console.log(item)
        $scope.copy(item)
        console.log($rootScope.clipboard)
     })
    
     $scope.$on('paste_item', function(event, module_id){
        console.log('pasting')
        $scope.paste(module_id)
        console.log($rootScope.clipboard)
     })
 	// $scope.tree_toggled = false 
 	// $scope.details_toggled = false
  //   $scope.not_module = $state.params.lecture_id || $state.params.quiz_id;
 	// $scope.currentmodule 
 	// $scope.currentitem; 

 	/***********************Functions*******************************/

 	// var init = function(){
 	// 	$cookieStore.remove('preview_as_student')
  //     	$cookieStore.remove('old_user_id')
  //     	$cookieStore.remove('new_user_id')
  //     	$cookieStore.remove('course_id')
 	// 	$scope.open_id="-1";
	 //    $scope.open={};
	 //    $scope.oneAtATime = true;
	 //    $scope.init_loading=true
 	// 	Course.getCourseEditor(
 	// 		{course_id:$stateParams.course_id},
 	// 		function(data){
		//  		$scope.course=data.course
		//  		$scope.course.custom_links = data.links
		//  		$scope.modules=data.groups
		//  		$scope.module_obj ={}
		//  		$scope.items_obj ={}
  //               $scope.items_obj["lecture"]={}
  //               $scope.items_obj["quiz"]={}
		//  		$scope.modules.forEach(function(module){
		//  			$scope.module_obj[module.id] = module
		//  			module.items.forEach(function(item){
		//  				$scope.items_obj[item.class_name][item.id] = item
		//  			})
		//  		})

		//  		$scope.init_loading=false
		//  		console.log($scope.course)
		//     },
		//     function(){
		//     }
	 //    );
 	// }

 	// $scope.toggleTree = function(){
 	// 	// var menu = angular.element('#tree'), value;
 	// 	// if($scope.tree_toggled == false){
		// 	// menu.css('left', '30px')	
 	// 	// 	console.log('first');
 	// 	// }
 	// 	// else{
		// 	// menu.css('left', '-238px')
 	// 	// 	console.log('second');
 	// 	// }
 	// 	$scope.tree_toggled = !$scope.tree_toggled;

 	// }
 	// $scope.toggleDetails = function(){
 	// 	$scope.details_toggled = !$scope.details_toggled;
 	// }
 	
 	$scope.capitalize = function(s){
 		return scalear_utils.capitalize(s)
 	}

 	// $scope.impersonate = function(){
 	// 	emptyClipboard()
  //       var module_id = $stateParams.module_id
  //       if($scope.module_obj[module_id].items.length){
  //           $cookieStore.put('old_user_id', $rootScope.current_user.id)
  //           $cookieStore.put('state', $state.current.name)
  //           $cookieStore.put('params', $state.params)
  //           $scope.disable_preview = true
  //           var item = $scope.module_obj[module_id].items[0]
  //           ContentNavigator.close()
  //           Impersonate.create({},{course_id: $stateParams.course_id},
  //             function(data){
  //               $cookieStore.put('preview_as_student', true)            
  //               $cookieStore.put('new_user_id', data.user.id) 
  //               var params={course_id: $stateParams.course_id, module_id: module_id}
  //               params[item.class_name+'_id'] = item.id
  //               $rootScope.current_user= null
  //               $state.go('course.module.courseware.'+item.class_name,params,{reload:true})
  //               $rootScope.preview_as_student = true
  //               $scope.$emit('get_current_courses')
  //             },
  //             function(){
  //               console.log("Failed")
  //             }
  //           )
  //       }
  // 	}

 	$scope.addModule=function(callback){
    	Module.newModule({course_id: $stateParams.course_id, lang:$translate.uses()},{},
	    	function(data){
                data.group.items=[]
	    		data.group.new=true
	    		$scope.course.modules.push(data.group)
	    		$scope.module_obj[data.group.id] = $scope.course.modules[$scope.course.modules.length-1]
                $state.go('course.module.course_editor.overview', {module_id: data.group.id})
                ContentNavigator.open()
                if(callback)
                    callback(data.group.id)
	    	}, 
	    	function(){}
		);
    }

    $scope.removeModule=function(module){
    	Module.destroy(
    		{
    			course_id: $stateParams.course_id,
    			module_id: module.id
    		},{},
    		function(response){
				$scope.course.modules.splice($scope.course.modules.indexOf(module), 1)
				delete $scope.module_obj[module.id]
                emptyClipboard()
			 	if($stateParams.module_id == module.id)
			 		$state.go('course.course_editor')

    		},
    		function(){}
		);
    }

    var addItemBytype = function(type,module_id){
        if(type=='video')
             $scope.addLecture(module_id || $state.params.module_id)
        else if(type == 'link')
            $scope.addCustomLink(module_id || $state.params.module_id)            
        else
            $scope.addQuiz(module_id || $state.params.module_id, type)
    }

    $scope.addLecture=function(module_id){
    	$log.debug("adding lec "+ module_id)
    	$log.debug($scope.modules)
    	$scope.item_loading=true
    	Lecture.newLecture({course_id: $stateParams.course_id, group: module_id},
	    	function(data){
	    		$log.debug(data)
	    		data.lecture.class_name='lecture'
	    	    $scope.module_obj[module_id].items.push(data.lecture)
	    	    $scope.items_obj["lecture"][data.lecture.id] = $scope.module_obj[module_id].items[$scope.module_obj[module_id].items.length-1]
    			$scope.item_loading=false
                $state.go('course.module.course_editor.lecture', {lecture_id: data.lecture.id})
	    	}, 
	    	function(){}
		);
    }

    $scope.removeLecture=function(item){
    	Lecture.destroy(
    		{
    			course_id: $stateParams.course_id, 
    			lecture_id: item.id
    		},
    		{},
    		function(response){
                $scope.module_obj[item.group_id].items.splice($scope.module_obj[item.group_id].items.indexOf(item),1)
                delete $scope.items_obj["lecture"][item.id];
                emptyClipboard()
				if($state.params.lecture_id == item.id)
                    $state.go('course.module.course_editor.overview')
                $rootScope.$broadcast("update_module_time", item.group_id)
                $scope.$broadcast('update_module_statistics')
    		},
    		function(){}
		);
    }
    
    $scope.addQuiz=function(module_id, type){
    	$scope.item_loading=true
    	Quiz.newQuiz(
            {course_id: $stateParams.course_id, group: module_id, type:type},
        	{},
        	function(data){
        		$log.debug(data)
        		data.quiz.class_name='quiz'
        	    $scope.module_obj[module_id].items.push(data.quiz)
        	    $scope.items_obj["quiz"][data.quiz.id] = $scope.module_obj[module_id].items[$scope.module_obj[module_id].items.length-1]
    			$scope.item_loading=false
                $state.go('course.module.course_editor.quiz', {quiz_id: data.quiz.id})
        	}, 
        	function(){}
		);
    }
    
    $scope.removeQuiz=function(item){
	    	Quiz.destroy(
	    		{course_id: $stateParams.course_id,
	    		 quiz_id: item.id},
	    		{},
	    		function(response){
                    $scope.module_obj[item.group_id].items.splice($scope.module_obj[item.group_id].items.indexOf(item),1)
                    delete $scope.items_obj["quiz"][item.id];
                    emptyClipboard()
                    if($state.params.quiz_id == item.id)
                        $state.go('course.module.course_editor.overview')
                    $scope.$broadcast('update_module_statistics')
	    		},
	    		function(){}
			);
    }

    $scope.previewStudent=function(){
        Preview.start()
    }

    $scope.copy=function(item){
    	$rootScope.clipboard = {id:item.id, name:item.name, type:item.class_name||'module', show_msg:true}
    }

    var emptyClipboard = function(){
    	$rootScope.clipboard = null
    }

    $scope.paste=function(module_id){
    	var clipboard = $rootScope.clipboard
        
    	if(clipboard.type == 'module')
	 		pasteModule(clipboard)
        else{
            // var module_id = $scope.course.selected_module.id
            if(clipboard.type == 'lecture')
                pasteLecture(clipboard, module_id)
            else if(clipboard.type == 'quiz')
                pasteQuiz(clipboard, module_id)
            else if(clipboard.type == 'customlink')
                pastLink(clipboard, module_id)
        } 
    }

    var pasteModule=function(module){
   		$scope.module_overlay = true 
    	Module.moduleCopy(
		{course_id: $stateParams.course_id	},
		{module_id: module.id},
		function(data){
			console.log(data)
            $scope.course.modules.push(data.group)
    		$scope.module_obj[data.group.id] = data.group
    		$scope.module_obj[data.group.id].items.forEach(function(item){
    			$scope.items_obj[item.class_name][item.id] = item
    		})
			$scope.module_overlay=false
		},
		function(){}
		)
    }

    var pasteLecture=function(item, module_id){
    	$scope.item_overlay = true  
    	Lecture.lectureCopy(
    		{course_id: $stateParams.course_id},
    		{
    			lecture_id: item.id,
    			module_id :module_id
    		},
    		function(data){
    			$scope.item_overlay = false 
    			data.lecture.class_name='lecture'
    			$scope.module_obj[module_id].items.push(data.lecture)
                $scope.module_obj[module_id].total_time += data.lecture.duration
                $scope.items_obj["lecture"][data.lecture.id] = data.lecture
    		}, 
    		function(){}
		)
    }

    var pasteQuiz=function(item, module_id){
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
    			$scope.module_obj[module_id].items.push(data.quiz)
                $scope.items_obj["quiz"][data.quiz.id] = data.quiz
    		}, 
    		function(){}
		)
    }


    var pastLink=function(item,module_id){
        console.log("link copy")
        console.log(item)
        $scope.item_overlay = true  
        CustomLink.linkCopy(
            {
                link_id: item.id,
                course_id: $stateParams.course_id,
                module_id:module_id
            },
            {},
            function(data){
                console.log(data)
                $scope.item_overlay = false 
                data.link.class_name='customlink'
                $scope.module_obj[module_id].items.push(data.link)
                $scope.items_obj["customlink"][data.link.id] = $scope.module_obj[module_id].items[$scope.module_obj[module_id].items.length-1]
            }, 
            function(){}
        )
    }

    var openSharingModal = function(data){
        var modalInstance = $modal.open({
            templateUrl: '/views/teacher/course_editor/sharing_modal.html',
            controller: "sharingModalCtrl",
            resolve: {
                selected_module: function(){
                    // return $scope.course.selected_module
                    return $scope.module_obj[data.module_id]
                },
                selected_item: function(){
                    if(data.item){
                        return $scope.items_obj[data.item.class_name][data.item.id]
                    }
                }
            }
        });
    }

	var selectNone = function(){
		$scope.modules.forEach(function(module){
			module.selected = false
			module.items.forEach(function(item){
				item.selected = false
			})
		})
	}

	// $scope.addCustomLink=function(){
 //        Course.newCustomLink({course_id:$stateParams.course_id},
 //            {},
 //            function(doc){
 //                // $log.debug(doc)
 //                console.log(doc)
 //                doc.link.url = "http://"
 //                // $scope.module.custom_links.push(doc.link)
 //                $scope.course.custom_links.push(doc.link)
 //                ContentNavigator.open()
 //            }, 
 //            function(){}
 //        );
 //    }

     $scope.addCustomLink=function(module_id){
        Module.newCustomLink(
            {
                course_id:$stateParams.course_id, 
                module_id:module_id
            },
            {},
            function(data){
                data.link.url = "http://"
                data.link.class_name="customlink"
                $scope.module_obj[module_id].items.push(data.link)
                $scope.items_obj["customlink"][data.link.id] = $scope.module_obj[module_id].items[$scope.module_obj[module_id].items.length-1]
                $state.go('course.module.course_editor.customlink', {customlink_id: data.link.id})
            }, 
            function(){}
        );
    }

    $scope.removeCustomLink=function (elem) {
        console.log(elem)
        CustomLink.destroy(
            {link_id: elem.id},{},
            function(){
                $scope.module_obj[elem.group_id].items.splice($scope.module_obj[elem.group_id].items.indexOf(elem),1)
                delete $scope.items_obj["customlink"][elem.id];
                emptyClipboard()
                if($state.params.customlink_id == elem.id)
                    $state.go('course.module.course_editor.overview')
                $scope.$broadcast('update_module_statistics')
            }, 
            function(){}
        );
    }

   

}]);