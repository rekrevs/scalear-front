'use strict';

angular.module('scalearAngularApp')
    .controller('moduleMiddleCtrl', function ($scope, $state, Module, Documents) {

    	$scope.add_document=function(){
    		console.log($scope.module.id)
    		$scope.showLoading=true
    		Module.new_document({module_id:$scope.module.id},
    			{},
    			function(doc){
    				console.log(doc)
    				$scope.module.documents.push(doc)
    				$scope.showLoading=false
    			}, 
    			function(){
    				alert("Failed to add document, please check your internet connection")
    			}
			);
    	}

    	$scope.remove_document=function (index) {
    		if(confirm("Are you sure you want to delete module?")){
	    		Documents.destroy(
					{document_id: $scope.module.documents[index].id},
					function(){
						$scope.module.documents.splice(index, 1)
					}, 
					function(){
						alert("Failed to delete document, please check your internet connection")
					}
				);
	    	}
    	}

    	$scope.update_document=function(index){
    		console.log("blurr")
    		Documents.update(
    			{document_id: $scope.module.documents[index].id},
    			{"document":{
    				url: $scope.module.documents[index].url,
    				name: $scope.module.documents[index].name
    				}
    			},
    			function(resp){
    				console.log(resp)
    			},
    			function(){
    				alert("Failed to update document information, please check your internet connection")
    			}
			);
    	}
    });