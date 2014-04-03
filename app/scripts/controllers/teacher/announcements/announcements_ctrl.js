'use strict';

angular.module('scalearAngularApp')
  .controller('announcementsCtrl',['$scope', 'Announcement','$stateParams','$translate', '$log','$window','Page',  function ($scope, Announcement, $stateParams, $translate ,$log, $window,Page) {
  	
    $log.debug("in announcements");

    $window.scrollTo(0, 0);
    Page.setTitle('head.announcements')
  	$scope.disable_new = false;
  	var init = function()
  	{
  		Announcement.index({course_id: $stateParams.course_id},
  			function(data){
  				$scope.announcements=data;
          $scope.show_button = true
  			}
  		)
  	}

  	$scope.deleteAnnouncement=function(index){
  		//if(confirm($translate('announcement_form.confirm_delete'))){
  		if($scope.announcements[index].id){
	  		Announcement.destroy(
          {course_id: $stateParams.course_id, announcement_id: $scope.announcements[index].id},
          {},
          function(){
  			      $scope.announcements.splice(index, 1)
              $scope.disable_new = false;
          })
	  	}else
	  		$scope.announcements.splice(index, 1);
            $scope.disable_new = false;
      //  }
  	}
  	
  	$scope.createAnnouncement= function(){
        $scope.disable_new = true;
        for(var element in $scope.announcements)
  		{
  			if($scope.announcements[element].show==true)
  				$scope.hideAnnouncement(element);
  		}
  		$scope.newAnnouncement= {announcement:"", created_at: new Date(), show:true};
      if(!($scope.announcements instanceof Array)){
          $scope.announcements = []
      }
          
		  $scope.announcements.push($scope.newAnnouncement);
  	}
  	$scope.hideAnnouncement = function(index){ //get old data.
        $scope.disable_new = false;
        $scope.saving = false;
        $scope.announcements[index].show=false
  		if($scope.announcements[index].id){
  		Announcement.show({course_id: $stateParams.course_id,announcement_id:$scope.announcements[index].id },
  			function(data){
                $log.debug("announcements data=");
  				$log.debug(data);
  				$scope.announcements[index]=data;
  			}
  		);
  		}else{
//  			$scope.announcements[index]={announcement:"", created_at: new Date(), show:false};
            $scope.announcements.splice(index, 1);
  		}
  	}
  	$scope.showAnnouncement = function(index){
        for(var element in $scope.announcements)
  		{
  			if($scope.announcements[element].show==true)
  				$scope.hideAnnouncement(element);
  		}
        $scope.disable_new = true;
        $scope.announcements[index].show=true;
  		$scope.announcements[index].overclass='';
  	};
  	$scope.saveAnnouncement = function(index){
      $scope.saving= true
      var tmp = document.createElement("DIV")
      tmp.innerHTML = $scope.announcements[index].announcement
      var inner_text =  tmp.textContent || tmp.innerText || ""
      inner_text = inner_text.replace(/\s/g,'')
      if(!inner_text.length)
         $scope.announcements[index].announcement = inner_text
  		if(!$scope.announcements[index].id) // create new one
  		{
  		  Announcement.create(
          {course_id: $stateParams.course_id},
          {announcement:{announcement:$scope.announcements[index].announcement}},
          function(data){
            $scope.announcements[index]=data.announcement;
            $scope.disable_new = false;
            $scope.saving = false;
  		    },
          function(response){
      			$scope.announcements[index].errors=response.data.errors
            $scope.saving = false;
      		}
        )
  		}
      else{
    		Announcement.update(
          {course_id: $stateParams.course_id,announcement_id:$scope.announcements[index].id},
          {announcement:{announcement:$scope.announcements[index].announcement}},
          function(data){
      			$scope.announcements[index]=data.announcement;
      			$scope.disable_new = false;
            $scope.saving = false;
      		},
          function(response){
      			$scope.announcements[index].errors=response.data.errors
            $scope.saving = false;
      		}
        )
  		}
  	};
  	
     $scope.$watch('current_lang', function(newval, oldval){

         if(newval!=oldval)
             for(var elem in $scope.announcements)
             {
                 delete $scope.announcements[elem].errors
             }


     });

    init();
  }]);
