'use strict';

angular.module('scalearAngularApp')
.directive('popOver',['$parse','$compile','$q','$window','$log','$timeout',function ($parse, $compile, $q, $window, $log, $timeout) {
    return{
  		restrict: 'A',
  		link: function(scope, element, attr, ctrl) {
	        var getter = $parse(attr.popOver)
	        scope.$watch(attr.popOver, function(newval){
	        	var options = getter(scope)
	        	if(options){
		        	element.popover('destroy');
		        	element.popover(options);
		          	var popover = element.data('popover');
			        if(options.content){
		      			if(attr.unique){
			            	element.on('show', function(){
			              		$('.popover.in').each(function(){
			                		var $this = $(this)
			                		var popover = $this.data('popover');
			                		if (popover && !popover.$element.is(element)) {
			                  			$this.popover('hide');		                  			
			                		}
		              			});
			              	});	              			
			          	}

			          	if(attr.highlight){
			          		element.on('show', function(){
				          		element.find('.video_link').select();
				          	});
			          	}

			          	
			          	popover.getPosition = function(){
				            var pop = $.fn.popover.Constructor.prototype.getPosition.apply(this, arguments);
				            $compile(this.$tip)(scope);
				            scope.$digest();
				            this.$tip.data('popover', this);
				            if(options.displayontop){
				            	angular.element('.popover').css('z-index', '999999');
				            }
				            if(options.topcut)
				            	adjustTop(pop)
			
				            return pop;
			          	};
			          	var adjustTop=function(pop){
			          		$log.debug("topcut")
				            var win = angular.element($window)
				            var arrow = angular.element(".arrow")
							var elem_top= element.offset().top
							$log.debug(elem_top)
							var arrow_pos
							if(elem_top<225){ //too close to top
								$log.debug(angular.element('.popover').parent().position())
								arrow_pos = angular.element('.popover').parent().position().top + pop.height 
						 		arrow.css("top",arrow_pos+'px');
								pop.top = angular.element('.popover').height() - (angular.element('.popover').height()/4) +pop.height 
							}
			          	}

			          	if(options.instant_show){
			          		if ("mouseover"==options.instant_show ){
				          		$timeout(function(){
				          			element.trigger("mouseover")	 
				          		})
				          	}
			          		else{
				          		$timeout(function(){
				          			element.trigger("click")	 
				          		})			     
				          	}
			          		
			          		options.instant_show =false
			          	}

			          	$(document).on("click", function (e) {
						    var target = $(e.target)
						    var inPopover = target.closest('.popover').length > 0
						    var isElem = target.is(element)
						    if (!inPopover && !isElem)
						    	element.popover('hide');
						});	     
			        }
			    }
		    })
      	}
    };
}]);