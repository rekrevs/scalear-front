'use strict';

angular.module('scalearAngularApp')
.factory('ServerInterceptor', ['$rootScope','$q','$timeout','ErrorHandler','$injector','scalear_api','headers', function($rootScope,$q, $timeout, ErrorHandler, $injector, scalear_api, headers) { //server and also front end requests (requesting partials and so on..)
  return {
    // optional method
    'request': function(config) {
      	// successful request
      	return config || $q.when(config);
    },
 
    // optional method
   'requestError': function(rejection) {
      // do something on error
      if (canRecover(rejection)) {
        return responseOrNewPromise
      }
      return $q.reject(rejection);
    },
 
 
 
    // optional method
    'response': function(response) {
      // do something on success
      var re= new RegExp("^"+scalear_api.host)
      if($rootScope.server_error==true && response.config.url.search(re)!=-1) // if response coming from server, and connection was bad
      {
      	$rootScope.show_alert="success";
      	ErrorHandler.showMessage("Connected", 'errorMessage', 2000);
      	$timeout(function(){
      		$rootScope.server_error=false;
      		$rootScope.show_alert="";	
      	},4000);
      }
     
      return response || $q.when(response);
    },
 
    // optional method
   'responseError': function(rejection) {
      // do something on error
      
      
      if(rejection.status==403) 
      {
      	 var $state = $injector.get('$state'); //test connection every 10 seconds.
      	if($rootScope.current_user.roles[0].id==2)// student
      		$state.go("student_courses") //check
      	else if($rootScope.current_user.roles[0].id==1 || $rootScope.current_user.roles[0].id==5)// teacher
      		$state.go("course_list") //check
      	else
      		$state.go("login") //check
      	
      	
      	$rootScope.show_alert="error";
      	ErrorHandler.showMessage('Error ' + ': ' + rejection.data, 'errorMessage', 8000);
      	$timeout(function(){
      		$rootScope.show_alert="";	
      	},4000);
      	
      	
      	
      }
      
      if(rejection.status==401)
      {
      	 var $state = $injector.get('$state'); //test connection every 10 seconds.
      	$state.go("login")
      	
      	$rootScope.show_alert="error";
      	ErrorHandler.showMessage('Error ' + ': ' + rejection.data, 'errorMessage', 8000);
      	$timeout(function(){
      		$rootScope.show_alert="";	
      	},4000);
      	
      	
      }
      if(rejection.status==0) //host not reachable
      {
      	
      	if($rootScope.server_error!=true)
      	{
      	$rootScope.server_error=true;
      	$rootScope.show_alert="error";
      	
      	if(rejection.data=="")      	
      		ErrorHandler.showMessage('Error ' + rejection.status + ': ' + "Cannot connect to server", 'errorMessage', 8000);
      	else
      		ErrorHandler.showMessage('Error ' + ': ' + rejection.data, 'errorMessage', 8000);
      	}
      	
     	  var $http = $injector.get('$http'); //test connection every 10 seconds.
         $timeout(function(){
                 return $http({method: 'GET', headers:headers, url: scalear_api.host+'/en/home/test'})
         },10000);
         
      		
      }
    
      	return $q.reject(rejection);
   
    }
  }
}]);