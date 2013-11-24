'use strict';

angular.module('scalearAngularApp')
.factory('UserSession',['$rootScope','User','$q', function ($rootScope, User, $q) {    

  
  var x={
  	getRole : function(){
  		var deferred = $q.defer();
  		User.getCurrentUser(function(data){
   			data.user=JSON.parse(data.user);
   			console.log(data);
   			if(data.signed_in == true)
   			{
   				$rootScope.current_user=data.user
   				if($rootScope.current_user.roles[0].id==2) //student
   					return deferred.resolve(2)
   				else if($rootScope.current_user.roles[0].id!=2)
   					return deferred.resolve(1) //1(teacher) or 5(admin)
   			}else
   				return deferred.resolve(0) //not signed in
   			
   		})
   		
  		return deferred.promise;
  	},
  	
  	    
  };
  return x;


}]);