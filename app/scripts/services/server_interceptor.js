'use strict';

angular.module('scalearAngularApp')
  .factory('ServerInterceptor', ['$rootScope', '$q', '$timeout', '$interval', 'ErrorHandler', '$injector', 'scalear_api', 'headers', '$log', '$translate', '$cookieStore', '$location', 'URLInformation', function($rootScope, $q, $timeout, $interval, ErrorHandler, $injector, scalear_api, headers, $log, $translate, $cookieStore, $location, URLInformation) {
   //server and also front end requests (requesting partials and so on..)

    return {
      // optional method
      'request': function(config) {
        // successful request
        // change language to current language
        var regex = new RegExp(scalear_api.host + "(\/en\/|\/sv\/)");
        config.url = config.url.replace(regex, scalear_api.host + "/" + $translate.use() + "/");
        return config || $q.when(config);
      },

      // optional method
      'requestError': function(rejection) {
        // do something on error
        if(canRecover(rejection)) {
          return responseOrNewPromise
        }
        return $q.reject(rejection);
      },

      // optional method
      'response': function(response) {
        // do something on success
        var re = new RegExp("^" + scalear_api.host)
        if($rootScope.server_error == true && response.config.url.search(re) != -1) // if response coming from server, and connection was bad
        {
          if(angular.isDefined($rootScope.stop)) {
            $interval.cancel($rootScope.stop);
            $rootScope.stop = undefined;
          }
          ErrorHandler.showMessage($translate.instant("error_message.connected"), 'errorMessage', 4000, "success");
        }

        // if (response.data.notice && response.config.url.search(re) != -1) {
        //     if (angular.isDefined($rootScope.stop)) {
        //         $interval.cancel($rootScope.stop);
        //         $rootScope.stop = undefined;
        //     }
        //     $rootScope.show_alert = "success";
        //     ErrorHandler.showMessage(response.data.notice, 'errorMessage');
        //     $rootScope.stop = $interval(function() {
        //         $rootScope.show_alert = "";
        //     }, 4000, 1);
        // } else if (response.headers()["x-flash-notice"] || response.headers()["x-flash-message"] && response.config.url.search(re) != -1) {
        //     if (angular.isDefined($rootScope.stop)) {
        //         $interval.cancel($rootScope.stop);
        //         $rootScope.stop = undefined;
        //     }
        //     $rootScope.show_alert = "success";
        //     ErrorHandler.showMessage(response.headers()["x-flash-notice"] || response.headers()["x-flash-message"], 'errorMessage');
        //     $rootScope.stop = $interval(function() {
        //         $rootScope.show_alert = "";
        //     }, 4000, 1);
        // }

        return response || $q.when(response);
      },

      // optional method
      'responseError': function(rejection) {
        // do something on error
        $log.debug(rejection);

        if(rejection.headers()["x-flash-error"] || rejection.headers()["x-flash-warning"] && rejection.config.url.search(re) != -1) {

          if(angular.isDefined($rootScope.stop)) {
            $interval.cancel($rootScope.stop);
            $rootScope.stop = undefined;
          }
          ErrorHandler.showMessage(rejection.headers()["x-flash-error"] || rejection.headers()["x-flash-warning"], 'errorMessage', 4000, "error");
        }

        if(rejection.status == 400 && rejection.config.url.search(re) != -1) {
          if(angular.isDefined($rootScope.stop)) {
            $interval.cancel($rootScope.stop);
            $rootScope.stop = undefined;
          }
          ErrorHandler.showMessage('Error ' + ': ' + rejection.data["errors"], 'errorMessage', 4000, "error");
        }

        if(rejection.status == 404 && rejection.config.url.search(re) != -1) {
          var $state = $injector.get('$state');
          if($rootScope.current_user)
            $state.go("course_list") //check
          else
            $state.go("login") //check


          if(angular.isDefined($rootScope.stop)) {
            $interval.cancel($rootScope.stop);
            $rootScope.stop = undefined;
          }
          ErrorHandler.showMessage('Error ' + ': ' + rejection.data["errors"], 'errorMessage', 4000, "error");
        }

        if(rejection.status == 403 && rejection.config.url.search(re) != -1) {
          var $state = $injector.get('$state');
          if($rootScope.current_user)
            $state.go("course_list") //check
          else
            $state.go("login") //check

          if(angular.isDefined($rootScope.stop)) {
            $interval.cancel($rootScope.stop);
            $rootScope.stop = undefined;
          }
          ErrorHandler.showMessage('Error ' + ': ' + rejection.data["errors"], 'errorMessage', 4000, "error");
        }

        if(rejection.status == 500 && rejection.config.url.search(re) != -1) {
          var $state = $injector.get('$state');
          if($rootScope.current_user)
            $state.go("course_list") //check
          else
            $state.go("login") //check

          if(angular.isDefined($rootScope.stop)) {
            $interval.cancel($rootScope.stop);
            $rootScope.stop = undefined;
          }

          ErrorHandler.showMessage('A server error occurred. If this continues, please use the Support link in the Help menu to contact technical support.', 'errorMessage', 4000, "error");
        }

        if(rejection.status == 401 && rejection.config.url.search(re) != -1) {
          var $state = $injector.get('$state');
          if($cookieStore.get('preview_as_student')) {
            $log.debug("preview_as_student")
            $cookieStore.remove('preview_as_student')
            $cookieStore.remove('old_user_id')
            $cookieStore.remove('new_user_id')
            $cookieStore.remove('params')
            $cookieStore.remove('state')
            $rootScope.preview_as_student = false
          }
          if(angular.isDefined($rootScope.stop)) {
            $interval.cancel($rootScope.stop);
            $rootScope.stop = undefined;
          }
          ErrorHandler.showMessage('Error ' + ': ' + ((typeof rejection.data["errors"] === 'undefined') ? rejection.data['error'] : rejection.data["errors"]), 'errorMessage', 4000, "error");
          $state.go("login")
        }

        var re = new RegExp("^" + scalear_api.host)
        if(rejection.status == 0 && rejection.config.url.search(re) != -1 && $rootScope.unload != true) { //host not reachable
          if($rootScope.server_error != true) {
            $rootScope.server_error = true;

            if(rejection.data == "")
              ErrorHandler.showMessage('Error ' + rejection.status + ': ' + $translate.instant('error_message.cant_connect_to_server'), 'errorMessage', 8000, "error");
            else
              ErrorHandler.showMessage('Error ' + ': ' + rejection.data, 'errorMessage', 10000, "error");
          }

          var $http = $injector.get('$http'); //test connection every 10 seconds.
          $timeout(function() {
            return $http({
              method: 'GET',
              headers: headers,
              url: scalear_api.host + '/en/home/test'
            })
          }, 10000);
        }
        return $q.reject(rejection);
      }
    }
  }]);
