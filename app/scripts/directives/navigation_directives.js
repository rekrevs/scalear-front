'use strict';

angular.module('scalearAngularApp')
	.directive('mainNavigation', ['$state', function($state){
		return {
			replace: true,
			restrict: "E",
			transclude: "true",
			scope:{
			  user: '=',
			  logout: '=',
			  changelanguage: '=',
			  courses:'='
			},
			templateUrl: "/views/main_navigation.html",
			link: function (scope, element) {
				// scope.today = new Date();
				// $rootScope.$watch('are_shared', function(){
				// 	scope.are_shared = $rootScope.are_shared
				// })
				scope.are_shared = function(){
					return scope.user && scope.user.roles[0].id!=2 && scope.user.accepted_shared
				}
				scope.getEndDate = function(start_date, duration){
					return start_date.setDate(start_date.getDate()+(duration * 7));
				}

				scope.goToCourse=function(course){
					if(course.id != $state.params.course_id)
						$state.go('course', {course_id: course.id})
				}
			}
		};
	 }])
	.directive('teacherNavigation', ['$rootScope','$state', function($rootScope, $state) {
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
				scope.progress_item_filter= {lecture_quizzes:true,confused:true, charts:true, discussion:true, free_question:true};
				scope.progress_filter= {quiz:true, survey:true};
				scope.$state = $state
				scope.$watch("$state.includes('*.module.**')",function(value){
					scope.in_module_state = value
				})

				$rootScope.$watch('clipboard', function(){
					scope.clipboard = $rootScope.clipboard
				})

				$rootScope.$on('open_navigator', function(){
					 setNavigator(true)
				})

				$rootScope.$on('close_navigator', function(){
					 setNavigator(false)
				})


				scope.toggleNavigator=function(){
					scope.open_navigator = !scope.open_navigator
					scope.$emit('navigator_change', scope.open_navigator)
				}

				var setNavigator=function(val){
					scope.open_navigator = val
					scope.$emit('navigator_change', scope.open_navigator)
				}

				scope.addModule=function(){
					$rootScope.$broadcast('add_module')
				}	
				scope.preview=function(){
					$rootScope.$broadcast('activate_preview')
				}
				scope.addLink=function(){
					$rootScope.$broadcast('add_link')
				}
				scope.goToContentEditor=function(){
					if(!$state.includes("**.course_editor.**")){
						if($state.params.module_id)
							$state.go("course.module.course_editor.overview")
						else
							$state.go("course.course_editor")
					}
				}

				scope.goToProgress=function(){
					if($state.includes("**.module.**"))
						$state.go("course.module.progress")
				}
				scope.copyItem = function(){
					if($state.params.lecture_id){
						var item = {class_name: 'lecture', id: $state.params.lecture_id}
					}
					else if($state.params.quiz_id){
						var item = {class_name: 'quiz', id: $state.params.quiz_id}
					}
					$rootScope.$broadcast('copy_item', item)
				}
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
			}
		};
 }]).directive('studentNavigation', ['ErrorHandler', '$cookieStore', '$rootScope', '$state', 'Impersonate', function(ErrorHandler, $cookieStore, $rootScope, $state, Impersonate) {
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
				scope.lecture_filter={quiz:true,confused:true, discussion:true, note:true};
				scope.course_filter = "!!"
				$rootScope.$watch('preview_as_student', function(){
					scope.preview_as_student = $rootScope.preview_as_student
				})

				$rootScope.$on('open_navigator', function(){
					setNavigator(true)
				})

				$rootScope.$on('close_navigator', function(){
					setNavigator(false)
				})

				scope.toggleNavigator=function(){
					scope.open_navigator = !scope.open_navigator
					scope.$emit('navigator_change', scope.open_navigator)
				}

				var setNavigator=function(val){
					scope.open_navigator = val
					scope.$emit('navigator_change', scope.open_navigator)
				}

				scope.disablePreview=function(){
	                if($cookieStore.get('preview_as_student')){
	                  setNavigator(false)
	                  $rootScope.$broadcast("exit_preview")
	                  Impersonate.destroy(
	                    {
	                        old_user_id:$cookieStore.get('old_user_id'),
	                        new_user_id:$cookieStore.get('new_user_id')
	                    },
	                    function(d){
	                      console.log(d)
	                      console.log("good")
	                      // var course_id = $cookieStore.get('course_id')
	                      // var module_id = $cookieStore.get('module_id')
	                      var params = $cookieStore.get('params')
	                      var state = $cookieStore.get('state')
	                      $rootScope.preview_as_student = false
	                      $cookieStore.remove('preview_as_student')
	                      $cookieStore.remove('old_user_id')
	                      $cookieStore.remove('new_user_id')
	                      $cookieStore.remove('params')
	                      $cookieStore.remove('state')
	                      $rootScope.current_user= null
	                      $state.go(state, params,{reload:true})
			              $rootScope.$broadcast('get_all_courses')
	                    },
	                    function(){
	                      console.log("bad")
	                      $rootScope.preview_as_student = false
	                      $cookieStore.remove('preview_as_student')
	                      $cookieStore.remove('old_user_id')
	                      $cookieStore.remove('new_user_id')
	                      $cookieStore.remove('params')
	                      $cookieStore.remove('state')
	                    }
	                  )
	                }
	            }

	            scope.exportNotes=function(){
	            	$rootScope.$broadcast("export_notes")
	            }

	            scope.updateLectureFilter=function(type){
					scope.lecture_filter[type] = !scope.lecture_filter[type]
					$rootScope.$broadcast('lecture_filter_update', scope.lecture_filter)
				}

				scope.updateCourseFilter=function(value){
					scope.course_filter= value
					$rootScope.$broadcast('course_filter_update', scope.course_filter)
				}	
			}
		};
 }]).directive('userNavigation', ['ErrorHandler','$rootScope', 'User', 'Home',function(ErrorHandler,$rootScope, User, Home) {
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
 }]).directive('contentNavigator',['Module', '$stateParams', '$state', '$timeout','Lecture','Course', function(Module, $stateParams, $state, $timeout, Lecture, Course){
  return{
    restrict:'E',
    // replace: true,
    transclude: true,
    scope:{
      links:'=',
      modules: '=',
      // currentmodule: '=',
      // currentitem: '=',
      // scrollto: '=',
      mode: '@',
      open_navigator:'=open'
    },
    templateUrl:"/views/content_navigator.html",
   link:function(scope, element, attr){
   	  scope.$state = $state
	  var unwatch = scope.$watch('$state.params.module_id',function(){
	  	if($state.params.module_id){
	  		scope.currentmodule = {id: $state.params.module_id}
   	  		scope.currentitem = $state.params.lecture_id || $state.params.quiz_id
	  		// unwatch()
	  	}
   	  })
   	  // scope.$watch('modules.length',function(){
   	  // 	if(scope.modules)
   	  // 		scope.currentmodule = {id: $state.params.module_id}
   	  // })

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
			var group_position=ui.item.scope().$parent.module.position -1
			Lecture.saveSort(
				{course_id:$state.params.course_id, 
				 group: group_id},
				{items: scope.modules[group_position].items},
				function(response){
					// $log.debug(response)
				},
				function(){
					// $log.debug('error')
				}
			);
		},
 	}

 	scope.listSortableOptions={
		axis: 'y',
		dropOnEmpty: false,
		handle: '.handle',
		cursor: 'crosshair',
		items: '.links',
		opacity: 0.4,
		scroll: true,
		update: function(e, ui) {
			Course.sortCourseLinks({course_id:$state.params.course_id},
				{links: scope.links},
				function(response){
					// $log.debug(response)
				},
				function(){
					// $log.debug('Error')
				}
			);
		},
 	}
	scope.toggleNavigator = function(){
		scope.open_navigator = !scope.open_navigator
	}

  	scope.showModuleCourseware = function(module){
        if(module.id != $state.params.module_id){
          scope.currentmodule = module//$scope.module_obj[module_id];
          // $scope.close_selector = true;
          Module.getLastWatched(
            {course_id: $stateParams.course_id, module_id: module.id}, function(data){
              // $timeout(function(){
              //   scope.toggleNavigator();
              // })
              if(data.last_watched != -1){
                $state.go('course.module.courseware.lecture', {'module_id': module.id, 'lecture_id': data.last_watched})
                scope.currentitem = data.last_watched
              }
              else{
                $state.go('course.module.courseware.quiz', {'module_id': module.id, 'quiz_id': module.quizzes[0].id})
                scope.currentitem = module.quizzes[0].id
              }
          }) 
        }  
  	}

      // $scope.goToContent=function(){
               
      scope.showItemCourseware = function(item){
  	 	var params = {'module_id': $state.params.module_id}    
        params[item.class_name.toLowerCase()+'_id'] = item.id
        $state.go('course.module.courseware.'+ item.class_name.toLowerCase(), params)
        scope.currentitem = item.id
        // console.log(item)
        // // $timeout(function(){
        // //   scope.toggleNavigator();
        // // })
        // // var item_id = item.get_class_name.toLowerCase()+'_id';
        // if(item.get_class_name.toLowerCase() == 'lecture'){
        //   $state.go('course.module.courseware.'+item.get_class_name.toLowerCase(), {'module_id': scope.currentmodule.id, 'lecture_id': item.id})
        // }
        // else if(item.get_class_name.toLowerCase() == 'quiz'){
        //   $state.go('course.module.courseware.'+item.get_class_name.toLowerCase(), {'module_id': scope.currentmodule.id, 'quiz_id': item.id})
        // }
        // console.log('course.module.courseware.'+item.get_class_name.toLowerCase()+' ahoo')
      }

      // scope.showModuleInclass = function(module){
      //   $timeout(function(){
      //     scope.toggleNavigator();
      //   })
      //   scope.currentmodule = module//$scope.getSelectedModule()
      //   $state.go('course.inclass.module',{module_id: module.id})
      //   // $scope.toggleSelector();
      // }

      // scope.showModuleProgress = function(index){
      //   scope.currentmodule = scope.modules[index]
      //   // scope.toggleNavigator();
      // }
      // scope.showItemProgress = function(item){
      //   $timeout(function(){$state.go('course.progress.lecture', {module_id: item.group_id});});
      //   scope.scrollto(item);
      // }

      scope.clearCurrent = function(event){
        event.stopPropagation();
        scope.currentmodule = null;
        scope.currentitem = null;
      }
      scope.setCurrentModule=function(module){
      	// if($state.includes("*.progress.*"))
      	// 	$state.go('course.progress.lecture',{module_id: module.id})
      	// else if($state.includes("*.inclass.*"))
      	// 	$state.go('course.inclass.module',{module_id: module.id})
      	// else
      	// 	$state.go('course.module.course_editor.overview',{module_id: module.id})
      		// scope.open_this_link = false
      	scope.currentmodule = module
      }

      scope.goToCourseInfoStudent=function(){
      	scope.currentmodule = null
      	$state.go("course.course_information")

      }

   	  scope.goToCourseInfoTeacher=function(){
      	scope.currentmodule = null
      	$state.go("course.edit_course_information")

      }
   }
  }
}]);
