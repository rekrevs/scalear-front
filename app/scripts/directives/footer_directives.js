'use strict';

angular.module('scalearAngularApp')
.directive('scalearFooter', function() {
	return{
		restrict: 'E',
		template:'<div class="row"><div class="span12" >'+
                    '<center>'+ 
                        '&copy;2013 ScalableLearning | '+ 
                        '<span translate="footer.about"></span> | '+ 
                        '<a ui-sref="privacy" translate="footer.privacy"></a> '+
                        '<report_technical ng-show="current_user"/>'+                             
                    '</center>'+
                '</div>'
	};
})
.directive('reportTechnical', ['Home', '$location',function(Home, $location) {
	return{
		restrict: 'E',
		template:'| <a style="cursor:pointer;" ng-click="toggleTechnicalDisplay()" translate="feedback.report_technical"></a>'+
				 '<div ng-show="show_technical">'+
					'<textarea rows="3" cols="10" style="width:400px;" ng-model="technical_data"></textarea><br />'+
					'<a style="cursor:pointer;" ng-click="send_technical()" translate="feedback.send"></a>'+
					'<loading size="small" show="sending_technical"/>'+ 
				 '</div>',
		link: function(scope, element){
			scope.show_technical = false
			scope.toggleTechnicalDisplay=function(){
				console.log("hello")
				scope.show_technical= !scope.show_technical
			}
			scope.send_technical = function(){
		  		console.log("in sending");
		  		scope.sending_technical=true;
		  		Home.technicalProblem(
		  			{
		  				url:$location.url(), 
		  				problem:scope.technical_data, 
		  				lang: scope.current_lang
		  			},
		  			function(data){
			  			scope.technical_data="";
			  			scope.sending_technical=false;
			  			scope.show_technical=false;
			  		}
		  		);
		  	};
		}
	};
}])