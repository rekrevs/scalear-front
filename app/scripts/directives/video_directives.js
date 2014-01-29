'use strict';

angular.module('scalearAngularApp')
	.directive('ourVideo',['$rootScope','$log','$sce',function($rootScope,$log,$sce){
		return {
			restrict: 'E',
			replace:true, 
			scope:{
				url:'=',
			},
            templateUrl: "/views/video.html",
			link: function(scope, element){
                    scope.$watch("url", function(){
                        console.log(scope.url);
                        if(scope.url)
                        {
                           // scope.videoUrl = $sce.trustAsResourceUrl(scope.url);
                            var player = Popcorn.smart("#youtube", scope.url);
                            console.log(player);



                            player.on("loadeddata",
                                function(){
                                    //player_controls.replay()
                                    console.log(player.duration());
                                });
                        }

                    });




		    }
		};
}]);

