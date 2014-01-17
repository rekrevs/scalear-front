'use strict';

angular.module('scalearAngularApp')
.factory('ServerInterceptor', ['$rootScope','$q','$timeout','$interval','ErrorHandler','$injector','scalear_api','headers','$log','$translate', function($rootScope,$q, $timeout, $interval, ErrorHandler, $injector, scalear_api, headers, $log ,$translate) { //server and also front end requests (requesting partials and so on..)
  return {
    // optional method
    'request': function(config) {
      	// successful request
        // change language to current language

        var regex = new RegExp(scalear_api.host + "(\/en\/|\/sv\/)");
        config.url = config.url.replace(regex, scalear_api.host+"/"+$translate.uses()+"/");
        //
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
        console.log(response);
        console.log("headers are");
        console.log(response.headers());
      var re= new RegExp("^"+scalear_api.host)
      if($rootScope.server_error==true && response.config.url.search(re)!=-1) // if response coming from server, and connection was bad
      {
        if (angular.isDefined($rootScope.stop)) {
          $interval.cancel($rootScope.stop);
          $rootScope.stop = undefined;
        }
      	$rootScope.show_alert="success";
      	ErrorHandler.showMessage("Connected", 'errorMessage', 2000);
        $rootScope.stop = $interval(function(){
              $rootScope.server_error = false;
              $rootScope.show_alert="";
          }, 4000, 1);
      }
      
      if(response.data.notice && response.config.url.search(re)!=-1)
      {
        if (angular.isDefined($rootScope.stop)) {
          $interval.cancel($rootScope.stop);
          $rootScope.stop = undefined;
        }
      	$rootScope.show_alert="success";
      	ErrorHandler.showMessage(response.data.notice, 'errorMessage');
      	$rootScope.stop = $interval(function(){
      		$rootScope.show_alert="";
      	}, 4000, 1);
      }
      else if(response.headers()["x-flash-notice"] || response.headers()["x-flash-message"] && response.config.url.search(re)!=-1)
      {
          if (angular.isDefined($rootScope.stop)) {
              $interval.cancel($rootScope.stop);
              $rootScope.stop = undefined;
          }
          $rootScope.show_alert="success";
          ErrorHandler.showMessage(response.headers()["x-flash-notice"] || response.headers()["x-flash-message"], 'errorMessage');
          $rootScope.stop = $interval(function(){
              $rootScope.show_alert="";
          }, 4000, 1);
      }
     
      return response || $q.when(response);
    },
 
    // optional method
   'responseError': function(rejection) {
      // do something on error
      $log.debug(rejection);

       if(rejection.headers()["x-flash-error"] || rejection.headers()["x-flash-warning"] && rejection.config.url.search(re)!=-1)
       {

           if (angular.isDefined($rootScope.stop)) {
               $interval.cancel($rootScope.stop);
               $rootScope.stop = undefined;
           }
           $rootScope.show_alert="error";
           ErrorHandler.showMessage(rejection.headers()["x-flash-error"] || rejection.headers()["x-flash-warning"], 'errorMessage');
           $rootScope.stop = $interval(function(){
               $rootScope.show_alert="";
           }, 4000, 1);
       }

      if(rejection.status==400 && rejection.config.url.search(re)!=-1) 
      {
        if (angular.isDefined($rootScope.stop)) {
          $interval.cancel($rootScope.stop);
          $rootScope.stop = undefined;
        }
      	$rootScope.show_alert="error";
      	ErrorHandler.showMessage('Error ' + ': ' + rejection.data["errors"], 'errorMessage', 8000);
        $rootScope.stop = $interval(function(){
            $rootScope.show_alert="";
        }, 4000, 1);
      }
      
      if(rejection.status==404 && rejection.config.url.search(re)!=-1) 
      {
      	$log.debug("rootscope is ");
      	$log.debug($rootScope);
      	 var $state = $injector.get('$state'); //test connection every 10 seconds.
      	if($rootScope.current_user.roles[0].id==2)// student
      		$state.go("student_courses") //check
      	else if($rootScope.current_user.roles[0].id==1 || $rootScope.current_user.roles[0].id==5)// teacher
      		$state.go("course_list") //check
      	else
      		$state.go("login") //check


      	if (angular.isDefined($rootScope.stop)) {
          $interval.cancel($rootScope.stop);
          $rootScope.stop = undefined;
        }	
      	$rootScope.show_alert="error";
      	ErrorHandler.showMessage('Error ' + ': ' + rejection.data["errors"], 'errorMessage', 8000);
        $rootScope.stop =$interval(function(){
            $rootScope.show_alert="";
        }, 4000, 1);
      }
      
      if(rejection.status==403 && rejection.config.url.search(re)!=-1) 
      {
      	 var $state = $injector.get('$state'); //test connection every 10 seconds.
      	if($rootScope.current_user.roles[0].id==2)// student
      		$state.go("student_courses") //check
      	else if($rootScope.current_user.roles[0].id==1 || $rootScope.current_user.roles[0].id==5)// teacher
      		$state.go("course_list") //check
      	else
      		$state.go("login") //check
      	
      	if (angular.isDefined($rootScope.stop)) {
          $interval.cancel($rootScope.stop);
          $rootScope.stop = undefined;
        }
      	$rootScope.show_alert="error";
      	ErrorHandler.showMessage('Error ' + ': ' + rejection.data, 'errorMessage', 8000);
          $rootScope.stop =$interval(function(){
              $rootScope.show_alert="";
          }, 4000, 1);
      	
      	
      	
      }
      
      if(rejection.status==401 && rejection.config.url.search(re)!=-1)
      {
      	 var $state = $injector.get('$state'); //test connection every 10 seconds.
      	$state.go("login")
      	if (angular.isDefined($rootScope.stop)) {
          $interval.cancel($rootScope.stop);
          $rootScope.stop = undefined;
        }
      	$rootScope.show_alert="error";
        console.log(rejection.data);
      	ErrorHandler.showMessage('Error ' + ': ' + rejection.data.error, 'errorMessage', 8000);
          $rootScope.stop =$interval(function(){
              $rootScope.show_alert="";
          }, 4000, 1);
      	
      	
      }
      var re= new RegExp("^"+scalear_api.host)
      if(rejection.status==0 && rejection.config.url.search(re)!=-1 && $rootScope.unload!=true) //host not reachable
      {
      	
      	if($rootScope.server_error!=true)
      	{
      	$rootScope.server_error=true;
      	$rootScope.show_alert="error";
      	
      	if(rejection.data=="")      	
      		ErrorHandler.showMessage('Error ' + rejection.status + ': ' + $translate('cant_connect_to_server'), 'errorMessage', 8000);
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