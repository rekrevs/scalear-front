'use strict';

angular.module('scalearAngularApp')
.factory('UserSession',['$rootScope','User', 'Home', '$q', '$log', '$translate', function ($rootScope, User, Home, $q, $log ,$translate) {    

  
  var x={
  	getRole : function(){
  		var deferred = $q.defer();
  		User.getCurrentUser(function(data){
   			data.user=JSON.parse(data.user);
   			$log.debug(data);
   			if(data.signed_in == true){
   				$rootScope.current_user=data.user
          if($rootScope.current_user.last_name == null){
            $rootScope.current_user.last_name = ''
          }
          $rootScope.current_user.profile_image = data.profile_image
          if($rootScope.current_user.roles[0].id!=2){ //1(teacher) or 5(admin)
            $rootScope.current_user.invitations=data.invitations
     				$rootScope.current_user.shared=data.shared
            $rootScope.current_user.accepted_shared=data.accepted_shared
            Home.getNotifications({},function(response){
                $rootScope.current_user.invitation_items=response.invitations
                $rootScope.current_user.shared_items = response.shared_items
            })
            return deferred.resolve(1)
          }
          else //student
            return deferred.resolve(2)
   				// if($rootScope.current_user.roles[0].id==2) //student
   				// 	return deferred.resolve(2)
   				// else if($rootScope.current_user.roles[0].id!=2)
   				// 	return deferred.resolve(1) //1(teacher) or 5(admin)
   			}else{ //not signed in
          $rootScope.current_user=null;
          return deferred.resolve(0)
        }   			
   		})   		
  		return deferred.promise;
  	}
  };
  return x;


}]);