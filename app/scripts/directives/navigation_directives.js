'use strict';

angular.module('scalearAngularApp')
	.directive('mainNavigation', ['$state', '$tour','scalear_api','$timeout','$cookieStore', '$rootScope', 'Impersonate', 'ContentNavigator','User','Preview', function($state, $tour, scalear_api, $timeout, $cookieStore, $rootScope, Impersonate, ContentNavigator, User, Preview){
		return {
			replace: true,
			restrict: "E",
			transclude: "true",
			scope:{
			  user: '=',
			  // logout: '&',
			  // changelanguage: '=',
			  courses:'='
			},
			templateUrl: "/views/main_navigation.html",
			link: function (scope, element) {
				scope.scalear_api = scalear_api

				$rootScope.$watch('preview_as_student', function(){
					scope.preview_as_student = $rootScope.preview_as_student
				})

				scope.logout = function() {
	                $rootScope.logging_out = true;
	                $timeout(function() {
	                    User.sign_out({}, function() {
	                        $rootScope.show_alert = "";
	                        $rootScope.current_user = null
	                        $state.go("login");
	                        $rootScope.logging_out = false;
	                    });
	                }, 200);  
	            }

				
				scope.areShared = function(){
					return scope.user && scope.user.roles[0].id!=2 && scope.user.accepted_shared
				}
				scope.getEndDate = function(start_date, duration){
					return start_date.setDate(start_date.getDate()+(duration * 7));
				}

				scope.goToCourse=function(course){
					if(course.id != $state.params.course_id)
						$state.go('course', {course_id: course.id})
				}
				// scope.startTour = $tour.start
				// scope.endTour = $tour.end
				scope.startTour = function(){
					console.log($state.current.name)
					scope.$emit('start_tour', {state: $state.current.name})
				}
				scope.closeMenu=function(event){
					if(!angular.element(event.target).closest('li').hasClass("back"))
						$timeout(function(){
							angular.element('.toggle-topbar').click();
						})							
				}

				scope.disablePreview=function(){
					Preview.stop()
	                // if($cookieStore.get('preview_as_student')){
	                //   ContentNavigator.close()
	                //   $rootScope.$broadcast("exit_preview")
	                //   Impersonate.destroy(
	                //     {
	                //         old_user_id:$cookieStore.get('old_user_id'),
	                //         new_user_id:$cookieStore.get('new_user_id')
	                //     },
	                //     function(){
	                //       var params = $cookieStore.get('params')
	                //       var state = $cookieStore.get('state')
	                //       $rootScope.preview_as_student = false
	                //       $cookieStore.remove('preview_as_student')
	                //       $cookieStore.remove('old_user_id')
	                //       $cookieStore.remove('new_user_id')
	                //       $cookieStore.remove('params')
	                //       $cookieStore.remove('state')
	                //       $rootScope.current_user= null
	                //       $state.go(state, params,{reload:true})
			              // $rootScope.$broadcast('get_current_courses')
	                //     },
	                //     function(){
	                //       console.log("Failed Closing Preview")
	                //       $rootScope.preview_as_student = false
	                //       $cookieStore.remove('preview_as_student')
	                //       $cookieStore.remove('old_user_id')
	                //       $cookieStore.remove('new_user_id')
	                //       $cookieStore.remove('params')
	                //       $cookieStore.remove('state')
	                //     }
	                //   )
	                // }
	            }
			}
		};
	 }])
	.directive('teacherNavigation', ['$rootScope','$state','ContentNavigator','DetailsNavigator','Impersonate','$cookieStore', function($rootScope, $state, ContentNavigator, DetailsNavigator, Impersonate, $cookieStore) {
           return{
			replace:true,
			restrict: "E",
			scope:{
				course:"=",
				message:"="
				// modules:"=",
				// links:"=",
		  //       selectedmodule: "=",
		  //       shortname: "="
			},
			templateUrl: '/views/teacher_sub_navigation.html',
			link: function(scope){
				//  initFilters()
				scope.ContentNavigator = ContentNavigator
				scope.DetailsNavigator = DetailsNavigator
				scope.$state = $state
				scope.$watch("$state.includes('*.module.**')",function(value){
					scope.in_module_state = value
				})

				// $rootScope.$watch('clipboard', function(){
				// 	scope.clipboard = $rootScope.clipboard
				// })

				// $rootScope.$on('open_navigator', function(){
				// 	 setNavigator(true)
				// })

				// $rootScope.$on('close_navigator', function(){
				// 	 setNavigator(false)
				// })

				scope.initFilters=function(){
					scope.progress_item_filter= {lecture_quizzes:true,confused:true, charts:true, discussion:true, free_question:true};
					scope.progress_filter= {quiz:true, survey:true};
				}

				scope.toggleNavigator=function(){
					ContentNavigator.setStatus(!ContentNavigator.getStatus())
				}

				var setNavigator=function(val){
					ContentNavigator.setStatus(val)
				}

				scope.toggleDetails=function(){
					DetailsNavigator.setStatus(!DetailsNavigator.getStatus())
				}

				var setDetails=function(val){
					DetailsNavigator.setStatus(val)
				}

				// scope.addModule=function(){
				// 	$rootScope.$broadcast('add_module')
				// }	
				// scope.preview=function(){
				// 	// $rootScope.$broadcast('activate_preview')
				// 	// emptyClipboard()
			 //        // var module_id = $state.params.module_id
		  //           $cookieStore.put('old_user_id', $rootScope.current_user.id)
		  //           $cookieStore.put('state', $state.current.name)
		  //           $cookieStore.put('params', $state.params)
		  //           scope.disable_preview = true
		  //           // var item = $scope.module_obj[module_id].items[0]
		  //           setNavigator(false)
		  //           Impersonate.create({},{course_id: $state.params.course_id},
		  //             function(data){
		  //               $cookieStore.put('preview_as_student', true)            
		  //               $cookieStore.put('new_user_id', data.user.id)
		  //               $rootScope.current_user= null 
		  //               var params={course_id: $state.params.course_id}
		  //               if($state.params.module_id){
		  //               	params['module_id']= $state.params.module_id
		  //               	$state.go('course.module.courseware',params,{reload:true})
		  //               }
		  //               else if($state.includes("course.edit_course_information"))
		  //               	$state.go('course.course_information',params,{reload:true})
		  //               else{
		  //               	$state.go('course',params,{reload:true})
		  //               }

		  //               $rootScope.preview_as_student = true
		  //               scope.$emit('get_current_courses')
		  //             },
		  //             function(){
		  //               console.log("Failed")
		  //             }
		  //           )
				// }

				// scope.addLink=function(){
				// 	$rootScope.$broadcast('add_link')
				// }
				// scope.goToContentEditor=function(){
				// 	if(!$state.includes("**.course_editor.**")){
				// 		if($state.params.module_id)
				// 			$state.go("course.module.course_editor.overview")
				// 		else
				// 			$state.go("course.course_editor")
				// 	}
				// }

				// scope.goToProgress=function(){
				// 	$state.includes("**.module.**")? $state.go("course.module.progress") : $state.go("course.progress")
				// }

				// scope.goToClass=function(){
				// 	$state.includes("**.module.**")? $state.go("course.module.inclass") : $state.go("course.inclass")
				// }
				// scope.copyItem = function(){
				// 	if($state.params.link_id)
				// 		var item = {class_name: 'customlink', id: $state.params.link_id}
				// 	else if($state.params.lecture_id)
				// 		var item = {class_name: 'lecture', id: $state.params.lecture_id}
				// 	else if($state.params.quiz_id)
				// 		var item = {class_name: 'quiz', id: $state.params.quiz_id}
				// 	$rootScope.$broadcast('copy_item', item)
				// }

				scope.pasteItem = function(){
					$rootScope.$broadcast('paste_item')
				}

				scope.print=function(){
					$rootScope.$broadcast('print')
				}	

				scope.updateProgressItemFilter=function(type){
					if(type =='lecture_quizzes'){
						scope.progress_item_filter['charts'] = !scope.progress_item_filter['lecture_quizzes']
						scope.progress_item_filter['free_question'] = !scope.progress_item_filter['lecture_quizzes']
					}
					scope.progress_item_filter[type] = !scope.progress_item_filter[type]
					$rootScope.$broadcast('progress_item_filter_update', scope.progress_item_filter)
				}

				scope.updateProgressFilter=function(type){
					scope.progress_filter[type] = !scope.progress_filter[type]
					$rootScope.$broadcast('progress_filter_update', scope.progress_filter)
				}	

				setDetails(true)	
			}
		};
 }]).directive('studentNavigation', ['$cookieStore', '$rootScope', '$state', 'Impersonate', 'ContentNavigator','TimelineNavigator', function($cookieStore, $rootScope, $state, Impersonate, ContentNavigator, TimelineNavigator) {
           return{
			replace:true,
			restrict: "E",
      		transclude: true,
			scope:{
				course:"=",
				message:"="
				// modules:"=",
				// links:"=",
		  //       selectedmodule: "=",
		  //       shortname: "=",
		        // warning_message:"=warning"
			},
			templateUrl: '/views/student_sub_navigation.html',
			link: function(scope){
				// scope.open_navigator = $rootScope.open_navigator
				scope.ContentNavigator = ContentNavigator
				scope.TimelineNavigator = TimelineNavigator
				

				scope.toggleNavigator=function(){
					ContentNavigator.setStatus(!ContentNavigator.getStatus())
				}

				var setNavigator=function(val){
					ContentNavigator.setStatus(val)
				}

				scope.toggleTimeline=function(){
					TimelineNavigator.setStatus(!TimelineNavigator.getStatus())
				}

				var setTimeline=function(val){
					TimelineNavigator.setStatus(val)
				}

				
				// setNavigator(true)
			}
		};
 }]).directive('userNavigation', ['$rootScope', 'User', 'Home',function($rootScope, User, Home) {
           return{
			replace:true,
			restrict: "E",
			scope: {
				courses: "=",
				//currentuser: '=',
				iscollapsed: '=',
				role: '='
			},
			templateUrl: '/views/user_navigation.html',
			link: function(scope){
				$rootScope.$watch('current_user', function(){
					if($rootScope.current_user && $rootScope.current_user.roles){
						scope.arenotification = $rootScope.current_user.roles[0].id!=2 && ($rootScope.current_user.invitations || $rootScope.current_user.shared);
						scope.areshared = $rootScope.current_user.roles[0].id!=2 && $rootScope.current_user.accepted_shared;	
					}
				});
				scope.toggleNotifications = function(){
					scope.show_notifications = !scope.show_notifications;
					scope.show_settings = false;
				}
				scope.toggleSettings = function(){
					scope.show_notifications = false;
					scope.show_settings = !scope.show_settings;
				}
				scope.update_account = function() {
	                scope.sending = true;
	                delete $rootScope.current_user.errors
	                User.update_account({}, {
	                    user: $rootScope.current_user
	                }, function() {
	                    scope.sending = false;
	                    //console.log("signed up");
	                    scope.iscollapsed=true;
	                }, function(response) {
	                    scope.sending = false;
	                    $rootScope.current_user.errors = response.data.errors
	                    //console.log("sign up failed")
	                })
	            };
	            scope.$on('mainMenuToggled', function(event, collapsed){
					scope.show_settings = false;
					scope.show_notifications = false;
				})
			}
		};
 }]).directive('contentNavigator',['Module', '$stateParams', '$state', '$timeout','Lecture','Course','ContentNavigator','$rootScope','Preview',function(Module, $stateParams, $state, $timeout, Lecture, Course, ContentNavigator, $rootScope, Preview){
  return{
    restrict:'E',
    replace: true,
    transclude: true,
    scope:{
      // links:'=',
      modules: '=',
      mode: '@',
      open_navigator:'=open'
    },
    templateUrl:"/views/content_navigator.html",
	link:function(scope, element, attr){
   	  scope.$state = $state
	  var unwatch = scope.$watch('$state.params',function(){
	  	if($state.params.module_id){
	  		scope.currentmodule = {id: $state.params.module_id}
   	  		scope.currentitem = {id: $state.params.lecture_id || $state.params.quiz_id || $state.params.customlink_id}
	  	}
	  	else{
	  		scope.currentmodule = null
	  		scope.currentitem = null
	  	}

   	  })

	  	$rootScope.$watch('clipboard', function(){
			scope.clipboard = $rootScope.clipboard
		})

   		scope.$on('item_done',function(ev,item){
   			var time = 0
   			if(!ContentNavigator.getStatus()){
		   		ContentNavigator.open()
		   		time= 700
		   	}
		   	$timeout(function(){
	   			if(!item.is_done){
	   				item.is_done = true
	   				item.blink = true
	   				$timeout(function(){
				   		item.blink = false
				   	}, 1000)
	   			}	   			
	   		},time)
		   
   		})

   	  scope.moduleSortableOptions={
 		axis: 'y',
		dropOnEmpty: false,
		handle: '.handle',
		cursor: 'crosshair',
		items: '.module',
		opacity: 0.4,
		scroll: true,
		update: function(e, ui) {
			// scope.$apply()
			// console.log(scope.modules)
			Module.saveSort({course_id:$state.params.course_id},
				{group: scope.modules},
				function(response){
					// $log.debug(response)
				},
				function(){
					// $log.debug('Error')
				}
			);
		},
 	}
 	scope.itemSortableOptions={
		axis: 'y',
		dropOnEmpty: false,
		handle: '.handle',
		cursor: 'crosshair',
		items: '.item',
		opacity: 0.4,
		scroll: true,
		update: function(e, ui) {
			var group_id=ui.item.scope().item.group_id
			var items=ui.item.scope().$parent.module.items
			Lecture.saveSort(
				{course_id:$state.params.course_id, 
				 group: group_id},
				{items: items},
				function(response){
					// $log.debug(response)
				},
				function(){
					// $log.debug('error')
				}
			);
		},
 	}

 	// scope.listSortableOptions={
		// axis: 'y',
		// dropOnEmpty: false,
		// handle: '.handle',
		// cursor: 'crosshair',
		// items: '.links',
		// opacity: 0.4,
		// scroll: true,
		// update: function(e, ui) {
		// 	Course.sortCourseLinks({course_id:$state.params.course_id},
		// 		{links: scope.links},
		// 		function(response){
		// 			// $log.debug(response)
		// 		},
		// 		function(){
		// 			// $log.debug('Error')
		// 		}
		// 	);
		// },
 	// }
	// scope.toggleNavigator = function(){
	// 	scope.open_navigator = !scope.open_navigator
	// }

  	scope.showModuleCourseware = function(module, event){
  		if((module.lectures.length + module.quizzes.length) > 0){
	        if(!scope.currentmodule || scope.currentmodule.id != module.id){
	          scope.currentmodule = module//$scope.module_obj[module_id];
	          Module.getLastWatched(
	            {
	            	course_id: $stateParams.course_id, 
	            	module_id: module.id
	            }, 
	            function(data){
	              if(data.last_watched != -1){
	                $state.go('course.module.courseware.lecture', {'module_id': module.id, 'lecture_id': data.last_watched})
	                scope.currentitem = {id:data.last_watched}
	              }
	              else{
	                $state.go('course.module.courseware.quiz', {'module_id': module.id, 'quiz_id': module.quizzes[0].id})
	                scope.currentitem = {id:module.quizzes[0].id}
	              }
	          }) 
	        }
	        else
	          event.stopPropagation()
	  	}
	  	else
	  		scope.currentmodule = null
  	}
               
  	scope.showItem = function(item, type){
  		if($state.includes("**.progress.**")){
  			if($state.includes("course.module.progress"))
  				$rootScope.$broadcast("scroll_to_item",item)
  		}
  		else{
  			// if(item.class_name!='customlink'){
		 		var params = {'module_id': $state.params.module_id}  
		 		console.log(item)  
			    params[item.class_name.toLowerCase()+'_id'] = item.id
			    $state.go('course.module.'+type+'.'+ item.class_name.toLowerCase(), params)
			// }
			if(!(type =='courseware' && item.class_name=='customlink')){
		    	scope.currentitem = {id:item.id}
		    	// $state.params.link_id = item.id
			}
		}
  	}

 	scope.showModule=function(module, event){
 		// console.log(scope.currentmodule)
 		if(scope.currentmodule && scope.currentmodule.id == module.id)
        	event.stopPropagation()
        // else{
 		if($state.includes("course.module.progress") || $state.includes("course.progress") || $state.includes("course.progress_main"))
 			$state.go('course.module.progress',{module_id: module.id})
 		else if ($state.includes("course.module.progress_details")){
 			$state.go('course.module.progress_details',{module_id: module.id})
 		}
 		else if($state.includes("course.module.inclass") || $state.includes("course.inclass")){
 			$state.go('course.module.inclass',{module_id: module.id})
 		}
 		else
    		$state.go('course.module.course_editor.overview',{module_id: module.id})
    	scope.currentmodule = module
	    // }    	
    }

    scope.preview=function(){
    	Preview.start()
    }

    scope.addModule=function(){
		$rootScope.$broadcast('add_module')
	}	

	scope.paste=function(){
		if(scope.clipboard.type == 'module')
			$rootScope.$broadcast('paste_item')
	}

    // scope.showCourseLinks=function(){
    // 	scope.currentmodule = null
    // }

  	scope.goToCourseInfoStudent=function(){
	  	scope.currentmodule = null
	  	$state.go("course.course_information")
  	}

  	// scope.goToCourseInfoTeacher=function(){
   //    	scope.currentmodule = null
   //    	$state.go("course.edit_course_information")

  	// }
  	
   }
  }
}]);
