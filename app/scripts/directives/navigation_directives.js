'use strict';

angular.module('scalearAngularApp')
	.directive('mainNavigation', ['Course', '$filter', '$rootScope', function(Course, $filter, $rootScope){
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
				scope.today = new Date();
				// $rootScope.$watch('are_shared', function(){
				// 	scope.are_shared = $rootScope.are_shared
				// })
				scope.are_shared = function(){
					return scope.user && scope.user.roles[0].id!=2 && scope.user.accepted_shared
				}
				scope.getEndDate = function(start_date, duration){
					return start_date.setDate(start_date.getDate()+(duration * 7));
				}
			}
		};
	 }])
	.directive('teacherNavigation', ['$rootScope','$state', function($rootScope, $state) {
           return{
			replace:true,
			restrict: "E",
			scope:{
				modules:"=",
				links:"=",
        selectedmodule: "=",
        shortname: "="
			},
			templateUrl: '/views/teacher_sub_navigation.html',
			link: function(scope){
				scope.addModule=function(){
					$rootScope.$broadcast('add_module')
				}	
				scope.preview=function(){
					$rootScope.$broadcast('activate_preview')
				}
				scope.goToContentEditor=function(){
					console.log($state.includes("**.course_editor.**"))
					if(!$state.includes("**.course_editor.**"))
						$state.go("course.module.course_editor.overview")
				}

				scope.goToProgress=function(){
					if(!$state.includes("**.progress.**")){}
						$state.go("course.module.progress")
				}			
			}
		};
 }]).directive('studentNavigation', ['ErrorHandler',function(ErrorHandler) {
           return{
			replace:true,
			restrict: "E",
      transclude: true,
			scope:{
				modules:"=",
				links:"=",
        selectedmodule: "=",
        shortname: "="
			},
			templateUrl: '/views/student_sub_navigation.html',
			link: function(scope){
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
 }]).directive('contentNavigator',['Module', '$stateParams', '$state', '$timeout','Lecture', function(Module, $stateParams, $state, $timeout, Lecture){
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
   	  scope.currentmodule = {id: $state.params.module_id}
   	  scope.moduleSortableOptions={
 		axis: 'y',
		dropOnEmpty: false,
		handle: '.handle',
		cursor: 'crosshair',
		items: '.module',
		opacity: 0.4,
		scroll: true,
		update: function(e, ui) {
			scope.$apply()
			console.log(scope.modules)
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
	scope.toggleNavigator = function(){
		scope.open_navigator = !scope.open_navigator
	}

      scope.showModuleCourseware = function(module){
        if(!scope.currentmodule || module.id != scope.currentmodule.id || module.id != $stateParams.module_id){
          scope.currentmodule = module//$scope.modules_obj[module_id];
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
  	 	var params = {'module_id': scope.currentmodule.id}    
        params[item.class_name+'_id'] = item.id
        $state.go('course.module.courseware.'+ item.class_name, params)
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
      	scope.currentmodule = module
        console.log('mahmoud menshawi')
        console.log(scope.currentmodule)
      }
   }
  }
}]);
