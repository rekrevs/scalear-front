'use strict';

angular.module('scalearAngularApp')
    .controller('moduleDetailsCtrl', ['$scope', '$state', 'Module', 'Documents', 'module', function ($scope, $state, Module, Documents, module) {
      $scope.module=module.data
    }]);



/*$(function (){
  $('.date_picker').datepicker();
  //$('textarea').css({"max-width": $('textarea').parent().css("width"),"max-height": $('textarea').parent().css("height")});  
  $('form.edit_group').submit(function(){
    if(validateCharLimit(this, 'input', 100) && validateCharLimit(this, 'textarea', 2000))
			{
				$(this).children("#details_group_btn").attr("disabled","disabled");
				return true;
			}else{
			return false;
			}
  });
});*/