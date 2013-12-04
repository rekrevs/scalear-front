'use strict';

angular.module('scalearAngularApp')
    .controller('moduleMiddleCtrl', ['$scope', '$state', 'Module', 'Document', 'module' ,function ($scope, $state, Module, Document, module) {
        $scope.module=module.data

    	$scope.addDocument=function(){
    		console.log($scope.module.id)
    		$scope.document_loading=true
    		Module.newDocument({module_id:$scope.module.id},
    			{},
    			function(doc){
    				console.log(doc)
    				$scope.module.documents.push(doc)
    				$scope.document_loading=false
    			}, 
    			function(){
    				alert("Failed to add document, please check your internet connection")
    			}
			);
    	}

    	$scope.removeDocument=function (index) {
    		if(confirm("Are you sure you want to delete module?")){
	    		Document.destroy(
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

    	$scope.updateDocument=function(index){
    		console.log($scope.module.documents[index])
    		Document.update(
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
    }]);