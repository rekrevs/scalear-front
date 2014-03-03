'use strict';

angular.module('scalearAngularApp')
.factory('UserSession',['$rootScope','User','$q','$log','$translate', function ($rootScope, User, $q, $log ,$translate) {    

  
  var x={
  	getRole : function(){
  		var deferred = $q.defer();
  		User.getCurrentUser(function(data){
   			data.user=JSON.parse(data.user);
   			$log.debug(data);
   			if(data.signed_in == true)
   			{
   				$rootScope.current_user=data.user
          $rootScope.current_user.profile_image = data.profile_image

   				$rootScope.current_user.invitations=data.invitations
   				if($rootScope.current_user.roles[0].id==2) //student
   					return deferred.resolve(2)
   				else if($rootScope.current_user.roles[0].id!=2)
   					return deferred.resolve(1) //1(teacher) or 5(admin)
   			}else
            {
                $rootScope.current_user=null;
                return deferred.resolve(0) //not signed in
            }
   			
   		})
   		
  		return deferred.promise;
  	},
  	
  	    
  };
  return x;


}]);