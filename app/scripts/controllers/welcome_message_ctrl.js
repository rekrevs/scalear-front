/* istanbul ignore next */ 
angular.module('scalearAngularApp')
  .controller('welcomeMessageCtrl', ['$scope', 'Kpi', 'Page', '$rootScope', '$translate', '$modal', '$q', 'ScalearUtils', 'UserSession','User','ErrorHandler', function($scope, Kpi, Page, $rootScope, $translate, $modal, $q, ScalearUtils, UserSession, User,ErrorHandler) {

    Page.setTitle('navigation.welcome_message');
    $rootScope.subheader_message = $translate.instant("navigation.welcome_message") 
    
    $scope.loading = true
    getWelcomeMessage()

    function getWelcomeMessage() {
      UserSession.getCurrentUser()
        .then(function(user) {
          $scope.user = user
          User.getWelcomeMessage({ id: $scope.user.id },
            function(data) {
              $scope.loading = false  
              $scope.welcome_message = data.welcome_message
              $scope.domain = data.domain
            })
        })
    }


    $scope.submitWelcomeMessage = function() {
      User.submitWelcomeMessage({
          id: $scope.user.id ,
        },{
          welcome_message: $scope.welcome_message,
        },
        function(data) {
          ErrorHandler.showMessage($translate.instant('error_message.welcome_message_updated'), 'errorMessage', 4000, "success");          
        }
      )
    }
  }]);