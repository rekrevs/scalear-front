'use strict';

angular.module('scalearAngularApp')
    .controller('moduleDetailsCtrl', ['$scope', '$state', 'Module', 'Documents', 'module','$q', function ($scope, $state, Module, Documents, module, $q) {
      $scope.module=module.data


	  $scope.validateModule = function(column,data) {
	    var d = $q.defer();
	    var group={}
	    group[column]=data;
	    Module.validateModule(
	    	{module_id:$scope.module.id},
	    	group,
	    	function(data){
				d.resolve()
			},function(data){
				console.log(data.status);
				console.log(data);
			if(data.status==422)
			 	d.resolve(data.data[column].join());
			else
				d.reject('Server Error');
			}
	    )
	    return d.promise;
    };
    
      $scope.updateModule=function(){
        console.log("module update")
        var modified_module=angular.copy($scope.module);
        delete modified_module["id"];
        delete modified_module["documents"];
        delete modified_module["created_at"];
        delete modified_module["updated_at"];
        delete modified_module["total_time"];
        delete modified_module["total_questions"];
        delete modified_module["total_quiz_questions"];
        Module.update(
          {module_id: $scope.module.id},
          {group: modified_module},
          function(response){
            console.log(response)
            $scope.$emit('detailsUpdate')
          },
          function(){
            alert("Failed to update module, please check your internet connection")
          }
        );
      }
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