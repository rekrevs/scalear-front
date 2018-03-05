'use strict';

angular.module('scalearAngularApp')
  .controller('ltiSignInTokenCtrl', ['$rootScope', '$scope', 'Lti', '$state', '$window','$location','Page','$stateParams', 'User', '$translate', 'Token', function($rootScope, $scope, Lti, $state, $window,$location, Page, $stateParams , User , $translate, Token) {

    $window.scrollTo(0, 0);
    Page.setTitle('lti.lti')


	function init(){
		$scope.loading =  true
		if( $state.params.redirect_boolean =='false' && $state.params.status == 'no_teacher_enrollment' ) {
			$scope.loading =  false
			$scope.no_teacher_enrollment = true
		}
	}
	
	init()

  }]);
