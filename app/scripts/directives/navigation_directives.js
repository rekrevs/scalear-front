'use strict';

angular.module('scalearAngularApp')
	.directive('mainNavigation', ['$state', '$tour','scalear_api','$timeout','$cookieStore', '$rootScope', 'Impersonate', 'ContentNavigator','User','Preview','$log', function($state, $tour, scalear_api, $timeout, $cookieStore, $rootScope, Impersonate, ContentNavigator, User, Preview, $log){
		return {
			replace: true,
			restrict: "E",
			transclude: "true",
			scope:{
			  user: '=',
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

				scope.startTour = function(){
					$log.debug($state.current.name)
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
			},
			templateUrl: '/views/teacher/teacher_sub_navigation.html',
			link: function(scope){
				scope.ContentNavigator = ContentNavigator
				scope.DetailsNavigator = DetailsNavigator
				scope.$state = $state
				scope.$watch("$state.includes('*.module.**')",function(value){
					scope.in_module_state = value
				})

				scope.initFilters=function(){
					scope.progress_item_filter= {lecture_quizzes:true,confused:true, charts:true, discussion:true, free_question:true};
					scope.progress_filter= {quiz:true, survey:true};
				}

				scope.toggleNavigator=function(){
					ContentNavigator.setStatus(!ContentNavigator.getStatus())
				}

				scope.toggleDetails=function(){
					DetailsNavigator.setStatus(!DetailsNavigator.getStatus())
				}

				var setDetails=function(val){
					DetailsNavigator.setStatus(val)
				}

				scope.goToEditor=function(){
					$state.includes("**.module.**")? $state.go("course.module.course_editor.overview") : $state.go("course.course_editor")					
				}

				scope.goToProgress=function(){
					$state.includes("**.module.**")? $state.go("course.module.progress_overview") : $state.go("course.progress_overview")
				}

				scope.goToClass=function(){
					$state.includes("**.module.**")? $state.go("course.module.inclass") : $state.go("course.inclass")
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

				setDetails(true)	
			}
		};
 }]).directive('studentNavigation', ['ContentNavigator','TimelineNavigator','$state', function(ContentNavigator, TimelineNavigator, $state) {
           return{
			replace:true,
			restrict: "E",
      		transclude: true,
			scope:{
				course:"=",
				message:"="
			},
			templateUrl: '/views/student/student_sub_navigation.html',
			link: function(scope){
				scope.ContentNavigator = ContentNavigator
				scope.TimelineNavigator = TimelineNavigator				

				scope.toggleNavigator=function(){
					if(!$state.includes('course.content_selector'))
						ContentNavigator.setStatus(!ContentNavigator.getStatus())
				}

				scope.toggleTimeline=function(){
					TimelineNavigator.setStatus(!TimelineNavigator.getStatus())
				}
			}
		};
 }]).directive('contentNavigator',['Module', '$stateParams', '$state', '$timeout','Lecture','Course','ContentNavigator','$rootScope','Preview','$log','MobileDetector', function(Module, $stateParams, $state, $timeout, Lecture, Course, ContentNavigator, $rootScope, Preview, $log, MobileDetector){
  	return{
	    restrict:'E',
	    replace: true,
	    transclude: true,
	    scope:{
	      modules: '=',
	      mode: '@',
	      open_navigator:'=open'
	    },
	    templateUrl:"/views/content_navigator.html",
		link:function(scope, element, attr){
	  		scope.$state = $state
	  		scope.$watch('$state.params',function(){
			  	if($state.params.module_id){
			  		scope.currentmodule = {id: $state.params.module_id}
		   	  		scope.currentitem = {id: $state.params.lecture_id || $state.params.quiz_id || $state.params.customlink_id}
		   	  		$timeout(function(){
			    		scope.scrollIntoView(scope.currentmodule)
			    	})
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
					Module.saveSort({course_id:$state.params.course_id},
						{group: scope.modules}
					);
				}
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
						{items: items}
					);
				}
		 	}

		  	scope.showModuleCourseware = function(module, event){
		  		if((module.lectures.length + module.quizzes.length) > 0){
			        if(!scope.currentmodule || scope.currentmodule.id != module.id){
			          	scope.currentmodule = module
			          	if(!MobileDetector.isPhone()){
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
				      	else{
			      		 	event.stopPropagation()
				      		$timeout(function(){
								ContentNavigator.close()
							})
							$state.go('course.module.student_inclass',{'module_id': module.id})
				      	}
			        }
			        else
			          event.stopPropagation()
			  	}
			  	else
			  		scope.currentmodule = null
		  	}
		               
		  	scope.showItem = function(item, mode){
		  		if($state.includes("**.progress.**") || $state.includes("**.progress_overview")){
		  			if($state.includes("course.module.progress"))
		  				$rootScope.$broadcast("scroll_to_item",item)
		  		}
		  		else{
			 		var params = {'module_id': item.group_id}  
			 		$log.debug(item)
			 		var item_type =item.class_name.toLowerCase()
				    params[item_type+'_id'] = item.id
						// if(MobileDetector.isPhone()){
						// 	$timeout(function(){
						// 		ContentNavigator.close()
						// 	})
					if(!MobileDetector.isPhone()){
			    		$state.go('course.module.'+mode+'.'+item_type, params)
				    }
					if(!(mode =='courseware' && item_type=='customlink')){
				    	scope.currentitem = {id:item.id}
					}

				}
		  	}

		 	scope.showModule=function(module, event){
		 		if(scope.currentmodule && scope.currentmodule.id == module.id)
		        	event.stopPropagation()
		    	if($state.includes("course.progress_overview") || $state.includes("course.progress_main") ||  $state.includes("course.progress_graph") || $state.includes("course.progress"))
		    		$state.go('course.module.progress_overview',{module_id: module.id})
		 		else if($state.includes("course.module.progress_overview") || $state.includes("course.module.progress")  ||  $state.includes("course.module.progress_statistics") || $state.includes("course.module.progress_students"))
		 			$state.go('.',{module_id: module.id})
		 		else if($state.includes("course.module.inclass") || $state.includes("course.inclass")){
		 			$state.go('course.module.inclass',{module_id: module.id})
		 		}
		 		else
		    		$state.go('course.module.course_editor.overview',{module_id: module.id})
		    	scope.currentmodule = module
		    	$timeout(function(){
		    		scope.scrollIntoView(module)
		    	})
		    	
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

			scope.scrollIntoView=function(module){
				console.log("scrolling")
				if($('#module_'+module.id).length){
					$('.modules_container').scrollToThis('#module_'+module.id, {offsetTop: $('.modules_container').offset().top, duration: 400});
				}
		    }

		  	scope.goToCourseInfoStudent=function(){
			  	scope.currentmodule = null
			  	$state.go("course.course_information")
		  	}  	
	   	}
  	}
}]).directive("timelineFilters",['$rootScope', '$log', 'TimelineFilter', function($rootScope, $log, TimelineFilter){
    return{
        restrict: "E",
        scope: {},
        template: '<i class="timeline-settings" id="timeline_settings_btn" pop-over="popover_options"></i>',
        link:function(scope){
            scope.initFilters=function(){
                scope.timeline_filter= TimelineFilter
            }

            scope.exportNotes=function(){
                $rootScope.$broadcast("export_notes")
            }

            scope.updateLectureFilter=function(type){
                scope.timeline_filter.toggle(type)
            }

            var template ='<ul ng-init="initFilters()" class="no-margin">'+
                            '<li>'+
                                '<div class="looks-like-a-link lighter-grey dark-text with-small-padding-left with-small-padding-right" ng-click="updateLectureFilter(\'note\')">'+
                                    '<input id="showNotesCheckbox" class="with-tiny-margin-right" type="checkbox" ng-checked="timeline_filter.get(\'note\')" />'+
                                    '<span style="font-size:12px" translate>course_settings.show_notes</span>'+
                                '</div>'+
                            '</li>'+
                            '<li>'+
                                '<div class="looks-like-a-link lighter-grey dark-text with-small-padding-left with-small-padding-right" ng-click="updateLectureFilter(\'discussion\')">'+
                                    '<input id="showQuestionsCheckbox" class="with-tiny-margin-right" type="checkbox" ng-checked="timeline_filter.get(\'discussion\')" />'+
                                    '<span style="font-size:12px" translate>course_settings.show_discussion</span>'+
                                '</div>'+
                            '</li>'+
                            '<li>'+
                                '<div class="looks-like-a-link lighter-grey dark-text with-small-padding-left with-small-padding-right" ng-click="updateLectureFilter(\'quiz\')">'+
                                    '<input id="showQuizzesCheckbox" class="with-tiny-margin-right" type="checkbox" ng-checked="timeline_filter.get(\'quiz\')" />'+
                                    '<span style="font-size:12px" translate>course_settings.show_quizzes</span>'+
                                '</div>'+
                            '</li>'+
                            '<li>'+
                                '<div class="looks-like-a-link lighter-grey dark-text with-small-padding-left with-small-padding-right" ng-click="updateLectureFilter(\'confused\')">'+
                                    '<input id="showConfusedCheckbox" class="with-tiny-margin-right" type="checkbox" ng-checked="timeline_filter.get(\'confused\')" />'+
                                    '<span style="font-size:12px" translate>course_settings.show_confused</span>'+
                                '</div>'+
                            '</li>'+
                            '<li>'+
                                '<a class="looks-like-a-link lighter-grey dark-text with-small-padding-left with-small-padding-right" ng-click="exportNotes()">'+
                                    '<span style="font-size:12px" translate>course_settings.download_notes</span>'+
                                '</a>'+
                            '</li>'+
                        '</ul>'

            scope.popover_options={
                content: template,
                html:true,
                placement:"left"
            }
        }
    };
}])