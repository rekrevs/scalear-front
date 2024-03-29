'use strict';

angular.module('scalearAngularApp')
  .controller('ltiCourseListCtrl', ['$rootScope', '$scope', 'Lti', '$state', '$window','$location','Page','$stateParams', 'UserSession', '$translate', 'Token', function($rootScope, $scope, Lti, $state, $window,$location, Page, $stateParams , UserSession , $translate, Token) {

    $scope.return_url = $stateParams.return_url;
    $scope.full_name = $stateParams.full_name;
    $scope.email = $stateParams.email;
    $scope.first_name = $stateParams.first_name;
    $scope.last_name = $stateParams.last_name;
    $rootScope.subheader_message = $translate.instant("global.courses_list");
    $scope.loading_lti = true;
    $scope.selected_lauch_url = false;
    $scope.create_new_account = false;
    $scope.no_common_courses = false;
    $scope.selected_resource = false;

    $window.scrollTo(0, 0);
    Page.setTitle("lti.lti");
    
    $scope.location_state = $location.path().split('/').pop();
    if ($scope.location_state === "lti_course_list" && $stateParams.return_url === "lti_tool_redirect"){
      $scope.location_state = "lti_tool_redirect";
    } 
    if($state.params["access-token"]){
      Token.setToken($state.params);
    }

    UserSession.getCurrentUser()
      .then(function(data) {
        if (data.user === "null") {
          $scope.create_new_account = true;
          $scope.loading_lti = false;
        }
        else{
          Lti.embedCourseList({
            consumer_key: $stateParams.consumer_key
          })
          .$promise
          .then(function(data) {
            $scope.no_common_courses = ( data.courses_common === 0 )
            $scope.loading_lti = false;
            $scope.courses = data.courses;
          })
        }
      })

    $scope.embed = function(type, type_id , event, type_name) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }
        var sl_url = location.protocol+"//"+location.host+"/en/lti/lti_launch_use?sl_type_id="+type_id+"&sl_type="+type ;
        var redirect_link = $scope.return_url+"?return_type=lti_launch_url&"+
          "url="+ sl_url+"&"+"text="+type_name +"&"+"title="+type_name;
        window.location.href= redirect_link;
    }

    $scope.join = function() {
      var url = $location.absUrl().split("lti")[0] + "users/signup?mail="+$scope.email+"&givenName="+$scope.first_name+"&sn="+$scope.last_name;
      window.open(url,"_blank");
    }

    $scope.choose_item = function(type, type_id , event, type_name){
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      $scope.selected_lauch_url = true;
      $scope.sl_url = location.protocol+"//"+location.host+"/en/lti/lti_launch_use?sl_type_id="+type_id+"&sl_type="+type;
    }

    $scope.lti_tool_redirect = function(type, type_id , event, type_name){
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }      
      Lti.ltiToolRedirectSaveData({
        consumer_key: $stateParams.consumer_key,
        resource_context_id: $stateParams.resource_context_id,
        type: type,
        type_id: type_id
      })
      .$promise
      .then(function(data) {
        $scope.selected_resource = true;
      })
      
    }

  }]);
