'use strict';

angular.module('scalearAngularApp')
  .controller('ltiCourseListCtrl', ['$rootScope', '$scope', 'Lti', '$state', '$window','$location','Page','$stateParams', 'User', '$translate', function($rootScope, $scope, Lti, $state, $window,$location, Page, $stateParams , User , $translate) {
    
    $scope.return_url = $stateParams.return_url
    $scope.full_name = $stateParams.full_name
    $scope.email = $stateParams.email
    $scope.first_name = $stateParams.first_name
    $scope.last_name = $stateParams.last_name
    $rootScope.subheader_message = $translate.instant("global.courses_list")

    $window.scrollTo(0, 0);
    Page.setTitle('navigation.lti_course_list')
    var  a = $location.absUrl()
    $scope.create_new_account = false

    // if(a.indexOf('3000')){
    //   $window.location.href =  a.replace("3000", "9000");
    // }

    User.getCurrentUser()
      .$promise
      .then(function(data) {
        if (data.user == 'null') {
          // SHOW NEW 
          $scope.create_new_account = true
          console.log("CREATE NEW ACCOUNT")
        }
        else{
          Lti.embedCourseList({ })
            .$promise
            .then(function(data) {
              console.log(data.courses)
              $scope.courses = data.courses
            })
        }
      })

    $scope.embed = function(type, type_id , event, type_name) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }
        var sl_url = location.protocol+"//"+location.host+"/en/lti/lti_launch_use?sl_type_id="+type_id+"%26sl_type="+type  
        // sl_url =  sl_url.replace("9000", "3000");
        var redirect_link = $scope.return_url+"?return_type=lti_launch_url&"+
          "url="+ sl_url+"&"+"text="+type_name +"&"+"title="+type_name
        window.location.href= redirect_link
    }

    $scope.join = function() {
      var url = $location.absUrl().split('lti')[0] + 'users/login'
      // var url = $location.absUrl().split('lti')[0] + 'users/signup?mail='+$scope.email+'&givenName='+$scope.first_name+'&sn='+$scope.last_name
      window.open(url,'_blank');
    }    

  }]);
